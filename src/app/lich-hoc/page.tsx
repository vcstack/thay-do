"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ClassSlot {
  hour: number;
  minute: number;
  title: string;
  desc: string;
}

const SLOTS: ClassSlot[] = [
  { hour: 8, minute: 0, title: "Lớp sáng — Giao tiếp cơ bản", desc: "Luyện chào hỏi, giới thiệu bản thân, hỏi thăm." },
  { hour: 14, minute: 0, title: "Lớp chiều — Từ vựng & ngữ pháp", desc: "Học từ mới theo chủ đề, ôn ngữ pháp HSK1." },
  { hour: 20, minute: 0, title: "Lớp tối — Luyện viết & hội thoại", desc: "Tô chữ Hán cùng thầy, luyện hội thoại theo cặp." },
];

const WEEK: Record<string, string[]> = {
  "Thứ 2": ["Chào hỏi", "Số đếm", "Viết chữ"],
  "Thứ 3": ["Gia đình", "Thời gian", "Hội thoại"],
  "Thứ 4": ["Ăn uống", "Mua sắm", "Viết chữ"],
  "Thứ 5": ["Đi lại", "Thời tiết", "Hội thoại"],
  "Thứ 6": ["Sở thích", "Công việc", "Viết chữ"],
  "Thứ 7": ["Ôn tập tuần", "Thi thử HSK", "Kể chuyện"],
  "Chủ nhật": ["Nghỉ — tự học", "Đọc truyện", "Pomodoro"],
};

function slotStatus(slot: ClassSlot, now: Date) {
  const start = new Date(now);
  start.setHours(slot.hour, slot.minute, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  if (now >= start && now < end) {
    return { label: "🔴 Đang mở lớp", cls: "bg-red-100 text-red-700 border-red-300", live: true };
  }
  if (now < start) {
    const mins = Math.round((start.getTime() - now.getTime()) / 60000);
    const text =
      mins >= 60
        ? `Sắp mở sau ${Math.floor(mins / 60)} giờ ${mins % 60} phút`
        : `Sắp mở sau ${mins} phút`;
    return { label: `🕗 ${text}`, cls: "bg-gold-soft/40 text-ink border-gold", live: false };
  }
  return { label: "✅ Đã kết thúc hôm nay", cls: "bg-gray-100 text-gray-500 border-gray-300", live: false };
}

export default function LichHocPage() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now
    ? now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">🕗 Lịch lớp học</h1>
      <p className="mt-2 text-ink-soft">
        Lớp mở cố định mỗi ngày, đúng giờ thầy vào lớp. Bây giờ là{" "}
        <span className="font-black text-vermilion">{timeStr}</span> (giờ địa
        phương của bạn).
      </p>

      <div className="mt-8 space-y-4">
        {SLOTS.map((s) => {
          const st = now ? slotStatus(s, now) : null;
          return (
            <div
              key={s.hour}
              className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-gold/40 bg-cream p-5 shadow"
            >
              <span className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-vermilion text-cream shadow">
                <span className="text-xl font-black leading-none">
                  {String(s.hour).padStart(2, "0")}:00
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-extrabold text-ink">{s.title}</h2>
                <p className="text-sm text-ink-soft">{s.desc}</p>
              </div>
              {st && (
                <span
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold ${st.cls}`}
                >
                  {st.label}
                </span>
              )}
              {st?.live && (
                <Link
                  href="/bai-hoc"
                  className="rounded-full bg-leaf px-4 py-2 text-sm font-bold text-cream shadow hover:bg-leaf/90"
                >
                  Vào lớp ngay →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <h2 className="mt-10 text-xl font-black text-ink">
        Thời khóa biểu tuần
      </h2>
      <div className="mt-3 overflow-x-auto rounded-2xl border-2 border-gold/40 bg-cream shadow">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="bg-vermilion text-cream">
              <th className="px-4 py-3">Buổi</th>
              {Object.keys(WEEK).map((d) => (
                <th key={d} className="px-3 py-3 font-bold">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2].map((row) => (
              <tr key={row} className="border-t border-gold/30">
                <td className="px-4 py-3 font-bold text-vermilion">
                  {["Sáng 8:00", "Chiều 14:00", "Tối 20:00"][row]}
                </td>
                {Object.values(WEEK).map((subjects, i) => (
                  <td key={i} className="px-3 py-3 text-ink-soft">
                    {subjects[row]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        * Lịch trên là lịch mẫu của trường. Sau này khi có tài khoản, mỗi lớp
        sẽ có thầy và bạn học thật cùng vào đúng giờ.
      </p>
    </div>
  );
}
