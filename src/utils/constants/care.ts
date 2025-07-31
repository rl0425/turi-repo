/**
 * 케어 시스템 관련 상수 정의
 * 
 * 반려동물 케어, 활동, 시뮬레이션 등과 관련된 상수들을 정의합니다.
 */

/**
 * 케어 활동 유형
 */
export const CARE_ACTIVITY_TYPES = {
  FEEDING: 'feeding',
  WALKING: 'walking',
  GROOMING: 'grooming',
  PLAY: 'play',
  TRAINING: 'training',
  MEDICAL: 'medical',
  SOCIALIZATION: 'socialization',
  REST: 'rest',
  EMERGENCY: 'emergency',
} as const;

/**
 * 케어 활동 유형별 한국어 표시명
 */
export const CARE_ACTIVITY_TYPE_LABELS = {
  [CARE_ACTIVITY_TYPES.FEEDING]: '급식',
  [CARE_ACTIVITY_TYPES.WALKING]: '산책',
  [CARE_ACTIVITY_TYPES.GROOMING]: '그루밍',
  [CARE_ACTIVITY_TYPES.PLAY]: '놀이',
  [CARE_ACTIVITY_TYPES.TRAINING]: '훈련',
  [CARE_ACTIVITY_TYPES.MEDICAL]: '의료',
  [CARE_ACTIVITY_TYPES.SOCIALIZATION]: '사회화',
  [CARE_ACTIVITY_TYPES.REST]: '휴식',
  [CARE_ACTIVITY_TYPES.EMERGENCY]: '응급상황',
} as const;

/**
 * 케어 우선순위
 */
export const CARE_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

/**
 * 케어 우선순위별 한국어 표시명
 */
export const CARE_PRIORITY_LABELS = {
  [CARE_PRIORITIES.LOW]: '낮음',
  [CARE_PRIORITIES.MEDIUM]: '보통',
  [CARE_PRIORITIES.HIGH]: '높음',
  [CARE_PRIORITIES.CRITICAL]: '긴급',
} as const;

/**
 * 케어 빈도
 */
export const CARE_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BI_WEEKLY: 'bi-weekly',
  MONTHLY: 'monthly',
  AS_NEEDED: 'as-needed',
  CUSTOM: 'custom',
} as const;

/**
 * 케어 빈도별 한국어 표시명
 */
export const CARE_FREQUENCY_LABELS = {
  [CARE_FREQUENCIES.DAILY]: '매일',
  [CARE_FREQUENCIES.WEEKLY]: '매주',
  [CARE_FREQUENCIES.BI_WEEKLY]: '격주',
  [CARE_FREQUENCIES.MONTHLY]: '매월',
  [CARE_FREQUENCIES.AS_NEEDED]: '필요시',
  [CARE_FREQUENCIES.CUSTOM]: '사용자 정의',
} as const;

/**
 * 케어 활동 상태
 */
export const CARE_ACTIVITY_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
  OVERDUE: 'overdue',
} as const;

/**
 * 케어 활동 상태별 한국어 표시명
 */
export const CARE_ACTIVITY_STATUS_LABELS = {
  [CARE_ACTIVITY_STATUS.PENDING]: '대기 중',
  [CARE_ACTIVITY_STATUS.IN_PROGRESS]: '진행 중',
  [CARE_ACTIVITY_STATUS.COMPLETED]: '완료',
  [CARE_ACTIVITY_STATUS.SKIPPED]: '건너뜀',
  [CARE_ACTIVITY_STATUS.OVERDUE]: '지연됨',
} as const;

/**
 * 비용 카테고리
 */
export const EXPENSE_CATEGORIES = {
  FOOD: 'food',
  MEDICAL: 'medical',
  GROOMING: 'grooming',
  TOYS: 'toys',
  TRAINING: 'training',
  BOARDING: 'boarding',
  INSURANCE: 'insurance',
  EMERGENCY: 'emergency',
  OTHER: 'other',
} as const;

/**
 * 비용 카테고리별 한국어 표시명
 */
export const EXPENSE_CATEGORY_LABELS = {
  [EXPENSE_CATEGORIES.FOOD]: '사료/간식',
  [EXPENSE_CATEGORIES.MEDICAL]: '의료비',
  [EXPENSE_CATEGORIES.GROOMING]: '미용',
  [EXPENSE_CATEGORIES.TOYS]: '장난감',
  [EXPENSE_CATEGORIES.TRAINING]: '훈련',
  [EXPENSE_CATEGORIES.BOARDING]: '위탁',
  [EXPENSE_CATEGORIES.INSURANCE]: '보험',
  [EXPENSE_CATEGORIES.EMERGENCY]: '응급',
  [EXPENSE_CATEGORIES.OTHER]: '기타',
} as const;

/**
 * 시뮬레이션 시나리오 유형
 */
export const SIMULATION_SCENARIO_TYPES = {
  DAILY_ROUTINE: 'daily-routine',
  EMERGENCY: 'emergency',
  BEHAVIORAL_ISSUE: 'behavioral-issue',
  HEALTH_CONCERN: 'health-concern',
  EXPENSE_MANAGEMENT: 'expense-management',
  SOCIALIZATION: 'socialization',
  TRAINING_CHALLENGE: 'training-challenge',
} as const;

/**
 * 시뮬레이션 시나리오 유형별 한국어 표시명
 */
export const SIMULATION_SCENARIO_TYPE_LABELS = {
  [SIMULATION_SCENARIO_TYPES.DAILY_ROUTINE]: '일상 루틴',
  [SIMULATION_SCENARIO_TYPES.EMERGENCY]: '응급상황',
  [SIMULATION_SCENARIO_TYPES.BEHAVIORAL_ISSUE]: '행동 문제',
  [SIMULATION_SCENARIO_TYPES.HEALTH_CONCERN]: '건강 관리',
  [SIMULATION_SCENARIO_TYPES.EXPENSE_MANAGEMENT]: '비용 관리',
  [SIMULATION_SCENARIO_TYPES.SOCIALIZATION]: '사회화',
  [SIMULATION_SCENARIO_TYPES.TRAINING_CHALLENGE]: '훈련 도전',
} as const;

/**
 * 난이도 레벨
 */
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

/**
 * 난이도 레벨별 한국어 표시명
 */
export const DIFFICULTY_LEVEL_LABELS = {
  [DIFFICULTY_LEVELS.BEGINNER]: '초급',
  [DIFFICULTY_LEVELS.INTERMEDIATE]: '중급',
  [DIFFICULTY_LEVELS.ADVANCED]: '고급',
} as const;

/**
 * 시뮬레이션 세션 상태
 */
export const SIMULATION_SESSION_STATUS = {
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
} as const;

/**
 * 시뮬레이션 세션 상태별 한국어 표시명
 */
export const SIMULATION_SESSION_STATUS_LABELS = {
  [SIMULATION_SESSION_STATUS.IN_PROGRESS]: '진행 중',
  [SIMULATION_SESSION_STATUS.COMPLETED]: '완료',
  [SIMULATION_SESSION_STATUS.ABANDONED]: '중단',
} as const;

/**
 * 알림 유형
 */
export const NOTIFICATION_TYPES = {
  REMINDER: 'reminder',
  OVERDUE: 'overdue',
  BUDGET_WARNING: 'budget-warning',
  ACHIEVEMENT: 'achievement',
  EMERGENCY: 'emergency',
} as const;

/**
 * 알림 유형별 한국어 표시명
 */
export const NOTIFICATION_TYPE_LABELS = {
  [NOTIFICATION_TYPES.REMINDER]: '알림',
  [NOTIFICATION_TYPES.OVERDUE]: '지연',
  [NOTIFICATION_TYPES.BUDGET_WARNING]: '예산 경고',
  [NOTIFICATION_TYPES.ACHIEVEMENT]: '성취',
  [NOTIFICATION_TYPES.EMERGENCY]: '응급',
} as const;

/**
 * 기본 알림 시간 (분 전)
 */
export const DEFAULT_REMINDER_TIMES = [5, 15, 30, 60, 120, 1440] as const; // 5분, 15분, 30분, 1시간, 2시간, 1일

/**
 * 활동별 기본 소요 시간 (분)
 */
export const DEFAULT_ACTIVITY_DURATIONS = {
  [CARE_ACTIVITY_TYPES.FEEDING]: 15,
  [CARE_ACTIVITY_TYPES.WALKING]: 30,
  [CARE_ACTIVITY_TYPES.GROOMING]: 45,
  [CARE_ACTIVITY_TYPES.PLAY]: 20,
  [CARE_ACTIVITY_TYPES.TRAINING]: 30,
  [CARE_ACTIVITY_TYPES.MEDICAL]: 60,
  [CARE_ACTIVITY_TYPES.SOCIALIZATION]: 45,
  [CARE_ACTIVITY_TYPES.REST]: 120,
  [CARE_ACTIVITY_TYPES.EMERGENCY]: 90,
} as const;

/**
 * 예산 경고 임계값 (%)
 */
export const BUDGET_WARNING_THRESHOLDS = {
  WARNING: 70,    // 70% 사용시 경고
  CRITICAL: 90,   // 90% 사용시 긴급 경고
  EXCEEDED: 100,  // 100% 초과시 알림
} as const;

/**
 * 통계 기간 옵션
 */
export const STATISTICS_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
} as const;

/**
 * 통계 기간별 한국어 표시명
 */
export const STATISTICS_PERIOD_LABELS = {
  [STATISTICS_PERIODS.WEEK]: '주간',
  [STATISTICS_PERIODS.MONTH]: '월간',
  [STATISTICS_PERIODS.QUARTER]: '분기',
  [STATISTICS_PERIODS.YEAR]: '연간',
} as const;

/**
 * 성취도 점수 기준
 */
export const ACHIEVEMENT_SCORE_THRESHOLDS = {
  BRONZE: 60,
  SILVER: 80,
  GOLD: 95,
} as const;

/**
 * 성취도별 한국어 표시명
 */
export const ACHIEVEMENT_LABELS = {
  BRONZE: '동메달',
  SILVER: '은메달',
  GOLD: '금메달',
} as const;

/**
 * 케어 템플릿 태그
 */
export const CARE_TEMPLATE_TAGS = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
  PUPPY: 'puppy',
  SENIOR: 'senior',
  MEDICAL: 'medical',
  TRAINING: 'training',
  INDOOR: 'indoor',
  OUTDOOR: 'outdoor',
} as const;

/**
 * 케어 템플릿 태그별 한국어 표시명
 */
export const CARE_TEMPLATE_TAG_LABELS = {
  [CARE_TEMPLATE_TAGS.BASIC]: '기본',
  [CARE_TEMPLATE_TAGS.ADVANCED]: '고급',
  [CARE_TEMPLATE_TAGS.PUPPY]: '새끼',
  [CARE_TEMPLATE_TAGS.SENIOR]: '노령',
  [CARE_TEMPLATE_TAGS.MEDICAL]: '의료',
  [CARE_TEMPLATE_TAGS.TRAINING]: '훈련',
  [CARE_TEMPLATE_TAGS.INDOOR]: '실내',
  [CARE_TEMPLATE_TAGS.OUTDOOR]: '실외',
} as const;