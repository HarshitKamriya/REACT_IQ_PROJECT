export default function handler(_req, res) {
  res.status(200).json({
    status: 'ok',
    platform: 'REACTIQ',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  })
}
