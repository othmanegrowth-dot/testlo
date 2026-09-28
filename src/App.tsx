/**
 * Composition de la landing page.
 * L'ordre des sections est defini ici, dans un seul endroit.
 * Les sections non construites ne sont volontairement pas importees.
 *
 * « Mon approche » (anciennement « Mon approche » puis « Comment ca se
 * passe ») est une section unique : voir `components/sections/Solution.tsx`.
 */
import { Contact } from './components/sections/Contact.tsx'
import { Hero } from './components/sections/Hero.tsx'
import { Navbar } from './components/sections/Navbar.tsx'
import { Problem } from './components/sections/Problem.tsx'
import { Solution } from './components/sections/Solution.tsx'
import { Testimonials } from './components/sections/Testimonials.tsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Testimonials />
        <Contact />
      </main>
    </>
  )
}
