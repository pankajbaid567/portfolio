import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Preload the two fonts the first paint needs (display serif and body sans) so text does not wait for the CSS to discover them.
const preloadFonts = () => ({
  name: 'preload-fonts',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      if (!ctx.bundle) return html
      const wanted = [/instrument-serif-latin-400-normal-.*\.woff2$/, /inter-latin-wght-normal-.*\.woff2$/]
      const tags = Object.keys(ctx.bundle)
        .filter((f) => wanted.some((re) => re.test(f)))
        .map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${f}">`)
      return html.replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
    },
  },
})

export default defineConfig({ plugins: [react(), preloadFonts()] })
