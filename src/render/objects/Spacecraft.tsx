import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type {
  Group,
  Mesh,
  MeshStandardMaterial,
  PointLight,
} from "three";

import * as THREE from "three";

import { useSimulationEngine } from "../hooks/useSimulationEngine";
import { BLACK_HOLE_VISUAL_RADIUS } from "../../core/units/renderScale";

interface Props {
  type: "near" | "far";
}

const clamp = (
  value: number,
  min: number,
  max: number
) => Math.min(max, Math.max(min, value));

function mapRedshiftToColor(
  z: number,
  color: THREE.Color
) {
  if (!Number.isFinite(z)) {
    color.setRGB(0.2, 0, 0);
    return;
  }

  const clamped = Math.min(z, 5);

  const hue = clamp(
    0.58 - (clamped - 1) * 0.14,
    0,
    0.58
  );

  const saturation = clamp(
    0.45 - (clamped - 1) * 0.08,
    0.08,
    0.45
  );

  const lightness = clamp(
    0.72 - (clamped - 1) * 0.18,
    0.22,
    0.72
  );

  color.setHSL(hue, saturation, lightness);
}

export default function Spacecraft({
  type,
}: Props) {
  const engine = useSimulationEngine();

  const groupRef = useRef<Group>(null);

  const ringRef = useRef<Mesh>(null);

  const engineGlowRef = useRef<Mesh>(null);

  const engineLightRef = useRef<PointLight>(null);

  const bodyMaterialRef =
    useRef<MeshStandardMaterial>(null);

  const noseMaterialRef =
    useRef<MeshStandardMaterial>(null);

  const ringMaterialRef =
    useRef<MeshStandardMaterial>(null);

  const engineMaterialRef =
    useRef<MeshStandardMaterial>(null);

  const panelMaterialRef =
    useRef<MeshStandardMaterial>(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const reusableColor = useMemo(
    () => new THREE.Color(),
    []
  );

  useFrame((state) => {
    if (
      !groupRef.current ||
      !bodyMaterialRef.current ||
      !noseMaterialRef.current ||
      !ringMaterialRef.current ||
      !engineMaterialRef.current ||
      !panelMaterialRef.current
    ) return;

    const simState = engine.getState();

    const spacecraft =
      type === "near"
        ? simState.spacecraftNear
        : simState.spacecraftFar;

    const pos = spacecraft.position;

    const spag =
      type === "near"
        ? simState.effects.spaghettificationFactor
        : 0;

    const horizon =
      type === "near"
        ? simState.effects.horizonProximity
        : 0;

    const redshift =
      type === "near"
        ? simState.effects.gravitationalRedshift
        : 1;

    const opacity =
      type === "near"
        ? clamp(
            1 - Math.pow(horizon, 2) * 0.88,
            0.12,
            1
          )
        : 0.95;

    mapRedshiftToColor(
      redshift,
      reusableColor
    );

    // =========================
    // POSITION
    // =========================

    groupRef.current.position.set(
      pos[0],
      pos[1],
      pos[2]
    );

    // Micro vibración
    groupRef.current.position.y +=
      Math.sin(state.clock.elapsedTime * 18) *
      0.003;

    // Rotación base
    groupRef.current.rotation.set(
      0,
      0,
      -Math.PI / 2
    );

    // Drift procedural
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.9) *
      0.015;

    groupRef.current.rotation.y =
      Math.cos(state.clock.elapsedTime * 0.7) *
      0.012;

    // =========================
    // SPAGHETTIFICATION
    // =========================

    const stretch = 1 + spag * 0.28;

    const squeeze = clamp(
      1 - spag * 0.1,
      0.42,
      1
    );

    const baseScale =
      type === "near"
        ? BLACK_HOLE_VISUAL_RADIUS * 0.23
        : BLACK_HOLE_VISUAL_RADIUS * 0.19;

    groupRef.current.scale.set(
      baseScale * stretch,
      baseScale * squeeze,
      baseScale * squeeze
    );

    // =========================
    // BODY MATERIAL
    // =========================

    bodyMaterialRef.current.color.copy(
      reusableColor
    );

    bodyMaterialRef.current.emissive.copy(
      reusableColor
    );

    bodyMaterialRef.current.emissiveIntensity =
      0.08 + horizon * 0.2;

    bodyMaterialRef.current.opacity =
      opacity;

    // =========================
    // NOSE MATERIAL
    // =========================

    noseMaterialRef.current.color.set(
      "#d1d5db"
    );

    noseMaterialRef.current.opacity =
      clamp(opacity + 0.05, 0.45, 1);

    // =========================
    // RING
    // =========================

    ringMaterialRef.current.color.copy(
      reusableColor
    );

    ringMaterialRef.current.emissive.copy(
      reusableColor
    );

    ringMaterialRef.current.emissiveIntensity =
      0.15 + horizon * 0.35;

    ringMaterialRef.current.opacity =
      clamp(
        0.18 + horizon * 0.2,
        0.18,
        0.6
      );

    // =========================
    // ENGINE
    // =========================

    const enginePulse =
      1 +
      Math.sin(state.clock.elapsedTime * 8) *
        0.08;

    engineMaterialRef.current.emissiveIntensity =
      type === "near"
        ? 1.4 * enginePulse
        : 0.8 * enginePulse;

    if (engineGlowRef.current) {
      engineGlowRef.current.scale.setScalar(
        enginePulse
      );
    }

    if (engineLightRef.current) {
      engineLightRef.current.intensity =
        1.8 * enginePulse;
    }

    // =========================
    // PANELS
    // =========================

    panelMaterialRef.current.emissiveIntensity =
      0.02 + horizon * 0.06;

    // =========================
    // RING ROTATION
    // =========================

    if (ringRef.current) {
      const baseSpeed = 0.018;

      if (type === "near") {
        const h = clamp(horizon, 0, 1);

        const perceptualSpeed =
          1 - Math.pow(h, 3);

        ringRef.current.rotation.y +=
          baseSpeed * perceptualSpeed;
      } else {
        ringRef.current.rotation.y +=
          baseSpeed;
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
      onPointerUp={() =>
        setIsDragging(false)
      }
      onPointerOut={() =>
        setIsDragging(false)
      }
      onPointerMove={(event) => {
        if (
          type !== "near" ||
          !isDragging
        ) return;

        event.stopPropagation();

        const state = engine.getState();

        const rs =
          state.blackHole
            .schwarzschildRadius;

        const minDistance =
          rs * 1.01;

        const maxDistance =
          state.spacecraftFar.distance *
          0.92;

        const nextDistance = clamp(
          state.spacecraftNear.distance -
            event.nativeEvent.movementX *
              rs *
              0.18,
          minDistance,
          maxDistance
        );

        engine.setTargetDistance(
          nextDistance
        );
      }}
    >
      {/* ========================= */}
      {/* MAIN BODY */}
      {/* ========================= */}

      <mesh>
        <cylinderGeometry
          args={[0.18, 0.24, 1.45, 24]}
        />

        <meshStandardMaterial
          ref={bodyMaterialRef}
          transparent
          metalness={0.82}
          roughness={0.58}
          color="#6b7280"
        />
      </mesh>

      {/* ========================= */}
      {/* FRONT NOSE */}
      {/* ========================= */}

      <mesh position={[0, 0.92, 0]}>
        <coneGeometry
          args={[0.2, 0.42, 24]}
        />

        <meshStandardMaterial
          ref={noseMaterialRef}
          transparent
          metalness={0.65}
          roughness={0.42}
        />
      </mesh>

      {/* ========================= */}
      {/* REAR ENGINE BLOCK */}
      {/* ========================= */}

      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry
          args={[0.16, 0.2, 0.25, 18]}
        />

        <meshStandardMaterial
          color="#1f2937"
          metalness={0.7}
          roughness={0.7}
        />
      </mesh>

      {/* ========================= */}
      {/* ENGINE GLOW */}
      {/* ========================= */}

      <mesh
        ref={engineGlowRef}
        position={[0, -0.9, 0]}
      >
        <cylinderGeometry
          args={[0.08, 0.13, 0.12, 16]}
        />

        <meshStandardMaterial
          ref={engineMaterialRef}
          emissive="#6fd3ff"
          color="#111827"
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* ========================= */}
      {/* ENGINE LIGHT */}
      {/* ========================= */}

      <pointLight
        ref={engineLightRef}
        position={[0, -1, 0]}
        color="#8ad8ff"
        intensity={1.8}
        distance={4}
      />

      {/* ========================= */}
      {/* ROTATING SENSOR RING */}
      {/* ========================= */}

      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry
          args={[0.42, 0.02, 12, 48]}
        />

        <meshStandardMaterial
          ref={ringMaterialRef}
          transparent
          metalness={0.75}
          roughness={0.42}
        />
      </mesh>

      {/* ========================= */}
      {/* SIDE SENSOR ARM */}
      {/* ========================= */}

      <mesh position={[0.3, 0.05, 0]}>
        <boxGeometry
          args={[0.06, 0.34, 0.06]}
        />

        <meshStandardMaterial
          color="#4b5563"
          metalness={0.85}
          roughness={0.6}
        />
      </mesh>

      {/* ========================= */}
      {/* ASYMMETRIC ANTENNA */}
      {/* ========================= */}

      <mesh
        position={[-0.32, -0.15, 0]}
        rotation={[0, 0, 0.4]}
      >
        <cylinderGeometry
          args={[0.015, 0.015, 0.42, 8]}
        />

        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.9}
          roughness={0.4}
        />
      </mesh>

      {/* ========================= */}
      {/* THERMAL PANELS */}
      {/* ========================= */}

      <mesh position={[0.48, -0.05, 0]}>
        <boxGeometry
          args={[0.04, 0.52, 0.28]}
        />

        <meshStandardMaterial
          ref={panelMaterialRef}
          color="#111827"
          emissive="#1e293b"
          metalness={0.2}
          roughness={0.9}
        />
      </mesh>

      <mesh position={[-0.48, -0.05, 0]}>
        <boxGeometry
          args={[0.04, 0.42, 0.22]}
        />

        <meshStandardMaterial
          color="#0f172a"
          metalness={0.2}
          roughness={0.92}
        />
      </mesh>
    </group>
  );
}
