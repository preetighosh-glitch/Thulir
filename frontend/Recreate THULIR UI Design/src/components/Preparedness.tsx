import { useEffect, useState } from 'react'
import type { FinancialFormState } from '../App'

type RiskMetric = {
  label: string
  value: string
  status: 'good' | 'warn'
  detail: string
}

const LAST_VALUES_KEY = 'thulir_last_anomaly_snapshot'

function parseIndianNumber(value: string) {
  const cleaned = String(value || '').replace(/,/g, '').replace(/\s+/g, '').trim()
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

function getCurrentFinancialSnapshot() {
  const findInputValue = (labelText: string) => {
    const labels = Array.from(document.querySelectorAll('label'))
    const label = labels.find((item) => item.textContent?.trim() === labelText)
    const input = label?.parentElement?.querySelector('input') as HTMLInputElement | null
    return parseIndianNumber(input?.value ?? '0')
  }

  return {
    income: findInputValue('Monthly take-home income (₹)'),
    expenses: findInputValue('Monthly fixed expenses (₹)'),
    debt_payment: findInputValue('Total EMI / loan repayments (₹)'),
  }
}

function CircleGauge({ score }: { score: number }) {
  const r = 80
  const circ = 2 * Math.PI * r
  const pct = score / 100
  const dash = circ * pct
  const gap = circ - dash

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#1e3123" strokeWidth="12" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="#3ecf6e"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          strokeDashoffset={circ / 4}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-5xl font-bold text-white leading-none">{score}</span>
        <span className="text-sm text-[#4a6b50] block mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

type PreparednessProps = {
  financialForm: FinancialFormState
  preparednessRefreshKey?: number
}

export default function Preparedness({ financialForm, preparednessRefreshKey }: PreparednessProps) {
  const [anomalies, setAnomalies] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resilienceScore, setResilienceScore] = useState(0)

  useEffect(() => {
    const loadResilience = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/financial-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            income: parseIndianNumber(financialForm.income),
            expenses: parseIndianNumber(financialForm.expenses),
            savings: parseIndianNumber(financialForm.investments),
            debt: 0,
            dependents: 0,
            monthly_obligations: parseIndianNumber(financialForm.emi),
            income_volatility: 0,
            financial_goal: parseIndianNumber(financialForm.goal),
          }),
        })

        if (!response.ok) {
          throw new Error('Unable to fetch resilience')
        }

        const data = await response.json()
        const nextScore = typeof data?.resilience?.resilience_score === 'number'
          ? data.resilience.resilience_score
          : 0

        setResilienceScore(Math.max(0, Math.min(100, nextScore)))
      } catch (err) {
        setResilienceScore(0)
      }
    }

    void loadResilience()
  }, [financialForm, preparednessRefreshKey])

  useEffect(() => {
    const loadAnomalies = async () => {
      const current = getCurrentFinancialSnapshot()
      const previousRaw = localStorage.getItem(LAST_VALUES_KEY)
      const previous = previousRaw ? JSON.parse(previousRaw) : null

      setLoading(true)
      setError('')

      try {
        const response = await fetch('http://127.0.0.1:8000/api/anomalies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            current_data: current,
            previous_data: previous,
          }),
        })

        if (!response.ok) {
          throw new Error('Unable to fetch anomalies')
        }

        const data = await response.json()
        const nextAnomalies = Array.isArray(data?.anomalies) ? data.anomalies : []
        setAnomalies(nextAnomalies)
        localStorage.setItem(LAST_VALUES_KEY, JSON.stringify(current))
      } catch (err) {
        setAnomalies([])
        setError('Could not load risk insights.')
      } finally {
        setLoading(false)
      }
    }

    void loadAnomalies()
  }, [])

  const metrics: RiskMetric[] = anomalies.length > 0
    ? anomalies.map((message, index) => ({
        label: `Risk signal ${index + 1}`,
        value: 'Alert',
        status: 'warn',
        detail: message,
      }))
    : [
        {
          label: 'Financial signal',
          value: 'Healthy',
          status: 'good',
          detail: 'No major anomalies detected in the current data.',
        },
      ]

  const score = Math.max(0, Math.min(100, resilienceScore))

  return (
    <section className="bg-[#0d1b0f] py-24 px-6 mt-0">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="text-xs tracking-widest uppercase text-[#4a6b50] font-medium block mb-5">
              Financial preparedness index
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-[1.1] tracking-tight mb-5">
              Know how prepared you are for what's next.
            </h2>
            <p className="text-[#4a6b50] leading-relaxed mb-10">
              A composite score across six dimensions of financial health —
              updated continuously as your data changes.
            </p>
            <div className="flex justify-center md:justify-start">
              <div className="text-center">
                <CircleGauge score={score} />
                <p className="text-sm text-[#4a6b50] mt-3">Overall preparedness score</p>
              </div>
            </div>
          </div>

          {/* Right: metric list */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center gap-4 bg-[#142018] border border-[#1e3123] rounded-xl px-4 py-3.5">
                <div className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium leading-tight">Checking financial signals…</p>
                  <p className="text-xs text-[#4a6b50] mt-0.5">Loading the latest anomaly scan.</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center gap-4 bg-[#142018] border border-[#1e3123] rounded-xl px-4 py-3.5">
                <div className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium leading-tight">Risk check unavailable</p>
                  <p className="text-xs text-[#4a6b50] mt-0.5">{error}</p>
                </div>
              </div>
            ) : (
              metrics.map((m) => (
                <div
                  key={`${m.label}-${m.detail}`}
                  className="flex items-center gap-4 bg-[#142018] border border-[#1e3123] rounded-xl px-4 py-3.5"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      m.status === 'good' ? 'bg-[#3ecf6e]' : 'bg-[#fbbf24]'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium leading-tight">{m.label}</p>
                    <p className="text-xs text-[#4a6b50] mt-0.5 break-words">{m.detail}</p>
                  </div>
                  <div
                    className={`text-sm font-bold flex-shrink-0 ${
                      m.status === 'good' ? 'text-[#3ecf6e]' : 'text-[#fbbf24]'
                    }`}
                  >
                    {m.value}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
