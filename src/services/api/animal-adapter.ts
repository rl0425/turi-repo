/**
 * 공공데이터 API와 내부 Pet 타입 간의 어댑터
 *
 * 외부 API 데이터를 내부 타입으로 변환하고,
 * 내부 데이터를 외부 API 형식으로 변환합니다.
 */

import type { AbandonmentAnimalItem } from "@/types/api";
import type {
  Pet,
  PetSpecies,
  PetSize,
  AdoptionStatus,
  PetAgeGroup,
  HealthStatus,
} from "@/types/pet";
import type { Gender } from "@/types/common";
import type { ImageInfo } from "@/types/common";
import { animalDataUtils, ANIMAL_TYPE_CODES } from "./animal-api";

/**
 * 축종 코드를 PetSpecies로 변환
 */
function mapSpeciesFromUpkind(upkind: string): PetSpecies {
  switch (upkind) {
    case ANIMAL_TYPE_CODES.DOG:
      return "dog";
    case ANIMAL_TYPE_CODES.CAT:
      return "cat";
    default:
      return "other";
  }
}

/**
 * 품종명을 기준으로 크기 추정
 */
function estimateSizeFromBreed(kindCd: string): PetSize {
  const breed = kindCd.toLowerCase();

  // 초소형견
  if (
    breed.includes("치와와") ||
    breed.includes("요크셔") ||
    breed.includes("말티즈") ||
    breed.includes("포메라니안") ||
    breed.includes("파피용")
  ) {
    return "extra-small";
  }

  // 소형견
  if (
    breed.includes("시츄") ||
    breed.includes("비숑") ||
    breed.includes("코커") ||
    breed.includes("닥스훈트") ||
    breed.includes("푸들") ||
    breed.includes("웰시코기")
  ) {
    return "small";
  }

  // 대형견
  if (
    breed.includes("골든") ||
    breed.includes("래브라도") ||
    breed.includes("셰퍼드") ||
    breed.includes("허스키") ||
    breed.includes("도베르만") ||
    breed.includes("로트와일러")
  ) {
    return "large";
  }

  // 초대형견
  if (
    breed.includes("세인트") ||
    breed.includes("그레이트") ||
    breed.includes("마스티프") ||
    breed.includes("뉴펀들랜드") ||
    breed.includes("아이리시")
  ) {
    return "extra-large";
  }

  // 고양이는 기본적으로 소형
  if (
    breed.includes("고양이") ||
    breed.includes("코리안숏헤어") ||
    breed.includes("페르시안") ||
    breed.includes("러시안블루") ||
    breed.includes("브리티시숏헤어")
  ) {
    return "small";
  }

  // 기본값: 중형
  return "medium";
}

/**
 * 성별 코드를 Gender로 변환
 */
function mapGenderFromSexCd(sexCd: string): Gender {
  switch (sexCd.toLowerCase()) {
    case "m":
      return "male";
    case "f":
      return "female";
    default:
      return "unknown";
  }
}

/**
 * 나이 정보를 기반으로 연령대 계산 (실제 API 형태: "2020(년생)", "2025(60일미만)(년생)")
 */
function calculateAgeGroup(age: string): {
  years: number;
  months: number;
  ageGroup: PetAgeGroup;
} {
  const currentYear = new Date().getFullYear();
  let years = 0;
  let months = 0;

  // "2025(60일미만)(년생)" 또는 "2020(년생)" 형태 파싱
  const birthYearWithDetailsMatch = age.match(/(\d{4})\([^)]*\)\(년생\)/);
  const birthYearSimpleMatch = age.match(/(\d{4})\(년생\)/);

  if (birthYearWithDetailsMatch) {
    // "2025(60일미만)(년생)" 형태
    const birthYear = parseInt(birthYearWithDetailsMatch[1]);
    years = Math.max(0, currentYear - birthYear);

    // 일 단위 정보 추출 (60일미만 등)
    const dayMatch = age.match(/(\d+)일미만/);
    if (dayMatch && years === 0) {
      const days = parseInt(dayMatch[1]);
      months = Math.floor(days / 30); // 대략적인 월 계산
    }
  } else if (birthYearSimpleMatch) {
    // "2020(년생)" 형태
    const birthYear = parseInt(birthYearSimpleMatch[1]);
    years = Math.max(0, currentYear - birthYear);
  }
  // 출생년도만 있는 경우 (4자리 숫자)
  else if (age.match(/^\d{4}$/)) {
    const birthYear = parseInt(age);
    years = Math.max(0, currentYear - birthYear);
  }
  // "6개월" 등의 형태
  else if (age.includes("개월")) {
    const match = age.match(/(\d+)개월/);
    if (match) {
      months = parseInt(match[0]);
      years = Math.floor(months / 12);
      months = months % 12;
    }
  }
  // "3살", "1년" 등의 형태 (년생이 아닌 경우에만)
  else if (
    (age.includes("살") || age.includes("년")) &&
    !age.includes("년생")
  ) {
    const match = age.match(/(\d+)/);
    if (match) {
      years = parseInt(match[0]);
    }
  }

  // 연령대 계산
  let ageGroup: PetAgeGroup;
  if (years === 0 && months < 6) {
    ageGroup = "puppy";
  } else if (years < 2) {
    ageGroup = "young";
  } else if (years < 7) {
    ageGroup = "adult";
  } else {
    ageGroup = "senior";
  }

  return { years, months, ageGroup };
}

/**
 * 프로세스 상태를 AdoptionStatus로 변환
 */
function mapAdoptionStatus(processState: string): AdoptionStatus {
  const state = processState.toLowerCase();

  if (state.includes("보호중") || state.includes("공고중")) {
    return "available";
  } else if (state.includes("입양") || state.includes("종료")) {
    return "adopted";
  } else if (state.includes("안락사") || state.includes("자연사")) {
    return "unavailable";
  }

  return "available"; // 기본값
}

/**
 * 체중 정보를 숫자로 변환
 */
function parseWeight(weight: string): number | undefined {
  if (!weight) return undefined;

  const match = weight.match(/[\d.]+/);
  if (match) {
    return parseFloat(match[0]);
  }

  return undefined;
}

/**
 * 색상 정보를 배열로 변환
 */
function parseColors(colorCd: string): string[] {
  if (!colorCd) return ["미상"];

  // 색상이 여러 개인 경우 분리
  const colors = colorCd.split(/[&+,]/);
  return colors
    .map((color) => color.trim())
    .filter((color) => color.length > 0);
}

/**
 * 이미지 정보 생성 (실제 API: popfile1, popfile2)
 */
function createImageInfo(popfile1?: string, popfile2?: string): ImageInfo[] {
  const images: ImageInfo[] = [];

  if (popfile1) {
    images.push({
      id: "1",
      url: popfile1,
      alt: "반려동물 사진 1",
      width: 400,
      height: 300,
      isMain: true,
    });
  }

  if (popfile2 && popfile2 !== popfile1) {
    images.push({
      id: "2",
      url: popfile2,
      alt: "반려동물 사진 2",
      width: 400,
      height: 300,
      isMain: false,
    });
  }

  return images;
}

/**
 * 공공데이터 유기동물 정보를 Pet 타입으로 변환
 */
export function convertAbandonmentAnimalToPet(
  animal: AbandonmentAnimalItem,
  index: number = 0
): Pet {
  const species = mapSpeciesFromUpkind(animal.upKindCd); // 실제 API: upKindCd 사용
  const size = estimateSizeFromBreed(animal.kindNm || animal.kindFullNm);
  const gender = mapGenderFromSexCd(animal.sexCd);
  const ageInfo = calculateAgeGroup(animal.age);
  const adoptionStatus = mapAdoptionStatus(animal.processState);
  const weight = parseWeight(animal.weight);
  const colors = parseColors(animal.colorCd);
  const images = createImageInfo(animal.popfile1, animal.popfile2); // 실제 API: popfile1, popfile2 사용

  // 이름 생성: "[개] 믹스견"에서 "믹스견" 추출
  const breedName =
    animal.kindFullNm?.split("]")[1]?.trim() || animal.kindNm || "반려동물";
  const petName = `${breedName} ${animal.desertionNo.slice(-3)}`;

  return {
    id: animal.desertionNo || `animal-${index}`,
    name: petName,
    species,
    breed: null, // 품종 정보는 별도 매핑 필요
    age: ageInfo,
    gender,
    size,
    weight,
    color: colors,
    personality: [], // 성격은 특징에서 추론 가능하지만 기본값으로 빈 배열
    healthStatus: "good" as HealthStatus, // 기본값, 특징에서 건강 상태 추론 가능
    medicalRecords: [],

    // 입양 관련
    adoptionStatus,
    location: {
      address: animal.happenPlace || animal.careAddr,
      city: animal.orgNm,
      coordinates: null,
    },
    shelterInfo: {
      shelterId: animal.careRegNo || animal.careNm,
      shelterName: animal.careNm,
      contactInfo: animal.careTel || animal.officetel || "",
    },

    // 미디어
    images,
    videos: [],

    // 추가 정보
    description: animal.specialMark || "특이사항 없음",
    specialNeeds: animal.specialMark ? [animal.specialMark] : [],
    goodWith: {
      children: true, // 기본값
      otherPets: true,
      cats: true,
      dogs: true,
    },
    houseTrained: true, // 기본값
    spayedNeutered: animal.neuterYn === "Y",
    microchipped: false, // 정보 없음
    vaccinated: true, // 보호소에서 관리하므로 기본값 true

    // 타임스탬프
    createdAt: animalDataUtils.formatDate(animal.happenDt),
    updatedAt: animalDataUtils.formatDate(animal.noticeSdt),
  };
}

/**
 * 여러 유기동물 정보를 Pet 배열로 변환
 */
export function convertAbandonmentAnimalsToPets(
  animals: AbandonmentAnimalItem[]
): Pet[] {
  return animals.map((animal, index) =>
    convertAbandonmentAnimalToPet(animal, index)
  );
}

/**
 * Pet 타입에서 검색 파라미터 추출
 */
export function extractSearchParamsFromPet(pet: Pet): {
  upkind?: string;
  kind?: string;
  upr_cd?: string;
  org_cd?: string;
} {
  const params: any = {};

  // 축종 매핑
  switch (pet.species) {
    case "dog":
      params.upkind = ANIMAL_TYPE_CODES.DOG;
      break;
    case "cat":
      params.upkind = ANIMAL_TYPE_CODES.CAT;
      break;
    default:
      params.upkind = ANIMAL_TYPE_CODES.OTHER;
  }

  // 지역 정보 (있는 경우)
  if (pet.location?.city) {
    // 시도 코드는 별도 매핑 테이블이 필요하지만
    // 일단 기본 구현만 제공
  }

  return params;
}

/**
 * 검색 결과 변환 유틸리티
 */
export const searchResultAdapter = {
  /**
   * API 검색 결과를 UI용 데이터로 변환
   */
  convertSearchResults: (
    animals: AbandonmentAnimalItem[],
    totalCount: number,
    currentPage: number,
    itemsPerPage: number
  ) => {
    const pets = convertAbandonmentAnimalsToPets(animals);

    return {
      items: pets,
      totalCount,
      currentPage,
      totalPages: Math.ceil(totalCount / itemsPerPage),
      hasNext: currentPage * itemsPerPage < totalCount,
      hasPrev: currentPage > 1,
    };
  },

  /**
   * 필터 옵션을 API 파라미터로 변환
   */
  convertFiltersToApiParams: (filters: {
    species?: PetSpecies;
    size?: PetSize;
    gender?: Gender;
    ageGroup?: PetAgeGroup;
    location?: string;
    isNeutered?: boolean;
  }) => {
    const params: any = {};

    if (filters.species) {
      switch (filters.species) {
        case "dog":
          params.upkind = ANIMAL_TYPE_CODES.DOG;
          break;
        case "cat":
          params.upkind = ANIMAL_TYPE_CODES.CAT;
          break;
        default:
          params.upkind = ANIMAL_TYPE_CODES.OTHER;
      }
    }

    if (filters.isNeutered !== undefined) {
      params.neut_yn = filters.isNeutered ? "Y" : "N";
    }

    return params;
  },
};
