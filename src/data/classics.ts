/** "Mở sách" — các đoạn văn cổ để đọc trong sân đọc sách.
 *  Trích ngắn, dịch nghĩa tiếng Việt tự viết. */

export type ClassicSource = "Tam Tự Kinh" | "Luận Ngữ" | "Thành ngữ" | "Câu đối";

export interface Classic {
  id: string;
  source: ClassicSource;
  zh: string;
  py: string;
  vi: string;
  note: string;
}

export const CLASSICS: Classic[] = [
  {
    id: "tam-tu-kinh-1",
    source: "Tam Tự Kinh",
    zh: "人之初，性本善。",
    py: "Rén zhī chū, xìng běn shàn.",
    vi: "Con người lúc mới sinh, bản tính vốn thiện.",
    note: "Câu mở đầu của Tam Tự Kinh — sách vỡ lòng của trẻ con ngày xưa, ai học chữ Hán cũng thuộc nằm lòng.",
  },
  {
    id: "tam-tu-kinh-2",
    source: "Tam Tự Kinh",
    zh: "性相近，习相远。",
    py: "Xìng xiāng jìn, xí xiāng yuǎn.",
    vi: "Tính tình vốn gần giống nhau, thói quen làm cho xa nhau.",
    note: "Cùng một bản tính tốt, nhưng thói quen hằng ngày mới quyết định con người ta thành ra sao.",
  },
  {
    id: "luan-ngu-1",
    source: "Luận Ngữ",
    zh: "学而时习之，不亦说乎？",
    py: "Xué ér shí xí zhī, bù yì yuè hū?",
    vi: "Học mà thường xuyên ôn tập, chẳng phải vui sao?",
    note: "Khổng Tử dạy: học xong phải ôn lại thường xuyên thì mới vui, mới nhớ lâu.",
  },
  {
    id: "luan-ngu-2",
    source: "Luận Ngữ",
    zh: "温故而知新，可以为师矣。",
    py: "Wēn gù ér zhī xīn, kě yǐ wéi shī yǐ.",
    vi: "Ôn cái cũ mà biết thêm cái mới, như vậy có thể làm thầy được rồi.",
    note: "Ôn bài cũ không phải là việc thừa — ôn kỹ sẽ tự nhiên hiểu thêm điều mới.",
  },
  {
    id: "thanh-ngu-1",
    source: "Thành ngữ",
    zh: "井底之蛙",
    py: "Jǐng dǐ zhī wā",
    vi: "Ếch ngồi đáy giếng — chỉ người hiểu biết nông cạn mà tưởng mình biết tất cả.",
    note: "Con ếch ngồi dưới đáy giếng, ngửa mặt chỉ thấy một khoảnh trời tròn nhỏ mà tưởng trời chỉ to bằng ấy.",
  },
  {
    id: "thanh-ngu-2",
    source: "Thành ngữ",
    zh: "画蛇添足",
    py: "Huà shé tiān zú",
    vi: "Vẽ rắn thêm chân — làm việc thừa thãi, vẽ vời thêm mà hỏng việc.",
    note: "Có người thi vẽ rắn, vẽ xong trước lại vẽ thêm chân cho rắn — thừa một nét mà thua cả cuộc thi.",
  },
  {
    id: "cau-doi-1",
    source: "Câu đối",
    zh: "海内存知己，天涯若比邻。",
    py: "Hǎi nèi cún zhī jǐ, tiān yá ruò bǐ lín.",
    vi: "Trong bốn biển có tri kỷ, chân trời góc bể cũng như gần kề.",
    note: "Câu thơ nổi tiếng về tình bạn: có bạn tri kỷ thì dù xa nghìn dặm cũng như ở cạnh nhau.",
  },
  {
    id: "tam-tu-kinh-3",
    source: "Tam Tự Kinh",
    zh: "玉不琢，不成器；人不学，不知义。",
    py: "Yù bù zhuó, bù chéng qì; rén bù xué, bù zhī yì.",
    vi: "Ngọc không mài giũa thì không thành đồ quý; người không học thì không biết đạo lý.",
    note: "Ngọc thô phải mài mới thành đồ quý, con người cũng vậy — không học thì không hiểu được lẽ phải trong đời.",
  },
  {
    id: "tam-tu-kinh-4",
    source: "Tam Tự Kinh",
    zh: "养不教，父之过；教不严，师之惰。",
    py: "Yǎng bù jiào, fù zhī guò; jiào bù yán, shī zhī duò.",
    vi: "Nuôi mà không dạy là lỗi của cha; dạy mà không nghiêm là lỗi của thầy.",
    note: "Tam Tự Kinh nhắc cả cha mẹ lẫn thầy cô: nuôi con phải dạy, dạy trò phải nghiêm thì trò mới nên người.",
  },
  {
    id: "tam-tu-kinh-5",
    source: "Tam Tự Kinh",
    zh: "子不学，非所宜；幼不学，老何为？",
    py: "Zǐ bù xué, fēi suǒ yí; yòu bù xué, lǎo hé wéi?",
    vi: "Trẻ không học là không nên; nhỏ không học, già làm được gì?",
    note: "Lúc nhỏ là lúc dễ học nhất — bỏ qua tuổi nhỏ thì đến già hối cũng muộn.",
  },
  {
    id: "luan-ngu-3",
    source: "Luận Ngữ",
    zh: "三人行，必有我师焉。",
    py: "Sān rén xíng, bì yǒu wǒ shī yān.",
    vi: "Ba người cùng đi, ắt có người làm thầy ta được.",
    note: "Khổng Tử dạy: ai cũng có điểm hay để mình học — đi cùng hai người thôi cũng đã có thầy rồi.",
  },
  {
    id: "luan-ngu-4",
    source: "Luận Ngữ",
    zh: "学而不思则罔，思而不学则殆。",
    py: "Xué ér bù sī zé wǎng, sī ér bù xué zé dài.",
    vi: "Học mà không nghĩ thì mơ hồ; nghĩ mà không học thì nguy hiểm.",
    note: "Học và nghĩ phải đi đôi với nhau: chỉ học thuộc mà không suy nghĩ thì mông lung, chỉ suy nghĩ mà không học thì dễ đi lạc.",
  },
  {
    id: "luan-ngu-5",
    source: "Luận Ngữ",
    zh: "知之者不如好之者，好之者不如乐之者。",
    py: "Zhī zhī zhě bùrú hào zhī zhě, hào zhī zhě bùrú lè zhī zhě.",
    vi: "Biết không bằng thích, thích không bằng vui thích.",
    note: "Người biết một việc chưa bằng người thích việc ấy, người thích chưa bằng người lấy việc ấy làm niềm vui — học tiếng Trung cũng vậy, thích rồi sẽ học nhanh hơn nhiều.",
  },
  {
    id: "thanh-ngu-3",
    source: "Thành ngữ",
    zh: "守株待兔",
    py: "Shǒu zhū dài tù",
    vi: "Ôm cây đợi thỏ — chỉ người lười biếng, chỉ trông chờ may mắn mà không chịu làm việc.",
    note: "Có người thấy thỏ đâm đầu vào gốc cây mà chết, bèn ngày nào cũng ôm gốc cây đợi thỏ — ruộng thì bỏ hoang, thỏ thì không bao giờ đến nữa.",
  },
  {
    id: "thanh-ngu-4",
    source: "Thành ngữ",
    zh: "亡羊补牢",
    py: "Wáng yáng bǔ láo",
    vi: "Mất dê mới vá chuồng — sai rồi sửa ngay thì vẫn còn kịp, chưa muộn.",
    note: "Dê mất rồi mới vá lại chuồng thì vẫn giữ được những con còn lại — biết sai mà sửa thì không bao giờ là quá muộn.",
  },
  {
    id: "cau-doi-2",
    source: "Câu đối",
    zh: "书山有路勤为径，学海无涯苦作舟。",
    py: "Shū shān yǒu lù qín wéi jìng, xué hǎi wú yá kǔ zuò zhōu.",
    vi: "Núi sách có đường, chăm chỉ là lối đi; biển học không bờ, khổ luyện làm thuyền.",
    note: "Câu đối khuyên học trò: sách vở như núi cao, biển rộng — muốn qua được thì chỉ có chăm chỉ và khổ luyện, không có đường tắt.",
  },
];
