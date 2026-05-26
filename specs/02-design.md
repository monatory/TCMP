# 02 · 디자인 시스템

## 디자인 컨셉

**"한국 문예지 + 손때 묻은 종이 워크북"**

일반 MBTI 앱의 알록달록한 그라데이션·이모지 폭격을 피하고, 책을 펼쳤을 때의 차분한 호흡을 디지털로 옮긴다. 한 페이지에 하나의 메시지, 충분한 여백, 절제된 액센트.

비유: *"카페에서 잘 만든 시집을 펼쳤을 때의 첫 페이지."*

---

## 색상 토큰

| 토큰 | HEX | 용도 |
|---|---|---|
| **cream** | `#F5F1EA` | 페이지 배경 (오래된 종이) |
| **ink** | `#1A1612` | 본문 텍스트 / 어두운 카드 / 강조 버튼 |
| **gold** | `#C8924B` | 단일 액센트 (터널의 빛) — 절대 남용 금지 |
| gray-text | `#3A332B` | 본문 보조 |
| gray-dark | `#5A5249` | 메타 정보 |
| gray-mid | `#8A7355` | 라벨·캡션 |
| gray-light | `#A39685` | 가장 옅은 텍스트 |
| beige-dark | `#C9BFAE` | 테두리 (어두운 쪽) |
| beige-mid | `#D9D2C5` | 구분선 |
| beige-light | `#E5DFD2` | 가는 구분선 |
| gold-dark | `#B08246` | 5영역 그라데이션 |
| shadow | `#5C5246` | 5영역 그라데이션 (어둠 쪽) |
| dark | `#2E2A24` | 5영역 그라데이션 끝점 |

**색상 사용 규칙**
- 한 화면에 gold는 1~2곳만 (헤더 액센트선 + 진행 표시 / 또는 처방 카드 상단 라인)
- 그라데이션은 5영역 스펙트럼 바와 처방 카드 상단 라인에만 허용
- 다른 곳에 그라데이션·드롭섀도 추가 금지

### tailwind.config.js 매핑 예시
```js
theme: {
  extend: {
    colors: {
      cream: '#F5F1EA',
      ink: '#1A1612',
      gold: '#C8924B',
      'gold-dark': '#B08246',
      'gray-text': '#3A332B',
      'gray-dark': '#5A5249',
      'gray-mid': '#8A7355',
      'gray-light': '#A39685',
      'beige-dark': '#C9BFAE',
      'beige-mid': '#D9D2C5',
      'beige-light': '#E5DFD2',
      shadow: '#5C5246',
      dark: '#2E2A24',
    },
  },
}
```

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
- 원형: `w-10 h-10 rounded-full`
- 비선택: 테두리 `border-beige-dark`, 텍스트 `text-gray-dark`
- 선택: 배경 `bg-ink`, 텍스트 `text-cream`, scale 1.1
- hover (비선택): 테두리 `border-ink`로 어두워짐
- 양 옆 라벨: "전혀 그렇지 않다" ~ "매우 그렇다" (모바일에서는 양 끝만 표시)

### 진행 표시 (ProgressBar)
- 가로 1px 선, 배경 `bg-beige-mid`
- 진행분만 `bg-gold`, 500ms ease 트랜지션
- 상단에 `01 / 05` 형식 카운터 + UPPERCASE 라벨

### 구분선
- 섹션 사이: `border-t border-beige-light` 또는 그냥 여백
- 문항 사이: `border-b border-beige-light pb-7`

### 영역 배지 (Zone Badge)
- 작은 알약 모양: `px-4 py-1.5 rounded-full`
- 배경: 영역 색상의 12% 투명도, 텍스트: 영역 색상 100%
- 좌측에 작은 ✨ 아이콘 (lucide Sparkles)

### 처방 카드 (가장 중요)
- 배경: `bg-ink` (어두운 잉크색)
- 텍스트: `text-cream`
- 상단에 1px 황금 그라데이션 라인: `bg-gradient-to-r from-gold to-transparent`
- 라운드: `rounded-2xl`
- 패딩: `p-7 sm:p-8`
- 본문은 Noto Serif KR 16px, line-height 1.85

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

### 배경 텍스처
페이지 전역에 매우 옅은 점 패턴(opacity 0.025) 깔기:
```css
background-image:
  radial-gradient(circle at 20% 30%, #1A1612 1px, transparent 1px),
  radial-gradient(circle at 80% 70%, #1A1612 1px, transparent 1px);
background-size: 40px 40px, 60px 60px;
```

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
