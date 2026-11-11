import Link from "next/link";
import SchoolSceneLoader from "@/components/SchoolSceneLoader";
import { lessons, allVocab, allSentences } from "@/data/lessons";

const FEATURES = [
  {
    href: "/bai-hoc",
    icon: "📖",
    title: "Bài học",
    desc: "20 bài học giao tiếp, 200 từ vựng, 100 câu mẫu và hội thoại — có phát âm chuẩn.",
  },
  {
    href: "/luyen-viet",
    icon: "✍️",
    title: "Luyện viết chữ Hán",
    desc: "Tô theo từng nét, thầy chấm đúng/sai từng nét cho bạn.",
  },
  {
    href: "/lop-hoc",
    icon: "🏫",
    title: "Lớp học",
    desc: "Lớp mở 8:00, 14:00, 20:00 mỗi ngày — nghe thầy giảng, xem thầy nhận xét.",
  },
  {
    href: "/doc-truyen",
    icon: "📚",
    title: "Đọc truyện theo cấp",
    desc: "9 truyện ngắn HSK 1–3, bấm vào từ để xem nghĩa, nghe thầy đọc từng câu.",
  },
  {
    href: "/thi-hsk",
    icon: "📝",
    title: "Thi thử HSK",
    desc: "Trắc nghiệm chọn nghĩa, chọn chữ Hán — làm xong biết điểm ngay.",
  },
  {
    href: "/pomodoro",
    icon: "🍅",
    title: "Pomodoro 25/5",
    desc: "Học tập trung 25 phút, nghỉ 5 phút, lặp lại thành thói quen.",
  },
  {
    href: "/lich-hoc",
    icon: "🕗",
    title: "Lịch lớp học",
    desc: "Lớp mở cố định 8:00, 14:00 và 20:00 mỗi ngày — vào đúng giờ nghe thầy giảng.",
  },
];

export default function Home() {
  return (
    <div>
      {/* ---------- Sân trường 3D full màn hình ---------- */}
      <section className="relative h-[calc(100svh-64px)] min-h-[540px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <SchoolSceneLoader />
        </div>

        {/* Lớp phủ tiêu đề */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/35 via-black/10 to-transparent px-4 pb-16 pt-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold-soft drop-shadow">
            Trường học tiếng Trung ảo
          </p>
          <h1 className="mt-2 text-5xl font-black text-white drop-shadow-lg md:text-7xl">
            Thầy Đồ
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base font-medium text-white drop-shadow md:text-lg">
            Sân trường Văn Miếu với Khuê Văn Các, lớp học Điện Thái Hòa, trà
            quán Hội An — vào trường, ngồi chiếu nghe thầy giảng, luyện viết
            chữ Hán, thi thử HSK.
          </p>
        </div>

        {/* Nút hành động + gợi ý */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 bg-gradient-to-t from-black/45 via-black/15 to-transparent px-4 pb-6 pt-16">
          <div className="pointer-events-auto flex flex-wrap justify-center gap-3">
            <Link
              href="/bai-hoc"
              className="rounded-full bg-vermilion px-7 py-3 text-base font-extrabold text-cream shadow-lg transition hover:bg-vermilion-dark"
            >
              🏫 Vào lớp học
            </Link>
            <Link
              href="/luyen-viet"
              className="rounded-full bg-cream px-7 py-3 text-base font-extrabold text-vermilion shadow-lg transition hover:bg-white"
            >
              ✍️ Luyện viết chữ
            </Link>
          </div>
          <p className="text-center text-xs font-semibold text-white/90 drop-shadow">
            🖱️ Kéo để xoay quanh trường · Lăn chuột để zoom · Bấm vào tòa lớp
            học để vào lớp · Bấm vào cổng để xem lịch học · Bấm vào một học sinh
            để đặt tên và gọi bạn vào lớp
          </p>
        </div>
      </section>

      {/* ---------- Thống kê ---------- */}
      <section className="mx-auto -mt-0 grid max-w-6xl grid-cols-2 gap-4 px-4 py-10 md:grid-cols-4">
        {[
          [`${lessons.length}`, "bài học"],
          [`${allVocab.length}`, "từ vựng"],
          [`${allSentences.length}`, "câu mẫu"],
          ["3 ca/ngày", "lớp học cố định"],
        ].map(([num, label]) => (
          <div
            key={label}
            className="rounded-2xl border-2 border-gold/40 bg-cream p-5 text-center shadow"
          >
            <p className="text-3xl font-black text-vermilion">{num}</p>
            <p className="mt-1 text-sm font-semibold text-ink-soft">{label}</p>
          </div>
        ))}
      </section>

      {/* ---------- Tính năng ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-center text-2xl font-black text-ink md:text-3xl">
          Trong trường có gì?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-ink-soft">
          Mọi thứ đều chạy ngay trên trình duyệt, không cần cài đặt.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow transition hover:-translate-y-1 hover:border-vermilion hover:shadow-lg"
            >
              <p className="text-4xl">{f.icon}</p>
              <h3 className="mt-3 text-lg font-extrabold text-vermilion group-hover:underline">
                {f.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {f.desc}
              </p>
            </Link>
          ))}
          <div className="rounded-2xl border-2 border-dashed border-gold/60 bg-paper p-6">
            <p className="text-4xl">🌸</p>
            <h3 className="mt-3 text-lg font-extrabold text-ink">
              Sắp có thêm…
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              Chấm phát âm, bảng vàng học sinh chăm chỉ, thêm truyện mới mỗi
              tuần, và mở rộng sân trường ra phố cổ Hội An.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
