/**
 * 가상 케어 시스템 관련 타입 정의
 * 
 * 반려동물 케어, 일정 관리, 시뮬레이션 등과 관련된 모든 타입을 정의합니다.
 */

import type { BaseEntity, Id, Timestamp } from './common';
import type { PetSpecies } from './pet';

/**
 * 케어 활동 유형
 */
export type CareActivityType = 
  | 'feeding'
  | 'walking'
  | 'grooming'
  | 'play'
  | 'training'
  | 'medical'
  | 'socialization'
  | 'rest'
  | 'emergency';

/**
 * 케어 우선순위
 */
export type CarePriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * 케어 빈도
 */
export type CareFrequency = 
  | 'daily'
  | 'weekly' 
  | 'bi-weekly'
  | 'monthly'
  | 'as-needed'
  | 'custom';

/**
 * 케어 활동 상태
 */
export type CareActivityStatus = 'pending' | 'in-progress' | 'completed' | 'skipped' | 'overdue';

/**
 * 시뮬레이션 시나리오 유형
 */
export type SimulationScenarioType = 
  | 'daily-routine'
  | 'emergency'
  | 'behavioral-issue'
  | 'health-concern'
  | 'expense-management'
  | 'socialization'
  | 'training-challenge';

/**
 * 케어 비용 카테고리
 */
export type ExpenseCategory = 
  | 'food'
  | 'medical'
  | 'grooming'
  | 'toys'
  | 'training'
  | 'boarding'
  | 'insurance'
  | 'emergency'
  | 'other';

/**
 * 기본 케어 활동
 */
export interface CareActivity extends BaseEntity {
  userId: Id;
  petId?: Id; // 가상 케어의 경우 null일 수 있음
  title: string;
  description: string;
  type: CareActivityType;
  priority: CarePriority;
  status: CareActivityStatus;
  
  // 일정 관련
  scheduledAt: Timestamp;
  estimatedDuration: number; // 분
  actualDuration?: number;
  completedAt?: Timestamp;
  
  // 반복 설정
  isRecurring: boolean;
  frequency?: CareFrequency;
  recurringPattern?: {
    interval: number;
    days?: number[]; // 0: Sunday, 1: Monday, etc.
    endDate?: Timestamp;
  };
  
  // 알림 설정
  reminders: {
    beforeMinutes: number;
    message?: string;
  }[];
  
  // 메모 및 기록
  notes?: string;
  attachments?: string[];
  
  // 관련 데이터
  relatedActivities?: Id[];
  tags?: string[];
}

/**
 * 케어 일정 템플릿
 */
export interface CareScheduleTemplate extends BaseEntity {
  name: string;
  description: string;
  species: PetSpecies[];
  ageGroups?: string[];
  activities: Omit<CareActivity, 'id' | 'userId' | 'petId' | 'createdAt' | 'updatedAt' | 'scheduledAt'>[];
  estimatedTimePerDay: number; // 분
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

/**
 * 케어 비용 기록
 */
export interface CareExpense extends BaseEntity {
  userId: Id;
  petId?: Id;
  activityId?: Id;
  category: ExpenseCategory;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  date: Timestamp;
  
  // 반복 비용
  isRecurring: boolean;
  recurringFrequency?: CareFrequency;
  
  // 예산 관련
  budgetId?: Id;
  
  // 증빙 자료
  receipt?: string;
  tags?: string[];
}

/**
 * 케어 예산
 */
export interface CareBudget extends BaseEntity {
  userId: Id;
  petId?: Id;
  name: string;
  period: 'monthly' | 'yearly';
  categories: {
    category: ExpenseCategory;
    budgetAmount: number;
    spentAmount: number;
    warningThreshold: number; // 경고 임계값 (%)
  }[];
  totalBudget: number;
  totalSpent: number;
  startDate: Timestamp;
  endDate: Timestamp;
}

/**
 * 시뮬레이션 시나리오
 */
export interface SimulationScenario extends BaseEntity {
  title: string;
  description: string;
  type: SimulationScenarioType;
  species: PetSpecies[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // 분
  
  // 시나리오 단계
  steps: {
    id: string;
    title: string;
    description: string;
    choices: {
      id: string;
      text: string;
      isCorrect?: boolean;
      feedback: string;
      consequence?: {
        description: string;
        cost?: number;
        timeImpact?: number;
      };
    }[];
    timeLimit?: number; // 초
  }[];
  
  // 학습 목표
  learningObjectives: string[];
  tips: string[];
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'guide';
  }[];
}

/**
 * 시뮬레이션 세션
 */
export interface SimulationSession extends BaseEntity {
  userId: Id;
  scenarioId: Id;
  status: 'in-progress' | 'completed' | 'abandoned';
  startedAt: Timestamp;
  completedAt?: Timestamp;
  
  // 진행 상황
  currentStepIndex: number;
  responses: {
    stepId: string;
    choiceId: string;
    responseTime: number; // 초
    timestamp: Timestamp;
  }[];
  
  // 결과
  score?: number;
  totalCost?: number;
  timeSpent: number; // 분
  feedback?: string;
  
  // 학습 포인트
  mistakesMade: string[];
  lessonsLearned: string[];
}

/**
 * 케어 통계
 */
export interface CareStatistics {
  userId: Id;
  petId?: Id;
  period: {
    startDate: Timestamp;
    endDate: Timestamp;
  };
  
  // 활동 통계
  activitiesCompleted: number;
  activitiesMissed: number;
  averageCompletionRate: number;
  mostCommonActivityType: CareActivityType;
  
  // 시간 통계
  totalTimeSpent: number; // 분
  averageTimePerActivity: number;
  peakActivityHours: number[];
  
  // 비용 통계
  totalExpenses: number;
  averageMonthlyExpense: number;
  expensesByCategory: Record<ExpenseCategory, number>;
  budgetAdherence: number; // %
  
  // 시뮬레이션 통계
  simulationsCompleted: number;
  averageSimulationScore: number;
  preferredScenarioTypes: SimulationScenarioType[];
}

/**
 * 케어 알림
 */
export interface CareNotification extends BaseEntity {
  userId: Id;
  petId?: Id;
  activityId?: Id;
  type: 'reminder' | 'overdue' | 'budget-warning' | 'achievement' | 'emergency';
  title: string;
  message: string;
  priority: CarePriority;
  isRead: boolean;
  readAt?: Timestamp;
  scheduledFor: Timestamp;
  
  // 액션 관련
  actionRequired: boolean;
  actionUrl?: string;
  actionText?: string;
}