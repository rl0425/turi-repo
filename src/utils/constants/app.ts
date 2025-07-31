/**
 * 애플리케이션 전반적인 상수 정의
 * 
 * 앱 이름, 버전, 기본 설정 등 애플리케이션 전체에서 사용되는 상수들을 정의합니다.
 */

/**
 * 애플리케이션 기본 정보
 */
export const APP_NAME = 'PawWise' as const;
export const APP_DESCRIPTION = '반려동물 입양을 위한 맞춤형 플랫폼' as const;
export const APP_VERSION = '1.0.0' as const;
export const APP_AUTHOR = 'PawWise Team' as const;

/**
 * 환경 설정
 */
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';

/**
 * 로컬 스토리지 키
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'pawwise_access_token',
  REFRESH_TOKEN: 'pawwise_refresh_token',
  USER_PREFERENCES: 'pawwise_user_preferences',
  THEME: 'pawwise_theme',
  LANGUAGE: 'pawwise_language',
  SEARCH_HISTORY: 'pawwise_search_history',
  FAVORITES: 'pawwise_favorites',
  ONBOARDING_COMPLETED: 'pawwise_onboarding_completed',
} as const;

/**
 * 쿠키 키
 */
export const COOKIE_KEYS = {
  SESSION: 'pawwise_session',
  CONSENT: 'pawwise_consent',
  ANALYTICS: 'pawwise_analytics',
} as const;

/**
 * 라우트 경로
 */
export const ROUTES = {
  HOME: '/',
  ADOPTION: '/adoption',
  STUDY: '/study',
  SEARCH: '/search',
  PET_DETAIL: '/pets/[id]',
  FAVORITES: '/favorites',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  CARE: '/care',
  CARE_DASHBOARD: '/care/dashboard',
  CARE_ACTIVITIES: '/care/activities',
  CARE_EXPENSES: '/care/expenses',
  CARE_SIMULATIONS: '/care/simulations',
  // 상세 페이지 라우트
  ADOPTION_DETAIL: (id: string) => `/adoption/${id}`,
  DICTIONARY_DETAIL: (id: string) => `/study/dictionary/${id}`,
  QNA_DETAIL: (id: string) => `/study/qna/${id}`,
  // 인증 관련
  AUTH_CALLBACK: '/auth/callback',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

/**
 * 기본 페이지네이션 설정
 */
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE = 1;

/**
 * 지원하는 언어
 */
export const SUPPORTED_LANGUAGES = {
  KO: 'ko',
  EN: 'en',
} as const;

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.KO;

/**
 * 테마 설정
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const DEFAULT_THEME = THEMES.SYSTEM;

/**
 * 브레이크포인트 (Tailwind CSS 기준)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

/**
 * 애니메이션 지속 시간 (ms)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const;

/**
 * 디바운스/스로틀 지연 시간 (ms)
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 100,
  SCROLL: 16,
} as const;

/**
 * 파일 업로드 제한
 */
export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

/**
 * 지도 및 위치 설정
 */
export const LOCATION_SETTINGS = {
  DEFAULT_LATITUDE: 37.5665,  // 서울
  DEFAULT_LONGITUDE: 126.9780,
  DEFAULT_ZOOM: 10,
  MAX_SEARCH_RADIUS_KM: 100,
  MIN_SEARCH_RADIUS_KM: 1,
  DEFAULT_SEARCH_RADIUS_KM: 10,
} as const;

/**
 * 연락처 정보
 */
export const CONTACT_INFO = {
  EMAIL: 'contact@pawwise.com',
  PHONE: '02-1234-5678',
  ADDRESS: '서울특별시 강남구 테헤란로 123',
  BUSINESS_HOURS: '평일 09:00 - 18:00',
} as const;

/**
 * 소셜 미디어 링크
 */
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/pawwise',
  INSTAGRAM: 'https://instagram.com/pawwise',
  TWITTER: 'https://twitter.com/pawwise',
  YOUTUBE: 'https://youtube.com/pawwise',
} as const;

/**
 * 외부 서비스 설정
 */
export const EXTERNAL_SERVICES = {
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID,
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;