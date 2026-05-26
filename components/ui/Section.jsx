'use client';

/**
 * 결과 화면의 본문 섹션.
 * label: 작은 UPPERCASE 라벨 (gray-mid 또는 accent === 'gold' 일 때 gold)
 * children: 본문 (Noto Serif KR line-height 1.85)
 */
export default function Section({ label, accent = false, children, className = '' }) {
  return (
    <section className={`mb-8 ${className}`}>
      <div
        className={[
          'text-[11px] font-medium tracking-[0.3em] mb-3',
          accent ? 'text-gold' : 'text-gray-mid',
        ].join(' ')}
      >
        {label}
      </div>
      <div className="prose-kr text-[15px] sm:text-[16px] text-gray-text">
        {children}
      </div>
    </section>
  );
}
