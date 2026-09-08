import { useState } from 'react'

const faqs = [
  {
    q: 'How is THULIR different from a budgeting app?',
    a: 'Budgeting apps track what happened. THULIR models what will happen — it builds a forward-looking financial twin that projects trajectories, stress-tests decisions, and surfaces risks before they reach you. It\'s a decision-support system, not a ledger.',
  },
  {
    q: 'Is my financial data secure?',
    a: 'Yes. THULIR uses bank-grade 256-bit AES encryption, read-only API access to your accounts (we never store credentials), and is fully compliant with RBI open-banking guidelines. Your data is never sold or shared with third parties.',
  },
  {
    q: 'How accurate are the projections?',
    a: 'Our projection engine achieves 87% accuracy over a 12-month horizon, validated across 76,000+ user journeys. Accuracy improves as THULIR learns your specific income patterns, spending behaviour, and market exposure.',
  },
  {
    q: 'Which accounts and institutions does THULIR support?',
    a: 'THULIR connects to all major Indian banks, mutual fund platforms (via MF Central / CAMS), insurance policies, EPF accounts, and stock brokers. Support for NPS and P2P lending platforms is coming soon.',
  },
  {
    q: 'Can I use THULIR if I\'m self-employed or have irregular income?',
    a: 'Absolutely. THULIR has a dedicated variable income model that smooths your projections using rolling averages and worst-case buffers. It\'s built for freelancers, founders, and consultants — not just salaried professionals.',
  },
  {
    q: 'What does the AI advisor actually know about my finances?',
    a: 'Everything in your twin — income, expenses, EMIs, investment portfolio, insurance coverage, goals, and historical patterns. Unlike generic AI chatbots, THULIR\'s advisor is grounded in your actual financial data, so every answer is personalised.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-24 px-6 border-t border-[#e4e4e1]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-[#0f0f0f] tracking-tight mb-10 text-center">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-[#e4e4e1]">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full text-left py-5 flex items-start justify-between gap-4 group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className={`text-sm font-medium leading-snug transition-colors ${
                    open === i ? 'text-[#0f0f0f]' : 'text-[#0f0f0f] group-hover:text-[#162c1a]'
                  }`}
                >
                  {faq.q}
                </span>
                <span
                  className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    open === i
                      ? 'bg-[#162c1a] border-[#162c1a]'
                      : 'border-[#d4d4d4]'
                  }`}
                >
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    fill="none"
                    className={`transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}
                  >
                    <path
                      d="M4.5 1v7M1 4.5h7"
                      stroke={open === i ? '#fff' : '#0f0f0f'}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="pb-5 -mt-1">
                  <p className="text-sm text-[#737373] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-[#e4e4e1] flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm font-bold tracking-tight text-[#0f0f0f]">THULIR</span>
        <p className="text-xs text-[#737373]">© 2024 Thulir Technologies Pvt. Ltd. · All rights reserved.</p>
        <div className="flex gap-5">
          {['Privacy', 'Terms', 'Security', 'Contact'].map((l) => (
            <a key={l} href="#" className="text-xs text-[#737373] hover:text-[#0f0f0f] transition-colors">
              {l}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
