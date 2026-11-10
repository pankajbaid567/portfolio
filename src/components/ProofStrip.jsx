import { proof } from '../data/proof'
import { useCountUp } from '../hooks/useCountUp'
import { useSpotlight } from '../hooks/useSpotlight'

function Stat({ s, i }) {
  const [ref, val] = useCountUp(s.v)
  const spot = useSpotlight()
  const text = s.v >= 1000 ? val.toLocaleString('en-US') : String(val)
  return (
    <a href={s.href} className="stat spot" onPointerMove={spot} data-reveal style={{ '--delay': `${i * 60}ms` }}>
      <span ref={ref} className="stat-v">{s.prefix}{text}{s.suffix.replace('★', '')}{s.suffix.includes('★') && <span className="star">★</span>}</span>
      <span className="stat-l">{s.label}</span>
      <span className="stat-s">{s.sub}</span>
    </a>
  )
}

export default function ProofStrip() {
  return (
    <section className="proof" aria-label="Proof in numbers">
      <div className="wrap">
        <div className="stats">{proof.map((s, i) => <Stat key={s.label} s={s} i={i} />)}</div>
        <p className="fine" data-reveal>Measured on one Apple M3 laptop, process kills only. Several mutants first survived (equivalent mutants or real test holes) and were fixed; the write-ups keep that history.</p>
      </div>
    </section>
  )
}
