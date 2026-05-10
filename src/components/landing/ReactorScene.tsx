import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function Reactor() {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef1 = useRef<THREE.Mesh>(null)
  const ringRef2 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x = state.clock.elapsedTime * 0.4
      ringRef1.current.rotation.z = state.clock.elapsedTime * 0.2
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x = -state.clock.elapsedTime * 0.3
      ringRef2.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main reactor body */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh>
          <cylinderGeometry args={[0.8, 1, 2.5, 32]} />
          <MeshDistortMaterial
            color="#141420"
            emissive="#00e5ff"
            emissiveIntensity={0.15}
            roughness={0.3}
            metalness={0.9}
            distort={0.05}
            speed={2}
          />
        </mesh>

        {/* Reactor top dome */}
        <mesh position={[0, 1.25, 0]}>
          <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1a1a2e" emissive="#2979ff" emissiveIntensity={0.1} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Reactor pipes */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 1.1, 0.5, Math.sin(angle) * 1.1]} rotation={[0, 0, Math.PI / 6 * (i % 2 === 0 ? 1 : -1)]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#2a2a45" emissive="#ffc107" emissiveIntensity={0.2} metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* Glowing band */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.95, 0.05, 16, 64]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1} transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <torusGeometry args={[0.85, 0.03, 16, 64]} />
          <meshStandardMaterial color="#ffc107" emissive="#ffc107" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
      </Float>

      {/* Orbital rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.6} transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef2}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshStandardMaterial color="#2979ff" emissive="#2979ff" emissiveIntensity={0.4} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

function FloatingParticles() {
  const count = 200
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 3
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    for (let i = 0; i < count; i++) {
      const t = state.clock.elapsedTime
      dummy.position.set(
        positions[i * 3] + Math.sin(t * 0.5 + i) * 0.3,
        positions[i * 3 + 1] + Math.cos(t * 0.3 + i * 0.5) * 0.3,
        positions[i * 3 + 2] + Math.sin(t * 0.4 + i * 0.3) * 0.3,
      )
      const s = 0.02 + Math.sin(t + i) * 0.01
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2} transparent opacity={0.6} />
    </instancedMesh>
  )
}

export default function ReactorScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 1, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} color="#00e5ff" intensity={2} />
        <pointLight position={[-5, -3, 3]} color="#ffc107" intensity={1} />
        <pointLight position={[0, 3, -5]} color="#2979ff" intensity={1.5} />
        <spotLight position={[0, 8, 0]} angle={0.3} penumbra={1} color="#00e5ff" intensity={1} />

        <Reactor />
        <FloatingParticles />

        <Sphere args={[15, 32, 32]} >
          <meshStandardMaterial color="#0a0a0f" side={THREE.BackSide} />
        </Sphere>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
