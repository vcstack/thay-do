# build_teahouse.py — Trà quán kiểu Hội An, vẽ lại theo phong cách xiehanzi:
# tường kem ấm + khung gỗ tối, mái ngói tối, biển hiệu đỏ chữ vàng "茶館",
# đèn lồng đỏ sẫm. Tọa độ local, gắn vào web tại [-11, 0, 5.5].
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
from common import *

OUT = os.path.expanduser("~/workspace/thay-do-web/public/models/teahouse.glb")
ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
clean()

wall_cream = mat("wall_cream", "#f0e6cc", 0.9, tex="plaster")
roof_dark = mat("roof_dark", "#ffffff", 0.75, tex="roof_dark")
roof_dark2 = mat("roof_dark2", "#e8ddc8", 0.75, tex="roof_dark")
darkred = mat("darkred", "#8f2a20", 0.7)
red_bright = mat("red_bright", "#b3372a", 0.6)
gold = mat("gold", "#d9a441", 0.4, 0.4)
gold_bright = mat("gold_bright", "#e8b23a", 0.25, 0.6, emissive="#8a5a10", emissive_strength=0.3)
wood = mat("wood", "#8a6b45", 0.85, tex="wood")
wood_dark = mat("wood_dark", "#5a3d24", 0.9, tex="wood")
wood_mid = mat("wood_mid", "#7a5230", 0.85, tex="wood")
window_glow = mat("window_glow", "#ffd98a", 0.4, 0.0, emissive="#ffbf4d", emissive_strength=0.7)
red_pot = mat("red_pot", "#b3372a", 0.5)


def sign_material():
    """Biển hiệu: ảnh PNG vẽ sẵn (nền đỏ sẫm, viền vàng, chữ vàng 茶館)."""
    img = bpy.data.images.load(os.path.join(ASSETS, "sign_chaguan.png"))
    img.pack()
    m = bpy.data.materials.new("sign_chaguan")
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Roughness"].default_value = 0.6
    tex_node = nt.nodes.new("ShaderNodeTexImage")
    tex_node.image = img
    nt.links.new(tex_node.outputs["Color"], bsdf.inputs["Base Color"])
    return m


# ---- Thân nhà tường kem (bo góc) + khung gỗ tối ----
box("body", (0, 1.1, 0), (3.6, 2.2, 3), wall_cream, bevel_w=0.06)
# Chân tường đá
box("base", (0, 0.15, 0), (3.8, 0.3, 3.2), mat("stone", "#cfc4a8", 0.95), bevel_w=0.03)
# Khung gỗ mặt tiền: đà ngang trên/dưới + cột góc
box("beam_top", (0, 2.12, 1.52), (3.6, 0.12, 0.08), wood_dark)
box("beam_bottom", (0, 0.32, 1.52), (3.6, 0.12, 0.08), wood_dark)
for x in (-1.74, 1.74):
    box("post_front", (x, 1.2, 1.52), (0.12, 2.0, 0.08), wood_dark)
# Tấm gỗ 2 bên hông — màu gỗ khaki nhạt (không dùng gỗ tối đặc như trước)
for x in (-1.82, 1.82):
    box("side_panel", (x, 1.2, 0), (0.06, 1.9, 2.6),
        mat("side_wood", "#9a7d55", 0.9))

# ---- Mái ngói tối: diềm gỗ tối + chóp 4 mặt + góc vểnh nhỏ + trái châu ----
box("roof_eave", (0, 2.3, 0), (4.2, 0.3, 3.6), wood_dark, bevel_w=0.04)
hip_roof_ridge("roof", (0, 2.45, 0), 3.9, 3.3, 1.1, 1.6, roof_dark)
tile_fringe("roof_tile_f", 2.47, -1.85, 1.85, 1.62, roof_dark2)
tile_fringe("roof_tile_b", 2.47, -1.85, 1.85, -1.62, roof_dark2)
ridge_caps("roof_ridge", -0.7, 0.7, 3.56, 0, roof_dark2)
for cx, cz in ((-1.95, -1.65), (1.95, -1.65), (-1.95, 1.65), (1.95, 1.65)):
    d = (1.0 if cx > 0 else -1.0, 1.0 if cz > 0 else -1.0)
    n = (d[0] / 1.4142, d[1] / 1.4142)
    corner_horn("roof_horn", (cx, 2.5, cz), n, roof_dark2, length=0.5, tilt=0.5,
                radius=0.09)
gold_finial("finial", (0, 3.6, 0), r=0.14)

# ---- Biển hiệu đỏ chữ vàng "茶館" trên mặt tiền ----
# Dùng mặt phẳng riêng với UV 0..1 chuẩn (hộp cube bị lệch UV khi xuất glTF:
# ảnh chỉ hiện 1 lát dọc). Thêm tấm nền đỏ sẫm phía sau.
box("sign_back", (0, 1.9, 1.58), (1.96, 0.78, 0.04), darkred, bevel_w=0.01)
bpy.ops.mesh.primitive_plane_add(location=T(0, 1.9, 1.63))
_sign = bpy.context.active_object
_sign.name = "sign_board"
_sign.rotation_euler = (math.pi / 2, 0, 0)
_sign.scale = (0.95, 0.36, 1)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
_sign.data.materials.append(sign_material())

# ---- Cửa + cửa sổ sáng đèn (khung gỗ chia ô) ----
panel_door("door", (0, 0.85, 1.52), 1.1, 1.7, darkred, wood_dark, gold_bright)
lattice_window("window", (-1.15, 1.3, 1.52), 0.9, 0.9, window_glow, wood_dark,
               wood_dark, cols=2, rows=2, lintel_mat=wood_dark)
lattice_window("window2", (1.15, 1.3, 1.52), 0.9, 0.9, window_glow, wood_dark,
               wood_dark, cols=2, rows=2, lintel_mat=wood_dark)

# ---- Bàn trà tròn + ghế đẩu + ấm trà ngoài hiên ----
cyl("table_top", (0, 0.72, 2.6), 0.75, 0.75, 0.08, wood, vertices=20)
cyl("table_leg", (0, 0.36, 2.6), 0.09, 0.12, 0.7, wood_dark, vertices=8)
for x in (-0.9, 0.9):
    cyl("stool", (x, 0.25, 2.9), 0.24, 0.28, 0.5, wood_mid, vertices=12)
sphere("teapot", (0, 0.88, 2.6), 0.16, red_pot, segments=14, rings=10)
cyl("teapot_spout", (0.18, 0.9, 2.6), 0.03, 0.04, 0.22, red_pot, vertices=6, rz=-0.7)
sphere("teapot_lid", (0, 1.0, 2.6), 0.06, gold, segments=10, rings=8)

# ---- Đèn lồng đỏ sẫm 2 bên (không treo đèn giữa che biển hiệu) ----
lantern("lantern_L", (-1.35, 2.15, 1.75), scale=0.55, color="#b3372a", glow="#8f2a20")
lantern("lantern_R", (1.35, 2.15, 1.75), scale=0.55, color="#b3372a", glow="#8f2a20")

print("teahouse poly:", poly_count())
export_glb(OUT)
