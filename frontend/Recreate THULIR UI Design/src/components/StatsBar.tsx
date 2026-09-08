const stats = [
  { label: 'Transactions analysed', value: '76', unit: 'K+' },
  { label: 'Accounts connected', value: '84', unit: '' },
  { label: 'Avg. financial health score', value: '5.8', unit: '/10' },
  { label: 'Accuracy on projections', value: '87', unit: '%' },
]

export default function StatsBar() {
  return (
    <section className="py-16 px-6 border-t border-b border-[#e4e4e1]">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-[#737373] font-medium text-center mb-10">
          A living model of your financial life.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="flex items-baseline justify-center gap-0.5 mb-1">
                <span className="text-4xl font-bold text-[#0f0f0f] tracking-tight">{s.value}</span>
                <span className="text-lg font-semibold text-[#737373]">{s.unit}</span>
              </div>
              <p className="text-xs text-[#737373] leading-snug max-w-[120px] mx-auto">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
