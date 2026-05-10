import { readFileSync } from 'fs'
import { join } from 'path'

let modelMetrics

try {
  const dataDir = join(process.cwd(), 'api', '_ml_data')
  modelMetrics = JSON.parse(readFileSync(join(dataDir, 'model_metrics.json'), 'utf-8'))
} catch { /* fallback */ }

export default function handler(_req, res) {
  res.status(200).json({
    success: true,
    result: {
      arr: 2400, mrr: 200, customers: 42, deployments: 28,
      simulations: 20000, successRate: 99.45, avgROI: 340,
      mlModels: modelMetrics || null,
      dataPoints: 20000,
      reactions: 5,
    },
  })
}
