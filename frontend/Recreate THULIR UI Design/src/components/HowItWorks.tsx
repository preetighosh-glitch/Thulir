const steps = [
  {
    n: '01',
    title: 'Connect your accounts',
    desc: 'Link bank accounts, investments, loans, and insurance via secure open-banking APIs.',
  },
  {
    n: '02',
    title: 'Build your financial twin',
    desc: 'THULIR constructs a live model of your income, obligations, and asset trajectories.',
  },
  {
    n: '03',
    title: 'Score your preparedness',
    desc: 'A composite preparedness index surfaces gaps across six financial health dimensions.',
  },
  {
    n: '04',
    title: 'Run scenarios',
    desc: 'Model any future decision — property, career shift, family event — before committing.',
  },
  {
    n: '05',
    title: 'Detect pressure early',
    desc: 'Automated stress-tests flag liquidity and solvency risks weeks before they materialise.',
  },
  {
    n: '06',
    title: 'Get calibrated advice',
    desc: 'AI recommendations grounded in your data, not generic rules-of-thumb.',
  },
  {
    n: '07',
    title: 'Adapt continuously',
    desc: 'Your twin re-calibrates as life evolves — automatically, without manual updates.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 border-t border-[#e4e4e1]">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs tracking-widest uppercase text-[#737373] font-medium block mb-5">
          The process
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f0f0f] leading-[1.1] tracking-tight mb-14">
          How THULIR powers your decisions.
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-10">
          {steps.map((s, i) => (
            <div key={s.n} className={i === 6 ? 'md:col-span-4 md:max-w-xs' : ''}>
              <span className="text-xs font-mono text-[#d4d4d4] tracking-wider block mb-3" style={{ fontFamily: 'DM Mono, monospace' }}>
                {s.n}
              </span>
              <h3 className="text-base font-semibold text-[#0f0f0f] mb-2 leading-snug">{s.title}</h3>
              <p className="text-sm text-[#737373] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
