# Thầy Đồ — Trường Học Tiếng Trung Ảo

Ngôi trường ảo học tiếng Trung chạy ngay trên trình duyệt, lấy cảm hứng từ
mô hình trường học ảo (lớp theo giờ, thư viện theo cấp, trường thi, giảng
đường chiết tự, sân đọc sách, phố Hoa). Vào trường, ngắm sân trường 3D, vào
lớp học bài, luyện viết chữ Hán có thầy chấm điểm, thi thử HSK, học theo nhịp
Pomodoro. Thiết kế và nội dung trong repo này là tự viết, không sao chép từ
trang tham khảo.

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
  trình duyệt, không cần server; **Web Audio API** — âm thanh nền (mưa, gió,
  chuông gió) tạo bằng code, không cần file nhạc.

## Tính năng đã có

| Trang | Tính năng |
| --- | --- |
| `/` Trang chủ | Hero + số người online (mô phỏng) → cảnh 3D → "Hôm nay học gì?" → "Giờ học tới" (lớp sắp mở, đếm ngược, nút Vào lớp/Nhắc tôi) → "Lộ trình lớp" (Vỡ lòng 8 buổi, HSK1 29, HSK2 23, HSK3 30, HSK4–6 chờ đủ người) → "Trong trường có gì" (9 địa điểm) → "Bảng vàng tuần" (3 bảng, dữ liệu mẫu) → mục đăng nhập giữ tiến trình |
| `/lop-hoc` | Lớp theo giờ (8:00/14:00/20:00): thầy giảng bài, lời nhận xét hài hước, danh sách học sinh trong lớp |
| `/bai-hoc` | 20 bài học (200 từ vựng, 100 câu mẫu, 110 câu hội thoại), có pinyin + nghĩa Việt + nút nghe |
| `/bai-hoc/[id]` | Chi tiết từng bài: từ vựng, câu mẫu, hội thoại, bài trước/sau |
| `/luyen-viet` | Chọn chữ trong bài → xem thầy viết mẫu → tô theo từng nét, chấm sai đúng, thầy chê hài hước khi viết sai; 12 thẻ "xin chữ" theo mong ước; nút "Không gợi ý" (ẩn viền nét, viết đúng hết được 2 điểm) |
| `/giang-duong` | Giảng chiết tự: mỗi ngày một chữ (10 chữ thông dụng), giải thích nguồn gốc + mẹo nhớ bằng tiếng Việt, nghe phát âm, nghe thầy giảng lại, danh sách các chữ đã giảng |
| `/doc-truyen` | 3 kệ: Kệ truyện (9 truyện HSK 1–3, bấm từ xem nghĩa, nghe đọc từng câu), Góc nghe (nghe hội thoại + nghe thanh điệu, 5 câu mỗi lượt), Kệ mẫu câu (8 chủ đề giao tiếp) |
| `/thi-hsk` | 3 chế độ: Đề ngắn đầu giờ (5 câu, 15 phút), Đề thi thử HSK (cấp HSK 1–3, 5 câu Nghe + 5 câu Đọc), Đề kiểm tra 10 câu ngẫu nhiên |
| `/pho-hoa` | Luyện nói theo kịch bản ở 6 điểm: Trà quán, Sạp hoa quả, Quán mì, Hiệu thuốc, Bưu cục, Khách điếm — chọn câu trả lời để đối đáp, có nút nghe mẫu và ghi âm thử (Web Speech API) |
| `/pomodoro` | Đồng hồ 25 phút học / 5 phút nghỉ, vòng tròn tiến độ, đếm phiên, phòng tự học chung (mô phỏng), âm thanh nền (mưa/gió/chuông gió), "Mở sách" đọc văn cổ (Tam Tự Kinh, Luận Ngữ, thành ngữ, câu đối) |
| `/lich-hoc` | Lớp mở 8:00 / 14:00 / 20:00 mỗi ngày, trạng thái trực tiếp (đang mở / sắp mở / đã kết thúc) + thời khóa biểu tuần |

**Khác:** tên khách tự động khi vào trường (bấm để đổi tên, lưu localStorage,
đồng bộ làm tên gợi ý cho học sinh 3D); nút **Bản đồ** ở thanh menu mở sơ đồ
5 khu (Phố Hoa, Tiền viện, Sân trường, Khu học, Học xá) có lọc theo kỹ năng
(Đọc, Nghe, Nói, Viết, Ngữ pháp, Thi), mục "Đang diễn ra" và tab thời khóa biểu.

Dữ liệu bài học tái sử dụng từ app Học Tiếng Trung (`src/data/lessons.json`).

## Đăng nhập thật + đồng bộ (Supabase)

Web đã tích hợp Supabase (Auth + Postgres + Realtime). **Chưa cấu hình thì
web vẫn chạy bình thường**: đăng nhập bằng tên trên máy này, số online mô
phỏng, Pomodoro 1 mình — không crash, không lỗi.

### Bật đăng nhập thật (5 bước)

1. Tạo project miễn phí tại https://supabase.com/dashboard → **New project**.
2. Lấy **Project URL** + **anon public key**: Project Settings → API.
3. Copy `.env.local.example` thành `.env.local`, điền 2 giá trị trên, rồi
   restart dev server (`npm run dev`).
4. Tạo bảng tiến trình: Supabase Dashboard → **SQL Editor** → New query →
   dán toàn bộ file `supabase-setup.sql` → Run. (Bảng `progress` + RLS: mỗi
   người chỉ đọc/ghi được hàng của chính mình.)
5. Bật đăng nhập Google (không bắt buộc): **Google Cloud Console** tạo
   OAuth client (Web application), thêm Authorized redirect URI
   `https://<project-ref>.supabase.co/auth/v1/callback`; rồi Supabase
   Dashboard → **Authentication → Providers → Google** → bật, điền Client ID
   + Client Secret. Nhớ thêm Site URL `http://localhost:3000` (dev) vào
   Authentication → URL Configuration.

Sau khi bật, web có: đăng nhập **Google** + **email/mật khẩu** (đăng ký có
xác nhận email nếu project bật Confirm email); tiến trình tự đồng bộ lên
bảng `progress` (đăng nhập lần đầu tự gộp tiến trình khách cũ lên tài khoản,
không mất dữ liệu); số người online đếm thật bằng Realtime Presence; phòng
Pomodoro chung (đăng nhập rồi vào `/pomodoro`, đặt tên phòng, ai bấm Bắt đầu
thì cả phòng cùng chạy đồng hồ). Số online + phòng chung không cần bảng —
dùng Presence/Broadcast, Realtime đã bật mặc định ở project mới.

## Hướng phát triển tiếp theo

1. **Bảng vàng thật + số online trong cảnh 3D**: dùng chung Presence đã có.
2. **3D nâng cấp**: hiệu ứng ngày/đêm, thêm khu phố cổ Hội An, nhân vật thầy
   đi lại trong sân.
3. **Thi HSK theo cấp** (HSK1–HSK6) với ngân hàng câu hỏi riêng, lưu lịch sử
   điểm.
4. **Ngữ pháp HSK1** (đã có sẵn nội dung trong app Học Tiếng Trung, chỉ cần
   mang qua).
5. Deploy lên **Vercel** (free) để có link chia sẻ cho mọi người vào học.
