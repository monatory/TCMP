# TCMP 프로젝트 컨텍스트

> 이 문서는 클로드 코드(Claude Code)가 작업 시 자동으로 참조하는 프로젝트 메모리입니다. 모든 작업을 시작하기 전 이 문서를 먼저 읽고, 필요 시 `specs/`와 `data/`를 참조하세요.

---

## 프로젝트 개요

**TCMP (Tunnel-Cave Mindset Profile)** 는 MBTI 형식의 심리 자가진단 웹 애플리케이션입니다. 20문항 5점 척도로 4개 지표(사고·행동·위기·관계)를 측정하고, 16가지 마인드셋 코드 중 하나로 결과를 도출합니다.

- 책 기반 콘텐츠 (워크북 + 통합 해석 매트릭스)
- 진학·진로 상담 현장에서 학생 자기이해 도구로 사용 예정
- 모바일 우선 반응형 웹 앱
- 한국어 UI

---

## 기술 스택 (필수)

- **Framework**: Next.js 14 (App Router, `app/` 디렉터리 사용)
- **Language**: JavaScript (TypeScript 아님, 단순함 우선)
- **UI**: React 18 함수형 컴포넌트 + Hooks
- **Styling**: Tailwind CSS 3 + 커스텀 CSS 변수 (디자인 토큰)
- **Icons**: lucide-react
- **State**: useState/useReducer (외부 상태 라이브러리 없이)
- **Persistence**: localStorage (브라우저 저장만, DB 없음)
- **Deployment 타깃**: Vercel

⚠️ **금지 사항**
- 다른 UI 라이브러리(MUI, Chakra 등) 추가 금지
- TypeScript 도입 금지 (JSX만)
- 백엔드/DB 코드 작성 금지

---

## 디렉터리 구조 (이대로 만들기)

```
.
├── app/
│   ├── layout.jsx          # 루트 레이아웃, 폰트 import
│   ├── page.jsx            # 메인 페이지 (TcmpApp 마운트)
│   └── globals.css         # Tailwind + 폰트 + CSS 변수
├── components/
│   ├── TcmpApp.jsx         # 최상위 컨테이너 (상태·라우팅)
│   ├── screens/
│   │   ├── IntroScreen.jsx
│   │   ├── QuestionScreen.jsx
│   │   └── ResultScreen.jsx
│   └── ui/
│       ├── ProgressBar.jsx
│       ├── LikertRow.jsx
│       └── Section.jsx
├── lib/
│   ├── scoring.js          # 채점 로직 (순수 함수, 테스트 가능)
│   └── storage.js          # localStorage 래퍼
├── data/
│   ├── questions.json      # 20문항 (수정 금지)
│   ├── codes.json          # 16코드 해석 (수정 금지)
│   └── indicators.json     # 4지표 메타 (수정 금지)
├── specs/                  # 스펙 문서 (참조용)
├── CLAUDE.md               # 이 파일
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 작업 시 반드시 지킬 규칙

### 1. 데이터 불가침 원칙
`data/*.json` 파일의 텍스트는 **단 한 글자도 수정하지 않는다.**
- 문항 번호, 텍스트, reverse 여부는 그대로
- 16개 코드의 별명·해석·처방 텍스트는 원본 그대로
- 새로운 코드/문항 추가 금지

### 2. 채점 로직 정확성
`lib/scoring.js`는 `specs/04-scoring.md`의 의사코드를 그대로 구현한다. 특히:
- 역채점 문항 8개: 1·2·5·8·9·11·13·17 (변환식: `6 - score`)
- 지표별 기준선: 지표 1·2·4 = 12점 / 지표 3 = 24점
- 기준선 **이상**은 빛(M/E/G/C), **미만**은 어둠(R/H/F/I)

### 3. 디자인 충실도
`specs/02-design.md`의 디자인 시스템을 따른다. 핵심:
- 일반 MBTI 앱처럼 알록달록한 그라데이션 금지
- 크림색 종이 배경, 깊은 잉크 본문, 황금 액센트 한 점만
- 한글 디스플레이는 Gowun Batang/Noto Serif KR, 본문은 Pretendard
- 알파벳 4글자 코드는 Cormorant Garamond 이탤릭

### 4. 화면 흐름은 7단계
0(인트로) → 1(지표 1) → 2(지표 2) → 3(지표 3 전반) → 4(지표 3 후반) → 5(지표 4) → 6(결과)

지표 3은 8문항이라 두 화면으로 분할. 자세한 내용은 `specs/03-flow.md`.

### 5. 처방(prescription)을 강조
결과 화면에서 강점·그림자보다 **처방(오늘 할 행동)**이 시각적으로 가장 두드러져야 한다. 어두운 배경 + 황금 액센트 라인이 들어간 카드로 처리. 이게 책의 핵심 차별점이자 앱의 가치 지점.

### 6. 모바일 우선
모든 화면을 좁은 모바일 뷰포트(360px)에서 먼저 검수. 그다음 데스크탑 확인.

---

## 자주 참조할 spec 파일

| 파일 | 무엇이 들어있나 |
|---|---|
| `specs/01-product.md` | 제품 비전, 사용자, 성공 기준 |
| `specs/02-design.md` | 색상 토큰, 타이포, 간격, 컴포넌트 스타일 |
| `specs/03-flow.md` | 화면별 와이어프레임, 전이 조건 |
| `specs/04-scoring.md` | 채점 알고리즘 (의사코드 + 테스트 케이스) |
| `specs/05-tech.md` | package.json, 의존성, 빌드/배포 명령 |
| `data/questions.json` | 문항 데이터 구조 |
| `data/codes.json` | 코드 데이터 구조 |
| `data/indicators.json` | 지표 메타 데이터 |

---

## 작업 완료 조건 (Definition of Done)

다음을 모두 만족하면 1차 빌드 완료:

- [ ] `npm install` 무오류 통과
- [ ] `npm run dev` 후 `http://localhost:3000` 정상 로드
- [ ] 인트로 → 5개 진단 화면 → 결과 화면까지 흐름 무중단
- [ ] 20문항 모두 응답해야 다음 단계로 진행 가능
- [ ] 역채점 적용된 결과 점수가 `specs/04-scoring.md`의 테스트 케이스와 일치
- [ ] 결과 화면이 코드별로 다른 텍스트를 정확히 표시
- [ ] localStorage에 결과 저장됨 (재방문 시 직전 결과 확인 가능)
- [ ] 모바일 뷰(360px)에서 깨짐 없음
- [ ] 콘솔 에러 0건

---

## 빌드 후 검증 체크리스트

빌드를 마치면 다음을 직접 테스트하고 결과를 보고하세요:

1. 모든 문항에 5점 응답 → 결과 코드 출력 확인
2. 모든 문항에 1점 응답 → 결과 코드 출력 확인
3. 역채점 문항(1·2번)에 5점, 나머지 지표 1 문항에 1점 응답 → 지표 1 점수가 4점인지 확인
4. 새로고침 시 직전 결과 보존되는지 확인
5. 모바일 viewport(개발자 도구)에서 화면 깨짐 없는지 확인

---

## 톤 가이드 (소통)

- 보고는 한국어로
- 코드 주석은 간결한 한국어 또는 영어 모두 허용
- 변수명·함수명은 영어 (camelCase)
- 사용자가 "기획"이라 부르는 것은 product spec, "코드"는 4글자 결과 코드를 의미할 수 있으니 맥락 주의
