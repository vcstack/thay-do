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

export function stopSpeak() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
