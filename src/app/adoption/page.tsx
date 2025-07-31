/**
 * 입양 페이지
 *
 * 반려동물 검색 및 입양 관련 기능을 제공하는 페이지입니다.
 * 사용자의 제공된 스크린샷과 동일한 디자인과 기능을 구현합니다.
 */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Card, Badge } from "@/components/ui";
import { MobileNavigation } from "@/components/common/mobile-navigation";
import { ArrowLeft, Filter, Search, PawPrint } from "lucide-react";
import { APP_NAME } from "@/utils/constants";
import { useAllPets } from "@/hooks/use-pets";
import { usePetStore } from "@/stores";

/**
 * 입양 페이지 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (입양 페이지 UI 렌더링)
 * - ViewModel: useState hooks (상태 관리)
 * - Model: 더미 데이터 (추후 API 연동)
 */
export default function AdoptionPage() {
  // 로컬 상태 관리
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [showFilter, setShowFilter] = useState(false);

  // React Query로 실제 데이터 가져오기
  const { searchFilters } = usePetStore();
  const filters =
    selectedCategory !== "전체"
      ? {
          ...searchFilters,
          species:
            selectedCategory === "개"
              ? ("dog" as const)
              : selectedCategory === "고양이"
                ? ("cat" as const)
                : undefined,
        }
      : searchFilters;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAllPets(filters);

  const pets = data?.pages.flatMap((page) => page.pets) ?? [];

  /**
   * 필터 모달 토글
   */
  const handleToggleFilter = useCallback(() => {
    setShowFilter(!showFilter);
  }, [showFilter]);

  /**
   * 카테고리 선택 핸들러
   */
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  /**
   * 더 많은 데이터 로드
   */
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const categories = ["전체", "개", "고양이"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">입양</h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleToggleFilter}
              className="p-2"
              aria-label="필터 열기"
            >
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2" aria-label="검색">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pb-20">
        <div className="px-4 py-6">
          {/* 카테고리 탭 */}
          <div className="flex space-x-4 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* 입양 가능한 반려동물 목록 */}
          <div className="space-y-4">
            {/* 로딩 상태 */}
            {isLoading && pets.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">
                  반려동물을 불러오는 중...
                </span>
              </div>
            )}

            {/* 에러 상태 */}
            {error && pets.length === 0 && (
              <div className="text-center py-8">
                <p className="text-red-600 mb-2">
                  {error instanceof Error
                    ? error.message
                    : "데이터를 불러오는데 실패했습니다."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  다시 시도
                </Button>
              </div>
            )}

            {/* 실제 데이터 렌더링 */}
            {pets.map((pet) => (
              <Link key={pet.id} href={`/adoption/${pet.id}`}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex space-x-4 p-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                        {pet.images && pet.images.length > 0 ? (
                          <Image
                            src={pet.images[0].url}
                            alt={pet.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <PawPrint className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <Badge className="absolute -top-2 -left-2 text-xs bg-blue-600">
                        {pet.gender === "male"
                          ? "수컷"
                          : pet.gender === "female"
                            ? "암컷"
                            : "미상"}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {pet.name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {pet.age.years > 0
                          ? `${pet.age.years}살`
                          : pet.age.months > 0
                            ? `${pet.age.months}개월`
                            : "나이 미상"}
                        {pet.weight && ` • ${pet.weight}kg`}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {pet.species === "dog"
                          ? "개"
                          : pet.species === "cat"
                            ? "고양이"
                            : "기타"}
                        {pet.color &&
                          pet.color.length > 0 &&
                          ` • ${pet.color.join(", ")}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {pet.location.city || pet.location.address}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}

            {/* 더 보기 버튼 */}
            {hasNextPage && (
              <div className="text-center py-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      로딩 중...
                    </>
                  ) : (
                    "더 보기"
                  )}
                </Button>
              </div>
            )}

            {/* 데이터 없음 상태 */}
            {!isLoading && pets.length === 0 && !error && (
              <div className="text-center py-8">
                <div className="flex flex-col items-center">
                  <PawPrint className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">
                    아직 입양 가능한 반려동물이 없습니다
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 필터 모달 */}
      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                필터
              </h3>

              {/* 입양자 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  입양자
                </h4>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="rounded-full">
                    보호소
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    펫샵
                  </Button>
                </div>
              </div>

              {/* 지역 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  지역
                </h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="지역으로 입양처 찾기"
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500"
                  />
                  <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* 견종 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  견종
                </h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="견종 검색하기"
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500"
                  />
                  <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* 성별 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  성별
                </h4>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="rounded-full">
                    암컷
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    수컷
                  </Button>
                </div>
              </div>

              {/* 무게 */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  무게
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="rounded-full">
                    5kg 미만
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    5kg이상 ~ 10kg미만
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    10kg 이상 ~ 20kg 미만
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    무관
                  </Button>
                </div>
              </div>

              <Button
                className="w-full bg-gray-400 hover:bg-gray-500 text-white"
                onClick={handleToggleFilter}
              >
                필터 적용
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <MobileNavigation />
    </div>
  );
}
