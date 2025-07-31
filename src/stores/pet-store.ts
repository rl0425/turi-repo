/**
 * 반려동물 상태 관리 스토어
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Pet, Id } from '@/types';

export interface PetState {
  currentPet: Pet | null;
  searchResults: Pet[];
  isLoading: boolean;
  error: string | null;
}

export interface PetActions {
  setPet: (pet: Pet) => void;
  setSearchResults: (results: Pet[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type PetStore = PetState & PetActions;

const initialState: PetState = {
  currentPet: null,
  searchResults: [],
  isLoading: false,
  error: null,
};

export const usePetStore = create<PetStore>()(
  devtools(
    immer<PetStore>((set) => ({
      ...initialState,
      
      setPet: (pet: Pet) => {
        set((state) => {
          state.currentPet = pet;
        });
      },
      
      setSearchResults: (results: Pet[]) => {
        set((state) => {
          state.searchResults = results;
        });
      },
      
      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading;
        });
      },
      
      setError: (error: string | null) => {
        set((state) => {
          state.error = error;
        });
      },
      
      reset: () => {
        set((state) => {
          Object.assign(state, initialState);
        });
      },
    })),
    { name: 'pet-store' }
  )
);