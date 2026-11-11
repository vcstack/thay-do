"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { allVocab, lessons, shuffle, type Vocab } from "@/data/lessons";
import { speakZh } from "@/lib/speak";

interface Question {
  kind: "zh-to-vi" | "vi-to-zh" | "listen";
  prompt: string;
  promptSub?: string;
  audio?: string;
  options: string[];
  answer: string;
}

type Mode = "short" | "mock" | "check";
type HskLevel = "HSK1" | "HSK2" | "HSK3";

/** Cấp HSK xấp xỉ theo bài học (ghi chú trong giao diện). */
const LEVEL_LESSONS: Record<HskLevel, number[]> = {
  HSK1: [1, 2, 3, 4, 5, 6, 7],
  HSK2: [8, 9, 10, 11, 12, 13, 14],
  HSK3: [15, 16, 17, 18, 19, 20],
};

function vocabOfLevel(level: HskLevel): Vocab[] {
  const ids = LEVEL_LESSONS[level];
  return lessons.filter((l) => ids.includes(l.id)).flatMap((l) => l.vocab);
}

function zhToVi(v: Vocab, pool: Vocab[]): Question {
  const others = shuffle(pool.filter((x) => x.zh !== v.zh)).slice(0, 3);
  return {
    kind: "zh-to-vi",
    prompt: v.zh,
    promptSub: v.py,
    options: shuffle([v.vi, ...others.map((o) => o.vi)]),
    answer: v.vi,
  };
}

function viToZh(v: Vocab, pool: Vocab[]): Question {
  const others = shuffle(pool.filter((x) => x.zh !== v.zh)).slice(0, 3);
  return {
    kind: "vi-to-zh",
    prompt: v.vi,
    options: shuffle([v.zh, ...others.map((o) => o.zh)]),
    answer: v.zh,
  };
}

function listenQ(v: Vocab, pool: Vocab[]): Question {
  const others = shuffle(pool.filter((x) => x.zh !== v.zh)).slice(0, 3);
  return {
    kind: "listen",
    prompt: "Nghe rồi chọn nghĩa đúng",
    audio: v.zh,
    options: shuffle([v.vi, ...others.map((o) => o.vi)]),
    answer: v.vi,
  };
}

/** Đề ngắn đầu giờ: 5 câu, làm trong 15 phút. */
function buildShort(): { questions: Question[]; timeLimitSec: number } {
  const picked = shuffle(allVocab).slice(0, 5);
  return {
    questions: picked.map((v, i) => (i % 2 === 0 ? zhToVi(v, allVocab) : viToZh(v, allVocab))),
    timeLimitSec: 15 * 60,
  };
}

/** Đề thi thử HSK: 5 câu Nghe + 5 câu Đọc theo cấp. */
function buildMock(level: HskLevel): { questions: Question[]; timeLimitSec: number } {
  const pool = vocabOfLevel(level);
  const picked = shuffle(pool).slice(0, 10);
  const listenQs = picked.slice(0, 5).map((v) => listenQ(v, pool));
  const readQs = picked.slice(5).map((v, i) => (i % 2 === 0 ? zhToVi(v, pool) : viToZh(v, pool)));
  return { questions: [...listenQs, ...readQs], timeLimitSec: 20 * 60 };
}

/** Đề kiểm tra 10 câu ngẫu nhiên. */
function buildCheck(): { questions: Question[]; timeLimitSec: number } {
  const picked = shuffle(allVocab).slice(0, 10);
  return {
    questions: picked.map((v, i) => (i % 2 === 0 ? zhToVi(v, allVocab) : viToZh(v, allVocab))),
    timeLimitSec: 0,
  };
}

const MODES: { id: Mode; icon: string; title: string; desc: string }[] = [
  {
    id: "short",
    icon: "⏱️",
    title: "Đề ngắn đầu giờ",
    desc: "5 câu, làm trong 15 phút. Đầu mỗi giờ cả trường cùng làm một đề.",
  },
  {
    id: "mock",
    icon: "🎓",
    title: "Đề thi thử HSK",
    desc: "Theo cấp HSK 1–3, chia 2 phần: Nghe (5 câu) và Đọc (5 câu).",
  },
  {
    id: "check",
    icon: "📝",
    title: "Đề kiểm tra 10 câu",
    desc: "10 câu ngẫu nhiên từ 200 từ vựng — kiểm tra nhanh trình độ của bạn.",
  },
];

function fmtClock(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ThiHskPage() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [level, setLevel] = useState<HskLevel>("HSK1");
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ q: Question; chosen: string }[]>([]);
  const [heard, setHeard] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const done = questions !== null && idx >= questions.length;
  const q = questions?.[idx];

  const progress = useMemo(
    () =>
      questions === null
        ? 0
        : done
          ? 100
          : Math.round((idx / questions.length) * 100),
    [idx, done, questions]
  );

  // Đồng hồ đếm ngược (chỉ khi đề có giới hạn giờ).
  useEffect(() => {
    if (!questions || timeLimit <= 0 || done) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIdx(questions.length); // hết giờ → nộp bài
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, done]);

  function start(m: Mode, lv: HskLevel = level) {
    const built = m === "short" ? buildShort() : m === "mock" ? buildMock(lv) : buildCheck();
    setMode(m);
    setQuestions(built.questions);
    setTimeLimit(built.timeLimitSec);
    setTimeLeft(built.timeLimitSec);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setAnswers([]);
    setHeard(false);
  }

  function choose(opt: string) {
    if (picked !== null || !q) return;
    setPicked(opt);
    const correct = opt === q.answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, { q, chosen: opt }]);
  }

  function next() {
    setPicked(null);
    setHeard(false);
    setIdx((i) => i + 1);
  }

  function backToModes() {
    setMode(null);
    setQuestions(null);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setAnswers([]);
  }

  // ---------- Màn chọn chế độ ----------
  if (mode === null) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-black text-vermilion">📝 Trường thi</h1>
        <p className="mt-2 text-ink-soft">
          Thi thử đề mẫu HSK từng phần. Đầu mỗi giờ có Đề ngắn 5 câu, cả trường
          cùng làm. Chọn một chế độ để vào thi.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {MODES.map((m) => (
            <div
              key={m.id}
              className="flex flex-col rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow"
            >
              <p className="text-4xl">{m.icon}</p>
              <h2 className="mt-3 text-lg font-extrabold text-vermilion">{m.title}</h2>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-soft">{m.desc}</p>
              {m.id === "mock" && (
                <label className="mt-3 text-sm font-bold text-ink">
                  Chọn cấp
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as HskLevel)}
                    className="mt-1 w-full rounded-lg border-2 border-gold/50 bg-white px-3 py-2 text-sm"
                  >
                    <option value="HSK1">HSK 1 — bài 1–7</option>
                    <option value="HSK2">HSK 2 — bài 8–14</option>
                    <option value="HSK3">HSK 3 — bài 15–20</option>
                  </select>
                </label>
              )}
              <button
                onClick={() => start(m.id)}
                className="mt-4 rounded-full bg-vermilion px-4 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
              >
                Vào thi →
              </button>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-ink-soft">
          * Cấp HSK ở đây chia xấp xỉ theo bài học (HSK 1 = bài 1–7, HSK 2 = bài
          8–14, HSK 3 = bài 15–20) để bạn ôn đúng trình độ.
        </p>
      </div>
    );
  }

  // ---------- Màn kết quả ----------
  if (questions !== null && done) {
    const pct = Math.round((score / questions.length) * 100);
    const modeTitle = MODES.find((m) => m.id === mode)?.title ?? "Bài thi";
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border-2 border-gold/40 bg-cream p-8 text-center shadow">
          <p className="text-5xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</p>
          <h1 className="mt-3 text-3xl font-black text-vermilion">
            {score}/{questions.length} câu đúng ({pct}%)
          </h1>
          <p className="mt-2 text-ink-soft">
            {modeTitle} —{" "}
            {pct >= 80
              ? "Xuất sắc! Bạn đã sẵn sàng thi HSK thật rồi."
              : pct >= 50
                ? "Khá lắm! Ôn lại mấy câu sai bên dưới rồi làm lại nhé."
                : "Chưa sao đâu — ôn lại bài học rồi thi lại, sẽ khá hơn ngay."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => start(mode, level)}
              className="rounded-full bg-vermilion px-6 py-3 font-bold text-cream shadow hover:bg-vermilion-dark"
            >
              🔄 Làm bài mới
            </button>
            <button
              onClick={backToModes}
              className="rounded-full border-2 border-gold bg-cream px-6 py-3 font-bold text-vermilion hover:bg-gold-soft/40"
            >
              ← Chọn chế độ khác
            </button>
          </div>
        </div>

        <h2 className="mt-8 text-xl font-black text-ink">Xem lại các câu</h2>
        <div className="mt-3 space-y-3">
          {answers.map((a, i) => {
            const correct = a.chosen === a.q.answer;
            return (
              <div
                key={i}
                className={`rounded-2xl border-2 p-4 ${
                  correct ? "border-leaf/50 bg-leaf-soft/20" : "border-red-300 bg-red-50"
                }`}
              >
                <p className="text-sm font-bold text-ink-soft">
                  Câu {i + 1}:{" "}
                  {a.q.kind === "zh-to-vi"
                    ? `“${a.q.prompt}” nghĩa là gì?`
                    : a.q.kind === "vi-to-zh"
                      ? `“${a.q.prompt}” viết bằng chữ Hán nào?`
                      : `Nghe “${a.q.audio}” rồi chọn nghĩa đúng.`}
                </p>
                <p className="mt-1 text-lg font-black text-ink">Đáp án đúng: {a.q.answer}</p>
                {!correct && (
                  <p className="text-sm font-semibold text-red-600">Bạn chọn: {a.chosen}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- Màn làm bài ----------
  if (!q || !questions) return null;
  const modeTitle = MODES.find((m) => m.id === mode)?.title ?? "Bài thi";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black text-vermilion">📝 {modeTitle}</h1>
        <button
          onClick={backToModes}
          className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
        >
          ← Đổi chế độ
        </button>
      </div>

      {/* Tiến độ + đồng hồ */}
      <div className="mt-6">
        <div className="flex justify-between text-sm font-bold">
          <span>
            Câu {idx + 1}/{questions.length}
            {q.kind === "listen" ? " · 🔊 Phần Nghe" : " · 📖 Phần Đọc"}
          </span>
          <span>
            Đúng: {score}
            {timeLimit > 0 && ` · ⏱️ ${fmtClock(timeLeft)}`}
          </span>
        </div>
        <div className="mt-1 h-3 overflow-hidden rounded-full bg-gold-soft/50">
          <div
            className="h-full rounded-full bg-vermilion transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Câu hỏi */}
      <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
        {q.kind === "listen" ? (
          <>
            <p className="text-sm font-bold text-ink-soft">
              Nghe rồi chọn nghĩa đúng. Bấm loa để nghe lại.
            </p>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  if (q.audio) speakZh(q.audio);
                  setHeard(true);
                }}
                className="rounded-full bg-vermilion px-8 py-4 text-2xl font-black text-cream shadow hover:bg-vermilion-dark"
              >
                🔊 Nghe
              </button>
              <p className="mt-2 text-xs font-semibold text-ink-soft">
                {heard ? "Đã nghe — chọn nghĩa đúng bên dưới." : "Bấm loa để nghe từ/câu."}
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-ink-soft">
              {q.kind === "zh-to-vi" ? "Từ này nghĩa là gì?" : "Nghĩa này viết bằng chữ Hán nào?"}
            </p>
            <p className="mt-2 text-center text-4xl font-black text-ink">{q.prompt}</p>
            {q.promptSub && (
              <p className="mt-1 text-center text-base font-semibold text-leaf">{q.promptSub}</p>
            )}
          </>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {q.options.map((opt) => {
            const isAnswer = opt === q.answer;
            const isPicked = opt === picked;
            let cls = "border-gold/50 bg-white hover:border-vermilion hover:bg-gold-soft/30";
            if (picked !== null) {
              if (isAnswer) cls = "border-leaf bg-leaf-soft/40 text-leaf";
              else if (isPicked) cls = "border-red-400 bg-red-100 text-red-700";
              else cls = "border-gold/30 bg-white opacity-50";
            }
            return (
              <button
                key={opt}
                onClick={() => choose(opt)}
                disabled={picked !== null}
                className={`rounded-xl border-2 px-4 py-3 text-left text-base font-bold transition ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className={`text-sm font-bold ${picked === q.answer ? "text-leaf" : "text-red-600"}`}>
              {picked === q.answer
                ? "✅ Đúng rồi!"
                : `❌ Sai rồi — đáp án đúng là “${q.answer}”.`}
            </p>
            <button
              onClick={next}
              className="rounded-full bg-vermilion px-5 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
            >
              {idx + 1 === questions.length ? "Xem kết quả →" : "Câu tiếp →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
