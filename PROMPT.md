# 클로드 코드 프롬프트 모음

> 아래 프롬프트 중 하나를 클로드 코드에 붙여넣으세요. 처음 사용한다면 **방법 A(단일 프롬프트)** 를 추천합니다.

---

## 🅐 방법 A : 단일 프롬프트 (한 번에 전체 빌드)

```
이 폴더에 있는 CLAUDE.md, specs/, data/ 를 모두 읽고 TCMP(Tunnel-Cave Mindset Profile) 자가진단 웹 앱을 처음부터 끝까지 만들어줘.

작업 순서:
1. CLAUDE.md를 먼저 읽고 프로젝트 컨텍스트 파악
2. specs/01-product.md ~ 05-tech.md를 순서대로 읽기
3. data/ 안의 JSON 3개를 검토 (수정 금지, 그대로 import해서 사용)
4. CLAUDE.md의 "디렉터리 구조" 그대로 파일 생성
5. 채점 로직(lib/scoring.js)을 먼저 만들고 콘솔에서 자체 테스트
6. 디자인 시스템(globals.css, tailwind.config.js)을 그다음 구축
7. 공통 UI 컴포넌트 → 화면 컴포넌트 → 최상위 컨테이너 순으로 작업
8. localStorage 이력 저장(lib/storage.js) 추가
9. npm run build로 빌드 오류 없는지 확인
10. CLAUDE.md "빌드 후 검증 체크리스트"의 5개 항목 직접 테스트하고 결과 보고

작업 중 막히면 해당 spec 문서를 다시 인용하면서 해결해. 임의로 데이터를 변경하거나 디자인 톤을 바꾸지 마.
```

---

## 🅑 방법 B : 단계별 프롬프트 (각 단계 검토 가능)

긴 작업을 6단계로 쪼개서 각 단계마다 결과를 확인하고 싶을 때 사용. 한 단계가 끝나면 다음 프롬프트를 던지면 됨.

### Phase 1 · 프로젝트 스캐폴딩

```
CLAUDE.md와 specs/05-tech.md를 읽고, Next.js 14 (App Router) 프로젝트의 기본 골격을 만들어줘.

만들어야 할 파일:
- package.json (dependencies: next 14.2.5, react 18, react-dom 18, lucide-react / devDependencies: tailwindcss, postcss, autoprefixer)
- next.config.js
- tailwind.config.js (custom theme: cream, ink, gold 색상 + 폰트 패밀리)
- postcss.config.js
- app/layout.jsx (lang="ko", 메타데이터, globals.css import)
- app/page.jsx ('use client' + 컴포넌트 마운트)
- app/globals.css (Tailwind directives + 폰트 import + CSS 변수)
- .gitignore

지금 단계는 "TCMP 빌드 중..."이라는 한 줄짜리 페이지만 표시하면 충분. npm install + npm run dev 동작만 확인하고 보고해줘.
```

### Phase 2 · 데이터 모듈 + 채점 로직

```
specs/04-scoring.md와 data/ 안의 JSON 파일을 읽고, lib/scoring.js를 만들어줘.

요구사항:
- data/questions.json, codes.json, indicators.json 을 import 해서 사용
- calculateResult(answers) 함수: answers는 { 1: 점수, 2: 점수, ... } 형태의 객체
- 반환 형태: { code: 'MEGC', letters: ['M','E','G','C'], scores: { 1: 18, 2: 15, 3: 32, 4: 14 }, data: codes['MEGC'] }
- 역채점 문항(1·2·5·8·9·11·13·17) 자동 변환
- 응답이 누락된 문항은 0점 처리

추가로 lib/scoring.test.js 같은 파일을 만들어서 specs/04-scoring.md의 테스트 케이스 3개를 검증하고 결과를 출력해줘. (Node로 직접 실행해서 통과 여부 보고)
```

### Phase 3 · 디자인 시스템과 공통 UI

```
specs/02-design.md를 정독하고, 다음 공통 컴포넌트를 만들어줘:

1. components/ui/ProgressBar.jsx — props: current, total. 가는 가로 선 + 황금색 진행 표시
2. components/ui/LikertRow.jsx — props: value, onChange. 1~5점 원형 버튼, 양 끝 라벨
3. components/ui/Section.jsx — props: title, accent?, children. 작은 대문자 제목 + 콘텐츠

각 컴포넌트는 specs/02-design.md의 색상·폰트 토큰을 정확히 따라야 함. 임의의 그라데이션이나 그림자 추가 금지. 데모용으로 app/page.jsx에 세 컴포넌트를 잠깐 띄워서 시각 확인 후 정리.
```

### Phase 4 · 진단 화면 (인트로 + 5개 질문 화면)

```
specs/03-flow.md를 읽고 다음 화면을 만들어줘:

1. components/screens/IntroScreen.jsx
   - 제목 "터널과 동굴 사이에서" + 책의 안내문 + "진단 시작하기" 버튼
   - 화면 진입 시 페이드업 애니메이션

2. components/screens/QuestionScreen.jsx
   - props: screen(=현재 화면 메타), screenIndex, totalScreens, answers, onAnswer, onNext, onPrev
   - 지표명 헤더 + 4개 문항 + Likert + 이전/다음 버튼
   - 모든 문항 응답 전에는 다음 버튼 disabled
   - 화면 전환 시 부드러운 스크롤 top

3. components/TcmpApp.jsx (최상위)
   - step 상태: 0(인트로) ~ 6(결과)
   - answers 상태: { questionId: score } 객체
   - 1~5번 step은 QUESTION_SCREENS[step-1] 정보로 QuestionScreen 마운트
   - 6번 step에서는 결과 화면 (이번 단계에서는 "결과 계산 완료" placeholder만)

app/page.jsx에서 TcmpApp을 마운트하고, 인트로부터 5개 화면을 끝까지 클릭으로 통과되는지 확인 후 보고.
```

### Phase 5 · 결과 화면

```
specs/03-flow.md의 "결과 화면 구성"과 data/codes.json을 참고해서 components/screens/ResultScreen.jsx를 완성해줘.

레이아웃 (위에서 아래로):
1. 헤더: "Your Coordinate" 라벨
2. 4글자 코드 (큰 Cormorant 이탤릭, 한 글자씩 페이드인 stagger)
3. 영역 배지 (예: "빛의 영역 · Light")
4. 별명 + 영문 별명
5. 한 줄 정의(tagline)를 황금색 좌측 테두리 인용블록으로
6. 5영역 스펙트럼 그라데이션 바 + 내 위치 마커
7. 지표별 점수 막대 그래프 (각 막대에 기준선 표시)
8. 현재 좌표 / 강점 / 그림자 / 벽 앞에서 (Section 컴포넌트 사용)
9. 처방 카드 — 어두운 배경 + 상단 황금 그라데이션 라인 (가장 눈에 띄게)
10. 책 인용문 (한 달 뒤 다시 진단 권유)
11. 액션 버튼: 다시 진단하기 / 결과 공유하기 (navigator.share)

lib/scoring.js의 calculateResult를 호출해서 결과를 받아 표시. 16개 코드 중 5개를 무작위로 골라 시각 검수해줘.
```

### Phase 6 · localStorage 이력 + 마무리

```
lib/storage.js를 만들어서 진단 이력을 localStorage에 저장하고, 다음을 구현해줘:

1. saveResult(result) — 현재 결과를 'tcmp_history' 키에 배열로 누적 저장 (최대 30개)
2. getHistory() — 저장된 이력 배열 반환
3. getLatest() — 가장 최근 결과 반환

TcmpApp.jsx에서 결과 계산 직후 saveResult 호출.

추가로 IntroScreen에 "직전 결과 보기" 버튼 추가 — getLatest()가 있으면 표시, 클릭 시 결과 화면으로 점프.

마지막으로:
- npm run build로 빌드 무오류 확인
- CLAUDE.md "빌드 후 검증 체크리스트" 5개 항목 직접 테스트
- 모바일 360px 뷰포트에서 시각 깨짐 없는지 확인
- 결과 보고
```

---

## 🛠 디버깅·수정 시 사용할 수 있는 후속 프롬프트

### 디자인이 specs와 어긋날 때
```
specs/02-design.md를 다시 읽고, 현재 [화면명]의 [구체적 부분]이 디자인 토큰과 어긋난 곳을 모두 찾아 수정해줘.
```

### 채점이 이상할 때
```
specs/04-scoring.md의 테스트 케이스 3개를 lib/scoring.js로 직접 돌려보고, 어느 케이스가 실패하는지 알려줘.
```

### 콘텐츠 누락
```
data/codes.json의 16개 코드 중 결과 화면에서 표시되지 않는 필드가 있는지 모든 코드를 순회하면서 확인해줘.
```

### 모바일 깨짐
```
모바일 360px 뷰포트 기준으로 [화면명]의 가로 스크롤·텍스트 오버플로·터치 영역 부족 문제를 검수하고 고쳐줘.
```
