import { useEffect, useRef } from 'react'

import { hero } from '../../lib/hero.ts'
import { abonnerMouvement, mouvementActif } from '../../lib/motion.ts'
import { Button } from '../ui/Button.tsx'
import { Container } from '../ui/Container.tsx'
import { Eyebrow } from '../ui/Eyebrow.tsx'

/** Apparition douce, decalee pour une entree en ordre. */
function rise(delay: number) {
  return { animationDelay: `${delay}ms` }
}

/**
 * ---------------------------------------------------------------------------
 * PARALLAXE : 6 PX, ET RIEN D'AUTRE
 * ---------------------------------------------------------------------------
 * Le Hero n'a pas de visuel — c'est un choix, pas une absence, et le brief
 * interdit d'en ajouter un. Il n'y a donc rien a faire tourner : le seul
 * mouvement disponible est le bloc de texte lui-meme, qui glisse de quelques
 * pixels quand la page defile.
 *
 * Six pixels, c'est la limite en dessous de laquelle le regard ne suit pas
 * le deplacement, mais ou le mouvement se sent encore. Au-dela, le titre
 * « flotte », et un titre qui flotte pendant qu'on lit n'est plus un titre.
 *
 * LE BUDGET DE PERFORMANCES EST TENU PAR QUATRE REGLES :
 *
 *   1. `transform` uniquement. Ni `top`, ni `height`, ni `box-shadow` : rien
 *      de ce que le navigateur ne peut pas composer sur le GPU.
 *   2. Un seul ecouteur `scroll`, sur toute la page, en `passive`.
 *   3. Un `requestAnimationFrame` par image au maximum. Le scroll peut
 *      decoder cinquante evenements entre deux images ; on n'en peint qu'un.
 *   4. Rien du tout sous 1024 px, ou le texte se lit en meme temps qu'il
 *      bouge.
 *
 * La meme contrainte vaut pour le mouvement demande : c'est pourquoi
 * l'ecouteur se retire des que le visiteur coupe les animations, plutot que
 * de s'y executer dans le vide.
 */
function useParallaxeDouce() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Rien a animer si le systeme ou le visiteur ont coupe le mouvement.
    if (!mouvementActif()) return
    if (window.matchMedia('(max-width: 1023px)').matches) return

    let image = 0

    /*
     * Ces trois callbacks sont des `const` et non des `function` nommes :
     * TypeScript ne reporte pas le controle de flux dans une declaration de
     * fonction, qui peut etre appelee avant meme d'etre definie. En `const`,
     * le compilateur sait que `el` est deja verifie non nul, et le code n'a
     * pas besoin d'un `!` qui le ferait taire sans le prouver.
     */

    const mesurer = () => {
      image = 0
      // 6 px au maximum, whatever la profondeur de defilement.
      const dy = Math.max(-6, Math.min(6, window.scrollY * 0.06))
      el.style.transform = `translate3d(0, ${dy.toFixed(2)}px, 0)`
    }

    const surDefilement = () => {
      // L'ecouteur reste en place quoi qu'il arrive : seule la boucle de
      // rendu s'arrete. Le retirer ferait que repasser sur « ON » ne
      // remettrait jamais la parallaxe en route.
      if (image || !mouvementActif()) return
      image = requestAnimationFrame(mesurer)
    }

    const auChangementDeMouvement = () => {
      if (mouvementActif()) return
      // Le CSS neutralise deja l'effet (`[data-motion='off']`), mais on
      // efface la valeur posee : sans cela, un retour a « ON » ferait
      // reapparaitre un decalage que personne n'a provoke.
      el.style.transform = ''
      if (image) cancelAnimationFrame(image)
      image = 0
    }

    window.addEventListener('scroll', surDefilement, { passive: true })
    const desabonner = abonnerMouvement(auChangementDeMouvement)

    return () => {
      desabonner()
      window.removeEventListener('scroll', surDefilement)
      if (image) cancelAnimationFrame(image)
    }
  }, [])

  return ref
}

export function Hero() {
  const parallaxe = useParallaxeDouce()

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
        <div
          ref={parallaxe}
          data-parallaxe=""
          className="max-w-3xl py-16 sm:py-20 md:py-24 lg:py-36"
        >
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
            {hero.title.after}
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
