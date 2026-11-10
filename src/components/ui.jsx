import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Copy } from './Icons'
import { statusMeta } from '../data/projects'

export function SectionHead({ index, label, title, intro, id }) {
  return (
    <header className="section-head" data-reveal>
      <p className="eyebrow"><span>{index}</span> {label}</p>
      <h2 id={id} className="display">{title}</h2>
      {intro && <p className="lede">{intro}</p>}
    </header>
  )
}

export function StatusPill({ status }) {
  const m = statusMeta[status]
  if (!m) return null
  return <span className={`pill pill-${m.tone}`}>{m.tone === 'ok' && <i className="dot" />}{m.label}</span>
}

export function Chip({ children, ...p }) {
  return <span className="chip" {...p}>{children}</span>
}

/** Copy-to-clipboard command line used for the "reproduce" commands. */
export function Command({ text }) {
  const [done, setDone] = useState(false)
  const t = useRef()
  useEffect(() => () => clearTimeout(t.current), [])
  const copy = useCallback(async () => {
    try { await navigator.clipboard.writeText(text) } catch { /* clipboard may be unavailable */ }
    setDone(true)
    clearTimeout(t.current)
    t.current = setTimeout(() => setDone(false), 1600)
  }, [text])
  return (
    <button type="button" className="cmd" onClick={copy} aria-label={`Copy command: ${text}`}>
      <span className="cmd-prompt">$</span>
      <code>{text}</code>
      <span className="cmd-copy" aria-hidden="true">{done ? <Check size={15} /> : <Copy size={15} />}</span>
      <span className="sr-only" role="status">{done ? 'Copied' : ''}</span>
    </button>
  )
}
