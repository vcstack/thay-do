/** Đọc tiếng Trung bằng Web Speech API (giọng zh-CN). */
export function speakZh(text: string, rate = 0.85): boolean {
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
    Dùng cho bài giảng: gọi onDone khi đọc xong cả lượt. Trả về null nếu
    trình duyệt không hỗ trợ đọc. Dừng giữa chừng bằng handle.stop(). */
export function speakQueue(
  items: SpeakItem[],
  onDone?: () => void
): SpeakHandle | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }
  if (items.length === 0) {
    onDone?.();
    return { stop: () => {} };
  }
  const voices = window.speechSynthesis.getVoices();
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
      window.speechSynthesis.cancel();
    },
  };
}
