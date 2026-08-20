import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { projects } from '@/data/projects'
import { usePrefersReducedMotion } from '@/lib/device'

const signals = [
  { value: '8.8', label: 'CGPA / 10' },
  { value: String(projects.length), label: 'PROJECTS BUILT' },
  { value: '2', label: 'INTERNSHIPS' },
  { value: '4', label: 'TECH CLUSTERS' },
]

const highlights = [
  'Hands-on AI/ML project development across classification, analytics and optimisation',
  'Business analytics project delivered during the Deloitte Data Analytics Virtual Internship',
  'Web development exploration — polished, responsive frontend builds',
  'Practical experience with Python, SQL, data analysis and modern tooling',
  'Constantly experimenting with new technologies and creative problem-solving',
]

export function Signals() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="signals" className="relative z-10 py-28 md:py-36">
      <div className="container-shell pointer-events-none">
        <SectionHeading
          id="signals-heading"
          index="07"
          title="SIGNALS"
          description="A compact readout of where I am today — no noise, just measurable progress."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {signals.map((s, i) => (
            <Reveal key={s.label} delay={0.08 * i}>
              <div className="glass focus-halo group relative overflow-hidden rounded-2xl p-6 text-center">
                <motion.p
                  className="font-display text-4xl font-bold text-gradient sm:text-5xl"
                  animate={reduced ? undefined : { opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                >
                  {s.value}
                </motion.p>
                <p className="mt-2 font-mono text-[9px] tracking-[0.25em] text-dim">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <ul className="mx-auto mt-8 max-w-3xl space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm leading-relaxed text-dim sm:text-base">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" style={{ boxShadow: 'var(--shadow-glow)' }} />
                {h}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}