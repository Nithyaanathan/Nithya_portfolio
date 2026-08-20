import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, FileText } from 'lucide-react'
import { GlowButton } from '@/components/ui/GlowButton'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/data/site'
import { scrollToId } from '@/lib/scroll'
import { usePrefersReducedMotion } from '@/lib/device'

export function Hero() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="hero" className="relative z-10 flex min-h-screen flex-col justify-center overflow-hidden">
      <div className="pointer-events-none mx-auto w-full max-w-[1600px] px-6 pt-24 md:px-10 lg:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:gap-14">
          <div className="@container min-w-0">
            <div>
          <Reveal>
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {site.locationCode}
            </p>
          </Reveal>

          <h1 className="mt-6 whitespace-nowrap font-display text-[clamp(2.75rem,11cqw,6rem)] font-bold leading-[0.95] tracking-tight text-ink">
            {!reduced ? (
              <>
                {'NITHYAANATHAN'.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.15 + i * 0.035, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </motion.span>
                ))}
              </>
            ) : (
              'NITHYAANATHAN'
            )}
          </h1>

          <Reveal delay={0.35}>
            <h2 className="mt-3 font-display text-[clamp(1.4rem,4vw,2.6rem)] font-semibold tracking-tight text-gradient">
              AI &amp; ML ENGINEER
            </h2>
          </Reveal>

          <Reveal delay={0.45}>
            <p className="mt-4 font-display text-lg text-dim sm:text-xl">Building Ideas, Shaping the Future</p>
          </Reveal>

          <Reveal delay={0.55}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-dim sm:text-base">
              AI, data, software and creative technology — turning ideas into practical digital experiences.
            </p>
          </Reveal>

          <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4">
            <GlowButton
              onClick={() => scrollToId('about')}
              icon={<ArrowDown size={16} />}
              data-cursor="link"
            >
              Explore My Universe
            </GlowButton>
            <GlowButton
              variant="ghost"
              onClick={() => scrollToId('projects')}
              icon={<ArrowUpRight size={16} />}
              data-cursor="link"
            >
              View Projects
            </GlowButton>
          </div>

          <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-5">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="link-underline flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-dim transition-colors hover:text-accent"
            >
              <GithubIcon size={14} /> GITHUB
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="link-underline flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-dim transition-colors hover:text-accent"
            >
              <LinkedinIcon size={14} /> LINKEDIN
            </a>
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="link-underline flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-dim transition-colors hover:text-accent"
            >
              <FileText size={14} /> RESUME
            </a>
          </div>
          </div>
          <div className="hidden lg:block" aria-hidden />
        </div>
      </div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] tracking-[0.3em] text-faint">SCROLL TO TRAVEL</span>
          <motion.div
            className="h-10 w-px bg-gradient-to-b from-accent to-transparent"
            animate={reduced ? undefined : { scaleY: [0.2, 1, 0.2], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originY: 0 }}
          />
        </div>
      </motion.div>
    </section>
  )
}