// 16개 코드 모두에 대한 채점→코드 산출 라운드트립 + codes.json 콘텐츠 충실성 검증
// 사용: node scripts/test-16-codes-roundtrip.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const questions = JSON.parse(readFileSync(join(root, 'data/questions.json'), 'utf8'));
const indicators = JSON.parse(readFileSync(join(root, 'data/indicators.json'), 'utf8'));
const codes = JSON.parse(readFileSync(join(root, 'data/codes.json'), 'utf8'));

const LIGHT = { 1: 'M', 2: 'E', 3: 'G', 4: 'C' };
const DARK  = { 1: 'R', 2: 'H', 3: 'F', 4: 'I' };

// 각 지표를 light/dark로 만드는 응답 패턴 (raw 점수, reverse 변환 전).
// reverse 문항은 6-raw 로 채점되므로, 의도한 결과를 내기 위해 raw를 조정.
function answersFor(targetLight) {
  // targetLight: {1: true/false, 2: true/false, 3: ..., 4: ...}
  const a = {};
  for (const q of questions) {
    const wantLight = targetLight[q.indicator];
    if (q.reverse) {
      // 변환식 6-raw. light(점수↑)는 변환 5 → raw 1, dark(점수↓)는 변환 1 → raw 5.
      a[q.id] = wantLight ? 1 : 5;
    } else {
      // 변환식 raw. light는 raw 5, dark는 raw 1.
      a[q.id] = wantLight ? 5 : 1;
    }
  }
  return a;
}

function calculateResult(answers) {
  const scores = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const q of questions) {
    const raw = answers[q.id] ?? 0;
    if (raw === 0) continue;
    const value = q.reverse ? 6 - raw : raw;
    scores[q.indicator] += value;
  }
  const letters = [1, 2, 3, 4].map((i) => {
    const meta = indicators[i];
    return scores[i] >= meta.cutoff ? meta.light : meta.dark;
  });
  return { code: letters.join(''), scores };
}

const required = ['code','zone','nickname','english','tagline','coordinate','strength','shadow','wallStance','prescription'];
const MIN_LEN = 10; // 본문 텍스트 최소 길이 (한 문장 이상이어야 의미가 있음)

let fail = 0;
const rows = [];

for (let m = 0; m < 2; m++)
for (let e = 0; e < 2; e++)
for (let g = 0; g < 2; g++)
for (let c = 0; c < 2; c++) {
  const targetLight = { 1: !!m, 2: !!e, 3: !!g, 4: !!c };
  const expected =
    (m ? LIGHT[1] : DARK[1]) +
    (e ? LIGHT[2] : DARK[2]) +
    (g ? LIGHT[3] : DARK[3]) +
    (c ? LIGHT[4] : DARK[4]);
  const answers = answersFor(targetLight);
  const { code, scores } = calculateResult(answers);

  const data = codes[code];
  const issues = [];
  if (code !== expected) issues.push(`expected ${expected}, got ${code}`);
  if (!data) issues.push('codes.json 누락');
  else {
    for (const f of required) {
      const v = data[f];
      if (v === undefined || v === null) issues.push(`${f} 누락`);
      else if (typeof v === 'string') {
        const t = v.trim();
        if (!t) issues.push(`${f} 빈문자열`);
        else if (['tagline','coordinate','strength','shadow','wallStance','prescription'].includes(f) && t.length < MIN_LEN) {
          issues.push(`${f} 너무 짧음(${t.length}자)`);
        }
      }
    }
  }

  const ok = issues.length === 0;
  if (!ok) fail++;
  rows.push({ expected, got: code, scores, zone: data?.zone, ok, issues });
}

const colWidth = (s, n) => (s + ' '.repeat(n)).slice(0, n);
console.log('expect  got   scores                          zone          ok  issues');
console.log('------- ----- ------------------------------- ------------- --- ------');
for (const r of rows) {
  const sc = `[${r.scores[1]},${r.scores[2]},${r.scores[3]},${r.scores[4]}]`;
  console.log(
    `${colWidth(r.expected,7)} ${colWidth(r.got,5)} ${colWidth(sc,31)} ${colWidth(r.zone || '-',13)} ${r.ok ? ' ✓ ' : ' ✗ '} ${r.issues.join('; ')}`
  );
}

console.log(`\n총 ${rows.length}개 중 실패 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
