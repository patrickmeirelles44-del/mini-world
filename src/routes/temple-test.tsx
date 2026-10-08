import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { motion } from "motion/react";
import { useRef } from "react";
import * as THREE from "three";
import { createFileRoute } from "@tanstack/react-router";

function RotatingCore() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.8;
    group.current.rotation.x = Math.sin(performance.now() * 0.0007) * 0.18;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.05, 2]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.75} roughness={0.18} emissive="#2e1065" emissiveIntensity={1.4} />
      </mesh>
      <mesh scale={1.45}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.28} />
      </mesh>
      <pointLight color="#a78bfa" intensity={18} distance={5} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#05030d"]} />
      <fog attach="fog" args={["#05030d", 5, 12]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 4]} intensity={2.5} />
      <pointLight position={[-3, 1, 2]} color="#22d3ee" intensity={14} distance={8} />
      <pointLight position={[3, -1, 1]} color="#ec4899" intensity={12} distance={7} />
      <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.7}>
        <RotatingCore />
      </Float>
      <Sparkles count={120} scale={[7, 5, 7]} size={2.2} speed={0.35} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#090613" metalness={0.5} roughness={0.65} />
      </mesh>
    </>
  );
}

function TempleTest() {
  return (
    <main style={{ minHeight: "100vh", background: "#05030d", color: "#fff", fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden" }}>
      <header style={{ position: "absolute", zIndex: 5, top: 24, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.28em", opacity: 0.55 }}>FORGE / LAB</div>
          <h1 style={{ margin: "6px 0 0", fontSize: 26 }}>Temple 3D Test</h1>
        </div>
        <div style={{ padding: "8px 12px", border: "1px solid rgba(167,139,250,.35)", borderRadius: 999, fontSize: 12, color: "#c4b5fd" }}>R3F + THREE + MOTION</div>
      </header>

      <section style={{ position: "relative", height: "100vh", minHeight: 680 }}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.3, 5.8], fov: 42 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          fallback={<div style={{ paddingTop: 180, textAlign: "center", color: "#fda4af" }}>WebGL não disponível neste dispositivo.</div>}
        >
          <Scene />
        </Canvas>

        <div style={{ position: "absolute", left: "50%", bottom: 46, transform: "translateX(-50%)", width: "min(760px, calc(100% - 32px))", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {["3D Core", "Lighting", "Particles"].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.03 }}
              style={{ padding: "14px 16px", borderRadius: 16, background: "rgba(12,8,25,.72)", border: "1px solid rgba(167,139,250,.22)", backdropFilter: "blur(12px)", textAlign: "center" }}
            >
              <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: "0.14em" }}>TEST {i + 1}</div>
              <div style={{ marginTop: 5, fontWeight: 700 }}>{label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

export const Route = createFileRoute("/temple-test")({ component: TempleTest });
