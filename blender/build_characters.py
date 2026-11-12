# build_characters.py — 6 học sinh (nam/nữ đa dạng) + 1 thầy đồ, phong cách CHIBI.
# Mỗi nhân vật là 1 Empty (Student_M1...) chứa các mesh, xuất chung vào characters.glb.
# Nhân vật quay mặt +z (three.js), gốc ở mặt đất giữa 2 chân, cao tổng ~1.73.
#
# Phong cách chibi (theo ảnh tham khảo xiehanzi): đầu TO (r 0.28, ~1/3 chiều cao),
# mặt rõ: mắt đen tròn to + highlight trắng, lông mày, miệng cười, má hồng;
# tay lộ rõ (tay áo + bàn tay da); áo dài nhiều lớp (váy loe + tà trước/sau +
# gấu xòe + thắt lưng + cổ áo), KHÔNG còn 1 khối nón trơn như trước.
#
# Tương thích SchoolScene.tsx (KHÔNG sửa file đó):
#  - Tên node gốc + tên part giữ nguyên: skirt/panel_f/panel_b/torso/collar/
#    arm_L/arm_R (ROBE_PARTS), khan/khan_top/khan_knot/bow_*/braid_bow/flower/
#    petal/belt (HAT_PARTS), head/eye/pupil/brow/nose/mouth*/hair/bun/braid*/
#    hair_lock_*/khan* (HEAD_PARTS), book/book_pages/fan/fan_handle/staff/
#    staff_top (ARM_R_PARTS), arm_L/hand_L (ARM_L_PARTS), beard/mustache (thầy).
#  - Má hồng / tai / highlight mắt KHÔNG có tên trong các Set trên nên được
#    parent trực tiếp vào mesh đầu (head) trong Blender -> khi SchoolScene
#    gộp đầu vào khớp cổ thì chúng đi theo đầu, không cần sửa Set.
#  - Khớp cổ học sinh ở y=1.45, khớp vai ở (±0.35, 1.35): tâm đầu đặt đúng
#    y=1.45 để gật đầu xoay quanh tâm đầu; tay bắt đầu gần vai y~1.15.
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
CHEEK = mat("cheek", "#f0a0a0", 0.7)
MOUTH_MAT = mat("mouth_dark", "#7a2a1e", 0.7)


def P(cid, name):
    return f"{cid}_{name}"


def attach_to_head(head_obj, o):
    """Parent 1 mesh con vào mesh đầu, giữ nguyên vị trí thế giới.
    Head không xoay/scale (scale đã apply) nên tọa độ local = world - head."""
    hx, hy, hz = head_obj.location  # tọa độ Blender
    o.parent = head_obj
    o.location = (o.location[0] - hx, o.location[1] - hy, o.location[2] - hz)
    return o


def build_character(cid, robe_hex, skin_hex, gender="male", hair="khan_dong",
                    accessory=None, wide=False, sash_hex="#d9a441"):
    """Dựng 1 nhân vật chibi, trả về Empty group. accessory: None|'book'|'fan'|'bag'|'staff'."""
    grp = group(cid)
    robe = mat(f"robe_{cid}", robe_hex, 0.8, tex="fabric")
    robe_dark = mat(f"robe_dark_{cid}", robe_hex, 0.85, tex="fabric")
    skin = mat(f"skin_{cid}", skin_hex, 0.7)
    pants = DARK_PANTS

    r_top = 0.30 if wide else 0.26   # eo váy
    r_bot = 0.48 if wide else 0.42   # gấu váy
    r_sh = 0.34 if wide else 0.30    # vai

    def parent(o):
        o.parent = grp
        return o

    # ---- Chân + giày (chủ yếu bị áo dài che, chỉ lộ mũi giày) ----
    for x in (-0.12, 0.12):
        parent(cyl(P(cid, "leg"), (x, 0.22, 0), 0.075, 0.08, 0.44, pants, vertices=8))
        parent(box(P(cid, "leg"), (x, 0.045, 0.06), (0.16, 0.09, 0.26),
                   BLACK, bevel_w=0.02))
    # ---- Váy áo dài: nón cụt loe ----
    parent(cyl(P(cid, "skirt"), (0, 0.40, 0), r_top, r_bot, 0.70, robe, vertices=16))
    # ---- Gấu xòe lớp dưới (đậm hơn, tạo tà 2 lớp thay vì 1 nón trơn) ----
    parent(cyl(P(cid, "skirt"), (0, 0.13, 0), 0.40 if not wide else 0.46,
               0.48 if not wide else 0.54, 0.24, robe_dark, vertices=16))
    # ---- 2 tấm tà trước/sau: nằm áp lên mặt nón, hơi nghiêng theo độ loe ----
    pw = 0.36 if not wide else 0.42
    parent(box(P(cid, "panel_f"), (0, 0.52, 0.335), (pw, 0.46, 0.025), robe_dark,
              bevel_w=0.01, rx=-0.10))
    parent(box(P(cid, "panel_b"), (0, 0.52, -0.335), (pw, 0.46, 0.025), robe_dark,
              bevel_w=0.01, rx=0.10))
    # ---- Thân trên ----
    parent(cyl(P(cid, "torso"), (0, 0.98, 0), r_sh, r_top, 0.50, robe, vertices=16))
    # ---- Cổ + cổ áo + đai lưng ----
    parent(cyl(P(cid, "neck"), (0, 1.22, 0), 0.07, 0.08, 0.12, skin, vertices=10))
    parent(torus(P(cid, "collar"), (0, 1.24, 0), 0.16, 0.03, robe_dark, rot=(0, 0, 0)))
    parent(cyl(P(cid, "belt"), (0, 0.74, 0), 0.29 if not wide else 0.33,
               0.30 if not wide else 0.34, 0.09,
               mat(f"sash_{cid}", sash_hex, 0.4, 0.4), vertices=16))
    # ---- Tay áo lộ rõ: ống tay áo dài + bàn tay da ----
    for sx in (-1, 1):
        parent(cyl(P(cid, f"arm_{'L' if sx < 0 else 'R'}"), (sx * 0.335, 0.92, 0),
                   0.07, 0.058, 0.46, robe, vertices=10, rz=sx * 0.10))
        parent(sphere(P(cid, f"hand_{'L' if sx < 0 else 'R'}"), (sx * 0.375, 0.68, 0.02),
                      0.068, skin, segments=10, rings=8))

    # ---- Đầu TO chibi: r 0.28, tâm y=1.45 (= khớp cổ trong SchoolScene) ----
    head = parent(sphere(P(cid, "head"), (0, 1.45, 0), 0.28, skin,
                         scale=(1, 1.02, 0.95), segments=20, rings=14))
    # Tai (chỉ mẫu khăn đóng/thầy; tóc dài nữ che tai nên bỏ)
    if hair == "khan_dong":
        for sx in (-1, 1):
            attach_to_head(head, sphere(P(cid, "ear"), (sx * 0.27, 1.45, 0),
                                        0.055, skin, segments=10, rings=8))
    # ---- Mắt đen tròn TO + highlight trắng (kiểu chibi bên họ) ----
    for x in (-0.105, 0.105):
        parent(sphere(P(cid, "eye"), (x, 1.48, 0.24), 0.05, BLACK,
                      segments=12, rings=10))
        attach_to_head(head, sphere(P(cid, "pupil"), (x - 0.015, 1.497, 0.278),
                                    0.015, WHITE, segments=8, rings=6))
    # ---- Lông mày ----
    brow_mat = BEARD_WHITE if gender == "teacher" else BLACK
    for x in (-0.105, 0.105):
        parent(box(P(cid, "brow"), (x, 1.575, 0.225), (0.10, 0.02, 0.02),
                   brow_mat, bevel_w=0.005, rz=-0.12 if x < 0 else 0.12))
    # ---- Mũi nhỏ + miệng cười (3 chấm cong hình nụ cười) ----
    # Thầy: râu che miệng nên bỏ miệng (tránh chấm đỏ lẻ loi thò qua râu).
    parent(sphere(P(cid, "nose"), (0, 1.43, 0.26), 0.02, skin,
                  segments=8, rings=6))
    if gender != "teacher":
        parent(sphere(P(cid, "mouth"), (0, 1.375, 0.25), 0.016, MOUTH_MAT,
                      segments=8, rings=6))
        parent(sphere(P(cid, "mouth_l"), (-0.052, 1.39, 0.245), 0.014, MOUTH_MAT,
                      segments=8, rings=6))
        parent(sphere(P(cid, "mouth_r"), (0.052, 1.39, 0.245), 0.014, MOUTH_MAT,
                      segments=8, rings=6))
    # ---- Má hồng 2 bên (parent vào đầu để đi theo khớp cổ) ----
    for sx in (-1, 1):
        attach_to_head(head, sphere(P(cid, f"cheek_{'L' if sx < 0 else 'R'}"),
                                    (sx * 0.185, 1.40, 0.185), 0.045, CHEEK,
                                    scale=(1, 0.7, 0.5), segments=10, rings=8))

    # ---- Tóc / mũ ----
    if hair == "khan_dong":
        # Khăn đóng: vành quấn + chóp dẹt + nút — to rõ, ôm quanh đầu to
        kmaj = 0.25 if gender == "teacher" else 0.235
        parent(torus(P(cid, "khan"), (0, 1.62, 0), kmaj, 0.05, BLACK, rot=(0, 0, 0)))
        parent(sphere(P(cid, "khan_top"), (0, 1.69, 0), 0.215, BLACK,
                      scale=(1, 0.35, 1), segments=14, rings=10))
        parent(sphere(P(cid, "khan_knot"), (0, 1.76, 0), 0.05, BLACK,
                      segments=10, rings=8))
    elif hair == "bun":
        # Tóc dài búi + nơ đỏ
        parent(sphere(P(cid, "hair"), (0, 1.47, -0.05), 0.295, BLACK,
                      scale=(1, 1.02, 1.02), segments=18, rings=12))
        parent(sphere(P(cid, "bun"), (0, 1.74, -0.06), 0.12, BLACK,
                      segments=12, rings=10))
        bow = mat(f"bow_{cid}", "#d93b2b", 0.6)
        for sx in (-1, 1):
            parent(sphere(P(cid, f"bow_{'L' if sx < 0 else 'R'}"), (sx * 0.11, 1.74, 0.02),
                          0.06, bow, scale=(1.3, 0.7, 0.6), segments=10, rings=8))
    elif hair == "braid":
        # Tóc dài tết bím sau lưng + nơ cuối bím
        parent(sphere(P(cid, "hair"), (0, 1.47, -0.05), 0.295, BLACK,
                      scale=(1, 1.02, 1.02), segments=18, rings=12))
        parent(cyl(P(cid, "braid"), (0, 1.15, -0.30), 0.05, 0.06, 0.50, BLACK,
                   vertices=8))
        for i, y in enumerate((1.32, 1.15, 0.98)):
            parent(sphere(P(cid, f"braid_knot{i}"), (0, y, -0.30), 0.065, BLACK,
                          segments=8, rings=6))
        parent(sphere(P(cid, "braid_bow"), (0, 0.88, -0.30), 0.065,
                      mat(f"bow_{cid}", "#d93b2b", 0.6), scale=(1.4, 0.7, 0.6),
                      segments=10, rings=8))
    elif hair == "loose":
        # Tóc dài xõa + hoa cài
        parent(sphere(P(cid, "hair"), (0, 1.47, -0.05), 0.295, BLACK,
                      scale=(1, 1.02, 1.02), segments=18, rings=12))
        for x in (-0.13, 0.13):
            parent(box(P(cid, f"hair_lock_{'L' if x < 0 else 'R'}"), (x, 1.18, -0.28),
                       (0.12, 0.60, 0.05), BLACK, bevel_w=0.01))
        flower = mat(f"flower_{cid}", "#e87a90", 0.6)
        parent(sphere(P(cid, "flower"), (0.22, 1.62, 0.10), 0.05, flower,
                      segments=10, rings=8))
        for dx, dy in ((-0.06, 0), (0.06, 0), (0, 0.06), (0, -0.06)):
            parent(sphere(P(cid, "petal"), (0.22 + dx, 1.62 + dy, 0.10), 0.035, flower,
                          segments=8, rings=6))

    # ---- Râu thầy: râu dài trắng xuống ngực + ria mép + tóc mai trắng ----
    # Râu đặt NHÔ ra trước ngực (z lớn) để không bị thân áo nuốt mất.
    if gender == "teacher":
        parent(cyl(P(cid, "beard"), (0, 1.12, 0.26), 0.045, 0.15, 0.44, BEARD_WHITE,
                   vertices=10, rx=0.10))
        parent(sphere(P(cid, "beard"), (0, 0.92, 0.28), 0.10, BEARD_WHITE,
                      scale=(1.1, 1.2, 0.7), segments=10, rings=8))
        for sx in (-1, 1):
            parent(box(P(cid, "mustache"), (sx * 0.045, 1.405, 0.26), (0.08, 0.025, 0.03),
                       BEARD_WHITE, bevel_w=0.01, rz=-sx * 0.35))
        for sx in (-1, 1):
            attach_to_head(head, sphere(P(cid, "hair"), (sx * 0.26, 1.47, -0.05),
                                        0.08, BEARD_WHITE, segments=10, rings=8))

    # ---- Phụ kiện (đặt lại theo tay mới y~0.72) ----
    if accessory == "book":
        # Sách cầm tay phải (bìa đỏ + trang trắng)
        parent(box(P(cid, "book"), (0.40, 0.72, 0.10), (0.28, 0.05, 0.22),
                   mat(f"book_{cid}", "#7d1e12", 0.8), bevel_w=0.01, yaw=0.3))
        parent(box(P(cid, "book_pages"), (0.40, 0.75, 0.10), (0.24, 0.04, 0.18),
                   WHITE, bevel_w=0.01, yaw=0.3))
    elif accessory == "fan":
        # Quạt tròn cầm tay phải
        parent(cyl(P(cid, "fan"), (0.40, 0.86, 0.08), 0.16, 0.16, 0.02,
                   mat(f"fan_{cid}", "#f6ead2", 0.5), vertices=20, rx=math.pi / 2))
        parent(cyl(P(cid, "fan_handle"), (0.40, 0.72, 0.08), 0.02, 0.025, 0.16,
                   mat(f"fanwood_{cid}", "#8a6b45", 0.8), vertices=6))
    elif accessory == "bag":
        # Túi đeo chéo: quai + túi ở hông trái
        parent(box(P(cid, "strap"), (0, 1.00, 0.28), (0.06, 0.85, 0.02),
                   mat(f"strap_{cid}", "#6b5232", 0.9), bevel_w=0.01, rz=0.5))
        parent(box(P(cid, "bag"), (-0.36, 0.78, 0.10), (0.28, 0.34, 0.10),
                   mat(f"bag_{cid}", "#7a5230", 0.85), bevel_w=0.02))
        parent(box(P(cid, "bag_flap"), (-0.36, 0.91, 0.16), (0.28, 0.12, 0.02),
                   mat(f"bagdark_{cid}", "#5a3a22", 0.9), bevel_w=0.01))
    elif accessory == "staff":
        # Gậy trúc tay phải + sách tay trái (thầy)
        parent(cyl(P(cid, "staff"), (0.44, 0.85, 0.10), 0.03, 0.035, 1.60,
                   mat(f"staff_{cid}", "#8a6b45", 0.85), vertices=8))
        parent(sphere(P(cid, "staff_top"), (0.44, 1.68, 0.10), 0.05, GOLD,
                      segments=10, rings=8))
        parent(box(P(cid, "book"), (-0.40, 0.72, 0.10), (0.28, 0.05, 0.22),
                   mat(f"book_{cid}", "#7d1e12", 0.8), bevel_w=0.01, yaw=-0.3))
        parent(box(P(cid, "book_pages"), (-0.40, 0.75, 0.10), (0.24, 0.04, 0.18),
                   WHITE, bevel_w=0.01, yaw=-0.3))
    return grp


# ---- 6 học sinh: 3 nam + 3 nữ, mỗi mẫu khác nhau rõ rệt ----
build_character("Student_M1", "#3a6ea5", "#e8c39a", "male", "khan_dong", "book")
build_character("Student_M2", "#7d1e12", "#d9a97e", "male", "khan_dong", "fan")
build_character("Student_M3", "#4d7c3a", "#f0cfa8", "male", "khan_dong", "bag")
build_character("Student_F1", "#e87a90", "#f0cfa8", "female", "bun", "book")
build_character("Student_F2", "#8a6fb8", "#e8c39a", "female", "braid", "fan")
build_character("Student_F3", "#f6ead2", "#d9a97e", "female", "loose", "bag",
                sash_hex="#d9a441")
# ---- Thầy đồ: áo thụng rộng, râu trắng dài, khăn đóng to, gậy + sách ----
build_character("Teacher", "#571510", "#e8c39a", "teacher", "khan_dong", "staff",
                wide=True)

print("characters poly:", poly_count())
export_glb(OUT)
