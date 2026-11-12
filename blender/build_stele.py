# build_stele.py — Bia tiến sĩ trên lưng rùa (Văn Miếu).
# Tọa độ local, gắn vào web tại [-13.5, 0, 2] và [-13.5, 0, -0.8].
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

OUT = os.path.expanduser("~/workspace/thay-do-web/public/models/stele.glb")
clean()

stone = mat("stone", "#a89a78", 0.95, tex="stone")
stone_light = mat("stone_light", "#b9ac8d", 0.95, tex="stone")
stone_dark = mat("stone_dark", "#8a7a5c", 0.9, tex="stone")

# ---- Rùa đá: mai dẹt + đầu + 4 chân + đuôi ----
sphere("turtle_shell", (0, 0.32, 0), 0.85, stone,
       scale=(1, 0.45, 1.25), segments=20, rings=14)
# Vảy mai: vài gờ nổi
for i, (x, z) in enumerate([(-0.4, 0.3), (0.4, 0.3), (0, -0.1), (-0.4, -0.5), (0.4, -0.5)]):
    sphere(f"shell_bump{i}", (x, 0.62, z), 0.22, stone_light,
           scale=(1, 0.35, 1), segments=12, rings=8)
sphere("turtle_head", (0, 0.45, 1.05), 0.22, stone, segments=12, rings=10)
cyl("turtle_neck", (0, 0.4, 0.85), 0.14, 0.16, 0.3, stone, vertices=10)
for x, z in ((-0.55, 0.55), (0.55, 0.55), (-0.55, -0.55), (0.55, -0.55)):
    cyl(f"turtle_leg_{x}_{z}", (x, 0.16, z), 0.13, 0.15, 0.32, stone, vertices=8)
box("turtle_tail", (0, 0.2, -1.15), (0.16, 0.12, 0.3), stone, bevel_w=0.02)

# ---- Bia đá: tấm cao + nắp + chữ khắc ----
box("stele", (0, 1.35, 0), (0.28, 1.7, 1.15), stone_light, bevel_w=0.03)
box("stele_cap", (0, 2.3, 0), (0.34, 0.18, 1.25), stone, bevel_w=0.02)
# Chữ khắc 2 mặt (vài dòng)
for i, y in enumerate((0.45, 0, -0.45)):
    box(f"carve_a{i}", (0.15, 1.35 + y, 0), (0.02, 0.06, 0.7), stone_dark)
    box(f"carve_b{i}", (-0.15, 1.35 + y, 0), (0.02, 0.06, 0.7), stone_dark)

print("stele poly:", poly_count())
export_glb(OUT)
