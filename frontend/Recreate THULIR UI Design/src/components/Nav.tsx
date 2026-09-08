import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-[#e4e4e1]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-[#0f0f0f] font-bold text-xl tracking-tight select-none">
          THULIR
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {['Product', 'How it works', 'Pricing', 'Blog'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-[#737373] hover:text-[#0f0f0f] transition-colors duration-150"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-sm text-[#737373] hover:text-[#0f0f0f] transition-colors duration-150 px-3 py-1.5"
          >
            Sign in
          </a>
          <a
            href="#"
            className="text-sm bg-[#162c1a] text-white px-4 py-2 rounded-md hover:bg-[#1f4226] transition-colors duration-150"
          >
            Get started
          </a>
        </div>

        <button
          className="md:hidden text-[#0f0f0f] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {mobileOpen ? (
              <path d="M4 4l12 12M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#e4e4e1] px-6 pb-5 pt-2 flex flex-col gap-4">
          {['Product', 'How it works', 'Pricing', 'Blog'].map((link) => (
            <a key={link} href="#" className="text-sm text-[#737373]">
              {link}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <a href="#" className="text-sm text-[#737373]">Sign in</a>
            <a href="#" className="text-sm bg-[#162c1a] text-white px-4 py-2 rounded-md">Get started</a>
          </div>
        </div>
      )}
    </header>
  )
}
