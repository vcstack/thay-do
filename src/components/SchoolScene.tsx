"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Float, OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import {
  SUGGESTED_NAMES,
  loadStudentNames,
  loadGuestName,
  saveStudentName,
} from "@/data/teacher";

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
/* Đèn lồng (đủ màu: đỏ, vàng, cam)                                    */
/* ------------------------------------------------------------------ */
function Lantern({
  position,
  scale = 1,
  color = "#d93b2b",
  glow = "#a11d10",
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  glow?: string;
}) {
  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
      <group position={position} scale={scale}>
        {/* dây treo */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
        {/* nắp vàng trên */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 0.1, 12]} />
          <meshStandardMaterial color="#d9a441" metalness={0.4} roughness={0.4} />
        </mesh>
        {/* thân đèn */}
        <mesh castShadow>
          <sphereGeometry args={[0.42, 20, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={glow}
            emissiveIntensity={0.55}
            roughness={0.5}
          />
        </mesh>
        {/* gân đèn */}
        <mesh position={[0, 0, 0]} scale={[1.02, 0.55, 1.02]}>
          <torusGeometry args={[0.42, 0.015, 8, 24]} />
          <meshStandardMaterial color="#8f2a20" />
        </mesh>
        {/* tua rua vàng dưới */}
        <mesh position={[0, -0.48, 0]}>
          <cylinderGeometry args={[0.1, 0.13, 0.12, 12]} />
          <meshStandardMaterial color="#d9a441" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.68, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.28, 6]} />
          <meshStandardMaterial color="#e8c37a" />
        </mesh>
      </group>
    </Float>
  );
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
  const leaf = blossom ? "#e85d3d" : "#5d9b4a";
  const leaf2 = blossom ? "#f0764a" : "#7cb35a";
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.18, 0.3, 1.8, 8]} />
        <meshStandardMaterial color="#7a5230" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 2.3, 0]}>
        <sphereGeometry args={[1.15, 12, 10]} />
        <meshStandardMaterial color={leaf} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.7, 1.85, 0.3]}>
        <sphereGeometry args={[0.8, 12, 10]} />
        <meshStandardMaterial color={leaf2} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-0.65, 1.9, -0.25]}>
        <sphereGeometry args={[0.75, 12, 10]} />
        <meshStandardMaterial color={leaf} roughness={0.8} />
      </mesh>
    </group>
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
  const [hover, setHover] = useState(false);
  return (
    <group
      position={[0, 0, 10.5]}
      onClick={(e) => {
        e.stopPropagation();
        onEnter();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* 4 cột đỏ tạo 3 cửa */}
      {[-3.6, -1.2, 1.2, 3.6].map((x) => (
        <mesh key={x} castShadow position={[x, 2.5, 0]}>
          <cylinderGeometry args={[0.3, 0.36, 5, 12]} />
          <meshStandardMaterial
            color={hover ? "#c8402a" : "#a32e22"}
            roughness={0.6}
          />
        </mesh>
      ))}
      {/* tường lửng 2 bên cửa phụ */}
      {[-2.4, 2.4].map((x) => (
        <mesh key={x} castShadow position={[x, 1.1, 0]}>
          <boxGeometry args={[1.1, 2.2, 0.3]} />
          <meshStandardMaterial color="#d9c9a3" roughness={0.9} />
        </mesh>
      ))}
      {/* xà ngang */}
      <mesh castShadow position={[0, 4.4, 0]}>
        <boxGeometry args={[8.4, 0.4, 0.5]} />
        <meshStandardMaterial color="#8f2a20" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 3.5, 0]}>
        <boxGeometry args={[7.6, 0.3, 0.4]} />
        <meshStandardMaterial color="#b3372a" roughness={0.6} />
      </mesh>
      {/* huy hiệu tròn giữa cổng */}
      <mesh position={[0, 3.95, 0.28]}>
        <torusGeometry args={[0.42, 0.07, 10, 24]} />
        <meshStandardMaterial color="#d9a441" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 3.95, 0.28]}>
        <circleGeometry args={[0.38, 24]} />
        <meshStandardMaterial
          color="#ffd98a"
          emissive="#ffbf4d"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* mái tầng 1 ngói vàng */}
      <mesh castShadow position={[0, 5.15, 0]}>
        <boxGeometry args={[9, 0.35, 1.8]} />
        <meshStandardMaterial color="#d9a441" roughness={0.7} />
      </mesh>
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[9.2, 0.18, 0.5]} />
        <meshStandardMaterial color="#c98a2e" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* mái tầng 2 thu nhỏ */}
      <mesh castShadow position={[0, 6.1, 0]}>
        <boxGeometry args={[5.4, 0.3, 1.4]} />
        <meshStandardMaterial color="#c98a2e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 6.45, 0]}>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial
          color="#e8b23a"
          metalness={0.6}
          roughness={0.25}
          emissive="#8a5a10"
          emissiveIntensity={0.3}
        />
      </mesh>
      <Lantern position={[-2.4, 3.1, 0]} scale={0.85} />
      <Lantern position={[2.4, 3.1, 0]} scale={0.85} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Tòa lớp học chính                                                   */
/* ------------------------------------------------------------------ */
function SchoolBuilding({ onEnter }: { onEnter: () => void }) {
  const sign = useSignTexture();
  const [hover, setHover] = useState(false);
  return (
    <group
      position={[0, 0, -4]}
      onClick={(e) => {
        e.stopPropagation();
        onEnter();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* nền đá + bậc thang */}
      <mesh receiveShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[12.5, 0.6, 9]} />
        <meshStandardMaterial color="#cfc4a8" roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[0, 0.15, 5.1]}>
        <boxGeometry args={[4.5, 0.3, 1]} />
        <meshStandardMaterial color="#bfb294" roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[0, 0.05, 5.7]}>
        <boxGeometry args={[4.5, 0.22, 0.8]} />
        <meshStandardMaterial color="#b3a684" roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[0, -0.04, 6.3]}>
        <boxGeometry args={[4.5, 0.16, 0.8]} />
        <meshStandardMaterial color="#a89a78" roughness={0.95} />
      </mesh>

      {/* thân nhà: tường sau + tường 2 bên + tường trước có cửa ra vào */}
      <mesh castShadow receiveShadow position={[0, 2.6, -3.25]}>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial
          color={hover ? "#fbf3da" : "#f6ead2"}
          roughness={0.9}
        />
      </mesh>
      {[-4.9, 4.9].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 2.6, 0]}>
          <boxGeometry args={[0.2, 4, 6.3]} />
          <meshStandardMaterial
            color={hover ? "#fbf3da" : "#f6ead2"}
            roughness={0.9}
          />
        </mesh>
      ))}
      {[-3.15, 3.15].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 2.6, 3.25]}>
          <boxGeometry args={[3.7, 4, 0.2]} />
          <meshStandardMaterial
            color={hover ? "#fbf3da" : "#f6ead2"}
            roughness={0.9}
          />
        </mesh>
      ))}
      {/* đà trên cửa */}
      <mesh castShadow receiveShadow position={[0, 4.3, 3.25]}>
        <boxGeometry args={[2.6, 0.6, 0.2]} />
        <meshStandardMaterial
          color={hover ? "#fbf3da" : "#f6ead2"}
          roughness={0.9}
        />
      </mesh>
      {/* sàn gỗ trong lớp */}
      <mesh receiveShadow position={[0, 0.56, 0]}>
        <boxGeometry args={[9.8, 0.08, 6.3]} />
        <meshStandardMaterial color="#c9a86a" roughness={0.85} />
      </mesh>
      {/* đèn ấm trong lớp */}
      <pointLight position={[0, 3.8, 0]} intensity={24} color="#ffd98a" distance={14} decay={1.6} />

      {/* cửa chính mở sang 2 bên */}
      {[-1.35, 1.35].map((x) => (
        <mesh
          key={x}
          castShadow
          position={[x, 2.1, 3.55]}
          rotation={[0, x < 0 ? 0.85 : -0.85, 0]}
        >
          <boxGeometry args={[1.15, 3.4, 0.1]} />
          <meshStandardMaterial color="#8f2a20" roughness={0.6} />
        </mesh>
      ))}

      {/* cột đỏ mặt tiền */}
      {[-4.6, -1.6, 1.6, 4.6].map((x) => (
        <mesh key={x} castShadow position={[x, 2.6, 3.3]}>
          <cylinderGeometry args={[0.26, 0.3, 4, 12]} />
          <meshStandardMaterial color="#b3372a" roughness={0.55} />
        </mesh>
      ))}

      {/* cửa sổ sáng đèn */}
      {[-3.1, 3.1].map((x) => (
        <group key={x} position={[x, 2.7, 3.38]}>
          <mesh>
            <boxGeometry args={[1.9, 1.5, 0.1]} />
            <meshStandardMaterial
              color="#ffd98a"
              emissive="#ffbf4d"
              emissiveIntensity={0.85}
            />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[0.08, 1.5, 0.05]} />
            <meshStandardMaterial color="#5a3a22" />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[1.9, 0.08, 0.05]} />
            <meshStandardMaterial color="#5a3a22" />
          </mesh>
        </group>
      ))}

      {/* bảng hiệu */}
      <mesh position={[0, 4.15, 3.42]}>
        <planeGeometry args={[3.6, 1.12]} />
        <meshStandardMaterial map={sign} roughness={0.7} />
      </mesh>

      {/* mái tầng 1 ngói vàng (Điện Thái Hòa) */}
      <mesh castShadow position={[0, 5.05, 0]}>
        <boxGeometry args={[12.6, 0.5, 8.6]} />
        <meshStandardMaterial color="#d9a441" roughness={0.7} />
      </mesh>
      {/* mái cong vểnh 4 góc */}
      {[
        [-6.1, 0, -4.1, 0.5],
        [6.1, 0, -4.1, -0.5],
        [-6.1, 0, 4.1, -0.5],
        [6.1, 0, 4.1, 0.5],
      ].map(([x, , z, r], i) => (
        <mesh
          key={i}
          castShadow
          position={[x, 5.25, z]}
          rotation={[0, 0, r as number]}
        >
          <boxGeometry args={[1.3, 0.28, 1.1]} />
          <meshStandardMaterial color="#c98a2e" roughness={0.7} />
        </mesh>
      ))}
      {/* mái tầng 2 ngói vàng */}
      <mesh castShadow position={[0, 6.15, 0]}>
        <boxGeometry args={[8.4, 0.45, 5.6]} />
        <meshStandardMaterial color="#c98a2e" roughness={0.7} />
      </mesh>
      {/* sống mái vàng + trái châu */}
      <mesh position={[0, 6.55, 0]}>
        <boxGeometry args={[8.6, 0.22, 0.5]} />
        <meshStandardMaterial color="#d9a441" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 7, 0]}>
        <sphereGeometry args={[0.34, 14, 12]} />
        <meshStandardMaterial
          color="#e8b23a"
          metalness={0.6}
          roughness={0.25}
          emissive="#8a5a10"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* đèn lồng treo mái hiên */}
      <Lantern position={[-3.4, 4.35, 3.5]} scale={0.9} />
      <Lantern position={[3.4, 4.35, 3.5]} scale={0.9} />

      {/* ---- Nội thất lớp học: bảng đen, bàn ghế, thầy ---- */}
      {/* bảng đen */}
      <group position={[0, 2.7, -3.08]}>
        <mesh>
          <boxGeometry args={[4.6, 1.9, 0.1]} />
          <meshStandardMaterial color="#2e4a3a" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[4.7, 0.1, 0.04]} />
          <meshStandardMaterial color="#d9a441" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.95, 0.06]}>
          <boxGeometry args={[4.7, 0.1, 0.04]} />
          <meshStandardMaterial color="#d9a441" roughness={0.5} />
        </mesh>
        {/* vài dòng phấn */}
        {[-0.5, 0, 0.5].map((y, i) => (
          <mesh key={i} position={[-0.6 + (i % 2) * 0.8, y, 0.06]}>
            <boxGeometry args={[2.2 - i * 0.4, 0.05, 0.02]} />
            <meshStandardMaterial color="#f6f1de" roughness={0.9} />
          </mesh>
        ))}
      </group>
      {/* bàn + ghế cho 3 chỗ ngồi */}
      {[
        { seat: [-2.2, -0.4] as const, desk: [-2.2, -1.3] as const },
        { seat: [2.2, -0.4] as const, desk: [2.2, -1.3] as const },
        { seat: [0, -1.9] as const, desk: [0, -2.7] as const },
      ].map(({ seat, desk }, i) => (
        <group key={i}>
          {/* bàn */}
          <mesh castShadow position={[desk[0], 1.32, desk[1]]}>
            <boxGeometry args={[1.5, 0.08, 0.75]} />
            <meshStandardMaterial color="#8a6b45" roughness={0.85} />
          </mesh>
          {[-0.6, 0.6].map((dx) => (
            <mesh key={dx} position={[desk[0] + dx, 0.95, desk[1]]}>
              <boxGeometry args={[0.08, 0.7, 0.6]} />
              <meshStandardMaterial color="#6b5232" roughness={0.9} />
            </mesh>
          ))}
          {/* ghế */}
          <mesh castShadow position={[seat[0], 1.02, seat[1]]}>
            <boxGeometry args={[0.55, 0.08, 0.55]} />
            <meshStandardMaterial color="#7a5230" roughness={0.85} />
          </mesh>
          <mesh position={[seat[0], 1.35, seat[1] + 0.26]}>
            <boxGeometry args={[0.55, 0.6, 0.08]} />
            <meshStandardMaterial color="#7a5230" roughness={0.85} />
          </mesh>
        </group>
      ))}
      {/* thầy đứng lớp */}
      <TeacherFigure position={[3.5, 0.6, -2.3]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Nhân vật low-poly: thầy + học sinh                                  */
/* ------------------------------------------------------------------ */

/** Thầy đứng lớp (tĩnh, đung đưa nhẹ). */
function TeacherFigure({ position }: { position: [number, number, number] }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (g.current) {
      g.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.12;
    }
  });
  return (
    <group ref={g} position={position} scale={1.12}>
      {/* chân */}
      {[-0.14, 0.14].map((x) => (
        <mesh key={x} position={[x, 0.25, 0]}>
          <boxGeometry args={[0.17, 0.5, 0.17]} />
          <meshStandardMaterial color="#2b2118" roughness={0.9} />
        </mesh>
      ))}
      {/* áo dài đỏ sẫm */}
      <mesh castShadow position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.3, 0.42, 0.9, 10]} />
        <meshStandardMaterial color="#8f2a20" roughness={0.8} />
      </mesh>
      {/* tay cầm thước */}
      <mesh position={[0.42, 1.05, 0.15]} rotation={[0.5, 0, -0.4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#d9a441" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* đầu + khăn xếp */}
      <mesh castShadow position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.27, 16, 12]} />
        <meshStandardMaterial color="#e8c39a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.24, 0.28, 0.14, 12]} />
        <meshStandardMaterial color="#2b2118" roughness={0.85} />
      </mesh>
      {/* râu */}
      <mesh position={[0, 1.42, 0.24]}>
        <boxGeometry args={[0.12, 0.22, 0.05]} />
        <meshStandardMaterial color="#e8e0cc" roughness={0.9} />
      </mesh>
    </group>
  );
}

export type StudentStatus = "idle" | "walking" | "sitting" | "returning";

export interface StudentInfo {
  id: string;
  name: string;
  robe: string;
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
}: {
  info: StudentInfo;
  onRequestGo: (id: string) => void;
  onRequestBack: (id: string) => void;
  onArrive: (id: string, where: "seat" | "yard") => void;
}) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);

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
    }
    // Ngồi hẳn xuống thì giấu chân (áo dài phủ lên ghế)
    const legsVisible = sitT.current < 0.5;
    if (legL.current) legL.current.visible = legsVisible;
    if (legR.current) legR.current.visible = legsVisible;

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
      // Vung chân tay khi đi
      const swing = Math.sin(t * 9) * 0.55;
      if (legL.current) legL.current.rotation.x = swing;
      if (legR.current) legR.current.rotation.x = -swing;
      if (armL.current) armL.current.rotation.x = -swing * 0.6;
      if (armR.current) armR.current.rotation.x = swing * 0.6;
    } else {
      // Đứng yên: chân tay về vị trí nghỉ, đầu hơi lắc
      if (legL.current) legL.current.rotation.x *= 0.8;
      if (legR.current) legR.current.rotation.x *= 0.8;
      if (armL.current) armL.current.rotation.x *= 0.8;
      if (armR.current) armR.current.rotation.x *= 0.8;
      if (st === "sitting") {
        g.rotation.y += (Math.PI - g.rotation.y) * Math.min(1, delta * 4);
      }
    }

    g.position.copy(posRef.current);
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
      <group ref={body}>
        {/* chân */}
        <group ref={legL} position={[-0.13, 0.52, 0]}>
          <mesh castShadow position={[0, -0.26, 0]}>
            <boxGeometry args={[0.16, 0.52, 0.16]} />
            <meshStandardMaterial color="#2b2118" roughness={0.9} />
          </mesh>
        </group>
        <group ref={legR} position={[0.13, 0.52, 0]}>
          <mesh castShadow position={[0, -0.26, 0]}>
            <boxGeometry args={[0.16, 0.52, 0.16]} />
            <meshStandardMaterial color="#2b2118" roughness={0.9} />
          </mesh>
        </group>
        {/* áo dài */}
        <mesh castShadow position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.28, 0.4, 0.9, 10]} />
          <meshStandardMaterial
            color={hover ? "#ffffff" : info.robe}
            roughness={0.8}
            emissive={hover ? info.robe : "#000000"}
            emissiveIntensity={hover ? 0.35 : 0}
          />
        </mesh>
        {/* đai lưng vàng */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.34, 0.36, 0.08, 10]} />
          <meshStandardMaterial color="#d9a441" metalness={0.4} roughness={0.4} />
        </mesh>
        {/* tay */}
        <group ref={armL} position={[-0.36, 1.32, 0]}>
          <mesh castShadow position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.56, 8]} />
            <meshStandardMaterial color={info.robe} roughness={0.8} />
          </mesh>
        </group>
        <group ref={armR} position={[0.36, 1.32, 0]}>
          <mesh castShadow position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.56, 8]} />
            <meshStandardMaterial color={info.robe} roughness={0.8} />
          </mesh>
        </group>
        {/* đầu */}
        <mesh castShadow position={[0, 1.62, 0]}>
          <sphereGeometry args={[0.27, 16, 12]} />
          <meshStandardMaterial color="#e8c39a" roughness={0.7} />
        </mesh>
        {/* mũ */}
        <mesh position={[0, 1.86, 0]}>
          <cylinderGeometry args={[0.22, 0.27, 0.13, 12]} />
          <meshStandardMaterial color="#2b2118" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.98, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#2b2118" roughness={0.85} />
        </mesh>
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
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* tường vàng Hội An */}
      <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[3.6, 2.2, 3]} />
        <meshStandardMaterial color="#f0c75e" roughness={0.9} />
      </mesh>
      {/* mái ngói nâu */}
      <mesh castShadow position={[0, 2.75, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3, 1.5, 4]} />
        <meshStandardMaterial color="#7a4a2b" roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, 3.55, 0]}>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color="#d9a441" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* cửa mở + cửa sổ */}
      <mesh position={[0, 0.85, 1.52]}>
        <boxGeometry args={[1.1, 1.7, 0.1]} />
        <meshStandardMaterial color="#8f2a20" roughness={0.7} />
      </mesh>
      <mesh position={[-1.15, 1.3, 1.52]}>
        <boxGeometry args={[0.9, 0.9, 0.1]} />
        <meshStandardMaterial color="#ffd98a" emissive="#ffbf4d" emissiveIntensity={0.7} />
      </mesh>
      {/* bàn trà + ghế đẩu + ấm trà ngoài hiên */}
      <mesh castShadow position={[0, 0.72, 2.6]}>
        <cylinderGeometry args={[0.75, 0.75, 0.08, 16]} />
        <meshStandardMaterial color="#8a6b45" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.36, 2.6]}>
        <cylinderGeometry args={[0.09, 0.12, 0.7, 8]} />
        <meshStandardMaterial color="#6b5232" roughness={0.9} />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} castShadow position={[x, 0.25, 2.9]}>
          <cylinderGeometry args={[0.24, 0.28, 0.5, 10]} />
          <meshStandardMaterial color="#7a5230" roughness={0.85} />
        </mesh>
      ))}
      {/* ấm trà */}
      <mesh position={[0, 0.88, 2.6]}>
        <sphereGeometry args={[0.16, 12, 10]} />
        <meshStandardMaterial color="#b3372a" roughness={0.5} />
      </mesh>
      <mesh position={[0.18, 0.9, 2.6]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.03, 0.04, 0.22, 6]} />
        <meshStandardMaterial color="#b3372a" roughness={0.5} />
      </mesh>
      {/* đèn lồng đủ màu kiểu Hội An */}
      <Lantern position={[0, 2.3, 1.7]} scale={0.7} color="#d93b2b" glow="#a11d10" />
      <Lantern position={[-1.2, 2.1, 1.7]} scale={0.55} color="#e8b23a" glow="#a87608" />
      <Lantern position={[1.2, 2.1, 1.7]} scale={0.55} color="#e8703a" glow="#a34a18" />
      <Lantern position={[-0.6, 1.9, 2.2]} scale={0.45} color="#f2d06b" glow="#b08a1e" />
    </group>
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
  const [hover, setHover] = useState(false);
  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onEnter();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* nền đá */}
      <mesh receiveShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[4.6, 0.24, 4]} />
        <meshStandardMaterial
          color={hover ? "#ddd2b2" : "#cfc4a8"}
          roughness={0.95}
        />
      </mesh>
      {/* 4 cột gỗ đỡ mái che */}
      {[
        [-1.9, -1.6],
        [1.9, -1.6],
        [-1.9, 1.6],
        [1.9, 1.6],
      ].map(([x, z], i) => (
        <mesh key={i} castShadow position={[x, 1.35, z]}>
          <cylinderGeometry args={[0.11, 0.13, 2.7, 8]} />
          <meshStandardMaterial color="#7a5230" roughness={0.85} />
        </mesh>
      ))}
      {/* mái che 4 mặt màu ngói nâu */}
      <mesh castShadow position={[0, 3.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3.4, 1.3, 4]} />
        <meshStandardMaterial color="#7a4a2b" roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, 3.85, 0]}>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color="#d9a441" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* bàn trà thấp */}
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[2.2, 0.14, 1.2]} />
        <meshStandardMaterial color="#8a6b45" roughness={0.85} />
      </mesh>
      {[
        [-1, -0.45],
        [1, -0.45],
        [-1, 0.45],
        [1, 0.45],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.28, z]}>
          <boxGeometry args={[0.12, 0.5, 0.12]} />
          <meshStandardMaterial color="#6b5232" roughness={0.9} />
        </mesh>
      ))}
      {/* ấm trà trên bàn */}
      <mesh position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.17, 12, 10]} />
        <meshStandardMaterial color="#b3372a" roughness={0.5} />
      </mesh>
      <mesh position={[0.2, 0.8, 0]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.03, 0.04, 0.24, 6]} />
        <meshStandardMaterial color="#b3372a" roughness={0.5} />
      </mesh>
      <mesh position={[-0.2, 0.82, 0]} rotation={[0, 0, 0.6]}>
        <torusGeometry args={[0.09, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#8f2a20" roughness={0.5} />
      </mesh>
      {/* 4 chén trà nhỏ */}
      {[
        [-0.7, 0.3],
        [0.7, 0.3],
        [-0.7, -0.35],
        [0.7, -0.35],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.68, z]}>
          <cylinderGeometry args={[0.09, 0.07, 0.09, 10]} />
          <meshStandardMaterial color="#f6ead2" roughness={0.4} />
        </mesh>
      ))}
      {/* đệm ngồi 3 phía */}
      {[
        [-1.3, 1.25, "#b3372a"],
        [1.3, 1.25, "#5d9b4a"],
        [0, -1.35, "#d9a441"],
      ].map(([x, z, c], i) => (
        <mesh key={i} castShadow position={[x as number, 0.32, z as number]}>
          <cylinderGeometry args={[0.55, 0.6, 0.16, 16]} />
          <meshStandardMaterial color={c as string} roughness={0.9} />
        </mesh>
      ))}
      {/* khóm trúc bên cạnh */}
      {[-0.5, -0.2, 0.15].map((x, i) => (
        <mesh key={i} position={[2.15 + x * 0.3, 1.1, -1.5]}>
          <cylinderGeometry args={[0.04, 0.05, 2.1, 6]} />
          <meshStandardMaterial color="#5d9b4a" roughness={0.8} />
        </mesh>
      ))}
      {/* đèn lồng treo mái che */}
      <Lantern position={[-1.9, 2.2, 1.9]} scale={0.55} color="#d93b2b" glow="#a11d10" />
      <Lantern position={[1.9, 2.2, 1.9]} scale={0.55} color="#e8b23a" glow="#a87608" />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Khuê Văn Các (Văn Miếu): lầu 2 tầng, 4 cột, cửa sổ tròn             */
/* ------------------------------------------------------------------ */
function KhueVanCac({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* nền đá + bậc */}
      <mesh receiveShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[5.4, 0.5, 5.4]} />
        <meshStandardMaterial color="#cfc4a8" roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[0, 0.08, 3]}>
        <boxGeometry args={[2.6, 0.16, 0.8]} />
        <meshStandardMaterial color="#bfb294" roughness={0.95} />
      </mesh>
      {/* tầng dưới: 4 cột đỏ */}
      {[
        [-1.7, -1.7],
        [1.7, -1.7],
        [-1.7, 1.7],
        [1.7, 1.7],
      ].map(([x, z], i) => (
        <mesh key={i} castShadow position={[x, 2, z]}>
          <cylinderGeometry args={[0.24, 0.28, 3, 12]} />
          <meshStandardMaterial color="#b3372a" roughness={0.55} />
        </mesh>
      ))}
      {/* sàn tầng 2 */}
      <mesh castShadow position={[0, 3.65, 0]}>
        <boxGeometry args={[4.6, 0.3, 4.6]} />
        <meshStandardMaterial color="#8a6b45" roughness={0.85} />
      </mesh>
      {/* mái tầng 1 ngói vàng cong vểnh */}
      <mesh castShadow position={[0, 4.1, 0]}>
        <boxGeometry args={[5.6, 0.35, 5.6]} />
        <meshStandardMaterial color="#d9a441" roughness={0.7} />
      </mesh>
      {[
        [-2.7, -2.7, 0.5],
        [2.7, -2.7, -0.5],
        [-2.7, 2.7, -0.5],
        [2.7, 2.7, 0.5],
      ].map(([x, z, r], i) => (
        <mesh
          key={i}
          castShadow
          position={[x, 4.3, z]}
          rotation={[0, 0, r as number]}
        >
          <boxGeometry args={[0.9, 0.22, 0.9]} />
          <meshStandardMaterial color="#c98a2e" roughness={0.7} />
        </mesh>
      ))}
      {/* tầng trên: tường kem + cửa sổ tròn 4 mặt */}
      <mesh castShadow receiveShadow position={[0, 5, 0]}>
        <boxGeometry args={[3.2, 1.7, 3.2]} />
        <meshStandardMaterial color="#f6ead2" roughness={0.9} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((ry, i) => (
        <group key={i} position={[0, 5, 0]} rotation={[0, ry, 0]}>
          <mesh position={[0, 0, 1.62]}>
            <torusGeometry args={[0.45, 0.08, 10, 24]} />
            <meshStandardMaterial color="#d9a441" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 1.62]}>
            <circleGeometry args={[0.42, 24]} />
            <meshStandardMaterial
              color="#2e5d4b"
              emissive="#1d3d31"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}
      {/* mái tầng 2 */}
      <mesh castShadow position={[0, 6.15, 0]}>
        <boxGeometry args={[4.4, 0.3, 4.4]} />
        <meshStandardMaterial color="#c98a2e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 6.5, 0]}>
        <boxGeometry args={[4.6, 0.16, 0.4]} />
        <meshStandardMaterial color="#d9a441" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 6.85, 0]}>
        <sphereGeometry args={[0.24, 12, 10]} />
        <meshStandardMaterial
          color="#e8b23a"
          metalness={0.6}
          roughness={0.25}
          emissive="#8a5a10"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Bia tiến sĩ trên lưng rùa (Văn Miếu)                                */
/* ------------------------------------------------------------------ */
function Stele({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* rùa đá */}
      <mesh castShadow position={[0, 0.32, 0]} scale={[1, 0.45, 1.25]}>
        <sphereGeometry args={[0.85, 16, 12]} />
        <meshStandardMaterial color="#a89a78" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0, 0.45, 1.05]}>
        <sphereGeometry args={[0.22, 10, 8]} />
        <meshStandardMaterial color="#a89a78" roughness={0.95} />
      </mesh>
      {/* bia đá */}
      <mesh castShadow position={[0, 1.35, 0]}>
        <boxGeometry args={[0.28, 1.7, 1.15]} />
        <meshStandardMaterial color="#b9ac8d" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[0.34, 0.18, 1.25]} />
        <meshStandardMaterial color="#a89a78" roughness={0.95} />
      </mesh>
      {/* vài dòng chữ khắc */}
      {[0.45, 0, -0.45].map((y, i) => (
        <mesh key={i} position={[0.15, 1.35 + y, 0]}>
          <boxGeometry args={[0.02, 0.06, 0.7]} />
          <meshStandardMaterial color="#8a7a5c" roughness={0.9} />
        </mesh>
      ))}
    </group>
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
  { id: "hs1", robe: "#3a6ea5", start: [-3.6, 6.2], seat: [-2.2, -4.4] },
  { id: "hs2", robe: "#b3372a", start: [3.4, 7.6], seat: [2.2, -4.4] },
  { id: "hs3", robe: "#4d7c3a", start: [0.8, 9.2], seat: [0, -5.9] },
];

function Scene({
  students,
  onRequestGo,
  onRequestBack,
  onArrive,
}: {
  students: StudentInfo[];
  onRequestGo: (id: string) => void;
  onRequestBack: (id: string) => void;
  onArrive: (id: string, where: "seat" | "yard") => void;
}) {
  const router = useRouter();
  const goLessons = () => router.push("/bai-hoc");
  const goSchedule = () => router.push("/lich-hoc");
  const goTea = () => router.push("/tra-dao");

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
        />
      ))}

      <Cloud position={[-14, 13, -10]} scale={1.4} />
      <Cloud position={[10, 15, -14]} scale={1.8} />
      <Cloud position={[16, 12, 6]} scale={1.1} />
      <Cloud position={[-8, 16, 8]} scale={1.2} />

      <OrbitControls
        makeDefault
        target={[0, 2.4, 0]}
        autoRotate
        autoRotateSpeed={0.55}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={9}
        maxDistance={30}
        minPolarAngle={0.2}
        maxPolarAngle={1.48}
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

  const namingStudent = students.find((s) => s.id === namingId) ?? null;
  const idleStudents = students.filter((s) => s.status === "idle");
  const sittingStudents = students.filter((s) => s.status === "sitting");
  const movingStudents = students.filter(
    (s) => s.status === "walking" || s.status === "returning"
  );

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
    setNamingId(null);
  }

  function sendOut(id: string) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "returning", target: "yard" } : s
      )
    );
  }

  function handleArrive(id: string, where: "seat" | "yard") {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: where === "seat" ? "sitting" : "idle" }
          : s
      )
    );
  }

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [17, 10, 17], fov: 42, near: 0.1, far: 120 }}
        gl={{ antialias: true }}
      >
        <Scene
          students={students}
          onRequestGo={openNaming}
          onRequestBack={sendOut}
          onArrive={handleArrive}
        />
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
        </div>

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
