import { motion } from 'framer-motion'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  id: string
  index: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ id, index, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={`mb-10 md:mb-14 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <Reveal>
        <span className="section-id">
          <span className="mono-meta">{index}</span>
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          id={id}
          className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-[2.75rem] md:leading-tight"
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className={`mt-4 max-w-2xl text-dim ${align === 'center' ? 'mx-auto' : ''}`}>{description}</p>
        </Reveal>
      )}
    </div>
  )
}

export function SectionLabel({ children, className = '' }: { children: string; className?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, letterSpacing: '0.1em' }}
      whileInView={{ opacity: 1, letterSpacing: '0.3em' }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`hud-label ${className}`}
    >
      {children}
    </motion.span>
  )
}