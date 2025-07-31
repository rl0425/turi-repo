/**
 * 유기동물 API Routes
 * 
 * 공공데이터포털 API를 서버사이드에서 호출하여
 * CORS 문제를 해결합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AnimalApiParams, PublicDataResponse, AbandonmentAnimalItem } from '@/types/api';

const API_BASE_URL = 'https://apis.data.go.kr/1543061/abandonmentPublicService_v2';
const API_KEY = process.env.ANIMAL_API_KEY; // NEXT_PUBLIC_ 제거

/**
 * 공통 API 요청 함수 (서버사이드)
 */
async function fetchFromPublicAPI<T>(
  endpoint: string, 
  params: Record<string, string | number>
): Promise<PublicDataResponse<T>> {
  if (!API_KEY) {
    throw new Error('API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.');
  }

  const queryParams = new URLSearchParams({
    serviceKey: API_KEY,
    _type: 'json',
    ...params
  });

  const url = `${API_BASE_URL}/${endpoint}?${queryParams.toString()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });


    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // API 응답 상태 체크
    if (data.response?.header?.resultCode !== '00') {
      throw new Error(
        data.response?.header?.resultMsg || 'API 요청에 실패했습니다.'
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * GET /api/animals
 * 유기동물 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 쿼리 파라미터 파싱
    const params: Partial<AnimalApiParams> = {
      numOfRows: parseInt(searchParams.get('numOfRows') || '20'),
      pageNo: parseInt(searchParams.get('pageNo') || '1'),
      upkind: searchParams.get('upkind') || '417000', // 기본값: 개
      state: searchParams.get('state') || 'notice', // 기본값: 공고중
    };

    // 선택적 파라미터들
    if (searchParams.get('bgnde')) params.bgnde = searchParams.get('bgnde')!;
    if (searchParams.get('endde')) params.endde = searchParams.get('endde')!;
    if (searchParams.get('kind')) params.kind = searchParams.get('kind')!;
    if (searchParams.get('upr_cd')) params.upr_cd = searchParams.get('upr_cd')!;
    if (searchParams.get('org_cd')) params.org_cd = searchParams.get('org_cd')!;
    if (searchParams.get('care_reg_no')) params.care_reg_no = searchParams.get('care_reg_no')!;
    if (searchParams.get('neut_yn')) params.neut_yn = searchParams.get('neut_yn')!;

    // 공공데이터 API 호출
    const response = await fetchFromPublicAPI<AbandonmentAnimalItem>(
      'abandonmentPublic_v2',
      params
    );

    const animals = response.response.body.items?.item || [];
    const totalCount = response.response.body.totalCount || 0;
    const pageNo = response.response.body.pageNo || 1;
    const numOfRows = response.response.body.numOfRows || 0;

    // 클라이언트에 반환
    return NextResponse.json({
      success: true,
      data: {
        animals,
        totalCount,
        pageNo,
        numOfRows
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'EXTERNAL_SERVICE_ERROR',
        message: error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다.',
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * POST /api/animals
 * 유기동물 검색 (복잡한 파라미터를 body로 전달)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      keyword,
      animalType,
      sex,
      neuter,
      sido,
      sigungu,
      kind,
      state = 'notice',
      pageNo = 1,
      numOfRows = 20
    } = body;

    // API 파라미터 구성
    const params: Partial<AnimalApiParams> = {
      numOfRows,
      pageNo,
      state
    };

    // 축종 설정
    if (animalType) {
      const typeMap = {
        'DOG': '417000',
        'CAT': '422000',
        'OTHER': '429900'
      };
      params.upkind = typeMap[animalType as keyof typeof typeMap] || '417000';
    }

    // 기타 파라미터들
    if (sido) params.upr_cd = sido;
    if (sigungu) params.org_cd = sigungu;
    if (kind) params.kind = kind;
    if (neuter) params.neut_yn = neuter;

    // 공공데이터 API 호출
    const response = await fetchFromPublicAPI<AbandonmentAnimalItem>(
      'abandonmentPublic_v2',
      params
    );

    let animals = response.response.body.items?.item || [];

    // 키워드 검색 (클라이언트 사이드 필터링)
    if (keyword) {
      const searchKeyword = keyword.toLowerCase();
      animals = animals.filter(animal =>
        animal.kindCd.toLowerCase().includes(searchKeyword) ||
        animal.happenPlace.toLowerCase().includes(searchKeyword) ||
        animal.specialMark.toLowerCase().includes(searchKeyword) ||
        animal.careNm.toLowerCase().includes(searchKeyword)
      );
    }

    // 성별 필터링 (클라이언트 사이드)
    if (sex) {
      animals = animals.filter(animal => animal.sexCd === sex);
    }

    const totalCount = animals.length;
    const pageNumber = response.response.body.pageNo || 1;
    const itemsPerPage = response.response.body.numOfRows || 20;

    return NextResponse.json({
      success: true,
      data: {
        animals,
        totalCount,
        pageNo: pageNumber,
        numOfRows: itemsPerPage
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'EXTERNAL_SERVICE_ERROR',
        message: error instanceof Error ? error.message : '검색에 실패했습니다.',
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}