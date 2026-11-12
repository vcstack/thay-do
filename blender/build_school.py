# build_school.py — Lớp học chính kiểu Điện Thái Hòa (Huế), có nội thất.
# Tọa độ local (gốc ở tâm nền nhà), khớp với SchoolBuilding cũ để gắn vào web tại [0,0,-4].
# Chạy: blender --background --python build_school.py
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

OUT = os.path.expanduser("~/workspace/thay-do-web/public/models/school.glb")

clean()

# ---- Vật liệu (bảng màu mới — cấm hồng) ----
wall = mat("wall_cream", "#f0e6cc", 0.9, tex="plaster")
wall_warm = mat("wall_warm", "#fbf3da", 0.9, tex="plaster")
red = mat("red_col", "#571510", 0.55)
darkred = mat("darkred", "#571510", 0.6)
roof_dark = mat("roof_dark", "#ffffff", 0.75, tex="roof_dark")
roof_dark2 = mat("roof_dark2", "#e8ddc8", 0.75, tex="roof_dark")
brick = mat("brick", "#9a5a40", 0.9)
leaf_green = mat("leaf_green", "#e8f0dc", 0.8, tex="leaf")
gold = mat("gold", "#d9a441", 0.7, tex="roof_gold")
gold_dark = mat("gold_dark", "#c98a2e", 0.7, tex="roof_gold")
gold_bright = mat("gold_bright", "#e8b23a", 0.25, 0.6, emissive="#8a5a10", emissive_strength=0.3)
stone = mat("stone", "#cfc4a8", 0.95, tex="stone")
stone2 = mat("stone2", "#bfb294", 0.95, tex="stone")
stone3 = mat("stone3", "#b3a684", 0.95, tex="stone")
stone4 = mat("stone4", "#a89a78", 0.95, tex="stone")
wood = mat("wood", "#8a6b45", 0.85, tex="wood")
wood_dark = mat("wood_dark", "#5a3d24", 0.9, tex="wood")
wood_floor = mat("wood_floor", "#c9a86a", 0.85, tex="wood")
wood_mid = mat("wood_mid", "#7a5230", 0.85, tex="wood")
green_board = mat("green_board", "#2e4a3a", 0.85)
chalk = mat("chalk", "#f6f1de", 0.9)
window_glow = mat("window_glow", "#ffd98a", 0.4, 0.0, emissive="#ffbf4d", emissive_strength=0.85)
book_red = mat("book_red", "#7d1e12", 0.8)
book_white = mat("book_white", "#f6f1de", 0.9)

# ---- Nền đá + bậc thang ----
box("platform", (0, 0.3, 0), (12.5, 0.6, 9), stone, bevel_w=0.05)
box("step1", (0, 0.15, 5.1), (4.5, 0.3, 1), stone2, bevel_w=0.03)
box("step2", (0, 0.05, 5.7), (4.5, 0.22, 0.8), stone3, bevel_w=0.03)
box("step3", (0, -0.04, 6.3), (4.5, 0.16, 0.8), stone4, bevel_w=0.03)

# ---- Lối đá dẫn vào cửa (trước bậc thang) ----
for i, z in enumerate((7.0, 8.0, 9.0)):
    box(f"path{i}", ((i % 2) * 0.15 - 0.07, 0.04, z), (2.0, 0.08, 0.9),
        (stone2, stone3, stone4)[i], bevel_w=0.02)

# ---- Tường gạch đỏ 2 bên sân (trên nền nhà) + trụ gạch ----
for x in (-5.95, 5.95):
    box("brick_wall", (x, 1.15, 0), (0.35, 1.1, 8.6), brick, bevel_w=0.02)
    box("brick_cap", (x, 1.75, 0), (0.45, 0.12, 8.7), stone2, bevel_w=0.02)
    for z in (-4.2, 4.2):
        box("brick_post", (x, 1.35, z), (0.5, 1.5, 0.5), brick, bevel_w=0.02)
        box("brick_post_cap", (x, 2.15, z), (0.6, 0.14, 0.6), stone2, bevel_w=0.02)

# ---- Chậu cây 2 bên cửa ----
for x in (-2.6, 2.6):
    cyl("planter", (x, 0.85, 4.35), 0.32, 0.24, 0.5, brick, vertices=12)
    cyl("planter_soil", (x, 1.08, 4.35), 0.28, 0.28, 0.06,
        mat("soil", "#4a3524", 0.95), vertices=12)
    ico("planter_bush", (x, 1.45, 4.35), 0.42, leaf_green, subdivisions=2,
        scale=(1, 0.8, 1))
    ico("planter_bush2", (x + 0.15, 1.65, 4.3), 0.28, leaf_green,
        subdivisions=2, scale=(1, 0.8, 1))
box("wall_back", (0, 2.6, -3.25), (10, 4, 0.2), wall, bevel_w=0.02)
for x in (-4.9, 4.9):
    box("wall_side", (x, 2.6, 0), (0.2, 4, 6.3), wall, bevel_w=0.02)
for x in (-3.15, 3.15):
    box("wall_front", (x, 2.6, 3.25), (3.7, 4, 0.2), wall, bevel_w=0.02)
box("lintel", (0, 4.3, 3.25), (2.6, 0.6, 0.2), wall, bevel_w=0.02)

# ---- Sàn gỗ trong lớp ----
box("floor", (0, 0.56, 0), (9.8, 0.08, 6.3), wood_floor, bevel_w=0.01)

# ---- Cửa chính mở sang 2 bên (cửa gỗ đỏ sẫm, có nẹp + tay nắm) ----
import math as _math
for x, yaw in ((-1.35, 0.85), (1.35, -0.85)):
    box("door", (x, 2.1, 3.55), (1.15, 3.4, 0.1), darkred, bevel_w=0.02, yaw=yaw)
    # Tay nắm cửa vàng
    sphere("door_knob", (x * 0.55, 2.1, 3.62), 0.06, gold_bright, segments=10, rings=8)
    # Nẹp dọc trên mặt cửa (xoay theo cửa: local +x -> (cos yaw, 0, -sin yaw),
    # mặt cửa hướng theo pháp tuyến (sin yaw, 0, cos yaw) — nẹp phải nổi
    # ra ngoài mặt cửa 0.06, không nằm chìm trong tấm cửa)
    for dx in (-0.3, 0.3):
        ox = dx * _math.cos(yaw) + 0.06 * _math.sin(yaw)
        oz = -dx * _math.sin(yaw) + 0.06 * _math.cos(yaw)
        box("door_batten", (x + ox, 2.1, 3.55 + oz), (0.07, 3.1, 0.04),
            wood_dark, yaw=yaw)
    box("door_lintel", (0, 4.15, 3.3), (2.9, 0.14, 0.16), wood_dark, bevel_w=0.02)

# ---- Cột đỏ mặt tiền (có đế đá + đầu cột vàng) ----
for x in (-4.6, -1.6, 1.6, 4.6):
    cyl("column", (x, 2.6, 3.3), 0.26, 0.3, 4, red, vertices=14)
    cyl("column_base", (x, 0.75, 3.3), 0.36, 0.4, 0.3, stone, vertices=14)
    cyl("column_cap", (x, 4.55, 3.3), 0.34, 0.28, 0.22, gold_dark, vertices=14)
    column_bands("colband", x, 3.3, (1.7, 3.5), 0.27, gold_dark)

# ---- Cửa sổ sáng đèn, khung gỗ chia ô (2 bên) ----
for x in (-3.1, 3.1):
    lattice_window("window", (x, 2.7, 3.38), 1.9, 1.5, window_glow, wood_dark,
                   wood_dark, cols=3, rows=2, lintel_mat=wood_dark)

# ---- Mái tầng 1: diềm gỗ tối + mái ngói tối + góc vểnh nhỏ ----
box("roof1_eave", (0, 5.05, 0), (12.6, 0.5, 8.6), wood_dark, bevel_w=0.04)
hip_roof_ridge("roof1", (0, 5.3, 0), 12.2, 8.2, 2.0, 5.0, roof_dark)
# Dau ngoi doc mep mai truoc/sau + vien ngoi up doc song mai
tile_fringe("roof1_tile_f", 5.32, -6.0, 6.0, 4.08, roof_dark2)
tile_fringe("roof1_tile_b", 5.32, -6.0, 6.0, -4.08, roof_dark2)
ridge_caps("roof1_ridge", -2.4, 2.4, 7.32, 0, roof_dark2)
for cx, cz in ((-6.1, -4.1), (6.1, -4.1), (-6.1, 4.1), (6.1, 4.1)):
    d = (1.0 if cx > 0 else -1.0, 1.0 if cz > 0 else -1.0)
    n = (d[0] / 1.4142, d[1] / 1.4142)
    corner_horn("roof1_horn", (cx, 5.35, cz), n, roof_dark2, length=0.65,
                tilt=0.5, radius=0.09)

# ---- Tầng trên (lầu nhỏ) + mái tầng 2 ----
box("upper_wall", (0, 6.1, 0), (6.0, 1.0, 4.0), wall, bevel_w=0.03)
# Cửa sổ tầng trên (mặt tiền) — cửa chính tầng trên bỏ vì mái dốc tầng 1
# che khuất hoàn toàn, chỉ để lại 2 cửa sổ sáng đèn lộ trên mái
for x in (-2.0, 2.0):
    lattice_window("upper_window", (x, 6.1, 2.02), 1.1, 0.8, window_glow,
                   wood_dark, wood_dark, cols=2, rows=2)
# Ban công gỗ + lan can mặt tiền tầng trên (kiểu nhà trong ảnh f_003)
box("balcony_floor", (0, 5.62, 2.65), (6.2, 0.16, 1.3), wood_dark, bevel_w=0.02)
for x in (-2.9, -1.5, 0, 1.5, 2.9):
    box("balcony_post", (x, 6.15, 3.25), (0.09, 0.95, 0.09), wood_dark)
for z in (2.05, 3.25):
    box("balcony_side_post", (-3.05, 6.15, z), (0.09, 0.95, 0.09), wood_dark)
    box("balcony_side_post2", (3.05, 6.15, z), (0.09, 0.95, 0.09), wood_dark)
box("balcony_rail", (0, 6.62, 3.25), (6.2, 0.09, 0.12), wood, bevel_w=0.02)
box("balcony_rail_mid", (0, 6.2, 3.25), (6.2, 0.06, 0.08), wood)
for x in (-3.05, 3.05):
    box("balcony_rail_side", (x, 6.62, 2.65), (0.12, 0.09, 1.3), wood, bevel_w=0.02)
    box("balcony_rail_side_mid", (x, 6.2, 2.65), (0.08, 0.06, 1.3), wood)
# Thanh chống chéo dưới sàn ban công
for x in (-2.5, 2.5):
    box("balcony_brace", (x, 5.25, 2.9), (0.1, 0.7, 0.1), wood_dark, rx=0.6)
box("roof2_eave", (0, 6.6, 0), (7.0, 0.45, 4.4), wood_dark, bevel_w=0.04)
hip_roof_ridge("roof2", (0, 6.825, 0), 7.0, 4.4, 1.4, 3.0, roof_dark)
tile_fringe("roof2_tile_f", 6.85, -3.4, 3.4, 2.18, roof_dark2)
tile_fringe("roof2_tile_b", 6.85, -3.4, 3.4, -2.18, roof_dark2)
ridge_caps("roof2_ridge", -1.4, 1.4, 8.24, 0, roof_dark2)
for cx, cz in ((-3.5, -2.2), (3.5, -2.2), (-3.5, 2.2), (3.5, 2.2)):
    d = (1.0 if cx > 0 else -1.0, 1.0 if cz > 0 else -1.0)
    n = (d[0] / 1.4142, d[1] / 1.4142)
    corner_horn("roof2_horn", (cx, 6.85, cz), n, roof_dark2, length=0.55,
                tilt=0.5, radius=0.09)
gold_finial("finial", (0, 8.25, 0), r=0.24)

# ---- Đèn lồng treo mái hiên ----
lantern("lantern_L", (-3.4, 4.35, 3.5), scale=0.9)
lantern("lantern_R", (3.4, 4.35, 3.5), scale=0.9)

# ---- Nội thất: bảng đen ----
box("blackboard", (0, 2.7, -3.08), (4.6, 1.9, 0.1), green_board, bevel_w=0.02)
box("board_frame_t", (0, 3.65, -3.02), (4.7, 0.1, 0.04), gold_dark)
box("board_frame_b", (0, 1.75, -3.02), (4.7, 0.1, 0.04), gold_dark)
for i, y in enumerate((-0.5, 0, 0.5)):
    box("chalk_line", (-0.6 + (i % 2) * 0.8, 2.7 + y, -3.0), (2.2 - i * 0.4, 0.05, 0.02), chalk)

# ---- Bàn + ghế (3 chỗ ngồi) ----
for i, (seat, desk) in enumerate([
        ((-2.2, -0.4), (-2.2, -1.3)),
        ((2.2, -0.4), (2.2, -1.3)),
        ((0, -1.9), (0, -2.7))]):
    box(f"desk{i}", (desk[0], 1.32, desk[1]), (1.5, 0.08, 0.75), wood, bevel_w=0.02)
    for dx in (-0.6, 0.6):
        box(f"desk_leg{i}", (desk[0] + dx, 0.95, desk[1]), (0.08, 0.7, 0.6), wood_dark)
    box(f"chair{i}", (seat[0], 1.02, seat[1]), (0.55, 0.08, 0.55), wood_mid, bevel_w=0.02)
    box(f"chair_back{i}", (seat[0], 1.35, seat[1] + 0.26), (0.55, 0.6, 0.08), wood_mid, bevel_w=0.02)

# ---- Bục giảng + sách ----
box("podium_top", (3.5, 1.15, -1.5), (0.95, 0.1, 0.65), wood, bevel_w=0.02)
box("podium_body", (3.5, 0.87, -1.5), (0.14, 0.55, 0.5), wood_dark)
box("podium_book1", (3.5, 1.24, -1.5), (0.5, 0.06, 0.35), book_red, bevel_w=0.01, yaw=0.2)
box("podium_book2", (3.55, 1.28, -1.48), (0.42, 0.05, 0.3), book_white, bevel_w=0.01, yaw=-0.15)

print("school poly:", poly_count())
export_glb(OUT)
