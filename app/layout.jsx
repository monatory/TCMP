import './globals.css';

export const metadata = {
  title: 'TCMP · Tunnel-Cave Mindset Profile',
  description: '터널과 동굴 사이에서 — 당신의 마음 좌표를 비추는 심리적 지도',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="paper-texture">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
