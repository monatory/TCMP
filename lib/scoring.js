import questions from '../data/questions.json';
import indicators from '../data/indicators.json';
import codes from '../data/codes.json';

/**
 * answers: { [questionId: number]: 1~5 }
 * 누락된 키는 0 으로 간주(채점에서 제외)되며,
 * reverse 문항의 경우 6-raw 로 변환하되 raw=0 은 건너뛴다.
 */
export function calculateResult(answers) {
  const scores = { 1: 0, 2: 0, 3: 0, 4: 0 };

  for (const q of questions) {
    const raw = answers?.[q.id] ?? 0;
    if (raw === 0) continue;
    const value = q.reverse ? 6 - raw : raw;
    scores[q.indicator] += value;
  }

  const letters = [1, 2, 3, 4].map((i) => {
    const meta = indicators[i];
    return scores[i] >= meta.cutoff ? meta.light : meta.dark;
  });

  const code = letters.join('');
  const data = codes[code];

  return { code, letters, scores, data };
}

export function getZoneFromLetters(letters) {
  const lightLetters = new Set(['M', 'E', 'G', 'C']);
  const lightCount = letters.filter((l) => lightLetters.has(l)).length;
  if (lightCount === 4) return 'light';
  if (lightCount === 3) return 'mostlyLight';
  if (lightCount === 2) return 'balanced';
  if (lightCount === 1) return 'mostlyDark';
  return 'dark';
}

export function getZoneMeta(zoneKey) {
  return indicators.zones[zoneKey];
}

/**
 * 5영역 스펙트럼에서 마커 위치(0~100%)
 */
export function getSpectrumPercent(zoneKey) {
  const order = indicators.zones[zoneKey]?.order ?? 2;
  return (order / 4) * 100;
}
