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
 *   - aucun prix de pack, aucune grille tarifaire
 *   - aucune delai de reponse, aucune garantie, aucune promesse
 *   - aucun chiffre d'affaires, nombre de clients ou taux
 *
 * Deux valeurs monetaires seulement sont autorisees, et elles disent deux
 * choses differentes : le prix plancher de l'accompagnement, affiche a titre
 * indicatif sous le champ budget, et le budget publicitaire que le prospect
 * saisit lui-meme. La precision ecrite sous le champ existe precisement pour
 * que la confusion entre les deux soit impossible.
 *
 * ---------------------------------------------------------------------------
 * LES HUIT CHAMPS SONT OBLIGATOIRES. SEPT SONT FERMES, UN EST LIBRE.
 * ---------------------------------------------------------------------------
 * C'est un choix, pas un oubli. Quatre identifiants et trois questions
 * fermees se repondent sans reflechir, au clavier comme au doigt. Seul le
 * budget s'ecrit librement : il n'existe pas de grille de prix unique, et
 * imposer des tranches reviendrait a inventer une offre.
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

import { suivreLead } from './meta.ts'

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
   * BUDGET MENSUEL D'ACCOMPAGNEMENT.
   *
   * Saisie libre, et non une liste de tranches : un budget d'accompagnement
   * depend du perimetre du projet, et proposer cinq fourchettes fermees
   * revenait a imposer une grille qui n'existe pas. Le visiteur ecrit ce
   * qu'il a prevu, dans ses mots et dans sa devise.
   *
   * Le champ reste obligatoire, comme les sept autres : la mention affichee
   * en tete du formulaire doit rester vraie. Repondre « je ne sais pas »
   * reste possible, en toutes lettres, et vaut mieux qu'un champ vide.
   *
   * La precision sous le champ separe deux montants que le mot « budget »
   * confond souvent : les honoraires d'accompagnement, affiches a titre
   * indicatif, et le budget publicitaire, qui vient en plus et n'est pas
   * inclus.
   */
  budget: {
    question:
      'Quel budget mensuel avez-vous prévu pour l’accompagnement de votre projet ?',
    placeholder: 'Ex. : 3 500 DH / mois',
    /** Precision affichee en petit, juste sous le champ. */
    precision:
      'Honoraires d’accompagnement à partir de 3 500 DH/mois. Budget publicitaire non inclus.',
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
    budget: 'Veuillez renseigner votre budget mensuel.',
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
 *
 * ---------------------------------------------------------------------------
 * L'EVENEMENT « Lead » EST DECLARE ICI, ET AILLEURS NULLE PART
 * ---------------------------------------------------------------------------
 * `suivreLead()` est appele une fois, apres le `await` de `creerDemande()`,
 * c'est-a-dire au moment precis ou le serveur a confirme l'ecriture.
 *
 * Ce choix n'admet aucune marge d'interprétation : la validation a rendu la
 * main avant d'arriver ici, donc ni le clic seul ni un formulaire incomplet ne
 * declenchent quoi que ce soit ; et si Firestore refuse l'ecriture, la ligne
 * qui suit n'est jamais atteinte. Le Lead ne peut donc pas partir sur une
 * demande qui n'existe pas.
 *
 * L'appel est aussi place a l'interieur du `try`, et c'est `suivreLead()` qui
 * garantit de ne jamais lever. Sans cette garantie, une mesure qui echoue
 * ferait passer un envoi reussi pour un echec devant le prospect.
 */
const TRANSPORT: Transport = async (reponses) => {
  try {
    const { creerDemande } = await import('./demandes.ts')
    await creerDemande(reponses)
    suivreLead()
    return 'envoye'
  } catch (erreur) {
    console.error('[contact] Demande non enregistree dans Firestore.', erreur)
    return 'echec'
  }
}

export async function envoyerProjet(projet: Valeurs): Promise<ResultatEnvoi> {
  return TRANSPORT(projet)
}
