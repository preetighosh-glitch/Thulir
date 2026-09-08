export default function CTASection() {
  return (
    <section className="bg-[#0d1b0f] py-28 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs tracking-widest uppercase text-[#4a6b50] font-medium mb-6">
          Get started today
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-5 max-w-2xl mx-auto">
          Don't wait for the future to surprise you.
        </h2>
        <p className="text-[#4a6b50] text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Build your financial twin. Run the scenarios. Make decisions with confidence.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[#3ecf6e] text-[#0d1b0f] text-sm font-bold px-7 py-3.5 rounded-lg hover:bg-[#4ade80] transition-colors"
          >
            Start free trial
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 border border-[#1e3123] text-[#9ca3af] text-sm font-medium px-7 py-3.5 rounded-lg hover:border-[#3ecf6e] hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeOpacity="0.5" />
              <path d="M5.5 4.5l4 2.5-4 2.5V4.5z" fill="currentColor" />
            </svg>
            Watch demo
          </a>
        </div>
        <p className="text-xs text-[#4a6b50] mt-8">No credit card required · Free for 30 days · Cancel anytime</p>
      </div>
    </section>
  )
}
