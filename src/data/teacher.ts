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
