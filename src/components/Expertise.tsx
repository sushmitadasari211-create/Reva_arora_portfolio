import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { CAPABILITIES } from '../data/profile'
import './Expertise.css'

/** Desktop scatter slot and entrance side for each capability card, in order. */
const LAYOUT = [
  { slot: 'one', reveal: 'left', delay: 100 },
  { slot: 'two', reveal: 'right', delay: 200 },
  { slot: 'three', reveal: 'left', delay: 300 },
  { slot: 'four', reveal: 'right', delay: 400 },
] as const

const CARDS = CAPABILITIES.map((capability, index) => ({ ...capability, ...LAYOUT[index] }))

const PATH = 'M 650,200 C 400,300 200,400 300,600 C 400,800 750,750 700,950 C 650,1150 400,1150 300,1200'
/** A card lights up once the line tip is this far past its top edge. */
const CARD_TRIGGER_PX = 50

const Expertise = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const desktopRevealRef = useRef<SVGPathElement>(null)
  const mobileRevealRef = useRef<SVGPathElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  useReveal(sectionRef)

  useScrollProgress(
    sectionRef,
    (progress) => {
      const offset = String(1 - progress)
      desktopRevealRef.current?.setAttribute('stroke-dashoffset', offset)
      mobileRevealRef.current?.setAttribute('stroke-dashoffset', offset)

      const section = sectionRef.current
      if (!section) return
      const sectionRect = section.getBoundingClientRect()
      const lineTipY = progress * sectionRect.height

      for (const card of cardRefs.current) {
        if (!card) continue
        const top = card.getBoundingClientRect().top - sectionRect.top
        const active = lineTipY >= top + CARD_TRIGGER_PX
        if (card.dataset.active !== String(active)) card.dataset.active = String(active)
      }
    },
    { start: 0.5, end: 0.5, smoothing: 0.09 },
  )

  return (
    <section id="expertise" className="expertise" ref={sectionRef}>
      <div className="expertise__inner">
        <header className="expertise__header" data-reveal="up">
          <span className="expertise__pill">What I do</span>
          <h2 className="expertise__title">
            From ambiguous problem to <em>measurable decision</em>
            <svg className="expertise__arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 4 Q 10 10 15 15 M 15 15 L 10 15 M 15 15 L 15 10" />
            </svg>
          </h2>
          <p className="expertise__lede">
            Four capabilities, each backed by client work on the resume or by the nine portfolio builds.
          </p>
        </header>

        {/* Desktop: dashed path revealed by scroll */}
        <svg className="expertise__path expertise__path--desktop" viewBox="0 0 1000 1350" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <mask id="expertise-mask" maskUnits="userSpaceOnUse">
              <path
                ref={desktopRevealRef}
                d={PATH}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth="20"
                strokeDasharray="1 1"
                strokeDashoffset="1"
              />
            </mask>
          </defs>
          <path className="expertise__guide" d={PATH} />
          <path className="expertise__line" d={PATH} mask="url(#expertise-mask)" />
        </svg>

        {/* Mobile: straight dashed spine */}
        <svg className="expertise__path expertise__path--mobile" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <mask id="expertise-mask-mobile" maskUnits="userSpaceOnUse">
              <path
                ref={mobileRevealRef}
                d="M 2,0 L 2,100"
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth="4"
                strokeDasharray="1 1"
                strokeDashoffset="1"
              />
            </mask>
          </defs>
          <path className="expertise__guide" d="M 2,0 L 2,100" vectorEffect="non-scaling-stroke" />
          <path className="expertise__line" d="M 2,0 L 2,100" vectorEffect="non-scaling-stroke" mask="url(#expertise-mask-mobile)" />
        </svg>

        <div className="expertise__cards">
          {CARDS.map((card, index) => (
            <article
              key={card.number}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
              className={`expertise__card expertise__card--${card.slot}`}
              data-active="false"
            >
              {/* Reveal sits on a wrapper so it never fights the card's tilt. */}
              <div className="expertise__card-reveal" data-reveal={card.reveal} style={{ '--delay': `${card.delay}ms` } as React.CSSProperties}>
                <div className="expertise__tag">
                  <span className="expertise__punch" aria-hidden="true" />
                  <div className="expertise__tag-body">
                    <span className="expertise__number">{card.number}</span>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}

          <p className="expertise__signoff" data-reveal="fade" style={{ '--delay': '600ms' } as React.CSSProperties}>
            Requirements → data → decision.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Expertise
