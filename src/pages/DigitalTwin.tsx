import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import SectionHeader from '../components/shared/SectionHeader'
import GlassCard from '../components/shared/GlassCard'
import { generateThermalData } from '../lib/data'
import { Thermometer, Gauge, Droplets, Wind, Cpu, Activity } from 'lucide-react'

function ReactorBody() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(state => {
    if (meshRef.current) meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
  })

  return (
    <group ref={meshRef as any}>
      {/* Main vessel */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 3, 32]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#00e5ff" emissiveIntensity={0.05} metalness={0.95} roughness={0.15} transparent opacity={0.85} />
      </mesh>
      {/* Top dome */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.95} roughness={0.15} transparent opacity={0.85} />
      </mesh>
      {/* Bottom cone */}
      <mesh position={[0, -1.8, 0]}>
        <coneGeometry args={[1.4, 0.8, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.95} roughness={0.15} transparent opacity={0.85} />
      </mesh>
      {/* Glowing bands */}
      {[-0.5, 0, 0.5, 1].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[1.21 + y * 0.03, 0.02, 8, 64]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Pipes */}
      {[0, 1.57, 3.14, 4.71].map((a, i) => (
        <group key={i}>
          <mesh position={[Math.cos(a) * 1.5, 0.3, Math.sin(a) * 1.5]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
            <meshStandardMaterial color="#2a2a45" emissive="#ffc107" emissiveIntensity={0.3} metalness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Agitator shaft */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
        <meshStandardMaterial color="#78909c" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function FlowParticles() {
  const count = 300
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const speeds = useMemo(() => Array.from({ length: count }, () => 0.5 + Math.random() * 1.5), [])
  const offsets = useMemo(() => Array.from({ length: count }, () => Math.random() * Math.PI * 2), [])

  useFrame(state => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const angle = offsets[i] + t * speeds[i] * 0.3
      const r = 0.3 + (i % 5) * 0.15
      const y = ((t * speeds[i] * 0.5 + offsets[i]) % 3) - 1.5
      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r)
      dummy.scale.setScalar(0.015 + Math.sin(t + i) * 0.005)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3} transparent opacity={0.5} />
    </instancedMesh>
  )
}

function ThermalHeatmapCanvas({ data }: { data: number[][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const size = data.length
    canvas.width = size * 15
    canvas.height = size * 15

    data.forEach((row, i) => {
      row.forEach((temp, j) => {
        const normalized = (temp - 280) / 120
        const r = Math.min(255, Math.floor(normalized * 510))
        const g = Math.floor((1 - Math.abs(normalized - 0.5) * 2) * 180)
        const b = Math.max(0, Math.floor((1 - normalized) * 255))
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(j * 15, i * 15, 14, 14)
      })
    })
  }, [data])

  return <canvas ref={canvasRef} className="w-full rounded-lg" style={{ imageRendering: 'pixelated' }} />
}

export default function DigitalTwin() {
  const [temp, setTemp] = useState(150)
  const [pressure, setPressure] = useState(5)
  const [flowRate, setFlowRate] = useState(2.5)
  const thermalData = useMemo(() => generateThermalData(20), [])

  const telemetry = [
    { label: 'Core Temp', value: `${temp}°C`, icon: <Thermometer size={14} />, color: '#ff6d00', status: temp > 200 ? 'warning' : 'normal' },
    { label: 'Pressure', value: `${pressure} atm`, icon: <Gauge size={14} />, color: '#00e5ff', status: pressure > 12 ? 'warning' : 'normal' },
    { label: 'Flow Rate', value: `${flowRate} m³/h`, icon: <Droplets size={14} />, color: '#2979ff', status: 'normal' },
    { label: 'Cooling', value: '94.2%', icon: <Wind size={14} />, color: '#00e676', status: 'normal' },
    { label: 'CPU Load', value: '67%', icon: <Cpu size={14} />, color: '#ffc107', status: 'normal' },
    { label: 'Status', value: 'ONLINE', icon: <Activity size={14} />, color: '#00e676', status: 'active' },
  ]

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader subtitle="MODULE 3" title="Digital Twin Simulation" description="Interactive 3D digital twin with real-time thermal mapping, pressure visualization, and fluid flow simulation." align="left" glowColor="#2979ff" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3D Scene */}
          <div className="lg:col-span-8">
            <GlassCard variant="highlight" hover={false} className="!p-2 overflow-hidden">
              <div className="relative rounded-xl overflow-hidden" style={{ height: 500 }}>
                <Canvas camera={{ position: [4, 3, 4], fov: 40 }} gl={{ antialias: true }}>
                  <ambientLight intensity={0.15} />
                  <pointLight position={[5, 5, 5]} color="#00e5ff" intensity={2} />
                  <pointLight position={[-5, -3, 3]} color="#ffc107" intensity={1} />
                  <pointLight position={[0, -5, 0]} color="#ff6d00" intensity={0.5} />
                  <ReactorBody />
                  <FlowParticles />
                  <OrbitControls enableZoom enablePan autoRotate autoRotateSpeed={0.3} />
                </Canvas>

                {/* HUD Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-riq-success animate-pulse" />
                  <span className="text-[10px] font-mono text-riq-success">DIGITAL TWIN — LIVE</span>
                </div>
                <div className="absolute top-3 right-3 text-[10px] font-mono text-riq-text-dim">
                  FPS: 60 | RENDER: WebGL2
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono text-riq-text-dim">
                  Drag to orbit • Scroll to zoom
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Controls & Telemetry */}
          <div className="lg:col-span-4 space-y-4">
            {/* Telemetry */}
            <GlassCard variant="default" hover={false} className="!p-4">
              <h3 className="text-xs font-mono text-riq-text-dim mb-3">TELEMETRY READOUT</h3>
              <div className="grid grid-cols-2 gap-2">
                {telemetry.map(t => (
                  <div key={t.label} className="p-2.5 rounded-lg bg-riq-surface/50 border border-riq-border/50">
                    <div className="flex items-center gap-1 mb-1" style={{ color: t.color }}>{t.icon}<span className="text-[10px] font-mono">{t.label}</span></div>
                    <div className="text-sm font-bold text-white">{t.value}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Controls */}
            <GlassCard variant="highlight" hover={false} className="!p-4">
              <h3 className="text-xs font-mono text-riq-cyan mb-3">REACTOR CONTROLS</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-riq-text-dim font-mono flex justify-between"><span>Temperature</span><span className="text-riq-orange">{temp}°C</span></label>
                  <input type="range" min={60} max={300} value={temp} onChange={e => setTemp(+e.target.value)} className="w-full accent-riq-orange" />
                </div>
                <div>
                  <label className="text-[10px] text-riq-text-dim font-mono flex justify-between"><span>Pressure</span><span className="text-riq-cyan">{pressure} atm</span></label>
                  <input type="range" min={1} max={15} step={0.5} value={pressure} onChange={e => setPressure(+e.target.value)} className="w-full accent-riq-cyan" />
                </div>
                <div>
                  <label className="text-[10px] text-riq-text-dim font-mono flex justify-between"><span>Flow Rate</span><span className="text-riq-blue">{flowRate} m³/h</span></label>
                  <input type="range" min={0.5} max={10} step={0.1} value={flowRate} onChange={e => setFlowRate(+e.target.value)} className="w-full accent-riq-blue" />
                </div>
              </div>
            </GlassCard>

            {/* Thermal Heatmap */}
            <GlassCard variant="default" hover={false} className="!p-4">
              <h3 className="text-xs font-mono text-riq-text-dim mb-3">THERMAL HEATMAP</h3>
              <ThermalHeatmapCanvas data={thermalData} />
              <div className="flex justify-between mt-2 text-[9px] font-mono text-riq-text-dim">
                <span className="text-blue-400">280K</span>
                <span className="text-yellow-400">340K</span>
                <span className="text-red-400">400K</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  )
}
