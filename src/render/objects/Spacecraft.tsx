import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import * as THREE from "three";
import { useSimulationEngine } from "../hooks/useSimulationEngine";

interface Props {
  type: "near" | "far";
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function mapRedshiftToColor(z: number, color: THREE.Color) {
  if (!Number.isFinite(z)) {
    color.setRGB(0.2, 0, 0);
    return;
  }

  const clamped = Math.min(z, 5);

  const hue = clamp(0.6 - (clamped - 1) * 0.15, 0, 0.6);
  const saturation = clamp(0.9 - (clamped - 1) * 0.2, 0.3, 0.9);
  const lightness = clamp(0.65 - (clamped - 1) * 0.25, 0.2, 0.65);

  color.setHSL(hue, saturation, lightness);
}

export default function Spacecraft({ type }: Props) {
  const engine = useSimulationEngine();

  const groupRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);

  const bodyMaterialRef = useRef<MeshStandardMaterial>(null);
  const noseMaterialRef = useRef<MeshStandardMaterial>(null);
  const ringMaterialRef = useRef<MeshStandardMaterial>(null);

  const [isDragging, setIsDragging] = useState(false);
  const reusableColor = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (
      !groupRef.current ||
      !bodyMaterialRef.current ||
      !noseMaterialRef.current ||
      !ringMaterialRef.current
    ) return;

    const state = engine.getState();

    const spacecraft =
      type === "near"
        ? state.spacecraftNear
        : state.spacecraftFar;

    const pos = spacecraft.position;

    const spag =
      type === "near"
        ? state.effects.spaghettificationFactor
        : 0;

    const horizon =
      type === "near"
        ? state.effects.horizonProximity
        : 0;

    const redshift =
      type === "near"
        ? state.effects.gravitationalRedshift
        : 1;

    const opacity =
      type === "near"
        ? clamp(1 - Math.pow(horizon, 2) * 0.9, 0.08, 1)
        : 0.95;

    mapRedshiftToColor(redshift, reusableColor);

    groupRef.current.position.set(pos[0], pos[1], pos[2]);
    groupRef.current.rotation.set(0, 0, -Math.PI / 2);

    const stretch = 1 + spag * 0.25;
    const squeeze = clamp(1 - spag * 0.08, 0.4, 1);

    groupRef.current.scale.set(stretch, squeeze, squeeze);

    bodyMaterialRef.current.color.copy(reusableColor);
    bodyMaterialRef.current.emissive.copy(reusableColor);
    bodyMaterialRef.current.emissiveIntensity = 0.3;
    bodyMaterialRef.current.opacity = opacity;

    noseMaterialRef.current.color.set(
      type === "near" ? "#f8f1d8" : "#e5f3ff"
    );
    noseMaterialRef.current.opacity =
      clamp(opacity + 0.05, 0.5, 1);

    ringMaterialRef.current.color.copy(reusableColor);
    ringMaterialRef.current.emissive.copy(reusableColor);
    ringMaterialRef.current.emissiveIntensity =
      type === "near"
        ? 1.2 + horizon * 0.5
        : 0.5;

    ringMaterialRef.current.opacity =
      type === "near"
        ? clamp(0.35 + horizon * 0.25, 0.35, 0.85)
        : 0.3;

    const baseSpeed = 0.02;

    if (ringRef.current) {
      if (type === "near") {
        // curva perceptual basada en proximidad al horizonte
        const h = clamp(horizon, 0, 1);

        const perceptualSpeed = 1 - Math.pow(h, 3);

        ringRef.current.rotation.y += baseSpeed * perceptualSpeed;
      } else {
        ringRef.current.rotation.y += baseSpeed;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        if (type !== "near") return;
        e.stopPropagation();
        setIsDragging(true);
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerOut={() => setIsDragging(false)}
      onPointerMove={(event) => {
        if (type !== "near" || !isDragging) return;

        event.stopPropagation();

        const state = engine.getState();
        const rs = state.blackHole.schwarzschildRadius;

        const minDistance = rs * 1.01;
        const maxDistance =
          state.spacecraftFar.distance * 0.92;

        const nextDistance = clamp(
          state.spacecraftNear.distance -
            event.nativeEvent.movementX * rs * 0.18,
          minDistance,
          maxDistance
        );

        engine.setTargetDistance(nextDistance);
      }}
    >
      <mesh>
        <cylinderGeometry args={[0.18, 0.22, 1.3, 20]} />
        <meshStandardMaterial
          ref={bodyMaterialRef}
          transparent
          metalness={0.25}
          roughness={0.28}
        />
      </mesh>

      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.2, 0.45, 18]} />
        <meshStandardMaterial
          ref={noseMaterialRef}
          transparent
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, -0.52, 0]}>
        <coneGeometry args={[0.28, 0.3, 4]} />
        <meshStandardMaterial
          color="#1f2734"
          emissive="#09131e"
          metalness={0.3}
          roughness={0.45}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.035, 12, 36]} />
        <meshStandardMaterial
          ref={ringMaterialRef}
          transparent
          metalness={0.2}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
}