import { hero } from '../../lib/hero.ts'
import { Button } from '../ui/Button.tsx'
import { Container } from '../ui/Container.tsx'
import { Eyebrow } from '../ui/Eyebrow.tsx'

/** Apparition douce, decalee pour une entree en ordre. */
function rise(delay: number) {
  return { animationDelay: `${delay}ms` }
}

export function Hero() {
  return (
    <section
      id="accueil"
      className="border-b border-cream/10"
      aria-labelledby="hero-titre"
    >
      <Container>
        {/*
          Rythme mobile resserre : le Hero garde sa presence mais cesse de
          pousser le reste de la page vers le bas. Les paliers `md` et `lg`
          restituent exactement les valeurs desktop d'origine.
        */}
        <div className="max-w-3xl py-16 sm:py-20 md:py-24 lg:py-36">
          <Eyebrow className="animate-reveal" style={rise(0)}>
            {hero.eyebrow}
          </Eyebrow>

          <h1
            id="hero-titre"
            className="animate-reveal mt-5 text-[2rem] leading-[1.1] font-extrabold tracking-tight text-cream sm:mt-6 sm:text-5xl sm:leading-[1.08] md:text-6xl"
            style={rise(80)}
          >
            {hero.title.before}{' '}
            <span className="text-gold">{hero.title.accent}</span>
          </h1>

          {/*
            Description volontairement en 15 px sur mobile : a 16 px elle
            prenait 4 lignes et pesait trop dans le premier ecran. Le
            palier sm conserve les 18 px d'origine.
          */}
          <p
            className="animate-reveal mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-mist sm:mt-6 sm:text-lg"
            style={rise(160)}
          >
            {hero.subtitle}
          </p>

          <div
            className="animate-reveal mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
            style={rise(240)}
          >
            <Button href={hero.actions.primary.href} size="lg">
              {hero.actions.primary.label}
            </Button>
            <Button
              href={hero.actions.secondary.href}
              variant="secondary"
              size="lg"
            >
              {hero.actions.secondary.label}
            </Button>
          </div>

          {/* Aucune ligne de reassurance pour l'instant : toute promesse
              (delai de reponse, garantie) doit etre validee avant d'etre
              affichee. Voir src/lib/hero.ts */}
          {hero.reassurance && (
            <p className="mt-4 text-sm text-mist sm:mt-6" style={rise(320)}>
              {hero.reassurance}
            </p>
          )}
        </div>
      </Container>
    </section>
  )
}
