import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { onScrollState } from '@/lib/scroll'
import { navigation } from '@/data/site'

export function Hud() {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    return onScrollState((snap) => {
      setIndex(snap.index)
      setProgress(Math.round(snap.global * 100))
    })
  }, [])

  const section = navigation[index]?.label ?? 'HOME'
  const sectionNum = String(index + 1).padStart(2, '0')

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden lg:block" aria-hidden>
      <div className="absolute left-6 top-20 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[9px] tracking-[0.28em] text-faint">SYSTEM ONLINE</span>
        </div>
        <span className="ml-3.5 font-mono text-[9px] tracking-[0.28em] text-faint">NEURAL CORE ACTIVE</span>
        <span className="ml-3.5 font-mono text-[9px] tracking-[0.28em] text-faint">CHENNAI // INDIA</span>
      </div>

      <div className="absolute bottom-8 left-6 flex flex-col gap-1.5">
        <span className="font-mono text-[9px] tracking-[0.28em] text-faint">PORTFOLIO {`v1.0`}</span>
        <span className="font-mono text-[9px] tracking-[0.28em] text-faint">© 2026 NITHYAANATHAN</span>
      </div>

      <div className="absolute bottom-8 right-6 flex flex-col items-end gap-1.5">
        <span className="font-mono text-[9px] tracking-[0.28em] text-accent">SEC {sectionNum}/08</span>
        <span className="font-mono text-[9px] tracking-[0.28em] text-faint">{section}</span>
      </div>

      <div className="absolute right-6 top-20 flex items-center gap-3">
        <span className="font-mono text-[9px] tracking-[0.28em] text-faint">SCROLL {String(progress).padStart(3, '0')}%</span>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'linear', duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  )
}