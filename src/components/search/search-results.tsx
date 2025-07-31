/**
 * 검색 결과 컴포넌트
 *
 * 입양과 게시글 검색 결과를 표시하는 컴포넌트입니다.
 * 무한스크롤과 가상화를 지원하여 성능을 최적화합니다.
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Calendar,
  MapPin,
  User,
  BookOpen,
  PawPrint,
} from "lucide-react";
import Image from "next/image";
import { Card, Button } from "@/components/ui";
import { ROUTES } from "@/utils/constants";
import { usePetStore } from "@/stores";
import { useSearchPets } from "@/hooks/use-pets";
import type { Pet } from "@/types";

interface SearchResultsProps {
  /** 검색어 */
  query: string;
  /** 검색 카테고리 */
  category: "adoption" | "posts";
  /** 아이템 클릭 핸들러 */
  onItemClick?: (item: AdoptionItem | PostItem) => void;
}

interface AdoptionItem {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  location: string;
  shelter: string;
  image: string;
  isUrgent: boolean;
  likeCount: number;
  description: string;
  contact: string;
  adoptionPeriod: string;
}

interface PostItem {
  id: string;
  title: string;
  content: string;
  category: "dictionary" | "qna";
  author: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount?: number;
  tags: string[];
  excerpt: string;
}

// 목업 데이터 (추후 실제 API로 교체)
const mockAdoptionData: AdoptionItem[] = [
  {
    id: "1",
    name: "믹스견",
    breed: "수컷/중성화O",
    age: "2024 (1년생)",
    gender: "수컷",
    size: "5kg",
    location: "경상남도 창원시",
    shelter: "창원유기동물보호소",
    image: "/images/pets/pet-1.jpg",
    isUrgent: true,
    likeCount: 24,
    description: "애교가 많고 사람을 좋아하는 아이입니다.",
    contact: "055-225-5701",
    adoptionPeriod: "24.09.22 ~ 24.10.22",
  },
  {
    id: "2",
    name: "시츄",
    breed: "암컷/중성화O",
    age: "2022 (3년생)",
    gender: "암컷",
    size: "3kg",
    location: "서울특별시 강남구",
    shelter: "강남구동물보호센터",
    image: "/images/pets/pet-2.jpg",
    isUrgent: false,
    likeCount: 18,
    description: "조용하고 순한 성격의 아이입니다.",
    contact: "02-123-4567",
    adoptionPeriod: "24.10.01 ~ 24.11.01",
  },
];

const mockPostData: PostItem[] = [
  {
    id: "1",
    title: "강아지 첫 목욕, 언제부터 가능한가요?",
    content: "새끼 강아지를 입양했는데 언제부터 목욕을 시켜도 될까요?",
    category: "qna",
    author: "반려초보",
    publishedAt: "2024-01-15",
    viewCount: 1245,
    likeCount: 32,
    commentCount: 8,
    tags: ["강아지", "목욕", "신생아"],
    excerpt: "새끼 강아지의 첫 목욕 시기와 주의사항에 대해 알아보세요.",
  },
  {
    id: "2",
    title: "반려동물 응급처치 기본 가이드",
    content: "반려동물이 위급한 상황에 처했을 때 응급처치 방법",
    category: "dictionary",
    author: "수의사김",
    publishedAt: "2024-01-10",
    viewCount: 2156,
    likeCount: 89,
    tags: ["응급처치", "건강관리", "안전"],
    excerpt:
      "반려동물 응급상황 시 알아야 할 기본적인 응급처치 방법들을 정리했습니다.",
  },
];

/**
 * 검색 결과 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (검색 결과 UI 렌더링)
 * - ViewModel: useState (검색 결과 상태 관리)
 * - Model: API 서비스 (검색 데이터 처리)
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 검색 결과 표시만 담당
 * - 개방/폐쇄: 새로운 검색 결과 타입 추가시 쉽게 확장 가능
 * - 의존성 역전: 구체적인 데이터 소스가 아닌 추상화된 Props에 의존
 */
export function SearchResults({
  query,
  category,
  onItemClick,
}: SearchResultsProps) {
  const router = useRouter();
  const { searchFilters } = usePetStore();

  // React Query로 검색
  const searchParams = useMemo(
    () => ({
      keyword: query,
      ...searchFilters,
    }),
    [query, searchFilters]
  );

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchPets(searchParams);

  const searchResults = data?.pages.flatMap((page) => page.results) ?? [];

  const [postResults, setPostResults] = useState<PostItem[]>([]);

  /**
   * 게시글 검색 (임시로 더미 데이터 사용)
   */
  useEffect(() => {
    if (category === "posts") {
      const filtered = mockPostData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      );
      setPostResults(filtered);
    }
  }, [query, category]);

  /**
   * 입양 아이템 클릭 핸들러 (Pet 타입용)
   */
  const handlePetItemClick = useCallback(
    (pet: Pet) => {
      router.push(`/adoption/${pet.id}`);
      onItemClick?.(pet);
    },
    [router, onItemClick]
  );

  /**
   * 입양 아이템 클릭 핸들러 (기존 - 사용 안함)
   */
  const handleAdoptionItemClick = useCallback(
    (item: AdoptionItem) => {
      router.push(`/adoption/${item.id}`);
      onItemClick?.(item);
    },
    [router, onItemClick]
  );

  /**
   * 게시글 아이템 클릭 핸들러
   */
  const handlePostItemClick = useCallback(
    (item: PostItem) => {
      if (item.category === "dictionary") {
        router.push(`/study/dictionary/${item.id}`);
      } else if (item.category === "qna") {
        router.push(`/study/qna/${item.id}`);
      }
      onItemClick?.(item);
    },
    [router, onItemClick]
  );

  /**
   * 빈 상태 렌더링
   */
  const renderEmptyState = () => {
    if (!query.trim()) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            검색어를 입력해주세요
          </h3>
          <p className="text-sm text-gray-500">
            {category === "adoption" ? "입양할 반려동물을" : "궁금한 내용을"}{" "}
            검색해보세요
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">😅</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-sm text-gray-500">다른 검색어로 시도해보세요</p>
      </div>
    );
  };

  /**
   * 로딩 상태 렌더링
   */
  const renderLoading = () => (
    <div className="space-y-4 p-4">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="p-4">
          <div className="animate-pulse">
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  /**
   * 입양 결과 렌더링
   */
  const renderAdoptionResults = () => (
    <div className="space-y-3 p-4">
      {searchResults.map((pet: Pet) => (
        <Card
          key={pet.id}
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handlePetItemClick(pet)}
        >
          <div className="flex space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {pet.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {pet.breed?.name ||
                      (pet.species === "dog"
                        ? "개"
                        : pet.species === "cat"
                          ? "고양이"
                          : "기타")}
                  </p>
                </div>
                {pet.adoptionStatus === "available" && (
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                    입양가능
                  </span>
                )}
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>
                    {pet.age.years > 0
                      ? `${pet.age.years}살`
                      : pet.age.months > 0
                        ? `${pet.age.months}개월`
                        : "나이미상"}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {pet.size === "small"
                      ? "소형"
                      : pet.size === "medium"
                        ? "중형"
                        : pet.size === "large"
                          ? "대형"
                          : "기타"}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">
                    {pet.location.city || pet.location.address}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {pet.shelterInfo?.shelterName || "보호소 정보 없음"}
                </span>
                <div className="flex items-center text-xs text-gray-400">
                  <Heart className="w-3 h-3 mr-1" />
                  <span>{pet.spayedNeutered ? "중성화" : "미중성화"}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  /**
   * 게시글 결과 렌더링
   */
  const renderPostResults = () => (
    <div className="space-y-3 p-4">
      {postResults.map((item) => (
        <Card
          key={item.id}
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handlePostItemClick(item)}
        >
          <div className="flex space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {item.category === "dictionary" ? (
                <BookOpen className="w-5 h-5 text-blue-600" />
              ) : (
                <MessageCircle className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {item.title}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                    item.category === "dictionary"
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {item.category === "dictionary" ? "사전" : "Q&A"}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {item.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    <span>{item.author}</span>
                  </div>
                  <span>{item.publishedAt}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    <span>{item.likeCount}</span>
                  </div>
                  {item.commentCount && (
                    <div className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      <span>{item.commentCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  // 메인 렌더링
  if (category === "adoption") {
    // 입양 검색 결과
    if (isLoading && searchResults.length === 0) {
      return renderLoading();
    }

    if (error && searchResults.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">😞</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            검색 중 오류가 발생했습니다
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {error instanceof Error ? error.message : "다시 시도해주세요"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </Button>
        </div>
      );
    }

    if (searchResults.length === 0 && !isLoading) {
      return renderEmptyState();
    }

    return (
      <div className="h-full overflow-y-auto">
        {renderAdoptionResults()}

        {/* 더 보기 버튼 */}
        {hasNextPage && (
          <div className="text-center py-4">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
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
      </div>
    );
  } else {
    // 게시글 검색 결과 (기존 로직 유지)
    if (postResults.length === 0) {
      return renderEmptyState();
    }

    return <div className="h-full overflow-y-auto">{renderPostResults()}</div>;
  }
}
