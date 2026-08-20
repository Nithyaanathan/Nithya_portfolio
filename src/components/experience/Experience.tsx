import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { experience, experienceStages } from '@/data/experience'
import { usePrefersReducedMotion } from '@/lib/device'

export function Experience() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="experience" className="relative z-10 py-28 md:py-40">
      <div className="container-shell pointer-events-none">
        <SectionHeading
          id="experience-heading"
          index="04"
          title="EXPERIENCE LOG"
          description="Practical exposure across analytics, data and business problem-solving — the inputs that keep shaping how I build."
        />

        <div className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* orbital stage wheel */}
          <div className="pointer-events-auto">
            <Reveal>
              <div className="relative mx-auto flex aspect-square max-w-[340px] items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-line" />
                <div className="absolute inset-8 rounded-full border border-dashed border-line" />
                <div
                  className="absolute inset-0 animate-spin-slow"
                  style={{ animationDuration: '60s' }}
                  aria-hidden
                >
                  {experienceStages.map((stage, i) => {
                    const a = (i / experienceStages.length) * Math.PI * 2
                    const r = 150
                    return (
                      <span
                        key={stage}
                        className="absolute"
                        style={{
                          left: `calc(50% + ${Math.sin(a) * r}px)`,
                          top: `calc(50% - ${Math.cos(a) * r}px)`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <span className="inline-block rounded-full border border-accent/25 bg-panel px-3 py-1.5 font-mono text-[9px] tracking-[0.25em] text-accent">
                          {stage}
                        </span>
                      </span>
                    )
                  })}
                </div>
                <motion.div
                  className="h-4 w-4 rounded-full bg-accent"
                  style={{ boxShadow: 'var(--shadow-glow)' }}
                  animate={reduced ? undefined : { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
                <p className="absolute bottom-6 font-mono text-[9px] tracking-[0.3em] text-faint">ORBIT // 04</p>
              </div>
            </Reveal>
          </div>

          {/* timeline */}
          <div className="relative pl-8 sm:pl-10">
            <div className="absolute bottom-2 left-[3px] top-2 w-px bg-gradient-to-b from-accent via-line to-transparent" aria-hidden />
            <div className="space-y-8">
              {experience.map((entry, i) => (
                <Reveal key={entry.id} delay={0.1 + i * 0.12}>
                  <div className="group relative">
                    <span
                      className="absolute -left-8 top-2 flex h-3.5 w-3.5 items-center justify-center sm:-left-10"
                      aria-hidden
                    >
                      <span className="absolute h-3.5 w-3.5 rounded-full border border-accent/50" />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150" />
                    </span>
                    <div className="glass focus-halo rounded-2xl p-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-lg font-semibold text-ink">{entry.company}</h3>
                        <span className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-accent">
                          {entry.platform ?? 'INTERNSHIP'}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-dim">{entry.role}</p>
                      <p className="mt-3 text-sm leading-relaxed text-dim">{entry.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.focus.map((f) => (
                          <span key={f} className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-[9px] tracking-[0.14em] text-dim">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}