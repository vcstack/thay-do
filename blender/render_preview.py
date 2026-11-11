# render_preview.py — Render nhanh 1 file .glb ra PNG để kiểm tra bằng mắt.
# Dùng: blender --background --python render_preview.py -- in.glb out.png cx cy cz tx ty tz
# (cx,cy,cz) = vị trí camera, (tx,ty,tz) = điểm nhìn, theo hệ three.js (y lên).
import bpy
import sys
import math
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
glb, out = argv[0], argv[1]
cx, cy, cz, tx, ty, tz = map(float, argv[2:8])

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()

bpy.ops.import_scene.gltf(filepath=glb)

# Camera (three.js -> Blender: (x, -z, y))
cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 50
cam = bpy.data.objects.new("cam", cam_data)
bpy.context.scene.collection.objects.link(cam)
cam.location = (cx, -cz, cy)
target = Vector((tx, -tz, ty))
cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam

# Mặt trời + sáng môi trường (giảm sáng để màu không bị cháy)
sun_data = bpy.data.lights.new("sun", type="SUN")
sun_data.energy = 2.0
sun = bpy.data.objects.new("sun", sun_data)
bpy.context.scene.collection.objects.link(sun)
sun.rotation_euler = (math.radians(50), 0, math.radians(30))

# Đèn ấm trong lớp (khớp với pointLight trong web) để soi nội thất qua cửa.
# three.js (0, 3.8, 0) -> Blender (0, 0, 3.8)
pt_data = bpy.data.lights.new("inner", type="POINT")
pt_data.energy = 60
pt_data.color = (1.0, 0.85, 0.55)
pt = bpy.data.objects.new("inner", pt_data)
bpy.context.scene.collection.objects.link(pt)
pt.location = (0, 0, 3.8)

world = bpy.data.worlds.new("w")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.75, 0.85, 0.9, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 0.4
bpy.context.scene.world = world

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = 32
scene.cycles.use_denoising = False
scene.render.resolution_x = 900
scene.render.resolution_y = 600
scene.render.filepath = out
bpy.ops.render.render(write_still=True)
print("RENDERED", out)
