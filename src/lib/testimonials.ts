/**
 * Donnees de la section Temoignages.
 *
 * ---------------------------------------------------------------------------
 * REGLE ABSOLUE SUR LA PREUVE
 * ---------------------------------------------------------------------------
 * Ces quatre temoignages sont REELS.
 *
 * Ni le nom, ni la ville, ni l'ordre ne doivent etre modifies sans la
 * validation d'Othmane. Ce qui est dit dans chaque audio n'est ni
 * retranscrit, ni resume, ni corrige : l'audio EST la preuve.
 *
 * Aucun resultat, chiffre, performance, secteur d'activite, nom
 * d'entreprise ou promesse n'est associe a un temoignage. Si un jour un
 * client autorise a citer son activite ou un resultat, ca se fera
 * dans ce fichier uniquement, jamais dans le composant.
 */

/** Un temoignage client. Quatre champs, volontairement. */
export type Testimonial = {
  /** Cle stable, utilisee comme cle React et ancre de test. */
  id: string
  /** Chemin public du fichier audio. */
  audio: string
  /** Prenom, orthographe d'origine. */
  nom: string
  /** Ville, orthographe d'origine. */
  ville: string
}

/**
 * LES QUATRE TEMOIGNAGES.
 *
 * ORDRE : l'ordre du tableau EST l'ordre d'affichage du carousel. Pour
 * changer l'ordre de lecture, deplacer les blocs ci-dessous, rien d'autre.
 *
 * AUDIO : les fichiers se deposent dans `public/testimonials/`, qui est
 * copie tel quel dans `dist/` au build. Aucun import n'est necessaire :
 * ajouter un fichier ne demande donc aucune modification de code, et
 * le build ne casse jamais tant que le fichier manque.
 *
 * NOMS DE FICHIERS : ce sont les noms d'origine, tels que depots.
 * `audio1` -> Zineb, `audio2` -> Reda, `audio3` -> Houda. Le quatrieme
 * enregistrement (`audio4`, Saad) n'a pas encore ete depose : tant qu'il
 * manque, la carte affiche « Audio bientot disponible ». Il n'y a rien a
 * changer dans le code pour le recevoir, il suffit de poser le fichier.
 *
 * Si un import TypeScript est prefere plus tard (`src/assets/`), le
 * passage se fait ici seulement :
 *   import audio1 from '../assets/testimonials/audio1.mp3'
 *   audio: audio1
 * pour les quatre entrees, plus rien a changer ailleurs. Cette option
 * impose de deposer les quatre fichiers avant le build ; l'option
 * actuelle ne casse jamais.
 */
export const testimonials: readonly Testimonial[] = [
  {
    id: 'zineb',
    audio: '/testimonials/audio1.mp3',
    nom: 'Zineb',
    ville: 'Rabat',
  },
  {
    id: 'reda',
    audio: '/testimonials/audio2.mp3',
    nom: 'Reda',
    ville: 'Casablanca',
  },
  {
    id: 'houda',
    audio: '/testimonials/audio3.mp3',
    nom: 'Houda',
    ville: 'Rabat',
  },
  {
    id: 'saad',
    audio: '/testimonials/audio4.mp3',
    nom: 'Saad',
    ville: 'Témara',
  },
] as const

/** Textes de la section, isoles du composant. */
export const testimonialsSection = {
  eyebrow: 'Témoignages',
  title: 'Ce sont eux qui en parlent le mieux.',
  intro: 'Des retours réels de clients avec qui nous avons travaillé.',

  /** Annonce du carousel pour les lecteurs d'ecran. */
  regionLabel: 'Témoignages clients, faites défiler',

  /** Message affiche quand le fichier audio n'est pas encore disponible. */
  audioIndisponible: 'Audio bientôt disponible',
} as const
