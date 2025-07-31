/**
 * Supabase 클라이언트 설정
 *
 * 인증, 데이터베이스, 스토리지 등 Supabase 서비스를 위한 클라이언트를 설정합니다.
 */

import { createClient } from '@supabase/supabase-js';
import { EXTERNAL_SERVICES } from '@/utils/constants';

// Supabase URL과 익명 키 검증
const supabaseUrl = EXTERNAL_SERVICES.SUPABASE_URL;
const supabaseAnonKey = EXTERNAL_SERVICES.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL과 Anon Key가 환경 변수에 설정되어 있지 않습니다. ' +
    'NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해주세요.'
  );
}

/**
 * Supabase 클라이언트 인스턴스
 * 
 * 클라이언트 사이드에서 사용되는 Supabase 클라이언트입니다.
 * 인증, 데이터베이스 쿼리, 실시간 구독 등을 처리합니다.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 인증 설정
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // PKCE flow for better security
    // 리다이렉트 URL 설정
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:3001/auth/callback',
  },
  // 실시간 기능 설정
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * 소셜 로그인 제공자 타입
 */
export type SocialProvider = 'google' | 'kakao' | 'github' | 'apple' | 'naver';

/**
 * 소셜 로그인 함수
 * 
 * @param provider - 소셜 로그인 제공자
 * @param redirectTo - 로그인 성공 후 리다이렉트할 URL (선택사항)
 */
export const signInWithSocial = async (
  provider: SocialProvider,
  redirectTo?: string
) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error(`${provider} 로그인 오류:`, error);
    throw error;
  }

  return data;
};

/**
 * 로그아웃 함수
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
};

/**
 * 현재 사용자 정보 가져오기
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    return null;
  }
  
  return user;
};

/**
 * 인증 상태 변경 리스너
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

/**
 * 사용자 프로필 업데이트
 */
export const updateUserProfile = async (updates: {
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  birth_date?: string;
  preferences?: Record<string, any>;
}) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  });

  if (error) {
    console.error('프로필 업데이트 오류:', error);
    throw error;
  }

  return data;
};

export default supabase;