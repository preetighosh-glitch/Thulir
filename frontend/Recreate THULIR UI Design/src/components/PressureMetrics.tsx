type PressureMetricsProps = {
  financialForm: {
    income: string
    expenses: string
    emi: string
    investments: string
    goal: string
    goalYears: string
  }
}

const parseFinancialValue = (value: string) => {
  if (!value) return 0

  const sanitized = value.replace(/[₹,\s]/g, '')
  const parsed = Number.parseFloat(sanitized)

  return Number.isFinite(parsed) ? parsed : 0
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

const statusStyles: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  critical: {
    bg: '#fef2f2',
    border: '#fee2e2',
    text: '#991b1b',
    badge: 'bg-[#fee2e2] text-[#991b1b]',
  },
  warn: {
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#92400e',
    badge: 'bg-[#fef3c7] text-[#92400e]',
  },
}

export default function PressureMetrics({ financialForm }: PressureMetricsProps) {
  const income = parseFinancialValue(financialForm.income)
  const expenses = parseFinancialValue(financialForm.expenses)
  const emi = parseFinancialValue(financialForm.emi)
  const investments = parseFinancialValue(financialForm.investments)

  const monthlySurplus = Math.max(income - expenses - emi, 0)
  const emergencyFundRatio =
    expenses > 0 && investments > 0 ? Math.min((investments / (expenses * 6)) * 100, 100) : null
  const runwayMonths = expenses > 0 && investments > 0 ? investments / expenses : null

  const pressures = [
    {
      label: 'Solvency compression',
      sublabel: 'Runway at Point B',
      value:
        runwayMonths === null ? '—' : `${runwayMonths >= 10 ? runwayMonths.toFixed(0) : runwayMonths.toFixed(1)} mo`,
      desc: 'Current liquid savings coverage relative to monthly expenses.',
      status: 'critical',
      delta: 'Current coverage',
    },
    {
      label: 'Income headroom required',
      sublabel: 'Monthly surplus gap',
      value: monthlySurplus > 0 ? `+${formatCurrency(monthlySurplus)}` : formatCurrency(monthlySurplus),
      desc:
        monthlySurplus > 0
          ? 'Current monthly surplus after essentials and EMI.'
          : 'Current monthly surplus is fully absorbed by expenses and EMI.',
      status: 'warn',
      delta: 'Current surplus',
    },
    {
      label: 'Savings capacity threshold',
      sublabel: 'Emergency fund ratio',
      value: emergencyFundRatio === null ? '—' : `${Math.round(emergencyFundRatio)}%`,
      desc: 'Liquid savings as a share of a six-month expense buffer.',
      status: 'warn',
      delta: 'Current coverage',
    },
  ]

  return (
    <section className="py-24 px-6 border-t border-[#e4e4e1]">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs tracking-widest uppercase text-[#737373] font-medium block mb-5">
          Financial pressure detection
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f0f0f] leading-[1.1] tracking-tight mb-3">
          Spot financial pressure before it reaches you.
        </h2>
        <p className="text-[#737373] mb-10 max-w-lg leading-relaxed">
          THULIR monitors early stress indicators across your financial model —
          surfacing risk weeks before it affects your cash flow.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {pressures.map((p) => {
            const s = statusStyles[p.status]
            return (
              <div
                key={p.label}
                className="rounded-2xl border p-6"
                style={{ backgroundColor: s.bg, borderColor: s.border }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-medium" style={{ color: s.text }}>{p.sublabel}</p>
                    <p className="text-xs mt-0.5" style={{ color: s.text, opacity: 0.7 }}>{p.label}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${s.badge}`}>
                    {p.delta}
                  </span>
                </div>
                <div className="text-4xl font-bold mb-3" style={{ color: s.text }}>
                  {p.value}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: s.text, opacity: 0.8 }}>
                  {p.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
