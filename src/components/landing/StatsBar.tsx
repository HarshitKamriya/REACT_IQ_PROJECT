import { motion } from 'framer-motion'
import AnimatedCounter from '../shared/AnimatedCounter'
import { HERO_STATS } from '../../lib/data'

export default function StatsBar() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-riq-cyan/5 via-transparent to-riq-gold/5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {HERO_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center group holographic"
            >
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  className="neon-text-cyan"
                />
              </div>
              <p className="text-xs text-riq-text-dim uppercase tracking-wider font-mono">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
