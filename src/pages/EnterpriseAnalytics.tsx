import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import SectionHeader from '../components/shared/SectionHeader'
import GlassCard from '../components/shared/GlassCard'
import AnimatedCounter from '../components/shared/AnimatedCounter'
import { generateRevenueData } from '../lib/data'
import { DollarSign, Users, TrendingUp, BarChart3, Globe, Target, ArrowUpRight, Building } from 'lucide-react'

export default function EnterpriseAnalytics() {
  const revenueData = useMemo(() => generateRevenueData(), [])

  const kpis = [
    { label: 'Annual Recurring Revenue', value: 2400, prefix: '₹', suffix: ' Cr', icon: <DollarSign size={18} />, color: '#00e676', trend: '+34%' },
    { label: 'Active Enterprise Clients', value: 42, suffix: '', icon: <Building size={18} />, color: '#00e5ff', trend: '+12' },
    { label: 'Process Simulations', value: 8750, suffix: '+', icon: <BarChart3 size={18} />, color: '#ffc107', trend: '+2.1k' },
    { label: 'Scale-Up Success Rate', value: 95, suffix: '%', icon: <Target size={18} />, color: '#2979ff', trend: '+3%' },
    { label: 'Plant Deployments', value: 28, suffix: '', icon: <Globe size={18} />, color: '#ff6d00', trend: '+8' },
    { label: 'Avg ROI for Clients', value: 340, suffix: '%', icon: <TrendingUp size={18} />, color: '#00e676', trend: '+45%' },
  ]

  const marketData = [
    { name: 'Pharma', value: 35, color: '#00e5ff' },
    { name: 'Specialty Chem', value: 25, color: '#2979ff' },
    { name: 'Agrochemicals', value: 18, color: '#ffc107' },
    { name: 'Polymers', value: 12, color: '#ff6d00' },
    { name: 'Food & Flavor', value: 10, color: '#00e676' },
  ]

  const roiData = [
    { category: 'Time Savings', before: 100, after: 33, unit: 'days' },
    { category: 'Hazard Detection', before: 70, after: 99, unit: '%' },
    { category: 'Scale-Up Cost', before: 100, after: 45, unit: '₹ Lakh' },
    { category: 'Batch Failures', before: 25, after: 3, unit: '%' },
    { category: 'Process Consistency', before: 72, after: 96, unit: '%' },
  ]

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader subtitle="MODULE 5" title="Enterprise Analytics" description="Comprehensive business intelligence center with ARR projections, ROI analytics, and market opportunity mapping." align="left" glowColor="#00e676" />

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard hover={true} className="!p-4 holographic">
                <div className="flex items-center justify-between mb-2">
                  <div style={{ color: kpi.color }}>{kpi.icon}</div>
                  <span className="text-[10px] font-mono text-riq-success flex items-center gap-0.5">
                    <ArrowUpRight size={10} />{kpi.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
                </div>
                <p className="text-[10px] text-riq-text-dim mt-1 leading-tight">{kpi.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <GlassCard variant="default" hover={false} className="!p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-riq-success" /> ARR Growth Projection
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#9e9e9e" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9e9e9e" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="arr" name="ARR (₹ Lakh)" fill="#00e67620" stroke="#00e676" strokeWidth={2} />
                <Area type="monotone" dataKey="mrr" name="MRR (₹ Lakh)" fill="#00e5ff20" stroke="#00e5ff" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Customer Growth */}
          <GlassCard variant="default" hover={false} className="!p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Users size={16} className="text-riq-cyan" /> Customer & Deployment Growth
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#9e9e9e" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9e9e9e" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="customers" name="Customers" stroke="#00e5ff" strokeWidth={2} dot={{ fill: '#00e5ff', r: 3 }} />
                <Line type="monotone" dataKey="deployments" name="Deployments" stroke="#ffc107" strokeWidth={2} dot={{ fill: '#ffc107', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Segmentation */}
          <GlassCard variant="default" hover={false} className="!p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Globe size={16} className="text-riq-gold" /> Market Segmentation
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={marketData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                  {marketData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {marketData.map(m => (
                <div key={m.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                    <span className="text-riq-text-dim">{m.name}</span>
                  </div>
                  <span className="font-mono text-white">{m.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* ROI Comparison */}
          <GlassCard variant="default" hover={false} className="!p-5 lg:col-span-2">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-riq-orange" /> ROI Impact Analysis — Before vs After REACTIQ
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={roiData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="category" stroke="#9e9e9e" tick={{ fontSize: 9 }} />
                <YAxis stroke="#9e9e9e" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="before" name="Before REACTIQ" fill="#78909c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="After REACTIQ" fill="#00e676" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </div>
    </main>
  )
}
