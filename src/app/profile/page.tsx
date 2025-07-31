/**
 * 마이(프로필) 페이지
 *
 * 사용자 프로필 및 개인 설정을 관리하는 페이지입니다.
 * 로그인 상태에 따라 다른 UI를 제공합니다.
 */

"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores";
import { Button, Card } from "@/components/ui";
import { MobileNavigation } from "@/components/common/mobile-navigation";
import {
  ArrowLeft,
  User,
  Heart,
  FileText,
  PawPrint,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";

/**
 * 마이 페이지 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (프로필 페이지 UI 렌더링)
 * - ViewModel: useAuthStore (인증 상태 관리)
 * - Model: 사용자 데이터 (스토어에서 관리)
 */
export default function ProfilePage() {
  // ViewModel 계층 - 인증 상태 관리
  const { isAuthenticated, user, showLogin, logout } = useAuthStore();

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  }, [logout]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">마이</h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pb-20">
        {/* 로그인하지 않은 경우 */}
        {!isAuthenticated && (
          <div className="px-4 py-12">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                로그인이 필요합니다
              </h2>
              <p className="text-gray-600 mb-6">
                PawWise의 모든 기능을 이용하려면 로그인해주세요
              </p>
              <Button onClick={showLogin} className="px-8">
                로그인하기
              </Button>
            </div>

            {/* 게스트용 메뉴 */}
            <div className="space-y-4">
              <Card className="p-4 border-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">고객센터</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>

              <Card className="p-4 border-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">설정</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* 로그인한 경우 */}
        {isAuthenticated && (
          <div className="px-4 py-6">
            {/* 프로필 섹션 */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="프로필"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-blue-600" />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {user?.displayName || "사용자"}님
              </h2>
              <p className="text-gray-600">
                {user?.email || "이메일 정보 없음"}
              </p>
            </div>

            {/* 주요 메뉴 섹션 */}
            <div className="space-y-4 mb-8">
              <Card className="p-4 border-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">관심 목록</h3>
                      <p className="text-sm text-gray-600">
                        0개의 관심 반려동물
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>

              <Card className="p-4 border-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        입양 신청 내역
                      </h3>
                      <p className="text-sm text-gray-600">0개의 신청</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>

              <Card className="p-4 border-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <PawPrint className="h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        가상 케어 진행률
                      </h3>
                      <p className="text-sm text-gray-600">
                        아직 시작하지 않았습니다
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>
            </div>

            {/* 기타 메뉴 섹션 */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-900">기타</h3>

              <Card className="p-4 border-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">고객센터</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>

              <Card className="p-4 border-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">설정</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>
            </div>

            {/* 로그아웃 버튼 */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                로그아웃
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* 하단 네비게이션 */}
      <MobileNavigation />
    </div>
  );
}
