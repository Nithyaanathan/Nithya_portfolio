import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { GlowButton } from '@/components/ui/GlowButton'
import { ProjectOrbs } from '@/components/three/ProjectOrbs'
import { ProjectDetail } from './ProjectDetail'
import { projects, digitalExperiences } from '@/data/projects'
import { onScrollState } from '@/lib/scroll'
import { useTheme } from '@/lib/theme'
import { getColorSet } from '@/lib/colors'
import { usePrefersReducedMotion, useWebGL } from '@/lib/device'

function useSectionProgress(id: string) {
  const [progress, setProgress] = useState(0)
  useEffect(() => onScrollState((snap) => {
    const s = snap.sections.find((x) => x.id === id)
    if (s) setProgress(s.progress)
  }), [id])
  return progress
}

export function Projects() {
  const { theme } = useTheme()
  const colors = getColorSet(theme)
  const reduced = usePrefersReducedMotion()
  const webgl = useWebGL()

  const sectionProgress = useSectionProgress('projects')
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    const idx = Math.min(projects.length - 1, Math.max(0, Math.floor(sectionProgress * projects.length)))
    setActiveIndex(idx)
  }, [sectionProgress])

  const display = hoveredIndex !== null && hoveredIndex !== activeIndex ? hoveredIndex : activeIndex
  const project = projects[display]

  return (
    <section id="projects" className="relative z-10">
      <div className="container-shell pt-28">
        <SectionHeading
          id="projects-heading"
          index="03"
          title="PROJECT UNIVERSE"
          description="Five worlds, one system — each project is a node in the same universe of AI, data and software."
        />
      </div>

      <div className="sticky top-0 z-[5] flex min-h-screen flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" aria-hidden />
        <div className="container-shell">
          <Reveal>
            <div
              className="relative"
              data-cursor={hoveredIndex !== null ? 'view' : undefined}
            >
              {webgl ? (
                <ProjectOrbs
                  colors={colors}
                  reduced={reduced}
                  activeIndex={activeIndex}
                  hoveredIndex={hoveredIndex}
                  onHover={setHoveredIndex}
                  onSelect={setSelected}
                />
              ) : (
                <div className="flex h-[440px] items-center justify-center sm:h-[560px]">
                  <div className="text-center">
                    <p className="hud-label">ORBITAL VISUALISER OFFLINE</p>
                    <p className="mt-2 font-display text-xl font-semibold text-ink">{project.title}</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          <div className="pointer-events-auto relative z-10 -mt-4 pb-10">
            <div className="glass rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-accent">
                    {project.code} // {project.category}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{project.title}</h3>
                  <p className="mt-1 font-display text-sm text-dim">{project.tagline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-dim">{project.description}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <GlowButton
                    onClick={() => setSelected(display)}
                    icon={<ArrowUpRight size={15} />}
                    data-cursor="link"
                  >
                    View Project
                  </GlowButton>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost relative group"
                    aria-label={`Open ${project.title} on GitHub`}
                  >
                    <GithubIcon size={15} />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setActiveIndex(i)
                    setHoveredIndex(null)
                    const el = document.getElementById(`project-${i}`)
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.18em] transition-all ${
                    activeIndex === i
                      ? 'border-accent/60 bg-accent/10 text-accent'
                      : 'border-line bg-panel text-dim hover:text-ink'
                  }`}
                >
                  {p.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* scroll anchors — one per project zone */}
      <div className="pointer-events-none">
        {projects.map((p, i) => (
          <div key={p.id} id={`project-${i}`} className="h-[48vh] scroll-mt-10" />
        ))}
      </div>

      {/* Digital experiences */}
      <div className="container-shell py-24">
        <Reveal>
          <p className="section-id"><span className="mono-meta">DIGITAL EXPERIENCES</span></p>
        </Reveal>
        <Reveal delay={0.08}>
          <h3 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">Web &amp; Interface Work</h3>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {digitalExperiences.map((item, i) => (
            <Reveal key={item.title} delay={0.1 + i * 0.08}>
              <a
                href={item.link}
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="glass focus-halo group block h-full rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-accent">
                    {item.kind}
                  </span>
                  <ArrowUpRight size={15} className="text-dim transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <p className="mt-4 font-display text-lg font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm text-dim">{item.description}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <ProjectDetail
        project={selected !== null ? projects[selected] : null}
        onClose={() => setSelected(null)}
      />
    </section>
  )
}