/**
 * localStorage 스키마
 *   v1: { code, scores, timestamp }
 *   v2: { code, scores, demographics, timestamp }
 * v1 데이터는 demographics 가 비어 있어 자동 마이그레이트 된다.
 */

const KEY_V2 = 'tcmp.history.v2';
const KEY_V1 = 'tcmp.history.v1';
const MAX_ITEMS = 200; // 상담사 단말에서 누적 분량 고려

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readV2() {
  try {
    const raw = window.localStorage.getItem(KEY_V2);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}

function migrateV1() {
  try {
    const raw = window.localStorage.getItem(KEY_V1);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // v1 항목에 demographics 빈 필드 추가
    return parsed.map((e) => ({ ...e, demographics: null }));
  } catch { return []; }
}

export function loadHistory() {
  if (!isBrowser()) return [];
  const v2 = readV2();
  if (v2) return v2;
  // v2 키가 비어 있고 v1 데이터가 있다면 마이그레이션 후 저장
  const migrated = migrateV1();
  if (migrated.length > 0) {
    try { window.localStorage.setItem(KEY_V2, JSON.stringify(migrated)); } catch {}
  }
  return migrated;
}

export function saveResult(result, demographics = null) {
  if (!isBrowser()) return;
  try {
    const history = loadHistory();
    const entry = {
      code: result.code,
      scores: result.scores,
      demographics: demographics || null,
      timestamp: Date.now(),
    };
    const next = [entry, ...history].slice(0, MAX_ITEMS);
    window.localStorage.setItem(KEY_V2, JSON.stringify(next));
  } catch {
    /* 시크릿 모드 등에서 실패해도 결과 화면은 그대로 노출 */
  }
}

export function getLatest() {
  const h = loadHistory();
  return h.length ? h[0] : null;
}

export function clearHistory() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEY_V2);
    window.localStorage.removeItem(KEY_V1);
  } catch {}
}
