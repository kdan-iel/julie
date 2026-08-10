import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BouquetModelProps {
  scrollProgress: number;
  isMobile?: boolean;
}

// Keyframes defined for each major section
export const BOUQUET_KEYFRAMES = [
  // 0. Hero (0.00 -> 0.15)
  { progress: 0.0, position: [1.8, 0.1, 0.8] as [number, number, number], rotation: [0.2, -0.4, 0.1] as [number, number, number], scale: 1.25 },
  // 1. Story / Notre Histoire (0.25 -> 0.35)
  { progress: 0.28, position: [-2.0, 0.2, -0.2] as [number, number, number], rotation: [-0.1, 0.6, -0.2] as [number, number, number], scale: 0.85 },
  // 2. Programme (0.45 -> 0.55)
  { progress: 0.50, position: [2.1, -0.2, -0.8] as [number, number, number], rotation: [0.3, -0.8, 0.3] as [number, number, number], scale: 0.95 },
  // 3. Galerie (0.65 -> 0.75)
  { progress: 0.70, position: [-2.4, -0.8, -1.5] as [number, number, number], rotation: [0.1, 0.9, -0.1] as [number, number, number], scale: 0.70 },
  // 4. RSVP (0.80 -> 0.88)
  { progress: 0.83, position: [1.9, 0.3, 0.1] as [number, number, number], rotation: [0.25, -0.3, 0.15] as [number, number, number], scale: 1.15 },
  // 5. Footer (0.95 -> 1.0)
  { progress: 1.0, position: [0, -0.2, 1.2] as [number, number, number], rotation: [0.1, 0.0, 0.0] as [number, number, number], scale: 1.45 },
];

/** Helper function to interpolate values along keyframes */
export function interpolateKeyframes(p: number) {
  const clampedP = Math.max(0, Math.min(1, p));
  let start = BOUQUET_KEYFRAMES[0];
  let end = BOUQUET_KEYFRAMES[BOUQUET_KEYFRAMES.length - 1];

  for (let i = 0; i < BOUQUET_KEYFRAMES.length - 1; i++) {
    if (clampedP >= BOUQUET_KEYFRAMES[i].progress && clampedP <= BOUQUET_KEYFRAMES[i + 1].progress) {
      start = BOUQUET_KEYFRAMES[i];
      end = BOUQUET_KEYFRAMES[i + 1];
      break;
    }
  }

  const range = end.progress - start.progress;
  const factor = range > 0 ? (clampedP - start.progress) / range : 0;
  // Smooth cubic ease for fluid travel
  const t = factor < 0.5 ? 4 * factor * factor * factor : 1 - Math.pow(-2 * factor + 2, 3) / 2;

  const pos: [number, number, number] = [
    THREE.MathUtils.lerp(start.position[0], end.position[0], t),
    THREE.MathUtils.lerp(start.position[1], end.position[1], t),
    THREE.MathUtils.lerp(start.position[2], end.position[2], t),
  ];

  const rot: [number, number, number] = [
    THREE.MathUtils.lerp(start.rotation[0], end.rotation[0], t),
    THREE.MathUtils.lerp(start.rotation[1], end.rotation[1], t),
    THREE.MathUtils.lerp(start.rotation[2], end.rotation[2], t),
  ];

  const scale = THREE.MathUtils.lerp(start.scale, end.scale, t);

  return { pos, rot, scale };
}

/**
 * A single cupped petal built from a partial sphere (instead of a flat plane).
 * Partial-sphere petals curve naturally in 3D and catch light like real rose
 * petals, which reads far more realistic than flat planes.
 */
function Petal({
  position,
  rotation,
  scale = 1,
  color,
  curl = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number] | number;
  color: string;
  curl?: number;
}) {
  const scaleArr: [number, number, number] = Array.isArray(scale) ? scale : [scale, scale, scale];
  return (
    <mesh position={position} rotation={rotation} scale={scaleArr}>
      {/* Partial sphere = naturally cupped/curved petal shape */}
      <sphereGeometry args={[0.22, 10, 10, Math.PI * 0.15, Math.PI * 0.75, Math.PI * 0.1, Math.PI * (0.5 * curl)]} />
      <meshStandardMaterial color={color} roughness={0.42} metalness={0.02} side={THREE.DoubleSide} />
    </mesh>
  );
}

/**
 * Realistic layered rose bouquet flower: a tight, darker bordeaux bud core
 * surrounded by concentric rings of larger, brighter-red cupped petals that
 * open outward — mirrors how a real rose blooms from center to edge.
 */
function Rose({
  position,
  rotation,
  scale = 1,
  palette = ['#5C0F22', '#8B1428', '#A4193D', '#C94F63'],
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  palette?: [string, string, string, string];
}) {
  const layers = useMemo(() => {
    const config = [
      { count: 5, radius: 0.02, tilt: 0.15, yOff: 0.18, petalScale: 0.42, curl: 0.55, colorIdx: 0 }, // tight bud core
      { count: 6, radius: 0.07, tilt: 0.55, yOff: 0.14, petalScale: 0.62, curl: 0.7, colorIdx: 1 },  // inner petals
      { count: 7, radius: 0.13, tilt: 0.95, yOff: 0.08, petalScale: 0.82, curl: 0.85, colorIdx: 2 }, // mid petals
      { count: 8, radius: 0.19, tilt: 1.3, yOff: 0.02, petalScale: 1.0, curl: 1.0, colorIdx: 3 },    // outer open petals
    ];

    const items: {
      pos: [number, number, number];
      rot: [number, number, number];
      s: number;
      color: string;
      curl: number;
    }[] = [];

    config.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2 + layer.tilt * 0.3;
        const jitter = (Math.sin(i * 12.9898) * 0.5 + 0.5) * 0.06 - 0.03;
        items.push({
          pos: [Math.sin(angle) * layer.radius, layer.yOff + jitter, Math.cos(angle) * layer.radius],
          rot: [layer.tilt + jitter, angle, 0.25 + jitter],
          s: layer.petalScale,
          color: palette[layer.colorIdx],
          curl: layer.curl,
        });
      }
    });

    return items;
  }, [palette]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Deep bordeaux inner core (visible through the bud petals) */}
      <mesh position={[0, 0.19, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#3D0A18" roughness={0.5} />
      </mesh>

      {/* Layered petals, center (dark) to edge (bright red) */}
      {layers.map((p, idx) => (
        <Petal key={idx} position={p.pos} rotation={p.rot} scale={p.s} color={p.color} curl={p.curl} />
      ))}

      {/* Sepals / calyx base where the bloom meets the stem */}
      <mesh position={[0, -0.03, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.09, 0.1, 6]} />
        <meshStandardMaterial color="#3D5C45" roughness={0.65} />
      </mesh>
    </group>
  );
}

/** Sage-green leaves & eucalyptus foliage woven through the bouquet */
function LeavesGroup() {
  const leafPalette = ['#3D5C45', '#4B5842', '#5C6B52', '#2F3E2A'];

  const leaves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const radius = 0.42 + (i % 3) * 0.09;
      arr.push({
        pos: [Math.sin(angle) * radius, -0.16 + (i % 2) * 0.06, Math.cos(angle) * radius] as [number, number, number],
        rot: [0.45, angle + Math.PI / 2, 0.15 + (i % 3) * 0.08] as [number, number, number],
        color: leafPalette[i % leafPalette.length],
        size: [0.16 + (i % 2) * 0.03, 0.32 + (i % 3) * 0.05] as [number, number],
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {leaves.map((l, i) => (
        <mesh key={i} position={l.pos} rotation={l.rot}>
          <planeGeometry args={l.size} />
          <meshStandardMaterial color={l.color} metalness={0.05} roughness={0.55} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export function BouquetModel({ scrollProgress, isMobile = false }: BouquetModelProps) {
  const bouquetRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Floating petals particle system
  const { particlePositions, particleScales } = useMemo(() => {
    const count = isMobile ? 25 : 60;
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
      sc[i] = Math.random() * 0.08 + 0.03;
    }
    return { particlePositions: pos, particleScales: sc };
  }, [isMobile]);

  useFrame((state, delta) => {
    if (!bouquetRef.current) return;

    // Smooth scroll interpolation using target keyframe mapping
    const target = interpolateKeyframes(scrollProgress);

    // Continuous secondary idle motion (floating loop)
    const time = state.clock.getElapsedTime();
    const idleY = isMobile ? 0 : Math.sin(time * 1.8) * 0.06;
    const idleRotZ = isMobile ? 0 : Math.cos(time * 1.2) * 0.04;
    const idleRotY = isMobile ? 0 : Math.sin(time * 0.8) * 0.05;

    // Smooth lerp transform
    const lerpFactor = 0.08;
    bouquetRef.current.position.x = THREE.MathUtils.lerp(bouquetRef.current.position.x, target.pos[0], lerpFactor);
    bouquetRef.current.position.y = THREE.MathUtils.lerp(bouquetRef.current.position.y, target.pos[1] + idleY, lerpFactor);
    bouquetRef.current.position.z = THREE.MathUtils.lerp(bouquetRef.current.position.z, target.pos[2], lerpFactor);

    bouquetRef.current.rotation.x = THREE.MathUtils.lerp(bouquetRef.current.rotation.x, target.rot[0], lerpFactor);
    bouquetRef.current.rotation.y = THREE.MathUtils.lerp(bouquetRef.current.rotation.y, target.rot[1] + idleRotY, lerpFactor);
    bouquetRef.current.rotation.z = THREE.MathUtils.lerp(bouquetRef.current.rotation.z, target.rot[2] + idleRotZ, lerpFactor);

    const currentScale = bouquetRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, target.scale, lerpFactor);
    bouquetRef.current.scale.set(nextScale, nextScale, nextScale);

    // Gentle particle drift
    if (particlesRef.current && !isMobile) {
      particlesRef.current.rotation.y = time * 0.08;
      particlesRef.current.rotation.x = Math.sin(time * 0.05) * 0.05;
    }
  });

  return (
    <group ref={bouquetRef}>
      {/* Bouquet Center Core & Stems */}
      <group position={[0, -0.2, 0]}>
        {/* Stems bundle */}
        <mesh position={[0, -0.45, 0]} rotation={[0.05, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.5, 12]} />
          <meshStandardMaterial color="#405844" roughness={0.7} />
        </mesh>
        {/* Satin Wrap */}
        <mesh position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.08, 0.07, 0.22, 16]} />
          <meshStandardMaterial color="#FBF8F3" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Red Satin Ribbon tie */}
        <mesh position={[0, -0.32, 0]}>
          <torusGeometry args={[0.09, 0.018, 12, 24]} />
          <meshStandardMaterial color="#A4193D" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Flowers Arrangement — a red rose bouquet, deep bordeaux to bright
            crimson, with two soft ivory roses for contrast and depth */}
        {/* Central Main Red Rose */}
        <Rose
          position={[0, 0.2, 0]}
          rotation={[0, 0, 0]}
          scale={1.25}
          palette={['#4A0E1E', '#7A1230', '#A4193D', '#D6455C']}
        />

        {/* Surrounding Red Roses (slight tonal variation for a natural look) */}
        <Rose
          position={[0.25, 0.12, 0.2]}
          rotation={[0.3, 0.4, -0.2]}
          scale={1.0}
          palette={['#3D0A18', '#6E0F28', '#8B1428', '#C94F63']}
        />
        <Rose
          position={[-0.28, 0.14, 0.18]}
          rotation={[0.25, -0.5, 0.2]}
          scale={1.05}
          palette={['#4A0E1E', '#7A1230', '#A4193D', '#D6455C']}
        />
        <Rose
          position={[0.15, 0.18, -0.25]}
          rotation={[-0.3, 0.2, -0.1]}
          scale={0.95}
          palette={['#3D0A18', '#5C0F22', '#8B1428', '#C94F63']}
        />
        <Rose
          position={[-0.2, 0.1, -0.22]}
          rotation={[-0.25, -0.3, 0.15]}
          scale={0.9}
          palette={['#4A0E1E', '#7A1230', '#A4193D', '#D6455C']}
        />

        {/* Two soft ivory roses tucked in for contrast against the red */}
        <Rose
          position={[0.35, 0.02, -0.05]}
          rotation={[0.4, 0.8, -0.3]}
          scale={0.6}
          palette={['#D8C9AE', '#EDE2D3', '#F7F1E8', '#FBF8F3']}
        />
        <Rose
          position={[-0.35, 0.05, 0.02]}
          rotation={[0.3, -0.7, 0.25]}
          scale={0.6}
          palette={['#D8C9AE', '#EDE2D3', '#F7F1E8', '#FBF8F3']}
        />

        {/* Leaves & Eucalyptus Foliage */}
        <LeavesGroup />
      </group>

      {/* Floating Petal Particles around Bouquet */}
      {!isMobile && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            color="#A4193D"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
}
