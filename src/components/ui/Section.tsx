import type { ReactNode } from 'react'

import { Container } from './Container.tsx'
import { Eyebrow } from './Eyebrow.tsx'

type SectionProps = {
  /** Ancre de la section, ciblee par la navigation. */
  id: string
  /** Identifiant du titre, pour `aria-labelledby`. */
  headingId: string
  eyebrow?: string
  title?: ReactNode
  intro?: ReactNode
  children: ReactNode
  /** Largeur du bloc d'en-tete. */
  headerClassName?: string
  className?: string
}

/**
 * Gabarit de section : ancre semantique, conteneur, en-tete
 * (eyebrow / titre / introduction) et contenu.
 *
 * L'eyebrow est mis en majuscules ici, ce qui n'affecte pas le Hero
 * (qui utilise `Eyebrow` directement).
 *
 * RYTHME : les espacements montent par paliers. Le mobile respire moins
 * (48 px) pour reduire le scroll, le desktop garde ses 112 px d'origine.
 * Chaque palier couvre une largeur de lecture comfortable.
 */
export function Section({
  id,
  headingId,
  eyebrow,
  title,
  intro,
  children,
  headerClassName = 'max-w-3xl',
  className = '',
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`border-b border-cream/10 py-12 sm:py-16 md:py-20 lg:py-28 ${className}`}
    >
      <Container>
        <div className={headerClassName}>
          {eyebrow && <Eyebrow className="uppercase">{eyebrow}</Eyebrow>}

          {title && (
            <h2
              id={headingId}
              className="mt-4 text-3xl leading-[1.15] font-bold tracking-tight text-cream sm:mt-5 sm:text-4xl"
            >
              {title}
            </h2>
          )}

          {intro && (
            <p className="mt-4 text-base leading-relaxed text-mist sm:mt-5 sm:text-lg">
              {intro}
            </p>
          )}
        </div>

        {children}
      </Container>
    </section>
  )
}
