import { useEffect } from 'react'

/** Fades in every `.reveal` element as it scrolls into view. */
export default function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)')
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [dep])
}
