import { motion } from 'framer-motion'
import SectionHeader from '../shared/SectionHeader'
import { ROADMAP } from '../../lib/data'

const statusStyles = {
  completed: { bg: 'bg-riq-success/10', border: 'border-riq-success/40', dot: 'bg-riq-success', text: 'text-riq-success' },
  active: { bg: 'bg-riq-cyan/10', border: 'border-riq-cyan/40', dot: 'bg-riq-cyan animate-pulse', text: 'text-riq-cyan' },
  upcoming: { bg: 'bg-riq-surface', border: 'border-riq-border', dot: 'bg-riq-gray', text: 'text-riq-text-dim' },
}

export default function RoadmapSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader subtitle="ROADMAP" title="12-Month Growth Trajectory" description="Strategic roadmap from MVP to global scale deployment." glowColor="#00e676" />
        <div className="relative">
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-riq-success/40 via-riq-cyan/40 to-riq-border" />
          <div className="space-y-8">
            {ROADMAP.map((item, i) => {
              const s = statusStyles[item.status]
              const isRight = i % 2 === 1
              return (
                <motion.div
                  key={item.month}
                  initial={{ opacity: 0, x: isRight ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-center ${isRight ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 z-10">
                    <div className={`h-4 w-4 rounded-full ${s.dot} ring-4 ring-riq-black`} />
                  </div>
                  <div className={`ml-12 lg:ml-0 lg:w-1/2 ${isRight ? 'lg:pl-12' : 'lg:pr-12 lg:text-right'}`}>
                    <div className={`glass-card p-5 ${s.bg} border ${s.border}`}>
                      <span className={`text-xs font-mono font-bold ${s.text}`}>{item.month}</span>
                      <h4 className="text-base font-bold text-white mt-1">{item.title}</h4>
                      <p className="text-sm text-riq-text-dim mt-1">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
