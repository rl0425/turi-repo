/**
 * 검색 상태 관리 스토어
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { BaseSearchFilters, SearchSort, SearchResults } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

export interface SearchState {
  filters: BaseSearchFilters;
  sort: SearchSort;
  results: SearchResults | null;
  isSearching: boolean;
  searchError: string | null;
  recentSearches: string[];
}

export interface SearchActions {
  setFilters: (filters: Partial<BaseSearchFilters>) => void;
  setSort: (sort: SearchSort) => void;
  setResults: (results: SearchResults) => void;
  setSearching: (searching: boolean) => void;
  setError: (error: string | null) => void;
  addRecentSearch: (query: string) => void;
  clearFilters: () => void;
  reset: () => void;
}

export type SearchStore = SearchState & SearchActions;

const initialState: SearchState = {
  filters: {},
  sort: { sortBy: 'relevance', direction: 'desc' },
  results: null,
  isSearching: false,
  searchError: null,
  recentSearches: [],
};

export const useSearchStore = create<SearchStore>()(
  devtools(
    persist(
      immer<SearchStore>((set) => ({
        ...initialState,
        
        setFilters: (newFilters: Partial<BaseSearchFilters>) => {
          set((state) => {
            Object.assign(state.filters, newFilters);
          });
        },
        
        setSort: (sort: SearchSort) => {
          set((state) => {
            state.sort = sort;
          });
        },
        
        setResults: (results: SearchResults) => {
          set((state) => {
            state.results = results;
          });
        },
        
        setSearching: (searching: boolean) => {
          set((state) => {
            state.isSearching = searching;
          });
        },
        
        setError: (error: string | null) => {
          set((state) => {
            state.searchError = error;
          });
        },
        
        addRecentSearch: (query: string) => {
          set((state) => {
            if (query.trim() && !state.recentSearches.includes(query)) {
              state.recentSearches = [query, ...state.recentSearches].slice(0, 10);
            }
          });
        },
        
        clearFilters: () => {
          set((state) => {
            state.filters = {};
          });
        },
        
        reset: () => {
          set((state) => {
            Object.assign(state, { ...initialState, recentSearches: state.recentSearches });
          });
        },
      })),
      {
        name: STORAGE_KEYS.SEARCH_HISTORY,
        partialize: (state) => ({ 
          recentSearches: state.recentSearches,
          filters: state.filters,
          sort: state.sort,
        }),
      }
    ),
    { name: 'search-store' }
  )
);