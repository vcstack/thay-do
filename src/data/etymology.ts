/** Chiết tự: mỗi buổi giảng một chữ Hán — tách ra từng phần cho dễ nhớ.
 *  Nội dung tự viết bằng tiếng Việt. */

export interface Etymology {
  char: string;
  py: string;
  meaning: string;
  parts: string[];
  story: string;
  memory: string;
}

export const ETYMOLOGIES: Etymology[] = [
  {
    char: "人",
    py: "rén",
    meaning: "người",
    parts: ["丿 — nét phẩy", "捺 — nét mác"],
    story:
      "Chữ Nhân chỉ có hai nét: một nét phẩy nghiêng sang trái, một nét mác nghiêng sang phải, hai nét dựa vào nhau mà đứng vững. Người xưa nói: con người muốn đứng được thì phải có nhau nương tựa, một mình thì ngã, hai người dựa nhau thì thành hình người.",
    memory: "Hai nét dựa vào nhau như hai người đỡ nhau — đó là chữ Nhân.",
  },
  {
    char: "山",
    py: "shān",
    meaning: "núi",
    parts: ["Ba nét sổ — ba ngọn núi", "Nét ngang — chân núi"],
    story:
      "Chữ Sơn vẽ ba ngọn núi: ngọn giữa cao nhất, hai ngọn hai bên thấp hơn, chân núi nối liền thành một đường ngang. Nhìn vào chữ là thấy cả dãy núi trùng điệp, đỉnh cao chọc trời.",
    memory: "Ba ngọn núi cao thấp khác nhau, chân nối liền — đó là chữ Sơn.",
  },
  {
    char: "水",
    py: "shuǐ",
    meaning: "nước",
    parts: ["Nét sổ giữa — dòng nước chính", "Hai nét hai bên — bọt nước bắn ra"],
    story:
      "Chữ Thủy vẽ dòng nước đang chảy: nét sổ ở giữa là dòng chính chảy thẳng xuống, hai bên là bọt nước bắn ra khi gặp đá. Nước mềm mà mạnh, gặp đá thì vòng qua, gặp đất trũng thì tụ lại thành sông thành biển.",
    memory: "Dòng chính ở giữa, bọt nước bắn hai bên — đó là chữ Thủy.",
  },
  {
    char: "木",
    py: "mù",
    meaning: "cây",
    parts: ["十 — thân và cành", "丿 — rễ bên trái", "捺 — rễ bên phải"],
    story:
      "Chữ Mộc là hình cây: nét ngang là cành cây vươn ra, nét sổ là thân cây đứng thẳng, hai nét dưới là rễ bám chặt vào đất. Cây có rễ thì mới đứng vững, có cành thì mới ra hoa kết trái.",
    memory: "Trên là cành, giữa là thân, dưới là rễ — đó là chữ Mộc.",
  },
  {
    char: "日",
    py: "rì",
    meaning: "mặt trời, ngày",
    parts: ["囗 — vầng mặt trời", "一 — nét ngang giữa"],
    story:
      "Chữ Nhật vẽ mặt trời: một vòng tròn là vầng mặt trời, nét ngang ở giữa là tia sáng. Ngày xưa người ta viết mặt trời thành hình tròn, sau này vuông lại thành chữ Nhật như bây giờ. Một ngày trôi qua cũng là một lần mặt trời mọc rồi lặn.",
    memory: "Vòng tròn là mặt trời, nét ngang là tia sáng — đó là chữ Nhật.",
  },
  {
    char: "月",
    py: "yuè",
    meaning: "mặt trăng, tháng",
    parts: ["丿 — trăng khuyết", "Hai nét ngang — ánh trăng"],
    story:
      "Chữ Nguyệt vẽ mặt trăng khuyết: nét phẩy dài là vầng trăng cong, hai nét ngang là ánh trăng soi xuống. Trăng tròn rồi lại khuyết, khuyết rồi lại tròn — một tháng trôi qua cũng theo vòng tròn của trăng.",
    memory: "Vầng trăng cong với hai nét ngang là ánh sáng — đó là chữ Nguyệt.",
  },
  {
    char: "马",
    py: "mǎ",
    meaning: "ngựa",
    parts: ["Bờm ngựa", "Bốn chân chạy"],
    story:
      "Chữ Mã vẽ con ngựa đang chạy: phần trên là bờm ngựa tung bay, phần dưới là bốn chân đang phi nước đại. Ngày xưa ngựa là phương tiện nhanh nhất, đi nghìn dặm cũng chỉ cần một con ngựa tốt.",
    memory: "Trên là bờm tung bay, dưới là bốn chân đang chạy — đó là chữ Mã.",
  },
  {
    char: "鸟",
    py: "niǎo",
    meaning: "chim",
    parts: ["白 — đầu chim", "Nét cong — cánh và đuôi"],
    story:
      "Chữ Điểu vẽ con chim: phần trên là đầu chim với mắt sáng, phần dưới là đôi cánh và chiếc đuôi dài. Chim bay được là nhờ đôi cánh, người học được là nhờ chăm chỉ — thầy nói thế đấy.",
    memory: "Trên là đầu chim, dưới là cánh và đuôi — đó là chữ Điểu.",
  },
  {
    char: "田",
    py: "tián",
    meaning: "ruộng",
    parts: ["囗 — bờ ruộng", "十 — luống cày chia ngăn"],
    story:
      "Chữ Điền vẽ thửa ruộng: khung vuông ngoài là bờ ruộng, nét ngang dọc ở giữa là luống cày chia ruộng thành bốn ô. Người xưa cày ruộng phải chia ô cho đều, học chữ cũng phải chia nét cho ngay ngắn.",
    memory: "Khung vuông là bờ ruộng, nét ngang dọc là luống cày — đó là chữ Điền.",
  },
  {
    char: "心",
    py: "xīn",
    meaning: "tim, lòng",
    parts: ["Nét cong — trái tim", "Ba chấm — máu chảy"],
    story:
      "Chữ Tâm vẽ trái tim: nét cong lớn là hình quả tim, ba chấm bên dưới là máu đang chảy. Người xưa cho rằng mọi suy nghĩ đều từ tim mà ra, học bằng tâm thì mới nhớ lâu, làm bằng tâm thì mới thành việc.",
    memory: "Nét cong là quả tim, ba chấm là máu chảy — đó là chữ Tâm.",
  },
  {
    char: "好",
    py: "hǎo",
    meaning: "tốt, hay",
    parts: ["女 — con gái", "子 — con trai"],
    story:
      "Chữ Hảo ghép hai chữ lại: bên trái là chữ Nữ (con gái), bên phải là chữ Tử (con trai). Con gái và con trai ở cạnh nhau, hòa thuận với nhau thì đó là điều tốt đẹp — người xưa ghép hình ảnh gia đình sum họp để viết chữ Tốt.",
    memory: "Con gái và con trai ở cạnh nhau thì tốt — đó là chữ Hảo.",
  },
  {
    char: "学",
    py: "xué",
    meaning: "học",
    parts: ["冖 — mái nhà", "子 — đứa trẻ", "⺈ — hai tay nâng"],
    story:
      "Chữ Học vẽ cảnh một đứa trẻ ngồi dưới mái nhà, hai tay nâng sách lên mà học. Ngày xưa trẻ con học chữ là ngồi dưới mái nhà của thầy, tay cầm sách, miệng đọc theo — học là thế, phải có người dạy, có sách đọc, có mái nhà che nắng che mưa.",
    memory: "Đứa trẻ ngồi dưới mái nhà, hai tay nâng sách — đó là chữ Học.",
  },
  {
    char: "生",
    py: "shēng",
    meaning: "sinh ra, sống",
    parts: ["土 — đất", "丿 — mầm cây mọc lên"],
    story:
      "Chữ Sinh vẽ mầm cây mọc lên khỏi mặt đất: nét ngang dưới là đất, nét phẩy nghiêng lên là mầm non vừa nhú. Cây mọc lên từ đất là sinh, người ra đời cũng là sinh — cái gì sống cũng bắt đầu từ một mầm nhỏ vươn lên.",
    memory: "Mầm cây mọc lên khỏi đất — đó là chữ Sinh.",
  },
  {
    char: "大",
    py: "dà",
    meaning: "to, lớn",
    parts: ["一 — nét ngang", "人 — người"],
    story:
      "Chữ Đại là chữ Nhân thêm một nét ngang: người dang hai tay ra thật rộng, hai chân đứng thật vững thì thành người lớn. Người xưa nói: người lớn không phải chỉ cao to, mà là người dang tay ôm được việc lớn.",
    memory: "Người dang hai tay ra thật rộng — đó là chữ Đại.",
  },
  {
    char: "小",
    py: "xiǎo",
    meaning: "nhỏ",
    parts: ["八 — hai nét chia ra", "亅 — nét sổ móc ở giữa"],
    story:
      "Chữ Tiểu vẽ một hạt cát nhỏ xíu chia làm ba phần: hai nét phẩy chia ra hai bên, nét sổ móc ở giữa như cái rễ nhỏ. Nhỏ thì chia ra cũng nhỏ, gom lại cũng nhỏ — cái gì bé tí teo thì gọi là Tiểu.",
    memory: "Một hạt nhỏ chia làm ba phần — đó là chữ Tiểu.",
  },
  {
    char: "天",
    py: "tiān",
    meaning: "trời, bầu trời",
    parts: ["大 — người lớn", "一 — nét ngang trên đầu"],
    story:
      "Chữ Thiên là chữ Đại thêm một nét ngang trên đầu: trên đầu người lớn là bầu trời. Người đứng dưới đất, ngửa mặt lên là thấy trời — trời cao bao nhiêu thì người xưa cũng chỉ vẽ bằng một nét ngang đơn giản trên đầu người.",
    memory: "Trên đầu người lớn có một nét ngang — đó là bầu trời, chữ Thiên.",
  },
  {
    char: "地",
    py: "dì",
    meaning: "đất, mặt đất",
    parts: ["土 — đất", "也 — chỉ âm đọc"],
    story:
      "Chữ Địa gồm bộ Thổ ở bên trái và chữ Dã ở bên phải. Bộ Thổ nói rõ nghĩa: đây là chuyện về đất. Chữ Dã chỉ cho biết cách đọc. Trời ở trên, đất ở dưới — có Thiên thì phải có Địa, hai chữ đi đôi với nhau.",
    memory: "Bên trái là bộ Thổ (đất), bên phải chỉ âm đọc — đó là chữ Địa.",
  },
  {
    char: "火",
    py: "huǒ",
    meaning: "lửa",
    parts: ["丿 — ngọn lửa bốc lên", "人 — hình người dang tay"],
    story:
      "Chữ Hỏa vẽ ngọn lửa đang cháy: hai nét phẩy hai bên là lửa bốc lên, nét ở giữa như người đang dang tay. Lửa vừa sáng vừa nóng, vừa nấu được cơm vừa sưởi được ấm — nhưng lửa cũng dữ, chạm vào là bỏng tay ngay.",
    memory: "Ngọn lửa bốc lên hai bên như người dang tay — đó là chữ Hỏa.",
  },
  {
    char: "金",
    py: "jīn",
    meaning: "vàng, kim loại",
    parts: ["人 — hình người", "王 — vua", "丷 — hai chấm"],
    story:
      "Chữ Kim vẽ cảnh người ta đào vàng dưới lòng đất: phần trên là mái nhà che vàng, phần giữa là chữ Vương (vua) vì vàng quý như vua của các kim loại, phần dưới là hai chấm như hạt vàng rơi. Vàng quý vì hiếm, người xưa phải đào sâu dưới đất mới tìm được.",
    memory: "Trên là mái nhà, giữa là chữ Vương, dưới là hai hạt vàng — đó là chữ Kim.",
  },
  {
    char: "女",
    py: "nǚ",
    meaning: "con gái, phụ nữ",
    parts: ["丿 — nét phẩy", "口 — miệng", "一 — nét ngang"],
    story:
      "Chữ Nữ vẽ hình người con gái đang ngồi khép nép: nét phẩy là mái tóc dài, miệng nhỏ khép lại, nét ngang là hai tay đặt ngay ngắn trên đầu gối. Ngày xưa con gái ngồi phải khép nép như thế, nên người ta vẽ chữ Nữ theo dáng ngồi ấy.",
    memory: "Người con gái ngồi khép nép, tay đặt ngay ngắn — đó là chữ Nữ.",
  },
  {
    char: "子",
    py: "zǐ",
    meaning: "con, con trai, đứa trẻ",
    parts: ["了 — hình đứa trẻ", "一 — nét ngang"],
    story:
      "Chữ Tử vẽ đứa trẻ còn quấn tã: phần trên là cái đầu tròn, hai tay vung vẩy, nét ngang dưới là tã quấn. Đứa trẻ bé tí mà tay chân đã khua khoắng không ngừng — chữ Tử vì thế mà vừa giống đứa bé, vừa có nghĩa là con.",
    memory: "Đứa trẻ quấn tã, tay vung vẩy — đó là chữ Tử.",
  },
  {
    char: "门",
    py: "mén",
    meaning: "cửa",
    parts: ["丶 — then cửa", "户 — khung cửa"],
    story:
      "Chữ Môn vẽ khung cửa: hai nét sổ hai bên là khung cửa, chấm nhỏ trên là then cài. Cửa đóng thì nhà kín, cửa mở thì người ra vào — muốn vào nhà ai thì phải đi qua cửa, muốn học chữ Hán thì cũng phải qua được cánh cửa đầu tiên này.",
    memory: "Khung cửa hai bên, then cài ở trên — đó là chữ Môn.",
  },
  {
    char: "车",
    py: "chē",
    meaning: "xe",
    parts: ["十 — trục xe", "囗 — bánh xe"],
    story:
      "Chữ Xa vẽ chiếc xe cổ: nét ngang ở giữa là trục xe, hai khung vuông hai bên là hai bánh xe. Xe cổ chỉ có hai bánh mà chở được người đi nghìn dặm — chữ Xa vì thế mà giữ mãi hình chiếc xe hai bánh từ nghìn năm trước.",
    memory: "Trục xe ở giữa, hai bánh xe hai bên — đó là chữ Xa.",
  },
  {
    char: "电",
    py: "diàn",
    meaning: "điện, tia chớp",
    parts: ["日 — mặt trời", "乚 — tia chớp"],
    story:
      "Chữ Điện vẽ tia chớp đánh xuống từ trời: phần trên là chữ Nhật (mặt trời), nét móc ở dưới là tia chớp uốn cong. Ngày xưa người ta thấy chớp lóe sáng trên trời như mặt trời nhỏ vụt qua — sau này có điện dùng trong nhà, chữ Điện vẫn giữ nguyên hình tia chớp ấy.",
    memory: "Mặt trời trên cao, tia chớp uốn cong bên dưới — đó là chữ Điện.",
  },
];

/** Chữ giảng hôm nay: xoay theo ngày trong năm để mỗi ngày một chữ khác. */
export function todayEtymology(now: Date = new Date()): Etymology {
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return ETYMOLOGIES[day % ETYMOLOGIES.length];
}
