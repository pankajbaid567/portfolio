import { skillGroups, skillMatches } from '../data/skills'
import { projects } from '../data/projects'
import { SectionHead } from './ui'

const usedIn = (name) => projects.filter((p) => skillMatches(name, p.stack.join(' '))).length

export default function Skills({ onPick }) {
  return (
    <section id="skills" className="section" aria-labelledby="skills-h">
      <div className="wrap">
        <SectionHead index="06" label="Toolbox" id="skills-h" title={<>What I reach for, <em>and where I used it</em>.</>} intro="Click any technology to filter the projects above to the ones that use it. The number is how many projects list it in their stack." />
        <div className="skill-groups">
          {skillGroups.map((g, gi) => (
            <div key={g.label} className="skill-group" data-reveal style={{ '--delay': `${gi * 50}ms` }}>
              <h3>{g.label}</h3>
              <ul>
                {g.items.map((s) => {
                  const n = usedIn(s)
                  return (
                    <li key={s}>
                      {n > 0
                        ? <button type="button" className="skill on" onClick={() => onPick(s)}>{s} <b>{n}</b></button>
                        : <span className="skill">{s}</span>}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
