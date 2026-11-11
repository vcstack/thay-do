/** 12 thẻ "xin chữ" theo mong ước — bấm vào thì mở trang luyện viết chữ đó.
 *  Danh sách tự chọn, không copy từ trang khác. */

export interface WishChar {
  wish: string;
  char: string;
  py: string;
  meaning: string;
}

export const WISH_CHARS: WishChar[] = [
  { wish: "May mắn", char: "福", py: "fú", meaning: "Phúc — may mắn, phúc lộc đầy nhà" },
  { wish: "Tiền tài", char: "财", py: "cái", meaning: "Tài — tiền tài, của cải dồi dào" },
  { wish: "Bình an", char: "安", py: "ān", meaning: "An — bình an, yên ổn" },
  { wish: "Khỏe mạnh", char: "康", py: "kāng", meaning: "Khang — khỏe mạnh, an khang" },
  { wish: "Sống lâu", char: "寿", py: "shòu", meaning: "Thọ — sống lâu trăm tuổi" },
  { wish: "Vui vẻ", char: "乐", py: "lè", meaning: "Lạc — vui vẻ, hạnh phúc" },
  { wish: "Yêu thương", char: "爱", py: "ài", meaning: "Ái — yêu thương, tình cảm" },
  { wish: "Trí tuệ", char: "智", py: "zhì", meaning: "Trí — trí tuệ, sáng suốt" },
  { wish: "Dũng cảm", char: "勇", py: "yǒng", meaning: "Dũng — dũng cảm, can đảm" },
  { wish: "Thuận lợi", char: "顺", py: "shùn", meaning: "Thuận — thuận buồm xuôi gió" },
  { wish: "Hỷ sự", char: "喜", py: "xǐ", meaning: "Hỷ — vui mừng, chuyện vui" },
  { wish: "Lộc lá", char: "禄", py: "lù", meaning: "Lộc — lộc lá, công danh" },
];
