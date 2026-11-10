import { experience } from '../data/experience'
import { Chip, SectionHead } from './ui'

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="exp-h">
      <div className="wrap">
        <SectionHead index="03" label="Experience" id="exp-h" title={<>Founding engineer, <em>zero to one</em>.</>} intro="The first engineering hire at a startup is a different job from an internship: no codebase to inherit, no senior to ask, and everything you decide you also have to run." />
        {experience.map((e) => (
          <article key={e.company} className="exp" data-reveal>
            <div className="exp-side">
              <p className="exp-co">{e.company}</p>
              <p className="exp-dates">{e.dates}</p>
              <p className="exp-len">{e.length}</p>
              <p className="exp-place">{e.place}</p>
              <p className="exp-type">{e.type}</p>
            </div>
            <div className="exp-main">
              <h3 className="display exp-role">{e.role}</h3>
              <p className="exp-sum">{e.summary}</p>
              <dl className="impact">
                {e.impact.map((m) => <div key={m.v} className="result"><dt>{m.v}</dt><dd>{m.l}</dd></div>)}
              </dl>
              <h4 className="mini">What I owned</h4>
              <ul className="bullets">{e.owned.map((o) => <li key={o}>{o}</li>)}</ul>
              <div className="chips">{e.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
