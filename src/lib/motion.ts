/**
 * Preference de mouvement du visiteur.
 *
 * ---------------------------------------------------------------------------
 * UNE SEULE SOURCE DE VERITE
 * ---------------------------------------------------------------------------
 * L'etat vit dans ce module, il est ecrit sur `<html data-motion="on|off">`,
 * et tout le reste de la page l'ecoute par CSS. Aucun composant n'a donc
 * besoin de se re-rendre quand la preference change : une seule regle CSS
 * suffit a arreter ou relancer les animations de la page entiere.
 *
 * React n'intervient que pour le bouton de la navbar, via `useMouvement()`.
 * C'est un abonnement a une valeur, pas une source de verite concurrente.
 *
 * ---------------------------------------------------------------------------
 * L'ORDRE DES DECISIONS
 * ---------------------------------------------------------------------------
 *   1. un choix memorise dans `localStorage` : il prime, dans les deux sens,
 *      parce qu'il est explicite ;
 *   2. sinon `prefers-reduced-motion: reduce` : le systeme decide ;
 *   3. sinon : le mouvement est actif, qui est le defaut du site.
 *
 * Ce qui subsiste en toute circonstance, c'est le bloc
 * `@media (prefers-reduced-motion: reduce)` de `index.css` : meme en
 * mouvement actif, une personne dont le systeme demande moins d'animations
 * n'obtient jamais de respiration infinie ni de defilement fluide. Ce socle
 * ne depend pas du bouton, il n'est donc jamais negociable.
 *
 * ---------------------------------------------------------------------------
 * AUCUNE DEPENDANCE
 * ---------------------------------------------------------------------------
 * Un attribut, un module, un abonnement React. Pas de framer-motion, pas de
 * gesto, pas de store externe : tout le besoin tient en une reglette CSS.
 */
import { useSyncExternalStore } from 'react'

/** Valeur de la preference. */
export type Mouvement = 'on' | 'off'

/**
 * Textes du controle. Comme tous les textes du site, ils vivent ici et
 * jamais dans le JSX du bouton.
 */
export const mouvement = {
  /** Libelle court, affiche a cote de l'etat. */
  label: 'Motion',
  /** Etat actif. */
  on: 'ON',
  /** Etat inactif. */
  off: 'OFF',
} as const

/** Cle de stockage. Prefixee pour ne jamais entrer en conflit. */
const CLE = 'og:motion'

/** Recherche un choix deja memorise. `null` = jamais tranche. */
function lireChoix(): Mouvement | null {
  if (typeof window === 'undefined') return null
  try {
    const brut = window.localStorage.getItem(CLE)
    return brut === 'on' || brut === 'off' ? brut : null
  } catch {
    // Navigation privee, stockage refuse, iframe tierce : le site continue
    // de fonctionner, il part simplement de la valeur par defaut.
    return null
  }
}

/** Le systeme demande-t-il explicitement moins d'animations ? */
function systemeDemandeMoins(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Choix explicite du visiteur. `null` tant qu'il n'a rien tranche. */
let choix: Mouvement | null = lireChoix()

/** Etat effectif, seul lu par le reste du site. */
export function mouvementActif(): boolean {
  if (choix) return choix === 'on'
  return !systemeDemandeMoins()
}

/** Abonnes : un seul aujourd'hui, le bouton de la navbar. */
const abonnes = new Set<() => void>()

/**
 * Ecrit l'etat effectif sur `<html>`. C'est cette attribut que le CSS
 * interroge ; le module ne touche a aucun composant.
 */
export function appliquerMouvement(): void {
  if (typeof document === 'undefined') return
  const actif = mouvementActif()
  document.documentElement.dataset.motion = actif ? 'on' : 'off'
}

function notifier(): void {
  for (const abonne of abonnes) abonne()
}

/**
 * Memorise un choix explicite. Le visiteur a tranche, donc son choix prime —
 * y compris sur `prefers-reduced-motion`, qu'il peut avoir pose sans y
 * penser, et qu'il peut corriger en re-cliquant sur le bouton.
 */
export function definirMouvement(valeur: Mouvement): void {
  choix = valeur
  try {
    window.localStorage.setItem(CLE, valeur)
  } catch {
    // Sans stockage, la preference vaut pour la session en cours. Le site
    // n'a pas besoin de le signaler : rien d'autre ne change a l'ecran.
  }
  appliquerMouvement()
  notifier()
}

/** Bascule ON -> OFF -> ON. */
export function basculerMouvement(): void {
  definirMouvement(mouvementActif() ? 'off' : 'on')
}

export function abonnerMouvement(abonne: () => void): () => void {
  abonnes.add(abonne)
  return () => {
    abonnes.delete(abonne)
  }
}

/**
 * Etat effectif, reactive.
 *
 * `useSyncExternalStore` est fait pour cela : la valeur vient d'une source
 * externe au React, et le rendu doit suivre exactement ce qu'elle dit.
 */
export function useMouvement(): boolean {
  return useSyncExternalStore(abonnerMouvement, mouvementActif, mouvementActif)
}
