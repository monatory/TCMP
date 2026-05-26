// 채점 함수 검증 스크립트 (Node로 직접 실행)
// 사용: node scripts/test-scoring.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const questions = JSON.parse(readFileSync(join(root, 'data/questions.json'), 'utf8'));
const indicators = JSON.parse(readFileSync(join(root, 'data/indicators.json'), 'utf8'));
const codes = JSON.parse(readFileSync(join(root, 'data/codes.json'), 'utf8'));

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

const reverseIds = questions.filter((q) => q.reverse).map((q) => q.id);
console.log('reverse ids:', reverseIds);

const cases = [
  {
    name: 'All 5s → MEGC',
    answers: Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, 5])),
    expected: 'MEGC',
  },
  {
    name: 'Reverse=5, Normal=1 → RHFI',
    answers: (() => {
      const a = {};
      for (const q of questions) a[q.id] = q.reverse ? 5 : 1;
      return a;
    })(),
    expected: 'RHFI',
  },
  {
    name: 'Mixed → MEFC',
    answers: {
      1: 5, 2: 5, 3: 5, 4: 5,
      5: 1, 6: 1, 7: 1, 8: 1,
      9: 5, 10: 3, 11: 5, 12: 3, 13: 5, 14: 3, 15: 3, 16: 3,
      17: 1, 18: 3, 19: 3, 20: 3,
    },
    expected: 'MEFC',
  },
];

let allPass = true;
for (const c of cases) {
  const r = calculateResult(c.answers);
  const pass = r.code === c.expected;
  if (!pass) allPass = false;
  console.log(`${pass ? '✓' : '✗'} ${c.name}: got ${r.code}, scores=${JSON.stringify(r.scores)}, expected ${c.expected}`);
  if (codes[r.code]) {
    console.log(`   → ${codes[r.code].nickname} (${codes[r.code].zone})`);
  } else {
    console.log(`   !! ${r.code} 는 codes.json 에 없음`);
  }
}
process.exit(allPass ? 0 : 1);
