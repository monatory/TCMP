'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DEMOGRAPHIC_FIELDS, isComplete } from '../../lib/demographics';

/**
 * 인트로 다음, 본 진단 전에 응답자 일반 사항을 받는 화면.
 * - 칩(알약) 형태로 1개씩 선택 (단일 선택)
 * - 모든 필드 채워야 "다음" 활성화
 */
export default function DemographicsScreen({ value, onPick, onPrev, onNext }) {
  const v = value || {};
  const ready = isComplete(v);

  function pick(key, val) {
    onPick(key, val);
  }

  return (
    <div className="min-h-screen px-6 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <header className="anim-fade-up">
          <div className="text-[12px] font-medium tracking-[0.3em] text-gold-dark uppercase">
            시작 전에
          </div>
          <h2 className="mt-3 font-display-kr text-[24px] sm:text-[30px] text-ink">
            ─ 당신에 대하여 ─
          </h2>
          <p className="mt-2 prose-kr italic text-[14px] text-gray-mid">
            잠시 멈추고, 지금의 당신을 짧게 소개해 주세요.
            <br />
            아래 응답은 통계용으로만 쓰이고, 결과 해석에는 영향을 주지 않습니다.
          </p>
        </header>

        <div className="mt-10 space-y-9">
          {DEMOGRAPHIC_FIELDS.map((field, i) => (
            <div
              key={field.key}
              className="anim-fade-up"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="text-[11px] tracking-[0.3em] text-gray-mid mb-3">
                {field.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {field.options.map((opt) => {
                  const selected = v[field.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => pick(field.key, opt.value)}
                      aria-pressed={selected}
                      className={[
                        'inline-flex items-center justify-center min-h-[44px] px-4 rounded-full font-serif-kr text-[14px] border transition-colors duration-200',
                        selected
                          ? 'bg-ink text-cream border-ink'
                          : 'bg-transparent text-gray-text border-beige-dark hover:border-ink',
                      ].join(' ')}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center gap-2 rounded-full border border-ink text-ink px-6 py-2.5 font-serif-kr text-[14px] hover:bg-ink hover:text-cream transition-colors duration-300"
          >
            <ChevronLeft size={14} strokeWidth={1.75} />
            이전
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!ready}
            className={[
              'inline-flex items-center gap-2 rounded-full px-7 py-3 font-serif-kr text-[15px] transition-colors duration-300',
              ready
                ? 'bg-ink text-cream hover:bg-gold'
                : 'bg-beige-mid text-gray-light cursor-not-allowed',
            ].join(' ')}
          >
            진단 시작
            <ChevronRight size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
