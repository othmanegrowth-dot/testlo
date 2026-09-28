import photoPresence from '../../assets/probleme-presence-en-ligne.jpg'
import { problem } from '../../lib/problem.ts'
import { Reveal } from '../ui/Reveal.tsx'
import { Section } from '../ui/Section.tsx'
import { Visual } from '../ui/Visual.tsx'

export function Problem() {
  return (
    <Section
      id="probleme"
      headingId="probleme-titre"
      eyebrow={problem.eyebrow}
      title={problem.title}
      intro={problem.intro}
      headerClassName="max-w-2xl"
    >
      {/* Espacements resserres sur mobile ; le visuel passe avant les
          points, qui se lisent alors d'un seul geste. */}
      <div className="mt-10 grid gap-8 sm:mt-14 sm:gap-12 md:mt-20 md:grid-cols-12 md:gap-14">
        {/* Visuel : 7 colonnes sur desktop, en tete sur mobile */}
        <Reveal className="md:order-2 md:col-span-7">
          <Visual
            src={photoPresence}
            alt={problem.visual.alt}
            ratio="3/2"
          />
        </Reveal>

        {/* Trois points — PRIORITE 1 : swipe horizontal sur mobile.
            Le -mx-5 / px-5 tricke la gouttiere pour que la carte
            deborde jusqu'au bord de l'ecran (plus naturel au doigt)
            sans jamais deborder le body : c'est CE conteneur qui
            scrolle, pas la page. A partir de sm, retour a la liste
            verticale d'origine, strictement identique au desktop. */}
        {/* min-w-0 est OBLIGATOIRE : sans lui, la piste de grille prend
            la largeur min-content du <ol> (ses cartes en flex-shrink-0),
            le -mx-5 pousse alors la boite hors du viewport et le body
            deborde. min-w-0 autorise la piste a se retrecir, donc
            l'overflow-x-auto confine reellement le scroll. */}
        <div className="min-w-0 md:order-1 md:col-span-5">
          <Reveal className="min-w-0">
            <div
              className="-mx-5 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:overflow-visible sm:px-0"
              role="region"
              aria-label="Les trois problèmes, faites défiler"
              tabIndex={0}
            >
              <ol className="flex snap-x snap-mandatory gap-3 sm:mt-0 sm:grid sm:grid-cols-1 sm:gap-0 sm:border-t sm:border-cream/10">
                {problem.points.map((point) => (
                  <li
                    key={point.id}
                    className="w-[78%] shrink-0 snap-center rounded-card border border-cream/10 bg-slate p-5 sm:w-auto sm:rounded-none sm:border-0 sm:border-b sm:border-cream/10 sm:bg-transparent sm:p-0 sm:py-6"
                  >
                    <p className="text-xs font-medium tracking-[0.2em] text-gold">
                      {point.number}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-cream">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-mist">{point.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={120}>
        <p className="mt-10 max-w-2xl text-xl leading-snug font-semibold text-balance text-cream sm:mt-14 sm:text-2xl">
          Le problème n’est pas toujours de faire plus.{' '}
          <span className="text-gold">
            C’est de mieux connecter les choses.
          </span>
        </p>
      </Reveal>
    </Section>
  )
}
