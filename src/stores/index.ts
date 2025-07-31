/**
 * Zustand 스토어 중앙 관리
 * 
 * MVVM 패턴에서 ViewModel 계층을 담당하는 모든 스토어들을 관리합니다.
 * 각 스토어는 특정 도메인의 상태와 비즈니스 로직을 캡슐화합니다.
 * 
 * SOLID 원칙 적용:
 * - 단일 책임: 각 스토어는 특정 도메인만 담당
 * - 개방/폐쇄: 새로운 스토어 추가시 기존 코드 변경 없이 확장
 * - 인터페이스 분리: 각 스토어는 독립적인 인터페이스 제공
 * - 의존성 역전: 구체적인 구현보다 추상화에 의존
 */

// Auth Store - 인증 및 권한 관리
export { useAuthStore } from './auth-store';
export type { AuthStore } from './auth-store';

// User Store - 사용자 정보 및 프로필 관리
export { useUserStore } from './user-store';
export type { UserStore } from './user-store';

// Pet Store - 반려동물 관련 상태 관리
export { usePetStore } from './pet-store';
export type { PetStore } from './pet-store';

// Search Store - 검색 상태 및 필터 관리
export { useSearchStore } from './search-store';
export type { SearchStore } from './search-store';

// Care Store - 케어 시스템 상태 관리
export { useCareStore } from './care-store';
export type { CareStore } from './care-store';

// UI Store - 전역 UI 상태 관리
export { useUIStore } from './ui-store';
export type { UIStore } from './ui-store';

// Notification Store - 알림 상태 관리
export { useNotificationStore } from './notification-store';
export type { NotificationStore } from './notification-store';