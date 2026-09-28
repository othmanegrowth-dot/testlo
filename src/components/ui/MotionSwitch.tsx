import {
  basculerMouvement,
  mouvement,
  useMouvement,
} from '../../lib/motion.ts'

/**
 * Controle ON / OFF des animations.
 *
 * ---------------------------------------------------------------------------
 * UN BOUTON `role="switch"`, PAS UN INTERRUPTEUR A FABRIQUER
 * ---------------------------------------------------------------------------
 * L'etat est porte par `aria-checked` : une technologie d'assistance annonce
 * « Motion, commutateur, active » sans avoir a deduire quoi que ce soit du
 * texte affiche. Le role se pilote a la barre d'espace comme a la touche
 * entree, puisque c'est un vrai `<button type="button">`.
 *
 * AUCUN `aria-label`, ET C'EST DELIBERE.
 * ---------------------------------------------------------------------------
 * La regle « le nom accessible contient le texte visible » (WCAG 2.5.3) existe
 * pour qu'une personne qui commande le site a la voix n'ait pas a dire
 * « Motion ON » pour trouver un bouton que l'ecran nomme « Animations de la
 * page ». Un `aria-label` plus bavard que l'etiquette visible viole donc la
 * regle, et fait choisir entre deux defauts.
 *
 * La regle est donc tenue par le nom lui-meme :
 *   - « Motion » est du texte reellement affiche, il donne le nom ;
 *   - la pastille ON / OFF est `aria-hidden` : c'est un rendu graphique de
 *     l'etat, que `aria-checked` annonce deja, et rien d'autre. Elle ne fait
 *     donc pas partie du nom, et son absence de lecture n'est pas une perte
 *     d'information.
 * ---------------------------------------------------------------------------
 * ---------------------------------------------------------------------------
 * L'ETAT AFFICHE EST L'ETAT REEL
 * ---------------------------------------------------------------------------
 * Le bouton affiche l'etat effectif, pas la derniere intention. Si le systeme
 * demande moins d'animations et que le visiteur n'a rien tranche, il lit
 * « OFF » — ce qui est vrai, et il peut alors decide de l'activer.
 *
 * ---------------------------------------------------------------------------
 * 44 PX, PARTOUT
 * ---------------------------------------------------------------------------
 * `min-h-11` sur le controle, comme tous les autres elements cliquables de la
 * page. Dans la navbar il tient dans les 64 px de `--navbar-h` sans rien
 * deformer ; dans le panneau mobile il occupe toute la largeur.
 */
export function MotionSwitch({ className = '' }: { className?: string }) {
  const actif = useMouvement()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={actif}
      onClick={basculerMouvement}
      className={`flex min-h-11 items-center gap-2 rounded-full verre verre-bordure border px-3 text-xs transition-colors duration-150 hover:border-cream/25 ${className}`}
    >
      <span className="text-mist">{mouvement.label}</span>

      {/*
        L'or ne signale que l'etat actif. En « OFF », la pastille s'efface au
        lieu de devenir grise : un etat inactif ne doit pas peser plus lourd
        qu'un etat actif dans une barre de navigation.
      */}
      <span
        aria-hidden="true"
        className={`rounded-full px-2 py-0.5 font-semibold tracking-[0.12em] transition-colors duration-150 ${
          actif ? 'bg-gold/15 text-gold' : 'text-mist/70'
        }`}
      >
        {actif ? mouvement.on : mouvement.off}
      </span>
    </button>
  )
}
