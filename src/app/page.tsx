/**
 * PawWise 모바일 앱 홈페이지
 *
 * MVVM 패턴에서 View 계층의 메인 페이지 컴포넌트입니다.
 * 모바일 퍼스트 디자인으로 네이티브 앱과 같은 UX를 제공합니다.
 */

"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { useFeaturedPets } from "@/hooks/use-pets";
import { Button, Card, Badge } from "@/components/ui";
import { MobileNavigation } from "@/components/common/mobile-navigation";
import { SearchBottomSheet, SearchModal } from "@/components/search";
import { Bell, PawPrint, Search, Shield, Stethoscope } from "lucide-react";
import { APP_NAME } from "@/utils/constants";
import { toast } from "sonner";
import Image from "next/image";

/**
 * 모바일 앱 홈페이지 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (모바일 UI 렌더링)
 * - ViewModel: useAuthStore, useUIStore (상태 및 비즈니스 로직)
 * - Model: React Query (데이터 패칭, 추후 구현)
 */
export default function MobileHomePage() {
  // ViewModel 계층 - 상태 및 비즈니스 로직
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // React Query로 서버 상태 관리
  const {
    data: featuredPets = [],
    isLoading,
    error,
    refetch: refetchFeaturedPets,
  } = useFeaturedPets();

  // 로컬 상태
  const [showAdoptionCheck, setShowAdoptionCheck] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  /**
   * 입양 전 체크리스트 표시
   */
  const handleShowAdoptionCheck = useCallback(() => {
    setShowAdoptionCheck(true);
  }, []);

  /**
   * 가상 케어 시작
   */
  const handleStartVirtualCare = useCallback(() => {
    router.push("/care");
    toast.success("가상 케어를 시작합니다!");
  }, [router]);

  /**
   * 검색 모달 열기
   */
  const handleOpenSearch = useCallback(() => {
    setShowSearchModal(true);
  }, []);

  // React Query가 자동으로 데이터를 fetch하므로 useEffect 불필요

  /**
   * 검색 모달 닫기
   */
  const handleCloseSearch = useCallback(() => {
    setShowSearchModal(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PawPrint className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">{APP_NAME}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-gray-600" />
            <button
              onClick={handleOpenSearch}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="검색"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* 홈 페이지 메인 콘텐츠 */}
      <main className="pb-20">
        <div className="px-4 py-6 space-y-6">
          {/* 환영 메시지 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-2">
              {isAuthenticated
                ? `안녕하세요, ${user?.displayName || "사용자"}님!`
                : "안녕하세요!"}
            </h2>
            <p className="text-blue-100 mb-4">
              오늘도 새로운 가족을 찾고 있나요?
            </p>
            <Button
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={handleShowAdoptionCheck}
            >
              입양 준비도 체크하기
            </Button>
          </div>

          {/* 빠른 액션 */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center border-0 shadow-sm">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">맞춤 검색</h3>
              <p className="text-sm text-gray-600 mb-3">
                나에게 맞는 반려동물 찾기
              </p>
              <Button size="sm" className="w-full" onClick={handleOpenSearch}>
                검색하기
              </Button>
            </Card>

            <Card className="p-4 text-center border-0 shadow-sm">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">가상 케어</h3>
              <p className="text-sm text-gray-600 mb-3">
                반려 생활 미리 체험하기
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={handleStartVirtualCare}
              >
                체험하기
              </Button>
            </Card>
          </div>

          {/* 최근 입양 가능한 친구들 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">새로운 친구들</h3>
              <Link href="/adoption">
                <Button variant="ghost" size="sm">
                  더보기
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {/* 로딩 중이고 데이터가 없는 경우 */}
              {isLoading && featuredPets.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    새로운 친구들을 불러오는 중...
                  </span>
                </div>
              ) : error && featuredPets.length === 0 ? (
                /* 에러 상태이고 데이터가 없는 경우 */
                <div className="text-center py-8">
                  <p className="text-red-600 mb-2">
                    {error instanceof Error
                      ? error.message
                      : "데이터를 불러오는데 실패했습니다."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchFeaturedPets()}
                  >
                    다시 시도
                  </Button>
                </div>
              ) : featuredPets.length > 0 ? (
                /* 데이터가 있는 경우 (로딩 중이어도 기존 데이터 유지) */
                <>
                  {/* 백그라운드 로딩 표시 */}
                  {isLoading && (
                    <div className="flex items-center justify-center py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-500">
                        업데이트 중...
                      </span>
                    </div>
                  )}

                  {featuredPets.slice(0, 3).map((pet) => (
                    <Link key={pet.id} href={`/adoption/${pet.id}`}>
                      <Card className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            {pet.images && pet.images.length > 0 ? (
                              <Image
                                src={pet.images[0].url}
                                alt={pet.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full">
                                <PawPrint className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {pet.name}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {pet.gender === "male"
                                  ? "수컷"
                                  : pet.gender === "female"
                                    ? "암컷"
                                    : "미상"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {pet.age.years > 0
                                ? `${pet.age.years}살`
                                : pet.age.months > 0
                                  ? `${pet.age.months}개월`
                                  : "나이 미상"}
                              {pet.weight && ` • ${pet.weight}kg`}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {pet.location.city || pet.location.address}
                            </p>
                          </div>
                          <div className="h-5 w-5 text-gray-400">❤️</div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </>
              ) : (
                /* 데이터 없음 상태 */
                <div className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <PawPrint className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      아직 새로운 친구들이 없습니다
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 반려백과 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">반려백과</h3>
              <Link href="/study">
                <Button variant="ghost" size="sm">
                  더보기
                </Button>
              </Link>
            </div>

            <Link href="/study/dictionary/1">
              <Card className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Stethoscope className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      건강
                    </Badge>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      개가 싫어하는 냄새 종류 5가지 - 이런 냄새는 피해주세요!
                    </h4>
                    <p className="text-xs text-gray-500">2024.10.24</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      {/* 입양 전 체크리스트 모달 */}
      {showAdoptionCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                입양 전 마음가짐 체크리스트
              </h3>

              <div className="space-y-4 mt-6">
                {[
                  "새로운 가족이 생긴다는 설렘과 책임감을 느끼잖아요?",
                  "강아지와 소중한 시간을 나누고 싶어잖아요?",
                  "강아지를 끝까지 지켜줄 수 있다는 확신이 드시나요?",
                  "사랑으로 우리 아이를 돌볼 준비가 되셨나요?",
                ].map((question, index) => (
                  <div key={index} className="bg-gray-100 rounded-2xl p-4">
                    <p className="text-gray-800">{question}</p>
                  </div>
                ))}
              </div>

              <p className="text-center text-gray-600 mt-6 text-sm">
                모든 항목에 마음을 담아 &quot;네!&quot;라고 답하실 수 있다면,
                이제 입양 신청을 시작해보세요! 🐾
              </p>

              <div className="mt-8 space-y-3">
                <Link href="/adoption">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowAdoptionCheck(false)}
                  >
                    입양 신청 바로가기
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowAdoptionCheck(false)}
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 검색 모달 */}
      <SearchBottomSheet isOpen={showSearchModal} onClose={handleCloseSearch} />
      <SearchModal isOpen={showSearchModal} onClose={handleCloseSearch} />

      {/* 하단 네비게이션 */}
      <MobileNavigation />
    </div>
  );
}
