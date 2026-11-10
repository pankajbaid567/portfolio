import { useState } from 'react'
import { NAV } from '../data/nav'
import { profile } from '../data/profile'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { Close, Command, Download, Menu, Moon, Sun } from './Icons'

const IDS = ['top', ...NAV.map((n) => n.id)]

export default function Header({ onPalette, onToggleTheme }) {
  const active = useScrollSpy(IDS)
  const [open, setOpen] = useState(false)
  return (
    <header className="header">
      <div className="wrap header-in">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">{profile.short}</span>
          <span className="brand-name">Pankaj Baid</span>
        </a>
        <nav aria-label="Sections" className={`nav ${open ? 'open' : ''}`}>
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'active' : ''} aria-current={active === n.id ? 'true' : undefined} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
          <a className="btn btn-ghost nav-resume" href={profile.resume} download onClick={() => setOpen(false)}><Download size={16} /> Resume</a>
        </nav>
        <div className="header-tools">
          <button type="button" className="icon-btn kbd-btn" onClick={onPalette} aria-label="Open command palette (Ctrl or Command K)">
            <Command size={16} /><kbd>K</kbd>
          </button>
          <button type="button" className="icon-btn" onClick={onToggleTheme} aria-label="Toggle light and dark theme">
            <Sun className="i-sun" size={17} /><Moon className="i-moon" size={17} />
          </button>
          <button type="button" className="icon-btn menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <Close size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
    </header>
  )
}
