import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { navigation } from '@/data/site'
import { scrollToId, getScrollSnapshot } from '@/lib/scroll'
import { useIsMobile } from '@/lib/device'
import { ThemeToggle } from './ThemeToggle'

function ThemeToggleWithLabel() {
  return <ThemeToggle />
}

export function Navigation() {
  const [active, setActive] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const snap = getScrollSnapshot()
      if (snap.sections[snap.index]) {
        setActive(snap.sections[snap.index].id)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setMenuOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[120] transition-all duration-500 ${
          scrolled ? 'border-b border-line bg-space/70 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <nav className="container-shell flex h-16 items-center justify-between" aria-label="Primary">
          <button
            type="button"
            onClick={() => go('hero')}
            className="group flex items-center gap-3"
            aria-label="Go to home"
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-accent/40 transition-transform duration-500 group-hover:rotate-180" />
              <span className="font-display text-sm font-bold text-accent">N</span>
            </span>
            <span className="hidden font-mono text-[11px] tracking-[0.28em] text-dim sm:block">
              NITHYAANATHAN<span className="text-accent">_//</span>AI_UNIVERSE
            </span>
          </button>

          <div className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                className={`relative rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] transition-colors ${
                  active === item.id ? 'text-accent' : 'text-dim hover:text-ink'
                }`}
              >
                {item.label}
                {active === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full border border-accent/30 bg-accent/10"
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggleWithLabel />
            {isMobile && (
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line bg-panel"
              >
                <motion.span animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="h-px w-4 bg-ink" />
                <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="h-px w-4 bg-ink" />
                <motion.span animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className="h-px w-4 bg-ink" />
              </button>
            )}
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            className="fixed inset-0 z-[110] flex flex-col justify-center bg-deep/95 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="container-shell flex flex-col gap-2">
              <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-faint">// NAVIGATION SYSTEM</p>
              {navigation.map((item, i) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className={`flex items-center justify-between border-b border-line py-4 text-left font-display text-2xl font-medium ${
                    active === item.id ? 'text-accent' : 'text-ink'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-faint">{`0${i + 1}`}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}