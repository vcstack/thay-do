"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SchoolSceneLoader from "@/components/SchoolSceneLoader";
import LoginDialog from "@/components/LoginDialog";
import { getAccount, onAccountChange, type Account } from "@/lib/progress";
import {
  CLASS_SLOTS,
  TRACKS,
  fmtCountdown,
  fmtTime,
  getNextClass,
} from "@/data/schedule";
import { loadGuestName } from "@/data/teacher";

/** Hướng học hôm nay. */
const TODAY_PATHS = [
  {
    icon: "🌱",
    title: "Mới bắt đầu",
    desc: "Chưa biết chữ nào? Bắt đầu từ bài 1, học chào hỏi và số đếm.",
    href: "/bai-hoc/1",
    cta: "Học bài 1 →",
  },
  {
    icon: "📝",
    title: "Ôn HSK",
    desc: "Làm đề thi thử, kiểm tra xem mình được bao nhiêu điểm.",
    href: "/thi-hsk",
    cta: "Vào trường thi →",
  },
  {
    icon: "💬",
    title: "Luyện nói",
    desc: "Ra Phố Hoa nói chuyện: trà quán, sạp hoa quả, quán mì…",
    href: "/pho-hoa",
    cta: "Ra phố Hoa →",
  },
  {
    icon: "✍️",
    title: "Viết chữ",
    desc: "Tô từng nét chữ Hán, thầy chấm đúng/sai từng nét.",
    href: "/luyen-viet",
    cta: "Vào lớp luyện chữ →",
  },
  {
    icon: "🚶",
    title: "Tự đi dạo",
    desc: "Đi dạo quanh sân Văn Miếu, ngắm Khuê Văn Các, ghé trà quán.",
    href: "#san-truong",
    cta: "Xuống sân trường ↓",
  },
];

/** 10 địa điểm trong trường. */
const PLACES = [
  { icon: "🏫", zone: "Học xá", title: "Lớp HSK 1, 2, 3", desc: "82 buổi theo chặng HSK 3.0, giờ vào lớp cố định. Mỗi buổi nghe giảng, đọc theo, rồi thử viết chữ của buổi.", href: "/lop-hoc", cta: "Vào lớp HSK" },
  { icon: "🌱", zone: "Học xá", title: "Lớp Vỡ lòng", desc: "8 buổi bộ thủ cho người mới bắt đầu, cả lớp học chung một buổi mỗi ngày.", href: "/bai-hoc", cta: "Vào lớp Vỡ lòng" },
  { icon: "📝", zone: "Khu học", title: "Trường thi", desc: "Thi thử đề mẫu HSK từng phần. Đầu mỗi giờ có Đề ngắn 5 câu, cả trường cùng làm.", href: "/thi-hsk", cta: "Vào trường thi" },
  { icon: "📚", zone: "Khu học", title: "Thư viện", desc: "Kệ truyện đọc theo cấp HSK, Góc nghe (hội thoại, thanh điệu, nghe chép), Kệ Mẫu câu.", href: "/doc-truyen", cta: "Vào thư viện" },
  { icon: "✍️", zone: "Khu học", title: "Lớp Luyện chữ", desc: "Ngồi chiếu viết bất kỳ chữ nào, thầy chấm từng nét. Có 12 thẻ xin chữ theo mong ước.", href: "/luyen-viet", cta: "Vào lớp luyện chữ" },
  { icon: "🏛️", zone: "Khu học", title: "Giảng đường", desc: "Giờ giảng chiết tự: mỗi buổi một chữ, tách ra từng phần cho dễ nhớ.", href: "/giang-duong", cta: "Vào giảng đường" },
  { icon: "📖", zone: "Khu học", title: "Sân đọc sách", desc: "Tự học chung theo nhịp 25 phút học, 5 phút nghỉ, ngồi chiếu cạnh mọi người.", href: "/pomodoro", cta: "Vào sân đọc sách" },
  { icon: "📖", zone: "Phố Hoa", title: "Hiệu sách", desc: "Đọc to theo từng câu một, luyện phát âm và nghe hiểu.", href: "/doc-truyen", cta: "Vào hiệu sách" },
  { icon: "🏮", zone: "Phố Hoa", title: "Phố Hoa", desc: "Ra Trà quán, Sạp hoa quả, Quán mì gọi món và nói chuyện bằng tiếng Trung.", href: "/pho-hoa", cta: "Ra Phố Hoa" },
  { icon: "🍵", zone: "Sân trường", title: "Trà đạo", desc: "Ngồi chiếu thưởng trà, học nghi thức pha trà từng bước, nghe thầy đọc thơ trà.", href: "/tra-dao", cta: "Vào khu trà đạo" },
];

/** Bảng vàng tuần — dữ liệu mẫu minh họa. */
const GOLD_BOARDS: { title: string; icon: string; rows: { name: string; score: string }[] }[] = [
  {
    title: "Chuyên cần",
    icon: "📅",
    rows: [
      { name: "Minh Anh", score: "7 ngày liền" },
      { name: "Quốc Bảo", score: "7 ngày liền" },
      { name: "Thu Hà", score: "6 ngày liền" },
    ],
  },
  {
    title: "Khoa bảng",
    icon: "🏆",
    rows: [
      { name: "Đức Anh", score: "100 điểm thi thử" },
      { name: "Lan Chi", score: "98 điểm thi thử" },
      { name: "Hoàng Nam", score: "95 điểm thi thử" },
    ],
  },
  {
    title: "Hoa tay",
    icon: "🖌️",
    rows: [
      { name: "Phương Linh", score: "Chữ đẹp nhất tuần" },
      { name: "Tuấn Kiệt", score: "Không sai nét nào" },
      { name: "Tiểu Hoa", score: "Tiến bộ nhanh nhất" },
    ],
  },
];

const REMIND_KEY = "thaydo:remind-next-class";

export default function Home() {
  const [now, setNow] = useState<Date | null>(null);
  const [online, setOnline] = useState<number | null>(null);
  const [guest, setGuest] = useState("");
  const [remindMsg, setRemindMsg] = useState("");
  const [account, setAccount] = useState<Account>({ id: "guest", name: "Khách" });
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    setOnline(24 + Math.floor(Math.random() * 28));
    setGuest(loadGuestName());
    setAccount(getAccount());
    const t = setInterval(() => setNow(new Date()), 30000);
    const t2 = setInterval(
      () => setOnline((o) => (o === null ? o : Math.min(64, Math.max(14, o + Math.floor(Math.random() * 5) - 2)))),
      20000
    );
    const offAccount = onAccountChange(() => setAccount(getAccount()));
    return () => {
      clearInterval(t);
      clearInterval(t2);
      offAccount();
    };
  }, []);

  const next = useMemo(() => (now ? getNextClass(now) : null), [now]);

  function remindMe() {
    if (!next) return;
    try {
      window.localStorage.setItem(
        REMIND_KEY,
        JSON.stringify({ slotId: next.slot.id, start: next.start.getTime() })
      );
    } catch {
      /* ignore */
    }
    setRemindMsg(
      `Đã nhắc! Lớp ${next.slot.track} mở lúc ${fmtTime(next.slot.hour, next.slot.minute)} — mở trường trước giờ học 10 phút là thầy nhắc bạn.`
    );
    // Thử xin quyền thông báo trình duyệt.
    if ("Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-6 text-center md:pb-10 md:pt-12">
        <p className="text-5xl md:text-6xl">師</p>
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.3em] text-gold md:mt-3">
          Trường học tiếng Trung ảo
        </p>
        <h1 className="mt-2 text-4xl font-black text-vermilion md:text-6xl">
          TRƯỜNG THẦY ĐỒ
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base font-medium text-ink-soft md:text-lg">
          Trường có giờ, có lớp, có thi. Đến muộn thì ngồi chiếu cuối.
        </p>
        <p className="mt-2 text-sm font-bold text-leaf">
          🟢 {online ?? "…"} người đang online trong trường
          {guest ? ` · Chào, ${guest}!` : ""}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="#san-truong"
            className="rounded-full bg-vermilion px-8 py-3 text-base font-extrabold text-cream shadow-lg transition hover:bg-vermilion-dark"
          >
            🏫 Vào trường
          </a>
          <Link
            href="/lop-hoc"
            className="rounded-full border-2 border-gold bg-cream px-8 py-3 text-base font-extrabold text-vermilion shadow-lg transition hover:bg-gold-soft/40"
          >
            📖 Vào lớp học
          </Link>
        </div>
        <p className="mt-3 text-xs font-semibold text-ink-soft">
          Miễn phí, không cần cài app hay đăng nhập.
        </p>
      </section>

      {/* ---------- Sân trường 3D ---------- */}
      <section id="san-truong" className="relative h-[62svh] min-h-[420px] w-full scroll-mt-20 overflow-hidden md:h-[75svh] md:min-h-[540px]">
        <div className="absolute inset-0">
          <SchoolSceneLoader />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-gradient-to-t from-black/45 via-black/15 to-transparent px-4 pb-5 pt-16">
          <p className="hidden text-center text-xs font-semibold text-white/90 drop-shadow md:block">
            🖱️ Kéo để xoay quanh trường · Lăn chuột để zoom · Bấm vào tòa lớp
            học để vào lớp · Bấm vào cổng để xem lịch học · Bấm vào một học sinh
            để đặt tên và gọi bạn vào lớp
          </p>
          <p className="text-center text-xs font-semibold text-white/90 drop-shadow md:hidden">
            👆 Chạm kéo để xoay trường · Chụm 2 ngón để zoom · Chạm tòa lớp
            học để vào lớp · Chạm cổng để xem lịch · Chạm một học sinh để đặt
            tên và gọi bạn vào lớp
          </p>
        </div>
      </section>

      {/* ---------- Hôm nay học gì? ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-black text-ink md:text-3xl">
          Hôm nay học gì?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-ink-soft">
          Chưa biết bắt đầu từ đâu? Chọn một hướng, thầy dẫn tới tận nơi.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TODAY_PATHS.map((p) => (
            <div
              key={p.title}
              className="flex flex-col rounded-2xl border-2 border-gold/40 bg-cream p-5 shadow"
            >
              <p className="text-4xl">{p.icon}</p>
              <h3 className="mt-3 text-base font-extrabold text-vermilion">{p.title}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-soft">{p.desc}</p>
              <Link
                href={p.href}
                className="mt-4 inline-block rounded-full bg-vermilion px-4 py-2 text-center text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Giờ học tới ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-center text-2xl font-black text-ink md:text-3xl">
          🕗 Giờ học tới
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-ink-soft">
          Lớp vào đúng giờ, thầy không đợi ai.
        </p>

        {next && (
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border-2 border-vermilion/50 bg-cream p-6 text-center shadow">
            <p className="text-sm font-bold text-ink-soft">
              {next.live ? "🔴 Đang mở lớp" : "Lớp sắp mở"}
            </p>
            <p className="mt-1 text-2xl font-black text-vermilion">{next.slot.title}</p>
            <p className="mt-1 text-sm text-ink-soft">
              {fmtTime(next.slot.hour, next.slot.minute)} · {next.slot.desc}
            </p>
            <p className="mt-2 text-xl font-black text-leaf">
              {next.live ? "Đang học — vào ngay!" : `Còn ${fmtCountdown(next.msUntil)} nữa mở lớp`}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/lop-hoc"
                className="rounded-full bg-vermilion px-6 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
              >
                🚪 Vào lớp
              </Link>
              <button
                onClick={remindMe}
                className="rounded-full border-2 border-gold bg-cream px-6 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
              >
                🔔 Nhắc tôi
              </button>
            </div>
            {remindMsg && (
              <p className="mt-3 rounded-xl bg-leaf-soft/30 p-3 text-sm font-bold text-leaf">
                {remindMsg}
              </p>
            )}
          </div>
        )}

        {/* Giờ vào lớp cố định */}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
          <h3 className="text-base font-extrabold text-ink">Giờ vào lớp mỗi ngày ở Học xá</h3>
          <ul className="mt-3 space-y-2">
            {(["Vỡ lòng", "HSK 1", "HSK 2", "HSK 3"] as const).map((track) => (
              <li key={track} className="flex flex-wrap items-baseline gap-2 text-sm">
                <span className="font-extrabold text-vermilion">Lớp {track}:</span>
                <span className="font-semibold text-ink">
                  {CLASS_SLOTS.filter((s) => s.track === track)
                    .map((s) => fmtTime(s.hour, s.minute))
                    .join(", ")}
                </span>
              </li>
            ))}
            <li className="flex flex-wrap items-baseline gap-2 text-sm">
              <span className="font-extrabold text-vermilion">Đại khoa:</span>
              <span className="font-semibold text-ink">đầu mỗi giờ, 08:00 tới 23:00</span>
            </li>
          </ul>
          <p className="mt-3 text-center">
            <Link href="/lich-hoc" className="text-sm font-bold text-vermilion hover:underline">
              Xem lịch học cả tuần →
            </Link>
          </p>
        </div>
      </section>

      {/* ---------- Lộ trình lớp ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-center text-2xl font-black text-ink md:text-3xl">
          🪜 Lộ trình lớp
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-ink-soft">
          Xong lớp dưới mới lên lớp trên, đường thi HSK là đi từng bậc. Giờ vào
          lớp chung, buổi học là buổi tiếp theo của riêng bạn.
        </p>
        <ol className="mx-auto mt-8 max-w-3xl space-y-3">
          {TRACKS.map((t, i) => (
            <li
              key={t.name}
              className={`flex items-start gap-4 rounded-2xl border-2 p-5 shadow ${
                t.status === "waiting" ? "border-dashed border-gold/60 bg-paper" : "border-gold/40 bg-cream"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vermilion text-lg font-black text-cream">
                {i + 1}
              </span>
              <div>
                <p className="text-lg font-extrabold text-ink">
                  {t.name}
                  {t.sessions !== null && (
                    <span className="ml-2 rounded-full bg-gold-soft/50 px-2 py-0.5 text-xs font-bold text-ink">
                      {t.sessions} buổi
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{t.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Trong trường có gì ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-center text-2xl font-black text-ink md:text-3xl">
          🏫 Trong trường có gì
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-ink-soft">
          Chạm vào nơi nào, thầy dẫn tới tận cửa nơi đó.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLACES.map((p) => (
            <div
              key={p.title}
              className="flex flex-col rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow transition hover:-translate-y-1 hover:border-vermilion hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <p className="text-4xl">{p.icon}</p>
                <span className="rounded-full bg-gold-soft/40 px-2 py-0.5 text-xs font-bold text-ink">
                  {p.zone}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-vermilion">{p.title}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-soft">{p.desc}</p>
              <Link
                href={p.href}
                className="mt-4 inline-block rounded-full bg-vermilion px-4 py-2 text-center text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
              >
                {p.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Bảng vàng tuần ---------- */}
      <section id="bang-vang" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-12">
        <h2 className="text-center text-2xl font-black text-ink md:text-3xl">
          🏆 Bảng vàng tuần
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-ink-soft">
          Vinh danh học trò chăm chỉ nhất tuần — lên bảng là cả trường biết tên.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {GOLD_BOARDS.map((b) => (
            <div key={b.title} className="rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
              <p className="text-2xl">{b.icon}</p>
              <h3 className="mt-2 text-lg font-extrabold text-vermilion">{b.title}</h3>
              <ol className="mt-3 space-y-2">
                {b.rows.map((r, i) => (
                  <li key={r.name} className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-bold text-ink">
                      {i + 1}. {r.name}
                    </span>
                    <span className="font-semibold text-gold">{r.score}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-ink-soft">
          * Tên và điểm trên bảng là dữ liệu mẫu minh họa — bảng thật sẽ cập
          nhật khi có học trò học thật trong trường.
        </p>
      </section>

      {/* ---------- Sổ học trò ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl border-2 border-gold/40 bg-cream p-8 text-center shadow">
          <h2 className="text-2xl font-black text-ink">📒 Sổ học trò</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">
            Vào trường không cần tài khoản — cứ vào học là được. Mỗi bài đã mở,
            điểm thi, chữ đã tô và truyện đã đọc đều được thầy ghi vào Sổ học
            trò, lưu ngay trên máy này. Đăng nhập bằng tên để giữ riêng sổ của
            mình — không có tài khoản máy chủ, không dùng Google.
          </p>
          {account.id !== "guest" ? (
            <p className="mt-3 text-sm font-bold text-leaf">
              Bạn đang học với tên: {account.name} — sổ của bạn đang được ghi
              riêng.
            </p>
          ) : (
            guest && (
              <p className="mt-3 text-sm font-bold text-leaf">
                Bạn đang vào trường với tên khách: {guest} — đăng nhập bằng tên
                để có sổ riêng.
              </p>
            )
          )}
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/so-hoc-tro"
              className="rounded-full bg-vermilion px-6 py-3 font-bold text-cream shadow hover:bg-vermilion-dark"
            >
              📒 Mở Sổ học trò
            </Link>
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-full border-2 border-gold bg-cream px-6 py-3 font-bold text-vermilion hover:bg-gold-soft/40"
            >
              🔑 {account.id !== "guest" ? "Đổi tên / Đăng xuất" : "Đăng nhập giữ tiến trình"}
            </button>
          </div>
        </div>
      </section>
      <LoginDialog
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onDone={(a) => setAccount(a)}
      />
    </div>
  );
}
