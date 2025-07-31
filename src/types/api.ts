/**
 * API 관련 타입 정의
 * 
 * API 응답, 요청, 에러 등 API 통신과 관련된 모든 타입을 정의합니다.
 */

import type { PaginationInfo } from './common';

/**
 * HTTP 상태 코드 타입
 */
export type HttpStatusCode = 
  | 200 | 201 | 202 | 204
  | 400 | 401 | 403 | 404 | 409 | 422 | 429
  | 500 | 502 | 503 | 504;

/**
 * API 에러 코드
 */
export type ApiErrorCode = 
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_REQUIRED'
  | 'AUTHORIZATION_DENIED'
  | 'RESOURCE_NOT_FOUND'
  | 'RESOURCE_CONFLICT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'DATABASE_ERROR'
  | 'EXTERNAL_SERVICE_ERROR';

/**
 * 기본 API 응답 인터페이스
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
  requestId?: string;
}

/**
 * 페이지네이션된 API 응답
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

/**
 * API 에러 응답
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, any>;
    field?: string; // 유효성 검사 에러의 경우
    stack?: string; // 개발 환경에서만
  };
  timestamp: string;
  requestId?: string;
}

/**
 * 유효성 검사 에러 상세
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

/**
 * 유효성 검사 에러 응답
 */
export interface ValidationErrorResponse extends ApiErrorResponse {
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    details: {
      errors: ValidationError[];
    };
  };
}

/**
 * API 요청 설정
 */
export interface ApiRequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  retries?: number;
  retryDelay?: number;
}

/**
 * 파일 업로드 진행 상황
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * 파일 업로드 요청
 */
export interface FileUploadRequest {
  file: File;
  folder?: string;
  filename?: string;
  onProgress?: (progress: UploadProgress) => void;
}

/**
 * 파일 업로드 응답
 */
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * 인증 토큰 응답
 */
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

/**
 * 로그인 요청
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * 회원가입 요청
 */
export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToMarketing?: boolean;
}

/**
 * 비밀번호 재설정 요청
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * 비밀번호 변경 요청
 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * API 엔드포인트 타입
 */
export type ApiEndpoint = {
  // 인증
  auth: {
    login: 'POST /api/auth/login';
    register: 'POST /api/auth/register';
    logout: 'POST /api/auth/logout';
    refresh: 'POST /api/auth/refresh';
    resetPassword: 'POST /api/auth/reset-password';
    changePassword: 'PUT /api/auth/change-password';
  };
  
  // 사용자
  users: {
    getProfile: 'GET /api/users/profile';
    updateProfile: 'PUT /api/users/profile';
    getPreferences: 'GET /api/users/preferences';
    updatePreferences: 'PUT /api/users/preferences';
    getFavorites: 'GET /api/users/favorites';
    addFavorite: 'POST /api/users/favorites';
    removeFavorite: 'DELETE /api/users/favorites/{id}';
  };
  
  // 반려동물
  pets: {
    search: 'POST /api/pets/search';
    getById: 'GET /api/pets/{id}';
    getRecommendations: 'GET /api/pets/recommendations';
    apply: 'POST /api/pets/{id}/apply';
    getApplications: 'GET /api/users/applications';
  };
  
  // 케어 시스템
  care: {
    getActivities: 'GET /api/care/activities';
    createActivity: 'POST /api/care/activities';
    updateActivity: 'PUT /api/care/activities/{id}';
    deleteActivity: 'DELETE /api/care/activities/{id}';
    completeActivity: 'POST /api/care/activities/{id}/complete';
    getExpenses: 'GET /api/care/expenses';
    createExpense: 'POST /api/care/expenses';
    getBudget: 'GET /api/care/budget';
    updateBudget: 'PUT /api/care/budget';
    getStatistics: 'GET /api/care/statistics';
    getScenarios: 'GET /api/care/scenarios';
    startSimulation: 'POST /api/care/simulations';
    updateSimulation: 'PUT /api/care/simulations/{id}';
  };
  
  // 파일 업로드
  upload: {
    image: 'POST /api/upload/image';
    document: 'POST /api/upload/document';
  };
};

/**
 * 공공데이터 유기동물 API 타입 정의
 */

// API 기본 파라미터
export interface AnimalApiParams {
  serviceKey: string;
  numOfRows?: number;
  pageNo?: number;
  bgnde?: string; // 시작일 (YYYYMMDD)
  endde?: string; // 종료일 (YYYYMMDD)
  upkind?: string; // 축종코드 (개: 417000, 고양이: 422000)
  kind?: string; // 품종코드
  upr_cd?: string; // 시도코드
  org_cd?: string; // 시군구코드
  care_reg_no?: string; // 보호센터명
  state?: string; // 상태 (protect: 보호중, notice: 공고중, protect_end: 보호종료)
  neut_yn?: string; // 중성화여부 (Y, N, U)
}

// 공공데이터 API 공통 응답
export interface PublicDataResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item: T[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 유기동물 정보 (실제 API 응답 형태)
export interface AbandonmentAnimalItem {
  desertionNo: string; // 유기번호
  rfidCd?: string; // RFID 코드 (옵션)
  happenDt: string; // 접수일 (YYYYMMDD)
  happenPlace: string; // 발견장소
  kindFullNm: string; // 전체 품종명 (예: "[개] 믹스견")
  upKindCd: string; // 축종 코드 (417000: 개, 422000: 고양이)
  upKindNm: string; // 축종명 (개, 고양이 등)
  kindCd: string; // 품종 코드
  kindNm: string; // 품종명 (믹스견 등)
  colorCd: string; // 색상
  age: string; // 나이 (예: "2020(년생)")
  weight: string; // 체중 (예: "25(Kg)")
  noticeNo: string; // 공고번호
  noticeSdt: string; // 공고시작일 (YYYYMMDD)
  noticeEdt: string; // 공고종료일 (YYYYMMDD)
  popfile1: string; // 이미지 1
  popfile2?: string; // 이미지 2 (옵션)
  processState: string; // 상태 (보호중 등)
  sexCd: string; // 성별 (F:암컷, M:수컷, Q:미상)
  neuterYn: string; // 중성화여부 (Y:예, N:아니오, U:미상)
  specialMark: string; // 특징
  careRegNo: string; // 보호센터 등록번호
  careNm: string; // 보호센터명
  careTel: string; // 보호센터전화번호
  careAddr: string; // 보호장소
  careOwnerNm: string; // 보호센터 소유자명
  orgNm: string; // 관할기관
  etcBigo?: string; // 기타 사항 (옵션)
  updTm: string; // 업데이트 시간
  [key: string]: string | undefined; // 추가 필드 대응을 위한 인덱스 시그니처
}

// 품종 코드 정보
export interface KindInfo {
  kindCd: string;
  KNm: string; // 한글명
}

// 시도 코드 정보  
export interface SidoInfo {
  orgCd: string;
  orgdownNm: string; // 시도명
}

// 시군구 코드 정보
export interface SigunguInfo {
  uprCd: string;
  orgCd: string;
  orgdownNm: string; // 시군구명
}

// 보호소 정보
export interface ShelterInfo {
  careRegNo: string;
  careNm: string; // 보호센터명
}