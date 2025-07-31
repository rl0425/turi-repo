/**
 * 검색 관련 타입 정의
 * 
 * 검색 필터, 결과, 정렬 등 검색 기능과 관련된 모든 타입을 정의합니다.
 */

import type { Id, Location, PaginationInfo } from './common';
import type { 
  ActivityLevel, 
  ExperienceLevel, 
  LivingSpace 
} from './user';
import type { 
  AdoptionStatus, 
  HealthStatus, 
  PersonalityTrait, 
  Pet, 
  PetAgeGroup, 
  PetSize, 
  PetSpecies 
} from './pet';

/**
 * 정렬 방향
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 검색 정렬 옵션
 */
export type SearchSortBy = 
  | 'relevance'
  | 'newest'
  | 'oldest' 
  | 'age-young'
  | 'age-old'
  | 'size-small'
  | 'size-large'
  | 'distance'
  | 'fee-low'
  | 'fee-high'
  | 'name';

/**
 * 매칭 점수 타입
 */
export type MatchScore = {
  overall: number;
  lifestyle: number;
  experience: number;
  location: number;
  preferences: number;
};

/**
 * 기본 검색 필터
 */
export interface BaseSearchFilters {
  // 기본 정보
  species?: PetSpecies[];
  breeds?: string[];
  ageGroups?: PetAgeGroup[];
  sizes?: PetSize[];
  gender?: ('male' | 'female' | 'unknown')[];
  
  // 상태 필터
  adoptionStatus?: AdoptionStatus[];
  healthStatus?: HealthStatus[];
  
  // 위치 및 거리
  location?: Location;
  radius?: number; // km
  
  // 가격
  maxFee?: number;
  minFee?: number;
  
  // 특성
  personalities?: PersonalityTrait[];
  
  // 요구사항
  houseTrained?: boolean;
  spayedNeutered?: boolean;
  vaccinated?: boolean;
  microchipped?: boolean;
  goodWithChildren?: boolean;
  goodWithOtherPets?: boolean;
  hasSpecialNeeds?: boolean;
  
  // 검색어
  keyword?: string;
}

/**
 * 고급 검색 필터 (맞춤형 추천용)
 */
export interface AdvancedSearchFilters extends BaseSearchFilters {
  // 사용자 생활 환경 고려
  userLivingSpace?: LivingSpace;
  userHasYard?: boolean;
  userHasChildren?: boolean;
  userHasOtherPets?: boolean;
  userExperience?: ExperienceLevel;
  userActivityLevel?: ActivityLevel;
  userTimeCommitment?: ActivityLevel;
  
  // 매칭 점수 최소값
  minMatchScore?: number;
  
  // 추천 가중치
  weightLifestyle?: number;
  weightExperience?: number;
  weightLocation?: number;
  weightPreferences?: number;
}

/**
 * 검색 정렬 설정
 */
export interface SearchSort {
  sortBy: SearchSortBy;
  direction: SortDirection;
}

/**
 * 검색 요청
 */
export interface SearchRequest {
  filters: BaseSearchFilters | AdvancedSearchFilters;
  sort: SearchSort;
  pagination: {
    page: number;
    pageSize: number;
  };
  userId?: Id; // 맞춤형 추천용
}

/**
 * 검색 결과 아이템
 */
export interface SearchResultItem {
  pet: Pet;
  matchScore?: MatchScore;
  distance?: number; // km
  relevanceScore?: number;
  highlightedFields?: {
    name?: string;
    description?: string;
    breed?: string;
  };
}

/**
 * 검색 결과
 */
export interface SearchResults {
  items: SearchResultItem[];
  pagination: PaginationInfo;
  totalCount: number;
  searchTime: number; // ms
  suggestions?: string[];
  filters: {
    applied: BaseSearchFilters | AdvancedSearchFilters;
    available: {
      species: { value: PetSpecies; count: number }[];
      breeds: { value: string; count: number }[];
      sizes: { value: PetSize; count: number }[];
      ageGroups: { value: PetAgeGroup; count: number }[];
      locations: { value: string; count: number }[];
      personalities: { value: PersonalityTrait; count: number }[];
    };
  };
}

/**
 * 저장된 검색 설정
 */
export interface SavedSearch {
  id: Id;
  userId: Id;
  name: string;
  filters: BaseSearchFilters | AdvancedSearchFilters;
  sort: SearchSort;
  alertsEnabled: boolean;
  createdAt: string;
  lastUsed?: string;
  resultCount?: number;
}

/**
 * 검색 제안
 */
export interface SearchSuggestion {
  type: 'breed' | 'location' | 'keyword' | 'filter';
  text: string;
  count?: number;
  filters?: Partial<BaseSearchFilters>;
}