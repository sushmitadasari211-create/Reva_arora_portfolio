import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { projectHref } from '../hooks/useHashRoute'
import { PROJECTS } from '../data/projects'
import { ArrowIcon, ExternalIcon, GitHubIcon, ProjectGlyph } from './Icons'
import './Projects.css'

const STACK_PREVIEW = 3
/** Every project is a static web app, so these say nothing on a card; the case study lists them. */
const GENERIC_TECH = new Set(['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'HTML / CSS / JavaScript'])
const distinctiveStack = (stack: string[]) => stack.filter((tech) => !GENERIC_TECH.has(tech))

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section id="projects" className="projects" ref={sectionRef}>
      <div className="projects__inner">
        <header className="projects__header" data-reveal="up">
          <span className="projects__eyebrow">Selected work · {PROJECTS.length} projects</span>
          <h2 className="projects__title">
            Business problems, <em>built into tools.</em>
          </h2>
          <p className="projects__lede">
            Each case study covers the business problem, the solution and its architecture, the impact, and links to
            the live demo and repository.
          </p>
        </header>

        <div className="projects__grid">
          {PROJECTS.map((project, index) => {
            const stack = distinctiveStack(project.solution.stack)
            return (
              <article
                key={project.slug}
                className="projects__card"
                data-reveal="up"
                style={{ '--delay': `${(index % 3) * 90}ms` } as React.CSSProperties}
              >
                <div className="projects__cover" aria-hidden="true">
                  <span className="projects__number">{project.number}</span>
                  <ProjectGlyph icon={project.icon} className="projects__glyph" />
                </div>

                <div className="projects__body">
                  <span className="projects__domain">{project.domain}</span>
                  <h3>
                    {/* Stretched link: the whole card opens the case study. */}
                    <a className="projects__main-link" href={projectHref(project.slug)}>
                      {project.name}
                    </a>
                  </h3>
                  <p>{project.tagline}</p>

                  <ul className="projects__stack">
                    {stack.slice(0, STACK_PREVIEW).map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                    {stack.length > STACK_PREVIEW && (
                      <li className="projects__stack-more">+{stack.length - STACK_PREVIEW}</li>
                    )}
                  </ul>

                  <div className="projects__actions">
                    <span className="projects__cta">
                      Case study <ArrowIcon className="projects__cta-icon" />
                    </span>
                    <div className="projects__external">
                      <a href={project.demo} target="_blank" rel="noreferrer" aria-label={`${project.name} live demo`}>
                        <ExternalIcon className="projects__ext-icon" />
                        Demo
                      </a>
                      <a href={project.repo} target="_blank" rel="noreferrer" aria-label={`${project.name} GitHub repository`}>
                        <GitHubIcon className="projects__ext-icon" />
                        Repo
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Projects
