"use client";

import { useEffect, useRef, useState } from "react";
import { CLASSICS } from "@/data/classics";
import { speakZh } from "@/lib/speak";
import { useAuth } from "@/lib/auth";
import {
  DEFAULT_ROOM,
  slugRoom,
  usePomodoroRoom,
} from "@/lib/pomodoroRoom";
import {
  startRain,
  stopRain,
  startWind,
  stopWind,
  startChimes,
  stopChimes,
} from "@/lib/ambient";

const FOCUS_SEC = 25 * 60;
const BREAK_SEC = 5 * 60;

type Mode = "focus" | "break";

/** Bạn cùng phòng tự học (mô phỏng để tạo cảm giác học chung). */
const ROOMMATES = [
  "Minh Anh", "Quốc Bảo", "Thu Hà", "Đức Anh",
  "Lan Chi", "Hoàng Nam", "Phương Linh", "Tuấn Kiệt",
];

function randomOnline() {
  return 18 + Math.floor(Math.random() * 24);
}

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PomodoroPage() {
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SEC);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [message, setMessage] = useState("");
  const [online, setOnline] = useState<number | null>(null);
  const [mates, setMates] = useState<boolean[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [openClassic, setOpenClassic] = useState<string | null>(null);
  const [ambient, setAmbient] = useState<{ rain: boolean; wind: boolean; chimes: boolean }>({
    rain: false,
    wind: false,
    chimes: false,
  });

  // --- Phòng Pomodoro chung (Supabase Realtime) ---
  // Chỉ dùng khi đã đăng nhập tài khoản thật; khách vẫn Pomodoro 1 mình
  // với bạn cùng phòng mô phỏng như cũ.
  const auth = useAuth();
  const roomEnabled = auth.configured && !!auth.user;
  const [roomInput, setRoomInput] = useState("Sân đọc sách");
  const [roomId, setRoomId] = useState(DEFAULT_ROOM);
  const room = usePomodoroRoom(roomId, roomEnabled, auth.displayName);
  const remoteAtRef = useRef(0);

  // Gửi trạng thái đồng hồ của mình cho cả phòng + cập nhật presence.
  function pushState(mode: Mode, running: boolean, secs: number) {
    if (!roomEnabled) return;
    room.broadcast({
      mode,
      running,
      endsAt: running ? Date.now() + secs * 1000 : null,
      secondsLeft: secs,
    });
    room.updatePresence(mode, running);
  }

  // Đổi trạng thái đồng hồ ở máy mình + đồng bộ cho cả phòng.
  function applyLocal(next: { mode: Mode; running: boolean; secondsLeft: number; message?: string }) {
    setMode(next.mode);
    setRunning(next.running);
    setSecondsLeft(next.secondsLeft);
    if (next.message !== undefined) setMessage(next.message);
    pushState(next.mode, next.running, next.secondsLeft);
  }

  // Áp trạng thái đồng hồ từ người khác trong phòng (không broadcast lại).
  function applyRemote(r: {
    mode: Mode;
    running: boolean;
    endsAt: number | null;
    secondsLeft: number;
  }) {
    setMode(r.mode);
    setRunning(r.running);
    if (r.running && r.endsAt) {
      setSecondsLeft(Math.max(0, Math.round((r.endsAt - Date.now()) / 1000)));
      setMessage("👥 Cả phòng đang học cùng nhau — cố lên!");
    } else {
      setSecondsLeft(r.secondsLeft);
      setMessage("");
    }
    room.updatePresence(r.mode, r.running);
  }

  // Nhận trạng thái đồng hồ từ người khác trong phòng → áp theo.
  useEffect(() => {
    if (!room.remote || room.remote.at <= remoteAtRef.current) return;
    remoteAtRef.current = room.remote.at;
    applyRemote(room.remote);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.remote]);

  // Số người đang học chung (mô phỏng) + trạng thái bạn cùng phòng —
  // chỉ dùng khi KHÔNG ở phòng chung.
  // Khởi tạo trong effect (giá trị ngẫu nhiên, chỉ có ở client) để tránh lệch hydration.
  useEffect(() => {
    if (roomEnabled) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOnline(randomOnline());
    setMates(ROOMMATES.map(() => Math.random() < 0.75));
    const t = setInterval(() => {
      setOnline((o) => {
        if (o === null) return randomOnline();
        return Math.min(48, Math.max(12, o + Math.floor(Math.random() * 5) - 2));
      });
    }, 20000);
    const t2 = setInterval(() => {
      setMates(ROOMMATES.map(() => Math.random() < 0.75));
    }, 30000);
    return () => {
      clearInterval(t);
      clearInterval(t2);
    };
  }, [roomEnabled]);

  const total = mode === "focus" ? FOCUS_SEC : BREAK_SEC;
  const progress = 1 - secondsLeft / total;

  // Hết giờ: đổi ca, dừng đồng hồ và đồng bộ cho cả phòng.
  function finishPhase() {
    if (mode === "focus") {
      setCycles((c) => c + 1);
      applyLocal({
        mode: "break",
        running: false,
        secondsLeft: BREAK_SEC,
        message: "🎉 Hết 25 phút tập trung! Nghỉ 5 phút đi, uống nước, vươn vai.",
      });
    } else {
      applyLocal({
        mode: "focus",
        running: false,
        secondsLeft: FOCUS_SEC,
        message: "⏰ Hết giờ nghỉ! Quay lại học tiếp nào.",
      });
    }
  }

  // Đồng hồ đếm ngược: mỗi giây trừ 1; về 0 thì đổi ca (xử lý trong
  // callback của setInterval — event ngoài effect, không vi phạm lint).
  const latestRef = useRef({ secondsLeft, finishPhase: () => {} });
  useEffect(() => {
    latestRef.current = { secondsLeft, finishPhase };
  });

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      if (latestRef.current.secondsLeft <= 1) {
        latestRef.current.finishPhase();
        return;
      }
      setSecondsLeft(latestRef.current.secondsLeft - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  function switchMode(m: Mode) {
    applyLocal({
      mode: m,
      running: false,
      secondsLeft: m === "focus" ? FOCUS_SEC : BREAK_SEC,
      message: "",
    });
  }

  function reset() {
    applyLocal({
      mode,
      running: false,
      secondsLeft: mode === "focus" ? FOCUS_SEC : BREAK_SEC,
      message: "",
    });
  }

  function toggleStart() {
    if (running) {
      applyLocal({ mode, running: false, secondsLeft, message: "" });
    } else {
      // Bắt đầu lại từ số giây còn lại (hết giờ thì bắt đầu ca mới).
      const secs = secondsLeft > 0 ? secondsLeft : mode === "focus" ? FOCUS_SEC : BREAK_SEC;
      applyLocal({ mode, running: true, secondsLeft: secs, message: "" });
    }
  }

  // Vòng tròn tiến độ
  const R = 120;
  const C = 2 * Math.PI * R;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-center">
      <h1 className="text-3xl font-black text-vermilion">🍅 Pomodoro</h1>
      <p className="mx-auto mt-2 max-w-lg text-ink-soft">
        Học tập trung 25 phút, nghỉ 5 phút. Ngồi vào chiếu, tắt điện thoại,
        chỉ học tiếng Trung thôi.
      </p>

      {/* Chuyển ca */}
      <div className="mt-6 inline-flex rounded-full border-2 border-gold/50 bg-cream p-1 shadow">
        <button
          onClick={() => switchMode("focus")}
          className={`rounded-full px-5 py-2 text-sm font-bold ${
            mode === "focus" ? "bg-vermilion text-cream" : "text-ink"
          }`}
        >
          📖 Học 25 phút
        </button>
        <button
          onClick={() => switchMode("break")}
          className={`rounded-full px-5 py-2 text-sm font-bold ${
            mode === "break" ? "bg-leaf text-cream" : "text-ink"
          }`}
        >
          ☕ Nghỉ 5 phút
        </button>
      </div>

      {/* Đồng hồ */}
      <div className="relative mx-auto mt-8 h-[280px] w-[280px]">
        <svg viewBox="0 0 280 280" className="h-full w-full -rotate-90">
          <circle cx="140" cy="140" r={R} fill="none" stroke="#e8c37a" strokeWidth="14" opacity="0.5" />
          <circle
            cx="140"
            cy="140"
            r={R}
            fill="none"
            stroke={mode === "focus" ? "#b3372a" : "#4d7c3a"}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-6xl font-black tabular-nums text-ink">
            {fmt(secondsLeft)}
          </p>
          <p className="mt-1 text-sm font-bold text-ink-soft">
            {mode === "focus" ? "Đang tập trung học" : "Đang nghỉ ngơi"}
          </p>
        </div>
      </div>

      {/* Nút điều khiển */}
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={toggleStart}
          className="rounded-full bg-vermilion px-8 py-3 text-base font-extrabold text-cream shadow hover:bg-vermilion-dark"
        >
          {running ? "⏸ Tạm dừng" : "▶ Bắt đầu"}
        </button>
        <button
          onClick={reset}
          className="rounded-full border-2 border-gold bg-cream px-6 py-3 text-base font-bold text-vermilion hover:bg-gold-soft/40"
        >
          ↺ Đặt lại
        </button>
      </div>

      {message && (
        <p className="mx-auto mt-5 max-w-md rounded-xl bg-leaf-soft/30 p-3 text-sm font-bold text-leaf">
          {message}
        </p>
      )}

      <p className="mt-6 text-sm font-bold text-ink-soft">
        Đã hoàn thành: {cycles} phiên tập trung 🎯
      </p>
      <p className="mt-1 text-xs text-ink-soft">
        Gợi ý: 1 phiên Pomodoro = học 1 bài mới hoặc ôn 10 từ vựng + luyện viết
        5 chữ.
      </p>

      {/* Sân đọc sách — học chung */}
      <div className="mt-8 rounded-2xl border-2 border-gold/40 bg-cream p-6 text-left shadow">
        <h2 className="text-lg font-extrabold text-vermilion">📖 Sân đọc sách — đang học chung</h2>
        {roomEnabled ? (
          <>
            <p className="mt-2 text-sm text-ink-soft">
              {room.connected ? (
                <>
                  <span className="font-black text-leaf">
                    🟢 {room.members.length + 1} người
                  </span>{" "}
                  đang ngồi trong phòng <span className="font-bold text-ink">{roomInput}</span> cùng
                  bạn lúc này. Ai bấm Bắt đầu thì cả phòng cùng chạy đồng hồ.
                </>
              ) : (
                "Đang nối vào phòng chung…"
              )}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setRoomId(slugRoom(roomInput));
                }}
                maxLength={30}
                placeholder="Tên phòng, ví dụ: Sân đọc sách"
                className="min-w-0 flex-1 rounded-lg border-2 border-gold/50 bg-white px-3 py-2 text-sm font-bold text-ink outline-none focus:border-vermilion"
              />
              <button
                onClick={() => setRoomId(slugRoom(roomInput))}
                className="rounded-full bg-vermilion px-4 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
              >
                Vào phòng →
              </button>
            </div>
            {room.members.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {room.members.map((m) => (
                  <span
                    key={m.key}
                    className={`rounded-full border-2 px-3 py-1.5 text-sm font-bold ${
                      m.mode === "focus"
                        ? "border-leaf bg-leaf-soft/30 text-leaf"
                        : "border-gold bg-gold-soft/30 text-ink-soft"
                    }`}
                  >
                    {m.running ? (m.mode === "focus" ? "📖" : "☕") : "⏸"} {m.name} ·{" "}
                    {m.running
                      ? m.mode === "focus"
                        ? "đang tập trung"
                        : "đang nghỉ"
                      : "đang dừng"}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-ink-soft">
              Phòng chung dùng tài khoản thật — tên trong phòng là tên tài khoản
              của bạn. Đổi tên phòng để lập phòng riêng với bạn bè.
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-ink-soft">
              <span className="font-black text-leaf">🟢 {online ?? "…"} người</span>{" "}
              đang ngồi học cùng bạn lúc này. Ai cũng đang chạy Pomodoro 25/5 giống
              bạn — đừng bỏ cuộc giữa chừng nhé!
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ROOMMATES.map((name, i) => (
                <span
                  key={name}
                  className={`rounded-full border-2 px-3 py-1.5 text-sm font-bold ${
                    mates[i]
                      ? "border-leaf bg-leaf-soft/30 text-leaf"
                      : "border-gold bg-gold-soft/30 text-ink-soft"
                  }`}
                >
                  {mates[i] ? "📖" : "☕"} {name} · {mates[i] ? "đang tập trung" : "đang nghỉ"}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-soft">
              * Số người và tên bạn học là mô phỏng để tạo cảm giác học chung —{" "}
              {auth.configured
                ? "đăng nhập tài khoản thật để vào phòng Pomodoro chung với người thật."
                : "chưa có người thật online."}
            </p>
          </>
        )}
      </div>

      {/* Âm thanh nền */}
      <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 text-left shadow">
        <h2 className="text-lg font-extrabold text-vermilion">🎧 Âm thanh nền</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Bật một âm thanh nền cho dễ tập trung — tạo bằng Web Audio, không cần
          file nhạc.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (ambient.rain) {
                stopRain();
                setAmbient((a) => ({ ...a, rain: false }));
              } else if (startRain()) {
                setAmbient((a) => ({ ...a, rain: true }));
              }
            }}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              ambient.rain ? "bg-vermilion text-cream shadow" : "border-2 border-gold bg-cream text-vermilion"
            }`}
          >
            🌧️ {ambient.rain ? "Tắt mưa" : "Tiếng mưa"}
          </button>
          <button
            onClick={() => {
              if (ambient.wind) {
                stopWind();
                setAmbient((a) => ({ ...a, wind: false }));
              } else if (startWind()) {
                setAmbient((a) => ({ ...a, wind: true }));
              }
            }}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              ambient.wind ? "bg-vermilion text-cream shadow" : "border-2 border-gold bg-cream text-vermilion"
            }`}
          >
            🍃 {ambient.wind ? "Tắt gió" : "Tiếng gió"}
          </button>
          <button
            onClick={() => {
              if (ambient.chimes) {
                stopChimes();
                setAmbient((a) => ({ ...a, chimes: false }));
              } else if (startChimes()) {
                setAmbient((a) => ({ ...a, chimes: true }));
              }
            }}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              ambient.chimes ? "bg-vermilion text-cream shadow" : "border-2 border-gold bg-cream text-vermilion"
            }`}
          >
            🎐 {ambient.chimes ? "Tắt chuông gió" : "Chuông gió"}
          </button>
        </div>
      </div>

      {/* Mở sách — văn cổ */}
      <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 text-left shadow">
        <h2 className="text-lg font-extrabold text-vermilion">📜 Mở sách — đọc văn cổ</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Trong lúc nghỉ giữa các phiên, mở một đoạn văn cổ ra đọc — vừa nghỉ
          vừa học được chữ hay.
        </p>
        <div className="mt-4 space-y-3">
          {CLASSICS.map((c) => {
            const isOpen = openClassic === c.id;
            return (
              <div key={c.id} className="overflow-hidden rounded-xl border-2 border-gold/40 bg-[#fffdf4]">
                <button
                  onClick={() => setOpenClassic(isOpen ? null : c.id)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-extrabold text-vermilion">
                    {c.source} · <span className="text-ink">{c.zh}</span>
                  </span>
                  <span className="text-lg text-ink-soft">{isOpen ? "▾" : "▸"}</span>
                </button>
                {isOpen && (
                  <div className="border-t-2 border-gold/30 p-4">
                    <p className="text-lg font-black leading-relaxed text-ink">{c.zh}</p>
                    <p className="mt-1 text-sm font-semibold text-leaf">{c.py}</p>
                    <p className="mt-1 text-sm text-ink-soft">{c.vi}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink">{c.note}</p>
                    <button
                      onClick={() => speakZh(c.zh)}
                      className="mt-3 rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                    >
                      🔊 Nghe thầy đọc
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
