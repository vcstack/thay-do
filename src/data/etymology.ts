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
];

/** Chữ giảng hôm nay: xoay theo ngày trong năm để mỗi ngày một chữ khác. */
export function todayEtymology(now: Date = new Date()): Etymology {
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return ETYMOLOGIES[day % ETYMOLOGIES.length];
}
