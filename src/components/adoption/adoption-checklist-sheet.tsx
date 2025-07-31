/**
 * 입양 준비도 체크리스트 바텀시트
 *
 * 입양 신청 전 마음가짐을 체크하는 바텀시트 컴포넌트입니다.
 * 모든 항목을 체크해야 입양 신청이 가능합니다.
 */

"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { X, Heart } from "lucide-react";
import { Button, Checkbox } from "@/components/ui";
import { useToastDebounce } from "@/hooks/use-toast-debounce";

interface AdoptionChecklistSheetProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 핸들러 */
  onClose: () => void;
  /** 입양 신청 완료 핸들러 */
  onApply: () => void;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

const initialChecklistItems: ChecklistItem[] = [
  {
    id: "responsibility",
    text: "새로운 가족이 생겨나는 설렘과 책임감을 느끼잖아요?",
    checked: false,
  },
  {
    id: "time",
    text: "강아지와 소중한 시간을 나누고 싶으신가요?",
    checked: false,
  },
  {
    id: "commitment",
    text: "강아지를 끝까지 지켜줄 수 있는 확신이 드시나요?",
    checked: false,
  },
  {
    id: "love",
    text: "사랑으로 우리 아이를 돌봐 주시겠나요?",
    checked: false,
  },
];

/**
 * 입양 준비도 체크리스트 바텀시트 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (체크리스트 UI 렌더링)
 * - ViewModel: useState (체크 상태 관리)
 * - Model: ChecklistItem (체크리스트 데이터)
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 입양 준비도 체크만 담당
 * - 개방/폐쇄: 새로운 체크 항목 추가시 쉽게 확장 가능
 * - 의존성 역전: 구체적인 체크 로직이 아닌 추상화된 Props에 의존
 */
export function AdoptionChecklistSheet({
  isOpen,
  onClose,
  onApply,
}: AdoptionChecklistSheetProps) {
  // 커스텀 훅
  const toast = useToastDebounce({ delay: 1000 });

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    initialChecklistItems
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  /**
   * 애니메이션 관리 Effect
   */
  useEffect(() => {
    if (isOpen) {
      // 바텀시트가 열릴 때 상태 리셋
      setIsClosing(false);
      // 약간의 지연 후 애니메이션 시작
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // 바텀시트가 닫힐 때 애니메이션 상태 리셋 (실제 닫기는 handleClose에서 처리)
      setIsAnimating(false);
      setIsClosing(false);
      setIsApplying(false);
    }
  }, [isOpen]);

  /**
   * 체크박스 토글 핸들러
   */
  const handleToggleCheck = useCallback((itemId: string) => {
    setChecklistItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  /**
   * 바텀시트 닫기 핸들러 (Exit 애니메이션 포함)
   */
  const handleClose = useCallback(() => {
    if (isClosing) return; // 이미 닫는 중이면 중복 실행 방지

    // 닫기 애니메이션 시작
    setIsClosing(true);

    // 애니메이션 완료 후 실제 닫기 (500ms)
    setTimeout(() => {
      // 체크 상태와 애니메이션 상태 초기화
      setChecklistItems(initialChecklistItems);
      setIsAnimating(false);
      setIsClosing(false);
      setIsApplying(false);
      onClose();
    }, 500);
  }, [onClose, isClosing]);

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
   * 모든 항목 체크 여부 계산
   */
  const allItemsChecked = useMemo(() => {
    return checklistItems.every((item) => item.checked);
  }, [checklistItems]);

  /**
   * 입양 신청 핸들러 (중복 클릭 방지)
   */
  const handleApply = useCallback(() => {
    // 이미 처리 중이면 리턴 (중복 클릭 방지)
    if (isApplying) return;

    if (!allItemsChecked) {
      toast.error("모든 항목을 체크해주세요!");
      return;
    }

    setIsApplying(true);

    onApply();
    handleClose();
    toast.success("입양 신청이 완료되었습니다! 🎉");

    // 처리 완료 후 상태 리셋 (handleClose에서 리셋됨)
  }, [allItemsChecked, onApply, handleClose, isApplying, toast]);

  /**
   * 체크된 항목 수 계산
   */
  const checkedCount = useMemo(() => {
    return checklistItems.filter((item) => item.checked).length;
  }, [checklistItems]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-end z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checklist-title"
    >
      <div
        className={`bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden flex flex-col transform transition-transform duration-500 ease-out ${
          isClosing
            ? "translate-y-full"
            : isAnimating
              ? "translate-y-0"
              : "translate-y-full"
        }`}
      >
        {/* 핸들러 */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4"></div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pb-4">
          <h2 id="checklist-title" className="text-xl font-bold text-blue-600">
            입양 전 마음가짐 체크리스트
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="체크리스트 닫기"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* 체크리스트 */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-4 mb-6">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl p-4 transition-all duration-200 ${
                  item.checked ? "bg-blue-100" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => handleToggleCheck(item.id)}
                    className="mt-1 flex-shrink-0"
                  />
                  <span
                    className={`text-sm leading-relaxed ${
                      item.checked
                        ? "text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {item.text}
                  </span>
                </label>
              </div>
            ))}
          </div>

          {/* 안내 메시지 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                모든 항목에 마음을 담아{" "}
                <span className="font-bold text-blue-600">&apos;네!&apos;</span>
                라고 답하실 수 있다면,
              </p>
              <p className="text-sm text-gray-700">
                이제 입양 신청을 시작해보세요!{" "}
                <span className="text-lg">🐾</span>
              </p>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          {/* 진행률 표시 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">진행률</span>
              <span className="text-sm font-medium text-blue-600">
                {checkedCount}/{checklistItems.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${(checkedCount / checklistItems.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <Button
            onClick={handleApply}
            disabled={!allItemsChecked}
            className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
              allItemsChecked
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200"
            }`}
          >
            {allItemsChecked
              ? "입양 신청 바로가기 🎉"
              : `${checklistItems.length - checkedCount}개 항목 더 체크해주세요`}
          </Button>
        </div>
      </div>
    </div>
  );
}
