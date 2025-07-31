/**
 * 반려동물 관련 상수 정의
 * 
 * 반려동물 종류, 품종, 크기 등과 관련된 상수들을 정의합니다.
 */

/**
 * 반려동물 종류
 */
export const PET_SPECIES = {
  DOG: 'dog',
  CAT: 'cat',
  RABBIT: 'rabbit',
  BIRD: 'bird',
  HAMSTER: 'hamster',
  OTHER: 'other',
} as const;

/**
 * 반려동물 종류별 한국어 표시명
 */
export const PET_SPECIES_LABELS = {
  [PET_SPECIES.DOG]: '개',
  [PET_SPECIES.CAT]: '고양이',
  [PET_SPECIES.RABBIT]: '토끼',
  [PET_SPECIES.BIRD]: '새',
  [PET_SPECIES.HAMSTER]: '햄스터',
  [PET_SPECIES.OTHER]: '기타',
} as const;

/**
 * 반려동물 크기
 */
export const PET_SIZES = {
  EXTRA_SMALL: 'extra-small',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extra-large',
} as const;

/**
 * 반려동물 크기별 한국어 표시명
 */
export const PET_SIZE_LABELS = {
  [PET_SIZES.EXTRA_SMALL]: '초소형',
  [PET_SIZES.SMALL]: '소형',
  [PET_SIZES.MEDIUM]: '중형',
  [PET_SIZES.LARGE]: '대형',
  [PET_SIZES.EXTRA_LARGE]: '초대형',
} as const;

/**
 * 반려동물 크기별 무게 범위 (kg)
 */
export const PET_SIZE_WEIGHT_RANGES = {
  [PET_SIZES.EXTRA_SMALL]: { min: 0, max: 3 },
  [PET_SIZES.SMALL]: { min: 3, max: 10 },
  [PET_SIZES.MEDIUM]: { min: 10, max: 25 },
  [PET_SIZES.LARGE]: { min: 25, max: 45 },
  [PET_SIZES.EXTRA_LARGE]: { min: 45, max: 100 },
} as const;

/**
 * 반려동물 연령대
 */
export const PET_AGE_GROUPS = {
  PUPPY: 'puppy',
  YOUNG: 'young',
  ADULT: 'adult',
  SENIOR: 'senior',
} as const;

/**
 * 반려동물 연령대별 한국어 표시명
 */
export const PET_AGE_GROUP_LABELS = {
  [PET_AGE_GROUPS.PUPPY]: '새끼',
  [PET_AGE_GROUPS.YOUNG]: '어린',
  [PET_AGE_GROUPS.ADULT]: '성인',
  [PET_AGE_GROUPS.SENIOR]: '노령',
} as const;

/**
 * 반려동물 성별
 */
export const PET_GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
  UNKNOWN: 'unknown',
} as const;

/**
 * 성별별 한국어 표시명
 */
export const PET_GENDER_LABELS = {
  [PET_GENDERS.MALE]: '수컷',
  [PET_GENDERS.FEMALE]: '암컷',
  [PET_GENDERS.UNKNOWN]: '미상',
} as const;

/**
 * 입양 상태
 */
export const ADOPTION_STATUS = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  ADOPTED: 'adopted',
  UNAVAILABLE: 'unavailable',
} as const;

/**
 * 입양 상태별 한국어 표시명
 */
export const ADOPTION_STATUS_LABELS = {
  [ADOPTION_STATUS.AVAILABLE]: '입양 가능',
  [ADOPTION_STATUS.PENDING]: '입양 대기',
  [ADOPTION_STATUS.ADOPTED]: '입양 완료',
  [ADOPTION_STATUS.UNAVAILABLE]: '입양 불가',
} as const;

/**
 * 건강 상태
 */
export const HEALTH_STATUS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  NEEDS_ATTENTION: 'needs-attention',
  SPECIAL_CARE: 'special-care',
} as const;

/**
 * 건강 상태별 한국어 표시명
 */
export const HEALTH_STATUS_LABELS = {
  [HEALTH_STATUS.EXCELLENT]: '매우 좋음',
  [HEALTH_STATUS.GOOD]: '좋음',
  [HEALTH_STATUS.FAIR]: '보통',
  [HEALTH_STATUS.NEEDS_ATTENTION]: '관심 필요',
  [HEALTH_STATUS.SPECIAL_CARE]: '특별 관리',
} as const;

/**
 * 성격 특성
 */
export const PERSONALITY_TRAITS = {
  FRIENDLY: 'friendly',
  PLAYFUL: 'playful',
  CALM: 'calm',
  ENERGETIC: 'energetic',
  AFFECTIONATE: 'affectionate',
  INDEPENDENT: 'independent',
  SOCIAL: 'social',
  SHY: 'shy',
  PROTECTIVE: 'protective',
  GENTLE: 'gentle',
} as const;

/**
 * 성격 특성별 한국어 표시명
 */
export const PERSONALITY_TRAIT_LABELS = {
  [PERSONALITY_TRAITS.FRIENDLY]: '친화적',
  [PERSONALITY_TRAITS.PLAYFUL]: '장난기 많은',
  [PERSONALITY_TRAITS.CALM]: '온순한',
  [PERSONALITY_TRAITS.ENERGETIC]: '활발한',
  [PERSONALITY_TRAITS.AFFECTIONATE]: '애정이 많은',
  [PERSONALITY_TRAITS.INDEPENDENT]: '독립적인',
  [PERSONALITY_TRAITS.SOCIAL]: '사교적인',
  [PERSONALITY_TRAITS.SHY]: '수줍은',
  [PERSONALITY_TRAITS.PROTECTIVE]: '보호 본능이 있는',
  [PERSONALITY_TRAITS.GENTLE]: '온화한',
} as const;

/**
 * 주거 환경 타입
 */
export const LIVING_SPACES = {
  APARTMENT: 'apartment',
  HOUSE: 'house',
  FARM: 'farm',
  OTHER: 'other',
} as const;

/**
 * 주거 환경별 한국어 표시명
 */
export const LIVING_SPACE_LABELS = {
  [LIVING_SPACES.APARTMENT]: '아파트',
  [LIVING_SPACES.HOUSE]: '주택',
  [LIVING_SPACES.FARM]: '농장',
  [LIVING_SPACES.OTHER]: '기타',
} as const;

/**
 * 활동 수준
 */
export const ACTIVITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

/**
 * 활동 수준별 한국어 표시명
 */
export const ACTIVITY_LEVEL_LABELS = {
  [ACTIVITY_LEVELS.LOW]: '낮음',
  [ACTIVITY_LEVELS.MEDIUM]: '보통',
  [ACTIVITY_LEVELS.HIGH]: '높음',
} as const;

/**
 * 경험 수준
 */
export const EXPERIENCE_LEVELS = {
  NONE: 'none',
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  EXPERIENCED: 'experienced',
} as const;

/**
 * 경험 수준별 한국어 표시명
 */
export const EXPERIENCE_LEVEL_LABELS = {
  [EXPERIENCE_LEVELS.NONE]: '없음',
  [EXPERIENCE_LEVELS.BEGINNER]: '초보자',
  [EXPERIENCE_LEVELS.INTERMEDIATE]: '중급자',
  [EXPERIENCE_LEVELS.EXPERIENCED]: '숙련자',
} as const;

/**
 * 반려동물 색상 옵션
 */
export const PET_COLORS = {
  // 기본 색상
  BLACK: 'black',
  WHITE: 'white',
  BROWN: 'brown',
  GRAY: 'gray',
  GOLDEN: 'golden',
  CREAM: 'cream',
  
  // 패턴
  TABBY: 'tabby',
  SPOTTED: 'spotted',
  STRIPED: 'striped',
  MIXED: 'mixed',
} as const;

/**
 * 색상별 한국어 표시명
 */
export const PET_COLOR_LABELS = {
  [PET_COLORS.BLACK]: '검정',
  [PET_COLORS.WHITE]: '흰색',
  [PET_COLORS.BROWN]: '갈색',
  [PET_COLORS.GRAY]: '회색',
  [PET_COLORS.GOLDEN]: '황금색',
  [PET_COLORS.CREAM]: '크림색',
  [PET_COLORS.TABBY]: '태비',
  [PET_COLORS.SPOTTED]: '점박이',
  [PET_COLORS.STRIPED]: '줄무늬',
  [PET_COLORS.MIXED]: '혼합',
} as const;

/**
 * 입양 신청 상태
 */
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
} as const;

/**
 * 입양 신청 상태별 한국어 표시명
 */
export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.PENDING]: '검토 중',
  [APPLICATION_STATUS.APPROVED]: '승인됨',
  [APPLICATION_STATUS.REJECTED]: '거절됨',
  [APPLICATION_STATUS.WITHDRAWN]: '철회됨',
} as const;

/**
 * 의료 기록 타입
 */
export const MEDICAL_RECORD_TYPES = {
  VACCINATION: 'vaccination',
  SURGERY: 'surgery',
  CHECKUP: 'checkup',
  TREATMENT: 'treatment',
  MEDICATION: 'medication',
} as const;

/**
 * 의료 기록 타입별 한국어 표시명
 */
export const MEDICAL_RECORD_TYPE_LABELS = {
  [MEDICAL_RECORD_TYPES.VACCINATION]: '예방접종',
  [MEDICAL_RECORD_TYPES.SURGERY]: '수술',
  [MEDICAL_RECORD_TYPES.CHECKUP]: '건강검진',
  [MEDICAL_RECORD_TYPES.TREATMENT]: '치료',
  [MEDICAL_RECORD_TYPES.MEDICATION]: '투약',
} as const;