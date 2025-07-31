/**
 * React Query Provider 컴포넌트
 *
 * MVVM 패턴에서 Model 계층의 기반이 되는 React Query 클라이언트를
 * 앱 전체에 제공하는 Provider 컴포넌트입니다.
 *
 * SOLID 원칙 적용:
 * - 단일 책임: React Query 클라이언트 제공만 담당
 * - 의존성 역전: 구체적인 쿼리 구현에 의존하지 않음
 */

"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query";
import { IS_DEVELOPMENT } from "@/utils/constants";

/**
 * QueryProvider Props 인터페이스
 */
interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * React Query Provider 컴포넌트
 *
 * @param props - 컴포넌트 props
 * @param props.children - 자식 컴포넌트들
 * @returns React Query Provider로 감싼 컴포넌트
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // queryClient를 state로 관리하여 리렌더링 최적화
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* 개발 환경에서만 devtools 표시 */}
      {IS_DEVELOPMENT && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
