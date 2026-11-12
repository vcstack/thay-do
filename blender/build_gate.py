# build_gate.py — Cổng Văn Miếu: 3 cửa (cổng tam quan), mái ngói vàng 2 tầng.
# Tọa độ local, gắn vào web tại [0, 0, 10.5].
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

OUT = os.path.expanduser("~/workspace/thay-do-web/public/models/gate.glb")
clean()

red = mat("red_col", "#8f2a20", 0.6, tex="wood")
red2 = mat("red2", "#b3372a", 0.6, tex="wood")
darkred = mat("darkred", "#8f2a20", 0.6)
gold = mat("gold", "#d9a441", 0.7, tex="roof_gold")
gold_dark = mat("gold_dark", "#c98a2e", 0.7, tex="roof_gold")
gold_bright = mat("gold_bright", "#e8b23a", 0.25, 0.6, emissive="#8a5a10", emissive_strength=0.3)
stone = mat("stone", "#d9c9a3", 0.9, tex="stone")
brick = mat("brick", "#9a5a40", 0.9)
wood_dark = mat("wood_dark", "#5a3d24", 0.9, tex="wood")
roof_dark = mat("roof_dark", "#ffffff", 0.75, tex="roof_dark")
roof_dark2 = mat("roof_dark2", "#e8ddc8", 0.75, tex="roof_dark")
window_glow = mat("window_glow", "#ffd98a", 0.4, 0.0, emissive="#ffbf4d", emissive_strength=0.5)

# ---- 4 cột đỏ tạo 3 cửa (đế đá + đầu cột vàng) ----
for x in (-3.6, -1.2, 1.2, 3.6):
    cyl("column", (x, 2.5, 0), 0.3, 0.36, 5, red, vertices=14)
    cyl("column_base", (x, 0.35, 0), 0.42, 0.48, 0.7, stone, vertices=14)
    cyl("column_cap", (x, 5.05, 0), 0.36, 0.3, 0.25, gold_dark, vertices=14)
    column_bands("colband", x, 0, (1.6, 3.8), 0.31, gold_dark)

# ---- Tường lửng gạch đỏ 2 bên cửa phụ + xà ngang ----
for x in (-2.4, 2.4):
    box("side_wall", (x, 1.1, 0), (1.1, 2.2, 0.3), brick, bevel_w=0.03)
    box("side_wall_cap", (x, 2.25, 0), (1.2, 0.12, 0.4), stone, bevel_w=0.03)
box("beam1", (0, 4.4, 0), (8.4, 0.4, 0.5), darkred, bevel_w=0.03)
box("beam2", (0, 3.5, 0), (7.6, 0.3, 0.4), red2, bevel_w=0.03)

# ---- Huy hiệu tròn giữa cổng ----
medallion("emblem", (0, 3.95, 0.28), (0, 0, 1), 0.42, gold, window_glow)

# ---- Mái tầng 1: diềm gỗ tối + mái ngói tối + góc vểnh nhỏ ----
box("roof1_eave", (0, 5.15, 0), (9, 0.35, 1.8), wood_dark, bevel_w=0.04)
hip_roof_ridge("roof1", (0, 5.325, 0), 8.6, 1.5, 1.1, 5.0, roof_dark)
tile_fringe("roof1_tile_f", 5.35, -4.2, 4.2, 0.72, roof_dark2)
tile_fringe("roof1_tile_b", 5.35, -4.2, 4.2, -0.72, roof_dark2)
ridge_caps("roof1_ridge", -2.4, 2.4, 6.44, 0, roof_dark2)
for cx, cz in ((-4.3, -0.75), (4.3, -0.75), (-4.3, 0.75), (4.3, 0.75)):
    d = (1.0 if cx > 0 else -1.0, 1.0 if cz > 0 else -1.0)
    n = (d[0] / 1.4142, d[1] / 1.4142)
    corner_horn("roof1_horn", (cx, 5.4, cz), n, roof_dark2, length=0.5, tilt=0.5,
                radius=0.09)

# ---- Mái tầng 2 thu nhỏ + trái châu ----
box("roof2_eave", (0, 6.1, 0), (5.4, 0.3, 1.4), wood_dark, bevel_w=0.04)
hip_roof_ridge("roof2", (0, 6.25, 0), 5.0, 1.1, 0.8, 2.6, roof_dark)
tile_fringe("roof2_tile_f", 6.27, -2.4, 2.4, 0.52, roof_dark2)
tile_fringe("roof2_tile_b", 6.27, -2.4, 2.4, -0.52, roof_dark2)
gold_finial("finial", (0, 7.1, 0), r=0.22)

# ---- Đèn lồng 2 bên ----
lantern("lantern_L", (-2.4, 3.1, 0), scale=0.85)
lantern("lantern_R", (2.4, 3.1, 0), scale=0.85)

print("gate poly:", poly_count())
export_glb(OUT)
