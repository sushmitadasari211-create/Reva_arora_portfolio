import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { EDUCATION, PROFILE, SUMMARY } from '../data/profile'
import profileImage from '../assets/about/reva.jpg'
import './About.css'

const FACTS = [
  { label: 'Based in', value: `${PROFILE.location} · ${PROFILE.relocation}` },
  { label: 'Education', value: `${EDUCATION[0].degree}, ${EDUCATION[0].school}` },
  { label: 'Focus', value: 'Requirements, reporting automation, and data & AI decision tools' },
] as const

const Sparkle = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
  </svg>
)

const About = () => {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about__inner">
        {/* Left: ID badge on a lanyard */}
        <div className="about__badge-col">
          <div className="about__badge-drop" data-reveal="drop">
            <div className="about__lanyard" aria-hidden="true" />
            <div className="about__clip" aria-hidden="true" />

            <div className="about__badge">
              <div className="about__badge-slot" aria-hidden="true">
                <span />
              </div>
              <div className="about__photo">
                <img src={profileImage} alt={`Portrait of ${PROFILE.name}`} loading="lazy" />
              </div>
              <div className="about__badge-meta">
                <span>{PROFILE.name}</span>
                <span>{PROFILE.title}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: summary */}
        <div className="about__content" data-reveal="left" style={{ '--delay': '200ms' } as React.CSSProperties}>
          <span className="about__eyebrow">About</span>
          <h2 className="about__title">
            Hello, I’m <span>{PROFILE.firstName}.</span>
          </h2>
          <p className="about__text">{SUMMARY}</p>

          <dl className="about__facts">
            {FACTS.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Soft wave into the next section */}
      <svg className="about__divider" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.62,189.5,99.8,242.79,81.82,282.88,63.6,321.39,56.44Z" />
      </svg>

      <Sparkle className="about__sparkle about__sparkle--top" />
      <Sparkle className="about__sparkle about__sparkle--bottom" />
    </section>
  )
}

export default About
