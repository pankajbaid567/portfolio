import { useDeferredValue, useMemo, useState } from 'react'
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
      {p.also?.length > 0 && <span className="also"> · {p.also.map((a) => catById[a].label.split(' ')[0]).join(', ')}</span>}
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

function Card({ p, i }) {
  const spot = useSpotlight()
  return (
    <article id={`proj-${p.id}`} className="card spot" onPointerMove={spot} data-reveal style={{ '--delay': `${(i % 3) * 60}ms` }}>
      <div className="case-meta"><CatLabel p={p} /><StatusPill status={p.status} /></div>
      <h3 className="card-title">{p.name}</h3>
      <p className="card-tag">{p.tagline}</p>
      {p.note && <p className="caveat"><b>Note.</b> {p.note}</p>}
      <div className="chips">{p.stack.slice(0, 5).map((s) => <Chip key={s}>{s}</Chip>)}</div>
      <div className="card-foot">
        <span className="when">{p.when}</span>
        <span className="card-links">
          {p.links.live && <a href={p.links.live} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} live demo`}>Live <ArrowUpRight size={14} /></a>}
          {p.links.repo && <a href={p.links.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} source code`}><Github size={14} /> Code</a>}
        </span>
      </div>
    </article>
  )
}

const matches = (p, cat, q) => {
  if (cat !== 'all' && p.category !== cat && !(p.also || []).includes(cat)) return false
  if (!q) return true
  if (skillAliases[q.trim()]) return skillMatches(q.trim(), p.stack.join(' ')) // a skill chip passes its exact name
  const hay = `${p.name} ${p.tagline} ${p.stack.join(' ')} ${p.when} ${catById[p.category].label}`.toLowerCase()
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w))
}

export default function Work({ query, setQuery }) {
  const [cat, setCat] = useState('all')
  const [all, setAll] = useState(false)
  const dq = useDeferredValue(query)
  const list = useMemo(() => projects.filter((p) => matches(p, cat, dq)), [cat, dq])
  const featured = list.filter((p) => p.featured)
  const rest = list.filter((p) => !p.featured)
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, projects.filter((p) => p.category === c.id || (p.also || []).includes(c.id)).length])), [])
  const filtering = cat !== 'all' || dq
  const visibleRest = all || filtering ? rest : rest.slice(0, 9)

  return (
    <section id="work" className="section" aria-labelledby="work-h">
      <div className="wrap">
        <SectionHead
          index="01" label="Work" id="work-h"
          title={<>Systems I <em>trust</em> because I tried to break them.</>}
          intro={`${projects.length} projects across seven areas. The eight case studies come first, each with its measured results, its limits, and the command that reproduces them. The rest are below.`}
        />

        <div className="filters" role="group" aria-label="Filter projects">
          <div className="filter-chips">
            <button type="button" className={`fchip ${cat === 'all' ? 'on' : ''}`} aria-pressed={cat === 'all'} onClick={() => setCat('all')}>All <b>{projects.length}</b></button>
            {categories.map((c) => (
              <button key={c.id} type="button" className={`fchip ${cat === c.id ? 'on' : ''}`} aria-pressed={cat === c.id} style={{ '--h': c.hue }} onClick={() => setCat(c.id)}>
                <i /> {c.label} <b>{counts[c.id]}</b>
              </button>
            ))}
          </div>
          <label className="search">
            <Search size={16} />
            <input type="search" placeholder="Search projects or tech (Go, Redis, RAG…)" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search projects" />
          </label>
        </div>

        {list.length === 0 && <p className="empty">No project matches. <button type="button" className="btn-link" onClick={() => { setCat('all'); setQuery('') }}>Clear filters</button></p>}

        {featured.length > 0 && (
          <div className="cases">
            {featured.map((p, i) => <Featured key={p.id} p={p} flip={i % 2 === 1} />)}
          </div>
        )}

        {rest.length > 0 && (
          <>
            <h3 className="subhead" data-reveal>{filtering ? 'More matches' : 'Everything else I’ve built'} <span>{rest.length}</span></h3>
            <div className="grid">
              {visibleRest.map((p, i) => <Card key={p.id} p={p} i={i} />)}
            </div>
            {!filtering && !all && rest.length > 9 && (
              <div className="more"><button type="button" className="btn btn-ghost" onClick={() => setAll(true)}>Show all {rest.length} projects</button></div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
