/**
 * Pet 관련 React Query 훅들
 * 서버 상태 관리를 담당합니다.
 */

import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAbandonmentAnimals,
  searchAnimals,
  getAnimalDetail,
  ANIMAL_TYPE_CODES,
} from "@/services/api/animal-api";
import {
  convertAbandonmentAnimalsToPets,
  convertAbandonmentAnimalToPet,
  searchResultAdapter,
} from "@/services/api/animal-adapter";
import type { Pet } from "@/types";

/**
 * Query Keys - 일관된 캐시 키 관리
 */
export const petQueryKeys = {
  all: ["pets"] as const,
  featured: () => [...petQueryKeys.all, "featured"] as const,
  recent: () => [...petQueryKeys.all, "recent"] as const,
  search: (params: Record<string, unknown>) =>
    [...petQueryKeys.all, "search", params] as const,
  detail: (id: string) => [...petQueryKeys.all, "detail", id] as const,
};

/**
 * 추천 반려동물 목록 조회
 */
export function useFeaturedPets() {
  return useQuery({
    queryKey: petQueryKeys.featured(),
    queryFn: async (): Promise<Pet[]> => {
      const response = await getAbandonmentAnimals({
        numOfRows: 8,
        pageNo: 1,
        upkind: ANIMAL_TYPE_CODES.DOG,
        state: "notice",
      });
      console.log(response);
      return convertAbandonmentAnimalsToPets(response.animals);
    },
    staleTime: 5 * 60 * 1000, // 5분간 fresh
    gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
  });
}

/**
 * 최근 등록된 반려동물 목록 조회
 */
export function useRecentPets() {
  return useQuery({
    queryKey: petQueryKeys.recent(),
    queryFn: async (): Promise<Pet[]> => {
      const response = await getAbandonmentAnimals({
        numOfRows: 6,
        pageNo: 1,
        state: "notice",
      });
      return convertAbandonmentAnimalsToPets(response.animals);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * 반려동물 검색 (무한 스크롤)
 */
export function useSearchPets(params: {
  keyword?: string;
  species?: string;
  gender?: string;
  location?: string;
  isNeutered?: boolean;
}) {
  return useInfiniteQuery({
    queryKey: petQueryKeys.search(params),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams = {
        ...params,
        page: pageParam,
        limit: 20,
      };
      const response = await searchAnimals(searchParams);
      return searchResultAdapter.convertSearchResults(
        response.animals,
        response.totalCount,
        response.pageNo,
        response.numOfRows
      );
    },
    getNextPageParam: (lastPage: any) => {
      const currentPage = lastPage.currentPage || 1;
      const totalPages = Math.ceil(lastPage.totalCount / 20);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!params.keyword || Object.values(params).some(Boolean),
    staleTime: 2 * 60 * 1000, // 검색 결과는 2분간 fresh
  });
}

/**
 * 반려동물 상세 정보 조회
 * 🚀 최적화: React Query 캐시에서 먼저 찾고, 없으면 API 호출
 */
export function usePetDetail(id: string) {
  return useQuery({
    queryKey: petQueryKeys.detail(id),
    queryFn: async (): Promise<Pet | null> => {
      try {
        const animalDetail = await getAnimalDetail(id);
        return animalDetail
          ? convertAbandonmentAnimalToPet(animalDetail)
          : null;
      } catch (error) {
        console.error("Pet detail fetch error:", error);
        return null;
      }
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 상세 정보는 10분간 fresh
    gcTime: 60 * 60 * 1000, // 1시간 캐시
  });
}

/**
 * 전체 반려동물 목록 조회 (입양 페이지용)
 */
export function useAllPets(filters = {}) {
  return useInfiniteQuery({
    queryKey: [...petQueryKeys.all, "list", filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getAbandonmentAnimals({
        numOfRows: 20,
        pageNo: pageParam as number,
        state: "notice",
        ...filters,
      });
      return {
        pets: convertAbandonmentAnimalsToPets(response.animals),
        nextPage: (pageParam as number) + 1,
        hasMore: response.animals.length === 20,
      };
    },
    getNextPageParam: (lastPage: any) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    staleTime: 3 * 60 * 1000,
  });
}
