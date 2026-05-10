import { motion } from 'framer-motion'
import SectionHeader from '../shared/SectionHeader'
import { WORKFLOW_STEPS } from '../../lib/data'

export default function WorkflowSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle="IMPLEMENTATION WORKFLOW"
          title="From Lab to Plant in 5 Steps"
          description="A streamlined AI-powered pipeline that transforms lab-scale experiments into optimized industrial processes."
          glowColor="#ffc107"
        />
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-riq-cyan/30 to-transparent -translate-y-1/2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {WORKFLOW_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass-card p-5 text-center h-full relative group">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-riq-black border border-riq-cyan/40 text-xs font-bold text-riq-cyan font-mono">
                    {step.step}
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className="mx-auto mt-2 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                    style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)' }}
                  >
                    {step.icon}
                  </motion.div>
                  <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-riq-text-dim leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
