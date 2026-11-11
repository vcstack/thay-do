"use client";

import { useEffect, useRef, useState } from "react";
import { CLASSICS } from "@/data/classics";
import { speakZh } from "@/lib/speak";
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

  // Số người đang học chung (mô phỏng) + trạng thái bạn cùng phòng.
  // Khởi tạo trong effect (giá trị ngẫu nhiên, chỉ có ở client) để tránh lệch hydration.
  useEffect(() => {
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
  }, []);

  const total = mode === "focus" ? FOCUS_SEC : BREAK_SEC;
  const progress = 1 - secondsLeft / total;

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // Hết giờ: đổi ca
          if (mode === "focus") {
            setCycles((c) => c + 1);
            setMode("break");
            setMessage("🎉 Hết 25 phút tập trung! Nghỉ 5 phút đi, uống nước, vươn vai.");
            return BREAK_SEC;
          }
          setMode("focus");
          setMessage("⏰ Hết giờ nghỉ! Quay lại học tiếp nào.");
          return FOCUS_SEC;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, mode]);

  function switchMode(m: Mode) {
    setMode(m);
    setSecondsLeft(m === "focus" ? FOCUS_SEC : BREAK_SEC);
    setRunning(false);
    setMessage("");
  }

  function reset() {
    setSecondsLeft(mode === "focus" ? FOCUS_SEC : BREAK_SEC);
    setRunning(false);
    setMessage("");
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
          onClick={() => setRunning((r) => !r)}
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
          * Số người và tên bạn học là mô phỏng để tạo cảm giác học chung — chưa
          có người thật online.
        </p>
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
