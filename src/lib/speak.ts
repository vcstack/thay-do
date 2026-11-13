/**
 * Giọng đọc tiếng Trung: ƯU TIÊN file audio CosyVoice tạo sẵn
 * (public/audio/, tra qua public/audio/manifest.json), FALLBACK về
 * Web Speech API (giọng của trình duyệt) khi câu đó chưa có file.
 * Giọng Việt (speakVi) giữ nguyên Web Speech API.
 */

type ManifestEntry = {
  key: string;
  group: string;
  text: string;
  file: string;
  ok: boolean;
};

let manifestMap: Map<string, string> | null = null;
let manifestPromise: Promise<Map<string, string>> | null = null;
let currentAudio: HTMLAudioElement | null = null;

/** Chuẩn hoá để tra manifest: cùng 1 câu dù thừa/thiếu khoảng trắng vẫn khớp. */
function normText(t: string): string {
  return t.replace(/\s+/g, " ").trim();
}

/** Tải manifest 1 lần duy nhất, cache lại. Lỗi/404 (chưa có audio) -> map rỗng. */
function loadManifest(): Promise<Map<string, string>> {
  if (manifestMap) return Promise.resolve(manifestMap);
  if (!manifestPromise) {
    manifestPromise = fetch("/audio/manifest.json")
      .then((r) => (r.ok ? r.json() : { entries: [] }))
      .then((data) => {
        const m = new Map<string, string>();
        const entries: ManifestEntry[] = Array.isArray(
          (data as { entries?: unknown })?.entries
        )
          ? (data as { entries: ManifestEntry[] }).entries
          : [];
        for (const e of entries) {
          if (e?.ok && typeof e.text === "string" && typeof e.file === "string") {
            const url = e.file.startsWith("/") ? e.file : `/${e.file.replace(/^\.\//, "")}`;
            m.set(normText(e.text), url);
          }
        }
        manifestMap = m;
        return m;
      })
      .catch(() => {
        manifestMap = new Map();
        return manifestMap;
      });
  }
  return manifestPromise;
}

/** Gọi sớm khi vào trang (Nav) để lần bấm Nghe đầu tiên đã có audio CosyVoice. */
export function preloadCosyAudio() {
  if (typeof window !== "undefined") void loadManifest();
}

function stopAudioFile() {
  if (currentAudio) {
    const a = currentAudio;
    currentAudio = null;
    a.onended = null;
    a.onerror = null;
    a.pause();
  }
}

/** Phát 1 file audio. Trả về true nếu đã bắt đầu phát (file có thể lỗi sau đó). */
function playAudioFile(url: string): boolean {
  try {
    stopAudioFile();
    const a = new Audio(url);
    a.playbackRate = 1; // file CosyVoice đã đọc ở tốc độ tự nhiên, không chỉnh
    currentAudio = a;
    a.onended = () => {
      if (currentAudio === a) currentAudio = null;
    };
    a.onerror = () => {
      if (currentAudio === a) currentAudio = null;
    };
    void a.play().catch(() => {
      if (currentAudio === a) currentAudio = null;
    });
    return true;
  } catch {
    return false;
  }
}

function speakZhWithTts(text: string, rate: number): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const zhVoice =
    voices.find((v) => v.lang?.toLowerCase().startsWith("zh")) ||
    voices.find((v) => /chinese|mandarin/i.test(v.name));
  if (zhVoice) u.voice = zhVoice;
  window.speechSynthesis.speak(u);
  return true;
}

/** Đọc tiếng Trung: có file CosyVoice thì phát file, chưa có thì dùng Web Speech API. */
export function speakZh(text: string, rate = 0.85): boolean {
  if (typeof window === "undefined") return false;
  // Manifest đã tải xong và có câu này -> phát file CosyVoice.
  if (manifestMap) {
    const url = manifestMap.get(normText(text));
    if (url) {
      stopSpeak();
      return playAudioFile(url);
    }
  } else {
    // Chưa tải manifest: tải nền cho lần sau, lần này vẫn đọc bằng TTS.
    void loadManifest();
  }
  return speakZhWithTts(text, rate);
}

/** Đọc tiếng Việt bằng Web Speech API (giọng vi-VN, nếu có). */
export function speakVi(text: string, rate = 0.95): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "vi-VN";
  u.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const viVoice =
    voices.find((v) => v.lang?.toLowerCase().startsWith("vi")) ||
    voices.find((v) => /vietnamese/i.test(v.name));
  if (viVoice) u.voice = viVoice;
  window.speechSynthesis.speak(u);
  return true;
}

export function stopSpeak() {
  stopAudioFile();
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export interface SpeakItem {
  text: string;
  lang: "zh" | "vi";
  rate?: number;
}

export interface SpeakHandle {
  stop: () => void;
}

/** Đọc nối tiếp nhiều câu (tiếng Trung/Việt xen kẽ) mà không cắt ngang nhau.
    Câu tiếng Trung có file CosyVoice thì phát file, chưa có thì dùng TTS.
    Dùng cho bài giảng: gọi onDone khi đọc xong cả lượt. Trả về null nếu
    trình duyệt không hỗ trợ đọc. Dừng giữa chừng bằng handle.stop(). */
export function speakQueue(
  items: SpeakItem[],
  onDone?: () => void
): SpeakHandle | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (items.length === 0) {
    onDone?.();
    return { stop: () => {} };
  }
  void loadManifest(); // tải nền để các câu sau trong lượt có thể dùng file
  const hasTts = "speechSynthesis" in window;
  const voices = hasTts ? window.speechSynthesis.getVoices() : [];
  const pickVoice = (lang: "zh" | "vi") =>
    lang === "zh"
      ? voices.find((v) => v.lang?.toLowerCase().startsWith("zh")) ||
        voices.find((v) => /chinese|mandarin/i.test(v.name))
      : voices.find((v) => v.lang?.toLowerCase().startsWith("vi")) ||
        voices.find((v) => /vietnamese/i.test(v.name));
  let i = 0;
  let cancelled = false;
  let finished = false;
  const finish = () => {
    if (!finished && !cancelled) {
      finished = true;
      onDone?.();
    }
  };
  const speakNext = () => {
    if (cancelled) return;
    if (i >= items.length) {
      finish();
      return;
    }
    const item = items[i];
    i += 1;
    // Câu tiếng Trung có file CosyVoice -> phát file, xong thì đọc câu tiếp.
    if (item.lang === "zh" && manifestMap) {
      const url = manifestMap.get(normText(item.text));
      if (url) {
        stopAudioFile();
        const a = new Audio(url);
        a.playbackRate = 1;
        currentAudio = a;
        const next = () => {
          if (currentAudio === a) currentAudio = null;
          speakNext();
        };
        a.onended = next;
        a.onerror = next;
        void a.play().catch(next);
        return;
      }
    }
    if (!hasTts) {
      speakNext();
      return;
    }
    const u = new SpeechSynthesisUtterance(item.text);
    u.lang = item.lang === "zh" ? "zh-CN" : "vi-VN";
    u.rate = item.rate ?? (item.lang === "zh" ? 0.8 : 0.95);
    const v = pickVoice(item.lang);
    if (v) u.voice = v;
    u.onend = speakNext;
    u.onerror = speakNext;
    window.speechSynthesis.speak(u);
  };
  speakNext();
  return {
    stop: () => {
      cancelled = true;
      stopAudioFile();
      if (hasTts) window.speechSynthesis.cancel();
    },
  };
}
