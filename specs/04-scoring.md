# 04 · 채점 알고리즘

## 개요

20문항 5점 척도 응답을 받아 4개 지표별 점수를 합산하고, 각 지표가 기준선 이상인지에 따라 빛(터널형) 또는 어둠(동굴형) 알파벳을 선택해 4글자 코드를 만든다.

---

## 입력 데이터

```js
answers = {
  1: 3,   // Q1에 3점 응답
  2: 2,   // Q2에 2점 응답
  3: 4,
  // ... 4 ~ 20
}
```
- key: 문항 번호 (1~20)
- value: 1~5점 (정수)
- 누락된 키는 0점으로 처리 (방어 코드)

---

## 출력 데이터

```js
{
  code: 'MEGC',                          // 4글자 문자열
  letters: ['M', 'E', 'G', 'C'],         // 글자 배열
  scores: { 1: 18, 2: 15, 3: 32, 4: 14 }, // 지표별 점수
  data: { /* codes.json의 'MEGC' 객체 */ }  // 해석 데이터
}
```

---

## 1단계 · 역채점 변환

다음 8개 문항은 동굴형 성향을 묻는 질문이므로 응답값을 역으로 변환한다.

**역채점 대상**: 1, 2, 5, 8, 9, 11, 13, 17 (총 8개)

**변환식**: `변환값 = 6 - 응답값`

| 응답 | 변환 |
|---|---|
| 1 | 5 |
| 2 | 4 |
| 3 | 3 |
| 4 | 2 |
| 5 | 1 |

`data/questions.json`의 각 문항에 `reverse: true | false` 플래그가 있어 코드에서는 이걸로 판별.

---

## 2단계 · 지표별 점수 합산

| 지표 | 문항 | 만점 | 기준선 |
|---|---|---|---|
| 1 사고와 성찰 | 1, 2, 3, 4 | 20 | 12 |
| 2 행동과 실행 | 5, 6, 7, 8 | 20 | 12 |
| 3 위기와 성장 | 9, 10, 11, 12, 13, 14, 15, 16 | 40 | 24 |
| 4 관계와 확장 | 17, 18, 19, 20 | 20 | 12 |

`data/indicators.json`에 cutoff과 max가 들어있음.

---

## 3단계 · 코드 글자 결정

각 지표 점수가 **기준선 이상이면 빛**, **미만이면 어둠**.

| 지표 | 빛(터널형) | 어둠(동굴형) |
|---|---|---|
| 1 | **M** (성찰 · Mindful) | R (반추 · Rumination) |
| 2 | **E** (실행 · Execute) | H (망설임 · Hesitation) |
| 3 | **G** (성장 · Growth) | F (고정 · Fixed) |
| 4 | **C** (연대 · Connection) | I (고립 · Isolation) |

기준선 점수와 **정확히 같으면 빛(터널형)** 으로 판정.

---

## 의사코드

```javascript
function calculateResult(answers) {
  // 1. 지표별 점수 계산
  const scores = { 1: 0, 2: 0, 3: 0, 4: 0 };

  for (const question of QUESTIONS) {
    const raw = answers[question.id] ?? 0;
    const value = question.reverse ? (6 - raw) : raw;
    // 누락된 응답(raw=0)은 reverse여도 6점이 되면 안 됨
    if (raw === 0) continue;
    scores[question.indicator] += value;
  }

  // 2. 코드 글자 결정
  const letters = [
    scores[1] >= INDICATORS[1].cutoff ? INDICATORS[1].light : INDICATORS[1].dark,
    scores[2] >= INDICATORS[2].cutoff ? INDICATORS[2].light : INDICATORS[2].dark,
    scores[3] >= INDICATORS[3].cutoff ? INDICATORS[3].light : INDICATORS[3].dark,
    scores[4] >= INDICATORS[4].cutoff ? INDICATORS[4].light : INDICATORS[4].dark,
  ];
  const code = letters.join('');

  return {
    code,
    letters,
    scores,
    data: CODES[code],
  };
}
```

---

## 영역 매핑

코드의 빛 글자 개수에 따라 5개 영역으로 분류.

```js
function getZone(letters) {
  const lightLetters = ['M', 'E', 'G', 'C'];
  const lightCount = letters.filter(l => lightLetters.includes(l)).length;

  if (lightCount === 4) return 'light';        // 빛의 영역
  if (lightCount === 3) return 'mostlyLight';  // 빛에 가까운
  if (lightCount === 2) return 'balanced';     // 균형 지대
  if (lightCount === 1) return 'mostlyDark';   // 어둠에 가까운
  return 'dark';                                // 어둠의 영역
}
```

단, `codes.json`의 각 코드 객체에 이미 `zone` 필드가 있으므로 위 함수는 사용하지 않고 `codes[code].zone` 으로 바로 참조하면 됨.

---

## 테스트 케이스

빌드 후 다음 3개 케이스로 채점 함수가 정확한지 검증.

### 케이스 1 · 완벽한 터널형 (MEGC)

모든 문항에 5점 응답:
```js
const answers = Object.fromEntries(
  Array.from({ length: 20 }, (_, i) => [i + 1, 5])
);
```

기대 결과:
- 역채점 문항(1·2·5·8·9·11·13·17): `6 - 5 = 1점`
- 일반 문항: `5점`
- 지표 1: `1 + 1 + 5 + 5 = 12` ✓ (정확히 기준선 12) → **M**
- 지표 2: `1 + 5 + 5 + 1 = 12` → **E**
- 지표 3: `1 + 5 + 1 + 5 + 1 + 5 + 5 + 5 = 28` ≥ 24 → **G**
- 지표 4: `1 + 5 + 5 + 5 = 16` ≥ 12 → **C**
- 코드: **MEGC**

### 케이스 2 · 완벽한 동굴형 (RHFI)

모든 문항에 1점 응답:
```js
const answers = Object.fromEntries(
  Array.from({ length: 20 }, (_, i) => [i + 1, 1])
);
```

기대 결과:
- 역채점 문항: `6 - 1 = 5점`
- 일반 문항: `1점`
- 지표 1: `5 + 5 + 1 + 1 = 12` ✓ (기준선 동일) → **M**!? 

⚠️ **주의**: 이 케이스는 직관과 다르게 M이 나옴. 모든 문항에 1점이라도 역채점 문항이 5점으로 바뀌어 균형이 12로 떨어지기 때문. 기준선과 같으면 빛 판정이라 M.

→ **올바른 테스트 케이스 2 재설계 (모두 동굴형이 나오게)**:

역채점 문항에는 5점, 일반 문항에는 1점:
```js
const answers = {};
for (const q of QUESTIONS) {
  answers[q.id] = q.reverse ? 5 : 1;
}
```

이러면:
- 역채점 문항: `6 - 5 = 1점`
- 일반 문항: `1점`
- 모든 지표 합산: 1점 × 4 = 4점 (지표 1·2·4) / 1점 × 8 = 8점 (지표 3)
- 모두 기준선 미만 → **RHFI**

### 케이스 3 · 혼합 (균형 지대)

```js
const answers = {
  // 지표 1: 1번에 5점(역채점→1), 2번에 5점(역채점→1), 3번에 5점, 4번에 5점
  //         → 1 + 1 + 5 + 5 = 12 ≥ 12 → M
  1: 5, 2: 5, 3: 5, 4: 5,

  // 지표 2: 5번에 1점(역채점→5), 6번에 1점, 7번에 1점, 8번에 1점(역채점→5)
  //         → 5 + 1 + 1 + 5 = 12 ≥ 12 → E
  5: 1, 6: 1, 7: 1, 8: 1,

  // 지표 3: 일부러 기준선 미달
  // 9번에 5점(역→1), 10번 3점, 11번 5점(역→1), 12번 3점,
  // 13번 5점(역→1), 14번 3점, 15번 3점, 16번 3점
  // → 1 + 3 + 1 + 3 + 1 + 3 + 3 + 3 = 18 < 24 → F
  9: 5, 10: 3, 11: 5, 12: 3, 13: 5, 14: 3, 15: 3, 16: 3,

  // 지표 4: 17번 1점(역→5), 18번 3점, 19번 3점, 20번 3점
  // → 5 + 3 + 3 + 3 = 14 ≥ 12 → C
  17: 1, 18: 3, 19: 3, 20: 3,
};
```

기대 결과: **MEFC** (조급한 행동가 · 빛에 가까운 영역)

---

## 검증용 Node 스크립트

`lib/scoring.test.js` 또는 별도 스크립트로 다음 코드를 실행해 통과 여부 확인:

```javascript
import { calculateResult } from './scoring.js';

const cases = [
  {
    name: 'All 5s',
    answers: Object.fromEntries(Array.from({length:20},(_,i)=>[i+1,5])),
    expected: 'MEGC',
  },
  {
    name: 'Reverse=5, Normal=1',
    answers: (() => {
      const a = {};
      const reverseIds = [1,2,5,8,9,11,13,17];
      for (let i = 1; i <= 20; i++) {
        a[i] = reverseIds.includes(i) ? 5 : 1;
      }
      return a;
    })(),
    expected: 'RHFI',
  },
  {
    name: 'Mixed → MEFC',
    answers: {
      1:5,2:5,3:5,4:5,
      5:1,6:1,7:1,8:1,
      9:5,10:3,11:5,12:3,13:5,14:3,15:3,16:3,
      17:1,18:3,19:3,20:3,
    },
    expected: 'MEFC',
  },
];

for (const c of cases) {
  const result = calculateResult(c.answers);
  const pass = result.code === c.expected;
  console.log(`${pass ? '✓' : '✗'} ${c.name}: got ${result.code}, expected ${c.expected}`);
}
```

세 케이스 모두 ✓ 통과해야 함.
