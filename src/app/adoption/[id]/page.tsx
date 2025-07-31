/**
 * 입양 상세 페이지
 *
 * 특정 반려동물의 상세 정보를 보여주는 페이지입니다.
 * 이미지 캐러셀, 기본 정보, 보호소 정보, 입양 절차를 포함합니다.
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Phone,
  Calendar,
  Weight,
  Palette,
  AlertCircle,
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

interface PetDetail {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  neutered: boolean;
  color: string;
  weight: string;
  specialNotes: string;
  adoptionPeriod: string;
  announcementNumber: string;
  shelterName: string;
  shelterAddress: string;
  shelterContact: string;
  images: string[];
  description: string;
  isUrgent: boolean;
  likeCount: number;
  isLiked: boolean;
}

// 목업 데이터 (실제로는 API에서 가져올 데이터)
const mockPetData: PetDetail = {
  id: "1",
  name: "믹스견",
  breed: "믹스견",
  age: "2024 (1년생)",
  gender: "수컷",
  neutered: true,
  color: "흰색+갈색",
  weight: "5kg",
  specialNotes: "애교가 많음",
  adoptionPeriod: "24.09.22 ~ 24.10.22",
  announcementNumber: "전북-군산-2024-00941",
  shelterName: "창원유기동물보호소",
  shelterAddress:
    "경상남도 창원시 의창구 창이대로 71 (명서동, 창원시농업기술센터) 축산과",
  shelterContact: "055-225-5701",
  images: [
    "/images/pets/pet-1.jpg",
    "/images/pets/pet-2.jpg",
    "/images/pets/pet-3.jpg",
    "/images/pets/pet-4.jpg",
    "/images/pets/pet-5.jpg",
  ],
  description:
    "애교가 많고 사람을 좋아하는 아이입니다. 건강하고 활발한 성격을 가지고 있어 가족과 함께 행복한 시간을 보낼 수 있을 것입니다.",
  isUrgent: true,
  likeCount: 24,
  isLiked: false,
};

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
export default function AdoptionDetailPage() {
  const router = useRouter();
  // const params = useParams();
  // const petId = params.id as string; // 추후 실제 데이터 연동시 사용

  // 커스텀 훅
  const toast = useToastDebounce({ delay: 1000 });

  // 상태 관리
  const [pet] = useState<PetDetail>(mockPetData);
  const [isLiked, setIsLiked] = useState(pet.isLiked);
  const [likeCount, setLikeCount] = useState(pet.likeCount);
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
    // 이미 처리 중이면 리턴 (중복 클릭 방지)
    if (isLikeProcessing) return;

    setIsLikeProcessing(true);

    setIsLiked((prev) => {
      const newLiked = !prev;
      setLikeCount((current) => (newLiked ? current + 1 : current - 1));

      toast.success(
        newLiked ? "관심 동물로 등록했습니다!" : "관심 동물에서 해제했습니다!"
      );

      return newLiked;
    });

    // 500ms 후 다시 클릭 가능하도록 설정
    setTimeout(() => {
      setIsLikeProcessing(false);
    }, 500);
  }, [isLikeProcessing, toast]);

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
    window.location.href = `tel:${pet.shelterContact}`;
  }, [pet.shelterContact]);

  /**
   * 성별/중성화 표시 텍스트
   */
  const genderText = useMemo(() => {
    return `${pet.gender}/${pet.neutered ? "중성화O" : "중성화X"}`;
  }, [pet.gender, pet.neutered]);

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
          <Carousel className="w-full">
            <CarouselContent>
              {pet.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    {/* 실제 이미지 대신 placeholder */}
                    <div className="text-6xl">🐾</div>
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
                  <span className="font-medium">{pet.age}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">색상</span>
                  <span className="font-medium">{pet.color}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Weight className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">몸무게</span>
                  <span className="font-medium">{pet.weight}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-gray-600">특이사항</span>
                  <span className="font-medium text-red-600">
                    {pet.specialNotes}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">공고기간</span>
                  <span className="font-medium">{pet.adoptionPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">공고번호</span>
                  <span className="font-medium">{pet.announcementNumber}</span>
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
                    {pet.shelterName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {pet.shelterAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">연락처</span>
                </div>
                <button
                  onClick={handleCallShelter}
                  className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  {pet.shelterContact}
                </button>
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
            ❤️ {likeCount}명이 관심을 보이고 있어요
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
