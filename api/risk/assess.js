export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { temperature = 150, pressure = 5 } = req.body || {}

  const risks = [
    { category: 'Thermal Runaway', score: Math.min(99, 50 + temperature * 0.3), severity: temperature > 200 ? 'critical' : 'high' },
    { category: 'Pressure Buildup', score: Math.min(99, 40 + pressure * 8), severity: pressure > 10 ? 'critical' : 'medium' },
    { category: 'Vapor Emission', score: Math.min(99, 30 + temperature * 0.2 + pressure * 3), severity: 'medium' },
    { category: 'Corrosion', score: 85 + Math.random() * 10, severity: 'medium' },
    { category: 'Decomposition', score: Math.min(99, 45 + temperature * 0.25), severity: temperature > 180 ? 'high' : 'low' },
  ]

  res.status(200).json({
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
}
