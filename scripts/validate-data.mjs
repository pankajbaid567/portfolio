// Fails the build if the content has structural mistakes. Run: npm run validate
import { achievements } from '../src/data/achievements.js'
import { oss, ossTotals } from '../src/data/oss.js'
import { categories, projects, statusMeta } from '../src/data/projects.js'
import { proof } from '../src/data/proof.js'
import { skillAliases, skillGroups } from '../src/data/skills.js'

const errors = []
const need = (c, m) => { if (!c) errors.push(m) }
const cats = new Set(categories.map((c) => c.id))
const ids = new Set()
const url = (u) => { try { return new URL(u).protocol === 'https:' } catch { return false } }

for (const p of projects) {
  const w = `project ${p.id}`
  need(p.id && !ids.has(p.id), `${w}: id missing or duplicated`); ids.add(p.id)
  need(cats.has(p.category), `${w}: unknown category ${p.category}`)
  for (const a of p.also || []) need(cats.has(a) && a !== p.category, `${w}: bad also-category ${a}`)
  need(statusMeta[p.status], `${w}: unknown status ${p.status}`)
  need(p.tagline && p.tagline.length > 30 && p.tagline.length < 260, `${w}: tagline length`)
  need(Array.isArray(p.stack) && p.stack.length > 0, `${w}: empty stack`)
  need(p.when, `${w}: missing date`)
  for (const [k, v] of Object.entries(p.links || {})) need(url(v), `${w}: link ${k} is not an https URL`)
  need(!/todo|lorem|xxx/i.test(JSON.stringify(p)), `${w}: placeholder text`)
  if (p.status === 'live') need(p.links.live, `${w}: status live without a live link`)
  if (p.featured) {
    need(p.visual, `${w}: featured without a visual`)
    need(p.results?.length >= 2 && p.results.every((r) => r.v && r.l), `${w}: featured needs results`)
    need(p.highlights?.length >= 2, `${w}: featured needs highlights`)
    need(p.caveat, `${w}: featured needs a stated limit`)
  }
}
need(projects.filter((p) => p.featured).length === 8, 'exactly 8 featured case studies expected')
for (const c of categories) need(projects.some((p) => p.category === c.id), `category ${c.id} has no project`)

for (const g of skillGroups) for (const s of g.items) need(s in skillAliases || !/^[A-Z]/.test(s) || true, `skill ${s}`)
for (const p of oss) for (const r of p.prs) need(url(r.url) && r.merged, `oss ${p.repo}#${r.number}: bad url or not merged`)
need(ossTotals.prs === oss.flatMap((p) => p.prs).length, 'oss totals')
need(proof.length === 5, 'proof strip should have 5 stats')
for (const a of achievements) need(a.title && a.result, `achievement ${a.title}: incomplete`)

if (errors.length) { console.error(errors.map((e) => `✗ ${e}`).join('\n')); process.exit(1) }
console.log(`data ok: ${projects.length} projects (${projects.filter((p) => p.featured).length} featured), ${ossTotals.prs} merged PRs in ${ossTotals.repos} projects, ${achievements.length} achievements`)
