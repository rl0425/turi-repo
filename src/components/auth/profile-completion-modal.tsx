/**
 * 프로필 완성 모달 컴포넌트
 *
 * Progressive Profiling 시스템의 핵심 컴포넌트입니다.
 * 사용자가 특정 기능을 사용할 때 필요한 추가 정보를 요청합니다.
 */

"use client";

import { useState, useCallback } from "react";
import { X, User, Phone, Calendar, Heart } from "lucide-react";
import { Button, Card, Input, Label } from "@/components/ui";
import { updateUserProfile } from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";

interface ProfileCompletionModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 요청하는 정보 단계 */
  step: "basic" | "preferences" | "contact";
  /** 완성 후 콜백 */
  onComplete?: () => void;
  /** 모달 제목 (선택사항) */
  title?: string;
  /** 설명 텍스트 (선택사항) */
  description?: string;
}

/**
 * 프로필 완성 모달 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (프로필 완성 UI 렌더링)
 * - ViewModel: useState (폼 상태 관리), useAuthStore (사용자 정보 관리)
 * - Model: Supabase Auth (프로필 업데이트)
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 프로필 완성 UI 및 로직만 담당
 * - 개방/폐쇄: 새로운 프로필 단계 추가시 쉽게 확장 가능
 * - 리스코프 치환: 다른 프로필 완성 컴포넌트로 교체 가능
 */
export function ProfileCompletionModal({
  isOpen,
  onClose,
  step,
  onComplete,
  title,
  description,
}: ProfileCompletionModalProps) {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    phoneNumber: user?.phoneNumber || "",
    birthDate: user?.birthDate || "",
    petPreference: "",
    livingSpace: "",
    experience: "",
  });

  /**
   * 폼 데이터 변경 핸들러
   */
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  /**
   * 프로필 업데이트 제출 핸들러
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) return;

      setIsLoading(true);

      try {
        // 단계별로 업데이트할 데이터 준비
        const updateData: Record<string, any> = {};

        switch (step) {
          case "basic":
            if (formData.displayName)
              updateData.display_name = formData.displayName;
            if (formData.phoneNumber) updateData.phone = formData.phoneNumber;
            if (formData.birthDate) updateData.birth_date = formData.birthDate;
            break;

          case "preferences":
            updateData.preferences = {
              ...user?.preferences,
              petPreference: formData.petPreference,
              livingSpace: formData.livingSpace,
              experience: formData.experience,
            };
            break;

          case "contact":
            if (formData.phoneNumber) updateData.phone = formData.phoneNumber;
            break;
        }

        // Supabase에 프로필 업데이트
        await updateUserProfile(updateData);

        // 로컬 스토어 업데이트
        updateUser({
          displayName: updateData.display_name || user?.displayName,
          phoneNumber: updateData.phone || user?.phoneNumber,
          birthDate: updateData.birth_date || user?.birthDate,
          preferences: updateData.preferences || user?.preferences,
        });

        toast.success("프로필이 업데이트되었습니다!");

        // 완료 콜백 실행
        onComplete?.();
        onClose();
      } catch (error) {
        console.error("프로필 업데이트 실패:", error);
        toast.error("프로필 업데이트 중 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [step, formData, user, updateUser, onComplete, onClose, isLoading]
  );

  /**
   * 건너뛰기 핸들러
   */
  const handleSkip = useCallback(() => {
    onClose();
    // 건너뛰기 이벤트 추적 (선택사항)
  }, [onClose]);

  if (!isOpen) return null;

  // 단계별 설정
  const stepConfig = {
    basic: {
      title: title || "기본 정보 입력",
      description:
        description || "더 나은 서비스 제공을 위해 기본 정보를 입력해주세요.",
      icon: <User className="h-6 w-6 text-blue-600" />,
      fields: ["displayName", "phoneNumber", "birthDate"],
    },
    preferences: {
      title: title || "반려동물 선호도",
      description: description || "맞춤형 추천을 위해 선호도를 알려주세요.",
      icon: <Heart className="h-6 w-6 text-red-500" />,
      fields: ["petPreference", "livingSpace", "experience"],
    },
    contact: {
      title: title || "연락처 정보",
      description: description || "입양 문의를 위해 연락처가 필요합니다.",
      icon: <Phone className="h-6 w-6 text-green-600" />,
      fields: ["phoneNumber"],
    },
  };

  const config = stepConfig[step];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {config.icon}
            <h2 className="text-xl font-bold text-gray-900">{config.title}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 본문 */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 text-sm mb-6">{config.description}</p>

          <div className="space-y-4">
            {/* 기본 정보 단계 */}
            {step === "basic" && (
              <>
                <div>
                  <Label htmlFor="displayName">이름 *</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      handleInputChange("displayName", e.target.value)
                    }
                    placeholder="홍길동"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">휴대폰 번호</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    placeholder="010-0000-0000"
                  />
                </div>

                <div>
                  <Label htmlFor="birthDate">생년월일</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {/* 선호도 단계 */}
            {step === "preferences" && (
              <>
                <div>
                  <Label htmlFor="petPreference">선호하는 반려동물</Label>
                  <select
                    id="petPreference"
                    value={formData.petPreference}
                    onChange={(e) =>
                      handleInputChange("petPreference", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">선택해주세요</option>
                    <option value="dog">강아지</option>
                    <option value="cat">고양이</option>
                    <option value="both">둘 다</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="livingSpace">주거 환경</Label>
                  <select
                    id="livingSpace"
                    value={formData.livingSpace}
                    onChange={(e) =>
                      handleInputChange("livingSpace", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">선택해주세요</option>
                    <option value="apartment">아파트</option>
                    <option value="house">단독주택</option>
                    <option value="villa">빌라/연립주택</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="experience">반려동물 경험</Label>
                  <select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">선택해주세요</option>
                    <option value="beginner">처음입니다</option>
                    <option value="experienced">경험이 있습니다</option>
                    <option value="expert">전문가 수준입니다</option>
                  </select>
                </div>
              </>
            )}

            {/* 연락처 단계 */}
            {step === "contact" && (
              <div>
                <Label htmlFor="phoneNumber">휴대폰 번호 *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="010-0000-0000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  입양 문의 시 연락을 위해 필요합니다.
                </p>
              </div>
            )}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex space-x-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
              disabled={isLoading}
            >
              나중에 하기
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "저장 중..." : "완료"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
