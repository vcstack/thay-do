import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson, lessons } from "@/data/lessons";
import SpeakButton from "@/components/SpeakButton";

export function generateStaticParams() {
  return lessons.map((l) => ({ id: String(l.id) }));
}

// Trang chi tiết bài học đọc params (id) nên cho phép navigation chặn
// thay vì instant shell — tránh lỗi "params accessed outside of Suspense".
export const instant = false;

export default async function LessonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLesson(Number(id));
  if (!lesson) notFound();

  const prev = getLesson(lesson.id - 1);
  const next = getLesson(lesson.id + 1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/bai-hoc" className="text-sm font-bold text-leaf hover:underline">
        ← Tất cả bài học
      </Link>

      <div className="mt-4 rounded-2xl border-2 border-vermilion/30 bg-cream p-6 shadow">
        <p className="text-sm font-bold uppercase tracking-widest text-gold">
          Bài {lesson.id}
        </p>
        <h1 className="mt-1 text-4xl font-black text-vermilion">
          {lesson.title}
        </h1>
        <p className="mt-1 text-xl font-bold text-ink">{lesson.titleVi}</p>
        <div className="mt-3">
          <SpeakButton text={lesson.title} label="🔊 Nghe tên bài" />
        </div>
      </div>

      {/* Từ vựng */}
      <section className="mt-8">
        <h2 className="text-xl font-black text-ink">
          Từ vựng ({lesson.vocab.length} từ)
        </h2>
        <div className="mt-3 overflow-hidden rounded-2xl border-2 border-gold/40 bg-cream shadow">
          {lesson.vocab.map((v, i) => (
            <div
              key={`${v.zh}-${i}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-gold/20 px-4 py-3 last:border-b-0"
            >
              <span className="w-28 text-2xl font-black text-ink">{v.zh}</span>
              <span className="w-32 text-sm font-semibold text-leaf">{v.py}</span>
              <span className="flex-1 text-sm text-ink-soft">{v.vi}</span>
              <SpeakButton text={v.zh} />
            </div>
          ))}
        </div>
      </section>

      {/* Câu mẫu */}
      <section className="mt-8">
        <h2 className="text-xl font-black text-ink">
          Câu mẫu ({lesson.sentences.length} câu)
        </h2>
        <div className="mt-3 space-y-3">
          {lesson.sentences.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-gold/40 bg-cream p-4 shadow"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xl font-black text-ink">{s.zh}</span>
                <SpeakButton text={s.zh} />
              </div>
              <p className="mt-1 text-sm font-semibold text-leaf">{s.py}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{s.vi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hội thoại */}
      <section className="mt-8">
        <h2 className="text-xl font-black text-ink">
          Hội thoại ({lesson.dialogue.length} câu)
        </h2>
        <div className="mt-3 space-y-2">
          {lesson.dialogue.map((d, i) => (
            <div
              key={i}
              className={`flex gap-3 rounded-2xl border-2 p-4 shadow-sm ${
                d.sp === "A"
                  ? "border-vermilion/30 bg-cream"
                  : "border-leaf/30 bg-leaf-soft/20"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-cream ${
                  d.sp === "A" ? "bg-vermilion" : "bg-leaf"
                }`}
              >
                {d.sp}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-lg font-black text-ink">{d.zh}</span>
                  <SpeakButton text={d.zh} />
                </div>
                <p className="text-sm font-semibold text-leaf">{d.py}</p>
                <p className="text-sm text-ink-soft">{d.vi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Điều hướng bài trước/sau */}
      <div className="mt-10 flex justify-between gap-4">
        {prev ? (
          <Link
            href={`/bai-hoc/${prev.id}`}
            className="rounded-full border-2 border-gold bg-cream px-5 py-2 text-sm font-bold text-vermilion shadow hover:bg-gold-soft/40"
          >
            ← Bài {prev.id}: {prev.titleVi}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/bai-hoc/${next.id}`}
            className="rounded-full bg-vermilion px-5 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
          >
            Bài {next.id}: {next.titleVi} →
          </Link>
        ) : (
          <Link
            href="/luyen-viet"
            className="rounded-full bg-leaf px-5 py-2 text-sm font-bold text-cream shadow hover:bg-leaf/90"
          >
            Hết 20 bài — sang luyện viết ✍️
          </Link>
        )}
      </div>
    </div>
  );
}
