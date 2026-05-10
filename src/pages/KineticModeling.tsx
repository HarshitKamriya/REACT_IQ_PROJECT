import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts'
import SectionHeader from '../components/shared/SectionHeader'
import GlassCard from '../components/shared/GlassCard'
import NeonButton from '../components/shared/NeonButton'
import { generateArrheniusData, REACTIONS } from '../lib/data'
import { Beaker, Thermometer, Gauge, Zap, TrendingUp, FlaskConical } from 'lucide-react'

export default function KineticModeling() {
  const [reactionIdx, setReactionIdx] = useState(0)
  const [temperature, setTemperature] = useState(110)
  const [pressure, setPressure] = useState(5)
  const [residenceTime, setResidenceTime] = useState(120)
  const [isSimulating, setIsSimulating] = useState(false)
  const [apiResult, setApiResult] = useState<Record<string, unknown> | null>(null)

  const rxn = REACTIONS[reactionIdx]
  const arrheniusData = useMemo(() => generateArrheniusData(reactionIdx), [reactionIdx])

  // Reactive conversion data — recomputes when reaction or temperature changes
  const conversionData = useMemo(() => {
    const R = 8.314
    const data = []
    for (let t = 0; t <= 300; t += 10) {
      const k_selected = rxn.A * Math.exp(-rxn.Ea / (R * (temperature + 273.15)))
      const k_lab = k_selected * 1.15
      const k_pilot = k_selected * 1.05
      const k_plant = k_selected * 0.90
      data.push({
        time: t,
        lab: parseFloat((100 * (1 - Math.exp(-k_lab * t * 60))).toFixed(2)),
        pilot: parseFloat((100 * (1 - Math.exp(-k_pilot * t * 60))).toFixed(2)),
        plant: parseFloat((100 * (1 - Math.exp(-k_plant * t * 60))).toFixed(2)),
        heatDissipation: parseFloat((rxn.Ea / 1000 * 2 + temperature * 1.5 * Math.exp(-0.01 * t) * Math.sin(0.05 * t + 1)).toFixed(1)),
      })
    }
    return data
  }, [reactionIdx, temperature, rxn])

  const handleSimulate = async () => {
    setIsSimulating(true)
    try {
      const res = await fetch('/api/simulate/kinetics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature,
          pressure,
          reaction: rxn.name,
          residenceTime,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setApiResult(data.result)
      }
    } catch (err) {
      console.warn('API not available, using client-side calculations', err)
    } finally {
      setIsSimulating(false)
    }
  }

  const R = 8.314
  const T_K = temperature + 273.15
  const rateConstant = rxn.A * Math.exp(-rxn.Ea / (R * T_K))
  const lnK = Math.log(Math.max(rateConstant, 1e-10))
  const predictedConversion = (100 * (1 - Math.exp(-rateConstant * residenceTime * 60))).toFixed(1)

  // Multi-scale comparison — reactive to temperature
  const scaleComparison = useMemo(() => REACTIONS.map(r => {
    const k = r.A * Math.exp(-r.Ea / (R * T_K))
    return {
      reaction: r.shortName,
      rateConstant: k.toExponential(3),
      lnK: Math.log(Math.max(k, 1e-10)).toFixed(3),
      Ea: `${(r.Ea / 1000).toFixed(0)} kJ/mol`,
      A: r.A.toExponential(1),
    }
  }), [temperature, T_K, R])

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader subtitle="MODULE 1" title="AI Kinetic Modeling Engine" description="Predict reaction kinetics using real Arrhenius parameters from 20,000 oleochemical data points." align="left" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Panel */}
          <div className="lg:col-span-3 space-y-4">
            <GlassCard variant="highlight" hover={false} className="!p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FlaskConical size={16} className="text-riq-cyan" /> Reaction Parameters
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-riq-text-dim font-mono mb-1 block">Reaction Type</label>
                  <select value={reactionIdx} onChange={e => setReactionIdx(+e.target.value)} className="w-full px-3 py-2 rounded-lg bg-riq-surface border border-riq-border text-sm text-white focus:border-riq-cyan/40 focus:outline-none transition">
                    {REACTIONS.map((r, i) => (
                      <option key={i} value={i}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-riq-text-dim font-mono mb-1 flex items-center gap-1"><Thermometer size={12} /> Temperature (°C)</label>
                  <input type="range" min={30} max={180} value={temperature} onChange={e => setTemperature(+e.target.value)} className="w-full accent-riq-cyan" />
                  <div className="text-right text-xs text-riq-cyan font-mono">{temperature}°C ({T_K.toFixed(1)} K)</div>
                </div>

                <div>
                  <label className="text-xs text-riq-text-dim font-mono mb-1 flex items-center gap-1"><Gauge size={12} /> Pressure (bar)</label>
                  <input type="range" min={1} max={15} step={0.5} value={pressure} onChange={e => setPressure(+e.target.value)} className="w-full accent-riq-gold" />
                  <div className="text-right text-xs text-riq-gold font-mono">{pressure} bar</div>
                </div>

                <div>
                  <label className="text-xs text-riq-text-dim font-mono mb-1 flex items-center gap-1"><Beaker size={12} /> Residence Time (min)</label>
                  <input type="range" min={10} max={300} step={5} value={residenceTime} onChange={e => setResidenceTime(+e.target.value)} className="w-full accent-riq-orange" />
                  <div className="text-right text-xs text-riq-orange font-mono">{residenceTime} min</div>
                </div>

                <NeonButton variant="cyan" size="md" onClick={handleSimulate} className="w-full" icon={<Zap size={16} />}>
                  {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </NeonButton>
              </div>
            </GlassCard>

            {/* Predictions */}
            <GlassCard variant="default" hover={false} className="!p-4">
              <h4 className="text-xs font-mono text-riq-text-dim mb-3">ML PREDICTIONS</h4>
              <div className="space-y-3">
                {apiResult ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">Rate Constant k</span>
                      <span className="text-xs font-mono text-riq-cyan">{apiResult.rateConstant as string} s⁻¹</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">ln(k)</span>
                      <span className="text-xs font-mono text-riq-cyan">{apiResult.lnK as string}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">Predicted Conversion</span>
                      <span className="text-sm font-bold text-riq-success">{apiResult.predictedConversion as number}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">Scale-Up Success</span>
                      <span className="text-xs font-bold text-riq-success">{apiResult.scaleUpSuccessRate as number}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">Ea</span>
                      <span className="text-xs font-mono text-riq-gold">{(Number(apiResult.activationEnergy) / 1000).toFixed(0)} kJ/mol</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">A (Pre-exp)</span>
                      <span className="text-xs font-mono text-riq-orange">{Number(apiResult.preExponentialFactor).toExponential(2)} s⁻¹</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">Data Points</span>
                      <span className="text-xs font-bold text-riq-success">20,000 Total</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">Rate Constant k</span>
                      <span className="text-xs font-mono text-riq-cyan">{rateConstant.toExponential(3)} s⁻¹</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">ln(k)</span>
                      <span className="text-xs font-mono text-riq-cyan">{lnK.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">Predicted Conversion</span>
                      <span className="text-sm font-bold text-riq-success">{predictedConversion}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">Ea</span>
                      <span className="text-xs font-mono text-riq-gold">{(rxn.Ea / 1000).toFixed(0)} kJ/mol</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">A (Pre-exp)</span>
                      <span className="text-xs font-mono text-riq-orange">{rxn.A.toExponential(2)} s⁻¹</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-riq-text-dim">Data Points</span>
                      <span className="text-xs font-bold text-riq-success">4,000 per reaction</span>
                    </div>
                  </>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Charts */}
          <div className="lg:col-span-9 space-y-6">
            {/* Arrhenius Plot */}
            <GlassCard variant="default" hover={false} className="!p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-riq-cyan" /> Arrhenius Plot — ln(k) vs 1000/T
                </h3>
                <span className="text-xs font-mono text-riq-text-dim">k = {rxn.A.toExponential(1)}·e^(-{(rxn.Ea/1000).toFixed(0)}kJ/RT)</span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={arrheniusData.filter((_, i) => i % 2 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="inverseT" stroke="#9e9e9e" tick={{ fontSize: 10 }} label={{ value: '1000/T (K⁻¹)', position: 'insideBottom', offset: -5, fill: '#9e9e9e', fontSize: 11 }} />
                  <YAxis stroke="#9e9e9e" tick={{ fontSize: 10 }} label={{ value: 'ln(k)', angle: -90, position: 'insideLeft', fill: '#9e9e9e', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="lnK" name={rxn.shortName} stroke={rxn.color} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="lnKBase" name="Oleic Acid (baseline)" stroke="#ffffff40" strokeWidth={1} strokeDasharray="5 5" dot={false} />
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

            {/* Multi-Reaction Comparison Table */}
            <GlassCard variant="default" hover={false} className="!p-5">
              <h3 className="text-sm font-bold text-white mb-4">Multi-Reaction Arrhenius Comparison @ {temperature}°C</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-riq-border">
                      <th className="text-left py-2 text-xs font-mono text-riq-text-dim">Reaction</th>
                      <th className="text-center py-2 text-xs font-mono text-riq-cyan">k (s⁻¹)</th>
                      <th className="text-center py-2 text-xs font-mono text-riq-blue">ln(k)</th>
                      <th className="text-center py-2 text-xs font-mono text-riq-gold">Ea</th>
                      <th className="text-center py-2 text-xs font-mono text-riq-orange">A (s⁻¹)</th>
                    </tr>
                  </thead>
                  <tbody className="text-riq-text-dim">
                    {scaleComparison.map((row, i) => (
                      <tr key={i} className={`border-b border-riq-border/50 ${i === reactionIdx ? 'bg-riq-cyan/5' : ''}`}>
                        <td className="py-2 font-medium text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: REACTIONS[i].color }} />
                          {row.reaction}
                        </td>
                        <td className="py-2 text-center font-mono text-xs">{row.rateConstant}</td>
                        <td className="py-2 text-center font-mono text-xs">{row.lnK}</td>
                        <td className="py-2 text-center font-mono text-xs">{row.Ea}</td>
                        <td className="py-2 text-center font-mono text-xs">{row.A}</td>
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
