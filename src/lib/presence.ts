"use client";

/**
 * Số người đang online trong trường — đếm thật bằng Supabase Realtime
 * Presence (mỗi tab mở trường là 1 presence, tự hết hạn khi đóng tab).
 * Chưa cấu hình Supabase thì fallback về số mô phỏng như cũ — không crash,
 * không lỗi console.
 */
import { useEffect, useRef, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { getAccount } from "@/lib/progress";

export interface OnlineInfo {
  /** Số người đang online (thật hoặc mô phỏng). */
  count: number | null;
  /** true = đếm thật từ Supabase, false = mô phỏng. */
  real: boolean;
}

function randomOnline() {
  return 24 + Math.floor(Math.random() * 28);
}

function tabKey(): string {
  try {
    let k = window.sessionStorage.getItem("thaydo:tab");
    if (!k) {
      k = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      window.sessionStorage.setItem("thaydo:tab", k);
    }
    return k;
  } catch {
    return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

/**
 * Đếm người online trong trường. Dùng chung cho trang chủ (và có thể dùng
 * trong cảnh 3D). Trả về count=null lúc đang tải lần đầu.
 */
export function useOnlineCount(): OnlineInfo {
  const [count, setCount] = useState<number | null>(null);
  const [real, setReal] = useState(false);
  const fallbackTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) {
      // Fallback mô phỏng như cũ.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(randomOnline());
      setReal(false);
      fallbackTimer.current = setInterval(() => {
        setCount((o) =>
          o === null
            ? randomOnline()
            : Math.min(64, Math.max(14, o + Math.floor(Math.random() * 5) - 2))
        );
      }, 20000);
      return () => {
        if (fallbackTimer.current) clearInterval(fallbackTimer.current);
      };
    }

    let alive = true;
    const channel = supabase.channel("thaydo:school-presence", {
      config: { presence: { key: tabKey() } },
    });
    channel
      .on("presence", { event: "sync" }, () => {
        if (!alive) return;
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
        setReal(true);
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED" || !alive) return;
        await channel.track({
          name: getAccount().name || "Khách",
          online_at: new Date().toISOString(),
        });
      });
    return () => {
      alive = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return { count, real };
}
