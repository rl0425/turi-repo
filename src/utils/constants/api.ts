/**
 * API 관련 상수 정의
 * 
 * API 엔드포인트, HTTP 상태 코드, 타임아웃 등 API 통신과 관련된 상수들을 정의합니다.
 */

/**
 * API 기본 설정
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
export const API_VERSION = 'v1';
export const API_TIMEOUT = 30000; // 30초

/**
 * 외부 서비스 설정
 */
export const EXTERNAL_SERVICES = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
} as const;

/**
 * HTTP 상태 코드
 */
export const HTTP_STATUS = {
  // 성공
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // 클라이언트 에러
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // 서버 에러
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * API 엔드포인트
 */
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },
  
  // 사용자
  USERS: {
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    FAVORITES: '/users/favorites',
    SEARCH_HISTORY: '/users/search-history',
    APPLICATIONS: '/users/applications',
    STATISTICS: '/users/statistics',
  },
  
  // 반려동물
  PETS: {
    SEARCH: '/pets/search',
    DETAIL: '/pets',  // /pets/{id}
    RECOMMENDATIONS: '/pets/recommendations',
    SIMILAR: '/pets/{id}/similar',
    APPLY: '/pets/{id}/apply',
    BREEDS: '/pets/breeds',
    SPECIES: '/pets/species',
  },
  
  // 보호소
  SHELTERS: {
    LIST: '/shelters',
    DETAIL: '/shelters',  // /shelters/{id}
    PETS: '/shelters/{id}/pets',
    CONTACT: '/shelters/{id}/contact',
  },
  
  // 케어 시스템
  CARE: {
    ACTIVITIES: '/care/activities',
    EXPENSES: '/care/expenses',
    BUDGET: '/care/budget',
    STATISTICS: '/care/statistics',
    REMINDERS: '/care/reminders',
    TEMPLATES: '/care/templates',
    SCENARIOS: '/care/scenarios',
    SIMULATIONS: '/care/simulations',
  },
  
  // 알림
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/{id}/read',
    MARK_ALL_READ: '/notifications/read-all',
    SETTINGS: '/notifications/settings',
  },
  
  // 파일 업로드
  UPLOAD: {
    IMAGE: '/upload/image',
    DOCUMENT: '/upload/document',
    AVATAR: '/upload/avatar',
  },
  
  // 검색
  SEARCH: {
    SUGGESTIONS: '/search/suggestions',
    HISTORY: '/search/history',
    SAVED: '/search/saved',
  },
  
  // 리뷰 및 평점
  REVIEWS: {
    LIST: '/reviews',
    CREATE: '/reviews',
    UPDATE: '/reviews/{id}',
    DELETE: '/reviews/{id}',
  },
  
  // 관리자
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    PETS: '/admin/pets',
    SHELTERS: '/admin/shelters',
    REPORTS: '/admin/reports',
  },
} as const;

/**
 * API 에러 코드
 */
export const API_ERROR_CODES = {
  // 인증 관련
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  
  // 권한 관련
  AUTHORIZATION_DENIED: 'AUTHORIZATION_DENIED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // 리소스 관련
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  
  // 유효성 검사
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // 비즈니스 로직
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  
  // 시스템 관련
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR: 'SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  
  // 파일 업로드
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
} as const;

/**
 * HTTP 헤더
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  AUTHORIZATION: 'Authorization',
  X_REQUEST_ID: 'X-Request-ID',
  X_API_KEY: 'X-API-Key',
  X_CLIENT_VERSION: 'X-Client-Version',
  X_DEVICE_ID: 'X-Device-ID',
} as const;

/**
 * 컨텐츠 타입
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
} as const;

/**
 * 캐시 설정
 */
export const CACHE_SETTINGS = {
  STALE_TIME: {
    SHORT: 5 * 60 * 1000,      // 5분
    MEDIUM: 15 * 60 * 1000,    // 15분
    LONG: 60 * 60 * 1000,      // 1시간
    VERY_LONG: 24 * 60 * 60 * 1000, // 24시간
  },
  CACHE_TIME: {
    SHORT: 10 * 60 * 1000,     // 10분
    MEDIUM: 30 * 60 * 1000,    // 30분
    LONG: 2 * 60 * 60 * 1000,  // 2시간
    VERY_LONG: 24 * 60 * 60 * 1000, // 24시간
  },
} as const;

/**
 * 재시도 설정
 */
export const RETRY_SETTINGS = {
  MAX_RETRIES: 3,
  BASE_DELAY: 1000,          // 1초
  MAX_DELAY: 30000,          // 30초
  BACKOFF_MULTIPLIER: 2,
  RETRY_STATUS_CODES: [500, 502, 503, 504],
} as const;

/**
 * Rate Limiting
 */
export const RATE_LIMITS = {
  SEARCH_PER_MINUTE: 60,
  API_CALLS_PER_MINUTE: 1000,
  FILE_UPLOADS_PER_HOUR: 50,
  PASSWORD_RESET_PER_HOUR: 5,
} as const;