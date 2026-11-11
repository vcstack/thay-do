import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thầy Đồ — Trường Học Tiếng Trung Ảo",
  description:
    "Ngôi trường ảo học tiếng Trung: vào lớp nghe thầy giảng, luyện viết chữ Hán có chấm điểm, thi thử HSK, học chung theo nhịp Pomodoro.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t-2 border-vermilion/20 bg-cream py-6 text-center text-sm text-ink-soft">
          <p className="font-bold text-vermilion">Thầy Đồ — Trường Học Tiếng Trung Ảo</p>
          <p className="mt-1">
            每天学一点，越学越有意思！— Mỗi ngày học một chút, càng học càng thú vị!
          </p>
        </footer>
      </body>
    </html>
  );
}
