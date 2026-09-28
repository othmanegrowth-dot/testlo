# OTHMANE.GROWTH — Landing page

Landing page du studio de performance marketing **OTHMANE.GROWTH**.

## Stack technique

| Outil | Version | Role |
| --- | --- | --- |
| Vite | `^8.3.0` | Build tool et serveur de developpement |
| React | `^19.3.0` | Interface |
| TypeScript | `~6.0.2` | Typage |
| Tailwind CSS | `^4.3.3` | Styles (configure via `@tailwindcss/vite`) |
| oxlint | `^1.85.0` | Lint |

> Vite 8 exige **Node `^20.19.0` ou `>=22.12.0`**.

## Demarrer en local

```bash
npm install
npm run dev
```

Le serveur affiche l'URL dans le terminal (par defaut `http://localhost:5173`).

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de developpement avec HMR |
| `npm run build` | Type-check puis build de production dans `dist/` |
| `npm run preview` | Sert le build de production localement |
| `npm run lint` | Lance oxlint |
| `npm run typecheck` | Verifie les types sans build |

## Structure

```
.
├── index.html            # Point d'entree HTML + meta SEO / Open Graph
├── vite.config.ts        # Plugins React + Tailwind
├── vercel.json           # Config de deploiement Vercel
├── public/               # Fichiers statiques copies tels quels
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── main.tsx          # Bootstrap React
    ├── App.tsx           # Compose les sections dans l'ordre
    ├── index.css         # Import Tailwind + design system (source unique)
    ├── lib/              # TOUS LES TEXTES
    │   ├── site.ts       # Identite, CTA, navigation
    │   ├── hero.ts       # Textes du Hero
    │   ├── problem.ts    # Textes de la section Probleme
    │   └── solution.ts   # Textes de la section Systeme
    ├── components/
    │   ├── ui/           # Briques reutilisables
    │   │   ├── Button.tsx
    │   │   ├── BrandLabel.tsx
    │   │   ├── Container.tsx
    │   │   ├── Eyebrow.tsx
    │   │   ├── Reveal.tsx    # Apparition au scroll (IntersectionObserver)
    │   │   ├── Section.tsx   # Gabarit de section
    │   │   └── Visual.tsx    # Visuel photo (ratio, rayon, filet du design system)
    │   └── sections/     # Sections de la landing page
    │       ├── Navbar.tsx
    │       ├── Hero.tsx
    │       ├── Problem.tsx
    │       └── Solution.tsx
    └── assets/           # Images et logos
```

## Regle commerciale : aucun prix affiche

DECISION STRUCTURANTE. La landing page ne vend pas un pack directement.

Parcours vise :

```
visiteur -> interet -> formulaire de qualification -> lead
         -> contact par Othmane -> reunion -> vente
```

Consequence : **les tarifs (2 500 / 3 500 / 5 000 DH) ne doivent jamais
apparaitre dans une section visible.** La future section « Offres » doit
presenter la maniere dont OTHMANE.GROWTH accompagne les entreprises, pas une
grille tarifaire. Si des prix sont necessaires en interne, les isoler dans un
fichier de donnees non importe dans une section.

## Points a finaliser

- [ ] Image Open Graph 1200x630 dans `public/og-image.png`
- [ ] Informations reelles de contact dans `src/lib/site.ts` (url, email)
- [ ] Phrase de reassurance du Hero, une fois validee (voir `src/lib/hero.ts`)

## Deploiement Vercel

Le projet est deja configure : `vercel.json` declare le build (`npm run build`)
et le dossier de sortie (`dist`). Vercel detecte Vite automatiquement.

```bash
npx vercel        # previsualisation
npx vercel --prod # mise en production
```

## Notes sur Tailwind v4

Tailwind v4 abandonne `tailwind.config.js` : la configuration se fait
directement en CSS dans `src/index.css`, via la directive `@theme`. Une
variable `--color-brand-500` genere a elle seule `bg-brand-500`,
`text-brand-500`, `border-brand-500`, etc.
