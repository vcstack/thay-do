"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import HanziWriter from "hanzi-writer";
import {
  CLASS_SLOTS,
  DAI_KHOA_HOURS,
  fmtCountdown,
  fmtTime,
  getNextClass,
  type ClassSlot,
} from "@/data/schedule";
import { allVocab, getLesson, getLessonChars, type Lesson } from "@/data/lessons";
import { speakQueue, speakZh, type SpeakHandle, type SpeakItem } from "@/lib/speak";
import {
  isSpeechRecognitionSupported,
  recognizeOnce,
  scorePronunciation,
  type PronunciationResult,
} from "@/lib/recognize";
import { recordDay, recordLesson, recordWriting } from "@/lib/progress";
import {
  randomRemark,
  TEACHER_REMARKS_MISTAKE,
  TEACHER_REMARKS_PRAISE,
  loadStudentNames,
} from "@/data/teacher";

/* ------------------------------------------------------------------ */
/* Nội dung giảng của từng ca — tự viết, dùng từ vựng 20 bài học.      */
/* Key là id của ca trong schedule.ts (vd "Vỡ lòng-0700").             */
/* ------------------------------------------------------------------ */

interface SlotContent {
  teacherSay: string;
  points: string[];
  lessonIds: number[];
  homework: string;
}

const SLOT_CONTENT: Record<string, SlotContent> = {
  "Vỡ lòng-0700": {
    teacherSay:
      "Sáng nay thầy dạy các em chào hỏi cho ra dáng người có học. Gặp ai cũng 你好, đừng có gật đầu rồi đi thẳng như người câm!",
    points: [
      "你好 (nǐ hǎo) — Xin chào, dùng với mọi người.",
      "您好 (nín hǎo) — Xin chào (lịch sự, với người lớn tuổi).",
      "我叫…… (wǒ jiào…) — Tôi tên là…",
      "很高兴认识你 (hěn gāoxìng rènshi nǐ) — Rất vui được gặp bạn.",
    ],
    lessonIds: [1, 2],
    homework: "Tự giới thiệu bản thân bằng 3 câu tiếng Trung trước gương.",
  },
  "Vỡ lòng-1230": {
    teacherSay:
      "Buổi trưa học số đếm và nói về gia đình. Nhớ nhé: số trong tiếng Trung đọc khác tiếng Việt, đừng có đọc nhầm ba thành tám!",
    points: [
      "一 (yī) 二 (èr) 三 (sān) 四 (sì) 五 (wǔ) — Số 1 đến 5.",
      "你家有几口人？(nǐ jiā yǒu jǐ kǒu rén?) — Nhà bạn có mấy người?",
      "我家有四口人。(wǒ jiā yǒu sì kǒu rén.) — Nhà tôi có bốn người.",
      "几 (jǐ) — mấy, bao nhiêu; dùng để hỏi số lượng nhỏ.",
    ],
    lessonIds: [2, 4],
    homework: "Đếm số người trong nhà bằng tiếng Trung rồi nói cho cả nhà nghe.",
  },
  "Vỡ lòng-2000": {
    teacherSay:
      "Tối nay học hỏi giờ giấc. Học xong là biết hỏi 现在几点 rồi đấy, đừng có lúc nào cũng nhìn đồng hồ rồi đoán mò!",
    points: [
      "现在几点？(xiànzài jǐ diǎn?) — Bây giờ mấy giờ?",
      "点 (diǎn) — giờ; 分 (fēn) — phút.",
      "今天 (jīntiān) — hôm nay; 明天 (míngtiān) — ngày mai; 昨天 (zuótiān) — hôm qua.",
      "早上 (zǎoshang) — buổi sáng; 晚上 (wǎnshang) — buổi tối.",
    ],
    lessonIds: [5, 13],
    homework: "Hỏi giờ 5 người trong nhà bằng tiếng Trung.",
  },
  "Vỡ lòng-2130": {
    teacherSay:
      "Khuya rồi mà còn học là giỏi lắm. Tối nay ôn lại bộ thủ: chữ nào cũng có bộ, nhớ bộ là nhớ chữ.",
    points: [
      "日 (rì) — mặt trời, bộ nhật.",
      "月 (yuè) — mặt trăng, bộ nguyệt.",
      "山 (shān) — núi; 水 (shuǐ) — nước.",
      "Chữ ghép: 明 (míng) = 日 + 月 — sáng sủa.",
    ],
    lessonIds: [1, 5],
    homework: "Viết 4 chữ 日月山水, mỗi chữ 5 lần.",
  },
  "HSK 1-0715": {
    teacherSay:
      "Sáng nay học chào hỏi và giới thiệu tên. Tên mình mà nói không chuẩn thì người ta gọi sai cả đời đấy!",
    points: [
      "你叫什么名字？(nǐ jiào shénme míngzi?) — Bạn tên là gì?",
      "我叫…… (wǒ jiào…) — Tôi tên là…",
      "你好 (nǐ hǎo) — Xin chào.",
      "很高兴认识你 (hěn gāoxìng rènshi nǐ) — Rất vui được gặp bạn.",
    ],
    lessonIds: [1, 2],
    homework: "Giới thiệu tên mình và 2 người bạn bằng tiếng Trung.",
  },
  "HSK 1-1245": {
    teacherSay:
      "Trưa nay nói về đất nước và quê quán. 你是哪国人? — hỏi câu này là biết ngay người ta từ đâu tới.",
    points: [
      "你是哪国人？(nǐ shì nǎ guó rén?) — Bạn là người nước nào?",
      "我是越南人。(wǒ shì Yuènán rén.) — Tôi là người Việt Nam.",
      "中国 (Zhōngguó) — Trung Quốc; 越南 (Yuènán) — Việt Nam.",
      "Cấu trúc 是……: 我是中国人。(wǒ shì Zhōngguó rén.) — Tôi là người Trung Quốc.",
    ],
    lessonIds: [3, 7],
    homework: "Hỏi 3 người xem họ là người nước nào.",
  },
  "HSK 1-2015": {
    teacherSay:
      "Tối nay học nói về sở thích và ăn uống. Thích gì thì nói, đừng có ngại — thầy cũng thích ăn lắm!",
    points: [
      "你喜欢什么？(nǐ xǐhuān shénme?) — Bạn thích cái gì?",
      "我喜欢…… (wǒ xǐhuān…) — Tôi thích…",
      "你喝什么？(nǐ hē shénme?) — Bạn uống gì?",
      "你吃什么？(nǐ chī shénme?) — Bạn ăn gì?",
    ],
    lessonIds: [9, 10],
    homework: "Hỏi bạn mình thích ăn gì, uống gì bằng tiếng Trung.",
  },
  "HSK 1-2145": {
    teacherSay:
      "Khuya rồi, ôn lại bài hôm nay bằng hội thoại. Nói trôi chảy cả đoạn mới được đi ngủ đấy nhé!",
    points: [
      "你去哪儿？(nǐ qù nǎr?) — Bạn đi đâu?",
      "我去学校。(wǒ qù xuéxiào.) — Tôi đi học.",
      "你会说汉语吗？(nǐ huì shuō Hànyǔ ma?) — Bạn biết nói tiếng Trung không?",
      "会一点儿。(huì yìdiǎnr.) — Biết một chút.",
    ],
    lessonIds: [6, 8],
    homework: "Đọc to đoạn hội thoại bài 6 và bài 8, mỗi đoạn 3 lần.",
  },
  "HSK 2-0730": {
    teacherSay:
      "Sáng nay học giờ giấc và sinh hoạt hằng ngày. 你几点起床? — thầy dậy từ 5 giờ sáng, còn em?",
    points: [
      "你几点起床？(nǐ jǐ diǎn qǐchuáng?) — Bạn mấy giờ thức dậy?",
      "我七点起床。(wǒ qī diǎn qǐchuáng.) — Tôi 7 giờ thức dậy.",
      "现在几点？(xiànzài jǐ diǎn?) — Bây giờ mấy giờ?",
      "早上 (zǎoshang) — buổi sáng; 晚上 (wǎnshang) — buổi tối.",
    ],
    lessonIds: [5, 13],
    homework: "Kể lịch sinh hoạt một ngày của mình bằng tiếng Trung.",
  },
  "HSK 2-1300": {
    teacherSay:
      "Trưa nay học đi lại và phương tiện. Đi học bằng gì cũng được, miễn là tới lớp đúng giờ!",
    points: [
      "你怎么去学校？(nǐ zěnme qù xuéxiào?) — Bạn đi đến trường bằng gì?",
      "我坐公共汽车去。(wǒ zuò gōnggòng qìchē qù.) — Tôi đi xe buýt.",
      "走路 (zǒulù) — đi bộ; 骑自行车 (qí zìxíngchē) — đi xe đạp.",
      "怎么 (zěnme) — như thế nào, bằng cách nào.",
    ],
    lessonIds: [6, 14],
    homework: "Hỏi 3 người xem họ đi làm, đi học bằng gì.",
  },
  "HSK 2-2030": {
    teacherSay:
      "Tối nay học nói cảm nhận: thấy thế nào thì nói thế ấy, đừng có khen bừa!",
    points: [
      "你觉得怎么样？(nǐ juéde zěnmeyàng?) — Bạn thấy thế nào?",
      "很好 (hěn hǎo) — rất tốt; 不错 (búcuò) — không tệ.",
      "不太好 (bú tài hǎo) — không tốt lắm.",
      "觉得 (juéde) — cảm thấy, cho rằng.",
    ],
    lessonIds: [15, 17],
    homework: "Nhận xét 3 món ăn bằng tiếng Trung: ngon, dở, bình thường.",
  },
  "HSK 2-2200": {
    teacherSay:
      "Khuya rồi, ôn tập HSK 2: nơi ở và việc đang làm. Học xong buổi này là lên HSK 3 được rồi!",
    points: [
      "你住在哪儿？(nǐ zhù zài nǎr?) — Bạn ở đâu?",
      "你认识他吗？(nǐ rènshi tā ma?) — Bạn có biết anh ấy không?",
      "你在做什么？(nǐ zài zuò shénme?) — Bạn đang làm gì?",
      "我在学习。(wǒ zài xuéxí.) — Tôi đang học.",
    ],
    lessonIds: [11, 12],
    homework: "Viết đoạn văn ngắn 5 câu giới thiệu nơi ở và việc đang làm.",
  },
  "HSK 3-0745": {
    teacherSay:
      "Sáng nay học về nơi ở và người quen. 你住在哪儿? 你认识他吗? — hai câu này đi đâu cũng dùng được.",
    points: [
      "你住在哪儿？(nǐ zhù zài nǎr?) — Bạn ở đâu?",
      "我住在…… (wǒ zhù zài…) — Tôi ở…",
      "你认识他吗？(nǐ rènshi tā ma?) — Bạn có biết anh ấy không?",
      "认识 (rènshi) — quen biết; 不认识 (bú rènshi) — không quen.",
    ],
    lessonIds: [11, 16],
    homework: "Giới thiệu nơi ở và 2 người quen bằng tiếng Trung.",
  },
  "HSK 3-1315": {
    teacherSay:
      "Trưa nay học nói về cuối tuần và kế hoạch. Cuối tuần làm gì thì kể cho thầy nghe, đừng có nói là ngủ cả ngày!",
    points: [
      "你周末做什么？(nǐ zhōumò zuò shénme?) — Cuối tuần bạn làm gì?",
      "我去看电影。(wǒ qù kàn diànyǐng.) — Tôi đi xem phim.",
      "你想去哪里？(nǐ xiǎng qù nǎli?) — Bạn muốn đi đâu?",
      "想 (xiǎng) — muốn, nghĩ; 周末 (zhōumò) — cuối tuần.",
    ],
    lessonIds: [18, 19],
    homework: "Kể kế hoạch cuối tuần của mình bằng 5 câu tiếng Trung.",
  },
  "HSK 3-2045": {
    teacherSay:
      "Tối nay học nói mong muốn và dự định. Muốn gì thì nói ra, thầy ủng hộ hết!",
    points: [
      "你想去哪里？(nǐ xiǎng qù nǎli?) — Bạn muốn đi đâu?",
      "我想去中国。(wǒ xiǎng qù Zhōngguó.) — Tôi muốn đi Trung Quốc.",
      "我想吃什么？(wǒ xiǎng chī shénme?) — Tôi muốn ăn gì?",
      "想 (xiǎng) + động từ — muốn làm gì đó.",
    ],
    lessonIds: [19, 20],
    homework: "Viết 5 câu về nơi muốn đi và món muốn ăn.",
  },
  "HSK 3-2215": {
    teacherSay:
      "Buổi cuối HSK 3 rồi! Ôn lại hết: chào hỏi, giới thiệu, hỏi đường, nói mong muốn — thi HSK 3 không còn sợ nữa!",
    points: [
      "你好 (nǐ hǎo) — Xin chào; 谢谢 (xièxie) — Cảm ơn; 再见 (zàijiàn) — Tạm biệt.",
      "你叫什么名字？(nǐ jiào shénme míngzi?) — Bạn tên là gì?",
      "你想去哪里？(nǐ xiǎng qù nǎli?) — Bạn muốn đi đâu?",
      "Ôn lại: 是, 在, 想, 会 — 4 chữ quan trọng nhất HSK 3.",
    ],
    lessonIds: [16, 20],
    homework: "Làm lại đề thi thử HSK 3 ở Trường thi, đạt 80% thì thầy thưởng.",
  },
};

const SLOT_CONTENT_FALLBACK: SlotContent = {
  teacherSay:
    "Hôm nay thầy ôn lại bài cũ cho chắc. Học chậm mà chắc, đừng có vội!",
  points: [
    "你好 (nǐ hǎo) — Xin chào.",
    "谢谢 (xièxie) — Cảm ơn.",
    "再见 (zàijiàn) — Tạm biệt.",
  ],
  lessonIds: [1, 2],
  homework: "Đọc lại bài 1 và bài 2, đọc to mỗi bài 3 lần.",
};

function getSlotContent(slot: ClassSlot): SlotContent {
  return SLOT_CONTENT[slot.id] ?? SLOT_CONTENT_FALLBACK;
}

type SlotStatus = { kind: "live" | "next" | "ended"; mins: number };

function slotStatus(s: ClassSlot, now: Date): SlotStatus {
  const start = new Date(now);
  start.setHours(s.hour, s.minute, 0, 0);
  const end = new Date(start.getTime() + s.durationMin * 60000);
  if (now >= start && now < end)
    return { kind: "live", mins: Math.round((end.getTime() - now.getTime()) / 60000) };
  if (now < start)
    return { kind: "next", mins: Math.round((start.getTime() - now.getTime()) / 60000) };
  return { kind: "ended", mins: 0 };
}

/** "buổi sáng" / "buổi trưa" / "buổi tối" / "buổi khuya" từ tiêu đề ca. */
function timeOfDay(s: ClassSlot): string {
  const parts = s.title.split("—");
  return parts.length > 1 ? parts[1].trim() : s.title;
}

/** Ca Đại khoa tiếp theo (đầu mỗi giờ 08:00–23:00, mỗi ca 15 phút). */
function nextDaiKhoa(now: Date): { hour: number; live: boolean; msUntil: number } {
  for (const h of DAI_KHOA_HOURS) {
    const start = new Date(now);
    start.setHours(h, 0, 0, 0);
    const end = new Date(start.getTime() + 15 * 60000);
    if (now >= start && now < end) return { hour: h, live: true, msUntil: 0 };
    if (now < start) return { hour: h, live: false, msUntil: start.getTime() - now.getTime() };
  }
  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  start.setHours(DAI_KHOA_HOURS[0], 0, 0, 0);
  return { hour: DAI_KHOA_HOURS[0], live: false, msUntil: start.getTime() - now.getTime() };
}

const TRACKS_ORDER = ["Vỡ lòng", "HSK 1", "HSK 2", "HSK 3"];

const STEPS = [
  { n: 1, label: "Thầy giảng", icon: "👨‍🏫" },
  { n: 2, label: "Đọc to", icon: "🎤" },
  { n: 3, label: "Viết chữ", icon: "✍️" },
];

type QuizState = "idle" | "quizzing" | "done";

export default function LopHocPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});

  // --- Luồng học 3 bước ---
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);

  // Bước 1: nghe thầy giảng
  const speakHandleRef = useRef<SpeakHandle | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [listened, setListened] = useState(false);
  const [ttsError, setTtsError] = useState("");

  // Bước 2: đọc to chấm phát âm
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [listening, setListening] = useState(false);
  const [heardText, setHeardText] = useState("");
  const [pronResult, setPronResult] = useState<PronunciationResult | null>(null);
  const [pronError, setPronError] = useState("");
  const [step2Passed, setStep2Passed] = useState(false);
  const [step2Skipped, setStep2Skipped] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  // Bước 3: viết chữ của buổi (nhúng Hanzi Writer trực tiếp)
  const writerContainerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [writeIdx, setWriteIdx] = useState(0);
  const [doneChars, setDoneChars] = useState<string[]>([]);
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [mistakes, setMistakes] = useState(0);
  const [doneStrokes, setDoneStrokes] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [writeRemark, setWriteRemark] = useState("");
  const [completed, setCompleted] = useState(false);

  // Ca đang chọn (mặc định: ca đầu tiên — Vỡ lòng 07:00 — để vào là học
  // được ngay. Người dùng tự chọn ca khác; không tự đổi ca theo giờ).
  const selected: ClassSlot =
    (selectedId ? CLASS_SLOTS.find((s) => s.id === selectedId) : undefined) ??
    CLASS_SLOTS[0];
  const content = getSlotContent(selected);
  const lectureLessons: Lesson[] = content.lessonIds
    .map((id) => getLesson(id))
    .filter((l): l is Lesson => Boolean(l));
  const sentencePool = lectureLessons.flatMap((l) => l.sentences);
  const sentence =
    sentencePool.length > 0 ? sentencePool[sentenceIdx % sentencePool.length] : undefined;
  const writeChars = lectureLessons[0] ? getLessonChars(lectureLessons[0]).slice(0, 5) : [];
  const writeChar = writeChars[writeIdx] ?? "你";
  const writeVocab = allVocab.find((v) => v.zh.includes(writeChar));
  const allWriteDone =
    writeChars.length > 0 && writeChars.every((c) => doneChars.includes(c));

  const next = now ? getNextClass(now) : null;
  const dk = now ? nextDaiKhoa(now) : null;
  const selState = now ? slotStatus(selected, now) : null;
  const seated = Object.entries(studentNames).filter(([, n]) => n.trim() !== "");

  useEffect(() => {
    // Giờ hiện tại + tên học sinh (localStorage) chỉ có ở client — khởi tạo
    // trong effect để tránh lệch hydration. Giờ giấc CHỈ để hiển thị tham
    // khảo, không dùng để chọn ca hay chặn việc học: ca mặc định luôn là
    // ca đầu tiên (Vỡ lòng 07:00) cho tới khi người dùng tự bấm chọn ca khác.
    const d = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(d);
    const t = setInterval(() => setNow(new Date()), 30000);
    setStudentNames(loadStudentNames());
    return () => clearInterval(t);
  }, []);

  // Tạo Hanzi Writer 1 lần khi mount (cần DOM + CDN, chỉ chạy ở client).
  useEffect(() => {
    if (!writerContainerRef.current) return;
    const el = writerContainerRef.current;
    let writer: HanziWriter | null = null;
    try {
      writer = HanziWriter.create(el, writeChar, {
        width: 300,
        height: 300,
        padding: 16,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        radicalColor: "#15803d",
      });
      writerRef.current = writer;
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadError(true);
    }
    return () => {
      try {
        writer?.cancelQuiz();
      } catch {
        /* ignore */
      }
      el.innerHTML = "";
      writerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Đổi chữ viết
  useEffect(() => {
    const writer = writerRef.current;
    if (!writer) return;
    try {
      writer.cancelQuiz();
    } catch {
      /* ignore */
    }
    setQuizState("idle");
    setMistakes(0);
    setDoneStrokes(0);
    setWriteRemark("");
    try {
      writer.setCharacter(writeChar);
      const data = (
        writer as unknown as { _character?: { strokes?: unknown[] } }
      )._character;
      if (data?.strokes) setTotalStrokes(data.strokes.length);
    } catch {
      setLoadError(true);
    }
  }, [writeChar]);

  // Viết xong hết các chữ của buổi → hoàn thành, ghi vào Sổ học trò.
  useEffect(() => {
    if (allWriteDone && !completed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompleted(true);
      content.lessonIds.forEach((id) => recordLesson(id));
      recordDay();
    }
  }, [allWriteDone, completed, content.lessonIds]);

  /** Đổi ca học → làm lại luồng từ bước 1. */
  function selectSlot(id: string) {
    if (id === selectedId) return;
    speakHandleRef.current?.stop();
    setSpeaking(false);
    stopRef.current?.();
    setSelectedId(id);
    setStep(1);
    setMaxStep(1);
    setListened(false);
    setTtsError("");
    setSentenceIdx(0);
    setHeardText("");
    setPronResult(null);
    setPronError("");
    setStep2Passed(false);
    setStep2Skipped(false);
    setWriteIdx(0);
    setDoneChars([]);
    setQuizState("idle");
    setMistakes(0);
    setDoneStrokes(0);
    setWriteRemark("");
    setCompleted(false);
  }

  function goToStep(n: number) {
    if (n < 1 || n > 3 || n > maxStep) return;
    setStep(n);
  }

  function advanceStep() {
    const n = Math.min(3, step + 1);
    setStep(n);
    setMaxStep((m) => Math.max(m, n));
  }

  /* ---------------- Bước 1: nghe thầy giảng ---------------- */
  function startLectureListen() {
    const firstLesson = lectureLessons[0];
    const vocab = firstLesson ? firstLesson.vocab.slice(0, 5) : [];
    const items: SpeakItem[] = [
      { lang: "vi", text: content.teacherSay },
      ...vocab.flatMap((v): SpeakItem[] => [
        { lang: "zh", text: v.zh },
        { lang: "vi", text: `${v.py} nghĩa là ${v.vi}` },
      ]),
      { lang: "vi", text: "Hết phần giảng. Bấm Tiếp tục để sang phần đọc to." },
    ];
    const handle = speakQueue(items, () => {
      setSpeaking(false);
      setListened(true);
    });
    if (!handle) {
      setTtsError(
        "Trình duyệt này không có giọng đọc — cứ đọc chữ trên bảng nhé, bấm Tiếp tục vẫn được."
      );
      return;
    }
    speakHandleRef.current = handle;
    setTtsError("");
    setSpeaking(true);
  }

  function stopLectureListen() {
    speakHandleRef.current?.stop();
    setSpeaking(false);
  }

  /* ---------------- Bước 2: đọc to chấm phát âm ---------------- */
  function pickAnotherSentence() {
    setSentenceIdx((prev) => {
      if (sentencePool.length <= 1) return 0;
      let n = prev;
      while (n === prev) n = Math.floor(Math.random() * sentencePool.length);
      return n;
    });
    setHeardText("");
    setPronResult(null);
    setPronError("");
  }

  function startReading() {
    if (!sentence) return;
    if (!isSpeechRecognitionSupported()) {
      setPronError(
        "Trình duyệt này không hỗ trợ nhận dạng giọng nói — hãy dùng Chrome hoặc Edge trên máy tính hoặc điện thoại Android."
      );
      return;
    }
    setPronError("");
    setHeardText("");
    setPronResult(null);
    setListening(true);
    stopRef.current = recognizeOnce(
      "zh-CN",
      (t) => {
        setHeardText(t);
        const r = scorePronunciation(sentence.zh, t);
        setPronResult(r);
        if (r.score >= 70) setStep2Passed(true);
      },
      (msg) => setPronError(msg),
      () => setListening(false)
    );
  }

  const teacherPronRemark =
    pronResult === null
      ? ""
      : pronResult.score >= 90
        ? "Giỏi quá! Phát âm chuẩn như người bản xứ rồi."
        : pronResult.score >= 70
          ? "Khá rồi, còn vài chữ chưa chuẩn — đọc lại mấy chữ đỏ nhé."
          : "Đọc lại chậm hơn nhé, từng chữ một, thầy nghe lại cho.";

  /* ---------------- Bước 3: viết chữ ---------------- */
  function showWriteDemo() {
    const writer = writerRef.current;
    if (!writer) return;
    setQuizState("idle");
    writer.animateCharacter();
  }

  function startWriteQuiz() {
    const writer = writerRef.current;
    if (!writer) return;
    setQuizState("quizzing");
    setMistakes(0);
    setDoneStrokes(0);
    setWriteRemark("");
    writer.quiz({
      onMistake: () => {
        setMistakes((m) => m + 1);
        setWriteRemark(randomRemark(TEACHER_REMARKS_MISTAKE));
      },
      onCorrectStroke: (d) => setDoneStrokes(d.strokeNum + 1),
      onComplete: () => {
        setQuizState("done");
        setWriteRemark((r) => r || randomRemark(TEACHER_REMARKS_PRAISE));
        recordWriting(writeChar);
        recordDay();
        setDoneChars((prev) =>
          prev.includes(writeChar) ? prev : [...prev, writeChar]
        );
      },
    });
  }

  function nextWriteChar() {
    const nextIdx = writeChars.findIndex((c) => !doneChars.includes(c));
    if (nextIdx >= 0) setWriteIdx(nextIdx);
  }

  const remainingChars = writeChars.filter((c) => !doneChars.includes(c));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">🏫 Lớp học</h1>
      <p className="mt-2 text-ink-soft">
        Vào là học ngay — không cần chờ đúng giờ, không có lớp nào bị khóa.
        Chọn bất kỳ lớp nào dưới đây (Vỡ lòng, HSK 1, HSK 2, HSK 3) rồi học
        luôn 3 bước: thầy giảng → đọc to chấm phát âm → viết chữ. Giờ giấc
        trong thời khóa biểu chỉ để tham khảo theo lịch học thật của trường.
      </p>

      {/* Lớp đang mở / sắp mở */}
      {now && next && (
        <div
          className={`mt-4 rounded-2xl border-2 p-4 text-sm font-bold shadow ${
            next.live
              ? "border-vermilion bg-vermilion/10 text-vermilion"
              : "border-gold/40 bg-cream text-ink"
          }`}
        >
          {next.live ? (
            <>
              🔴 Đang trong giờ học thật: {next.slot.track} — {fmtTime(next.slot.hour, next.slot.minute)}{" "}
              ({next.slot.title}) — chỉ để tham khảo, học ca nào cũng được.
            </>
          ) : (
            <>
              🕗 Ca tiếp theo theo giờ thật: {next.slot.track} — {fmtTime(next.slot.hour, next.slot.minute)} (
              {next.slot.title}) — còn {fmtCountdown(next.msUntil)} (chỉ để tham khảo, học ngay ca nào cũng được).
            </>
          )}
        </div>
      )}

      {/* Thời khóa biểu hôm nay */}
      <h2 id="thoi-khoa-bieu" className="mt-8 scroll-mt-20 text-xl font-black text-ink">
        🗓️ Thời khóa biểu hôm nay
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Bấm vào ca nào cũng học được ngay — không cần chờ đúng giờ, không có
        ca nào bị khóa. Ca đang trong giờ học thật có dấu 🔴 để dễ nhận biết.
      </p>
      {TRACKS_ORDER.map((track) => (
        <div key={track} className="mt-4">
          <h3 className="text-base font-extrabold text-vermilion">{track}</h3>
          <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
            {CLASS_SLOTS.filter((s) => s.track === track).map((s) => {
              const st = now ? slotStatus(s, now) : null;
              const isSel = selected.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => selectSlot(s.id)}
                  className={`rounded-2xl border-2 p-3 text-left shadow transition hover:-translate-y-0.5 ${
                    isSel
                      ? "border-vermilion bg-vermilion/10"
                      : st?.kind === "live"
                        ? "border-vermilion/60 bg-cream"
                        : "border-gold/40 bg-cream"
                  }`}
                >
                  <p className="text-xl font-black text-ink">
                    {fmtTime(s.hour, s.minute)}
                  </p>
                  <p className="text-xs font-bold text-ink-soft">{timeOfDay(s)}</p>
                  <p className="mt-1 text-xs font-bold">
                    {st &&
                      (st.kind === "live" ? (
                        <span className="text-red-600">🔴 Đang mở — còn {st.mins} phút</span>
                      ) : st.kind === "next" ? (
                        <span className="text-leaf">
                          🕗 Sắp mở — còn {fmtCountdown(st.mins * 60000)}
                        </span>
                      ) : (
                        <span className="text-ink-soft">Đã qua giờ thật hôm nay</span>
                      ))}
                  </p>
                  {isSel ? (
                    <span className="mt-2 inline-block rounded-full bg-vermilion px-2 py-0.5 text-xs font-bold text-cream">
                      👈 Đang học buổi này
                    </span>
                  ) : (
                    <span className="mt-2 inline-block text-xs font-black text-vermilion">
                      📖 Bấm để học ngay
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Đại khoa */}
      <div className="mt-4 rounded-2xl border-2 border-gold/40 bg-cream p-4 shadow">
        <p className="text-base font-extrabold text-vermilion">
          📝 Đại khoa — đầu mỗi giờ, 08:00–23:00
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Đề ngắn 5 câu, cả trường cùng làm trong 15 phút đầu giờ.{" "}
          {dk &&
            (dk.live ? (
              <span className="font-bold text-red-600">
                🔴 Đang mở ca {String(dk.hour).padStart(2, "0")}:00 — vào làm ngay!
              </span>
            ) : (
              <span>
                Ca tiếp theo: {String(dk.hour).padStart(2, "0")}:00 — còn{" "}
                {fmtCountdown(dk.msUntil)}.
              </span>
            ))}
        </p>
        <Link
          href="/thi-hsk"
          className="mt-3 inline-block rounded-full bg-vermilion px-4 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
        >
          📝 Vào Trường thi làm đề ngắn →
        </Link>
      </div>

      {/* Thanh tiến trình 3 bước */}
      <div className="mt-8">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const done = s.n < step;
            const current = s.n === step;
            const locked = s.n > maxStep;
            return (
              <div key={s.n} className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => goToStep(s.n)}
                  disabled={locked}
                  className={`flex flex-1 flex-col items-center rounded-2xl border-2 px-2 py-3 text-center transition ${
                    current
                      ? "border-vermilion bg-vermilion text-cream shadow"
                      : done
                        ? "border-leaf bg-leaf-soft/30 text-leaf"
                        : locked
                          ? "border-gold/30 bg-cream text-ink-soft opacity-60"
                          : "border-gold/40 bg-cream text-ink hover:border-vermilion"
                  }`}
                >
                  <span className="text-xl">
                    {done ? "✅" : s.icon}
                  </span>
                  <span className="mt-1 text-xs font-black">
                    Bước {s.n}: {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <span className="text-lg font-black text-gold">→</span>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center text-xs text-ink-soft">
          Học theo trình tự như trong trường thật: thầy giảng → đọc to chấm
          phát âm → viết chữ của buổi. Xong cả 3 bước là hoàn thành buổi học.
        </p>
      </div>

      {/* ============ Bước 1: Thầy giảng ============ */}
      {step === 1 && (
        <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-vermilion text-4xl shadow">
              👨‍🏫
            </span>
            <div>
              <p className="text-xl font-black text-vermilion">Thầy Đồ giảng bài</p>
              <p className="text-sm font-bold text-ink">
                {selected.track} — {fmtTime(selected.hour, selected.minute)} (
                {timeOfDay(selected)})
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                {selState?.kind === "live"
                  ? `🔴 Đang trong giờ học thật — còn ${selState.mins} phút nữa tan học.`
                  : selState?.kind === "next"
                    ? `🕗 Ca này bắt đầu lúc ${fmtTime(selected.hour, selected.minute)} theo giờ thật — nhưng học ngay bây giờ cũng được, không cần chờ.`
                    : "Ca này đã qua giờ học thật hôm nay — học lại bất cứ lúc nào cũng được."}
              </p>
            </div>
          </div>

          <blockquote className="mt-4 rounded-xl bg-gold-soft/30 p-4 text-base leading-relaxed text-ink">
            “{content.teacherSay}”
          </blockquote>

          <div className="mt-4 flex flex-wrap gap-2">
            {speaking ? (
              <button
                onClick={stopLectureListen}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-cream shadow hover:bg-red-600"
              >
                ⏹️ Dừng nghe giảng
              </button>
            ) : (
              <button
                onClick={startLectureListen}
                className="rounded-full bg-vermilion px-4 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
              >
                🔊 Nghe thầy giảng
              </button>
            )}
            {listened && (
              <span className="self-center rounded-full bg-leaf-soft/40 px-3 py-1 text-sm font-bold text-leaf">
                ✅ Đã nghe xong phần giảng
              </span>
            )}
          </div>
          {ttsError && (
            <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
              {ttsError}
            </p>
          )}

          <h3 className="mt-5 text-base font-extrabold text-ink">📌 Nội dung buổi học</h3>
          <ul className="mt-2 space-y-2">
            {content.points.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink">
                <span className="text-vermilion">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          {lectureLessons.length > 0 && (
            <>
              <h3 className="mt-5 text-base font-extrabold text-ink">📖 Bài học liên quan</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {lectureLessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/bai-hoc/${l.id}`}
                    className="rounded-full border-2 border-gold bg-white px-3 py-1.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                  >
                    Bài {l.id}: {l.title} — {l.titleVi}
                  </Link>
                ))}
              </div>
            </>
          )}

          <p className="mt-5 rounded-xl bg-leaf-soft/30 p-3 text-sm font-bold text-leaf">
            📝 Bài tập về nhà: {content.homework}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={advanceStep}
              className="rounded-full bg-vermilion px-5 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
            >
              Tiếp tục sang Đọc to →
            </button>
            <Link
              href="/doc-truyen"
              className="rounded-full border-2 border-gold bg-cream px-4 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
            >
              📚 Đọc truyện
            </Link>
          </div>
        </div>
      )}

      {/* ============ Bước 2: Đọc to chấm phát âm ============ */}
      {step === 2 && (
        <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
          <h2 className="text-lg font-extrabold text-vermilion">🎤 Bước 2 — Đọc to chấm phát âm</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Thầy đưa một câu mẫu trong bài của buổi này — nghe mẫu rồi đọc to,
            thầy chấm từng chữ cho. Đạt từ 70% trở lên thì qua bước 3.
          </p>

          {sentence ? (
            <>
              <p className="mt-4 text-center text-3xl font-black leading-relaxed text-ink">
                {sentence.zh}
              </p>
              <p className="mt-1 text-center text-sm font-semibold text-leaf">{sentence.py}</p>
              <p className="mt-1 text-center text-sm text-ink-soft">{sentence.vi}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => speakZh(sentence.zh)}
                  className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                >
                  🔊 Nghe mẫu
                </button>
                {listening ? (
                  <button
                    onClick={() => stopRef.current?.()}
                    className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-cream shadow hover:bg-red-600"
                  >
                    ⏹️ Dừng nghe
                  </button>
                ) : (
                  <button
                    onClick={startReading}
                    className="rounded-full bg-vermilion px-4 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
                  >
                    🎤 Đọc to
                  </button>
                )}
                <button
                  onClick={pickAnotherSentence}
                  disabled={listening}
                  className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40 disabled:opacity-50"
                >
                  🔀 Đổi câu khác
                </button>
              </div>

              {listening && (
                <p className="mt-3 text-center text-sm font-bold text-vermilion">
                  🎤 Đang nghe… đọc to câu trên đi.
                </p>
              )}
              {pronError && (
                <p className="mt-3 rounded-xl bg-red-50 p-3 text-center text-sm font-semibold text-red-600">
                  {pronError}
                </p>
              )}
              {heardText && pronResult && (
                <div className="mt-4 rounded-xl bg-gold-soft/30 p-4">
                  <p className="text-sm text-ink-soft">
                    Thầy nghe được: <span className="font-bold text-ink">“{heardText}”</span>
                  </p>
                  <p className="mt-2 text-center text-3xl font-black text-vermilion">
                    {pronResult.score}%
                  </p>
                  <p className="mt-2 text-center text-2xl font-black leading-relaxed">
                    {pronResult.perChar.map((p, i) => (
                      <span
                        key={i}
                        className={p.ok ? "text-leaf" : "text-red-600 underline"}
                        title={p.ok ? "Đúng" : "Chưa chuẩn"}
                      >
                        {p.ch}
                      </span>
                    ))}
                  </p>
                  <p className="mt-2 text-center text-sm text-ink-soft">
                    <span className="font-bold text-leaf">■ Chữ xanh: đúng</span>
                    {" · "}
                    <span className="font-bold text-red-600">■ Chữ đỏ: chưa chuẩn</span>
                  </p>
                  <blockquote className="mt-3 rounded-xl bg-white/70 p-3 text-center text-base text-ink">
                    👨‍🏫 “{teacherPronRemark}”
                  </blockquote>
                  {step2Passed && (
                    <p className="mt-3 text-center text-sm font-black text-leaf">
                      ✅ Đạt từ 70% — qua được bước 3 rồi!
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="mt-4 text-center text-sm text-ink-soft">
              Buổi này chưa có câu mẫu — bấm Bỏ qua để sang bước 3.
            </p>
          )}

          <p className="mt-4 text-center text-xs text-ink-soft">
            Chấm bằng nhận dạng giọng nói của trình duyệt, không phải AI chuyên
            nghiệp — chỉ để tham khảo.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => goToStep(1)}
              className="rounded-full border-2 border-gold bg-cream px-4 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
            >
              ← Quay lại bước 1
            </button>
            <button
              onClick={advanceStep}
              disabled={!step2Passed && !step2Skipped}
              className="rounded-full bg-vermilion px-5 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark disabled:opacity-50"
            >
              Tiếp tục sang Viết chữ →
            </button>
            {!step2Passed && (
              <button
                onClick={() => setStep2Skipped(true)}
                className="rounded-full border-2 border-gold bg-cream px-4 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
              >
                ⏭ Bỏ qua (không có mic)
              </button>
            )}
            {step2Skipped && (
              <span className="self-center text-sm font-bold text-ink-soft">
                Đã bỏ qua phần đọc — bấm Tiếp tục để viết chữ.
              </span>
            )}
          </div>
        </div>
      )}

      {/* ============ Bước 3: Viết chữ của buổi ============ */}
      {step === 3 && (
        <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
          <h2 className="text-lg font-extrabold text-vermilion">✍️ Bước 3 — Viết chữ của buổi</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Viết {writeChars.length} chữ trong bài của buổi này ({doneChars.length}/
            {writeChars.length} chữ đã xong) — xem thầy viết mẫu rồi tô theo
            từng nét, sai đâu thầy chấm đó.
          </p>

          {completed ? (
            <div className="mt-5 rounded-2xl border-2 border-leaf bg-leaf-soft/20 p-6 text-center">
              <p className="text-4xl">🎉</p>
              <p className="mt-2 text-2xl font-black text-leaf">Hoàn thành buổi học!</p>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                Bạn đã học xong buổi {selected.track} — {fmtTime(selected.hour, selected.minute)}:
                nghe thầy giảng, đọc to đạt yêu cầu và viết xong {writeChars.length} chữ.
                Thầy đã ghi buổi này vào Sổ học trò rồi.
              </p>
              <p className="mt-3 rounded-xl bg-white/70 p-3 text-sm font-bold text-leaf">
                📝 Bài tập về nhà: {content.homework}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link
                  href="/so-hoc-tro"
                  className="rounded-full bg-leaf px-5 py-2.5 text-sm font-bold text-cream shadow hover:bg-leaf/90"
                >
                  📒 Xem Sổ học trò
                </Link>
                <a
                  href="#thoi-khoa-bieu"
                  className="rounded-full border-2 border-gold bg-cream px-4 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                >
                  🗓️ Học ca khác
                </a>
                <Link
                  href="/luyen-viet"
                  className="rounded-full border-2 border-gold bg-cream px-4 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                >
                  ✍️ Luyện viết thêm
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Chọn chữ */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {writeChars.map((c, i) => (
                  <button
                    key={c}
                    onClick={() => setWriteIdx(i)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-2xl font-black transition ${
                      i === writeIdx
                        ? "border-vermilion bg-vermilion text-cream shadow"
                        : doneChars.includes(c)
                          ? "border-leaf bg-leaf-soft/30 text-leaf"
                          : "border-gold/50 bg-white text-ink hover:border-vermilion"
                    }`}
                  >
                    {doneChars.includes(c) ? "✓" : c}
                  </button>
                ))}
              </div>

              <div className="mt-4 text-center">
                <p className="text-4xl font-black text-ink">{writeChar}</p>
                {writeVocab && (
                  <p className="mt-1 text-sm text-ink-soft">
                    {writeVocab.py} — {writeVocab.vi}
                    {writeVocab.zh !== writeChar && ` (trong từ “${writeVocab.zh}”)`}
                  </p>
                )}
              </div>

              <div className="mt-4 flex justify-center">
                <div
                  ref={writerContainerRef}
                  className="rounded-xl border-2 border-dashed border-gold/60 bg-[#fffdf4]"
                  style={{ width: 300, height: 300 }}
                />
              </div>

              {loadError && (
                <p className="mt-3 rounded-lg bg-red-100 p-3 text-sm font-semibold text-red-700">
                  Không tải được dữ liệu nét chữ (cần mạng để tải từ CDN). Kiểm
                  tra mạng rồi tải lại trang.
                </p>
              )}

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={showWriteDemo}
                  className="rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                >
                  ▶ Xem thầy viết
                </button>
                <button
                  onClick={startWriteQuiz}
                  disabled={quizState === "quizzing" || doneChars.includes(writeChar)}
                  className="rounded-full bg-vermilion px-4 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark disabled:opacity-50"
                >
                  {quizState === "quizzing"
                    ? "Đang tô…"
                    : doneChars.includes(writeChar)
                      ? "✅ Chữ này xong rồi"
                      : "✍️ Bắt đầu tô"}
                </button>
                {quizState === "done" && remainingChars.length > 0 && (
                  <button
                    onClick={nextWriteChar}
                    className="rounded-full bg-leaf px-4 py-2 text-sm font-bold text-cream shadow hover:bg-leaf/90"
                  >
                    Chữ tiếp theo →
                  </button>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-bold">
                <span>
                  Nét đã viết đúng: {doneStrokes}
                  {totalStrokes > 0 ? ` / ${totalStrokes}` : ""}
                </span>
                <span className={mistakes > 0 ? "text-red-600" : "text-ink-soft"}>
                  Viết sai: {mistakes} lần
                </span>
                {quizState === "done" && (
                  <span className="rounded-full bg-leaf px-3 py-1 text-cream">
                    🎉 Xong chữ này!
                  </span>
                )}
              </div>
              {quizState === "quizzing" && (
                <p className="mt-2 text-center text-sm text-ink-soft">
                  Tô theo viền mờ — viết đúng thứ tự nét thì mới qua nét tiếp theo.
                </p>
              )}
              {writeRemark && (
                <p className="mt-3 rounded-xl bg-gold-soft/30 p-3 text-center text-sm leading-relaxed text-ink">
                  <span className="font-black text-vermilion">👨‍🏫 Thầy nói:</span> “{writeRemark}”
                </p>
              )}
              {loadError && (
                <button
                  onClick={() => {
                    setCompleted(true);
                    content.lessonIds.forEach((id) => recordLesson(id));
                    recordDay();
                  }}
                  className="mt-4 w-full rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                >
                  Không tải được chữ? Bỏ qua phần viết →
                </button>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => goToStep(2)}
                  className="rounded-full border-2 border-gold bg-cream px-4 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                >
                  ← Quay lại bước 2
                </button>
                <Link
                  href="/luyen-viet"
                  className="rounded-full border-2 border-gold bg-cream px-4 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
                >
                  ✍️ Mở trang luyện viết đầy đủ
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* Thầy nhận xét */}
      <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
        <h2 className="text-lg font-extrabold text-vermilion">💬 Thầy nhận xét</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Thầy Đồ nổi tiếng là chấm không nể ai. Viết sai thì nghe thầy chê một
          câu rồi viết lại cho đẹp.
        </p>
        <button
          onClick={() => setRemark(randomRemark(TEACHER_REMARKS_MISTAKE))}
          className="mt-3 rounded-full bg-vermilion px-4 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
        >
          🎲 Nghe thầy chê một câu
        </button>
        {remark && (
          <blockquote className="mt-3 rounded-xl bg-gold-soft/30 p-4 text-base text-ink">
            “{remark}”
          </blockquote>
        )}
      </div>

      {/* Học sinh trong lớp */}
      <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
        <h2 className="text-lg font-extrabold text-vermilion">🎒 Học sinh trong lớp</h2>
        {seated.length > 0 ? (
          <>
            <p className="mt-1 text-sm text-ink-soft">
              Các bạn đã đặt tên và vào lớp ngồi học:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {seated.map(([id, name]) => (
                <span
                  key={id}
                  className="rounded-full border-2 border-leaf bg-leaf-soft/30 px-3 py-1.5 text-sm font-bold text-leaf"
                >
                  🧑‍🎓 {name}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">
            Chưa có bạn nào vào lớp. Ra sân trường 3D ở trang chủ, bấm vào một
            học sinh rồi đặt tên cho bạn ấy — bạn ấy sẽ đi bộ vào lớp ngồi học
            ngay.
          </p>
        )}
        <Link
          href="/"
          className="mt-3 inline-block rounded-full border-2 border-gold bg-cream px-4 py-2 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
        >
          🏫 Ra sân trường gọi bạn vào lớp →
        </Link>
      </div>

      <p className="mt-4 text-center text-xs text-ink-soft">
        Học bất cứ lúc nào — không cần chờ đúng giờ. Ngoài ra còn có: đọc
        truyện, luyện viết và Pomodoro.
      </p>
    </div>
  );
}
