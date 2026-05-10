import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts'
import SectionHeader from '../components/shared/SectionHeader'
import GlassCard from '../components/shared/GlassCard'
import NeonButton from '../components/shared/NeonButton'
import { generateArrheniusData, generateConversionData } from '../lib/data'
import { Beaker, Thermometer, Gauge, Zap, TrendingUp, FlaskConical } from 'lucide-react'

export default function KineticModeling() {
  const [temperature, setTemperature] = useState(150)
  const [pressure, setPressure] = useState(5)
  const [catalyst, setCatalyst] = useState('H₂SO₄')
  const [scaleFactor, setScaleFactor] = useState(500)
  const [isSimulating, setIsSimulating] = useState(false)

  const arrheniusData = useMemo(() => generateArrheniusData(), [])
  const conversionData = useMemo(() => generateConversionData(), [])

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => setIsSimulating(false), 2000)
  }

  const predictedYield = Math.min(98, 60 + temperature * 0.15 + pressure * 1.2 - (scaleFactor > 1000 ? 5 : 0)).toFixed(1)
  const rateConstant = (1e12 * Math.exp(-75000 / (8.314 * (temperature + 273.15)))).toExponential(2)

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader subtitle="MODULE 1" title="AI Kinetic Modeling Engine" description="Upload lab-scale reaction data and predict optimal plant-scale conditions using AI-assisted Arrhenius modeling." align="left" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Panel */}
          <div className="lg:col-span-3 space-y-4">
            <GlassCard variant="highlight" hover={false} className="!p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FlaskConical size={16} className="text-riq-cyan" /> Reaction Parameters
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-riq-text-dim font-mono mb-1 block">Catalyst</label>
                  <select value={catalyst} onChange={e => setCatalyst(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-riq-surface border border-riq-border text-sm text-white focus:border-riq-cyan/40 focus:outline-none transition">
                    <option value="H₂SO₄">H₂SO₄ (Sulfuric Acid)</option>
                    <option value="p-TSA">p-TSA (p-Toluenesulfonic)</option>
                    <option value="Amberlyst">Amberlyst-15</option>
                    <option value="Ti(OBu)₄">Ti(OBu)₄ (Titanium)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-riq-text-dim font-mono mb-1 flex items-center gap-1"><Thermometer size={12} /> Temperature (°C)</label>
                  <input type="range" min={60} max={250} value={temperature} onChange={e => setTemperature(+e.target.value)} className="w-full accent-riq-cyan" />
                  <div className="text-right text-xs text-riq-cyan font-mono">{temperature}°C</div>
                </div>

                <div>
                  <label className="text-xs text-riq-text-dim font-mono mb-1 flex items-center gap-1"><Gauge size={12} /> Pressure (atm)</label>
                  <input type="range" min={1} max={15} step={0.5} value={pressure} onChange={e => setPressure(+e.target.value)} className="w-full accent-riq-gold" />
                  <div className="text-right text-xs text-riq-gold font-mono">{pressure} atm</div>
                </div>

                <div>
                  <label className="text-xs text-riq-text-dim font-mono mb-1 flex items-center gap-1"><Beaker size={12} /> Scale (mL → kg)</label>
                  <input type="range" min={500} max={5000} step={100} value={scaleFactor} onChange={e => setScaleFactor(+e.target.value)} className="w-full accent-riq-orange" />
                  <div className="text-right text-xs text-riq-orange font-mono">{scaleFactor >= 1000 ? `${(scaleFactor / 1000).toFixed(1)} L` : `${scaleFactor} mL`} → {scaleFactor} kg</div>
                </div>

                <NeonButton variant="cyan" size="md" onClick={handleSimulate} className="w-full" icon={<Zap size={16} />}>
                  {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </NeonButton>
              </div>
            </GlassCard>

            {/* Quick stats */}
            <GlassCard variant="default" hover={false} className="!p-4">
              <h4 className="text-xs font-mono text-riq-text-dim mb-3">PREDICTIONS</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-riq-text-dim">Predicted Yield</span>
                  <span className="text-sm font-bold text-riq-success">{predictedYield}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-riq-text-dim">Rate Constant k</span>
                  <span className="text-xs font-mono text-riq-cyan">{rateConstant}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-riq-text-dim">Scale Confidence</span>
                  <span className="text-sm font-bold text-riq-gold">{scaleFactor < 2000 ? '94%' : '87%'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-riq-text-dim">Catalyst: {catalyst}</span>
                  <span className="text-xs font-bold text-riq-success">Optimal</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Center & Right: Charts */}
          <div className="lg:col-span-9 space-y-6">
            {/* Arrhenius Plot */}
            <GlassCard variant="default" hover={false} className="!p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-riq-cyan" /> Arrhenius Plot — ln(k) vs 1/T
                </h3>
                <span className="text-xs font-mono text-riq-text-dim">k = A·e^(-Eₐ/RT)</span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={arrheniusData.filter((_, i) => i % 2 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="inverseT" stroke="#9e9e9e" tick={{ fontSize: 10 }} label={{ value: '1000/T (K⁻¹)', position: 'insideBottom', offset: -5, fill: '#9e9e9e', fontSize: 11 }} />
                  <YAxis stroke="#9e9e9e" tick={{ fontSize: 10 }} label={{ value: 'ln(k)', angle: -90, position: 'insideLeft', fill: '#9e9e9e', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="lnK" name="Lab Scale" stroke="#00e5ff" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="lnKScaleUp" name="Scale-Up Predicted" stroke="#ffc107" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conversion Chart */}
              <GlassCard variant="default" hover={false} className="!p-5">
                <h3 className="text-sm font-bold text-white mb-4">Conversion Efficiency Over Time</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="#9e9e9e" tick={{ fontSize: 10 }} label={{ value: 'Time (min)', position: 'insideBottom', offset: -5, fill: '#9e9e9e', fontSize: 11 }} />
                    <YAxis stroke="#9e9e9e" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 12, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="lab" name="Lab (500mL)" fill="#00e5ff20" stroke="#00e5ff" strokeWidth={2} />
                    <Area type="monotone" dataKey="pilot" name="Pilot (50L)" fill="#2979ff20" stroke="#2979ff" strokeWidth={2} />
                    <Area type="monotone" dataKey="plant" name="Plant (1000kg)" fill="#ffc10720" stroke="#ffc107" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>

              {/* Heat Dissipation */}
              <GlassCard variant="default" hover={false} className="!p-5">
                <h3 className="text-sm font-bold text-white mb-4">Heat Dissipation Profile</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="#9e9e9e" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#9e9e9e" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="heatDissipation" name="Heat (W/m²)" fill="#ff6d0040" stroke="#ff6d00" radius={[2, 2, 0, 0]} />
                    <Line type="monotone" dataKey="lab" name="Conversion %" stroke="#00e5ff" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>

            {/* Scale-Up Comparison Table */}
            <GlassCard variant="default" hover={false} className="!p-5">
              <h3 className="text-sm font-bold text-white mb-4">Multi-Scale Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-riq-border">
                      <th className="text-left py-2 text-xs font-mono text-riq-text-dim">Parameter</th>
                      <th className="text-center py-2 text-xs font-mono text-riq-cyan">Lab (500mL)</th>
                      <th className="text-center py-2 text-xs font-mono text-riq-blue">Pilot (50L)</th>
                      <th className="text-center py-2 text-xs font-mono text-riq-gold">Plant ({scaleFactor}kg)</th>
                    </tr>
                  </thead>
                  <tbody className="text-riq-text-dim">
                    {[
                      ['Temperature', `${temperature}°C`, `${temperature + 2}°C`, `${temperature + 5}°C`],
                      ['Pressure', `${pressure} atm`, `${pressure + 0.3} atm`, `${(pressure + 0.8).toFixed(1)} atm`],
                      ['Conversion', '92.4%', '89.1%', `${predictedYield}%`],
                      ['Reaction Time', '90 min', '95 min', '110 min'],
                      ['Heat Transfer', '850 W/m²K', '720 W/m²K', '580 W/m²K'],
                      ['Mixing Re', '12,000', '45,000', '180,000'],
                    ].map(([param, ...vals], i) => (
                      <tr key={i} className="border-b border-riq-border/50">
                        <td className="py-2 font-medium text-white">{param}</td>
                        {vals.map((v, j) => (
                          <td key={j} className="py-2 text-center font-mono text-xs">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  )
}
