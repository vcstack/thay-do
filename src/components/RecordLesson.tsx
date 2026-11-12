"use client";

import { useEffect } from "react";
import { recordDay, recordLesson } from "@/lib/progress";

/** Ghi vào Sổ học trò khi mở một bài học (chạy phía client). */
export default function RecordLesson({ id }: { id: number }) {
  useEffect(() => {
    recordLesson(id);
    recordDay();
  }, [id]);
  return null;
}
