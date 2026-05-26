/** @type {import('next').NextConfig} */
// GitHub Pages 정적 호스팅 + 서브경로 배포에 맞춘 설정.
// 로컬 개발 시(npm run dev) basePath는 비워 둬야 / 에서 그대로 동작.
const isProd = process.env.NODE_ENV === 'production';
const REPO = 'TCMP';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? `/${REPO}` : '',
  assetPrefix: isProd ? `/${REPO}/` : '',
};

module.exports = nextConfig;
