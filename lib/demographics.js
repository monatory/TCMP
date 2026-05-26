/**
 * 인구통계 입력 옵션 + 라벨 변환.
 * - 사용자 요청 4종(성별, 연령, 직업, 학력) 기반.
 * - 청소년 ~ 노년까지 커버하도록 옵션 보강.
 * - "응답하지 않음" 옵션을 둬서 민감 정보 강제 입력을 피한다.
 */

export const DEMOGRAPHIC_FIELDS = [
  {
    key: 'gender',
    label: '성별',
    options: [
      { value: 'female', label: '여성' },
      { value: 'male', label: '남성' },
      { value: 'na', label: '응답하지 않음' },
    ],
  },
  {
    key: 'age',
    label: '연령대',
    options: [
      { value: 'teen',  label: '10대' },
      { value: '20s',   label: '20대' },
      { value: '30_40', label: '30 ~ 40대' },
      { value: '50_60', label: '50 ~ 60대' },
      { value: '70_80', label: '70 ~ 80대' },
    ],
  },
  {
    key: 'occupation',
    label: '직업',
    options: [
      { value: 'student',    label: '학생' },
      { value: 'employed',   label: '재직중' },
      { value: 'seeking',    label: '구직중' },
      { value: 'unemployed', label: '무직' },
      { value: 'career_dev', label: '경력관리 (이·전직 준비)' },
      { value: 'other',      label: '기타' },
    ],
  },
  {
    key: 'education',
    label: '학력',
    options: [
      { value: 'middle_high', label: '중·고등학생' },
      { value: 'high',        label: '고졸' },
      { value: 'college',     label: '전문대졸' },
      { value: 'university',  label: '대학교졸' },
      { value: 'graduate',    label: '대학원졸' },
      { value: 'other',       label: '기타' },
    ],
  },
];

/**
 * value → 라벨 변환 (관리자 페이지·CSV 출력용).
 */
export function labelFor(fieldKey, value) {
  const f = DEMOGRAPHIC_FIELDS.find((x) => x.key === fieldKey);
  if (!f) return value ?? '';
  const o = f.options.find((x) => x.value === value);
  return o ? o.label : (value ?? '');
}

/**
 * 빈 인구통계 객체.
 */
export function emptyDemographics() {
  return Object.fromEntries(DEMOGRAPHIC_FIELDS.map((f) => [f.key, null]));
}

/**
 * 모든 필드가 채워졌는지 (필수).
 */
export function isComplete(d) {
  if (!d) return false;
  return DEMOGRAPHIC_FIELDS.every((f) => d[f.key]);
}
