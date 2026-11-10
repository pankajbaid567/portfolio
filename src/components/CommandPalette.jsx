import { useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { NAV } from '../data/nav'
import { Search } from './Icons'

const score = (q, s) => {
  if (!q) return 1
  s = s.toLowerCase(); q = q.toLowerCase()
  if (s.includes(q)) return 100 - s.indexOf(q)
  let i = 0
  for (const ch of s) if (ch === q[i]) i++
  return i === q.length ? 10 : 0
}

export default function CommandPalette({ open, onClose, onTheme }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef(null)

  const items = useMemo(() => {
    const go = (id) => () => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
    const open_ = (href) => () => window.open(href, '_blank', 'noopener')
    return [
      ...NAV.map((n) => ({ group: 'Go to', label: n.label, run: go(n.id) })),
      ...projects.filter((p) => p.featured).map((p) => ({ group: 'Case studies', label: p.name, hint: p.tagline.slice(0, 60), run: go(`proj-${p.id}`) })),
      ...projects.filter((p) => !p.featured && p.links.live).map((p) => ({ group: 'Live demos', label: p.name, hint: 'opens the demo', run: open_(p.links.live) })),
      { group: 'Links', label: 'GitHub', run: open_(profile.github) },
      { group: 'Links', label: 'LinkedIn', run: open_(profile.linkedin) },
      { group: 'Links', label: 'LeetCode', run: open_(profile.leetcode) },
      { group: 'Links', label: 'Email me', run: () => { window.location.href = `mailto:${profile.email}` } },
      { group: 'Actions', label: 'Download resume (PDF)', run: () => { window.location.href = profile.resume } },
      { group: 'Actions', label: 'Toggle light / dark theme', run: onTheme },
    ]
  }, [onTheme])

  const results = useMemo(() => items.map((it) => ({ it, s: score(q, `${it.label} ${it.group}`) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.it).slice(0, 12), [items, q])

  useEffect(() => { if (open) { setQ(''); setSel(0); setTimeout(() => input.current?.focus(), 20) } }, [open])
  useEffect(() => { setSel(0) }, [q])

  if (!open) return null
  const run = (it) => { onClose(); setTimeout(it.run, 60) }
  const onKey = (e) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter' && results[sel]) { e.preventDefault(); run(results[sel]) }
  }
  return (
    <div className="palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={onKey}>
        <label className="palette-in"><Search size={18} /><input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a section, project or link…" aria-label="Search commands" role="combobox" aria-expanded="true" aria-controls="palette-list" /></label>
        <ul id="palette-list" role="listbox">
          {results.length === 0 && <li className="palette-empty">Nothing found</li>}
          {results.map((it, i) => (
            <li key={`${it.group}-${it.label}`} role="option" aria-selected={i === sel} className={i === sel ? 'on' : ''} onMouseEnter={() => setSel(i)} onClick={() => run(it)}>
              <span className="pg">{it.group}</span><span className="pl">{it.label}</span>{it.hint && <span className="ph">{it.hint}</span>}
            </li>
          ))}
        </ul>
        <p className="palette-foot"><kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> open <kbd>esc</kbd> close</p>
      </div>
    </div>
  )
}
