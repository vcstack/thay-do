/** Khu trà đạo — nghi thức pha trà Trung Hoa. Nội dung tự viết, trình độ HSK1.
 *  Các câu thơ cổ trích từ thơ Đường/Tống (đã thuộc phạm vi công cộng). */

export interface TeaStep {
  id: string;
  zh: string;
  py: string;
  vi: string;
  tip: string;
}

export const TEA_STEPS: TeaStep[] = [
  {
    id: "buoc-1",
    zh: "温壶",
    py: "Wēn hú",
    vi: "Tráng ấm",
    tip: "Rót nước sôi vào ấm và chén, tráng qua một lượt cho ấm nóng lên, trà pha ra mới thơm.",
  },
  {
    id: "buoc-2",
    zh: "投茶",
    py: "Tóu chá",
    vi: "Cho trà",
    tip: "Cho một nhúm lá trà vào ấm là vừa đủ, đừng tham cho nhiều, trà sẽ đắng.",
  },
  {
    id: "buoc-3",
    zh: "洗茶",
    py: "Xǐ chá",
    vi: "Tráng trà",
    tip: "Rót nước sôi vào rồi đổ đi ngay, để rửa bụi và đánh thức lá trà dậy hương.",
  },
  {
    id: "buoc-4",
    zh: "冲泡",
    py: "Chōng pào",
    vi: "Hãm trà",
    tip: "Rót nước sôi vào ấm, đậy nắp lại, đợi một lát cho trà ngấm ra nước.",
  },
  {
    id: "buoc-5",
    zh: "分茶",
    py: "Fēn chá",
    vi: "Rót trà",
    tip: "Rót trà ra từng chén nhỏ, rót đều tay, mỗi chén một ít, chén nào cũng như nhau.",
  },
  {
    id: "buoc-6",
    zh: "敬茶",
    py: "Jìng chá",
    vi: "Mời trà",
    tip: "Hai tay dâng chén trà mời khách. Mời trà là mời lòng, phải mời bằng cả hai tay.",
  },
  {
    id: "buoc-7",
    zh: "品茶",
    py: "Pǐn chá",
    vi: "Thưởng trà",
    tip: "Nhấp từng ngụm nhỏ, để hương trà lan ra rồi mới nuốt. Trà ngon phải uống từ từ.",
  },
];

export interface TeaWord {
  zh: string;
  py: string;
  vi: string;
}

export const TEA_VOCAB: TeaWord[] = [
  { zh: "茶", py: "chá", vi: "trà" },
  { zh: "茶叶", py: "cháyè", vi: "lá trà" },
  { zh: "茶壶", py: "cháhú", vi: "ấm trà" },
  { zh: "茶杯", py: "chábēi", vi: "chén trà" },
  { zh: "开水", py: "kāishuǐ", vi: "nước sôi" },
  { zh: "茶香", py: "cháxiāng", vi: "hương trà" },
  { zh: "泡茶", py: "pàochá", vi: "pha trà" },
  { zh: "品茶", py: "pǐnchá", vi: "thưởng trà" },
  { zh: "敬茶", py: "jìngchá", vi: "mời trà" },
  { zh: "请茶", py: "qǐngchá", vi: "mời uống trà" },
  { zh: "茶桌", py: "cházhuō", vi: "bàn trà" },
  { zh: "绿茶", py: "lǜchá", vi: "trà xanh" },
  { zh: "红茶", py: "hóngchá", vi: "trà đen (hồng trà)" },
  { zh: "茶水", py: "cháshuǐ", vi: "nước trà" },
];

export interface TeaDialogueLine {
  speaker: string;
  zh: string;
  py: string;
  vi: string;
}

export const TEA_DIALOGUE: TeaDialogueLine[] = [
  {
    speaker: "Thầy",
    zh: "请坐，喝杯茶吧。",
    py: "Qǐng zuò, hē bēi chá ba.",
    vi: "Mời ngồi, uống một chén trà nhé.",
  },
  {
    speaker: "Học trò",
    zh: "谢谢老师。这是什么茶？",
    py: "Xièxie lǎoshī. Zhè shì shénme chá?",
    vi: "Cảm ơn thầy. Đây là trà gì ạ?",
  },
  {
    speaker: "Thầy",
    zh: "这是绿茶，很香。",
    py: "Zhè shì lǜchá, hěn xiāng.",
    vi: "Đây là trà xanh, rất thơm.",
  },
  {
    speaker: "Học trò",
    zh: "真好喝！",
    py: "Zhēn hǎohē!",
    vi: "Ngon thật đấy!",
  },
  {
    speaker: "Thầy",
    zh: "慢慢喝，茶要慢慢品。",
    py: "Mànman hē, chá yào mànman pǐn.",
    vi: "Uống từ từ, trà phải thưởng thức từ từ.",
  },
];

export interface TeaPoem {
  zh: string;
  py: string;
  vi: string;
  source: string;
}

export const TEA_POEMS: TeaPoem[] = [
  {
    zh: "茶之为饮，发乎神农氏。",
    py: "Chá zhī wéi yǐn, fā hū Shénnóng shì.",
    vi: "Trà là thức uống, bắt đầu từ thời Thần Nông.",
    source: "Lục Vũ — Trà Kinh",
  },
  {
    zh: "休对故人思故国，且将新火试新茶。",
    py: "Xiū duì gùrén sī gùguó, qiě jiāng xīn huǒ shì xīn chá.",
    vi: "Đừng ngồi nhớ bạn nhớ quê, cứ lấy lửa mới thử trà mới.",
    source: "Tô Thức",
  },
  {
    zh: "一碗喉吻润，二碗破孤闷。",
    py: "Yì wǎn hóu wěn rùn, èr wǎn pò gū mèn.",
    vi: "Chén thứ nhất cổ họng mát nhuận, chén thứ hai xua tan nỗi buồn.",
    source: "Lư Đồng — Bài ca bảy chén trà",
  },
];
