import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { MiniCharacterAsset } from "@/components/MiniCharacterAsset";
import { MiniPersonaStudio } from "@/components/MiniPersonaStudio";

function FallbackMini({ onTap }: { onTap: () => void }) {
  return (
    <group onClick={onTap}>
      <mesh position={[0, 0.52, 0]} scale={[0.92, 0.96, 0.86]}>
        <sphereGeometry args={[0.72, 48, 32]} />
        <meshStandardMaterial color="#e7ad91" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.88, -0.02]} scale={[0.78, 0.48, 0.76]}>
        <sphereGeometry args={[0.72, 40, 24]} />
        <meshStandardMaterial color="#5b4b55" roughness={0.7} />
      </mesh>
      <RoundedBox args={[1.06, 1.1, 0.74]} radius={0.3} smoothness={8} position={[0, -0.48, 0]}>
        <meshStandardMaterial color="#8e83c7" roughness={0.42} />
      </RoundedBox>
      {[-0.23, 0.23].map((x) => (
        <mesh key={x} position={[x, 0.54, 0.66]} scale={[0.11, 0.15, 0.06]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#29232a" roughness={0.24} />
        </mesh>
      ))}
      <RoundedBox args={[0.38, 0.2, 0.5]} radius={0.09} smoothness={5} position={[-0.27, -1.08, 0.08]}>
        <meshStandardMaterial color="#514a58" roughness={0.38} />
      </RoundedBox>
      <RoundedBox args={[0.38, 0.2, 0.5]} radius={0.09} smoothness={5} position={[0.27, -1.08, 0.08]}>
        <meshStandardMaterial color="#514a58" roughness={0.38} />
      </RoundedBox>
    </group>
  );
}

function Room() {
  return (
    <group>
      <RoundedBox args={[5.8, 0.18, 4.4]} radius={0.08} smoothness={3} position={[0, -1.18, 0]}>
        <meshStandardMaterial color="#d4bfa9" roughness={0.84} />
      </RoundedBox>
      <mesh position={[0, 1, -1.45]} scale={[3.5, 2.5, 1]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#f2e6d8" roughness={0.92} />
      </mesh>
      <RoundedBox args={[2.9, 0.35, 1.25]} radius={0.16} smoothness={5} position={[0, -0.88, -0.35]}>
        <meshStandardMaterial color="#b58c76" roughness={0.78} />
      </RoundedBox>
      <RoundedBox args={[2.5, 0.16, 1.02]} radius={0.1} smoothness={5} position={[0, -0.67, -0.35]}>
        <meshStandardMaterial color="#e8cdb9" roughness={0.86} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.72, 0.55]} radius={0.1} smoothness={5} position={[1.7, -0.71, -0.5]}>
        <meshStandardMaterial color="#a7b89e" roughness={0.78} />
      </RoundedBox>
    </group>
  );
}

function Scene({ onTap, modelUrl }: { onTap: () => void; modelUrl: string | null }) {
  return (
    <Canvas
      shadows={{ type: "PCFSoftShadowMap", autoUpdate: true }}
      camera={{ position: [0, 0.15, 6.2], fov: 32 }}
      dpr={[1, 1.5]}
      performance={{ min: 0.6, max: 1, debounce: 300 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
    >
      <color attach="background" args={["#eadfd1"]} />
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[-3.5, 5.5, 4]}
        intensity={3.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[3, 2.4, 2]} intensity={1.5} color="#ffd4ad" />
      <Room />
      <Float speed={1.05} rotationIntensity={0.018} floatIntensity={0.025}>
        {modelUrl ? <MiniCharacterAsset modelUrl={modelUrl} onTap={onTap} /> : <FallbackMini onTap={onTap} />}
      </Float>
      <ContactShadows
        position={[0, -1.16, 0]}
        opacity={0.3}
        scale={5.2}
        blur={2.4}
        far={3.2}
        resolution={256}
      />
      <Environment preset="apartment" environmentIntensity={0.45} />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.92} />
    </Canvas>
  );
}

export function MiniWorld({ children }: { children?: ReactNode }) {
  const messageTimer = useRef<number | null>(null);
  const [message, setMessage] = useState("Oi. Eu sou o seu Mini.");
  const [mood, setMood] = useState(82);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [showStudio, setShowStudio] = useState(false);
  const status = useMemo(() => mood > 90 ? "radiante" : mood > 70 ? "feliz" : "quietinho", [mood]);

  const reactToMini = () => {
    setMood((value) => Math.min(100, value + 3));
    setMessage("Hehe! Você me tocou. ✨");
    if (messageTimer.current) window.clearTimeout(messageTimer.current);
    messageTimer.current = window.setTimeout(
      () => setMessage("Estou gostando de morar aqui."),
      1400,
    );
  };

  return (
    <div className="mini-shell">
      <div className="mini-scene">
        <Scene onTap={reactToMini} modelUrl={modelUrl} />
        <div className="mini-topbar">
          <div>
            <span className="eyebrow">SEU MINI</span>
            <h1>{modelUrl ? "Seu Mini" : "Lumi"}</h1>
          </div>
          <div className="mini-status"><span className="status-dot" /><span>{status}</span><strong>{mood}%</strong></div>
        </div>
        <div className="mini-bubble"><span className="bubble-tail" />{message}</div>
        <div className="mini-actions">
          <button onClick={() => setMessage("Vamos brincar? 🎈")}><span>✦</span>Brincar</button>
          <button onClick={() => setMessage("Ainda estamos nos conhecendo. 💜")}><span>◌</span>Conversar</button>
          <button onClick={() => setShowStudio(true)}><span>◈</span>Personalizar</button>
        </div>
        {showStudio && (
          <div className="mini-modal-backdrop" onClick={() => setShowStudio(false)}>
            <div className="mini-modal" onClick={(event) => event.stopPropagation()}>
              <button className="mini-modal-close" type="button" aria-label="Fechar" onClick={() => setShowStudio(false)}>×</button>
              <MiniPersonaStudio
                onModelReady={(url) => {
                  setModelUrl(url);
                  setMessage("Agora sim. Esse Mini é você. ✨");
                  setShowStudio(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
