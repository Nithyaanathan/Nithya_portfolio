import { Eye, Download } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { GlowButton } from '@/components/ui/GlowButton'
import { site } from '@/data/site'

export function Resume() {
  return (
    <section id="resume" className="relative z-10 py-24 md:py-32">
      <div className="container-shell pointer-events-none">
        <div className="pointer-events-auto relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-panel to-transparent p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 grid-overlay opacity-50" aria-hidden />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: 'var(--glow)', opacity: 0.35 }}
            aria-hidden
          />

          <Reveal>
            <p className="hud-label text-accent">PROFILE_ACCESS // PUBLIC</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              ACCESS MY FULL PROFILE
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-dim sm:text-base">
              The complete picture — education, experience, skills and projects — in a clean, shareable document.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <GlowButton href={site.resumeUrl} target="_blank" rel="noreferrer" icon={<Eye size={16} />}>
                View Resume
              </GlowButton>
              <GlowButton href={site.resumeUrl} download="Nithyaanathan_Resume.pdf" variant="ghost" icon={<Download size={16} />}>
                Download Resume
              </GlowButton>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-8 font-mono text-[9px] tracking-[0.3em] text-faint">FORMAT // PDF // 2026</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}