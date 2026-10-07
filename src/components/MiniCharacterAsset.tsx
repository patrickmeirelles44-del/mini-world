import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type MiniAnimation =
  | "idle" | "blink" | "wave" | "walk" | "run" | "jump" | "land"
  | "sit" | "stand" | "happy" | "sad" | "curious" | "celebrate"
  | "interact" | "lookAtCamera";

export type MiniCustomization = {
  skinTone?: string;
  hairColor?: string;
  outfitColor?: string;
  shoeColor?: string;
};

const ALIASES: Record<MiniAnimation, string[]> = {
  idle: ["idle", "Idle", "breathing", "Breathing"], blink: ["blink", "Blink"],
  wave: ["wave", "Wave"], walk: ["walk", "Walk"], run: ["run", "Run"],
  jump: ["jump", "Jump"], land: ["land", "Land"], sit: ["sit", "Sit"],
  stand: ["stand", "Stand"], happy: ["happy", "Happy"], sad: ["sad", "Sad"],
  curious: ["curious", "Curious"], celebrate: ["celebrate", "Celebrate"],
  interact: ["interact", "Interact"],
  lookAtCamera: ["lookAtCamera", "LookAtCamera", "look_at_camera"],
};

function findAction(actions: Record<string, THREE.AnimationAction | null>, name: MiniAnimation) {
  for (const alias of ALIASES[name]) if (actions[alias]) return actions[alias];
  return actions["idle"] ?? actions["Idle"] ?? null;
}

function recolor(root: THREE.Object3D, tokens: string[], color?: string) {
  if (!color) return;
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || !tokens.some((t) => object.name.toLowerCase().includes(t))) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    object.material = materials.map((material) => {
      const clone = material.clone();
      if ("color" in clone && clone.color instanceof THREE.Color) clone.color.set(color);
      return clone;
    });
  });
}

export function MiniCharacterAsset({
  onTap, animation = "idle", customization = {}, modelUrl = "/mini/mini-official.glb",
}: {
  onTap?: () => void;
  animation?: MiniAnimation;
  customization?: MiniCustomization;
  modelUrl?: string;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!group.current) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = size.y > 0 ? 2.55 / size.y : 1;
    group.current.scale.setScalar(scale);
    group.current.position.set(-center.x * scale, -1.15 - center.y * scale, -center.z * scale);
  }, [scene]);

  useEffect(() => {
    const action = findAction(actions, animation);
    if (!action) return;
    action.reset().fadeIn(0.2).play();
    return () => { action.fadeOut(0.2); };
  }, [actions, animation]);

  useEffect(() => {
    recolor(scene, ["skin", "face", "body"], customization.skinTone);
    recolor(scene, ["hair"], customization.hairColor);
    recolor(scene, ["outfit", "hoodie", "shirt", "clothes"], customization.outfitColor);
    recolor(scene, ["shoe", "sneaker"], customization.shoeColor);
  }, [scene, customization]);

  return (
    <group ref={group} position={[0, -1, 0]} scale={1.45} onClick={() => onTap?.()}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/mini/mini-official.glb");
