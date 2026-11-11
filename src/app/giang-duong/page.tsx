"use client";

import { useEffect, useState } from "react";
import { ETYMOLOGIES, todayEtymology, type Etymology } from "@/data/etymology";
import { speakZh, speakVi, stopSpeak } from "@/lib/speak";

/** Giảng đường — mỗi buổi giảng một chữ Hán (chiết tự). */
export default function GiangDuongPage() {
  const [current, setCurrent] = useState<Etymology>(ETYMOLOGIES[0]);
  const [todayChar, setTodayChar] = useState("");
  const [heard, setHeard] = useState(false);

  // Chữ giảng hôm nay chỉ tính ở client (tránh new Date() lúc prerender).
  useEffect(() => {
    const t = todayEtymology(new Date());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(t);
    setTodayChar(t.char);
  }, []);

  function listenPronunciation() {
    speakZh(current.char);
    setHeard(true);
  }

  function listenLecture() {
    // Thầy giảng lại: đọc phần chiết tự bằng tiếng Việt.
    speakVi(`${current.char}, ${current.meaning}. ${current.story} ${current.memory}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">🏛️ Giảng đường</h1>
      <p className="mt-2 text-ink-soft">
        Giờ giảng chiết tự: mỗi buổi một chữ, thầy tách ra từng phần cho dễ
        nhớ. Hôm nay thầy giảng chữ nào, vào nghe là biết.
      </p>

      {/* Chữ giảng hôm nay */}
      <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="rounded-full bg-vermilion px-3 py-1 text-xs font-bold text-cream">
              📖 Chữ hôm nay
            </span>
            <p className="mt-3 text-7xl font-black text-ink">{current.char}</p>
            <p className="mt-2 text-lg font-bold text-leaf">{current.py}</p>
            <p className="text-base font-semibold text-ink-soft">
              Nghĩa: {current.meaning}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={listenPronunciation}
              className="rounded-full bg-vermilion px-4 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
            >
              🔊 Nghe phát âm
            </button>
            <button
              onClick={listenLecture}
              className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
            >
              📖 Nghe thầy giảng
            </button>
            <button
              onClick={() => {
                stopSpeak();
                listenLecture();
              }}
              className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
            >
              🔄 Nghe lại
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-base font-extrabold text-ink">🧩 Chữ này gồm những phần nào?</h2>
          <ul className="mt-2 space-y-1">
            {current.parts.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink">
                <span className="text-vermilion">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <blockquote className="mt-5 rounded-xl bg-gold-soft/30 p-4 text-base leading-relaxed text-ink">
          <span className="font-black text-vermilion">👨‍🏫 Thầy giảng:</span> “{current.story}”
        </blockquote>

        <p className="mt-4 rounded-xl bg-leaf-soft/30 p-3 text-sm font-bold text-leaf">
          💡 Mẹo nhớ: {current.memory}
        </p>

        {heard && (
          <p className="mt-3 text-sm text-ink-soft">
            Đã nghe phát âm — đọc theo thầy vài lần rồi chuyển sang chữ khác nhé.
          </p>
        )}
      </div>

      {/* Danh sách các chữ đã giảng */}
      <h2 className="mt-8 text-xl font-black text-ink">📜 Các chữ đã giảng</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Bấm vào một chữ để xem lại bài giảng của thầy.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {ETYMOLOGIES.map((e) => (
          <button
            key={e.char}
            onClick={() => {
              setCurrent(e);
              setHeard(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`rounded-2xl border-2 p-4 text-center shadow transition hover:-translate-y-0.5 ${
              e.char === current.char
                ? "border-vermilion bg-vermilion/5"
                : "border-gold/40 bg-cream hover:border-vermilion"
            }`}
          >
            <p className="text-4xl font-black text-ink">{e.char}</p>
            <p className="mt-1 text-xs font-bold text-leaf">{e.py}</p>
            <p className="text-xs font-semibold text-ink-soft">{e.meaning}</p>
            {e.char === todayChar && (
              <span className="mt-1 inline-block rounded-full bg-vermilion px-2 py-0.5 text-[11px] font-bold text-cream">
                Hôm nay
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
