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
  const [activeTab, setActiveTab] = useState("사전");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [expandedQnaId, setExpandedQnaId] = useState<number | null>(null);

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

  /**
   * Q&A 아이템 토글 핸들러
   */
  const handleToggleQna = useCallback((qnaId: number) => {
    setExpandedQnaId((prev) => (prev === qnaId ? null : qnaId));
  }, []);

  // Q&A 더미 데이터
  const qnaData = [
    {
      id: 1,
      question: "야간 진료비 원래 어떻게 비싸가요?",
      answer:
        "야간 진료비는 일반적으로 주간 진료비의 1.5~2배 정도입니다. 24시 동물병원의 경우 진료비 50,000원~100,000원, 검사비 추가로 50,000원~150,000원 정도 예상하시면 됩니다. 응급상황이므로 미리 병원에 전화해서 비용을 문의해보시는 것을 추천드려요.",
      replies: 3,
      likes: 23,
      date: "2024.10.24",
    },
    {
      id: 2,
      question: "강아지가 초콜릿을 먹었어요. 어떻게 해야 하나요?",
      answer:
        "초콜릿은 강아지에게 매우 위험합니다! 즉시 동물병원에 연락하세요. 먹은 양과 시간을 정확히 기록해두고, 구토를 유도하지 마세요. 병원에서 적절한 응급처치를 받으시기 바랍니다.",
      replies: 5,
      likes: 45,
      date: "2024.10.24",
    },
    {
      id: 3,
      question: "강아지 예방접종 스케줄이 궁금해요.",
      answer:
        "기본 예방접종은 생후 6~8주부터 시작합니다.\n• 1차: 6~8주 (종합백신)\n• 2차: 9~11주 (종합백신)\n• 3차: 12~14주 (종합백신 + 광견병)\n• 4차: 15~17주 (종합백신)\n\n이후 매년 1회 추가접종이 필요합니다.",
      replies: 12,
      likes: 89,
      date: "2024.10.23",
    },
    {
      id: 4,
      question: "강아지가 밥을 안 먹어요. 걱정돼요.",
      answer:
        "식욕부진의 원인은 다양합니다. 스트레스, 환경 변화, 건강 문제 등이 있어요. 24시간 이상 지속되거나 다른 증상(구토, 설사, 무기력)이 함께 나타나면 병원 진료를 받아보세요. 평소보다 활동량이 줄었다면 더욱 주의 깊게 관찰해주세요.",
      replies: 8,
      likes: 34,
      date: "2024.10.22",
    },
    {
      id: 5,
      question: "산책 시간과 횟수는 어느 정도가 적당한가요?",
      answer:
        "견종과 나이에 따라 다르지만 일반적으로:\n• 소형견: 하루 30분~1시간 (2회 나누어)\n• 중형견: 하루 1~1.5시간 (2~3회 나누어)\n• 대형견: 하루 1.5~2시간 (2~3회 나누어)\n\n날씨와 강아지 컨디션을 고려해서 조절해주세요.",
      replies: 15,
      likes: 67,
      date: "2024.10.21",
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
                <Card
                  key={item.id}
                  className="border-0 shadow-sm overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleToggleQna(item.id)}
                  >
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
                        <div className="flex items-center justify-between">
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
                          <div
                            className={`text-gray-400 transition-transform duration-200 ${
                              expandedQnaId === item.id ? "rotate-180" : ""
                            }`}
                          >
                            ▼
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 답변 영역 (아코디언) */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      expandedQnaId === item.id
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="flex items-start space-x-3 pt-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-green-600">
                            A
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {item.answer}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                              자세히 보기
                            </button>
                            <div className="flex items-center space-x-2">
                              <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                                <Heart className="h-3 w-3" />
                                <span>도움돼요</span>
                              </button>
                            </div>
                          </div>
                        </div>
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
