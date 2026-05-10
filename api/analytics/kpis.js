export default function handler(_req, res) {
  res.status(200).json({
    success: true,
    result: {
      arr: 2400, mrr: 200, customers: 42, deployments: 28,
      simulations: 8750, successRate: 95, avgROI: 340,
    },
  })
}
