/**
 * React Query 클라이언트 설정
 * 
 * 데이터 패칭, 캐싱, 동기화를 담당하는 React Query 클라이언트를 설정합니다.
 * MVVM 패턴에서 Model 계층의 역할을 수행합니다.
 * 
 * SOLID 원칙:
 * - 단일 책임: 데이터 패칭과 캐싱만 담당
 * - 개방/폐쇄: 새로운 쿼리 추가시 기존 코드 수정 없이 확장 가능
 * - 의존성 역전: 구체적인 API 구현에 의존하지 않음
 */

import { QueryClient, DefaultOptions, QueryCache, MutationCache } from '@tanstack/react-query';
import { CACHE_SETTINGS, RETRY_SETTINGS } from '@/utils/constants/api';
import { toast } from 'sonner';

/**
 * React Query 기본 옵션 설정
 */
const defaultOptions: DefaultOptions = {
  queries: {
    // 캐시 설정
    staleTime: CACHE_SETTINGS.STALE_TIME.MEDIUM,
    gcTime: CACHE_SETTINGS.CACHE_TIME.LONG, // 기존 cacheTime -> gcTime
    
    // 재시도 설정
    retry: (failureCount, error: any) => {
      // 401, 403, 404는 재시도하지 않음
      if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
        return false;
      }
      return failureCount < RETRY_SETTINGS.MAX_RETRIES;
    },
    retryDelay: (attemptIndex) => Math.min(
      RETRY_SETTINGS.BASE_DELAY * Math.pow(RETRY_SETTINGS.BACKOFF_MULTIPLIER, attemptIndex),
      RETRY_SETTINGS.MAX_DELAY
    ),
    
    // 네트워크 관련
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    refetchOnMount: true,
  },
  mutations: {
    // 뮤테이션 재시도 설정
    retry: (failureCount, error: any) => {
      // 클라이언트 에러는 재시도하지 않음
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: RETRY_SETTINGS.BASE_DELAY,
  },
};

/**
 * 쿼리 캐시 에러 핸들러
 */
const queryCache = new QueryCache({
  onError: (error: any, query) => {
    // 사용자에게 에러 알림 표시
    const errorMessage = error?.message || '데이터를 불러오는 중 오류가 발생했습니다.';
    
    // 개발 환경에서는 콘솔에 상세 정보 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('Query error:', {
        error,
        queryKey: query.queryKey,
        queryHash: query.queryHash,
      });
    }
    
    // 인증 관련 에러는 별도 처리 (추후 구현)
    if (error?.status === 401) {
      // 인증 토큰 만료 처리
      console.warn('Unauthorized access - redirecting to login');
      return;
    }
    
    // 일반적인 에러 토스트 표시
    toast.error(errorMessage);
  },
});

/**
 * 뮤테이션 캐시 에러 핸들러
 */
const mutationCache = new MutationCache({
  onError: (error: any, variables, context, mutation) => {
    // 사용자에게 에러 알림 표시
    const errorMessage = error?.message || '작업 중 오류가 발생했습니다.';
    
    // 개발 환경에서는 콘솔에 상세 정보 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('Mutation error:', {
        error,
        variables,
        context,
        mutationKey: mutation.options.mutationKey,
      });
    }
    
    // 에러 토스트 표시
    toast.error(errorMessage);
  },
  onSuccess: (data, variables, context, mutation) => {
    // 성공 시 처리 (선택적)
    if (process.env.NODE_ENV === 'development') {
      console.log('Mutation success:', {
        data,
        variables,
        mutationKey: mutation.options.mutationKey,
      });
    }
  },
});

/**
 * React Query 클라이언트 인스턴스
 * 
 * MVVM 패턴에서 Model 계층의 핵심 컴포넌트로,
 * 서버 상태 관리와 캐싱을 담당합니다.
 */
export const queryClient = new QueryClient({
  defaultOptions,
  queryCache,
  mutationCache,
});

/**
 * 쿼리 키 팩토리
 * 
 * 일관된 쿼리 키 생성을 위한 팩토리 함수들을 제공합니다.
 * 캐시 무효화와 데이터 동기화를 용이하게 합니다.
 */
export const queryKeys = {
  // 인증 관련
  auth: {
    user: () => ['auth', 'user'] as const,
    permissions: () => ['auth', 'permissions'] as const,
  },
  
  // 사용자 관련
  users: {
    all: () => ['users'] as const,
    profile: (userId?: string) => ['users', 'profile', userId] as const,
    preferences: (userId?: string) => ['users', 'preferences', userId] as const,
    favorites: (userId?: string) => ['users', 'favorites', userId] as const,
    searchHistory: (userId?: string) => ['users', 'search-history', userId] as const,
    applications: (userId?: string) => ['users', 'applications', userId] as const,
  },
  
  // 반려동물 관련
  pets: {
    all: () => ['pets'] as const,
    search: (filters?: any) => ['pets', 'search', filters] as const,
    detail: (petId: string) => ['pets', 'detail', petId] as const,
    recommendations: (userId?: string) => ['pets', 'recommendations', userId] as const,
    similar: (petId: string) => ['pets', 'similar', petId] as const,
    breeds: () => ['pets', 'breeds'] as const,
    species: () => ['pets', 'species'] as const,
  },
  
  // 보호소 관련
  shelters: {
    all: () => ['shelters'] as const,
    detail: (shelterId: string) => ['shelters', 'detail', shelterId] as const,
    pets: (shelterId: string) => ['shelters', 'pets', shelterId] as const,
  },
  
  // 케어 시스템 관련
  care: {
    activities: (userId?: string) => ['care', 'activities', userId] as const,
    expenses: (userId?: string) => ['care', 'expenses', userId] as const,
    budget: (userId?: string) => ['care', 'budget', userId] as const,
    statistics: (userId?: string, period?: string) => ['care', 'statistics', userId, period] as const,
    templates: () => ['care', 'templates'] as const,
    scenarios: () => ['care', 'scenarios'] as const,
    simulations: (userId?: string) => ['care', 'simulations', userId] as const,
  },
  
  // 알림 관련
  notifications: {
    all: (userId?: string) => ['notifications', userId] as const,
    unread: (userId?: string) => ['notifications', 'unread', userId] as const,
    settings: (userId?: string) => ['notifications', 'settings', userId] as const,
  },
} as const;

/**
 * 공통 쿼리 옵션 프리셋
 * 
 * 자주 사용되는 쿼리 옵션 조합을 미리 정의하여
 * 일관성 있는 데이터 패칭 동작을 보장합니다.
 */
export const queryOptions = {
  // 실시간성이 중요한 데이터
  realtime: {
    staleTime: CACHE_SETTINGS.STALE_TIME.SHORT,
    gcTime: CACHE_SETTINGS.CACHE_TIME.SHORT,
    refetchInterval: 30000, // 30초마다 자동 갱신
  },
  
  // 정적 데이터 (품종, 지역 등)
  static: {
    staleTime: CACHE_SETTINGS.STALE_TIME.VERY_LONG,
    gcTime: CACHE_SETTINGS.CACHE_TIME.VERY_LONG,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
  
  // 사용자별 데이터
  user: {
    staleTime: CACHE_SETTINGS.STALE_TIME.MEDIUM,
    gcTime: CACHE_SETTINGS.CACHE_TIME.LONG,
  },
  
  // 검색 결과
  search: {
    staleTime: CACHE_SETTINGS.STALE_TIME.SHORT,
    gcTime: CACHE_SETTINGS.CACHE_TIME.MEDIUM,
  },
} as const;