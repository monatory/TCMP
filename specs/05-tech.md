# 05 · 기술 스택과 빌드

## package.json (그대로 사용)

```json
{
  "name": "tcmp-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.383.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6"
  }
}
```

추가 의존성 설치 금지. 위 7개만 사용.

---

## next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
```

이것만으로 충분. 이미지 도메인, 리다이렉트 등 추가 설정 불필요.

---

## tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
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
      fontFamily: {
        'serif-kr': ['"Noto Serif KR"', '"Gowun Batang"', 'serif'],
        'display-kr': ['"Gowun Batang"', '"Noto Serif KR"', 'serif'],
        body: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        code: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
};
```

---

## postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Gowun+Batang:wght@400;700&family=Cormorant+Garamond:wght@300;400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

html, body {
  background: #F5F1EA;
  color: #1A1612;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* { box-sizing: border-box; }

/* Animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes drawLine {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

.anim-fade-up { animation: fadeUp 0.6s ease-out both; }
.anim-fade { animation: fadeIn 0.8s ease-out both; }
.anim-draw { animation: drawLine 1.2s ease-out 0.3s both; transform-origin: left; }
```

---

## app/layout.jsx

```jsx
import './globals.css';

export const metadata = {
  title: 'TCMP · Tunnel-Cave Mindset Profile',
  description: '터널과 동굴 사이에서 — 당신의 마음 좌표를 비추는 심리적 지도',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

---

## app/page.jsx

```jsx
'use client';

import TcmpApp from '../components/TcmpApp';

export default function Page() {
  return <TcmpApp />;
}
```

---

## 모듈 임포트 패턴

데이터 JSON은 ES 모듈로 직접 import (Next.js가 자동으로 JSON loader 처리):

```jsx
import questions from '../data/questions.json';
import codes from '../data/codes.json';
import indicators from '../data/indicators.json';
```

별도 require나 fetch 사용 금지.

---

## 빌드·실행 명령

| 명령 | 용도 |
|---|---|
| `npm install` | 의존성 설치 (최초 1회) |
| `npm run dev` | 개발 서버 (http://localhost:3000, HMR) |
| `npm run build` | 프로덕션 빌드 (정적 분석·최적화) |
| `npm start` | 빌드된 결과 서빙 |

---

## 배포 (참고)

Vercel에 배포하려면:
1. GitHub에 push
2. vercel.com에서 import
3. 별도 환경변수 불필요 (외부 API 호출 없음)

또는 정적 export:
```bash
npm run build
# 결과는 .next/ 디렉토리에 생성
# 정적 파일만 필요하면 next.config.js에 output: 'export' 추가
```

---

## 코드 컨벤션

### 파일·폴더
- 컴포넌트 파일은 PascalCase: `TcmpApp.jsx`, `IntroScreen.jsx`
- 일반 모듈은 camelCase: `scoring.js`, `storage.js`
- 모든 React 컴포넌트는 default export

### React
- 함수형 컴포넌트 + Hooks만 사용
- `'use client'` 지시어는 useState/useEffect를 사용하는 컴포넌트에만 (대부분의 컴포넌트가 해당)
- props는 destructuring으로 받기
- 중첩 컴포넌트는 같은 파일 안에 helper로 정의 가능

### 스타일
- Tailwind 클래스 우선 사용
- 임시 인라인 스타일(`style={{}}`)은 동적인 값(예: `width: ${pct}%`)에만 사용
- 색상은 반드시 토큰명으로 (`text-ink`, `bg-cream`) — hex 직접 사용 금지

### 주석
- 복잡한 로직(특히 채점 함수)에만 필요한 주석 추가
- "왜" 그렇게 했는지 (의도) 위주로, "무엇을" 하는지는 코드로 자명하면 생략

---

## 디버깅 팁

- 채점이 이상하면 `console.log(answers, scores, letters)` 추가해서 단계별 점검
- 디자인이 어긋나면 브라우저 DevTools에서 Computed 폰트·색상 확인
- Tailwind 클래스가 안 먹으면 `tailwind.config.js`의 content 경로 점검
- 폰트가 안 뜨면 globals.css의 @import URL 점검 + Network 탭 확인
