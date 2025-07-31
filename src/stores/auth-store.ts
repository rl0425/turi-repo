/**
 * 인증 상태 관리 스토어
 * 
 * MVVM 패턴에서 ViewModel 역할을 담당하며,
 * 사용자 인증, 권한 관리, 토큰 관리 등을 담당합니다.
 * 
 * SOLID 원칙 적용:
 * - 단일 책임: 인증 관련 상태와 로직만 담당
 * - 개방/폐쇄: 새로운 인증 방식 추가시 기존 코드 수정 없이 확장
 * - 리스코프 치환: AuthStore 인터페이스를 준수하는 모든 구현체 교체 가능
 * - 인터페이스 분리: 인증 관련 기능만 노출
 * - 의존성 역전: 구체적인 API 구현에 의존하지 않음
 */

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { User, UserRole, AuthProvider } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { supabase, signInWithSocial, signOut, type SocialProvider } from '@/lib/supabase';

/**
 * Progressive Profiling 단계
 */
export type ProfileCompletionStep = 'basic' | 'preferences' | 'contact' | 'completed';

/**
 * 인증 상태 인터페이스
 */
export interface AuthState {
  // 인증 상태
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ExtendedUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  // 권한 정보
  permissions: string[];
  role: UserRole | null;
  
  // Progressive Profiling 상태
  profileCompletionStep: ProfileCompletionStep;
  showProfileCompletionModal: boolean;
  profileCompletionRequired: boolean;
  
  // 에러 상태
  error: string | null;
  
  // UI 상태
  showLoginModal: boolean;
  showRegisterModal: boolean;
  rememberMe: boolean;
}

/**
 * 확장된 사용자 타입 (Progressive Profiling용)
 */
export interface ExtendedUser extends Omit<User, 'avatar'> {
  profileImage?: string;
  provider?: string;
  birthDate?: string;
  preferences?: {
    petPreference?: 'dog' | 'cat' | 'both';
    livingSpace?: 'apartment' | 'house' | 'villa';
    experience?: 'beginner' | 'experienced' | 'expert';
  };
  profileCompleted: boolean;
  profileCompletionProgress: number; // 0-100
}

/**
 * 인증 액션 인터페이스
 */
export interface AuthActions {
  // 인증 액션
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithSocial: (provider: SocialProvider) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<ExtendedUser>) => Promise<void>;
  refreshTokens: () => Promise<void>;
  
  // Supabase 세션 관리
  setUser: (user: ExtendedUser) => void;
  setAuthenticated: (authenticated: boolean) => void;
  initializeAuth: () => Promise<void>;
  
  // 사용자 정보 관리
  updateUser: (userData: Partial<ExtendedUser>) => void;
  
  // Progressive Profiling
  showProfileCompletion: (step: ProfileCompletionStep, required?: boolean) => void;
  hideProfileCompletion: () => void;
  setProfileCompletionStep: (step: ProfileCompletionStep) => void;
  calculateProfileProgress: () => number;
  requireProfileCompletion: (requiredStep: ProfileCompletionStep) => boolean;
  
  // 권한 관리
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  
  // 토큰 관리
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  
  // UI 상태 관리
  showLogin: () => void;
  hideLogin: () => void;
  showRegister: () => void;
  hideRegister: () => void;
  toggleRememberMe: () => void;
  
  // 에러 관리
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // 로딩 상태 관리
  setLoading: (loading: boolean) => void;
  
  // 초기화
  reset: () => void;
}

/**
 * AuthStore 전체 타입
 */
export type AuthStore = AuthState & AuthActions;

/**
 * 초기 상태
 */
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  permissions: [],
  role: null,
  
  // Progressive Profiling 초기 상태
  profileCompletionStep: 'basic',
  showProfileCompletionModal: false,
  profileCompletionRequired: false,
  
  error: null,
  showLoginModal: false,
  showRegisterModal: false,
  rememberMe: false,
};

/**
 * 인증 상태 관리 스토어
 * 
 * Zustand + Immer + Persist 미들웨어를 사용하여
 * 불변성 유지와 로컬 스토리지 동기화를 제공합니다.
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer<AuthStore>((set, get) => ({
          ...initialState,
          
          // 인증 초기화 (앱 시작시 호출)
          initializeAuth: async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              
              if (session?.user) {
                const extendedUser: ExtendedUser = {
                  id: session.user.id,
                  email: session.user.email || '',
                  username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'user',
                  displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '사용자',
                  profileImage: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
                  role: 'user',
                  authProvider: session.user.app_metadata?.provider as AuthProvider || 'email',
                  provider: session.user.app_metadata?.provider,
                  emailVerified: session.user.email_confirmed_at ? true : false,
                  phoneNumber: session.user.user_metadata?.phone,
                  phoneVerified: session.user.phone_confirmed_at ? true : false,
                  birthDate: session.user.user_metadata?.birth_date,
                  isActive: true,
                  createdAt: session.user.created_at,
                  updatedAt: session.user.updated_at || session.user.created_at,
                  preferences: session.user.user_metadata?.preferences || {},
                  profileCompleted: session.user.user_metadata?.profile_completed || false,
                  profileCompletionProgress: 0,
                };

                set((state) => {
                  state.isAuthenticated = true;
                  state.user = extendedUser;
                  state.role = extendedUser.role;
                  state.permissions = ['read:profile', 'write:profile'];
                  state.profileCompletionStep = session.user.user_metadata?.profile_completion_step || 'basic';
                });

                // 프로필 완성도 계산
                get().calculateProfileProgress();
              }
            } catch (error) {
              console.error('Authentication initialization failed:', error);
            }
          },

          // 이메일 로그인
          login: async (email: string, password: string, rememberMe = false) => {
            set((state) => {
              state.isLoading = true;
              state.error = null;
              state.rememberMe = rememberMe;
            });
            
            try {
              const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (error) throw error;

              if (data.user) {
                const extendedUser: ExtendedUser = {
                  id: data.user.id,
                  email: data.user.email || '',
                  username: data.user.user_metadata?.username || email.split('@')[0],
                  displayName: data.user.user_metadata?.full_name || '사용자',
                  role: 'user',
                  authProvider: 'email',
                  emailVerified: data.user.email_confirmed_at ? true : false,
                  phoneVerified: data.user.phone_confirmed_at ? true : false,
                  isActive: true,
                  createdAt: data.user.created_at,
                  updatedAt: data.user.updated_at || data.user.created_at,
                  profileCompleted: false,
                  profileCompletionProgress: 0,
                };

                set((state) => {
                  state.isAuthenticated = true;
                  state.user = extendedUser;
                  state.role = extendedUser.role;
                  state.permissions = ['read:profile', 'write:profile'];
                  state.isLoading = false;
                  state.showLoginModal = false;
                });
              }
              
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
              set((state) => {
                state.isLoading = false;
                state.error = errorMessage;
              });
              throw error;
            }
          },

          // 소셜 로그인
          loginWithSocial: async (provider: SocialProvider) => {
            set((state) => {
              state.isLoading = true;
              state.error = null;
            });

            try {
              await signInWithSocial(provider);
              // 리다이렉트가 발생하므로 여기서는 상태를 업데이트하지 않음
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : '소셜 로그인에 실패했습니다.';
              set((state) => {
                state.isLoading = false;
                state.error = errorMessage;
              });
              throw error;
            }
          },

          // 사용자 설정 (Supabase 콜백에서 사용)
          setUser: (user: ExtendedUser) => {
            set((state) => {
              state.user = user;
              state.role = user.role;
            });
          },

          // 인증 상태 설정
          setAuthenticated: (authenticated: boolean) => {
            set((state) => {
              state.isAuthenticated = authenticated;
            });
          },
          
          // 로그아웃
          logout: async () => {
            set((state) => {
              state.isLoading = true;
            });
            
            try {
              await signOut();
              
              set((state) => {
                Object.assign(state, initialState);
              });
              
            } catch (_error: unknown) {
              // 로그아웃은 실패해도 로컬 상태는 초기화
              set((state) => {
                Object.assign(state, initialState);
              });
            }
          },
          
          // 회원가입 (추후 구현)
          register: async (_userData: Partial<ExtendedUser>) => {
            set((state) => {
              state.isLoading = true;
              state.error = null;
            });
            
            try {
              // TODO: Supabase 회원가입 구현
              
              set((state) => {
                state.isLoading = false;
                state.showRegisterModal = false;
                state.showLoginModal = true;
              });
              
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
              set((state) => {
                state.isLoading = false;
                state.error = errorMessage;
              });
              throw error;
            }
          },
          
          // 토큰 갱신
          refreshTokens: async () => {
            const { refreshToken } = get();
            if (!refreshToken) {
              throw new Error('Refresh token not found');
            }
            
            try {
              // TODO: API 호출 구현
              // const response = await authApi.refreshTokens(refreshToken);
              
              // 임시 모의 응답
              const newTokens = {
                accessToken: 'new-mock-access-token',
                refreshToken: 'new-mock-refresh-token',
              };
              
              set((state) => {
                state.accessToken = newTokens.accessToken;
                state.refreshToken = newTokens.refreshToken;
              });
              
            } catch (error) {
              // 토큰 갱신 실패시 로그아웃
              get().logout();
              throw error;
            }
          },
          
          // 사용자 정보 업데이트
          updateUser: (userData: Partial<ExtendedUser>) => {
            set((state) => {
              if (state.user) {
                Object.assign(state.user, userData);
                // 프로필 완성도 재계산
                state.user.profileCompletionProgress = get().calculateProfileProgress();
              }
            });
          },

          // Progressive Profiling 함수들
          showProfileCompletion: (step: ProfileCompletionStep, required = false) => {
            set((state) => {
              state.showProfileCompletionModal = true;
              state.profileCompletionStep = step;
              state.profileCompletionRequired = required;
            });
          },

          hideProfileCompletion: () => {
            set((state) => {
              state.showProfileCompletionModal = false;
              state.profileCompletionRequired = false;
            });
          },

          setProfileCompletionStep: (step: ProfileCompletionStep) => {
            set((state) => {
              state.profileCompletionStep = step;
            });
          },

          calculateProfileProgress: () => {
            const { user } = get();
            if (!user) return 0;

            let progress = 0;
            const totalFields = 7; // 전체 필드 수

            // 기본 정보 체크
            if (user.displayName) progress += 1;
            if (user.email) progress += 1;
            if (user.phoneNumber) progress += 1;
            if (user.birthDate) progress += 1;

            // 선호도 정보 체크
            if (user.preferences?.petPreference) progress += 1;
            if (user.preferences?.livingSpace) progress += 1;
            if (user.preferences?.experience) progress += 1;

            const percentage = Math.round((progress / totalFields) * 100);
            
            // 사용자 정보 업데이트
            set((state) => {
              if (state.user) {
                state.user.profileCompletionProgress = percentage;
                state.user.profileCompleted = percentage >= 70; // 70% 이상이면 완성으로 간주
              }
            });

            return percentage;
          },

          requireProfileCompletion: (requiredStep: ProfileCompletionStep) => {
            const { user } = get();
            if (!user) return true; // 로그인하지 않은 경우 완성 필요

            const stepPriority = {
              'basic': 1,
              'preferences': 2,
              'contact': 3,
              'completed': 4,
            };

            const currentStepPriority = stepPriority[user.profileCompleted ? 'completed' : get().profileCompletionStep];
            const requiredStepPriority = stepPriority[requiredStep];

            return currentStepPriority < requiredStepPriority;
          },
          
          // 권한 확인
          hasPermission: (permission: string) => {
            const { permissions } = get();
            return permissions.includes(permission);
          },
          
          // 역할 확인
          hasRole: (role: UserRole) => {
            const { role: userRole } = get();
            return userRole === role;
          },
          
          // 여러 역할 중 하나라도 가지고 있는지 확인
          hasAnyRole: (roles: UserRole[]) => {
            const { role: userRole } = get();
            return userRole ? roles.includes(userRole) : false;
          },
          
          // 토큰 설정
          setTokens: (accessToken: string, refreshToken: string) => {
            set((state) => {
              state.accessToken = accessToken;
              state.refreshToken = refreshToken;
            });
          },
          
          // 토큰 제거
          clearTokens: () => {
            set((state) => {
              state.accessToken = null;
              state.refreshToken = null;
            });
          },
          
          // UI 상태 관리
          showLogin: () => {
            set((state) => {
              state.showLoginModal = true;
              state.showRegisterModal = false;
            });
          },
          
          hideLogin: () => {
            set((state) => {
              state.showLoginModal = false;
            });
          },
          
          showRegister: () => {
            set((state) => {
              state.showRegisterModal = true;
              state.showLoginModal = false;
            });
          },
          
          hideRegister: () => {
            set((state) => {
              state.showRegisterModal = false;
            });
          },
          
          toggleRememberMe: () => {
            set((state) => {
              state.rememberMe = !state.rememberMe;
            });
          },
          
          // 에러 관리
          setError: (error: string | null) => {
            set((state) => {
              state.error = error;
            });
          },
          
          clearError: () => {
            set((state) => {
              state.error = null;
            });
          },
          
          // 로딩 상태 관리
          setLoading: (loading: boolean) => {
            set((state) => {
              state.isLoading = loading;
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
        name: STORAGE_KEYS.ACCESS_TOKEN,
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          role: state.role,
          permissions: state.permissions,
          isAuthenticated: state.isAuthenticated,
          rememberMe: state.rememberMe,
          profileCompletionStep: state.profileCompletionStep,
        }),
        // 기본적으로 localStorage 사용
        storage: {
          getItem: (name) => {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
            sessionStorage.removeItem(name);
          },
        },
      }
    ),
    { name: 'auth-store' }
  )
);