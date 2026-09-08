const expenses = [
  { category: 'Housing & Rent', amount: '₹32,000', pct: 26.7, color: '#3ecf6e' },
  { category: 'Food & Groceries', amount: '₹14,500', pct: 12.1, color: '#3ecf6e' },
  { category: 'Transport', amount: '₹8,200', pct: 6.8, color: '#4ade80' },
  { category: 'EMI Payments', amount: '₹17,500', pct: 14.6, color: '#86efac' },
  { category: 'Investments', amount: '₹18,500', pct: 15.4, color: '#bbf7d0' },
  { category: 'Other', amount: '₹9,300', pct: 7.8, color: '#d1fae5' },
]

export default function FeatureHighlight() {
  return (
    <section className="py-24 px-6 border-t border-[#e4e4e1] mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <div>
            <span className="text-xs tracking-widest uppercase text-[#737373] font-medium block mb-5">
              Adaptive financial intelligence
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f0f0f] leading-[1.1] tracking-tight mb-5">
              Your financial life changes. Most financial tools don't.
            </h2>
            <p className="text-[#737373] leading-relaxed mb-6">
              THULIR continuously re-calibrates your financial model as life
              evolves — promotions, EMIs, family expansions, market shifts. Not
              a static snapshot; a living decision layer.
            </p>
            <ul className="space-y-3">
              {[
                'Real-time expense categorisation & anomaly detection',
                'Goal-aware cash flow forecasting',
                'Life-event scenario modelling',
                'AI-driven advisory, not just dashboards',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#0f0f0f]">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l2 2 3-3" stroke="#22854a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right dark card */}
          <div className="bg-[#0d1b0f] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-[#4a6b50] uppercase tracking-wider mb-1">Expense tracking</p>
                <p className="text-lg font-semibold">November 2024</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#4a6b50] mb-1">Total spent</p>
                <p className="text-xl font-bold text-[#3ecf6e]">₹1,00,000</p>
              </div>
            </div>

            {/* Bar chart */}
            <div className="space-y-3 mb-6">
              {expenses.map((e) => (
                <div key={e.category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-[#9ca3af]">{e.category}</span>
                    <span className="text-xs font-medium text-white">{e.amount}</span>
                  </div>
                  <div className="h-1.5 bg-[#1e3123] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${e.pct * 3.2}%`, backgroundColor: e.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#1e3123] pt-4 flex gap-4">
              <div className="flex-1 bg-[#142018] rounded-lg p-3">
                <p className="text-xs text-[#4a6b50] mb-1">vs last month</p>
                <p className="text-base font-bold text-[#ef4444]">+₹8,200</p>
              </div>
              <div className="flex-1 bg-[#142018] rounded-lg p-3">
                <p className="text-xs text-[#4a6b50] mb-1">savings rate</p>
                <p className="text-base font-bold text-[#3ecf6e]">32.1%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
