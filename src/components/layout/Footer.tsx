import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/ui/BrandIcons'
import { site } from '@/data/site'

const socials = [
  { label: 'GitHub', href: site.github, icon: GithubIcon },
  { label: 'LinkedIn', href: site.linkedin, icon: LinkedinIcon },
  { label: 'Instagram', href: site.instagram, icon: InstagramIcon },
  { label: 'Email', href: site.emailHref, icon: Mail },
]

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-deep/60 py-12">
      <div className="container-shell flex flex-col items-center gap-8 text-center">
        <div>
          <p className="font-display text-lg font-semibold tracking-wide text-ink">{site.name}</p>
          <p className="mt-1 font-mono text-[11px] tracking-[0.3em] text-accent">{site.title}</p>
          <p className="mt-2 font-mono text-[11px] tracking-[0.18em] text-faint">“{site.tagline}”</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-faint">{site.locationCode}</p>
        </div>

        <nav className="flex items-center gap-6" aria-label="Footer socials">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={s.label}
              className="text-dim transition-all hover:-translate-y-0.5 hover:text-accent"
            >
              <s.icon size={17} />
            </a>
          ))}
        </nav>

        <div className="flex w-full max-w-md items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <p className="font-mono text-[10px] tracking-[0.25em] text-faint">© 2026 NITHYAANATHAN</p>
          <span className="h-px flex-1 bg-line" />
        </div>
      </div>
    </footer>
  )
}