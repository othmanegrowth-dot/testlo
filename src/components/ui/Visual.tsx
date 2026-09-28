/** Formats de cadre disponibles. */
const ratios = {
  '3/2': 'aspect-[3/2]',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-[16/9]',
} as const

type VisualProps = {
  src: string
  /**
   * Texte alternatif, lu par les lecteurs d'ecran.
   * Doit decrire ce que l'image montre reellement.
   */
  alt: string
  ratio?: keyof typeof ratios
  className?: string
}

/**
 * Visuel photo, integre au design system : meme rayon et meme filet
 * que le reste de la page. Le ratio est impose par CSS, donc la place
 * est reservee avant le chargement (pas de saut de mise en page).
 */
export function Visual({
  src,
  alt,
  ratio = '3/2',
  className = '',
}: VisualProps) {
  return (
    <div
      className={`overflow-hidden rounded-card border border-cream/10 bg-slate ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full object-cover ${ratios[ratio]}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
