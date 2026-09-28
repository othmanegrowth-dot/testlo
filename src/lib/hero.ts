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
  /*
   * L'ordre des trois leviers est IMPOSE et non negociable, partout sur le
   * site : Strategie -> Contenu -> Meta Ads. Le Hero les pose donc dans cet
   * ordre, en majuscules, et le separateur est un `×` (U+00D7) plutot qu'un
   * tiret : il dit « les trois a la fois », pas « les trois ensuite ».
   */
  eyebrow: 'STRATÉGIE × CONTENU × META ADS',

  /**
   * Le titre est decoupe en deux morceaux : `before` en creme, `accent` en
   * gold.
   *
   * L'accent porte le resultat recherche, pas la methode : la methode est
   * deja annoncee par l'eyebrow, la repeter ici n'apporterait rien. C'est
   * exactement le meme principe que le titre d'origine, ou l'or soulignait
   * « systeme d'acquisition ».
   *
   * La ponctuation finale vit dans `after` et non dans le JSX : le texte du
   * site est dans ce fichier, jusqu'a son point final.
   */
  title: {
    before: 'Une présence en ligne pensée pour',
    accent: 'générer des opportunités',
    after: '.',
  },

  subtitle:
    'Je construis avec vous un système qui relie contenu, publicité et stratégie autour de votre business.',

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
