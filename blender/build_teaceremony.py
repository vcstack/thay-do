# build_teaceremony.py — Khu trà đạo: mái che 4 cột, bàn trà thấp, ấm chén, đệm ngồi, trúc.
# Tọa độ local, gắn vào web tại [11.5, 0, 5.5].
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

OUT = os.path.expanduser("~/workspace/thay-do-web/public/models/teaceremony.glb")
clean()

stone = mat("stone", "#cfc4a8", 0.95, tex="stone")
wood = mat("wood", "#8a6b45", 0.85, tex="wood")
wood_dark = mat("wood_dark", "#5a3d24", 0.9, tex="wood")
wood_mid = mat("wood_mid", "#7a5230", 0.85, tex="wood")
roof_dark = mat("roof_dark", "#ffffff", 0.75, tex="roof_dark")
roof_dark2 = mat("roof_dark2", "#e8ddc8", 0.75, tex="roof_dark")
gold = mat("gold", "#d9a441", 0.4, 0.4)
gold_bright = mat("gold_bright", "#e8b23a", 0.25, 0.6, emissive="#8a5a10", emissive_strength=0.3)
red_pot = mat("red_pot", "#b3372a", 0.5)
darkred = mat("darkred", "#8f2a20", 0.5)
cup_white = mat("cup_white", "#f6ead2", 0.4)
bamboo_green = mat("bamboo_green", "#5d9b4a", 0.8)

# ---- Nền đá ----
box("base", (0, 0.12, 0), (4.6, 0.24, 4), stone, bevel_w=0.04)

# ---- 4 cột gỗ đỡ mái che (đế đá) ----
for x, z in ((-1.9, -1.6), (1.9, -1.6), (-1.9, 1.6), (1.9, 1.6)):
    cyl("column", (x, 1.35, z), 0.11, 0.13, 2.7, wood_mid, vertices=10)
    cyl("column_base", (x, 0.35, z), 0.17, 0.2, 0.22, stone, vertices=10)

# ---- Mái che: diềm gỗ tối + chóp ngói tối + góc vểnh nhỏ + trái châu ----
box("roof_eave", (0, 2.75, 0), (4.6, 0.3, 4.2), wood_dark, bevel_w=0.04)
hip_roof_ridge("roof", (0, 2.9, 0), 4.3, 3.9, 1.1, 1.8, roof_dark)
tile_fringe("roof_tile_f", 2.92, -2.05, 2.05, 1.92, roof_dark2)
tile_fringe("roof_tile_b", 2.92, -2.05, 2.05, -1.92, roof_dark2)
ridge_caps("roof_ridge", -0.8, 0.8, 4.01, 0, roof_dark2)
for cx, cz in ((-2.15, -1.95), (2.15, -1.95), (-2.15, 1.95), (2.15, 1.95)):
    d = (1.0 if cx > 0 else -1.0, 1.0 if cz > 0 else -1.0)
    n = (d[0] / 1.4142, d[1] / 1.4142)
    corner_horn("roof_horn", (cx, 2.95, cz), n, roof_dark2, length=0.5, tilt=0.5,
                radius=0.09)
gold_finial("finial", (0, 4.05, 0), r=0.14)

# ---- Bàn trà thấp + chân ----
box("table", (0, 0.55, 0), (2.2, 0.14, 1.2), wood, bevel_w=0.02)
for x, z in ((-1, -0.45), (1, -0.45), (-1, 0.45), (1, 0.45)):
    box("table_leg", (x, 0.28, z), (0.12, 0.5, 0.12), wood_dark)

# ---- Ấm trà (thân + vòi + quai + nắp) ----
sphere("teapot", (0, 0.78, 0), 0.17, red_pot, segments=14, rings=10)
cyl("teapot_spout", (0.2, 0.8, 0), 0.03, 0.04, 0.24, red_pot, vertices=6, rz=-0.7)
torus("teapot_handle", (-0.2, 0.82, 0), 0.09, 0.02, darkred, rot=(0, 0, math.pi / 2))
sphere("teapot_lid", (0, 0.92, 0), 0.06, gold, segments=10, rings=8)

# ---- 4 chén trà nhỏ (có nước trà) ----
for x, z in ((-0.7, 0.3), (0.7, 0.3), (-0.7, -0.35), (0.7, -0.35)):
    cyl("cup", (x, 0.68, z), 0.09, 0.07, 0.09, cup_white, vertices=12)
    cyl("tea", (x, 0.71, z), 0.07, 0.07, 0.02, mat("tea", "#8a5a20", 0.3), vertices=12)

# ---- Đệm ngồi 3 phía ----
for x, z, c in ((-1.3, 1.25, "#b3372a"), (1.3, 1.25, "#5d9b4a"), (0, -1.35, "#d9a441")):
    cyl("cushion", (x, 0.32, z), 0.55, 0.6, 0.16, mat("cushion_" + c.lstrip("#"), c, 0.9), vertices=16)

# ---- Khóm trúc bên cạnh ----
for i, x in enumerate((-0.5, -0.2, 0.15)):
    cyl(f"bamboo{i}", (2.15 + x * 0.3, 1.1, -1.5), 0.04, 0.05, 2.1, bamboo_green, vertices=6)
    # Lá trúc trên ngọn
    sphere(f"bamboo_leaf{i}", (2.15 + x * 0.3, 2.2, -1.5), 0.22, bamboo_green,
           scale=(1, 0.5, 0.4), segments=10, rings=8)

# ---- Đèn lồng đỏ sẫm treo mái che ----
lantern("lantern_L", (-1.9, 2.2, 1.9), scale=0.55, color="#8f2a20", glow="#6e1a12")
lantern("lantern_R", (1.9, 2.2, 1.9), scale=0.55, color="#b3372a", glow="#8f2a20")

print("teaceremony poly:", poly_count())
export_glb(OUT)
