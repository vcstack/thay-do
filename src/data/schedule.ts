/** Giờ học cố định trong ngày của trường — theo cấu trúc trường học ảo. */

export interface ClassSlot {
  id: string;
  track: string;
  hour: number;
  minute: number;
  title: string;
  desc: string;
  /** Thời lượng buổi học (phút). */
  durationMin: number;
}

function slot(
  track: string,
  hour: number,
  minute: number,
  title: string,
  desc: string,
  durationMin = 45
): ClassSlot {
  return {
    id: `${track}-${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}`,
    track,
    hour,
    minute,
    title,
    desc,
    durationMin,
  };
}

/** Giờ vào lớp cố định mỗi ngày (4 lớp × 4 ca). */
export const CLASS_SLOTS: ClassSlot[] = [
  slot("Vỡ lòng", 7, 0, "Lớp Vỡ lòng — buổi sáng", "8 buổi bộ thủ cho người mới bắt đầu."),
  slot("Vỡ lòng", 12, 30, "Lớp Vỡ lòng — buổi trưa", "8 buổi bộ thủ cho người mới bắt đầu."),
  slot("Vỡ lòng", 20, 0, "Lớp Vỡ lòng — buổi tối", "8 buổi bộ thủ cho người mới bắt đầu."),
  slot("Vỡ lòng", 21, 30, "Lớp Vỡ lòng — buổi khuya", "8 buổi bộ thủ cho người mới bắt đầu."),
  slot("HSK 1", 7, 15, "Lớp HSK 1 — buổi sáng", "Buổi học theo chặng HSK 3.0."),
  slot("HSK 1", 12, 45, "Lớp HSK 1 — buổi trưa", "Buổi học theo chặng HSK 3.0."),
  slot("HSK 1", 20, 15, "Lớp HSK 1 — buổi tối", "Buổi học theo chặng HSK 3.0."),
  slot("HSK 1", 21, 45, "Lớp HSK 1 — buổi khuya", "Buổi học theo chặng HSK 3.0."),
  slot("HSK 2", 7, 30, "Lớp HSK 2 — buổi sáng", "Buổi học theo chặng HSK 3.0."),
  slot("HSK 2", 13, 0, "Lớp HSK 2 — buổi trưa", "Buổi học theo chặng HSK 3.0."),
  slot("HSK 2", 20, 30, "Lớp HSK 2 — buổi tối", "Buổi học theo chặng HSK 3.0."),
  slot("HSK 2", 22, 0, "Lớp HSK 2 — buổi khuya", "Buổi học theo chặng HSK 3.0."),
  slot("HSK 3", 7, 45, "Lớp HSK 3 — buổi sáng", "Buổi học theo chặng HSK 3.0."),
  slot("HSK 3", 13, 15, "Lớp HSK 3 — buổi trưa", "Buổi học theo chặng HSK 3.0."),
  slot("HSK 3", 20, 45, "Lớp HSK 3 — buổi tối", "Buổi học theo chặng HSK 3.0."),
  slot("HSK 3", 22, 15, "Lớp HSK 3 — buổi khuya", "Buổi học theo chặng HSK 3.0."),
];

/** Đại khoa: đầu mỗi giờ, 08:00 tới 23:00 — đề ngắn 5 câu, cả trường cùng làm. */
export const DAI_KHOA_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

export function daiKhoaSlot(hour: number): ClassSlot {
  return slot("Đại khoa", hour, 0, `Đại khoa ${String(hour).padStart(2, "0")}:00`, "Đề ngắn 5 câu đầu giờ — cả trường cùng làm.", 15);
}

/** Tất cả các ca trong một ngày (kể cả Đại khoa), xếp theo giờ. */
export function allSlotsToday(): ClassSlot[] {
  const all = [...CLASS_SLOTS, ...DAI_KHOA_HOURS.map(daiKhoaSlot)];
  return all.sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
}

export interface NextClass {
  slot: ClassSlot;
  start: Date;
  live: boolean;
  /** Số mili-giây tới lúc bắt đầu (0 nếu đang mở). */
  msUntil: number;
}

/** Lớp sắp mở nhất (hoặc đang mở) tính từ thời điểm now. */
export function getNextClass(now: Date): NextClass {
  const slots = allSlotsToday();
  for (const s of slots) {
    const start = new Date(now);
    start.setHours(s.hour, s.minute, 0, 0);
    const end = new Date(start.getTime() + s.durationMin * 60000);
    if (now >= start && now < end) {
      return { slot: s, start, live: true, msUntil: 0 };
    }
    if (now < start) {
      return { slot: s, start, live: false, msUntil: start.getTime() - now.getTime() };
    }
  }
  // Hết ca hôm nay → ca đầu ngày mai.
  const first = slots[0];
  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  start.setHours(first.hour, first.minute, 0, 0);
  return { slot: first, start, live: false, msUntil: start.getTime() - now.getTime() };
}

/** Các lớp đang mở lúc now. */
export function liveClasses(now: Date): { slot: ClassSlot; endsInMin: number }[] {
  const out: { slot: ClassSlot; endsInMin: number }[] = [];
  for (const s of allSlotsToday()) {
    const start = new Date(now);
    start.setHours(s.hour, s.minute, 0, 0);
    const end = new Date(start.getTime() + s.durationMin * 60000);
    if (now >= start && now < end) {
      out.push({ slot: s, endsInMin: Math.round((end.getTime() - now.getTime()) / 60000) });
    }
  }
  return out;
}

export function fmtCountdown(ms: number): string {
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m} phút`;
  return `${h} giờ ${m} phút`;
}

export function fmtTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** Lộ trình lớp: xong lớp dưới mới lên lớp trên. */
export interface Track {
  name: string;
  sessions: number | null;
  desc: string;
  status: "open" | "waiting";
}

export const TRACKS: Track[] = [
  { name: "Lớp Vỡ lòng", sessions: 8, desc: "8 buổi bộ thủ cho người mới bắt đầu", status: "open" },
  { name: "Lớp HSK 1", sessions: 29, desc: "29 buổi theo HSK 3.0", status: "open" },
  { name: "Lớp HSK 2", sessions: 23, desc: "23 buổi theo HSK 3.0", status: "open" },
  { name: "Lớp HSK 3", sessions: 30, desc: "30 buổi theo HSK 3.0", status: "open" },
  { name: "Lớp HSK 4, 5, 6", sessions: null, desc: "Đang chờ đủ người. Muốn học thì ghi tên ở bảng trong Học xá.", status: "waiting" },
];
