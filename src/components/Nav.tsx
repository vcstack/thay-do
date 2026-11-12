"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GuestName from "@/components/GuestName";
import SchoolMap from "@/components/SchoolMap";
import LoginDialog from "@/components/LoginDialog";
import { getAccount, onAccountChange, type Account } from "@/lib/progress";

const LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/lop-hoc", label: "Lớp học" },
  { href: "/bai-hoc", label: "Bài học" },
  { href: "/luyen-viet", label: "Luyện viết" },
  { href: "/giang-duong", label: "Giảng đường" },
  { href: "/doc-truyen", label: "Đọc truyện" },
  { href: "/thi-hsk", label: "Thi HSK" },
  { href: "/pho-hoa", label: "Phố Hoa" },
  { href: "/tra-dao", label: "Trà đạo" },
  { href: "/pomodoro", label: "Pomodoro" },
  { href: "/lich-hoc", label: "Lịch học" },
  { href: "/so-hoc-tro", label: "Sổ học trò" },
];

export default function Nav() {
  const pathname = usePathname();
  const [showMap, setShowMap] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [account, setAccount] = useState<Account>({ id: "guest", name: "Khách" });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccount(getAccount());
    return onAccountChange(() => setAccount(getAccount()));
  }, []);

  const loggedIn = account.id !== "guest";
  return (
    <header className="sticky top-0 z-50 border-b-2 border-vermilion/20 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-vermilion text-2xl font-bold text-cream shadow">
            師
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-wide text-vermilion">
              Thầy Đồ
            </span>
            <span className="block text-xs text-ink-soft">
              Trường học tiếng Trung ảo
            </span>
          </span>
        </Link>
        <nav className="hidden flex-wrap items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "bg-vermilion text-cream shadow"
                    : "text-ink hover:bg-gold-soft/40"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogin(true)}
            className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-bold transition ${
              loggedIn
                ? "border-vermilion bg-vermilion text-cream shadow"
                : "border-gold bg-cream text-vermilion hover:bg-gold-soft/40"
            }`}
            title={loggedIn ? "Đổi tên / Đăng xuất" : "Đăng nhập giữ tiến trình"}
          >
            <span>🧑‍🎓</span>
            <span className="max-w-24 truncate">
              {loggedIn ? account.name : "Đăng nhập"}
            </span>
          </button>
          <button
            onClick={() => setShowMap(true)}
            className="rounded-full border-2 border-gold bg-cream px-3 py-1.5 text-sm font-bold text-vermilion transition hover:bg-gold-soft/40"
            title="Mở bản đồ trường"
          >
            🗺️ Bản đồ
          </button>
          <span className="hidden sm:block">
            <GuestName />
          </span>
          <Link
            href="/bai-hoc"
            className="hidden rounded-full bg-leaf px-4 py-2 text-sm font-bold text-cream shadow hover:bg-leaf/90 md:block"
          >
            Vào lớp →
          </Link>
        </div>
      </div>
      {/* Menu cho điện thoại */}
      <nav className="flex gap-1 overflow-x-auto px-4 pb-2 lg:hidden">
        {LINKS.map((l) => {
          const active =
            l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold ${
                active ? "bg-vermilion text-cream" : "bg-gold-soft/30 text-ink"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
        <span className="shrink-0 sm:hidden">
          <GuestName />
        </span>
      </nav>
      {showMap && <SchoolMap onClose={() => setShowMap(false)} />}
      <LoginDialog
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onDone={(a) => setAccount(a)}
      />
    </header>
  );
}
