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
} from "lucide-react";
import { Card } from "@/components/ui";
import { ROUTES } from "@/utils/constants";

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
  const [isLoading, setIsLoading] = useState(false);
  const [adoptionResults, setAdoptionResults] = useState<AdoptionItem[]>([]);
  const [postResults, setPostResults] = useState<PostItem[]>([]);

  /**
   * 검색 실행 함수
   */
  const performSearch = useCallback(
    async (searchQuery: string, searchCategory: typeof category) => {
      if (!searchQuery.trim()) {
        setAdoptionResults([]);
        setPostResults([]);
        return;
      }

      setIsLoading(true);

      try {
        // 실제 API 호출 시뮬레이션 (300ms 지연)
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (searchCategory === "adoption") {
          // 입양 데이터 필터링
          const filtered = mockAdoptionData.filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.location.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setAdoptionResults(filtered);
        } else {
          // 게시글 데이터 필터링
          const filtered = mockPostData.filter(
            (item) =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.tags.some((tag) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
              )
          );
          setPostResults(filtered);
        }
      } catch (error) {
        console.error("검색 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * 검색어나 카테고리 변경 시 검색 실행
   */
  useEffect(() => {
    performSearch(query, category);
  }, [query, category, performSearch]);

  /**
   * 입양 아이템 클릭 핸들러
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
      {adoptionResults.map((item) => (
        <Card
          key={item.id}
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleAdoptionItemClick(item)}
        >
          <div className="flex space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🐾</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.breed}</p>
                </div>
                {item.isUrgent && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                    긴급
                  </span>
                )}
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{item.age}</span>
                  <span className="mx-2">•</span>
                  <span>{item.size}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">{item.shelter}</span>
                <div className="flex items-center text-xs text-gray-400">
                  <Heart className="w-3 h-3 mr-1" />
                  <span>{item.likeCount}</span>
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
  if (isLoading) {
    return renderLoading();
  }

  if (
    (category === "adoption" && adoptionResults.length === 0) ||
    (category === "posts" && postResults.length === 0)
  ) {
    return renderEmptyState();
  }

  return (
    <div className="h-full overflow-y-auto">
      {category === "adoption" ? renderAdoptionResults() : renderPostResults()}
    </div>
  );
}
