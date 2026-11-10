import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { terminalScenes } from '../data/proof'
import { ArrowRight, Download, Github, Linkedin, Mail, Code } from './Icons'

function Terminal() {
  const [scene, setScene] = useState(0)
  const [shown, setShown] = useState([]) // lines already printed in this scene
  const [typed, setTyped] = useState('') // command currently being typed
  const reduce = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const sc = terminalScenes[scene]
    if (reduce.current) { setShown(sc.lines); setTyped(''); return undefined }
    let dead = false
    const timers = []
    const wait = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)))
    ;(async () => {
      setShown([]); setTyped('')
      await wait(500)
      for (const ln of sc.lines) {
        if (dead) return
        if (ln.t === 'cmd') {
          for (let i = 1; i <= ln.s.length; i++) { if (dead) return; setTyped(ln.s.slice(0, i)); await wait(16 + Math.random() * 20) }
          await wait(280)
          setShown((s) => [...s, ln]); setTyped('')
        } else {
          await wait(ln.t === 'ok' ? 520 : 380)
          setShown((s) => [...s, ln])
        }
      }
      await wait(3200)
      if (!dead) setScene((s) => (s + 1) % terminalScenes.length)
    })()
    return () => { dead = true; timers.forEach(clearTimeout) }
  }, [scene])

  return (
    <figure className="term" aria-label="Terminal showing excerpts of real test results" data-reveal style={{ '--delay': '160ms' }}>
      <div className="term-bar">
        <span className="tl"><i /><i /><i /></span>
        <span className="term-title">~/{terminalScenes[scene].title}</span>
        <span className="term-tabs" role="tablist" aria-label="Choose a project">
          {terminalScenes.map((s, i) => (
            <button key={s.title} role="tab" aria-selected={i === scene} className={i === scene ? 'on' : ''} onClick={() => setScene(i)} aria-label={s.title} />
          ))}
        </span>
      </div>
      <div className="term-body" aria-live="off">
        {shown.map((l, i) => (
          <div key={i} className={`tl-${l.t}`}>{l.t === 'cmd' && <span className="p">$ </span>}{l.t === 'ok' && <span className="chk">✔ </span>}{l.s}</div>
        ))}
        {typed && <div className="tl-cmd"><span className="p">$ </span>{typed}<span className="caret" /></div>}
        {!typed && shown.length > 0 && shown[shown.length - 1].t !== 'cmd' && <div className="tl-cmd"><span className="p">$ </span><span className="caret" /></div>}
      </div>
      <figcaption>Excerpts of real runs. Each project’s results page has the full output and its limits.</figcaption>
    </figure>
  )
}

export default function Hero({ onPalette }) {
  const [a, b, c, d] = profile.headline
  return (
    <section id="top" className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="status" data-reveal><i className="dot" /> {profile.status}</p>
          <h1 className="display hero-h1" data-reveal style={{ '--delay': '60ms' }}>
            {a} {b}<em>{c}</em>{d}
          </h1>
          <p className="hero-sub" data-reveal style={{ '--delay': '120ms' }}>{profile.intro}</p>
          <div className="hero-cta" data-reveal style={{ '--delay': '180ms' }}>
            <a className="btn btn-primary" href="#work">See the work <ArrowRight size={17} /></a>
            <a className="btn btn-ghost" href={profile.resume} download><Download size={17} /> Resume</a>
            <button type="button" className="btn btn-link" onClick={onPalette}>or press <kbd>⌘</kbd><kbd>K</kbd></button>
          </div>
          <ul className="hero-links" data-reveal style={{ '--delay': '240ms' }} aria-label="Profiles">
            <li><a href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={17} /> GitHub</a></li>
            <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={17} /> LinkedIn</a></li>
            <li><a href={profile.leetcode} target="_blank" rel="noopener noreferrer"><Code size={17} /> LeetCode</a></li>
            <li><a href={`mailto:${profile.email}`}><Mail size={17} /> Email</a></li>
          </ul>
        </div>
        <Terminal />
      </div>
    </section>
  )
}
