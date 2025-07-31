/**
 * UI 상태 관리 스토어
 * 전역 UI 상태 (모달, 사이드바, 테마 등)를 관리합니다.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { STORAGE_KEYS, THEMES, DEFAULT_THEME } from '@/utils/constants';

export interface UIState {
  theme: string;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchModalOpen: boolean;
  isLoading: boolean;
  notifications: any[];
}

export interface UIActions {
  setTheme: (theme: string) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  toggleSearchModal: () => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
}

export type UIStore = UIState & UIActions;

const initialState: UIState = {
  theme: DEFAULT_THEME,
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchModalOpen: false,
  isLoading: false,
  notifications: [],
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      immer<UIStore>((set) => ({
        ...initialState,
        
        setTheme: (theme: string) => {
          set((state) => {
            state.theme = theme;
          });
        },
        
        toggleSidebar: () => {
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          });
        },
        
        toggleMobileMenu: () => {
          set((state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen;
          });
        },
        
        toggleSearchModal: () => {
          set((state) => {
            state.searchModalOpen = !state.searchModalOpen;
          });
        },
        
        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading;
          });
        },
        
        addNotification: (notification: any) => {
          set((state) => {
            state.notifications.push(notification);
          });
        },
        
        removeNotification: (id: string) => {
          set((state) => {
            state.notifications = state.notifications.filter(n => n.id !== id);
          });
        },
      })),
      {
        name: STORAGE_KEYS.THEME,
        partialize: (state) => ({ theme: state.theme }),
      }
    ),
    { name: 'ui-store' }
  )
);