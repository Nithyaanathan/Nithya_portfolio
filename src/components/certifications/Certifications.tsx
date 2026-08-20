import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BadgeCheck, X } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { TiltCard } from '@/components/ui/TiltCard'
import { certifications, type Certification } from '@/data/certifications'
import { site } from '@/data/site'

export function Certifications() {
  const [open, setOpen] = useState<Certification | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="certifications" className="relative z-10 py-28 md:py-40">
      <div className="container-shell pointer-events-none">
        <SectionHeading
          id="certifications-heading"
          index="06"
          title="VERIFIED KNOWLEDGE"
          description="Credentials and verified learning that back up what I build."
        />

        {certifications.length === 0 ? (
          <Reveal>
            <div className="pointer-events-auto glass holo-edge corner-frame relative overflow-hidden rounded-2xl p-8 text-center sm:p-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                <BadgeCheck size={24} className="text-accent" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">Verification Library</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-dim">
                My verified credentials are documented in my resume. For the latest list of certifications and
                completed learning programmes, check my profile.
              </p>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost relative group mx-auto mt-7"
              >
                View on LinkedIn
              </a>
              <p className="mt-6 font-mono text-[9px] tracking-[0.3em] text-faint">LIBRARY_STATUS // ONLINE</p>
            </div>
          </Reveal>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert, i) => (
                <Reveal key={cert.id} delay={0.08 * i}>
                  <button
                    type="button"
                    className="pointer-events-auto block w-full text-left"
                    onClick={() => setOpen(cert)}
                    onMouseEnter={() => setHovered(cert.id)}
                    onMouseLeave={() => setHovered(null)}
                    aria-haspopup="dialog"
                  >
                    <TiltCard className="group relative h-full">
                      <div
                        className={`glass holo-edge relative overflow-hidden rounded-2xl p-6 transition-all duration-500 ${
                          hovered === cert.id ? '-translate-y-2' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-accent">
                            {cert.issuer}
                          </span>
                          {cert.year && <span className="mono-meta">{cert.year}</span>}
                        </div>
                        <h3 className="mt-5 font-display text-lg font-semibold text-ink">{cert.title}</h3>
                        {cert.credential && <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-dim">{cert.credential}</p>}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {cert.topics.map((t) => (
                            <span key={t} className="rounded-full border border-line bg-panel px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] text-dim">
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="mt-5 font-mono text-[9px] tracking-[0.25em] text-accent/70">OPEN TO VERIFY →</p>
                      </div>
                    </TiltCard>
                  </button>
                </Reveal>
              ))}
            </div>

            <AnimatePresence>
              {open && (
                <motion.div
                  className="fixed inset-0 z-[150] flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label={open.title}
                >
                  <div className="absolute inset-0 bg-deep/85 backdrop-blur-2xl" onClick={() => setOpen(null)} aria-hidden />
                  <motion.div
                    className="holo-edge relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-space/90 p-8"
                    initial={{ scale: 0.94, y: 24 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.96, y: 16 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(null)}
                      aria-label="Close"
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-dim hover:text-accent"
                    >
                      <X size={18} />
                    </button>
                    <p className="font-mono text-[10px] tracking-[0.25em] text-accent">{open.issuer}</p>
                    <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{open.title}</h3>
                    {open.credential && <p className="mt-2 font-mono text-[11px] text-dim">{open.credential}</p>}
                    {open.year && <p className="mt-1 font-mono text-[10px] text-faint">{open.year}</p>}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {open.topics.map((t) => (
                        <span key={t} className="rounded-full border border-line bg-panel px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-dim">
                          {t}
                        </span>
                      ))}
                    </div>
                    {open.file && (
                      <a href={open.file} target="_blank" rel="noreferrer" className="btn-primary relative group mt-7">
                        View Certificate
                      </a>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  )
}