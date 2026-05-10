import HeroSection from '../components/landing/HeroSection'
import StatsBar from '../components/landing/StatsBar'
import FeaturesOverview from '../components/landing/FeaturesOverview'
import WorkflowSection from '../components/landing/WorkflowSection'
import RoadmapSection from '../components/landing/RoadmapSection'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
      <FeaturesOverview />
      <WorkflowSection />
      <RoadmapSection />
    </main>
  )
}
