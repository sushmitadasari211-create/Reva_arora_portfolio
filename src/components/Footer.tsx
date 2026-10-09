import { PROFILE } from '../data/profile'
import './Footer.css'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__row">
        <div className="footer__cell">
          <p>Requirements &amp; Process Analysis</p>
          <p>Reporting &amp; Analytics</p>
          <p>Data &amp; AI Decision Tools</p>
        </div>

        <div className="footer__cell footer__cell--center">
          <p>3+ years of experience</p>
          <a href="#projects">View Projects</a>
        </div>

        <div className="footer__cell footer__cell--end">
          <p>{PROFILE.location}</p>
          <p>{PROFILE.relocation}</p>
        </div>
      </div>

      <div className="footer__wordmark" aria-hidden="true">
        <span>{PROFILE.firstName}</span>
      </div>

      <div className="footer__row footer__row--bottom">
        <div className="footer__cell footer__cell--stack">
          <a href="#contact" className="footer__strong">
            Contact
          </a>
          <p className="footer__fine">&copy; {year} {PROFILE.name}</p>
        </div>

        <div className="footer__cell footer__cell--center">
          <a href={`mailto:${PROFILE.email}`} className="footer__lower">
            {PROFILE.email}
          </a>
        </div>

        <div className="footer__cell footer__cell--end footer__cell--links">
          <a href={PROFILE.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={PROFILE.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={PROFILE.links.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
