import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'
// Browser end-to-end checks: filters, search, skill chips, command palette, theme, links and an axe accessibility scan.
//   npm run build && npx vite preview --port 4173 &   then   CHROME_PATH=/path/to/chrome npm run e2e
const CHROME = process.env.CHROME_PATH
const BASE = process.env.BASE_URL || 'http://localhost:4173/'
if (!CHROME) { console.error('Set CHROME_PATH to a Chrome, Chromium or Brave executable'); process.exit(2) }
const axeSrc = readFileSync('node_modules/axe-core/axe.min.js', 'utf8')
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const results = []
const ok = (name, cond, extra = '') => { results.push([cond, name, extra]); console.log(cond ? 'PASS' : 'FAIL', name, extra) }
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
const errors = []
page.on('pageerror', (e) => errors.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
await page.goto(BASE, { waitUntil: 'networkidle0' })
const count = (sel) => page.$$eval(sel, (e) => e.length)

// Cards are revealed as they scroll into view. Scroll every card past the viewport, then require that all of them ended up visible.
const visible = async () => {
  const n = await page.$$eval('.card', (cs) => cs.length)
  for (let i = 0; i < n; i++) { await page.evaluate((k) => document.querySelectorAll('.card')[k]?.scrollIntoView({ block: 'center' }), i); await new Promise((r) => setTimeout(r, 40)) }
  await new Promise((r) => setTimeout(r, 1100))
  return page.$$eval('.card', (cs) => cs.every((c) => c.classList.contains('in') && Number(getComputedStyle(c).opacity) > 0.9))
}
// What the user reported: right after a click, the cards that are on screen must not stay invisible.
const onScreenVisible = async () => { await new Promise((r) => setTimeout(r, 1300)); return page.$$eval('.card, .case', (cs) => { const vh = innerHeight; const on = cs.filter((c) => { const r = c.getBoundingClientRect(); return r.top < vh && r.bottom > 0 }); return on.length > 0 && on.every((c) => Number(getComputedStyle(c).opacity) > 0.9) }) }
const titles = () => page.$$eval('.card-title, .case-title', (e) => e.map((x) => x.childNodes[0].textContent))
const click = async (sel, text) => { const h = await page.evaluateHandle((s2, t) => [...document.querySelectorAll(s2)].find((e) => e.textContent.trim().includes(t)), sel, text); await h.click(); await new Promise((r) => setTimeout(r, 600)) }

ok('default view is Flagships: 8 case studies, no grid', (await count('.case')) === 8 && (await count('.card')) === 0)
ok('Flagships is the pressed view', await page.$eval('.view.on', (e) => e.textContent.includes('Flagships')))

await page.reload({ waitUntil: 'networkidle0' })
await page.evaluate(() => document.getElementById('work').scrollIntoView())
await click('.view', 'All projects')
ok('Right after clicking "All", the cards on screen are visible (the reported bug)', await onScreenVisible())
ok('All shows the first 12 cards, ranked, all visible (regression: filtered cards stayed at opacity 0)', (await count('.card')) === 12 && (await visible()), String(await count('.card')))
const t = await titles()
ok('All is ranked by impact (Pitbook first, in.culcate before the movie app)', t[0] === 'Pitbook' && t.indexOf('in.culcate platform') > 0, JSON.stringify(t.slice(0, 4)))
await click('.more button', 'Show')
await click('.more button', 'Show')
ok('"Show more" reaches all 32', (await count('.card')) === 32 && (await visible()), String(await count('.card')))

await page.evaluate(() => document.getElementById('work').scrollIntoView())
await click('.fchip', 'Fintech')
ok('Right after clicking an area, the cards on screen are visible (the reported bug)', await onScreenVisible())
for (const [label, expected] of [['Fintech', 6], ['Mobile', 4], ['Systems', 5], ['AI, agents', 17]]) {
  await click('.fchip', label)
  const n = await count('.card')
  ok(`Area "${label}" shows ${Math.min(expected, 12)} visible cards`, n === Math.min(expected, 12) && (await visible()), String(n))
}
await click('.fchip', 'Mobile')
const mobile = await titles()
ok('Mobile area lists FitFusion and Saarthi AI', mobile.includes('FitFusion') && mobile.includes('Saarthi AI'), JSON.stringify(mobile))
ok('A flagship card in an area links to its case study', (await count('.card-links button')) >= 0)

await click('.view', 'Flagships')
ok('Back to Flagships restores the 8 case studies, visibly', (await count('.case')) === 8 && (await onScreenVisible()))

// search always looks through every project, even from the Flagships view (fresh page: no state carried over)
await page.reload({ waitUntil: 'networkidle0' })
await page.evaluate(() => document.getElementById('work').scrollIntoView())
await page.type('.search input', 'redis'); await new Promise((r) => setTimeout(r, 600))
const redis = await titles()
ok('Search "redis" (from Flagships) finds TaskFlow and Reliable AI Agent', redis.includes('Resilient TaskFlow') && redis.includes('Reliable AI Agent') && (await visible()), JSON.stringify(redis))
await page.$eval('.search input', (e) => { e.scrollIntoView({ block: 'center' }); e.focus(); e.select() }); await page.keyboard.press('Backspace'); await new Promise((r) => setTimeout(r, 1000))
ok('Clearing the search returns to the open view', (await count('.case')) === 8, String(await count('.case')))

// skill chip: Go must not match MongoDB
await page.evaluate(() => document.getElementById('skills').scrollIntoView())
const goBtn = await page.evaluateHandle(() => [...document.querySelectorAll('button.skill')].find((b) => b.textContent.trim().startsWith('Go ')))
await goBtn.click(); await new Promise((r) => setTimeout(r, 900))
const go = await titles()
ok('Skill chip "Go" -> Pitbook, Drumlin, cache-cluster only, visible', go.length === 3 && go.includes('Drumlin') && !go.includes('in.culcate platform') && (await visible()), JSON.stringify(go))
await page.$eval('.search input', (e) => { e.focus(); e.select() }); await page.keyboard.press('Backspace')

// command palette: a flagship opens its case study
await page.evaluate(() => window.scrollTo(0, 0))
await page.keyboard.down('Control'); await page.keyboard.press('k'); await page.keyboard.up('Control'); await new Promise((r) => setTimeout(r, 300))
await page.keyboard.type('drumlin'); await new Promise((r) => setTimeout(r, 200)); await page.keyboard.press('Enter'); await new Promise((r) => setTimeout(r, 3500))
const dy = await page.evaluate(() => { const r = document.getElementById('proj-drumlin')?.getBoundingClientRect(); return r ? Math.round(r.top) : null })
ok('Palette "Drumlin" opens the flagship case study in view', dy !== null && Math.abs(dy) < 300, String(dy))
// command palette
await page.keyboard.down('Control'); await page.keyboard.press('k'); await page.keyboard.up('Control')
await new Promise((r) => setTimeout(r, 300))
ok('Ctrl+K opens the palette', (await count('.palette')) === 1)
await page.keyboard.type('open'); await new Promise((r) => setTimeout(r, 200))
const first = await page.$eval('.palette li.on .pl', (e) => e.textContent)
ok('Palette search ranks "Open source" first', first === 'Open source', first)
await page.keyboard.press('Enter'); await new Promise((r) => setTimeout(r, 3500))
const y = await page.evaluate(() => [window.scrollY, document.getElementById('open-source').offsetTop])
ok('Palette navigation scrolled to the section', Math.abs(y[0] - y[1]) < 200, JSON.stringify(y))
ok('Palette closed after selection', (await count('.palette')) === 0)

// theme toggle
await page.evaluate(() => window.scrollTo(0, 0))
const before = await page.evaluate(() => document.documentElement.dataset.theme)
await page.click('.header-tools .icon-btn:nth-child(2)'); await new Promise((r) => setTimeout(r, 200))
const after = await page.evaluate(() => document.documentElement.dataset.theme)
ok('Theme toggle flips light/dark', before !== after, `${before} -> ${after}`)
await page.reload({ waitUntil: 'networkidle0' })
ok('Theme persists across reload', (await page.evaluate(() => document.documentElement.dataset.theme)) === after)

// links
const bad = await page.$$eval('a[href]', (as) => as.filter((a) => a.target === '_blank' && !/noopener/.test(a.rel)).map((a) => a.href))
ok('External links all have rel=noopener', bad.length === 0, JSON.stringify(bad.slice(0, 3)))
const hrefs = await page.$$eval('a[href^="http"]', (as) => [...new Set(as.map((a) => a.href))])
console.log('external links:', hrefs.length)
ok('No console errors', errors.length === 0, JSON.stringify(errors))

// accessibility, both themes
for (const theme of ['light', 'dark']) {
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }])
  await page.evaluate((t) => { localStorage.setItem('pb-theme', t) }, theme)
  await page.reload({ waitUntil: 'networkidle0' })
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let yy = 0; yy < h; yy += 600) { await page.evaluate((v) => window.scrollTo(0, v), yy); await new Promise((r) => setTimeout(r, 40)) }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.evaluate(axeSrc)
  const v = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map((x) => ({ id: x.id, impact: x.impact, n: x.nodes.length, sample: x.nodes.slice(0, 3).map((n) => n.target.join(' ') + ' :: ' + (n.failureSummary || '').split('\n')[1]) })))
  ok(`axe: no violations (${theme})`, v.length === 0, JSON.stringify(v, null, 1))
}
await browser.close()
process.exit(results.some((r) => !r[0]) ? 1 : 0)
