import { achievements } from '../data/achievements'
import { ArrowUpRight } from './Icons'
import { SectionHead } from './ui'
import { useSpotlight } from '../hooks/useSpotlight'

function Tile({ a, i, big }) {
  const spot = useSpotlight()
  return (
    <article className={`ach spot ${big ? 'big' : ''}`} onPointerMove={spot} data-reveal style={{ '--delay': `${(i % 3) * 60}ms` }}>
      <p className="ach-result">{a.result}</p>
      <h3>{a.title}</h3>
      <p className="ach-detail">{a.detail}</p>
      <div className="ach-foot">
        <span>{a.year}</span>
        {a.link && <a href={a.link.href} target="_blank" rel="noopener noreferrer">{a.link.label} <ArrowUpRight size={13} /></a>}
      </div>
    </article>
  )
}

export default function Achievements() {
  const podium = achievements.filter((a) => a.tier === 'podium')
  const cp = achievements.filter((a) => a.tier === 'cp')
  const part = achievements.filter((a) => a.tier === 'participant')
  return (
    <section id="achievements" className="section" aria-labelledby="ach-h">
      <div className="wrap">
        <SectionHead index="05" label="Achievements" id="ach-h" title={<>Competitions, <em>ranked</em> and unranked.</>} intro="Results I can point to, then the events I entered and learned from. Everything from the resume is here, plus the older hackathon record." />
        <div className="ach-grid">{podium.map((a, i) => <Tile key={a.title} a={a} i={i} big={i < 2} />)}</div>
        <h3 className="subhead" data-reveal>Competitive programming</h3>
        <div className="ach-grid two">{cp.map((a, i) => <Tile key={a.title} a={a} i={i} />)}</div>
        <h3 className="subhead" data-reveal>Also entered</h3>
        <ul className="also-list" data-reveal>
          {part.map((a) => (
            <li key={a.title}><b>{a.title}</b><span>{a.result === 'Participation' ? a.detail : `${a.result} · ${a.detail}`}</span><em>{a.year}</em></li>
          ))}
        </ul>
      </div>
    </section>
  )
}
