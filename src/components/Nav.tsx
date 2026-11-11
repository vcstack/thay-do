"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/lop-hoc", label: "Lớp học" },
  { href: "/bai-hoc", label: "Bài học" },
  { href: "/luyen-viet", label: "Luyện viết" },
  { href: "/doc-truyen", label: "Đọc truyện" },
  { href: "/thi-hsk", label: "Thi HSK" },
  { href: "/pomodoro", label: "Pomodoro" },
  { href: "/lich-hoc", label: "Lịch học" },
];

export default function Nav() {
  const pathname = usePathname();
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
        <nav className="hidden flex-wrap items-center gap-1 md:flex">
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
        <Link
          href="/bai-hoc"
          className="rounded-full bg-leaf px-4 py-2 text-sm font-bold text-cream shadow hover:bg-leaf/90"
        >
          Vào lớp →
        </Link>
      </div>
      {/* Menu cho điện thoại */}
      <nav className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
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
      </nav>
    </header>
  );
}
