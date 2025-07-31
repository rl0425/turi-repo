/**
 * 토스트 메시지 중복 방지 커스텀 훅
 * 
 * 동일한 토스트 메시지가 짧은 시간 내에 여러 번 호출되는 것을 방지합니다.
 */

import { useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseToastDebounceOptions {
  /** 디바운스 지연 시간 (ms) */
  delay?: number;
}

/**
 * 토스트 디바운스 훅
 * 
 * MVVM 아키텍처:
 * - View: 컴포넌트에서 호출하는 토스트 함수
 * - ViewModel: 이 훅 (토스트 상태 관리)
 * - Model: 토스트 메시지 데이터
 * 
 * SOLID 원칙 적용:
 * - 단일 책임: 토스트 중복 방지만 담당
 * - 개방/폐쇄: 새로운 토스트 타입 추가 시 쉽게 확장 가능
 */
export function useToastDebounce(options: UseToastDebounceOptions = {}) {
  const { delay = 1000 } = options;
  const lastToastRef = useRef<{ message: string; timestamp: number } | null>(null);

  /**
   * 성공 토스트 (중복 방지)
   */
  const debouncedSuccess = useCallback(
    (message: string) => {
      const now = Date.now();
      
      // 이전 토스트와 같은 메시지이고 지연 시간 내라면 무시
      if (
        lastToastRef.current &&
        lastToastRef.current.message === message &&
        now - lastToastRef.current.timestamp < delay
      ) {
        return;
      }

      lastToastRef.current = { message, timestamp: now };
      toast.success(message);
    },
    [delay]
  );

  /**
   * 에러 토스트 (중복 방지)
   */
  const debouncedError = useCallback(
    (message: string) => {
      const now = Date.now();
      
      // 이전 토스트와 같은 메시지이고 지연 시간 내라면 무시
      if (
        lastToastRef.current &&
        lastToastRef.current.message === message &&
        now - lastToastRef.current.timestamp < delay
      ) {
        return;
      }

      lastToastRef.current = { message, timestamp: now };
      toast.error(message);
    },
    [delay]
  );

  /**
   * 일반 토스트 (중복 방지)
   */
  const debouncedToast = useCallback(
    (message: string) => {
      const now = Date.now();
      
      // 이전 토스트와 같은 메시지이고 지연 시간 내라면 무시
      if (
        lastToastRef.current &&
        lastToastRef.current.message === message &&
        now - lastToastRef.current.timestamp < delay
      ) {
        return;
      }

      lastToastRef.current = { message, timestamp: now };
      toast(message);
    },
    [delay]
  );

  /**
   * 정보 토스트 (중복 방지)
   */
  const debouncedInfo = useCallback(
    (message: string) => {
      const now = Date.now();
      
      // 이전 토스트와 같은 메시지이고 지연 시간 내라면 무시
      if (
        lastToastRef.current &&
        lastToastRef.current.message === message &&
        now - lastToastRef.current.timestamp < delay
      ) {
        return;
      }

      lastToastRef.current = { message, timestamp: now };
      toast.info(message);
    },
    [delay]
  );

  /**
   * 경고 토스트 (중복 방지)
   */
  const debouncedWarning = useCallback(
    (message: string) => {
      const now = Date.now();
      
      // 이전 토스트와 같은 메시지이고 지연 시간 내라면 무시
      if (
        lastToastRef.current &&
        lastToastRef.current.message === message &&
        now - lastToastRef.current.timestamp < delay
      ) {
        return;
      }

      lastToastRef.current = { message, timestamp: now };
      toast.warning(message);
    },
    [delay]
  );

  return {
    success: debouncedSuccess,
    error: debouncedError,
    toast: debouncedToast,
    info: debouncedInfo,
    warning: debouncedWarning,
  };
}