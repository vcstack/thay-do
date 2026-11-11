"use client";

import { useEffect, useMemo, useState } from "react";
import { allVocab, shuffle } from "@/data/lessons";

interface Question {
  kind: "zh-to-vi" | "vi-to-zh";
  prompt: string;
  promptSub?: string;
  options: string[];
  answer: string;
}

const NUM_QUESTIONS = 10;

function buildQuestions(): Question[] {
  const picked = shuffle(allVocab).slice(0, NUM_QUESTIONS);
  return picked.map((v, i) => {
    const others = shuffle(allVocab.filter((x) => x.zh !== v.zh)).slice(0, 3);
    if (i % 2 === 0) {
      return {
        kind: "zh-to-vi",
        prompt: v.zh,
        promptSub: v.py,
        options: shuffle([v.vi, ...others.map((o) => o.vi)]),
        answer: v.vi,
      };
    }
    return {
      kind: "vi-to-zh",
      prompt: v.vi,
      options: shuffle([v.zh, ...others.map((o) => o.zh)]),
      answer: v.zh,
    };
  });
}

export default function ThiHskPage() {
  // Sinh câu hỏi sau khi mount (tránh Math.random() lúc prerender — Next.js cấm)
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ q: Question; chosen: string }[]>([]);

  useEffect(() => {
    setQuestions(buildQuestions());
  }, []);

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

  function choose(opt: string) {
    if (picked !== null || !q) return;
    setPicked(opt);
    const correct = opt === q.answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, { q, chosen: opt }]);
  }

  function next() {
    setPicked(null);
    setIdx((i) => i + 1);
  }

  function restart() {
    setQuestions(buildQuestions());
    setIdx(0);
    setPicked(null);
    setScore(0);
    setAnswers([]);
  }

  if (questions === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-black text-vermilion">📝 Thi thử HSK</h1>
        <p className="mt-4 animate-pulse text-lg font-bold text-ink-soft">
          Đang soạn đề thi…
        </p>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border-2 border-gold/40 bg-cream p-8 text-center shadow">
          <p className="text-5xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</p>
          <h1 className="mt-3 text-3xl font-black text-vermilion">
            {score}/{questions.length} câu đúng ({pct}%)
          </h1>
          <p className="mt-2 text-ink-soft">
            {pct >= 80
              ? "Xuất sắc! Bạn đã sẵn sàng thi HSK thật rồi."
              : pct >= 50
                ? "Khá lắm! Ôn lại mấy câu sai bên dưới rồi làm lại nhé."
                : "Chưa sao đâu — ôn lại bài học rồi thi lại, sẽ khá hơn ngay."}
          </p>
          <button
            onClick={restart}
            className="mt-6 rounded-full bg-vermilion px-6 py-3 font-bold text-cream shadow hover:bg-vermilion-dark"
          >
            🔄 Làm bài mới
          </button>
        </div>

        <h2 className="mt-8 text-xl font-black text-ink">Xem lại các câu</h2>
        <div className="mt-3 space-y-3">
          {answers.map((a, i) => {
            const correct = a.chosen === a.q.answer;
            return (
              <div
                key={i}
                className={`rounded-2xl border-2 p-4 ${
                  correct
                    ? "border-leaf/50 bg-leaf-soft/20"
                    : "border-red-300 bg-red-50"
                }`}
              >
                <p className="text-sm font-bold text-ink-soft">
                  Câu {i + 1}:{" "}
                  {a.q.kind === "zh-to-vi"
                    ? `“${a.q.prompt}” nghĩa là gì?`
                    : `“${a.q.prompt}” viết bằng chữ Hán nào?`}
                </p>
                <p className="mt-1 text-lg font-black text-ink">
                  Đáp án đúng: {a.q.answer}
                </p>
                {!correct && (
                  <p className="text-sm font-semibold text-red-600">
                    Bạn chọn: {a.chosen}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Tới đây: questions đã có và chưa làm xong bài => q chắc chắn tồn tại
  if (!q) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">📝 Thi thử HSK</h1>
      <p className="mt-2 text-ink-soft">
        10 câu trắc nghiệm lấy từ 200 từ vựng trong 20 bài học — chọn nghĩa
        đúng hoặc chọn chữ Hán đúng.
      </p>

      {/* Tiến độ */}
      <div className="mt-6">
        <div className="flex justify-between text-sm font-bold">
          <span>
            Câu {idx + 1}/{questions.length}
          </span>
          <span>Đúng: {score}</span>
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
        <p className="text-sm font-bold text-ink-soft">
          {q.kind === "zh-to-vi"
            ? "Từ này nghĩa là gì?"
            : "Nghĩa này viết bằng chữ Hán nào?"}
        </p>
        <p className="mt-2 text-center text-4xl font-black text-ink">
          {q.prompt}
        </p>
        {q.promptSub && (
          <p className="mt-1 text-center text-base font-semibold text-leaf">
            {q.promptSub}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {q.options.map((opt) => {
            const isAnswer = opt === q.answer;
            const isPicked = opt === picked;
            let cls =
              "border-gold/50 bg-white hover:border-vermilion hover:bg-gold-soft/30";
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
            <p
              className={`text-sm font-bold ${
                picked === q.answer ? "text-leaf" : "text-red-600"
              }`}
            >
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
