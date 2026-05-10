import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// ===== Simulation Engine API =====

app.post('/api/simulate/kinetics', (req, res) => {
  const { temperature = 150, pressure = 5, catalyst = 'H2SO4', scale = 1000 } = req.body
  const T = temperature + 273.15
  const Ea = 75000
  const A = 1e12
  const R = 8.314
  const k = A * Math.exp(-Ea / (R * T))

  const conversionData = []
  for (let t = 0; t <= 120; t += 5) {
    conversionData.push({
      time: t,
      lab: parseFloat((100 * (1 - Math.exp(-0.035 * t))).toFixed(2)),
      pilot: parseFloat((100 * (1 - Math.exp(-0.030 * t))).toFixed(2)),
      plant: parseFloat((100 * (1 - Math.exp(-0.025 * t))).toFixed(2)),
    })
  }

  res.json({
    success: true,
    result: {
      rateConstant: k.toExponential(3),
      predictedYield: Math.min(98, 60 + temperature * 0.15 + pressure * 1.2).toFixed(1),
      scaleConfidence: scale < 2000 ? '94%' : '87%',
      conversionData,
      recommendations: [
        `Optimal temperature range: ${temperature - 5}°C - ${temperature + 10}°C`,
        `Catalyst ${catalyst} shows optimal performance at ${pressure} atm`,
        `Scale factor ${scale}x requires enhanced heat transfer monitoring`,
      ],
    },
  })
})

// ===== Risk Assessment API =====

app.post('/api/risk/assess', (req, res) => {
  const { temperature = 150, pressure = 5, compounds = [] } = req.body

  const risks = [
    { category: 'Thermal Runaway', score: Math.min(99, 50 + temperature * 0.3), severity: temperature > 200 ? 'critical' : 'high' },
    { category: 'Pressure Buildup', score: Math.min(99, 40 + pressure * 8), severity: pressure > 10 ? 'critical' : 'medium' },
    { category: 'Vapor Emission', score: Math.min(99, 30 + temperature * 0.2 + pressure * 3), severity: 'medium' },
    { category: 'Corrosion', score: 85 + Math.random() * 10, severity: 'medium' },
    { category: 'Decomposition', score: Math.min(99, 45 + temperature * 0.25), severity: temperature > 180 ? 'high' : 'low' },
  ]

  res.json({
    success: true,
    result: {
      overallRisk: temperature > 200 || pressure > 12 ? 'HIGH' : 'MODERATE',
      risks,
      mitigations: [
        'Install redundant pressure relief valves',
        'Implement continuous temperature monitoring with 0.5°C resolution',
        'Deploy automated emergency shutdown system',
      ],
    },
  })
})

// ===== CPP Optimization API =====

app.post('/api/optimize/cpp', (req, res) => {
  const { temperature = 130, pressure = 5, catalystRatio = 2.5 } = req.body

  const currentEfficiency = 40 + 30 * Math.sin((temperature - 60) * Math.PI / 280) * Math.cos((pressure - 5) * Math.PI / 10) + catalystRatio * 2

  res.json({
    success: true,
    result: {
      currentEfficiency: Math.min(99, currentEfficiency).toFixed(1),
      optimizedParams: {
        temperature: 145,
        pressure: 6.5,
        catalystRatio: 3.0,
        mixingSpeed: 350,
      },
      expectedYield: '94.7%',
      confidence: '96.2%',
      recommendations: [
        'Increase temperature by 15°C for optimal conversion',
        'Adjust catalyst ratio to 3.0 mol% for maximum yield',
        'Monitor viscosity changes during scale-up',
      ],
    },
  })
})

// ===== Analytics API =====

app.get('/api/analytics/kpis', (_req, res) => {
  res.json({
    success: true,
    result: {
      arr: 2400,
      mrr: 200,
      customers: 42,
      deployments: 28,
      simulations: 8750,
      successRate: 95,
      avgROI: 340,
    },
  })
})

app.get('/api/analytics/revenue', (_req, res) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const data = months.map((month, i) => ({
    month,
    arr: Math.round(200 + i * 150 + i * i * 20),
    mrr: Math.round((200 + i * 150 + i * i * 20) / 12),
    customers: Math.round(5 + i * 3),
    deployments: Math.round(2 + i * 2),
  }))
  res.json({ success: true, result: data })
})

// ===== Health Check =====

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', platform: 'REACTIQ', version: '2.0.0', uptime: process.uptime() })
})

app.listen(PORT, () => {
  console.log(`\n🔬 REACTIQ Backend Server running on http://localhost:${PORT}`)
  console.log(`📊 API endpoints:`)
  console.log(`   POST /api/simulate/kinetics`)
  console.log(`   POST /api/risk/assess`)
  console.log(`   POST /api/optimize/cpp`)
  console.log(`   GET  /api/analytics/kpis`)
  console.log(`   GET  /api/analytics/revenue`)
  console.log(`   GET  /api/health\n`)
})
