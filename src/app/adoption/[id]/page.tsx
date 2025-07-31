/**
 * 입양 상세 페이지
 *
 * 특정 반려동물의 상세 정보를 보여주는 페이지입니다.
 * 이미지 캐러셀, 기본 정보, 보호소 정보, 입양 절차를 포함합니다.
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Phone,
  Calendar,
  Weight,
  Palette,
  AlertCircle,
  PawPrint,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Separator,
} from "@/components/ui";
import { AdoptionChecklistSheet } from "@/components/adoption";
import { useToastDebounce } from "@/hooks/use-toast-debounce";
import { usePetDetail } from "@/hooks/use-pets";
import { usePetStore } from "@/stores";

const adoptionProcess = [
  {
    title: "강아지와의 첫 만남 신청",
    content:
      "보호소에 직접 방문하여 강아지와 첫 만남을 가져보세요. 서로의 궁합을 확인하는 중요한 시간입니다.",
  },
  {
    title: "상담 및 교감",
    content:
      "전문 상담사와 함께 반려동물에 대한 기본 지식과 준비사항에 대해 상담받고, 강아지와 충분한 교감시간을 가져보세요.",
  },
  {
    title: "입양 환경 확인",
    content:
      "반려동물이 생활할 환경과 가족 구성원들의 동의, 필요한 용품 준비 등을 점검합니다.",
  },
  {
    title: "입양 확정",
    content:
      "모든 절차가 완료되면 입양 계약서 작성 후 새로운 가족이 됩니다. 사후 관리 서비스도 제공됩니다.",
  },
];

/**
 * 입양 상세 페이지 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (상세 페이지 UI 렌더링)
 * - ViewModel: useState (좋아요, 이미지 상태 관리)
 * - Model: API 서비스 (반려동물 상세 데이터)
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 반려동물 상세 정보 표시만 담당
 * - 개방/폐쇄: 새로운 정보 섹션 추가시 쉽게 확장 가능
 * - 의존성 역전: 구체적인 데이터 소스가 아닌 Props/Params에 의존
 */
export default function AdoptionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const petId = params.id;

  // React Query로 실제 데이터 가져오기
  const { data: pet, isLoading, error } = usePetDetail(petId);

  // 즐겨찾기 상태 관리
  const { isFavorite, toggleFavorite } = usePetStore();
  const isLiked = pet ? isFavorite(pet.id) : false;

  // 커스텀 훅
  const toast = useToastDebounce({ delay: 1000 });

  // 상태 관리
  const [showChecklist, setShowChecklist] = useState(false);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);

  /**
   * 뒤로가기 핸들러
   */
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * 좋아요 토글 핸들러 (중복 클릭 방지)
   */
  const handleLikeToggle = useCallback(() => {
    // 이미 처리 중이거나 pet 데이터가 없으면 리턴
    if (isLikeProcessing || !pet) return;

    setIsLikeProcessing(true);

    toggleFavorite(pet.id);

    toast.success(
      isLiked ? "관심 동물에서 해제했습니다!" : "관심 동물로 등록했습니다!"
    );

    // 500ms 후 다시 클릭 가능하도록 설정
    setTimeout(() => {
      setIsLikeProcessing(false);
    }, 500);
  }, [isLikeProcessing, pet, toggleFavorite, isLiked, toast]);

  /**
   * 입양 신청 체크리스트 표시 핸들러
   */
  const handleShowChecklist = useCallback(() => {
    setShowChecklist(true);
  }, []);

  /**
   * 체크리스트 닫기 핸들러
   */
  const handleCloseChecklist = useCallback(() => {
    setShowChecklist(false);
  }, []);

  /**
   * 최종 입양 신청 핸들러
   */
  const handleFinalAdoptionApply = useCallback(() => {
    toast.success(
      "입양 신청이 접수되었습니다!\n보호소에서 연락드릴 예정입니다."
    );
  }, [toast]);

  /**
   * 전화걸기 핸들러
   */
  const handleCallShelter = useCallback(() => {
    if (pet?.shelterInfo?.contactInfo) {
      window.location.href = `tel:${pet.shelterInfo.contactInfo}`;
    }
  }, [pet?.shelterInfo?.contactInfo]);

  /**
   * 성별/중성화 표시 텍스트
   */
  const genderText = useMemo(() => {
    if (!pet) return "";
    const genderKo =
      pet.gender === "male"
        ? "수컷"
        : pet.gender === "female"
          ? "암컷"
          : "미상";
    return `${genderKo}/${pet.spayedNeutered ? "중성화O" : "중성화X"}`;
  }, [pet]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">반려동물 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="뒤로가기"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="ml-2 text-lg font-bold text-gray-900">상세 정보</h1>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            정보를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "반려동물 정보를 찾을 수 없습니다."}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center">
          <button
            onClick={handleGoBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="ml-2 text-lg font-bold text-gray-900">상세 정보</h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pb-24">
        {/* 이미지 캐러셀 */}
        <div className="relative bg-white">
          {pet.images && pet.images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {pet.images.map((image, index) => (
                  <CarouselItem key={image.id || index}>
                    <div className="aspect-square bg-gray-200 overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.alt || `${pet.name} 사진 ${index + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />

              {/* 이미지 카운터 */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
                1 / {pet.images.length}
              </div>
            </Carousel>
          ) : (
            /* 이미지가 없는 경우 */
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <PawPrint className="h-16 w-16 text-gray-400 mb-2" />
                <p className="text-gray-500">사진이 없습니다</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 space-y-4 mt-4">
          {/* 기본 정보 카드 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🐾</span>
                <CardTitle className="text-lg">
                  {pet.name} {genderText}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">나이</span>
                  <span className="font-medium">
                    {pet.age.years > 0
                      ? `${pet.age.years}살`
                      : pet.age.months > 0
                        ? `${pet.age.months}개월`
                        : "나이 미상"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">색상</span>
                  <span className="font-medium">
                    {pet.color && pet.color.length > 0
                      ? pet.color.join(", ")
                      : "미상"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Weight className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">몸무게</span>
                  <span className="font-medium">
                    {pet.weight ? `${pet.weight}kg` : "미상"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-gray-600">특이사항</span>
                  <span className="font-medium text-red-600">
                    {pet.specialNeeds && pet.specialNeeds.length > 0
                      ? pet.specialNeeds.join(", ")
                      : pet.description || "특이사항 없음"}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">품종</span>
                  <span className="font-medium">
                    {pet.species === "dog"
                      ? "개"
                      : pet.species === "cat"
                        ? "고양이"
                        : "기타"}
                    {pet.breed ? ` (${pet.breed.name})` : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상태</span>
                  <span className="font-medium">
                    {pet.adoptionStatus === "available"
                      ? "입양 가능"
                      : "입양 불가"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 보호 정보 카드 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">보호 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {pet.shelterInfo?.shelterName || "보호소 정보 없음"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {pet.location.address ||
                      pet.location.city ||
                      "주소 정보 없음"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">연락처</span>
                </div>
                {pet.shelterInfo?.contactInfo ? (
                  <button
                    onClick={handleCallShelter}
                    className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    {pet.shelterInfo.contactInfo}
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">
                    연락처 정보 없음
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 입양 절차 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                입양 절차가 궁금하신가요?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {adoptionProcess.map((step, index) => (
                  <AccordionItem key={index} value={`step-${index}`}>
                    <AccordionTrigger className="text-left">
                      {index + 1}. {step.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600">
                      {step.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLikeToggle}
            className={`p-3 rounded-full border transition-colors ${
              isLiked
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
            aria-label={isLiked ? "관심 해제" : "관심 등록"}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
          <Button
            onClick={handleShowChecklist}
            className="flex-1 h-12 text-base font-semibold"
          >
            입양 신청
          </Button>
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500">
            {isLiked ? "❤️ 관심 등록됨" : "🤍 관심 등록하기"}
          </span>
        </div>
      </div>

      {/* 입양 준비도 체크리스트 바텀시트 */}
      <AdoptionChecklistSheet
        isOpen={showChecklist}
        onClose={handleCloseChecklist}
        onApply={handleFinalAdoptionApply}
      />
    </div>
  );
}
