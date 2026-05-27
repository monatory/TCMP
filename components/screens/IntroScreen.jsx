'use client';

import { ChevronRight, RotateCcw } from 'lucide-react';

export default function IntroScreen({ onStart, latest, onShowLatest }) {
  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center px-6 pt-16 sm:pt-24 pb-28 sm:pb-32">
      <div className="w-full max-w-2xl">
        <div className="text-center anim-fade-up">
          <div className="text-[11px] tracking-[0.3em] text-gray-mid mb-10">
            ── MINDSET PROFILE ──
          </div>
        </div>

        <div className="text-center anim-fade-up delay-1">
          <h1 className="font-display-kr text-[32px] sm:text-[44px] leading-tight text-ink">
            터널과 동굴
            <br />
            사이에서
          </h1>
          <p className="mt-5 font-code italic text-[15px] sm:text-[20px] text-gold tracking-wide">
            TCMP · Tunnel-Cave Mindset Profile
          </p>
        </div>

        <div className="my-12 h-px mx-auto w-2/3 bg-gradient-to-r from-gold via-shadow to-dark anim-draw" />

        <div className="prose-kr text-[15px] sm:text-[16px] text-gray-text text-center max-w-md mx-auto anim-fade-up delay-2">
          <p>
            이 진단은 당신의 우열을<br />
            가리는 시험이 아닙니다.
          </p>
          <p className="mt-6">
            지금 이 순간 당신의 마음이<br />
            <span className="text-ink font-medium">‘동굴의 정체’</span> 속에 머물고<br />
            있는지, <span className="text-gold font-medium">‘터널의 성장 경로’</span><br />
            위에 서 있는지를 비추어<br />
            보는 심리적 지도입니다.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-2 text-center anim-fade-up delay-3">
          {[
            { n: '20', label: '문항' },
            { n: '4',  label: '지표' },
            { n: '16', label: '코드' },
          ].map(({ n, label }) => (
            <div key={label}>
              <div className="font-code text-[32px] sm:text-[40px] text-ink leading-none">{n}</div>
              <div className="mt-2 text-[11px] tracking-[0.3em] text-gray-mid">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-20 flex flex-col items-center gap-4 anim-fade-up delay-4">
          <button
            type="button"
            onClick={onStart}
            className="group inline-flex items-center gap-2 rounded-full bg-ink text-cream px-8 py-4 font-serif-kr text-[15px] transition-colors duration-300 hover:bg-gold"
          >
            진단 시작하기
            <ChevronRight size={16} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {latest && (
            <button
              type="button"
              onClick={onShowLatest}
              className="inline-flex items-center gap-2 rounded-full border border-ink text-ink px-6 py-2.5 font-serif-kr text-[13px] hover:bg-ink hover:text-cream transition-colors duration-300"
            >
              <RotateCcw size={13} strokeWidth={1.75} />
              직전 결과 보기 · <span className="font-code italic tracking-wider">{latest.code}</span>
            </button>
          )}

          <p className="mt-2 text-[11px] tracking-[0.2em] text-gray-mid">소요 시간 약 5분</p>
          <p className="text-[11px] tracking-[0.15em] text-gray-mid">가장 솔직한 자신의 모습에 응답해 주세요</p>
        </div>
      </div>
    </div>
  );
}
