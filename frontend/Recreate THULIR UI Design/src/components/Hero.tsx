import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { month: 'Jan', wealth: 820000 },
  { month: 'Feb', wealth: 855000 },
  { month: 'Mar', wealth: 891000 },
  { month: 'Apr', wealth: 874000 },
  { month: 'May', wealth: 932000 },
  { month: 'Jun', wealth: 978000 },
  { month: 'Jul', wealth: 1024000 },
  { month: 'Aug', wealth: 1069000 },
  { month: 'Sep', wealth: 1115000 },
  { month: 'Oct', wealth: 1168000 },
  { month: 'Nov', wealth: 1224000 },
  { month: 'Dec', wealth: 1290000 },
  { month: 'Jan', wealth: 1348000 },
  { month: 'Feb', wealth: 1412000 },
  { month: 'Mar', wealth: 1481000 },
  { month: 'Apr', wealth: 1557000 },
  { month: 'May', wealth: 1638000 },
  { month: 'Jun', wealth: 1726000 },
]

const fmt = (v: number) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#e4e4e1] rounded-lg px-3 py-2 shadow-sm text-xs">
      <p className="text-[#737373] mb-0.5">{label}</p>
      <p className="font-semibold text-[#0f0f0f]">{fmt(payload[0].value)}</p>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="pt-32 pb-0 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <span className="text-xs tracking-widest uppercase text-[#737373] font-medium">
            Calibrated Financial Decision System
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f0f0f] leading-[1.08] tracking-tight max-w-3xl mb-5">
          See what your financial future could look like{' '}
          <span className="italic font-semibold">—&nbsp;before</span> you make
          the decision.
        </h1>

        <p className="text-[#737373] text-base md:text-lg max-w-xl leading-relaxed mb-8">
          THULIR builds a living digital twin of your finances — modelling
          trajectories, stress-testing decisions, and surfacing risks before
          they reach you.
        </p>

        <div className="flex flex-wrap gap-3 mb-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[#162c1a] text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-[#1f4226] transition-colors"
          >
            Start free trial
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 border border-[#e4e4e1] text-[#0f0f0f] text-sm font-medium px-5 py-2.5 rounded-md hover:bg-[#f8f8f6] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6.5" stroke="#0f0f0f" strokeOpacity="0.4" />
              <path d="M5.5 4.5l4 2.5-4 2.5V4.5z" fill="#0f0f0f" />
            </svg>
            Watch demo
          </a>
        </div>

        {/* Metrics row */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { label: 'Financial health score', value: '5.8', sub: '↑ vs last quarter', up: true },
            { label: 'Projected annual savings', value: '₹3.2L', sub: 'at current rate' },
            { label: 'Monthly EMI exposure', value: '₹17,500', sub: '14.6% of income' },
            { label: 'Risk profile', value: 'Moderate', sub: 'Balanced allocation' },
          ].map((m) => (
            <div
              key={m.label}
              className="flex-1 min-w-[140px] bg-[#f8f8f6] border border-[#e4e4e1] rounded-lg px-4 py-3"
            >
              <p className="text-xs text-[#737373] mb-1">{m.label}</p>
              <p className="text-lg font-bold text-[#0f0f0f] leading-tight">{m.value}</p>
              <p className={`text-xs mt-0.5 ${m.up ? 'text-emerald-600' : 'text-[#737373]'}`}>{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="border border-[#e4e4e1] rounded-xl bg-[#f8f8f6] p-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-[#737373] uppercase tracking-wider mb-1">Projected wealth trajectory</p>
              <p className="text-2xl font-bold text-[#0f0f0f]">₹17.26L</p>
            </div>
            <div className="flex gap-2">
              {['6M', '1Y', '2Y', '5Y'].map((t, i) => (
                <button
                  key={t}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    i === 2
                      ? 'bg-[#162c1a] text-white'
                      : 'text-[#737373] hover:text-[#0f0f0f]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3ecf6e" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#3ecf6e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e1" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#a3a3a3' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => fmt(v)}
                tick={{ fontSize: 11, fill: '#a3a3a3' }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="wealth"
                stroke="#22854a"
                strokeWidth={2}
                fill="url(#heroGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#22854a', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
