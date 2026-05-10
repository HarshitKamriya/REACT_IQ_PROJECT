import { readFileSync } from 'fs'
import { join } from 'path'

let arrheniusParams, kineticsPredictions, datasetStats, modelMetrics

try {
  const dataDir = join(process.cwd(), 'api', '_ml_data')
  arrheniusParams = JSON.parse(readFileSync(join(dataDir, 'arrhenius_params.json'), 'utf-8'))
  kineticsPredictions = JSON.parse(readFileSync(join(dataDir, 'kinetics_predictions.json'), 'utf-8'))
  datasetStats = JSON.parse(readFileSync(join(dataDir, 'dataset_stats.json'), 'utf-8'))
  modelMetrics = JSON.parse(readFileSync(join(dataDir, 'model_metrics.json'), 'utf-8'))
} catch { /* will fallback to computed values */ }

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { temperature = 110, pressure = 5, reaction = 'Oleic Acid + Methanol Esterific', residenceTime = 120 } = req.body || {}
  const T = temperature + 273.15
  const R = 8.314

  // Find reaction-specific Arrhenius params
  const rxnParam = arrheniusParams?.find(p => reaction.includes(p.reaction?.split(' ')[0])) || { A: 2500000, Ea: 52000 }
  const A = rxnParam.A
  const Ea = rxnParam.Ea
  const k = A * Math.exp(-Ea / (R * T))

  // Get ML predictions if available
  const mlPredictions = kineticsPredictions?.[reaction] || null
  const rxnStats = datasetStats ? Object.values(datasetStats).find((s, i) => Object.keys(datasetStats)[i].includes(reaction.split(' ')[0])) : null

  // Generate conversion curves using real Arrhenius params
  const conversionData = []
  for (let t = 0; t <= 300; t += 10) {
    conversionData.push({
      time: t,
      conversion: parseFloat((100 * (1 - Math.exp(-k * t * 60))).toFixed(2)),
    })
  }

  res.status(200).json({
    success: true,
    result: {
      rateConstant: k.toExponential(4),
      lnK: Math.log(k).toFixed(4),
      activationEnergy: Ea,
      preExponentialFactor: A,
      predictedConversion: rxnStats?.avgConversion || parseFloat((100 * (1 - Math.exp(-k * residenceTime * 60))).toFixed(2)),
      scaleUpSuccessRate: rxnStats?.scaleUpRate || 16.7,
      conversionData,
      mlPredictions,
      modelMetrics: modelMetrics || null,
      arrheniusParams: arrheniusParams || null,
      reaction,
    },
  })
}
