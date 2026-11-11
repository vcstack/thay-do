import Link from "next/link";
import { lessons } from "@/data/lessons";

export default function BaiHocPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">📖 Bài học</h1>
      <p className="mt-2 text-ink-soft">
        20 bài học giao tiếp — mỗi bài có từ vựng, câu mẫu và hội thoại, đều
        có pinyin và nghĩa tiếng Việt, bấm loa để nghe phát âm.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => (
          <Link
            key={l.id}
            href={`/bai-hoc/${l.id}`}
            className="group rounded-2xl border-2 border-gold/40 bg-cream p-5 shadow transition hover:-translate-y-1 hover:border-vermilion hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vermilion text-base font-black text-cream">
                {l.id}
              </span>
              <span className="text-2xl font-black text-ink group-hover:text-vermilion">
                {l.title}
              </span>
            </div>
            <p className="mt-3 text-lg font-bold text-ink">{l.titleVi}</p>
            <p className="mt-2 text-sm text-ink-soft">
              {l.vocab.length} từ vựng · {l.sentences.length} câu mẫu ·{" "}
              {l.dialogue.length} câu hội thoại
            </p>
            <p className="mt-3 text-sm font-bold text-leaf group-hover:underline">
              Vào học →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
