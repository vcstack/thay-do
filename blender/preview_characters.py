# preview_characters.py — Import characters.glb, dàn 7 nhân vật thành hàng ngang rồi render.
import bpy
import sys
import math
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
glb, out = argv[0], argv[1]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()
bpy.ops.import_scene.gltf(filepath=glb)

# Dàn các nhân vật (Empty group) thành hàng, cách nhau 1.6
names = ["Student_M1", "Student_M2", "Student_M3",
         "Student_F1", "Student_F2", "Student_F3", "Teacher"]
for i, name in enumerate(names):
    o = bpy.context.scene.objects.get(name)
    if o:
        o.location.x = (i - 3) * 1.7

cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 38
cam = bpy.data.objects.new("cam", cam_data)
bpy.context.scene.collection.objects.link(cam)
cam.location = (0, -14, 3.2)
target = Vector((0, 0, 1.0))
cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam

sun_data = bpy.data.lights.new("sun", type="SUN")
sun_data.energy = 2.0
sun = bpy.data.objects.new("sun", sun_data)
bpy.context.scene.collection.objects.link(sun)
sun.rotation_euler = (math.radians(50), 0, math.radians(30))

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
scene.render.resolution_x = 1400
scene.render.resolution_y = 500
scene.render.filepath = out
bpy.ops.render.render(write_still=True)
print("RENDERED", out)
