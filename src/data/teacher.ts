/** Lời thầy Đồ nhận xét khi học sinh viết sai — tự viết, hài hước nhẹ nhàng. */

export const TEACHER_REMARKS_MISTAKE: string[] = [
  "Nét này viết như gà bới, viết lại đi!",
  "Chậm thôi, chữ Hán không chạy đâu mà vội.",
  "Nét ngang phải thẳng như thước kẻ, không phải như con giun.",
  "Sai rồi! Thầy đã bảo bao nhiêu lần, nét này viết trước.",
  "Ui chao, chữ này mà đem đi thi thì thầy cũng phải khóc.",
  "Viết lại! Tay run thì hít thở sâu rồi viết.",
  "Nét này lệch cả tấc rồi, em viết bằng chân à?",
  "Được rồi, sai thì sửa, thầy không chê người chịu khó.",
  "Nét sổ phải dứt khoát, đừng run run như sợ ma.",
  "Chữ này thầy nhìn mãi mới ra, em viết lại cho rõ ràng nào.",
];

export const TEACHER_REMARKS_PRAISE: string[] = [
  "Không sai nét nào — hôm nay em viết đẹp như chữ thầy!",
  "Chữ này viết chuẩn lắm, thầy cho em điểm mười!",
  "Tốt! Cứ thế này thì thi HSK không phải lo.",
  "Thầy nhìn chữ này mà mát cả lòng, viết tiếp đi!",
];

export function randomRemark(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

/** Tên gợi ý cho học sinh mới vào lớp. */
export const SUGGESTED_NAMES: string[] = [
  "Tiểu Minh",
  "Tiểu Hoa",
  "A Bảo",
  "Tiểu Lan",
  "A Cường",
  "Tiểu An",
  "Tiểu Long",
  "A Mai",
];

/** Key lưu tên học sinh vào localStorage. */
export const STUDENT_NAMES_KEY = "thaydo:student-names";

/** Key lưu tên khách (tên của người vào trường) vào localStorage. */
export const GUEST_NAME_KEY = "thaydo:guest-name";

/** Tên khách gợi ý khi vào trường lần đầu. */
export const GUEST_NAMES: string[] = [
  "Trà Bạc",
  "Trà Xanh",
  "Tiểu Thư",
  "Mọt Sách",
  "Trà Đá",
  "A Ngốc",
];

export function loadGuestName(): string {
  if (typeof window === "undefined") return "";
  try {
    const saved = window.localStorage.getItem(GUEST_NAME_KEY);
    if (saved && saved.trim()) return saved;
  } catch {
    /* ignore */
  }
  // Lần đầu vào trường: tạo tên khách mặc định và lưu lại.
  const name = GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)];
  try {
    window.localStorage.setItem(GUEST_NAME_KEY, name);
  } catch {
    /* ignore */
  }
  return name;
}

export function saveGuestName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GUEST_NAME_KEY, name);
  } catch {
    /* ignore */
  }
}

export function loadStudentNames(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STUDENT_NAMES_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

export function saveStudentName(id: string, name: string): void {
  if (typeof window === "undefined") return;
  const all = loadStudentNames();
  all[id] = name;
  try {
    window.localStorage.setItem(STUDENT_NAMES_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
