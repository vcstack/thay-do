import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Điều khoản & Nội quy — Thầy Đồ",
  description:
    "Điều khoản sử dụng và nội quy trường học: tài khoản, giờ giấc, cách cư xử trong lớp, thi cử, Sổ học trò và kỷ luật của thầy.",
};

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 rounded-2xl border-2 border-gold/40 bg-cream p-6 shadow">
      <h2 className="text-xl font-black text-vermilion">
        {num} · {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink">
        {children}
      </div>
    </section>
  );
}

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex gap-2">
      <span className="shrink-0 text-vermilion">•</span>
      <span>{children}</span>
    </p>
  );
}

export default function DieuKhoanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black text-vermilion">
        📜 Điều khoản &amp; Nội quy
      </h1>
      <p className="mt-2 text-ink-soft">
        Trường học thì phải có phép tắc. Nội quy dưới đây do nhà trường tự
        soạn, viết theo lối thầy đồ ngày xưa: nghiêm mà vui, ai phạm thì thầy
        chỉ chê một câu rồi cho chép phạt — không đuổi học ai bao giờ.
      </p>
      <p className="mt-2 text-xs font-bold text-ink-soft">
        Ban hành ngày 12/11/2026 · Áp dụng cho mọi học trò vào trường, kể cả
        khách chưa đăng nhập.
      </p>

      <blockquote className="mt-6 rounded-xl bg-gold-soft/30 p-4 text-base leading-relaxed text-ink">
        “Vào trường là để học chữ, học lễ. Chữ chưa thuộc thì luyện lại, lễ
        chưa đủ thì thầy nhắc — chỉ cần chịu học, thầy không chê ai dốt.”
      </blockquote>

      <Section num="Điều I" title="Điều khoản sử dụng">
        <h3 className="font-extrabold text-ink">1. Tài khoản</h3>
        <Rule>
          Đăng nhập là <strong>tự nguyện, không bắt buộc</strong>. Không đăng
          nhập vẫn học đủ mọi thứ trong trường.
        </Rule>
        <Rule>
          Tài khoản chỉ để <strong>giữ tiến trình học của riêng mình</strong>{" "}
          (bài đã mở, điểm thi, chữ đã luyện, truyện đã đọc) để đổi máy khác
          vẫn còn. Tên hiển thị là tên mình tự đặt.
        </Rule>
        <Rule>
          Không dùng tên của người khác, không mạo danh thầy hay bạn học.
          Mật khẩu (nếu có) là của riêng mình — đừng đưa cho ai, kể cả bạn
          thân nhất lớp.
        </Rule>
        <h3 className="mt-4 font-extrabold text-ink">2. Quyền riêng tư</h3>
        <Rule>
          Trường <strong>không thu thập thông tin nhạy cảm</strong>: không hỏi
          địa chỉ, số điện thoại, giấy tờ hay bất cứ thứ gì ngoài tên hiển
          thị và tiến trình học.
        </Rule>
        <Rule>
          Khi chưa đăng nhập, tiến trình chỉ lưu trên máy của chính mình.
          Số người đang online trong trường chỉ đếm số lượng, không hiện
          danh tính ai.
        </Rule>
        <Rule>
          Học trò có thể xóa tiến trình của mình bất cứ lúc nào trong Sổ học
          trò — xóa rồi là mất hẳn, thầy không khôi phục được.
        </Rule>
        <h3 className="mt-4 font-extrabold text-ink">3. Trách nhiệm người học</h3>
        <Rule>
          Học là cho mình. Thi là để biết mình yếu chỗ nào, không phải để
          khoe điểm — gian lận khi thi chỉ lừa được chính mình.
        </Rule>
        <Rule>
          Nội dung học trong trường chỉ dùng để học. Ai muốn đăng lại truyện,
          bài giảng hay tranh của trường ở nơi khác thì hỏi thầy trước một
          tiếng.
        </Rule>
      </Section>

      <Section num="Điều II" title="Nội quy trường học">
        <h3 className="font-extrabold text-ink">1. Giờ giấc</h3>
        <Rule>
          Lớp mở đúng giờ đã ghi trong thời khóa biểu. Nhưng vào trường là
          học ngay — <strong>không cần chờ đúng giờ</strong>, ca nào cũng mở
          cho học thử trước.
        </Rule>
        <Rule>
          Vào lớp đúng giờ thì được học chung với cả lớp, nghe thầy giảng
          trực tiếp. Đến muộn thì ngồi chiếu cuối, nghe nốt buổi sau.
        </Rule>
        <h3 className="mt-4 font-extrabold text-ink">2. Lễ phép trong lớp</h3>
        <Rule>
          Gặp thầy thì chào thầy, gặp bạn thì chào bạn. Xưng hô lễ phép,
          không nói tục, không chửi bậy, không trêu chọc bạn học.
        </Rule>
        <Rule>
          Nghe thầy giảng thì nghe cho hết câu. Đọc to thì đọc rõ ràng, sai
          thì sửa, không cười khi bạn đọc sai.
        </Rule>
        <Rule>
          Không spam, không la hét trong lớp, không phá bài của bạn khác.
        </Rule>
        <h3 className="mt-4 font-extrabold text-ink">3. Thi cử</h3>
        <Rule>
          Làm bài trung thực, không tra đáp án, không nhờ người khác làm hộ.
          Điểm thấp không sao — học lại buổi sau là được.
        </Rule>
        <Rule>
          Đề thi của trường là để luyện, làm bao nhiêu lần cũng được. Điểm
          cao nhất sẽ ghi vào Sổ học trò.
        </Rule>
        <h3 className="mt-4 font-extrabold text-ink">4. Sổ học trò</h3>
        <Rule>
          Sổ ghi tiến trình của mình — chỉ mình xem được. Không sửa điểm của
          bạn khác, không khoe điểm để chê bạn.
        </Rule>
        <h3 className="mt-4 font-extrabold text-ink">5. Phố Hoa &amp; trà đạo</h3>
        <Rule>
          Ra phố thì nói chuyện lịch sự với người bán hàng, trả giá thì trả
          cho có duyên. Vào trà quán thì ngồi ngay ngắn, mời trà phải mời
          bằng hai tay.
        </Rule>
        <Rule>
          Không quậy phá quán trà, không hái hoa trong vườn trường, không
          trèo lên bia tiến sĩ chụp hình.
        </Rule>
        <h3 className="mt-4 font-extrabold text-ink">6. Ăn mặc</h3>
        <Rule>
          Vào lớp thì ăn mặc chỉnh tề. Tủ áo của trường có sẵn mấy bộ áo dài
          — mặc bộ nào cũng được, miễn là gọn gàng.
        </Rule>
      </Section>

      <Section num="Điều III" title="Kỷ luật — thầy phạt như thế nào">
        <p>
          Trường này không đuổi học ai. Học trò phạm nội quy thì thầy phạt
          theo lối thầy đồ, phạt xong là hết, không ghi vào sổ đen:
        </p>
        <Rule>
          <strong>Chê một câu:</strong> thầy chê thẳng mặt, chê xong thì chỉ
          cho chỗ sai để sửa. Bị chê mà sửa thì còn giỏi hơn chưa từng sai.
        </Rule>
        <Rule>
          <strong>Chép phạt:</strong> viết lại 10 lần chữ đang học — vừa là
          phạt, vừa là luyện chữ, một công đôi việc.
        </Rule>
        <Rule>
          <strong>Ngồi chiếu cuối:</strong> đến muộn hoặc ồn ào trong lớp thì
          ngồi chiếu cuối một buổi, nghe giảng từ xa cho nhớ.
        </Rule>
        <Rule>
          <strong>Quét sân:</strong> quậy phá sân trường thì cầm chổi quét
          sân một vòng — quét xong sân sạch, người cũng tỉnh.
        </Rule>
        <p>
          Phạm lỗi nặng nhiều lần (chửi bậy, phá bài của bạn, gian lận thi)
          thì thầy mời ra ngoài sân uống trà, nói chuyện phải quấy một buổi
          rồi mới cho vào lớp lại.
        </p>
      </Section>

      <Section num="Điều IV" title="Nội dung của trường">
        <Rule>
          Bài học, truyện ngắn, hội thoại, tranh minh họa trong trường đều do
          nhà trường <strong>tự viết, tự vẽ</strong>, dùng từ vựng trong 20
          bài học của trường.
        </Rule>
        <Rule>
          Các đoạn văn cổ trích từ sách xưa (Tam Tự Kinh, Luận Ngữ) là văn
          bản cổ đã lưu truyền, trường chỉ dịch nghĩa và ghi chú thêm bằng
          lời của mình.
        </Rule>
        <Rule>
          Trường không sao chép nội dung, hình ảnh hay thiết kế của trường
          học khác. Ai phát hiện chỗ nào giống trường khác thì báo thầy, thầy
          sửa ngay.
        </Rule>
      </Section>

      <Section num="Điều V" title="Điều khoản cuối">
        <Rule>
          Nhà trường có thể sửa nội quy khi cần (thêm lớp mới, thêm khu mới)
          và sẽ ghi rõ ngày sửa ở đầu trang này.
        </Rule>
        <Rule>
          Thắc mắc về điều khoản hay nội quy thì hỏi thầy — bấm vào học sinh
          trong sân trường để gọi thầy, hoặc vào lớp hỏi trực tiếp.
        </Rule>
        <Rule>
          Vào trường, bấm nút học bài đầu tiên, nghĩa là đã đọc và đồng ý
          với nội quy này. Không đồng ý điểm nào thì cứ học tiếp — thầy chỉ
          mong học trò học chữ, không bắt ai ký giấy tờ gì.
        </Rule>
      </Section>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/bai-hoc/1"
          className="rounded-full bg-vermilion px-6 py-2.5 text-sm font-bold text-cream shadow hover:bg-vermilion-dark"
        >
          Đồng ý — Học bài 1 →
        </Link>
        <Link
          href="/"
          className="rounded-full border-2 border-gold bg-cream px-6 py-2.5 text-sm font-bold text-vermilion hover:bg-gold-soft/40"
        >
          ← Quay về sân trường
        </Link>
      </div>
    </div>
  );
}
