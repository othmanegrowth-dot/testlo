/**
 * Textes de la section Probleme.
 *
 * DIRECTION : tres peu de texte, beaucoup d'espace, une photo.
 * Trois points courts, pas de cartes.
 */

export const problem = {
  eyebrow: 'Le problème',
  title:
    'Votre présence en ligne travaille-t-elle vraiment pour votre business ?',
  intro:
    'Publier, faire de la publicité et être présent sur Instagram ne suffit pas toujours.',

  /**
   * Photo illustrative de la section.
   * L'image elle-meme est importee par le composant.
   */
  visual: {
    /**
     * A CONFIRMER A L'OEIL : le fichier image n'a pas pu etre analyse
     * automatiquement. Ce texte doit decrire ce que la photo montre
     * reellement, sans rien inventer.
     */
    alt: 'Présence en ligne d’une entreprise et résultats de ses publications.',
  },

  points: [
    {
      id: 'direction',
      number: '01',
      title: 'Du contenu sans direction',
      text: 'Créer du contenu sans objectif clair.',
    },
    {
      id: 'coherence',
      number: '02',
      title: 'De la publicité sans cohérence',
      text: 'Faire tourner des campagnes sans vraie connexion avec le contenu.',
    },
    {
      id: 'dispersion',
      number: '03',
      title: 'Des efforts dispersés',
      text: 'Chaque action existe, mais rien ne fonctionne vraiment comme un système.',
    },
  ],

  transition:
    'Le problème n’est pas toujours de faire plus. C’est de mieux connecter les choses.',
} as const
