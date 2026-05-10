import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface NeonButtonProps {
  children: ReactNode
  variant?: 'cyan' | 'gold' | 'orange' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  icon?: ReactNode
}

const variants = {
  cyan: {
    bg: 'from-riq-cyan/10 to-riq-blue/10',
    border: 'border-riq-cyan/30 hover:border-riq-cyan/70',
    text: 'text-riq-cyan',
    glow: 'hover:shadow-riq-cyan/20',
    activeBg: 'active:bg-riq-cyan/20',
  },
  gold: {
    bg: 'from-riq-gold/10 to-riq-orange/10',
    border: 'border-riq-gold/30 hover:border-riq-gold/70',
    text: 'text-riq-gold',
    glow: 'hover:shadow-riq-gold/20',
    activeBg: 'active:bg-riq-gold/20',
  },
  orange: {
    bg: 'from-riq-orange/10 to-riq-orange-warm/10',
    border: 'border-riq-orange/30 hover:border-riq-orange/70',
    text: 'text-riq-orange',
    glow: 'hover:shadow-riq-orange/20',
    activeBg: 'active:bg-riq-orange/20',
  },
  danger: {
    bg: 'from-riq-danger/10 to-riq-orange/10',
    border: 'border-riq-danger/30 hover:border-riq-danger/70',
    text: 'text-riq-danger',
    glow: 'hover:shadow-riq-danger/20',
    activeBg: 'active:bg-riq-danger/20',
  },
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function NeonButton({
  children,
  variant = 'cyan',
  size = 'md',
  to,
  onClick,
  className = '',
  disabled = false,
  icon,
}: NeonButtonProps) {
  const v = variants[variant]
  const cls = `
    relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold
    bg-gradient-to-r ${v.bg} border ${v.border} ${v.text}
    ${v.activeBg}
    hover:shadow-lg ${v.glow}
    backdrop-blur-sm
    transition-all duration-300
    ${sizes[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `

  const inner = (
    <>
      {icon && <span>{icon}</span>}
      {children}
    </>
  )

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link to={to} className={cls}>{inner}</Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={cls}
    >
      {inner}
    </motion.button>
  )
}
