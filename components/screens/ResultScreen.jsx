'use client';

import { useEffect, useState } from 'react';
import { Compass, Sparkles, RotateCcw, Share2, ArrowUp } from 'lucide-react';
import Section from '../ui/Section';
import indicators from '../../data/indicators.json';
import { getSpectrumPercent } from '../../lib/scoring';

export default function ResultScreen({ result, onRestart }) {
  if (!result || !result.data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="prose-kr text-gray-text">
            결과를 불러올 수 없습니다. 다시 진단해 주세요.
          </p>
          <button
            onClick={onRestart}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink text-cream px-7 py-3 font-serif-kr text-[14px] hover:bg-gold transition-colors"
          >
            처음으로
          </button>
        </div>
      </div>
    );
  }

  const { code, letters, scores, data } = result;
  const zone = indicators.zones[data.zone];
  const spectrumPct = getSpectrumPercent(data.zone);
  const [markerLeft, setMarkerLeft] = useState(0);

  useEffect(() => {
    // 0% → 자기 위치로 부드럽게 이동
    const id = setTimeout(() => setMarkerLeft(spectrumPct), 200);
    return () => clearTimeout(id);
  }, [spectrumPct]);

  async function handleShare() {
    const shareText =
      `TCMP 결과: ${code} · ${data.nickname}\n` +
      `${data.tagline}\n\n` +
      `— 터널과 동굴 사이에서, 지금 내가 어디 서 있는지를 비추는 거울.`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: `TCMP · ${code}`, text: shareText });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        alert('결과를 클립보드에 복사했습니다.');
      }
    } catch {
      /* 사용자가 공유 취소 등 — 조용히 통과 */
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">

        {/* 헤더 */}
        <div className="text-center anim-fade-up">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] text-gray-mid">
            <Compass size={14} strokeWidth={1.5} className="text-gold" />
            YOUR COORDINATE
          </div>
        </div>

        <div className="mt-10 text-center">
          <h1 className="sr-only">결과 코드 {code} · {data.nickname}</h1>

          {/* 챕터 표지 ornament — 위 */}
          <div
            className="flex items-center justify-center gap-3 mb-6 text-gold/60"
            aria-hidden="true"
          >
            <span className="h-px w-12 bg-current" />
            <span className="font-code text-[14px] leading-none translate-y-[-1px]">❦</span>
            <span className="h-px w-12 bg-current" />
          </div>

          <div
            className="flex justify-center items-baseline gap-3 sm:gap-5"
            aria-hidden="true"
          >
            {letters.map((l, i) => (
              <span
                key={i}
                className="code-letter font-code italic text-[64px] sm:text-[96px] text-ink leading-none"
                style={{ letterSpacing: '0.02em' }}
              >
                {l}
              </span>
            ))}
          </div>

          {/* 챕터 표지 ornament — 아래 */}
          <div
            className="flex items-center justify-center gap-2 mt-6 text-gold/50"
            aria-hidden="true"
          >
            <span className="text-[8px] tracking-[0.4em]">·  ·  ·</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center anim-fade-up delay-3">
          <ZoneBadge zone={zone} />
        </div>

        <div className="mt-7 text-center anim-fade-up delay-4">
          <h2 className="font-display-kr text-[24px] sm:text-[30px] text-ink">
            {data.nickname}
          </h2>
          <p className="mt-2 font-code italic text-[16px] sm:text-[18px] text-gray-mid">
            {data.english}
          </p>
        </div>

        {/* tagline */}
        <div className="mt-12 anim-fade-up">
          <blockquote className="border-l-4 border-gold pl-5 py-2 prose-kr italic text-[15px] text-gray-text">
            {data.tagline}
          </blockquote>
        </div>

        {/* 16 코드 지도 */}
        <div className="mt-14 anim-fade-up">
          <div className="text-[11px] tracking-[0.3em] text-gray-mid mb-5">
            16 코드 지도
          </div>
          <div className="relative h-2 rounded-full bg-gradient-to-r from-gold via-gray-mid to-dark">
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-out"
              style={{ left: `${markerLeft}%` }}
            >
              <div className="w-4 h-4 rounded-full bg-cream border-2 border-ink shadow-md" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-5 text-[10px] tracking-[0.15em] text-gray-mid text-center">
            <span className={data.zone === 'light' ? 'text-gold font-medium' : ''}>빛</span>
            <span className={data.zone === 'mostlyLight' ? 'text-gold-dark font-medium' : ''}>빛에가까운</span>
            <span className={data.zone === 'balanced' ? 'text-gray-mid font-medium' : ''}>균형</span>
            <span className={data.zone === 'mostlyDark' ? 'text-shadow font-medium' : ''}>어둠에가까운</span>
            <span className={data.zone === 'dark' ? 'text-dark font-medium' : ''}>어둠</span>
          </div>
        </div>

        {/* 지표별 점수 */}
        <div className="mt-14 anim-fade-up">
          <div className="text-[11px] tracking-[0.3em] text-gray-mid mb-5">
            지표별 점수
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <IndicatorBar
                key={i}
                indicator={indicators[i]}
                score={scores[i]}
                letter={letters[i - 1]}
              />
            ))}
          </div>
        </div>

        {/* 콘텐츠 섹션 */}
        <div className="mt-14 anim-fade-up">
          <Section label="현재 좌표">
            <p>{data.coordinate}</p>
          </Section>

          <Section label="강점" accent>
            <p>{data.strength}</p>
          </Section>

          <Section label="그림자">
            <p>{data.shadow}</p>
          </Section>

          <Section label="벽 앞에서">
            <p className="italic text-gray-dark">{data.wallStance}</p>
          </Section>
        </div>

        {/* 처방 카드 — 가장 중요 */}
        <div className="mt-16 anim-fade-up">
          <div className="relative rounded-2xl bg-ink text-cream px-7 py-9 sm:px-10 sm:py-11 overflow-hidden">
            {/* 상단 골드 라인 — 더 또렷한 그라데이션 */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={14} strokeWidth={1.5} className="text-gold shrink-0" />
              <span className="text-[12px] font-medium tracking-[0.3em] text-cream/80 uppercase">
                오늘의 처방
              </span>
            </div>
            <p className="prose-kr text-[17px] sm:text-[19px] text-cream leading-[1.9]">
              {data.prescription}
            </p>
          </div>
        </div>

        {/* 책 인용문 */}
        <div className="mt-14 text-center anim-fade-up">
          <p className="prose-kr italic text-[14px] text-gray-dark leading-loose">
            당신의 코드는 당신이 누구인지를
            <br />결정하는 라벨이 아닙니다.
            <br /><br />
            당신이 지금 어디에 서 있는지를
            <br />비추는 지도입니다.
            <br /><br />
            한 달 뒤 다시 진단해 보세요.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 anim-fade-up">
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-full bg-ink text-cream px-7 py-3 font-serif-kr text-[14px] hover:bg-gold transition-colors duration-300 w-full sm:w-auto justify-center"
          >
            <RotateCcw size={14} strokeWidth={1.75} />
            다시 진단하기
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-ink text-ink px-7 py-3 font-serif-kr text-[14px] hover:bg-ink hover:text-cream transition-colors duration-300 w-full sm:w-auto justify-center"
          >
            <Share2 size={14} strokeWidth={1.75} />
            결과 공유하기
          </button>
        </div>

        <p className="mt-10 text-center text-[11px] tracking-[0.25em] text-gray-mid">
          TCMP · TUNNEL · CAVE · MINDSET · PROFILE
        </p>
      </div>

      <BackToTop />
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="페이지 상단으로"
      className={[
        'fixed bottom-6 right-6 z-20 inline-flex items-center justify-center w-11 h-11 rounded-full',
        'bg-ink/85 backdrop-blur-sm text-cream shadow-lg hover:bg-ink',
        'transition-all duration-300',
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none',
      ].join(' ')}
    >
      <ArrowUp size={18} strokeWidth={1.75} />
    </button>
  );
}

function ZoneBadge({ zone }) {
  const color = zone.color;
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] tracking-[0.2em]"
      style={{
        backgroundColor: color + '1F', // ~12% alpha
        color: color,
      }}
    >
      <Sparkles size={12} strokeWidth={1.75} />
      {zone.label} · {zone.en}
    </span>
  );
}

function IndicatorBar({ indicator, score, letter }) {
  const max = indicator.max;
  const cutoff = indicator.cutoff;
  const isLight = score >= cutoff;
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  const cutoffPct = (cutoff / max) * 100;

  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(pct), 200);
    return () => clearTimeout(id);
  }, [pct]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-3">
          <span className="font-code italic text-[20px] text-ink leading-none">{letter}</span>
          <span className="prose-kr text-[14px] text-gray-text">{indicator.name}</span>
        </div>
        <span className="font-code text-[14px] text-gray-dark">
          {score} <span className="text-gray-light">/ {max}</span>
        </span>
      </div>
      <div className="relative h-1.5 w-full bg-beige-mid rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-700 ease-out ${
            isLight ? 'bg-gold' : 'bg-shadow'
          }`}
          style={{ width: `${w}%` }}
        />
        <div
          className="absolute top-[-3px] bottom-[-3px] w-px bg-ink/40"
          style={{ left: `${cutoffPct}%` }}
        />
      </div>
      <div className="mt-1.5 text-[11px] tracking-[0.15em] text-gray-mid">
        기준선 {cutoff} · {isLight ? indicator.lightName : indicator.darkName}
      </div>
    </div>
  );
}
