/**
 * UI 관련 상수 정의
 * 
 * 색상, 크기, 간격 등 UI 디자인과 관련된 상수들을 정의합니다.
 * Tailwind CSS와 일관성을 유지합니다.
 */

/**
 * 컴포넌트 크기
 */
export const COMPONENT_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: '2xl',
} as const;

/**
 * 버튼 variant
 */
export const BUTTON_VARIANTS = {
  DEFAULT: 'default',
  DESTRUCTIVE: 'destructive',
  OUTLINE: 'outline',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
  LINK: 'link',
} as const;

/**
 * 색상 variant
 */
export const COLOR_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
  MUTED: 'muted',
} as const;

/**
 * 배지 variant
 */
export const BADGE_VARIANTS = {
  DEFAULT: 'default',
  SECONDARY: 'secondary',
  DESTRUCTIVE: 'destructive',
  OUTLINE: 'outline',
} as const;

/**
 * 카드 크기
 */
export const CARD_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const;

/**
 * 간격 크기 (Tailwind spacing scale 기준)
 */
export const SPACING = {
  NONE: '0',
  XS: '1',     // 4px
  SM: '2',     // 8px
  MD: '4',     // 16px
  LG: '6',     // 24px
  XL: '8',     // 32px
  XXL: '12',   // 48px
  XXXL: '16',  // 64px
} as const;

/**
 * 그리드 컬럼 수
 */
export const GRID_COLUMNS = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  SIX: 6,
  TWELVE: 12,
} as const;

/**
 * Z-Index 레이어
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

/**
 * 아이콘 크기
 */
export const ICON_SIZES = {
  XS: 12,
  SM: 16,
  MD: 20,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

/**
 * 아바타 크기
 */
export const AVATAR_SIZES = {
  XS: 'w-6 h-6',
  SM: 'w-8 h-8',
  MD: 'w-10 h-10',
  LG: 'w-12 h-12',
  XL: 'w-16 h-16',
  XXL: 'w-20 h-20',
} as const;

/**
 * 반응형 컬럼 설정
 */
export const RESPONSIVE_COLUMNS = {
  PET_GRID: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  FEATURE_GRID: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  STAT_GRID: 'grid-cols-2 md:grid-cols-4',
  FORM_GRID: 'grid-cols-1 md:grid-cols-2',
} as const;

/**
 * 로딩 스피너 크기
 */
export const SPINNER_SIZES = {
  SM: 'w-4 h-4',
  MD: 'w-6 h-6',
  LG: 'w-8 h-8',
  XL: 'w-12 h-12',
} as const;

/**
 * 그림자 레벨
 */
export const SHADOW_LEVELS = {
  NONE: 'shadow-none',
  SM: 'shadow-sm',
  DEFAULT: 'shadow',
  MD: 'shadow-md',
  LG: 'shadow-lg',
  XL: 'shadow-xl',
  XXL: 'shadow-2xl',
} as const;

/**
 * 둥근 모서리 레벨
 */
export const BORDER_RADIUS = {
  NONE: 'rounded-none',
  SM: 'rounded-sm',
  DEFAULT: 'rounded',
  MD: 'rounded-md',
  LG: 'rounded-lg',
  XL: 'rounded-xl',
  XXL: 'rounded-2xl',
  FULL: 'rounded-full',
} as const;

/**
 * 폰트 크기
 */
export const FONT_SIZES = {
  XS: 'text-xs',
  SM: 'text-sm',
  BASE: 'text-base',
  LG: 'text-lg',
  XL: 'text-xl',
  XXL: 'text-2xl',
  XXXL: 'text-3xl',
  XXXXL: 'text-4xl',
} as const;

/**
 * 폰트 두께
 */
export const FONT_WEIGHTS = {
  THIN: 'font-thin',
  LIGHT: 'font-light',
  NORMAL: 'font-normal',
  MEDIUM: 'font-medium',
  SEMIBOLD: 'font-semibold',
  BOLD: 'font-bold',
  EXTRABOLD: 'font-extrabold',
} as const;

/**
 * 애니메이션 클래스
 */
export const ANIMATIONS = {
  FADE_IN: 'animate-fade-in',
  FADE_OUT: 'animate-fade-out',
  SLIDE_IN: 'animate-slide-in',
  SLIDE_OUT: 'animate-slide-out',
  BOUNCE: 'animate-bounce',
  PULSE: 'animate-pulse',
  SPIN: 'animate-spin',
} as const;

/**
 * 트랜지션 지속 시간
 */
export const TRANSITION_DURATION = {
  FAST: 'duration-150',
  NORMAL: 'duration-300',
  SLOW: 'duration-500',
  SLOWER: 'duration-700',
  SLOWEST: 'duration-1000',
} as const;

/**
 * 호버 효과
 */
export const HOVER_EFFECTS = {
  SCALE: 'hover:scale-105',
  LIFT: 'hover:-translate-y-1',
  BRIGHTNESS: 'hover:brightness-110',
  OPACITY: 'hover:opacity-80',
  SHADOW: 'hover:shadow-lg',
} as const;

/**
 * 포커스 효과
 */
export const FOCUS_EFFECTS = {
  RING: 'focus:ring-2 focus:ring-primary',
  OUTLINE: 'focus:outline-none focus:ring-2 focus:ring-primary',
  VISIBLE: 'focus-visible:ring-2 focus-visible:ring-primary',
} as const;

/**
 * 상태별 색상
 */
export const STATUS_COLORS = {
  SUCCESS: 'text-green-600',
  WARNING: 'text-yellow-600',
  ERROR: 'text-red-600',
  INFO: 'text-blue-600',
  MUTED: 'text-gray-500',
} as const;

/**
 * 배경 상태별 색상
 */
export const STATUS_BACKGROUNDS = {
  SUCCESS: 'bg-green-50 border-green-200',
  WARNING: 'bg-yellow-50 border-yellow-200',
  ERROR: 'bg-red-50 border-red-200',
  INFO: 'bg-blue-50 border-blue-200',
  MUTED: 'bg-gray-50 border-gray-200',
} as const;