import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Home', 'fa-house'],
  ['/scanner', 'Threat Scanner', 'fa-magnifying-glass'],
  ['/email-security', 'Email Security', 'fa-envelope'],
  ['/threat-detection', 'Specialized Detection', 'fa-bug'],
  ['/dashboard', 'Security Dashboard', 'fa-chart-line'],
  ['/about', 'About & Team', 'fa-users']
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <NavLink className="brand" to="/" aria-label="CODEX AI Cyber Shield home">
        <i className="fas fa-shield-halved" aria-hidden="true" />
        <span>CODEX <b>AI</b></span>
      </NavLink>
      <button className="hamburger" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="navLinks" onClick={() => setOpen((value) => !value)}>
        <i className={`fas ${open ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
      </button>
      <div className={`nav-links ${open ? 'open' : ''}`} id="navLinks">
        {links.map(([href, label, icon]) => (
          <NavLink to={href} key={href} end={href === '/'} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
            <i className={`fas ${icon}`} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
