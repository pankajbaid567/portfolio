import { fieldNotes, principles } from '../data/proof'
import { SectionHead } from './ui'
import { useSpotlight } from '../hooks/useSpotlight'

function Note({ n, i }) {
  const spot = useSpotlight()
  return (
    <article className="note spot" onPointerMove={spot} data-reveal style={{ '--delay': `${i * 60}ms` }}>
      <p className="note-p">{n.project}</p>
      <h4>{n.title}</h4>
      <p>{n.body}</p>
    </article>
  )
}

export default function Method() {
  return (
    <section id="method" className="section alt" aria-labelledby="method-h">
      <div className="wrap">
        <SectionHead index="04" label="Method" id="method-h" title={<>How I work, and what <em>went wrong</em> along the way.</>} intro="Four habits show up in every project above. The field notes are real failures my own tests caught: the part of the process that usually stays out of a portfolio." />
        <ol className="principles">
          {principles.map((p, i) => (
            <li key={p.n} data-reveal style={{ '--delay': `${i * 60}ms` }}>
              <span className="pn">{p.n}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
        <h3 className="subhead" data-reveal>Field notes</h3>
        <div className="notes">{fieldNotes.map((n, i) => <Note key={n.title} n={n} i={i} />)}</div>
      </div>
    </section>
  )
}
