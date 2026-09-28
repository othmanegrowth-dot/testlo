import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

import {
  NOMS_CHAMPS,
  contact,
  envoyerProjet,
} from '../../lib/contact.ts'
import type { NomChamp, Valeurs } from '../../lib/contact.ts'
import { site } from '../../lib/site.ts'
import { Button } from '../ui/Button.tsx'
import { Container } from '../ui/Container.tsx'
import { Eyebrow } from '../ui/Eyebrow.tsx'
import {
  ChoiceField,
  SelectField,
  TextAreaField,
  TextField,
} from '../ui/Field.tsx'
import { Reveal } from '../ui/Reveal.tsx'

/** Formulaire vide. Un objet unique, jamais recree a chaque rendu. */
const VIDE: Valeurs = {
  nom: '',
  telephone: '',
  entreprise: '',
  secteur: '',
  ville: '',
  objectif: '',
  metaAds: '',
  budget: '',
  projet: '',
}

/** Les quatre champs d'identite, dans l'ordre ou ils sont lus. */
const IDENTITE = [
  ['nom', 'text'],
  ['telephone', 'tel'],
  ['entreprise', 'text'],
  ['secteur', 'text'],
] as const

type Etat = 'repos' | 'envoi' | 'succes' | 'echec'

/**
 * Erreurs de validation, calculees sur un seul critere : le champ est vide
 * ou il ne l'est pas.
 *
 * AUCUNE REGLE DE FORMAT. Ni test sur le telephone, ni verification que la
 * ville existe. Un prospect tape son numero avec ou sans espaces, il se
 * trompe dans son nom d'entreprise : bloquer sa soumission pour cela le
 * ferait abandonner, et la verification se fera tres bien sans formulaire,
 * a l'etape suivante. Le formulaire doit tenir sa promesse, celle de
 * recevoir une demande.
 */
function valider(valeurs: Valeurs): Partial<Record<NomChamp, string>> {
  const erreurs: Partial<Record<NomChamp, string>> = {}
  for (const nom of NOMS_CHAMPS) {
    if (valeurs[nom].trim() === '') erreurs[nom] = contact.erreurs[nom]
  }
  return erreurs
}

/**
 * Coordonnees, en toute fin de section.
 *
 * Elles naissent apres le bouton, pas avant le formulaire. Une personne
 * qui hesite n'a pas besoin de voir une adresse pour decider ; elle a
 * besoin de decider. L'adresse sert quand la decision est prise — ou quand
 * l'envoi a echoue.
 *
 * Le mail et le telephone sont de vrais liens : `mailto:` et `tel:` sont
 * deterministes a partir des donnees de `site.ts`, on ne peut pas se
 * tromper. Le pseudo Instagram n'en est PAS un : un identifiant n'est pas
 * une URL, et deduire « instagram.com/… » reviendrait a inventer une
 * adresse. Il reste du texte simple, avec exactement le meme traitement
 * visuel que les liens, donc rien ne parait casse. A transformer en lien
 * le jour ou l'URL reelle sera confirmee.
 *
 * ZONE TACTILE
 * ---------------------------------------------------------------------------
 * Les liens font 44 px de haut, comme tous les autres elements cliquables de
 * la page. Un lien en ligne fait 17 px : sur un telephone, c'est rate une
 * fois sur trois, et ce bloc se trouve en toute fin de page, precisement
 * quand on a fini par vouloir l'utiliser. Le `min-h-11` porte la zone, pas
 * une marge factice — la cible cliquable est reellement de 44 px.
 * ---------------------------------------------------------------------------
 */
function Coordonnees() {
  const lien =
    'flex min-h-11 items-center transition-colors duration-150 hover:text-gold'

  return (
    <div className="mt-10 border-t border-cream/10 pt-4 sm:mt-12">
      <p className="text-sm font-medium text-cream">{site.person}</p>

      {/*
        Pas de `gap` entre les items : chaque lien occupe deja 44 px, un
        espacement supplementaire eloignerait les deux lignes de leur
        voisin sans rien ajouter.
      */}
      <ul className="mt-1 flex flex-col text-sm text-mist">
        <li>
          <a href={`mailto:${site.email}`} className={lien}>
            {site.email}
          </a>
        </li>
        <li>
          <a
            href={`tel:${site.phone.replace(/\s/g, '')}`}
            className={lien}
          >
            {site.phone}
          </a>
        </li>
        <li className="flex min-h-11 items-center">{site.instagram}</li>
      </ul>
    </div>
  )
}

export function Contact() {
  const [valeurs, setValeurs] = useState<Valeurs>(VIDE)
  const [erreurs, setErreurs] = useState<Partial<Record<NomChamp, string>>>({})
  const [etat, setEtat] = useState<Etat>('repos')

  /**
   * Sert a poser le focus sur le premier champ invalide sans maintenir un
   * `ref` par champ. La selection se fait par attribut `id` et non par
   * selecteur d'identifiant : aucune echappement a se soucier, et aucun
   * risque que la lecture de l'identifiant soit interpretee comme une
   * pseudo-classe CSS.
   */
  const formRef = useRef<HTMLFormElement>(null)

  /**
   * L'erreur d'un champ disparait des qu'on la corrige, et pas seulement a
   * la soumission suivante. Exiger un second envoi pour effacer un message
   * qu'on vient de resoudre est le moyen le plus rapide de perdre
   * patience.
   */
  function modifier(nom: NomChamp, valeur: string) {
    setValeurs((v) => ({ ...v, [nom]: valeur }))
    if (erreurs[nom]) {
      setErreurs((e) => ({ ...e, [nom]: undefined }))
    }
  }

  async function soumettre(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault()

    const manquants = valider(valeurs)
    setErreurs(manquants)

    const premier = NOMS_CHAMPS.find((nom) => manquants[nom])
    if (premier) {
      // Pas de bandeau d'erreur au-dessus du formulaire : on y va
      // directement, c'est ce que la personne vient de demander.
      formRef.current
        ?.querySelector<HTMLElement>(`[id="contact-${premier}"]`)
        ?.focus()
      return
    }

    setEtat('envoi')
    const resultat = await envoyerProjet(valeurs)
    setEtat(resultat === 'envoye' ? 'succes' : 'echec')
  }

  return (
    /*
     * ---------------------------------------------------------------------------
     * GABARIT DE SECTION REPRIS ICI, ET NON REPRIS DE `Section`
     * ---------------------------------------------------------------------------
     * `Section` place son en-tete au-dessus du contenu, sur toute la largeur.
     * Cette section doit etre en deux zones a partir de lg : le message a
     * gauche, le formulaire a droite.
     *
     * Deux solutions ont ete ecartees :
     *
     * - reutiliser `Section` tel quel, et laisser un titre pleine largeur au
     *  -dessus d'un formulaire pleine largeur. Un formulaire de 1 150 px de
     *   large n'est pas un formulaire, c'est une bande de saisie ;
     * - forcer l'en-tete a deborder de son conteneur (flottant, marge
     *   negative) pour le placer dans la colonne de gauche. Une grammaire
     *   CSS bricolee qui casse au premier changement de largeur.
     *
     * Le gabarit est donc reecrit ici avec les memes classes que `Section` :
     * meme filet de separation, meme rythme vertical (48 / 64 / 80 / 112 px),
     * meme `Container`, meme `Eyebrow` force en majuscules, et des classes
     * de `h2` identiques au caractere pres. Le titre s'affiche donc comme
     * ceux des quatre autres sections, et `Section` reste intact pour elles.
     * ---------------------------------------------------------------------------
     */
    <section
      id="contact"
      aria-labelledby="contact-titre"
      className="border-b border-cream/10 py-12 sm:py-16 md:py-20 lg:py-28"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:gap-16">
          {/* ------------------------------------------------------------------
              ZONE GAUCHE — LE MESSAGE
              Trois elements, rien d'autre. Les coordonnees sont en bas de
              colonne droite, apres le bouton : le parcours se lit de haut en
              bas — on presente, on remplit, on envoie, puis on laisse une
              porte de sortie si la personne prefere ecrire directement.
              ------------------------------------------------------------------ */}
          <Reveal>
            <Eyebrow className="uppercase">{contact.eyebrow}</Eyebrow>

            <h2
              id="contact-titre"
              className="mt-4 text-3xl leading-[1.15] font-bold tracking-tight text-cream sm:mt-5 sm:text-4xl"
            >
              {contact.title}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-mist sm:mt-5 sm:text-lg">
              {contact.intro}
            </p>
          </Reveal>

          {/* ------------------------------------------------------------------
              ZONE DROITE — LE FORMULAIRE, PUIS LES COORDONNEES
              ------------------------------------------------------------------ */}
          <Reveal delay={100}>
            {etat === 'succes' ? (
              /*
               * L'etat de succes REMPLACE le formulaire, a la meme place et
               * au meme niveau de titre. Pas de fenetre modale : une
               * surcouche interromprait la lecture, alors que l'information
               * est deja ecrite a l'ecran.
               *
               * `role="status"` : la region est annoncee poliment, sans
               * couper ce que la personne est en train de faire.
               */
              <div
                role="status"
                className="border-t border-gold/30 pt-8 sm:pt-10"
              >
                <h3 className="text-2xl font-bold tracking-tight text-cream sm:text-3xl">
                  {contact.envoi.succes.titre}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-mist sm:text-lg">
                  {contact.envoi.succes.texte}
                </p>
              </div>
            ) : (
              <form
                ref={formRef}
                /*
                 * `noValidate` desactive les bulles natives du navigateur.
                 * `required` reste pose sur chaque controle — l'etat
                 * « obligatoire » continue donc d'etre expose aux
                 * technologies d'assistance — mais ce sont nos messages, en
                 * francais et nommant le champ, qui s'affichent.
                 */
                noValidate
                onSubmit={soumettre}
                aria-labelledby="contact-formulaire"
                className="flex flex-col gap-6 sm:gap-7"
              >
                {/* Nom accessible du formulaire, invisible a l'ecran. */}
                <h3 id="contact-formulaire" className="sr-only">
                  {contact.nomFormulaire}
                </h3>

                <p className="-mt-1 text-xs text-mist/70">
                  {contact.mentions}
                </p>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  {IDENTITE.map(([nom, type]) => (
                    <TextField
                      key={nom}
                      id={`contact-${nom}`}
                      name={nom}
                      type={type}
                      label={contact.champs[nom].label}
                      placeholder={contact.champs[nom].placeholder}
                      autoComplete={contact.champs[nom].autoComplete}
                      inputMode={nom === 'telephone' ? 'tel' : undefined}
                      value={valeurs[nom]}
                      onChange={(e) => modifier(nom, e.target.value)}
                      erreur={erreurs[nom]}
                    />
                  ))}

                  {/*
                    * La ville ferme la ligne d'identite. Elle occupe sa
                    * propre ligne plutot que de laisser un trou vide a son
                    * cote : un trou se voit, une ligne pleine ne se remarque
                    * pas.
                    */}
                  <TextField
                    id="contact-ville"
                    name="ville"
                    label={contact.champs.ville.label}
                    placeholder={contact.champs.ville.placeholder}
                    autoComplete={contact.champs.ville.autoComplete}
                    value={valeurs.ville}
                    onChange={(e) => modifier('ville', e.target.value)}
                    erreur={erreurs.ville}
                    className="sm:col-span-2"
                  />
                </div>

                <SelectField
                  id="contact-objectif"
                  name="objectif"
                  label={contact.objectif.label}
                  value={valeurs.objectif}
                  onChange={(e) => modifier('objectif', e.target.value)}
                  erreur={erreurs.objectif}
                >
                  <option value="">{contact.objectif.vide}</option>
                  {contact.objectif.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </SelectField>

                <ChoiceField
                  id="contact-metaAds"
                  name="metaAds"
                  legend={contact.metaAds.question}
                  options={contact.metaAds.options}
                  value={valeurs.metaAds}
                  onChange={(v) => modifier('metaAds', v)}
                  erreur={erreurs.metaAds}
                  colonnes
                />

                <ChoiceField
                  id="contact-budget"
                  name="budget"
                  legend={contact.budget.question}
                  note={contact.budget.precision}
                  options={contact.budget.options.map((label) => ({
                    valeur: label,
                    label,
                  }))}
                  value={valeurs.budget}
                  onChange={(v) => modifier('budget', v)}
                  erreur={erreurs.budget}
                />

                <TextAreaField
                  id="contact-projet"
                  name="projet"
                  label={contact.projet.label}
                  placeholder={contact.projet.placeholder}
                  value={valeurs.projet}
                  onChange={(e) => modifier('projet', e.target.value)}
                  erreur={erreurs.projet}
                />

                <div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={etat === 'envoi'}
                    className="w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:px-10"
                  >
                    {etat === 'envoi'
                      ? contact.envoi.enCours
                      : contact.envoi.cta}
                  </Button>

                  {/*
                    * L'etat intermediaire est annonce, meme si personne ne
                    * regarde le bouton : sans cela, un clic suivi d'un
                    * silence parait sans effet.
                    */}
                  {etat === 'envoi' && (
                    <p role="status" className="sr-only">
                      {contact.envoi.enCours}
                    </p>
                  )}

                  {/*
                    * `role="alert"` : une erreur d'envoi doit etre annoncee
                    * immediatement, elle change ce que la personne attend.
                    * Les valeurs saisies restent en place — c'est le point.
                    */}
                  {etat === 'echec' && (
                    <div role="alert" className="mt-4">
                      <p className="text-sm text-gold-hi">
                        {contact.envoi.echec}
                      </p>
                      <p className="mt-2 text-sm text-mist">
                        {contact.envoi.repli}{' '}
                        <a
                          href={site.whatsappUrl}
                          className="text-gold transition-colors duration-150 hover:text-gold-hi"
                        >
                          {contact.envoi.repliLien}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </form>
            )}

            {/*
             * Les coordonnees ferment la section : elles restent accessibles
             * aussi bien apres un envoi que apres un echec, ce qui rend le
             * message de repli de l'etat d'echec redondant — il ne precise
             * plus que le geste, le bloc juste en dessous le montre.
             *
             * Hors du <form> : ce ne sont pas des donnees a saisir, et le
             * bloc doit survivre au remplacement du formulaire par la
             * confirmation.
             */}
            <Coordonnees />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
