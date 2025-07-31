/**
 * 사용자 상태 관리 스토어
 * 
 * MVVM 패턴에서 ViewModel 역할을 담당하며,
 * 사용자 프로필, 선호도, 관심목록 등을 관리합니다.
 * 
 * SOLID 원칙 적용:
 * - 단일 책임: 사용자 관련 상태와 로직만 담당
 * - 개방/폐쇄: 새로운 사용자 기능 추가시 기존 코드 수정 없이 확장
 * - 리스코프 치환: UserStore 인터페이스를 준수하는 모든 구현체 교체 가능
 * - 인터페이스 분리: 사용자 관련 기능만 노출
 * - 의존성 역전: 구체적인 API 구현에 의존하지 않음
 */

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  Id, 
  UserProfile, 
  UserPreferences, 
  UserFavorites,
  UserSearchHistory,
  AdoptionHistory 
} from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * 사용자 상태 인터페이스
 */
export interface UserState {
  // 프로필 정보
  profile: UserProfile | null;
  isProfileLoading: boolean;
  profileError: string | null;
  
  // 선호도 설정
  preferences: UserPreferences | null;
  isPreferencesLoading: boolean;
  preferencesError: string | null;
  
  // 관심 목록
  favorites: UserFavorites[];
  isFavoritesLoading: boolean;
  favoritesError: string | null;
  
  // 검색 기록
  searchHistory: UserSearchHistory[];
  isSearchHistoryLoading: boolean;
  searchHistoryError: string | null;
  
  // 입양 히스토리
  adoptionHistory: AdoptionHistory[];
  isAdoptionHistoryLoading: boolean;
  adoptionHistoryError: string | null;
  
  // UI 상태
  showOnboarding: boolean;
  currentOnboardingStep: number;
  showProfileCompleteModal: boolean;
}

/**
 * 사용자 액션 인터페이스
 */
export interface UserActions {
  // 프로필 관리
  loadProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  
  // 선호도 관리
  loadPreferences: () => Promise<void>;
  updatePreferences: (preferencesData: Partial<UserPreferences>) => Promise<void>;
  
  // 관심 목록 관리
  loadFavorites: () => Promise<void>;
  addToFavorites: (petId: Id, notes?: string) => Promise<void>;
  removeFromFavorites: (favoriteId: Id) => Promise<void>;
  updateFavoriteNotes: (favoriteId: Id, notes: string) => Promise<void>;
  isFavorite: (petId: Id) => boolean;
  
  // 검색 기록 관리
  loadSearchHistory: () => Promise<void>;
  addSearchHistory: (query: string, filters: Record<string, any>, resultCount: number) => Promise<void>;
  clearSearchHistory: () => Promise<void>;
  
  // 입양 히스토리 관리
  loadAdoptionHistory: () => Promise<void>;
  addAdoptionHistory: (petId: Id, adoptionDate: string, status: string) => Promise<void>;
  
  // 온보딩 관리
  startOnboarding: () => void;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  
  // 프로필 완성도 관리
  checkProfileCompleteness: () => boolean;
  showProfileComplete: () => void;
  hideProfileComplete: () => void;
  
  // 유틸리티
  isNewUser: () => boolean;
  getProfileCompletionPercentage: () => number;
  hasRequiredPreferences: () => boolean;
  
  // 에러 관리
  clearAllErrors: () => void;
  
  // 초기화
  reset: () => void;
}

/**
 * UserStore 전체 타입
 */
export type UserStore = UserState & UserActions;

/**
 * 초기 상태
 */
const initialState: UserState = {
  profile: null,
  isProfileLoading: false,
  profileError: null,
  preferences: null,
  isPreferencesLoading: false,
  preferencesError: null,
  favorites: [],
  isFavoritesLoading: false,
  favoritesError: null,
  searchHistory: [],
  isSearchHistoryLoading: false,
  searchHistoryError: null,
  adoptionHistory: [],
  isAdoptionHistoryLoading: false,
  adoptionHistoryError: null,
  showOnboarding: false,
  currentOnboardingStep: 0,
  showProfileCompleteModal: false,
};

/**
 * 사용자 상태 관리 스토어
 */
export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer<UserStore>((set, get) => ({
          ...initialState,
          
          // 프로필 로드
          loadProfile: async () => {
            set((state) => {
              state.isProfileLoading = true;
              state.profileError = null;
            });
            
            try {
              // TODO: API 호출 구현
              // const profile = await userApi.getProfile();
              
              // 임시 모의 데이터
              const mockProfile: UserProfile = {
                id: '1',
                userId: '1',
                firstName: '홍',
                lastName: '길동',
                location: {
                  city: '서울',
                  district: '강남구',
                },
                livingSpace: 'apartment',
                hasYard: false,
                hasOtherPets: false,
                householdSize: 2,
                hasChildren: false,
                petExperience: 'beginner',
                timeAvailable: 'medium',
                activityLevel: 'medium',
                budget: {
                  monthly: 200000,
                  initial: 500000,
                },
                contactPreferences: {
                  email: true,
                  sms: true,
                  push: true,
                },
                privacySettings: {
                  showProfile: true,
                  showLocation: false,
                  allowMessages: true,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              set((state) => {
                state.profile = mockProfile;
                state.isProfileLoading = false;
              });
              
            } catch (error: any) {
              set((state) => {
                state.isProfileLoading = false;
                state.profileError = error.message || '프로필을 불러오는데 실패했습니다.';
              });
              throw error;
            }
          },
          
          // 프로필 업데이트
          updateProfile: async (profileData: Partial<UserProfile>) => {
            set((state) => {
              state.isProfileLoading = true;
              state.profileError = null;
            });
            
            try {
              // TODO: API 호출 구현
              // const updatedProfile = await userApi.updateProfile(profileData);
              
              set((state) => {
                if (state.profile) {
                  Object.assign(state.profile, profileData);
                  state.profile.updatedAt = new Date().toISOString();
                }
                state.isProfileLoading = false;
              });
              
            } catch (error: any) {
              set((state) => {
                state.isProfileLoading = false;
                state.profileError = error.message || '프로필 업데이트에 실패했습니다.';
              });
              throw error;
            }
          },
          
          // 선호도 로드
          loadPreferences: async () => {
            set((state) => {
              state.isPreferencesLoading = true;
              state.preferencesError = null;
            });
            
            try {
              // TODO: API 호출 구현
              // const preferences = await userApi.getPreferences();
              
              // 임시 모의 데이터
              const mockPreferences: UserPreferences = {
                id: '1',
                userId: '1',
                preferredSpecies: ['dog'],
                preferredSizes: ['small', 'medium'],
                preferredAgeGroups: ['young', 'adult'],
                preferredPersonalities: ['friendly', 'calm'],
                searchRadius: 20,
                maxAdoptionFee: 300000,
                notifications: {
                  newMatches: true,
                  priceDrops: true,
                  applicationUpdates: true,
                  careReminders: true,
                  newsletter: false,
                },
                requirements: {
                  mustBeHouseTrained: true,
                  mustBeSpayedNeutered: true,
                  mustBeVaccinated: true,
                  goodWithChildren: false,
                  goodWithOtherPets: false,
                  noSpecialNeeds: false,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              set((state) => {
                state.preferences = mockPreferences;
                state.isPreferencesLoading = false;
              });
              
            } catch (error: any) {
              set((state) => {
                state.isPreferencesLoading = false;
                state.preferencesError = error.message || '선호도를 불러오는데 실패했습니다.';
              });
              throw error;
            }
          },
          
          // 선호도 업데이트
          updatePreferences: async (preferencesData: Partial<UserPreferences>) => {
            set((state) => {
              state.isPreferencesLoading = true;
              state.preferencesError = null;
            });
            
            try {
              // TODO: API 호출 구현
              // const updatedPreferences = await userApi.updatePreferences(preferencesData);
              
              set((state) => {
                if (state.preferences) {
                  Object.assign(state.preferences, preferencesData);
                  state.preferences.updatedAt = new Date().toISOString();
                }
                state.isPreferencesLoading = false;
              });
              
            } catch (error: any) {
              set((state) => {
                state.isPreferencesLoading = false;
                state.preferencesError = error.message || '선호도 업데이트에 실패했습니다.';
              });
              throw error;
            }
          },
          
          // 관심 목록 로드
          loadFavorites: async () => {
            set((state) => {
              state.isFavoritesLoading = true;
              state.favoritesError = null;
            });
            
            try {
              // TODO: API 호출 구현
              // const favorites = await userApi.getFavorites();
              
              set((state) => {
                state.favorites = []; // 임시로 빈 배열
                state.isFavoritesLoading = false;
              });
              
            } catch (error: any) {
              set((state) => {
                state.isFavoritesLoading = false;
                state.favoritesError = error.message || '관심 목록을 불러오는데 실패했습니다.';
              });
              throw error;
            }
          },
          
          // 관심 목록에 추가
          addToFavorites: async (petId: Id, notes?: string) => {
            try {
              // TODO: API 호출 구현
              // const favorite = await userApi.addFavorite({ petId, notes });
              
              const newFavorite: UserFavorites = {
                id: Date.now().toString(),
                userId: '1',
                petId,
                notes,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              set((state) => {
                state.favorites.push(newFavorite);
              });
              
            } catch (error: any) {
              throw error;
            }
          },
          
          // 관심 목록에서 제거
          removeFromFavorites: async (favoriteId: Id) => {
            try {
              // TODO: API 호출 구현
              // await userApi.removeFavorite(favoriteId);
              
              set((state) => {
                state.favorites = state.favorites.filter(fav => fav.id !== favoriteId);
              });
              
            } catch (error: any) {
              throw error;
            }
          },
          
          // 관심 목록 메모 업데이트
          updateFavoriteNotes: async (favoriteId: Id, notes: string) => {
            try {
              // TODO: API 호출 구현
              // await userApi.updateFavoriteNotes(favoriteId, notes);
              
              set((state) => {
                const favorite = state.favorites.find(fav => fav.id === favoriteId);
                if (favorite) {
                  favorite.notes = notes;
                  favorite.updatedAt = new Date().toISOString();
                }
              });
              
            } catch (error: any) {
              throw error;
            }
          },
          
          // 관심 목록에 있는지 확인
          isFavorite: (petId: Id) => {
            const { favorites } = get();
            return favorites.some(fav => fav.petId === petId);
          },
          
          // 검색 기록 로드
          loadSearchHistory: async () => {
            set((state) => {
              state.isSearchHistoryLoading = true;
              state.searchHistoryError = null;
            });
            
            try {
              // TODO: API 호출 구현
              // const history = await userApi.getSearchHistory();
              
              set((state) => {
                state.searchHistory = []; // 임시로 빈 배열
                state.isSearchHistoryLoading = false;
              });
              
            } catch (error: any) {
              set((state) => {
                state.isSearchHistoryLoading = false;
                state.searchHistoryError = error.message || '검색 기록을 불러오는데 실패했습니다.';
              });
            }
          },
          
          // 검색 기록 추가
          addSearchHistory: async (query: string, filters: Record<string, any>, resultCount: number) => {
            try {
              const newHistory: UserSearchHistory = {
                id: Date.now().toString(),
                userId: '1',
                searchQuery: query,
                filters,
                resultCount,
                clickedPets: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              set((state) => {
                // 최근 10개만 유지
                state.searchHistory = [newHistory, ...state.searchHistory].slice(0, 10);
              });
              
            } catch (error: any) {
              // 검색 기록 저장 실패는 사용자에게 알리지 않음
              console.warn('Failed to save search history:', error);
            }
          },
          
          // 검색 기록 삭제
          clearSearchHistory: async () => {
            try {
              // TODO: API 호출 구현
              // await userApi.clearSearchHistory();
              
              set((state) => {
                state.searchHistory = [];
              });
              
            } catch (error: any) {
              throw error;
            }
          },
          
          // 입양 히스토리 로드
          loadAdoptionHistory: async () => {
            set((state) => {
              state.isAdoptionHistoryLoading = true;
              state.adoptionHistoryError = null;
            });
            
            try {
              // TODO: API 호출 구현
              // const history = await userApi.getAdoptionHistory();
              
              set((state) => {
                state.adoptionHistory = []; // 임시로 빈 배열
                state.isAdoptionHistoryLoading = false;
              });
              
            } catch (error: any) {
              set((state) => {
                state.isAdoptionHistoryLoading = false;
                state.adoptionHistoryError = error.message || '입양 기록을 불러오는데 실패했습니다.';
              });
            }
          },
          
          // 입양 히스토리 추가
          addAdoptionHistory: async (petId: Id, adoptionDate: string, status: string) => {
            try {
              const newHistory: AdoptionHistory = {
                id: Date.now().toString(),
                userId: '1',
                petId,
                adoptionDate,
                status: status as any,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              set((state) => {
                state.adoptionHistory.push(newHistory);
              });
              
            } catch (error: any) {
              throw error;
            }
          },
          
          // 온보딩 시작
          startOnboarding: () => {
            set((state) => {
              state.showOnboarding = true;
              state.currentOnboardingStep = 0;
            });
          },
          
          // 온보딩 다음 단계
          nextOnboardingStep: () => {
            set((state) => {
              state.currentOnboardingStep += 1;
            });
          },
          
          // 온보딩 이전 단계
          prevOnboardingStep: () => {
            set((state) => {
              if (state.currentOnboardingStep > 0) {
                state.currentOnboardingStep -= 1;
              }
            });
          },
          
          // 온보딩 완료
          completeOnboarding: () => {
            set((state) => {
              state.showOnboarding = false;
              state.currentOnboardingStep = 0;
            });
          },
          
          // 온보딩 건너뛰기
          skipOnboarding: () => {
            set((state) => {
              state.showOnboarding = false;
              state.currentOnboardingStep = 0;
            });
          },
          
          // 프로필 완성도 확인
          checkProfileCompleteness: () => {
            const { profile, preferences } = get();
            if (!profile || !preferences) return false;
            
            // 필수 필드 확인
            const requiredProfileFields = [
              'firstName',
              'lastName',
              'location',
              'livingSpace',
              'petExperience',
              'activityLevel',
            ];
            
            const profileComplete = requiredProfileFields.every(
              field => profile[field as keyof UserProfile] != null
            );
            
            const preferencesComplete = preferences.preferredSpecies.length > 0;
            
            return profileComplete && preferencesComplete;
          },
          
          // 프로필 완성 모달 표시
          showProfileComplete: () => {
            set((state) => {
              state.showProfileCompleteModal = true;
            });
          },
          
          // 프로필 완성 모달 숨기기
          hideProfileComplete: () => {
            set((state) => {
              state.showProfileCompleteModal = false;
            });
          },
          
          // 신규 사용자 확인
          isNewUser: () => {
            const { profile } = get();
            if (!profile) return true;
            
            const createdAt = new Date(profile.createdAt);
            const now = new Date();
            const daysDiff = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
            
            return daysDiff < 7; // 7일 이내 가입자는 신규 사용자
          },
          
          // 프로필 완성도 퍼센티지
          getProfileCompletionPercentage: () => {
            const { profile, preferences } = get();
            if (!profile) return 0;
            
            let completedFields = 0;
            const totalFields = 8;
            
            if (profile.firstName) completedFields++;
            if (profile.lastName) completedFields++;
            if (profile.location) completedFields++;
            if (profile.livingSpace) completedFields++;
            if (profile.petExperience) completedFields++;
            if (profile.activityLevel) completedFields++;
            if (profile.budget) completedFields++;
            if (preferences?.preferredSpecies.length) completedFields++;
            
            return Math.round((completedFields / totalFields) * 100);
          },
          
          // 필수 선호도 설정 확인
          hasRequiredPreferences: () => {
            const { preferences } = get();
            return preferences?.preferredSpecies.length > 0 || false;
          },
          
          // 모든 에러 제거
          clearAllErrors: () => {
            set((state) => {
              state.profileError = null;
              state.preferencesError = null;
              state.favoritesError = null;
              state.searchHistoryError = null;
              state.adoptionHistoryError = null;
            });
          },
          
          // 상태 초기화
          reset: () => {
            set((state) => {
              Object.assign(state, initialState);
            });
          },
        }))
      ),
      {
        name: STORAGE_KEYS.USER_PREFERENCES,
        partialize: (state) => ({
          preferences: state.preferences,
          searchHistory: state.searchHistory,
          showOnboarding: state.showOnboarding,
        }),
      }
    ),
    { name: 'user-store' }
  )
);