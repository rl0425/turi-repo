/**
 * 가상 케어 페이지 (타마고치 스타일)
 *
 * 실제 반려동물 케어를 게임 형태로 시뮬레이션하는 페이지입니다.
 * 랜덤 미션, 터치 게임, 걸음수 측정 등을 통해 가상 반려동물을 케어합니다.
 */

"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui";
import { useToastDebounce } from "@/hooks/use-toast-debounce";

// 가상 반려동물 상태
interface VirtualPet {
  name: string;
  age: string;
  level: number;
  experience: number;
  maxExperience: number;
  mood: "happy" | "bored" | "barking" | "sick" | "excited";
  lastInteraction: number;
}

// 미션 타입
interface Mission {
  id: string;
  type: "touch" | "choice" | "walk" | "payment";
  title: string;
  description: string;
  targetCount?: number;
  currentCount?: number;
  choices?: string[];
  amount?: number;
  reward: number;
}

// 미션 데이터
const MISSIONS: Record<string, Mission[]> = {
  bored: [
    {
      id: "walk-100",
      type: "touch",
      title: "산책하기",
      description:
        "오늘 산책을 못해서 너무 심심해보여요.\n산책으로 가볍게 100보만 채워바요!",
      targetCount: 100,
      currentCount: 0,
      reward: 10,
    },
  ],
  barking: [
    {
      id: "calm-down",
      type: "choice",
      title: "달래주기",
      description:
        "새벽에 누가 초인종을 놀러서 예쁨이가 짖어요.\n아래 버튼을 눌러 예쁨이를 달래주세요.",
      choices: ["간식 주기", "놀아주기", "쓰다듬기", "혼내기"],
      reward: 15,
    },
  ],
  sick: [
    {
      id: "hospital",
      type: "choice",
      title: "병원 가기",
      description:
        "예비가 어디가 아픈거같아요.\n새벽이어서 24시 동물병원으로 가야해요.",
      choices: ["병원 가기"],
      reward: 20,
    },
    {
      id: "payment",
      type: "payment",
      title: "치료비 지불",
      description:
        "간단한 진료를 받고 약을 처방받았어요.\n병원비 15만원을 지불해주세요.",
      amount: 150000,
      reward: 25,
    },
  ],
};

// 감정별 메시지
const MOOD_MESSAGES = {
  happy: "완앞!",
  bored: "몽몽?",
  barking: "명멍!",
  sick: "기잉...아파",
  excited: "완앞!",
};

// 강아지 캐릭터 컴포넌트 (간단한 SVG)
const DogCharacter = ({ mood }: { mood: string }) => (
  <div className="relative w-40 h-40 mx-auto mb-6">
    <div className="w-full h-full flex items-center justify-center text-6xl">
      {mood === "sick"
        ? "🤒"
        : mood === "barking"
          ? "😤"
          : mood === "bored"
            ? "😔"
            : "😊"}
    </div>
  </div>
);

/**
 * 가상 케어 페이지 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (게임 UI 렌더링)
 * - ViewModel: useState hooks (펫 상태, 미션 관리)
 * - Model: VirtualPet, Mission (게임 데이터 모델)
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 가상 케어 게임만 담당
 * - 개방/폐쇄: 새로운 미션 타입 추가시 쉽게 확장 가능
 * - 의존성 역전: 구체적인 미션 로직이 아닌 추상화된 인터페이스에 의존
 */
export default function VirtualCarePage() {
  const router = useRouter();
  const toast = useToastDebounce({ delay: 1000 });

  // 가상 반려동물 상태
  const [pet, setPet] = useState<VirtualPet>({
    name: "예비",
    age: "수컷 3개월",
    level: 1,
    experience: 25,
    maxExperience: 50,
    mood: "bored",
    lastInteraction: Date.now(),
  });

  // 현재 미션
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * 뒤로가기 핸들러
   */
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * 랜덤 미션 생성
   */
  const generateRandomMission = useCallback(() => {
    const moods = Object.keys(MISSIONS);
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    const missions = MISSIONS[randomMood];
    const randomMission = missions[Math.floor(Math.random() * missions.length)];

    setPet((prev) => ({ ...prev, mood: randomMood as any }));
    setCurrentMission({ ...randomMission });
  }, []);

  /**
   * 터치 미션 핸들러
   */
  const handleTouchMission = useCallback(() => {
    if (!currentMission || currentMission.type !== "touch" || isProcessing)
      return;

    setIsProcessing(true);

    setCurrentMission((prev) => {
      if (!prev || !prev.targetCount) return prev;

      const newCount = (prev.currentCount || 0) + 1;

      if (newCount >= prev.targetCount) {
        // 미션 완료
        setPet((current) => ({
          ...current,
          experience: Math.min(
            current.experience + prev.reward,
            current.maxExperience
          ),
          mood: "happy",
        }));

        toast.success(`미션 완료! +${prev.reward} 경험치`);

        setTimeout(() => {
          setCurrentMission(null);
        }, 2000);

        return null;
      }

      return { ...prev, currentCount: newCount };
    });

    setTimeout(() => {
      setIsProcessing(false);
    }, 100);
  }, [currentMission, isProcessing, toast]);

  /**
   * 선택 미션 핸들러
   */
  const handleChoiceMission = useCallback(
    (choice: string) => {
      if (!currentMission || currentMission.type !== "choice" || isProcessing)
        return;

      setIsProcessing(true);

      // 정답 로직 (간단하게 첫 번째나 올바른 선택)
      const isCorrect = choice === "간식 주기" || choice === "병원 가기";

      if (isCorrect) {
        setPet((current) => ({
          ...current,
          experience: Math.min(
            current.experience + currentMission.reward,
            current.maxExperience
          ),
          mood: currentMission.id === "hospital" ? "sick" : "happy",
        }));

        toast.success(`좋은 선택! +${currentMission.reward} 경험치`);

        // 병원 미션의 경우 다음 미션 (지불)으로 이어짐
        if (currentMission.id === "hospital") {
          setTimeout(() => {
            const paymentMission = MISSIONS.sick.find(
              (m) => m.id === "payment"
            );
            if (paymentMission) {
              setCurrentMission({ ...paymentMission });
            }
          }, 2000);
        } else {
          setTimeout(() => {
            setCurrentMission(null);
          }, 2000);
        }
      } else {
        toast.error("다시 생각해보세요!");
      }

      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    },
    [currentMission, isProcessing, toast]
  );

  /**
   * 지불 미션 핸들러
   */
  const handlePaymentMission = useCallback(() => {
    if (!currentMission || currentMission.type !== "payment" || isProcessing)
      return;

    setIsProcessing(true);

    setPet((current) => ({
      ...current,
      experience: Math.min(
        current.experience + currentMission.reward,
        current.maxExperience
      ),
      mood: "excited",
    }));

    toast.success(`치료 완료! +${currentMission.reward} 경험치`);

    setTimeout(() => {
      setCurrentMission(null);
      setIsProcessing(false);
    }, 2000);
  }, [currentMission, isProcessing, toast]);

  /**
   * 진행률 계산
   */
  const progressPercentage = useMemo(() => {
    return (pet.experience / pet.maxExperience) * 100;
  }, [pet.experience, pet.maxExperience]);

  /**
   * 랜덤 미션 트리거 (시뮬레이션)
   */
  useEffect(() => {
    if (currentMission) return;

    const interval = setInterval(() => {
      if (!currentMission && Math.random() < 0.3) {
        // 30% 확률
        generateRandomMission();
      }
    }, 10000); // 10초마다 체크

    return () => clearInterval(interval);
  }, [currentMission, generateRandomMission]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">가상 케어</h1>
          <div className="w-10 h-10" /> {/* 스페이서 */}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6">
        {/* 경험치 바 */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Gift className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-700">
                {pet.experience} / {pet.maxExperience}
              </span>
            </div>
          </div>
          <button className="p-2 bg-gray-100 rounded-lg">
            <Gift className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* 반려동물 정보 */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {MOOD_MESSAGES[pet.mood]}
            </h2>
          </div>

          {/* 캐릭터 */}
          <DogCharacter mood={pet.mood} />

          <div className="text-blue-600 text-sm font-medium">
            {pet.name} {pet.age}
          </div>
        </div>

        {/* 미션 영역 */}
        <div className="bg-white rounded-3xl p-6">
          {currentMission ? (
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {currentMission.title}
              </h3>

              <p className="text-gray-700 text-sm leading-relaxed mb-6 whitespace-pre-line">
                {currentMission.description}
              </p>

              {/* 터치 미션 */}
              {currentMission.type === "touch" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-500 mb-2">
                      {currentMission.currentCount || 0}보
                    </div>
                    <div className="text-sm text-gray-500">
                      목표: {currentMission.targetCount}보
                    </div>
                  </div>

                  <Button
                    onClick={handleTouchMission}
                    disabled={isProcessing}
                    size="lg"
                    className="w-full h-16 bg-pink-500 hover:bg-pink-600 text-white text-lg rounded-2xl"
                  >
                    터치해주세요!
                  </Button>
                </div>
              )}

              {/* 선택 미션 */}
              {currentMission.type === "choice" && currentMission.choices && (
                <div className="grid grid-cols-2 gap-3">
                  {currentMission.choices.map((choice, index) => (
                    <Button
                      key={index}
                      onClick={() => handleChoiceMission(choice)}
                      disabled={isProcessing}
                      variant="outline"
                      className="h-16 text-sm font-medium rounded-2xl"
                    >
                      {choice}
                    </Button>
                  ))}
                </div>
              )}

              {/* 지불 미션 */}
              {currentMission.type === "payment" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-pink-200 rounded-2xl flex items-center justify-center">
                      <div className="text-2xl">💳</div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePaymentMission}
                    disabled={isProcessing}
                    size="lg"
                    className="w-full h-16 bg-gray-800 hover:bg-gray-900 text-white text-lg rounded-2xl"
                  >
                    💳 {currentMission.amount?.toLocaleString()}원 지불하기
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {pet.mood === "happy"
                  ? "예비가 행복해해요! 😊"
                  : "잠시 후 미션이 나타날 예정이에요..."}
              </p>

              {pet.mood !== "happy" && (
                <Button
                  onClick={generateRandomMission}
                  className="mt-4"
                  variant="outline"
                >
                  미션 생성하기
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
