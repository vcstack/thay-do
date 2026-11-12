# gen_textures.py — Tạo texture procedural (numpy) rồi đưa vào Blender dưới dạng
# image (màu + normal map). Lý do: glTF exporter KHÔNG xuất được node
# procedural (Noise/Brick) — chỉ image texture mới nhúng được vào .glb.
# Poly Haven đã thử: API trả 403 sau lần gọi đầu, link download trực tiếp 404,
# nên dùng procedural bake thay cho texture tải về.
# Chạy trong Blender (bpy + numpy có sẵn). Cache theo session.
import bpy
import numpy as np

SIZE = 256
_cache = {}


def _blur(a, k=3):
    """Box blur 3x3 (wrap) lặp 2 lần — đủ mịn cho noise, tránh lỗi biên
    của cách cumsum khi k chẵn."""
    out = a
    for _ in range(2):
        out = (out + np.roll(out, 1, 0) + np.roll(out, -1, 0)
               + np.roll(out, 1, 1) + np.roll(out, -1, 1)
               + np.roll(out, (1, 1), (0, 1)) + np.roll(out, (1, -1), (0, 1))
               + np.roll(out, (-1, 1), (0, 1)) + np.roll(out, (-1, -1), (0, 1))) / 9.0
    return out


def _noise(res, octaves=(1.0, 0.5, 0.25)):
    """Value noise đa tần số, kết quả 0..1 (SIZE x SIZE)."""
    rng = np.random.default_rng(42)
    out = np.zeros((SIZE, SIZE))
    amp_sum = 0.0
    for amp in octaves:
        g = rng.random((res, res))
        # upsample bilinear bằng repeat + blur
        rep = SIZE // res
        big = np.repeat(np.repeat(g, rep, axis=0), rep, axis=1)
        out += amp * _blur(big, k=max(3, rep))
        amp_sum += amp
        res *= 2
    out /= amp_sum
    return (out - out.min()) / (out.max() - out.min() + 1e-9)


def _to_img(name, rgb, srgb=True):
    """rgb: float array (H, W, 3) 0..1 -> bpy image (lật dọc cho đúng UV)."""
    img = bpy.data.images.get(name)
    if img:
        return img
    arr = np.clip(rgb, 0, 1).astype(np.float32)
    arr = np.flipud(arr)  # UV origin dưới-trái
    rgba = np.dstack([arr, np.ones(arr.shape[:2] + (1,), dtype=np.float32)])
    img = bpy.data.images.new(name, width=SIZE, height=SIZE, alpha=True)
    # Đặt colorspace TRƯỚC khi gán pixels: gán sau sẽ làm Blender 4.5
    # xóa sạch buffer ảnh vừa tạo (lỗi đã gặp: texture toàn đen).
    img.colorspace_settings.name = "sRGB" if srgb else "Non-Color"
    img.pixels = rgba.ravel().tolist()
    img.pack()
    return img


def _normal_from_height(h, strength=1.0):
    gy, gx = np.gradient(h)
    gx *= strength
    gy *= strength
    n = np.dstack([-gx, -gy, np.ones_like(h)])
    n /= np.linalg.norm(n, axis=2, keepdims=True) + 1e-9
    return (n * 0.5 + 0.5)


_arrays = {}


def get_color_array(key):
    """Mảng màu gốc (chưa nhân tint) của texture, để pbr bake tint vào ảnh."""
    if key in _arrays:
        return _arrays[key]
    h = _HEIGHTS[key]()
    col = _COLORS[key](h)
    _arrays[key] = np.clip(col, 0, 1).astype(np.float32)
    return _arrays[key]


_HEIGHTS = {}
_COLORS = {}


def _make(key, color_fn, height_fn, nstrength=1.0):
    if key in _cache:
        return _cache[key]
    _HEIGHTS[key] = height_fn
    _COLORS[key] = color_fn
    h = height_fn()
    col = color_fn(h)
    ncol = _normal_from_height(h, nstrength)
    pair = (_to_img(f"tex_{key}", col, srgb=True),
            _to_img(f"tex_{key}_nrm", ncol, srgb=False))
    _cache[key] = pair
    return pair


def _hx(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)], dtype=np.float32)


def get_texture(key):
    """Trả về (color_img, normal_img) cho key. Các key: roof_gold, roof_brown,
    wood, stone, plaster, fabric, leaf."""
    if key == "roof_gold":
        base, dark = _hx("#d9a441"), _hx("#8a5a10")
        return _make(key, lambda h: _roof_color(h, base, dark),
                     lambda: _roof_height(), 1.6)
    if key == "roof_brown":
        base, dark = _hx("#7a4a2b"), _hx("#4a2c17")
        return _make(key, lambda h: _roof_color(h, base, dark),
                     lambda: _roof_height(), 1.6)
    if key == "roof_dark":
        # Mái ngói tối kiểu xiehanzi: nâu đen trầm, rãnh ngói vẫn đọc được.
        base, dark = _hx("#4a3d31"), _hx("#2a231c")
        return _make(key, lambda h: _roof_color(h, base, dark),
                     lambda: _roof_height(), 1.6)
    if key == "wood":
        return _make(key, _wood_color, _wood_height, 0.8)
    if key == "stone":
        return _make(key, _stone_color, lambda: _noise(8), 1.2)
    if key == "plaster":
        return _make(key, _plaster_color, lambda: _noise(16), 0.5)
    if key == "fabric":
        return _make(key, _fabric_color, _fabric_height, 0.7)
    if key == "leaf":
        return _make(key, _leaf_color, lambda: _noise(8), 0.9)
    raise KeyError(key)


def _roof_height():
    """Hàng ngói cong chồng nhau: 8 hàng, mỗi hàng 8 viên, sáng giữa viên."""
    yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
    row = (yy // 32).astype(int)
    col = (xx // 32).astype(int)
    # viên ngói lệch nửa viên ở hàng chẵn (kiểu lợp so le)
    off = np.where(row % 2 == 0, 0, 16)
    u = ((xx + off) % 32) / 32.0
    arc = np.sin(u * np.pi)  # 0 ở mép -> 1 giữa viên
    groove = np.where((yy % 32) < 4, 0.25, 1.0)  # rãnh ngang giữa các hàng
    rng = np.random.default_rng(7)
    per_tile = rng.random((8, 16))
    tile_var = per_tile[row, np.clip(((xx + off) // 32).astype(int), 0, 15)]
    return np.clip(0.35 + 0.65 * arc * groove * (0.85 + 0.3 * tile_var), 0, 1)


def _roof_color(h, base, dark):
    n = _noise(16)
    col = dark[None, None, :] + (base - dark)[None, None, :] * h[..., None]
    col *= (0.9 + 0.2 * n)[..., None]
    return col


def _wood_height():
    yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
    plank = (yy // 64).astype(int)
    grain = np.sin(xx * 0.05 + 3.0 * _noise(8) * 6.0) * 0.5 + 0.5
    gap = np.where((yy % 64) < 3, 0.15, 1.0)
    return np.clip(0.45 + 0.45 * grain * gap, 0, 1)


def _wood_color(h):
    n = _noise(8)
    light, dark = _hx("#c9a86a"), _hx("#6b5232")
    col = dark[None, None, :] + (light - dark)[None, None, :] * h[..., None]
    col *= (0.92 + 0.16 * n)[..., None]
    return col


def _stone_color(h):
    n = _noise(32)
    light, dark = _hx("#cfc4a8"), _hx("#8a7a5c")
    col = dark[None, None, :] + (light - dark)[None, None, :] * h[..., None]
    col *= (0.9 + 0.2 * n)[..., None]
    return col


def _plaster_color(h):
    n = _noise(32)
    base = _hx("#f6ead2")
    return base[None, None, :] * (0.94 + 0.12 * h)[..., None] * (0.97 + 0.06 * n)[..., None]


def _fabric_height():
    yy, xx = np.mgrid[0:SIZE, 0:SIZE]
    weave = ((xx // 8) + (yy // 8)) % 2
    return np.where(weave == 0, 0.95, 0.7).astype(np.float32)


def _fabric_color(h):
    n = _noise(16)
    return np.dstack([h, h, h]) * (0.9 + 0.2 * n)[..., None]


def _leaf_color(h):
    n = _noise(16)
    c1, c2 = _hx("#5d9b4a"), _hx("#2e5d33")
    col = c2[None, None, :] + (c1 - c2)[None, None, :] * h[..., None]
    col *= (0.9 + 0.2 * n)[..., None]
    return col
