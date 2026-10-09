import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { SKILL_GROUPS } from '../data/profile'
import './Skills.css'

type SkillGroup = (typeof SKILL_GROUPS)[number]

/** Matches the original stagger: 0.2s lead-in, then 0.1s per card. */
const STAGGER_START_MS = 200
const STAGGER_STEP_MS = 100

const SkillCard = ({ category, skills, index }: SkillGroup & { index: number }) => (
  <article
    data-reveal="up"
    style={{ '--delay': `${STAGGER_START_MS + index * STAGGER_STEP_MS}ms` } as React.CSSProperties}
  >
    {/* Hover lives on the inner card so it never inherits the reveal delay. */}
    <div className="skills__card">
      <div className="skills__card-head">
        <span className="skills__index">{String(index + 1).padStart(2, '0')}</span>
        <h3>{category}</h3>
      </div>
      <ul className="skills__pills">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  </article>
)

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section id="skills" className="skills" ref={sectionRef}>
      <div className="skills__orb skills__orb--top" aria-hidden="true" />
      <div className="skills__orb skills__orb--bottom" aria-hidden="true" />

      <div className="skills__inner">
        <header className="skills__header" data-reveal="up">
          <span className="skills__eyebrow">Toolkit</span>
          <h2 className="skills__title">
            Skills &amp; <em>certifications</em>
          </h2>
          <p className="skills__lede">
            Business analysis, data, and BI from the resume, plus the AI and front-end tooling used across the portfolio projects.
          </p>
        </header>

        <div className="skills__grid">
          {SKILL_GROUPS.map((group, index) => (
            <SkillCard key={group.category} {...group} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
