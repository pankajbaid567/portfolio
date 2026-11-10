import { education, profile } from '../data/profile'
import { SectionHead } from './ui'

export default function About() {
  return (
    <section id="about" className="section alt" aria-labelledby="about-h">
      <div className="wrap about">
        <figure className="portrait" data-reveal>
          <picture>
            <source srcSet="/media/images/pankaj-sm.webp 320w, /media/images/pankaj.webp 640w" sizes="(max-width: 800px) 70vw, 360px" type="image/webp" />
            <img src={profile.photo} width="640" height="800" loading="lazy" decoding="async" alt="Pankaj Baid smiling, in a blazer, in front of an in.culcate banner" />
          </picture>
          <figcaption><b>in.culcate</b> · where I built the backend, the CMS and the first mobile app</figcaption>
        </figure>
        <div className="about-copy">
          <SectionHead index="07" label="About" id="about-h" title={<>Hi, I’m Pankaj. I like the part of software that <em>keeps working</em> after the demo.</>} />
          <div className="prose" data-reveal>
            <p>I’m a second-year B.Tech student in Computer Science and AI at Newton School of Technology (Rishihood University), and I was a founding engineer at in.culcate for nineteen months before going deep on systems work.</p>
            <p>My projects start with a question: what must never be false? A ledger that doesn’t sum to zero, an acknowledged write that disappears after a crash, a payment captured twice. I write that down as an invariant, make the database or a test enforce it, and then attack it with random kills, reference models and injected bugs.</p>
            <p>I’m looking for an SDE internship where backend, data or infrastructure work is taken seriously, and where I can learn from people who have run these systems in production.</p>
          </div>
          <h3 className="mini" data-reveal>Education</h3>
          <ul className="edu" data-reveal>
            {education.map((e) => (
              <li key={e.degree}>
                <div><b>{e.degree}</b><span>{e.school}</span>{e.note && <em>{e.note}</em>}</div>
                <div className="edu-r"><span>{e.years}</span><b>{e.score}</b></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
