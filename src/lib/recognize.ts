/** Nhận dạng giọng nói bằng Web Speech API của trình duyệt (miễn phí, có sẵn).
* Chỉ chạy trên trình duyệt thật (Chrome/Edge hỗ trợ tốt nhất).
* Chrome dùng dịch vụ nhận dạng của Google nên cần mạng khi nghe. */

interface SpeechRecognitionResultItem {
transcript: string;
confidence: number;
}

interface SpeechRecognitionResult {
0: SpeechRecognitionResultItem;
length: number;
isFinal: boolean;
}

interface SpeechRecognitionEvent {
results: ArrayLike<SpeechRecognitionResult>;
resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
error: string;
message: string;
}

interface SpeechRecognitionInstance {
lang: string;
interimResults: boolean;
maxAlternatives: number;
continuous: boolean;
onresult: ((e: SpeechRecognitionEvent) => void) | null;
onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
onend: (() => void) | null;
start: () => void;
stop: () => void;
abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface WindowWithSpeechRecognition extends Window {
SpeechRecognition?: SpeechRecognitionConstructor;
webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

function getConstructor(): SpeechRecognitionConstructor | null {
if (typeof window === "undefined") return null;
const w = window as unknown as WindowWithSpeechRecognition;
return w.SpeechRecognition?? w.webkitSpeechRecognition?? null;
}

/** Trình duyệt này có hỗ trợ nhận dạng giọng nói không? */
export function isSpeechRecognitionSupported(): boolean {
return getConstructor()!== null;
}

function mapError(code: string): string {
switch (code) {
case "not-allowed":
case "service-not-allowed":
return "Chưa được cấp quyền dùng mic — bấm biểu tượng 🔒/🎤 trên thanh địa chỉ để cho phép mic rồi thử lại.";
case "network":
return "Cần có mạng để nhận dạng giọng nói (Chrome gửi âm thanh lên máy chủ Google) — kiểm tra mạng rồi thử lại.";
case "no-speech":
return "Không nghe thấy bạn nói gì — thử đọc to hơn, gần mic hơn rồi bấm lại.";
case "audio-capture":
return "Không tìm thấy mic trên thiết bị này — kiểm tra mic rồi thử lại.";
case "aborted":
return "Đã dừng nghe.";
default:
return "Không nghe rõ — thử lại hoặc kiểm tra mic rồi bấm lại nhé.";
}
}

/** Mở mic nghe một lần rồi dừng. Trả về hàm stop() để dừng giữa chừng.
* onResult nhận transcript đầy đủ; onError nhận thông báo lỗi tiếng Việt
* đã dịch sẵn; onEnd chạy khi mic đã dừng hẳn (dù nghe được hay không). */
export function recognizeOnce(
lang = "zh-CN",
onResult: (transcript: string) => void,
onError: (msg: string) => void,
onEnd?: () => void
): () => void {
const Ctor = getConstructor();
if (!Ctor) {
onError(
"Trình duyệt này không hỗ trợ nhận dạng giọng nói — hãy dùng Chrome hoặc Edge trên máy tính hoặc điện thoại Android."
);
return () => {};
}
let recog: SpeechRecognitionInstance;
try {
recog = new Ctor();
} catch {
onError("Không bật được mic — thử tải lại trang rồi bấm lại.");
return () => {};
}
let finished = false;
recog.lang = lang;
recog.interimResults = false;
recog.maxAlternatives = 1;
recog.continuous = false;
recog.onresult = (e) => {
if (finished) return;
finished = true;
const transcript = e.results[0]?.[0]?.transcript?? "";
try {
recog.stop();
} catch {
// đã dừng rồi, bỏ qua
}
onResult(transcript);
};
recog.onerror = (e) => {
if (finished) return;
finished = true;
onError(mapError(e.error));
};
recog.onend = () => {
onEnd?.();
};
try {
recog.start();
} catch {
onError("Không bật được mic — thử tải lại trang rồi bấm lại.");
return () => {};
}
return () => {
finished = true;
try {
recog.stop();
} catch {
// đã dừng rồi, bỏ qua
}
};
}

/** Bỏ khoảng trắng và dấu câu (cả Hán lẫn Latin) để so sánh chữ Hán. */
function normalize(s: string): string {
return s.replace(/[\s.,!?;:'"，。！？；：、·…—\-()（）《》「」『』\u3000]/g, "");
}

export interface PronunciationResult {
/** Điểm 0–100: % ký tự Hán đọc đúng vị trí. */
score: number;
/** Trạng thái đúng/sai của từng ký tự trong câu mục tiêu. */
perChar: { ch: string; ok: boolean}[];
}

/** So sánh transcript nghe được với câu mục tiêu, chấm theo từng ký tự Hán.
* So sánh theo vị trí: ký tự thứ i của câu nghe được phải trùng ký tự thứ i
* của câu mục tiêu. Điểm = số ký tự đúng / tổng số ký tự × 100. */
export function scorePronunciation(target: string, heard: string): PronunciationResult {
const t = [...normalize(target)];
const h = [...normalize(heard)];
if (t.length === 0) return { score: 0, perChar: []};
const perChar = t.map((ch, i) => ({ ch, ok: h[i] === ch}));
const correct = perChar.filter((p) => p.ok).length;
return { score: Math.round((correct / t.length) * 100), perChar};
}
