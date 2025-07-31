/**
 * Pet 관련 클라이언트 상태 관리 스토어
 * 
 * 서버 상태는 React Query로 이동하고,
 * 클라이언트 상태만 관리합니다. (즐겨찾기, 필터 설정 등)
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { PetSpecies } from '@/types/pet';
import type { Gender } from '@/types/common';

/**
 * Pet 클라이언트 상태 인터페이스
 */
export interface PetClientState {
  // 검색 필터 (클라이언트 상태)
  searchFilters: {
    species?: PetSpecies;
    gender?: Gender;
    location?: string;
    isNeutered?: boolean;
    keyword?: string;
  };
  
  // 즐겨찾기 (로컬 저장소)
  favorites: string[];
  
  // UI 상태
  selectedCategory: 'adoption' | 'posts';
}

/**
 * Pet 클라이언트 액션 인터페이스
 */
export interface PetClientActions {
  // 필터 관리
  setSearchFilters: (filters: Partial<PetClientState['searchFilters']>) => void;
  clearFilters: () => void;
  
  // 즐겨찾기 관리
  toggleFavorite: (petId: string) => void;
  isFavorite: (petId: string) => boolean;
  
  // UI 상태 관리
  setSelectedCategory: (category: 'adoption' | 'posts') => void;
  
  // 초기화
  reset: () => void;
}

/**
 * Pet 클라이언트 스토어 통합 타입
 */
export type PetClientStore = PetClientState & PetClientActions;

/**
 * 초기 상태
 */
const initialState: PetClientState = {
  searchFilters: {},
  favorites: [],
  selectedCategory: 'adoption',
};

/**
 * Pet 클라이언트 상태 관리 스토어
 * 
 * 주의: 서버 상태는 React Query 훅들을 사용해주세요.
 * - useFeaturedPets()
 * - useSearchPets()
 * - usePetDetail()
 * - useAllPets()
 */
export const usePetStore = create<PetClientStore>()(
  devtools(
    persist(
      immer<PetClientStore>((set, get) => ({
        ...initialState,

        // 필터 관리
        setSearchFilters: (filters) => {
          set((state) => {
            state.searchFilters = { ...state.searchFilters, ...filters };
          });
        },

        clearFilters: () => {
          set((state) => {
            state.searchFilters = {};
          });
        },

        // 즐겨찾기 관리
        toggleFavorite: (petId: string) => {
          set((state) => {
            const isFavorite = state.favorites.includes(petId);
            if (isFavorite) {
              state.favorites = state.favorites.filter(id => id !== petId);
            } else {
              state.favorites = [...state.favorites, petId];
            }
          });
        },

        isFavorite: (petId: string) => {
          return get().favorites.includes(petId);
        },

        // UI 상태 관리
        setSelectedCategory: (category) => {
          set((state) => {
            state.selectedCategory = category;
          });
        },

        // 초기화
        reset: () => {
          set((state) => {
            Object.assign(state, initialState);
          });
        },
      })),
      {
        name: 'pet-client-store',
        partialize: (state) => ({
          searchFilters: state.searchFilters,
          favorites: state.favorites,
          selectedCategory: state.selectedCategory,
        }),
      }
    ),
    {
      name: 'pet-client-store',
    }
  )
);