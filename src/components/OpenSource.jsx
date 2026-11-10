import { oss, ossTotals, team } from '../data/oss'
import { ArrowUpRight, Star } from './Icons'
import { SectionHead } from './ui'
import { useSpotlight } from '../hooks/useSpotlight'

const fmt = new Intl.NumberFormat('en-US')
const date = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const fmtN = (n) => new Intl.NumberFormat('en-US').format(n)
const mon = (iso) => new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
const span = (prs) => {
  const ds = prs.map((r) => r.merged).sort()
  return ds[0].slice(0, 7) === ds[ds.length - 1].slice(0, 7) ? mon(ds[0]) : `${mon(ds[0])} – ${mon(ds[ds.length - 1])}`
}

function Repo({ p, i }) {
  const spot = useSpotlight()
  return (
    <article className={`oss-card spot ${p.tag === 'Featured' ? 'big' : ''}`} onPointerMove={spot} data-reveal style={{ '--delay': `${(i % 3) * 60}ms` }}>
      <div className="oss-top">
        <span className="oss-tag">{p.tag}</span>
        <span className="oss-stars" title="GitHub stars"><Star size={14} /> {fmt.format(p.stars)}</span>
      </div>
      <h3 className="oss-name"><a href={`https://github.com/${p.repo}`} target="_blank" rel="noopener noreferrer">{p.name} <ArrowUpRight size={16} /></a></h3>
      <p className="oss-blurb">{p.blurb}</p>
      <ul className="oss-prs">
        {p.prs.map((r) => (
          <li key={r.number}>
            <a href={r.url} target="_blank" rel="noopener noreferrer">
              <span className="pr-n">#{r.number}</span>
              <span className="pr-w">{r.what}</span>
              <span className="pr-d"><b className="plus">+{fmt.format(r.add)}</b> <b className="minus">−{fmt.format(r.del)}</b></span>
            </a>
          </li>
        ))}
      </ul>
      <p className="oss-foot">
        {p.prs.length} merged · {span(p.prs)}
        <span>{fmtN(p.prs.reduce((a, r) => a + r.files, 0))} files</span>
      </p>
    </article>
  )
}

export default function OpenSource() {
  const feat = oss.filter((p) => p.tag === 'Featured')
  const hack = oss.filter((p) => p.tag !== 'Featured')
  const ledger = oss.flatMap((p) => p.prs.map((r) => ({ ...r, project: p.name }))).sort((a, b) => b.merged.localeCompare(a.merged))
  return (
    <section id="open-source" className="section alt" aria-labelledby="oss-h">
      <div className="wrap">
        <SectionHead
          index="02" label="Open source" id="oss-h"
          title={<>Fixes that shipped in code <em>other people</em> run.</>}
          intro={`${ossTotals.prs} merged pull requests across ${ossTotals.repos} projects, from a one-line-class regression fix in Hugging Face Transformers to row-level-security policies in AOSSIE’s Ell-ena. Pulled from the GitHub API, only PRs to other people’s repositories.`}
        />

        <div className="oss-grid">{feat.map((p, i) => <Repo key={p.repo} p={p} i={i} />)}</div>

        <h3 className="subhead" data-reveal>Hacktoberfest 2025 <span>{hack.reduce((a, p) => a + p.prs.length, 0)} PRs</span></h3>
        <div className="oss-grid three">{hack.map((p, i) => <Repo key={p.repo} p={p} i={i} />)}</div>

        <details className="ledger" data-reveal>
          <summary>Full pull-request ledger <span>{ossTotals.prs} merged · +{fmt.format(ossTotals.added)} / −{fmt.format(ossTotals.removed)} lines</span></summary>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Merged</th><th>Project</th><th>PR</th><th>Change</th><th className="num">Files</th><th className="num">Lines</th></tr></thead>
              <tbody>
                {ledger.map((r) => (
                  <tr key={r.url}>
                    <td>{date(r.merged)}</td>
                    <td>{r.project}</td>
                    <td><a href={r.url} target="_blank" rel="noopener noreferrer">#{r.number}</a></td>
                    <td>{r.what}</td>
                    <td className="num">{r.files}</td>
                    <td className="num"><b className="plus">+{fmt.format(r.add)}</b> <b className="minus">−{fmt.format(r.del)}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <p className="team-note" data-reveal>
          Also: <a href={team.url} target="_blank" rel="noopener noreferrer">{team.prs} merged PRs</a> as part of a team in <code>{team.repo}</code>: {team.what}
        </p>
      </div>
    </section>
  )
}
