import raw from "./lessons.json";

export interface Vocab {
  zh: string;
  py: string;
  vi: string;
}

export interface Sentence {
  zh: string;
  py: string;
  vi: string;
}

export interface DialogueLine {
  sp: string;
  zh: string;
  py: string;
  vi: string;
}

export interface Lesson {
  id: number;
  title: string;
  titleVi: string;
  vocab: Vocab[];
  sentences: Sentence[];
  dialogue: DialogueLine[];
}

export const lessons: Lesson[] = (raw as { lessons: Lesson[] }).lessons;

export const allVocab: Vocab[] = lessons.flatMap((l) => l.vocab);

export const allSentences: Sentence[] = lessons.flatMap((l) => l.sentences);

/** Tất cả các chữ Hán đơn (1 ký tự) xuất hiện trong từ vựng, không trùng lặp. */
export function getAllChars(): string[] {
  const set = new Set<string>();
  for (const v of allVocab) {
    for (const ch of v.zh) {
      if (/[\u4e00-\u9fff]/.test(ch)) set.add(ch);
    }
  }
  return [...set];
}

/** Các chữ Hán đơn trong một bài học. */
export function getLessonChars(lesson: Lesson): string[] {
  const set = new Set<string>();
  for (const v of lesson.vocab) {
    for (const ch of v.zh) {
      if (/[\u4e00-\u9fff]/.test(ch)) set.add(ch);
    }
  }
  return [...set];
}

export function getLesson(id: number): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
