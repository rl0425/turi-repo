/**
 * 유효성 검사 관련 상수 정의
 * 
 * 폼 유효성 검사, 입력값 제한 등과 관련된 상수들을 정의합니다.
 */

/**
 * 입력 길이 제한
 */
export const INPUT_LENGTHS = {
  // 사용자 정보
  USERNAME: {
    MIN: 3,
    MAX: 20,
  },
  DISPLAY_NAME: {
    MIN: 2,
    MAX: 50,
  },
  EMAIL: {
    MAX: 254,
  },
  PASSWORD: {
    MIN: 8,
    MAX: 128,
  },
  PHONE: {
    MIN: 10,
    MAX: 15,
  },
  
  // 반려동물 정보
  PET_NAME: {
    MIN: 1,
    MAX: 50,
  },
  PET_DESCRIPTION: {
    MIN: 10,
    MAX: 2000,
  },
  BREED_NAME: {
    MIN: 2,
    MAX: 100,
  },
  
  // 케어 관련
  ACTIVITY_TITLE: {
    MIN: 3,
    MAX: 100,
  },
  ACTIVITY_DESCRIPTION: {
    MAX: 500,
  },
  EXPENSE_TITLE: {
    MIN: 2,
    MAX: 100,
  },
  EXPENSE_DESCRIPTION: {
    MAX: 300,
  },
  
  // 일반적인 텍스트
  SHORT_TEXT: {
    MAX: 100,
  },
  MEDIUM_TEXT: {
    MAX: 500,
  },
  LONG_TEXT: {
    MAX: 2000,
  },
  
  // 메시지 및 댓글
  MESSAGE: {
    MIN: 1,
    MAX: 1000,
  },
  REVIEW: {
    MIN: 10,
    MAX: 1000,
  },
} as const;

/**
 * 숫자 범위 제한
 */
export const NUMBER_RANGES = {
  // 나이
  PET_AGE_YEARS: {
    MIN: 0,
    MAX: 30,
  },
  PET_AGE_MONTHS: {
    MIN: 0,
    MAX: 11,
  },
  HUMAN_AGE: {
    MIN: 18,
    MAX: 120,
  },
  
  // 무게 (kg)
  PET_WEIGHT: {
    MIN: 0.1,
    MAX: 100,
  },
  
  // 거리 (km)
  SEARCH_RADIUS: {
    MIN: 1,
    MAX: 100,
  },
  
  // 가격 (원)
  ADOPTION_FEE: {
    MIN: 0,
    MAX: 10000000, // 1천만원
  },
  EXPENSE_AMOUNT: {
    MIN: 0,
    MAX: 1000000, // 100만원
  },
  MONTHLY_BUDGET: {
    MIN: 10000,    // 1만원
    MAX: 10000000, // 1천만원
  },
  
  // 평점
  RATING: {
    MIN: 1,
    MAX: 5,
  },
  
  // 가족 구성원 수
  HOUSEHOLD_SIZE: {
    MIN: 1,
    MAX: 20,
  },
  
  // 자녀 나이
  CHILD_AGE: {
    MIN: 0,
    MAX: 18,
  },
  
  // 케어 시간 (분)
  ACTIVITY_DURATION: {
    MIN: 1,
    MAX: 480, // 8시간
  },
} as const;

/**
 * 정규 표현식 패턴
 */
export const REGEX_PATTERNS = {
  // 기본 패턴
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_KR: /^01[0-9]-?\d{3,4}-?\d{4}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // 한국어 관련
  KOREAN_NAME: /^[가-힣]{2,10}$/,
  KOREAN_ADDRESS: /^[가-힣0-9\s\-,.()]+$/,
  
  // 숫자 관련
  POSITIVE_INTEGER: /^\d+$/,
  POSITIVE_NUMBER: /^\d*\.?\d+$/,
  DECIMAL_TWO_PLACES: /^\d+(\.\d{1,2})?$/,
  
  // 특수 패턴
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

/**
 * 에러 메시지
 */
export const ERROR_MESSAGES = {
  // 필수 필드
  REQUIRED: '필수 입력 항목입니다.',
  
  // 길이 관련
  TOO_SHORT: (min: number) => `최소 ${min}자 이상 입력해주세요.`,
  TOO_LONG: (max: number) => `최대 ${max}자까지 입력 가능합니다.`,
  
  // 형식 관련
  INVALID_EMAIL: '올바른 이메일 형식을 입력해주세요.',
  INVALID_PHONE: '올바른 전화번호 형식을 입력해주세요.',
  INVALID_USERNAME: '사용자명은 3-20자의 영문, 숫자, 언더스코어만 가능합니다.',
  INVALID_PASSWORD: '비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.',
  INVALID_URL: '올바른 URL 형식을 입력해주세요.',
  
  // 숫자 관련
  INVALID_NUMBER: '올바른 숫자를 입력해주세요.',
  OUT_OF_RANGE: (min: number, max: number) => `${min}~${max} 범위의 값을 입력해주세요.`,
  MIN_VALUE: (min: number) => `${min} 이상의 값을 입력해주세요.`,
  MAX_VALUE: (max: number) => `${max} 이하의 값을 입력해주세요.`,
  
  // 비밀번호 관련
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  WEAK_PASSWORD: '보안을 위해 더 강한 비밀번호를 설정해주세요.',
  
  // 파일 관련
  FILE_TOO_LARGE: (maxSize: string) => `파일 크기는 ${maxSize} 이하여야 합니다.`,
  INVALID_FILE_TYPE: (allowedTypes: string) => `허용된 파일 형식: ${allowedTypes}`,
  
  // 사용자 정의
  DUPLICATE_EMAIL: '이미 사용 중인 이메일입니다.',
  DUPLICATE_USERNAME: '이미 사용 중인 사용자명입니다.',
  TERMS_REQUIRED: '이용약관에 동의해주세요.',
  PRIVACY_REQUIRED: '개인정보처리방침에 동의해주세요.',
  
  // 입양 관련
  APPLICATION_LIMIT: '동시에 신청할 수 있는 반려동물은 최대 3마리입니다.',
  INCOMPLETE_PROFILE: '프로필을 완성한 후 신청할 수 있습니다.',
  
  // 일반적인 에러
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '요청한 페이지를 찾을 수 없습니다.',
} as const;

/**
 * 성공 메시지
 */
export const SUCCESS_MESSAGES = {
  SAVED: '저장되었습니다.',
  UPDATED: '수정되었습니다.',
  DELETED: '삭제되었습니다.',
  CREATED: '생성되었습니다.',
  SENT: '전송되었습니다.',
  REGISTERED: '가입이 완료되었습니다.',
  LOGIN_SUCCESS: '로그인되었습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.',
  APPLICATION_SENT: '입양 신청이 전송되었습니다.',
  PROFILE_UPDATED: '프로필이 업데이트되었습니다.',
  PASSWORD_CHANGED: '비밀번호가 변경되었습니다.',
  EMAIL_VERIFIED: '이메일 인증이 완료되었습니다.',
} as const;

/**
 * 파일 업로드 제한
 */
export const FILE_VALIDATION = {
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_WIDTH: 2048,
    MAX_HEIGHT: 2048,
  },
  DOCUMENT: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
} as const;