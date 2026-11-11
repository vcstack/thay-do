# common.py — helpers dùng chung cho các script vẽ model Thầy Đồ.
# Quy ước: mọi hàm nhận tọa độ/kích thước theo hệ three.js (x phải, y lên, z về phía người xem),
# bên trong tự đổi sang hệ Blender (x, -z, y). Chạy bằng: blender --background --python script.py
import bpy
import math


def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4))


def T(x, y, z):
    """three.js (x, y-up, z) -> Blender (x, -z, y)."""
    return (x, -z, y)


def clean():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    for coll in (bpy.data.meshes, bpy.data.curves, bpy.data.materials,
                 bpy.data.cameras, bpy.data.lights):
        for block in list(coll):
            if block.users == 0:
                coll.remove(block)


def mat(name, hexcolor, rough=0.8, metallic=0.0, emissive=None, emissive_strength=0.0):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*hex2rgb(hexcolor), 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metallic
    if emissive:
        bsdf.inputs["Emission Color"].default_value = (*hex2rgb(emissive), 1.0)
        bsdf.inputs["Emission Strength"].default_value = emissive_strength
    return m


def _finish(obj, material, bevel_w=0.0, smooth=False):
    if material:
        obj.data.materials.append(material)
    if bevel_w:
        mod = obj.modifiers.new(name="Bevel", type="BEVEL")
        mod.width = bevel_w
        mod.segments = 2
        mod.limit_method = "ANGLE"
    if smooth:
        for poly in obj.data.polygons:
            poly.use_smooth = True
    return obj


def box(name, loc, size, material, bevel_w=0.0, yaw=0.0, rx=0.0, rz=0.0):
    """Hộp: loc = tâm (three.js), size = (sx, sy, sz) đầy đủ."""
    bpy.ops.mesh.primitive_cube_add(location=T(*loc))
    o = bpy.context.active_object
    o.name = name
    o.scale = (size[0] / 2.0, size[2] / 2.0, size[1] / 2.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.rotation_euler = (rx, -rz, yaw)
    return _finish(o, material, bevel_w)


def cyl(name, loc, r_top, r_bottom, height, material, vertices=16,
        bevel_w=0.0, yaw=0.0, rx=0.0, rz=0.0, smooth=False):
    """Trụ/nón cụt: trục dọc Y (three.js)."""
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices, radius1=r_bottom, radius2=r_top, depth=height,
        location=T(*loc))
    o = bpy.context.active_object
    o.name = name
    o.rotation_euler = (rx, -rz, yaw)
    return _finish(o, material, bevel_w, smooth=smooth)


def sphere(name, loc, radius, material, scale=(1, 1, 1), segments=24, rings=16,
           bevel_w=0.0, smooth=True):
    """Cầu: scale theo (sx, sy, sz) three.js."""
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments, ring_count=rings, radius=radius, location=T(*loc))
    o = bpy.context.active_object
    o.name = name
    o.scale = (scale[0], scale[2], scale[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return _finish(o, material, bevel_w, smooth=smooth)


def ico(name, loc, radius, material, subdivisions=2, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=subdivisions, radius=radius, location=T(*loc))
    o = bpy.context.active_object
    o.name = name
    o.scale = (scale[0], scale[2], scale[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return _finish(o, material, 0.0, smooth=True)


def torus(name, loc, major_r, minor_r, material, major_seg=24, minor_seg=10,
          rot=(0, 0, 0)):
    """Vành: rot là Euler three.js (rx, yaw, rz)."""
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major_r, minor_radius=minor_r,
        major_segments=major_seg, minor_segments=minor_seg,
        location=T(*loc), rotation=(rot[0], -rot[2], rot[1]))
    o = bpy.context.active_object
    o.name = name
    return _finish(o, material, 0.0, smooth=True)


def hip_roof(name, loc, fx, fz, height, material):
    """Mái chóp 4 mặt (kim tự tháp): loc = tâm đáy mái (three.js), fx/fz = footprint."""
    s = math.sqrt(2.0)
    bpy.ops.mesh.primitive_cone_add(
        vertices=4, radius1=1.0, radius2=0.0, depth=height,
        location=T(loc[0], loc[1] + height / 2.0, loc[2]),
        rotation=(0, 0, math.pi / 4))
    o = bpy.context.active_object
    o.name = name
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
    o.scale = (fx / s, fz / s, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return _finish(o, material, 0.0, smooth=False)


def hip_roof_ridge(name, loc, fx, fz, height, ridge_len, material):
    """Mái hông kiểu Việt: có sống mái (ridge) dọc X. loc = tâm đáy mái (three.js).
    4 mặt: 2 hình thang trước/sau + 2 tam giác 2 bên. Dùng mesh tự tạo để pháp tuyến đúng."""
    bx, by, bz = loc
    hx, hz = fx / 2.0, fz / 2.0
    rl = ridge_len / 2.0
    ay = by + height
    # Đỉnh (three.js): 4 góc đáy + 2 đầu sống mái
    verts_t = [
        (-hx, by, hz), (hx, by, hz), (hx, by, -hz), (-hx, by, -hz),
        (-rl, ay, 0), (rl, ay, 0),
    ]
    # Mặt (quấn ngược chiều kim đồng hồ khi nhìn từ ngoài)
    faces = [
        (0, 1, 5, 4),      # trước (+z): hình thang
        (2, 3, 4, 5),      # sau (-z): hình thang
        (3, 0, 4),         # trái (-x): tam giác
        (1, 2, 5),         # phải (+x): tam giác
    ]
    verts_b = [T(*v) for v in verts_t]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts_b, [], faces)
    mesh.update()
    o = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(o)
    return _finish(o, material, 0.0, smooth=False)


def frustum_roof(name, loc, fx, fz, tx, tz, height, material):
    """Mái chóp cụt (hình thang): đáy (fx, fz), đỉnh phẳng (tx, tz), cao height.
    loc = tâm đáy mái (three.js). Dùng cho mái dưới Khuê Văn Các để lầu trên ngồi lên."""
    bx, by, bz = loc
    hx, hz = fx / 2.0, fz / 2.0
    ux, uz = tx / 2.0, tz / 2.0
    ay = by + height
    verts_t = [
        (-hx, by, hz), (hx, by, hz), (hx, by, -hz), (-hx, by, -hz),
        (-ux, ay, uz), (ux, ay, uz), (ux, ay, -uz), (-ux, ay, -uz),
    ]
    faces = [
        (0, 1, 5, 4),      # trước (+z)
        (2, 3, 7, 6),      # sau (-z)
        (3, 0, 4, 7),      # trái (-x)
        (1, 2, 6, 5),      # phải (+x)
        (4, 5, 6, 7),      # đỉnh phẳng (hướng lên)
    ]
    verts_b = [T(*v) for v in verts_t]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts_b, [], faces)
    mesh.update()
    o = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(o)
    return _finish(o, material, 0.0, smooth=False)


def orient_z(obj, normal):
    """Xoay vật sao cho trục Z local chĩa theo hướng normal (three.js)."""
    from mathutils import Vector
    n = Vector((normal[0], -normal[2], normal[1]))
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = n.to_track_quat("Z", "Y")


def medallion(name, loc, normal, radius, ring_mat, disc_mat):
    """Huy hiệu tròn trên tường: vành + đĩa, mặt hướng theo normal (three.js)."""
    bpy.ops.mesh.primitive_torus_add(
        major_radius=radius, minor_radius=0.08,
        major_segments=24, minor_segments=10, location=T(*loc))
    ring = bpy.context.active_object
    ring.name = name + "_ring"
    orient_z(ring, normal)
    ring.data.materials.append(ring_mat)
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=24, radius=radius * 0.93, depth=0.04, location=T(*loc))
    disc = bpy.context.active_object
    disc.name = name + "_disc"
    orient_z(disc, normal)
    disc.data.materials.append(disc_mat)
    return ring, disc


def corner_horn(name, loc, diag, material, length=0.75, tilt=0.55, radius=0.13):
    """Gai cong vểnh ở góc mái: hình nón nhọn chĩa ra ngoài + vểnh lên.
    diag = hướng chéo (dx, dz) chuẩn hóa (three.js)."""
    from mathutils import Vector
    dx, dz = diag
    d_three = Vector((dx * math.cos(tilt), math.sin(tilt), dz * math.cos(tilt)))
    d_bl = Vector((d_three.x, -d_three.z, d_three.y))
    center = (loc[0] + d_three.x * length / 2.0,
              loc[1] + d_three.y * length / 2.0,
              loc[2] + d_three.z * length / 2.0)
    bpy.ops.mesh.primitive_cone_add(
        vertices=4, radius1=radius, radius2=0.02, depth=length,
        location=T(*center))
    o = bpy.context.active_object
    o.name = name
    o.rotation_mode = "QUATERNION"
    o.rotation_quaternion = d_bl.to_track_quat("Z", "Y")
    return _finish(o, material, 0.0, smooth=False)


def gold_finial(name, loc, r=0.22):
    sphere(name, loc, r, mat("gold_bright", "#e8b23a", 0.25, 0.6,
                              emissive="#8a5a10", emissive_strength=0.3),
           segments=16, rings=12)
    cyl(name + "_neck", (loc[0], loc[1] - r * 0.8, loc[2]), r * 0.45, r * 0.6,
        r * 0.7, mat("gold_dark", "#c98a2e", 0.4, 0.4), vertices=10)


def lantern(name, loc, scale=1.0, color="#d93b2b", glow="#a11d10"):
    """Đèn lồng: thân cầu dẹt + nắp vàng + tua rua. loc = tâm đèn."""
    g = group(name)
    s = scale
    cyl(name + "_string", (loc[0], loc[1] + 0.55 * s, loc[2]), 0.02, 0.02, 0.5 * s,
        mat("dark", "#3a2a1a", 0.9), vertices=6)
    cyl(name + "_cap", (loc[0], loc[1] + 0.3 * s, loc[2]), 0.12 * s, 0.16 * s, 0.1 * s,
        mat("gold", "#d9a441", 0.4, 0.4), vertices=12)
    sphere(name + "_body", loc, 0.42 * s,
           mat("lantern_" + color.lstrip("#"), color, 0.5, 0.0,
               emissive=glow, emissive_strength=0.3),
           scale=(1, 0.92, 1), segments=20, rings=14)
    torus(name + "_rib", loc, 0.42 * s, 0.015 * s, mat("darkred", "#8f2a20", 0.6),
          rot=(math.pi / 2, 0, 0))
    cyl(name + "_tassel_cap", (loc[0], loc[1] - 0.48 * s, loc[2]), 0.1 * s, 0.13 * s,
        0.12 * s, mat("gold", "#d9a441", 0.4, 0.4), vertices=12)
    cyl(name + "_tassel", (loc[0], loc[1] - 0.68 * s, loc[2]), 0.015, 0.015, 0.28 * s,
        mat("tassel", "#e8c37a", 0.8), vertices=6)
    # Parent tất cả về group
    for o in list(bpy.context.scene.objects):
        if o.name.startswith(name + "_") and o.parent is None:
            o.parent = g
    return g


def group(name):
    o = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(o)
    return o


def export_glb(path):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=path, export_format="GLB", export_apply=True,
        export_yup=True, export_materials="EXPORT")
    print("EXPORTED", path)


def poly_count():
    total = 0
    for o in bpy.context.scene.objects:
        if o.type == "MESH":
            total += len(o.data.polygons)
    return total
