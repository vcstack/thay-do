"use client";

import { useRef, useState } from "react";
import { SPEAK_SPOTS, type SpeakSpot } from "@/data/speaking";
import { speakZh } from "@/lib/speak";

/** Phố Hoa — luyện nói theo kịch bản ở các điểm trong phố. */
export default function PhoHoaPage() {
  const [spot, setSpot] = useState<SpeakSpot | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [recMsg, setRecMsg] = useState("");
  const [recording, setRecording] = useState(false);
  const recogRef = useRef<unknown>(null);

  const step = spot?.steps[stepIdx];

  function openSpot(s: SpeakSpot) {
    setSpot(s);
    setStepIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setRecMsg("");
  }

  function choose(i: number) {
    if (picked !== null || !step) return;
    setPicked(i);
    if (step.options[i].correct) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    if (!spot) return;
    setPicked(null);
    setRecMsg("");
    if (stepIdx + 1 >= spot.steps.length) {
      setDone(true);
    } else {
      setStepIdx((i) => i + 1);
    }
  }

  /** Ghi âm: thử nhận dạng giọng nói bằng Web Speech API (nếu trình duyệt có). */
  function tryRecord() {
    if (!step) return;
    const SR =
      (window as unknown as {
        webkitSpeechRecognition?: new () => {
          lang: string;
          interimResults: boolean;
          maxAlternatives: number;
          onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
          onerror: (() => void) | null;
          onend: (() => void) | null;
          start: () => void;
          stop: () => void;
        };
        SpeechRecognition?: unknown;
      }).webkitSpeechRecognition;
    if (!SR) {
      setRecMsg("Trình duyệt này không hỗ trợ ghi âm — bạn cứ đọc to câu trả lời nhé, thầy nghe bằng tai cũng được.");
      return;
    }
    try {
      const recog = new SR();
      recogRef.current = recog;
      recog.lang = "zh-CN";
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      setRecording(true);
      setRecMsg("🎤 Đang nghe… đọc to câu trả lời của bạn đi.");
      recog.onresult = (e) => {
        const heard = e.results[0][0].transcript;
        const norm = (s: string) => s.replace(/[\s，。！？,.!?]/g, "");
        const correct = step.options.find((o) => o.correct);
        const ok = correct ? norm(heard) === norm(correct.zh) : false;
        setRecMsg(
          ok
            ? `🎉 Thầy nghe được: “${heard}” — đúng rồi, phát âm chuẩn lắm!`
            : `Thầy nghe được: “${heard}” — chưa giống câu đúng lắm. Câu đúng là “${correct?.zh}”, đọc lại thử nhé.`
        );
      };
      recog.onerror = () => {
        setRecMsg("Không nghe rõ — thử lại hoặc bấm chọn câu trả lời bên dưới nhé.");
      };
      recog.onend = () => setRecording(false);
      recog.start();
    } catch {
      setRecMsg("Không bật được ghi âm — bạn cứ đọc to câu trả lời nhé.");
      setRecording(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">🏮 Phố Hoa — Luyện nói</h1>
      <p className="mt-2 text-ink-soft">
        Ra phố nói chuyện bằng tiếng Trung: trà quán, sạp hoa quả, quán mì…
        Mỗi điểm có một đoạn hội thoại ngắn — bạn chọn câu trả lời để đối đáp
        theo kịch bản.
      </p>

      {!spot && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPEAK_SPOTS.map((s) => (
            <button
              key={s.id}
              onClick={() => openSpot(s)}
              className="rounded-2xl border-2 border-gold/40 bg-cream p-5 text-left shadow transition hover:-translate-y-1 hover:border-vermilion"
            >
              <p className="text-4xl">{s.icon}</p>
              <h2 className="mt-2 text-lg font-extrabold text-vermilion">{s.name}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
              <p className="mt-2 text-xs font-bold text-gold">
                💬 {s.steps.length} lượt đối đáp
              </p>
            </button>
          ))}
        </div>
      )}

      {spot && !done && step && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setSpot(null)}
              className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
            >
              ← Về phố Hoa
            </button>
            <p className="text-sm font-bold text-ink-soft">
              {spot.icon} {spot.name} — lượt {stepIdx + 1}/{spot.steps.length} · Đúng: {score}
            </p>
          </div>

          {/* Câu của người đối diện */}
          <div className="mt-4 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
            <p className="text-sm font-bold text-ink-soft">{step.speaker} nói:</p>
            <p className="mt-2 text-2xl font-black leading-relaxed text-ink">{step.zh}</p>
            <p className="mt-1 text-sm font-semibold text-leaf">{step.py}</p>
            <p className="mt-1 text-sm text-ink-soft">{step.vi}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => speakZh(step.zh)}
                className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
              >
                🔊 Nghe mẫu
              </button>
              <button
                onClick={tryRecord}
                disabled={recording}
                className="rounded-full bg-leaf px-4 py-2 text-sm font-bold text-cream shadow hover:bg-leaf/90 disabled:opacity-50"
              >
                {recording ? "🎤 Đang nghe…" : "🎤 Đọc to câu trả lời"}
              </button>
            </div>
            {recMsg && (
              <p className="mt-3 rounded-xl bg-gold-soft/30 p-3 text-sm leading-relaxed text-ink">
                {recMsg}
              </p>
            )}
          </div>

          {/* Chọn câu trả lời */}
          <p className="mt-5 text-base font-extrabold text-ink">Bạn trả lời thế nào?</p>
          <div className="mt-3 space-y-3">
            {step.options.map((o, i) => {
              const isPicked = picked === i;
              let cls = "border-gold/50 bg-cream hover:border-vermilion";
              if (picked !== null) {
                if (o.correct) cls = "border-leaf bg-leaf-soft/30";
                else if (isPicked) cls = "border-red-400 bg-red-100";
                else cls = "border-gold/30 bg-cream opacity-50";
              }
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={picked !== null}
                  className={`w-full rounded-2xl border-2 p-4 text-left shadow-sm transition ${cls}`}
                >
                  <p className="text-lg font-black text-ink">{o.zh}</p>
                  <p className="text-sm font-semibold text-leaf">{o.py}</p>
                  <p className="text-sm text-ink-soft">{o.vi}</p>
                  {isPicked && (
                    <p className={`mt-2 text-sm font-bold ${o.correct ? "text-leaf" : "text-red-600"}`}>
                      {o.feedback}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-5 text-center">
              <button
                onClick={next}
                className="rounded-full bg-vermilion px-6 py-3 font-bold text-cream shadow hover:bg-vermilion-dark"
              >
                {stepIdx + 1 === spot.steps.length ? "Xem kết quả →" : "Lượt tiếp →"}
              </button>
            </div>
          )}
        </div>
      )}

      {spot && done && (
        <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-8 text-center shadow">
          <p className="text-5xl">{score === spot.steps.length ? "🏆" : score >= 2 ? "👍" : "💪"}</p>
          <h2 className="mt-3 text-2xl font-black text-vermilion">
            {score}/{spot.steps.length} lượt đúng
          </h2>
          <p className="mt-2 text-ink-soft">
            {score === spot.steps.length
              ? "Nói chuyện trôi chảy quá! Chủ quán còn tưởng bạn là người bản xứ."
              : score >= 2
                ? "Khá lắm! Nói lại vài lần nữa là thành thạo ngay."
                : "Chưa sao đâu — nói sai thì sửa, nói lại từ đầu nhé."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openSpot(spot)}
              className="rounded-full bg-vermilion px-6 py-3 font-bold text-cream shadow hover:bg-vermilion-dark"
            >
              🔄 Nói lại từ đầu
            </button>
            <button
              onClick={() => setSpot(null)}
              className="rounded-full border-2 border-gold bg-cream px-6 py-3 font-bold text-vermilion hover:bg-gold-soft/40"
            >
              ← Về phố Hoa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
