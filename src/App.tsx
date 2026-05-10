import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import LoadingScreen from './components/shared/LoadingScreen'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const KineticModeling = lazy(() => import('./pages/KineticModeling'))
const HIRARisk = lazy(() => import('./pages/HIRARisk'))
const DigitalTwin = lazy(() => import('./pages/DigitalTwin'))
const CPPOptimization = lazy(() => import('./pages/CPPOptimization'))
const EnterpriseAnalytics = lazy(() => import('./pages/EnterpriseAnalytics'))

export default function App() {
  return (
    <div className="min-h-screen bg-riq-black text-riq-text">
      <Navbar />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/kinetic-modeling" element={<KineticModeling />} />
          <Route path="/hira-risk" element={<HIRARisk />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />
          <Route path="/cpp-optimization" element={<CPPOptimization />} />
          <Route path="/enterprise-analytics" element={<EnterpriseAnalytics />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  )
}
