/**
 * 케어 시스템 상태 관리 스토어
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CareActivity, CareExpense, CareBudget } from '@/types';

export interface CareState {
  activities: CareActivity[];
  expenses: CareExpense[];
  budget: CareBudget | null;
  isLoading: boolean;
  error: string | null;
}

export interface CareActions {
  setActivities: (activities: CareActivity[]) => void;
  addActivity: (activity: CareActivity) => void;
  updateActivity: (id: string, updates: Partial<CareActivity>) => void;
  removeActivity: (id: string) => void;
  setExpenses: (expenses: CareExpense[]) => void;
  addExpense: (expense: CareExpense) => void;
  setBudget: (budget: CareBudget) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type CareStore = CareState & CareActions;

const initialState: CareState = {
  activities: [],
  expenses: [],
  budget: null,
  isLoading: false,
  error: null,
};

export const useCareStore = create<CareStore>()(
  devtools(
    immer<CareStore>((set) => ({
      ...initialState,
      
      setActivities: (activities: CareActivity[]) => {
        set((state) => {
          state.activities = activities;
        });
      },
      
      addActivity: (activity: CareActivity) => {
        set((state) => {
          state.activities.push(activity);
        });
      },
      
      updateActivity: (id: string, updates: Partial<CareActivity>) => {
        set((state) => {
          const index = state.activities.findIndex(a => a.id === id);
          if (index !== -1) {
            Object.assign(state.activities[index], updates);
          }
        });
      },
      
      removeActivity: (id: string) => {
        set((state) => {
          state.activities = state.activities.filter(a => a.id !== id);
        });
      },
      
      setExpenses: (expenses: CareExpense[]) => {
        set((state) => {
          state.expenses = expenses;
        });
      },
      
      addExpense: (expense: CareExpense) => {
        set((state) => {
          state.expenses.push(expense);
        });
      },
      
      setBudget: (budget: CareBudget) => {
        set((state) => {
          state.budget = budget;
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
    { name: 'care-store' }
  )
);