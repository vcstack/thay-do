# build_school.py — Lớp học chính kiểu Điện Thái Hòa (Huế), có nội thất.
# Tọa độ local (gốc ở tâm nền nhà), khớp với SchoolBuilding cũ để gắn vào web tại [0,0,-4].
# Chạy: blender --background --python build_school.py
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

OUT = os.path.expanduser("~/workspace/thay-do-web/public/models/school.glb")

clean()

# ---- Vật liệu ----
wall = mat("wall_cream", "#f6ead2", 0.9)
wall_warm = mat("wall_warm", "#fbf3da", 0.9)
red = mat("red_col", "#b3372a", 0.55)
darkred = mat("darkred", "#8f2a20", 0.6)
gold = mat("gold", "#d9a441", 0.7)
gold_dark = mat("gold_dark", "#c98a2e", 0.7)
gold_bright = mat("gold_bright", "#e8b23a", 0.25, 0.6, emissive="#8a5a10", emissive_strength=0.3)
stone = mat("stone", "#cfc4a8", 0.95)
stone2 = mat("stone2", "#bfb294", 0.95)
stone3 = mat("stone3", "#b3a684", 0.95)
stone4 = mat("stone4", "#a89a78", 0.95)
wood = mat("wood", "#8a6b45", 0.85)
wood_dark = mat("wood_dark", "#6b5232", 0.9)
wood_floor = mat("wood_floor", "#c9a86a", 0.85)
wood_mid = mat("wood_mid", "#7a5230", 0.85)
green_board = mat("green_board", "#2e4a3a", 0.85)
chalk = mat("chalk", "#f6f1de", 0.9)
window_glow = mat("window_glow", "#ffd98a", 0.4, 0.0, emissive="#ffbf4d", emissive_strength=0.85)
book_red = mat("book_red", "#b3372a", 0.8)
book_white = mat("book_white", "#f6f1de", 0.9)

# ---- Nền đá + bậc thang ----
box("platform", (0, 0.3, 0), (12.5, 0.6, 9), stone, bevel_w=0.05)
box("step1", (0, 0.15, 5.1), (4.5, 0.3, 1), stone2, bevel_w=0.03)
box("step2", (0, 0.05, 5.7), (4.5, 0.22, 0.8), stone3, bevel_w=0.03)
box("step3", (0, -0.04, 6.3), (4.5, 0.16, 0.8), stone4, bevel_w=0.03)

# ---- Tường: sau + 2 bên + trước (chừa cửa giữa) + đà trên cửa ----
box("wall_back", (0, 2.6, -3.25), (10, 4, 0.2), wall, bevel_w=0.02)
for x in (-4.9, 4.9):
    box("wall_side", (x, 2.6, 0), (0.2, 4, 6.3), wall, bevel_w=0.02)
for x in (-3.15, 3.15):
    box("wall_front", (x, 2.6, 3.25), (3.7, 4, 0.2), wall, bevel_w=0.02)
box("lintel", (0, 4.3, 3.25), (2.6, 0.6, 0.2), wall, bevel_w=0.02)

# ---- Sàn gỗ trong lớp ----
box("floor", (0, 0.56, 0), (9.8, 0.08, 6.3), wood_floor, bevel_w=0.01)

# ---- Cửa chính mở sang 2 bên ----
for x, yaw in ((-1.35, 0.85), (1.35, -0.85)):
    box("door", (x, 2.1, 3.55), (1.15, 3.4, 0.1), darkred, bevel_w=0.02, yaw=yaw)
    # Tay nắm cửa vàng
    sphere("door_knob", (x * 0.55, 2.1, 3.62), 0.06, gold_bright, segments=10, rings=8)

# ---- Cột đỏ mặt tiền (có đế đá + đầu cột vàng) ----
for x in (-4.6, -1.6, 1.6, 4.6):
    cyl("column", (x, 2.6, 3.3), 0.26, 0.3, 4, red, vertices=14)
    cyl("column_base", (x, 0.75, 3.3), 0.36, 0.4, 0.3, stone, vertices=14)
    cyl("column_cap", (x, 4.55, 3.3), 0.34, 0.28, 0.22, gold_dark, vertices=14)

# ---- Cửa sổ sáng đèn (2 bên) ----
for x in (-3.1, 3.1):
    box("window", (x, 2.7, 3.38), (1.9, 1.5, 0.1), window_glow, bevel_w=0.02)
    box("window_bar_v", (x, 2.7, 3.46), (0.08, 1.5, 0.05), wood_dark)
    box("window_bar_h", (x, 2.7, 3.46), (1.9, 0.08, 0.05), wood_dark)
    box("window_frame", (x, 2.7, 3.36), (2.0, 1.6, 0.06), wood, bevel_w=0.02)

# ---- Mái tầng 1: diềm mái + mái hông có sống mái + góc vểnh ----
box("roof1_eave", (0, 5.05, 0), (12.6, 0.5, 8.6), gold_dark, bevel_w=0.04)
hip_roof_ridge("roof1", (0, 5.3, 0), 12.2, 8.2, 2.0, 5.0, gold)
for cx, cz in ((-6.1, -4.1), (6.1, -4.1), (-6.1, 4.1), (6.1, 4.1)):
    d = (1.0 if cx > 0 else -1.0, 1.0 if cz > 0 else -1.0)
    n = (d[0] / 1.4142, d[1] / 1.4142)
    corner_horn("roof1_horn", (cx, 5.35, cz), n, gold_dark, length=0.8, tilt=0.5)

# ---- Tầng trên (lầu nhỏ) + mái tầng 2 ----
box("upper_wall", (0, 6.1, 0), (6.0, 1.0, 4.0), wall, bevel_w=0.03)
box("roof2_eave", (0, 6.6, 0), (7.0, 0.45, 4.4), gold_dark, bevel_w=0.04)
hip_roof_ridge("roof2", (0, 6.825, 0), 7.0, 4.4, 1.4, 3.0, gold)
for cx, cz in ((-3.5, -2.2), (3.5, -2.2), (-3.5, 2.2), (3.5, 2.2)):
    d = (1.0 if cx > 0 else -1.0, 1.0 if cz > 0 else -1.0)
    n = (d[0] / 1.4142, d[1] / 1.4142)
    corner_horn("roof2_horn", (cx, 6.85, cz), n, gold_dark, length=0.65, tilt=0.5)
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
