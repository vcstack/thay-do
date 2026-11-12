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
  {
    id: "hieu-sach",
    name: "Hiệu sách",
    icon: "📚",
    desc: "Vào hiệu sách mua một quyển sách học tiếng Trung.",
    steps: [
      {
        speaker: "Anh bán sách",
        zh: "你好！你想买什么书？",
        py: "Nǐ hǎo! Nǐ xiǎng mǎi shénme shū?",
        vi: "Xin chào! Bạn muốn mua sách gì?",
        options: [
          { zh: "我想买一本汉语书。", py: "Wǒ xiǎng mǎi yì běn Hànyǔ shū.", vi: "Tôi muốn mua một quyển sách tiếng Trung.", correct: true, feedback: "Vào hiệu sách thì mua sách chứ còn gì nữa!" },
          { zh: "我要一碗面。", py: "Wǒ yào yì wǎn miàn.", vi: "Tôi muốn một bát mì.", correct: false, feedback: "Hiệu sách không bán mì đâu, quán mì ở cuối phố cơ." },
          { zh: "我要回家。", py: "Wǒ yào huí jiā.", vi: "Tôi muốn về nhà.", correct: false, feedback: "Chưa mua được sách đã về à? Nói rõ muốn mua sách gì đi." },
        ],
      },
      {
        speaker: "Anh bán sách",
        zh: "这本汉语书很好，二十块钱。",
        py: "Zhè běn Hànyǔ shū hěn hǎo, èrshí kuài qián.",
        vi: "Quyển sách tiếng Trung này rất hay, hai mươi đồng.",
        options: [
          { zh: "好的，我买这本。", py: "Hǎo de, wǒ mǎi zhè běn.", vi: "Được, tôi mua quyển này.", correct: true, feedback: "Chốt đơn! Quyển sách hay, giá cũng hợp lý." },
          { zh: "太贵了，我不买。", py: "Tài guì le, wǒ bù mǎi.", vi: "Đắt quá, tôi không mua.", correct: false, feedback: "Hai mươi đồng một quyển sách hay là rẻ rồi, đừng chê đắt." },
          { zh: "我要一杯水。", py: "Wǒ yào yì bēi shuǐ.", vi: "Tôi muốn một cốc nước.", correct: false, feedback: "Đang mua sách mà, nước thì ra quán bên cạnh uống sau." },
        ],
      },
      {
        speaker: "Anh bán sách",
        zh: "谢谢！欢迎下次再来。",
        py: "Xièxie! Huānyíng xià cì zài lái.",
        vi: "Cảm ơn! Chào mừng lần sau lại đến.",
        options: [
          { zh: "谢谢！再见！", py: "Xièxie! Zàijiàn!", vi: "Cảm ơn! Tạm biệt!", correct: true, feedback: "Lễ phép lắm! Về nhà đọc sách chăm chỉ nhé." },
          { zh: "我不喜欢这本书。", py: "Wǒ bù xǐhuān zhè běn shū.", vi: "Tôi không thích quyển sách này.", correct: false, feedback: "Sách đã mua rồi, không thích thì lần sau chọn kỹ hơn nhé." },
          { zh: "多少钱？", py: "Duōshao qián?", vi: "Bao nhiêu tiền?", correct: false, feedback: "Đã trả tiền rồi mà, giờ chỉ cần nói cảm ơn và tạm biệt." },
        ],
      },
    ],
  },
  {
    id: "tiem-banh",
    name: "Tiệm bánh",
    icon: "🥐",
    desc: "Mua ít bánh mì mới ra lò, thơm nức cả phố.",
    steps: [
      {
        speaker: "Cô bán bánh",
        zh: "你好！你要买什么？",
        py: "Nǐ hǎo! Nǐ yào mǎi shénme?",
        vi: "Xin chào! Bạn muốn mua gì?",
        options: [
          { zh: "我要买面包。", py: "Wǒ yào mǎi miànbāo.", vi: "Tôi muốn mua bánh mì.", correct: true, feedback: "Đúng rồi! Bánh mì ở đây mới ra lò, còn nóng hổi." },
          { zh: "我要买衣服。", py: "Wǒ yào mǎi yīfu.", vi: "Tôi muốn mua quần áo.", correct: false, feedback: "Tiệm bánh chỉ bán bánh thôi, quần áo thì ra chợ mua nhé." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "Chưa biết mua gì thì cứ mua bánh mì trước đã." },
        ],
      },
      {
        speaker: "Cô bán bánh",
        zh: "你要几个面包？",
        py: "Nǐ yào jǐ gè miànbāo?",
        vi: "Bạn muốn mấy cái bánh mì?",
        options: [
          { zh: "我要两个。", py: "Wǒ yào liǎng gè.", vi: "Tôi muốn hai cái.", correct: true, feedback: "Hai cái vừa đủ ăn sáng, cô bán bánh gói ngay cho bạn." },
          { zh: "我要一本书。", py: "Wǒ yào yì běn shū.", vi: "Tôi muốn một quyển sách.", correct: false, feedback: "Tiệm bánh không bán sách, nói số bánh bạn muốn mua đi." },
          { zh: "我不吃面包。", py: "Wǒ bù chī miànbāo.", vi: "Tôi không ăn bánh mì.", correct: false, feedback: "Không ăn bánh mì thì vào tiệm bánh làm gì? Mua hai cái thử xem." },
        ],
      },
      {
        speaker: "Cô bán bánh",
        zh: "一共十块钱。",
        py: "Yígòng shí kuài qián.",
        vi: "Tổng cộng mười đồng.",
        options: [
          { zh: "好的，给你钱。", py: "Hǎo de, gěi nǐ qián.", vi: "Được, đưa tiền cho bạn đây.", correct: true, feedback: "Trả tiền xong là có bánh nóng ăn ngay, ngon lắm!" },
          { zh: "我走了。", py: "Wǒ zǒu le.", vi: "Tôi đi đây.", correct: false, feedback: "Chưa trả tiền đã đi à? Đưa tiền rồi hãy lấy bánh." },
          { zh: "谢谢，再见！", py: "Xièxie, zàijiàn!", vi: "Cảm ơn, tạm biệt!", correct: false, feedback: "Trả tiền trước đã, rồi hãy cảm ơn và tạm biệt." },
        ],
      },
    ],
  },
  {
    id: "cho-rau",
    name: "Chợ rau",
    icon: "🥬",
    desc: "Ra chợ rau mua ít rau tươi về nấu cơm.",
    steps: [
      {
        speaker: "Bà bán rau",
        zh: "买菜吗？菜很新鲜！",
        py: "Mǎi cài ma? Cài hěn xīnxiān!",
        vi: "Mua rau không? Rau rất tươi!",
        options: [
          { zh: "白菜多少钱一斤？", py: "Báicài duōshao qián yì jīn?", vi: "Cải thảo bao nhiêu tiền một cân?", correct: true, feedback: "Hỏi giá rau thế mới đúng! Cải thảo ở đây tươi lắm." },
          { zh: "我要买鞋。", py: "Wǒ yào mǎi xié.", vi: "Tôi muốn mua giày.", correct: false, feedback: "Chợ rau chỉ bán rau thôi, giày thì ra cửa hàng giày nhé." },
          { zh: "你好，我叫小明。", py: "Nǐ hǎo, wǒ jiào Xiǎo Míng.", vi: "Xin chào, tôi tên Tiểu Minh.", correct: false, feedback: "Chào hỏi xong rồi, giờ hỏi giá rau đi." },
        ],
      },
      {
        speaker: "Bà bán rau",
        zh: "三块钱一斤。",
        py: "Sān kuài qián yì jīn.",
        vi: "Ba đồng một cân.",
        options: [
          { zh: "我要买两斤。", py: "Wǒ yào mǎi liǎng jīn.", vi: "Tôi muốn mua hai cân.", correct: true, feedback: "Hai cân rau đủ nấu cả bữa cơm, bà bán hàng cân ngay cho bạn." },
          { zh: "太贵了！", py: "Tài guì le!", vi: "Đắt quá!", correct: false, feedback: "Ba đồng một cân là rẻ rồi, rau tươi thế này đừng trả giá nữa." },
          { zh: "我不吃菜。", py: "Wǒ bù chī cài.", vi: "Tôi không ăn rau.", correct: false, feedback: "Không ăn rau thì sức khỏe không tốt đâu, mua hai cân về nấu thử đi." },
        ],
      },
      {
        speaker: "Bà bán rau",
        zh: "一共六块钱。",
        py: "Yígòng liù kuài qián.",
        vi: "Tổng cộng sáu đồng.",
        options: [
          { zh: "好的，给你。", py: "Hǎo de, gěi nǐ.", vi: "Được, đưa cho bà đây.", correct: true, feedback: "Trả tiền xong, xách rau về nấu cơm thôi!" },
          { zh: "我不要了。", py: "Wǒ bù yào le.", vi: "Tôi không mua nữa.", correct: false, feedback: "Rau đã cân rồi, đừng bỏ đi vội, trả tiền đi nào." },
          { zh: "再见！", py: "Zàijiàn!", vi: "Tạm biệt!", correct: false, feedback: "Chưa trả tiền đã tạm biệt à? Đưa tiền rồi hãy đi." },
        ],
      },
    ],
  },
  {
    id: "quan-ca-phe",
    name: "Quán cà phê",
    icon: "☕",
    desc: "Ngồi quán cà phê gọi một ly, vừa uống vừa học bài.",
    steps: [
      {
        speaker: "Anh phục vụ",
        zh: "你好！你想喝什么？",
        py: "Nǐ hǎo! Nǐ xiǎng hē shénme?",
        vi: "Xin chào! Bạn muốn uống gì?",
        options: [
          { zh: "我要一杯咖啡。", py: "Wǒ yào yì bēi kāfēi.", vi: "Tôi muốn một ly cà phê.", correct: true, feedback: "Vào quán cà phê thì gọi cà phê chứ còn gì nữa!" },
          { zh: "我要一碗面。", py: "Wǒ yào yì wǎn miàn.", vi: "Tôi muốn một bát mì.", correct: false, feedback: "Quán cà phê không bán mì đâu, gọi cà phê đi." },
          { zh: "我不喝水。", py: "Wǒ bù hē shuǐ.", vi: "Tôi không uống nước.", correct: false, feedback: "Không uống nước thì uống cà phê nhé, gọi một ly đi." },
        ],
      },
      {
        speaker: "Anh phục vụ",
        zh: "你要热的还是冷的？",
        py: "Nǐ yào rè de háishì lěng de?",
        vi: "Bạn muốn uống nóng hay lạnh?",
        options: [
          { zh: "我要热的。", py: "Wǒ yào rè de.", vi: "Tôi muốn uống nóng.", correct: true, feedback: "Cà phê nóng thơm lắm, ngồi học bài mà uống thì tỉnh táo cả buổi." },
          { zh: "我要米饭。", py: "Wǒ yào mǐfàn.", vi: "Tôi muốn cơm.", correct: false, feedback: "Quán cà phê không bán cơm, chọn nóng hay lạnh đi." },
          { zh: "我要一本书。", py: "Wǒ yào yì běn shū.", vi: "Tôi muốn một quyển sách.", correct: false, feedback: "Sách thì ra hiệu sách mua, ở đây chỉ có cà phê thôi." },
        ],
      },
      {
        speaker: "Anh phục vụ",
        zh: "咖啡来了，请慢用！",
        py: "Kāfēi lái le, qǐng màn yòng!",
        vi: "Cà phê đến rồi, mời bạn dùng từ từ!",
        options: [
          { zh: "谢谢！很好喝！", py: "Xièxie! Hěn hǎohē!", vi: "Cảm ơn! Rất ngon!", correct: true, feedback: "Khen ngon thế này, lần sau phục vụ còn nhớ mặt bạn." },
          { zh: "多少钱？", py: "Duōshao qián?", vi: "Bao nhiêu tiền?", correct: false, feedback: "Uống xong rồi hãy hỏi tiền, giờ khen ngon trước đã." },
          { zh: "我走了。", py: "Wǒ zǒu le.", vi: "Tôi đi đây.", correct: false, feedback: "Cà phê vừa mới bưng ra, uống đã rồi hãy đi." },
        ],
      },
    ],
  },
  {
    id: "rap-hat",
    name: "Rạp hát",
    icon: "🎭",
    desc: "Mua vé xem kịch, tối nay có vở hay lắm.",
    steps: [
      {
        speaker: "Cô bán vé",
        zh: "你好！你要买几张票？",
        py: "Nǐ hǎo! Nǐ yào mǎi jǐ zhāng piào?",
        vi: "Xin chào! Bạn muốn mua mấy vé?",
        options: [
          { zh: "我要买两张票。", py: "Wǒ yào mǎi liǎng zhāng piào.", vi: "Tôi muốn mua hai vé.", correct: true, feedback: "Hai vé là vừa, một vé cho bạn, một vé cho bạn của bạn." },
          { zh: "我要买苹果。", py: "Wǒ yào mǎi píngguǒ.", vi: "Tôi muốn mua táo.", correct: false, feedback: "Rạp hát bán vé xem kịch, không bán táo đâu." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "Mua hai vé nhé, cứ trả lời thế trước đã." },
        ],
      },
      {
        speaker: "Cô bán vé",
        zh: "今天晚上七点开始。",
        py: "Jīntiān wǎnshang qī diǎn kāishǐ.",
        vi: "Tối nay 7 giờ bắt đầu.",
        options: [
          { zh: "好的，七点我来。", py: "Hǎo de, qī diǎn wǒ lái.", vi: "Được, 7 giờ tôi đến.", correct: true, feedback: "Nhớ đến sớm mười phút để tìm chỗ ngồi nhé." },
          { zh: "我不喜欢看戏。", py: "Wǒ bù xǐhuān kàn xì.", vi: "Tôi không thích xem kịch.", correct: false, feedback: "Không thích xem kịch thì mua vé làm gì? Bảy giờ đến xem thử đi." },
          { zh: "我要回家。", py: "Wǒ yào huí jiā.", vi: "Tôi muốn về nhà.", correct: false, feedback: "Vé còn chưa mua xong đã về à? Hẹn giờ đến xem đi." },
        ],
      },
      {
        speaker: "Cô bán vé",
        zh: "一张票五十块，两张一百块。",
        py: "Yì zhāng piào wǔshí kuài, liǎng zhāng yìbǎi kuài.",
        vi: "Một vé năm mươi đồng, hai vé một trăm đồng.",
        options: [
          { zh: "好的，我买两张。", py: "Hǎo de, wǒ mǎi liǎng zhāng.", vi: "Được, tôi mua hai vé.", correct: true, feedback: "Mua vé xong rồi! Tối nay bảy giờ gặp nhau ở rạp hát nhé." },
          { zh: "太贵了，我不买了。", py: "Tài guì le, wǒ bù mǎi le.", vi: "Đắt quá, tôi không mua nữa.", correct: false, feedback: "Năm mươi đồng một vé xem kịch là giá chung rồi, đừng chê đắt." },
          { zh: "谢谢，再见！", py: "Xièxie, zàijiàn!", vi: "Cảm ơn, tạm biệt!", correct: false, feedback: "Chưa trả tiền đã tạm biệt à? Mua vé rồi hãy đi." },
        ],
      },
    ],
  },
  {
    id: "tiem-may",
    name: "Tiệm may",
    icon: "🧵",
    desc: "Đặt may một chiếc áo, chọn vải và chọn màu.",
    steps: [
      {
        speaker: "Bác thợ may",
        zh: "你好！你要做什么衣服？",
        py: "Nǐ hǎo! Nǐ yào zuò shénme yīfu?",
        vi: "Xin chào! Bạn muốn may quần áo gì?",
        options: [
          { zh: "我想做一件衬衫。", py: "Wǒ xiǎng zuò yí jiàn chènshān.", vi: "Tôi muốn may một chiếc áo sơ mi.", correct: true, feedback: "Nói rõ may áo sơ mi, bác thợ mới đo người cho bạn." },
          { zh: "我要买米。", py: "Wǒ yào mǎi mǐ.", vi: "Tôi muốn mua gạo.", correct: false, feedback: "Đây là tiệm may, không phải cửa hàng gạo đâu." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "May một chiếc áo sơ mi nhé, cứ trả lời thế trước đã." },
        ],
      },
      {
        speaker: "Bác thợ may",
        zh: "你喜欢什么颜色？",
        py: "Nǐ xǐhuān shénme yánsè?",
        vi: "Bạn thích màu gì?",
        options: [
          { zh: "我喜欢蓝色。", py: "Wǒ xǐhuān lán sè.", vi: "Tôi thích màu xanh dương.", correct: true, feedback: "Áo sơ mi màu xanh dương đẹp lắm, mặc đi học hay đi chơi đều hợp." },
          { zh: "我要一碗面。", py: "Wǒ yào yì wǎn miàn.", vi: "Tôi muốn một bát mì.", correct: false, feedback: "Đang chọn màu áo mà, mì thì ra quán mì ăn sau." },
          { zh: "我不喜欢衣服。", py: "Wǒ bù xǐhuān yīfu.", vi: "Tôi không thích quần áo.", correct: false, feedback: "Không thích quần áo thì vào tiệm may làm gì? Chọn màu xanh dương đi." },
        ],
      },
      {
        speaker: "Bác thợ may",
        zh: "三天以后来取，好吗？",
        py: "Sān tiān yǐhòu lái qǔ, hǎo ma?",
        vi: "Ba ngày nữa đến lấy, được không?",
        options: [
          { zh: "好的，谢谢！", py: "Hǎo de, xièxie!", vi: "Được, cảm ơn!", correct: true, feedback: "Hẹn xong rồi! Ba ngày nữa đến lấy áo sơ mi mới nhé." },
          { zh: "我现在就要。", py: "Wǒ xiànzài jiù yào.", vi: "Tôi muốn lấy ngay bây giờ.", correct: false, feedback: "May áo phải mất ba ngày, không lấy ngay được đâu." },
          { zh: "太贵了！", py: "Tài guì le!", vi: "Đắt quá!", correct: false, feedback: "Bác thợ còn chưa nói giá mà, hẹn ngày lấy áo trước đã." },
        ],
      },
    ],
  },
  {
    id: "tiem-hoa",
    name: "Tiệm hoa",
    icon: "🌸",
    desc: "Mua một bó hoa tặng mẹ, hỏi giá từng loại hoa.",
    steps: [
      {
        speaker: "Cô bán hoa",
        zh: "你好！你想买什么花？",
        py: "Nǐ hǎo! Nǐ xiǎng mǎi shénme huā?",
        vi: "Xin chào! Bạn muốn mua hoa gì?",
        options: [
          { zh: "我想买玫瑰花。", py: "Wǒ xiǎng mǎi méiguī huā.", vi: "Tôi muốn mua hoa hồng.", correct: true, feedback: "Hoa hồng tặng mẹ là hợp nhất, cô bán hoa khen bạn có hiếu." },
          { zh: "我要买一碗面。", py: "Wǒ yào yì wǎn miàn.", vi: "Tôi muốn một bát mì.", correct: false, feedback: "Tiệm hoa chỉ bán hoa thôi, mì thì ra quán mì ăn sau." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "Chưa biết mua hoa gì thì mua hoa hồng tặng mẹ nhé." },
        ],
      },
      {
        speaker: "Cô bán hoa",
        zh: "玫瑰花很漂亮。你要买几枝？",
        py: "Méiguī huā hěn piàoliang. Nǐ yào mǎi jǐ zhī?",
        vi: "Hoa hồng rất đẹp. Bạn muốn mua mấy cành?",
        options: [
          { zh: "我要买三枝。", py: "Wǒ yào mǎi sān zhī.", vi: "Tôi muốn mua ba cành.", correct: true, feedback: "Ba cành hoa hồng vừa đẹp, cô bán hoa gói ngay cho bạn." },
          { zh: "我要一本书。", py: "Wǒ yào yì běn shū.", vi: "Tôi muốn một quyển sách.", correct: false, feedback: "Tiệm hoa không bán sách, nói số cành hoa bạn muốn mua đi." },
          { zh: "我不喜欢花。", py: "Wǒ bù xǐhuān huā.", vi: "Tôi không thích hoa.", correct: false, feedback: "Không thích hoa thì vào tiệm hoa làm gì? Mua ba cành tặng mẹ thử xem." },
        ],
      },
      {
        speaker: "Cô bán hoa",
        zh: "一枝十块钱，一共三十块钱。",
        py: "Yì zhī shí kuài qián, yígòng sānshí kuài qián.",
        vi: "Một cành mười đồng, tổng cộng ba mươi đồng.",
        options: [
          { zh: "好的，给你钱。", py: "Hǎo de, gěi nǐ qián.", vi: "Được, đưa tiền cho bạn đây.", correct: true, feedback: "Trả tiền xong là có hoa đẹp mang về tặng mẹ rồi!" },
          { zh: "太贵了，我不买了。", py: "Tài guì le, wǒ bù mǎi le.", vi: "Đắt quá, tôi không mua nữa.", correct: false, feedback: "Hoa hồng tươi thế này mà mười đồng một cành là hợp lý rồi." },
          { zh: "我走了。", py: "Wǒ zǒu le.", vi: "Tôi đi đây.", correct: false, feedback: "Chưa trả tiền đã đi à? Đưa tiền rồi hãy lấy hoa." },
        ],
      },
      {
        speaker: "Cô bán hoa",
        zh: "花很漂亮，你妈妈一定喜欢！",
        py: "Huā hěn piàoliang, nǐ māma yídìng xǐhuān!",
        vi: "Hoa rất đẹp, mẹ bạn nhất định sẽ thích!",
        options: [
          { zh: "谢谢！再见！", py: "Xièxie! Zàijiàn!", vi: "Cảm ơn! Tạm biệt!", correct: true, feedback: "Mang hoa về tặng mẹ đi, mẹ bạn sẽ vui lắm đấy." },
          { zh: "我不喜欢玫瑰花。", py: "Wǒ bù xǐhuān méiguī huā.", vi: "Tôi không thích hoa hồng.", correct: false, feedback: "Hoa đã mua rồi, mang về tặng mẹ rồi hãy nói thích hay không." },
          { zh: "多少钱？", py: "Duōshao qián?", vi: "Bao nhiêu tiền?", correct: false, feedback: "Đã trả tiền rồi mà, giờ chỉ cần nói cảm ơn và tạm biệt." },
        ],
      },
    ],
  },
  {
    id: "ben-xe",
    name: "Bến xe",
    icon: "🚌",
    desc: "Hỏi xe buýt đi đâu, mấy giờ chạy và mua vé lên xe.",
    steps: [
      {
        speaker: "Bác tài xế",
        zh: "你好！你要去哪里？",
        py: "Nǐ hǎo! Nǐ yào qù nǎlǐ?",
        vi: "Xin chào! Bạn muốn đi đâu?",
        options: [
          { zh: "我要去学校。", py: "Wǒ yào qù xuéxiào.", vi: "Tôi muốn đến trường.", correct: true, feedback: "Nói rõ đi đâu, bác tài mới chỉ đúng xe cho bạn." },
          { zh: "我要买花。", py: "Wǒ yào mǎi huā.", vi: "Tôi muốn mua hoa.", correct: false, feedback: "Bến xe không bán hoa đâu, tiệm hoa ở cuối phố cơ." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "Muốn đi học thì nói là đi trường đi nào." },
        ],
      },
      {
        speaker: "Bác tài xế",
        zh: "去学校坐三路车。",
        py: "Qù xuéxiào zuò sān lù chē.",
        vi: "Đi đến trường thì đi xe buýt số 3.",
        options: [
          { zh: "三路车几点开？", py: "Sān lù chē jǐ diǎn kāi?", vi: "Xe số 3 mấy giờ chạy?", correct: true, feedback: "Hỏi giờ xe chạy thế mới đúng, khỏi phải đứng đợi lâu." },
          { zh: "我要一杯咖啡。", py: "Wǒ yào yì bēi kāfēi.", vi: "Tôi muốn một ly cà phê.", correct: false, feedback: "Bến xe không bán cà phê, hỏi giờ xe chạy đi." },
          { zh: "我不坐车。", py: "Wǒ bú zuò chē.", vi: "Tôi không đi xe.", correct: false, feedback: "Không đi xe thì ra bến xe làm gì? Hỏi giờ xe chạy đi." },
        ],
      },
      {
        speaker: "Bác tài xế",
        zh: "八点开车，一张票两块钱。",
        py: "Bā diǎn kāi chē, yì zhāng piào liǎng kuài qián.",
        vi: "Tám giờ chạy, một vé hai đồng.",
        options: [
          { zh: "好的，我买一张票。", py: "Hǎo de, wǒ mǎi yì zhāng piào.", vi: "Được, tôi mua một vé.", correct: true, feedback: "Mua vé xong rồi, tám giờ xe chạy, nhớ đến sớm nhé." },
          { zh: "太贵了！", py: "Tài guì le!", vi: "Đắt quá!", correct: false, feedback: "Hai đồng một vé xe buýt là rẻ rồi, đừng trả giá ở bến xe." },
          { zh: "我要回家。", py: "Wǒ yào huí jiā.", vi: "Tôi muốn về nhà.", correct: false, feedback: "Vé còn chưa mua xong đã về à? Mua vé rồi hãy đi." },
        ],
      },
      {
        speaker: "Bác tài xế",
        zh: "车来了，请上车！",
        py: "Chē lái le, qǐng shàng chē!",
        vi: "Xe đến rồi, mời lên xe!",
        options: [
          { zh: "谢谢！", py: "Xièxie!", vi: "Cảm ơn!", correct: true, feedback: "Lên xe thôi! Chúc bạn đi học vui vẻ." },
          { zh: "再见！", py: "Zàijiàn!", vi: "Tạm biệt!", correct: false, feedback: "Xe vừa mới đến, lên xe đã rồi hãy tạm biệt bác tài." },
          { zh: "我不去学校。", py: "Wǒ bú qù xuéxiào.", vi: "Tôi không đi trường nữa.", correct: false, feedback: "Vé đã mua rồi, lên xe đi học đi nào." },
        ],
      },
    ],
  },
  {
    id: "cong-vien",
    name: "Công viên",
    icon: "🌳",
    desc: "Gặp bạn mới trong công viên, hỏi đường và rủ nhau tập thể dục.",
    steps: [
      {
        speaker: "Bạn mới quen",
        zh: "你好！你也来公园吗？",
        py: "Nǐ hǎo! Nǐ yě lái gōngyuàn ma?",
        vi: "Xin chào! Bạn cũng đến công viên à?",
        options: [
          { zh: "是，我来公园跑步。", py: "Shì, wǒ lái gōngyuàn pǎobù.", vi: "Đúng, tôi đến công viên chạy bộ.", correct: true, feedback: "Trả lời thế là bắt chuyện được ngay, bạn mới rất vui." },
          { zh: "我要买票。", py: "Wǒ yào mǎi piào.", vi: "Tôi muốn mua vé.", correct: false, feedback: "Công viên vào cửa miễn phí, không cần mua vé đâu." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "Bạn đến công viên chạy bộ mà, nói thế đi." },
        ],
      },
      {
        speaker: "Bạn mới quen",
        zh: "公园很大，你知道湖在哪里吗？",
        py: "Gōngyuàn hěn dà, nǐ zhīdào hú zài nǎlǐ ma?",
        vi: "Công viên rất lớn, bạn biết hồ ở đâu không?",
        options: [
          { zh: "湖在前面，往前走。", py: "Hú zài qiánmiàn, wǎng qián zǒu.", vi: "Hồ ở phía trước, đi thẳng về phía trước.", correct: true, feedback: "Chỉ đường rõ ràng thế này, bạn mới cảm ơn bạn lắm." },
          { zh: "我要一碗面。", py: "Wǒ yào yì wǎn miàn.", vi: "Tôi muốn một bát mì.", correct: false, feedback: "Đang chỉ đường ra hồ mà, mì thì ra quán ăn sau." },
          { zh: "我不喜欢公园。", py: "Wǒ bù xǐhuān gōngyuàn.", vi: "Tôi không thích công viên.", correct: false, feedback: "Không thích công viên thì bạn đến đây chạy bộ làm gì?" },
        ],
      },
      {
        speaker: "Bạn mới quen",
        zh: "明天早上我们一起跑步，好吗？",
        py: "Míngtiān zǎoshang wǒmen yìqǐ pǎobù, hǎo ma?",
        vi: "Sáng mai chúng ta cùng chạy bộ nhé, được không?",
        options: [
          { zh: "好啊，明天七点见！", py: "Hǎo a, míngtiān qī diǎn jiàn!", vi: "Được, mai 7 giờ gặp nhé!", correct: true, feedback: "Hẹn xong rồi! Có bạn chạy cùng thì tập thể dục vui hơn nhiều." },
          { zh: "我不去。", py: "Wǒ bú qù.", vi: "Tôi không đi.", correct: false, feedback: "Chạy bộ cùng bạn mới vui thế mà, hẹn bảy giờ sáng mai đi." },
          { zh: "我要回家吃饭。", py: "Wǒ yào huí jiā chī fàn.", vi: "Tôi muốn về nhà ăn cơm.", correct: false, feedback: "Ăn cơm thì tối về ăn, sáng mai hẹn chạy bộ trước đã." },
        ],
      },
      {
        speaker: "Bạn mới quen",
        zh: "太好了！明天见！",
        py: "Tài hǎo le! Míngtiān jiàn!",
        vi: "Tuyệt quá! Mai gặp nhé!",
        options: [
          { zh: "明天见！", py: "Míngtiān jiàn!", vi: "Mai gặp nhé!", correct: true, feedback: "Kết bạn mới thành công! Mai bảy giờ gặp nhau ở công viên nhé." },
          { zh: "再见，我不来了。", py: "Zàijiàn, wǒ bù lái le.", vi: "Tạm biệt, tôi không đến nữa.", correct: false, feedback: "Vừa hẹn chạy bộ xong đã nói không đến à? Hẹn rồi thì phải giữ lời." },
          { zh: "谢谢，我不要。", py: "Xièxie, wǒ bú yào.", vi: "Cảm ơn, tôi không cần.", correct: false, feedback: "Bạn mới rủ chạy bộ chứ có cho gì đâu mà nói không cần." },
        ],
      },
    ],
  },
  {
    id: "quan-tra-sua",
    name: "Quán trà sữa",
    icon: "🧋",
    desc: "Gọi một ly trà sữa, chọn ngọt và đá, hỏi giá rồi trả tiền.",
    steps: [
      {
        speaker: "Cô bán trà sữa",
        zh: "你好！你想喝什么？",
        py: "Nǐ hǎo! Nǐ xiǎng hē shénme?",
        vi: "Xin chào! Bạn muốn uống gì?",
        options: [
          { zh: "我想喝一杯奶茶。", py: "Wǒ xiǎng hē yì bēi nǎichá.", vi: "Tôi muốn uống một ly trà sữa.", correct: true, feedback: "Vào quán trà sữa thì gọi trà sữa chứ còn gì nữa!" },
          { zh: "我要一碗面。", py: "Wǒ yào yì wǎn miàn.", vi: "Tôi muốn một bát mì.", correct: false, feedback: "Quán trà sữa không bán mì đâu, gọi trà sữa đi." },
          { zh: "我要买花。", py: "Wǒ yào mǎi huā.", vi: "Tôi muốn mua hoa.", correct: false, feedback: "Muốn mua hoa thì ra tiệm hoa, ở đây chỉ bán trà sữa thôi." },
        ],
      },
      {
        speaker: "Cô bán trà sữa",
        zh: "你要多糖还是少糖？",
        py: "Nǐ yào duō táng háishì shǎo táng?",
        vi: "Bạn muốn nhiều đường hay ít đường?",
        options: [
          { zh: "我要少糖，多冰。", py: "Wǒ yào shǎo táng, duō bīng.", vi: "Tôi muốn ít đường, nhiều đá.", correct: true, feedback: "Ít đường nhiều đá, uống mát mà không sợ ngọt quá." },
          { zh: "我要热的米饭。", py: "Wǒ yào rè de mǐfàn.", vi: "Tôi muốn cơm nóng.", correct: false, feedback: "Quán trà sữa không bán cơm, chọn nhiều đường hay ít đường đi." },
          { zh: "我不知道。", py: "Wǒ bù zhīdào.", vi: "Tôi không biết.", correct: false, feedback: "Chưa biết chọn gì thì gọi ít đường, nhiều đá thử xem." },
        ],
      },
      {
        speaker: "Cô bán trà sữa",
        zh: "好的，一杯奶茶十五块钱。",
        py: "Hǎo de, yì bēi nǎichá shíwǔ kuài qián.",
        vi: "Được, một ly trà sữa mười lăm đồng.",
        options: [
          { zh: "好的，给你钱。", py: "Hǎo de, gěi nǐ qián.", vi: "Được, đưa tiền cho bạn đây.", correct: true, feedback: "Trả tiền xong là có trà sữa mát lạnh uống ngay!" },
          { zh: "太贵了，我不买了。", py: "Tài guì le, wǒ bù mǎi le.", vi: "Đắt quá, tôi không mua nữa.", correct: false, feedback: "Mười lăm đồng một ly trà sữa là giá chung rồi, đừng chê đắt." },
          { zh: "我走了。", py: "Wǒ zǒu le.", vi: "Tôi đi đây.", correct: false, feedback: "Chưa trả tiền đã đi à? Đưa tiền rồi hãy lấy trà sữa." },
        ],
      },
      {
        speaker: "Cô bán trà sữa",
        zh: "奶茶来了，请慢用！",
        py: "Nǎichá lái le, qǐng màn yòng!",
        vi: "Trà sữa đến rồi, mời bạn dùng từ từ!",
        options: [
          { zh: "谢谢！很好喝！", py: "Xièxie! Hěn hǎohē!", vi: "Cảm ơn! Rất ngon!", correct: true, feedback: "Khen ngon thế này, lần sau cô bán trà sữa còn nhớ mặt bạn." },
          { zh: "多少钱？", py: "Duōshao qián?", vi: "Bao nhiêu tiền?", correct: false, feedback: "Đã trả tiền rồi mà, giờ khen ngon trước đã." },
          { zh: "我不喝奶茶。", py: "Wǒ bù hē nǎichá.", vi: "Tôi không uống trà sữa.", correct: false, feedback: "Vừa gọi trà sữa xong mà, uống thử đi, ngon lắm." },
        ],
      },
    ],
  },
];
