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
- **Three.js** qua **React Three Fiber + drei** — cảnh trường học low-poly
  theo **danh lam Việt Nam**: sân Văn Miếu với Khuê Văn Các và bia tiến sĩ
  trên lưng rùa, lớp học Điện Thái Hòa mái ngói vàng, trà quán Hội An tường
  vàng đèn lồng đủ màu, hồ sen, cây phượng, cây cổ thụ, mây trôi, nắng ấm có
  bóng đổ. Xoay camera bằng OrbitControls, bấm vào tòa lớp học để vào lớp,
  bấm cổng để xem lịch học. **Học sinh tương tác được**: bấm vào một học sinh
  trong sân để đặt tên (có tên gợi ý sẵn, lưu vào localStorage), bạn ấy sẽ
  đi bộ vào lớp ngồi học; bấm lại để gọi ra sân.
- **Hanzi Writer** — luyện viết chữ Hán theo thứ tự nét, chấm đúng/sai từng
  nét (dữ liệu nét chữ tải từ CDN lúc chạy).
- **Web Speech API** — nút loa đọc phát âm tiếng Trung (zh-CN) ngay trong
  trình duyệt, không cần server.

## Tính năng đã có (MVP)

| Trang | Tính năng |
| --- | --- |
| `/` Trang chủ | Cảnh 3D trường học Việt Nam full màn hình + nút vào lớp, thống kê bài học |
| `/lop-hoc` | Lớp theo giờ (8:00/14:00/20:00): thầy giảng bài, lời nhận xét hài hước, danh sách học sinh trong lớp |
| `/doc-truyen` | 9 truyện ngắn HSK 1–3, bấm vào từ để xem nghĩa, nghe đọc từng câu |
| `/bai-hoc` | 20 bài học (200 từ vựng, 100 câu mẫu, 110 câu hội thoại), có pinyin + nghĩa Việt + nút nghe |
| `/bai-hoc/[id]` | Chi tiết từng bài: từ vựng, câu mẫu, hội thoại, bài trước/sau |
| `/luyen-viet` | Chọn chữ trong bài → xem thầy viết mẫu → tô theo từng nét, chấm sai đúng, thầy chê hài hước khi viết sai |
| `/thi-hsk` | Trắc nghiệm 10 câu (chọn nghĩa / chọn chữ Hán), tính điểm, xem lại câu sai |
| `/pomodoro` | Đồng hồ 25 phút học / 5 phút nghỉ, vòng tròn tiến độ, đếm phiên đã xong, phòng tự học chung (mô phỏng) |
| `/lich-hoc` | Lớp mở 8:00 / 14:00 / 20:00 mỗi ngày, trạng thái trực tiếp (đang mở / sắp mở / đã kết thúc) + thời khóa biểu tuần |

Dữ liệu bài học tái sử dụng từ app Học Tiếng Trung (`src/data/lessons.json`).

## Hướng phát triển tiếp theo

1. **Supabase** (auth + Postgres + Realtime): đăng nhập, lưu tiến độ học,
   hiện số người đang online trong trường, học chung phòng Pomodoro.
2. **3D nâng cấp**: hiệu ứng ngày/đêm, thêm khu phố cổ Hội An, nhân vật thầy
   đi lại trong sân.
3. **Thi HSK theo cấp** (HSK1–HSK6) với ngân hàng câu hỏi riêng, lưu lịch sử
   điểm.
4. **Ngữ pháp HSK1** (đã có sẵn nội dung trong app Học Tiếng Trung, chỉ cần
   mang qua).
5. **Âm thanh**: nhạc nền cổ phong, tiếng chuông vào lớp.
6. Deploy lên **Vercel** (free) để có link chia sẻ cho mọi người vào học.
