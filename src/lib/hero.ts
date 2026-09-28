/**
 * Textes du Hero.
 * Isoles du composant pour rester facilement modifiables.
 *
 * Regles de redaction appliquees :
 * - aucune promesse garantie
 * - aucun chiffre invente (pas de « x2 », « +300 % », ROAS...)
 * - pas d'urgence artificielle
 */

export const hero = {
  eyebrow: 'Meta Ads & contenu UGC pour les entreprises marocaines',
  /**
   * Le titre est decoupe en deux morceaux : `before` en creme, `accent` en gold.
   * L'accent porte sur le concept central du studio, rien de plus.
   */
  title: {
    before: 'Transformez votre présence en un véritable',
    accent: 'système d’acquisition',
  },
  subtitle:
    'Je combine contenu vidéo, Meta Ads et stratégie pour attirer plus de prospects et transformer votre présence en ligne en canal d’acquisition.',
  actions: {
    primary: { label: 'Parler de mon projet', href: '#contact' },
    secondary: { label: 'Voir comment ça fonctionne', href: '#methode' },
  },
  /**
   * Pas de phrase de reassurance pour l'instant.
   * Toute ligne du type « reponse sous 24 h » doit etre validee par Othmane
   * avant d'etre ajoutee ici.
   */
  reassurance: null as string | null,
} as const
