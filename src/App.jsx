import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [typingText, setTypingText] = useState('');
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const skills = ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Prisma', 'TypeScript', 'Tailwind CSS'];

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

      // Handle scroll animations
      const elements = document.querySelectorAll('.skill-card, .project-card, .stat-item, .education-item, .cert-card, .contact-link');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('fade-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial call to set the active section on page load
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Typing animation effect
  useEffect(() => {
    const typeText = () => {
      const currentSkill = skills[currentSkillIndex];
      let i = 0;
      
      const typeInterval = setInterval(() => {
        if (i <= currentSkill.length) {
          setTypingText(currentSkill.substring(0, i));
          i++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            const eraseInterval = setInterval(() => {
              if (i >= 0) {
                setTypingText(currentSkill.substring(0, i));
                i--;
              } else {
                clearInterval(eraseInterval);
                setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
              }
            }, 50);
          }, 2000);
        }
      }, 100);
    };

    const timer = setTimeout(typeText, 1000);
    return () => clearTimeout(timer);
  }, [currentSkillIndex, skills]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="portfolio">
      {/* Particle Background */}
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>
      
      {/* Header/Navigation */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <h1 className="logo">Pankaj Baid</h1>
          <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <ul>
              <li><button className={activeSection === 'home' ? 'active' : ''} onClick={() => scrollToSection('home')}>Home</button></li>
              <li><button className={activeSection === 'about' ? 'active' : ''} onClick={() => scrollToSection('about')}>About</button></li>
              <li><button className={activeSection === 'skills' ? 'active' : ''} onClick={() => scrollToSection('skills')}>Skills</button></li>
              <li><button className={activeSection === 'projects' ? 'active' : ''} onClick={() => scrollToSection('projects')}>Projects</button></li>
              <li><button className={activeSection === 'experience' ? 'active' : ''} onClick={() => scrollToSection('experience')}>Experience</button></li>
              <li><button className={activeSection === 'education' ? 'active' : ''} onClick={() => scrollToSection('education')}>Education</button></li>
              <li><button className={activeSection === 'contact' ? 'active' : ''} onClick={() => scrollToSection('contact')}>Contact</button></li>
            </ul>
          </nav>
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="profile-image-container">
            <img src="/media/images/pankaj.jpeg" alt="Pankaj Baid" className="profile-image" />
          </div>
          <h1>Hi, I'm Pankaj Baid</h1>
          <h2>Full Stack Developer</h2>
          <div className="typing-container">
            <p>Passionate about building scalable web applications with</p>
            <span className="typing-text">{typingText}</span>
            <span className="typing-cursor">|</span>
          </div>
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
            Full Stack Developer skilled in React.js, Next.js, Tailwind CSS, Express.js, MongoDB, Prisma, PostgreSQL with strong 
            problem-solving skills. LeetCode 100+ and CodeChef 100+ problems solved with 1239 contest rating at CodeChef. 
            Active open source contributor with 80+ GitHub contributions and 1 merged PR. Passionate about building 
            full-stack web applications and continuously learning new technologies.
          </p>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">LeetCode Problems</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">CodeChef Problems</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1239</span>
              <span className="stat-label">CodeChef Rating</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">80+</span>
              <span className="stat-label">GitHub Contributions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <h2 className="section-title">Skills</h2>
        <div className="skills-grid">
          <div className="skill-card">
            <h3>Frontend</h3>
            <ul>
              <li>React.js</li>
              <li>Next.js</li>
              <li>Tailwind CSS</li>
              <li>JavaScript</li>
              <li>TypeScript</li>
            </ul>
          </div>
          <div className="skill-card">
            <h3>Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>RESTful APIs</li>
              <li>Socket.IO</li>
            </ul>
          </div>
          <div className="skill-card">
            <h3>Databases</h3>
            <ul>
              <li>PostgreSQL</li>
              <li>MongoDB</li>
              <li>Prisma ORM</li>
              <li>MySQL</li>
            </ul>
          </div>
          <div className="skill-card">
            <h3>Languages</h3>
            <ul>
              <li>C++</li>
              <li>JavaScript</li>
              <li>Python</li>
              <li>HTML/CSS</li>
            </ul>
          </div>
          <div className="skill-card">
            <h3>Mobile</h3>
            <ul>
              <li>React Native</li>
              <li>Cross-platform</li>
            </ul>
          </div>
          <div className="skill-card">
            <h3>Tools</h3>
            <ul>
              <li>Git</li>
              <li>VS Code</li>
              <li>Redux</li>
              <li>npm/yarn</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {/* DevHub+ Project */}
          <div className="project-card featured">
            <div className="project-content">
              <h3>DevHub+</h3>
              <p>Built with React.js, React Router, Tailwind CSS, TypeScript on the frontend and Express.js, Prisma ORM with PostgreSQL, Socket.IO on the backend. Enables developers to analyze and optimize resumes using AI-powered analysis, career roadmap with Gemini API. Features comprehensive developer tools including collaborative whiteboards using websockets, AI mentoring system, social networking platform, and serving as a complete developer productivity suite.</p>
              <div className="project-tech">
                <span>React.js</span>
                <span>Express.js</span>
                <span>Prisma</span>
                <span>PostgreSQL</span>
                <span>Socket.IO</span>
                <span>Tailwind CSS</span>
                <span>TypeScript</span>
              </div>
              <div className="project-links">
                <a href="#" className="project-link">View Live</a>
                <a href="https://github.com/pankajbaid567/DevHub" target="_blank" rel="noopener noreferrer" className="project-link github-link">GitHub</a>
              </div>
            </div>
          </div>

          {/* RasaYatra Project */}
          <div className="project-card">
            <div className="project-content">
              <h3>RasaYatra</h3>
              <p>Built with React.js, React Router, CSS, Framer Motion on the frontend and Express.js, Prisma ORM with PostgreSQL on the backend. Enables users to search and discover authentic Indian recipes in milliseconds with lightning-fast performance. With planned integration of advanced features and an ever-growing database of authentic recipes.</p>
              <div className="project-tech">
                <span>React.js</span>
                <span>Express.js</span>
                <span>Prisma</span>
                <span>PostgreSQL</span>
                <span>Framer Motion</span>
                <span>CSS</span>
              </div>
              <div className="project-links">
                <a href="#" className="project-link">View Live</a>
                <a href="https://github.com/pankajbaid567/RasaYatra" target="_blank" rel="noopener noreferrer" className="project-link github-link">GitHub</a>
              </div>
            </div>
          </div>

          {/* FitFusion Project */}
          <div className="project-card">
            <div className="project-content">
              <h3>FitFusion</h3>
              <p>Built a fitness app using React Native and Express, Prisma PostgreSQL on backend. Secured 2nd position at IIT Roorkee hackathon. Features include community challenges, workout tracking, and social fitness features.</p>
              <div className="project-tech">
                <span>React Native</span>
                <span>Express.js</span>
                <span>Prisma</span>
                <span>PostgreSQL</span>
                <span>Mobile App</span>
              </div>
              <div className="project-links">
                <a href="#" className="project-link">View Live</a>
                <a href="https://github.com/pankajbaid567/FitFusion" target="_blank" rel="noopener noreferrer" className="project-link github-link">GitHub</a>
              </div>
            </div>
          </div>

          {/* Zerodha Clone */}
          <div className="project-card">
            <div className="project-content">
              <h3>Zerodha Clone</h3>
              <p>A frontend clone of Zerodha built using React.js, designed to replicate its clean and responsive UI. This project focuses on modern UI/UX practices, smooth navigation, and scalable component-based architecture.</p>
              <div className="project-tech">
                <span>React.js</span>
                <span>Bootstrap</span>
                <span>CSS</span>
                <span>JavaScript</span>
              </div>
              <div className="project-links">
                <a href="https://zerodha-weld-five.vercel.app/" target="_blank" rel="noopener noreferrer" className="project-link">View Live</a>
                <a href="https://github.com/pankajbaid567/zerodha" target="_blank" rel="noopener noreferrer" className="project-link github-link">GitHub</a>
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
            <h3>Cofounder & Backend Developer</h3>
            <span className="experience-date">September 2024 - July 2025</span>
          </div>
          <h4>Inculcate Rishihood, Sonipat</h4>
          <ul className="experience-details">
            <li>Designed and implemented scalable RESTful APIs and database queries and schema design</li>
            <li>Integrated Node Cache (in memory caching system) to reduce repetitive db calls cutting API latency by 50%</li>
            <li>Led backend architecture decisions and database optimization</li>
            <li>Collaborated with frontend team to ensure seamless API integration</li>
          </ul>
          <div className="experience-tech">
            <span className="tech-tag">Node.js</span>
            <span className="tech-tag">Express.js</span>
            <span className="tech-tag">Prisma</span>
            <span className="tech-tag">PostgreSQL</span>
            <span className="tech-tag">Node Cache</span>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="education-section">
        <h2 className="section-title">Education</h2>
        <div className="education-timeline">
          <div className="education-item">
            <div className="education-header">
              <h3>Bachelor of Technology (Artificial Intelligence)</h3>
              <span className="education-date">2024 - 2028</span>
            </div>
            <h4>Newton School of Technology, Rishihood University</h4>
            <p className="education-grade">Grade: 9.043/10.0</p>
          </div>
          
          <div className="education-item">
            <div className="education-header">
              <h3>Intermediate (Class XII)</h3>
              <span className="education-date">2022 - 2023</span>
            </div>
            <h4>DAV RB KEDIA</h4>
            <p className="education-grade">Grade: 86.0%</p>
          </div>
          
          <div className="education-item">
            <div className="education-header">
              <h3>Matriculation (Class X)</h3>
              <span className="education-date">2020 - 2021</span>
            </div>
            <h4>DAV RB KEDIA</h4>
            <p className="education-grade">Grade: 92.33%</p>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="certifications-section">
        <h2 className="section-title">Certifications & Achievements</h2>
        <div className="certifications-grid">
          <div className="cert-card">
            <h3>SIH Internal Hackathon</h3>
            <p>Rishihood, SIH</p>
            <span className="cert-date">September 2025</span>
            <p className="cert-desc">Cleared SIH internal hackathon 2x</p>
          </div>
          
          <div className="cert-card">
            <h3>FitFusion IIT R Hackathon</h3>
            <p>IIT Roorkee</p>
            <span className="cert-date">April 2025</span>
            <p className="cert-desc">Built a fitness app using React Native and Express, Prisma PostgreSQL on backend and Secured 2nd position.</p>
          </div>
          
          <div className="cert-card">
            <h3>Open Source Contributor</h3>
            <p>RISC-V DB</p>
            <span className="cert-date">Ongoing</span>
            <p className="cert-desc">Active open source contributor with 1 merged PR and 80+ GitHub contributions</p>
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
              <span className="link-desc">pankaj.baid2024@nst.rishihood.edu.in</span>
            </a>
            
            <a href="tel:+918290688843" className="contact-link">
              <div className="contact-icon phone-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <span className="link-text">Phone</span>
              <span className="link-desc">+91 8290688843</span>
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
            <p>Ready to collaborate or have a question?</p>
            <a href="mailto:pankaj.baid2024@nst.rishihood.edu.in" className="contact-button">
              Let's Connect!
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