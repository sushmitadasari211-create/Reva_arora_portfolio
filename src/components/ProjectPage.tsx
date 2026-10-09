import { useEffect, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { projectHref } from '../hooks/useHashRoute'
import { PROJECTS, type Project } from '../data/projects'
import { PROFILE } from '../data/profile'
import { ArrowIcon, ExternalIcon, GitHubIcon, ProjectGlyph } from './Icons'
import './ProjectPage.css'

const SectionHeading = ({ index, title }: { index: string; title: string }) => (
  <div className="project__heading">
    <span>{index}</span>
    <h2>{title}</h2>
  </div>
)

const ProjectPage = ({ project }: { project: Project }) => {
  const pageRef = useRef<HTMLElement>(null)
  useReveal(pageRef)

  const position = PROJECTS.findIndex((item) => item.slug === project.slug)
  const prev = PROJECTS[(position - 1 + PROJECTS.length) % PROJECTS.length]
  const next = PROJECTS[(position + 1) % PROJECTS.length]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const previousTitle = document.title
    document.title = `${project.name} — ${PROFILE.name}`
    return () => {
      document.title = previousTitle
    }
  }, [project])

  return (
    // Keyed by slug in App so reveals replay when moving between projects.
    <article className="project" ref={pageRef}>
      <header className="project__hero">
        <div className="project__hero-inner">
          <a className="project__back" href="#projects">
            <ArrowIcon className="project__back-icon" />
            All projects
          </a>

          <div className="project__hero-grid">
            <div data-reveal="up">
              <span className="project__eyebrow">
                Project {project.number} · {project.domain}
              </span>
              <h1 className="project__title">{project.name}</h1>
              <p className="project__tagline">{project.tagline}</p>

              <div className="project__links">
                <a className="project__btn project__btn--primary" href={project.demo} target="_blank" rel="noreferrer">
                  <ExternalIcon className="project__btn-icon" />
                  Live demo
                </a>
                <a className="project__btn" href={project.repo} target="_blank" rel="noreferrer">
                  <GitHubIcon className="project__btn-icon" />
                  GitHub repo
                </a>
              </div>
            </div>

            <div className="project__emblem" data-reveal="zoom" aria-hidden="true">
              <ProjectGlyph icon={project.icon} className="project__emblem-glyph" />
              <span>{project.number}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="project__body">
        {/* 01 — Business problem */}
        <section className="project__section" data-reveal="up">
          <SectionHeading index="01" title="Business problem" />
          <div className="project__split">
            <div>
              <h3 className="project__label">Who is affected</h3>
              <p className="project__lead">{project.problem.audience}</p>
              <p className="project__text">{project.problem.summary}</p>
            </div>
            <div className="project__panel">
              <h3 className="project__label">What it costs them</h3>
              <ul className="project__list">
                {project.problem.costs.map((cost) => (
                  <li key={cost}>{cost}</li>
                ))}
              </ul>
              {project.problem.context && (
                <figure className="project__context">
                  <blockquote>{project.problem.context.text}</blockquote>
                  <figcaption>Source: {project.problem.context.source}</figcaption>
                </figure>
              )}
            </div>
          </div>
        </section>

        {/* 02 — Proposed solution */}
        <section className="project__section" data-reveal="up">
          <SectionHeading index="02" title="Proposed solution" />

          <h3 className="project__label">Approach</h3>
          <ol className="project__approach">
            {project.solution.approach.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <h3 className="project__label">Architecture</h3>
          <ol className="project__flow">
            {project.solution.architecture.map((stage, index) => (
              <li key={stage}>
                <span className="project__flow-index">{String(index + 1).padStart(2, '0')}</span>
                {stage}
              </li>
            ))}
          </ol>

          <h3 className="project__label">Tech stack</h3>
          <ul className="project__stack">
            {project.solution.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>

          {project.screenshots && (
            <div className="project__shots">
              {project.screenshots.map((shot) => (
                <figure key={shot.src}>
                  <img src={shot.src} alt={shot.alt} loading="lazy" />
                  <figcaption>{shot.alt}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>

        {/* 03 — Impact */}
        <section className="project__section" data-reveal="up">
          <SectionHeading index="03" title="Impact" />

          <div className="project__metrics">
            {project.impact.quantified.map((metric) => (
              <div key={metric.label} className="project__metric" data-pending={metric.value ? undefined : ''}>
                {metric.value ? (
                  <span className="project__metric-value">{metric.value}</span>
                ) : (
                  <span className="project__metric-needed">[METRIC NEEDED]</span>
                )}
                <span className="project__metric-label">{metric.label}</span>
                <span className="project__metric-note">{metric.value ? metric.source : metric.metricNeeded}</span>
              </div>
            ))}
          </div>

          <h3 className="project__label">Qualitative outcomes</h3>
          <ul className="project__list project__list--outcomes">
            {project.impact.qualitative.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>

          <aside className="project__note">
            <strong>How it’s built</strong>
            <p>{project.buildNote}</p>
          </aside>
        </section>

        {/* 04 — Links */}
        <section className="project__section" data-reveal="up">
          <SectionHeading index="04" title="Links" />
          <div className="project__link-cards">
            <a className="project__link-card" href={project.demo} target="_blank" rel="noreferrer">
              <ExternalIcon className="project__link-icon" />
              <span>
                <strong>Live demo</strong>
                <small>{project.demo.replace('https://', '')}</small>
              </span>
            </a>
            <a className="project__link-card" href={project.repo} target="_blank" rel="noreferrer">
              <GitHubIcon className="project__link-icon" />
              <span>
                <strong>GitHub repository</strong>
                <small>{project.repo.replace('https://', '')}</small>
              </span>
            </a>
          </div>
        </section>

        <nav className="project__pager" aria-label="More projects">
          <a href={projectHref(prev.slug)} className="project__pager-link">
            <small>Previous</small>
            <span>{prev.name}</span>
          </a>
          <a href={projectHref(next.slug)} className="project__pager-link project__pager-link--next">
            <small>Next</small>
            <span>{next.name}</span>
          </a>
        </nav>
      </div>
    </article>
  )
}

export default ProjectPage
