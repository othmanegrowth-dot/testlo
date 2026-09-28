/**
 * Initialisation de Firebase pour le navigateur.
 *
 * ---------------------------------------------------------------------------
 * A QUOI SERT CETTE ETAPE
 * ---------------------------------------------------------------------------
 * Elle pose l'application Firebase et l'instance Firestore, puis elle
 * s'arrete. Aucun ecrit, aucune lecture, aucune regle, aucun service tiers :
 * ce module se contente d'etre pret, et l'attache au formulaire de contact se
 * fera a l'etape suivante.
 *
 * ---------------------------------------------------------------------------
 * UN SEUL MODULE, UNE SEULE INITIALISATION
 * ---------------------------------------------------------------------------
 * `initializeApp` ne doit etre appele qu'une fois. Le module s'important
 * lui-meme depuis plusieurs endroits — bientot le formulaire, peut-etre une
 * verification d'environnement — `getApps()` est interroge avant tout appel :
 * si l'application existe deja, elle est reutilisee au lieu d'etre dupliquee.
 * C'est ce qui evite le message « Firebase App named '[DEFAULT]' already
 * exists » quand le serveur de developpement recharge un module a chaud.
 *
 * ---------------------------------------------------------------------------
 * LA CONFIGURATION N'EST PAS UN SECRET
 * ---------------------------------------------------------------------------
 * Ces six valeurs identifient le projet, elles ne l'ouvrent pas. Firebase les
 * inscrit dans le HTML de toutes les applications web qu'il sert : elles
 * finissent donc, de toute facon, dans le navigateur du visiteur. Ce qui
 * protege reellement les donnees, ce sont les regles Firestore, posees cote
 * console et non ici. Aucune cle privee, aucun secret d'administration, aucun
 * jeton de service ne figure dans ce fichier, et aucun n'y figure jamais.
 *
 * Pour information : `measurementId` est recopie tel quel depuis la console
 * pour que la configuration reste identique a celle qui y est affichee, mais
 * Analytics n'est pas initialise et ne le sera pas sans raison.
 *
 * ---------------------------------------------------------------------------
 * A RETENIR POUR LA SUITE : L'API EST FONCTIONNELLE, PAS METHODIQUE
 * ---------------------------------------------------------------------------
 * Dans cette version du SDK, l'instance `db` n'a plus de methodes : ni
 * `collection()`, ni `doc()`. Le chemin se construit avec les fonctions
 * exportees, qui recoivent l'instance en premier argument :
 *
 *     import { collection, doc } from 'firebase/firestore'
 *     const demandes = collection(db, 'demandes')
 *     const uneDemande = doc(db, 'demandes', identifiant)
 *
 * C'est verifier, et non suppose : `db.collection` vaut `undefined`.
 *
 * ---------------------------------------------------------------------------
 * LE SDK N'EST PAS CHARGE TANT QU'IL N'EST PAS UTILISE
 * ---------------------------------------------------------------------------
 * Aucun fichier n'importe encore ce module. Vite n'inclut donc rien du SDK
 * dans le bundle de la page, et la landing page reste aussi legere qu'avant :
 * la seule connexion au reseau qu'Ads ou Analysis decouvriront sera celle du
 * formulaire, au moment ou il en aura besoin. Des que l'import sera present,
 * Vite rationalisera le SDK a la construction, et non tout le paquet.
 */

import { getApps, initializeApp } from 'firebase/app'
import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'

/**
 * Configuration de l'application web `othmane-growth-web`, telle que fournie
 * par la console Firebase pour le projet `othmane-growth-backend`.
 */
export const configurationFirebase: FirebaseOptions = {
  apiKey: 'AIzaSyCwp47WriP1igVGfAZAnVgOymqotP6CB2g',
  authDomain: 'othmane-growth-backend.firebaseapp.com',
  projectId: 'othmane-growth-backend',
  storageBucket: 'othmane-growth-backend.firebasestorage.app',
  messagingSenderId: '93221285699',
  appId: '1:93221285699:web:82a6d867e795c1452e49f6',
  measurementId: 'G-4WECDEJ9E5',
}

/**
 * Application Firebase unique du projet.
 *
 * `getApps()` est lu avant `initializeApp()` : au premier chargement la liste
 * est vide et l'application est creee ; au rechargement a chaud du serveur de
 * developpement, ou lors d'un second import, elle est deja la et la meme
 * instance est renvoyee.
 */
function obtenirApplication(): FirebaseApp {
  const applications = getApps()
  return applications.length > 0
    ? applications[0]
    : initializeApp(configurationFirebase)
}

/** Instance applicative, prete a etre utilisee ou a etre exportee. */
export const app: FirebaseApp = obtenirApplication()

/**
 * Instance Firestore du projet.
 *
 * C'est elle que le formulaire utilisera a l'etape suivante, pour y ecrire la
 * demande du prospect. Elle est volontairement la seule donnee a manipuler :
 * creer une collection ou un document se fera depuis un module dedie, avec ses
 * propres regles de validation, et non depuis un composant.
 */
export const db: Firestore = getFirestore(app)
