export default function handler(_req, res) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const data = months.map((month, i) => ({
    month,
    arr: Math.round(200 + i * 150 + i * i * 20),
    mrr: Math.round((200 + i * 150 + i * i * 20) / 12),
    customers: Math.round(5 + i * 3),
    deployments: Math.round(2 + i * 2),
  }))
  res.status(200).json({ success: true, result: data })
}
