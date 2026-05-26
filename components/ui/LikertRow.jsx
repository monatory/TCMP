'use client';

const VALUES = [1, 2, 3, 4, 5];

export default function LikertRow({ value, onChange }) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-2">
        <span className="hidden sm:inline text-[11px] tracking-[0.15em] text-gray-light whitespace-nowrap">전혀 그렇지 않다</span>
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-1">
          {VALUES.map((v) => {
            const selected = value === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onChange(v)}
                aria-label={`${v}점`}
                aria-pressed={selected}
                className={[
                  'w-10 h-10 rounded-full border transition-all duration-200',
                  'font-code text-[15px]',
                  selected
                    ? 'bg-ink text-cream border-ink scale-110 shadow-sm'
                    : 'bg-transparent text-gray-dark border-beige-dark hover:border-ink',
                ].join(' ')}
              >
                {v}
              </button>
            );
          })}
        </div>
        <span className="hidden sm:inline text-[11px] tracking-[0.15em] text-gray-light whitespace-nowrap">매우 그렇다</span>
      </div>
      <div className="flex sm:hidden justify-between mt-2 px-1 text-[10px] tracking-[0.15em] text-gray-light">
        <span>전혀 그렇지 않다</span>
        <span>매우 그렇다</span>
      </div>
    </div>
  );
}
