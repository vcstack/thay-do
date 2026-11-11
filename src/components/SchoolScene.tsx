"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";

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
/* Đèn lồng đỏ                                                          */
/* ------------------------------------------------------------------ */
function Lantern({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
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
            color="#d93b2b"
            emissive="#a11d10"
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
  const leaf = blossom ? "#f2a7b8" : "#5d9b4a";
  const leaf2 = blossom ? "#f7c3d0" : "#7cb35a";
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
/* Cổng trường (paifang)                                               */
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
      {[-2.4, 2.4].map((x) => (
        <mesh key={x} castShadow position={[x, 2.5, 0]}>
          <cylinderGeometry args={[0.3, 0.36, 5, 12]} />
          <meshStandardMaterial
            color={hover ? "#c8402a" : "#a32e22"}
            roughness={0.6}
          />
        </mesh>
      ))}
      {/* xà ngang */}
      <mesh castShadow position={[0, 4.4, 0]}>
        <boxGeometry args={[6.2, 0.4, 0.5]} />
        <meshStandardMaterial color="#8f2a20" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 3.5, 0]}>
        <boxGeometry args={[5.4, 0.3, 0.4]} />
        <meshStandardMaterial color="#b3372a" roughness={0.6} />
      </mesh>
      {/* mái cổng */}
      <mesh castShadow position={[0, 5.15, 0]}>
        <boxGeometry args={[7, 0.35, 1.6]} />
        <meshStandardMaterial color="#2e5d4b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[7.2, 0.18, 0.5]} />
        <meshStandardMaterial color="#d9a441" metalness={0.4} roughness={0.4} />
      </mesh>
      <Lantern position={[-1.3, 3.1, 0]} scale={0.85} />
      <Lantern position={[1.3, 3.1, 0]} scale={0.85} />
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

      {/* thân nhà */}
      <mesh castShadow receiveShadow position={[0, 2.6, 0]}>
        <boxGeometry args={[10, 4, 6.5]} />
        <meshStandardMaterial
          color={hover ? "#fbf3da" : "#f6ead2"}
          roughness={0.9}
        />
      </mesh>

      {/* cột đỏ mặt tiền */}
      {[-4.6, -1.6, 1.6, 4.6].map((x) => (
        <mesh key={x} castShadow position={[x, 2.6, 3.3]}>
          <cylinderGeometry args={[0.26, 0.3, 4, 12]} />
          <meshStandardMaterial color="#b3372a" roughness={0.55} />
        </mesh>
      ))}

      {/* cửa chính */}
      <mesh position={[0, 2.1, 3.28]}>
        <boxGeometry args={[2.4, 3.4, 0.16]} />
        <meshStandardMaterial color="#8f2a20" roughness={0.6} />
      </mesh>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 2.1, 3.38]}>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial color="#d9a441" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}

      {/* cửa sổ sáng đèn */}
      {[-3.1, 3.1].map((x) => (
        <group key={x} position={[x, 2.7, 3.28]}>
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
      <mesh position={[0, 4.15, 3.36]}>
        <planeGeometry args={[3.6, 1.12]} />
        <meshStandardMaterial map={sign} roughness={0.7} />
      </mesh>

      {/* mái tầng 1 */}
      <mesh castShadow position={[0, 5.05, 0]}>
        <boxGeometry args={[12.6, 0.5, 8.6]} />
        <meshStandardMaterial color="#2e5d4b" roughness={0.7} />
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
          <meshStandardMaterial color="#2e5d4b" roughness={0.7} />
        </mesh>
      ))}
      {/* mái tầng 2 */}
      <mesh castShadow position={[0, 6.15, 0]}>
        <boxGeometry args={[8.4, 0.45, 5.6]} />
        <meshStandardMaterial color="#356b57" roughness={0.7} />
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
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Cảnh chính                                                          */
/* ------------------------------------------------------------------ */
function Scene() {
  const router = useRouter();
  const goLessons = () => router.push("/bai-hoc");
  const goSchedule = () => router.push("/lich-hoc");

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
      <SideHouse position={[-10.5, 0, -3]} rotationY={0.35} />
      <SideHouse position={[10.5, 0, -4]} rotationY={-0.4} />

      <Tree position={[-7.5, 0, 4.5]} scale={1.15} />
      <Tree position={[7.8, 0, 6.5]} scale={0.95} />
      <Tree position={[-12, 0, -7]} scale={1.3} />
      <Tree position={[12.5, 0, -8]} scale={1.1} />
      <Tree position={[-5.5, 0, -9]} scale={1} />
      <Tree position={[6.2, 0, -8.5]} scale={1.25} blossom />
      <Tree position={[-13, 0, 3]} scale={1} blossom />

      <StoneLantern position={[-4.6, 0, 5.6]} />
      <StoneLantern position={[4.9, 0, 5.2]} />
      <Bench position={[-6.8, 0, 7.2]} rotationY={0.5} />
      <Bench position={[6.4, 0, 8]} rotationY={-0.6} />
      <Pond />

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
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [17, 10, 17], fov: 42, near: 0.1, far: 120 }}
      gl={{ antialias: true }}
    >
      <Scene />
    </Canvas>
  );
}
