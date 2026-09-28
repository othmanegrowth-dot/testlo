/**
 * Lecteur audio d'un temoignage — version compacte.
 *
 * ---------------------------------------------------------------------------
 * INTENTION
 * ---------------------------------------------------------------------------
 * Le visiteur est ici pour ECUTER, pas pour regarder du design. La carte
 * est donc volontairement la plus petite possible : un rang unique qui
 * tient sur trois lignes, avec le bouton de lecture et la forme d'onde a
 * portee de pouce. Tout ce qui n'aide pas a ecouter a ete retire — pas de
 * filet separateur, pas d'image, pas de citation, pas de bouton
 * secondaire, pas de texte d'introduction.
 *
 * Ce qui reste, et rien d'autre : le numero du temoignage, le lecteur, le
 * prenom et la ville.
 *
 * ---------------------------------------------------------------------------
 * CHOIX TECHNIQUE : AUCUNE DEPENDANCE
 * ---------------------------------------------------------------------------
 * Pas de wavesurfer, pas de Howler : le seul controle « lecture / pause »
 * est un <button>, et le controle de position est un
 * <input type="range"> natif, pose en transparent au-dessus de la forme
 * d'onde. Le navigateur fournit alors gratuitement : le role ARIA, le
 * nom accessible, la navigation clavier (fleches, Home, End, PageUp/Down),
 * le tactile et le glisser-deposer du curseur. Aucun code JS a ecrire,
 * donc rien a maintenir.
 *
 * Le composant est PILOTE : il ne possede ni le <audio> ni l'etat. Il
 * recoit tout et rend l'etat. C'est ce qui garantit qu'un seul
 * temoignage peut jouer a la fois (voir Testimonials.tsx : un seul
 * element <audio> pour toute la section).
 *
 * ---------------------------------------------------------------------------
 * HONNETETE DE LA FORME D'ONDE
 * ---------------------------------------------------------------------------
 * Les HAUTEURS des barres sont decoratives et deterministes (aucun
 * Math.random au rendu, donc aucun saut entre deux rendus). Elles ne
 * representent pas le signal audio reel et ne le pretendent pas.
 * Ce qui est reel, c'est la RECOLORATION : une barre est doree
 * uniquement si elle est deja franchie par la tete de lecture, dont la
 * position vient de `currentTime / duration`. Aucun fichier n'est donc
 * pretendu decrire un audio qu'il n'a pas.
 */

import { testimonialsSection } from '../../lib/testimonials.ts'

/** Etats possibles du lecteur. Un seul etat « en lecture » a la fois. */
export type EtatPlayer =
  /** Aucun fichier charge. */
  | 'inactif'
  /** Le fichier est demande, metadonnees en attente. */
  | 'chargement'
  /** En cours de lecture. */
  | 'lecture'
  /** Charge mais en pause. */
  | 'pause'
  /** Le fichier a ete lu jusqu'au bout. */
  | 'termine'
  /** Fichier absent ou illisible : on ne simule rien. */
  | 'indisponible'

/**
 * Nombre de barres. 30 sur ~190 px donne des barres d'environ 5 px :
 * assez fines pour lire une forme d'onde, assez larges pour ne pas
 * parsemer la carte de pixels.
 */
const BARRES = 30

/**
 * Hauteurs decoratives, en pourcentage (28 -> 100).
 * Somme de deux sinus, donc un profil regulier et non aleatoire :
 * reproductible d'un rendu a l'autre, et visuellement calme.
 */
const hauteursBarres: readonly number[] = Array.from(
  { length: BARRES },
  (_, i) => {
    const v = Math.sin(i * 0.55) * 0.6 + Math.sin(i * 1.3) * 0.4
    return Math.round(28 + (v * 0.5 + 0.5) * 72)
  },
)

/**
 * `83` -> `1:23`, `0` -> `0:00`.
 * Renvoie `--:--` pour une valeur non finie : c'est le cas d'usage pour
 * une DUREE encore inconnue, jamais pour la position courante, ou 0 est
 * une position parfaitement legitime.
 */
function formater(secondes: number): string {
  if (!Number.isFinite(secondes) || secondes < 0) return '--:--'
  const s = Math.floor(secondes)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

type Props = {
  /** Position sur deux chiffres, ex. `01`. */
  numero: string
  /** Nombre total, pour le `01 / 04`. */
  total: number
  nom: string
  ville: string
  etat: EtatPlayer
  /** Position de lecture, de 0 a 1. */
  progression: number
  /** Position reelle, en secondes. */
  temps: number
  /** Duree reelle, en secondes. 0 si inconnue. */
  duree: number
  onLecture: () => void
  onPause: () => void
  onPosition: (ratio: number) => void
}

export function LecteurAudio({
  numero,
  total,
  nom,
  ville,
  etat,
  progression,
  temps,
  duree,
  onLecture,
  onPause,
  onPosition,
}: Props) {
  const enLecture = etat === 'lecture'
  const disponible = etat !== 'indisponible'
  const dureeConnue = duree > 0
  const ratio = Math.min(Math.max(progression, 0), 1)

  return (
    <div className="px-5 py-4 sm:px-6 sm:py-5">
      {/* Rang 1 : a gauche la position dans la serie, a droite
          l'identite complete. Le prenom et la ville sur une seule ligne :
          c'est le gain de hauteur le plus evident, et l'identite reste
          lisible d'un coup d'oeil. */}
      <div className="flex items-baseline justify-between gap-3">
        <p className="shrink-0 text-[0.6875rem] font-medium tracking-[0.2em] text-gold">
          {numero}
          <span className="text-mist/50"> / {String(total).padStart(2, '0')}</span>
        </p>

        {/* Le separateur porte de VRAIES espaces : sans elles, un lecteur
            d'ecran concatenerait « Zineb » et « Rabat » en un seul mot.
            Il n'est donc pas masque aux technologies d'assistance. */}
        <p className="truncate text-sm font-semibold text-cream">
          {nom}
          <span className="text-gold/60">{' · '}</span>
          <span className="font-normal text-mist">{ville}</span>
        </p>
      </div>

      {/* Rang 2 : le bouton et la forme d'onde.
          L'input est rendu AVANT la forme d'onde pour pouvoir servir de
          `peer` (anneau de focus), et sa zone cliquable reste entiere
          malgre la superposition via pointer-events-none sur les barres. */}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={enLecture ? onPause : onLecture}
          disabled={!disponible || etat === 'chargement'}
          aria-label={
            !disponible
              ? `Audio de ${nom} bientôt disponible`
              : enLecture
                ? `Mettre en pause le témoignage de ${nom}`
                : `Écouter le témoignage de ${nom}`
          }
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/45 text-gold transition-colors duration-150 hover:border-gold hover:text-gold-hi disabled:cursor-not-allowed disabled:border-cream/15 disabled:text-mist/35"
        >
          {enLecture ? (
            <svg width="15" height="15" viewBox="0 0 18 18" fill="currentColor">
              <rect x="4" y="3" width="3.5" height="12" rx="1" />
              <rect x="10.5" y="3" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 18 18"
              fill="currentColor"
              className="translate-x-px"
            >
              <path d="M5 3.4v11.2a1 1 0 0 0 1.52.86l9-5.6a1 1 0 0 0 0-1.72l-9-5.6A1 1 0 0 0 5 3.4Z" />
            </svg>
          )}
        </button>

        <div className="relative h-8 min-w-0 flex-1">
          <input
            type="range"
            className="player-range peer absolute inset-0 z-10 w-full cursor-pointer disabled:cursor-not-allowed"
            min={0}
            max={dureeConnue ? duree : 0}
            step={0.1}
            value={dureeConnue ? Math.min(temps, duree) : 0}
            disabled={!disponible || !dureeConnue}
            onChange={(e) => onPosition(Number(e.target.value) / (duree || 1))}
            aria-label={`Position dans le témoignage de ${nom}`}
            aria-valuemin={0}
            aria-valuemax={dureeConnue ? Math.round(duree) : undefined}
            aria-valuetext={
              dureeConnue
                ? `${formater(temps)} sur ${formater(duree)}`
                : 'durée inconnue'
            }
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center gap-[2px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold"
          >
            {hauteursBarres.map((hauteur, i) => {
              const franchie = i / BARRES < ratio
              return (
                <span
                  key={i}
                  className={`flex-1 rounded-full transition-colors duration-150 ${
                    franchie ? 'bg-gold' : 'bg-cream/15'
                  }`}
                  style={{ height: `${hauteur}%` }}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Rang 3 : les deux temps, alignes sur la forme d'onde grace au
          videur de 44 px qui reproduit la largeur du bouton + son ecart. */}
      {disponible ? (
        <div className="mt-1.5 flex items-center gap-3 text-[0.6875rem] text-mist tabular-nums">
          <span className="h-11 w-11 shrink-0" aria-hidden="true" />
          <span className="flex min-w-0 flex-1 justify-between">
            <span>{formater(temps)}</span>
            <span>{dureeConnue ? formater(duree) : '--:--'}</span>
          </span>
        </div>
      ) : (
        <p className="mt-2 text-[0.6875rem] text-mist">
          {testimonialsSection.audioIndisponible}
        </p>
      )}
    </div>
  )
}
