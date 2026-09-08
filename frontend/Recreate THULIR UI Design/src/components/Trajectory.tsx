import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { FinancialFormState } from '../App'

type TrajectoryProps = {
  financialForm: FinancialFormState
  trajectoryRefreshKey?: number
}

const fmt = (v: number) => `₹${(v / 100000).toFixed(1)}L`

const formatDelta = (projectedValue: number, currentBalance: number) => {
  const delta = projectedValue - currentBalance

  if (delta > 0) return `+${fmt(delta)}`
  if (delta < 0) return `-${fmt(Math.abs(delta))}`
  return '₹0'
}

const parseFinancialValue = (value: string) => {
  if (!value) return 0

  const sanitized = value.replace(/[₹,\s]/g, '')
  const parsed = Number.parseFloat(sanitized)

  return Number.isFinite(parsed) ? parsed : 0
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#e4e4e1] rounded-lg px-3 py-2 shadow-sm text-xs">
      <p className="text-[#737373] mb-0.5">{label}</p>
      <p className="font-semibold">{fmt(payload[0].value)}</p>
    </div>
  )
}

export default function Trajectory({ financialForm, trajectoryRefreshKey }: TrajectoryProps) {
  const [period, setPeriod] = useState('2Y')
  const [forecastData, setForecastData] = useState<any[]>([])
  const [forecastSummary, setForecastSummary] = useState<{ label: string; value: string; delta: string }[]>([])

  useEffect(() => {
    setForecastData([])
    setForecastSummary([])

    const income = parseFinancialValue(financialForm.income)
    const expenses = parseFinancialValue(financialForm.expenses)
    const emi = parseFinancialValue(financialForm.emi)
    const investments = parseFinancialValue(financialForm.investments)

    const monthLookup: Record<string, number> = {
      '6M': 6,
      '1Y': 12,
      '2Y': 24,
      '5Y': 60,
    }

    const forecastMonths = monthLookup[period] ?? 24

    // The current frontend form does not include a separate current balance/liquidity field.
    // For the MVP baseline, derive a conservative starting liquidity from the available values
    // instead of treating the monthly SIP amount as if it were the user's current cash balance.
    const derivedStartingLiquidity = Math.max(0, income - expenses - emi - investments)

    const requestBody = {
      question: 'Baseline financial projection',
      financial_data: {
        income,
        expenses,
        // Monthly SIPs are a monthly contribution, not current liquid savings.
        // Use a conservative derived liquidity baseline rather than mislabeling the monthly investment
        // contribution as available cash.
        liquidity: derivedStartingLiquidity,
        savings: investments,
      },
      // The frontend does not expose historical income/expense series, so use the current values
      // as a minimal MVP baseline instead of inventing fake historical variation.
      income_history: Array.from({ length: 6 }, () => income),
      expense_history: Array.from({ length: 6 }, () => Math.max(0, expenses + emi)),
      emergency_target: Math.max(0, (expenses + emi) * 6),
      forecast_months: forecastMonths,
      debt_payment: emi,
    }

    let isMounted = true

    const loadForecast = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          throw new Error('Unable to fetch forecast')
        }

        const data = await response.json()
        const forecast = Array.isArray(data?.forecast) ? data.forecast : []

        if (!isMounted) return

        const chartData = forecast.map((row: any) => ({
          t: `M${row?.Month ?? ''}`,
          balance: Number(row?.['Future Liquidity'] ?? 0),
        }))

        const currentBalance = Number(data?.simulation?.liquidity ?? investments)
        const twelveMonth = forecast.find((row: any) => Number(row?.Month) === 12)
        const twentyFourMonth = forecast.find((row: any) => Number(row?.Month) === 24)

        setForecastData(chartData)
        setForecastSummary([
          { label: 'Current balance', value: Number.isFinite(currentBalance) ? fmt(currentBalance) : 'Available after projection', delta: '' },
          {
            label: 'In 12 months',
            value: twelveMonth ? fmt(Number(twelveMonth['Future Liquidity'] ?? 0)) : 'Available after projection',
            delta: twelveMonth ? formatDelta(Number(twelveMonth['Future Liquidity'] ?? 0), currentBalance) : '',
          },
          {
            label: 'In 24 months',
            value: twentyFourMonth ? fmt(Number(twentyFourMonth['Future Liquidity'] ?? 0)) : 'Available after projection',
            delta: twentyFourMonth ? formatDelta(Number(twentyFourMonth['Future Liquidity'] ?? 0), currentBalance) : '',
          },
          {
            label: 'Avg. monthly growth',
            value: forecast.length > 1 ? `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.max(0, Number(((Number(forecast[forecast.length - 1]?.['Future Liquidity'] ?? 0) - currentBalance) / forecast.length) || 0)) )}` : 'Available after projection',
            delta: '',
          },
        ])
      } catch (err) {
        if (!isMounted) return

        setForecastData([])
        setForecastSummary([
          { label: 'Current balance', value: 'Available after projection', delta: '' },
          { label: 'In 12 months', value: 'Available after projection', delta: '' },
          { label: 'In 24 months', value: 'Available after projection', delta: '' },
          { label: 'Avg. monthly growth', value: 'Available after projection', delta: '' },
        ])
      }
    }

    void loadForecast()

    return () => {
      isMounted = false
    }
  }, [financialForm, period, trajectoryRefreshKey])

  const chartData = forecastData.length > 0 ? forecastData : []
  const summaryCards = forecastSummary.length > 0 ? forecastSummary : [
    { label: 'Current balance', value: 'Available after projection', delta: '' },
    { label: 'In 12 months', value: 'Available after projection', delta: '' },
    { label: 'In 24 months', value: 'Available after projection', delta: '' },
    { label: 'Avg. monthly growth', value: 'Available after projection', delta: '' },
  ]

  return (
    <section className="py-24 px-6 border-t border-[#e4e4e1]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs tracking-widest uppercase text-[#737373] font-medium block mb-4">
              Wealth trajectory
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f0f0f] leading-[1.1] tracking-tight">
              Don't just look at your balance.<br />See the trajectory.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {['6M', '1Y', '2Y', '5Y'].map((t) => (
              <button
                key={t}
                onClick={() => setPeriod(t)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  period === t
                    ? 'bg-[#162c1a] text-white'
                    : 'border border-[#e4e4e1] text-[#737373] hover:text-[#0f0f0f]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {summaryCards.map((s) => (
            <div key={s.label} className="bg-[#f8f8f6] border border-[#e4e4e1] rounded-xl px-4 py-3.5">
              <p className="text-xs text-[#737373] mb-1">{s.label}</p>
              <p className="text-xl font-bold text-[#0f0f0f]">{s.value}</p>
              {s.delta && <p className="text-xs text-emerald-600 mt-0.5">{s.delta}</p>}
            </div>
          ))}
        </div>

        <div className="border border-[#e4e4e1] rounded-xl p-5">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e1" vertical={false} />
              <XAxis
                dataKey="t"
                tick={{ fontSize: 11, fill: '#a3a3a3' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={fmt}
                tick={{ fontSize: 11, fill: '#a3a3a3' }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip content={<ChartTip />} />
              <ReferenceLine y={Math.max(0, Number(chartData[0]?.balance ?? 0))} stroke="#e4e4e1" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#22854a"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: '#22854a', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-[#737373] mt-3 text-center">
          Projected using your current income, expense, EMI, and savings inputs. Updated as your numbers change.
        </p>
      </div>
    </section>
  )
}
