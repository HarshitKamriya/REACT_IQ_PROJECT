export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { temperature = 150, pressure = 5, catalyst = 'H2SO4', scale = 1000 } = req.body || {}
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

  res.status(200).json({
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
}
