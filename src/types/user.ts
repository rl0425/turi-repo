/**
 * 사용자 관련 타입 정의
 * 
 * 사용자 정보, 프로필, 선호도 등 사용자와 관련된 모든 타입을 정의합니다.
 */

import type { BaseEntity, Id, Location, Timestamp } from './common';
import type { PersonalityTrait, PetSize, PetSpecies } from './pet';

/**
 * 사용자 역할
 */
export type UserRole = 'user' | 'shelter' | 'admin';

/**
 * 인증 제공자
 */
export type AuthProvider = 'email' | 'google' | 'kakao' | 'naver';

/**
 * 생활 환경 타입
 */
export type LivingSpace = 'apartment' | 'house' | 'farm' | 'other';

/**
 * 활동 수준
 */
export type ActivityLevel = 'low' | 'medium' | 'high';

/**
 * 경험 수준
 */
export type ExperienceLevel = 'none' | 'beginner' | 'intermediate' | 'experienced';

/**
 * 기본 사용자 정보
 */
export interface User extends BaseEntity {
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  authProvider: AuthProvider;
  emailVerified: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Timestamp;
}

/**
 * 사용자 프로필 정보
 */
export interface UserProfile extends BaseEntity {
  userId: Id;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  location: Location;
  bio?: string;
  
  // 생활 환경
  livingSpace: LivingSpace;
  hasYard: boolean;
  hasOtherPets: boolean;
  householdSize: number;
  hasChildren: boolean;
  childrenAges?: number[];
  
  // 경험 및 선호도
  petExperience: ExperienceLevel;
  timeAvailable: ActivityLevel;
  activityLevel: ActivityLevel;
  budget: {
    monthly: number;
    initial: number;
  };
  
  // 연락처 설정
  contactPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // 프라이버시 설정
  privacySettings: {
    showProfile: boolean;
    showLocation: boolean;
    allowMessages: boolean;
  };
}

/**
 * 사용자 선호도 설정
 */
export interface UserPreferences extends BaseEntity {
  userId: Id;
  
  // 반려동물 선호도
  preferredSpecies: PetSpecies[];
  preferredSizes: PetSize[];
  preferredAgeGroups: string[];
  preferredPersonalities: PersonalityTrait[];
  
  // 검색 설정
  searchRadius: number; // km
  maxAdoptionFee?: number;
  
  // 알림 설정
  notifications: {
    newMatches: boolean;
    priceDrops: boolean;
    applicationUpdates: boolean;
    careReminders: boolean;
    newsletter: boolean;
  };
  
  // 필터 설정
  requirements: {
    mustBeHouseTrained: boolean;
    mustBeSpayedNeutered: boolean;
    mustBeVaccinated: boolean;
    goodWithChildren: boolean;
    goodWithOtherPets: boolean;
    noSpecialNeeds: boolean;
  };
}

/**
 * 사용자 관심 목록
 */
export interface UserFavorites extends BaseEntity {
  userId: Id;
  petId: Id;
  notes?: string;
}

/**
 * 사용자 검색 기록
 */
export interface UserSearchHistory extends BaseEntity {
  userId: Id;
  searchQuery: string;
  filters: Record<string, any>;
  resultCount: number;
  clickedPets: Id[];
}

/**
 * 입양 히스토리
 */
export interface AdoptionHistory extends BaseEntity {
  userId: Id;
  petId: Id;
  adoptionDate: Timestamp;
  status: 'successful' | 'returned' | 'transferred';
  notes?: string;
}