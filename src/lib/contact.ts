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
 * Ce qui lui reste a faire, c'est se decrire en quelques reponses fermes. Le
 * formulaire existe pour obtenir ces reponses avec le moins de friction
 * possible. C'est aussi le seul endroit ou ses objections peuvent se poser :
 * les reponses qu'il cherche sont dans les champs, pas dans une liste de
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
 * LES HUIT CHAMPS SONT OBLIGATOIRES, ET ILS SONT TOUS FERMES
 * ---------------------------------------------------------------------------
 * C'est un choix, pas un oubli. Aucun champ n'est un texte libre : quatre
 * identifiants, puis quatre questions fermees. Un prospect n'a donc jamais
 * a rediger quoi que ce soit — il n'a qu'a choisir, et les choix se font
 * sans reflechir et au clavier comme au doigt.
 *
 * La consequence est assumee : la demande est moins riche en surface, et
 * davantage qualifiee sur des criteres qui servent a la suite de la
 * conversation. Une reponse de trois lignes sur son projet ne change rien a
 * la qualite de l'echange ; un secteur et un budget, si.
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
   *
   * La phrase ne demande plus rien a ecrire : le formulaire est fait de
   * choix, et inviter a « decrire » n'aurait plus d'objet.
   */
  intro:
    'Quelques informations sur votre activité et ce que vous cherchez à améliorer, et je prendrai le temps d’y regarder avant de revenir vers vous.',

  /** Rappel de la regle de saisie, une seule fois, avant le premier champ. */
  mentions: 'Tous les champs sont obligatoires.',

  /**
   * Les quatre champs d'identite, tous en texte libre : un nom, un numero et
   * une entreprise ne se choisissent pas dans une liste.
   */
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
  },

  /**
   * VILLE.
   *
   * Elle etait un texte libre, ce qui laissait passer « Casa », « casa »,
   * « Casablanca » et « Casa Blanca » pour la meme reponse, et imposait de
   * recopier un mot que presque tout le monde sait deja. La liste est donc
   * fermee, dans l'ordre demande.
   *
   * « Autre » reste obligatoire en fin de liste : sans lui, un visiteur qui
   * vit hors de ces sept villes serait force de choisir une reponse fausse,
   * et une reponse fausse ne vaut pas mieux qu'une absence de reponse —
   * elle rend la donnee inutilisable.
   */
  ville: {
    label: 'Ville',
    /** Premiere option du select, vide : elle force un choix explicite. */
    vide: 'Choisissez une ville',
    options: [
      'Rabat',
      'Salé',
      'Témara',
      'Skhirat',
      'Kénitra',
      'Casablanca',
      'Mohammedia',
      'Autre',
    ],
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
     * informations saisies : un prospect ne doit pas avoir a les ressaisir
     * parce qu'un appel reseau a echoue.
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
  } as const satisfies Record<NomChamp, string>,
} as const

/* ===========================================================================
 * SOUMISSION
 * ===========================================================================
 *
 * ---------------------------------------------------------------------------
 * OU PART LA DEMANDE
 * ---------------------------------------------------------------------------
 * Firestore, via `creerDemande()` : une collection `demandes`, un document
 * par envoi, une date ecrite par le serveur. Le detail du document est dans
 * `demandes.ts`, ce fichier ne connait que le contrat.
 *
 * ---------------------------------------------------------------------------
 * UNE SEULE FRONTIERE ENTRE LE FORMULAIRE ET LE SERVICE
 * ---------------------------------------------------------------------------
 * `TRANSPORT` est l'unique endroit du projet ou la page rencontre le réseau.
 * Il reçoit les huit reponses, rend un verdict, et ne leve jamais : une
 * ecriture refusee devient `echec`, jamais une exception. Le formulaire peut
 * ainsi rester dans son etat d'echec et y demeurer — bouton actif, valeurs
 * conservees — au lieu de se retrouver bloque sur « Envoi en cours ».
 *
 * ---------------------------------------------------------------------------
 * LE SDK EST CHARGE AU MOMENT D'ENVOYER, PAS AU CHARGEMENT DE LA PAGE
 * ---------------------------------------------------------------------------
 * `demandes.ts` est importe dynamiquement. A lui tout seul il represente
 * environ 124 kB compresses : importe statiquement, il pèserait sur le
 * premier affichage de chaque visiteur, pour une operation que presque
 * personne n'execute. Ce site se vend sur la performance ; il ne peut pas
 * la perdre avant meme la premiere phrase.
 *
 * Le module arrive pendant l'etat « Envoi en cours », que le bouton annonce
 * deja, et un echec de telechargement tombe dans le meme filet que tout autre
 * echec : le message d'erreur et les valeurs saisies restent en place.
 *
 * ---------------------------------------------------------------------------
 * CE QUI N'EST PAS FAIT ICI, ET POURQUOI
 * ---------------------------------------------------------------------------
 * - aucune confirmation d'envoi, aucune adresse, aucune redirection : ce sont
 *   les regles Firestore qui decide de ce qu'un visiteur peut ecrire, et on ne
 *   les contourne pas pour rendre la demonstration plus jolie ;
 * - aucune authentification, aucun tableau de bord, aucun e-mail : une seule
 *   ecriture depuis une page publique, c'est tout ce que demande cette etape ;
 * - aucun WhatsApp automatique : le lien de repli existe deja dans le
 *   formulaire et ne s'affiche qu'en cas d'echec, ce qui n'est pas une
 *   redirection.
 */

export type ResultatEnvoi = 'envoye' | 'echec' | 'non-configure'

export type Transport = (projet: Valeurs) => Promise<ResultatEnvoi>

/**
 * Envoi reel. Echoue jamais : toute erreur devient `echec`.
 *
 * L'import est dynamique, et c'est volontaire : `demandes.ts` tire tout le
 * SDK Firebase avec lui. Il est donc telecharge au clic, pendant l'etat
 * « Envoi en cours » deja affiche, et pas au chargement de la page.
 *
 * Le `console.error` est le seul log du projet, et il ne s'execute qu'en cas
 * d'echec — il est donc la trace du developpeur, pas un bruit de fond. Il ne
 * contient aucune reponse du prospect : ni nom, ni telephone, ni entreprise.
 * L'utilisateur, lui, ne voit qu'un message francais et garde ses saisies.
 */
const TRANSPORT: Transport = async (reponses) => {
  try {
    const { creerDemande } = await import('./demandes.ts')
    await creerDemande(reponses)
    return 'envoye'
  } catch (erreur) {
    console.error('[contact] Demande non enregistree dans Firestore.', erreur)
    return 'echec'
  }
}

export async function envoyerProjet(projet: Valeurs): Promise<ResultatEnvoi> {
  return TRANSPORT(projet)
}
