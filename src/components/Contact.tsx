import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { PROFILE } from '../data/profile'
import { ArrowIcon, GitHubIcon, LinkedInIcon, MailIcon, ResumeIcon } from './Icons'
import './Contact.css'

/** Background title drifts from -20% to 30% of its height across the section's pass. */
const PARALLAX_FROM = -20
const PARALLAX_TO = 30

const CHANNELS = [
  {
    label: 'Email',
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    Icon: MailIcon,
    external: false,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/reva-arora',
    href: PROFILE.links.linkedin,
    Icon: LinkedInIcon,
    external: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/reevaarora05',
    href: PROFILE.links.github,
    Icon: GitHubIcon,
    external: true,
  },
  {
    label: 'Resume',
    value: 'View on Google Drive',
    href: PROFILE.links.resume,
    Icon: ResumeIcon,
    external: true,
  },
] as const

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useReveal(sectionRef, '0px 0px -100px 0px')

  useScrollProgress(
    sectionRef,
    (progress) => {
      const y = PARALLAX_FROM + (PARALLAX_TO - PARALLAX_FROM) * progress
      if (titleRef.current) titleRef.current.style.transform = `translate3d(0, ${y}%, 0)`
    },
    { start: 1, end: 0 },
  )

  return (
    <section id="contact" className="contact" ref={sectionRef}>
      <div className="contact__title" ref={titleRef} aria-hidden="true">
        <span>Contact</span>
      </div>

      <div className="contact__card-row">
        <div className="contact__card" data-reveal="up">
          <div className="contact__eyebrow">Get in touch</div>
          <h2 className="contact__heading">
            Let’s talk about the problem <em>you need solved.</em>
          </h2>
          <p className="contact__sub">
            {PROFILE.title} based in {PROFILE.location} · {PROFILE.relocation}.
          </p>

          <ul className="contact__channels">
            {CHANNELS.map(({ label, value, href, Icon, external }) => (
              <li key={label}>
                <a
                  className="contact__channel"
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  <Icon className="contact__channel-icon" />
                  <span className="contact__channel-text">
                    <small>{label}</small>
                    <span>{value}</span>
                  </span>
                  <ArrowIcon className="contact__channel-arrow" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Contact
