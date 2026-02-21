'use client'

import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Sky, OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const CAR_SPEED = 0.12;
const CAR_TURN  = 0.045;
const FRICTION  = 0.88;
const GRAVITY   = -0.015;
const TERRAIN_SIZE = 200;
const TERRAIN_SEGS = 80;

// ─── TERRAIN GENERATOR ───────────────────────────────────────────────────────
function createTerrainGeometry() {
  const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGS, TERRAIN_SEGS);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const count = pos.count;

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const dist = Math.sqrt(x * x + z * z);
    // flat central area + rolling hills outside
    if (dist > 20) {
      const h =
        Math.sin(x * 0.08) * 2.5 +
        Math.cos(z * 0.07) * 2.0 +
        Math.sin((x + z) * 0.05) * 1.5 +
        Math.sin(x * 0.2) * 0.5 +
        Math.cos(z * 0.15) * 0.5;
      pos.setY(i, h);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

// ─── HEIGHT SAMPLER ──────────────────────────────────────────────────────────
function sampleHeight(x, z) {
  const dist = Math.sqrt(x * x + z * z);
  if (dist <= 20) return 0;
  return (
    Math.sin(x * 0.08) * 2.5 +
    Math.cos(z * 0.07) * 2.0 +
    Math.sin((x + z) * 0.05) * 1.5 +
    Math.sin(x * 0.2) * 0.5 +
    Math.cos(z * 0.15) * 0.5
  );
}

// ─── TERRAIN ─────────────────────────────────────────────────────────────────
const terrainGeo = createTerrainGeometry();

function Terrain() {
  return (
    <mesh geometry={terrainGeo} receiveShadow>
      <meshStandardMaterial
        color="#3a6b35"
        roughness={0.9}
        metalness={0.0}
        wireframe={false}
      />
    </mesh>
  );
}

// ─── ROAD ─────────────────────────────────────────────────────────────────────
function Road() {
  return (
    <>
      {/* straight road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[8, 80]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* crossing road */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[8, 80]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#444" roughness={0.8} />
      </mesh>
    </>
  );
}

// ─── TREES ────────────────────────────────────────────────────────────────────
function Tree({ x, z }) {
  const y = sampleHeight(x, z);
  const h = 2 + Math.random() * 2;
  return (
    <group position={[x, y, z]}>
      <mesh castShadow position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.18, 0.25, h, 6]} />
        <meshStandardMaterial color="#5c3d1e" roughness={1} />
      </mesh>
      <mesh castShadow position={[0, h + 0.8, 0]}>
        <coneGeometry args={[1.1, 2.2, 7]} />
        <meshStandardMaterial color="#1a5c2a" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, h + 1.8, 0]}>
        <coneGeometry args={[0.8, 1.8, 7]} />
        <meshStandardMaterial color="#22783a" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Trees() {
  const positions = useRef(
    Array.from({ length: 120 }, () => {
      let x, z;
      do {
        x = (Math.random() - 0.5) * 180;
        z = (Math.random() - 0.5) * 180;
      } while (Math.sqrt(x * x + z * z) < 22 || (Math.abs(x) < 5 && Math.abs(z) < 45) || (Math.abs(z) < 5 && Math.abs(x) < 45));
      return { x, z };
    })
  );
  return (
    <>
      {positions.current.map((p, i) => (
        <Tree key={i} x={p.x} z={p.z} />
      ))}
    </>
  );
}

// ─── BUILDINGS ────────────────────────────────────────────────────────────────
function Buildings() {
  const blocks = [
    { x: 20, z: 20, w: 6, h: 10, d: 6, color: "#aaa" },
    { x: -22, z: 18, w: 5, h: 7, d: 5, color: "#bbb" },
    { x: 18, z: -20, w: 7, h: 14, d: 7, color: "#999" },
    { x: -20, z: -22, w: 4, h: 8, d: 8, color: "#c8a87d" },
  ];
  return (
    <>
      {blocks.map((b, i) => {
        const y = sampleHeight(b.x, b.z);
        return (
          <mesh key={i} castShadow receiveShadow position={[b.x, y + b.h / 2, b.z]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.6} metalness={0.1} />
          </mesh>
        );
      })}
    </>
  );
}

// ─── CAR MODEL (procedural) ───────────────────────────────────────────────────
function CarModel() {
  return (
    <group>
      {/* body */}
      <mesh castShadow position={[0, 0.32, 0]}>
        <boxGeometry args={[1.8, 0.5, 4]} />
        <meshStandardMaterial color="#c0392b" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* cabin */}
      <mesh castShadow position={[0, 0.75, 0.2]}>
        <boxGeometry args={[1.4, 0.5, 2.2]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* windshield */}
      <mesh position={[0, 0.78, 1.22]} rotation={[0.35, 0, 0]}>
        <planeGeometry args={[1.32, 0.52]} />
        <meshStandardMaterial color="#88ccff" opacity={0.5} transparent roughness={0.1} metalness={0.3} />
      </mesh>
      {/* rear window */}
      <mesh position={[0, 0.78, -1.18]} rotation={[-0.35, 0, 0]}>
        <planeGeometry args={[1.32, 0.52]} />
        <meshStandardMaterial color="#88ccff" opacity={0.5} transparent roughness={0.1} metalness={0.3} />
      </mesh>
      {/* wheels */}
      {[
        [0.95, 0, 1.3], [-0.95, 0, 1.3],
        [0.95, 0, -1.3], [-0.95, 0, -1.3],
      ].map((pos, i) => (
        <group key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 0.24, 8]} />
            <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      {/* headlights */}
      <mesh position={[0.55, 0.35, 2.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffaa" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.55, 0.35, 2.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffaa" emissiveIntensity={1} />
      </mesh>
      {/* taillights */}
      <mesh position={[0.55, 0.35, -2.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff0000" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.55, 0.35, -2.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff0000" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

// ─── CAR CONTROLLER ──────────────────────────────────────────────────────────
function Car({ keysRef, onSpeedUpdate }) {
  const carRef = useRef();
  const vel = useRef(new THREE.Vector3());
  const yVel = useRef(0);
  const dir = useRef(0); // yaw angle
  const onGround = useRef(true);

  useFrame((state, delta) => {
    if (!carRef.current) return;
    const keys = keysRef.current;
    const car = carRef.current;

    // drive
    let accel = 0;
    if (keys["ArrowUp"] || keys["w"] || keys["W"]) accel = CAR_SPEED;
    if (keys["ArrowDown"] || keys["s"] || keys["S"]) accel = -CAR_SPEED * 0.6;

    // turn (only when moving)
    const speed = vel.current.length();
    if (speed > 0.01) {
      if (keys["ArrowLeft"] || keys["a"] || keys["A"]) dir.current += CAR_TURN * (accel < 0 ? -1 : 1);
      if (keys["ArrowRight"] || keys["d"] || keys["D"]) dir.current -= CAR_TURN * (accel < 0 ? -1 : 1);
    }

    const forward = new THREE.Vector3(Math.sin(dir.current), 0, Math.cos(dir.current));
    vel.current.addScaledVector(forward, accel);
    vel.current.multiplyScalar(FRICTION);

    // gravity & ground
    const groundY = sampleHeight(car.position.x, car.position.z);
    yVel.current += GRAVITY;
    car.position.y += yVel.current;
    if (car.position.y <= groundY + 0.32) {
      car.position.y = groundY + 0.32;
      yVel.current = 0;
      onGround.current = true;
    } else {
      onGround.current = false;
    }

    // move
    car.position.x += vel.current.x;
    car.position.z += vel.current.z;

    // clamp to terrain bounds
    car.position.x = THREE.MathUtils.clamp(car.position.x, -95, 95);
    car.position.z = THREE.MathUtils.clamp(car.position.z, -95, 95);

    // rotation
    car.rotation.y = dir.current;

    // ground tilt
    const nx = sampleHeight(car.position.x + 0.5, car.position.z) - sampleHeight(car.position.x - 0.5, car.position.z);
    const nz = sampleHeight(car.position.x, car.position.z + 0.5) - sampleHeight(car.position.x, car.position.z - 0.5);
    car.rotation.z = THREE.MathUtils.lerp(car.rotation.z, -nx * 0.5, 0.15);
    car.rotation.x = THREE.MathUtils.lerp(car.rotation.x, nz * 0.5, 0.15);

    // camera follow
    const camOffset = new THREE.Vector3(
      -Math.sin(dir.current) * 10,
      4.5,
      -Math.cos(dir.current) * 10
    );
    state.camera.position.lerp(car.position.clone().add(camOffset), 0.1);
    state.camera.lookAt(car.position.clone().add(new THREE.Vector3(0, 1.2, 0)));

    onSpeedUpdate(Math.round(speed * 200));
  });

  return (
    <group ref={carRef} position={[0, 0.32, 0]}>
      <CarModel />
    </group>
  );
}

// ─── HUD ─────────────────────────────────────────────────────────────────────
function HUD({ speed }) {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      padding: "20px 28px", pointerEvents: "none",
      background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
    }}>
      {/* speedometer */}
      <div style={{
        fontFamily: "'Courier New', monospace",
        color: "#00ff88",
        textShadow: "0 0 10px #00ff88",
        fontSize: 13,
        letterSpacing: 2,
      }}>
        <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>VELOCIDAD</div>
        <div style={{ fontSize: 38, fontWeight: "bold", lineHeight: 1 }}>{speed}</div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>km/h</div>
      </div>

      {/* controls */}
      <div style={{
        fontFamily: "'Courier New', monospace",
        color: "rgba(255,255,255,0.7)",
        fontSize: 12,
        textAlign: "right",
        lineHeight: 1.8,
      }}>
        <div><span style={{ color: "#fff", background: "rgba(255,255,255,0.15)", borderRadius: 3, padding: "1px 6px" }}>↑ W</span> Acelerar</div>
        <div><span style={{ color: "#fff", background: "rgba(255,255,255,0.15)", borderRadius: 3, padding: "1px 6px" }}>↓ S</span> Frenar</div>
        <div><span style={{ color: "#fff", background: "rgba(255,255,255,0.15)", borderRadius: 3, padding: "1px 6px" }}>← A  D →</span> Girar</div>
      </div>
    </div>
  );
}

// ─── TITLE OVERLAY ───────────────────────────────────────────────────────────
function TitleOverlay() {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const t = setTimeout(() => setVisible(false), 3500); return () => clearTimeout(t); }, []);
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", pointerEvents: "none",
      background: "rgba(0,0,0,0.4)",
      animation: "fadeOut 1s 2.5s forwards",
    }}>
      <style>{`@keyframes fadeOut { to { opacity: 0; } }`}</style>
      <div style={{
        fontFamily: "'Courier New', monospace",
        color: "#00ff88",
        textShadow: "0 0 20px #00ff88",
        fontSize: 48,
        fontWeight: "bold",
        letterSpacing: 8,
      }}>DRIVE</div>
      <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: "monospace", marginTop: 10, letterSpacing: 3, fontSize: 13 }}>
        USA LAS FLECHAS O WASD
      </div>
    </div>
  );
}

// ─── SCENE LIGHTS ────────────────────────────────────────────────────────────
function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        position={[50, 80, 30]}
        intensity={1.8}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />
      <hemisphereLight skyColor="#87ceeb" groundColor="#3a6b35" intensity={0.4} />
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const keysRef = useRef({});
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const down = (e) => { keysRef.current[e.key] = true; };
    const up = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  const handleSpeed = useCallback((s) => setSpeed(s), []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#87ceeb", overflow: "hidden" }}>
      <Canvas
        shadows
        camera={{ position: [0, 6, -12], fov: 65, near: 0.1, far: 2000 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Sky sunPosition={[100, 30, 100]} turbidity={4} rayleigh={0.5} />
        <Lights />
        <Terrain />
        <Road />
        <Trees />
        <Buildings />
        <Car keysRef={keysRef} onSpeedUpdate={handleSpeed} />
        {/* fog */}
        <fog attach="fog" args={["#c9dff0", 60, 220]} />
      </Canvas>

      <HUD speed={speed} />
      <TitleOverlay />
    </div>
  );
}