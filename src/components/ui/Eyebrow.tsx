import type { CSSProperties, ReactNode } from 'react'

/**
 * Petit label d'introduction, place au-dessus d'un titre de section.
 * L'accent gold est volontairement utilise avec parcimonie.
 */
export function Eyebrow({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <p className={`text-sm font-medium text-gold ${className}`} style={style}>
      {children}
    </p>
  )
}
