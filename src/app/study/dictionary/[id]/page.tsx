/**
 * 사전 상세 페이지
 *
 * 반려백과 사전의 개별 게시글을 보여주는 페이지입니다.
 * 사용자가 제공한 이미지 디자인을 기반으로 구현합니다.
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Bookmark } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { useToastDebounce } from "@/hooks/use-toast-debounce";
import Image from "next/image";

interface DictionaryArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  publishedAt: string;
  source?: string;
  imageUrl?: string;
  bookmarkCount: number;
  isBookmarked: boolean;
}

// 더미 데이터
const mockArticleData: DictionaryArticle = {
  id: "1",
  title: "개가 싫어하는 냄새 종류 5가지 - 이런 냄새는 피해주세요!",
  category: "건강",
  content: `동물복지문제연구소 어웨어가 2022년 국민 2,000명을 대상으로 '동물복지에 대한 국민의식조사'를 진행했는데요. 해당설문조사에 따르면 반려인이 유기동물 입양 계획이 없는 이유 1위가 입양 절차의 어려움이라고 해요. 이 설문에서도 볼 수 있듯이, 유기동물 입양 과정의 복잡함으로 인해 꺼려 하시는 분들이 많습니다. 그렇지만 사실 크게 어렵지 않으므로, 오늘은 유기동물 입양 절차에 대해 알아보도록 해요.

비마이펫은 콘텐츠 무단 복제/모방에 있어 무관용의 법칙을 취하고 있습니다. 비마이펫의 모든 콘텐츠는 저작권법에 의해 보호를 받으며, 블로그, 카페, 홈페이지 혹은 인쇄 매체로의 전재 등의 무단 복제/모방 시 법무법인을 통하여 법적인 조치를 취할 예정입니다.

동물복지문제연구소 어웨어가 2022년 국민 2,000명을 대상`,
  publishedAt: "2024.10.24",
  source: "https://mypetlife.co.kr/150303/",
  imageUrl:
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop",
  bookmarkCount: 23,
  isBookmarked: false,
};

/**
 * 사전 상세 페이지 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (사전 게시글 UI 렌더링)
 * - ViewModel: useState (북마크 상태 관리)
 * - Model: DictionaryArticle (사전 게시글 데이터)
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 사전 게시글 상세 정보 표시만 담당
 * - 개방/폐쇄: 새로운 콘텐츠 섹션 추가시 쉽게 확장 가능
 * - 의존성 역전: 구체적인 데이터 소스가 아닌 Props/Params에 의존
 */
export default function DictionaryDetailPage() {
  const router = useRouter();
  const params = useParams();
  // const articleId = params.id as string; // 추후 실제 데이터 연동시 사용

  // 커스텀 훅
  const toast = useToastDebounce({ delay: 1000 });

  // 상태 관리
  const [article] = useState<DictionaryArticle>(mockArticleData);
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked);
  const [bookmarkCount, setBookmarkCount] = useState(article.bookmarkCount);
  const [isBookmarkProcessing, setIsBookmarkProcessing] = useState(false);

  /**
   * 뒤로가기 핸들러
   */
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * 북마크 토글 핸들러 (중복 클릭 방지)
   */
  const handleBookmarkToggle = useCallback(() => {
    // 이미 처리 중이면 리턴 (중복 클릭 방지)
    if (isBookmarkProcessing) return;

    setIsBookmarkProcessing(true);

    setIsBookmarked((prev) => {
      const newBookmarked = !prev;
      setBookmarkCount((current) =>
        newBookmarked ? current + 1 : current - 1
      );

      toast.success(
        newBookmarked ? "북마크에 추가했습니다!" : "북마크에서 제거했습니다!"
      );

      return newBookmarked;
    });

    // 500ms 후 다시 클릭 가능하도록 설정
    setTimeout(() => {
      setIsBookmarkProcessing(false);
    }, 500);
  }, [isBookmarkProcessing, toast]);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
              aria-label="뒤로가기"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">반려백과</h1>
          </div>

          <button
            onClick={handleBookmarkToggle}
            className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="북마크 토글"
            disabled={isBookmarkProcessing}
          >
            <Bookmark
              className={`h-6 w-6 transition-colors ${
                isBookmarked ? "text-blue-600 fill-blue-600" : "text-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600 font-medium">
              {bookmarkCount}
            </span>
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6">
        {/* 카테고리 배지 */}
        <div className="mb-4">
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {article.category}
          </Badge>
        </div>

        {/* 제목 */}
        <h1 className="text-xl font-bold text-gray-900 leading-tight mb-4">
          {article.title}
        </h1>

        {/* 날짜 */}
        <p className="text-sm text-gray-500 mb-6">{article.publishedAt}</p>

        {/* 구분선 */}
        <div className="w-full h-px bg-gray-200 mb-6"></div>

        {/* 본문 내용 (첫 부분) */}
        <div className="prose prose-gray max-w-none mb-6">
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {article.content.split("\n\n")[0]}
          </div>
        </div>

        {/* 출처 */}
        {article.source && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              출처:
              <a
                href={article.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline ml-1"
              >
                {article.source}
              </a>
            </p>
          </div>
        )}

        {/* 면책조항 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-600 leading-relaxed">
            비마이펫은 콘텐츠 무단 복제/모방에 있어 무관용의 법칙을 취하고
            있습니다. 비마이펫의 모든 콘텐츠는 저작권법에 의해 보호를 받으며,
            블로그, 카페, 홈페이지 혹은 인쇄 매체로의 전재 등의 무단 복제/모방
            시 법무법인을 통하여 법적인 조치를 취할 예정입니다.
          </p>
        </div>

        {/* 이미지 */}
        {article.imageUrl && (
          <div className="mb-6">
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </div>
        )}

        {/* 하단 추가 내용 */}
        <div className="text-sm text-gray-700 leading-relaxed">
          <p>
            동물복지문제연구소 어웨어가 2022년 국민 2,000명을 대상으로 실시한
            추가 조사에 따르면...
          </p>
        </div>
      </main>
    </div>
  );
}
