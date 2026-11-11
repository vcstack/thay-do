"use client";

import dynamic from "next/dynamic";

/**
 * Cảnh 3D dùng three.js nên chỉ render ở client.
 * Theo docs Next.js, `ssr: false` chỉ được dùng trong Client Component.
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

export default function SchoolSceneLoader() {
  return <SchoolScene />;
}
