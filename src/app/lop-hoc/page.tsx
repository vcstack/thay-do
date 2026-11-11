"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { lessons } from "@/data/lessons";
import { randomRemark, TEACHER_REMARKS_MISTAKE, loadStudentNames } from "@/data/teacher";

interface Slot {
  hour: number;
  title: string;
  topic: string;
  teacherSay: string;
  points: string[];
  lessonIds: number[];
  homework: string;
}

const SLOTS: Slot[] = [
  {
    hour: 8,
    title: "Lớp sáng — Giao tiếp cơ bản",
    topic: "Chào hỏi & giới thiệu bản thân",
    teacherSay:
      "Sáng nay thầy dạy các em chào hỏi cho ra dáng người có học. Gặp ai cũng 你好, đừng có gật đầu rồi đi thẳng như người câm!",
    points: [
      "你好 (nǐ hǎo) — Xin chào, dùng với mọi người.",
      "您好 (nín hǎo) — Xin chào (lịch sự, với người lớn tuổi).",
      "我叫…… (wǒ jiào…) — Tôi tên là…",
      "很高兴认识你 (hěn gāoxìng rènshi nǐ) — Rất vui được gặp bạn.",
    ],
    lessonIds: [1, 2],
    homework: "Tự giới thiệu bản thân bằng 3 câu tiếng Trung trước gương.",
  },
  {
    hour: 14,
    title: "Lớp chiều — Từ vựng & ngữ pháp",
    topic: "Nói về đất nước, sở thích và thời gian",
    teacherSay:
      "Chiều nay học từ mới theo chủ đề. Ai không thuộc bài thì đứng lên đọc to cho cả lớp nghe — thầy không phạt đâu, thầy chỉ cười thôi.",
    points: [
      "你是哪国人？(nǐ shì nǎ guó rén?) — Bạn là người nước nào?",
      "你喜欢什么？(nǐ xǐhuān shénme?) — Bạn thích cái gì?",
      "Cấu trúc 是……的 để nhấn mạnh: 我是昨天来的。",
      "Hỏi giờ giấc: 现在几点？(xiànzài jǐ diǎn?) — Bây giờ mấy giờ?",
    ],
    lessonIds: [3, 7],
    homework: "Đặt 5 câu hỏi bằng tiếng Trung về người thân trong nhà.",
  },
  {
    hour: 20,
    title: "Lớp tối — Luyện viết & hội thoại",
    topic: "Viết chữ Hán và luyện hội thoại",
    teacherSay:
      "Tối nay tô chữ cùng thầy. Viết xấu cũng không sao, miễn là viết — thầy chấm từng nét, sai đâu sửa đó, đừng có giấu bài!",
    points: [
      "Thứ tự nét: ngang trước sổ sau, trái trước phải sau.",
      "Chữ 老师 (lǎoshī) — thầy giáo: bộ lão + chữ sư.",
      "Chữ 学生 (xuésheng) — học sinh: học + sinh.",
      "Hội thoại: chào hỏi → hỏi thăm → tạm biệt, đủ 3 bước mới gọi là lễ phép.",
    ],
    lessonIds: [1, 5],
    homework: "Tô 10 chữ trong bài hôm nay, chữ nào sai quá 3 lần thì tô lại 5 lần.",
  },
];

function slotState(slot: Slot, now: Date): { live: boolean; label: string; mins: number } {
  const start = new Date(now);
  start.setHours(slot.hour, 0, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  if (now >= start && now < end) {
    return { live: true, label: "🔴 Đang mở lớp", mins: Math.round((end.getTime() - now.getTime()) / 60000) };
  }
  if (now < start) {
    return { live: false, label: "🕗 Sắp mở", mins: Math.round((start.getTime() - now.getTime()) / 60000) };
  }
  return { live: false, label: "✅ Đã kết thúc hôm nay", mins: 0 };
}

export default function LopHocPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [remark, setRemark] = useState("");
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});

  useEffect(() => {
    // Giờ hiện tại + tên học sinh (localStorage) chỉ có ở client — khởi tạo
    // trong effect để tránh lệch hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    setStudentNames(loadStudentNames());
    return () => clearInterval(t);
  }, []);

  const live = now ? SLOTS.find((s) => slotState(s, now).live) : undefined;
  const current = live ?? SLOTS[0];
  const state = now ? slotState(current, now) : null;
  const seated = Object.entries(studentNames).filter(([, n]) => n.trim() !== "");

  const lectureLessons = current.lessonIds
    .map((id) => lessons.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">🏫 Lớp học</h1>
      <p className="mt-2 text-ink-soft">
        Lớp mở cố định 3 ca mỗi ngày: 8:00, 14:00 và 20:00. Vào đúng giờ, ngồi
        chiếu nghe thầy giảng — đến muộn thì ngồi chiếu cuối.
      </p>

      {/* Trạng thái lớp */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {SLOTS.map((s) => {
          const st = now ? slotState(s, now) : null;
          const isCurrent = current.hour === s.hour;
          return (
            <div
              key={s.hour}
              className={`rounded-2xl border-2 p-4 shadow ${st?.live ? "border-vermilion bg-vermilion/5" : "border-gold/40 bg-cream"}`}
            >
              <p className="text-2xl font-black text-ink">
                {String(s.hour).padStart(2, "0")}:00
              </p>
              <p className="mt-1 text-sm font-bold text-ink">{s.title}</p>
              <p className="mt-2 text-xs font-bold">
                {st && (
                  <span className={st.live ? "text-red-600" : "text-ink-soft"}>
                    {st.label}
                    {st.live ? ` — còn ${st.mins} phút` : ""}
                  </span>
                )}
              </p>
              {isCurrent && (
                <span className="mt-2 inline-block rounded-full bg-vermilion px-2 py-0.5 text-xs font-bold text-cream">
                  👈 Buổi này
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Thầy giảng */}
      <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
        <div className="flex items-start gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-vermilion text-4xl shadow">
            👨‍🏫
          </span>
          <div>
            <p className="text-xl font-black text-vermilion">Thầy Đồ giảng bài</p>
            <p className="text-sm font-bold text-ink">{current.title}</p>
            <p className="mt-1 text-sm text-ink-soft">Chủ đề: {current.topic}</p>
          </div>
        </div>

        <blockquote className="mt-4 rounded-xl bg-gold-soft/30 p-4 text-base leading-relaxed text-ink">
          “{current.teacherSay}”
        </blockquote>

        <h3 className="mt-5 text-base font-extrabold text-ink">📌 Nội dung buổi học</h3>
        <ul className="mt-2 space-y-2">
          {current.points.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink">
              <span className="text-vermilion">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        {lectureLessons.length > 0 && (
          <>
            <h3 className="mt-5 text-base font-extrabold text-ink">📖 Bài học liên quan</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {lectureLessons.map((l) => (
                <Link
                  key={l.id}
                  href={`/bai-hoc/${l.id}`}
                  className="rounded-full border-2 border-gold bg-white px-3 py-1.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                >
                  Bài {l.id}: {l.title} — {l.titleVi}
                </Link>
              ))}
            </div>
          </>
        )}

        <p className="mt-5 rounded-xl bg-leaf-soft/30 p-3 text-sm font-bold text-leaf">
          📝 Bài tập về nhà: {current.homework}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/luyen-viet"
            className="rounded-full bg-vermilion px-4 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
          >
            ✍️ Vào lớp luyện chữ
          </Link>
          <Link
            href="/doc-truyen"
            className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
          >
            📚 Đọc truyện
          </Link>
        </div>
      </div>

      {/* Thầy nhận xét */}
      <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
        <h2 className="text-lg font-extrabold text-vermilion">💬 Thầy nhận xét</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Thầy Đồ nổi tiếng là chấm không nể ai. Viết sai thì nghe thầy chê một
          câu rồi viết lại cho đẹp.
        </p>
        <button
          onClick={() => setRemark(randomRemark(TEACHER_REMARKS_MISTAKE))}
          className="mt-3 rounded-full bg-vermilion px-4 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
        >
          🎲 Nghe thầy chê một câu
        </button>
        {remark && (
          <blockquote className="mt-3 rounded-xl bg-gold-soft/30 p-4 text-base text-ink">
            “{remark}”
          </blockquote>
        )}
      </div>

      {/* Học sinh trong lớp */}
      <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
        <h2 className="text-lg font-extrabold text-vermilion">🎒 Học sinh trong lớp</h2>
        {seated.length > 0 ? (
          <>
            <p className="mt-1 text-sm text-ink-soft">
              Các bạn đã đặt tên và vào lớp ngồi học:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {seated.map(([id, name]) => (
                <span
                  key={id}
                  className="rounded-full border-2 border-leaf bg-leaf-soft/30 px-3 py-1.5 text-sm font-bold text-leaf"
                >
                  🧑‍🎓 {name}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">
            Chưa có bạn nào vào lớp. Ra sân trường 3D ở trang chủ, bấm vào một
            học sinh rồi đặt tên cho bạn ấy — bạn ấy sẽ đi bộ vào lớp ngồi học
            ngay.
          </p>
        )}
        <Link
          href="/"
          className="mt-3 inline-block rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
        >
          🏫 Ra sân trường gọi bạn vào lớp →
        </Link>
      </div>

      <p className="mt-4 text-center text-xs text-ink-soft">
        {state?.live
          ? `Lớp đang mở — còn ${state.mins} phút nữa tan học.`
          : "Ngoài giờ học, bạn vẫn có thể tự học: đọc truyện, luyện viết hoặc chạy Pomodoro."}
      </p>
    </div>
  );
}
