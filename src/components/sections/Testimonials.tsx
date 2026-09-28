/**
 * Section Temoignages — carousel horizontal d'audios clients.
 *
 * ---------------------------------------------------------------------------
 * UN SEUL AUDIO, GARANTIE STRUCTURELLE
 * ---------------------------------------------------------------------------
 * Toute la section partage UN SEUL element <audio>. Il n'existe donc pas
 * deux pistes pouvant jouer en meme temps : l'exclusivite n'est pas une
 * regle a respecter, elle est impossible a violer. Demarrer un
 * temoignage remplace simplement la source de cet element unique.
 *
 * AUCUN AUTOPLAY : `play()` n'est appele que depuis le onclick du bouton.
 * Jamais dans un effet, jamais au montage. Le navigateur refuse de toute
 * facon de demarrer un media sans geste utilisateur.
 *
 * PAS DE TRANSCRIPTION : ce fichier n'affiche ni citation, ni resume, ni
 * chiffre. L'audio est la preuve ; le reste de la carte est strictement
 * l'identite du client.
 */

import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { testimonials, testimonialsSection } from '../../lib/testimonials.ts'
import { LecteurAudio } from '../ui/LecteurAudio.tsx'
import type { EtatPlayer } from '../ui/LecteurAudio.tsx'
import { Reveal } from '../ui/Reveal.tsx'
import { Section } from '../ui/Section.tsx'

/** Nom interne du gradient, partage par le bouton precedent et le suivant. */
function Fleche({ vers }: { vers: 'avant' | 'apres' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={vers === 'avant' ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path
        d="M3 9h12M10.5 4.5 15 9l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Testimonials() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const pisteRef = useRef<HTMLDivElement>(null)

  /**
   * Source a demarrer des qu'elle sera prete.
   *
   * Sert uniquement quand le visiteur clique « Ecouter » sur une carte qui
   * n'est pas encore celle affichee : le carousel va d'abord sur cette
   * carte, le fichier se charge, et la lecture demarre a ce moment-la.
   * Sans cela, le bouton d'une carte non visible demarrerait l'audio de la
   * carte visible : on entendrait le mauvais temoignage.
   */
  const intentionLecture = useRef<string | null>(null)

  const [index, setIndex] = useState(0)
  const [etat, setEtat] = useState<EtatPlayer>('chargement')
  const [temps, setTemps] = useState(0)
  const [duree, setDuree] = useState(0)

  /**
   * Fichiers connus comme absents, par identifiant de temoignage.
   *
   * SANS CE SONDAGE, les quatre cartes n'auraient pas le meme aspect : la
   * carte affichee aurait « Audio bientot disponible » (elle a reellement
   * tente de charger), les trois autres afficheraient des temps qui
   * laisseraient croire a un audio pret. L'aspect du carousel changerait
   * donc a chaque swipe, ce qui se lit comme une panne.
   *
   * On sonde donc les quatre fichiers au montage, en HEAD : la reponse ne
   * transporte aucun corps, seulement l'entete.
   *
   * PIEGE DU CODE HTTP : une application monopage ne renvoie PAS 404 pour
   * un fichier absent, elle repond 200 en servant index.html. Un fichier
   * audio manquant se presente donc comme un succes. C'est pourquoi le
   * sondage verifie aussi le TYPE MIME, qui ne trompe pas : un fichier
   * audio repond `audio/mpeg`, une page de repli repond `text/html`.
   * L'element <audio> reste l'autorite finale : un fichier reellement
   * present mais illisible, ou tronque, bascule en « bientot disponible »
   * a la premiere tentative de lecture.
   */
  const [absents, setAbsents] = useState<ReadonlySet<string>>(new Set())

  const total = testimonials.length
  const courant = testimonials[index] ?? testimonials[0]
  const idAudio = courant.audio
  const disponible = etat !== 'indisponible'
  const dernierIndex = total - 1

  /* -------------------------------------------------------------------------
   * Sondage de disponibilite des quatre fichiers (voir `absents`).
   * ---------------------------------------------------------------------- */
  useEffect(() => {
    let annule = false

    Promise.all(
      testimonials.map(async (t) => {
        try {
          const r = await fetch(t.audio, { method: 'HEAD' })
          if (r.status === 404 || r.status === 403) return [t.id, true] as const
          // 200 mais pas un type audio : c'est la page de repli SPA.
          const type = r.headers.get('content-type') ?? ''
          if (r.ok && type && !type.startsWith('audio/')) return [t.id, true] as const
          // 405, 5xx, coupure reseau : on ne conclut rien.
          return [t.id, false] as const
        } catch {
          // Hors ligne : on ne conclut rien, l'element audio tranchera.
          return [t.id, false] as const
        }
      }),
    ).then((resultats) => {
      if (annule) return
      setAbsents(new Set(resultats.filter(([, manquant]) => manquant).map(([id]) => id)))
    })

    return () => {
      annule = true
    }
  }, [])

  /* -------------------------------------------------------------------------
   * Chargement du fichier du temoignage courant.
   *
   * Les ecouteurs sont (re)attaches dans le meme effet que le changement
   * de source, donc ils ferment toujours sur le bon src. Le nettoyage
   * retire les ecouteurs AVANT que l'evenement `pause` de a.pause() ne
   * soit distribue (les evenements media sont asynchrones) : aucun etat
   * parasite ne peut donc passer d'un temoignage a l'autre.
   * ---------------------------------------------------------------------- */
  useEffect(() => {
    const a = audioRef.current
    if (!a) return

    const surLecture = () => setEtat('lecture')
    const surPause = () => setEtat(a.ended ? 'termine' : 'pause')
    const surFin = () => {
      setEtat('termine')
      setTemps(0)
    }
    const surTemps = () => setTemps(a.currentTime)
    const surMeta = () => {
      setDuree(Number.isFinite(a.duration) ? a.duration : 0)
      // Demande de lecture faite sur une carte qui n'etait pas encore
      // visible : on demarre des que la source du bon temoignage est
      // prete. `idAudio` est capture ici, donc l'intent ne peut
      // demarrer que LE bon fichier, jamais celui de la carte precedente.
      if (intentionLecture.current === idAudio) {
        intentionLecture.current = null
        setEtat('lecture')
        void a.play().catch(() => undefined)
        return
      }
      setEtat(a.paused ? 'inactif' : 'lecture')
    }
    const surAttente = () => {
      if (!a.paused) setEtat('chargement')
    }
    const surErreur = () => setEtat('indisponible')

    a.addEventListener('play', surLecture)
    a.addEventListener('pause', surPause)
    a.addEventListener('ended', surFin)
    a.addEventListener('timeupdate', surTemps)
    a.addEventListener('loadedmetadata', surMeta)
    a.addEventListener('durationchange', surMeta)
    a.addEventListener('waiting', surAttente)
    a.addEventListener('canplay', surAttente)
    a.addEventListener('error', surErreur)

    // Un changement de temoignage arrete toujours la lecture en cours.
    a.pause()
    a.src = idAudio
    setEtat('chargement')
    setTemps(0)
    setDuree(0)
    a.load()

    return () => {
      a.pause()
      a.removeEventListener('play', surLecture)
      a.removeEventListener('pause', surPause)
      a.removeEventListener('ended', surFin)
      a.removeEventListener('timeupdate', surTemps)
      a.removeEventListener('loadedmetadata', surMeta)
      a.removeEventListener('durationchange', surMeta)
      a.removeEventListener('waiting', surAttente)
      a.removeEventListener('canplay', surAttente)
      a.removeEventListener('error', surErreur)
    }
  }, [idAudio])

  /* -------------------------------------------------------------------------
   * Navigation du carousel.
   * ---------------------------------------------------------------------- */

  /** Déplace le carousel sur une carte, bornes comprises. */
  function allerA(cible: number) {
    // Toute navigation annule une lecture en attente. Sans cela, un clic
    // sur une carte dont le fichier se avere absent, suivi d'un simple
    // swipe vers elle, demarrerait la lecture sans nouveau geste.
    intentionLecture.current = null
    const borne = Math.min(Math.max(cible, 0), dernierIndex)
    const piste = pisteRef.current
    const cartes = piste?.querySelectorAll<HTMLElement>('[data-carte]')

    if (piste && cartes && cartes.length > 1) {
      // Le pas est mesure sur le DOM reel, donc il suit automatiquement
      // les changements de largeur (carte fluide a 86 %, pleine a partir
      // de sm) sans aucun calcul de breakpoint en JavaScript.
      const pas = cartes[1].offsetLeft - cartes[0].offsetLeft
      const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      piste.scrollTo({ left: pas * borne, behavior: reduit ? 'auto' : 'smooth' })
    }

    setIndex(borne)
  }

  /**
   * Suivi du swipe tactile et de la molette.
   *
   * Sans cet effet, l'indicateur ne suivrait QUE les boutons, et un swipe
   * au doigt laisserait « 01 / 04 » affiche alors que la carte 02 est a
   * l'ecran. Rattraper l'index ici garde les deux en coherence, et permet
   * aussi d'arreter la lecture si le swipe eloigne la carte en cours.
   */
  useEffect(() => {
    const piste = pisteRef.current
    if (!piste) return

    let cadre = 0
    const suivre = () => {
      const cartes = piste.querySelectorAll<HTMLElement>('[data-carte]')
      if (cartes.length < 2) return
      const pas = cartes[1].offsetLeft - cartes[0].offsetLeft
      if (pas <= 0) return
      const vise = Math.round(piste.scrollLeft / pas)
      setIndex(Math.min(Math.max(vise, 0), dernierIndex))
    }
    const surDefilement = () => {
      if (cadre) return
      cadre = requestAnimationFrame(() => {
        cadre = 0
        suivre()
      })
    }

    piste.addEventListener('scroll', surDefilement, { passive: true })
    return () => {
      piste.removeEventListener('scroll', surDefilement)
      if (cadre) cancelAnimationFrame(cadre)
    }
  }, [dernierIndex])

  /** Arret de la lecture des que la carte quitte la vue. */
  useEffect(() => {
    audioRef.current?.pause()
  }, [index])

  /* -------------------------------------------------------------------------
   * Actions du lecteur
   * ---------------------------------------------------------------------- */
  function lecture(cible: number) {
    // Clic sur une carte qui n'est pas encore affichee : on y va d'abord,
    // et la lecture partira des que SA source sera prete (voir l'effet de
    // chargement). On n'entend jamais le temoignage d'une autre carte.
    if (cible !== index) {
      //allerA annule d'abord toute intention, on la pose donc APRES.
      allerA(cible)
      if (!absents.has(testimonials[cible]?.id ?? '')) {
        intentionLecture.current = testimonials[cible]?.audio ?? null
      }
      return
    }
    const a = audioRef.current
    if (!a || !disponible) return
    // Seul endroit du composant ou play() est appele : toujours apres un
    // geste explicite. Le catch absorbe le rejet lie au changement de
    // source ; l'evenement `error` reste le juge de la disponibilite.
    void a.play().catch(() => undefined)
  }

  function pause() {
    audioRef.current?.pause()
  }

  function position(ratio: number) {
    const a = audioRef.current
    if (!a || duree <= 0) return
    const instant = Math.min(Math.max(ratio, 0), 1) * duree
    a.currentTime = instant
    setTemps(instant)
  }

  /* -------------------------------------------------------------------------
   * Clavier : le conteneur defilant reagit aux fleches comme un carousel
   * doit le faire. Les boutons Lecture / Pause et Position restent
   * eux-memes dans l'ordre du tabulateur, donc la tabulation n'est pas
   * interrompue.
   * ---------------------------------------------------------------------- */
  function surTouche(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      allerA(index + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      allerA(index - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      allerA(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      allerA(dernierIndex)
    }
  }

  const progression = duree > 0 ? temps / duree : 0

  return (
    <Section
      id="temoignages"
      headingId="temoignages-titre"
      eyebrow={testimonialsSection.eyebrow}
      title={testimonialsSection.title}
      intro={testimonialsSection.intro}
      headerClassName="max-w-2xl"
    >
      {/* Un seul <audio> pour toute la section : c'est ce qui garantit
          qu'un seul temoignage peut jouer a la fois. `hidden` ne coupe
          pas la lecture, et aucun attribut `autoplay` n'est pose. */}
      <audio ref={audioRef} preload="metadata" className="hidden" />

      <Reveal className="mt-8 sm:mt-10">
        {/* Piste : -mx-5 / px-5 font deborder les cartes jusqu'au bord de
            l'ecran (plus naturel au doigt) sans jamais deborder le body.
            C'est CE conteneur qui defile, pas la page. La carte fait 86 %
            de la largeur : la suivante reste visible, ce qui indique le
            swipe. A partir de sm, une seule carte pleine largeur. */}
        <div
          id="temoignages-piste"
          ref={pisteRef}
          onKeyDown={surTouche}
          role="group"
          aria-label={testimonialsSection.regionLabel}
          tabIndex={0}
          className="-mx-5 overflow-x-auto px-5 no-scrollbar sm:mx-auto sm:max-w-3xl sm:overflow-x-hidden sm:px-0"
        >
          <ul className="relative flex snap-x snap-mandatory gap-3 sm:gap-4">
            {testimonials.map((t, i) => (
              <li
                key={t.id}
                data-carte
                className="w-[86%] shrink-0 snap-start rounded-card border border-cream/10 bg-slate sm:w-full"
              >
                <LecteurAudio
                  numero={String(i + 1).padStart(2, '0')}
                  total={total}
                  nom={t.nom}
                  ville={t.ville}
                  etat={
                    absents.has(t.id)
                      ? 'indisponible'
                      : i === index
                        ? etat
                        : 'inactif'
                  }
                  progression={i === index ? progression : 0}
                  temps={i === index ? temps : 0}
                  duree={i === index ? duree : 0}
                  onLecture={() => lecture(i)}
                  onPause={pause}
                  onPosition={position}
                />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Navigation : fleches + pagination, dans la meme largeur que la
          piste pour que tout le bloc reste aligne. */}
      <div className="mt-5 flex items-center justify-between sm:mx-auto sm:mt-6 sm:max-w-3xl">
        <button
          type="button"
          onClick={() => allerA(index - 1)}
          disabled={index === 0}
          aria-label="Témoignage précédent"
          aria-controls="temoignages-piste"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream transition-colors duration-150 hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:border-cream/10 disabled:text-mist/30"
        >
          <Fleche vers="avant" />
        </button>

        {/* Pagination : la pastille s'elargit sur l'active. Chaque cible
            fait 24 x 44 px, donc 44 px de haut au doigt. */}
        <ul className="flex items-center gap-1">
          {testimonials.map((t, i) => {
            const actif = i === index
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => allerA(i)}
                  aria-label={`Aller au témoignage de ${t.nom}`}
                  aria-current={actif ? 'true' : undefined}
                  className="flex h-11 w-6 items-center justify-center"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      actif ? 'w-6 bg-gold' : 'w-1.5 bg-cream/25'
                    }`}
                  />
                </button>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={() => allerA(index + 1)}
          disabled={index === dernierIndex}
          aria-label="Témoignage suivant"
          aria-controls="temoignages-piste"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream transition-colors duration-150 hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:border-cream/10 disabled:text-mist/30"
        >
          <Fleche vers="apres" />
        </button>
      </div>

      {/* Annonce pour les lecteurs d'ecran : l'identite du temoignage
          visible et l'etat de lecture, sans dependre de la couleur. */}
      <p className="sr-only" aria-live="polite">
        {`Témoignage ${index + 1} sur ${total} : ${courant.nom}, ${courant.ville}.`}
        {etat === 'lecture'
          ? ' Lecture en cours.'
          : etat === 'indisponible'
            ? ' Audio bientôt disponible.'
            : ''}
      </p>
    </Section>
  )
}
