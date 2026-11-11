/** Truyện ngắn tiếng Trung theo cấp độ — nội dung tự viết, dùng từ vựng trong bài học. */

export type StoryLevel = "HSK1" | "HSK2" | "HSK3";

export interface StorySentence {
  zh: string;
  py: string;
  vi: string;
}

export interface Story {
  id: string;
  level: StoryLevel;
  title: string;
  titleVi: string;
  sentences: StorySentence[];
}

export const STORY_LEVELS: { level: StoryLevel; label: string; desc: string }[] = [
  { level: "HSK1", label: "HSK 1 — Mới bắt đầu", desc: "Câu ngắn, từ quen thuộc trong 20 bài học đầu." },
  { level: "HSK2", label: "HSK 2 — Cơ bản", desc: "Câu dài hơn, có thời gian, địa điểm, cảm xúc." },
  { level: "HSK3", label: "HSK 3 — Trung cấp", desc: "Đoạn văn ngắn, có suy nghĩ và kể chuyện." },
];

export const stories: Story[] = [
  {
    id: "chao-hoi",
    level: "HSK1",
    title: "你好，我叫小明",
    titleVi: "Xin chào, tôi tên là Tiểu Minh",
    sentences: [
      { zh: "你好！我叫小明。", py: "Nǐ hǎo! Wǒ jiào Xiǎo Míng.", vi: "Xin chào! Tôi tên là Tiểu Minh." },
      { zh: "我是中国人。", py: "Wǒ shì Zhōngguó rén.", vi: "Tôi là người Trung Quốc." },
      { zh: "我是学生。", py: "Wǒ shì xuésheng.", vi: "Tôi là học sinh." },
      { zh: "我学习汉语。", py: "Wǒ xuéxí Hànyǔ.", vi: "Tôi học tiếng Trung." },
      { zh: "我的老师很好。", py: "Wǒ de lǎoshī hěn hǎo.", vi: "Thầy của tôi rất tốt." },
      { zh: "我有很多朋友。", py: "Wǒ yǒu hěn duō péngyou.", vi: "Tôi có nhiều bạn." },
      { zh: "我们一起学习。", py: "Wǒmen yìqǐ xuéxí.", vi: "Chúng tôi cùng nhau học." },
      { zh: "学习汉语很有意思。", py: "Xuéxí Hànyǔ hěn yǒu yìsi.", vi: "Học tiếng Trung rất thú vị." },
    ],
  },
  {
    id: "gia-dinh",
    level: "HSK1",
    title: "我的家",
    titleVi: "Gia đình tôi",
    sentences: [
      { zh: "我的家有四个人。", py: "Wǒ de jiā yǒu sì gè rén.", vi: "Nhà tôi có bốn người." },
      { zh: "爸爸、妈妈、我和妹妹。", py: "Bàba, māma, wǒ hé mèimei.", vi: "Bố, mẹ, tôi và em gái." },
      { zh: "爸爸是老师。", py: "Bàba shì lǎoshī.", vi: "Bố là giáo viên." },
      { zh: "妈妈是医生。", py: "Māma shì yīshēng.", vi: "Mẹ là bác sĩ." },
      { zh: "妹妹今年五岁。", py: "Mèimei jīnnián wǔ suì.", vi: "Em gái năm nay năm tuổi." },
      { zh: "我们家很大。", py: "Wǒmen jiā hěn dà.", vi: "Nhà chúng tôi rất to." },
      { zh: "我爱我的家。", py: "Wǒ ài wǒ de jiā.", vi: "Tôi yêu gia đình tôi." },
    ],
  },
  {
    id: "di-cua-hang",
    level: "HSK1",
    title: "去商店",
    titleVi: "Đi cửa hàng",
    sentences: [
      { zh: "今天我想去商店。", py: "Jīntiān wǒ xiǎng qù shāngdiàn.", vi: "Hôm nay tôi muốn đi cửa hàng." },
      { zh: "我要买水和苹果。", py: "Wǒ yào mǎi shuǐ hé píngguǒ.", vi: "Tôi muốn mua nước và táo." },
      { zh: "商店里有很多东西。", py: "Shāngdiàn lǐ yǒu hěn duō dōngxi.", vi: "Trong cửa hàng có nhiều thứ." },
      { zh: "苹果多少钱？", py: "Píngguǒ duōshao qián?", vi: "Táo bao nhiêu tiền?" },
      { zh: "五块钱一斤。", py: "Wǔ kuài qián yì jīn.", vi: "Năm đồng một cân." },
      { zh: "我买两斤苹果。", py: "Wǒ mǎi liǎng jīn píngguǒ.", vi: "Tôi mua hai cân táo." },
      { zh: "谢谢！再见！", py: "Xièxie! Zàijiàn!", vi: "Cảm ơn! Tạm biệt!" },
    ],
  },
  {
    id: "thoi-tiet",
    level: "HSK2",
    title: "今天的天气",
    titleVi: "Thời tiết hôm nay",
    sentences: [
      { zh: "今天天气很好。", py: "Jīntiān tiānqì hěn hǎo.", vi: "Hôm nay thời tiết rất đẹp." },
      { zh: "天上没有云。", py: "Tiān shàng méiyǒu yún.", vi: "Trên trời không có mây." },
      { zh: "昨天天很冷，今天很热。", py: "Zuótiān tiān hěn lěng, jīntiān hěn rè.", vi: "Hôm qua trời rất lạnh, hôm nay rất nóng." },
      { zh: "明天可能会下雨。", py: "Míngtiān kěnéng huì xià yǔ.", vi: "Ngày mai có thể sẽ mưa." },
      { zh: "下雨的时候，我不喜欢出门。", py: "Xià yǔ de shíhou, wǒ bù xǐhuān chūmén.", vi: "Khi trời mưa, tôi không thích ra ngoài." },
      { zh: "我喜欢在家里看书。", py: "Wǒ xǐhuān zài jiālǐ kàn shū.", vi: "Tôi thích ở nhà đọc sách." },
      { zh: "你呢？你喜欢什么天气？", py: "Nǐ ne? Nǐ xǐhuān shénme tiānqì?", vi: "Còn bạn? Bạn thích thời tiết nào?" },
    ],
  },
  {
    id: "truong-hoc",
    level: "HSK2",
    title: "我的学校",
    titleVi: "Trường của tôi",
    sentences: [
      { zh: "我的学校很大。", py: "Wǒ de xuéxiào hěn dà.", vi: "Trường của tôi rất to." },
      { zh: "学校里有很多学生。", py: "Xuéxiào lǐ yǒu hěn duō xuésheng.", vi: "Trong trường có nhiều học sinh." },
      { zh: "我的汉语老师姓王。", py: "Wǒ de Hànyǔ lǎoshī xìng Wáng.", vi: "Thầy dạy tiếng Trung của tôi họ Vương." },
      { zh: "王老师很喜欢我们。", py: "Wáng lǎoshī hěn xǐhuān wǒmen.", vi: "Thầy Vương rất thích chúng tôi." },
      { zh: "每天早上八点我们上课。", py: "Měitiān zǎoshang bā diǎn wǒmen shàngkè.", vi: "Mỗi sáng 8 giờ chúng tôi vào lớp." },
      { zh: "我们一起学习汉语。", py: "Wǒmen yìqǐ xuéxí Hànyǔ.", vi: "Chúng tôi cùng nhau học tiếng Trung." },
      { zh: "下课以后，我和朋友一起去吃饭。", py: "Xiàkè yǐhòu, wǒ hé péngyou yìqǐ qù chīfàn.", vi: "Sau giờ học, tôi và bạn cùng đi ăn cơm." },
      { zh: "我很喜欢我的学校。", py: "Wǒ hěn xǐhuān wǒ de xuéxiào.", vi: "Tôi rất thích trường của tôi." },
    ],
  },
  {
    id: "cuoi-tuan",
    level: "HSK2",
    title: "周末做什么？",
    titleVi: "Cuối tuần làm gì?",
    sentences: [
      { zh: "今天是星期六。", py: "Jīntiān shì xīngqī liù.", vi: "Hôm nay là thứ Bảy." },
      { zh: "周末你想做什么？", py: "Zhōumò nǐ xiǎng zuò shénme?", vi: "Cuối tuần bạn muốn làm gì?" },
      { zh: "我想去看电影。", py: "Wǒ xiǎng qù kàn diànyǐng.", vi: "Tôi muốn đi xem phim." },
      { zh: "电影很好看，很有意思。", py: "Diànyǐng hěn hǎokàn, hěn yǒu yìsi.", vi: "Phim rất hay, rất thú vị." },
      { zh: "看完电影，我们去吃饭。", py: "Kàn wán diànyǐng, wǒmen qù chīfàn.", vi: "Xem phim xong, chúng tôi đi ăn cơm." },
      { zh: "我喜欢吃中国菜。", py: "Wǒ xǐhuān chī Zhōngguó cài.", vi: "Tôi thích ăn món Trung Quốc." },
      { zh: "星期天我在家里休息。", py: "Xīngqītiān wǒ zài jiālǐ xiūxi.", vi: "Chủ nhật tôi ở nhà nghỉ ngơi." },
      { zh: "周末过得很快。", py: "Zhōumò guò de hěn kuài.", vi: "Cuối tuần trôi qua rất nhanh." },
    ],
  },
  {
    id: "hoc-tieng-trung",
    level: "HSK3",
    title: "学汉语很难吗？",
    titleVi: "Học tiếng Trung có khó không?",
    sentences: [
      { zh: "很多人问我：学汉语很难吗？", py: "Hěn duō rén wèn wǒ: xué Hànyǔ hěn nán ma?", vi: "Nhiều người hỏi tôi: học tiếng Trung có khó không?" },
      { zh: "我觉得不太难，也不容易。", py: "Wǒ juéde bú tài nán, yě bù róngyì.", vi: "Tôi thấy không quá khó, nhưng cũng không dễ." },
      { zh: "汉字很难写，要每天练习。", py: "Hànzì hěn nán xiě, yào měitiān liànxí.", vi: "Chữ Hán rất khó viết, phải luyện tập mỗi ngày." },
      { zh: "但是汉语的语法比英语简单。", py: "Dànshì Hànyǔ de yǔfǎ bǐ Yīngyǔ jiǎndān.", vi: "Nhưng ngữ pháp tiếng Trung đơn giản hơn tiếng Anh." },
      { zh: "每天学一点，慢慢就会了。", py: "Měitiān xué yìdiǎn, mànmàn jiù huì le.", vi: "Mỗi ngày học một chút, dần dần sẽ biết thôi." },
      { zh: "我每天早上读课文，晚上写汉字。", py: "Wǒ měitiān zǎoshang dú kèwén, wǎnshang xiě Hànzì.", vi: "Mỗi sáng tôi đọc bài khóa, tối viết chữ Hán." },
      { zh: "学习的时候不要害怕犯错误。", py: "Xuéxí de shíhou bú yào hàipà fàn cuòwù.", vi: "Khi học đừng sợ mắc lỗi." },
      { zh: "只要坚持下去，你一定能学好汉语。", py: "Zhǐyào jiānchí xiàqù, nǐ yídìng néng xué hǎo Hànyǔ.", vi: "Chỉ cần kiên trì, bạn nhất định học tốt tiếng Trung." },
    ],
  },
  {
    id: "bi-om",
    level: "HSK3",
    title: "生病了",
    titleVi: "Bị ốm rồi",
    sentences: [
      { zh: "昨天晚上我生病了。", py: "Zuótiān wǎnshang wǒ shēngbìng le.", vi: "Tối qua tôi bị ốm." },
      { zh: "我觉得头很疼，身体很不舒服。", py: "Wǒ juéde tóu hěn téng, shēntǐ hěn bù shūfu.", vi: "Tôi thấy đầu rất đau, người rất khó chịu." },
      { zh: "妈妈带我去医院。", py: "Māma dài wǒ qù yīyuàn.", vi: "Mẹ đưa tôi đi bệnh viện." },
      { zh: "医生说我感冒了，要多休息。", py: "Yīshēng shuō wǒ gǎnmào le, yào duō xiūxi.", vi: "Bác sĩ nói tôi bị cảm, phải nghỉ ngơi nhiều." },
      { zh: "医生给我开了药。", py: "Yīshēng gěi wǒ kāi le yào.", vi: "Bác sĩ kê thuốc cho tôi." },
      { zh: "回到家，我喝了很多水。", py: "Huí dào jiā, wǒ hē le hěn duō shuǐ.", vi: "Về nhà, tôi uống rất nhiều nước." },
      { zh: "今天我觉得好多了。", py: "Jīntiān wǒ juéde hǎo duō le.", vi: "Hôm nay tôi thấy đỡ nhiều rồi." },
      { zh: "身体健康最重要。", py: "Shēntǐ jiànkāng zuì zhòngyào.", vi: "Sức khỏe là quan trọng nhất." },
    ],
  },
  {
    id: "di-du-lich",
    level: "HSK3",
    title: "去旅行",
    titleVi: "Đi du lịch",
    sentences: [
      { zh: "去年夏天，我和家人去旅行。", py: "Qùnián xiàtiān, wǒ hé jiārén qù lǚxíng.", vi: "Mùa hè năm ngoái, tôi và gia đình đi du lịch." },
      { zh: "我们坐火车去北京。", py: "Wǒmen zuò huǒchē qù Běijīng.", vi: "Chúng tôi đi tàu hỏa đến Bắc Kinh." },
      { zh: "北京很大，也很漂亮。", py: "Běijīng hěn dà, yě hěn piàoliang.", vi: "Bắc Kinh rất to, cũng rất đẹp." },
      { zh: "我们去了长城和故宫。", py: "Wǒmen qù le Chángchéng hé Gùgōng.", vi: "Chúng tôi đã đi Vạn Lý Trường Thành và Cố Cung." },
      { zh: "长城很长，站在上面可以看到很远的地方。", py: "Chángchéng hěn cháng, zhàn zài shàngmian kěyǐ kàndào hěn yuǎn de dìfang.", vi: "Trường Thành rất dài, đứng trên đó có thể nhìn thấy nơi rất xa." },
      { zh: "我们拍了很多照片。", py: "Wǒmen pāi le hěn duō zhàopiàn.", vi: "Chúng tôi chụp rất nhiều ảnh." },
      { zh: "旅行的时候，我还练习说汉语。", py: "Lǚxíng de shíhou, wǒ hái liànxí shuō Hànyǔ.", vi: "Khi đi du lịch, tôi còn luyện nói tiếng Trung." },
      { zh: "这次旅行给我留下了美好的回忆。", py: "Zhè cì lǚxíng gěi wǒ liú xià le měihǎo de huíyì.", vi: "Chuyến du lịch này để lại cho tôi những kỷ niệm đẹp." },
    ],
  },
];

export function getStory(id: string): Story | undefined {
  return stories.find((s) => s.id === id);
}
