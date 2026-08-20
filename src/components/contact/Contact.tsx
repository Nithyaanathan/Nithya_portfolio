import { Mail, Phone, ArrowUpRight } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/ui/BrandIcons'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/data/site'

const channels = [
  { icon: Mail, label: 'EMAIL', value: site.email, href: site.emailHref },
  { icon: Phone, label: 'PHONE', value: site.phone, href: site.phoneHref },
  { icon: LinkedinIcon, label: 'LINKEDIN', value: 'Nithyaanathan V', href: site.linkedin },
  { icon: GithubIcon, label: 'GITHUB', value: '@Nithyaanathan', href: site.github },
  { icon: InstagramIcon, label: 'INSTAGRAM', value: '@nithyaanathan_27', href: site.instagram },
]

export function Contact() {
  return (
    <section id="contact" className="relative z-10 pb-20 pt-28 md:pb-28 md:pt-40">
      <div className="container-shell pointer-events-none">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="section-id"><span className="mono-meta">08</span></span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">
              Let&apos;s build something{' '}
              <span className="text-gradient">intelligent.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-dim sm:text-lg">
              Have an idea, project, collaboration or opportunity? Let&apos;s turn it into something meaningful.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={0.08 + i * 0.06}>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="pointer-events-auto glass focus-halo group flex items-center gap-4 rounded-2xl p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/5 text-accent transition-transform duration-300 group-hover:-translate-y-0.5">
                  <c.icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[9px] tracking-[0.25em] text-faint">{c.label}</span>
                  <span className="block truncate text-sm font-medium text-ink">{c.value}</span>
                </span>
                <ArrowUpRight size={14} className="ml-auto shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </a>
            </Reveal>
          ))}

          <Reveal delay={0.4}>
            <div className="glass flex h-full flex-col justify-center rounded-2xl border-dashed p-5 text-center">
              <p className="font-mono text-[10px] tracking-[0.2em] text-dim">RESPONSE TIME</p>
              <p className="mt-2 font-display text-lg font-semibold text-ink">Usually within 24 hours</p>
              <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-faint">CHENNAI // IST</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}