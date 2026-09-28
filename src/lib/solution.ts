/**
 * Textes de la section « Mon approche ».
 *
 * ---------------------------------------------------------------------------
 * POURQUOI UNE SEULE SECTION
 * ---------------------------------------------------------------------------
 * Cette section a longtemps ete coupee en deux : « Mon approche » (le
 * systeme : Strategie, Contenu, Meta Ads) puis « Comment ca se passe » (les
 * etapes de collaboration). Sur mobile, cela faisait defiler deux fois sur
 * la meme idee, avec un titre de section pour separer deux morceaux d'un
 * seul raisonnement. Les deux couches sont donc reunies ici, et rendues
 * consecutivement : d'abord le cheminement, puis le systeme qu'il produit.
 *
 * Le titre unique (« Une strategie claire... ») porte les deux : il annonce
 * le systeme, et les quatre etapes qui suivent expliquent comment on y
 * travaille. C'est cette continuite, et non un titre supplementaire, qui
 * fait la transition avec la section Probleme.
 *
 * ---------------------------------------------------------------------------
 * L'ORDRE EST IMPOSE ET NON NEGOCIABLE
 * ---------------------------------------------------------------------------
 *   01 STRATEGIE -> 02 CONTENU -> 03 META ADS -> ACQUISITION
 *
 * Ne jamais presenter Meta Ads avant Strategie, ni Contenu avant Strategie.
 * L'ordre du tableau `pillars` EST l'ordre de lecture du systeme.
 *
 * L'ordre des etapes de collaboration n'est pas libre non plus : on ne
 * lance rien avant d'avoir compris, et on n'ameliore rien avant d'avoir
 * lance.
 *
 * ---------------------------------------------------------------------------
 * LES DEUX COUCHES NE DOIVENT PAS SE REPETIR
 * ---------------------------------------------------------------------------
 * `steps` = la maniere dont on avance (quatre etapes).
 * `system` = ce que ces etapes produisent (trois piliers, puis un resultat).
 *
 * Chaque couche n'apparait qu'une fois. Ne pas repeter
 * Strategie / Contenu / Meta Ads ailleurs dans la page : la section
 * Probleme parle de symptomes, la section Temoignages de preuves, aucune
 * des deux n'a besoin de recapituler le systeme.
 *
 * ---------------------------------------------------------------------------
 * REGLE SUR LES TEXTES
 * ---------------------------------------------------------------------------
 * Aucun chiffre, aucun delai, aucun engagement de resultat. Ces phrases
 * decrivent une maniere de travailler, pas une performance.
 *
 * Les descriptions des etapes sont volontairement COURTES. Sur mobile elles
 * se lisent d'un seul regard, sans obliger a defiler pour passer d'une
 * etape a l'autre : c'est la contrainte qui a fait leur longueur.
 */

/** Une etape de collaboration. */
export type ApproachStep = {
  /** Cle stable, utilisee comme cle React. */
  id: string
  /** Position sur deux chiffres, ex. `01`. */
  number: string
  /**
   * Nom de l'etape, en casse normale.
   * La mise en majuscules est faite par le composant, comme partout ailleurs.
   */
  label: string
  /** Phrase humaine qui accompagne le nom. */
  title: string
  /** Ce que recouvre concretement cette etape. Une seule phrase. */
  text: string
}

/** Un pilier du systeme, ou son aboutissement. */
export type Pillar = {
  id: string
  label: string
}

export const solution = {
  eyebrow: 'Mon approche',

  /**
   * Le titre annonce deja les trois piliers. Il est donc volontairement
   * termine par un point : c'est une phrase, pas un titre de chapitre.
   */
  title: 'Une stratégie claire. Du contenu adapté. Des Meta Ads pour le diffuser.',

  /**
   * COUCHE 1 — le cheminement.
   *
   * Comment on avance avec le client. C'est la partie la plus longue sur
   * mobile, donc la plus ephemere : elle se lit, on passe a la suite.
   */
  steps: [
    {
      id: 'comprendre',
      number: '01',
      label: 'Comprendre',
      title: 'On échange',
      text: 'Votre business, votre offre, votre objectif.',
    },
    {
      id: 'construire',
      number: '02',
      label: 'Construire',
      title: 'On construit',
      text: 'La stratégie, puis les contenus qui la portent.',
    },
    {
      id: 'lancer',
      number: '03',
      label: 'Lancer',
      title: 'On lance',
      text: 'Les Meta Ads, puis les premiers tests.',
    },
    {
      id: 'ameliorer',
      number: '04',
      label: 'Améliorer',
      title: 'On améliore',
      text: 'Les résultats, puis ce qu’on ajuste.',
    },
  ] as const satisfies readonly ApproachStep[],

  /**
   * COUCHE 2 — le systeme.
   *
   * Ce que les etapes produisent. Rendu sous les quatre etapes, en une
   * seule ligne : c'est la synthese, pas un deuxieme developpement.
   *
   * `outcome` n'est pas un pilier comme les autres : c'est le resultat vers
   * lequel les trois convergent. Il est donc traite a part dans le
   * composant, et non dans `pillars`.
   */
  system: {
    /** Micro-intitule. Illisible comme titre, indispensable comme repere :
     *  il dit que les quatre etapes ci-dessus aboutissent a cette ligne. */
    label: 'Le système',
    pillars: [
      { id: 'strategie', label: 'Stratégie' },
      { id: 'contenu', label: 'Contenu' },
      { id: 'meta-ads', label: 'Meta Ads' },
    ] as const satisfies readonly Pillar[],
    outcome: { id: 'acquisition', label: 'Acquisition' } as const satisfies Pillar,
  },

  /**
   * LA SIGNATURE DU FONDATEUR.
   *
   * Ceci REMPLACE la phrase de synthese qui cloturait la section
   * (« Chaque etape prepare la suivante. »). Une regle de marche a suivre
   * resume une methode qu'on applique ; une phrase signee par son auteur
   * dit qui la porte. C'est la seule difference de nature, et c'est
   * exactement ce que doit ressentir le visiteur en bas de section.
   *
   * La citation a deux parties indissociables : `quote` porte la parole,
   * `name` la signe. Elles ne sont donc jamais modifiees l'une sans
   * l'autre.
   */
  signature: {
    /** Paroles du fondateur, en francais courant, jamais en slogan. */
    quote:
      'L’idée, c’est de ne pas faire les choses séparément. Tout doit fonctionner ensemble pour votre business.',
    /** Nom affiche. Le nom reel, sans titre ni fonction inventee. */
    name: 'Othmane Yacoubi',
  },
} as const
