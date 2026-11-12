"use client";

/**
 * Auth thật bằng Supabase: Google OAuth + email/mật khẩu.
 * Chưa cấu hình Supabase thì AuthProvider chỉ giữ trạng thái khách
 * (user = null) và web dùng đăng nhập tên local như cũ — không crash.
 *
 * Khi đăng nhập thành công, tài khoản được "gương" sang hệ tài khoản của
 * progress.ts (id `sb:<uid>`) để Sổ học trò + đồng bộ tiến trình dùng
 * chung một nguồn; khi đăng xuất thì quay về tài khoản khách.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { clearCloudUser, setCloudUser } from "@/lib/progress";

export interface AuthState {
  /** Tài khoản Supabase, null khi chưa đăng nhập hoặc chưa cấu hình. */
  user: User | null;
  /** Đang kiểm tra session lúc mới mở trang. */
  loading: boolean;
  /** Supabase đã cấu hình chưa (có URL + anon key). */
  configured: boolean;
  /** Tên hiển thị: display_name, email, hoặc "Học trò". */
  displayName: string;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: string | null; needsConfirm: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function displayNameOf(user: User | null): string {
  if (!user) return "Khách";
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  if (typeof meta.display_name === "string" && meta.display_name.trim()) {
    return meta.display_name.trim();
  }
  if (typeof meta.name === "string" && meta.name.trim()) return meta.name.trim();
  if (typeof meta.full_name === "string" && meta.full_name.trim()) {
    return meta.full_name.trim();
  }
  if (user.email) return user.email.split("@")[0];
  return "Học trò";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    let alive = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!alive) return;
        const u = data.session?.user ?? null;
        setUser(u);
        if (u) setCloudUser(u.id, displayNameOf(u));
        setLoading(false);
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        setCloudUser(u.id, displayNameOf(u));
      } else {
        clearCloudUser();
      }
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return { error: "Chưa cấu hình Supabase — xem README để bật đăng nhập thật." };
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
    return { error: error ? error.message : null };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: "Chưa cấu hình Supabase — xem README để bật đăng nhập thật." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return { error: "Sai email hoặc mật khẩu — kiểm tra lại nhé." };
      }
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, name: string) => {
      const supabase = getSupabase();
      if (!supabase)
        return { error: "Chưa cấu hình Supabase — xem README để bật đăng nhập thật.", needsConfirm: false };
      const origin = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name.trim() || "Học trò" },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) {
        if (error.message.includes("already registered")) {
          return { error: "Email này đã đăng ký rồi — thử đăng nhập nhé.", needsConfirm: false };
        }
        return { error: error.message, needsConfirm: false };
      }
      // Nếu project bật xác nhận email thì chưa có session ngay.
      return { error: null, needsConfirm: !data.session };
    },
    []
  );

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    clearCloudUser();
    setUser(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      configured,
      displayName: displayNameOf(user),
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
    }),
    [user, loading, configured, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Ngoài provider (không xảy ra trong layout) — trả trạng thái khách.
    return {
      user: null,
      loading: false,
      configured: false,
      displayName: "Khách",
      signInWithGoogle: async () => ({ error: "Chưa cấu hình Supabase." }),
      signInWithEmail: async () => ({ error: "Chưa cấu hình Supabase." }),
      signUpWithEmail: async () => ({ error: "Chưa cấu hình Supabase.", needsConfirm: false }),
      signOut: async () => {},
    };
  }
  return ctx;
}
