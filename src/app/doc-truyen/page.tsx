"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { stories, getStory, STORY_LEVELS, type Story, type StoryLevel } from "@/data/stories";
import { allVocab, type Vocab } from "@/data/lessons";
import { speakZh } from "@/lib/speak";

/** Tách câu thành các từ theo từ điển từ vựng (khớp dài nhất). */
function segment(zh: string, dict: Vocab[]): { text: string; vocab?: Vocab }[] {
  const words = [...dict].sort((a, b) => b.zh.length - a.zh.length);
  const out: { text: string; vocab?: Vocab }[] = [];
  let i = 0;
  while (i < zh.length) {
    const ch = zh[i];
    // Bỏ qua dấu câu, khoảng trắng
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

type LevelFilter = "ALL" | StoryLevel;

export default function DocTruyenPage() {
  const [filter, setFilter] = useState<LevelFilter>("ALL");
  const [openId, setOpenId] = useState<string | null>(null);
  const [showPy, setShowPy] = useState(true);
  const [word, setWord] = useState<Vocab | null>(null);

  const list = useMemo(
    () => (filter === "ALL" ? stories : stories.filter((s) => s.level === filter)),
    [filter]
  );
  const open: Story | undefined = openId ? getStory(openId) : undefined;
  const idx = open ? stories.findIndex((s) => s.id === open.id) : -1;

  // Tách từ cho từng câu của truyện đang mở
  const segmented = useMemo(() => {
    if (!open) return [];
    return open.sentences.map((s) => ({ s, tokens: segment(s.zh, allVocab) }));
  }, [open]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">📚 Đọc truyện theo cấp</h1>
      <p className="mt-2 text-ink-soft">
        Thư viện truyện ngắn chia theo trình độ HSK. Bấm vào một từ trong truyện
        để xem nghĩa, bấm 🔊 để nghe thầy đọc.
      </p>

      {/* Lọc theo cấp */}
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

            {/* Thẻ từ đã bấm */}
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
            Mẹo: bấm vào bất kỳ từ nào trong truyện để xem pinyin và nghĩa. Đọc
            xong một truyện là ôn lại được cả chục từ.
          </p>
          <p className="mt-2 text-center">
            <Link href="/lop-hoc" className="text-sm font-bold text-vermilion hover:underline">
              Nghe thầy giảng trong lớp →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
