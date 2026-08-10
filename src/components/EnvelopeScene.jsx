import { useRef, useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import * as THREE from 'three'

// ──────────────────────────────────────────────────────────
//  CURSOR PARALLAX
// ──────────────────────────────────────────────────────────
function CursorParallax({ children, active }) {
  const groupRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = ((e.clientX / window.innerWidth) - 0.5) * 2
      mouse.current.y = -((e.clientY / window.innerHeight) - 0.5) * 2
    }
    const onTouch = (e) => {
      if (!e.touches[0]) return
      mouse.current.x = ((e.touches[0].clientX / window.innerWidth) - 0.5) * 2
      mouse.current.y = -((e.touches[0].clientY / window.innerHeight) - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    const MAX = active ? 0.1 : 0
    current.current.x += (mouse.current.x * MAX - current.current.x) * 0.04
    current.current.y += (mouse.current.y * MAX - current.current.y) * 0.04
    groupRef.current.rotation.y = current.current.x
    groupRef.current.rotation.x = current.current.y
  })

  return <group ref={groupRef}>{children}</group>
}

// ──────────────────────────────────────────────────────────
//  ENVELOPE BODY MESH
// ──────────────────────────────────────────────────────────
function EnvelopeBody() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#EDE6D8'),
    roughness: 0.90,
    metalness: 0.02,
    side: THREE.DoubleSide,
  }), [])

  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E4DCD0'),
    roughness: 0.95,
    metalness: 0,
    side: THREE.DoubleSide,
  }), [])

  // Front face
  const frontGeo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.65, -0.42)
    s.lineTo(0.65, -0.42)
    s.lineTo(0.65, 0.42)
    s.lineTo(-0.65, 0.42)
    s.closePath()
    const geo = new THREE.ShapeGeometry(s)
    return geo
  }, [])

  // Left inner triangle
  const leftGeo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.63, -0.40)
    s.lineTo(-0.63, 0.40)
    s.lineTo(0, 0)
    s.closePath()
    return new THREE.ShapeGeometry(s)
  }, [])

  // Right inner triangle
  const rightGeo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0.63, -0.40)
    s.lineTo(0.63, 0.40)
    s.lineTo(0, 0)
    s.closePath()
    return new THREE.ShapeGeometry(s)
  }, [])

  // Bottom triangle
  const bottomGeo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.63, -0.40)
    s.lineTo(0.63, -0.40)
    s.lineTo(0, -0.04)
    s.closePath()
    return new THREE.ShapeGeometry(s)
  }, [])

  return (
    <group>
      {/* Main flat body */}
      <mesh geometry={frontGeo} material={mat} position={[0,0,0]} />
      {/* Paper thickness */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.84, 0.007]} />
        <meshStandardMaterial color="#DDD5C5" roughness={0.92} metalness={0} />
      </mesh>
      {/* Interior side folds */}
      <mesh geometry={leftGeo} material={innerMat} position={[0,0,0.004]} />
      <mesh geometry={rightGeo} material={innerMat} position={[0,0,0.004]} />
      <mesh geometry={bottomGeo} material={innerMat} position={[0,0,0.004]} />
      {/* Gold border line */}
      <mesh position={[0,0,0.009]}>
        <ringGeometry args={[0.618, 0.62, 4, 1, 0, Math.PI*2]} />
        <meshStandardMaterial color="#C9A66B" roughness={0.4} metalness={0.5} transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

// ──────────────────────────────────────────────────────────
//  FLAP
// ──────────────────────────────────────────────────────────
function EnvelopeFlap({ openProgress }) {
  const groupRef = useRef()
  const currentRot = useRef(0)

  useFrame(() => {
    if (!groupRef.current) return
    const target = -Math.PI * openProgress * 0.94
    currentRot.current += (target - currentRot.current) * 0.08
    groupRef.current.rotation.x = currentRot.current
  })

  const geo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.65, 0)
    s.lineTo(0.65, 0)
    s.lineTo(0, -0.40)
    s.closePath()
    return new THREE.ShapeGeometry(s)
  }, [])

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#EDE6D8',
    roughness: 0.90,
    metalness: 0.02,
    side: THREE.DoubleSide,
  }), [])

  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#F0EAE0',
    roughness: 0.88,
    metalness: 0,
    side: THREE.DoubleSide,
  }), [])

  return (
    // Pivot at top edge of flap
    <group position={[0, 0.42, 0.004]} ref={groupRef}>
      <mesh geometry={geo} material={mat} position={[0, -0.20, 0]} />
      {/* Inside of flap (ivory-cream) */}
      <mesh geometry={geo} material={innerMat} position={[0, -0.20, -0.002]} />
    </group>
  )
}

// ──────────────────────────────────────────────────────────
//  WAX SEAL
// ──────────────────────────────────────────────────────────
function WaxSeal({ crackProgress }) {
  const ref = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    if (!glowRef.current) return
    glowRef.current.intensity = 0.25 + Math.sin(state.clock.elapsedTime * 1.8) * 0.1
  })

  const mainMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#B3122B',
    roughness: 0.65,
    metalness: 0.08,
    emissive: '#6B0818',
    emissiveIntensity: 0.2,
  }), [])

  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8B0A1E',
    roughness: 0.75,
    metalness: 0.1,
  }), [])

  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C9A66B',
    roughness: 0.3,
    metalness: 0.7,
    emissive: '#7A5020',
    emissiveIntensity: 0.1,
  }), [])

  // Crack opens a gap
  const opacity = Math.max(0, 1 - crackProgress * 1.2)

  // Fragment positions
  const fragments = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6
    return { angle, dist: 0.04 + (i % 2) * 0.02, size: 0.018 + (i % 3) * 0.008 }
  }), [])

  return (
    <group ref={ref} position={[0, 0.10, 0.014]}>
      <pointLight ref={glowRef} color="#C04040" intensity={0.25} distance={0.6} decay={2} />

      {/* Main disk */}
      <mesh material={mainMat} visible={opacity > 0.01}>
        <cylinderGeometry args={[0.088, 0.088, 0.016, 40]} />
      </mesh>

      {/* Rim border */}
      <mesh material={rimMat} visible={opacity > 0.01}>
        <torusGeometry args={[0.088, 0.007, 8, 40]} />
      </mesh>

      {/* Inner embossed circle */}
      <mesh position={[0, 0.009, 0]} material={rimMat} visible={opacity > 0.01}>
        <cylinderGeometry args={[0.062, 0.062, 0.004, 32]} />
      </mesh>

      {/* Gold monogram plane */}
      <mesh position={[0, 0.013, 0]} rotation={[-Math.PI/2, 0, 0]} visible={opacity > 0.01}>
        <planeGeometry args={[0.072, 0.072]} />
        <meshStandardMaterial
          color="#C9A66B"
          roughness={0.4}
          metalness={0.5}
          transparent
          opacity={opacity * 0.7}
        />
      </mesh>

      {/* Crack fragments */}
      {crackProgress > 0.1 && fragments.map((f, i) => {
        const x = Math.cos(f.angle) * crackProgress * 0.18
        const y = Math.sin(f.angle) * crackProgress * 0.18
        const fOpacity = Math.max(0, 1 - crackProgress * 1.3)
        return (
          <mesh
            key={i}
            position={[x, y + 0.008, crackProgress * 0.06]}
            rotation={[0, 0, crackProgress * f.angle * 0.8]}
          >
            <boxGeometry args={[f.size, f.size * 0.6, 0.01]} />
            <meshStandardMaterial
              color="#B3122B"
              roughness={0.7}
              metalness={0.05}
              transparent
              opacity={fOpacity}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// ──────────────────────────────────────────────────────────
//  INNER WARM GLOW (from inside envelope)
// ──────────────────────────────────────────────────────────
function InnerGlow({ openProgress }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = Math.max(0, (openProgress - 0.25) / 0.75)
    ref.current.intensity = t * 1.8 + Math.sin(state.clock.elapsedTime * 2) * 0.1 * t
    ref.current.color.set(t > 0.5 ? '#D06040' : '#A04020')
  })
  return (
    <pointLight
      ref={ref}
      position={[0, 0, -0.2]}
      intensity={0}
      distance={2}
      decay={2}
    />
  )
}

// ──────────────────────────────────────────────────────────
//  INVITATION CARD
// ──────────────────────────────────────────────────────────
function InvitationCard({ slideProgress, openProgress }) {
  const meshRef = useRef()
  const currentZ = useRef(-0.8)
  const currentScale = useRef(0.45)
  const visible = openProgress > 0.4

  useFrame(() => {
    if (!meshRef.current) return
    const targetZ = slideProgress * 1.6 - 0.8
    const targetScale = 0.45 + slideProgress * 0.55
    currentZ.current += (targetZ - currentZ.current) * 0.06
    currentScale.current += (targetScale - currentScale.current) * 0.06
    meshRef.current.position.z = currentZ.current
    meshRef.current.scale.setScalar(currentScale.current)
    meshRef.current.material.opacity = Math.min(slideProgress * 3, 1)
    meshRef.current.position.y = -slideProgress * 0.02 // subtle drift
  })

  if (!visible) return null

  return (
    <mesh ref={meshRef} position={[0, 0, -0.8]} scale={0.45}>
      <boxGeometry args={[0.88, 1.24, 0.005]} />
      <meshStandardMaterial
        color="#F8F4EC"
        roughness={0.88}
        metalness={0}
        emissive={new THREE.Color('#D0B870')}
        emissiveIntensity={0.04}
        transparent
        opacity={0}
      />
    </mesh>
  )
}

// ──────────────────────────────────────────────────────────
//  SEAL PARTICLE BURST
// ──────────────────────────────────────────────────────────
function SealParticles({ active }) {
  const ref = useRef()
  const startTime = useRef(null)
  const COUNT = 24

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const vel = []
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2 + Math.random() * 0.5
      const r = 0.08 + Math.random() * 0.02
      pos[i*3]   = Math.cos(angle) * r
      pos[i*3+1] = Math.sin(angle) * r + 0.10
      pos[i*3+2] = 0.016
      vel.push({
        x: Math.cos(angle) * (0.004 + Math.random() * 0.008),
        y: Math.sin(angle) * (0.004 + Math.random() * 0.008) + 0.003,
        z: 0.002 + Math.random() * 0.004,
        gravity: 0.0001 + Math.random() * 0.0001,
      })
    }
    return { positions: pos, velocities: vel }
  }, [])

  const posArr = useRef(new Float32Array(positions))

  useFrame((state) => {
    if (!ref.current || !active) return
    if (!startTime.current) {
      startTime.current = state.clock.elapsedTime
      posArr.current.set(positions)
    }
    const elapsed = state.clock.elapsedTime - startTime.current

    for (let i = 0; i < COUNT; i++) {
      const v = velocities[i]
      posArr.current[i*3]   += v.x
      posArr.current[i*3+1] += v.y - v.gravity * elapsed * 10
      posArr.current[i*3+2] += v.z
    }
    ref.current.geometry.attributes.position.array.set(posArr.current)
    ref.current.geometry.attributes.position.needsUpdate = true

    const fade = Math.max(0, 1 - elapsed * 1.8)
    ref.current.material.opacity = fade

    if (fade <= 0 && startTime.current) startTime.current = null
  })

  if (!active) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#C01830"
        size={0.012}
        transparent
        opacity={1}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// ──────────────────────────────────────────────────────────
//  AMBIENT FOLIAGE
// ──────────────────────────────────────────────────────────
function AmbientFoliage() {
  const gRef = useRef()
  useFrame((state) => {
    if (!gRef.current) return
    const t = state.clock.elapsedTime
    gRef.current.rotation.z = Math.sin(t * 0.12) * 0.025
    gRef.current.position.y = Math.sin(t * 0.08) * 0.04
  })

  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#8A9A80',
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide,
  }), [])

  const sprigs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 3.5,
      z: -1.8 - Math.random() * 0.8,
      rot: Math.random() * Math.PI * 2,
      sw: 0.3 + Math.random() * 0.5,
      sh: 1.2 + Math.random() * 1.2,
    }))
  }, [])

  return (
    <group ref={gRef}>
      {sprigs.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]} rotation={[0, 0, s.rot]} material={mat}>
          <planeGeometry args={[s.sw, s.sh]} />
        </mesh>
      ))}
    </group>
  )
}

// ──────────────────────────────────────────────────────────
//  CAMERA RIG — gentle breathe
// ──────────────────────────────────────────────────────────
function CameraRig({ active }) {
  const { camera } = useThree()
  useFrame((state) => {
    if (!active) return
    const t = state.clock.elapsedTime
    camera.position.y = Math.sin(t * 0.25) * 0.02
  })
  return null
}

// ──────────────────────────────────────────────────────────
//  MAIN SCENE
// ──────────────────────────────────────────────────────────
function Scene({ openState, crackProgress, openProgress, slideProgress, showFoliage }) {
  const particlesActive = openState === 'opening' && crackProgress > 0.25 && crackProgress < 0.95

  return (
    <>
      {/* Lighting rig */}
      <ambientLight intensity={0.55} color="#F5EED8" />
      <directionalLight
        position={[1.5, 3, 2.5]}
        intensity={1.3}
        color="#F2E8D5"
        castShadow
      />
      <directionalLight position={[-2, -0.5, 1.5]} intensity={0.25} color="#D8D0C0" />
      <pointLight position={[0, 1.5, 2]} intensity={0.35} color="#FFE8CC" />
      <spotLight
        position={[0, 3, 1]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.6}
        color="#F0E8D8"
        castShadow
      />

      <CameraRig active={openState === 'landing'} />
      {showFoliage && <AmbientFoliage />}

      <CursorParallax active={openState === 'closed'}>
        <group>
          <EnvelopeBody />
          <EnvelopeFlap openProgress={openProgress} />
          <WaxSeal crackProgress={crackProgress} />
          <InnerGlow openProgress={openProgress} />
        </group>
      </CursorParallax>

      <InvitationCard slideProgress={slideProgress} openProgress={openProgress} />
      <SealParticles active={particlesActive} />
    </>
  )
}

// ──────────────────────────────────────────────────────────
//  CANVAS EXPORT
// ──────────────────────────────────────────────────────────
export default function EnvelopeScene(props) {
  const dpr = typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio || 1, 2)
    : 1

  return (
    <Canvas
      camera={{ position: [0, 0, 2.3], fov: 44, near: 0.01, far: 20 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      dpr={dpr}
      shadows={false}
      style={{ background: 'transparent', position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  )
}
