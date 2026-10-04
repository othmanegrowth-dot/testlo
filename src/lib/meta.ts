/**
 * Mesure de la page : signalement d'un evenement au Meta Pixel.
 *
 * ---------------------------------------------------------------------------
 * A QUOI SERT CE FICHIER
 * ---------------------------------------------------------------------------
 * Une seule chose : dire au Pixel qu'une demande vient d'etre enregistree.
 * L'amorcage du Pixel n'est pas ici, il est dans `index.html`, et c'est
 * volontaire.
 *
 * ---------------------------------------------------------------------------
 * LE PIXEL EST AMORCE DANS index.html, ET NON DANS UN MODULE
 * ---------------------------------------------------------------------------
 * Trois raisons, dans l'ordre d'importance.
 *
 * 1. La disponibilite. `index.html` est lu avant tout le reste : le Pixel est
 *    declare et la visite comptee meme si le bundle React echoue ensuite.
 *    Amorce depuis un module, la mesure disparait avec l'application.
 *
 * 2. Le chargement unique. Le HTML est analyse une seule fois par visite.
 *    `init` et `PageView` y sont ecrits une fois, a la suite l'un de l'autre.
 *    Il n'existe aucun moyen de les rejouer : le fichier est redeploye, pas
 *    reexecute.
 *
 * 3. L'identifiant reste au bon endroit. Il apparait une seule fois dans tout
 *    le projet, dans le seul fichier charge en premier.
 *
 * ---------------------------------------------------------------------------
 * POURQUOI PAS DE VARIABLE D'ENVIRONNEMENT
 * ---------------------------------------------------------------------------
 * L'identifiant du Pixel est une valeur publique : il figure dans le HTML de
 * tous les sites qui en utilisent un, il est donc visible de tout visiteur. Le
 * mettre dans une variable n'en cacherait rien, cela ne ferait que deplacer la
 * question.
 *
 * Une variable Vite est figee au moment de la compilation. Si
 * `VITE_META_PIXEL_ID` manque sur la machine qui construit le site, la page se
 * construit normalement et le Pixel ne se charge pas : aucune erreur, aucun
 * avertissement, une mesure qui disparait en silence. Sur une page dont les
 * conversions se comptent a l'unite pres, perdre la mesure sans le savoir
 * coute plus cher qu'une constante visible dans le code.
 *
 * Aucun autre fichier du projet n'utilise `.env` : il n'en existe aucun.
 *
 * ---------------------------------------------------------------------------
 * UNE SEULE FONCTION, ET ELLE NE PEUT PAS PRODUIRE DE PAGEVIEW
 * ---------------------------------------------------------------------------
 * Ce n'est pas `suivreEvenement(nom)` mais `suivreLead()`. La difference n'est
 * pas de forme : c'est une garantie. La chaine `PageView` n'existe que dans
 * `index.html`, et aucune ligne de ce projet ne peut en emettre une seconde.
 * Le double comptage est donc ecarte par construction, pas par discipline.
 *
 * ---------------------------------------------------------------------------
 * CETTE FONCTION NE PEUT PAS LEVER
 * ---------------------------------------------------------------------------
 * Elle est appelee dans le `try` qui decide si la demande a ete enregistree.
 * Si elle levait, elle transformerait un envoi reussi en echec affiche au
 * prospect : la demande serait dans Firestore, et le visiteur se lirait qu'elle
 * a echoue. Elle absorbe donc tout ce qui peut survenir - Pixel absent, bloque
 * par une extension, refuse par le reseau, `window` indisponible - et ne laisse
 * passer que l'essentiel : l'evenement, s'il peut partir.
 */

/**
 * Signature du Pixel, telle que l'amorcage de `index.html` la construit :
 * une fonction qui accepte des arguments et les empile dans une file
 * d'attente tant que la vraie bibliotheque n'est pas arrivee.
 */
type Pixel = (...args: unknown[]) => void

declare global {
  interface Window {
    /** Declare, puis appele par l'amorcage de `index.html`. */
    fbq?: Pixel
    /** Instancie par ce meme amorcage. */
    _fbq?: Pixel
  }
}

/**
 * Signale au Pixel qu'une demande a ete enregistree.
 *
 * Appelee uniquement apres l'ecriture confirmee dans Firestore, jamais au clic
 * et jamais avant la validation du formulaire.
 *
 * N'echoue jamais. Si le Pixel n'a pas demarre, l'absence d'evenement est le
 * comportement attendu : on ne transforme pas une absence de mesure en panne.
 */
export function suivreLead(): void {
  try {
    window.fbq?.('track', 'Lead')
  } catch {
    // Une mesure qui echoue n'a jamais interrompu un parcours. Rien a dire.
  }
}