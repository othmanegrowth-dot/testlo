import type { ReactNode } from 'react'

/**
 * Conteneur de largeur maximale.
 * Centralise la gouttiere et la largeur max utilisees par toutes les sections.
 */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  )
}
