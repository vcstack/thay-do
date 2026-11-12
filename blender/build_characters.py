# build_characters.py — 6 học sinh (nam/nữ đa dạng) + 1 thầy đồ.
# Mỗi nhân vật là 1 Empty (Student_M1...) chứa các mesh, xuất chung vào characters.glb.
# Nhân vật quay mặt +z (three.js), gốc ở mặt đất giữa 2 chân, cao ~1.9.
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

OUT = os.path.expanduser("~/workspace/thay-do-web/public/models/characters.glb")
clean()

DARK_PANTS = mat("pants", "#2b2118", 0.9)
BLACK = mat("black", "#1c1410", 0.85)
GOLD = mat("gold", "#d9a441", 0.4, 0.4)
WHITE = mat("white", "#f6f1de", 0.9)
BEARD_WHITE = mat("beard_white", "#e8e0cc", 0.9)


def P(cid, name):
    return f"{cid}_{name}"


def build_character(cid, robe_hex, skin_hex, gender="male", hair="khan_dong",
                    accessory=None, wide=False, sash_hex="#d9a441"):
    """Dựng 1 nhân vật, trả về Empty group. accessory: None|'book'|'fan'|'bag'|'staff'."""
    grp = group(cid)
    robe = mat(f"robe_{cid}", robe_hex, 0.8, tex="fabric")
    robe_dark = mat(f"robe_dark_{cid}", robe_hex, 0.85, tex="fabric")
    skin = mat(f"skin_{cid}", skin_hex, 0.7)
    pants = DARK_PANTS

    r_top = 0.34 if wide else 0.30   # eo
    r_bot = 0.50 if wide else 0.42   # gấu áo
    r_sh = 0.34 if wide else 0.26    # vai

    def parent(o):
        o.parent = grp
        return o

    # ---- Chân (quần đen, chủ yếu bị áo dài che) ----
    for x in (-0.13, 0.13):
        parent(cyl(P(cid, "leg"), (x, 0.25, 0), 0.08, 0.09, 0.5, pants, vertices=8))
    # ---- Tà áo dài (váy dài) ----
    parent(cyl(P(cid, "skirt"), (0, 0.4, 0), r_top, r_bot, 0.7, robe, vertices=16))
    # ---- 2 tấm tà trước/sau (hơi xòe) ----
    pw = 0.55 if gender == "female" else 0.5
    parent(box(P(cid, "panel_f"), (0, 0.42, 0.30), (pw, 0.7, 0.03), robe_dark,
              bevel_w=0.01, rx=-0.08))
    parent(box(P(cid, "panel_b"), (0, 0.42, -0.30), (pw, 0.7, 0.03), robe_dark,
              bevel_w=0.01, rx=0.08))
    # ---- Thân trên ----
    parent(cyl(P(cid, "torso"), (0, 1.1, 0), r_sh, r_top, 0.7, robe, vertices=16))
    # ---- Cổ áo + đai lưng ----
    parent(torus(P(cid, "collar"), (0, 1.46, 0), 0.17, 0.035, robe_dark, rot=(0, 0, 0)))
    parent(cyl(P(cid, "belt"), (0, 0.76, 0), 0.325, 0.335, 0.09,
               mat(f"sash_{cid}", sash_hex, 0.4, 0.4), vertices=16))
    # ---- Tay (buông xuôi, hơi xòe) ----
    for sx in (-1, 1):
        parent(cyl(P(cid, f"arm_{'L' if sx < 0 else 'R'}"), (sx * 0.35, 1.12, 0),
                   0.055, 0.065, 0.55, robe, vertices=10, rz=sx * 0.12))
        parent(sphere(P(cid, f"hand_{'L' if sx < 0 else 'R'}"), (sx * 0.39, 0.84, 0.02),
                      0.07, skin, segments=10, rings=8))
    # ---- Đầu ----
    parent(sphere(P(cid, "head"), (0, 1.62, 0), 0.27, skin,
                  scale=(1, 1.05, 0.95), segments=20, rings=14))
    # ---- Mắt: tròng trắng + con ngươi (nhìn có hồn hơn mắt đen đặc) ----
    eye_white = mat(f"eyewhite_{cid}", "#fdfdf8", 0.4)
    for x in (-0.09, 0.09):
        parent(sphere(P(cid, "eye"), (x, 1.65, 0.232), 0.042, eye_white,
                      segments=10, rings=8))
        parent(sphere(P(cid, "pupil"), (x, 1.65, 0.262), 0.02, BLACK,
                      segments=8, rings=6))
    # ---- Lông mày + mũi + miệng ----
    for x in (-0.09, 0.09):
        parent(box(P(cid, "brow"), (x, 1.72, 0.245), (0.09, 0.018, 0.02),
                   BLACK, bevel_w=0.005, rz=-0.15 if x < 0 else 0.15))
    parent(sphere(P(cid, "nose"), (0, 1.60, 0.255), 0.022, skin,
                  segments=8, rings=6))
    mouth_mat = mat(f"mouth_{cid}", "#8f2a20", 0.7)
    parent(box(P(cid, "mouth"), (0, 1.52, 0.248), (0.075, 0.016, 0.02),
               mouth_mat, bevel_w=0.005))
    parent(sphere(P(cid, "mouth_l"), (-0.038, 1.525, 0.248), 0.012, mouth_mat,
                  segments=8, rings=6))
    parent(sphere(P(cid, "mouth_r"), (0.038, 1.525, 0.248), 0.012, mouth_mat,
                  segments=8, rings=6))

    # ---- Tóc / mũ ----
    if hair == "khan_dong":
        # Khăn đóng: vành quấn dẹt + chóp thấp (gọn, không chất đống)
        parent(torus(P(cid, "khan"), (0, 1.79, 0), 0.24, 0.05, BLACK, rot=(0, 0, 0)))
        parent(sphere(P(cid, "khan_top"), (0, 1.86, 0), 0.22, BLACK,
                      scale=(1, 0.32, 1), segments=14, rings=10))
        parent(sphere(P(cid, "khan_knot"), (0, 1.92, 0), 0.05, BLACK,
                      segments=10, rings=8))
    elif hair == "bun":
        # Tóc dài búi + nơ
        parent(sphere(P(cid, "hair"), (0, 1.66, -0.06), 0.30, BLACK,
                      scale=(1, 1.02, 1.02), segments=18, rings=12))
        parent(sphere(P(cid, "bun"), (0, 1.9, -0.05), 0.13, BLACK,
                      segments=12, rings=10))
        bow = mat(f"bow_{cid}", "#d93b2b", 0.6)
        for sx in (-1, 1):
            parent(sphere(P(cid, f"bow_{'L' if sx < 0 else 'R'}"), (sx * 0.12, 1.92, -0.02),
                          0.06, bow, scale=(1.4, 0.7, 0.6), segments=10, rings=8))
    elif hair == "braid":
        # Tóc dài tết bím sau lưng + nơ cuối bím
        parent(sphere(P(cid, "hair"), (0, 1.66, -0.06), 0.30, BLACK,
                      scale=(1, 1.02, 1.02), segments=18, rings=12))
        parent(cyl(P(cid, "braid"), (0, 1.28, -0.32), 0.05, 0.06, 0.55, BLACK,
                   vertices=8))
        for i, y in enumerate((1.45, 1.28, 1.11)):
            parent(sphere(P(cid, f"braid_knot{i}"), (0, y, -0.32), 0.07, BLACK,
                          segments=8, rings=6))
        parent(sphere(P(cid, "braid_bow"), (0, 1.0, -0.32), 0.07,
                      mat(f"bow_{cid}", "#d93b2b", 0.6), scale=(1.4, 0.7, 0.6),
                      segments=10, rings=8))
    elif hair == "loose":
        # Tóc dài xõa + hoa cài
        parent(sphere(P(cid, "hair"), (0, 1.66, -0.06), 0.30, BLACK,
                      scale=(1, 1.02, 1.02), segments=18, rings=12))
        for x in (-0.12, 0.12):
            parent(box(P(cid, f"hair_lock_{'L' if x < 0 else 'R'}"), (x, 1.3, -0.3),
                       (0.12, 0.62, 0.05), BLACK, bevel_w=0.01))
        flower = mat(f"flower_{cid}", "#e87a90", 0.6)
        parent(sphere(P(cid, "flower"), (0.22, 1.8, 0.08), 0.06, flower,
                      segments=10, rings=8))
        for dx, dy in ((-0.07, 0), (0.07, 0), (0, 0.07), (0, -0.07)):
            parent(sphere(P(cid, "petal"), (0.22 + dx, 1.8 + dy, 0.08), 0.04, flower,
                          segments=8, rings=6))

    # ---- Râu (thầy) ----
    if gender == "teacher":
        parent(cyl(P(cid, "beard"), (0, 1.4, 0.22), 0.02, 0.1, 0.28, BEARD_WHITE,
                   vertices=10, rx=0.15))
        parent(box(P(cid, "mustache"), (0, 1.52, 0.25), (0.16, 0.03, 0.04),
                   BEARD_WHITE, bevel_w=0.01))

    # ---- Phụ kiện ----
    if accessory == "book":
        # Sách cầm tay phải (bìa đỏ + trang trắng)
        parent(box(P(cid, "book"), (0.42, 0.85, 0.08), (0.3, 0.05, 0.24),
                   mat(f"book_{cid}", "#b3372a", 0.8), bevel_w=0.01, yaw=0.3))
        parent(box(P(cid, "book_pages"), (0.42, 0.88, 0.08), (0.26, 0.04, 0.2),
                   WHITE, bevel_w=0.01, yaw=0.3))
    elif accessory == "fan":
        # Quạt tròn cầm tay phải
        parent(cyl(P(cid, "fan"), (0.42, 0.98, 0.08), 0.16, 0.16, 0.02,
                   mat(f"fan_{cid}", "#f6ead2", 0.5), vertices=20, rx=math.pi / 2))
        parent(cyl(P(cid, "fan_handle"), (0.42, 0.82, 0.08), 0.02, 0.025, 0.18,
                   mat(f"fanwood_{cid}", "#8a6b45", 0.8), vertices=6))
    elif accessory == "bag":
        # Túi đeo chéo: quai + túi ở hông trái
        parent(box(P(cid, "strap"), (0, 1.15, 0.28), (0.06, 0.95, 0.02),
                   mat(f"strap_{cid}", "#6b5232", 0.9), bevel_w=0.01, rz=0.5))
        parent(box(P(cid, "bag"), (-0.38, 0.92, 0.12), (0.28, 0.34, 0.1),
                   mat(f"bag_{cid}", "#7a5230", 0.85), bevel_w=0.02))
        parent(box(P(cid, "bag_flap"), (-0.38, 1.05, 0.18), (0.28, 0.12, 0.02),
                   mat(f"bagdark_{cid}", "#5a3a22", 0.9), bevel_w=0.01))
    elif accessory == "staff":
        # Gậy trúc tay phải + sách tay trái
        parent(cyl(P(cid, "staff"), (0.46, 0.95, 0.1), 0.03, 0.035, 1.6,
                   mat(f"staff_{cid}", "#8a6b45", 0.85), vertices=8))
        parent(sphere(P(cid, "staff_top"), (0.46, 1.78, 0.1), 0.05, GOLD,
                      segments=10, rings=8))
        parent(box(P(cid, "book"), (-0.42, 0.85, 0.08), (0.3, 0.05, 0.24),
                   mat(f"book_{cid}", "#b3372a", 0.8), bevel_w=0.01, yaw=-0.3))
        parent(box(P(cid, "book_pages"), (-0.42, 0.88, 0.08), (0.26, 0.04, 0.2),
                   WHITE, bevel_w=0.01, yaw=-0.3))
    return grp


# ---- 6 học sinh: 3 nam + 3 nữ, mỗi mẫu khác nhau rõ rệt ----
build_character("Student_M1", "#3a6ea5", "#e8c39a", "male", "khan_dong", "book")
build_character("Student_M2", "#b3372a", "#d9a97e", "male", "khan_dong", "fan")
build_character("Student_M3", "#4d7c3a", "#f0cfa8", "male", "khan_dong", "bag")
build_character("Student_F1", "#e87a90", "#f0cfa8", "female", "bun", "book")
build_character("Student_F2", "#8a6fb8", "#e8c39a", "female", "braid", "fan")
build_character("Student_F3", "#f6ead2", "#d9a97e", "female", "loose", "bag",
                sash_hex="#d9a441")
# ---- Thầy đồ: áo thụng rộng, râu trắng, khăn đóng, gậy + sách ----
build_character("Teacher", "#8f2a20", "#e8c39a", "teacher", "khan_dong", "staff",
                wide=True)

print("characters poly:", poly_count())
export_glb(OUT)
