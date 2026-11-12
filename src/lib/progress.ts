/** Sổ học trò — kho tiến trình lưu bằng localStorage trên máy người dùng.
 * Không có backend, không có tài khoản máy chủ, không dùng Google.
 * Mỗi "tài khoản" chỉ là tên hiển thị + id tự sinh, tiến trình lưu riêng
 * theo tài khoản ở key `thaydo:progress:<accountId>`.
 */

export interface Account {
  id: string;
  name: string;
}

export interface ExamRecord {
  mode: string;
  score: number;
  total: number;
  date: string; // ISO: ngày nộp bài
}

export interface Progress {
  lessonsDone: number[];
  exams: ExamRecord[];
  charsPracticed: string[];
  storiesRead: string[];
  streak: number;
  totalDays: number;
  lastStudyDate: string | null;
}

interface StoredProgress {
  lessons: number[];
  exams: ExamRecord[];
  chars: string[];
  stories: string[];
  days: string[]; // ngày đã học, dạng "YYYY-MM-DD" (giờ địa phương)
}

const ACCOUNT_KEY = "thaydo:account";
const ACCOUNT_EVENT = "thaydo:account";
const GUEST_ACCOUNT: Account = { id: "guest", name: "Khách" };

function isClient(): boolean {
  return typeof window !== "undefined";
}

function progressKey(accountId: string): string {
  return `thaydo:progress:${accountId}`;
}

/** Ngày hôm nay dạng "YYYY-MM-DD" theo giờ địa phương. */
function dayString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyStored(): StoredProgress {
  return { lessons: [], exams: [], chars: [], stories: [], days: [] };
}

function readStored(accountId: string): StoredProgress {
  if (!isClient()) return emptyStored();
  try {
    const raw = window.localStorage.getItem(progressKey(accountId));
    if (!raw) return emptyStored();
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
      exams: Array.isArray(parsed.exams) ? parsed.exams : [],
      chars: Array.isArray(parsed.chars) ? parsed.chars : [],
      stories: Array.isArray(parsed.stories) ? parsed.stories : [],
      days: Array.isArray(parsed.days) ? parsed.days : [],
    };
  } catch {
    return emptyStored();
  }
}

function writeStored(accountId: string, data: StoredProgress): void {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(progressKey(accountId), JSON.stringify(data));
  } catch {
    /* bộ nhớ đầy hoặc bị chặn — bỏ qua */
  }
}

/** Đếm số ngày liên tiếp có học. Nếu hôm nay chưa học thì tính tới hôm qua. */
function computeStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const set = new Set(days);
  const cursor = new Date();
  // Chưa học hôm nay thì bắt đầu đếm từ hôm qua.
  if (!set.has(dayString(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(dayString(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Báo cho các component đang mở biết tài khoản vừa đổi. */
function notifyAccountChange(): void {
  if (!isClient()) return;
  window.dispatchEvent(new Event(ACCOUNT_EVENT));
}

export function onAccountChange(cb: () => void): () => void {
  if (!isClient()) return () => {};
  window.addEventListener(ACCOUNT_EVENT, cb);
  return () => window.removeEventListener(ACCOUNT_EVENT, cb);
}

/** Tài khoản hiện tại; chưa đăng nhập thì là tài khoản khách mặc định. */
export function getAccount(): Account {
  if (!isClient()) return GUEST_ACCOUNT;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return GUEST_ACCOUNT;
    const parsed = JSON.parse(raw) as Partial<Account>;
    if (typeof parsed.id === "string" && typeof parsed.name === "string" && parsed.name.trim()) {
      return { id: parsed.id, name: parsed.name };
    }
    return GUEST_ACCOUNT;
  } catch {
    return GUEST_ACCOUNT;
  }
}

/** "Đăng nhập" bằng tên hiển thị — tạo tài khoản local mới, không có máy chủ. */
export function login(name: string): Account {
  const trimmed = name.trim();
  const account: Account = {
    id: `guest-${Date.now()}`,
    name: trimmed || "Học trò",
  };
  if (!isClient()) return account;
  try {
    window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  } catch {
    /* ignore */
  }
  notifyAccountChange();
  return account;
}

/** Đăng xuất: quay về tài khoản khách mặc định, KHÔNG xóa tiến trình cũ. */
export function logout(): Account {
  if (isClient()) {
    try {
      window.localStorage.removeItem(ACCOUNT_KEY);
    } catch {
      /* ignore */
    }
  }
  notifyAccountChange();
  return GUEST_ACCOUNT;
}

function updateProgress(mut: (data: StoredProgress) => void): void {
  if (!isClient()) return;
  const account = getAccount();
  const data = readStored(account.id);
  mut(data);
  writeStored(account.id, data);
}

export function recordLesson(lessonId: number): void {
  updateProgress((d) => {
    if (!d.lessons.includes(lessonId)) d.lessons.push(lessonId);
  });
}

export function recordExam(mode: string, score: number, total: number): void {
  updateProgress((d) => {
    d.exams.push({ mode, score, total, date: new Date().toISOString() });
  });
}

export function recordWriting(char: string): void {
  if (!char) return;
  updateProgress((d) => {
    if (!d.chars.includes(char)) d.chars.push(char);
  });
}

export function recordStory(storyId: string): void {
  if (!storyId) return;
  updateProgress((d) => {
    if (!d.stories.includes(storyId)) d.stories.push(storyId);
  });
}

/** Ghi ngày học hôm nay để tính chuỗi ngày (streak). */
export function recordDay(): void {
  updateProgress((d) => {
    const today = dayString(new Date());
    if (!d.days.includes(today)) d.days.push(today);
  });
}

export function getProgress(): Progress {
  const account = getAccount();
  const data = readStored(account.id);
  const daysSorted = [...data.days].sort();
  return {
    lessonsDone: [...data.lessons].sort((a, b) => a - b),
    exams: data.exams,
    charsPracticed: data.chars,
    storiesRead: data.stories,
    streak: computeStreak(data.days),
    totalDays: data.days.length,
    lastStudyDate: daysSorted.length > 0 ? daysSorted[daysSorted.length - 1] : null,
  };
}

/** Xóa toàn bộ tiến trình của tài khoản hiện tại. */
export function clearProgress(): void {
  if (!isClient()) return;
  try {
    window.localStorage.removeItem(progressKey(getAccount().id));
  } catch {
    /* ignore */
  }
}
