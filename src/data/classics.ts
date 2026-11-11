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
];
