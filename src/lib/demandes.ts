/**
 * Enregistrement des demandes de contact dans Firestore.
 *
 * ---------------------------------------------------------------------------
 * A QUOI SERT CE FICHIER
 * ---------------------------------------------------------------------------
 * Il tient le document ecrit dans la collection `demandes`, et rien d'autre.
 * Le formulaire ne parle pas a Firestore, il appelle `creerDemande()` et
 * attend un resultat : la connexion au service reste ici, la politique
 * d'affichage reste dans `Contact.tsx`.
 *
 * ---------------------------------------------------------------------------
 * LES NOMS DU DOCUMENT SONT CELUX DES QUESTIONS
 * ---------------------------------------------------------------------------
 * Chaque propriete porte le nom exact du champ qu'elle repond, et sa valeur
 * est celle du champ, telle que le prospect l'a saisie ou choisie. Rien n'est
 * traduit, rien n'est normalise, rien n'est abrege.
 *
 * ---------------------------------------------------------------------------
 * CE QUE LE DOCUMENT NE CONTIENT PAS
 * ---------------------------------------------------------------------------
 * Les trois reponses, et l'heure de l'ecriture. Ni identifiant de visiteur, ni
 * adresse IP, ni user-agent, ni configuration Firebase : rien qui n'ait ete
 * demande et rien qui ne serve la conversation qui suivra.
 *
 * La cle de la configuration Firebase (`apiKey`, `projectId`, ...) n'est pas
 * un acces aux donnees : elle identifie le projet et se trouve dans le HTML de
 * toutes les applications Firebase. Ce qui protege les documents, ce sont les
 * regles Firestore, posees dans la console. Aucune cle privee, aucun jeton et
 * aucun mot de passe n'a de raison d'exister ici, et aucun n'est demande.
 *
 * ---------------------------------------------------------------------------
 * L'API EST FONCTIONNELLE
 * ---------------------------------------------------------------------------
 * Cette version du SDK n'accorde plus de methodes a l'instance : ni
 * `db.collection()`, ni `db.doc()`. Les references se construisent avec les
 * fonctions exportees, qui recoivent l'instance en premier argument. C'est
 * verifie, pas suppose : `db.collection` vaut `undefined`.
 */

import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import type { FieldValue } from 'firebase/firestore'

import { db } from './firebase.ts'
import type { Valeurs } from './contact.ts'

/**
 * Nom de la collection. Une seule constante : le nom existe a un seul
 * endroit, et la collection ne peut pas s'ecrire deux fois sous deux noms.
 */
const COLLECTION = 'demandes'

/**
 * Document enregistre dans `demandes`.
 *
 * Les trois premiers champs sont les trois reponses du formulaire, dans
 * l'ordre ou la personne les a lus. `objectif` est ecrit meme vide : le champ
 * est facultatif, et une absence de reponse est une reponse. `creeLe` est une
 * horloge du serveur, pas une horloge du navigateur : le champ est ecrit par
 * Firestore au moment exact de l'enregistrement, et non a celui du clic.
 */
export type Demande = {
  nom: string
  telephone: string
  objectif: string
  creeLe: FieldValue
}

/**
 * Enregistre une nouvelle demande.
 *
 * Les valeurs arrivent deja validees : cette fonction ne repete pas les
 * controles du formulaire, elle ne connait pas les questions. Elle les copie.
 *
 * Elle **laisse echouer** une ecriture refusee. Renvoyer un succes ici serait
 * le pire des choix : la personne repartirait en croyant avoir ete rappelee,
 * et la demande n'existerait nulle part. L'appelant transforme l'echec en
 * message a l'ecran et garde les valeurs saisies.
 */
export async function creerDemande(reponses: Valeurs): Promise<void> {
  const demande: Demande = {
    nom: reponses.nom,
    telephone: reponses.telephone,
    objectif: reponses.objectif,
    creeLe: serverTimestamp(),
  }

  await addDoc(collection(db, COLLECTION), demande)
}
