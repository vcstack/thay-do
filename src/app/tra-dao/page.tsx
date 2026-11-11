"use client";

import { useState } from "react";
import Link from "next/link";
import SpeakButton from "@/components/SpeakButton";
import { speakZh, speakVi } from "@/lib/speak";
import {
  TEA_DIALOGUE,
  TEA_POEMS,
  TEA_STEPS,
  TEA_VOCAB,
} from "@/data/tea";

/** Khu trà đạo — ngồi chiếu thưởng trà, học nghi thức pha trà từng bước. */
export default function TraDaoPage() {
  const [stepIdx, setStepIdx] = useState(0);
  const [poemIdx, setPoemIdx] = useState(0);
  const step = TEA_STEPS[stepIdx];
  const poem = TEA_POEMS[poemIdx];

  function nextStep() {
    setStepIdx((i) => Math.min(TEA_STEPS.length - 1, i + 1));
  }

  function prevStep() {
    setStepIdx((i) => Math.max(0, i - 1));
  }

  function listenWithTeacher() {
    // Thầy đọc thơ trà bằng tiếng Trung, rồi giảng nghĩa bằng tiếng Việt.
    speakZh(poem.zh);
    window.setTimeout(() => {
      speakVi(`${poem.vi} — ${poem.source}.`);
    }, 4500);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">🍵 Khu trà đạo</h1>
      <p className="mt-2 leading-relaxed text-ink-soft">
        Trà đạo là nghệ thuật pha trà và thưởng trà của người Trung Hoa: pha
        trà không chỉ để uống, mà để tĩnh tâm. Ngồi xuống chiếu, nghe tiếng
        nước sôi, ngửi hương trà, nhấp từng ngụm nhỏ — học tiếng Trung qua
        từng bước pha trà.
      </p>

      {/* ---------- Nghi thức pha trà từng bước ---------- */}
      <section className="mt-8">
        <h2 className="text-xl font-black text-ink">
          🫖 Nghi thức pha trà — 7 bước
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Đi theo đúng trình tự, bước nào xong mới sang bước sau, như thầy
          vẫn pha.
        </p>

        {/* Thanh tiến độ các bước */}
        <div className="mt-4 flex flex-wrap gap-2">
          {TEA_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStepIdx(i)}
              className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
                i === stepIdx
                  ? "bg-vermilion text-cream shadow"
                  : i < stepIdx
                    ? "bg-leaf-soft/40 text-leaf"
                    : "border-2 border-gold/50 bg-cream text-ink"
              }`}
            >
              {i + 1}. {s.vi}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border-2 border-gold/40 bg-cream p-6 text-center shadow">
          <p className="text-sm font-bold text-ink-soft">
            Bước {stepIdx + 1}/{TEA_STEPS.length}
          </p>
          <p className="mt-2 text-6xl font-black text-ink">{step.zh}</p>
          <p className="mt-2 text-lg font-bold text-leaf">{step.py}</p>
          <p className="text-xl font-extrabold text-vermilion">{step.vi}</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            {step.tip}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <SpeakButton text={step.zh} label="🔊 Nghe tên bước" />
          </div>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={prevStep}
              disabled={stepIdx === 0}
              className="rounded-full border-2 border-gold bg-cream px-5 py-2 text-sm font-bold text-vermilion disabled:opacity-40"
            >
              ← Bước trước
            </button>
            {stepIdx < TEA_STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                className="rounded-full bg-vermilion px-5 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
              >
                Bước tiếp →
              </button>
            ) : (
              <span className="rounded-full bg-leaf px-5 py-2 text-sm font-bold text-cream">
                🎉 Xong rồi — mời trà!
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Từ vựng về trà ---------- */}
      <section className="mt-10">
        <h2 className="text-xl font-black text-ink">📖 Từ vựng về trà</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Học thuộc mấy từ này là đủ gọi trà, khen trà và mời trà rồi.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TEA_VOCAB.map((w) => (
            <div
              key={w.zh}
              className="flex items-center justify-between gap-2 rounded-2xl border-2 border-gold/40 bg-cream p-4 shadow-sm"
            >
              <div>
                <p className="text-2xl font-black text-ink">{w.zh}</p>
                <p className="text-sm font-semibold text-leaf">{w.py}</p>
                <p className="text-sm font-bold text-ink-soft">{w.vi}</p>
              </div>
              <SpeakButton text={w.zh} />
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Hội thoại mẫu: mời trà ---------- */}
      <section className="mt-10">
        <h2 className="text-xl font-black text-ink">
          💬 Hội thoại mẫu — Mời trà
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Thầy mời trò một chén trà xanh. Bấm loa để nghe từng câu rồi đọc
          theo.
        </p>
        <div className="mt-4 space-y-3">
          {TEA_DIALOGUE.map((line, i) => (
            <div
              key={i}
              className={`rounded-2xl border-2 p-4 shadow-sm ${
                line.speaker === "Thầy"
                  ? "border-vermilion/30 bg-gold-soft/20"
                  : "border-leaf/30 bg-leaf-soft/20"
              }`}
            >
              <p className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">
                {line.speaker}
              </p>
              <p className="mt-1 text-xl font-black text-ink">{line.zh}</p>
              <p className="text-sm font-semibold text-leaf">{line.py}</p>
              <p className="text-sm text-ink-soft">{line.vi}</p>
              <div className="mt-2">
                <SpeakButton text={line.zh} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">
          Muốn luyện nói thêm? Ra{" "}
          <Link href="/pho-hoa" className="font-bold text-vermilion hover:underline">
            Phố Hoa — Trà quán
          </Link>{" "}
          để gọi trà và trò chuyện với cô chủ quán.
        </p>
      </section>

      {/* ---------- Thưởng trà cùng thầy ---------- */}
      <section className="mt-10">
        <div className="rounded-2xl border-2 border-vermilion/40 bg-cream p-6 text-center shadow">
          <h2 className="text-xl font-black text-vermilion">
            🌸 Thưởng trà cùng thầy
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Thầy đọc một câu thơ về trà, trò nghe rồi ngẫm nghĩa.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-2xl font-black leading-relaxed text-ink">
            “{poem.zh}”
          </p>
          <p className="mt-2 text-sm font-semibold text-leaf">{poem.py}</p>
          <p className="mx-auto mt-2 max-w-xl text-base text-ink-soft">{poem.vi}</p>
          <p className="mt-1 text-xs font-bold text-gold">— {poem.source}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              onClick={listenWithTeacher}
              className="rounded-full bg-vermilion px-6 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
            >
              🔊 Nghe thầy đọc thơ
            </button>
            <button
              onClick={() => setPoemIdx((i) => (i + 1) % TEA_POEMS.length)}
              className="rounded-full border-2 border-gold bg-cream px-6 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
            >
              📜 Câu thơ khác
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
