/** Client Supabase (trình duyệt) — dùng cho Auth + Realtime Presence/Broadcast.
 *
 * Chưa cấu hình (thiếu NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)
 * thì `getSupabase()` trả về null và toàn bộ web fallback về chế độ cũ:
 * đăng nhập bằng tên trên máy này, số online mô phỏng, Pomodoro 1 mình.
 * Không crash build, không lỗi console.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Client Supabase dùng chung; null khi chưa cấu hình. */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  if (!isSupabaseConfigured()) {
    client = null;
    return client;
  }
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
  return client;
}
