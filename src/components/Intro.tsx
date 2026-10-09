import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { CORE_SKILLS, HIGHLIGHTS, POSITIONING, PROFILE } from '../data/profile'
import { GitHubIcon, LinkedInIcon, ResumeIcon } from './Icons'
import './Intro.css'

const Intro = () => {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section id="intro" className="intro" ref={sectionRef}>
      <div className="intro__inner">
        <div className="intro__lead" data-reveal="up">
          <span className="intro__eyebrow">
            {PROFILE.title} · {PROFILE.location} · {PROFILE.relocation}
          </span>
          <h2 className="intro__headline">
            I turn data and AI into <em>business outcomes.</em>
          </h2>
          <p className="intro__statement">{POSITIONING.statement}</p>

          <div className="intro__links">
            <a className="intro__link intro__link--primary" href={PROFILE.links.resume} target="_blank" rel="noreferrer">
              <ResumeIcon className="intro__link-icon" />
              Resume
            </a>
            <a className="intro__link" href={PROFILE.links.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon className="intro__link-icon" />
              LinkedIn
            </a>
            <a className="intro__link" href={PROFILE.links.github} target="_blank" rel="noreferrer">
              <GitHubIcon className="intro__link-icon" />
              GitHub
            </a>
          </div>
        </div>

        <ul className="intro__highlights">
          {HIGHLIGHTS.map((item, index) => (
            <li
              key={item.label}
              className="intro__highlight"
              data-reveal="up"
              style={{ '--delay': `${150 + index * 90}ms` } as React.CSSProperties}
            >
              <span className="intro__value">{item.value}</span>
              <span className="intro__label">{item.label}</span>
              <span className="intro__source">{item.source}</span>
            </li>
          ))}
        </ul>

        <div className="intro__skills" data-reveal="up" style={{ '--delay': '300ms' } as React.CSSProperties}>
          <span className="intro__skills-title">Core skills</span>
          <ul>
            {CORE_SKILLS.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Intro
