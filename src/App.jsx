import { useCallback, useEffect, useState } from 'react'
import About from './components/About'
import Achievements from './components/Achievements'
import CommandPalette from './components/CommandPalette'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Method from './components/Method'
import OpenSource from './components/OpenSource'
import ProofStrip from './components/ProofStrip'
import Skills from './components/Skills'
import Work from './components/Work'
import { useReveal } from './hooks/useReveal'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { toggle } = useTheme()
  const [palette, setPalette] = useState(false)
  const [query, setQuery] = useState('')
  useReveal([query])

  useEffect(() => {
    document.documentElement.classList.add('js')
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const pickSkill = useCallback((name) => {
    setQuery(name)
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <a className="skip" href="#work">Skip to content</a>
      <div className="progress" aria-hidden="true" />
      <Header onPalette={() => setPalette(true)} onToggleTheme={toggle} />
      <main>
        <Hero onPalette={() => setPalette(true)} />
        <ProofStrip />
        <Work query={query} setQuery={setQuery} />
        <OpenSource />
        <Experience />
        <Method />
        <Achievements />
        <Skills onPick={pickSkill} />
        <About />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={palette} onClose={() => setPalette(false)} onTheme={toggle} />
    </>
  )
}
