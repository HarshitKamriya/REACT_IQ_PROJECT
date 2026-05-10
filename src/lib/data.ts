// ===== REACTIQ Constants & Simulated Data =====

export const MODULES = [
  {
    id: 'kinetic-modeling',
    title: 'AI Kinetic Modeling',
    subtitle: 'Predictive Scale-Up Engine',
    description: 'Upload lab-scale data and predict optimal plant-scale conditions using AI-assisted Arrhenius modeling and kinetic profiling.',
    icon: '⚗️',
    path: '/kinetic-modeling',
    color: '#00e5ff',
  },
  {
    id: 'hira-risk',
    title: 'HIRA + Risk Detection',
    subtitle: 'Industrial Safety AI',
    description: 'AI-powered hazard identification detecting thermal runaway, pressure buildup, and chemical decomposition risks in real-time.',
    icon: '🛡️',
    path: '/hira-risk',
    color: '#ff1744',
  },
  {
    id: 'digital-twin',
    title: 'Digital Twin Simulation',
    subtitle: 'Virtual Reactor Environment',
    description: 'Interactive 3D digital twin with real-time thermal mapping, pressure visualization, and fluid flow simulation.',
    icon: '🏭',
    path: '/digital-twin',
    color: '#2979ff',
  },
  {
    id: 'cpp-optimization',
    title: 'CPP Optimization',
    subtitle: 'Process Parameter Intelligence',
    description: 'Automated optimization of Critical Process Parameters with AI-driven recommendations and multi-variable tuning.',
    icon: '⚙️',
    path: '/cpp-optimization',
    color: '#ffc107',
  },
  {
    id: 'enterprise-analytics',
    title: 'Enterprise Analytics',
    subtitle: 'Business Intelligence Center',
    description: 'Comprehensive ARR projections, ROI analytics, scale-up tracking, and AI-generated financial insights.',
    icon: '📊',
    path: '/enterprise-analytics',
    color: '#00e676',
  },
]

export const HERO_STATS = [
  { value: 95, suffix: '%', label: 'Pilot Success Rate' },
  { value: 3, suffix: 'X', label: 'Faster Time-to-Market' },
  { value: 99, suffix: '%', label: 'Hazard Detection' },
  { value: 3800, prefix: '₹', suffix: ' Cr+', label: 'TAM Opportunity' },
  { value: 200, suffix: '+', label: 'Process Simulations' },
]

export const WORKFLOW_STEPS = [
  { step: 1, title: 'Data Collection', description: 'Upload lab-scale reaction data, catalyst parameters, and experimental conditions', icon: '📥' },
  { step: 2, title: 'Model Training', description: 'AI processes kinetic models using Arrhenius equations and thermodynamic analysis', icon: '🧠' },
  { step: 3, title: 'Safety Validation', description: 'Automated HIRA identifies thermal runaway, pressure risks, and decomposition hazards', icon: '🛡️' },
  { step: 4, title: 'Scale-Up Recommendation', description: 'AI generates optimal plant-scale parameters with confidence scoring', icon: '📈' },
  { step: 5, title: 'Industrial Deployment', description: 'Digital twin simulation validates parameters before physical plant deployment', icon: '🏭' },
]

export const ROADMAP = [
  { month: 'M1-M2', title: 'MVP Launch', description: 'Core kinetic modeling engine + HIRA module', status: 'completed' as const },
  { month: 'M3-M4', title: 'Digital Twin Beta', description: '3D reactor simulation + thermal mapping', status: 'completed' as const },
  { month: 'M5-M6', title: 'Enterprise Suite', description: 'CPP optimization + analytics dashboard', status: 'active' as const },
  { month: 'M7-M8', title: 'AI Expansion', description: 'Advanced ML models + predictive analytics', status: 'upcoming' as const },
  { month: 'M9-M10', title: 'Market Penetration', description: 'Pharma & specialty chemicals verticals', status: 'upcoming' as const },
  { month: 'M11-M12', title: 'Global Scale', description: 'Multi-plant orchestration + API marketplace', status: 'upcoming' as const },
]

// ===== Simulated Scientific Data Generators =====

export function generateArrheniusData() {
  const data = []
  for (let T = 300; T <= 500; T += 5) {
    const Ea = 75000 // Activation energy (J/mol)
    const A = 1e12 // Pre-exponential factor
    const R = 8.314
    const k = A * Math.exp(-Ea / (R * T))
    const kScaleUp = A * 1.05 * Math.exp(-(Ea * 0.98) / (R * T))
    data.push({
      temperature: T,
      tempCelsius: T - 273.15,
      inverseT: (1000 / T).toFixed(3),
      rateConstant: k,
      rateConstantScaleUp: kScaleUp,
      lnK: Math.log(k),
      lnKScaleUp: Math.log(kScaleUp),
    })
  }
  return data
}

export function generateConversionData() {
  const data = []
  for (let t = 0; t <= 120; t += 5) {
    const labConversion = 100 * (1 - Math.exp(-0.035 * t))
    const pilotConversion = 100 * (1 - Math.exp(-0.030 * t))
    const plantConversion = 100 * (1 - Math.exp(-0.025 * t))
    data.push({
      time: t,
      lab: parseFloat(labConversion.toFixed(2)),
      pilot: parseFloat(pilotConversion.toFixed(2)),
      plant: parseFloat(plantConversion.toFixed(2)),
      heatDissipation: 50 + 200 * Math.exp(-0.02 * t) * Math.sin(0.1 * t + 1),
    })
  }
  return data
}

export function generateRiskData() {
  return [
    { category: 'Thermal Runaway', manualScore: 45, aiScore: 97, severity: 'critical' as const, probability: 0.12 },
    { category: 'Pressure Buildup', manualScore: 60, aiScore: 95, severity: 'high' as const, probability: 0.08 },
    { category: 'Vapor Emission', manualScore: 55, aiScore: 92, severity: 'medium' as const, probability: 0.15 },
    { category: 'Corrosion', manualScore: 70, aiScore: 98, severity: 'medium' as const, probability: 0.05 },
    { category: 'Decomposition', manualScore: 40, aiScore: 96, severity: 'high' as const, probability: 0.10 },
    { category: 'Exothermic Excess', manualScore: 50, aiScore: 94, severity: 'critical' as const, probability: 0.07 },
  ]
}

export function generateCPPData() {
  const data = []
  for (let temp = 60; temp <= 200; temp += 10) {
    for (let pressure = 1; pressure <= 10; pressure += 1) {
      const efficiency = 40 + 30 * Math.sin((temp - 60) * Math.PI / 280) * Math.cos((pressure - 5) * Math.PI / 10) + Math.random() * 5
      data.push({
        temperature: temp,
        pressure,
        efficiency: parseFloat(efficiency.toFixed(1)),
        yield: parseFloat((efficiency * 0.92 + Math.random() * 3).toFixed(1)),
        consistency: parseFloat((85 + Math.random() * 12).toFixed(1)),
      })
    }
  }
  return data
}

export function generateRevenueData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map((month, i) => ({
    month,
    arr: Math.round(200 + i * 150 + i * i * 20 + Math.random() * 50),
    mrr: Math.round((200 + i * 150 + i * i * 20) / 12 + Math.random() * 10),
    customers: Math.round(5 + i * 3 + Math.random() * 2),
    deployments: Math.round(2 + i * 2 + Math.random() * 3),
  }))
}

export function generateThermalData(gridSize: number = 20) {
  const data: number[][] = []
  for (let i = 0; i < gridSize; i++) {
    const row: number[] = []
    for (let j = 0; j < gridSize; j++) {
      const cx = gridSize / 2, cy = gridSize / 2
      const dist = Math.sqrt((i - cx) ** 2 + (j - cy) ** 2)
      const temp = 350 - dist * 8 + Math.random() * 20
      row.push(Math.max(280, Math.min(400, temp)))
    }
    data.push(row)
  }
  return data
}

export const EQUATIONS = [
  'k = A·e^(-Eₐ/RT)',
  'ΔG = ΔH - TΔS',
  'r = k·[A]ⁿ·[B]ᵐ',
  'ln(k₂/k₁) = Eₐ/R·(1/T₁ - 1/T₂)',
  'Cp·dT/dt = ΔHᵣ·r·V - UA(T-Tc)',
  'Re = ρvD/μ',
  'Nu = 0.023·Re⁰·⁸·Pr⁰·⁴',
]
