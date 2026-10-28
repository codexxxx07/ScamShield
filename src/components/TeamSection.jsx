import { useState } from 'react';

const team = [
  { name: 'Krish', role: 'Lead Developer', description: 'Built the complete website architecture and AI logic system', image: 'krish.jpg', instagram: 'https://www.instagram.com/_k_r_i_s_h_x_?igsh=d254M25mZzFmazRv', linkedin: 'https://www.linkedin.com/in/krishanjit-chakraborty-258a5237a', github: 'https://github.com/codexxxx07' },
  { name: 'Debrup', role: 'JS Engineer', description: 'Assisted in website development and JS functionalities', image: 'Deb.jpg', instagram: 'https://www.instagram.com/sick_loosing?igsh=NnRyaGJwenM0Nzkx', linkedin: 'https://in.linkedin.com/in/debrup-bhattacherjee-41b728387', github: 'https://github.com/debrupbhattacherjee' },
  { name: 'Shreya', role: 'UI/UX Designer', description: 'Designed the website interface and user experience', image: 'Shreya.jpg', instagram: 'https://www.instagram.com/ame.thyst_25', linkedin: 'https://www.linkedin.com/in/shreya-saha-375b52350', github: '#' },
  { name: 'Prithviraj', role: 'Research Lead', description: 'Handled phishing research and documentation', image: 'Ghost.jpg', instagram: 'https://www.instagram.com/callme_by_ghost?igsh=OXI4OWwwM3IxajNm', linkedin: 'https://www.linkedin.com/in/prithviraj-guha-a564a5388', github: 'https://github.com/prithvirajguha03-ai' },
  { name: 'Sunita', role: 'PPT Maker', description: 'Created Cyber Security PPTs', image: 'Sunita.jpg', instagram: '#', linkedin: 'https://www.linkedin.com/in/sunita-middya-b68723388', github: '#' },
  { name: 'Bushra', role: 'PPT Maker', description: 'Created Cyber Security PPTs', image: 'Bushra.jpg', instagram: 'https://www.instagram.com/itssjustbushh?igsh=MWU2ZDFybXBoeW1qZg==', linkedin: 'https://www.linkedin.com/in/bushra-fatima-851879376', github: 'https://github.com/Fatimabushra17' },
  { name: 'Ankush', role: 'Content Curator', description: 'Manages website and PPT content, documentation, and updates', image: 'Ankush.jpg', instagram: 'https://www.instagram.com/ankush_sf?igsh=MW9maHZhNGxsMWpmNg==', linkedin: 'https://www.linkedin.com/in/ankush-chatterjee-7a509b325', github: 'https://github.com/QUITX7STORX' },
];

function ExternalLink({ href, label, icon }) {
  if (!href || href === '#') return null;
  return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} profile`}><i className={`fab ${icon}`} aria-hidden="true" /></a>;
}

export default function TeamSection() {
  const [selected, setSelected] = useState(0);
  const member = team[selected];
  return <section id="teamSection" className="content-section team-section fade-section">
    <div className="section-header center-header"><span className="section-tag"><i className="fas fa-users" aria-hidden="true" /> THE TEAM</span><h2 className="team-heading">Meet the team</h2><p className="section-sub">We hack ideas, craft code, and build together.</p></div>
    <div className="team-wrapper">
      <article className="profile-card" aria-live="polite"><div className="profile-img"><img src={`/assets/${member.image}`} alt={`${member.name} profile`} /></div><h3>{member.name}</h3><p className="profile-role">{member.role}</p><p className="profile-description">{member.description}</p><div className="social-icons"><ExternalLink href={member.instagram} label="Instagram" icon="fa-instagram" /><ExternalLink href={member.linkedin} label="LinkedIn" icon="fa-linkedin-in" /><ExternalLink href={member.github} label="GitHub" icon="fa-github" /></div></article>
      <div className="name-list" role="group" aria-label="Choose a team member">{team.map((person, index) => <button className={`team-name ${index === selected ? 'active' : ''}`} type="button" aria-pressed={index === selected} key={person.name} onClick={() => setSelected(index)}>{person.name}<span>{person.role}</span></button>)}</div>
    </div>
  </section>;
}
