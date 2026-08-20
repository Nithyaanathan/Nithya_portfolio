import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ExternalLink, ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import type { Project } from '@/data/projects'

interface ProjectDetailProps {
  project: Project | null
  onClose: () => void
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!project) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} project details`}
        >
          <div
            className="absolute inset-0 bg-deep/85 backdrop-blur-2xl"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            ref={panelRef}
            className="holo-edge relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-space/90 p-6 sm:p-10"
            initial={{ scale: 0.94, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-dim transition-colors hover:border-accent/50 hover:text-accent"
            >
              <X size={18} />
            </button>

            <p className="font-mono text-[10px] tracking-[0.28em] text-accent">
              {project.code} // {project.category}
            </p>
            <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{project.title}</h3>
            <p className="mt-2 font-display text-base text-dim">{project.tagline}</p>

            <div
              className="mt-6 h-px w-full"
              style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }}
            />

            <Section title="Overview">
              <p>{project.overview}</p>
            </Section>
            <Section title="Problem">
              <p>{project.problem}</p>
            </Section>
            <Section title="Solution">
              <p>{project.solution}</p>
            </Section>

            <div className="mt-7">
              <h4 className="font-mono text-[10px] tracking-[0.25em] text-faint">TECHNOLOGIES</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded-full border border-line bg-panel px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-dim">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="btn-primary relative group"
              >
                <GithubIcon size={15} />
                View on GitHub
              </a>
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noreferrer" className="btn-ghost relative group">
                  <ExternalLink size={15} />
                  {project.demoLabel ?? 'Live Demo'}
                </a>
              )}
              {project.concept && (
                <span className="rounded-full border border-violet/40 bg-violet/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-violet">
                  CONCEPT / EXPLORATION
                </span>
              )}
              <span className="ml-auto flex items-center gap-1 font-mono text-[10px] tracking-[0.2em] text-faint">
                <ArrowUpRight size={12} /> OPEN IN NEW TAB
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h4 className="font-mono text-[10px] tracking-[0.25em] text-accent">{title.toUpperCase()}</h4>
      <p className="mt-2 text-sm leading-relaxed text-ink/85">{children}</p>
    </div>
  )
}