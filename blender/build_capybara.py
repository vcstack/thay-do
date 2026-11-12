# build_capybara.py — NPC capybara trà quán, phong cách chibi giống ảnh f_055.png:
# thân tròn to, đầu to, tai tròn nhỏ, mắt đen to + highlight, má hồng, bụng kem,
# tư thế ngồi. Gốc ở mặt đất, quay mặt +z (three.js), cao tổng ~1.2.
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

OUT = os.path.expanduser("~/workspace/thay-do-web/public/models/capybara.glb")
clean()

BROWN = mat("capy_brown", "#a98052", 0.85)
BROWN_DARK = mat("capy_dark", "#8a6b45", 0.85)
CREAM = mat("capy_cream", "#f2e3c2", 0.85)
BLACK = mat("capy_black", "#2b1d12", 0.6)
CHEEK = mat("capy_cheek", "#f0a0a0", 0.7)
WHITE = mat("capy_white", "#fdfdf8", 0.4)

grp = group("Capybara")


def parent(o):
    o.parent = grp
    return o


# ---- Thân ngồi tròn to ----
parent(sphere("Capybara_body", (0, 0.42, 0), 0.42, BROWN,
              scale=(1, 1.05, 0.9), segments=20, rings=14))
# Bụng kem phía trước
parent(sphere("Capybara_belly", (0, 0.38, 0.28), 0.30, CREAM,
              scale=(0.85, 1.0, 0.5), segments=16, rings=12))
# Đùi ngồi 2 bên
for sx in (-1, 1):
    parent(sphere("Capybara_haunch", (sx * 0.30, 0.22, -0.02), 0.20, BROWN,
                  scale=(1, 1, 1.1), segments=14, rings=10))
    # Bàn chân trước
    parent(sphere("Capybara_foot", (sx * 0.20, 0.06, 0.24), 0.12, BROWN_DARK,
                  scale=(1, 0.5, 1.4), segments=12, rings=8))
# ---- Tay ngắn 2 bên, ôm sát thân ----
for sx in (-1, 1):
    parent(cyl("Capybara_arm", (sx * 0.34, 0.45, 0.18), 0.06, 0.07, 0.30,
               BROWN, vertices=10, rz=sx * 0.18))
    parent(sphere("Capybara_paw", (sx * 0.38, 0.30, 0.20), 0.07, BROWN_DARK,
                  segments=10, rings=8))

# ---- Đầu TO ----
head = parent(sphere("Capybara_head", (0, 0.88, 0.10), 0.34, BROWN,
                     scale=(1, 0.95, 0.95), segments=20, rings=14))
# Tai tròn nhỏ (tai trong thụt sâu vào tai ngoài để không lộ cục riêng)
for sx in (-1, 1):
    parent(sphere("Capybara_ear", (sx * 0.20, 1.16, 0.08), 0.07, BROWN,
                  segments=10, rings=8))
    parent(sphere("Capybara_ear_in", (sx * 0.20, 1.16, 0.10), 0.035, BROWN_DARK,
                  segments=8, rings=6))
# ---- Mõm nâu đậm + mũi + miệng ----
parent(sphere("Capybara_muzzle", (0, 0.80, 0.38), 0.16, BROWN_DARK,
              scale=(1.3, 0.8, 0.7), segments=14, rings=10))
parent(sphere("Capybara_nose", (0, 0.86, 0.50), 0.05, BLACK,
              scale=(1.4, 0.8, 0.6), segments=10, rings=8))
parent(box("Capybara_mouth", (0, 0.76, 0.47), (0.08, 0.015, 0.02), BLACK,
           bevel_w=0.005))
# ---- Mắt đen TO + highlight ----
for x in (-0.15, 0.15):
    parent(sphere("Capybara_eye", (x, 0.95, 0.36), 0.055, BLACK,
                  segments=12, rings=10))
    parent(sphere("Capybara_eye_hi", (x - 0.018, 0.968, 0.405), 0.016, WHITE,
                  segments=8, rings=6))
# ---- Má hồng ----
for sx in (-1, 1):
    parent(sphere("Capybara_cheek", (sx * 0.24, 0.85, 0.32), 0.06, CHEEK,
                  scale=(1, 0.7, 0.5), segments=10, rings=8))

print("capybara poly:", poly_count())
export_glb(OUT)
