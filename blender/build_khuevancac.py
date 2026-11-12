# build_khuevancac.py — Khuê Văn Các (Văn Miếu): lầu 2 tầng, 4 cột, cửa sổ tròn.
# Tọa độ local, gắn vào web tại [-7.5, 0, 0.5].
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

OUT = os.path.expanduser("~/workspace/thay-do-web/public/models/khuevancac.glb")
clean()

wall = mat("wall_cream", "#f6ead2", 0.9, tex="plaster")
red = mat("red_col", "#b3372a", 0.55, tex="wood")
gold = mat("gold", "#d9a441", 0.7, tex="roof_gold")
gold_dark = mat("gold_dark", "#c98a2e", 0.7, tex="roof_gold")
gold_bright = mat("gold_bright", "#e8b23a", 0.25, 0.6, emissive="#8a5a10", emissive_strength=0.3)
stone = mat("stone", "#cfc4a8", 0.95, tex="stone")
stone2 = mat("stone2", "#bfb294", 0.95, tex="stone")
wood = mat("wood", "#8a6b45", 0.85, tex="wood")
green_dark = mat("green_dark", "#2e5d4b", 0.7, 0.0, emissive="#1d3d31", emissive_strength=0.4)

# ---- Nền đá + bậc ----
box("base", (0, 0.25, 0), (5.4, 0.5, 5.4), stone, bevel_w=0.05)
box("step", (0, 0.08, 3), (2.6, 0.16, 0.8), stone2, bevel_w=0.03)

# ---- Tầng dưới: 4 cột đỏ (đế đá + đầu cột vàng) ----
for x, z in ((-1.7, -1.7), (1.7, -1.7), (-1.7, 1.7), (1.7, 1.7)):
    cyl("column", (x, 2, z), 0.24, 0.28, 3, red, vertices=14)
    cyl("column_base", (x, 0.65, z), 0.32, 0.36, 0.3, stone, vertices=14)
    cyl("column_cap", (x, 3.55, z), 0.3, 0.25, 0.2, gold_dark, vertices=14)
    column_bands("colband", x, z, (1.4, 2.9), 0.25, gold_dark)

# ---- Sàn tầng 2 ----
box("floor2", (0, 3.65, 0), (4.6, 0.3, 4.6), wood, bevel_w=0.03)

# ---- Mái tầng 1: diềm + chóp cụt (đỉnh phẳng để lầu trên ngồi lên) + góc vểnh ----
box("roof1_eave", (0, 4.1, 0), (5.6, 0.35, 5.6), gold, bevel_w=0.04)
frustum_roof("roof1", (0, 4.275, 0), 5.2, 5.2, 3.4, 3.4, 0.9, gold_dark)
tile_fringe("roof1_tile_f", 4.3, -2.55, 2.55, 2.58, gold_dark)
tile_fringe("roof1_tile_b", 4.3, -2.55, 2.55, -2.58, gold_dark)
for cx, cz in ((-2.7, -2.7), (2.7, -2.7), (-2.7, 2.7), (2.7, 2.7)):
    d = (1.0 if cx > 0 else -1.0, 1.0 if cz > 0 else -1.0)
    n = (d[0] / 1.4142, d[1] / 1.4142)
    corner_horn("roof1_horn", (cx, 4.3, cz), n, gold_dark, length=0.7, tilt=0.5)

# ---- Tầng trên: tường kem + cửa sổ tròn 4 mặt ----
box("upper_wall", (0, 6.025, 0), (3.2, 1.7, 3.2), wall, bevel_w=0.03)
for i, yaw in enumerate((0, math.pi / 2, math.pi, -math.pi / 2)):
    nx, nz = math.sin(yaw), math.cos(yaw)
    medallion(f"window{i}", (nx * 1.62, 6.025, nz * 1.62), (nx, 0, nz),
              0.45, gold, green_dark)

# ---- Mái tầng 2: diềm + chóp + góc vểnh + trái châu ----
box("roof2_eave", (0, 6.875, 0), (4.4, 0.3, 4.4), gold_dark, bevel_w=0.04)
hip_roof_ridge("roof2", (0, 7.025, 0), 4.0, 4.0, 1.0, 1.2, gold)
tile_fringe("roof2_tile_f", 7.05, -1.9, 1.9, 1.98, gold_dark)
tile_fringe("roof2_tile_b", 7.05, -1.9, 1.9, -1.98, gold_dark)
ridge_caps("roof2_ridge", -0.5, 0.5, 8.04, 0, gold_dark)
for cx, cz in ((-2.0, -2.0), (2.0, -2.0), (-2.0, 2.0), (2.0, 2.0)):
    d = (1.0 if cx > 0 else -1.0, 1.0 if cz > 0 else -1.0)
    n = (d[0] / 1.4142, d[1] / 1.4142)
    corner_horn("roof2_horn", (cx, 7.05, cz), n, gold_dark, length=0.55, tilt=0.5)
box("roof2_ridge", (0, 8.05, 0), (1.4, 0.16, 0.4), gold, bevel_w=0.02)
gold_finial("finial", (0, 8.3, 0), r=0.24)

print("khuevancac poly:", poly_count())
export_glb(OUT)
