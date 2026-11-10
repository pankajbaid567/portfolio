import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { categories, projects } from '../data/projects'
import { skillAliases, skillMatches } from '../data/skills'
import { ArrowUpRight, Github, Search } from './Icons'
import ProjectVisual from './ProjectVisual'
import { Chip, Command, SectionHead, StatusPill } from './ui'
import { useSpotlight } from '../hooks/useSpotlight'

const catById = Object.fromEntries(categories.map((c) => [c.id, c]))

function Links({ links }) {
  return (
    <div className="links">
      {links.live && <a className="btn btn-primary btn-sm" href={links.live} target="_blank" rel="noopener noreferrer">Live demo <ArrowUpRight size={15} /></a>}
      {links.repo && <a className="btn btn-ghost btn-sm" href={links.repo} target="_blank" rel="noopener noreferrer"><Github size={15} /> Code</a>}
      {links.docs && <a className="btn btn-ghost btn-sm" href={links.docs} target="_blank" rel="noopener noreferrer">{links.docs.includes('hyperstack') ? 'Certificate' : 'Results & docs'} <ArrowUpRight size={15} /></a>}
    </div>
  )
}

function CatLabel({ p }) {
  const c = catById[p.category]
  return (
    <span className="catlabel" style={{ '--h': c.hue }}>
      <i /> {c.label}
      {p.also?.length > 0 && <span className="also"> · {p.also.map((a) => catById[a].label.split(' ')[0].replace(/,$/, '')).join(', ')}</span>}
    </span>
  )
}

function Featured({ p, flip }) {
  const spot = useSpotlight()
  return (
    <article id={`proj-${p.id}`} className={`case ${flip ? 'flip' : ''}`} data-reveal>
      <div className="case-side">
        <div className="case-visual spot" onPointerMove={spot}>
          <ProjectVisual kind={p.visual} />
        </div>
        <div className="glance">
          <Links links={p.links} />
          <div className="chips">{p.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
          {p.reproduce && <div className="repro"><span>Reproduce</span><Command text={p.reproduce} /></div>}
        </div>
      </div>
      <div className="case-body">
        <div className="case-meta"><CatLabel p={p} /><StatusPill status={p.status} /><span className="when">{p.when}</span></div>
        <h3 className="display case-title">{p.name}</h3>
        <p className="case-tag">{p.tagline}</p>
        <dl className="results">
          {p.results.map((r) => (
            <div key={r.v} className="result"><dt>{r.v}</dt><dd>{r.l}</dd></div>
          ))}
        </dl>
        <ul className="bullets">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        {p.story && (
          <details className="story">
            <summary>The bug, and what it taught me</summary>
            <p>{p.story}</p>
          </details>
        )}
        {p.caveat && <p className="caveat"><b>Limits.</b> {p.caveat}</p>}
      </div>
    </article>
  )
}

function Card({ p, i, onCase }) {
  const spot = useSpotlight()
  return (
    <article id={`proj-${p.id}`} className="card spot" onPointerMove={spot} data-reveal style={{ '--delay': `${(i % 3) * 60}ms` }}>
      <div className="case-meta"><CatLabel p={p} /><StatusPill status={p.status} /></div>
      <h3 className="card-title">{p.name}{p.featured && <span className="flag" title="Flagship project">★ Flagship</span>}</h3>
      <p className="card-tag">{p.tagline}</p>
      {p.featured && (
        <p className="card-win"><b>{p.results[0].v}</b><span>{p.results[0].l}</span></p>
      )}
      {p.note && <p className="caveat"><b>Note.</b> {p.note}</p>}
      <div className="chips">{p.stack.slice(0, 5).map((s) => <Chip key={s}>{s}</Chip>)}</div>
      <div className="card-foot">
        <span className="when">{p.when}</span>
        <span className="card-links">
          {p.featured && <button type="button" onClick={() => onCase(p.id)}>Case study <ArrowUpRight size={14} /></button>}
          {p.links.live && <a href={p.links.live} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} live demo`}>Live <ArrowUpRight size={14} /></a>}
          {p.links.repo && <a href={p.links.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} source code`}><Github size={14} /> Code</a>}
        </span>
      </div>
    </article>
  )
}

const matches = (p, scope, q) => {
  if (scope === 'flagships' && !p.featured) return false
  if (scope !== 'flagships' && scope !== 'all' && p.category !== scope && !(p.also || []).includes(scope)) return false
  if (!q) return true
  if (skillAliases[q.trim()]) return skillMatches(q.trim(), p.stack.join(' ')) // a skill chip passes its exact name
  const hay = `${p.name} ${p.tagline} ${p.stack.join(' ')} ${p.when} ${catById[p.category].label}`.toLowerCase()
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w))
}

const PAGE = 12
const flagshipCount = projects.filter((p) => p.featured).length

export default function Work({ query, setQuery }) {
  const [view, setView] = useState('flagships') // 'flagships' | 'all' | a category id
  const [shown, setShown] = useState(PAGE)
  const dq = useDeferredValue(query)
  const searching = dq.trim().length > 0
  const scope = searching ? 'all' : view // a search always looks through every project
  const list = useMemo(() => projects.filter((p) => matches(p, scope, dq)), [scope, dq])
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, projects.filter((p) => p.category === c.id || (p.also || []).includes(c.id)).length])), [])

  const pick = (v) => { setView(v); setShown(PAGE); setQuery('') }
  const openCase = (id) => {
    pick('flagships')
    setTimeout(() => document.getElementById(`proj-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 140)
  }
  useEffect(() => {
    const h = (e) => openCase(e.detail)
    window.addEventListener('pb:case', h)
    return () => window.removeEventListener('pb:case', h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFlag = scope === 'flagships'
  const visible = isFlag ? list : list.slice(0, shown)
  const label = searching ? `Results for “${dq.trim()}”` : view === 'all' ? 'All projects, ranked by impact' : catById[view] ? `${catById[view].label}, ranked by impact` : ''

  return (
    <section id="work" className="section" aria-labelledby="work-h">
      <div className="wrap">
        <SectionHead
          index="01" label="Work" id="work-h"
          title={<>Systems I <em>trust</em> because I tried to break them.</>}
          intro={`Start with the ${flagshipCount} flagships: full case studies with measured results, stated limits and a reproduce command. The other ${projects.length - flagshipCount} projects are one click away, ranked by impact.`}
        />

        <div className="filters">
          <div className="filter-top">
            <div className="views" role="group" aria-label="Project view">
              <button type="button" className={`view ${!searching && view === 'flagships' ? 'on' : ''}`} aria-pressed={!searching && view === 'flagships'} onClick={() => pick('flagships')}>★ Flagships <b>{flagshipCount}</b></button>
              <button type="button" className={`view ${!searching && view === 'all' ? 'on' : ''}`} aria-pressed={!searching && view === 'all'} onClick={() => pick('all')}>All projects <b>{projects.length}</b></button>
            </div>
            <label className="search">
              <Search size={16} />
              <input type="search" placeholder="Search all projects or tech (Go, Redis, RAG…)" value={query} onChange={(e) => { setQuery(e.target.value); setShown(PAGE) }} aria-label="Search projects" />
            </label>
          </div>
          <div className="filter-chips" role="group" aria-label="Browse by area">
            <span className="chips-label">Browse by area</span>
            {categories.map((c) => (
              <button key={c.id} type="button" className={`fchip ${!searching && view === c.id ? 'on' : ''}`} aria-pressed={!searching && view === c.id} style={{ '--h': c.hue }} onClick={() => pick(c.id)}>
                <i /> {c.label} <b>{counts[c.id]}</b>
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 && <p className="empty">No project matches. <button type="button" className="btn-link" onClick={() => pick('flagships')}>Back to flagships</button></p>}

        {isFlag && list.length > 0 && (
          <>
            <div className="cases">
              {list.map((p, i) => <Featured key={p.id} p={p} flip={i % 2 === 1} />)}
            </div>
            <div className="more-work" data-reveal>
              <p><b>{projects.length - flagshipCount} more projects</b> across AI agents, fintech, web, mobile and ML, ranked by impact.</p>
              <button type="button" className="btn btn-ghost" onClick={() => pick('all')}>Browse all {projects.length} projects</button>
            </div>
          </>
        )}

        {!isFlag && list.length > 0 && (
          <>
            <h3 className="subhead" key={label}>{label} <span>{list.length}</span></h3>
            <div className="grid">
              {visible.map((p, i) => <Card key={p.id} p={p} i={i} onCase={openCase} />)}
            </div>
            {list.length > visible.length && (
              <div className="more"><button type="button" className="btn btn-ghost" onClick={() => setShown((n) => n + PAGE)}>Show {Math.min(PAGE, list.length - visible.length)} more ({list.length - visible.length} left)</button></div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
