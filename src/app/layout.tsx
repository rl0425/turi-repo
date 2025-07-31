import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";
import { APP_NAME, APP_DESCRIPTION } from "@/utils/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ["반려동물", "입양", "펫", "동물보호소", "PawWise"],
  authors: [{ name: "PawWise Team" }],
  creator: "PawWise Team",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://pawwise.com",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    creator: "@pawwise",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-verification-code",
    yandex: "yandex-verification-code",
  },
};

/**
 * 루트 레이아웃 컴포넌트
 *
 * MVVM 패턴에서 View 계층의 최상위 컴포넌트로,
 * 전역 프로바이더와 기본 레이아웃을 제공합니다.
 *
 * @param props - 컴포넌트 props
 * @param props.children - 자식 컴포넌트들
 * @returns 전체 앱을 감싸는 루트 레이아웃
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
