/**
 * 공부 페이지 (Q&A 및 반려백과)
 *
 * 반려동물 관련 정보와 Q&A를 제공하는 페이지입니다.
 * 사용자의 제공된 스크린샷과 동일한 디자인과 기능을 구현합니다.
 */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { MobileNavigation } from "@/components/common/mobile-navigation";
import { ArrowLeft, Bell, MessageCircle, Heart, Edit3 } from "lucide-react";

/**
 * 공부 페이지 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (공부 페이지 UI 렌더링)
 * - ViewModel: useState hooks (상태 관리)
 * - Model: 더미 데이터 (추후 API 연동)
 */
export default function StudyPage() {
  // 로컬 상태 관리
  const [activeTab, setActiveTab] = useState("Q&A");
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  /**
   * 탭 변경 핸들러
   */
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  /**
   * 질문하기 모달 토글
   */
  const handleToggleQuestionForm = useCallback(() => {
    setShowQuestionForm(!showQuestionForm);
  }, [showQuestionForm]);

  // Q&A 더미 데이터
  const qnaData = [
    {
      id: 1,
      question: "야간 진료비 원래 어떻게 비싸가요?",
      replies: 3,
      likes: 23,
      date: "2024.10.24",
    },
    {
      id: 2,
      question:
        "야간 진료비 원래 어떻게 비싸가요?강아지와 소중한 시간을 나누고 싶어잖아요?",
      replies: 0,
      likes: 23,
      date: "2024.10.24",
    },
    {
      id: 3,
      question: "야간 진료비 원래 어떻게 비싸가요?",
      replies: 1,
      likes: 23,
      date: "2024.10.24",
    },
    {
      id: 4,
      question: "야간 진료비 원래 어떻게 비싸가요?",
      replies: 3,
      likes: 23,
      date: "2024.10.24",
    },
    {
      id: 5,
      question: "야간 진료비 원래 어떻게 비싸가요?",
      replies: 3,
      likes: 23,
      date: "2024.10.24",
    },
  ];

  // 반려백과 더미 데이터
  const encyclopediaData = [
    {
      id: 1,
      title: "개가 싫어하는 냄새 종류 5가지 - 이런 냄새는 피해주세요!",
      category: "건강",
      date: "2024.10.24",
      bookmarks: 23,
    },
    {
      id: 2,
      title: "강아지 산책 시간과 횟수, 어떻게 정해야 할까요?",
      category: "운동",
      date: "2024.10.23",
      bookmarks: 15,
    },
    {
      id: 3,
      title: "반려견 응급처치 방법 - 기본적인 대처법",
      category: "응급처치",
      date: "2024.10.22",
      bookmarks: 42,
    },
  ];

  const tabs = ["사전", "Q&A"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">공부</h1>
          </div>
          <Bell className="h-5 w-5 text-gray-600" />
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pb-20">
        <div className="px-4 py-6">
          {/* 탭 */}
          <div className="flex space-x-4 mb-6">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Q&A 탭 콘텐츠 */}
          {activeTab === "Q&A" && (
            <div className="space-y-4">
              {qnaData.map((item) => (
                <Card key={item.id} className="p-4 border-0 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-600">
                        Q
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 mb-2 break-words">
                        {item.question}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{item.replies}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{item.likes}</span>
                        </span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* 사전 탭 콘텐츠 */}
          {activeTab === "사전" && (
            <div className="space-y-4">
              {encyclopediaData.map((item) => (
                <Link key={item.id} href={`/study/dictionary/${item.id}`}>
                  <Card className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📖</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {item.category}
                        </Badge>
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">{item.date}</p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <span>🔖</span>
                            <span>{item.bookmarks}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 질문하기 플로팅 버튼 (Q&A 탭에서만) */}
      {activeTab === "Q&A" && (
        <div className="fixed bottom-24 right-4">
          <Button
            onClick={handleToggleQuestionForm}
            size="lg"
            className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 w-14 h-14 p-0"
            aria-label="질문하기"
          >
            <Edit3 className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* 질문하기 모달 */}
      {showQuestionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                질문하기
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    placeholder="질문 제목을 입력해주세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    내용
                  </label>
                  <textarea
                    rows={6}
                    placeholder="궁금한 내용을 자세히 적어주세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleToggleQuestionForm}
                >
                  질문 등록하기
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleToggleQuestionForm}
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <MobileNavigation />
    </div>
  );
}
