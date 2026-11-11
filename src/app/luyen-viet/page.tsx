"use client";

import { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import {
  lessons,
  getLessonChars,
  getAllChars,
  allVocab,
  shuffle,
} from "@/data/lessons";
import {
  randomRemark,
  TEACHER_REMARKS_MISTAKE,
  TEACHER_REMARKS_PRAISE,
} from "@/data/teacher";

type QuizState = "idle" | "quizzing" | "done";

export default function LuyenVietPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [lessonId, setLessonId] = useState(1);
  const [char, setChar] = useState("你");
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [mistakes, setMistakes] = useState(0);
  const [doneStrokes, setDoneStrokes] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [remark, setRemark] = useState("");

  const chars = getLessonChars(lessons[lessonId - 1]);
  const vocabHit = allVocab.find((v) => v.zh.includes(char));

  // Tạo writer 1 lần khi mount (cần DOM + CDN, chỉ chạy ở client).
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    let writer: HanziWriter | null = null;
    try {
      writer = HanziWriter.create(el, char, {
        width: 320,
        height: 320,
        padding: 16,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        radicalColor: "#15803d",
      });
      writerRef.current = writer;
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadError(true);
    }
    return () => {
      try {
        writer?.cancelQuiz();
      } catch {
        /* ignore */
      }
      el.innerHTML = "";
      writerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Đổi chữ
  useEffect(() => {
    const writer = writerRef.current;
    if (!writer) return;
    setQuizState("idle");
    setMistakes(0);
    setDoneStrokes(0);
    setRemark("");
    try {
      writer.setCharacter(char);
      // Lấy tổng số nét từ dữ liệu chữ (nếu có)
      const data = (
        writer as unknown as {
          _character?: { strokes?: unknown[] };
        }
      )._character;
      if (data?.strokes) setTotalStrokes(data.strokes.length);
    } catch {
      setLoadError(true);
    }
  }, [char]);

  function startQuiz() {
    const writer = writerRef.current;
    if (!writer) return;
    setQuizState("quizzing");
    setMistakes(0);
    setDoneStrokes(0);
    setRemark("");
    writer.quiz({
      onMistake: () => {
        setMistakes((m) => m + 1);
        setRemark(randomRemark(TEACHER_REMARKS_MISTAKE));
      },
      onCorrectStroke: (d) => setDoneStrokes(d.strokeNum + 1),
      onComplete: () => {
        setQuizState("done");
        setRemark((r) => r || randomRemark(TEACHER_REMARKS_PRAISE));
      },
    });
  }

  function showDemo() {
    const writer = writerRef.current;
    if (!writer) return;
    setQuizState("idle");
    writer.animateCharacter();
  }

  function pickRandom() {
    const all = getAllChars();
    const next = shuffle(all.filter((c) => c !== char))[0];
    if (next) setChar(next);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">✍️ Luyện viết chữ Hán</h1>
      <p className="mt-2 text-ink-soft">
        Chọn một chữ, xem thầy viết mẫu, rồi tô theo từng nét — viết sai thầy
        sẽ báo ngay. Dữ liệu nét chữ tải từ thư viện Hanzi Writer (cần mạng).
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Khung viết */}
        <div className="rounded-2xl border-2 border-gold/40 bg-cream p-5 shadow">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-4xl font-black text-ink">{char}</p>
              {vocabHit && (
                <p className="mt-1 text-sm text-ink-soft">
                  {vocabHit.py} — {vocabHit.vi}
                  {vocabHit.zh !== char && ` (trong từ “${vocabHit.zh}”)`}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={showDemo}
                className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
              >
                ▶ Xem thầy viết
              </button>
              <button
                onClick={startQuiz}
                disabled={quizState === "quizzing"}
                className="rounded-full bg-vermilion px-4 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark disabled:opacity-50"
              >
                {quizState === "quizzing" ? "Đang tô…" : "✍️ Bắt đầu tô"}
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <div
              ref={containerRef}
              className="rounded-xl border-2 border-dashed border-gold/60 bg-[#fffdf4]"
              style={{ width: 320, height: 320 }}
            />
          </div>

          {loadError && (
            <p className="mt-3 rounded-lg bg-red-100 p-3 text-sm font-semibold text-red-700">
              Không tải được dữ liệu nét chữ (cần mạng để tải từ CDN). Kiểm tra
              mạng rồi tải lại trang.
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold">
            <span>
              Nét đã viết đúng: {doneStrokes}
              {totalStrokes > 0 ? ` / ${totalStrokes}` : ""}
            </span>
            <span className={mistakes > 0 ? "text-red-600" : "text-ink-soft"}>
              Viết sai: {mistakes} lần
            </span>
            {quizState === "done" && (
              <span className="rounded-full bg-leaf px-3 py-1 text-cream">
                🎉 Xong! {mistakes === 0 ? "Không sai nét nào — giỏi quá!" : `Sai ${mistakes} lần, tô lại cho chắc nhé.`}
              </span>
            )}
          </div>
          {quizState === "quizzing" && (
            <p className="mt-2 text-sm text-ink-soft">
              Tô theo viền mờ — viết đúng thứ tự nét thì mới qua nét tiếp theo.
            </p>
          )}
          {remark && (
            <p className="mt-3 rounded-xl bg-gold-soft/30 p-3 text-sm leading-relaxed text-ink">
              <span className="font-black text-vermilion">👨‍🏫 Thầy nói:</span> “{remark}”
            </p>
          )}
        </div>

        {/* Chọn chữ */}
        <div className="rounded-2xl border-2 border-gold/40 bg-cream p-5 shadow">
          <label className="text-sm font-bold text-ink">
            Chọn bài học
            <select
              value={lessonId}
              onChange={(e) => {
                const id = Number(e.target.value);
                setLessonId(id);
                const cs = getLessonChars(lessons[id - 1]);
                if (cs.length > 0) setChar(cs[0]);
              }}
              className="mt-1 w-full rounded-lg border-2 border-gold/50 bg-white px-3 py-2 text-sm"
            >
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  Bài {l.id}: {l.title} — {l.titleVi}
                </option>
              ))}
            </select>
          </label>

          <p className="mt-4 text-sm font-bold text-ink">
            Chữ trong bài ({chars.length} chữ)
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chars.map((c) => (
              <button
                key={c}
                onClick={() => setChar(c)}
                className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 text-xl font-black transition ${
                  c === char
                    ? "border-vermilion bg-vermilion text-cream shadow"
                    : "border-gold/50 bg-white text-ink hover:border-vermilion"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={pickRandom}
            className="mt-5 w-full rounded-full bg-leaf px-4 py-2 text-sm font-bold text-cream shadow hover:bg-leaf/90"
          >
            🎲 Chữ ngẫu nhiên
          </button>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft">
            Mẹo: viết chữ Hán đúng thứ tự nét (trái → phải, trên → xuống
            dưới, ngang trước sổ sau) thì nhớ lâu hơn nhiều.
          </p>
        </div>
      </div>
    </div>
  );
}
