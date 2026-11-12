"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getAccount, getSyncStatus, login, logout, type Account } from "@/lib/progress";
import { useAuth } from "@/lib/auth";

/**
 * Hộp thoại đăng nhập thật bằng Supabase:
 * - Đăng nhập bằng Google (OAuth, quay về trang chủ).
 * - Đăng ký / đăng nhập bằng email + mật khẩu.
 * Tiến trình được đồng bộ lên máy chủ — đổi máy vẫn giữ sổ học trò.
 * Chưa cấu hình Supabase thì fallback về đăng nhập bằng tên trên máy này
 * (như cũ), không crash.
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
  const auth = useAuth();
  const [account, setAccount] = useState<Account>({ id: "guest", name: "Khách" });
  const [draft, setDraft] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
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
    setDraft(a.id === "guest" || a.id.startsWith("sb:") ? "" : a.name);
    setError("");
    setInfo("");
    setBusy(false);
  }, [open ]);

  if (!open || !mounted) return null;

  const loggedIn = account.id !== "guest";
  const realAccount = auth.user !== null;
  const sync = getSyncStatus();

  /** Đăng nhập tên local (chỉ khi chưa cấu hình Supabase). */
  function enterLocal() {
    const a = login(draft);
    onDone?.(a);
    onClose();
  }

  function signOutLocal() {
    const a = logout();
    onDone?.(a);
    onClose();
  }

  async function signOutReal() {
    setBusy(true);
    await auth.signOut();
    onDone?.({ id: "guest", name: "Khách" });
    setBusy(false);
    onClose();
  }

  async function google() {
    setBusy(true);
    setError("");
    const { error } = await auth.signInWithGoogle();
    if (error) {
      setError(error);
      setBusy(false);
    }
    // Thành công thì trình duyệt chuyển sang Google rồi quay về /auth/callback.
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email.includes("@") || password.length < 6) {
      setError("Email chưa đúng định dạng, mật khẩu cần ít nhất 6 ký tự.");
      return;
    }
    if (isSignUp && !name.trim()) {
      setError("Nhập tên hiển thị của bạn (để thầy và bạn học gọi).");
      return;
    }
    setBusy(true);
    if (isSignUp) {
      const { error: err, needsConfirm } = await auth.signUpWithEmail(
        email.trim(),
        password,
        name
      );
      setBusy(false);
      if (err) {
        setError(err);
        return;
      }
      if (needsConfirm) {
        setInfo(
          "Đã gửi email xác nhận — mở hộp thư của bạn, bấm link xác nhận rồi quay lại đăng nhập nhé."
        );
        return;
      }
      onDone?.(getAccount());
      onClose();
    } else {
      const { error: err } = await auth.signInWithEmail(email.trim(), password);
      setBusy(false);
      if (err) {
        setError(err);
        return;
      }
      onDone?.(getAccount());
      onClose();
    }
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
        className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl border-2 border-gold/50 bg-cream p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-black text-vermilion">🔑 Đăng nhập</h2>

        {realAccount ? (
          <>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Bạn đang học với tài khoản{" "}
              <span className="font-bold text-ink">{auth.displayName}</span>
              {auth.user?.email ? (
                <>
                  {" "}({auth.user.email})
                </>
              ) : null}
              .
            </p>
            <p className="mt-3 rounded-xl bg-leaf-soft/30 p-3 text-xs font-semibold leading-relaxed text-leaf">
              ✅ Tài khoản thật — tiến trình đồng bộ lên máy chủ, đổi máy vẫn
              giữ Sổ học trò.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={signOutReal}
                disabled={busy}
                className="flex-1 rounded-full bg-vermilion px-5 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark disabled:opacity-50"
              >
                Đăng xuất
              </button>
              <button
                onClick={onClose}
                className="rounded-full border-2 border-gold bg-cream px-5 py-2.5 text-sm font-bold text-ink-soft hover:bg-gold-soft/40"
              >
                Đóng
              </button>
            </div>
          </>
        ) : auth.configured ? (
          <>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Đăng nhập để giữ Sổ học trò trên máy chủ — đổi máy, đổi điện
              thoại vẫn học tiếp được.
            </p>
            <button
              onClick={google}
              disabled={busy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-gold bg-white px-5 py-2.5 text-sm font-bold text-ink shadow hover:bg-gold-soft/30 disabled:opacity-50"
            >
              <span className="text-lg">G</span> Đăng nhập bằng Google
            </button>
            <div className="my-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-gold/50" />
              <span className="text-xs font-bold text-ink-soft">hoặc email</span>
              <span className="h-px flex-1 bg-gold/50" />
            </div>
            <form onSubmit={submitEmail} className="space-y-3">
              {isSignUp && (
                <label className="block text-sm font-bold text-ink">
                  Tên hiển thị
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    placeholder="Ví dụ: Minh Anh"
                    className="mt-1 w-full rounded-lg border-2 border-gold/50 bg-white px-3 py-2 text-sm outline-none focus:border-vermilion"
                  />
                </label>
              )}
              <label className="block text-sm font-bold text-ink">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ban@email.com"
                  autoComplete="email"
                  className="mt-1 w-full rounded-lg border-2 border-gold/50 bg-white px-3 py-2 text-sm outline-none focus:border-vermilion"
                />
              </label>
              <label className="block text-sm font-bold text-ink">
                Mật khẩu
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="mt-1 w-full rounded-lg border-2 border-gold/50 bg-white px-3 py-2 text-sm outline-none focus:border-vermilion"
                />
              </label>
              {error && (
                <p className="rounded-xl bg-red-100 p-3 text-xs font-semibold leading-relaxed text-red-700">
                  ⚠️ {error}
                </p>
              )}
              {info && (
                <p className="rounded-xl bg-leaf-soft/40 p-3 text-xs font-semibold leading-relaxed text-leaf">
                  {info}
                </p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-vermilion px-5 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark disabled:opacity-50"
              >
                {busy ? "Đang xử lý…" : isSignUp ? "Đăng ký" : "Đăng nhập"}
              </button>
            </form>
            <button
              onClick={() => {
                setIsSignUp((v) => !v);
                setError("");
                setInfo("");
              }}
              className="mt-3 w-full text-center text-sm font-bold text-vermilion hover:underline"
            >
              {isSignUp ? "Đã có tài khoản? Đăng nhập →" : "Chưa có tài khoản? Đăng ký →"}
            </button>
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-full border-2 border-gold bg-cream px-5 py-2.5 text-sm font-bold text-ink-soft hover:bg-gold-soft/40"
            >
              Học không cần tài khoản
            </button>
          </>
        ) : (
          <>
            {loggedIn ? (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Bạn đang học với tên{" "}
                <span className="font-bold text-ink">{account.name}</span>.
                Nhập tên mới để đổi sang sổ khác, hoặc đăng xuất về tài khoản
                khách.
              </p>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Nhập tên của bạn để vào trường — mỗi tên có một Sổ học trò
                riêng.
              </p>
            )}
            <p className="mt-3 rounded-xl bg-gold-soft/30 p-3 text-xs font-semibold leading-relaxed text-ink">
              Trường chưa bật đăng nhập thật (chưa cấu hình Supabase) — đăng
              nhập tên chỉ để giữ tiến trình trên máy này. Xem README để bật
              đăng nhập Google + email.
            </p>
            <label className="mt-4 block text-sm font-bold text-ink">
              Tên hiển thị
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") enterLocal();
                  if (e.key === "Escape") onClose();
                }}
                maxLength={20}
                placeholder="Ví dụ: Minh Anh"
                className="mt-1 w-full rounded-lg border-2 border-gold/50 bg-white px-3 py-2 text-sm outline-none focus:border-vermilion"
              />
            </label>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={enterLocal}
                disabled={!draft.trim()}
                className="flex-1 rounded-full bg-vermilion px-5 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark disabled:opacity-50"
              >
                {loggedIn ? "Đổi tên" : "Vào trường →"}
              </button>
              {loggedIn && (
                <button
                  onClick={signOutLocal}
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
          </>
        )}
        {sync === "cloud" && !realAccount && (
          <p className="mt-3 text-center text-xs text-leaf">
            ✅ Tiến trình đang đồng bộ lên tài khoản của bạn.
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}
