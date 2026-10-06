import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

function MiniCharacter({ onTap }: { onTap: () => void }) {
  const group = useRef<THREE.Group>(null);
  const [blink, setBlink] = useState(false);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 1.7) * 0.025;
    group.current.rotation.y = Math.sin(t * 0.55) * 0.06;
    group.current.rotation.z = Math.sin(t * 0.8) * 0.012;
  });

  const triggerBlink = () => {
    setBlink(true);
    window.setTimeout(() => setBlink(false), 130);
  };

  return (
    <group ref={group} position={[0, -0.25, 0]} onClick={() => { onTap(); triggerBlink(); }}>
      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.08}>
        <group>
          <RoundedBox args={[0.9, 0.95, 0.62]} radius={0.24} smoothness={5} position={[0, 0.05, 0]}>
            <meshStandardMaterial color="#d88964" roughness={0.48} />
          </RoundedBox>

          <RoundedBox args={[1.02, 0.48, 0.68]} radius={0.16} smoothness={5} position={[0, -0.47, 0]}>
            <meshStandardMaterial color="#7c6ee6" roughness={0.34} />
          </RoundedBox>

          <RoundedBox args={[0.5, 0.16, 0.14]} radius={0.06} smoothness={3} position={[0, -0.38, 0.35]}>
            <meshStandardMaterial color="#f1d3a8" roughness={0.6} />
          </RoundedBox>

          <mesh position={[-0.17, 0.11, 0.31]} scale={[0.055, blink ? 0.008 : 0.075, 0.04]}>
            <sphereGeometry args={[1, 20, 12]} />
            <meshStandardMaterial color="#241d28" roughness={0.25} />
          </mesh>
          <mesh position={[0.17, 0.11, 0.31]} scale={[0.055, blink ? 0.008 : 0.075, 0.04]}>
            <sphereGeometry args={[1, 20, 12]} />
            <meshStandardMaterial color="#241d28" roughness={0.25} />
          </mesh>

          <mesh position={[-0.17, 0.13, 0.35]} scale={0.014}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh position={[0.17, 0.13, 0.35]} scale={0.014}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>

          <mesh position={[0, -0.02, 0.34]} rotation={[Math.PI / 2, 0, 0]} scale={[0.055, 0.035, 0.055]}>
            <sphereGeometry args={[1, 20, 12]} />
            <meshStandardMaterial color="#a94e55" roughness={0.45} />
          </mesh>

          <mesh position={[-0.54, -0.08, 0]} rotation={[0, 0, -0.18]} scale={[0.42, 0.16, 0.18]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color="#d88964" roughness={0.48} />
          </mesh>
          <mesh position={[0.54, -0.08, 0]} rotation={[0, 0, 0.18]} scale={[0.42, 0.16, 0.18]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color="#d88964" roughness={0.48} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function Room() {
  return (
    <group>
      <RoundedBox args={[5.8, 0.18, 4.4]} radius={0.08} smoothness={3} position={[0, -1.02, 0]}>
        <meshStandardMaterial color="#d7c2ad" roughness={0.82} />
      </RoundedBox>
      <mesh position={[0, 1.1, -1.45]} scale={[3.5, 2.5, 1]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#f1e4d5" roughness={0.9} />
      </mesh>
      <RoundedBox args={[2.9, 0.35, 1.25]} radius={0.16} smoothness={4} position={[0, -0.72, -0.35]}>
        <meshStandardMaterial color="#b58d78" roughness={0.76} />
      </RoundedBox>
      <RoundedBox args={[2.5, 0.16, 1.02]} radius={0.1} smoothness={4} position={[0, -0.52, -0.35]}>
        <meshStandardMaterial color="#e8cdb9" roughness={0.86} />
      </RoundedBox>
      <RoundedBox args={[0.72, 0.38, 0.48]} radius={0.12} smoothness={4} position={[-1.65, -0.64, -0.5]}>
        <meshStandardMaterial color="#d9a6a6" roughness={0.82} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.72, 0.55]} radius={0.1} smoothness={4} position={[1.7, -0.56, -0.5]}>
        <meshStandardMaterial color="#a8b89c" roughness={0.78} />
      </RoundedBox>
    </group>
  );
}

function Scene({ onTap }: { onTap: () => void }) {
  return (
    <Canvas camera={{ position: [0, 0.35, 6.2], fov: 34 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#e9dccb"]} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[-3, 5, 4]} intensity={3.2} castShadow />
      <pointLight position={[3, 1.8, 2]} intensity={2} color="#ffd7b0" />
      <Room />
      <MiniCharacter onTap={onTap} />
      <ContactShadows position={[0, -1.0, 0]} opacity={0.3} scale={4.2} blur={2.5} far={2.5} />
      <Environment preset="apartment" />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.45} maxPolarAngle={Math.PI / 1.95} />
    </Canvas>
  );
}

export function MiniWorld({ children }: { children?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("Oi. Eu sou o seu Mini.");
  const [mood, setMood] = useState(82);

  if (!mounted) {
    setTimeout(() => setMounted(true), 0);
    return <div className="mini-loading">Preparando seu pequeno mundo…</div>;
  }

  const reactToMini = () => {
    setMood((value) => Math.min(100, value + 3));
    setMessage("Hehe! Você me tocou. ✨");
    window.setTimeout(() => setMessage("Estou gostando de morar aqui."), 1400);
  };

  return (
    <div className="mini-shell">
      <div className="mini-scene">
        <Scene onTap={reactToMini} />
        <div className="mini-topbar">
          <div>
            <span className="eyebrow">SEU MINI</span>
            <h1>Lumi</h1>
          </div>
          <div className="mini-status">
            <span>☀️</span>
            <span>{mood}%</span>
          </div>
        </div>
        <div className="mini-bubble">{message}</div>
        <div className="mini-actions">
          <button onClick={() => setMessage("Vamos brincar? 🎈")}><span>✦</span>Brincar</button>
          <button onClick={() => setMessage("Ainda estamos nos conhecendo. 💜")}><span>◌</span>Conversar</button>
          <button onClick={() => setMessage("Em breve você vai poder me personalizar.")}><span>◈</span>Personalizar</button>
        </div>
      </div>
      {children}
    </div>
  );
}
