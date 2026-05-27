'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import LikertRow from '../ui/LikertRow';
import questions from '../../data/questions.json';
import indicators from '../../data/indicators.json';

/**
 * screenIndex 는 1~5 (전체 5개 질문 화면 중 몇 번째인가).
 * step 1 → screenIndex 1 (q1: Q1-4, indicator 1)
 * step 2 → screenIndex 2 (q2: Q5-8, indicator 2)
 * step 3 → screenIndex 3 (q3: Q9-12, indicator 3 part 1/2)
 * step 4 → screenIndex 4 (q4: Q13-16, indicator 3 part 2/2)
 * step 5 → screenIndex 5 (q5: Q17-20, indicator 4)
 */
const SCREENS = [
  { ids: [1, 2, 3, 4],      indicator: 1 },
  { ids: [5, 6, 7, 8],      indicator: 2 },
  { ids: [9, 10, 11, 12],   indicator: 3, part: '1/2' },
  { ids: [13, 14, 15, 16],  indicator: 3, part: '2/2' },
  { ids: [17, 18, 19, 20],  indicator: 4 },
];
const TOTAL = SCREENS.length;

export default function QuestionScreen({ screenIndex, answers, onAnswer, onPrev, onNext }) {
  const screen = SCREENS[screenIndex - 1];
  const ind = indicators[screen.indicator];
  const rows = questions.filter((q) => screen.ids.includes(q.id));

  const allAnswered = rows.every((q) => answers[q.id] >= 1);
  const isLast = screenIndex === TOTAL;

  return (
    <div className="min-h-screen px-6 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <header className="anim-fade-up">
          <ProgressBar current={screenIndex} total={TOTAL} />
          <div className="mt-10">
            <div className="flex items-baseline gap-3">
              <span className="text-[12px] font-medium tracking-[0.3em] text-gold-dark uppercase">
                지표 {screen.indicator}
              </span>
              {screen.part && (
                <span className="text-[10px] tracking-[0.25em] text-gray-light">
                  {screen.part}
                </span>
              )}
            </div>
            <h2 className="mt-3 font-display-kr text-[24px] sm:text-[30px] text-ink">
              ─ {ind.name} ─
            </h2>
            <p className="mt-1 prose-kr italic text-[14px] text-gray-mid">
              {ind.subtitle}
            </p>
          </div>
        </header>

        <div className="mt-10 sm:mt-12">
          {rows.map((q, i) => (
            <div
              key={q.id}
              className={`anim-fade-up pb-7 ${i < rows.length - 1 ? 'border-b border-beige-light mb-7' : ''}`}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="font-code italic text-gold text-[20px] leading-none pt-0.5 min-w-[1.5em]">
                  {String(q.id).padStart(2, '0')}
                </span>
                <p className="prose-kr text-[15px] sm:text-[16px] text-ink flex-1">
                  {q.text}
                </p>
              </div>
              <LikertRow
                value={answers[q.id]}
                onChange={(v) => onAnswer(q.id, v)}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={screenIndex === 1}
            className={[
              'inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-serif-kr text-[14px] border transition-colors duration-300',
              screenIndex === 1
                ? 'border-beige-mid text-gray-light cursor-not-allowed'
                : 'border-ink text-ink hover:bg-ink hover:text-cream',
            ].join(' ')}
          >
            <ChevronLeft size={14} strokeWidth={1.75} />
            이전
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!allAnswered}
            className={[
              'inline-flex items-center gap-2 rounded-full px-7 py-3 font-serif-kr text-[15px] transition-colors duration-300',
              allAnswered
                ? 'bg-ink text-cream hover:bg-gold'
                : 'bg-beige-mid text-gray-light cursor-not-allowed',
            ].join(' ')}
          >
            {isLast ? '결과 확인' : '다음'}
            <ChevronRight size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
