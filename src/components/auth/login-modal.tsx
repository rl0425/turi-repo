/**
 * 로그인 모달 컴포넌트
 *
 * Progressive Profiling 방식의 간단한 소셜 로그인 모달입니다.
 * 진입장벽을 낮추기 위해 최소한의 정보만 요구합니다.
 */

"use client";

import { useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui";
import { SocialLoginButton, SocialIcons } from "./social-login-button";
import { useAuthStore } from "@/stores";

/**
 * 로그인 모달 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (모달 UI 렌더링)
 * - ViewModel: useAuthStore (모달 상태 관리)
 * - Model: SocialLoginButton (로그인 처리)
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 로그인 모달 UI만 담당
 * - 개방/폐쇄: 새로운 소셜 로그인 제공자 추가시 쉽게 확장 가능
 * - 의존성 역전: 구체적인 로그인 로직보다 추상화된 컴포넌트에 의존
 */
export function LoginModal() {
  const { showLoginModal, hideLogin } = useAuthStore();

  /**
   * 모달 닫기 핸들러
   */
  const handleClose = useCallback(() => {
    hideLogin();
  }, [hideLogin]);

  /**
   * 백드롭 클릭 핸들러
   */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  if (!showLoginModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="login-modal-title"
            className="text-xl font-bold text-gray-900"
          >
            PawWise 시작하기
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="로그인 모달 닫기"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 모달 본문 */}
        <div className="p-6">
          {/* 환영 메시지 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🐾</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              소셜 계정으로 간편하게 시작하세요.
              <br />
              추가 정보는 나중에 입력하셔도 됩니다.
            </p>
          </div>

          {/* 소셜 로그인 버튼들 */}
          <div className="space-y-3">
            <SocialLoginButton
              provider="google"
              icon={SocialIcons.google}
              size="lg"
            >
              Google로 계속하기
            </SocialLoginButton>

            <SocialLoginButton
              provider="kakao"
              icon={SocialIcons.kakao}
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400"
            >
              카카오로 계속하기
            </SocialLoginButton>

            <SocialLoginButton
              provider="github"
              icon={SocialIcons.github}
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white border-gray-900"
            >
              GitHub로 계속하기
            </SocialLoginButton>

            <SocialLoginButton
              provider="naver"
              icon={SocialIcons.naver}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white border-green-500"
            >
              네이버로 계속하기
            </SocialLoginButton>
          </div>

          {/* Progressive Profiling 안내 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              🚀 빠른 시작
            </h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• 소셜 로그인으로 즉시 서비스 이용 가능</li>
              <li>• 반려동물 검색과 가상 케어 체험</li>
              <li>• 입양 신청시 추가 정보 입력</li>
            </ul>
          </div>

          {/* 이용약관 및 개인정보처리방침 동의 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              계속 진행하시면{" "}
              <button className="text-blue-600 hover:underline">
                이용약관
              </button>{" "}
              및{" "}
              <button className="text-blue-600 hover:underline">
                개인정보처리방침
              </button>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 모바일용 로그인 바텀시트 컴포넌트
 *
 * 모바일 환경에서 더 나은 UX를 위한 바텀시트 형태의 로그인 모달
 */
export function LoginBottomSheet() {
  const { showLoginModal, hideLogin } = useAuthStore();

  const handleClose = useCallback(() => {
    hideLogin();
  }, [hideLogin]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  if (!showLoginModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50 md:hidden"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
        {/* 핸들러 */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-6"></div>

        {/* 컨텐츠 */}
        <div className="px-6 pb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              PawWise 시작하기
            </h2>
            <p className="text-gray-600 text-sm">
              소셜 계정으로 간편하게 시작하세요
            </p>
          </div>

          <div className="space-y-3">
            <SocialLoginButton
              provider="google"
              icon={SocialIcons.google}
              size="lg"
            >
              Google로 계속하기
            </SocialLoginButton>

            <SocialLoginButton
              provider="kakao"
              icon={SocialIcons.kakao}
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400"
            >
              카카오로 계속하기
            </SocialLoginButton>

            <SocialLoginButton
              provider="naver"
              icon={SocialIcons.naver}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white border-green-500"
            >
              네이버로 계속하기
            </SocialLoginButton>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              로그인하면 이용약관 및 개인정보처리방침에 동의하는 것으로
              간주됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
