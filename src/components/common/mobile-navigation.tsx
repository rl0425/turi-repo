/**
 * 모바일 하단 네비게이션 컴포넌트
 *
 * 모든 페이지에서 공통으로 사용되는 하단 탭 네비게이션입니다.
 * Next.js의 Link를 사용하여 적절한 라우팅을 제공합니다.
 */

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Heart, BookOpen, User } from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  { name: "홈", href: "/", icon: Home },
  { name: "입양", href: "/adoption", icon: Heart },
  { name: "공부", href: "/study", icon: BookOpen },
  { name: "마이", href: "/profile", icon: User },
];

/**
 * 모바일 하단 네비게이션 컴포넌트
 *
 * MVVM 아키텍처:
 * - View: 이 컴포넌트 (네비게이션 UI 렌더링)
 * - ViewModel: usePathname (현재 경로 상태)
 * - Model: navigationItems (네비게이션 데이터)
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 네비게이션 UI만 담당
 * - 개방/폐쇄: navigationItems 배열 수정만으로 메뉴 변경 가능
 * - 의존성 역전: 구체적인 아이콘 컴포넌트가 아닌 추상화된 인터페이스 사용
 */
export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40"
      role="navigation"
      aria-label="메인 네비게이션"
    >
      <div className="grid grid-cols-4 gap-1">
        {navigationItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={name}
              href={href}
              className={`flex flex-col items-center py-3 px-2 rounded-lg transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
              aria-label={`${name} 페이지로 이동`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 mb-1" aria-hidden="true" />
              <span className="text-xs font-medium">{name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
