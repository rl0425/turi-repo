/**
 * 소셜 로그인 버튼 컴포넌트
 *
 * 다양한 소셜 로그인 제공자를 위한 재사용 가능한 버튼 컴포넌트입니다.
 */

"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { signInWithSocial, type SocialProvider } from "@/lib/supabase";
import { toast } from "sonner";

interface SocialLoginButtonProps {
  /** 소셜 로그인 제공자 */
  provider: SocialProvider;
  /** 버튼에 표시될 텍스트 */
  children: React.ReactNode;
  /** 버튼 아이콘 */
  icon?: React.ReactNode;
  /** 로그인 성공 후 리다이렉트할 URL */
  redirectTo?: string;
  /** 버튼 크기 */
  size?: "sm" | "default" | "lg";
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 소셜 로그인 버튼 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (버튼 UI 렌더링)
 * - ViewModel: useState (로딩 상태 관리)
 * - Model: Supabase Auth (소셜 로그인 처리)
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 소셜 로그인 버튼 UI와 상호작용만 담당
 * - 개방/폐쇄: 새로운 provider 추가시 기존 코드 수정 없이 확장 가능
 * - 의존성 역전: 구체적인 UI 라이브러리가 아닌 props로 추상화
 */
export function SocialLoginButton({
  provider,
  children,
  icon,
  redirectTo,
  size = "default",
  fullWidth = true,
  className = "",
}: SocialLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 소셜 로그인 처리 핸들러
   */
  const handleSocialLogin = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await signInWithSocial(provider, redirectTo);
      // 성공시 리다이렉트가 자동으로 처리됨
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error);

      // 사용자 친화적인 에러 메시지
      const errorMessage = getErrorMessage(provider, error as Error);
      toast.error(errorMessage);

      setIsLoading(false);
    }
  }, [provider, redirectTo, isLoading]);

  return (
    <Button
      onClick={handleSocialLogin}
      disabled={isLoading}
      size={size}
      variant="outline"
      className={`
        ${fullWidth ? "w-full" : ""}
        ${className}
        flex items-center justify-center space-x-3
        hover:shadow-md transition-shadow
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-label={`${provider}로 로그인`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span>로그인 중...</span>
        </div>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </Button>
  );
}

/**
 * 소셜 로그인 제공자별 아이콘 컴포넌트
 */
export const SocialIcons = {
  google: (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  ),
  kakao: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
      <path d="M12 3C7.03 3 3 6.73 3 11.18c0 2.84 1.86 5.32 4.61 6.81l-.95 3.49c-.09.33.25.59.53.4l4.12-2.74c.23.01.46.02.69.02 4.97 0 9-3.73 9-8.18S16.97 3 12 3z" />
    </svg>
  ),
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  apple: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  ),
  naver: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#03C75A">
      <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
    </svg>
  ),
};

/**
 * 소셜 로그인 오류 메시지 생성
 */
function getErrorMessage(provider: SocialProvider, error: Error): string {
  const providerNames = {
    google: "구글",
    kakao: "카카오",
    github: "깃허브",
    apple: "애플",
    naver: "네이버",
  };

  const providerName = providerNames[provider] || provider;

  // 일반적인 오류 케이스들
  if (error.message?.includes("popup_closed")) {
    return "로그인 창이 닫혔습니다. 다시 시도해주세요.";
  }

  if (error.message?.includes("access_denied")) {
    return "로그인이 취소되었습니다.";
  }

  if (error.message?.includes("network")) {
    return "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
  }

  return `${providerName} 로그인 중 문제가 발생했습니다. 다시 시도해주세요.`;
}
