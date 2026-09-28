/**
 * Label de marque : « OTHMANE · GROWTH ».
 * Majeuscules avec un letter-spacing large, pour une presence sobre.
 */
export function BrandLabel({ className = '' }: { className?: string }) {
  return (
    <span
      className={`text-xs font-semibold tracking-[0.28em] text-cream uppercase ${className}`}
    >
      Othmane · Growth
    </span>
  )
}
