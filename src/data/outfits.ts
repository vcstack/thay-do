/** Tủ áo: các bộ trang phục đổi màu cho học sinh 3D trong sân trường. */

/** Một bộ trang phục: màu áo dài + màu mũ/khăn (khăn đóng, nơ, hoa cài tóc, đai lưng). */
export interface Outfit {
  id: string;
  name: string;
  /** Màu áo dài (tà áo, thân áo, tay áo, cổ áo). */
  robe: string;
  /** Màu mũ/khăn + đai lưng (khăn đóng của nam, nơ/hoa của nữ). */
  hat: string;
}

export const OUTFITS: Outfit[] = [
  { id: "ao-lam", name: "Áo xanh lam", robe: "#3a6ea5", hat: "#d9a441" },
  { id: "ao-do", name: "Áo đỏ son", robe: "#b3372a", hat: "#f6ead2" },
  { id: "ao-vang", name: "Áo vàng nghệ", robe: "#d9a441", hat: "#8f2a20" },
  { id: "ao-tim", name: "Áo tím huế", robe: "#8a6fb8", hat: "#f6ead2" },
  { id: "ao-trang", name: "Áo trắng ngà", robe: "#f6ead2", hat: "#b3372a" },
  { id: "ao-luc", name: "Áo lục trúc", robe: "#4d7c3a", hat: "#d9a441" },
  { id: "ao-hong", name: "Áo hồng đào", robe: "#e87a90", hat: "#4d7c3a" },
  { id: "ao-cham", name: "Áo chàm đậm", robe: "#2e4057", hat: "#d9a441" },
];

export function getOutfit(id: string | undefined): Outfit | undefined {
  return OUTFITS.find((o) => o.id === id);
}

/**
 * Màu áo gốc đã bake vào texture vải của từng model Blender
 * (xem blender/build_characters.py). Texture vải có nền xám gần trắng nên
 * màu trong .glb = nền vải × màu gốc; muốn đổi sang màu mới thì nhân
 * material.color với (màu mới / màu gốc).
 */
export const BASE_ROBE_BY_MODEL: Record<string, string> = {
  Student_M1: "#3a6ea5",
  Student_M2: "#b3372a",
  Student_M3: "#4d7c3a",
  Student_F1: "#e87a90",
  Student_F2: "#8a6fb8",
  Student_F3: "#f6ead2",
};

/** Key lưu trang phục đã chọn của từng học sinh vào localStorage. */
export const OUTFITS_KEY = "thaydo:outfits";

export function loadOutfits(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(OUTFITS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    // Chỉ giữ lại bộ còn tồn tại trong danh sách.
    return Object.fromEntries(
      Object.entries(parsed).filter(([, id]) => OUTFITS.some((o) => o.id === id))
    );
  } catch {
    return {};
  }
}

export function saveOutfits(all: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(OUTFITS_KEY, JSON.stringify(all));
  } catch {
    // Bộ nhớ đầy hoặc bị chặn thì thôi, trang phục vẫn đổi trong phiên này.
  }
}
