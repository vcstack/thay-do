/** Phố Hoa — luyện nói theo kịch bản. Nội dung hội thoại tự viết, trình độ HSK1.
 *  Mỗi bước: người đối diện nói một câu, người học chọn câu trả lời đúng. */

export interface SpeakOption {
  zh: string;
  py: string;
  vi: string;
  correct: boolean;
  feedback: string;
}

export interface SpeakStep {
  speaker: string;
  zh: string;
  py: string;
  vi: string;
  options: SpeakOption[];
}

export interface SpeakSpot {
  id: string;
  name: string;
  icon: string;
  desc: string;
  steps: SpeakStep[];
}

export const SPEAK_SPOTS: SpeakSpot[] = [
  {
    id: "tra-quan",
    name: "Trà quán",
    icon: "🍵",
    desc: "Ngồi xuống, gọi một ấm trà và nói chuyện với cô chủ quán.",
    steps: [
      {
        speaker: "Cô chủ quán",
        zh: "你好！请坐。你想喝什么？",
        py: "Nǐ hǎo! Qǐng zuò. Nǐ xiǎng hē shénme?",
        vi: "Xin chào! Mời ngồi. Bạn muốn uống gì?",
        options: [
          { zh: "我想喝茶。", py: "Wǒ xiǎng hē chá.", vi: "Tôi muốn uống trà.", correct: true, feedback: "Đúng rồi! Gọi trà là hợp nhất ở trà quán." },
          { zh: "我要买米。", py: "Wǒ yào mǎi mǐ.", vi: "Tôi muốn mua gạo.", correct: false, feedback: "Trà quán không bán gạo đâu, bạn gọi trà nhé." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "Chưa trả lời được thì cứ gọi một ấm trà trước đã." },
        ],
      },
      {
        speaker: "Cô chủ quán",
        zh: "好的，一壶茶。你要热的还是冷的？",
        py: "Hǎo de, yí hú chá. Nǐ yào rè de háishì lěng de?",
        vi: "Được, một ấm trà. Bạn muốn uống nóng hay lạnh?",
        options: [
          { zh: "我要热的。", py: "Wǒ yào rè de.", vi: "Tôi muốn uống nóng.", correct: true, feedback: "Trà nóng mới ngon, cô chủ khen bạn biết thưởng trà." },
          { zh: "我要米饭。", py: "Wǒ yào mǐfàn.", vi: "Tôi muốn cơm.", correct: false, feedback: "Ở đây chỉ có trà thôi, không có cơm đâu." },
          { zh: "我不喝水。", py: "Wǒ bù hē shuǐ.", vi: "Tôi không uống nước.", correct: false, feedback: "Bạn vừa gọi trà mà, trả lời nóng hay lạnh nhé." },
        ],
      },
      {
        speaker: "Cô chủ quán",
        zh: "茶来了，请慢用！",
        py: "Chá lái le, qǐng màn yòng!",
        vi: "Trà đến rồi, mời bạn dùng từ từ!",
        options: [
          { zh: "谢谢！", py: "Xièxie!", vi: "Cảm ơn!", correct: true, feedback: "Lễ phép lắm! Ngồi nhâm nhi trà và trò chuyện tiếp nhé." },
          { zh: "再见！", py: "Zàijiàn!", vi: "Tạm biệt!", correct: false, feedback: "Trà vừa mới đến, chưa uống đã tạm biệt thì phí quá." },
          { zh: "多少钱？", py: "Duōshao qián?", vi: "Bao nhiêu tiền?", correct: false, feedback: "Uống xong rồi hãy hỏi tiền, giờ cứ nói cảm ơn trước đã." },
        ],
      },
    ],
  },
  {
    id: "sap-hoa-qua",
    name: "Sạp hoa quả",
    icon: "🍎",
    desc: "Mua ít hoa quả, hỏi giá và trả giá như người bản xứ.",
    steps: [
      {
        speaker: "Bà bán hàng",
        zh: "买水果吗？苹果很新鲜！",
        py: "Mǎi shuǐguǒ ma? Píngguǒ hěn xīnxiān!",
        vi: "Mua hoa quả không? Táo rất tươi!",
        options: [
          { zh: "苹果多少钱一斤？", py: "Píngguǒ duōshao qián yì jīn?", vi: "Táo bao nhiêu tiền một cân?", correct: true, feedback: "Hỏi giá thế mới đúng! Một cân là nửa ký nhé." },
          { zh: "我要一本书。", py: "Wǒ yào yì běn shū.", vi: "Tôi muốn một quyển sách.", correct: false, feedback: "Sạp này bán hoa quả, không bán sách đâu." },
          { zh: "你好，我叫小明。", py: "Nǐ hǎo, wǒ jiào Xiǎo Míng.", vi: "Xin chào, tôi tên Tiểu Minh.", correct: false, feedback: "Chào hỏi xong rồi, giờ hỏi giá táo đi." },
        ],
      },
      {
        speaker: "Bà bán hàng",
        zh: "十块钱一斤。",
        py: "Shí kuài qián yì jīn.",
        vi: "Mười đồng một cân.",
        options: [
          { zh: "太贵了，便宜一点儿吧。", py: "Tài guì le, piányi yìdiǎnr ba.", vi: "Đắt quá, rẻ một chút đi.", correct: true, feedback: "Trả giá thế mới ra dáng người đi chợ!" },
          { zh: "我要回家。", py: "Wǒ yào huí jiā.", vi: "Tôi muốn về nhà.", correct: false, feedback: "Chưa mua được táo đã về à? Trả giá thử xem." },
          { zh: "我不喜欢苹果。", py: "Wǒ bù xǐhuan píngguǒ.", vi: "Tôi không thích táo.", correct: false, feedback: "Không thích táo thì hỏi mua loại quả khác, đừng bỏ đi vội." },
        ],
      },
      {
        speaker: "Bà bán hàng",
        zh: "好吧，八块钱一斤。买两斤吧！",
        py: "Hǎo ba, bā kuài qián yì jīn. Mǎi liǎng jīn ba!",
        vi: "Được rồi, tám đồng một cân. Mua hai cân đi!",
        options: [
          { zh: "好的，我买两斤。", py: "Hǎo de, wǒ mǎi liǎng jīn.", vi: "Được, tôi mua hai cân.", correct: true, feedback: "Chốt đơn! Trả giá thành công, mua được táo rẻ." },
          { zh: "我不要。", py: "Wǒ bù yào.", vi: "Tôi không mua.", correct: false, feedback: "Trả giá xong mà không mua thì bà bán hàng buồn lắm đấy." },
          { zh: "谢谢，再见！", py: "Xièxie, zàijiàn!", vi: "Cảm ơn, tạm biệt!", correct: false, feedback: "Chưa trả tiền đã tạm biệt à? Mua táo rồi hãy đi." },
        ],
      },
    ],
  },
  {
    id: "quan-mi",
    name: "Quán mì",
    icon: "🍜",
    desc: "Vào quán mì gọi món, nói rõ mình muốn ăn gì.",
    steps: [
      {
        speaker: "Anh phục vụ",
        zh: "你好！你想吃什么面？",
        py: "Nǐ hǎo! Nǐ xiǎng chī shénme miàn?",
        vi: "Xin chào! Bạn muốn ăn mì gì?",
        options: [
          { zh: "我要一碗牛肉面。", py: "Wǒ yào yì wǎn niúròu miàn.", vi: "Tôi muốn một bát mì thịt bò.", correct: true, feedback: "Gọi món rõ ràng, phục vụ nghe là hiểu ngay." },
          { zh: "我要一杯水。", py: "Wǒ yào yì bēi shuǐ.", vi: "Tôi muốn một cốc nước.", correct: false, feedback: "Quán mì thì gọi mì chứ, nước chỉ uống kèm thôi." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "Chưa biết ăn gì thì gọi thử mì thịt bò nhé." },
        ],
      },
      {
        speaker: "Anh phục vụ",
        zh: "好的！你要大碗还是小碗？",
        py: "Hǎo de! Nǐ yào dà wǎn háishì xiǎo wǎn?",
        vi: "Được! Bạn muốn bát lớn hay bát nhỏ?",
        options: [
          { zh: "我要大碗。", py: "Wǒ yào dà wǎn.", vi: "Tôi muốn bát lớn.", correct: true, feedback: "Bát lớn ăn cho no! Người học giỏi thì ăn cũng phải khỏe." },
          { zh: "我要一本书。", py: "Wǒ yào yì běn shū.", vi: "Tôi muốn một quyển sách.", correct: false, feedback: "Quán mì không bán sách, chọn bát lớn hay bát nhỏ đi." },
          { zh: "我不饿。", py: "Wǒ bù è.", vi: "Tôi không đói.", correct: false, feedback: "Không đói thì vào quán mì làm gì? Gọi một bát nhỏ thử xem." },
        ],
      },
      {
        speaker: "Anh phục vụ",
        zh: "面来了，请慢吃！",
        py: "Miàn lái le, qǐng màn chī!",
        vi: "Mì đến rồi, mời bạn ăn từ từ!",
        options: [
          { zh: "谢谢！很好吃！", py: "Xièxie! Hěn hǎochī!", vi: "Cảm ơn! Rất ngon!", correct: true, feedback: "Khen ngon thế này, lần sau chủ quán còn nhớ mặt bạn." },
          { zh: "多少钱？", py: "Duōshao qián?", vi: "Bao nhiêu tiền?", correct: false, feedback: "Ăn xong rồi hãy hỏi tiền, giờ khen ngon trước đã." },
          { zh: "我走了。", py: "Wǒ zǒu le.", vi: "Tôi đi đây.", correct: false, feedback: "Mì vừa mới bưng ra, ăn đã rồi hãy đi." },
        ],
      },
    ],
  },
  {
    id: "hieu-thuoc",
    name: "Hiệu thuốc",
    icon: "💊",
    desc: "Người hơi mệt, vào hiệu thuốc mua thuốc và hỏi cách dùng.",
    steps: [
      {
        speaker: "Cô bán thuốc",
        zh: "你好！你怎么了？",
        py: "Nǐ hǎo! Nǐ zěnme le?",
        vi: "Xin chào! Bạn bị sao vậy?",
        options: [
          { zh: "我有点儿头疼。", py: "Wǒ yǒudiǎnr tóu téng.", vi: "Tôi hơi đau đầu.", correct: true, feedback: "Nói rõ triệu chứng thì cô bán thuốc mới biết bán thuốc gì." },
          { zh: "我要买苹果。", py: "Wǒ yào mǎi píngguǒ.", vi: "Tôi muốn mua táo.", correct: false, feedback: "Đây là hiệu thuốc, không phải sạp hoa quả đâu." },
          { zh: "我很好。", py: "Wǒ hěn hǎo.", vi: "Tôi rất khỏe.", correct: false, feedback: "Khỏe thì vào hiệu thuốc làm gì? Nói thật là hơi đau đầu đi." },
        ],
      },
      {
        speaker: "Cô bán thuốc",
        zh: "这个药很好，一天吃三次。",
        py: "Zhège yào hěn hǎo, yì tiān chī sān cì.",
        vi: "Thuốc này rất tốt, một ngày uống ba lần.",
        options: [
          { zh: "饭前吃还是饭后吃？", py: "Fàn qián chī háishì fàn hòu chī?", vi: "Uống trước bữa ăn hay sau bữa ăn?", correct: true, feedback: "Hỏi kỹ thế mới đúng! Uống thuốc phải hỏi rõ cách dùng." },
          { zh: "这个多少钱？", py: "Zhège duōshao qián?", vi: "Cái này bao nhiêu tiền?", correct: false, feedback: "Hỏi tiền thì cũng được, nhưng hỏi cách uống quan trọng hơn." },
          { zh: "我不吃药。", py: "Wǒ bù chī yào.", vi: "Tôi không uống thuốc.", correct: false, feedback: "Đau đầu thì phải uống thuốc chứ, hỏi cách dùng đi." },
        ],
      },
      {
        speaker: "Cô bán thuốc",
        zh: "饭后吃，记得多喝水。",
        py: "Fàn hòu chī, jìde duō hē shuǐ.",
        vi: "Uống sau bữa ăn, nhớ uống nhiều nước.",
        options: [
          { zh: "好的，谢谢你！", py: "Hǎo de, xièxie nǐ!", vi: "Được, cảm ơn bạn!", correct: true, feedback: "Chúc bạn mau khỏe! Nhớ uống thuốc đúng giờ nhé." },
          { zh: "我不喜欢喝水。", py: "Wǒ bù xǐhuan hē shuǐ.", vi: "Tôi không thích uống nước.", correct: false, feedback: "Uống thuốc thì phải uống nhiều nước, ngoan nào." },
          { zh: "再见！", py: "Zàijiàn!", vi: "Tạm biệt!", correct: false, feedback: "Mua thuốc xong thì nói cảm ơn trước rồi hãy tạm biệt." },
        ],
      },
    ],
  },
  {
    id: "buu-cuc",
    name: "Bưu cục",
    icon: "📮",
    desc: "Gửi một gói đồ về cho người thân, hỏi giá cước và thời gian.",
    steps: [
      {
        speaker: "Anh nhân viên",
        zh: "你好！你要寄什么？",
        py: "Nǐ hǎo! Nǐ yào jì shénme?",
        vi: "Xin chào! Bạn muốn gửi cái gì?",
        options: [
          { zh: "我要寄一个包裹。", py: "Wǒ yào jì yí gè bāoguǒ.", vi: "Tôi muốn gửi một gói đồ.", correct: true, feedback: "Nói rõ gửi gói đồ, nhân viên mới lấy phiếu cho bạn." },
          { zh: "我要买火车票。", py: "Wǒ yào mǎi huǒchē piào.", vi: "Tôi muốn mua vé tàu.", correct: false, feedback: "Đây là bưu cục, vé tàu thì ra ga mua nhé." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "Muốn gửi gói đồ thì nói rõ ra nào." },
        ],
      },
      {
        speaker: "Anh nhân viên",
        zh: "寄到哪里？",
        py: "Jì dào nǎlǐ?",
        vi: "Gửi đi đâu?",
        options: [
          { zh: "寄到河内。", py: "Jì dào Hénèi.", vi: "Gửi đến Hà Nội.", correct: true, feedback: "Địa chỉ rõ ràng, gói đồ sẽ đến đúng nơi." },
          { zh: "寄到我家。", py: "Jì dào wǒ jiā.", vi: "Gửi về nhà tôi.", correct: false, feedback: "Nhà bạn ở đâu? Nói tên thành phố cụ thể đi." },
          { zh: "我不寄了。", py: "Wǒ bù jì le.", vi: "Tôi không gửi nữa.", correct: false, feedback: "Gói đồ còn chưa gửi, nói địa chỉ đi nào." },
        ],
      },
      {
        speaker: "Anh nhân viên",
        zh: "三天到，二十块钱。",
        py: "Sān tiān dào, èrshí kuài qián.",
        vi: "Ba ngày đến nơi, hai mươi đồng.",
        options: [
          { zh: "好的，谢谢！", py: "Hǎo de, xièxie!", vi: "Được, cảm ơn!", correct: true, feedback: "Gửi xong rồi! Ba ngày nữa người nhà nhận được gói đồ." },
          { zh: "太贵了！", py: "Tài guì le!", vi: "Đắt quá!", correct: false, feedback: "Hai mươi đồng gửi ba ngày là rẻ rồi, đừng trả giá ở bưu cục." },
          { zh: "我走了。", py: "Wǒ zǒu le.", vi: "Tôi đi đây.", correct: false, feedback: "Chưa trả tiền đã đi à? Nói cảm ơn rồi hãy đi." },
        ],
      },
    ],
  },
  {
    id: "khach-diem",
    name: "Khách điếm",
    icon: "🏮",
    desc: "Vào khách điếm thuê một phòng nghỉ qua đêm.",
    steps: [
      {
        speaker: "Cô lễ tân",
        zh: "你好！欢迎光临。你要住几天？",
        py: "Nǐ hǎo! Huānyíng guānglín. Nǐ yào zhù jǐ tiān?",
        vi: "Xin chào! Chào mừng bạn đến. Bạn muốn ở mấy ngày?",
        options: [
          { zh: "我要住两天。", py: "Wǒ yào zhù liǎng tiān.", vi: "Tôi muốn ở hai ngày.", correct: true, feedback: "Trả lời rõ số ngày, lễ tân mới sắp phòng cho bạn." },
          { zh: "我要吃饭。", py: "Wǒ yào chī fàn.", vi: "Tôi muốn ăn cơm.", correct: false, feedback: "Khách điếm có cơm, nhưng lễ tân đang hỏi bạn ở mấy ngày." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "Ở hai ngày nhé, cứ trả lời thế trước đã." },
        ],
      },
      {
        speaker: "Cô lễ tân",
        zh: "好的。单人间还是双人间？",
        py: "Hǎo de. Dānrénjiān háishì shuāngrénjiān?",
        vi: "Được. Phòng đơn hay phòng đôi?",
        options: [
          { zh: "单人间。", py: "Dānrénjiān.", vi: "Phòng đơn.", correct: true, feedback: "Một mình thì ở phòng đơn là hợp lý nhất." },
          { zh: "我要一碗面。", py: "Wǒ yào yì wǎn miàn.", vi: "Tôi muốn một bát mì.", correct: false, feedback: "Đang thuê phòng mà, mì thì xuống quán dưới lầu ăn sau." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "Một mình thì chọn phòng đơn đi." },
        ],
      },
      {
        speaker: "Cô lễ tân",
        zh: "单人间，一天一百块。这是你的钥匙。",
        py: "Dānrénjiān, yì tiān yìbǎi kuài. Zhè shì nǐ de yàoshi.",
        vi: "Phòng đơn, một ngày một trăm đồng. Đây là chìa khóa của bạn.",
        options: [
          { zh: "谢谢！", py: "Xièxie!", vi: "Cảm ơn!", correct: true, feedback: "Nhận chìa khóa rồi lên phòng nghỉ thôi, chúc ngủ ngon!" },
          { zh: "太贵了！", py: "Tài guì le!", vi: "Đắt quá!", correct: false, feedback: "Một trăm đồng một ngày là giá chung rồi, đừng trả giá ở khách điếm." },
          { zh: "我不住了。", py: "Wǒ bù zhù le.", vi: "Tôi không ở nữa.", correct: false, feedback: "Chìa khóa đã đưa rồi, nhận lấy rồi lên phòng đi." },
        ],
      },
    ],
  },
];
