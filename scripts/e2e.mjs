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

ok('8 featured case studies render', (await count('.case')) === 8)
ok('grid starts with 9 of the remaining cards', (await count('.card')) === 9, String(await count('.card')))
await page.click('.more button'); await new Promise((r) => setTimeout(r, 200))
ok('"Show all" reveals the rest (32 - 8 = 24)', (await count('.card')) === 24, String(await count('.card')))

// category filter
const chips = await page.$$('.fchip')
for (const c of chips) { const t = await c.evaluate((e) => e.textContent); if (t.trim().startsWith('Mobile')) { await c.click(); break } }
await new Promise((r) => setTimeout(r, 300))
const mobileTitles = await page.$$eval('.card-title, .case-title', (e) => e.map((x) => x.textContent))
ok('Mobile filter shows only mobile-tagged projects', mobileTitles.length === 4 && mobileTitles.includes('FitFusion'), JSON.stringify(mobileTitles))
await page.click('.fchip:first-child')

// search
await page.type('.search input', 'redis'); await new Promise((r) => setTimeout(r, 400))
const redis = await page.$$eval('.card-title, .case-title', (e) => e.map((x) => x.textContent))
ok('Search "redis" finds TaskFlow and Reliable AI Agent', redis.includes('Resilient TaskFlow') && redis.includes('Reliable AI Agent'), JSON.stringify(redis))
await page.$eval('.search input', (e) => { e.value = '' })
await page.click('.search input', { clickCount: 3 }); await page.keyboard.press('Backspace'); await new Promise((r) => setTimeout(r, 300))

// skill chip: Go must not match MongoDB
await page.evaluate(() => document.getElementById('skills').scrollIntoView())
const goBtn = await page.evaluateHandle(() => [...document.querySelectorAll('button.skill')].find((b) => b.textContent.trim().startsWith('Go ')))
await goBtn.click(); await new Promise((r) => setTimeout(r, 700))
const go = await page.$$eval('.card-title, .case-title', (e) => e.map((x) => x.textContent))
ok('Skill chip "Go" -> Pitbook, Drumlin, cache-cluster only', go.length === 3 && go.includes('Drumlin') && !go.includes('in.culcate platform'), JSON.stringify(go))
await page.$eval('.search input', (e) => e.focus()); await page.click('.search input', { clickCount: 3 }); await page.keyboard.press('Backspace')

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
