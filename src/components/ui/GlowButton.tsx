import { type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react'
import { Magnetic } from './Magnetic'
import { useIsTouchDevice } from '@/lib/device'

type Variant = 'primary' | 'ghost'

interface BaseProps {
  variant?: Variant
  children: ReactNode
  icon?: ReactNode
  className?: string
}

interface ButtonProps extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  href?: undefined
}

interface AnchorProps extends BaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> {
  href: string
}

type GlowButtonProps = ButtonProps | AnchorProps

function Content({ variant, children, icon }: { variant: Variant; children: ReactNode; icon?: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      {icon && <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40 ${
          variant === 'primary' ? 'bg-accent' : 'bg-accent/40'
        }`}
      />
    </>
  )
}

export function GlowButton(props: GlowButtonProps) {
  const { variant = 'primary', children, icon, className = '' } = props
  const touch = useIsTouchDevice()
  const cls = `${variant === 'primary' ? 'btn-primary' : 'btn-ghost'} relative group ${className}`

  if (props.href !== undefined) {
    const { variant: v, children: c, icon: i, className: cn, href, ...rest } = props
    void v
    void c
    void i
    void cn
    return (
      <Magnetic strength={touch ? 0 : 0.25}>
        <a className={cls} href={href} {...rest}>
          <Content variant={variant} children={children} icon={icon} />
        </a>
      </Magnetic>
    )
  }

  const { variant: v, children: c, icon: i, className: cn, ...rest } = props
  void v
  void c
  void i
  void cn
  return (
    <Magnetic strength={touch ? 0 : 0.25}>
      <button type="button" className={cls} {...rest}>
        <Content variant={variant} children={children} icon={icon} />
      </button>
    </Magnetic>
  )
}