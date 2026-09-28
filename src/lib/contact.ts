/**
 * Textes et donnees du formulaire de contact.
 *
 * ---------------------------------------------------------------------------
 * A QUOI SERT CETTE SECTION
 * ---------------------------------------------------------------------------
 * C'est le dernier point de conversion de la page. A ce stade, le visiteur a
 * deja : reconnu son probleme, compris la maniere de travailler, et entendu
 * de vrais clients parler de leur experience.
 *
 * Ce qui lui reste a faire, c'est decrire son projet. Tout le formulaire
 * existe pour obtenir cette description avec le moins de friction possible.
 * C'est aussi le seul endroit ou ses objections peuvent se poser : les
 * reponses qu'il cherche sont dans les champs, pas dans une liste de
 * questions.
 *
 * ---------------------------------------------------------------------------
 * REGLE ABSOLUE SUR LE CONTENU
 * ---------------------------------------------------------------------------
 * Ce fichier ne contient QUE de la mise en forme de l'information : des
 * questions, des exemples et des messages de validation. Il ne contient
 * aucune information inventee. En particulier :
 *
 *   - aucun tarif d'accompagnement, aucun prix de pack
 *   - aucune delai de reponse, aucune garantie, aucune promesse
 *   - aucun chiffre d'affaires, nombre de clients ou taux
 *
 * Les seules valeurs monetaires autorisees sont les tranches du BUDGET
 * PUBLICITAIRE, demandees telles quelles. Elles disent ce que le
 * prospect prevoit de depenser pour ses publicites, pas ce qu'il doit
 * payer Othmane. La precision ecrite sous la question existe precisement
 * pour que la confusion soit impossible.
 *
 * ---------------------------------------------------------------------------
 * LES NEUF CHAMPS SONT OBLIGATOIRES
 * ---------------------------------------------------------------------------
 * C'est un choix, pas un oubli. Les cinq premiers decrivent qui appelle,
 * les trois suivants ce qu'il cherche et ce qu'il a deja, le dernier est
 * le coeur de la demande : le projet lui-meme. Sans ce dernier, il n'y a
 * rien amirer avant le premier echange.
 *
 * Aucune question n'est posee « pour savoir » : un champ qui ne sert pas a
 * preparer la reponse fait perdre des prospects. Si un jour un champ doit
 * etre retire, ce doit etre parce qu'il ne sert a rien, pas parce qu'il
 * est long.
 */

/**
 * Ordre des champs. Il sert deux fois : au rendu (ordre de tabulation) et a
 * la validation (premier champ invalide = premier de cette liste).
 */
export const NOMS_CHAMPS = [
  'nom',
  'telephone',
  'entreprise',
  'secteur',
  'ville',
  'objectif',
  'metaAds',
  'budget',
  'projet',
] as const

export type NomChamp = (typeof NOMS_CHAMPS)[number]

/** Le formulaire tient en un seul objet plat : une chaine vide = non renseigne. */
export type Valeurs = Record<NomChamp, string>

export const contact = {
  eyebrow: 'Parlons de votre projet',

  /**
   * Une invitation, pas une injonction. La forme « Vous avez… ? Parlons-en »
   * ne met personne devant un mur : elle suppose juste qu'il y a un projet.
   */
  title: 'Vous avez un projet en tête ? Parlons-en.',

  /**
   * Annonce ce que va se passer apres l'envoi, avant qu'on le demande. Une
   * personne qui hesite a un doute sur la suite ; le dire d'emblee evite
   * qu'elle se demande si sa demande va se perdre dans un trou.
   */
  intro:
    'Décrivez-moi simplement votre activité et ce que vous cherchez à améliorer. Je prendrai le temps de regarder votre projet avant de revenir vers vous.',

  /** Rappel de la regle de saisie, une seule fois, avant le premier champ. */
  mentions: 'Tous les champs sont obligatoires.',

  /** Informations de base. */
  champs: {
    nom: {
      label: 'Nom',
      placeholder: 'Votre nom',
      /** Valeurs retirees des navigateurs pour l'autocompletion. */
      autoComplete: 'name',
    },
    telephone: {
      label: 'Téléphone / WhatsApp',
      placeholder: '06 XX XX XX XX',
      autoComplete: 'tel',
    },
    entreprise: {
      label: 'Nom de l’entreprise',
      placeholder: 'Nom de votre entreprise',
      autoComplete: 'organization',
    },
    secteur: {
      label: 'Secteur',
      placeholder: 'Ex. immobilier, restauration, formation...',
      /** Aucun `autoComplete` : aucun standard n'existe pour ce champ. */
      autoComplete: undefined as string | undefined,
    },
    ville: {
      label: 'Ville',
      placeholder: 'Votre ville',
      autoComplete: 'address-level2',
    },
  },

  /** Objectif du projet : une liste courte, pas un questionnaire. */
  objectif: {
    label: 'Qu’est-ce que vous cherchez principalement à améliorer ?',
    /** Premiere option du select, vide : elle force un choix explicite. */
    vide: 'Choisissez un objectif',
    options: [
      'Générer plus de prospects',
      'Améliorer ma présence en ligne',
      'Lancer des publicités',
      'Créer du contenu',
      'Structurer mon acquisition',
      'Autre',
    ],
  },

  /**
   * Question binaire. Elle ne demande pas si le prospect « fait de la
   * publicite », mais s'il en a deja fait : la reponse determine ou le
   * travail peut commencer, et elle se pose en deux secondes.
   */
  metaAds: {
    question: 'Utilisez-vous déjà les Meta Ads ?',
    options: [
      { valeur: 'oui', label: 'Oui' },
      { valeur: 'non', label: 'Non' },
    ],
  },

  /**
   * Tranches de BUDGET PUBLICITAIRE. Les libelles sont les valeurs de
   * champ : aucun identifiant technique n'est invente, ce qui rend la
   * donnee stockee directement lisible.
   *
   * La derniere option (« Je ne sais pas encore ») est indispensable. Sans
   * elle, un prospect qui n'a pas encore chiffre son budget se retrouve
   * devant un mur et ne remplit rien, alors que c'est precisement la
   * personne qu'il faut evaluator.
   */
  budget: {
    question: 'Quel budget publicitaire envisagez-vous environ ?',
    /** Precision affichee juste sous la question. */
    precision:
      'Ces montants concernent uniquement le budget publicitaire, pas les honoraires d’accompagnement.',
    options: [
      'Moins de 3 000 DH',
      '3 000 – 5 000 DH',
      '5 000 – 10 000 DH',
      'Plus de 10 000 DH',
      'Je ne sais pas encore',
    ],
  },

  projet: {
    label: 'Parlez-moi un peu de votre projet',
    placeholder:
      'Décrivez simplement votre activité, votre objectif et ce que vous aimeriez améliorer.',
  },

  /**
   * Nom d'accesibilite du formulaire. Invisible a l'ecran, il donne un nom
   * au <form> et un titre de section aux technologies d'assistance. C'est du
   * libelle d'interface, pas un contenu invente.
   */
  nomFormulaire: 'Formulaire de contact',

  envoi: {
    cta: 'Parler de mon projet',
    /** Etat intermediaire : le bouton se desactive, le libelle le dit. */
    enCours: 'Envoi en cours…',
    succes: {
      titre: 'Merci pour votre demande.',
      texte: 'Je vais prendre connaissance de votre projet et revenir vers vous.',
    },
    echec: 'Une erreur est survenue. Vérifiez vos informations et réessayez.',
    /**
     * Repli affiche quand l'envoi echoue. Le formulaire garde toutes les
     * informations saisies : un prospect qui a ecrit son projet ne doit
     * pas le perdre parce qu'un appel reseau a echoue.
     */
    repli: 'Vous préférez écrire directement ?',
    repliLien: 'Écrire sur WhatsApp',
  },

  /**
   * Messages de validation. Tous en francais, tous a la premiere personne
   * de politesse, tous nommant le champ concerne : « Veuillez renseigner
   * votre nom. » et non « Invalid input ».
   *
   * Ils disent ce qu'il faut faire, jamais pourquoi c'est invalide ni
   * comment l'application fonctionne. C'est la seule chose utile a dire a
   * quelqu'un qui vient de remplir un champ et qui ne comprend pas.
   */
  erreurs: {
    nom: 'Veuillez renseigner votre nom.',
    telephone: 'Veuillez renseigner votre numéro de téléphone.',
    entreprise: 'Veuillez renseigner le nom de votre entreprise.',
    secteur: 'Veuillez renseigner votre secteur.',
    ville: 'Veuillez renseigner votre ville.',
    objectif: 'Veuillez sélectionner votre objectif principal.',
    metaAds: 'Veuillez indiquer si vous utilisez déjà les Meta Ads.',
    budget: 'Veuillez sélectionner une tranche de budget.',
    projet: 'Veuillez décrire votre projet.',
  } as const satisfies Record<NomChamp, string>,
} as const

/* ===========================================================================
 * SOUMISSION
 * ===========================================================================
 *
 * ---------------------------------------------------------------------------
 * POURQUOI CE FICHIER S'ARRETE ICI
 * ---------------------------------------------------------------------------
 * Aucun service d'envoi n'est configure : il n'existe ni Firebase, ni
 * endpoint, ni cle d'API dans le projet. Rien n'a donc ete invente pour
 * faire fonctionner la demonstration.
 *
 * CE QUI N'A PAS ETE FAIT, ET POURQUOI :
 * - aucun client Firebase n'a ete installe ;
 * - aucune cle, aucun identifiant de projet, aucune URL n'a ete ecrite ;
 * - aucune fausse confirmation n'est affichee a l'utilisateur.
 *
 * Afficher « Merci pour votre demande » sans avoir rien envoye serait le
 * pire des choix : le visiteur repartirait en croyant avoir ete rappelle,
 * et le prospect serait perdu sans aucun signe. Tant que rien n'est
 * branche, la soumission echoue franchement et le formulaire propose un
 * contact direct.
 *
 * ---------------------------------------------------------------------------
 * LE POINT DE BRANCHEMENT
 * ---------------------------------------------------------------------------
 * Une seule constante est a remplir : `TRANSPORT`. Elle doit recevoir une
 * fonction recevant `Valeurs` et promettant un `ResultatEnvoi`. Rien
 * d'autre, dans tout le projet, n'a besoin d'etre modifie pour brancher un
 * service reel.
 */

export type ResultatEnvoi = 'envoye' | 'echec' | 'non-configure'

export type Transport = (projet: Valeurs) => Promise<ResultatEnvoi>

/** Remplacez `null` par la fonction d'envoi pour activer la soumission. */
const TRANSPORT: Transport | null = null

export async function envoyerProjet(projet: Valeurs): Promise<ResultatEnvoi> {
  if (!TRANSPORT) return 'non-configure'
  return TRANSPORT(projet)
}
