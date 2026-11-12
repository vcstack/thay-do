/** Sổ học trò — kho tiến trình lưu bằng localStorage trên máy người dùng,
 * và đồng bộ lên Supabase (bảng `progress`) khi đã đăng nhập tài khoản thật.
 * Chưa đăng nhập (hoặc chưa cấu hình Supabase) thì chỉ lưu local như cũ —
 * khách vẫn học được bình thường, không mất dữ liệu.
 * Mỗi "tài khoản" chỉ là tên hiển thị + id tự sinh, tiến trình lưu riêng
 * theo tài khoản ở key `thaydo:progress:<accountId>`. Tài khoản Supabase
 * có id dạng `sb:<uid>`.
 */

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

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

/* ================= Đồng bộ Supabase (khi đã đăng nhập thật) ================= */

let cloudUserId: string | null = null;
/** Bản sao tiến trình trên cloud (để gộp hiển thị khi local chưa kịp đồng bộ). */
let cloudCache: StoredProgress | null = null;
let cloudTimer: ReturnType<typeof setTimeout> | null = null;

/** Tài khoản Supabase đang đăng nhập (uid), null khi chưa đăng nhập. */
export function getCloudUserId(): string | null {
  return cloudUserId;
}

/** Tiến trình đang lưu ở đâu: cloud (đã đăng nhập) / local (khách) / off (chưa cấu hình Supabase). */
export function getSyncStatus(): "cloud" | "local" | "off" {
  if (cloudUserId) return "cloud";
  return isSupabaseConfigured() ? "local" : "off";
}

function toCloudRow(userId: string, d: StoredProgress): Record<string, unknown> {
  return {
    user_id: userId,
    lessons_done: d.lessons,
    exams: d.exams,
    chars_practiced: d.chars,
    stories_read: d.stories,
    days: d.days,
    updated_at: new Date().toISOString(),
  };
}

function fromCloudRow(row: Record<string, unknown>): StoredProgress {
  return {
    lessons: Array.isArray(row.lessons_done) ? (row.lessons_done as number[]) : [],
    exams: Array.isArray(row.exams) ? (row.exams as ExamRecord[]) : [],
    chars: Array.isArray(row.chars_practiced) ? (row.chars_practiced as string[]) : [],
    stories: Array.isArray(row.stories_read) ? (row.stories_read as string[]) : [],
    days: Array.isArray(row.days) ? (row.days as string[]) : [],
  };
}

/** Gộp 2 bản tiến trình: hợp các danh sách, nối lịch sử thi (khử trùng). */
function mergeStored(a: StoredProgress, b: StoredProgress): StoredProgress {
  const seenExam = new Set<string>();
  const exams: ExamRecord[] = [];
  for (const e of [...a.exams, ...b.exams]) {
    const k = `${e.mode}|${e.score}|${e.total}|${e.date}`;
    if (!seenExam.has(k)) {
      seenExam.add(k);
      exams.push(e);
    }
  }
  return {
    lessons: [...new Set([...a.lessons, ...b.lessons])],
    exams,
    chars: [...new Set([...a.chars, ...b.chars])],
    stories: [...new Set([...a.stories, ...b.stories])],
    days: [...new Set([...a.days, ...b.days])],
  };
}

async function fetchCloudProgress(userId: string): Promise<StoredProgress | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) return null;
    return fromCloudRow(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

async function writeCloudProgress(userId: string, d: StoredProgress): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("progress").upsert(toCloudRow(userId, d));
  } catch {
    /* mạng lỗi — lần ghi sau sẽ thử lại */
  }
}

/** Ghi local lên cloud sau 800ms (gom nhiều lần ghi liên tiếp). */
function scheduleCloudWrite(): void {
  if (!cloudUserId || !isClient()) return;
  if (cloudTimer) clearTimeout(cloudTimer);
  cloudTimer = setTimeout(() => {
    cloudTimer = null;
    if (!cloudUserId) return;
    const d = readStored(`sb:${cloudUserId}`);
    cloudCache = d;
    void writeCloudProgress(cloudUserId, d);
  }, 800);
}

/**
 * Đánh dấu đã đăng nhập Supabase: chuyển tài khoản local sang `sb:<uid>`,
 * gộp tiến trình khách cũ + tiến trình trên cloud (không mất dữ liệu),
 * rồi ghi bản gộp lên cả local lẫn cloud.
 */
export function setCloudUser(userId: string, name: string): void {
  if (!isClient()) {
    cloudUserId = userId;
    return;
  }
  if (cloudUserId === userId) return;
  const prevAccount = getAccount();
  const prevData = readStored(prevAccount.id);
  cloudUserId = userId;
  const account: Account = { id: `sb:${userId}`, name: name || "Học trò" };
  try {
    window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  } catch {
    /* ignore */
  }
  notifyAccountChange();
  void (async () => {
    const localData = readStored(account.id);
    const cloudData = await fetchCloudProgress(userId);
    const merged = mergeStored(mergeStored(prevData, localData), cloudData ?? emptyStored());
    writeStored(account.id, merged);
    cloudCache = merged;
    await writeCloudProgress(userId, merged);
    notifyAccountChange();
  })();
}

/** Đăng xuất Supabase: quay về tài khoản khách, giữ nguyên tiến trình local cũ. */
export function clearCloudUser(): void {
  if (cloudTimer) {
    clearTimeout(cloudTimer);
    cloudTimer = null;
  }
  cloudUserId = null;
  cloudCache = null;
  if (!isClient()) return;
  try {
    window.localStorage.removeItem(ACCOUNT_KEY);
  } catch {
    /* ignore */
  }
  notifyAccountChange();
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
  if (cloudUserId && account.id === `sb:${cloudUserId}`) {
    cloudCache = data;
    scheduleCloudWrite();
  }
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
  let data = readStored(account.id);
  // Gộp với bản cloud nếu có (phòng khi local chưa kịp đồng bộ).
  if (cloudUserId && cloudCache) data = mergeStored(data, cloudCache);
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

/** Xóa toàn bộ tiến trình của tài khoản hiện tại (cả local lẫn cloud). */
export function clearProgress(): void {
  if (!isClient()) return;
  try {
    window.localStorage.removeItem(progressKey(getAccount().id));
  } catch {
    /* ignore */
  }
  if (cloudUserId) {
    const supabase = getSupabase();
    const uid = cloudUserId;
    cloudCache = emptyStored();
    if (supabase) {
      void supabase
        .from("progress")
        .delete()
        .eq("user_id", uid)
        .then(
          () => {},
          () => {}
        );
    }
  }
}
