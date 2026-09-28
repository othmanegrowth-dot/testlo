import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { appliquerMouvement } from './lib/motion.ts'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Element racine #root introuvable dans index.html')
}

/*
 * Ecrit `<html data-motion="on|off">` AVANT `render()`. A cet endroit le
 * navigateur n'a encore rien peint : le premier rendu tient donc deja compte
 * de la preference, et un visiteur revenu avec « Motion » sur OFF ne voit
 * aucune demarrage anime.
 */
appliquerMouvement()

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
