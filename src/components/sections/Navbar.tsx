import { useState } from 'react'

import { cta, navLinks } from '../../lib/site.ts'
import { BrandLabel } from '../ui/BrandLabel.tsx'
import { Button } from '../ui/Button.tsx'
import { Container } from '../ui/Container.tsx'
import { MotionSwitch } from '../ui/MotionSwitch.tsx'

const linkClasses =
  'text-sm text-mist transition-colors duration-150 hover:text-cream'

/**
 * NAVIGATION.
 *
 * ---------------------------------------------------------------------------
 * LA BARRE EST UN VOILE, PAS UN BLOC OPAQUE
 * ---------------------------------------------------------------------------
 * Elle occupe toute la largeur et reste posee sur le contenu, qui est exacte-
 * ment le role d'un voile : separer la navigation de ce qui defile, sans
 * fermer la page. D'ou `.verre-nav` (section 3 bis de `index.css`), un voile
 * encre a 78 % et un flou de 16 px.
 *
 * Le voile est fonce et non clair, volontairement : un voile creme a 78 % sur
 * du texte creme perdrait le contraste des le premier titre passe dessous.
 * 78 % d'encre laisse passer assez de page pour que la transparence se voie,
 * et assez peu pour qu'aucun texte ne soit jamais coupe par la barre.
 *
 * `backdrop-filter` ne porte que sur ces deux elements (la barre et son
 * panneau). Aucun autre element de la page n'a de flou : c'est la seule
 * surface du site a le vouloir.
 * ---------------------------------------------------------------------------
 */
export function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="verre-nav sticky top-0 z-50 border-b border-cream/10">
      <Container>
        <div className="flex h-(--navbar-h) items-center justify-between gap-6">
          <a href="#accueil" onClick={close}>
            <BrandLabel />
          </a>

          {/* Navigation desktop */}
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Navigation principale"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={linkClasses}>
                {link.label}
              </a>
            ))}

            {/*
              Le controle Motion vient APRES le CTA, jamais entre les liens
              et lui. Le CTA est la sortie de la page : il doit rester le
              dernier element de lecture. Le controle Motion est une
              preference d'affichage, pas une destination, et se place donc
              de l'autre cote, ou il ne coupe pas la ligne.
            */}
            <Button href={cta.href} size="sm">
              {cta.label}
            </Button>

            <MotionSwitch />
          </nav>

          {/* Bouton menu mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            /* 44x44 : seuil de confort tactile sur mobile.
               Le -mr-2 compense la marge pour que l'icone reste
               optically alignee avec le logo. Sans effet sur desktop. */
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-btn text-cream md:hidden"
          >
            <span className="sr-only">
              {open ? 'Fermer le menu' : 'Ouvrir le menu'}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              {open ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Panneau mobile */}
      {open && (
        <div
          id="menu-mobile"
          className="verre-nav border-t border-cream/10 md:hidden"
        >
          <Container>
            <nav
              className="flex flex-col py-4"
              aria-label="Navigation mobile"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="py-3 text-base text-mist transition-colors duration-150 hover:text-cream"
                >
                  {link.label}
                </a>
              ))}
              <Button
                href={cta.href}
                size="md"
                className="mt-3 w-full"
                onClick={close}
              >
                {cta.label}
              </Button>

              {/*
                Sur mobile, le controle est dans le panneau. Le placer dans
                la barre prendrait une place equivalente au logo sur un
                ecran de 375 px, pour une preference que la plupart des
                visiteurs n'ouvrent jamais.

                Il est empile SOUS le CTA, avec un filet au-dessus qui le
                distingue : meme sans le libelle, la position suffit a
                dire « reglage », et non « lien de navigation ».

                Un seul des deux exemplaires est expose a l'ecran : l'autre
                est en `display: none`, donc invisible aux technologies
                d'assistance comme au clavier.
              */}
              <div className="mt-3 border-t border-cream/10 pt-3">
                <MotionSwitch className="w-full justify-between" />
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
