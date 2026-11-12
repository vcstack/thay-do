# build_teahouse.py — Trà quán kiểu Hội An: tường vàng, mái ngói nâu, đèn lồng đủ màu.
# Tọa độ local, gắn vào web tại [-11, 0, 5.5].
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

OUT = os.path.expanduser("~/workspace/thay-do-web/public/models/teahouse.glb")
clean()

wall_yellow = mat("wall_yellow", "#f0c75e", 0.9, tex="plaster")
roof_brown = mat("roof_brown", "#7a4a2b", 0.7, tex="roof_brown")
roof_brown2 = mat("roof_brown2", "#6b3d22", 0.7, tex="roof_brown")
darkred = mat("darkred", "#8f2a20", 0.7)
gold = mat("gold", "#d9a441", 0.4, 0.4)
gold_bright = mat("gold_bright", "#e8b23a", 0.25, 0.6, emissive="#8a5a10", emissive_strength=0.3)
wood = mat("wood", "#8a6b45", 0.85, tex="wood")
wood_dark = mat("wood_dark", "#6b5232", 0.9, tex="wood")
wood_mid = mat("wood_mid", "#7a5230", 0.85, tex="wood")
window_glow = mat("window_glow", "#ffd98a", 0.4, 0.0, emissive="#ffbf4d", emissive_strength=0.7)
red_pot = mat("red_pot", "#b3372a", 0.5)

# ---- Thân nhà tường vàng (bo góc) ----
box("body", (0, 1.1, 0), (3.6, 2.2, 3), wall_yellow, bevel_w=0.06)
# Chân tường đá
box("base", (0, 0.15, 0), (3.8, 0.3, 3.2), mat("stone", "#cfc4a8", 0.95), bevel_w=0.03)

# ---- Mái ngói nâu: diềm + chóp 4 mặt + góc vểnh + trái châu ----
box("roof_eave", (0, 2.3, 0), (4.2, 0.3, 3.6), roof_brown2, bevel_w=0.04)
hip_roof_ridge("roof", (0, 2.45, 0), 3.9, 3.3, 1.1, 1.6, roof_brown)
tile_fringe("roof_tile_f", 2.47, -1.85, 1.85, 1.62, roof_brown2)
tile_fringe("roof_tile_b", 2.47, -1.85, 1.85, -1.62, roof_brown2)
ridge_caps("roof_ridge", -0.7, 0.7, 3.56, 0, roof_brown2)
for cx, cz in ((-1.95, -1.65), (1.95, -1.65), (-1.95, 1.65), (1.95, 1.65)):
    d = (1.0 if cx > 0 else -1.0, 1.0 if cz > 0 else -1.0)
    n = (d[0] / 1.4142, d[1] / 1.4142)
    corner_horn("roof_horn", (cx, 2.5, cz), n, roof_brown2, length=0.55, tilt=0.5)
gold_finial("finial", (0, 3.6, 0), r=0.14)

# ---- Cửa + cửa sổ sáng đèn ----
box("door", (0, 0.85, 1.52), (1.1, 1.7, 0.1), darkred, bevel_w=0.02)
box("door_frame", (0, 0.85, 1.5), (1.3, 1.9, 0.06), wood_dark, bevel_w=0.02)
box("window", (-1.15, 1.3, 1.52), (0.9, 0.9, 0.1), window_glow, bevel_w=0.02)
box("window_frame", (-1.15, 1.3, 1.5), (1.05, 1.05, 0.06), wood_dark, bevel_w=0.02)
box("window2", (1.15, 1.3, 1.52), (0.9, 0.9, 0.1), window_glow, bevel_w=0.02)

# ---- Bàn trà tròn + ghế đẩu + ấm trà ngoài hiên ----
cyl("table_top", (0, 0.72, 2.6), 0.75, 0.75, 0.08, wood, vertices=20)
cyl("table_leg", (0, 0.36, 2.6), 0.09, 0.12, 0.7, wood_dark, vertices=8)
for x in (-0.9, 0.9):
    cyl("stool", (x, 0.25, 2.9), 0.24, 0.28, 0.5, wood_mid, vertices=12)
sphere("teapot", (0, 0.88, 2.6), 0.16, red_pot, segments=14, rings=10)
cyl("teapot_spout", (0.18, 0.9, 2.6), 0.03, 0.04, 0.22, red_pot, vertices=6, rz=-0.7)
sphere("teapot_lid", (0, 1.0, 2.6), 0.06, gold, segments=10, rings=8)

# ---- Đèn lồng đủ màu kiểu Hội An ----
lantern("lantern_main", (0, 2.3, 1.7), scale=0.7, color="#d93b2b", glow="#a11d10")
lantern("lantern_yellow", (-1.2, 2.1, 1.7), scale=0.55, color="#e8b23a", glow="#a87608")
lantern("lantern_orange", (1.2, 2.1, 1.7), scale=0.55, color="#e8703a", glow="#a34a18")
lantern("lantern_small", (-0.6, 1.9, 2.2), scale=0.45, color="#f2d06b", glow="#b08a1e")

print("teahouse poly:", poly_count())
export_glb(OUT)
