# pbr.py — Vật liệu có texture ảnh (màu + normal map) từ gen_textures.
# Dùng trong mat(..., tex="wood") của common.py. Texture đã là ảnh thật
# (procedural bake) nên glTF exporter nhúng được vào .glb.
import bpy
from common import hex2rgb, hex2rgb_linear
import gen_textures

# Độ lặp texture theo từng loại (Mapping scale).
REPEAT = {
    "roof_gold": (5, 3),
    "roof_brown": (5, 3),
    "roof_dark": (5, 3),
    "wood": (2, 2),
    "stone": (2, 2),
    "plaster": (2, 2),
    "fabric": (3, 3),
    "leaf": (2, 2),
}


def textured_mat(name, texkey, tint_hex, rough=0.8, metallic=0.0,
                 emissive=None, emissive_strength=0.0, normal_strength=0.6):
    """Principled BSDF: Base Color = texture * tint, Normal = normal map."""
    m = bpy.data.materials.get(name)
    if m:
        return m
    # Bake tint TRỰC TIẾP vào ảnh màu (downsample 128 để nhẹ file):
    # glTF exporter không xuất được node MixRGB multiply — nối trực tiếp
    # Image -> Base Color mới giữ đúng màu trong web.
    import numpy as np
    _, nrm_img = gen_textures.get_texture(texkey)
    base = gen_textures.get_color_array(texkey)
    tint = np.array(hex2rgb(tint_hex), dtype=np.float32)
    tinted = np.clip(base * tint[None, None, :], 0, 1)[::2, ::2]
    img_name = f"tex_{texkey}_{tint_hex.lstrip('#')}"
    color_img = bpy.data.images.get(img_name)
    if color_img is None:
        arr = np.flipud(tinted)
        rgba = np.dstack([arr, np.ones(arr.shape[:2] + (1,), dtype=np.float32)])
        color_img = bpy.data.images.new(img_name, width=128, height=128, alpha=True)
        color_img.colorspace_settings.name = "sRGB"
        color_img.pixels = rgba.ravel().tolist()
        color_img.pack()
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metallic
    if emissive:
        bsdf.inputs["Emission Color"].default_value = (*hex2rgb_linear(emissive), 1.0)
        bsdf.inputs["Emission Strength"].default_value = emissive_strength

    tex_coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    rx, ry = REPEAT.get(texkey, (2, 2))
    mapping.inputs["Scale"].default_value = (rx, ry, 1.0)
    nt.links.new(tex_coord.outputs["UV"], mapping.inputs["Vector"])

    img_node = nt.nodes.new("ShaderNodeTexImage")
    img_node.image = color_img
    img_node.extension = "REPEAT"
    nt.links.new(mapping.outputs["Vector"], img_node.inputs["Vector"])
    nt.links.new(img_node.outputs["Color"], bsdf.inputs["Base Color"])

    nrm_node = nt.nodes.new("ShaderNodeTexImage")
    nrm_node.image = nrm_img
    nrm_node.extension = "REPEAT"
    nt.links.new(mapping.outputs["Vector"], nrm_node.inputs["Vector"])
    nmap = nt.nodes.new("ShaderNodeNormalMap")
    nmap.inputs["Strength"].default_value = normal_strength
    nt.links.new(nrm_node.outputs["Color"], nmap.inputs["Color"])
    nt.links.new(nmap.outputs["Normal"], bsdf.inputs["Normal"])
    return m
