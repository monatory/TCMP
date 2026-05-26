# TCMP — Tunnel-Cave Mindset Profile

20문항 5점 척도 한국어 심리 자가진단 웹 앱. 4지표로 측정해 16가지 마인드셋 코드 중 하나로 결과를 도출합니다.

## 🌐 배포 (GitHub Pages)

- **공개 URL**: https://monatory.github.io/TCMP/
- **관리자**: `/admin` (PIN: `1612`)
- `main` 또는 `master` 브랜치에 push되면 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)이 자동으로 정적 export 빌드 후 GitHub Pages에 배포합니다.
- 배포 후 GitHub 리포지토리 **Settings → Pages → Build and deployment → Source** 를 **"GitHub Actions"** 로 설정해야 합니다(최초 1회).

## 🛠 로컬 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 정적 export → out/ 생성
node scripts/test-scoring.mjs              # 채점 함수 검증
node scripts/test-16-codes-roundtrip.mjs   # 16개 코드 라운드트립 + 콘텐츠 충실성
```

---

## 📦 빌드 키트 (Claude Code용 — 원본 자료)

> 아래 섹션은 이 프로젝트를 처음부터 다시 만들 때 Claude Code에 던지는 빌드 키트 가이드입니다.

---

## 📦 패키지 구성

```
tcmp-claude-code-pack/
├── README.md              ← 지금 이 파일
├── CLAUDE.md              ← 클로드 코드가 자동으로 읽는 프로젝트 메모리
├── PROMPT.md              ← 클로드 코드에 붙여넣을 메인 프롬프트
├── specs/                 ← 상세 스펙 문서
│   ├── 01-product.md      ← 제품 비전·범위
│   ├── 02-design.md       ← 디자인 시스템
│   ├── 03-flow.md         ← 화면 흐름·인터랙션
│   ├── 04-scoring.md      ← 채점 알고리즘
│   └── 05-tech.md         ← 기술 스택·구조
└── data/                  ← 콘텐츠 데이터 (절대 수정 금지)
    ├── questions.json     ← 20개 문항
    ├── codes.json         ← 16개 코드 해석
    └── indicators.json    ← 4개 지표 메타정보
```

---

## 🚀 사용법 (3분)

### 사전 준비
- Node.js 18 이상 설치
- Claude Code 설치 (`npm install -g @anthropic-ai/claude-code`)
- 빈 작업 폴더 하나

### 1단계: 폴더 준비
```bash
mkdir tcmp-app
cd tcmp-app
# 이 빌드 팩의 모든 파일을 tcmp-app/ 안에 풀어 넣기
# CLAUDE.md, PROMPT.md, specs/, data/ 가 tcmp-app/ 루트에 있어야 함
```

### 2단계: 클로드 코드 실행
```bash
claude
```

### 3단계: 메인 프롬프트 던지기
`PROMPT.md` 내용을 통째로 복사해서 클로드 코드 프롬프트에 붙여넣기. 끝.

클로드 코드가 자동으로 `CLAUDE.md`를 읽고, `specs/`와 `data/`를 참조해서 프로젝트를 만들기 시작합니다.

### 4단계: 결과 확인
빌드가 끝나면 클로드 코드가 안내하는 대로:
```bash
npm install
npm run dev
```
→ `http://localhost:3000`

---

## 💡 단계별 빌드를 선호한다면

PROMPT.md 하단의 **Phase별 프롬프트**를 하나씩 던지면 됩니다. 각 단계마다 결과를 검토하고 다음으로 넘어갈 수 있어서 통제력이 더 큽니다.

| 단계 | 작업 |
|---|---|
| Phase 1 | 프로젝트 스캐폴딩·기본 라우팅 |
| Phase 2 | 데이터 모듈·채점 로직·테스트 |
| Phase 3 | 디자인 시스템·공통 컴포넌트 |
| Phase 4 | 진단 화면(인트로·질문 5개) |
| Phase 5 | 결과 화면 |
| Phase 6 | localStorage 이력 저장 + 마무리 |

---

## ⚠️ 주의 사항

1. **`data/` 폴더의 JSON은 절대 수정하지 말 것** — 문항·코드 해석 텍스트는 원저작 콘텐츠
2. **디자인 톤은 `specs/02-design.md`를 따를 것** — 일반 MBTI 앱처럼 알록달록하지 않게
3. **결과 페이지의 처방(prescription)은 가장 눈에 띄게 배치** — 책의 핵심 차별점
4. **클로드 코드가 막히면** 해당 spec 문서를 다시 읽도록 지시하면 됨 (예: "specs/02-design.md를 다시 읽고 색상을 점검해줘")

---

## 📚 참고

- 원본 콘텐츠: TCMP 자가진단지 워크북 + 16코드 통합 해석 매트릭스
- 추천 클로드 모델: Sonnet 4 (이런 규모는 Sonnet으로 충분)
- 예상 빌드 시간: 단일 프롬프트 약 5~10분 / 단계별 30~60분
