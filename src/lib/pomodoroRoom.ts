"use client";

/**
 * Phòng Pomodoro chung — Supabase Realtime (Presence + Broadcast).
 * - Presence: danh sách ai đang ngồi trong phòng + trạng thái tập trung/nghỉ.
 * - Broadcast: khi 1 người bấm Bắt đầu / Tạm dừng / Đổi ca / Đặt lại thì
 *   mọi người trong phòng đều thấy (đồng bộ qua endsAt — mốc hết giờ).
 * Chỉ dùng khi đã đăng nhập tài khoản thật; khách vẫn Pomodoro 1 mình như cũ.
 * Chưa cấu hình Supabase thì hook trả về connected=false, không làm gì cả.
 */
import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export type PomodoroMode = "focus" | "break";

export interface RoomMember {
  key: string;
  name: string;
  mode: PomodoroMode;
  running: boolean;
}

export interface RoomTimerState {
  mode: PomodoroMode;
  running: boolean;
  /** Mốc hết giờ (epoch ms), null khi đang dừng. */
  endsAt: number | null;
  /** Số giây còn lại lúc gửi (dùng khi đang dừng). */
  secondsLeft: number;
}

export interface PomodoroRoom {
  /** Đã nối vào phòng thật chưa. */
  connected: boolean;
  /** Người khác đang ngồi trong phòng (không tính mình). */
  members: RoomMember[];
  /** Trạng thái đồng hồ mới nhất từ người khác (null nếu chưa có). */
  remote: (RoomTimerState & { at: number }) | null;
  /** Gửi trạng thái đồng hồ của mình cho cả phòng. */
  broadcast: (s: RoomTimerState) => void;
  /** Cập nhật trạng thái tập trung/nghỉ của mình trong danh sách phòng. */
  updatePresence: (mode: PomodoroMode, running: boolean) => void;
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

/** Chuẩn hóa tên phòng thành id kênh: chữ thường, gạch nối, không dấu cách. */
export function slugRoom(name: string): string {
  const s = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "phong-chung";
}

export const DEFAULT_ROOM = "phong-chung";

export function usePomodoroRoom(
  roomId: string,
  enabled: boolean,
  displayName: string
): PomodoroRoom {
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [remote, setRemote] = useState<(RoomTimerState & { at: number }) | null>(null);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const presenceRef = useRef<{ mode: PomodoroMode; running: boolean }>({
    mode: "focus",
    running: false,
  });
  const keyRef = useRef<string>("");

  useEffect(() => {
    const supabase = getSupabase();
    if (!enabled || !supabase || !isSupabaseConfigured()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConnected(false);
      setMembers([]);
      return;
    }
    keyRef.current = tabKey();
    let alive = true;
    const channel = supabase.channel(`pomodoro:${roomId}`, {
      config: { presence: { key: keyRef.current } },
    });
    channelRef.current = channel;
    channel
      .on("presence", { event: "sync" }, () => {
        if (!alive) return;
        const state = channel.presenceState();
        const list: RoomMember[] = [];
        for (const [key, presences] of Object.entries(state)) {
          if (key === keyRef.current) continue;
          const p = (presences as Record<string, unknown>[])[0] ?? {};
          list.push({
            key,
            name: typeof p.name === "string" ? p.name : "Bạn học",
            mode: p.mode === "break" ? "break" : "focus",
            running: p.running === true,
          });
        }
        setMembers(list);
      })
      .on("broadcast", { event: "timer" }, ({ payload }) => {
        if (!alive) return;
        const p = payload as Partial<RoomTimerState>;
        if (p.mode !== "focus" && p.mode !== "break") return;
        setRemote({
          mode: p.mode,
          running: p.running === true,
          endsAt: typeof p.endsAt === "number" ? p.endsAt : null,
          secondsLeft: typeof p.secondsLeft === "number" ? p.secondsLeft : 0,
          at: Date.now(),
        });
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED" || !alive) return;
        setConnected(true);
        await channel.track({
          name: displayName || "Bạn học",
          mode: presenceRef.current.mode,
          running: presenceRef.current.running,
        });
      });
    return () => {
      alive = false;
      channelRef.current = null;
      void supabase.removeChannel(channel);
    };
  }, [roomId, enabled, displayName]);

  return {
    connected,
    members,
    remote,
    broadcast: (s: RoomTimerState) => {
      const ch = channelRef.current;
      if (!ch) return;
      void ch.send({ type: "broadcast", event: "timer", payload: s });
    },
    updatePresence: (mode: PomodoroMode, running: boolean) => {
      presenceRef.current = { mode, running };
      const ch = channelRef.current;
      if (!ch) return;
      void ch.track({ name: displayName || "Bạn học", mode, running });
    },
  };
}
