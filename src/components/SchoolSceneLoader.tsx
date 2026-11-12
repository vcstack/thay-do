"use client";

import { Component, type ReactNode } from "react";
import dynamic from "next/dynamic";

/**
 * Cảnh 3D dùng three.js nên chỉ render ở client.
 * Theo docs Next.js, `ssr: false` chỉ được dùng trong Client Component.
 *
 * SchoolScene được import động (chunk riêng). Nếu chunk này tải lỗi
 * (vd: cache JS cũ sau khi pull code mới, mạng chập chờn) thì thay vì
 * treo mãi ở chữ "Đang dựng trường học 3D…" sẽ hiện nút tải lại để
 * người dùng biết và khắc phục được ngay.
 */
const SchoolScene = dynamic(() => import("./SchoolScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-sky-soft">
      <p className="animate-pulse text-lg font-bold text-vermilion">
        Đang dựng trường học 3D…
      </p>
    </div>
  ),
});

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render(): ReactNode {
    if (this.state.failed) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-sky-soft px-6 text-center">
          <p className="text-4xl">🏫</p>
          <p className="text-base font-bold text-vermilion">
            Không tải được trường 3D
          </p>
          <p className="text-sm text-ink-soft">
            Có thể do mạng hoặc bản lưu cũ trên máy — bấm tải lại để thử lại.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-vermilion px-6 py-2 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
          >
            🔄 Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function SchoolSceneLoader() {
  return (
    <SceneErrorBoundary>
      <SchoolScene />
    </SceneErrorBoundary>
  );
}
