import { MapPin, GraduationCap, Gauge, CalendarRange, Crosshair } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { IdentityHologram } from './IdentityHologram'

const metaCards = [
  { icon: MapPin, label: 'LOCATION', value: 'Chennai, India' },
  { icon: GraduationCap, label: 'EDUCATION', value: 'B.Tech AI & Data Science' },
  { icon: Gauge, label: 'CGPA', value: '8.8 / 10' },
  { icon: CalendarRange, label: 'GRADUATION', value: '2028' },
  { icon: Crosshair, label: 'FOCUS', value: 'AI / ML / Software' },
]

export function About() {
  return (
    <section id="about" className="relative z-10 py-28 md:py-40">
      <div className="container-shell pointer-events-none">
        <SectionHeading
          id="about-heading"
          index="01"
          title="THE HUMAN BEHIND THE SYSTEM"
          description="A builder working at the intersection of AI, data, software and design — turning ideas into practical systems."
        />

        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div className="pointer-events-auto">
            <Reveal>
              <IdentityHologram />
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-ink/90">
                Hi, I&apos;m Nithyaanathan V — a B.Tech Artificial Intelligence &amp; Data Science student who loves
                technology, creativity and building meaningful digital experiences.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 leading-relaxed text-dim">
                I work across Python, SQL, data analysis and AI/ML, while exploring web development, UI design, graphic
                design and creative problem-solving. I turn ideas into practical solutions and I&apos;m constantly
                experimenting with new technologies.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-5 leading-relaxed text-dim">
                My focus is simple: build systems where intelligence meets craft — from machine-learning pipelines to
                immersive digital experiences.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {metaCards.map((card, i) => (
                <Reveal key={card.label} delay={0.15 + i * 0.06}>
                  <div className="glass focus-halo group rounded-xl p-4">
                    <card.icon size={16} className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5" />
                    <p className="mono-meta mt-3">{card.label}</p>
                    <p className="mt-1 text-sm font-medium text-ink">{card.value}</p>
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