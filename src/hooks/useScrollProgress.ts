import { useEffect, useRef, type RefObject } from 'react'

type Options = {
  /** Progress is 0 when the element's top reaches this fraction of the viewport. */
  start: number
  /** Progress is 1 when the element's bottom reaches this fraction of the viewport. */
  end: number
  /**
   * Per-frame approach toward the scroll position (1 = locked to scroll).
   * Stands in for framer-motion's useSpring.
   */
  smoothing?: number
}

/**
 * Scroll-linked progress for an element, delivered through a callback rather
 * than state so per-frame updates write to the DOM without re-rendering React.
 *
 * `{ start: 0.5, end: 0.5 }` matches framer's `["start center", "end center"]`;
 * `{ start: 1, end: 0 }` matches `["start end", "end start"]`.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
  { start, end, smoothing = 1 }: Options,
) {
  const callbackRef = useRef(onProgress)
  useEffect(() => {
    callbackRef.current = onProgress
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const approach = reduced ? 1 : smoothing
    let current = -1
    let frame: number | null = null

    const measure = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const span = rect.height + (start - end) * vh
      if (span <= 0) return 0
      return Math.min(1, Math.max(0, (start * vh - rect.top) / span))
    }

    const step = () => {
      frame = null
      const target = measure()
      current = current < 0 ? target : current + (target - current) * approach
      if (Math.abs(target - current) < 0.0005) current = target
      callbackRef.current(current)
      if (current !== target) frame = requestAnimationFrame(step)
    }

    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(step)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [ref, start, end, smoothing])
}
