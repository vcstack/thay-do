# Thầy Đồ — Trường Học Tiếng Trung Ảo

Ngôi trường ảo học tiếng Trung chạy ngay trên trình duyệt, lấy cảm hứng từ
xiehanzi.com/thay-do. Vào trường, ngắm sân trường 3D, vào lớp học bài, luyện
viết chữ Hán có thầy chấm điểm, thi thử HSK, học theo nhịp Pomodoro.

## Chạy local

```bash
npm install
npm run dev      # mở http://localhost:3000
```

Build production:

```bash
npm run build
npm run start
```

## Công nghệ

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **Three.js** qua **React Three Fiber + drei** — cảnh trường học low-poly:
  sân trường, tòa lớp học mái ngói, cổng paifang, đèn lồng đỏ, cây, hồ nước,
  mây trôi, nắng ấm có bóng đổ. Xoay camera bằng OrbitControls, bấm vào tòa
  lớp học để vào lớp, bấm cổng để xem lịch học.
- **Hanzi Writer** — luyện viết chữ Hán theo thứ tự nét, chấm đúng/sai từng
  nét (dữ liệu nét chữ tải từ CDN lúc chạy).
- **Web Speech API** — nút loa đọc phát âm tiếng Trung (zh-CN) ngay trong
  trình duyệt, không cần server.

## Tính năng đã có (MVP)

| Trang | Tính năng |
| --- | --- |
| `/` Trang chủ | Cảnh 3D trường học full màn hình + nút vào lớp, thống kê bài học |
| `/bai-hoc` | 20 bài học (200 từ vựng, 100 câu mẫu, 110 câu hội thoại), có pinyin + nghĩa Việt + nút nghe |
| `/bai-hoc/[id]` | Chi tiết từng bài: từ vựng, câu mẫu, hội thoại, bài trước/sau |
| `/luyen-viet` | Chọn chữ trong bài → xem thầy viết mẫu → tô theo từng nét, chấm sai đúng |
| `/thi-hsk` | Trắc nghiệm 10 câu (chọn nghĩa / chọn chữ Hán), tính điểm, xem lại câu sai |
| `/pomodoro` | Đồng hồ 25 phút học / 5 phút nghỉ, vòng tròn tiến độ, đếm phiên đã xong |
| `/lich-hoc` | Lớp mở 8:00 / 14:00 / 20:00 mỗi ngày, trạng thái trực tiếp (đang mở / sắp mở / đã kết thúc) + thời khóa biểu tuần |

Dữ liệu bài học tái sử dụng từ app Học Tiếng Trung (`src/data/lessons.json`).

## Hướng phát triển tiếp theo

1. **Supabase** (auth + Postgres + Realtime): đăng nhập, lưu tiến độ học,
   hiện số người đang online trong trường, học chung phòng Pomodoro.
2. **3D nâng cấp**: nhân vật học sinh đi lại trong sân (avatar), vào trong lớp
   học 3D, thầy đồ đứng bục giảng, hiệu ứng ngày/đêm.
3. **Thi HSK theo cấp** (HSK1–HSK6) với ngân hàng câu hỏi riêng, lưu lịch sử
   điểm.
4. **Đọc truyện theo cấp** + **ngữ pháp HSK1** (đã có sẵn nội dung trong app
   Học Tiếng Trung, chỉ cần mang qua).
5. **Âm thanh**: nhạc nền cổ phong, tiếng chuông vào lớp.
6. Deploy lên **Vercel** (free) để có link chia sẻ cho mọi người vào học.
