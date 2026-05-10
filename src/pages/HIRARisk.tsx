import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import SectionHeader from '../components/shared/SectionHeader'
import GlassCard from '../components/shared/GlassCard'
import { generateRiskData } from '../lib/data'
import { Shield, AlertTriangle, Activity, Eye, Flame, Droplets } from 'lucide-react'

function HazardRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const angleRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const s = Math.min(canvas.offsetWidth, canvas.offsetHeight)
    canvas.width = s * 2
    canvas.height = s * 2
    ctx.scale(2, 2)
    const cx = s / 2, cy = s / 2, r = s * 0.4

    const threats = [
      { angle: 0.5, dist: 0.7, label: 'Thermal' },
      { angle: 1.8, dist: 0.85, label: 'Pressure' },
      { angle: 3.2, dist: 0.6, label: 'Vapor' },
      { angle: 4.5, dist: 0.9, label: 'Decomp' },
      { angle: 5.5, dist: 0.75, label: 'Corrosion' },
    ]

    const animate = () => {
      ctx.clearRect(0, 0, s, s)

      // Grid circles
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, (r * i) / 4, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,229,255,${0.05 + i * 0.02})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Grid lines
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI * 2) / 8
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
        ctx.strokeStyle = 'rgba(0,229,255,0.06)'
        ctx.stroke()
      }

      // Sweep
      angleRef.current += 0.02
      const sweepAngle = angleRef.current % (Math.PI * 2)
      const grad = (ctx as any).createConicGradient?.(sweepAngle, cx, cy) 
      if (!grad) {
        // Fallback: draw sweep line
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(sweepAngle) * r, cy + Math.sin(sweepAngle) * r)
        ctx.strokeStyle = 'rgba(0,229,255,0.6)'
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Sweep trail
        for (let j = 0; j < 20; j++) {
          const trailAngle = sweepAngle - j * 0.03
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(cx + Math.cos(trailAngle) * r, cy + Math.sin(trailAngle) * r)
          ctx.strokeStyle = `rgba(0,229,255,${0.3 - j * 0.015})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Threats
      threats.forEach(t => {
        const tx = cx + Math.cos(t.angle) * r * t.dist
        const ty = cy + Math.sin(t.angle) * r * t.dist
        const pulseFactor = 1 + Math.sin(Date.now() * 0.003 + t.angle * 2) * 0.3

        ctx.beginPath()
        ctx.arc(tx, ty, 6 * pulseFactor, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,23,68,0.6)'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(tx, ty, 12 * pulseFactor, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,23,68,0.15)'
        ctx.fill()

        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.font = '9px "JetBrains Mono"'
        ctx.textAlign = 'center'
        ctx.fillText(t.label, tx, ty - 15)
      })

      // Center dot
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#00e5ff'
      ctx.fill()

      requestAnimationFrame(animate)
    }
    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [])

  return <canvas ref={canvasRef} className="w-full aspect-square max-w-[350px] mx-auto" />
}

export default function HIRARisk() {
  const riskData = useMemo(() => generateRiskData(), [])
  const [alerts] = useState([
    { time: '00:12:34', type: 'critical' as const, msg: 'Thermal runaway risk detected — Reactor zone B3 exceeding 285°C threshold' },
    { time: '00:11:58', type: 'warning' as const, msg: 'Pressure buildup detected in condenser unit — 12.3 atm (limit: 15 atm)' },
    { time: '00:10:22', type: 'info' as const, msg: 'Vapor emission levels within safe operating parameters' },
    { time: '00:08:45', type: 'warning' as const, msg: 'Corrosion indicator elevated in acid feed pipeline — Schedule inspection' },
    { time: '00:05:10', type: 'info' as const, msg: 'AI model recalibrated with latest batch data — Confidence: 97.2%' },
  ])

  const radarData = riskData.map(r => ({ subject: r.category, Manual: r.manualScore, REACTIQ: r.aiScore }))

  const alertStyles = {
    critical: { bg: 'bg-riq-danger/10', border: 'border-riq-danger/30', icon: <Flame size={14} className="text-riq-danger" /> },
    warning: { bg: 'bg-riq-warning/10', border: 'border-riq-warning/30', icon: <AlertTriangle size={14} className="text-riq-warning" /> },
    info: { bg: 'bg-riq-cyan/10', border: 'border-riq-cyan/30', icon: <Eye size={14} className="text-riq-cyan" /> },
  }

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader subtitle="MODULE 2" title="HIRA + Risk Detection" description="AI-powered industrial safety system detecting thermal runaway, pressure buildup, and chemical hazards in real-time." align="left" glowColor="#ff1744" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hazard Radar */}
          <div className="lg:col-span-5">
            <GlassCard variant="danger" hover={false} className="!p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} className="text-riq-danger" />
                <h3 className="text-sm font-bold text-white">Hazard Detection Radar</h3>
                <span className="ml-auto flex items-center gap-1 text-xs text-riq-danger font-mono">
                  <span className="h-2 w-2 rounded-full bg-riq-danger animate-pulse" /> SCANNING
                </span>
              </div>
              <HazardRadar />
            </GlassCard>
          </div>

          {/* Risk Scores */}
          <div className="lg:col-span-7 space-y-6">
            {/* Risk cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {riskData.map((risk, i) => {
                const sevColors = { critical: '#ff1744', high: '#ff6d00', medium: '#ffc107' }
                const color = sevColors[risk.severity]
                return (
                  <motion.div
                    key={risk.category}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard hover={false} className="!p-4 !rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity size={12} style={{ color }} />
                        <span className="text-xs font-mono text-riq-text-dim truncate">{risk.category}</span>
                      </div>
                      <div className="text-2xl font-bold mb-1" style={{ color }}>{risk.aiScore}%</div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded text-white font-mono" style={{ background: `${color}30`, border: `1px solid ${color}50` }}>
                          {risk.severity.toUpperCase()}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2 h-1 rounded-full bg-riq-surface overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${risk.aiScore}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }} className="h-full rounded-full" style={{ background: color }} />
                      </div>
                    </GlassCard>
                  </motion.div>
                )
              })}
            </div>

            {/* Manual vs REACTIQ comparison */}
            <GlassCard variant="default" hover={false} className="!p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Droplets size={16} className="text-riq-cyan" /> Manual HIRA vs REACTIQ Detection
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="category" stroke="#9e9e9e" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#9e9e9e" tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="manualScore" name="Manual HIRA" fill="#78909c" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="aiScore" name="REACTIQ AI" fill="#00e5ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
        </div>

        {/* Radar chart + Alert timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <GlassCard variant="default" hover={false} className="!p-5">
            <h3 className="text-sm font-bold text-white mb-4">Risk Profile Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9e9e9e' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#666' }} />
                <Radar name="Manual HIRA" dataKey="Manual" stroke="#78909c" fill="#78909c" fillOpacity={0.2} />
                <Radar name="REACTIQ AI" dataKey="REACTIQ" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard variant="default" hover={false} className="!p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-riq-warning" /> Live Alert Feed
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {alerts.map((alert, i) => {
                const s = alertStyles[alert.type]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className={`flex items-start gap-3 p-3 rounded-lg ${s.bg} border ${s.border}`}
                  >
                    <div className="mt-0.5">{s.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-riq-text leading-relaxed">{alert.msg}</p>
                      <p className="text-[10px] text-riq-text-dim font-mono mt-1">T-{alert.time}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  )
}
