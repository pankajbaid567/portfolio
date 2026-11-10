import { useState } from 'react'
import { profile } from '../data/profile'
import { ArrowUpRight, Check, Copy, Download, Github, Linkedin, Mail, Code } from './Icons'

export default function Contact() {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email) } catch { /* clipboard may be unavailable */ }
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-h">
      <div className="wrap">
        <p className="eyebrow" data-reveal><span>08</span> Contact</p>
        <h2 id="contact-h" className="display contact-h" data-reveal>Let’s build something that <em>survives</em> contact with production.</h2>
        <p className="lede center" data-reveal>I’m looking for SDE internships in 2027. The fastest way to reach me is email; I reply within a day.</p>
        <div className="contact-cta" data-reveal>
          <a className="btn btn-primary btn-lg" href={`mailto:${profile.email}`}><Mail size={19} /> {profile.email}</a>
          <button type="button" className="btn btn-ghost btn-lg" onClick={copy}>{done ? <><Check size={18} /> Copied</> : <><Copy size={18} /> Copy email</>}</button>
        </div>
        <ul className="contact-links" data-reveal>
          <li><a href={profile.github} target="_blank" rel="noopener noreferrer"><Github /> GitHub <ArrowUpRight size={14} /></a></li>
          <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin /> LinkedIn <ArrowUpRight size={14} /></a></li>
          <li><a href={profile.leetcode} target="_blank" rel="noopener noreferrer"><Code /> LeetCode <ArrowUpRight size={14} /></a></li>
          <li><a href={profile.resume} download><Download /> Resume (PDF)</a></li>
        </ul>
      </div>
    </section>
  )
}
