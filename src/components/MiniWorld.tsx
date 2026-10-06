import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

function MiniCharacter({ onTap }: { onTap: () => void }) {
  const group = useRef<THREE.Group>(null);
  const [blink, setBlink] = useState(false);
  const [pulse, setPulse] = useState(0);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 1.55) * 0.025;
    group.current.rotation.y = Math.sin(t * 0.5) * 0.045;
    group.current.rotation.x = Math.sin(t * 0.7) * 0.008;
  });

  const react = () => {
    onTap();
    setPulse((value) => value + 1);
    setBlink(true);
    window.setTimeout(() => setBlink(false), 120);
  };

  return (
    <group ref={group} position={[0, -0.12, 0]} onClick={react}>
      <Float speed={1.15} rotationIntensity={0.025} floatIntensity={0.055}>
        {/* soft toy body */}
        <RoundedBox args={[1.02, 1.08, 0.72]} radius={0.3} smoothness={8} position={[0, -0.42, 0]}>
          <meshStandardMaterial color="#bfc7d9" roughness={0.48} metalness={0.02} />
        </RoundedBox>

        {/* hoodie / collar */}
        <RoundedBox args={[1.06, 0.46, 0.76]} radius={0.18} smoothness={7} position={[0, -0.62, 0.02]}>
          <meshStandardMaterial color="#7773b7" roughness={0.34} />
        </RoundedBox>

        {/* head */}
        <mesh position={[0, 0.52, 0]} scale={[0.92, 0.96, 0.86]} castShadow receiveShadow>
          <sphereGeometry args={[0.72, 48, 32]} />
          <meshStandardMaterial color="#e7ad91" roughness={0.5} />
        </mesh>

        {/* soft hair cap */}
        <mesh position={[0, 0.88, -0.02]} scale={[0.78, 0.48, 0.76]} castShadow>
          <sphereGeometry args={[0.72, 40, 24]} />
          <meshStandardMaterial color="#5b4b55" roughness={0.7} />
        </mesh>

        {/* ears */}
        <mesh position={[-0.68, 0.5, 0]} scale={[0.22, 0.27, 0.18]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#dfa187" roughness={0.52} />
        </mesh>
        <mesh position={[0.68, 0.5, 0]} scale={[0.22, 0.27, 0.18]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#dfa187" roughness={0.52} />
        </mesh>

        {/* eyes */}
        {[-0.23, 0.23].map((x) => (
          <group key={x} position={[x, 0.54, 0.66]} scale={1 + (pulse % 2 === 0 ? 0 : 0.025)}>
            <mesh scale={[0.105, blink ? 0.012 : 0.14, 0.055]}>
              <sphereGeometry args={[1, 24, 16]} />
              <meshStandardMaterial color="#29232a" roughness={0.24} />
            </mesh>
            <mesh position={[0.028, 0.055, 0.045]} scale={0.028}>
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color="#fffaf4" roughness={0.16} />
            </mesh>
          </group>
        ))}

        {/* tiny nose + smile */}
        <mesh position={[0, 0.36, 0.7]} scale={[0.035, 0.028, 0.045]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#c87d72" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.27, 0.69]} rotation={[Math.PI / 2, 0, 0]} scale={[0.11, 0.045, 0.025]}>
          <torusGeometry args={[1, 0.35, 10, 24, Math.PI]} />
          <meshStandardMaterial color="#9d5960" roughness={0.5} />
        </mesh>

        {/* arms */}
        <mesh position={[-0.67, -0.42, 0]} rotation={[0, 0, -0.22]} scale={[0.42, 0.18, 0.2]}>
          <sphereGeometry args={[1, 28, 20]} />
          <meshStandardMaterial color="#bfc7d9" roughness={0.48} />
        </mesh>
        <mesh position={[0.67, -0.42, 0]} rotation={[0, 0, 0.22]} scale={[0.42, 0.18, 0.2]}>
          <sphereGeometry args={[1, 28, 20]} />
          <meshStandardMaterial color="#bfc7d9" roughness={0.48} />
        </mesh>

        {/* shoes */}
        <RoundedBox args={[0.38, 0.2, 0.5]} radius={0.09} smoothness={5} position={[-0.27, -1.0, 0.08]}>
          <meshStandardMaterial color="#514a58" roughness={0.38} />
        </RoundedBox>
        <RoundedBox args={[0.38, 0.2, 0.5]} radius={0.09} smoothness={5} position={[0.27, -1.0, 0.08]}>
          <meshStandardMaterial color="#514a58" roughness={0.38} />
        </RoundedBox>
      </Float>
    </group>
  );
}

function Room() {
  return (
    <group>
      <RoundedBox args={[5.8, 0.18, 4.4]} radius={0.08} smoothness={3} position={[0, -1.18, 0]} receiveShadow>
        <meshStandardMaterial color="#d4bfa9" roughness={0.84} />
      </RoundedBox>
      <mesh position={[0, 1.0, -1.45]} scale={[3.5, 2.5, 1]} receiveShadow>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#f2e6d8" roughness={0.92} />
      </mesh>
      <RoundedBox args={[2.9, 0.35, 1.25]} radius={0.16} smoothness={5} position={[0, -0.88, -0.35]} castShadow>
        <meshStandardMaterial color="#b58c76" roughness={0.78} />
      </RoundedBox>
      <RoundedBox args={[2.5, 0.16, 1.02]} radius={0.1} smoothness={5} position={[0, -0.67, -0.35]}>
        <meshStandardMaterial color="#e8cdb9" roughness={0.86} />
      </RoundedBox>
      <RoundedBox args={[0.72, 0.38, 0.48]} radius={0.12} smoothness={5} position={[-1.65, -0.79, -0.5]} castShadow>
        <meshStandardMaterial color="#d7a1a1" roughness={0.82} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.72, 0.55]} radius={0.1} smoothness={5} position={[1.7, -0.71, -0.5]} castShadow>
        <meshStandardMaterial color="#a7b89e" roughness={0.78} />
      </RoundedBox>
    </group>
  );
}

function Scene({ onTap }: { onTap: () => void }) {
  return (
    <Canvas shadows camera={{ position: [0, 0.15, 6.2], fov: 32 }} dpr={[1, 2]} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <color attach="background" args={["#eadfd1"]} />
      <ambientLight intensity={1.05} />
      <directionalLight position={[-3.5, 5.5, 4]} intensity={4.2} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.00015} />
      <pointLight position={[3, 2.4, 2]} intensity={2.2} color="#ffd4ad" />
      <pointLight position={[-3, 1.5, 1]} intensity={1.45} color="#c9d8ff" />
      <Room />
      <MiniCharacter onTap={onTap} />
      <ContactShadows position={[0, -1.16, 0]} opacity={0.42} scale={5.2} blur={2.8} far={3.2} />
      <Environment preset="apartment" />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.92} />
    </Canvas>
  );
}

export function MiniWorld({ children }: { children?: ReactNode }) {
  const [message, setMessage] = useState("Oi. Eu sou o seu Mini.");
  const [mood, setMood] = useState(82);
  const status = useMemo(() => mood > 90 ? "radiante" : mood > 70 ? "feliz" : "quietinho", [mood]);

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
          <div className="mini-status"><span className="status-dot" /> <span>{status}</span><strong>{mood}%</strong></div>
        </div>
        <div className="mini-bubble"><span className="bubble-tail" />{message}</div>
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
