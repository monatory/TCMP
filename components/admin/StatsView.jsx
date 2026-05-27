'use client';

import { useMemo, useState } from 'react';
import { Download, RefreshCw, Trash2, ArrowLeft, ChevronDown } from 'lucide-react';
import indicators from '../../data/indicators.json';
import codesData from '../../data/codes.json';
import { DEMOGRAPHIC_FIELDS, labelFor } from '../../lib/demographics';
import { historyToCsv, downloadCsv } from '../../lib/csv';
import { clearHistory } from '../../lib/storage';

const ZONE_ORDER = ['light', 'mostlyLight', 'balanced', 'mostlyDark', 'dark'];

export default function StatsView({ history, onRefresh }) {
  const total = history.length;

  // 코드별 분포
  const codeDist = useMemo(() => {
    const map = {};
    for (const e of history) map[e.code] = (map[e.code] || 0) + 1;
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [history]);

  // 영역별 분포
  const zoneDist = useMemo(() => {
    const map = Object.fromEntries(ZONE_ORDER.map((z) => [z, 0]));
    for (const e of history) {
      const data = codesData[e.code];
      if (data?.zone && map[data.zone] !== undefined) map[data.zone]++;
    }
    return ZONE_ORDER.map((z) => ({ key: z, label: indicators.zones[z].label, count: map[z] }));
  }, [history]);

  // 지표별 평균
  const indicatorAvg = useMemo(() => {
    if (total === 0) return [0, 0, 0, 0].map((_, i) => ({ id: i + 1, avg: 0 }));
    const sum = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const e of history) {
      for (const k of [1, 2, 3, 4]) sum[k] += e.scores?.[k] || 0;
    }
    return [1, 2, 3, 4].map((id) => ({
      id,
      avg: sum[id] / total,
      max: indicators[id].max,
      name: indicators[id].name,
      cutoff: indicators[id].cutoff,
    }));
  }, [history, total]);

  // 인구통계별 분포
  const demoDist = useMemo(() => {
    return DEMOGRAPHIC_FIELDS.map((f) => {
      const map = {};
      let answered = 0;
      for (const e of history) {
        const v = e.demographics?.[f.key];
        if (v) {
          map[v] = (map[v] || 0) + 1;
          answered++;
        }
      }
      return {
        key: f.key,
        label: f.label,
        answered,
        rows: f.options
          .map((o) => ({ value: o.value, label: o.label, count: map[o.value] || 0 }))
          .filter((r) => r.count > 0)
          .sort((a, b) => b.count - a.count),
      };
    });
  }, [history]);

  // 인구통계 × 영역 교차표 (옵션별 영역 분포)
  const demoZoneCross = useMemo(() => {
    return DEMOGRAPHIC_FIELDS.map((f) => {
      const rows = [];
      for (const opt of f.options) {
        const zoneCounts = Object.fromEntries(ZONE_ORDER.map((z) => [z, 0]));
        let rowTotal = 0;
        for (const e of history) {
          if (e.demographics?.[f.key] !== opt.value) continue;
          const zone = codesData[e.code]?.zone;
          if (zone && zoneCounts[zone] !== undefined) {
            zoneCounts[zone]++;
            rowTotal++;
          }
        }
        if (rowTotal > 0) {
          rows.push({ value: opt.value, label: opt.label, total: rowTotal, zoneCounts });
        }
      }
      // 응답 많은 옵션부터
      rows.sort((a, b) => b.total - a.total);
      return { key: f.key, label: f.label, rows };
    }).filter((d) => d.rows.length > 0);
  }, [history]);

  function handleDownload() {
    const csv = historyToCsv(history);
    const ts = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const name = `tcmp_${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}.csv`;
    downloadCsv(name, csv);
  }

  const [confirmingClear, setConfirmingClear] = useState(false);
  function handleClear() {
    if (!confirmingClear) {
      setConfirmingClear(true);
      setTimeout(() => setConfirmingClear(false), 4000);
      return;
    }
    clearHistory();
    setConfirmingClear(false);
    onRefresh?.();
  }

  return (
    <div className="min-h-screen px-6 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl">
        <header className="anim-fade-up flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-gray-mid">ADMIN · TCMP</div>
            <h1 className="mt-2 font-display-kr text-[26px] sm:text-[32px] text-ink">
              ─ 응답 통계 ─
            </h1>
            <p className="mt-2 prose-kr italic text-[13px] text-gray-mid">
              이 단말에 누적된 응답 {total}건의 집계입니다.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-beige-dark text-gray-text px-4 py-2 font-serif-kr text-[12px] hover:border-ink transition-colors"
            >
              <ArrowLeft size={12} strokeWidth={1.75} />
              진단으로
            </a>
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 rounded-full border border-beige-dark text-gray-text px-4 py-2 font-serif-kr text-[12px] hover:border-ink transition-colors"
            >
              <RefreshCw size={12} strokeWidth={1.75} />
              새로고침
            </button>
          </div>
        </header>

        {/* 액션 영역 */}
        <div className="mt-8 flex flex-wrap items-center gap-3 anim-fade-up">
          <button
            onClick={handleDownload}
            disabled={total === 0}
            className={[
              'inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-serif-kr text-[13px] transition-colors duration-300',
              total === 0
                ? 'bg-beige-mid text-gray-light cursor-not-allowed'
                : 'bg-ink text-cream hover:bg-gold',
            ].join(' ')}
          >
            <Download size={14} strokeWidth={1.75} />
            CSV 다운로드 (Excel 호환)
          </button>

          <button
            onClick={handleClear}
            disabled={total === 0}
            className={[
              'inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-serif-kr text-[13px] border transition-colors duration-300',
              total === 0
                ? 'border-beige-mid text-gray-light cursor-not-allowed'
                : confirmingClear
                  ? 'border-shadow bg-shadow text-cream'
                  : 'border-beige-dark text-gray-dark hover:border-ink',
            ].join(' ')}
          >
            <Trash2 size={13} strokeWidth={1.75} />
            {confirmingClear ? '한 번 더 누르면 삭제됩니다' : '응답 데이터 초기화'}
          </button>
        </div>

        {total === 0 ? (
          <div className="mt-16 text-center prose-kr text-gray-mid">
            아직 누적된 응답이 없습니다.
          </div>
        ) : (
          <>
            {/* 요약 카드 */}
            <div className="mt-10 grid grid-cols-3 gap-3 anim-fade-up">
              <SummaryCard label="총 응답" value={total} />
              <SummaryCard label="고유 코드" value={codeDist.length} />
              <SummaryCard
                label="가장 많은 영역"
                value={zoneDist.reduce((m, z) => (z.count > m.count ? z : m), zoneDist[0]).label}
                small
              />
            </div>

            {/* 영역별 분포 — 기본 펼침 */}
            <Block title="영역별 분포" defaultOpen>
              {zoneDist.map((z) => (
                <BarRow
                  key={z.key}
                  label={z.label}
                  count={z.count}
                  total={total}
                />
              ))}
            </Block>

            {/* 코드별 분포 */}
            <Block title="코드별 분포" meta={`16종 중 ${codeDist.length}종 응답`}>
              {codeDist.map(([code, count]) => (
                <BarRow
                  key={code}
                  label={
                    <span>
                      <span className="font-code italic text-[16px] text-ink tracking-wider mr-2">{code}</span>
                      <span className="text-gray-mid text-[12px]">{codesData[code]?.nickname || ''}</span>
                    </span>
                  }
                  count={count}
                  total={total}
                />
              ))}
            </Block>

            {/* 지표 평균 */}
            <Block title="지표별 평균 점수">
              {indicatorAvg.map((d) => (
                <IndicatorAvgRow key={d.id} {...d} />
              ))}
            </Block>

            {/* 인구통계 × 영역 교차 */}
            {demoZoneCross.length > 0 && (
              <Block title="인구통계 × 영역 분포">
                <ZoneLegend />
                <div className="space-y-7 mt-2">
                  {demoZoneCross.map((d) => (
                    <div key={d.key}>
                      <div className="text-[12px] tracking-[0.2em] text-gray-mid mb-3">
                        {d.label}
                      </div>
                      <div className="space-y-3">
                        {d.rows.map((r) => (
                          <ZoneStackRow
                            key={r.value}
                            label={r.label}
                            total={r.total}
                            zoneCounts={r.zoneCounts}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {/* 인구통계별 분포 */}
            <Block title="응답자 인구통계">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                {demoDist.map((d) => (
                  <div key={d.key}>
                    <div className="text-[12px] tracking-[0.2em] text-gray-mid mb-3">
                      {d.label} <span className="text-gray-light">· {d.answered}건 응답</span>
                    </div>
                    {d.rows.length === 0 ? (
                      <p className="text-[12px] text-gray-light">응답 없음</p>
                    ) : (
                      d.rows.map((r) => (
                        <BarRow
                          key={r.value}
                          label={r.label}
                          count={r.count}
                          total={d.answered}
                          small
                        />
                      ))
                    )}
                  </div>
                ))}
              </div>
            </Block>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, small = false }) {
  return (
    <div className="rounded-2xl border border-beige-dark bg-cream/40 px-3 py-5 text-center flex flex-col items-center justify-center">
      <div className={[
        'text-ink leading-tight break-keep',
        small
          ? 'font-display-kr text-[15px] sm:text-[17px]'
          : 'font-code text-[32px] sm:text-[36px] leading-none',
      ].join(' ')}>
        {value}
      </div>
      <div className="mt-2 text-[10px] tracking-[0.25em] text-gray-mid break-keep">{label}</div>
    </div>
  );
}

function Block({ title, meta, defaultOpen = false, children }) {
  return (
    <details
      open={defaultOpen}
      className="group mt-6 anim-fade-up border-t border-beige-dark/60 [&[open]]:border-ink/20"
    >
      <summary
        className="list-none cursor-pointer select-none flex items-center justify-between gap-3 py-5 [&::-webkit-details-marker]:hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-ink/30 rounded"
      >
        <div className="flex items-baseline gap-3 min-w-0 flex-1">
          <span className="inline-block w-[3px] h-4 bg-gold shrink-0 self-center" aria-hidden />
          <h2 className="font-display-kr text-[17px] sm:text-[19px] text-ink truncate">
            {title}
          </h2>
          {meta && (
            <span className="text-[11px] tracking-[0.15em] text-gray-mid whitespace-nowrap">
              {meta}
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          className="text-gray-mid transition-transform duration-300 group-open:rotate-180 shrink-0"
          aria-hidden
        />
      </summary>
      <div className="pt-2 pb-6 space-y-3">{children}</div>
    </details>
  );
}

function BarRow({ label, count, total, small = false }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className={small ? 'pb-2' : 'pb-2.5'}>
      <div className="flex items-baseline justify-between mb-1.5">
        <div className={small ? 'text-[12px] text-gray-text' : 'text-[13px] text-gray-text'}>
          {label}
        </div>
        <div className="font-code text-[12px] text-gray-dark">
          {count} <span className="text-gray-light">· {pct.toFixed(0)}%</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-beige-mid rounded-full overflow-hidden">
        <div
          className="h-full bg-gold transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function IndicatorAvgRow({ id, avg, max, name, cutoff }) {
  const pct = max > 0 ? (avg / max) * 100 : 0;
  const cutoffPct = max > 0 ? (cutoff / max) * 100 : 0;
  const isLight = avg >= cutoff;
  return (
    <div className="pb-2.5">
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="text-[13px] text-gray-text">
          <span className="font-code italic text-[16px] text-ink mr-2">{id}</span>
          {name}
        </div>
        <div className="font-code text-[12px] text-gray-dark">
          평균 {avg.toFixed(1)} <span className="text-gray-light">/ {max}</span>
        </div>
      </div>
      <div className="relative h-1.5 w-full bg-beige-mid rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-700 ease-out ${isLight ? 'bg-gold' : 'bg-shadow'}`}
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-[-3px] bottom-[-3px] w-px bg-ink/40"
          style={{ left: `${cutoffPct}%` }}
        />
      </div>
      <div className="mt-1 text-[10px] tracking-[0.15em] text-gray-light">
        기준선 {cutoff} · 평균 {isLight ? '이상' : '미만'}
      </div>
    </div>
  );
}

function ZoneLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-1 text-[10px] tracking-[0.15em] text-gray-mid">
      {ZONE_ORDER.map((z) => (
        <span key={z} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: indicators.zones[z].color }}
          />
          {indicators.zones[z].label}
        </span>
      ))}
    </div>
  );
}

function ZoneStackRow({ label, total, zoneCounts }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5 gap-3">
        <div className="text-[13px] text-gray-text truncate">{label}</div>
        <div className="font-code text-[12px] text-gray-dark whitespace-nowrap">
          {total} <span className="text-gray-light">건</span>
        </div>
      </div>
      <div className="relative h-2 w-full bg-beige-mid/60 rounded-full overflow-hidden flex">
        {ZONE_ORDER.map((z) => {
          const c = zoneCounts[z] || 0;
          if (c === 0) return null;
          const pct = (c / total) * 100;
          const zoneMeta = indicators.zones[z];
          return (
            <div
              key={z}
              className="h-full transition-all duration-700 ease-out"
              style={{ width: `${pct}%`, backgroundColor: zoneMeta.color }}
              title={`${zoneMeta.label}: ${c}건 (${pct.toFixed(0)}%)`}
            />
          );
        })}
      </div>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] tracking-[0.1em] text-gray-light">
        {ZONE_ORDER.map((z) => {
          const c = zoneCounts[z] || 0;
          if (c === 0) return null;
          const pct = (c / total) * 100;
          return (
            <span key={z}>
              {indicators.zones[z].label} {c}
              <span className="text-gray-light/70"> · {pct.toFixed(0)}%</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

// 인구통계 라벨 변환은 lib/demographics 의 labelFor 를 사용하지만
// 여기서는 옵션의 label 을 직접 가져왔으므로 별도 변환 불필요.
// (변환이 필요한 곳: CSV 다운로드 → lib/csv 가 처리)
export { labelFor };
