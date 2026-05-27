# 02 · 디자인 시스템

## 디자인 컨셉

**"한국 문예지 + 손때 묻은 종이 워크북"**

일반 MBTI 앱의 알록달록한 그라데이션·이모지 폭격을 피하고, 책을 펼쳤을 때의 차분한 호흡을 디지털로 옮긴다. 한 페이지에 하나의 메시지, 충분한 여백, 절제된 액센트.

비유: *"카페에서 잘 만든 시집을 펼쳤을 때의 첫 페이지."*

---

## 색상 토큰

실제 토큰은 `tailwind.config.js`가 single source of truth. 아래 표는 의도/용도 가이드.

| 토큰 | HEX | 용도 |
|---|---|---|
| **cream** | `#F5F1EA` | 페이지 배경 (오래된 종이) |
| **ink** | `#1A1612` | 본문 텍스트 / 어두운 카드 / 강조 버튼 |
| **gold** | `#B57C36` | 단일 액센트 (터널의 빛) — 절대 남용 금지 |
| gold-dark | `#9C7138` | 작은 골드 라벨 · 5영역 그라데이션 |
| gray-text | `#3A332B` | 본문 보조 |
| gray-dark | `#5A5249` | 메타 정보 |
| gray-mid | `#75614A` | 라벨·캡션 |
| gray-light | `#7E6B53` | 가장 옅은 텍스트 (작은 라벨에서는 gray-mid 권장) |
| beige-dark | `#C9BFAE` | 테두리 (어두운 쪽) |
| beige-mid | `#D9D2C5` | 구분선 |
| beige-light | `#E5DFD2` | 가는 구분선 |
| shadow | `#5C5246` | 5영역 그라데이션 (어둠 쪽) |
| dark | `#2E2A24` | 5영역 그라데이션 끝점 |

**색상 사용 규칙**
- 한 화면에 gold는 1~2곳만 (헤더 액센트선 + 진행 표시 / 또는 처방 카드 상단 라인)
- 그라데이션은 5영역 스펙트럼 바와 처방 카드 상단 라인에만 허용
- 다른 곳에 그라데이션·드롭섀도 추가 금지

### 접근성 노트
- 본문(`gray-text` on cream)은 AAA(11:1)
- 작은 라벨(10~12px)에서는 `gray-light`(4.53:1, AA 경계선)보다 `gray-mid`(5.23:1) 사용
- 11px 골드 라벨은 AA 미달(3.16:1). 12px font-medium + `gold-dark`(3.86:1)로 사용하거나 18px+ large text로만

---

## 타이포그래피

### 폰트 패밀리

| 역할 | 폰트 | 비고 |
|---|---|---|
| 한글 디스플레이 (제목) | **Gowun Batang** | Google Fonts |
| 한글 세리프 (인용·문학적 텍스트) | **Noto Serif KR** | Google Fonts |
| 한글 본문 (UI·읽는 텍스트) | **Pretendard** | jsdelivr CDN |
| 알파벳 코드 글자 (M·E·G·C 등) | **Cormorant Garamond** | Google Fonts, italic 사용 |
| 알파벳 라벨 (UPPERCASE) | **Pretendard** | letter-spacing 0.3em |

### Import 코드 (globals.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Gowun+Batang:wght@400;700&family=Cormorant+Garamond:wght@300;400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
```

### 사이즈 스케일 (모바일 기준)

| 용도 | 크기 | 무게 | 폰트 |
|---|---|---|---|
| 페이지 큰 제목 | 32px (sm:40px) | 400 | Gowun Batang |
| 화면 헤더 (지표명) | 24px (sm:30px) | 400 | Gowun Batang |
| 결과 코드 4글자 | 72px (sm:96px) | 400 italic | Cormorant Garamond |
| 본문 (긴 글) | 15px (sm:16px) | 400, line-height 1.8 | Noto Serif KR |
| UI 본문 | 14~15px | 400~500 | Pretendard |
| 라벨 (UPPERCASE) | 11~12px | 500, tracking 0.3em | Pretendard |
| 캡션 | 10~11px | 400 | Pretendard |

### 한글 본문 가독성 규칙
- `line-height: 1.7~1.85` 권장
- 한 줄에 25~32자 (모바일 기준 폭 자동 조정)
- 문단 사이 여백 24px 이상

---

## 간격 (Spacing)

| 토큰 | 값 |
|---|---|
| 페이지 좌우 패딩 (모바일) | 24px |
| 페이지 좌우 패딩 (데스크탑) | 0 (max-width 컨테이너) |
| 최대 콘텐츠 폭 | 640px (max-w-2xl) |
| 섹션 사이 | 32~40px |
| 카드 내부 패딩 | 28~32px |
| 문항 사이 | 28px + 하단 구분선 |

---

## 컴포넌트 스타일 규칙

### 버튼 (Primary)
- 모양: `rounded-full`
- 배경: `bg-ink`, 텍스트: `text-cream`
- hover: 배경 `bg-gold`로 전환 (300ms ease)
- 패딩: `px-7 py-3` (작은 버튼) / `px-8 py-4` (큰 버튼)
- 폰트: Noto Serif KR 14~15px

### 버튼 (Secondary / Ghost)
- 테두리만: `border border-ink`, 배경 투명
- hover: 배경이 `bg-ink`, 텍스트가 `text-cream`으로 반전

### Likert 점수 버튼 (1~5)
- 원형: `w-11 h-11 rounded-full` (WCAG 44px 최소 터치 영역)
- 폰트: Cormorant Garamond 16px
- 비선택: 테두리 `border-beige-dark`, 텍스트 `text-gray-dark`
- 선택: 배경 `bg-ink`, 텍스트 `text-cream`, scale 1.1
- hover (비선택): 테두리 `border-ink`로 어두워짐
- 양 옆 라벨: "전혀 그렇지 않다" ~ "매우 그렇다" — 12px gray-mid (모바일에서는 행 아래 양 끝, 데스크탑은 좌우)

### 인구통계 칩 (선택형)
- `inline-flex items-center justify-center min-h-[44px] px-4 rounded-full`
- 폰트: Noto Serif KR 14px
- 비선택: 테두리 `border-beige-dark`, 배경 투명
- 선택: 배경 `bg-ink`, 텍스트 `text-cream`
- `aria-pressed` 필수

### 진행 표시 (ProgressBar)
- 가로 1.5px 선, 배경 `bg-beige-mid rounded-full`
- 진행분만 `bg-gold rounded-full`, 500ms ease 트랜지션
- 상단에 `01 / 05` 형식 카운터 + UPPERCASE 라벨

### 구분선
- 섹션 사이: `border-t border-beige-light` 또는 그냥 여백
- 문항 사이: `border-b border-beige-light pb-7`

### 영역 배지 (Zone Badge)
- 작은 알약 모양: `px-4 py-1.5 rounded-full`
- 배경: 영역 색상의 12% 투명도, 텍스트: 영역 색상 100%
- 좌측에 작은 ✨ 아이콘 (lucide Sparkles)

### 처방 카드 (가장 중요)
페이지의 타이포그래픽 정점. 결과 화면의 다른 모든 요소보다 또렷이 떠야 한다.
- 배경: `bg-ink`, 텍스트: `text-cream`
- 상단에 2px 골드 center-fade 라인: `bg-gradient-to-r from-transparent via-gold to-transparent`
- 라벨 "오늘의 처방": Sparkles 14px gold 아이콘 + 12px font-medium tracking-[0.3em] cream/80 uppercase
- 본문: Noto Serif KR 17~19px, `leading-[1.9]`
- 라운드: `rounded-2xl`
- 패딩: `px-7 py-9 sm:px-10 sm:py-11`
- 위 여백: `mt-16` (위 인용·해석 섹션과 분리감)
- drop-shadow 금지 (종이 톤 유지)

### 키보드 포커스
모든 인터랙티브 요소는 `:focus-visible` 시 잉크 톤의 부드러운 outline 노출. globals.css 전역 규칙으로 처리:
```css
:where(button, a, summary, [role="button"], input, select, textarea):focus-visible {
  outline: 2px solid rgba(26, 22, 18, 0.45);
  outline-offset: 2px;
  border-radius: 6px;
}
```

### Back-to-top (결과 페이지 전용)
긴 결과 페이지(~2700px 모바일) 보조 네비.
- `fixed bottom-6 right-6 z-20 w-11 h-11 rounded-full bg-ink/85 backdrop-blur-sm text-cream`
- `scrollY > 600` 일 때만 opacity 1, 아니면 0 + pointer-events none
- `window.scrollTo({ top: 0, behavior: 'smooth' })`
- aria-label "페이지 상단으로"

---

## 모션·애니메이션

### 진입 페이드업
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
- 페이지 진입 시 주요 블록을 `0.1s, 0.25s, 0.4s...` 등 stagger 적용
- 600ms ease-out

### 결과 코드 글자 등장
- 4글자를 각각 0.15s 간격으로 페이드인 (드라마틱한 임팩트)

### 진행 바 채우기
- `transition-all duration-500 ease-out`

**금지**
- 회전·바운스·튀어오름 효과 (책 톤과 맞지 않음)
- 이모지 튀는 효과
- 자동재생 그래픽

---

## 데코레이션

### 배경 텍스처 (paper-texture)
"늦가을 오후 햇살이 종이에 떨어진" 톤. globals.css의 `.paper-texture::before`와 `::after`로 구현된 두 겹:

1. **종이 결**: 미세한 fractalNoise SVG, opacity 0.14, `mix-blend-mode: multiply`
2. **빛의 워시**: 6겹 radial-gradient
   - 좌상단 따뜻한 화이트 글로우
   - 우상단 호박빛 (가을 오후 햇살)
   - 중앙 좌측 누런 빛
   - 우중단 옅은 단풍 적갈색 워시 (alpha ~0.14)
   - 하단 중앙 골든 워시
   - 좌하단 옅은 갈색 책장 그림자

전체 워시 알파는 0.10–0.32 범위로 절제. 페이지가 "장식된" 게 아니라 "따뜻한 종이"로 읽혀야 한다.

### 결과 코드 챕터 ornament
MEGC 4글자 위·아래에 책 챕터 표지 인상을 위한 ornament:
- **위**: `── ❦ ──` (gold/60% 좌우 12 너비 라인 + ❦ 14px)
- **아래**: `·  ·  ·` (gold/50% 8px tracking 0.4em)
- 모두 `aria-hidden="true"`, 의미는 sr-only h1에 위임

### 빛/어둠 스펙트럼 바
- 결과 화면에 등장하는 핵심 시각 요소
- `bg-gradient-to-r from-gold via-gray-mid to-dark`
- 높이 8px, rounded-full
- 사용자 위치에 흰색 원형 마커 (border-2 border-ink)

---

## 아이콘 (lucide-react)

사용 가능한 아이콘만 사용. 절대 이모지 폭격 금지.

| 화면 | 아이콘 |
|---|---|
| 결과 헤더 | `Compass` |
| 영역 배지 | `Sparkles` |
| 처방 카드 | (아이콘 없이 라벨로) |
| 진단 시작 버튼 | `ChevronRight` |
| 다음/이전 | `ChevronRight`, `ChevronLeft` |
| 다시 진단 | `RotateCcw` |

크기: 14~16px, `stroke-width: 1.75` 기본.

---

## 반응형 (Mobile First)

| 브레이크포인트 | 사이즈 | 주요 변경 |
|---|---|---|
| 모바일 (기본) | <640px | 컨테이너 100% 폭, padding 24px |
| sm 이상 | ≥640px | 타이포 사이즈 업, 양 옆 Likert 라벨 표시 |

데스크탑에서는 가운데 정렬 + max-w-2xl(640px)로 모바일과 같은 비율 유지. 가로로 넓게 펼치지 않음 — 책 한 페이지 느낌 유지.

---

## 다크모드는 일부러 미지원

크림색 종이 = TCMP의 정체성. 다크모드는 책의 톤을 무너뜨리므로 의도적으로 빼는 것이 결정 사항. (혼동 방지를 위해 prefers-color-scheme 미디어 쿼리 사용 금지)
