/**
 * 디바운스 훅
 *
 * 입력값의 변경을 지연시켜 불필요한 API 호출을 방지하는 최적화 훅입니다.
 * 검색 기능에서 사용자가 타이핑할 때마다 API를 호출하지 않고,
 * 일정 시간 후에 한 번만 호출하도록 합니다.
 */

import { useState, useEffect } from 'react';

/**
 * 디바운스 훅
 *
 * @param value - 디바운스를 적용할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운스된 값
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 디바운스 로직만 담당
 * - 개방/폐쇄: 다양한 타입의 값에 대해 확장 가능
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 값이 변경되면 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 다음 effect 실행 전 또는 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 디바운스된 콜백 훅
 *
 * 함수 호출을 디바운스하고 싶을 때 사용합니다.
 *
 * @param callback - 디바운스를 적용할 콜백 함수
 * @param delay - 지연 시간 (밀리초)
 * @param deps - 의존성 배열
 * @returns 디바운스된 콜백 함수
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(() => callback);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay, ...deps]);

  return debouncedCallback;
}