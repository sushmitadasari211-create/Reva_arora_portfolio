import { useEffect, useState } from 'react'
import { PROFILE } from '../data/profile'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
] as const

const SCROLL_THRESHOLD = 40

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen])

  const close = () => setIsOpen(false)

  return (
    <header className="nav" data-scrolled={isScrolled} data-open={isOpen}>
      <div className="nav__inner">
        <a className="nav__brand" href="#top" onClick={close}>
          <span className="nav__name">{PROFILE.name.toUpperCase()}</span>
          <span className="nav__role">{PROFILE.tagline}</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <a className="nav__cta" href={PROFILE.links.resume} target="_blank" rel="noreferrer">
          Resume
        </a>

        <button
          type="button"
          className="nav__toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="nav-drawer"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className="nav__drawer" id="nav-drawer" aria-hidden={!isOpen} inert={!isOpen}>
        {NAV_LINKS.map(({ label, href }, index) => (
          <a
            key={label}
            href={href}
            onClick={close}
            style={{ '--i': index } as React.CSSProperties}
          >
            {label}
          </a>
        ))}
        <a className="nav__drawer-cta" href={PROFILE.links.resume} target="_blank" rel="noreferrer" onClick={close}>
          Resume
        </a>
      </div>
    </header>
  )
}

export default Navbar
