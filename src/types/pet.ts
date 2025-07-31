/**
 * 반려동물 관련 타입 정의
 * 
 * 반려동물, 품종, 크기 등 펫과 관련된 모든 타입을 정의합니다.
 */

import type { BaseEntity, Gender, Id, ImageInfo, Location, Timestamp } from './common';

/**
 * 반려동물 종류
 */
export type PetSpecies = 'dog' | 'cat' | 'rabbit' | 'bird' | 'hamster' | 'other';

/**
 * 반려동물 크기
 */
export type PetSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

/**
 * 반려동물 연령대
 */
export type PetAgeGroup = 'puppy' | 'young' | 'adult' | 'senior';

/**
 * 입양 상태
 */
export type AdoptionStatus = 'available' | 'pending' | 'adopted' | 'unavailable';

/**
 * 건강 상태
 */
export type HealthStatus = 'excellent' | 'good' | 'fair' | 'needs-attention' | 'special-care';

/**
 * 성격 특성
 */
export type PersonalityTrait = 
  | 'friendly' 
  | 'playful' 
  | 'calm' 
  | 'energetic' 
  | 'affectionate' 
  | 'independent' 
  | 'social' 
  | 'shy' 
  | 'protective' 
  | 'gentle';

/**
 * 반려동물 품종 정보
 */
export interface PetBreed extends BaseEntity {
  name: string;
  species: PetSpecies;
  size: PetSize;
  lifespan: {
    min: number;
    max: number;
  };
  description: string;
  characteristics: PersonalityTrait[];
  careLevel: 'low' | 'medium' | 'high';
  exerciseNeeds: 'low' | 'medium' | 'high';
  groomingNeeds: 'low' | 'medium' | 'high';
}

/**
 * 의료 기록
 */
export interface MedicalRecord {
  id: Id;
  type: 'vaccination' | 'surgery' | 'checkup' | 'treatment' | 'medication';
  date: Timestamp;
  description: string;
  veterinarian?: string;
  clinic?: string;
  nextDue?: Timestamp;
  documents?: string[];
}

/**
 * 반려동물 정보
 */
export interface Pet extends BaseEntity {
  name: string;
  species: PetSpecies;
  breed: PetBreed | null;
  mixedBreed?: PetBreed[];
  age: {
    years: number;
    months: number;
    ageGroup: PetAgeGroup;
  };
  gender: Gender;
  size: PetSize;
  weight?: number;
  color: string[];
  personality: PersonalityTrait[];
  healthStatus: HealthStatus;
  medicalRecords: MedicalRecord[];
  
  // 입양 관련
  adoptionStatus: AdoptionStatus;
  adoptionFee?: number;
  location: Location;
  shelterInfo?: {
    shelterId: Id;
    shelterName: string;
    contactInfo: string;
  };
  
  // 미디어
  images: ImageInfo[];
  videos?: string[];
  
  // 추가 정보
  description: string;
  specialNeeds?: string[];
  goodWith?: {
    children: boolean;
    otherPets: boolean;
    cats?: boolean;
    dogs?: boolean;
  };
  houseTrained: boolean;
  spayedNeutered: boolean;
  microchipped: boolean;
  vaccinated: boolean;
  
  // 입양 관련 요구사항
  adoptionRequirements?: {
    hasExperience: boolean;
    hasYard: boolean;
    livingSpace: 'apartment' | 'house' | 'farm';
    timeCommitment: 'low' | 'medium' | 'high';
    activityLevel: 'low' | 'medium' | 'high';
  };
}

/**
 * 입양 신청 정보
 */
export interface AdoptionApplication extends BaseEntity {
  petId: Id;
  applicantId: Id;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  applicationDate: Timestamp;
  message?: string;
  responses: {
    question: string;
    answer: string;
  }[];
  reviewedAt?: Timestamp;
  reviewedBy?: Id;
  reviewNotes?: string;
}