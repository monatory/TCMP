import indicators from '../data/indicators.json';
import codesData from '../data/codes.json';
import { DEMOGRAPHIC_FIELDS, labelFor } from './demographics';

/**
 * 응답 이력을 Excel 호환 CSV(UTF-8 BOM) 문자열로 변환.
 */
export function historyToCsv(history) {
  const rows = [];

  // 헤더
  const header = [
    '응답일시', '코드', '영역', '닉네임',
    ...DEMOGRAPHIC_FIELDS.map((f) => f.label),
    '지표1 사고와 성찰', '지표2 행동과 실행', '지표3 위기와 성장', '지표4 관계와 확장',
    '빛 글자수',
  ];
  rows.push(header);

  // 본문
  for (const e of history) {
    const date = new Date(e.timestamp);
    const dateStr = formatDate(date);
    const codeMeta = codesData[e.code];
    const zoneLabel = codeMeta ? labelOfZone(codeMeta.zone) : '';
    const nickname = codeMeta ? codeMeta.nickname : '';
    const lightCount = (e.code || '').split('').filter((l) => 'MEGC'.includes(l)).length;
    const demo = e.demographics || {};

    rows.push([
      dateStr,
      e.code || '',
      zoneLabel,
      nickname,
      ...DEMOGRAPHIC_FIELDS.map((f) => labelFor(f.key, demo[f.key])),
      e.scores?.[1] ?? '',
      e.scores?.[2] ?? '',
      e.scores?.[3] ?? '',
      e.scores?.[4] ?? '',
      lightCount,
    ]);
  }

  const csv = rows.map(rowToCsvLine).join('\r\n');
  // BOM(U+FEFF)을 앞에 붙여서 Excel에서 한글이 깨지지 않게 (escape 형태로 안전하게)
  return '﻿' + csv;
}

function rowToCsvLine(row) {
  return row.map(escapeField).join(',');
}

function escapeField(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  // 콤마·따옴표·개행 포함 시 따옴표로 감싸고 내부 따옴표는 두 번
  if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function formatDate(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function labelOfZone(zoneKey) {
  return indicators.zones?.[zoneKey]?.label || zoneKey || '';
}

/**
 * 브라우저에서 CSV 파일 다운로드 트리거.
 */
export function downloadCsv(filename, csvString) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
