/**
 * 유기동물 API 클라이언트 서비스
 * 
 * Next.js API Routes를 통해 공공데이터를 호출합니다.
 * CORS 문제 해결을 위해 서버사이드 프록시를 사용합니다.
 */

import type { 
  AnimalApiParams, 
  AbandonmentAnimalItem, 
  KindInfo, 
  SidoInfo, 
  SigunguInfo, 
  ShelterInfo,
  ApiResponse 
} from '@/types/api';

/**
 * 내부 API 기본 설정
 */
const API_BASE_URL = '/api';

/**
 * 축종 코드 상수
 */
export const ANIMAL_TYPE_CODES = {
  DOG: '417000',      // 개
  CAT: '422000',      // 고양이
  OTHER: '429900'     // 기타
} as const;

/**
 * 성별 코드 변환
 */
export const SEX_CODE_MAP = {
  'M': '수컷',
  'F': '암컷',
  'Q': '미상'
} as const;

/**
 * 중성화 여부 변환
 */
export const NEUTER_CODE_MAP = {
  'Y': '예',
  'N': '아니오',
  'U': '미상'
} as const;

/**
 * 내부 API 요청 함수
 */
async function fetchFromInternalAPI<T>(
  endpoint: string, 
  params?: Record<string, any>,
  method: 'GET' | 'POST' = 'GET'
): Promise<ApiResponse<T>> {
  try {
    let url = `${API_BASE_URL}/${endpoint}`;
    let requestInit: RequestInit = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    if (method === 'GET' && params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    } else if (method === 'POST' && params) {
      requestInit.body = JSON.stringify(params);
    }

    const response = await fetch(url, requestInit);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // 내부 API 응답 상태 체크
    if (!data.success) {
      throw new Error(data.error?.message || 'API 요청에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('내부 API 요청 오류:', error);
    throw error;
  }
}

/**
 * 유기동물 목록 조회
 */
export async function getAbandonmentAnimals(
  params: Partial<AnimalApiParams> = {}
): Promise<{
  animals: AbandonmentAnimalItem[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}> {
  const defaultParams = {
    numOfRows: 20,
    pageNo: 1,
    upkind: ANIMAL_TYPE_CODES.DOG, // 기본값: 개
    state: 'notice', // 기본값: 공고중
  };

  const response = await fetchFromInternalAPI<{
    animals: AbandonmentAnimalItem[];
    totalCount: number;
    pageNo: number;
    numOfRows: number;
  }>('animals', { ...defaultParams, ...params }, 'GET');

  return response.data!;
}

/**
 * 품종 코드 목록 조회
 */
export async function getKindList(
  upkind: string = ANIMAL_TYPE_CODES.DOG
): Promise<KindInfo[]> {
  const response = await fetchPublicData<KindInfo>(
    'kind',
    { up_kind_cd: upkind }
  );

  return response.response.body.items?.item || [];
}

/**
 * 시도 코드 목록 조회
 */
export async function getSidoList(): Promise<SidoInfo[]> {
  const response = await fetchPublicData<SidoInfo>('sido', {});
  return response.response.body.items?.item || [];
}

/**
 * 시군구 코드 목록 조회
 */
export async function getSigunguList(uprCd: string): Promise<SigunguInfo[]> {
  const response = await fetchPublicData<SigunguInfo>(
    'sigungu',
    { upr_cd: uprCd }
  );

  return response.response.body.items?.item || [];
}

/**
 * 보호소 목록 조회
 */
export async function getShelterList(
  upr_cd?: string,
  org_cd?: string
): Promise<ShelterInfo[]> {
  const params: Record<string, string> = {};
  if (upr_cd) params.upr_cd = upr_cd;
  if (org_cd) params.org_cd = org_cd;

  const response = await fetchPublicData<ShelterInfo>('shelter', params);
  return response.response.body.items?.item || [];
}

/**
 * 유기동물 상세 정보 조회 (유기번호로)
 */
export async function getAnimalDetail(
  desertionNo: string
): Promise<AbandonmentAnimalItem | null> {
  try {
    const response = await getAbandonmentAnimals({
      numOfRows: 1,
      pageNo: 1,
    });

    // 실제로는 유기번호로 필터링할 수 없으므로
    // 전체 목록에서 찾아야 합니다 (API 제한사항)
    const animal = response.animals.find(
      item => item.desertionNo === desertionNo
    );

    return animal || null;
  } catch (error) {
    console.error('동물 상세 정보 조회 오류:', error);
    return null;
  }
}

/**
 * 유기동물 검색 (복합 조건)
 */
export async function searchAnimals(searchParams: {
  keyword?: string;
  animalType?: keyof typeof ANIMAL_TYPE_CODES;
  sido?: string;
  sigungu?: string;
  kind?: string;
  sex?: string;
  neuter?: string;
  state?: string;
  pageNo?: number;
  numOfRows?: number;
}): Promise<{
  animals: AbandonmentAnimalItem[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}> {
  // POST 요청으로 검색 파라미터 전달
  const response = await fetchFromInternalAPI<{
    animals: AbandonmentAnimalItem[];
    totalCount: number;
    pageNo: number;
    numOfRows: number;
  }>('animals', searchParams, 'POST');

  return response.data!;
}

/**
 * 데이터 변환 유틸리티
 */
export const animalDataUtils = {
  /**
   * 성별 코드를 한글로 변환
   */
  formatSex: (sexCd: string): string => {
    return SEX_CODE_MAP[sexCd as keyof typeof SEX_CODE_MAP] || '미상';
  },

  /**
   * 중성화 여부를 한글로 변환
   */
  formatNeuter: (neutYn: string): string => {
    return NEUTER_CODE_MAP[neutYn as keyof typeof NEUTER_CODE_MAP] || '미상';
  },

  /**
   * 날짜 형식 변환 (YYYYMMDD -> YYYY.MM.DD)
   */
  formatDate: (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6, 8)}`;
  },

  /**
   * 이미지 URL 검증 및 기본 이미지 설정
   */
  getImageUrl: (popfile: string, filename: string): string => {
    // 실제 이미지 URL이 있으면 사용, 없으면 기본 이미지
    if (popfile && popfile !== '') {
      return popfile;
    }
    if (filename && filename !== '') {
      return filename;
    }
    return '/images/default-pet.jpg'; // 기본 이미지
  },

  /**
   * 나이 정보 정리
   */
  formatAge: (age: string): string => {
    if (!age) return '미상';
    // 연도만 있는 경우 처리
    if (age.includes('년')) return age;
    if (age.match(/^\d{4}$/)) {
      const currentYear = new Date().getFullYear();
      const birthYear = parseInt(age);
      const calculatedAge = currentYear - birthYear;
      return `${calculatedAge}살 (${age}년생)`;
    }
    return age;
  },

  /**
   * 체중 정보 정리
   */
  formatWeight: (weight: string): string => {
    if (!weight) return '미상';
    if (weight.includes('kg') || weight.includes('Kg')) return weight;
    return `${weight}kg`;
  }
};