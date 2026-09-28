import photoOthmane from '../../assets/othmane-yacoubi.png'
import { solution } from '../../lib/solution.ts'
import { Reveal } from '../ui/Reveal.tsx'
import { Section } from '../ui/Section.tsx'

const steps = solution.steps
const dernier = steps.length - 1

/**
 * Noeud du parcours : le disque qui ponctue le trait de liaison.
 *
 * 8 px, donc 4 px de rayon. Il est centre sur la ligne (1 px) qui le
 * traverse, et sur le filet vertical de la version mobile.
 *
 * `group-hover:scale-125` est le seul mouvement de la section : 8 px qui
 * deviennent 10 px. C'est delibere. Une animation plus amplement ne
 * decrirait plus la progression, elle la spectaculariserait.
 */
const noeud = 'size-2 shrink-0 rounded-full bg-gold transition-transform duration-200 group-hover:scale-125'

/**
 * Le trait lui-meme.
 *
 * Volontairement fin (1 px) et jamais plein : a cette echelle un trait plus
 * epais se lirait comme une bordure de tableau, pas comme un chemin.
 */
const trait = 'h-px flex-1 bg-gold/35 transition-colors duration-200 group-hover:bg-gold/60'

/**
 * Micro-intitule du systeme. Volontairement minuscule et discret : il ne
 * remplace pas un titre de section (il y en a un seul, plus haut), il sert
 * seulement a faire lire la bande du bas comme une consequence des quatre
 * etapes, et non comme une cinqieme information sans lien.
 */
const microEtiquette =
  'text-[0.625rem] font-semibold tracking-[0.28em] text-mist/70 uppercase'

/**
 * Nom de l'etape, sur le meme registre que les micro-intitules du site.
 * Cote mobile il se pose a la suite du nombre, sans marge : c'est ce qui
 * tient l'etape sur une seule ligne de tete.
 */
const libelle =
  'text-[0.6875rem] font-semibold tracking-[0.2em] text-gold uppercase sm:text-xs'

/**
 * Un pilier du systeme.
 *
 * La forme commune est factorisee : `outcome` reprend exactement la meme
 * typo mais en creme. Deux classes de couleur ne peuvent pas cohabiter sur
 * le meme element — l'ordre dans l'attribut `class` ne decide de rien,
 * seul l'ordre du CSS genere compte — donc la couleur n'est jamais heritee
 * puis corrigee, elle est choisie une seule fois.
 */
const formePilier =
  'text-[0.6875rem] font-semibold tracking-[0.14em] uppercase sm:text-xs sm:tracking-[0.2em]'

/** Les trois etapes du systeme, en or. */
const pilier = `${formePilier} text-gold`

/** L'aboutissement : le resultat, pas une etape de plus. D'ou le creme. */
const aboutissement = `${formePilier} text-cream`

/**
 * Chevron du systeme. Plus petit que les fleches de l'ancienne version :
 * ici il ne relie pas deux cartes, il montre simplement que les trois
 * piliers convergent. Il est donc discret, et purement decoratif.
 *
 * Le trait demarre a 0.7 et non a 0 : l'extremite de depart est arrondie
 * (`strokeLinecap="round"`), et demarrer exactement sur le bord du
 * viewBox la ferait rogner d'un demi-pixel.
 */
function Chevron() {
  return (
    <svg
      width="13"
      height="9"
      viewBox="0 0 13 9"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-gold/50"
    >
      <path
        d="M0.7 4.5h10.8M8 1l3.5 3.5L8 8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Solution() {
  return (
    <Section
      id="methode"
      headingId="methode-titre"
      eyebrow={solution.eyebrow}
      title={solution.title}
      headerClassName="max-w-2xl"
    >
      {/*
        -------------------------------------------------------------------
        UNE SEULE SECTION, DEUX COUCHES
        -------------------------------------------------------------------
        « Mon approche » et « Comment ca se passe » etaient deux sections
        qui racontaient la meme chose : l'une le systeme, l'autre sa mise en
        oeuvre. Sur mobile, cela obligeait a defiler deux fois, avec un
        titre de section entier au milieu.

        Elles sont donc reunies, et rendues consecutivement :

          1. le CHEMINEMENT - quatre etapes, quatre noeuds relies par un
             meme trait. C'est la partie haute, celle qui se parcourt.
          2. le SYSTEME - ce que ces etapes produisent, en une seule ligne
             de typographie. C'est la synthese, pas un second developpement.

        La deuxieme couche ne repete donc pas la premiere : elle repond a
        une autre question. « On fait quoi ? » (les etapes) puis « ca
        donne quoi ? » (les piliers).

        -------------------------------------------------------------------
        LE DESSIN
        -------------------------------------------------------------------
        Une seule idee graphique : le chemin. Quatre etapes ne sont pas
        quatre blocs poses les uns a cote des autres, ce sont quatre points
        sur un meme trait. Ce trait est l'argument de la section - c'est lui
        qui rend la PROGRESSION visible, pas les quatre nombres.

        Le meme dessin se retourne selon la largeur, sans jamais etre
        simplement reduit :

        MOBILE (par defaut) — trait VERTICAL dans la gouttiere de gauche.
        Il descend avec le regard et sert de colonne vertebrale a la lecture.

        DESKTOP (md et au-dela) — trait HORIZONTAL. Chaque etape possede le
        noeud et le segment qui part vers l'etape suivante, si bien que le
        chemin se lit d'un seul tenant, de gauche a droite.

        Les deux versions partagent le meme code de noeud et la meme
        hierarchie de texte. Seul l'axe change.
      */}
      <ol
        role="list"
        className="mt-10 sm:mt-14 md:mt-16 md:grid md:grid-cols-4 md:gap-x-0"
      >
        {steps.map((etape, i) => (
          <li
            key={etape.id}
            className={`group relative max-sm:pl-8 ${i < dernier ? 'max-sm:pb-6 md:pr-8' : ''}`}
          >
            {/*
              FILET VERTICAL — MOBILE UNIQUEMENT.

              Il est pose dans la gouttiere de 32 px (`max-sm:pl-8` plus
              bas) et mesure toute la hauteur du bloc, plus 10 px : il
              vient donc toucher le noeud de l'etape suivante. C'est
              l'ecart qui compte, pas le decoration — c'est lui qui donne
              au filet son air continu alors qu'il est decoupe en segments.

              La marge basse `max-sm:pb-6` fait, elle, uniquement office de
              respiration : elle espace deux etapes et ne touche ni au noeud
              ni au filet.

              Seule la derniere etape s'en passe : un trait qui Descendrait
              sous la derniere etape dessinerait une suite a venir qui
              n'existe pas.
            */}
            {/*
              LES DEUX VALEURS `10px` CI-DESSOUS DOIVENT RESTER EGALES.

              Le noeud est 10 px a l'interieur de son bloc, pour etre centre
              sur les chiffres (28 px de hauteur de ligne, glyphe centres a
              14 px, disque de 8 px : 10 + 4 = 14). Mais un filet mesure sur
              la seule hauteur du bloc s'arreterait 10 px AVANT le noeud
              suivant, et la ligne se lirait en pointilles a chaque etape.
              Le `calc(100% + 10px)` le prolonge juste assez pour toucher le
              noeud d'apres.
            */}
            {i < dernier && (
              <span
                aria-hidden="true"
                className="absolute top-0 left-[15px] h-[calc(100%+10px)] w-[2px] bg-gold/20 md:hidden"
              />
            )}

            {/* NOEUD — MOBILE UNIQUEMENT. Meme disque que sur desktop, pose
                dans la gouttiere et centre sur les chiffres.
                `top: 10px` n'est pas une valeur au hasard : le chiffre fait
                28 px de hauteur de ligne (`leading-none`) et ses glyphes
                sont centres sur 14 px. 10 + 4 (rayon) = 14 exactement, le
                disque est donc centre sur le chiffre. Le disque fait 8 px,
                le trait 2 px a x=15 : les deux centres sont a 16 px. */}
            <span
              aria-hidden="true"
              className={`absolute top-[10px] left-[12px] md:hidden ${noeud}`}
            />

            {/*
              Niveau 1 de la hierarchie. Volontairement le plus gros chiffre
              de la section, pour que le regard s'y pose en premier : c'est
              lui qui donne l'echelle et la position dans le parcours.

              `group-hover` le fait basculer vers l'or et monter de 2 px. Il
              s'agit du seul retour au survol de la section, et il ne bouge
              que de 2 px : le parcours se lit au repos, le survol ne fait
              que le confirmer.
            */}
            <Reveal delay={i * 90}>
              {/*
                RANG 1. Sur MOBILE le nombre et le nom de l'etape sont sur
                la meme ligne, alignes sur la meme baseline : le nombre
                reste lisible et dominant, mais l'etape tient en une seule
                ligne de tete au lieu de deux. C'est la principale economie
                de hauteur de cette section.

                A partir de md, le conteneur redevient un bloc : le nombre
                occupe sa propre ligne, et le trait horizontal passe dessous
                avant le nom. Le dessin se retourne, il ne se retrecit pas.
              */}
              <div className="max-sm:flex max-sm:items-baseline max-sm:gap-3">
                <p className="text-[1.75rem] leading-none font-extrabold tracking-tight text-cream transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-gold-hi md:text-5xl">
                  {etape.number}
                </p>

                {/*
                  TRAIT HORIZONTAL — DESKTOP UNIQUEMENT.

                  Il est place ICI, entre le nombre et le nom, et non plus
                  bas dans le bloc : le trait doit relier les etapes ENTRE
                  ELLES, donc passer entre la tete de l'une et le corps de
                  l'autre. Pose plus bas, il couperait l'etape en deux et
                  ferait lire le nom comme etrange du chemin.

                  Le noeud ouvre la rangee, le segment part vers l'etape
                  suivante. `md:-mr-8` compense exactement la marge interne
                  `md:pr-8` du bloc : le segment occupe ainsi toute la
                  colonne, decoupling compris, et son extremite droite tombe
                  pile sur le noeud de l'etape suivante. Les deux valeurs
                  doivent rester egales.

                  Sur mobile ce bloc est `hidden` : il ne devient donc pas un
                  element de la ligne flex, et n'ouvre aucun espacement.
                */}
                <div
                  aria-hidden="true"
                  className={`mt-4 hidden items-center md:flex ${i < dernier ? 'md:-mr-8' : ''}`}
                >
                  <span className={noeud} />
                  {i < dernier && <span className={trait} />}
                </div>

                {/*
                  Niveau 2 : le nom de l'etape. C'est le titre semantique
                  (`h3`), comme dans les autres sections a etapes, et c'est
                  volontaire : COMPRENDRE est le nom de l'etape, « On
                  echange » n'en est que la paraphrase. Un lecteur d'ecran
                  doit pouvoir designer l'etape par son nom.
                */}
                <h3 className={`${libelle} md:mt-5`}>{etape.label}</h3>
              </div>

              {/*
                Niveau 3 : la phrase humaine, en plus grand que le label.
                C'est elle que l'on lit si l'on ne lit qu'une ligne par
                etape — d'ou son corps et son gras.
              */}
              <p className="mt-2 text-lg leading-snug font-semibold text-balance text-cream md:mt-4">
                {etape.title}
              </p>

              {/* Niveau 4 : la precision, en retrait, jamais en concurrence.
                  Volontairement une seule phrase : sur mobile, c'est elle
                  qui fait tenir l'etape sur deux lignes au lieu de quatre. */}
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-mist md:mt-2">
                {etape.text}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>

      {/*
        -------------------------------------------------------------------
        LE SYSTEME
        -------------------------------------------------------------------
        Une seule ligne de typographie, pas quatre cartes. Les trois
        piliers s'y lisent dans l'ordre impose, et aboutissent a
        l'Acquisition — seul element en creme, parce que c'est le resultat
        et non une etape de plus.

        Chaque pilier et son chevron sont groupes dans une boite
        `whitespace-nowrap`. Au telephone la ligne passe sur deux rangs, et
        cette boite est la seule chose qui empeche la coupure de tomber
        JUSTE AVANT un chevron — ce qui laisserait une fleche en debut de
        ligne, posee sur rien, et ferait lire le systeme a l'envers.

        Le filet `border-t` reprend exactement le traitement deja utilise
        pour l'aboutissement de l'ancienne section : ce n'est pas un
        encart, c'est une ligne de seuil.
      */}
      <Reveal delay={dernier * 90 + 60}>
        <div className="mt-10 border-t border-gold/30 pt-6 text-center sm:mt-14 sm:pt-8 md:mt-20 md:pt-10">
          <p className={microEtiquette}>{solution.system.label}</p>

          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 sm:mt-5 sm:gap-x-3.5">
            {solution.system.pillars.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span className={pilier}>{p.label}</span>
                <Chevron />
              </span>
            ))}

            <span className="inline-flex items-center whitespace-nowrap">
              <span className={aboutissement}>
                {solution.system.outcome.label}
              </span>
            </span>
          </p>

          {/*
            LA SIGNATURE DU FONDATEUR.

            Elle remplace la phrase de synthese qui cloturait la section.
            Le changement n'est pas cosmétique : une regle de marche a
            suivre (« Chaque etape prepare la suivante ») resume une
            methode qu'on applique, alors qu'une phrase signee dit QUI la
            porte. La section se termine donc sur une personne, pas sur une
            consigne.

            Elle est centree comme le systeme au-dessus, et non posee dans
            une carte : un cadre, un fond ou une ombre la feraient lire
            comme un encart publicitaire. Le blanc qui la separe des
            piliers suffit a la rattacher, et c'est deja ce que fait le
            `border-t` du bloc.

            `<figure>` / `<blockquote>` / `<figcaption>` : ce n'est pas une
            decoration typographique, c'est une parole attributee a son
            auteur, et la structure doit le dire au lecteur d'ecran.
          */}
          <figure className="mt-8 sm:mt-10 md:mt-12">
            <blockquote className="mx-auto w-full max-w-[34rem]">
              <p className="text-base leading-[1.55] text-pretty text-cream italic sm:text-lg sm:leading-[1.6]">
                {solution.signature.quote}
              </p>
            </blockquote>

            {/*
              Photo et nom sur UNE seule ligne. C'est le choix le plus
              compact : les empiler coutait 48 px de hauteur pour rien, et
              la signature doit rester un rappel, pas un portrait.

              48 px sur mobile : au-dessus de la taille plancher de 44 px
              pour un element cliquable — celle-ci ne l'est pas, elle est
              purement informative — et en dessous du volume qu'un visage
              demande. 64 px au-dela de sm, ou la place existe.

              `alt=""` est VOLONTAIRE. Le nom est ecrit juste a cote, dans
              la meme `figcaption` : le decrire en plus ferait entendre
              « Othmane Yacoubi, image, Othmane Yacoubi ».

              `object-cover` est ici un defaut prudent plutot qu'une
              correction : le fichier fourni est deja carre (320 x 320,
              sans canal alpha), donc `cover` et `contain` donnent
              exactement le meme resultat. Si la photo est remplacee un
              jour par un recadrage rectangulaire, `cover` est celui qui
              emplit le cercle sans laisser de bande laterale.

              `width` / `height` valent 64 et non 320 : leur seul role est
              de faire reserver la bonne proportion avant le chargement.
              Mettre la taille reelle ferait sauter la mise en page de
              272 px sur mobile le temps que le CSS s'applique.
            */}
            <figcaption className="mt-4 flex items-center justify-center gap-3 sm:mt-5">
              <img
                src={photoOthmane}
                alt=""
                width={64}
                height={64}
                className="size-12 shrink-0 rounded-full object-cover ring-1 ring-gold/30 sm:size-16"
              />
              <span className="text-sm font-semibold tracking-[0.02em] text-cream sm:text-base">
                {solution.signature.name}
              </span>
            </figcaption>
          </figure>
        </div>
      </Reveal>
    </Section>
  )
}
