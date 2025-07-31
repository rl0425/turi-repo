/**
 * 소셜 로그인 콜백 페이지
 *
 * 소셜 로그인 후 리다이렉트되는 페이지입니다.
 * 인증 처리를 완료하고 적절한 페이지로 이동시킵니다.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

/**
 * 인증 콜백 페이지 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 로딩 UI 렌더링
 * - ViewModel: useAuthStore (인증 상태 관리)
 * - Model: Supabase Auth (인증 처리)
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser, setAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 인증 정보 처리
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("인증 콜백 오류:", error);
          toast.error("로그인 중 문제가 발생했습니다.");
          router.push(ROUTES.HOME);
          return;
        }

        if (data.session) {
          const user = data.session.user;

          // 사용자 정보를 스토어에 저장
          setUser({
            id: user.id,
            email: user.email || "",
            displayName:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              "사용자",
            profileImage:
              user.user_metadata?.avatar_url || user.user_metadata?.picture,
            provider: user.app_metadata?.provider,
            createdAt: user.created_at,
            // Progressive Profiling을 위한 필드들
            phoneNumber: user.user_metadata?.phone,
            birthDate: user.user_metadata?.birth_date,
            preferences: user.user_metadata?.preferences || {},
            profileCompleted: false, // 초기에는 미완성 상태
          });

          setAuthenticated(true);

          // 신규 사용자인지 확인 (가입일이 최근 1분 이내)
          const isNewUser =
            new Date().getTime() - new Date(user.created_at).getTime() < 60000;

          if (isNewUser) {
            toast.success("PawWise에 오신 것을 환영합니다! 🐾");
            // 신규 사용자는 온보딩 페이지로 (추후 구현)
            router.push(ROUTES.HOME);
          } else {
            toast.success("다시 오신 것을 환영합니다!");
            router.push(ROUTES.HOME);
          }
        } else {
          // 세션이 없는 경우 홈으로 이동
          router.push(ROUTES.HOME);
        }
      } catch (error) {
        console.error("인증 처리 중 오류:", error);
        toast.error("로그인 처리 중 문제가 발생했습니다.");
        router.push(ROUTES.HOME);
      }
    };

    handleAuthCallback();
  }, [router, setUser, setAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
          <span className="text-3xl">🐾</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          로그인 처리 중...
        </h2>
        <p className="text-gray-600">잠시만 기다려주세요</p>
      </div>
    </div>
  );
}
