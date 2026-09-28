import { useState } from 'react'

import { cta, navLinks } from '../../lib/site.ts'
import { BrandLabel } from '../ui/BrandLabel.tsx'
import { Button } from '../ui/Button.tsx'
import { Container } from '../ui/Container.tsx'

const linkClasses =
  'text-sm text-mist transition-colors duration-150 hover:text-cream'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-ink">
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
            <Button href={cta.href} size="sm">
              {cta.label}
            </Button>
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
          className="border-t border-cream/10 bg-ink md:hidden"
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
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
