import { useState } from 'react'
import type { FinancialFormState } from '../App'

const suggestions = [
  'If I invest ₹10,000 more/month, when can I retire?',
  'What if I lose my job for 3 months?',
  'How does buying a car affect my goals?',
  'Am I on track for my daughter\'s education fund?',
]

const defaultConversation = [
  {
    role: 'user',
    text: 'How does increasing my monthly investments affect my financial runway?',
  },
  {
    role: 'assistant',
    text: 'I can model that once you enter your current numbers and ask a scenario question. I will compare your current trajectory against the alternative using your latest inputs and the backend forecast.',
  },
]

type AIChatProps = {
  financialForm: FinancialFormState
}

const parseIndianNumber = (value: string): number => {
  const cleaned = value.replace(/,/g, '').replace(/[^\d.-]/g, '')
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

export default function AIChat({ financialForm }: AIChatProps) {
  const [messages, setMessages] = useState(defaultConversation)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const send = async () => {
    const message = input.trim()
    if (!message || isLoading) return

    const income = parseIndianNumber(financialForm.income)
    const expenses = parseIndianNumber(financialForm.expenses)
    const emi = parseIndianNumber(financialForm.emi)
    const investments = parseIndianNumber(financialForm.investments)
    const liquidity = investments
    const emergencyTarget = expenses * 6

    const currentFinancialData = {
      income,
      expenses,
      liquidity,
      savings: investments,
    }

    const incomeHistory = Array.from({ length: 6 }, () => income)
    const expenseHistory = Array.from({ length: 6 }, () => expenses)

    setMessages((m) => [
      ...m,
      { role: 'user', text: message },
      {
        role: 'assistant',
        text: 'Analysing your financial twin...',
      },
    ])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          financial_data: currentFinancialData,
          income_history: incomeHistory,
          expense_history: expenseHistory,
          emergency_target: emergencyTarget,
          forecast_months: 6,
          debt_payment: emi,
        }),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = await response.json()

      const scenario = data?.scenario ?? {}
      const simulation = data?.simulation ?? {}
      const forecast = Array.isArray(data?.forecast) ? data.forecast : []
      const recommendation = data?.recommendation ?? {}

      let summary = 'I reviewed your scenario and here is the latest outlook.'

      if (scenario?.type === 'career_break') {
        const months = scenario.months ?? 0
        const liquidity = simulation?.liquidity ?? 0
        const lastMonth = forecast[forecast.length - 1] ?? {}
        const forecastLiquidity = lastMonth['Future Liquidity'] ?? liquidity

        summary = `Your ${months}-month career break would leave roughly ₹${Math.round(liquidity).toLocaleString('en-IN')} in liquidity after the simulated break. The forecast shows ${forecast.length ? `around ₹${Math.round(forecastLiquidity).toLocaleString('en-IN')} by the end of the period` : 'a projected liquidity trend'} and the recommendation is: ${recommendation?.recommendation ?? 'review your emergency runway and spending plan.'}`
      } else if (scenario?.type === 'income_change') {
        const percentage = scenario.percentage ?? 0
        summary = `Your income scenario changes by ${percentage}%. The current simulation suggests a revised income of ₹${Math.round(simulation?.income ?? 0).toLocaleString('en-IN')}. ${recommendation?.recommendation ?? 'Review the impact to your monthly runway.'}`
      } else if (scenario?.type === 'expense_change') {
        const percentage = scenario.percentage ?? 0
        summary = `Your expense scenario changes by ${percentage}%. The simulated monthly expense level is ₹${Math.round(simulation?.expenses ?? 0).toLocaleString('en-IN')}. ${recommendation?.recommendation ?? 'Consider whether this is sustainable for your liquidity plan.'}`
      } else if (recommendation?.recommendation) {
        summary = recommendation.recommendation
      }

      setMessages((m) => {
        const updated = [...m]
        updated[updated.length - 1] = {
          role: 'assistant',
          text: summary,
        }
        return updated
      })
    } catch (error) {
      setMessages((m) => {
        const updated = [...m]
        updated[updated.length - 1] = {
          role: 'assistant',
          text: "I couldn't reach the financial analysis service. Please make sure the Thulir backend is running.",
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-[#0d1b0f] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <span className="text-xs tracking-widest uppercase text-[#4a6b50] font-medium block mb-5">
              AI financial advisor
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-[1.1] tracking-tight mb-5">
              Ask your financial future a question.
            </h2>
            <p className="text-[#4a6b50] leading-relaxed mb-8">
              THULIR's AI runs on your actual financial twin — not generic
              templates. Every answer is grounded in your numbers.
            </p>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="w-full text-left text-sm text-[#9ca3af] bg-[#142018] border border-[#1e3123] rounded-lg px-4 py-3 hover:border-[#3ecf6e] hover:text-[#3ecf6e] transition-colors"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>

          {/* Right: chat */}
          <div className="bg-[#142018] border border-[#1e3123] rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 420 }}>
            <div className="px-5 py-3.5 border-b border-[#1e3123] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3ecf6e]" />
              <span className="text-xs text-[#4a6b50] font-medium">THULIR Financial Twin · Active</span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-[#1e3123] flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M5 1.5L8.5 5 5 8.5M1.5 5h7" stroke="#3ecf6e" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-[#1f4226] text-white rounded-br-sm'
                        : 'bg-[#0d1b0f] text-[#d1d5db] border border-[#1e3123] rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#1e3123]">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  disabled={isLoading}
                  placeholder="Ask about your financial future..."
                  className="flex-1 bg-[#0d1b0f] border border-[#1e3123] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4a6b50] focus:outline-none focus:border-[#3ecf6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={send}
                  disabled={isLoading}
                  className="bg-[#162c1a] text-[#3ecf6e] px-4 py-2.5 rounded-lg hover:bg-[#1f4226] transition-colors text-sm font-medium flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
