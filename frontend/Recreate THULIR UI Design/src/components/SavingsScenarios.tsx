import type { FinancialFormState } from '../App'

type SavingsScenariosProps = {
  financialForm: FinancialFormState
}

const scenarios = [
  {
    title: 'P1 Community Budget',
    tag: 'Current plan',
    tagColor: 'bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]',
    desc: 'Conservative allocation: 30% savings rate with index fund SIPs and term insurance.',
    riskLevel: 'Moderate',
    cta: 'View full plan',
    ctaStyle: 'border border-[#e4e4e1] text-[#0f0f0f] hover:bg-[#f8f8f6]',
    monthlyRate: 0.3,
    annualRate: 0.1,
  },
  {
    title: 'P2 Accelerated FIRE',
    tag: 'Optimised',
    tagColor: 'bg-[#162c1a] text-[#3ecf6e] border border-[#1e3123]',
    desc: 'Aggressive savings at 45%+, goal: financial independence by age 45.',
    riskLevel: 'High',
    cta: 'Connect financial account',
    ctaStyle: 'bg-[#162c1a] text-white hover:bg-[#1f4226]',
    featured: true,
    monthlyRate: 0.45,
    annualRate: 0.12,
  },
  {
    title: 'P3 Life Event Buffer',
    tag: 'Adaptive',
    tagColor: 'bg-[#fffbeb] text-[#92400e] border border-[#fde68a]',
    desc: 'Built for career transitions, childbirth, or relocation — flexible drawdown rules.',
    riskLevel: 'Low-moderate',
    cta: 'Connect financial account',
    ctaStyle: 'border border-[#e4e4e1] text-[#0f0f0f] hover:bg-[#f8f8f6]',
    monthlyRate: 0.2,
    annualRate: 0.08,
  },
]

const parseIndianNumber = (value: string) => {
  const cleaned = String(value || '').replace(/,/g, '').replace(/\s+/g, '').trim()
  const numericValue = Number(cleaned)
  return Number.isFinite(numericValue) ? numericValue : 0
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)

const formatShortCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2).replace(/\.00$/, '')}Cr`
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2).replace(/\.00$/, '')}L`
  }

  return `₹${formatCurrency(value)}`
}

const getProjectedCorpus = (monthlySavings: number, annualRate: number, years: number) => {
  const monthlyRate = annualRate / 12
  const months = Math.max(years * 12, 1)

  if (monthlySavings <= 0 || monthlyRate <= 0) {
    return 0
  }

  return monthlySavings * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
}

export default function SavingsScenarios({ financialForm }: SavingsScenariosProps) {
  const income = parseIndianNumber(financialForm.income)
  const expenses = parseIndianNumber(financialForm.expenses)
  const emi = parseIndianNumber(financialForm.emi)
  const goalYearsFromForm = Number(financialForm.goalYears) || 10
  const years = Math.max(goalYearsFromForm, 1)
  const availableSurplus = Math.max(income - expenses - emi, 0)
  const hasFinancialInputs = income > 0 || expenses > 0 || emi > 0

  const fallbackValue = 'Enter your financial details'

  const scenarioCards = scenarios.map((scenario) => {
    if (!hasFinancialInputs) {
      return {
        ...scenario,
        metrics: [
          { label: 'Monthly savings', value: fallbackValue },
          { label: '10Y projected corpus', value: fallbackValue },
          { label: 'Risk level', value: scenario.riskLevel },
        ],
      }
    }

    const monthlySavings = Math.max(availableSurplus * scenario.monthlyRate, 0)
    const projectedCorpus = getProjectedCorpus(monthlySavings, scenario.annualRate, years)

    return {
      ...scenario,
      metrics: [
        { label: 'Monthly savings', value: `₹${formatCurrency(monthlySavings)}` },
        { label: '10Y projected corpus', value: formatShortCurrency(projectedCorpus) },
        { label: 'Risk level', value: scenario.riskLevel },
      ],
    }
  })

  return (
    <section className="py-24 px-6 border-t border-[#e4e4e1]">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs tracking-widest uppercase text-[#737373] font-medium block mb-5">
          Adaptive savings strategy
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f0f0f] leading-[1.1] tracking-tight mb-3">
          Your savings strategy should change when your life changes.
        </h2>
        <p className="text-[#737373] mb-10 max-w-lg leading-relaxed">
          THULIR recommends and recalibrates strategy profiles as your income,
          goals, and risk appetite evolve.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {scenarioCards.map((s) => (
            <div
              key={s.title}
              className={`rounded-2xl border p-6 flex flex-col gap-5 ${
                s.featured
                  ? 'bg-[#0d1b0f] border-[#1e3123]'
                  : 'bg-white border-[#e4e4e1]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${s.tagColor}`}>
                    {s.tag}
                  </span>
                </div>
                <h3 className={`text-base font-bold mb-2 ${s.featured ? 'text-white' : 'text-[#0f0f0f]'}`}>
                  {s.title}
                </h3>
                <p className={`text-xs leading-relaxed ${s.featured ? 'text-[#4a6b50]' : 'text-[#737373]'}`}>
                  {s.desc}
                </p>
              </div>

              <div className="space-y-2">
                {s.metrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <span className={`text-xs ${s.featured ? 'text-[#4a6b50]' : 'text-[#737373]'}`}>
                      {m.label}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        s.featured ? 'text-[#3ecf6e]' : 'text-[#0f0f0f]'
                      }`}
                    >
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`mt-auto text-sm font-medium py-2.5 rounded-lg transition-colors ${s.ctaStyle}`}
              >
                {s.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
