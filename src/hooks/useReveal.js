import { useEffect } from 'react'

/**
 * Adds .in to every [data-reveal] element the first time it scrolls into view. A MutationObserver picks up elements that
 * are mounted later (filters, "show more"), which is what keeps filtered cards from staying invisible.
 */
export function useReveal() {
  useEffect(() => {
    const seen = new WeakSet()
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
        }), { rootMargin: '0px 0px -6% 0px', threshold: 0.04 })
      : null
    const scan = () => document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => {
      if (seen.has(el)) return
      seen.add(el)
      if (io) io.observe(el); else el.classList.add('in')
    })
    scan()
    let raf
    const mo = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(scan) })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { io?.disconnect(); mo.disconnect(); cancelAnimationFrame(raf) }
  }, [])
}
