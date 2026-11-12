import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Cho phép truy cập dev server từ điện thoại/máy khác cùng mạng LAN.
  // Nếu IP máy tính đổi thì thêm IP mới vào đây rồi restart dev server.
  allowedDevOrigins: ["192.168.1.152"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
