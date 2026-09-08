import { useState, type ChangeEvent } from 'react'
import type { FinancialFormState } from '../App'

type BackendResilience = {
  resilience_score?: number
  cash_flow_score?: number
  savings_score?: number
  debt_score?: number
  income_stability_score?: number
  obligation_score?: number
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)

const parseIndianNumber = (value: string) => {
  const cleaned = String(value || '').replace(/,/g, '').replace(/\s+/g, '').trim()
  const numericValue = Number(cleaned)
  return Number.isFinite(numericValue) ? numericValue : 0
}

type FinancialInputProps = {
  form: FinancialFormState
  onChange: (key: keyof FinancialFormState, value: string) => void
  onGenerated?: () => void
}

export default function FinancialInput({ form, onChange, onGenerated }: FinancialInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [resilience, setResilience] = useState<BackendResilience | null>(null)

  const set = (key: keyof FinancialFormState) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange(key, e.target.value)

  const incomeValue = parseIndianNumber(form.income)
  const expensesValue = parseIndianNumber(form.expenses)
  const emiValue = parseIndianNumber(form.emi)
  const goalValue = parseIndianNumber(form.goal)

  const monthlySurplus = Math.max(incomeValue - expensesValue - emiValue, 0)

  const projectionFallback = 'Available after projection'

  const projections = [
    {
      label: 'Monthly surplus',
      value: `₹${formatCurrency(monthlySurplus)}`,
      change: resilience ? `${resilience.cash_flow_score ?? 0}% cash flow` : '+12%',
      up: true,
    },
    {
      label: 'Projected corpus (10Y)',
      value: projectionFallback,
      change: resilience ? `${resilience.resilience_score ?? 0}% resilience` : 'at 8% CAGR',
      up: true,
    },
    {
      label: 'Emergency fund gap',
      value: projectionFallback,
      change: resilience ? `${resilience.savings_score ?? 0}% savings` : 'vs 6-month target',
      up: false,
    },
    {
      label: 'Tax-saving headroom',
      value: projectionFallback,
      change: resilience ? `${resilience.debt_score ?? 0}% debt score` : '80C remaining',
      up: true,
    },
  ]

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('http://127.0.0.1:8000/financial-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          income: incomeValue,
          expenses: expensesValue,
          savings: parseIndianNumber(form.investments),
          debt: 0,
          dependents: 0,
          monthly_obligations: emiValue,
          income_volatility: 0,
          financial_goal: goalValue,
        }),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = await response.json()
      setResilience(data?.resilience ?? null)
      onGenerated?.()
    } catch (err) {
      setError('Could not load the projection. Please try again.')
      setResilience(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-24 px-6 border-t border-[#e4e4e1]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: form */}
          <div>
            <span className="text-xs tracking-widest uppercase text-[#737373] font-medium block mb-5">
              Your financial picture
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f0f0f] leading-[1.1] tracking-tight mb-3">
              Start with your real financial picture.
            </h2>
            <p className="text-[#737373] mb-8 leading-relaxed">
              Enter your numbers and THULIR builds a calibrated projection — not a
              generic template.
            </p>

            <div className="space-y-4">
              {([
                { key: 'income', label: 'Monthly take-home income (₹)' },
                { key: 'expenses', label: 'Monthly fixed expenses (₹)' },
                { key: 'emi', label: 'Total EMI / loan repayments (₹)' },
                { key: 'investments', label: 'Monthly investments / SIPs (₹)' },
                { key: 'goal', label: 'Primary financial goal amount (₹)' },
                { key: 'goalYears', label: 'Target timeline (years)' },
              ] as Array<{ key: keyof FinancialFormState; label: string }>).map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs text-[#737373] mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={(form as any)[key]}
                    onChange={set(key)}
                    className="w-full border border-[#e4e4e1] rounded-lg px-4 py-2.5 text-sm text-[#0f0f0f] bg-white focus:outline-none focus:border-[#162c1a] transition-colors placeholder-[#a3a3a3]"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-6 w-full bg-[#162c1a] text-white text-sm font-medium py-3 rounded-lg hover:bg-[#1f4226] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating projection...' : 'Generate calibrated projection →'}
            </button>

            {error && (
              <div className="mt-3 rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-xs text-[#991b1b]">
                {error}
              </div>
            )}
          </div>

          {/* Right: projection panel */}
          <div className="bg-[#0d1b0f] rounded-2xl p-7 text-white">
            <p className="text-xs text-[#4a6b50] uppercase tracking-wider mb-1">Calibrated projections</p>
            <p className="text-lg font-semibold mb-6">Based on your inputs</p>

            <div className="space-y-4">
              {projections.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center justify-between bg-[#142018] rounded-xl px-4 py-3.5 border border-[#1e3123]"
                >
                  <div>
                    <p className="text-xs text-[#4a6b50] mb-0.5">{p.label}</p>
                    <p className="text-lg font-bold">{p.value}</p>
                  </div>
                  <div
                    className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                      p.up
                        ? 'bg-[#1a3020] text-[#3ecf6e] border border-[#1e4028]'
                        : 'bg-[#2a1a1a] text-[#f87171] border border-[#3a2020]'
                    }`}
                  >
                    {p.change}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#1e3123] pt-5">
              <p className="text-xs text-[#4a6b50] mb-2">Investment required to hit goal</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#3ecf6e]">{projectionFallback}</span>
              </div>
              <p className="text-xs text-[#4a6b50] mt-1">
                {resilience
                  ? `Resilience score: ${resilience.resilience_score ?? 0} / 100`
                  : 'Resilience score: Available after projection'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
