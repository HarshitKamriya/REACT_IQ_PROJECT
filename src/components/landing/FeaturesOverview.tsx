import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SectionHeader from '../shared/SectionHeader'
import GlassCard from '../shared/GlassCard'
import { MODULES } from '../../lib/data'
import { ArrowRight } from 'lucide-react'

export default function FeaturesOverview() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle="PLATFORM MODULES"
          title="Enterprise-Grade Intelligence Suite"
          description="Five integrated modules powering the future of esterification scale-up — from lab bench to industrial plant."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((module, i) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={module.path}>
                <GlassCard variant="highlight" className="h-full group">
                  {/* Icon */}
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl mb-4"
                    style={{ background: `${module.color}15`, border: `1px solid ${module.color}30` }}
                  >
                    {module.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-1">{module.title}</h3>
                  <p className="text-xs font-mono mb-3" style={{ color: module.color }}>
                    {module.subtitle}
                  </p>
                  <p className="text-sm text-riq-text-dim leading-relaxed mb-4">
                    {module.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: module.color }}>
                    <span>Explore Module</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
