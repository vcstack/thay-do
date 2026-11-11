"use client";

import { useState } from "react";
import { speakZh } from "@/lib/speak";

/** Nút loa: bấm để nghe phát âm tiếng Trung. */
export default function SpeakButton({
  text,
  className = "",
  label = "🔊 Nghe",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [ok, setOk] = useState(true);
  return (
    <button
      type="button"
      title="Nghe phát âm"
      onClick={() => {
        const done = speakZh(text);
        setOk(done);
        if (!done) {
          alert(
            "Trình duyệt của bạn không hỗ trợ đọc tiếng Trung (Web Speech API)."
          );
        }
      }}
      className={`inline-flex items-center gap-1 rounded-full border border-gold bg-cream px-2.5 py-1 text-xs font-bold text-vermilion shadow-sm transition hover:bg-gold-soft/40 ${className}`}
    >
      {label}
      {!ok && <span className="text-ink-soft">(không có giọng)</span>}
    </button>
  );
}
