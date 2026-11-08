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
 * Ce qui lui reste a faire, c'est laisser un nom et un numero. Le formulaire
 * existe pour obtenir ces deux informations avec le moins de friction
 * possible, et pour laisser la porte ouverte a une troisieme reponse sans
 * jamais l'exiger.
 *
 * ---------------------------------------------------------------------------
 * REGLE ABSOLUE SUR LE CONTENU
 * ---------------------------------------------------------------------------
 * Ce fichier ne contient QUE de la mise en forme de l'information : des
 * questions, des exemples et des messages de validation. Il ne contient
 * aucune information inventee. En particulier :
 *
 *   - aucun prix, aucune grille tarifaire
 *   - aucun delai de reponse, aucune garantie, aucune promesse
 *   - aucun chiffre d'affaires, nombre de clients ou taux
 *
 * ---------------------------------------------------------------------------
 * TROIS CHAMPS, DEUX OBLIGATOIRES
 * ---------------------------------------------------------------------------
 * Un nom et un numero suffisent a rappeler quelqu'un. Tout le reste peut
 * attendre la conversation : chaque champ supplementaire est une occasion de
 * plus de refermer la page, et le formulaire est la pour ceux qui n'ont pas
 * encore envie d'ecrire. Le formulaire precedent demandait une entreprise, un
 * secteur, une ville, un budget et deux questions fermees ; il a ete reduit,
 * pas reformate.
 *
 * L'objectif, lui, se propose et ne se demande pas. Il est facultatif, il ne
 * porte aucun asterisque et aucun message d'erreur : une reponse vide n'est
 * pas une donnee manquante, c'est une reponse.
 *
 * La consequence est assumee : la demande est moins riche en surface, et
 * davantage qualifiee par la conversation qui suit. Une reponse de trois
 * lignes sur son projet ne change rien a la qualite de l'echange ; un nom et
 * un numero, si.
 */

import { suivreLead } from './meta.ts'

/**
 * Ordre des champs. Il sert deux fois : au rendu (ordre de tabulation) et a
 * la validation (premier champ invalide = premier de cette liste).
 */
export const NOMS_CHAMPS = ['nom', 'telephone', 'objectif'] as const

export type NomChamp = (typeof NOMS_CHAMPS)[number]

/**
 * Les seuls champs dont l'absence bloque l'envoi. La liste est volontairement
 * plus courte que `NOMS_CHAMPS` : la validation la lit, le rendu continue de
 * lire l'ordre complet. Deux listes plutot qu'un booleen par champ, parce
 * qu'ajouter un champ obligatoire doit rester une ligne a ecrire ici.
 */
export const CHAMPS_OBLIGATOIRES = ['nom', 'telephone'] as const

export type ChampObligatoire = (typeof CHAMPS_OBLIGATOIRES)[number]

/** Le formulaire tient en un seul objet plat : une chaine vide = non renseigne. */
export type Valeurs = Record<NomChamp, string>

export const contact = {
  /**
   * Le libelle de section, court, dans la meme famille que « Le probleme »,
   * « Mon approche » et « Temoignages ». Il ne repete pas le titre : le titre
   * EST desormais « Parlons de votre projet ».
   */
  eyebrow: 'Contact',

  /** Une invitation, pas une injonction. */
  title: 'Parlons de votre projet.',

  /**
   * Annonce ce que va se passer apres l'envoi, avant qu'on le demande. Une
   * personne qui hesite a un doute sur la suite ; le dire d'emblee evite
   * qu'elle se demande si sa demande va se perdre dans un trou.
   */
  intro:
    'Échangeons sur votre activité et voyons comment améliorer votre acquisition de clients grâce au contenu vidéo et à la publicité Meta.',

  /**
   * Les deux champs d'identite, tous en texte libre : un nom et un numero ne
   * se choisissent pas dans une liste. Ce sont les deux seuls obligatoires.
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
  },

  /**
   * OBJECTIF, FACULTATIF.
   *
   * Une liste fermee, courte, et sans option « Autre » : les quatre reponses
   * couvrent ce qu'un prospect peut vouloir au premier contact, et une
   * reponse libre n'apporterait rien qu'une conversation n'apporte mieux.
   *
   * Le champ n'est pas obligatoire, donc l'option vide reste valide et son
   * libelle le dit. C'est la seule chose a changer si un jour il redevient
   * obligatoire : la liste des champs obligatoires, dans ce fichier.
   */
  objectif: {
    label: 'Qu’est-ce que vous souhaitez améliorer en priorité ?',
    vide: 'Choisir un objectif (facultatif)',
    options: [
      'Générer plus de clients',
      'Améliorer ma visibilité',
      'Structurer mon acquisition',
      'Je ne sais pas encore',
    ],
  },

  /**
   * Reassurance placee sous le bouton, pas au-dessus du formulaire : elle
   * repond a l'hesitation du dernier instant, celle qui precede le clic.
   */
  mentionBouton: 'Consultation gratuite · Sans engagement',

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
   *
   * `Record<ChampObligatoire, string>` et non `Record<NomChamp, string>` :
   * l'objectif etant facultatif, il n'a pas de message d'erreur, et le type
   * empeche d'en ajouter un par distraction.
   */
  erreurs: {
    nom: 'Veuillez renseigner votre nom.',
    telephone: 'Veuillez renseigner votre numéro de téléphone.',
  } as const satisfies Record<ChampObligatoire, string>,
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
 * Il reçoit les trois reponses, rend un verdict, et ne leve jamais : une
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
