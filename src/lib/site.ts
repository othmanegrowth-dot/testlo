/**
 * Configuration centrale du site.
 * Source unique pour l'identite de marque et les contacts.
 *
 * Les textes de section vivent dans leur propre fichier (hero.ts, etc.).
 * Ne jamais ecrire ces informations directement dans un composant.
 */

export const site = {
  /** Marque. */
  name: 'OTHMANE.GROWTH',
  /** Label de marque affiche dans la navbar et le hero. */
  brandLabel: 'OTHMANE · GROWTH',
  /** La personne derriere le studio. */
  person: 'Othmane Yacoubi',
  activity:
    'Freelance en marketing digital — studio indépendant de performance marketing',
  /** Marche principal. */
  market: 'Maroc',
  tagline: 'Studio de performance marketing',
  /** Doit rester alignee avec la meta description de index.html. */
  description:
    'Meta Ads et contenu UGC pour les entreprises marocaines. Un système d’acquisition qui attire des prospects qualifiés et génère des conversations WhatsApp.',
  locale: 'fr-FR',

  /**
   * URL du site. Volontairement vide : aucun domaine n'est encore
   * confirme. A completer avant le deploiement.
   */
  url: '',

  /** Contacts officiels. */
  email: 'othmanegrowth@gmail.com',
  /** Format affichable. */
  phone: '+212 698 542 590',
  /** Format international sans « + » ni espaces, requis par wa.me. */
  whatsappUrl: 'https://wa.me/212698542590',
  instagram: '@othmane.growth',
} as const

/**
 * CTA principal du site. Pointe vers la future section formulaire (#contact).
 * Objectif du parcours : le visiteur est qualifie par formulaire, puis
 * contacte directement par Othmane.
 */
export const cta = {
  label: 'Parler de mon projet',
  href: '#contact',
} as const

/** Liens de navigation de la landing page (ancres). */
export const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Méthode', href: '#methode' },
] as const
