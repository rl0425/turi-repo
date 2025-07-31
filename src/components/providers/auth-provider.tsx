/**
 * 인증 제공자 컴포넌트
 *
 * 애플리케이션 전체의 인증 상태를 관리하고
 * 인증 관련 모달들을 렌더링합니다.
 */

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import { LoginModal, ProfileCompletionModal } from "@/components/auth";
import { supabase } from "@/lib/supabase";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 인증 제공자 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 인증 모달들 렌더링
 * - ViewModel: useAuthStore (인증 상태 관리)
 * - Model: Supabase Auth (인증 서비스)
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 인증 상태 초기화와 모달 렌더링만 담당
 * - 개방/폐쇄: 새로운 인증 모달 추가시 쉽게 확장 가능
 * - 의존성 역전: 구체적인 인증 서비스가 아닌 추상화된 스토어에 의존
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const {
    initializeAuth,
    setUser,
    setAuthenticated,
    showProfileCompletionModal,
    profileCompletionStep,
    hideProfileCompletion,
  } = useAuthStore();

  useEffect(() => {
    // 앱 시작시 인증 상태 초기화
    initializeAuth();

    // Supabase 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (event === "SIGNED_IN" && session?.user) {
        const extendedUser = {
          id: session.user.id,
          email: session.user.email || "",
          username:
            session.user.user_metadata?.username ||
            session.user.email?.split("@")[0] ||
            "user",
          displayName:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            "사용자",
          profileImage:
            session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture,
          role: "user" as const,
          authProvider: (session.user.app_metadata?.provider as any) || "email",
          provider: session.user.app_metadata?.provider,
          emailVerified: session.user.email_confirmed_at ? true : false,
          phoneNumber: session.user.user_metadata?.phone,
          phoneVerified: session.user.phone_confirmed_at ? true : false,
          birthDate: session.user.user_metadata?.birth_date,
          isActive: true,
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at || session.user.created_at,
          preferences: session.user.user_metadata?.preferences || {},
          profileCompleted:
            session.user.user_metadata?.profile_completed || false,
          profileCompletionProgress: 0,
        };

        setUser(extendedUser);
        setAuthenticated(true);
      } else if (event === "SIGNED_OUT") {
        setAuthenticated(false);
        setUser({} as any); // Reset user
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth, setUser, setAuthenticated]);

  return (
    <>
      {children}

      {/* 인증 관련 모달들 */}
      <LoginModal />

      {/* Progressive Profiling 모달 */}
      <ProfileCompletionModal
        isOpen={showProfileCompletionModal}
        onClose={hideProfileCompletion}
        step={profileCompletionStep}
        onComplete={() => {
          // 프로필 완성 후 처리
          hideProfileCompletion();
        }}
      />
    </>
  );
}
