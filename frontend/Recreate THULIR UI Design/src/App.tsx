import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import FeatureHighlight from './components/FeatureHighlight'
import StatsBar from './components/StatsBar'
import FinancialInput from './components/FinancialInput'
import Preparedness from './components/Preparedness'
import Trajectory from './components/Trajectory'
import ScenarioTool from './components/ScenarioTool'
import PressureMetrics from './components/PressureMetrics'
import SavingsScenarios from './components/SavingsScenarios'
import AIChat from './components/AIChat'
import HowItWorks from './components/HowItWorks'
import CTASection from './components/CTASection'
import FAQ from './components/FAQ'

export type FinancialFormState = {
  income: string
  expenses: string
  emi: string
  investments: string
  goal: string
  goalYears: string
}

const defaultFinancialForm: FinancialFormState = {
  income: '1,20,000',
  expenses: '64,000',
  emi: '17,500',
  investments: '18,500',
  goal: '50,00,000',
  goalYears: '10',
}

export default function App() {
  const [financialForm, setFinancialForm] = useState<FinancialFormState>(defaultFinancialForm)
  const [trajectoryRefreshKey, setTrajectoryRefreshKey] = useState(0)

  const updateFinancialForm = (key: keyof FinancialFormState, value: string) => {
    setFinancialForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleFinancialProjectionGenerated = () => {
    setTrajectoryRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Nav />
      <main>
        <Hero />
        <FeatureHighlight />
        <StatsBar />
        <FinancialInput
          form={financialForm}
          onChange={updateFinancialForm}
          onGenerated={handleFinancialProjectionGenerated}
        />
        <Preparedness financialForm={financialForm} preparednessRefreshKey={trajectoryRefreshKey} />
        <Trajectory financialForm={financialForm} trajectoryRefreshKey={trajectoryRefreshKey} />
        <ScenarioTool />
        <PressureMetrics financialForm={financialForm} />
        <SavingsScenarios financialForm={financialForm} />
        <AIChat financialForm={financialForm} />
        <HowItWorks />
        <CTASection />
        <FAQ />
      </main>
    </div>
  )
}
