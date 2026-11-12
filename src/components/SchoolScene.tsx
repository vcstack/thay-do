"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Float, OrbitControls, useGLTF } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import {
  SUGGESTED_NAMES,
  LECTURE_REPEAT,
  lectureExampleIntro,
  lectureIntro,
  lectureOutro,
  lectureWordIntro,
  loadStudentNames,
  loadGuestName,
  saveStudentName,
} from "@/data/teacher";
import {
  getLesson,
  lessons,
  type Lesson,
  type Sentence,
} from "@/data/lessons";
import { speakQueue, type SpeakHandle, type SpeakItem } from "@/lib/speak";

/* ------------------------------------------------------------------ */
/* Bảng hiệu "Thầy Đồ" vẽ bằng canvas, dùng làm texture               */
/* ------------------------------------------------------------------ */
function useSignTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#5a3a22";
    ctx.fillRect(0, 0, 512, 160);
    ctx.fillStyle = "#6b4527";
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(0, i * 20, 512, 2);
    }
    ctx.strokeStyle = "#d9a441";
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 492, 140);
    ctx.fillStyle = "#f6d789";
    ctx.font = "bold 82px Georgia, 'Times New Roman', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Thầy Đồ", 256, 86);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}


/* ------------------------------------------------------------------ */
/* Model .glb vẽ bằng Blender — load bằng useGLTF, clone mỗi lần dùng   */
/* (để cùng 1 file dùng được nhiều chỗ: bia x2, cây x9, nhân vật...).   */
/* ------------------------------------------------------------------ */
const MODEL_URLS = {
  school: "/models/school.glb",
  gate: "/models/gate.glb",
  khuevancac: "/models/khuevancac.glb",
  stele: "/models/stele.glb",
  teahouse: "/models/teahouse.glb",
  teaceremony: "/models/teaceremony.glb",
  treeGreen: "/models/tree_green.glb",
  treePhuong: "/models/tree_phuong.glb",
  treeBamboo: "/models/tree_bamboo.glb",
  characters: "/models/characters.glb",
} as const;

// Tải trước để cảnh hiện nhanh, không chờ từng model.
Object.values(MODEL_URLS).forEach((url) => useGLTF.preload(url));

/** Clone 1 scene glTF, bật đổ bóng cho mọi mesh. */
function useClonedScene(url: string) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const c = scene.clone();
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
}

/** 1 model .glb đặt ở vị trí cho trước (có thể bấm + hover). */
function GLBModel({
  url,
  position,
  rotationY = 0,
  scale = 1,
  onEnter,
}: {
  url: string;
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  onEnter?: () => void;
}) {
  const clone = useClonedScene(url);
  const clickable = !!onEnter;
  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      scale={scale}
      onClick={
        clickable
          ? (e) => {
              e.stopPropagation();
              onEnter!();
            }
          : undefined
      }
      onPointerOver={
        clickable
          ? (e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }
          : undefined
      }
      onPointerOut={
        clickable
          ? () => {
              document.body.style.cursor = "auto";
            }
          : undefined
      }
    >
      <primitive object={clone} />
    </group>
  );
}

/** Clone 1 nhân vật trong characters.glb theo tên node (Student_M1.../Teacher). */
function useCharacterModel(id: string) {
  const { nodes } = useGLTF(MODEL_URLS.characters);
  return useMemo(() => {
    const n = (nodes as Record<string, THREE.Object3D>)[id];
    if (!n) return null;
    const c = n.clone();
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    return c;
  }, [nodes, id]);
}

/* ------------------------------------------------------------------ */
/* Cây xanh / cây hoa                                                  */
/* ------------------------------------------------------------------ */
function Tree({
  position,
  scale = 1,
  blossom = false,
}: {
  position: [number, number, number];
  scale?: number;
  blossom?: boolean;
}) {
  return (
    <GLBModel
      url={blossom ? MODEL_URLS.treePhuong : MODEL_URLS.treeGreen}
      position={position}
      scale={scale}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Nhà phụ hai bên (mái chóp)                                          */
/* ------------------------------------------------------------------ */
function SideHouse({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow receiveShadow position={[0, 1.3, 0]}>
        <boxGeometry args={[4.2, 2.6, 3.6]} />
        <meshStandardMaterial color="#f6ead2" roughness={0.9} />
      </mesh>
      {/* mái chóp 4 mặt */}
      <mesh castShadow position={[0, 3.4, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3.6, 1.9, 4]} />
        <meshStandardMaterial color="#2e5d4b" roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, 4.4, 0]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#d9a441" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* cửa + cửa sổ */}
      <mesh position={[0, 0.95, 1.82]}>
        <boxGeometry args={[1, 1.9, 0.12]} />
        <meshStandardMaterial color="#8f2a20" roughness={0.7} />
      </mesh>
      <mesh position={[-1.3, 1.5, 1.82]}>
        <boxGeometry args={[1, 1, 0.12]} />
        <meshStandardMaterial
          color="#ffd98a"
          emissive="#ffbf4d"
          emissiveIntensity={0.7}
        />
      </mesh>
      <mesh position={[1.3, 1.5, 1.82]}>
        <boxGeometry args={[1, 1, 0.12]} />
        <meshStandardMaterial
          color="#ffd98a"
          emissive="#ffbf4d"
          emissiveIntensity={0.7}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Cổng Văn Miếu: 3 cửa, mái ngói vàng 2 tầng                          */
/* ------------------------------------------------------------------ */
function Gate({ onEnter }: { onEnter: () => void }) {
  return (
    <GLBModel url={MODEL_URLS.gate} position={[0, 0, 10.5]} onEnter={onEnter} />
  );
}

/* ------------------------------------------------------------------ */
/* Tòa lớp học chính                                                   */
/* ------------------------------------------------------------------ */
function SchoolBuilding({ onEnter }: { onEnter: () => void }) {
  const sign = useSignTexture();
  return (
    <group
      position={[0, 0, -4]}
      onClick={(e) => {
        e.stopPropagation();
        onEnter();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <GLBModel url={MODEL_URLS.school} position={[0, 0, 0]} />
      {/* bảng hiệu "Thầy Đồ" */}
      <mesh position={[0, 4.15, 3.42]}>
        <planeGeometry args={[3.6, 1.12]} />
        <meshStandardMaterial map={sign} roughness={0.7} />
      </mesh>
      {/* đèn ấm trong lớp */}
      <pointLight position={[0, 3.8, 0]} intensity={24} color="#ffd98a" distance={14} decay={1.6} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Nhân vật low-poly: thầy + học sinh                                  */
/* ------------------------------------------------------------------ */

/** Thầy đứng lớp: bình thường đung đưa nhẹ; khi đang giảng bài thì quay qua
    lại giữa học sinh và bảng đen, giơ tay phải chỉ bảng, gật đầu.
    Model thầy là 1 khối cứng nên ghép các mảnh (đầu, tay) thành khớp quay:
    khớp đặt ở cổ/vai, các mảnh được chuyển về tọa độ tương đối so với khớp.
    Khớp được ghép ngay trong memo lúc clone model (sửa clone mới tạo ở đây
    thì hợp lệ), rồi đưa vào ref để useFrame quay khớp mỗi frame. */
function TeacherFigure({
  position,
  lecturing,
}: {
  position: [number, number, number];
  lecturing: boolean;
}) {
  const { nodes } = useGLTF(MODEL_URLS.characters);
  const teacher = useMemo(() => {
    const n = (nodes as Record<string, THREE.Object3D>)["Teacher"];
    if (!n) return null;
    const model = n.clone();
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    const pivot = (x: number, y: number, z: number) => {
      const p = new THREE.Group();
      p.position.set(x, y, z);
      model.add(p);
      return p;
    };
    const attach = (p: THREE.Group, names: string[]) => {
      for (const name of names) {
        const o = model.getObjectByName(name);
        if (!o) continue;
        o.position.sub(p.position);
        p.add(o);
      }
    };
    // Khớp cổ (đầu + khăn + râu + mắt gật cùng nhau), khớp vai phải/trái.
    const head = pivot(0, 1.35, 0);
    attach(head, [
      "Teacher_head",
      "Teacher_khan",
      "Teacher_khan_knot",
      "Teacher_khan_top",
      "Teacher_beard",
      "Teacher_mustache",
      "Teacher_eye",
      "Teacher_eye.001",
    ]);
    const armR = pivot(0.35, 1.35, 0);
    attach(armR, ["Teacher_arm_R", "Teacher_hand_R"]);
    const armL = pivot(-0.35, 1.35, 0);
    attach(armL, [
      "Teacher_arm_L",
      "Teacher_hand_L",
      "Teacher_book",
      "Teacher_book_pages",
    ]);
    return { model, rig: { head, armR, armL } };
  }, [nodes]);

  const rigRef = useRef<{
    head: THREE.Group;
    armR: THREE.Group;
    armL: THREE.Group;
  } | null>(null);
  useEffect(() => {
    rigRef.current = teacher?.rig ?? null;
  }, [teacher]);

  const g = useRef<THREE.Group>(null);
  const lectRef = useRef(lecturing);
  useEffect(() => {
    lectRef.current = lecturing;
  }, [lecturing]);

  // Mức quay/chỉ hiện tại (nội suy mượt về đích mỗi frame).
  const anim = useRef({ turn: 0, point: 0 });
  useFrame((state, delta) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    const k = 1 - Math.exp(-2.5 * delta);
    const rig = rigRef.current;
    if (lectRef.current && rig) {
      // Chu kỳ 8 giây: 0–3s quay mặt về lớp, 3–6s quay ra bảng + chỉ bảng,
      // 6–8s quay lại về lớp.
      const ph = t % 8;
      const turnTarget = ph >= 3 && ph < 6 ? 1 : 0;
      anim.current.turn += (turnTarget - anim.current.turn) * k;
      const pointTarget = anim.current.turn > 0.55 ? 1 : 0;
      anim.current.point += (pointTarget - anim.current.point) * k;
      const { turn, point } = anim.current;
      g.current.rotation.y = Math.PI * turn + Math.sin(t * 0.5) * 0.05;
      g.current.rotation.x = 0.03 + Math.sin(t * 1.1) * 0.02;
      // Gật đầu liên tục trong lúc giảng.
      rig.head.rotation.x = 0.05 + Math.sin(t * 2.4) * 0.07;
      // Giơ tay phải chỉ bảng (vung nhẹ), tay trái cầm sách hơi nâng lên.
      rig.armR.rotation.x = -1.25 * point + Math.sin(t * 3) * 0.07 * point;
      rig.armL.rotation.x = -0.18;
    } else {
      // Không giảng: đung đưa nhẹ như cũ, các khớp về vị trí nghỉ.
      anim.current.turn += (0 - anim.current.turn) * k;
      anim.current.point += (0 - anim.current.point) * k;
      g.current.rotation.y =
        Math.PI * anim.current.turn + Math.sin(t * 0.5) * 0.12;
      g.current.rotation.x *= 0.95;
      if (rig) {
        rig.head.rotation.x *= 0.95;
        rig.armR.rotation.x *= 0.95;
        rig.armL.rotation.x *= 0.95;
      }
    }
  });
  if (!teacher) return null;
  return (
    <group ref={g} position={position} scale={1.12}>
      <primitive object={teacher.model} />
    </group>
  );
}

/** Trạng thái bài giảng: bài nào, đang giảng từ thứ mấy (index === total là kết bài). */
export interface LectureState {
  lesson: Lesson;
  index: number;
  total: number;
}

/** Bảng đen trong lớp: khi thầy đang giảng thì hiện chữ của từ đang giảng
    (chữ Hán to + pinyin + nghĩa Việt) vẽ lên canvas texture, đặt ngay trước
    mặt bảng đen có sẵn trong model school.glb (tâm bảng ở [0, 2.70, -7.08]).
    Không giảng thì ẩn đi để lộ bảng gốc. */
function LectureBoard({ lecture }: { lecture: LectureState | null }) {
  const texture = useMemo(() => {
    if (!lecture) return null;
    const word = lecture.lesson.vocab[Math.min(lecture.index, lecture.total - 1)];
    if (!word) return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 420;
    const ctx = canvas.getContext("2d")!;
    // Nền bảng xanh lá sẫm (khớp màu bảng gốc) + khung vàng.
    ctx.fillStyle = "#1f4d3a";
    ctx.fillRect(0, 0, 1024, 420);
    ctx.strokeStyle = "#d9a441";
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 1004, 400);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f6d789";
    ctx.font = "bold 34px system-ui, sans-serif";
    ctx.fillText(
      `Bài ${lecture.lesson.id} · ${lecture.lesson.titleVi}  —  từ ${Math.min(lecture.index + 1, lecture.total)}/${lecture.total}`,
      512,
      48
    );
    ctx.fillStyle = "#ffffff";
    ctx.font =
      "bold 170px 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif";
    ctx.fillText(word.zh, 512, 195);
    ctx.fillStyle = "#ffd98a";
    ctx.font = "bold 52px system-ui, sans-serif";
    ctx.fillText(word.py, 512, 315);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 46px system-ui, sans-serif";
    ctx.fillText(word.vi, 512, 375);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [lecture]);

  // Dọn texture cũ khi đổi từ để khỏi rò bộ nhớ.
  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  if (!lecture || !texture) return null;
  return (
    <mesh position={[0, 2.7, -6.97]}>
      <planeGeometry args={[4.4, 1.8]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export type StudentStatus = "idle" | "walking" | "sitting" | "returning";

export interface StudentInfo {
  id: string;
  name: string;
  robe: string;
  /** Tên node model Blender trong characters.glb (Student_M1.../Student_F3). */
  model: string;
  start: [number, number];
  seat: [number, number];
  status: StudentStatus;
  target: "seat" | "yard";
}

type Vec3 = [number, number, number];

function buildPath(start: [number, number], seat: [number, number]): Vec3[] {
  const [sx, sz] = start;
  const [tx, tz] = seat;
  return [
    [sx, 0, sz],
    [sx * 0.4, 0, 5.4],
    [0, 0, 2.2],
    [0, 0.6, 0.6],
    [0, 0.6, -2.0],
    [tx, 0.6, tz],
  ];
}

/* ------------------------------------------------------------------ */
/* Bảng tên trên đầu học sinh — vẽ tên lên canvas texture rồi gắn lên   */
/* mặt phẳng trong Billboard (luôn quay mặt về camera). Không dùng      */
/* drei Html vì Html tạo một React root riêng, khi unmount trong lúc    */
/* React đang render sẽ gây lỗi "synchronously unmount a root".        */
/* ------------------------------------------------------------------ */
function NameTag({
  name,
  position,
}: {
  name: string;
  position: [number, number, number];
}) {
  const texture = useMemo(() => {
    if (!name) return null;
    const canvas = document.createElement("canvas");
    const font = "bold 46px system-ui, -apple-system, sans-serif";
    const measure = canvas.getContext("2d")!;
    measure.font = font;
    const textW = measure.measureText(name).width;
    const padX = 30;
    const padY = 18;
    canvas.width = Math.ceil(textW + padX * 2);
    canvas.height = 46 + padY * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const w = canvas.width;
    const h = canvas.height;
    const r = h / 2;
    // Viên thuốc bo tròn
    ctx.beginPath();
    ctx.moveTo(r, 2);
    ctx.lineTo(w - r, 2);
    ctx.arc(w - r, r, r - 2, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(r, h - 2);
    ctx.arc(r, r, r - 2, Math.PI / 2, Math.PI * 1.5);
    ctx.closePath();
    ctx.fillStyle = "rgba(253, 249, 236, 0.95)";
    ctx.fill();
    ctx.strokeStyle = "#c98a2e";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = "#b3372a";
    ctx.fillText(name, w / 2, h / 2 + 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [name]);

  // Dọn texture cũ khi tên đổi để khỏi rò bộ nhớ.
  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  if (!name || !texture) return null;
  const aspect = texture.image.width / texture.image.height;
  const height = 0.34;
  return (
    <Billboard position={position}>
      <mesh>
        <planeGeometry args={[height * aspect, height]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
    </Billboard>
  );
}

/** Một học sinh: bấm vào để đặt tên rồi đi bộ vào lớp ngồi học. */
function Student({
  info,
  onRequestGo,
  onRequestBack,
  onArrive,
  posOut,
}: {
  info: StudentInfo;
  onRequestGo: (id: string) => void;
  onRequestBack: (id: string) => void;
  onArrive: (id: string, where: "seat" | "yard") => void;
  /** Ref dùng chung để camera bám theo: học sinh ghi vị trí hiện tại vào đây mỗi frame. */
  posOut: React.MutableRefObject<Record<string, THREE.Vector3>>;
}) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  // Model Blender của học sinh này (nam/nữ khác nhau, không trùng lặp).
  const model = useCharacterModel(info.model);

  const path = useMemo(() => buildPath(info.start, info.seat), [info.start, info.seat]);
  const statusRef = useRef(info.status);
  const targetRef = useRef(info.target);
  const wpRef = useRef(0);
  const sitT = useRef(0);
  const posRef = useRef(new THREE.Vector3(info.start[0], 0, info.start[1]));

  // Đồng bộ trạng thái từ cha; khi bắt đầu đi thì reset mốc đường đi
  useEffect(() => {
    const prev = statusRef.current;
    statusRef.current = info.status;
    targetRef.current = info.target;
    if (
      (info.status === "walking" || info.status === "returning") &&
      prev !== info.status
    ) {
      // Bắt đầu đi: bỏ qua mốc đầu (vị trí hiện tại), đi từ mốc 1
      wpRef.current = 1;
    }
    if (info.status === "idle") {
      posRef.current.set(info.start[0], 0, info.start[1]);
    }
  }, [info.status, info.target, info.start, path.length]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const st = statusRef.current;
    const moving = st === "walking" || st === "returning";

    // Ngồi xuống / đứng lên (nội suy)
    const sitGoal = st === "sitting" ? 1 : 0;
    sitT.current = THREE.MathUtils.clamp(
      sitT.current + (sitGoal - sitT.current) * Math.min(1, delta * 4),
      0,
      1
    );
    if (body.current) {
      body.current.position.y = -0.42 * sitT.current + (moving ? Math.abs(Math.sin(t * 9)) * 0.05 : 0);
      // Model GLB là 1 khối cứng nên không vung tay chân được — lắc nhẹ cả người khi đi.
      body.current.rotation.z = moving ? Math.sin(t * 9) * 0.05 : 0;
      body.current.rotation.x = moving ? 0.05 : 0;
    }

    if (moving) {
      const pts = targetRef.current === "seat" ? path : [...path].reverse();
      const wp = pts[wpRef.current];
      if (!wp) return;
      const target = new THREE.Vector3(wp[0], wp[1], wp[2]);
      const pos = posRef.current;
      const dir = target.clone().sub(pos);
      const dist = dir.length();
      const speed = 2.3 * delta;
      if (dist < Math.max(0.14, speed)) {
        pos.copy(target);
        wpRef.current += 1;
        if (wpRef.current >= pts.length) {
          onArrive(info.id, targetRef.current);
        }
      } else {
        dir.normalize();
        pos.addScaledVector(dir, speed);
        // Xoay mặt theo hướng đi
        const want = Math.atan2(dir.x, dir.z);
        let diff = want - g.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        g.rotation.y += diff * Math.min(1, delta * 8);
      }
    } else {
      // Đứng yên: người về vị trí nghỉ
      if (body.current) {
        body.current.rotation.z *= 0.8;
        body.current.rotation.x *= 0.8;
      }
      if (st === "sitting") {
        g.rotation.y += (Math.PI - g.rotation.y) * Math.min(1, delta * 4);
      }
    }

    g.position.copy(posRef.current);
    // Ghi vị trí hiện tại ra ref dùng chung để camera bám theo
    const out = posOut.current[info.id];
    if (out) out.copy(posRef.current);
  });

  const sitting = info.status === "sitting";
  const tagY = sitting ? 1.85 : 2.25;

  return (
    <group
      ref={group}
      position={[info.start[0], 0, info.start[1]]}
      onClick={(e) => {
        e.stopPropagation();
        if (info.status === "idle") onRequestGo(info.id);
        else if (info.status === "sitting") onRequestBack(info.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (info.status === "idle" || info.status === "sitting") {
          setHover(true);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      <group ref={body} scale={hover ? 1.06 : 1}>
        {/* Nhân vật vẽ bằng Blender (áo dài, khăn đóng/tóc, phụ kiện riêng) */}
        {model ? <primitive object={model} /> : null}
      </group>

      {/* Bảng tên trên đầu (chỉ hiện khi đã đặt tên) */}
      <NameTag name={info.name} position={[0, tagY, 0]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Trà quán nhỏ trong sân                                              */
/* ------------------------------------------------------------------ */
function TeaHouse({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <GLBModel url={MODEL_URLS.teahouse} position={position} rotationY={rotationY} />
  );
}

/* ------------------------------------------------------------------ */
/* Khu trà đạo: mái che, bàn trà thấp, ấm chén, đệm ngồi               */
/* ------------------------------------------------------------------ */
function TeaCeremony({
  position,
  rotationY = 0,
  onEnter,
}: {
  position: [number, number, number];
  rotationY?: number;
  onEnter: () => void;
}) {
  return (
    <GLBModel
      url={MODEL_URLS.teaceremony}
      position={position}
      rotationY={rotationY}
      onEnter={onEnter}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Khuê Văn Các (Văn Miếu): lầu 2 tầng, 4 cột, cửa sổ tròn             */
/* ------------------------------------------------------------------ */
function KhueVanCac({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <GLBModel url={MODEL_URLS.khuevancac} position={position} rotationY={rotationY} />
  );
}

/* ------------------------------------------------------------------ */
/* Bia tiến sĩ trên lưng rùa (Văn Miếu)                                */
/* ------------------------------------------------------------------ */
function Stele({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <GLBModel url={MODEL_URLS.stele} position={position} rotationY={rotationY} />
  );
}

/* ------------------------------------------------------------------ */
/* Đèn đá, ghế đá, hồ nước, mây                                        */
/* ------------------------------------------------------------------ */
function StoneLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.8]} />
        <meshStandardMaterial color="#b9ac8d" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0, 0.85, 0]}>
        <boxGeometry args={[0.32, 0.7, 0.32]} />
        <meshStandardMaterial color="#c4b795" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0, 1.45, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.7]} />
        <meshStandardMaterial
          color="#ffe9a8"
          emissive="#ffbf4d"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh
        castShadow
        position={[0, 1.95, 0]}
        rotation={[0, Math.PI / 4, 0]}
      >
        <coneGeometry args={[0.65, 0.5, 4]} />
        <meshStandardMaterial color="#a89a78" roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

function Bench({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[2.2, 0.18, 0.7]} />
        <meshStandardMaterial color="#8a6b45" roughness={0.85} />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} castShadow position={[x, 0.25, 0]}>
          <boxGeometry args={[0.18, 0.5, 0.6]} />
          <meshStandardMaterial color="#6b5232" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Cloud({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <Float speed={0.7} rotationIntensity={0} floatIntensity={0.9}>
      <group position={position} scale={scale}>
        {[
          [0, 0, 0, 1.4],
          [1.3, -0.15, 0, 1],
          [-1.3, -0.1, 0, 1.05],
          [0.5, 0.45, 0, 0.9],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r as number, 14, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function Pond() {
  const lily = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (lily.current) {
      lily.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.2;
    }
  });
  return (
    <group position={[8.5, 0, 3]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[2.7, 32]} />
        <meshStandardMaterial color="#6fb3d8" roughness={0.15} metalness={0.1} />
      </mesh>
      <group ref={lily}>
        {[
          [0.7, 0.6],
          [-0.8, 0.4],
          [0.1, -0.9],
        ].map(([x, z], i) => (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x, 0.05, z]}
          >
            <circleGeometry args={[0.42, 20, 0, 5.2]} />
            <meshStandardMaterial color="#4d7c3a" roughness={0.8} />
          </mesh>
        ))}
        <mesh position={[0.7, 0.12, 0.6]}>
          <sphereGeometry args={[0.12, 10, 8]} />
          <meshStandardMaterial color="#f2a7b8" roughness={0.6} />
        </mesh>
        <mesh position={[-0.8, 0.12, 0.4]}>
          <sphereGeometry args={[0.1, 10, 8]} />
          <meshStandardMaterial color="#f7c3d0" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Cảnh chính                                                          */
/* ------------------------------------------------------------------ */
const INITIAL_STUDENTS: Omit<StudentInfo, "name" | "status" | "target">[] = [
  { id: "hs1", robe: "#3a6ea5", model: "Student_M1", start: [-3.6, 6.2], seat: [-2.2, -4.4] },
  { id: "hs2", robe: "#e87a90", model: "Student_F1", start: [3.4, 7.6], seat: [2.2, -4.4] },
  { id: "hs3", robe: "#4d7c3a", model: "Student_M3", start: [0.8, 9.2], seat: [0, -5.9] },
];

/* ------------------------------------------------------------------ */
/* Bàn + ghế của học sinh (người xem): góc nhìn thứ nhất trong lớp     */
/* Ghế cuối lớp bên trái, đối diện thầy và bảng đen. Màu gỗ khớp với    */
/* bàn ghế có sẵn trong model school.glb (wood #8a6b45, wood_dark       */
/* #6b5232, wood_mid #7a5230).                                         */
/* ------------------------------------------------------------------ */
function VisitorDesk() {
  return (
    <group>
      {/* mặt bàn */}
      <mesh castShadow receiveShadow position={[-2.2, 1.32, -3.0]}>
        <boxGeometry args={[1.5, 0.08, 0.75]} />
        <meshStandardMaterial color="#8a6b45" roughness={0.8} />
      </mesh>
      {/* chân bàn */}
      {[-2.8, -1.6].map((x) => (
        <mesh key={x} castShadow position={[x, 0.95, -3.0]}>
          <boxGeometry args={[0.08, 0.7, 0.6]} />
          <meshStandardMaterial color="#6b5232" roughness={0.85} />
        </mesh>
      ))}
      {/* ghế ngồi */}
      <mesh castShadow receiveShadow position={[-2.2, 1.02, -2.2]}>
        <boxGeometry args={[0.55, 0.08, 0.55]} />
        <meshStandardMaterial color="#7a5230" roughness={0.85} />
      </mesh>
      {/* tựa lưng ghế (phía cửa lớp) */}
      <mesh castShadow position={[-2.2, 1.35, -1.94]}>
        <boxGeometry args={[0.55, 0.6, 0.08]} />
        <meshStandardMaterial color="#7a5230" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Camera "vào lớp": bám theo học sinh rồi chuyển vào trong lớp        */
/* ------------------------------------------------------------------ */
export type ViewMode = "yard" | "follow" | "classroom";

/** Góc nhìn toàn cảnh sân trường (mặc định). */
const YARD_POS = new THREE.Vector3(17, 10, 17);
const YARD_TARGET = new THREE.Vector3(0, 2.4, 0);
/** Góc nhìn trong lớp (thứ nhất, từ ghế học sinh): người xem đóng vai một học
    sinh ngồi ở bàn riêng cuối lớp (bàn khách ở [-2.2, -3.0], ghế ở [-2.2, -2.2]),
    nhìn về phía thầy và bảng đen. Chỉ thấy BÊN TRONG lớp — thầy, bảng, các
    bạn ngồi trước mặt — không thấy sân bên ngoài (cửa lớp ở sau lưng).
    Camera ở tầm mắt học sinh ngồi (~1.75), mục tiêu là giữa bảng đen. */
const CLASS_POS = new THREE.Vector3(-2.2, 1.75, -2.2);
const CLASS_TARGET = new THREE.Vector3(0, 2.2, -7.0);
/** Điểm trung gian khi bay vào lớp: đứng trước cửa lớp đang mở (cửa ở z ≈ -0.75,
    khe cửa x ∈ [-0.94, 0.94]) rồi mới vào ghế — để camera không xuyên tường. */
const DOOR_POS = new THREE.Vector3(0, 2.2, 0.5);
const DOOR_TARGET = new THREE.Vector3(0, 1.8, -4);
/** Camera bám sau lưng học sinh khi đi bộ (học sinh đi từ sân +z vào lớp -z). */
const FOLLOW_OFFSET = new THREE.Vector3(0, 2.6, 5.0);

/**
 * Điều khiển camera theo chế độ xem. Dùng lerp mượt mỗi frame; khi đã tới
 * nơi (trừ chế độ follow) thì thả ra để người dùng tự xoay/zoom.
 * Không gọi controls.update() ở đây — OrbitControls (enableDamping) tự
 * update mỗi frame, gọi thêm sẽ làm autoRotate quay gấp đôi.
 */
function CameraRig({
  viewMode,
  students,
  studentPos,
  controlsRef,
}: {
  viewMode: ViewMode;
  students: StudentInfo[];
  studentPos: React.MutableRefObject<Record<string, THREE.Vector3>>;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const camera = useThree((s) => s.camera);
  const animating = useRef(false);
  const prevMode = useRef(viewMode);
  /** Đang bay vào lớp qua cửa (chưa tới ghế) — đi qua khe cửa rồi mới vào ghế. */
  const viaDoor = useRef(false);

  // Đổi chế độ xem thì bắt đầu chuyển động camera
  useEffect(() => {
    if (prevMode.current !== viewMode) {
      prevMode.current = viewMode;
      animating.current = true;
      // Bay vào lớp từ ngoài sân/cửa thì đi qua cửa lớp, tránh xuyên tường
      // (đường thẳng từ chỗ học sinh vừa đi vào tới ghế có thể cắt tường).
      viaDoor.current = viewMode === "classroom" && camera.position.z > -0.5;
      // Rời lớp: nới khoảng cách tối đa để camera bay ra được sân
      // (giới hạn 6 trong lớp được đặt lại khi vào tới ghế, xem dưới).
      const controls = controlsRef.current;
      if (controls && viewMode !== "classroom") {
        controls.maxDistance = 30;
      }
    }
  }, [viewMode, camera, controlsRef]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const k = 1 - Math.exp(-3.2 * delta);
    let desiredPos: THREE.Vector3 | null = null;
    let desiredTarget: THREE.Vector3 | null = null;

    if (viewMode === "follow") {
      const moving = students.find(
        (s) => s.status === "walking" || s.status === "returning"
      );
      const p = moving ? studentPos.current[moving.id] : null;
      if (p) {
        desiredTarget = new THREE.Vector3(p.x, p.y + 1.3, p.z);
        desiredPos = desiredTarget.clone().add(FOLLOW_OFFSET);
      }
    } else if (viewMode === "classroom") {
      if (viaDoor.current && camera.position.z > -1.0) {
        // Chưa vào trong: bay tới trước cửa lớp, nhìn xuyên vào trong.
        desiredPos = DOOR_POS;
        desiredTarget = DOOR_TARGET;
      } else {
        // Đã qua cửa: vào ghế ngồi, nhìn về phía thầy và bảng đen.
        viaDoor.current = false;
        desiredPos = CLASS_POS;
        desiredTarget = CLASS_TARGET;
      }
    } else {
      desiredPos = YARD_POS;
      desiredTarget = YARD_TARGET;
    }

    if (!desiredPos || !desiredTarget) return;

    // Follow thì luôn bám theo; các chế độ khác chỉ lerp trong lúc chuyển động
    if (viewMode === "follow" || animating.current) {
      camera.position.lerp(desiredPos, k);
      controls.target.lerp(desiredTarget, k);
      // Đang đi qua cửa thì chưa tính là "tới nơi" — đợi vào tới ghế mới thả ra.
      if (viewMode !== "follow" && !viaDoor.current) {
        const dPos = camera.position.distanceTo(desiredPos);
        const dTgt = controls.target.distanceTo(desiredTarget);
        if (dPos < 0.08 && dTgt < 0.08) {
          animating.current = false;
          // Đã ngồi vào ghế: giới hạn zoom để camera ở trong phòng
          // (camera đang ở cách mục tiêu ~5.3 nên đặt 6 không gây giật).
          if (viewMode === "classroom") controls.maxDistance = 6;
        }
      }
    }
  });

  return null;
}

function Scene({
  students,
  viewMode,
  studentPos,
  lecturing,
  lecture,
  onRequestGo,
  onRequestBack,
  onArrive,
}: {
  students: StudentInfo[];
  viewMode: ViewMode;
  studentPos: React.MutableRefObject<Record<string, THREE.Vector3>>;
  lecturing: boolean;
  lecture: LectureState | null;
  onRequestGo: (id: string) => void;
  onRequestBack: (id: string) => void;
  onArrive: (id: string, where: "seat" | "yard") => void;
}) {
  const router = useRouter();
  const goLessons = () => router.push("/bai-hoc");
  const goSchedule = () => router.push("/lich-hoc");
  const goTea = () => router.push("/tra-dao");
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <>
      <color attach="background" args={["#bfe0ee"]} />
      <fog attach="fog" args={["#d7ecf5", 36, 72]} />

      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#cfe8f5", "#8fbf6a", 0.55]} />
      <directionalLight
        position={[12, 16, 8]}
        intensity={2.4}
        color="#fff1d6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-far={50}
        shadow-bias={-0.0004}
      />

      {/* mặt đất */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[34, 48]} />
        <meshStandardMaterial color="#8fbf6a" roughness={1} />
      </mesh>
      {/* sân gạch trước trường */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 3]}>
        <planeGeometry args={[13, 12]} />
        <meshStandardMaterial color="#d9c9a3" roughness={1} />
      </mesh>
      {/* lối đá từ cổng vào trường */}
      {[8.6, 7.2, 5.9, 4.6].map((z, i) => (
        <mesh
          key={i}
          receiveShadow
          position={[i % 2 === 0 ? 0.35 : -0.35, 0.06, z]}
        >
          <cylinderGeometry args={[0.62, 0.68, 0.12, 10]} />
          <meshStandardMaterial color="#c9b995" roughness={0.95} />
        </mesh>
      ))}

      <SchoolBuilding onEnter={goLessons} />
      {/* Ông thầy đồ đứng bục giảng trong lớp (tọa độ thế giới: lớp ở [0,0,-4]) */}
      <TeacherFigure position={[3.5, 0.6, -6.3]} lecturing={lecturing} />
      {/* Bảng đen đổi nội dung theo từ thầy đang giảng */}
      <LectureBoard lecture={lecture} />
      {/* Bàn + ghế của học sinh (người xem) cuối lớp bên trái */}
      <VisitorDesk />
      <Gate onEnter={goSchedule} />
      <SideHouse position={[-11.5, 0, -6]} rotationY={0.35} />
      <SideHouse position={[10.5, 0, -4]} rotationY={-0.4} />
      <TeaHouse position={[-11, 0, 5.5]} rotationY={0.5} />
      <TeaCeremony position={[11.5, 0, 5.5]} rotationY={-0.5} onEnter={goTea} />

      {/* Khuê Văn Các giữa sân + bia tiến sĩ */}
      <KhueVanCac position={[-7.5, 0, 0.5]} rotationY={0.25} />
      <Stele position={[-13.5, 0, 2]} rotationY={0.3} />
      <Stele position={[-13.5, 0, -0.8]} rotationY={0.3} />

      <Tree position={[-7.5, 0, 4.5]} scale={1.15} />
      <Tree position={[7.8, 0, 6.5]} scale={0.95} />
      <Tree position={[-12, 0, -7]} scale={1.3} />
      <Tree position={[12.5, 0, -8]} scale={1.1} />
      <Tree position={[-5.5, 0, -9]} scale={1} />
      <Tree position={[6.2, 0, -8.5]} scale={1.25} blossom />
      <Tree position={[-14.5, 0, 7]} scale={1} blossom />
      {/* cây cổ thụ */}
      <Tree position={[-15, 0, -2]} scale={1.7} />
      <Tree position={[14.5, 0, -1]} scale={1.6} />
      {/* khóm trúc bên hồ sen và cạnh khu trà đạo */}
      <GLBModel url={MODEL_URLS.treeBamboo} position={[11, 0, 1.5]} scale={0.9} />
      <GLBModel url={MODEL_URLS.treeBamboo} position={[-9, 0, -8.5]} scale={1.1} />

      <StoneLantern position={[-4.6, 0, 5.6]} />
      <StoneLantern position={[4.9, 0, 5.2]} />
      <Bench position={[-6.8, 0, 7.2]} rotationY={0.5} />
      <Bench position={[6.4, 0, 8]} rotationY={-0.6} />
      <Pond />

      {/* Học sinh trong sân — bấm vào để đặt tên rồi vào lớp */}
      {students.map((s) => (
        <Student
          key={s.id}
          info={s}
          onRequestGo={onRequestGo}
          onRequestBack={onRequestBack}
          onArrive={onArrive}
          posOut={studentPos}
        />
      ))}

      <CameraRig
        viewMode={viewMode}
        students={students}
        studentPos={studentPos}
        controlsRef={controlsRef}
      />

      <Cloud position={[-14, 13, -10]} scale={1.4} />
      <Cloud position={[10, 15, -14]} scale={1.8} />
      <Cloud position={[16, 12, 6]} scale={1.1} />
      <Cloud position={[-8, 16, 8]} scale={1.2} />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={[0, 2.4, 0]}
        autoRotate={viewMode === "yard"}
        autoRotateSpeed={0.55}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={viewMode === "classroom" ? 1 : 2}
        maxDistance={30}
        minPolarAngle={0.2}
        maxPolarAngle={1.75}
        minAzimuthAngle={viewMode === "classroom" ? -1.2 : undefined}
        maxAzimuthAngle={viewMode === "classroom" ? 1.2 : undefined}
      />
    </>
  );
}

export default function SchoolScene() {
  const [students, setStudents] = useState<StudentInfo[]>(() => {
    const saved = loadStudentNames();
    return INITIAL_STUDENTS.map((s) => ({
      ...s,
      name: saved[s.id] ?? "",
      status: "idle" as StudentStatus,
      target: "seat" as const,
    }));
  });
  const [namingId, setNamingId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [suggestIdx, setSuggestIdx] = useState(0);
  /** Chế độ camera: sân trường / bám theo học sinh / trong lớp học. */
  const [viewMode, setViewMode] = useState<ViewMode>("yard");
  /** Vị trí hiện tại của từng học sinh (học sinh tự ghi vào mỗi frame). */
  const studentPos = useRef<Record<string, THREE.Vector3>>(
    Object.fromEntries(
      INITIAL_STUDENTS.map((s) => [
        s.id,
        new THREE.Vector3(s.start[0], 0, s.start[1]),
      ])
    )
  );

  const namingStudent = students.find((s) => s.id === namingId) ?? null;
  const idleStudents = students.filter((s) => s.status === "idle");
  const sittingStudents = students.filter((s) => s.status === "sitting");
  const movingStudents = students.filter(
    (s) => s.status === "walking" || s.status === "returning"
  );

  /* --- Bài giảng của thầy trong lớp 3D --- */
  const [lectureLessonId, setLectureLessonId] = useState(1);
  const [lectureIndex, setLectureIndex] = useState(0);
  const [lecturing, setLecturing] = useState(false);
  /** Tăng mỗi lần dừng/đổi bài để lượt đọc cũ (nếu còn) không sang từ tiếp theo. */
  const lectureToken = useRef(0);
  /** Lượt đọc TTS đang chạy (để dừng giữa chừng). */
  const lectureHandle = useRef<SpeakHandle | null>(null);

  const lectureLesson = getLesson(lectureLessonId);
  const lectureWords = useMemo(
    () => lectureLesson?.vocab.slice(0, 5) ?? [],
    [lectureLesson]
  );
  /** Từ đang giảng để vẽ lên bảng đen + hiện ở panel (kẹp index ở từ cuối khi kết bài). */
  const lecture: LectureState | null =
    lecturing && lectureLesson && lectureWords.length > 0
      ? {
          lesson: lectureLesson,
          index: Math.min(lectureIndex, lectureWords.length - 1),
          total: lectureWords.length,
        }
      : null;

  const stopLecture = useCallback(() => {
    lectureToken.current += 1;
    lectureHandle.current?.stop();
    lectureHandle.current = null;
    setLecturing(false);
    setLectureIndex(0);
  }, []);

  function startLecture() {
    if (sittingStudents.length === 0) return;
    lectureToken.current += 1;
    lectureHandle.current?.stop();
    lectureHandle.current = null;
    setLectureIndex(0);
    setLecturing(true);
    // Chuyển camera vào trong lớp để xem thầy giảng.
    setViewMode("classroom");
  }

  function changeLesson(id: number) {
    // Đang giảng mà đổi bài thì cắt lượt đọc cũ, giảng lại từ đầu bài mới.
    if (lecturing) {
      lectureToken.current += 1;
      lectureHandle.current?.stop();
      lectureHandle.current = null;
    }
    setLectureLessonId(id);
    setLectureIndex(0);
  }

  // Chạy từng từ của bài giảng: đọc nối tiếp bằng TTS, xong thì sang từ sau.
  // Không có giọng đọc thì dùng hẹn giờ để bảng vẫn chuyển từ.
  useEffect(() => {
    if (!lecturing) return;
    const lesson = getLesson(lectureLessonId);
    if (!lesson) return;
    const words = lesson.vocab.slice(0, 5);
    if (words.length === 0) return;
    const token = ++lectureToken.current;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const advance = () => {
      if (lectureToken.current !== token) return;
      if (lectureIndex >= words.length) {
        // Vừa đọc xong câu kết → dừng hẳn.
        setLecturing(false);
        setLectureIndex(0);
      } else {
        setLectureIndex((i) => i + 1);
      }
    };
    if (lectureIndex >= words.length) {
      // Kết bài
      const handle = speakQueue(
        [{ text: lectureOutro(words.length), lang: "vi" }],
        advance
      );
      lectureHandle.current = handle;
      if (!handle) timer = setTimeout(advance, 4000);
    } else {
      const word = words[lectureIndex];
      const example: Sentence | undefined =
        lesson.sentences.find((s) => s.zh.includes(word.zh)) ??
        lesson.sentences[0];
      const items: SpeakItem[] = [];
      if (lectureIndex === 0) {
        items.push({
          text: lectureIntro(
            `Bài ${lesson.id}: ${lesson.titleVi}`,
            words.length
          ),
          lang: "vi",
        });
      }
      items.push({ text: lectureWordIntro(lectureIndex, word.vi), lang: "vi" });
      items.push({ text: word.zh, lang: "zh", rate: 0.7 });
      items.push({ text: LECTURE_REPEAT, lang: "vi" });
      items.push({ text: word.zh, lang: "zh", rate: 0.85 });
      if (example) {
        items.push({ text: lectureExampleIntro(example.vi), lang: "vi" });
        items.push({ text: example.zh, lang: "zh", rate: 0.85 });
      }
      const handle = speakQueue(items, advance);
      lectureHandle.current = handle;
      if (!handle) timer = setTimeout(advance, 9000);
    }
    return () => {
      if (timer) clearTimeout(timer);
      lectureHandle.current?.stop();
      lectureHandle.current = null;
    };
  }, [lecturing, lectureIndex, lectureLessonId]);

  function openNaming(id: string) {
    const st = students.find((s) => s.id === id);
    if (!st) return;
    // Học sinh chưa có tên thì gợi ý tên khách (tên của người vào trường) trước.
    const suggestion =
      st.name ||
      loadGuestName() ||
      SUGGESTED_NAMES[Math.floor(Math.random() * SUGGESTED_NAMES.length)];
    setNameInput(suggestion);
    setSuggestIdx(Math.max(0, SUGGESTED_NAMES.indexOf(suggestion)));
    setNamingId(id);
  }

  function cycleSuggestion() {
    const next = (suggestIdx + 1) % SUGGESTED_NAMES.length;
    setSuggestIdx(next);
    setNameInput(SUGGESTED_NAMES[next]);
  }

  function confirmNaming() {
    if (!namingId) return;
    const name = nameInput.trim() || SUGGESTED_NAMES[0];
    saveStudentName(namingId, name);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === namingId
          ? { ...s, name, status: "walking", target: "seat" }
          : s
      )
    );
    // Học sinh bắt đầu đi vào lớp → camera bám theo
    setViewMode("follow");
    setNamingId(null);
  }

  function sendOut(id: string) {
    // Nếu đây là học sinh cuối cùng trong lớp và thầy đang giảng → dừng giảng.
    if (
      lecturing &&
      sittingStudents.length === 1 &&
      sittingStudents[0]?.id === id
    ) {
      stopLecture();
    }
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "returning", target: "yard" } : s
      )
    );
    // Học sinh đi ra sân → camera bám theo ra
    setViewMode("follow");
  }

  function handleArrive(id: string, where: "seat" | "yard") {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: where === "seat" ? "sitting" : "idle" }
          : s
      )
    );
    // Chỉ tự chuyển view khi đang ở chế độ follow (người dùng chưa tự bấm "Ra sân")
    if (where === "seat") {
      setViewMode((prev) => (prev === "follow" ? "classroom" : prev));
    } else {
      const stillSitting = students.some(
        (s) => s.id !== id && s.status === "sitting"
      );
      setViewMode((prev) =>
        prev === "follow" ? (stillSitting ? "classroom" : "yard") : prev
      );
    }
  }

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [17, 10, 17], fov: 42, near: 0.1, far: 120 }}
        gl={{ antialias: true }}
      >
        {/* useGLTF tải model bất đồng bộ nên cần Suspense, không thì cả trang treo. */}
        <Suspense fallback={null}>
          <Scene
            students={students}
            viewMode={viewMode}
            studentPos={studentPos}
            lecturing={lecturing}
            lecture={lecture}
            onRequestGo={openNaming}
            onRequestBack={sendOut}
            onArrive={handleArrive}
          />
        </Suspense>
      </Canvas>

      {/* Lớp phủ HTML trên cảnh 3D */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Danh sách lớp */}
        <div className="absolute right-3 top-24 w-56 rounded-2xl border-2 border-[#c98a2e]/50 bg-[#fdf9ec]/95 p-3 shadow-lg">
          <p className="text-sm font-black text-[#b3372a]">
            🎒 Trong lớp ({sittingStudents.length}/{students.length})
          </p>
          <ul className="mt-2 space-y-1 text-xs font-bold text-[#2b2118]">
            {students.map((s) => (
              <li key={s.id} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-3 rounded-full border border-black/20"
                  style={{ backgroundColor: s.robe }}
                />
                <span className="flex-1 truncate">
                  {s.name || "Học sinh chưa đặt tên"}
                </span>
                <span className="text-[#6b5a44]">
                  {s.status === "sitting"
                    ? "🪑 đang học"
                    : s.status === "walking"
                      ? "🚶 đang vào lớp"
                      : s.status === "returning"
                        ? "🏃 đang ra sân"
                        : "🌳 ở sân"}
                </span>
              </li>
            ))}
          </ul>
          {movingStudents.length === 0 && sittingStudents.length === 0 && (
            <p className="mt-2 text-[11px] leading-snug text-[#6b5a44]">
              Bấm vào một học sinh trong sân để đặt tên và gọi bạn vào lớp.
            </p>
          )}
        </div>

        {/* Nút gọi vào / ra */}
        <div className="pointer-events-auto absolute bottom-24 right-3 flex flex-col gap-2">
          {idleStudents.length > 0 && (
            <button
              onClick={() => openNaming(idleStudents[0].id)}
              className="rounded-full bg-[#b3372a] px-4 py-2 text-sm font-extrabold text-[#fdf9ec] shadow-lg transition hover:bg-[#8f2a20]"
            >
              🚶 Cho học sinh vào lớp ({idleStudents.length})
            </button>
          )}
          {sittingStudents.length > 0 && (
            <button
              onClick={() => sendOut(sittingStudents[0].id)}
              className="rounded-full bg-[#fdf9ec] px-4 py-2 text-sm font-extrabold text-[#b3372a] shadow-lg transition hover:bg-white"
            >
              🏃 Cho học sinh ra sân ({sittingStudents.length})
            </button>
          )}
          {/* Nút xem lớp học / về sân (điều khiển camera) */}
          {sittingStudents.length > 0 && viewMode !== "classroom" && (
            <button
              onClick={() => setViewMode("classroom")}
              className="rounded-full bg-[#d9a441] px-4 py-2 text-sm font-extrabold text-[#2b2118] shadow-lg transition hover:bg-[#c98a2e]"
            >
              🏫 Vào xem lớp học
            </button>
          )}
          {/* Chọn bài giảng (đổi giữa chừng thì giảng lại từ đầu bài mới) */}
          {sittingStudents.length > 0 && (
            <select
              value={lectureLessonId}
              onChange={(e) => changeLesson(Number(e.target.value))}
              aria-label="Chọn bài giảng"
              className="rounded-full border-2 border-[#c98a2e] bg-[#fdf9ec] px-3 py-2 text-sm font-bold text-[#2b2118] shadow-lg outline-none"
            >
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  Bài {l.id}: {l.titleVi}
                </option>
              ))}
            </select>
          )}
          {/* Nút thầy giảng bài (cần có học sinh đang ngồi trong lớp) */}
          {sittingStudents.length > 0 && !lecturing && (
            <button
              onClick={startLecture}
              className="rounded-full bg-[#b3372a] px-4 py-2 text-sm font-extrabold text-[#fdf9ec] shadow-lg transition hover:bg-[#8f2a20]"
            >
              📖 Thầy giảng bài
            </button>
          )}
          {viewMode !== "yard" && (
            <button
              onClick={() => setViewMode("yard")}
              className="rounded-full bg-[#2b2118]/85 px-4 py-2 text-sm font-extrabold text-[#fdf9ec] shadow-lg transition hover:bg-[#2b2118]"
            >
              🌳 Ra sân
            </button>
          )}
        </div>

        {/* Panel bài giảng: từ đang giảng + tiến trình + nút dừng */}
        {lecturing && lecture && (
          <div className="pointer-events-auto absolute bottom-24 left-3 w-72 rounded-2xl border-2 border-[#c98a2e]/60 bg-[#fdf9ec]/95 p-4 shadow-xl">
            <p className="text-sm font-black text-[#b3372a]">
              📖 Thầy đang giảng — Bài {lecture.lesson.id}:{" "}
              {lecture.lesson.titleVi}
            </p>
            <p className="mt-2 text-center text-5xl font-black leading-tight text-[#2b2118]">
              {lecture.lesson.vocab[lecture.index]?.zh}
            </p>
            <p className="text-center text-sm font-bold text-[#6b5a44]">
              {lecture.lesson.vocab[lecture.index]?.py}
            </p>
            <p className="text-center text-base font-bold text-[#b3372a]">
              {lecture.lesson.vocab[lecture.index]?.vi}
            </p>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#e8c37a]/50">
              <div
                className="h-full rounded-full bg-[#b3372a] transition-all duration-500"
                style={{
                  width: `${((lecture.index + 1) / lecture.total) * 100}%`,
                }}
              />
            </div>
            <p className="mt-1 text-center text-xs font-bold text-[#6b5a44]">
              Từ {lecture.index + 1}/{lecture.total}
            </p>
            <button
              onClick={stopLecture}
              className="mt-3 w-full rounded-full bg-[#2b2118] px-4 py-2 text-sm font-extrabold text-[#fdf9ec] shadow transition hover:bg-black"
            >
              ⏹ Dừng giảng
            </button>
          </div>
        )}

        {/* Hộp đặt tên */}
        {namingStudent && (
          <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-black/45 p-4">
            <div className="w-full max-w-sm rounded-2xl border-2 border-[#c98a2e] bg-[#fdf9ec] p-6 shadow-2xl">
              <p className="text-center text-3xl">🧑‍🎓</p>
              <h3 className="mt-2 text-center text-lg font-black text-[#b3372a]">
                Đặt tên cho học sinh
              </h3>
              <p className="mt-1 text-center text-sm text-[#6b5a44]">
                Đặt tên rồi bạn ấy sẽ đi bộ vào lớp ngồi học. Tên được lưu lại,
                lần sau vào trường vẫn nhớ.
              </p>
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmNaming();
                  if (e.key === "Escape") setNamingId(null);
                }}
                placeholder="VD: Tiểu Minh"
                maxLength={20}
                className="mt-4 w-full rounded-xl border-2 border-[#c98a2e]/60 bg-white px-4 py-3 text-center text-lg font-bold text-[#2b2118] outline-none focus:border-[#b3372a]"
              />
              <button
                onClick={cycleSuggestion}
                className="mt-2 w-full rounded-full border-2 border-[#c98a2e] bg-[#fdf9ec] px-4 py-1.5 text-sm font-bold text-[#b3372a] hover:bg-[#e8c37a]/40"
              >
                🎲 Đổi tên gợi ý khác
              </button>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setNamingId(null)}
                  className="flex-1 rounded-full border-2 border-[#c98a2e] bg-[#fdf9ec] px-4 py-2.5 text-sm font-bold text-[#b3372a]"
                >
                  Để sau
                </button>
                <button
                  onClick={confirmNaming}
                  className="flex-[2] rounded-full bg-[#b3372a] px-4 py-2.5 text-sm font-extrabold text-[#fdf9ec] shadow hover:bg-[#8f2a20]"
                >
                  Cho vào lớp →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
