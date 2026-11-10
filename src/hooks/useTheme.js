import { useCallback, useEffect, useState } from 'react'

const KEY = 'pb-theme'
const read = () => {
  try { return localStorage.getItem(KEY) } catch { return null }
}

export function useTheme() {
  const [theme, setTheme] = useState(() => read() || 'system')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0c0b09' : '#f7f4ee')
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  const set = useCallback((t) => {
    setTheme(t)
    try { localStorage.setItem(KEY, t) } catch { /* storage may be blocked */ }
  }, [])

  const toggle = useCallback(() => {
    const dark = document.documentElement.dataset.theme === 'dark'
    set(dark ? 'light' : 'dark')
  }, [set])

  return { theme, toggle }
}
