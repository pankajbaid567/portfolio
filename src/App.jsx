import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll events for header styling and section activation
  useEffect(() => {
    const handleScroll = () => {
      // Update header class when scrolled
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Determine which section is currently visible
      const sections = document.querySelectorAll('section');
      let currentSection = 'home';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop - 200 && 
            window.scrollY < sectionTop + sectionHeight - 200) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial call to set the active section on page load
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  };

  return (
    <div className="portfolio">
      {/* Header/Navigation */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <h1 className="logo">Pankaj Baid</h1>
        <nav className="nav">
          <ul>
            <li><button className={activeSection === 'home' ? 'active' : ''} onClick={() => scrollToSection('home')}>Home</button></li>
            <li><button className={activeSection === 'about' ? 'active' : ''} onClick={() => scrollToSection('about')}>About</button></li>
            <li><button className={activeSection === 'skills' ? 'active' : ''} onClick={() => scrollToSection('skills')}>Skills</button></li>
            <li><button className={activeSection === 'projects' ? 'active' : ''} onClick={() => scrollToSection('projects')}>Projects</button></li>
            <li><button className={activeSection === 'experience' ? 'active' : ''} onClick={() => scrollToSection('experience')}>Experience</button></li>
            <li><button className={activeSection === 'contact' ? 'active' : ''} onClick={() => scrollToSection('contact')}>Contact</button></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="profile-image-container">
            <img src="/media/images/pankaj.jpeg" alt="Pankaj Baid" className="profile-image" />
          </div>
          <h1>Hi, I'm Pankaj Baid</h1>
          <h2>Fullstack Developer</h2>
          <p>Building robust and scalable web applications</p>
          <div className="hero-buttons">
            <button onClick={() => scrollToSection('projects')}>View Projects</button>
            <button onClick={() => scrollToSection('contact')}>Contact Me</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <p>
            I'm a passionate backend developer with experience in building web applications using Node.js, Express.js, and 
            database technologies like PostgreSQL. I enjoy creating efficient, scalable solutions and 
            continuously improving my skills through challenges and hackathons.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <h2 className="section-title">Skills</h2>
        <div className="skills-grid">
          <div className="skill-card">
            <h3>Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>RESTful APIs</li>
            </ul>
          </div>
          <div className="skill-card">
            <h3>Databases</h3>
            <ul>
              <li>PostgreSQL</li>
              <li>Prisma ORM</li>
              <li>MongoDB</li>
            </ul>
          </div>
          <div className="skill-card">
            <h3>Frontend</h3>
            <ul>
              <li>React</li>
              <li>HTML/CSS</li>
              <li>JavaScript</li>
            </ul>
          </div>
          <div className="skill-card">
            <h3>Tools</h3>
            <ul>
              <li>Git</li>
              <li>VS Code</li>
              <li>npm/yarn</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
                    {/* Project 1 */}
                    <div className="project-card">
            <div className="project-content">
              <h3>Zerodha</h3>
              <p>A frontend clone of Zerodha built using React.js, designed to replicate its clean and responsive UI. This project focuses on modern UI/UX practices, smooth navigation, and scalable component-based architecture. 🚀</p>
              <div className="project-tech">
                <span>React js , Bootstrap</span>
              </div>
              <div className="project-links">
                <a href="https://zerodha-weld-five.vercel.app/" target="_blank" rel="noopener noreferrer" className="project-link">View Live</a>
                <a href="https://github.com/pankajbaid567/zerodha" target="_blank" rel="noopener noreferrer" className="project-link github-link">GitHub</a>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="project-card">
            <div className="project-content">
              <h3>Project 2</h3>
              <p>Project description will be updated soon.</p>
              <div className="project-tech">
                <span>Tech stack will be updated</span>
              </div>
              <div className="project-links">
                <a href="#" onClick={(e) => e.preventDefault()} className="project-link coming-soon">View Live</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="project-link github-link coming-soon">GitHub</a>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="project-card">
            <div className="project-content">
              <h3>Project 3</h3>
              <p>Project description will be updated soon.</p>
              <div className="project-tech">
                <span>Tech stack will be updated</span>
              </div>
              <div className="project-links">
                <a href="#" className="project-link disabled">View Live</a>
                <a href="#" className="project-link disabled">GitHub</a>
              </div>
            </div>
          </div>

          {/* Project 4 */}
          <div className="project-card">
            <div className="project-content">
              <h3>Project 4</h3>
              <p>Project description will be updated soon.</p>
              <div className="project-tech">
                <span>Tech stack will be updated</span>
              </div>
              <div className="project-links">
                <a href="#" className="project-link disabled">View Live</a>
                <a href="#" className="project-link disabled">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="experience-section">
        <h2 className="section-title">Experience</h2>
        <div className="experience-card">
          <div className="experience-header">
            <h3>Backend Developer</h3>
            <span className="experience-date">March 2025 - March 2025</span>
          </div>
          <h4>IIT Roorkee Fitfusion hackathon Roorkee</h4>
          <ul className="experience-details">
            <li>Worked on the community page and the challenges feature of Fittlr app</li>
            <li>Developed backend services using Node.js and Express.js</li>
            <li>Implemented database models and queries using Prisma ORM with PostgreSQL</li>
            <li>Collaborated with a team of developers to create a comprehensive fitness solution</li>
          </ul>
          <div className="experience-tech">
            <span className="tech-tag">Node.js</span>
            <span className="tech-tag">Express.js</span>
            <span className="tech-tag">Prisma</span>
            <span className="tech-tag">PostgreSQL</span>
          </div>
        </div>
      </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-content">
          <div className="contact-header">
            <h3>Let's Connect</h3>
            <p>Ready to collaborate or have a question? Reach out through any of these platforms!</p>
          </div>
          
          <div className="contact-links">
            <a href="https://github.com/pankajbaid567" target="_blank" rel="noopener noreferrer" className="contact-link">
              <div className="contact-icon github-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </div>
              <span className="link-text">GitHub</span>
              <span className="link-desc">Check out my code</span>
            </a>
            
            <a href="https://leetcode.com/u/baidpankaj567/" target="_blank" rel="noopener noreferrer" className="contact-link">
              <div className="contact-icon leetcode-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z" />
                </svg>
              </div>
              <span className="link-text">LeetCode</span>
              <span className="link-desc">See my problem-solving</span>
            </a>
            
            <a href="mailto:pankaj.baid2024@nst.rishihood.edu.in" className="contact-link">
              <div className="contact-icon email-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <span className="link-text">Email</span>
              <span className="link-desc">Drop me a message</span>
            </a>
            
            <a href="https://www.linkedin.com/in/pankaj-baid-0109b1226/" target="_blank" rel="noopener noreferrer" className="contact-link">
              <div className="contact-icon linkedin-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </div>
              <span className="link-text">LinkedIn</span>
              <span className="link-desc">Connect professionally</span>
            </a>
          </div>
          
          <div className="contact-action">
            <p>Prefer direct contact?</p>
            <a href="mailto:pankaj.baid2024@nst.rishihood.edu.in" className="contact-button">
              Say Hello!
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Pankaj Baid. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App