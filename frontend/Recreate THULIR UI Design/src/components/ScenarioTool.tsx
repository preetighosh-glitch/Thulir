import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const baseData = [
  { t: 'Now', current: 420000, scenario: 420000 },
  { t: '3M', current: 458000, scenario: 390000 },
  { t: '6M', current: 501000, scenario: 365000 },
  { t: '9M', current: 539000, scenario: 352000 },
  { t: '1Y', current: 582000, scenario: 368000 },
  { t: '18M', current: 651000, scenario: 445000 },
  { t: '2Y', current: 723000, scenario: 534000 },
  { t: '3Y', current: 871000, scenario: 712000 },
]

const fmt = (v: number) => `₹${(v / 100000).toFixed(1)}L`

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#e4e4e1] rounded-lg px-3 py-2 shadow-sm text-xs space-y-1">
      <p className="text-[#737373]">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function ScenarioTool() {
  const [scenario, setScenario] = useState('Buy a house in Mumbai')
  const [lumpsum, setLumpsum] = useState('8,00,000')
  const [newEmi, setNewEmi] = useState('28,500')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [backendResponse, setBackendResponse] = useState<any>(null)

  const formatIndianCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)

  const parseCurrency = (value: string) => {
    const cleaned = Number(String(value).replace(/[^0-9.-]/g, ''))
    return Number.isFinite(cleaned) ? cleaned : 0
  }

  const items = [
    { label: 'Down payment', amount: `₹${formatIndianCurrency(parseCurrency(lumpsum))}`, note: 'From savings' },
    { label: 'New EMI', amount: `₹${formatIndianCurrency(parseCurrency(newEmi))}`, note: 'Per month' },
    { label: 'Registration + stamp', amount: '₹3,20,000', note: 'One-time' },
    { label: 'Maintenance reserve', amount: '₹3,000', note: 'Per month' },
  ]

  const chartData = (() => {
    const trajectory = backendResponse?.simulation?.trajectory

    if (!trajectory || !Array.isArray(trajectory) || trajectory.length === 0) {
      return baseData
    }

    const scenarioPoints = [{ t: 'Now', current: baseData[0].current, scenario: Number(backendResponse.simulation.liquidity ?? baseData[0].scenario) }]

    trajectory.forEach((point: any, index: number) => {
      const monthLabel = index === 0 ? '1M' : `${index + 1}M`
      scenarioPoints.push({
        t: monthLabel,
        current: baseData[Math.min(index + 1, baseData.length - 1)]?.current ?? baseData[baseData.length - 1].current,
        scenario: Number(point.remaining_liquidity ?? point.remainingLiquidity ?? baseData[0].scenario),
      })
    })

    return scenarioPoints
  })()

  const handleRunScenario = async () => {
    setLoading(true)
    setError('')

    try {
      const numericLumpsum = parseCurrency(lumpsum)
      const numericEmi = parseCurrency(newEmi)
      const income = Math.max(0, numericLumpsum * 2)
      const expenses = Math.max(0, numericEmi * 2)
      const liquidity = Math.max(0, numericLumpsum * 3)
      const savings = Math.max(0, numericLumpsum * 0.25)
      const formattedLumpsum = formatIndianCurrency(numericLumpsum)
      const formattedEmi = formatIndianCurrency(numericEmi)

      const requestBody = {
        question: `${scenario || 'Scenario'} — What if I make a major purchase with ₹${formattedLumpsum} upfront and ₹${formattedEmi} additional monthly EMI?`,
        financial_data: {
          income,
          expenses,
          liquidity,
          savings,
        },
        income_history: Array.from({ length: 6 }, (_, index) =>
          Number((income * (0.96 + index * 0.015)).toFixed(0))
        ),
        expense_history: Array.from({ length: 6 }, (_, index) =>
          Number((expenses * (1 + index * 0.025)).toFixed(0))
        ),
        emergency_target: Math.max(0, expenses * 6),
        forecast_months: 6,
        debt_payment: numericEmi,
      }

      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error('Unable to fetch scenario result')
      }

      const data = await response.json()
      setBackendResponse(data)
    } catch (err) {
      setError('Could not load the scenario. Please try again.')
      setBackendResponse(null)
    } finally {
      setLoading(false)
    }
  }

  const impactSummary = (() => {
    const trajectory = backendResponse?.simulation?.trajectory
    const forecast = Array.isArray(backendResponse?.forecast) ? backendResponse.forecast : []

    if (!trajectory || !Array.isArray(trajectory) || trajectory.length === 0) {
      return 'Scenario impact data is not available yet. Run the scenario to calculate the backend projection.'
    }

    const numericTrajectory = trajectory
      .map((point: any) => Number(point?.remaining_liquidity ?? point?.remainingLiquidity ?? NaN))
      .filter((value: number) => Number.isFinite(value))

    if (numericTrajectory.length < 2) {
      return 'This scenario reduces your projected liquidity over the available forecast period. A longer forecast is needed for an exact 3-year impact.'
    }

    const startLiquidity = numericTrajectory[0]
    const endLiquidity = numericTrajectory[numericTrajectory.length - 1]
    const reduction = Math.max(startLiquidity - endLiquidity, 0)
    const reductionText = `₹${(reduction / 100000).toFixed(2).replace(/\.00$/, '')}L`
    const baseMessage = `This scenario reduces your projected liquidity by ${reductionText} over the available forecast period.`

    if (!forecast.length) {
      return baseMessage
    }

    const delayMonth = forecast.findIndex((row: any) => {
      const futureLiquidity = Number(row?.['Future Liquidity'] ?? NaN)
      return Number.isFinite(futureLiquidity) && futureLiquidity < startLiquidity
    })

    if (delayMonth >= 0) {
      return `${baseMessage} The goal is delayed by approximately ${delayMonth + 1} months.`
    }

    return 'This scenario reduces your projected liquidity over the available forecast period. A longer forecast is needed for an exact 3-year impact.'
  })()

  return (
    <section className="py-24 px-6 border-t border-[#e4e4e1]">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs tracking-widest uppercase text-[#737373] font-medium block mb-5">
          Scenario planning
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f0f0f] leading-[1.1] tracking-tight mb-3">
          Try the future before you live it.
        </h2>
        <p className="text-[#737373] mb-10 max-w-lg leading-relaxed">
          Model any financial decision — a home purchase, career change, or
          large expense — and see the exact impact on your trajectory.
        </p>

        <div className="grid md:grid-cols-5 gap-10 items-start">
          {/* Left: inputs */}
          <div className="md:col-span-2 space-y-5">
            <div>
              <label className="block text-xs text-[#737373] mb-1.5">Scenario name</label>
              <input
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full border border-[#e4e4e1] rounded-lg px-4 py-2.5 text-sm text-[#0f0f0f] focus:outline-none focus:border-[#162c1a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[#737373] mb-1.5">One-time lumpsum outflow (₹)</label>
              <input
                value={lumpsum}
                onChange={(e) => setLumpsum(e.target.value)}
                className="w-full border border-[#e4e4e1] rounded-lg px-4 py-2.5 text-sm text-[#0f0f0f] focus:outline-none focus:border-[#162c1a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[#737373] mb-1.5">Additional monthly EMI (₹)</label>
              <input
                value={newEmi}
                onChange={(e) => setNewEmi(e.target.value)}
                className="w-full border border-[#e4e4e1] rounded-lg px-4 py-2.5 text-sm text-[#0f0f0f] focus:outline-none focus:border-[#162c1a] transition-colors"
              />
            </div>

            <div className="border border-[#e4e4e1] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-[#f8f8f6] border-b border-[#e4e4e1]">
                <p className="text-xs font-medium text-[#0f0f0f]">Scenario cost breakdown</p>
              </div>
              {items.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-4 py-3 border-b border-[#e4e4e1] last:border-0">
                  <div>
                    <p className="text-sm text-[#0f0f0f]">{item.label}</p>
                    <p className="text-xs text-[#737373]">{item.note}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#0f0f0f]">{item.amount}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleRunScenario}
              disabled={loading}
              className="w-full bg-[#162c1a] text-white text-sm font-medium py-3 rounded-lg hover:bg-[#1f4226] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Running scenario...' : 'Run scenario →'}
            </button>

            {error && (
              <div className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-xs text-[#991b1b]">
                {error}
              </div>
            )}
          </div>

          {/* Right: chart */}
          <div className="md:col-span-3">
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-[#737373]">
                <div className="w-5 h-0.5 bg-[#22854a]" /> Current trajectory
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#737373]">
                <div className="w-5 h-0.5 bg-[#ef4444] border-dashed" style={{ borderTop: '1.5px dashed #ef4444', height: 0 }} />
                <div className="w-5 border-t-2 border-dashed border-[#ef4444]" /> {scenario || 'Scenario'}
              </div>
            </div>
            <div className="border border-[#e4e4e1] rounded-xl p-5">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e1" vertical={false} />
                  <XAxis dataKey="t" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} width={56} />
                  <Tooltip content={<ChartTip />} />
                  <Line
                    type="monotone"
                    dataKey="current"
                    name="Current"
                    stroke="#22854a"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, fill: '#22854a', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="scenario"
                    name={scenario || 'Scenario'}
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    dot={false}
                    activeDot={{ r: 4, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-[#fef2f2] border border-[#fee2e2] rounded-xl px-4 py-3 flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                <circle cx="8" cy="8" r="7.5" stroke="#ef4444" strokeOpacity="0.5" />
                <path d="M8 5v4M8 11v.5" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <p className="text-xs text-[#991b1b] leading-relaxed">
                {impactSummary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
