import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'highlight' | 'warning' | 'success' | 'danger'
  hover?: boolean
  glow?: boolean
  hud?: boolean
  onClick?: () => void
}

const variantStyles = {
  default: 'border-white/8 hover:border-riq-cyan/30',
  highlight: 'border-riq-cyan/20 hover:border-riq-cyan/50',
  warning: 'border-riq-orange/20 hover:border-riq-orange/50',
  success: 'border-riq-success/20 hover:border-riq-success/50',
  danger: 'border-riq-danger/20 hover:border-riq-danger/50',
}

const glowColors = {
  default: 'rgba(0,229,255,0.08)',
  highlight: 'rgba(0,229,255,0.12)',
  warning: 'rgba(255,109,0,0.12)',
  success: 'rgba(0,230,118,0.12)',
  danger: 'rgba(255,23,68,0.12)',
}

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  hover = true,
  glow = false,
  hud = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br from-riq-surface/80 to-riq-charcoal/60
        backdrop-blur-xl border
        ${variantStyles[variant]}
        transition-all duration-400
        ${hover ? 'cursor-pointer' : ''}
        ${hud ? 'hud-corner' : ''}
        ${className}
      `}
      style={glow ? { boxShadow: `0 0 30px ${glowColors[variant]}, 0 20px 60px rgba(0,0,0,0.3)` } : undefined}
    >
      {/* Holographic shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
      {children}
    </motion.div>
  )
}
