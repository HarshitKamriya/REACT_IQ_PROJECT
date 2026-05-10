import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Line, Legend, AreaChart, Area } from 'recharts'
import SectionHeader from '../components/shared/SectionHeader'
import GlassCard from '../components/shared/GlassCard'
import NeonButton from '../components/shared/NeonButton'
import { generateCPPData } from '../lib/data'
import { Settings, Zap, TrendingUp, Target, CheckCircle, AlertTriangle } from 'lucide-react'

export default function CPPOptimization() {
  const [temperature, setTemperature] = useState(130)
  const [pressure, setPressure] = useState(5)
  const [catalystRatio, setCatalystRatio] = useState(2.5)
  const [mixingSpeed, setMixingSpeed] = useState(300)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const cppData = useMemo(() => generateCPPData(), [])

  const filteredData = cppData.filter(d => Math.abs(d.temperature - temperature) < 30)

  const currentEfficiency = useMemo(() => {
    const eff = 40 + 30 * Math.sin((temperature - 60) * Math.PI / 280) * Math.cos((pressure - 5) * Math.PI / 10) + catalystRatio * 2
    return Math.min(99, Math.max(20, eff)).toFixed(1)
  }, [temperature, pressure, catalystRatio])

  const optimizedParams = {
    temperature: 145,
    pressure: 6.5,
    catalystRatio: 3.0,
    mixingSpeed: 350,
    expectedYield: '94.7%',
    confidence: '96.2%',
  }

  const trendData = Array.from({ length: 20 }, (_, i) => ({
    batch: i + 1,
    yield: 75 + i * 0.8 + Math.sin(i) * 3 + Math.random() * 2,
    consistency: 80 + i * 0.5 + Math.cos(i) * 2 + Math.random() * 2,
    predicted: 76 + i * 0.85,
  }))

  const handleOptimize = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setTemperature(optimizedParams.temperature)
      setPressure(optimizedParams.pressure)
      setCatalystRatio(optimizedParams.catalystRatio)
      setMixingSpeed(optimizedParams.mixingSpeed)
      setIsOptimizing(false)
    }, 1500)
  }

  const params = [
    { label: 'Temperature', value: temperature, min: 60, max: 200, unit: '°C', color: '#ff6d00', set: setTemperature },
    { label: 'Pressure', value: pressure, min: 1, max: 15, step: 0.5, unit: 'atm', color: '#00e5ff', set: setPressure },
    { label: 'Catalyst Ratio', value: catalystRatio, min: 0.5, max: 5, step: 0.1, unit: 'mol%', color: '#ffc107', set: setCatalystRatio },
    { label: 'Mixing Speed', value: mixingSpeed, min: 50, max: 600, step: 10, unit: 'RPM', color: '#2979ff', set: setMixingSpeed },
  ]

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader subtitle="MODULE 4" title="CPP Optimization Engine" description="Automated Critical Process Parameter optimization with AI-driven recommendations and multi-variable tuning." align="left" glowColor="#ffc107" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-3 space-y-4">
            <GlassCard variant="warning" hover={false} className="!p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Settings size={16} className="text-riq-gold" /> Process Parameters
              </h3>
              <div className="space-y-4">
                {params.map(p => (
                  <div key={p.label}>
                    <label className="text-xs text-riq-text-dim font-mono flex justify-between mb-1">
                      <span>{p.label}</span>
                      <span style={{ color: p.color }}>{p.value} {p.unit}</span>
                    </label>
                    <input type="range" min={p.min} max={p.max} step={p.step || 1} value={p.value} onChange={e => p.set(+e.target.value)} className="w-full" style={{ accentColor: p.color }} />
                    {/* Optimal range indicator */}
                    <div className="flex justify-between text-[9px] text-riq-text-dim font-mono mt-0.5">
                      <span>{p.min}</span>
                      <span className="text-riq-success">▲ optimal</span>
                      <span>{p.max}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <NeonButton variant="gold" size="md" onClick={handleOptimize} className="w-full" icon={<Zap size={16} />}>
                  {isOptimizing ? 'Optimizing...' : 'AI Optimize'}
                </NeonButton>
              </div>
            </GlassCard>

            {/* Current efficiency */}
            <GlassCard variant="default" hover={false} className="!p-4 text-center">
              <p className="text-xs text-riq-text-dim font-mono mb-1">CURRENT EFFICIENCY</p>
              <p className="text-4xl font-bold neon-text-cyan">{currentEfficiency}%</p>
              <div className="mt-2 h-2 rounded-full bg-riq-surface overflow-hidden">
                <motion.div animate={{ width: `${currentEfficiency}%` }} className="h-full rounded-full bg-gradient-to-r from-riq-cyan to-riq-blue" />
              </div>
            </GlassCard>
          </div>

          {/* Charts */}
          <div className="lg:col-span-9 space-y-6">
            {/* AI Recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <Target size={16} />, title: 'Optimal Temp', value: `${optimizedParams.temperature}°C`, desc: '+5°C from current', color: '#ff6d00' },
                { icon: <CheckCircle size={16} />, title: 'Predicted Yield', value: optimizedParams.expectedYield, desc: `Confidence: ${optimizedParams.confidence}`, color: '#00e676' },
                { icon: <AlertTriangle size={16} />, title: 'Risk Level', value: 'LOW', desc: 'All params within safe range', color: '#ffc107' },
              ].map((rec, i) => (
                <motion.div key={rec.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <GlassCard hover={false} className="!p-4">
                    <div className="flex items-center gap-2 mb-2" style={{ color: rec.color }}>{rec.icon}<span className="text-xs font-mono">{rec.title}</span></div>
                    <p className="text-xl font-bold text-white">{rec.value}</p>
                    <p className="text-[10px] text-riq-text-dim mt-1">{rec.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Efficiency Scatter */}
            <GlassCard variant="default" hover={false} className="!p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-riq-gold" /> Parameter-Efficiency Correlation
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="temperature" name="Temp" stroke="#9e9e9e" tick={{ fontSize: 10 }} label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5, fill: '#9e9e9e', fontSize: 11 }} />
                  <YAxis dataKey="efficiency" name="Eff" stroke="#9e9e9e" tick={{ fontSize: 10 }} label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft', fill: '#9e9e9e', fontSize: 11 }} />
                  <ZAxis dataKey="pressure" range={[20, 200]} name="Pressure" />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 12, fontSize: 12 }} />
                  <Scatter data={filteredData} fill="#00e5ff" fillOpacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Batch trend */}
            <GlassCard variant="default" hover={false} className="!p-5">
              <h3 className="text-sm font-bold text-white mb-4">Batch Performance Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="batch" stroke="#9e9e9e" tick={{ fontSize: 10 }} label={{ value: 'Batch #', position: 'insideBottom', offset: -5, fill: '#9e9e9e', fontSize: 11 }} />
                  <YAxis stroke="#9e9e9e" tick={{ fontSize: 10 }} domain={[60, 100]} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="yield" name="Yield %" fill="#00e5ff20" stroke="#00e5ff" strokeWidth={2} />
                  <Area type="monotone" dataKey="consistency" name="Consistency %" fill="#ffc10720" stroke="#ffc107" strokeWidth={2} />
                  <Line type="monotone" dataKey="predicted" name="AI Predicted" stroke="#00e676" strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  )
}
