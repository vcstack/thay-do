"use client";

import { useEffect, useState } from "react";
import { loadGuestName, saveGuestName } from "@/data/teacher";

/** Tên khách vào trường — bấm để đổi tên, lưu vào localStorage. */
export default function GuestName() {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(loadGuestName());
  }, []);

  function save() {
    const n = draft.trim();
    if (n) {
      saveGuestName(n);
      setName(n);
    }
    setEditing(false);
  }

  if (!name) return null;

  if (editing) {
    return (
      <span className="flex items-center gap-1">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          maxLength={20}
          className="w-28 rounded-full border-2 border-gold bg-white px-3 py-1 text-sm font-bold text-ink outline-none"
          aria-label="Đổi tên khách"
        />
        <button
          onClick={save}
          className="rounded-full bg-vermilion px-3 py-1 text-sm font-bold text-cream"
        >
          Lưu
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(name);
        setEditing(true);
      }}
      className="flex items-center gap-1.5 rounded-full border-2 border-gold/50 bg-gold-soft/30 px-3 py-1.5 text-sm font-bold text-ink transition hover:border-vermilion"
      title="Bấm để đổi tên"
    >
      <span>🧑‍🎓</span>
      <span className="max-w-24 truncate">{name}</span>
      <span className="text-xs text-ink-soft">✎</span>
    </button>
  );
}
