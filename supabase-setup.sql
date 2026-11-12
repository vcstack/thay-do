-- Supabase setup cho web Thầy Đồ — chạy 1 lần trong SQL Editor
-- (Dashboard Supabase → SQL Editor → New query → dán toàn bộ → Run).
-- Cần tạo project Supabase trước, rồi lấy URL + anon key điền vào .env.local.

-- 1) Bảng tiến trình học (1 hàng / 1 tài khoản, khóa chính = user_id).
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  lessons_done integer[] not null default '{}',
  exams jsonb not null default '[]'::jsonb,
  chars_practiced text[] not null default '{}',
  stories_read text[] not null default '{}',
  days text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- 2) Row Level Security: mỗi người chỉ đọc/ghi được hàng của chính mình.
alter table public.progress enable row level security;

drop policy if exists "users manage own progress" on public.progress;
create policy "users manage own progress"
  on public.progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3) Realtime (không bắt buộc cho tính năng hiện tại, nhưng nên bật để sau
-- này đồng bộ tiến trình trực tiếp nếu cần):
-- alter publication supabase_realtime add table public.progress;

-- 4) Số người online + phòng Pomodoro chung KHÔNG cần bảng — dùng
-- Realtime Presence/Broadcast (kênh tạm, tự hết hạn khi đóng tab).
-- Chỉ cần Realtime đang bật trong project (mặc định đã bật ở project mới;
-- kiểm tra: Dashboard → Database → Replication, hoặc Settings → API →
-- Realtime enabled). Không cần chạy thêm SQL cho 2 tính năng này.
