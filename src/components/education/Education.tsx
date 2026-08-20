import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { education, educationOrbits } from '@/data/education'
import { usePrefersReducedMotion } from '@/lib/device'

export function Education() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="education" className="relative z-10 py-28 md:py-40">
      <div className="container-shell pointer-events-none">
        <SectionHeading
          id="education-heading"
          index="05"
          title="KNOWLEDGE CORE"
          description="The academic foundation powering the system — a structured orbit around a single core."
        />

        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* orbital education core */}
          <div className="pointer-events-auto mx-auto">
            <Reveal>
              <div className="relative aspect-square w-full max-w-[420px]">
                <div className="absolute inset-0 rounded-full border border-line" />
                <div className="absolute inset-[12%] rounded-full border border-dashed border-line" />

                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '45s' }} aria-hidden>
                  {educationOrbits.map((o) => {
                    const R = (o.radius / 2.4) * 50
                    const pts = 3
                    const arr = []
                    for (let k = 0; k < pts; k++) {
                      const a = (k / pts) * Math.PI * 2
                      arr.push(
                        <span
                          key={`${o.label}-${k}`}
                          className="absolute"
                          style={{
                            left: `calc(50% + ${Math.sin(a) * R}px)`,
                            top: `calc(50% - ${Math.cos(a) * R}px)`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <span className="inline-block rounded-full border border-accent/25 bg-panel px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-accent">
                            {o.label}
                          </span>
                        </span>
                      )
                    }
                    return arr
                  })}
                </div>

                {/* core */}
                <div className="absolute inset-[26%]">
                  <div
                    className="flex h-full w-full items-center justify-center rounded-full text-center"
                    style={{ boxShadow: 'var(--shadow-glow)', border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)' }}
                  >
                    <motion.div
                      animate={reduced ? undefined : { scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <p className="font-mono text-[10px] tracking-[0.25em] text-accent">KNOWLEDGE</p>
                      <p className="mt-2 font-display text-4xl font-bold text-ink">8.8</p>
                      <p className="font-mono text-[10px] tracking-[0.2em] text-dim">CGPA / 10</p>
                    </motion.div>
                  </div>
                </div>

                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-faint">
                  ORBIT // 05
                </span>
              </div>
            </Reveal>
          </div>

          {/* details */}
          <div>
            <Reveal>
              <div className="glass holo-edge rounded-2xl p-7 sm:p-9">
                <p className="font-mono text-[10px] tracking-[0.25em] text-accent">CURRENT // 3RD YEAR</p>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">{education.institution}</h3>
                <p className="mt-2 font-display text-base text-dim">{education.degree}</p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line bg-panel p-4">
                    <p className="mono-meta">CGPA</p>
                    <p className="mt-1 font-display text-xl font-semibold text-ink">{education.cgpa}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-panel p-4">
                    <p className="mono-meta">GRADUATION</p>
                    <p className="mt-1 font-display text-xl font-semibold text-ink">{education.graduation}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="hud-label mb-3">ACADEMIC SIGNALS</p>
                  <ul className="space-y-2.5">
                    {education.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm text-dim">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}