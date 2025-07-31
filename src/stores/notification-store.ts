/**
 * 알림 상태 관리 스토어
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CareNotification } from '@/types';

export interface NotificationState {
  notifications: CareNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationActions {
  setNotifications: (notifications: CareNotification[]) => void;
  addNotification: (notification: CareNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type NotificationStore = NotificationState & NotificationActions;

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    immer<NotificationStore>((set, get) => ({
      ...initialState,
      
      setNotifications: (notifications: CareNotification[]) => {
        set((state) => {
          state.notifications = notifications;
          state.unreadCount = notifications.filter(n => !n.isRead).length;
        });
      },
      
      addNotification: (notification: CareNotification) => {
        set((state) => {
          state.notifications.unshift(notification);
          if (!notification.isRead) {
            state.unreadCount += 1;
          }
        });
      },
      
      markAsRead: (id: string) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          if (notification && !notification.isRead) {
            notification.isRead = true;
            notification.readAt = new Date().toISOString();
            state.unreadCount -= 1;
          }
        });
      },
      
      markAllAsRead: () => {
        set((state) => {
          const now = new Date().toISOString();
          state.notifications.forEach(notification => {
            if (!notification.isRead) {
              notification.isRead = true;
              notification.readAt = now;
            }
          });
          state.unreadCount = 0;
        });
      },
      
      removeNotification: (id: string) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          if (notification && !notification.isRead) {
            state.unreadCount -= 1;
          }
          state.notifications = state.notifications.filter(n => n.id !== id);
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
    { name: 'notification-store' }
  )
);