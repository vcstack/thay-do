"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { lessons } from "@/data/lessons";
import { getStory, stories } from "@/data/stories";
import {
  clearProgress,
  getAccount,
  getProgress,
  getSyncStatus,
  onAccountChange,
  type Account,
  type Progress,
} from "@/lib/progress";

const MODE_LABELS: Record<string, string> = {
  short: "Đề ngắn đầu giờ",
  check: "Đề kiểm tra 10 câu",
};

function modeLabel(mode: string): string {
  if (mode.startsWith("mock-")) return `Đề thi thử HSK (${mode.slice(5)})`;
  return MODE_LABELS[mode] ?? mode;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function SoHocTroPage() {
  const [account, setAccount] = useState<Account>({ id: "guest", name: "Khách" });
  const [progress, setProgress] = useState<Progress | null>(null);

  function refresh() {
    setAccount(getAccount());
    setProgress(getProgress());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    return onAccountChange(refresh);
  }, []);

  function handleClear() {
    if (
      !window.confirm(
        "Xóa hết tiến trình của tài khoản này trên máy này? Sổ sẽ trắng lại từ đầu."
      )
    ) {
      return;
    }
    clearProgress();
    refresh();
  }

  const lessonsDone = progress?.lessonsDone ?? [];
  const exams = progress?.exams ?? [];
  const chars = progress?.charsPracticed ?? [];
  const storiesRead = progress?.storiesRead ?? [];

  // Điểm cao nhất từng chế độ thi.
  const bestByMode = new Map<string, { score: number; total: number }>();
  for (const e of exams) {
    const prev = bestByMode.get(e.mode);
    if (!prev || e.score / Math.max(e.total, 1) > prev.score / Math.max(prev.total, 1)) {
      bestByMode.set(e.mode, { score: e.score, total: e.total });
    }
  }
  const recentExams = [...exams].slice(-5).reverse();

  const isEmpty =
    progress !== null &&
    lessonsDone.length === 0 &&
    exams.length === 0 &&
    chars.length === 0 &&
    storiesRead.length === 0 &&
    (progress.totalDays ?? 0) === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/" className="text-sm font-bold text-leaf hover:underline">
        ← Về trang chủ
      </Link>

      <h1 className="mt-4 text-3xl font-black text-vermilion">📒 Sổ học trò</h1>
      <p className="mt-2 text-ink-soft">
        Sổ học trò lưu trên máy này. Đăng nhập (bằng tên) để giữ riêng tiến
        trình của mình.
      </p>
      {getSyncStatus() === "cloud" ? (
        <p className="mt-2 text-sm font-bold text-leaf">
          ✅ Đã đồng bộ lên tài khoản thật — đổi máy, đổi điện thoại vẫn giữ sổ.
        </p>
      ) : getSyncStatus() === "local" ? (
        <p className="mt-2 text-sm text-ink-soft">
          Sổ đang chỉ lưu trên máy này — đăng nhập tài khoản thật (Google hoặc
          email) để đồng bộ lên máy chủ.
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
        <p className="text-sm font-bold text-ink-soft">Học trò</p>
        <p className="mt-1 text-2xl font-black text-ink">
          🧑‍🎓 {account.name}
          {account.id === "guest" && (
            <span className="ml-2 rounded-full bg-gold-soft/50 px-2 py-0.5 align-middle text-xs font-bold text-ink">
              tài khoản khách
            </span>
          )}
        </p>
        {account.id === "guest" && (
          <p className="mt-2 text-sm text-ink-soft">
            Bạn chưa đăng nhập bằng tên — bấm nút “Đăng nhập” ở góc trên để đặt
            tên và giữ riêng sổ của mình.
          </p>
        )}
      </div>

      {progress === null ? (
        <p className="mt-6 text-center text-ink-soft">Đang mở sổ…</p>
      ) : isEmpty ? (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-gold/60 bg-cream p-8 text-center shadow">
          <p className="text-5xl">🌱</p>
          <p className="mt-3 text-lg font-black text-ink">
            Chưa có gì đâu — học bài đầu tiên đi!
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Mở một bài học, làm một đề thi, tô một chữ hay đọc một truyện — thầy
            sẽ ghi hết vào sổ này.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/bai-hoc/1"
              className="rounded-full bg-vermilion px-6 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
            >
              Học bài 1 →
            </Link>
            <Link
              href="/thi-hsk"
              className="rounded-full border-2 border-gold bg-cream px-6 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
            >
              Thi thử HSK
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Chuỗi ngày + bài đã mở */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-gold/40 bg-cream p-5 text-center shadow">
              <p className="text-4xl">🔥</p>
              <p className="mt-2 text-3xl font-black text-vermilion">
                {progress.streak} ngày
              </p>
              <p className="text-sm font-bold text-ink-soft">chuỗi ngày học liên tiếp</p>
              <p className="mt-1 text-xs text-ink-soft">
                Tổng cộng đã học {progress.totalDays} ngày
                {progress.lastStudyDate ? ` · lần cuối ${fmtDate(progress.lastStudyDate)}` : ""}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-gold/40 bg-cream p-5 text-center shadow">
              <p className="text-4xl">📖</p>
              <p className="mt-2 text-3xl font-black text-vermilion">
                {lessonsDone.length}/{lessons.length}
              </p>
              <p className="text-sm font-bold text-ink-soft">bài học đã mở</p>
              <p className="mt-1 text-xs text-ink-soft">
                {lessonsDone.length > 0
                  ? `Đã mở bài ${lessonsDone.join(", ")}`
                  : "Chưa mở bài nào"}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-gold/40 bg-cream p-5 text-center shadow">
              <p className="text-4xl">✍️📚</p>
              <p className="mt-2 text-3xl font-black text-vermilion">
                {chars.length} chữ · {storiesRead.length} truyện
              </p>
              <p className="text-sm font-bold text-ink-soft">đã luyện viết · đã đọc</p>
              <p className="mt-1 text-xs text-ink-soft">
                {storiesRead.length > 0
                  ? `Truyện đã đọc: ${storiesRead
                      .map((id) => getStory(id)?.title ?? id)
                      .join(", ")}`
                  : "Chưa đọc truyện nào"}
              </p>
            </div>
          </div>

          {/* Chữ đã luyện */}
          {chars.length > 0 && (
            <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-5 shadow">
              <h2 className="text-base font-extrabold text-ink">
                Chữ đã luyện viết ({chars.length})
              </h2>
              <p className="mt-3 flex flex-wrap gap-2">
                {chars.map((c) => (
                  <span
                    key={c}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gold/50 bg-white text-xl font-black text-ink"
                  >
                    {c}
                  </span>
                ))}
              </p>
            </div>
          )}

          {/* Điểm thi */}
          <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-5 shadow">
            <h2 className="text-base font-extrabold text-ink">🏆 Điểm thi</h2>
            {exams.length === 0 ? (
              <p className="mt-2 text-sm text-ink-soft">
                Chưa thi lần nào — vào Trường thi làm một đề rồi quay lại đây
                xem điểm nhé.
              </p>
            ) : (
              <>
                <ul className="mt-3 space-y-2">
                  {[...bestByMode.entries()].map(([mode, best]) => (
                    <li
                      key={mode}
                      className="flex items-baseline justify-between gap-2 text-sm"
                    >
                      <span className="font-bold text-ink">{modeLabel(mode)}</span>
                      <span className="font-black text-vermilion">
                        Cao nhất: {best.score}/{best.total}
                      </span>
                    </li>
                  ))}
                </ul>
                <h3 className="mt-5 text-sm font-extrabold text-ink">
                  Lịch sử thi gần nhất
                </h3>
                <ul className="mt-2 space-y-2">
                  {recentExams.map((e, i) => (
                    <li
                      key={`${e.date}-${i}`}
                      className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-[#fffdf4] px-3 py-2 text-sm"
                    >
                      <span className="font-bold text-ink">{modeLabel(e.mode)}</span>
                      <span className="font-semibold text-ink-soft">
                        {e.score}/{e.total} · {fmtDate(e.date)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Truyện đã đọc (khi có nhiều) */}
          {storiesRead.length > 0 && (
            <p className="mt-4 text-center text-xs text-ink-soft">
              Đã đọc {storiesRead.length}/{stories.length} truyện trong thư viện.
            </p>
          )}
        </>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={handleClear}
          className="rounded-full border-2 border-red-300 bg-cream px-6 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
        >
          🗑️ Xóa tiến trình
        </button>
        <Link
          href="/"
          className="rounded-full bg-vermilion px-6 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
        >
          ← Quay về trang chủ
        </Link>
      </div>
      <p className="mt-4 text-center text-xs text-ink-soft">
        Sổ học trò chỉ lưu trên máy này — đổi máy khác thì sổ sẽ trống. Đăng
        nhập bằng tên chỉ để giữ riêng sổ của mình trên máy này.
      </p>
    </div>
  );
}
