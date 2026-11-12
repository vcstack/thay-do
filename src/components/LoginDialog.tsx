"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getAccount, login, logout, type Account } from "@/lib/progress";

/**
 * Hộp thoại "đăng nhập" giả lập: chỉ nhập tên hiển thị để giữ riêng
 * tiến trình trên máy này — không có tài khoản máy chủ, không dùng Google.
 */
export default function LoginDialog({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone?: (account: Account) => void;
}) {
  const [account, setAccount] = useState<Account>({ id: "guest", name: "Khách" });
  const [draft, setDraft] = useState("");
  // Render qua portal ra document.body: dialog đang nằm trong <header> có
  // backdrop-blur, mà backdrop-filter tạo containing block cho phần tử
  // fixed nên dialog bị neo theo header, không phủ kín viewport được.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const a = getAccount();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccount(a);
    setDraft(a.id === "guest" ? "" : a.name);
  }, [open ]);

  if (!open || !mounted) return null;

  const loggedIn = account.id !== "guest";

  function enter() {
    const a = login(draft);
    onDone?.(a);
    onClose();
  }

  function signOut() {
    const a = logout();
    onDone?.(a);
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Đăng nhập giữ tiến trình"
    >
      <div
        className="w-full max-w-sm rounded-2xl border-2 border-gold/50 bg-cream p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-black text-vermilion">🔑 Đăng nhập giữ tiến trình</h2>
        {loggedIn ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Bạn đang học với tên <span className="font-bold text-ink">{account.name}</span>.
            Nhập tên mới để đổi sang sổ khác, hoặc đăng xuất về tài khoản khách.
          </p>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Nhập tên của bạn để vào trường — mỗi tên có một Sổ học trò riêng.
          </p>
        )}
        <p className="mt-3 rounded-xl bg-gold-soft/30 p-3 text-xs font-semibold leading-relaxed text-ink">
          Đăng nhập chỉ để giữ tiến trình trên máy này — không có tài khoản máy
          chủ, không dùng Google.
        </p>
        <label className="mt-4 block text-sm font-bold text-ink">
          Tên hiển thị
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") enter();
              if (e.key === "Escape") onClose();
            }}
            maxLength={20}
            placeholder="Ví dụ: Minh Anh"
            className="mt-1 w-full rounded-lg border-2 border-gold/50 bg-white px-3 py-2 text-sm outline-none focus:border-vermilion"
          />
        </label>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={enter}
            disabled={!draft.trim()}
            className="flex-1 rounded-full bg-vermilion px-5 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark disabled:opacity-50"
          >
            {loggedIn ? "Đổi tên" : "Vào trường →"}
          </button>
          {loggedIn && (
            <button
              onClick={signOut}
              className="rounded-full border-2 border-gold bg-cream px-5 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
            >
              Đăng xuất
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-full border-2 border-gold bg-cream px-5 py-2.5 text-sm font-bold text-ink-soft hover:bg-gold-soft/40"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
