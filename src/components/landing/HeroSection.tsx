import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NeonButton from '../shared/NeonButton'
import ReactorScene from './ReactorScene'
import ParticleField from '../shared/ParticleField'
import { EQUATIONS } from '../../lib/data'
import { Play, Compass, Calendar } from 'lucide-react'

export default function HeroSection() {
  const [equationIndex, setEquationIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setEquationIndex(i => (i + 1) % EQUATIONS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 gradient-mesh" />

      {/* Particle field */}
      <div className="absolute inset-0 z-0">
        <ParticleField count={60} speed={0.2} connectDistance={100} />
      </div>

      {/* 3D Reactor */}
      <div className="absolute inset-0 z-0 opacity-70">
        <ReactorScene />
      </div>

      {/* Floating equations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {EQUATIONS.map((eq, i) => (
          <motion.div
            key={eq}
            className="absolute font-mono text-xs text-riq-cyan/10"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.15, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, -100],
            }}
            transition={{
              duration: 8,
              delay: i * 1.5,
              repeat: Infinity,
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
          >
            {eq}
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-riq-cyan/20 mb-8"
        >
          <span className="h-2 w-2 rounded-full bg-riq-success animate-pulse" />
          <span className="text-xs font-mono text-riq-text-dim">PLATFORM v2.0 — LIVE</span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight mb-6"
        >
          <span className="text-gradient-cyan">REACT</span>
          <span className="text-riq-gold">IQ</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg sm:text-xl lg:text-2xl text-riq-gray-light font-light max-w-3xl mx-auto mb-4"
        >
          AI-Driven Esterification Scale-Up Intelligence Platform
        </motion.p>

        {/* Animated equation display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-10"
        >
          <motion.p
            key={equationIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-mono text-sm text-riq-cyan/50"
          >
            {EQUATIONS[equationIndex]}
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <NeonButton variant="cyan" size="lg" to="/kinetic-modeling" icon={<Play size={18} />}>
            Launch Simulation
          </NeonButton>
          <NeonButton variant="gold" size="lg" to="/digital-twin" icon={<Compass size={18} />}>
            Explore Platform
          </NeonButton>
          <NeonButton variant="orange" size="lg" icon={<Calendar size={18} />}>
            Request Demo
          </NeonButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-riq-text-dim uppercase tracking-widest">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-riq-cyan/30 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 rounded-full bg-riq-cyan" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-riq-black to-transparent z-10 pointer-events-none" />
    </section>
  )
}
