import { useEffect, useState } from 'react'

// Jednoduchý hash router – funguje offline, ze souboru i na libovolné adrese.
const read = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)

export function useRoute() {
  const [parts, setParts] = useState(read)
  useEffect(() => {
    const on = () => {
      setParts(read())
      document.querySelector('.screen-scroll')?.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return parts
}

export function go(path: string) {
  window.location.hash = '/' + path.replace(/^\//, '')
}

export function back(fallback = 'domov') {
  if (window.history.length > 1) window.history.back()
  else go(fallback)
}
