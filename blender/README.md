# Model 3D vẽ bằng Blender (cho web Thầy Đồ)

Các model trong `../public/models/*.glb` được vẽ bằng **Blender Python API** (headless,
không cần mở giao diện), thay cho cảnh ghép bằng hình khối cơ bản trong code.

## Blender ở đâu
Blender 4.5.9 LTS portable, tải về tại `~/workspace/tools/blender/blender-4.5.9-linux-x64/blender`
(chưa cài system-wide). Chạy headless:
```bash
~/workspace/tools/blender/blender-4.5.9-linux-x64/blender --background --python build_school.py
```

## Script
| Script | Xuất ra | Nội dung |
|---|---|---|
| `common.py` | (dùng chung) | Helper: vật liệu, hộp/trụ/cầu, mái hông, đèn lồng, xuất GLB. Tọa độ trong script theo hệ three.js (y lên), tự đổi sang hệ Blender. |
| `build_school.py` | `school.glb` | Lớp học Điện Thái Hòa: 2 tầng mái ngói vàng có sống mái + góc vểnh, cột đỏ, cửa mở, nội thất (bảng đen, bàn ghế, bục giảng). |
| `build_khuevancac.py` | `khuevancac.glb` | Khuê Văn Các: 4 cột, lầu 2 tầng, cửa sổ tròn 4 mặt. |
| `build_stele.py` | `stele.glb` | Bia tiến sĩ trên lưng rùa. |
| `build_gate.py` | `gate.glb` | Cổng Văn Miếu (tam quan), mái 2 tầng. |
| `build_teahouse.py` | `teahouse.glb` | Trà quán Hội An: tường vàng, mái nâu, đèn lồng đủ màu, bàn trà + ấm. |
| `build_teaceremony.py` | `teaceremony.glb` | Khu trà đạo: mái che 4 cột, bàn trà thấp, ấm chén, đệm ngồi, trúc. |
| `build_trees.py` | `tree_green.glb`, `tree_phuong.glb`, `tree_bamboo.glb` | Cây xanh, cây phượng (hoa đỏ), khóm trúc. Tán lá = nhiều icosphere xếp tự nhiên. |
| `build_characters.py` | `characters.glb` | 6 học sinh + 1 thầy đồ (mỗi mẫu là 1 node: `Student_M1/M2/M3`, `Student_F1/F2/F3`, `Teacher`). Nam: khăn đóng; nữ: búi/tết/xõa; thầy: râu trắng, áo thụng, gậy + sách. |
| `render_preview.py` | — | Render nhanh 1 file .glb ra PNG (Cycles CPU) để kiểm tra bằng mắt. |
| `preview_characters.py` | — | Dàn 7 nhân vật thành hàng ngang rồi render. |

## Vẽ lại 1 model sau khi sửa script
```bash
cd blender
~/workspace/tools/blender/blender-4.5.9-linux-x64/blender --background --python build_school.py
```
File `.glb` mới sẽ ghi đè file cũ trong `../public/models/`. Tổng các file .glb ~2.6MB.

## Lưu ý
- Model Blender **không** dùng `drei Html` (đã gây lỗi unmount root / removeChild) — bảng tên học sinh vẫn dùng `NameTag` vẽ canvas texture + Billboard trong code web.
- Nhân vật trong web: mỗi học sinh dùng 1 mẫu khác nhau (`Student_M1`, `Student_F1`, `Student_M3`); các mẫu còn lại (`M2`, `F2`, `F3`) đã có sẵn trong `characters.glb` để dùng khi thêm học sinh mới.
