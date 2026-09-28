import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * Champs de formulaire.
 *
 * ---------------------------------------------------------------------------
 * CE QUI EST ICI, ET CE QUI N'Y EST PAS
 * ---------------------------------------------------------------------------
 * Un seul type de controle visuel — un rectangle sombre, un filet clair, un
 * focus dore — partage par les quatre controles. Il n'y a ni carte autour
 * du formulaire, ni ombre portee, ni degrade : le formulaire se pose sur le
 * fond de la page comme le reste du site.
 *
 * Aucune logique de validation ici. Un champ ne sait pas s'il est valide,
 * il affiche seulement ce qu'on lui demande d'afficher. La validation vit
 * dans la section, les textes dans `lib/contact.ts`.
 *
 * ---------------------------------------------------------------------------
 * LE FOCUS N'EST PAS REECRIT
 * ---------------------------------------------------------------------------
 * Aucun de ces controles ne touche a `outline`. L'anneau dore defini une
 * seule fois dans `index.css` (`:focus-visible`) s'applique donc partout,
 * comme sur le reste du site, et le focus clavier ne peut pas disparaitre
 * par accident. Seul le filet du controle change de couleur au focus, en
 * supplementaire de l'anneau.
 *
 * Les pastilles radio font exception : leur <input> est transparent, donc
 * son propre anneau serait invisible. Elles recoivent alors l'anneau par
 * `peer-focus-visible`, sur la pastille, avec exactement la meme couleur
 * et le meme decalage.
 */

/* Fond, typo et transition communs a tous les controles. */
const controle =
  'w-full rounded-btn border bg-slate/60 px-3.5 text-[0.9375rem] text-cream transition-colors duration-150 placeholder:text-mist/70 focus:border-gold/60'

const etiquette = 'block text-sm font-medium text-cream'

/**
 * MESSAGE D'ERREUR.
 *
 * `text-gold-hi` et non une couleur rouge : la palette du site n'a pas de
 * rouge, et ajouter une couleur deur pour une seule section casserait la
 * regle qui governe tout le reste. Le dore clair fait 9,5:1 sur le fond
 * encre, donc le texte reste parfaitement lisible, et il est plus
 * lumineux que les autres messages, ce qui suffit a signaler l'etat. Le
 * champ passe en consequence de `cream/15` a `gold-hi/60`.
 */
const message = 'mt-1.5 text-sm leading-snug text-gold-hi'

function filet(erroneux: boolean) {
  return erroneux ? 'border-gold-hi/60' : 'border-cream/15 hover:border-cream/25'
}

type Base = {
  /** Identifiant du controle. Convention : `contact-<champ>`. */
  id: string
  label: string
  /**
   * Message d'erreur. Son absence retire l'erreur de l'affichage ET de
   * l'ARIA : un seul etat pilote les deux, ils ne peuvent pas diverger.
   */
  erreur?: string
  /** Ajoute au controle, pour la mise en page (largeur, colonnes). */
  className?: string
}

/** `<label>` + message d'erreur, communs a tous les controles a une valeur. */
function Enveloppe({
  id,
  label,
  erreur,
  children,
}: Base & { children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={etiquette}>
        {label}
      </label>
      {children}
      {erreur && (
        <p id={`${id}-erreur`} className={message}>
          {erreur}
        </p>
      )}
    </div>
  )
}

type PropsTexte = Base &
  Omit<ComponentPropsWithoutRef<'input'>, 'id' | 'className'>

/**
 * Champ texte, telephone ou recherche.
 *
 * `h-11` fixe 44 px de haut : c'est le seuil de zone tactile, et il est
 * atteint sans epaissir la typo ni ajouter de marge.
 */
export function TextField({
  id,
  label,
  erreur,
  className = '',
  ...props
}: PropsTexte) {
  return (
    <Enveloppe id={id} label={label} erreur={erreur}>
      <input
        {...props}
        id={id}
        required
        aria-invalid={erreur ? true : undefined}
        aria-describedby={erreur ? `${id}-erreur` : undefined}
        className={`${controle} ${filet(Boolean(erreur))} h-11 ${className}`}
      />
    </Enveloppe>
  )
}

type PropsSelect = Base &
  Omit<ComponentPropsWithoutRef<'select'>, 'id' | 'className'>

/**
 * Liste deroulante native.
 *
 * Natif, et non une liste de `div` construite a la main : le navigateur
 * ouvre son propre selecteur, qui est le meilleur qu'un telephone puisse
 * offrir, et le role, le clavier et le nom accessible viennent gratuitement
 * et correctement. `appearance-none` retire la fleche systeme pour la
 * remplacer par celle du site ; le selecteur du systeme reste disponible
 * partout ou il est utile.
 */
export function SelectField({
  id,
  label,
  erreur,
  className = '',
  children,
  ...props
}: PropsSelect) {
  return (
    <Enveloppe id={id} label={label} erreur={erreur}>
      <div className="relative">
        <select
          {...props}
          id={id}
          required
          aria-invalid={erreur ? true : undefined}
          aria-describedby={erreur ? `${id}-erreur` : undefined}
          className={`${controle} ${filet(Boolean(erreur))} h-11 appearance-none pr-10 ${className}`}
        >
          {children}
        </select>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-mist"
        >
          <path
            d="m4 6.5 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Enveloppe>
  )
}

type PropsZone = Base &
  Omit<ComponentPropsWithoutRef<'textarea'>, 'id' | 'className'>

/**
 * Zone de texte.
 *
 * Cinq lignes : de quoi ecrire une vraie reponse, pas de quoi remplir une
 * declaration. `resize-y` laisse l'agrandir a la souris sur desktop, la ou
 * le tactile ne le peut pas — c'est le bon compromis.
 */
export function TextAreaField({
  id,
  label,
  erreur,
  className = '',
  rows = 5,
  ...props
}: PropsZone) {
  return (
    <Enveloppe id={id} label={label} erreur={erreur}>
      <textarea
        {...props}
        id={id}
        required
        rows={rows}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={erreur ? `${id}-erreur` : undefined}
        className={`${controle} ${filet(Boolean(erreur))} resize-y py-2.5 leading-relaxed ${className}`}
      />
    </Enveloppe>
  )
}

export type OptionChoix = { valeur: string; label: string }

type PropsChoix = {
  id: string
  /** La question. Rendue en `<legend>`, donc annoncee comme telle. */
  legend: string
  /** `name` du groupe. Doit correspondre a une cle de `Valeurs`. */
  name: string
  options: readonly OptionChoix[]
  value: string
  onChange: (valeur: string) => void
  /** Precision affichee entre la question et les options. */
  note?: string
  /**
   * Deux colonnes de largeur egale au lieu d'un flux. Reserve a la question
   * binaire : des options courtes de meme nature se lisent mieux cote a
   * cote, et la ligne reste cliquable sur toute sa largeur.
   */
  colonnes?: boolean
  erreur?: string
  className?: string
}

/**
 * Groupe de boutons radio, dans un `<fieldset>` / `<legend>` natif.
 *
 * ---------------------------------------------------------------------------
 * AUCUNE COUCHE DE BOUTONS CUSTOM
 * ---------------------------------------------------------------------------
 * Ce sont de vrais `<input type="radio">`. On ne les cache pas pour les
 * remplacer par des `div` cliquables : le role, la navigation aux fleches,
 * l'etat « coche » et le nom accessible sont alors fournis par le
 * navigateur, correctement, et ne peuvent pas etre reimplementes de travers.
 *
 * L'input est transparent et tendu sur toute la pastille, ce qui donne une
 * zone tactile de 44 px sans ajouter de hauteur ni de marge. Il reste
 * focusable, donc le clavier fonctionne : `Tab` entre dans le groupe,
 * les fleches changent d'option.
 *
 * L'etat « selectionne » est marque par un filet dore et un fond dore tres
 * leger. Un seul element a la fois est dore : le reste de la page conserve
 * son equilibre.
 * ---------------------------------------------------------------------------
 */
export function ChoiceField({
  id,
  legend,
  name,
  options,
  value,
  onChange,
  note,
  colonnes = false,
  erreur,
  className = '',
}: PropsChoix) {
  const idErreur = `${id}-erreur`

  return (
    <fieldset className={className}>
      {/* `block` : un `legend` est un cas special de mise en page, il faut
          le traiter comme un bloc pour que l'interligne soit maitrise. */}
      <legend className={`block ${etiquette}`}>{legend}</legend>

      {note && (
        <p className="mt-1.5 text-xs leading-relaxed text-mist/70">{note}</p>
      )}

      <div
        className={
          colonnes
            ? 'mt-2.5 grid grid-cols-2 gap-2.5'
            : 'mt-2.5 flex flex-wrap gap-2.5'
        }
      >
        {options.map((option, i) => (
          <label key={option.valeur} className="relative">
            <input
              type="radio"
              /* Le premier porte l'id du groupe : c'est lui que la section
                 cible pour poser le focus apres un echec de validation. */
              id={i === 0 ? id : `${id}-${i + 1}`}
              name={name}
              value={option.valeur}
              checked={value === option.valeur}
              onChange={() => onChange(option.valeur)}
              required
              aria-invalid={erreur ? true : undefined}
              aria-describedby={erreur ? idErreur : undefined}
              className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span
              className={`flex min-h-11 items-center justify-center rounded-btn border px-3 py-2 text-center text-sm text-cream transition-colors duration-150 ${
                erreur
                  ? 'border-gold-hi/60'
                  : 'border-cream/15 hover:border-cream/25'
              } peer-checked:border-gold peer-checked:bg-gold/15 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold`}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {erreur && (
        <p id={idErreur} className={message}>
          {erreur}
        </p>
      )}
    </fieldset>
  )
}
