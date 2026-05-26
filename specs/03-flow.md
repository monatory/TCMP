# 03 · 화면 흐름

## 상태 모델

```
TcmpApp 전체 상태:
- step: 0 ~ 6 (정수)
- answers: { [questionId: number]: number }  // 1~5점

step 의미:
  0 → 인트로
  1 → 지표 1 사고 (Q1-Q4)
  2 → 지표 2 행동 (Q5-Q8)
  3 → 지표 3 위기 1/2 (Q9-Q12)
  4 → 지표 3 위기 2/2 (Q13-Q16)
  5 → 지표 4 관계 (Q17-Q20)
  6 → 결과
```

화면 전이는 `setStep(s + 1)` / `setStep(s - 1)` 으로만 발생. 라우터 사용하지 않음 (SPA 단일 페이지).

화면 전환 시 `window.scrollTo({ top: 0, behavior: 'smooth' })` 실행.

---

## 화면 0 · 인트로

### 와이어프레임 (모바일)
```
─────────────────────────────────
       ── MINDSET PROFILE ──

         터널과 동굴
         사이에서                ← Gowun Batang 32px
                                  + 'Cormorant italic' gold 강조
       TCMP · Tunnel-Cave
       Mindset Profile

   ──── 그라데이션 라인 ────       ← gold → shadow → dark

   이 진단은 당신의 우열을
   가리는 시험이 아닙니다.        ← Noto Serif KR 15px, line-height 1.85

   지금 이 순간 당신의 마음이
   '동굴의 정체' 속에 머물고      ← '동굴의 정체'는 ink 강조
   있는지, '터널의 성장 경로'
   위에 서 있는지를 비추어        ← '터널의 성장 경로'는 gold 강조
   보는 심리적 지도입니다.

      20        4        16
      문항      지표     코드       ← 세 컬럼 카운터, Cormorant

        ┌──────────────┐
        │  진단 시작하기 →  │       ← 큰 라운드 버튼, ink 배경
        └──────────────┘

     소요 시간 약 5분
     가장 솔직한 자신의 모습에 응답

─────────────────────────────────
```

### 인터랙션
- 진입 시 헤더 → 본문 → 카운터 → 버튼 순으로 stagger fade-up
- "진단 시작하기" 클릭 → `setStep(1)`
- 직전 결과가 있으면 ("직전 결과 보기" 보조 버튼 추가, getLatest()로 결과 화면으로 점프) — Phase 6에서 추가

---

## 화면 1~5 · 질문 화면

### 와이어프레임 (모바일)
```
─────────────────────────────────
01 / 05              TUNNEL · CAVE    ← 진행 카운터
━━━━━━━━━━━━━━━━━━━━              ← 1px 진행 바, 진행분만 gold

지표 1                              ← gold UPPERCASE 0.3em tracking
─ 사고와 성찰 ─                     ← Gowun Batang 28px
사유의 방향                         ← Noto Serif KR italic, gray-mid

01  나는 과거의 실패나 상처를         ← Cormorant gold + 본문 ink
    마음속에서 오래도록 곱씹는
    편이다.

    ① ② ③ ④ ⑤                  ← 원형 버튼 5개 (선택된 것은 ink 배경)
   전혀                 매우
   그렇지                그러함
   않다
  ─────────────────────────────      ← beige-light 구분선

02  나는 현재에 머물기보다,
    아직 오지 않은 미래를
    더 자주 걱정한다.

    ① ② ③ ④ ⑤
  ─────────────────────────────

03  ...

04  ...

←  이전                    다음 →   ← 좌측 ghost 버튼, 우측 primary

─────────────────────────────────
```

### 인터랙션
- 화면 진입 시 헤더 + 각 문항을 0.1s, 0.18s, 0.26s, 0.34s stagger
- "다음" 버튼: 해당 화면의 모든 문항에 응답 전까지 disabled (회색)
- "이전" 버튼: step 1에서는 disabled
- 점수 버튼 클릭 → 즉시 `setAnswers(prev => ({ ...prev, [qid]: value }))`
- "다음" 마지막 화면(step 5)에서는 텍스트가 **"결과 확인"** 으로 바뀜

### 화면별 메타데이터 (코드 내부 상수)

```js
const QUESTION_SCREENS = [
  { id: 'q1', indicator: 1, ids: [1, 2, 3, 4] },
  { id: 'q2', indicator: 2, ids: [5, 6, 7, 8] },
  { id: 'q3', indicator: 3, ids: [9, 10, 11, 12], part: '1/2' },
  { id: 'q4', indicator: 3, ids: [13, 14, 15, 16], part: '2/2' },
  { id: 'q5', indicator: 4, ids: [17, 18, 19, 20] },
];
```

지표 3은 8문항이라 `1/2`, `2/2`로 나눠 두 화면. 헤더에 작게 "1/2" 표시.

---

## 화면 6 · 결과

가장 콘텐츠가 많은 화면. 위에서 아래로 다음 순서.

### 1. 헤더
```
        ◇  YOUR COORDINATE          ← Compass 아이콘 + UPPERCASE 라벨

         M  E  G  C                  ← Cormorant Garamond italic
                                       72~96px, ink, tracking 0.15em
                                       글자별 0.15s stagger 페이드인

      ──  빛의 영역 · Light  ──      ← 영역 배지 (해당 영역 색상)

       주도적 터널 개척자             ← Gowun Batang 24~30px
       The Pioneer                   ← Cormorant italic gray-mid
```

### 2. 한 줄 정의 (tagline)
```
   ┃ 사고·행동·해석·관계의           ← border-l-2 border-gold
   ┃ 네 축 모두에서 빛을 향해           pl-5 py-2
   ┃ 곡괭이를 들고 있는 자.            Noto Serif KR italic 15px
```

### 3. 5영역 스펙트럼 지도
```
   16 코드 지도

   ●━━━━━━━━━━━━━━━━━━━━           ← 8px 높이, rounded-full
                                       gold → gray-mid → dark 그라데이션
                                       흰 원형 마커가 내 위치(0~100%)

   빛  빛에가까운  균형  어둠에가까운  어둠
```

내 영역에 따라 마커 위치:
- light → 0%
- mostlyLight → 25%
- balanced → 50%
- mostlyDark → 75%
- dark → 100%

### 4. 지표별 점수
```
   지표별 점수

   M  사고와 성찰              18 / 20
   ━━━━━━━━━━━━━━━━━━┃─        ← gold (기준선 이상이면)
                       ↑기준선 12

   E  행동과 실행              15 / 20
   ━━━━━━━━━━━━━━┃─────         ← gold

   G  위기와 성장              32 / 40
   ━━━━━━━━━━━━━━━━━━━━━┃──    ← gold
                          ↑기준선 24

   I  관계와 확장              10 / 20      ← I는 어둠형
   ━━━━━━━━━┃──────────         ← shadow (기준선 미만이면)
            ↑기준선 12
```
막대 색상: 기준선 이상이면 gold, 미만이면 shadow.

### 5~8. 콘텐츠 섹션

각 섹션은 작은 UPPERCASE 라벨 + 본문 (Noto Serif KR 15px line-height 1.85)

```
   현재 좌표        ← gray-mid UPPERCASE 라벨
   {coordinate}

   강점             ← gold UPPERCASE 라벨 (이 섹션만 accent)
   {strength}       ← line-height loose

   그림자
   {shadow}

   벽 앞에서
   {wallStance}     ← italic, gray-dark
```

### 9. 처방 카드 (가장 눈에 띄게)
```
   ┌────────────────────────────────┐ ← 상단 1px gold→transparent 그라데이션
   │                                 │
   │  오늘의 처방                    │ ← UPPERCASE cream opacity 60%
   │                                 │
   │  {prescription}                 │ ← Noto Serif KR cream 16px
   │                                 │  line-height 1.85
   └────────────────────────────────┘
        ↑ bg-ink, rounded-2xl, p-8
```

### 10. 책 인용문
```
       당신의 코드는 당신이 누구인지를
       결정하는 라벨이 아닙니다.

       당신이 지금 어디에 서 있는지를
       비추는 지도입니다.

       한 달 뒤 다시 진단해 보세요.
                                      ← italic gray-dark 14px center
```

### 11. 액션 버튼
```
   ┌───────────────────┐  ┌───────────────────┐
   │ ↻ 다시 진단하기   │  │   결과 공유하기    │
   └───────────────────┘  └───────────────────┘
     primary (ink)            ghost (border)
```

- 모바일에서는 세로 스택, sm 이상에서는 가로 정렬
- "결과 공유하기" → `navigator.share` 지원 시 호출, 없으면 clipboard 복사 + alert

### 인터랙션
- 진입 시 전체적인 페이드인
- 4글자 코드 글자별 stagger (0.1s, 0.25s, 0.4s, 0.55s)
- 5영역 마커가 0%에서 자기 위치로 700ms 부드럽게 이동
- 막대 그래프 폭이 0%에서 점수 비율로 700ms 이동

---

## 전환 애니메이션 (화면 사이)

각 화면 자체 진입 페이드업으로 충분. 화면 사이 라우터 트랜지션이나 슬라이드 효과 추가 금지(과함).

`<QuestionScreen key={step}>`처럼 key를 step에 묶어서 step 변경 시 컴포넌트가 unmount/mount되도록 → 자연스럽게 페이드업 애니메이션이 재실행됨.

---

## 에러 상태

이 앱은 외부 API가 없어 일반적인 에러 상태가 거의 없음. 다만:

- 사용자가 응답 도중 페이지를 새로고침하면 → 응답 사라짐 (의도된 동작, 별도 안내 불필요)
- localStorage 접근 실패(시크릿 모드 등) → 조용히 실패, 결과 화면은 정상 표시
- 결과 코드가 없는 경우 (절대 발생하면 안 되지만 방어 코드) → "결과를 불러올 수 없습니다. 다시 진단해 주세요." 안내 + 인트로로 돌아가는 버튼
