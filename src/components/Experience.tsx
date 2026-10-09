import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { EDUCATION, EXPERIENCE } from '../data/profile'
import './Experience.css'

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section id="experience" className="experience" ref={sectionRef}>
      <div className="experience__inner">
        <header className="experience__header" data-reveal="up">
          <span className="experience__eyebrow">Experience</span>
          <h2 className="experience__title">
            Requirements, reporting automation, and <em>data quality.</em>
          </h2>
          <p className="experience__lede">
            3+ years across enterprise real estate clients, insurance broking, university operations, and chemical
            manufacturing.
          </p>
        </header>

        <ol className="experience__timeline">
          {EXPERIENCE.map((role, index) => (
            <li
              key={`${role.company}-${role.period}`}
              className="experience__role"
              data-reveal="up"
              style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}
            >
              <span className="experience__dot" aria-hidden="true" />
              <div className="experience__card">
                <div className="experience__meta">
                  <span className="experience__period">{role.period}</span>
                  <span className="experience__location">{role.location}</span>
                </div>
                <h3>
                  {role.title}
                  <span>{role.company}</span>
                </h3>
                <ul>
                  {role.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="experience__education" data-reveal="up">
          <span className="experience__eyebrow">Education</span>
          <div className="experience__degrees">
            {EDUCATION.map((item) => (
              <div key={item.degree} className="experience__degree">
                <h3>{item.degree}</h3>
                <p>{item.school}</p>
                <span>
                  {item.period} · {item.location}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
