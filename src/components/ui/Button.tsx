import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center rounded-btn font-medium transition-colors duration-150'

const variants: Record<Variant, string> = {
  // Or plein, texte encre : contraste 7.3:1 (niveau AAA)
  primary: 'bg-gold text-ink hover:bg-gold-hi',
  // Voile clair (`.verre`, section 3 bis de index.css) : le second choix se
  // detache du fond sans eclaircir le texte qu'il contient, et garde le meme
  // traitement de bordure que le bouton plein.
  secondary:
    'verre border border-cream/15 text-cream hover:border-gold hover:text-gold',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

type ButtonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  /** Si fourni, le bouton est rendu en lien (CTA de navigation). */
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

/**
 * Bouton d'action. Rendu en <a> si `href` est fourni, en <button> sinon.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  href,
  onClick,
  type = 'button',
  disabled,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}
