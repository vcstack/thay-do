import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Callback sau khi đăng nhập Google (hoặc xác nhận email): đổi `code`
 * lấy session rồi quay về trang chủ. Chưa cấu hình Supabase thì chỉ
 * redirect về trang chủ, không crash.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";
  const redirectTo = new URL(next.startsWith("/") ? next : "/", request.url);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (code && supabaseUrl && supabaseKey) {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch {
      /* code hết hạn hoặc sai — cứ về trang chủ, người dùng đăng nhập lại */
    }
  }
  return NextResponse.redirect(redirectTo);
}
