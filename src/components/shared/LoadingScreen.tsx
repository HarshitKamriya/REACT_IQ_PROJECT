import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-riq-black">
      <div className="text-center">
        <motion.div
          className="mx-auto mb-6 h-16 w-16 rounded-full border-2 border-riq-cyan/30"
          style={{ borderTopColor: '#00e5ff' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.h2
          className="text-2xl font-bold neon-text-cyan tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          REACTIQ
        </motion.h2>
        <p className="mt-2 text-sm text-riq-text-dim font-mono">Initializing systems...</p>
      </div>
    </div>
  )
}
