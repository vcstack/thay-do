"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { stories, getStory, STORY_LEVELS, type Story, type StoryLevel } from "@/data/stories";
import { PATTERN_TOPICS } from "@/data/patterns";
import { allVocab, allSentences, shuffle, type Vocab } from "@/data/lessons";
import { speakZh } from "@/lib/speak";

/** Tách câu thành các từ theo từ điển từ vựng (khớp dài nhất). */
function segment(zh: string, dict: Vocab[]): { text: string; vocab?: Vocab }[] {
  const words = [...dict].sort((a, b) => b.zh.length - a.zh.length);
  const out: { text: string; vocab?: Vocab }[] = [];
  let i = 0;
  while (i < zh.length) {
    const ch = zh[i];
    if (/[，。！？、；：""''\s]/.test(ch)) {
      out.push({ text: ch });
      i++;
      continue;
    }
    const hit = words.find((w) => zh.startsWith(w.zh, i));
    if (hit) {
      out.push({ text: hit.zh, vocab: hit });
      i += hit.zh.length;
    } else {
      out.push({ text: ch });
      i++;
    }
  }
  return out;
}

type Shelf = "stories" | "listen" | "patterns";
type LevelFilter = "ALL" | StoryLevel;
type ListenMode = "dialogue" | "tone";

interface ListenQ {
  audio: string;
  prompt: string;
  options: string[];
  answer: string;
}

function buildListenQs(mode: ListenMode): ListenQ[] {
  if (mode === "dialogue") {
    return shuffle(allSentences)
      .slice(0, 5)
      .map((s) => {
        const others = shuffle(allSentences.filter((x) => x.zh !== s.zh)).slice(0, 3);
        return {
          audio: s.zh,
          prompt: "Nghe câu hội thoại rồi chọn nghĩa đúng",
          options: shuffle([s.vi, ...others.map((o) => o.vi)]),
          answer: s.vi,
        };
      });
  }
  return shuffle(allVocab)
    .slice(0, 5)
    .map((v) => {
      const others = shuffle(allVocab.filter((x) => x.zh !== v.zh)).slice(0, 3);
      return {
        audio: v.zh,
        prompt: "Nghe từ rồi chọn đúng pinyin (kể cả thanh điệu)",
        options: shuffle([v.py, ...others.map((o) => o.py)]),
        answer: v.py,
      };
    });
}

export default function DocTruyenPage() {
  const [shelf, setShelf] = useState<Shelf>("stories");

  // --- Kệ truyện ---
  const [filter, setFilter] = useState<LevelFilter>("ALL");
  const [openId, setOpenId] = useState<string | null>(null);
  const [showPy, setShowPy] = useState(true);
  const [word, setWord] = useState<Vocab | null>(null);

  // --- Góc nghe ---
  const [listenMode, setListenMode] = useState<ListenMode>("dialogue");
  const [listenQs, setListenQs] = useState<ListenQ[] | null>(null);
  const [lqIdx, setLqIdx] = useState(0);
  const [lqPicked, setLqPicked] = useState<string | null>(null);
  const [lqScore, setLqScore] = useState(0);
  const [heard, setHeard] = useState(false);

  // --- Kệ mẫu câu ---
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const list = useMemo(
    () => (filter === "ALL" ? stories : stories.filter((s) => s.level === filter)),
    [filter]
  );
  const open: Story | undefined = openId ? getStory(openId) : undefined;
  const idx = open ? stories.findIndex((s) => s.id === open.id) : -1;

  const segmented = useMemo(() => {
    if (!open) return [];
    return open.sentences.map((s) => ({ s, tokens: segment(s.zh, allVocab) }));
  }, [open]);

  function startListen(mode: ListenMode) {
    setListenMode(mode);
    setListenQs(buildListenQs(mode));
    setLqIdx(0);
    setLqPicked(null);
    setLqScore(0);
    setHeard(false);
  }

  const lqDone = listenQs !== null && lqIdx >= listenQs.length;
  const lq = listenQs?.[lqIdx];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">📚 Thư viện</h1>
      <p className="mt-2 text-ink-soft">
        Kệ truyện đọc theo cấp HSK, Góc nghe (hội thoại, thanh điệu, nghe chép),
        Kệ Mẫu câu giao tiếp.
      </p>

      {/* 3 kệ */}
      <div className="mt-6 inline-flex flex-wrap rounded-full border-2 border-gold/50 bg-cream p-1 shadow">
        {(
          [
            ["stories", "📖 Kệ truyện"],
            ["listen", "🎧 Góc nghe"],
            ["patterns", "💬 Kệ mẫu câu"],
          ] as [Shelf, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setShelf(id)}
            className={`rounded-full px-5 py-2 text-sm font-bold ${
              shelf === id ? "bg-vermilion text-cream" : "text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ================= KỆ TRUYỆN ================= */}
      {shelf === "stories" && (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => { setFilter("ALL"); setOpenId(null); }}
              className={`rounded-full px-4 py-2 text-sm font-bold ${filter === "ALL" ? "bg-vermilion text-cream shadow" : "border-2 border-gold/50 bg-cream text-ink"}`}
            >
              Tất cả ({stories.length})
            </button>
            {STORY_LEVELS.map((l) => (
              <button
                key={l.level}
                onClick={() => { setFilter(l.level); setOpenId(null); }}
                className={`rounded-full px-4 py-2 text-sm font-bold ${filter === l.level ? "bg-vermilion text-cream shadow" : "border-2 border-gold/50 bg-cream text-ink"}`}
                title={l.desc}
              >
                {l.label} ({stories.filter((s) => s.level === l.level).length})
              </button>
            ))}
          </div>

          {!open && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {list.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setOpenId(s.id); setWord(null); }}
                  className="rounded-2xl border-2 border-gold/40 bg-cream p-5 text-left shadow transition hover:-translate-y-1 hover:border-vermilion"
                >
                  <span className="rounded-full bg-leaf px-2 py-0.5 text-xs font-bold text-cream">{s.level}</span>
                  <p className="mt-2 text-xl font-black text-ink">{s.title}</p>
                  <p className="mt-1 text-sm text-ink-soft">{s.titleVi}</p>
                  <p className="mt-2 text-xs font-bold text-gold">📖 {s.sentences.length} câu</p>
                </button>
              ))}
            </div>
          )}

          {open && (
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => { setOpenId(null); setWord(null); }}
                  className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                >
                  ← Về thư viện
                </button>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-ink">
                  <input type="checkbox" checked={showPy} onChange={(e) => setShowPy(e.target.checked)} className="h-4 w-4 accent-red-700" />
                  Hiện pinyin
                </label>
              </div>

              <div className="mt-4 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
                <span className="rounded-full bg-leaf px-2 py-0.5 text-xs font-bold text-cream">{open.level}</span>
                <h2 className="mt-2 text-2xl font-black text-ink">{open.title}</h2>
                <p className="text-sm text-ink-soft">{open.titleVi}</p>

                <div className="mt-5 space-y-5">
                  {segmented.map(({ s, tokens }, i) => (
                    <div key={i} className="rounded-xl bg-[#fffdf4] p-4">
                      <p className="text-xl leading-loose">
                        {tokens.map((t, j) => (
                          <span
                            key={j}
                            onClick={() => t.vocab && setWord(t.vocab)}
                            className={
                              t.vocab
                                ? "cursor-pointer rounded px-0.5 transition hover:bg-gold-soft/60 hover:text-vermilion"
                                : ""
                            }
                            title={t.vocab ? "Bấm để xem nghĩa" : undefined}
                          >
                            {t.text}
                          </span>
                        ))}
                        <button
                          onClick={() => speakZh(s.zh)}
                          className="ml-2 rounded-full border border-gold/60 bg-cream px-2 py-0.5 align-middle text-sm hover:bg-gold-soft/40"
                          title="Nghe câu này"
                        >
                          🔊
                        </button>
                      </p>
                      {showPy && <p className="mt-1 text-sm text-gold">{s.py}</p>}
                      <p className="mt-1 text-sm text-ink-soft">{s.vi}</p>
                    </div>
                  ))}
                </div>

                {word && (
                  <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-3 rounded-xl border-2 border-vermilion/50 bg-vermilion/5 p-4 shadow">
                    <div>
                      <p className="text-2xl font-black text-vermilion">{word.zh}</p>
                      <p className="text-sm font-bold text-ink">{word.py} — {word.vi}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => speakZh(word.zh)}
                        className="rounded-full bg-vermilion px-3 py-1.5 text-sm font-bold text-cream"
                      >
                        🔊 Nghe
                      </button>
                      <button
                        onClick={() => setWord(null)}
                        className="rounded-full border-2 border-gold bg-cream px-3 py-1.5 text-sm font-bold text-vermilion"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between gap-3">
                  <button
                    onClick={() => { const p = stories[idx - 1]; if (p) { setOpenId(p.id); setWord(null); window.scrollTo({ top: 0 }); } }}
                    disabled={idx <= 0}
                    className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion disabled:opacity-40"
                  >
                    ← Truyện trước
                  </button>
                  <button
                    onClick={() => { const n = stories[idx + 1]; if (n) { setOpenId(n.id); setWord(null); window.scrollTo({ top: 0 }); } }}
                    disabled={idx < 0 || idx >= stories.length - 1}
                    className="rounded-full bg-vermilion px-4 py-2 text-sm font-bold text-cream disabled:opacity-40"
                  >
                    Truyện sau →
                  </button>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-ink-soft">
                Mẹo: bấm vào bất kỳ từ nào trong truyện để xem pinyin và nghĩa.
              </p>
            </div>
          )}
        </>
      )}

      {/* ================= GÓC NGHE ================= */}
      {shelf === "listen" && (
        <div className="mt-6">
          {listenQs === null && (
            <div className="grid gap-4 md:grid-cols-2">
              <button
                onClick={() => startListen("dialogue")}
                className="rounded-2xl border-2 border-gold/40 bg-cream p-6 text-left shadow transition hover:-translate-y-1 hover:border-vermilion"
              >
                <p className="text-4xl">💬</p>
                <h2 className="mt-2 text-lg font-extrabold text-vermilion">Nghe hội thoại</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Nghe một câu hội thoại rồi chọn nghĩa đúng. 5 câu mỗi lượt —
                  nghe không kịp thì bấm loa nghe lại.
                </p>
              </button>
              <button
                onClick={() => startListen("tone")}
                className="rounded-2xl border-2 border-gold/40 bg-cream p-6 text-left shadow transition hover:-translate-y-1 hover:border-vermilion"
              >
                <p className="text-4xl">🎵</p>
                <h2 className="mt-2 text-lg font-extrabold text-vermilion">Nghe thanh điệu</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Nghe một từ rồi chọn đúng pinyin kể cả thanh điệu (mā, má, mǎ,
                  mà khác nhau hoàn toàn đấy).
                </p>
              </button>
            </div>
          )}

          {listenQs !== null && !lqDone && lq && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setListenQs(null)}
                  className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                >
                  ← Đổi bài nghe
                </button>
                <p className="text-sm font-bold text-ink-soft">
                  Câu {lqIdx + 1}/{listenQs.length} · Đúng: {lqScore}
                </p>
              </div>
              <div className="mt-4 rounded-2xl border-2 border-gold/40 bg-cream p-6 text-center shadow">
                <p className="text-sm font-bold text-ink-soft">{lq.prompt}</p>
                <button
                  onClick={() => {
                    speakZh(lq.audio);
                    setHeard(true);
                  }}
                  className="mt-4 rounded-full bg-vermilion px-8 py-4 text-2xl font-black text-cream shadow hover:bg-vermilion-dark"
                >
                  🔊 Nghe
                </button>
                <p className="mt-2 text-xs font-semibold text-ink-soft">
                  {heard ? "Đã nghe — chọn đáp án bên dưới." : "Bấm loa để nghe."}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {lq.options.map((opt) => {
                    const isAnswer = opt === lq.answer;
                    const isPicked = opt === lqPicked;
                    let cls = "border-gold/50 bg-white hover:border-vermilion";
                    if (lqPicked !== null) {
                      if (isAnswer) cls = "border-leaf bg-leaf-soft/40 text-leaf";
                      else if (isPicked) cls = "border-red-400 bg-red-100 text-red-700";
                      else cls = "border-gold/30 bg-white opacity-50";
                    }
                    return (
                      <button
                        key={opt}
                        disabled={lqPicked !== null}
                        onClick={() => {
                          setLqPicked(opt);
                          if (opt === lq.answer) setLqScore((s) => s + 1);
                        }}
                        className={`rounded-xl border-2 px-4 py-3 text-base font-bold transition ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {lqPicked !== null && (
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className={`text-sm font-bold ${lqPicked === lq.answer ? "text-leaf" : "text-red-600"}`}>
                      {lqPicked === lq.answer
                        ? "✅ Đúng rồi!"
                        : `❌ Sai rồi — đáp án đúng là “${lq.answer}” (nghe “${lq.audio}”).`}
                    </p>
                    <button
                      onClick={() => {
                        setLqPicked(null);
                        setHeard(false);
                        setLqIdx((i) => i + 1);
                      }}
                      className="rounded-full bg-vermilion px-5 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
                    >
                      {lqIdx + 1 === listenQs.length ? "Xem kết quả →" : "Câu tiếp →"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {listenQs !== null && lqDone && (
            <div className="rounded-2xl border-2 border-gold/40 bg-cream p-8 text-center shadow">
              <p className="text-5xl">{lqScore >= 4 ? "🏆" : lqScore >= 3 ? "👍" : "💪"}</p>
              <h2 className="mt-3 text-2xl font-black text-vermilion">
                {lqScore}/{listenQs.length} câu đúng
              </h2>
              <p className="mt-2 text-ink-soft">
                {lqScore >= 4
                  ? "Tai nghe tốt lắm! Thanh điệu và hội thoại đều rõ."
                  : "Nghe chưa rõ thì nghe lại nhiều lần, tai sẽ quen dần."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => startListen(listenMode)}
                  className="rounded-full bg-vermilion px-6 py-3 font-bold text-cream shadow hover:bg-vermilion-dark"
                >
                  🔄 Nghe bài mới
                </button>
                <button
                  onClick={() => setListenQs(null)}
                  className="rounded-full border-2 border-gold bg-cream px-6 py-3 font-bold text-vermilion hover:bg-gold-soft/40"
                >
                  ← Đổi bài nghe
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= KỆ MẪU CÂU ================= */}
      {shelf === "patterns" && (
        <div className="mt-6 space-y-3">
          {PATTERN_TOPICS.map((t) => {
            const isOpen = openTopic === t.id;
            return (
              <div key={t.id} className="overflow-hidden rounded-2xl border-2 border-gold/40 bg-cream shadow">
                <button
                  onClick={() => setOpenTopic(isOpen ? null : t.id)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="text-base font-extrabold text-vermilion">
                    {t.icon} {t.title}
                    <span className="ml-2 text-xs font-bold text-ink-soft">
                      {t.sentences.length} mẫu câu
                    </span>
                  </span>
                  <span className="text-xl text-ink-soft">{isOpen ? "▾" : "▸"}</span>
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t-2 border-gold/30 p-5">
                    {t.sentences.map((s, i) => (
                      <div key={i} className="rounded-xl bg-[#fffdf4] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-lg font-black text-ink">{s.zh}</p>
                            <p className="text-sm font-semibold text-leaf">{s.py}</p>
                            <p className="text-sm text-ink-soft">{s.vi}</p>
                          </div>
                          <button
                            onClick={() => speakZh(s.zh)}
                            className="shrink-0 rounded-full border-2 border-gold bg-cream px-3 py-1.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                            title="Nghe mẫu câu"
                          >
                            🔊
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <p className="pt-2 text-center text-xs text-ink-soft">
            Mẫu câu giao tiếp cơ bản — học thuộc rồi ra Phố Hoa nói thử nhé.{" "}
            <Link href="/pho-hoa" className="font-bold text-vermilion hover:underline">
              Ra Phố Hoa →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
