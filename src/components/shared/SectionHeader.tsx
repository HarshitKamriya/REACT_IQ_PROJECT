import { motion } from 'framer-motion'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  align?: 'left' | 'center'
  glowColor?: string
  className?: string
}

export default function SectionHeader({
  title,
  subtitle,
  description,
  align = 'center',
  glowColor = '#00e5ff',
  className = '',
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7 }}
      className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}
    >
      {subtitle && (
        <p
          className="text-xs font-semibold uppercase tracking-[0.25em] mb-3 font-mono"
          style={{ color: glowColor }}
        >
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className={`text-riq-text-dim text-lg leading-relaxed ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {description}
        </p>
      )}
      <div
        className={`mt-6 h-1 w-20 rounded-full ${align === 'center' ? 'mx-auto' : ''}`}
        style={{ background: `linear-gradient(to right, ${glowColor}, transparent)` }}
      />
    </motion.div>
  )
}
