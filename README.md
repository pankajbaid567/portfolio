# Pankaj Baid: portfolio

Personal site for SDE-internship applications. React 19 + Vite, hand-written CSS, **no UI library and no trackers**; fonts are self-hosted (Instrument Serif, Inter, JetBrains Mono).

The idea: a backend engineer's portfolio should be **evidence first**. Every case study carries its measured results, its stated limits, and the command that reproduces it, and the page is built so a recruiter can skim it in 30 seconds or dig in for an hour.

## What's on the page
- **Hero** with a live "proof terminal" (excerpts of real crash-test output) and a proof strip: 3,000 SIGKILL runs with 0 lost acknowledged writes, 33 of 33 injected bugs caught, a 168k-star repo with a merged fix, Amazon ML Challenge rank 8.
- **Work**: 18 projects, ranked by impact. Flagships (8 full case studies) are the default view; "All projects" and seven area buttons are separate views, and search always covers everything. Eight case studies (Pitbook, Counterfoil, Drumlin, Resilient TaskFlow, VITRAM, Warrantgate, Bodkin, cache-cluster), each with a bespoke illustration, results, limits, "the bug I found" and a copy-able reproduce command.
- **Open source**: 12 merged PRs in 6 projects (Hugging Face Transformers, FOSSASIA Eventyay, AOSSIE Ell-ena and Hacktoberfest repos) with a PR ledger generated from the GitHub API.
- **Experience** (in.culcate), **Method** (four habits and field notes on real bugs), **Achievements**, **Toolbox** (click a skill to filter the projects), **About and education**, **Contact**.
- Command palette (⌘K / Ctrl+K), light and dark themes, keyboard accessible, print stylesheet.

## Where the content lives
All content is in `src/data/`: `projects.js`, `oss.js`, `experience.js`, `achievements.js`, `skills.js`, `proof.js`, `profile.js`. Components only render it. Every number comes from a project's own results document, from the resume (SDE_Backend.pdf, marked "reported" where it is not re-run), or from the GitHub API. To add a project, append an entry to `projects.js` and run `npm run validate`.

## Run it
```bash
npm install
npm run dev          # http://localhost:5173
npm test             # validates the data, lints, builds
npm run build && npx vite preview --port 4173 &
CHROME_PATH="/path/to/chrome" npm run e2e   # filters, search, palette, theme, links, axe accessibility scan
```

## Quality checks (measured 2026-11-11)
- Lighthouse desktop: Performance 100 · Accessibility 100 · Best practices 100 · SEO 100. Mobile (simulated slow 4G, 4× CPU): 90 · 100 · 100 · 100.
- axe-core: 0 violations in light and dark themes (WCAG 2.1 AA and best-practice rules).
- Total JS about 87 kB gzipped; no layout shift (CLS 0.001).

## Deploy
Static site: `npm run build` produces `dist/`. Vercel, Cloudflare Pages and Netlify all work with the defaults (build `npm run build`, output `dist`). `public/og.png` is the social preview; set the absolute URL in `index.html` (`og:image`) once the final domain is known.
