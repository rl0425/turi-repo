/**
 * 입양 페이지
 *
 * 반려동물 검색 및 입양 관련 기능을 제공하는 페이지입니다.
 * 사용자의 제공된 스크린샷과 동일한 디자인과 기능을 구현합니다.
 */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { MobileNavigation } from "@/components/common/mobile-navigation";
import { ArrowLeft, Filter, Search, PawPrint } from "lucide-react";
import { APP_NAME } from "@/utils/constants";

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

  // 더미 데이터 - 추후 API로 대체
  const petData = [
    {
      id: 1,
      name: "믹스",
      gender: "수컷",
      period: "24.09.22 ~ 24.10.22",
      birthYear: "2024 (년생)",
      location: "서울시 관악구 남현동",
      image: null,
    },
    {
      id: 2,
      name: "믹스",
      gender: "수컷",
      period: "24.09.22 ~ 24.10.22",
      birthYear: "2024 (년생)",
      location: "서울시 관악구 남현동",
      image: null,
    },
    {
      id: 3,
      name: "믹스",
      gender: "수컷",
      period: "24.09.22 ~ 24.10.22",
      birthYear: "2024 (년생)",
      location: "서울시 관악구 남현동",
      image: null,
    },
    {
      id: 4,
      name: "믹스",
      gender: "수컷",
      period: "24.09.22 ~ 24.10.22",
      birthYear: "2024 (년생)",
      location: "서울시 관악구 남현동",
      image: null,
    },
  ];

  const categories = ["전체", "보호소", "펫샵"];

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
            {petData.map((pet) => (
              <Link key={pet.id} href={`/adoption/${pet.id}`}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex space-x-4 p-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        {pet.image ? (
                          // 추후 이미지 컴포넌트로 교체
                          <div className="w-full h-full bg-gray-300 rounded-lg" />
                        ) : (
                          <PawPrint className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <Badge className="absolute -top-2 -left-2 text-xs bg-blue-600">
                        {pet.gender}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {pet.name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{pet.period}</p>
                      <p className="text-sm text-gray-600 mb-1">
                        {pet.birthYear}
                      </p>
                      <p className="text-xs text-gray-500">{pet.location}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
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
