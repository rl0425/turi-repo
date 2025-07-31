/**
 * 공통 타입 정의
 * 
 * 프로젝트 전반에서 사용되는 기본적인 타입들을 정의합니다.
 */

/**
 * 기본 ID 타입
 */
export type Id = string;

/**
 * 타임스탬프 타입
 */
export type Timestamp = string;

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * 기본 엔티티 인터페이스
 */
export interface BaseEntity {
  id: Id;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 로딩 상태 타입
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * 성별 타입
 */
export type Gender = 'male' | 'female' | 'unknown';

/**
 * 지역 정보
 */
export interface Location {
  city: string;
  district: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * 이미지 정보
 */
export interface ImageInfo {
  id: Id;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isMain?: boolean;
}