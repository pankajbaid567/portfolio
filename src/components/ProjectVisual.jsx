// Small bespoke illustrations for the case studies. Pure SVG, colours from CSS variables so they follow the theme.
// Figures drawn in them are real: 4.7 ms vs 0.25 ms (VITRAM), 46.3% vs 50.4% hit ratio (cache-cluster), the ledger example
// from Counterfoil's smoke test (10,000 = 9,800 + 200).

const W = 480
const H = 300

function Frame({ children, label }) {
  return (
    <svg className="viz" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  )
}

function OrderBook() {
  // cumulative depth: bids rise to the left, asks to the right; the book survives a kill with the same state hash
  const bids = [[240, 214], [212, 214], [212, 196], [186, 196], [186, 168], [158, 168], [158, 138], [128, 138], [128, 104], [96, 104], [96, 70], [64, 70], [64, 44]]
  const asks = [[240, 214], [270, 214], [270, 190], [300, 190], [300, 164], [334, 164], [334, 128], [366, 128], [366, 96], [402, 96], [402, 62], [436, 62], [436, 40]]
  const area = (pts, close) => `M${pts[0][0]},${pts[0][1]} ` + pts.slice(1).map((p) => `L${p[0]},${p[1]}`).join(' ') + ` L${close},250 L240,250 Z`
  const line = (pts) => 'M' + pts.map((p) => p.join(',')).join(' L')
  return (
    <Frame label="Order book depth chart. A crash and restart leaves the book's state hash unchanged.">
      <defs>
        <linearGradient id="gb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--ok)" stopOpacity=".38" /><stop offset="1" stopColor="var(--ok)" stopOpacity="0" /></linearGradient>
        <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".38" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient>
      </defs>
      {[60, 110, 160, 210].map((y) => <line key={y} x1="30" x2="450" y1={y} y2={y} className="v-grid" />)}
      <path d={area(bids, 64)} fill="url(#gb)" />
      <path d={area(asks, 436)} fill="url(#ga)" />
      <path d={line(bids)} className="v-stroke draw" stroke="var(--ok)" />
      <path d={line(asks)} className="v-stroke draw" stroke="var(--accent)" style={{ '--d': '0.3s' }} />
      <line x1="240" x2="240" y1="30" y2="252" className="v-dash" />
      <circle cx="240" cy="214" r="5" fill="var(--ink)" className="pulse-dot" />
      <g className="v-mono" fontSize="11" fill="var(--ink-3)">
        <text x="64" y="270" textAnchor="middle">99.80</text>
        <text x="240" y="270" textAnchor="middle">100.00</text>
        <text x="436" y="270" textAnchor="middle">100.20</text>
        <text x="30" y="26">bids</text>
        <text x="450" y="26" textAnchor="end">asks</text>
      </g>
      <g className="v-mono" fontSize="11.5">
        <text x="30" y="292" fill="var(--ink-3)">state_hash</text>
        <text x="116" y="292" fill="var(--ink)">b6158278</text>
        <text x="190" y="292" fill="var(--accent)">⟶ SIGKILL ⟶</text>
        <text x="296" y="292" fill="var(--ink)">b6158278</text>
        <text x="372" y="292" fill="var(--ok)">= same book</text>
      </g>
    </Frame>
  )
}

function Ledger() {
  const rows = [
    ['psp_clearing', '10,000', ''],
    ['merchant:shop1:payable', '', '9,800'],
    ['fees:revenue', '', '200'],
  ]
  return (
    <Frame label="A balanced double-entry journal entry: debits of 10,000 equal credits of 9,800 plus 200.">
      <g className="v-mono" fontSize="11" fill="var(--ink-3)" letterSpacing="1.5">
        <text x="40" y="52">ACCOUNT</text><text x="320" y="52" textAnchor="end">DEBIT</text><text x="440" y="52" textAnchor="end">CREDIT</text>
      </g>
      <line x1="30" x2="450" y1="64" y2="64" className="v-rule" />
      {rows.map((r, i) => (
        <g key={r[0]} className="row-in" style={{ '--d': `${0.15 * i}s` }} fontSize="15">
          <text x="40" y={104 + i * 46} className="v-mono" fill="var(--ink)">{r[0]}</text>
          <text x="320" y={104 + i * 46} textAnchor="end" className="v-mono" fill="var(--ok)">{r[1]}</text>
          <text x="440" y={104 + i * 46} textAnchor="end" className="v-mono" fill="var(--accent)">{r[2]}</text>
          <line x1="30" x2="450" y1={118 + i * 46} y2={118 + i * 46} className="v-grid" />
        </g>
      ))}
      <line x1="270" x2="270" y1="64" y2="236" className="v-grid" />
      <line x1="30" x2="450" y1="236" y2="236" className="v-rule" />
      <g className="v-mono" fontSize="15">
        <text x="40" y="266" fill="var(--ink-3)">Σ</text>
        <text x="320" y="266" textAnchor="end" fill="var(--ink)">10,000</text>
        <text x="440" y="266" textAnchor="end" fill="var(--ink)">10,000</text>
      </g>
      <g transform="translate(386 20)"><rect width="64" height="22" rx="11" fill="var(--ok-soft)" /><text x="32" y="15" textAnchor="middle" className="v-mono" fontSize="11" fill="var(--ok)">balanced</text></g>
    </Frame>
  )
}

function Lsm() {
  const level = (y, n, w, gap, x0, fill, delay) =>
    Array.from({ length: n }, (_, i) => <rect key={`${y}-${i}`} x={x0 + i * (w + gap)} y={y} width={w} height="26" rx="5" fill={fill} stroke="var(--ink-3)" strokeOpacity=".45" className="blk" style={{ '--d': `${delay + i * 0.05}s` }} />)
  return (
    <Frame label="LSM tree: a memtable flushes to level 0 and compaction merges files down through larger levels.">
      <g className="v-mono" fontSize="11" fill="var(--ink-3)">
        <text x="30" y="40">memtable</text><text x="30" y="106">L0</text><text x="30" y="160">L1</text><text x="30" y="214">L2</text>
      </g>
      <rect x="120" y="22" width="120" height="28" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" />
      {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={134 + i * 18} cy="36" r="3" fill="var(--accent)" className="blink" style={{ '--d': `${i * 0.2}s` }} />)}
      <rect x="296" y="22" width="154" height="28" rx="6" fill="none" stroke="var(--ink-3)" strokeOpacity=".45" strokeDasharray="4 4" />
      <text x="373" y="40" textAnchor="middle" className="v-mono" fontSize="11" fill="var(--ink-3)">WAL · crc | seq | k,v</text>
      {level(88, 3, 52, 10, 120, 'var(--surface-2)', 0)}
      {level(142, 5, 52, 8, 120, 'var(--surface-2)', 0.1)}
      {level(196, 7, 40, 8, 120, 'var(--surface-2)', 0.2)}
      <rect x="120" y="88" width="52" height="26" rx="5" fill="var(--accent-soft)" stroke="var(--accent)" className="sink" />
      <path d="M180 58v22M180 52l-4 6h8z" className="v-arrow" />
      <path d="M146 120v16M146 140l-3-5h6z" className="v-arrow" />
      <g className="v-mono" fontSize="11" fill="var(--ink-3)">
        <text x="196" y="72">flush</text><text x="158" y="132">compact</text>
        <text x="30" y="262">write amp 4.2 seq · 6.6 random</text>
      </g>
    </Frame>
  )
}

function Queue() {
  return (
    <Frame label="Two workers share a queue. Worker A is killed mid-job; its lease expires and worker B finishes the job with a higher fencing token.">
      <g className="v-mono" fontSize="11" fill="var(--ink-3)">
        <text x="30" y="56">worker A</text><text x="30" y="132">worker B</text><text x="30" y="208">lease</text>
      </g>
      {[110, 190, 270, 350, 430].map((x) => <line key={x} x1={x} x2={x} y1="30" y2="236" className="v-grid" />)}
      <rect x="110" y="40" width="70" height="26" rx="5" fill="var(--ok-soft)" stroke="var(--ok)" />
      <rect x="196" y="40" width="74" height="26" rx="5" fill="var(--accent-soft)" stroke="var(--accent)" />
      <g stroke="var(--bad)" strokeWidth="2.4" strokeLinecap="round" className="blink"><path d="M284 44l16 18M300 44l-16 18" /></g>
      <text x="306" y="58" className="v-mono" fontSize="11" fill="var(--bad)">SIGKILL</text>
      <rect x="110" y="116" width="70" height="26" rx="5" fill="var(--ok-soft)" stroke="var(--ok)" />
      <rect x="352" y="116" width="78" height="26" rx="5" fill="var(--ok-soft)" stroke="var(--ok)" className="sink" />
      <path d="M270 66C292 90 330 108 352 126" className="v-curve" />
      <g className="v-mono" fontSize="10.5" fill="var(--ink-2)">
        <text x="116" y="57">job 41 ✓</text><text x="202" y="57">job 42…</text>
        <text x="116" y="133">job 43 ✓</text><text x="358" y="133">job 42 ✓</text>
      </g>
      <rect x="196" y="194" width="146" height="22" rx="4" fill="var(--warn-soft)" stroke="var(--warn)" />
      <text x="203" y="209" className="v-mono" fontSize="10.5" fill="var(--warn)">token 7 · lease expires</text>
      <rect x="352" y="194" width="78" height="22" rx="4" fill="var(--ok-soft)" stroke="var(--ok)" />
      <text x="358" y="209" className="v-mono" fontSize="10.5" fill="var(--ok)">token 8</text>
      <text x="30" y="270" className="v-mono" fontSize="11" fill="var(--ink-3)">0 of 10,000 jobs lost on SIGKILL (reported)</text>
    </Frame>
  )
}

function Latency() {
  const full = 380
  const small = (0.25 / 4.7) * full
  return (
    <Frame label="A hot query went from 4.7 milliseconds to 0.25 milliseconds after profiling, caching and indexing.">
      <g className="v-mono" fontSize="11" fill="var(--ink-3)"><text x="40" y="52">before</text><text x="40" y="152">after</text><text x="40" y="262">hot query p50 · profiling, caching, indexing</text></g>
      <rect x="40" y="62" width={full} height="38" rx="7" fill="var(--bg-2)" stroke="var(--ink-3)" strokeOpacity=".45" />
      <rect x="40" y="62" width={full} height="38" rx="7" fill="var(--ink-3)" opacity=".5" className="grow" />
      <rect x="40" y="162" width={full} height="38" rx="7" fill="var(--bg-2)" stroke="var(--ink-3)" strokeOpacity=".45" />
      <rect x="40" y="162" width={small} height="38" rx="7" fill="var(--accent)" className="grow" style={{ '--d': '0.25s' }} />
      <text x="428" y="87" textAnchor="end" className="v-mono" fontSize="18" fill="var(--ink)">4.7 ms</text>
      <text x={40 + small + 12} y="187" className="v-mono" fontSize="18" fill="var(--accent)">0.25 ms</text>
      <g transform="translate(364 118)"><rect width="76" height="26" rx="13" fill="var(--ok-soft)" /><text x="38" y="17.5" textAnchor="middle" className="v-mono" fontSize="12.5" fill="var(--ok)">−94.7%</text></g>
    </Frame>
  )
}

function Chain() {
  const blocks = [
    { x: 24, seq: 1, ok: true, prev: '0000…', h: '9f2c…' },
    { x: 140, seq: 2, ok: true, prev: '9f2c…', h: '51a7…' },
    { x: 256, seq: 3, ok: false, prev: '51a7…', h: 'd0e9…' },
    { x: 372, seq: 4, ok: null, prev: 'd0e9…', h: '7b13…' },
  ]
  return (
    <Frame label="A hash-chained audit log: tampering with record 3 breaks its hash and every record after it.">
      {blocks.map((b, i) => (
        <g key={b.seq} opacity={b.ok === null ? 0.55 : 1}>
          {i > 0 && <path d={`M${b.x - 22} 142h22M${b.x - 6} 137l6 5-6 5`} className="v-arrow" />}
          <rect x={b.x} y="96" width="92" height="96" rx="9" fill="var(--surface-2)" stroke={b.ok === false ? 'var(--bad)' : 'var(--line-2)'} strokeWidth={b.ok === false ? 2 : 1} className={b.ok === false ? 'blink-border' : ''} />
          <g className="v-mono" fontSize="11">
            <text x={b.x + 10} y="118" fill="var(--ink-3)">seq {b.seq}</text>
            <text x={b.x + 10} y="144" fill="var(--ink-3)">prev</text><text x={b.x + 44} y="144" fill="var(--ink-2)">{b.prev}</text>
            <text x={b.x + 10} y="168" fill="var(--ink-3)">hash</text><text x={b.x + 44} y="168" fill={b.ok === false ? 'var(--bad)' : 'var(--ink)'}>{b.h}</text>
          </g>
        </g>
      ))}
      <g className="v-mono" fontSize="11.5">
        <text x="256" y="222" fill="var(--bad)">✕ hash mismatch at seq 3</text>
        <text x="30" y="64" fill="var(--ink-3)">sha256(prev + record)</text>
        <text x="30" y="270" fill="var(--ink-3)">edit · delete · reorder · truncate: all detected</text>
      </g>
    </Frame>
  )
}

function Match() {
  const jd = ['Backend intern', 'Go, PostgreSQL', 'low-latency matching', 'distributed systems', 'on-call mindset']
  const bank = [['Pitbook · 137 ns/cmd', true], ['Counterfoil · 0 violations', true], ['Hackathon winner', false]]
  return (
    <Frame label="Bodkin matches job-description keywords to proven bullets from a bank and never writes new text.">
      <g className="v-mono" fontSize="11" fill="var(--ink-3)"><text x="30" y="34">job description</text><text x="450" y="34" textAnchor="end">bullet bank</text></g>
      {jd.map((t, i) => (
        <g key={t}>
          <rect x="30" y={50 + i * 40} width="170" height="28" rx="6" fill={i === 1 || i === 2 ? 'var(--accent-soft)' : 'var(--surface-2)'} stroke={i === 1 || i === 2 ? 'var(--accent)' : 'var(--line-2)'} />
          <text x="42" y={69 + i * 40} className="v-mono" fontSize="12" fill="var(--ink)">{t}</text>
        </g>
      ))}
      {bank.map(([t, used], i) => (
        <g key={t} opacity={used ? 1 : 0.5}>
          <rect x="250" y={66 + i * 62} width="200" height="34" rx="7" fill={used ? 'var(--ok-soft)' : 'var(--surface-2)'} stroke={used ? 'var(--ok)' : 'var(--line-2)'} strokeDasharray={used ? '0' : '4 3'} />
          <text x="262" y={88 + i * 62} className="v-mono" fontSize="12" fill="var(--ink)">{t}</text>
        </g>
      ))}
      <path d="M200 124C226 124 224 83 250 83" className="v-curve draw" />
      <path d="M200 164C226 164 224 145 250 145" className="v-curve draw" style={{ '--d': '0.2s' }} />
      <text x="250" y="232" className="v-mono" fontSize="11" fill="var(--ink-3)">not relevant → left out</text>
      <text x="30" y="272" className="v-mono" fontSize="11" fill="var(--ink-3)">selects verbatim · never invents a number</text>
    </Frame>
  )
}

function Ring() {
  const cx = 150, cy = 150, r = 88
  const pt = (a, rr = r) => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]
  const nodes = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]
  const keys = Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2 + 0.2)
  return (
    <Frame label="Consistent-hash ring with three cache nodes, and hit ratio of W-TinyLFU compared with LRU at 0.1% capacity.">
      <circle cx={cx} cy={cy} r={r} className="v-ring" />
      {keys.map((a, i) => { const [x, y] = pt(a); return <circle key={i} cx={x} cy={y} r="3" fill="var(--ink-3)" opacity=".6" /> })}
      {nodes.map((a, i) => { const [x, y] = pt(a); return (
        <g key={i}><circle cx={x} cy={y} r="14" fill="var(--accent)" className="pulse-dot" style={{ '--d': `${i * 0.4}s` }} /><text x={x} y={y + 4} textAnchor="middle" className="v-mono" fontSize="11" fill="#fff">{'ABC'[i]}</text></g>
      ) })}
      <text x={cx} y={cy + 4} textAnchor="middle" className="v-mono" fontSize="11" fill="var(--ink-3)">16 shards/node</text>
      <g className="v-mono" fontSize="11" fill="var(--ink-3)"><text x="292" y="86">hit ratio · 0.1% capacity</text><text x="292" y="104" fontSize="10">(Twitter cluster24 trace)</text></g>
      <text x="292" y="132" className="v-mono" fontSize="11" fill="var(--ink-2)">LRU</text>
      <rect x="292" y="140" width="156" height="14" rx="4" fill="var(--bg-2)" stroke="var(--ink-3)" strokeOpacity=".45" /><rect x="292" y="140" width={156 * 0.463} height="14" rx="4" fill="var(--ink-3)" opacity=".6" className="grow" />
      <text x="448" y="132" textAnchor="end" className="v-mono" fontSize="11" fill="var(--ink)">46.3%</text>
      <text x="292" y="176" className="v-mono" fontSize="11" fill="var(--ink-2)">W-TinyLFU</text>
      <rect x="292" y="184" width="156" height="14" rx="4" fill="var(--bg-2)" stroke="var(--ink-3)" strokeOpacity=".45" /><rect x="292" y="184" width={156 * 0.504} height="14" rx="4" fill="var(--accent)" className="grow" style={{ '--d': '0.2s' }} />
      <text x="448" y="176" textAnchor="end" className="v-mono" fontSize="11" fill="var(--accent-ink)">50.4%</text>
    </Frame>
  )
}

const map = { orderbook: OrderBook, ledger: Ledger, lsm: Lsm, queue: Queue, latency: Latency, chain: Chain, match: Match, ring: Ring }

export default function ProjectVisual({ kind }) {
  const V = map[kind]
  return V ? <V /> : null
}
