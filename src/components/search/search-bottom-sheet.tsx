/**
 * 검색 바텀시트 컴포넌트
 *
 * 메인 화면에서 검색 버튼 클릭 시 나타나는 모바일 최적화 검색 인터페이스입니다.
 * 입양과 게시글을 구분하여 검색할 수 있습니다.
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchResults } from "./search-results";

interface SearchBottomSheetProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 핸들러 */
  onClose: () => void;
}

type SearchCategory = "adoption" | "posts";

/**
 * 검색 바텀시트 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (검색 UI 렌더링)
 * - ViewModel: useState (검색 상태 관리)
 * - Model: SearchResults (검색 결과 처리)
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 검색 인터페이스 UI만 담당
 * - 개방/폐쇄: 새로운 검색 카테고리 추가시 쉽게 확장 가능
 * - 의존성 역전: 구체적인 검색 로직이 아닌 추상화된 컴포넌트에 의존
 */
export function SearchBottomSheet({ isOpen, onClose }: SearchBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<SearchCategory>("adoption");

  // 디바운스를 적용한 검색어 (300ms 지연)
  const debouncedQuery = useDebounce(searchQuery, 300);

  /**
   * 검색어 변경 핸들러
   */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  /**
   * 카테고리 변경 핸들러
   */
  const handleCategoryChange = useCallback((category: SearchCategory) => {
    setActiveCategory(category);
  }, []);

  /**
   * 바텀시트 닫기 핸들러
   */
  const handleClose = useCallback(() => {
    setSearchQuery("");
    setActiveCategory("adoption");
    onClose();
  }, [onClose]);

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

  /**
   * 카테고리 탭 스타일 계산
   */
  const getTabStyle = useCallback(
    (category: SearchCategory) => {
      const baseStyle =
        "flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200";
      return activeCategory === category
        ? `${baseStyle} bg-blue-600 text-white shadow-md`
        : `${baseStyle} bg-gray-100 text-gray-600 hover:bg-gray-200`;
    },
    [activeCategory]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50 md:hidden"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-title"
    >
      <div
        className={`bg-white w-full h-full overflow-hidden flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="search-title" className="text-xl font-bold text-gray-900">
            검색
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="검색 창 닫기"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 검색 입력 */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="반려동물이나 궁금한 내용을 검색해보세요"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-12 text-base rounded-xl border-2 focus:border-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="px-6 pb-4">
          <div className="flex space-x-2 bg-gray-50 p-1 rounded-xl">
            <button
              onClick={() => handleCategoryChange("adoption")}
              className={getTabStyle("adoption")}
              aria-pressed={activeCategory === "adoption"}
            >
              🐾 입양
            </button>
            <button
              onClick={() => handleCategoryChange("posts")}
              className={getTabStyle("posts")}
              aria-pressed={activeCategory === "posts"}
            >
              📚 게시글
            </button>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto">
          <SearchResults
            query={debouncedQuery}
            category={activeCategory}
            onItemClick={(item) => {
              // 각 아이템 클릭 시 상세페이지로 이동 (추후 구현)
              console.log("Item clicked:", item);
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 데스크톱용 검색 모달 컴포넌트
 *
 * 데스크톱 환경에서 더 나은 UX를 위한 모달 형태의 검색 인터페이스
 */
export function SearchModal({ isOpen, onClose }: SearchBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<SearchCategory>("adoption");

  const debouncedQuery = useDebounce(searchQuery, 300);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleCategoryChange = useCallback((category: SearchCategory) => {
    setActiveCategory(category);
  }, []);

  const handleClose = useCallback(() => {
    setSearchQuery("");
    setActiveCategory("adoption");
    onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const getTabStyle = useCallback(
    (category: SearchCategory) => {
      const baseStyle =
        "flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200";
      return activeCategory === category
        ? `${baseStyle} bg-blue-600 text-white shadow-md`
        : `${baseStyle} bg-gray-100 text-gray-600 hover:bg-gray-200`;
    },
    [activeCategory]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 items-center justify-end z-50 hidden md:flex"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div
        className={`bg-white w-full h-full overflow-hidden flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="search-modal-title"
            className="text-xl font-bold text-gray-900"
          >
            검색
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="검색 창 닫기"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 검색 입력 */}
        <div className="p-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="반려동물이나 궁금한 내용을 검색해보세요"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-12 text-base rounded-xl border-2 focus:border-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="px-6 pb-4">
          <div className="flex space-x-2 bg-gray-50 p-1 rounded-xl">
            <button
              onClick={() => handleCategoryChange("adoption")}
              className={getTabStyle("adoption")}
              aria-pressed={activeCategory === "adoption"}
            >
              🐾 입양
            </button>
            <button
              onClick={() => handleCategoryChange("posts")}
              className={getTabStyle("posts")}
              aria-pressed={activeCategory === "posts"}
            >
              📚 게시글
            </button>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto">
          <SearchResults
            query={debouncedQuery}
            category={activeCategory}
            onItemClick={(item) => {
              console.log("Item clicked:", item);
            }}
          />
        </div>
      </div>
    </div>
  );
}
