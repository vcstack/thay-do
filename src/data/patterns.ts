/** Kệ mẫu câu giao tiếp — nội dung tự viết, trình độ HSK1. */

export interface PatternSentence {
  zh: string;
  py: string;
  vi: string;
}

export interface PatternTopic {
  id: string;
  title: string;
  icon: string;
  sentences: PatternSentence[];
}

export const PATTERN_TOPICS: PatternTopic[] = [
  {
    id: "chao-hoi",
    title: "Chào hỏi",
    icon: "👋",
    sentences: [
      { zh: "你好！", py: "Nǐ hǎo!", vi: "Xin chào!" },
      { zh: "你好吗？", py: "Nǐ hǎo ma?", vi: "Bạn khỏe không?" },
      { zh: "我很好，谢谢。", py: "Wǒ hěn hǎo, xièxie.", vi: "Tôi rất khỏe, cảm ơn." },
    ],
  },
  {
    id: "gioi-thieu",
    title: "Giới thiệu bản thân",
    icon: "🧑",
    sentences: [
      { zh: "我叫小明。", py: "Wǒ jiào Xiǎo Míng.", vi: "Tôi tên là Tiểu Minh." },
      { zh: "我是越南人。", py: "Wǒ shì Yuènán rén.", vi: "Tôi là người Việt Nam." },
      { zh: "我是学生。", py: "Wǒ shì xuésheng.", vi: "Tôi là học sinh." },
    ],
  },
  {
    id: "gia-dinh",
    title: "Gia đình",
    icon: "👨‍👩‍👧",
    sentences: [
      { zh: "我家有四个人。", py: "Wǒ jiā yǒu sì gè rén.", vi: "Nhà tôi có bốn người." },
      { zh: "这是我的爸爸。", py: "Zhè shì wǒ de bàba.", vi: "Đây là bố tôi." },
      { zh: "你有几个兄弟姐妹？", py: "Nǐ yǒu jǐ gè xiōngdì jiěmèi?", vi: "Bạn có mấy anh chị em?" },
    ],
  },
  {
    id: "an-uong",
    title: "Ăn uống",
    icon: "🍜",
    sentences: [
      { zh: "你想吃什么？", py: "Nǐ xiǎng chī shénme?", vi: "Bạn muốn ăn gì?" },
      { zh: "我想喝水。", py: "Wǒ xiǎng hē shuǐ.", vi: "Tôi muốn uống nước." },
      { zh: "这个很好吃。", py: "Zhège hěn hǎochī.", vi: "Món này rất ngon." },
    ],
  },
  {
    id: "mua-sam",
    title: "Mua sắm",
    icon: "🛍️",
    sentences: [
      { zh: "这个多少钱？", py: "Zhège duōshao qián?", vi: "Cái này bao nhiêu tiền?" },
      { zh: "太贵了！", py: "Tài guì le!", vi: "Đắt quá!" },
      { zh: "我要买这个。", py: "Wǒ yào mǎi zhège.", vi: "Tôi muốn mua cái này." },
    ],
  },
  {
    id: "di-lai",
    title: "Đi lại",
    icon: "🚌",
    sentences: [
      { zh: "请问，学校在哪里？", py: "Qǐngwèn, xuéxiào zài nǎlǐ?", vi: "Xin hỏi, trường học ở đâu?" },
      { zh: "我要去车站。", py: "Wǒ yào qù chēzhàn.", vi: "Tôi muốn đi ra bến xe." },
      { zh: "现在几点？", py: "Xiànzài jǐ diǎn?", vi: "Bây giờ mấy giờ?" },
    ],
  },
  {
    id: "thoi-gian",
    title: "Thời gian",
    icon: "🕐",
    sentences: [
      { zh: "今天是星期几？", py: "Jīntiān shì xīngqī jǐ?", vi: "Hôm nay là thứ mấy?" },
      { zh: "明天见！", py: "Míngtiān jiàn!", vi: "Ngày mai gặp lại!" },
      { zh: "现在七点。", py: "Xiànzài qī diǎn.", vi: "Bây giờ là bảy giờ." },
    ],
  },
  {
    id: "suc-khoe",
    title: "Sức khỏe",
    icon: "💪",
    sentences: [
      { zh: "你身体好吗？", py: "Nǐ shēntǐ hǎo ma?", vi: "Sức khỏe của bạn tốt không?" },
      { zh: "我有点儿累。", py: "Wǒ yǒudiǎnr lèi.", vi: "Tôi hơi mệt một chút." },
      { zh: "多喝水。", py: "Duō hē shuǐ.", vi: "Uống nhiều nước vào." },
    ],
  },
];
