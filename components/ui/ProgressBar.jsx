'use client';

export default function ProgressBar({ current, total, label = 'TUNNEL · CAVE' }) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  const cur = String(current).padStart(2, '0');
  const tot = String(total).padStart(2, '0');
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[11px] font-medium tracking-[0.3em] text-gray-mid mb-3">
        <span className="font-code text-[13px] tracking-[0.2em] text-gray-dark">{cur} / {tot}</span>
        <span>{label}</span>
      </div>
      <div className="h-px w-full bg-beige-mid relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-px bg-gold transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
