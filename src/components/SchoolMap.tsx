"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CLASS_SLOTS, DAI_KHOA_HOURS, fmtTime, liveClasses } from "@/data/schedule";

type Skill = "Đọc" | "Nghe" | "Nói" | "Viết" | "Ngữ pháp" | "Thi";
const SKILLS: ("Tất cả" | Skill)[] = ["Tất cả", "Đọc", "Nghe", "Nói", "Viết", "Ngữ pháp", "Thi"];

interface Place {
  name: string;
  href: string;
  desc: string;
  skills: Skill[];
}

interface Zone {
  name: string;
  icon: string;
  desc: string;
  places: Place[];
}

const ZONES: Zone[] = [
  {
    name: "Phố Hoa",
    icon: "🏮",
    desc: "Ra phố nói chuyện bằng tiếng Trung.",
    places: [
      { name: "Trà quán", href: "/pho-hoa", desc: "Gọi trà, trò chuyện với cô chủ quán.", skills: ["Nói", "Nghe"] },
      { name: "Sạp hoa quả", href: "/pho-hoa", desc: "Hỏi giá, trả giá mua hoa quả.", skills: ["Nói", "Nghe"] },
      { name: "Quán mì", href: "/pho-hoa", desc: "Gọi món, chọn bát lớn hay nhỏ.", skills: ["Nói", "Nghe"] },
      { name: "Hiệu thuốc", href: "/pho-hoa", desc: "Nói triệu chứng, hỏi cách dùng thuốc.", skills: ["Nói", "Nghe"] },
      { name: "Bưu cục", href: "/pho-hoa", desc: "Gửi gói đồ, hỏi giá cước.", skills: ["Nói", "Nghe"] },
      { name: "Khách điếm", href: "/pho-hoa", desc: "Thuê phòng, hỏi giá phòng.", skills: ["Nói", "Nghe"] },
      { name: "Hiệu sách", href: "/doc-truyen", desc: "Đọc to theo từng câu, luyện phát âm.", skills: ["Đọc", "Nói"] },
    ],
  },
  {
    name: "Tiền viện",
    icon: "🏛️",
    desc: "Cổng trường và sân Văn Miếu.",
    places: [
      { name: "Cổng Văn Miếu", href: "/", desc: "Cổng chính của trường.", skills: [] },
      { name: "Khuê Văn Các", href: "/", desc: "Lầu biểu tượng giữa sân trường.", skills: [] },
      { name: "Bia tiến sĩ", href: "/", desc: "Bia đá trên lưng rùa.", skills: [] },
      { name: "Hồ sen", href: "/", desc: "Hồ sen thơm ngát góc sân.", skills: [] },
    ],
  },
  {
    name: "Sân trường",
    icon: "🌳",
    desc: "Sân 3D — nơi học sinh đi lại, vào lớp.",
    places: [
      { name: "Sân trường 3D", href: "/", desc: "Kéo xoay, bấm vào học sinh để gọi vào lớp.", skills: [] },
      { name: "Khu trà đạo", href: "/tra-dao", desc: "Ngồi chiếu thưởng trà, học nghi thức pha trà Trung Hoa.", skills: ["Nghe", "Nói"] },
      { name: "Đèn đá & ghế đá", href: "/", desc: "Ngồi nghỉ, ngắm cảnh sân trường.", skills: [] },
    ],
  },
  {
    name: "Khu học",
    icon: "📚",
    desc: "Các lớp học và luyện tập.",
    places: [
      { name: "Lớp học", href: "/lop-hoc", desc: "Nghe thầy giảng theo ca 8:00, 14:00, 20:00.", skills: ["Nghe", "Ngữ pháp"] },
      { name: "Lớp Luyện chữ", href: "/luyen-viet", desc: "Tô từng nét, thầy chấm không nể ai.", skills: ["Viết"] },
      { name: "Giảng đường", href: "/giang-duong", desc: "Mỗi buổi một chữ, chiết tự cho dễ nhớ.", skills: ["Đọc", "Ngữ pháp"] },
      { name: "Trường thi", href: "/thi-hsk", desc: "Đề ngắn đầu giờ, đề thi thử HSK.", skills: ["Thi"] },
      { name: "Thư viện", href: "/doc-truyen", desc: "Truyện theo cấp, góc nghe, mẫu câu.", skills: ["Đọc", "Nghe"] },
      { name: "Sân đọc sách", href: "/pomodoro", desc: "Tự học chung theo nhịp 25/5.", skills: ["Đọc"] },
    ],
  },
  {
    name: "Học xá",
    icon: "🏫",
    desc: "Lớp học theo cấp và bảng vàng.",
    places: [
      { name: "Lớp Vỡ lòng", href: "/bai-hoc", desc: "8 buổi bộ thủ cho người mới bắt đầu.", skills: ["Nghe", "Nói"] },
      { name: "Lớp HSK 1, 2, 3", href: "/lop-hoc", desc: "82 buổi theo chặng HSK 3.0.", skills: ["Nghe", "Nói", "Ngữ pháp"] },
      { name: "Bảng vàng tuần", href: "/#bang-vang", desc: "Chuyên cần, khoa bảng, hoa tay.", skills: [] },
    ],
  },
];

type Tab = "map" | "timetable";

export default function SchoolMap({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("map");
  const [skill, setSkill] = useState<(typeof SKILLS)[number]>("Tất cả");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const live = now ? liveClasses(now) : [];
  const shownZones = ZONES.map((z) => ({
    ...z,
    places: skill === "Tất cả" ? z.places : z.places.filter((p) => p.skills.includes(skill as Skill)),
  })).filter((z) => z.places.length > 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-3xl rounded-2xl border-2 border-gold/50 bg-paper p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-vermilion">🗺️ Bản đồ trường</h2>
            <p className="mt-1 text-sm text-ink-soft">
              5 khu trong trường — bấm vào một nơi để tới đó ngay.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border-2 border-gold bg-cream px-3 py-1.5 text-sm font-bold text-vermilion"
          >
            ✕ Đóng
          </button>
        </div>

        {/* Tab */}
        <div className="mt-5 inline-flex rounded-full border-2 border-gold/50 bg-cream p-1">
          <button
            onClick={() => setTab("map")}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${tab === "map" ? "bg-vermilion text-cream" : "text-ink"}`}
          >
            🗺️ Bản đồ
          </button>
          <button
            onClick={() => setTab("timetable")}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${tab === "timetable" ? "bg-vermilion text-cream" : "text-ink"}`}
          >
            🕗 Thời khóa biểu
          </button>
        </div>

        {tab === "map" && (
          <>
            {/* Đang diễn ra */}
            <div className="mt-5 rounded-xl border-2 border-leaf/40 bg-leaf-soft/20 p-4">
              <p className="text-sm font-extrabold text-leaf">🔴 Đang diễn ra</p>
              {live.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {live.map((l) => (
                    <li key={l.slot.id} className="text-sm font-semibold text-ink">
                      {l.slot.title} — còn {l.endsInMin} phút nữa tan học.{" "}
                      <Link href="/lop-hoc" onClick={onClose} className="font-bold text-vermilion hover:underline">
                        Vào lớp →
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-ink-soft">
                  Lúc này chưa có lớp nào đang mở. Xem thời khóa biểu để biết lớp sắp tới.
                </p>
              )}
            </div>

            {/* Lọc theo kỹ năng */}
            <div className="mt-5 flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSkill(s)}
                  className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                    skill === s ? "bg-vermilion text-cream shadow" : "border-2 border-gold/50 bg-cream text-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Các khu */}
            <div className="mt-5 space-y-5">
              {shownZones.map((z) => (
                <div key={z.name}>
                  <p className="text-base font-extrabold text-ink">
                    {z.icon} {z.name}
                    <span className="ml-2 text-sm font-semibold text-ink-soft">{z.desc}</span>
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {z.places.map((p) => (
                      <Link
                        key={p.name}
                        href={p.href}
                        onClick={onClose}
                        className="rounded-xl border-2 border-gold/40 bg-cream p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-vermilion"
                      >
                        <p className="text-sm font-extrabold text-vermilion">{p.name}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{p.desc}</p>
                        {p.skills.length > 0 && (
                          <p className="mt-1 flex flex-wrap gap-1">
                            {p.skills.map((s) => (
                              <span key={s} className="rounded-full bg-gold-soft/40 px-2 py-0.5 text-[11px] font-bold text-ink">
                                {s}
                              </span>
                            ))}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {shownZones.length === 0 && (
                <p className="text-sm text-ink-soft">Không có địa điểm nào luyện kỹ năng này.</p>
              )}
            </div>
          </>
        )}

        {tab === "timetable" && (
          <div className="mt-5 space-y-4">
            {(["Vỡ lòng", "HSK 1", "HSK 2", "HSK 3"] as const).map((track) => (
              <div key={track} className="rounded-xl border-2 border-gold/40 bg-cream p-4">
                <p className="text-sm font-extrabold text-vermilion">Lớp {track}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CLASS_SLOTS.filter((s) => s.track === track).map((s) => (
                    <span key={s.id} className="rounded-full bg-gold-soft/40 px-3 py-1 text-sm font-bold text-ink">
                      {fmtTime(s.hour, s.minute)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className="rounded-xl border-2 border-gold/40 bg-cream p-4">
              <p className="text-sm font-extrabold text-vermilion">Đại khoa — đầu mỗi giờ</p>
              <p className="mt-1 text-sm text-ink-soft">
                Đề ngắn 5 câu, cả trường cùng làm. Các giờ:{" "}
                {DAI_KHOA_HOURS.map((h) => `${String(h).padStart(2, "0")}:00`).join(", ")}.
              </p>
            </div>
            <p className="text-xs text-ink-soft">
              Lớp vào đúng giờ, thầy không đợi ai. Đến muộn thì ngồi chiếu cuối.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
