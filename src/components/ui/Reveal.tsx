import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Apparition douce quand l'element entre dans la fenetre.
 *
 * PRINCIPE DE SECURITE : le contenu est visible par defaut.
 * L'etat masque n'est pose que lorsqu'un observateur reellement actif
 * va le redeclencher. Si IntersectionObserver est indisponible, s'il
 * ne repond pas (onglet en arriere-plan a l'ouverture, impression,
 * export PDF, rendu sans moteur graphique) ou si le composant echoue,
 * l'element reste simplement visible, sans animation.
 *
 * Le contenu ne peut donc jamais rester invisible.
 *
 * Les elements deja a l'ecran au chargement ne sont jamais masques :
 * ils n'ont pas besoin d'animation et ne courent aucun risque.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'visible' | 'attente' | 'anime'>('visible')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    // Animations Coupees par le systeme : on n'attend rien, on affiche.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Onglet masque au moment du montage : IntersectionObserver ne livre
    // AUCUN callback tant que document.hidden vaut true (onglet en
    // arriere-plan, rendu headless, impression, export PDF). Masquer
    // l'element dans ce cas reviendrait a le laisser invisible. On
    // laisse donc tout visible : l'observateur sera de toute facon
    // inutile ici, et le contenu ne peut pas disparaitre.
    if (document.hidden) return

    // Deja dans la fenetre : laisse visible, sans animation.
    if (el.getBoundingClientRect().top < window.innerHeight) return

    setPhase('attente')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPhase('anime')
            observer.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const animation =
    phase === 'attente' ? 'opacity-0' : phase === 'anime' ? 'animate-reveal' : ''

  return (
    <div
      ref={ref}
      className={`${animation} ${className}`}
      style={phase === 'anime' && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
