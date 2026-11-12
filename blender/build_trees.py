# build_trees.py — 3 loại cây: cây xanh, cây phượng (hoa đỏ), cây trúc.
# Xuất 3 file .glb riêng. Tán lá = nhiều icosphere xếp tự nhiên (không phải 1 quả cầu trơn).
import sys, os, math, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

OUTDIR = os.path.expanduser("~/workspace/thay-do-web/public/models")
random.seed(7)


def trunk(x, z, h, r_base, mat_trunk):
    """Thân cây hơi nghiêng, 2 đoạn + rễ xòe ở gốc + vòng vỏ."""
    cyl("trunk_low", (x, h * 0.32, z), r_base * 0.8, r_base, h * 0.65, mat_trunk,
        vertices=10, rz=0.06)
    cyl("trunk_high", (x + 0.08, h * 0.75, z), r_base * 0.55, r_base * 0.75, h * 0.5,
        mat_trunk, vertices=10, rz=-0.08)
    # Rễ xòe: 5 nón cụt chĩa ra ngoài quanh gốc
    for i in range(5):
        a = i * (2 * math.pi / 5) + 0.5
        dx, dz = math.cos(a), math.sin(a)
        cyl(f"root{i}", (x + dx * 0.28, 0.14, z + dz * 0.28),
            0.05, 0.13, 0.55, mat_trunk, vertices=8,
            rz=dx * 0.9, rx=-dz * 0.9)
    # Vòng vỏ nổi quanh thân
    for fy in (0.45, 0.8):
        torus(f"bark{int(fy*100)}", (x, h * fy, z), r_base * 0.82, 0.03,
              mat_trunk, rot=(0, 0, 0))


def canopy(cx, cy, cz, blobs, mat_leaf, mat_leaf2, scale=1.0):
    """Tán lá: nhiều khối cầu xếp chồng, 2 tông xanh."""
    for i, (dx, dy, dz, r) in enumerate(blobs):
        m = mat_leaf if i % 2 == 0 else mat_leaf2
        ico(f"leaf{i}", (cx + dx * scale, cy + dy * scale, cz + dz * scale),
            r * scale, m, subdivisions=2)


def build_green():
    clean()
    trunk(0, 0, 1.8, 0.3, mat("trunk", "#5a3d24", 0.9, tex="wood"))
    # Canh cay xoe ra do tan la
    for bx, bz in ((0.5, 0.2), (-0.45, -0.25), (0.1, -0.5)):
        cyl("branch", (bx * 0.5, 2.0, bz * 0.5), 0.07, 0.11, 1.1, mat("trunk", "#5a3d24", 0.9, tex="wood"), vertices=8, rz=bx * 0.5, rx=bz * 0.4)
    blobs = [
        (0, 2.3, 0, 1.15), (0.7, 1.85, 0.3, 0.8), (-0.65, 1.9, -0.25, 0.85),
        (0.3, 2.8, -0.2, 0.75), (-0.4, 2.6, 0.35, 0.7), (0, 2.0, 0.7, 0.65),
        (-0.2, 2.1, -0.7, 0.6), (0.95, 2.3, -0.4, 0.55), (-0.95, 2.4, 0.45, 0.6),
        (0.15, 3.1, 0.25, 0.55), (-0.25, 1.7, 0.15, 0.55), (0.5, 2.5, 0.75, 0.5),
    ]
    canopy(0, 0, 0, blobs, mat("leaf", "#e8f0dc", 0.8, tex="leaf"), mat("leaf2", "#d8e4c8", 0.8, tex="leaf"))
    print("tree_green poly:", poly_count())
    export_glb(os.path.join(OUTDIR, "tree_green.glb"))


def build_phuong():
    clean()
    trunk(0, 0, 2.0, 0.32, mat("trunk", "#5a3d24", 0.9, tex="wood"))
    for bx, bz in ((0.55, 0.25), (-0.5, -0.3), (0.15, -0.55)):
        cyl("branch", (bx * 0.5, 2.2, bz * 0.5), 0.07, 0.12, 1.2, mat("trunk", "#5a3d24", 0.9, tex="wood"), vertices=8, rz=bx * 0.5, rx=bz * 0.4)
    blobs = [
        (0, 2.5, 0, 1.3), (0.9, 2.0, 0.4, 0.9), (-0.85, 2.1, -0.3, 0.95),
        (0.4, 3.0, -0.3, 0.85), (-0.5, 2.9, 0.4, 0.8), (0.2, 2.2, 0.9, 0.75),
        (-0.3, 2.3, -0.9, 0.7), (1.2, 2.5, -0.5, 0.65), (-1.2, 2.4, 0.5, 0.6),
        (0.7, 3.3, 0.3, 0.6), (-0.8, 3.2, -0.2, 0.6), (1.45, 2.2, 0.3, 0.5), (-1.45, 2.1, -0.4, 0.5),
    ]
    canopy(0, 0, 0, blobs, mat("leaf", "#e8f0dc", 0.8, tex="leaf"), mat("leaf2", "#d8e4c8", 0.8, tex="leaf"))
    # Chùm hoa phượng đỏ cam dày, rải khắp tán (cả mặt trên lẫn rìa)
    flower = mat("flower", "#c23a1e", 0.7)
    flower2 = mat("flower2", "#d94a26", 0.7)
    spots = [
        (0.6, 3.3, 0.5), (-0.7, 3.2, 0.2), (1.1, 2.8, 0.9), (-1.1, 3.0, -0.6),
        (0.2, 3.6, -0.3), (-0.3, 2.9, 1.0), (1.4, 2.6, 0.2), (-1.3, 2.7, 0.8),
        (0.9, 3.1, -0.9), (0, 3.4, 0.9), (-0.9, 2.6, -1.0), (0.5, 2.7, -1.1),
        (1.5, 2.9, -0.7), (-1.5, 2.8, -0.2), (0.3, 3.7, 0.6), (-0.4, 3.5, -0.8),
        (1.0, 2.4, 1.2), (-1.0, 2.5, 1.1), (0.8, 3.5, -0.6), (-0.2, 3.1, -1.2),
        (1.7, 2.4, 0.6), (-1.6, 2.3, 0.9), (0.1, 3.8, 0.1), (-0.8, 3.4, 0.7),
    ]
    for i, (x, y, z) in enumerate(spots):
        m = flower if i % 2 == 0 else flower2
        ico(f"flower{i}", (x, y, z), 0.22, m, subdivisions=1)
        ico(f"flower_s{i}", (x + 0.12, y + 0.1, z + 0.08), 0.15, m, subdivisions=1)
        ico(f"flower_s2_{i}", (x - 0.1, y + 0.04, z - 0.1), 0.12, m, subdivisions=1)
    print("tree_phuong poly:", poly_count())
    export_glb(os.path.join(OUTDIR, "tree_phuong.glb"))


def build_bamboo():
    clean()
    green = mat("bamboo", "#6b8a45", 0.8)
    green2 = mat("bamboo2", "#55763a", 0.8)
    for i in range(7):
        a = i * (2 * math.pi / 7) + 0.4
        x = math.cos(a) * 0.55
        z = math.sin(a) * 0.55
        h = 3.2 + (i % 3) * 0.5
        lean = 0.05 + (i % 3) * 0.03
        cyl(f"stalk{i}", (x, h / 2, z), 0.05, 0.07, h, green, vertices=8,
            rz=lean if i % 2 == 0 else -lean)
        # Đốt trúc: vài vành ngang (torus Blender không xoay đã nằm ngang sau khi xuất glTF)
        for j, fy in enumerate((0.35, 0.6, 0.85)):
            torus(f"node{i}_{j}", (x, h * fy, z), 0.075, 0.015, green2,
                  rot=(0, 0, 0))
        # Lá trên ngọn
        ico(f"bamboo_leaf{i}", (x, h + 0.15, z), 0.3, green2, subdivisions=1,
            scale=(1, 0.45, 0.5))
        ico(f"bamboo_leaf2_{i}", (x + 0.2, h - 0.1, z + 0.1), 0.2, green,
            subdivisions=1, scale=(1, 0.4, 0.5))
    print("tree_bamboo poly:", poly_count())
    export_glb(os.path.join(OUTDIR, "tree_bamboo.glb"))


build_green()
build_phuong()
build_bamboo()
