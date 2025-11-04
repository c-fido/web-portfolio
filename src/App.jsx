import './App.css'

function App() {
  const projects = [
    {
      title: "Sports Warehouse",
      description: "A mobile app made for a Software Engineering class project. Allows users to browse and purchase sports equipment.",
      technologies: ["Javascript", "React", "PHP", "MongoDB"]
    },
    {
      title: "Portfolio Website",
      description: "The site you are visiting now! Made for showcasing my projects and experience.",
      technologies: ["JavaScript", "React", "TailwindCSS"]
    },
    {
      title: "Simple Web Scanner",
      description: "Simple web vulnerability scanner built in Python for educational purposes. Detects common vulnerabilities such as XSS, SQL Injection, and Open Redirects.",
      technologies: ["Python", "BeautifulSoup"]
    }
  ];

  const experience = [
    {
      role: "Intern",
      company: "turingpoint.",
      period: "Sep 2025 - Present",
      description: "Developed a web database containing web vulnerabilities and exploits for client and developer use. Designed in Figma and implemented web scraping using Python's BeautifulSoup library.",
      technologies: ["Python", "BeautifulSoup", "OpenAI API", "LiteLLM", "Brave Search API", "Figma"],
    }
  ];
  const technologies = {
    languages: ["JavaScript", "Python", "Java", "C++", "HTML", "CSS"],
    frameworks: ["React", "Node.js", "Express", "TailwindCSS"],
    tools: ["Git", "MongoDB", "MySQL", "Figma", "VS Code"],
    concepts: ["REST APIs", "Web Security", "Database Design", "Responsive Design"]
  };

  return (
    <div className="portfolio-container">
      <main className="portfolio-content">
        {/* Header Section */}
        <header className="header-section">
          <div className="header-content">
            <h1>Giancarlo Fedolfi</h1>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/giancarlo-fedolfi-652026306/" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="mailto:fedolficarlo@gmail.com" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.955l9.409 7.051 9.409-7.051h.955c.904 0 1.636.732 1.636 1.636z" />
                </svg>
              </a>
              <a href="https://github.com/c-fido" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
          <p className="tagline">Full Time Student studying Computer Science and German</p>
          <p className="intro">
            I love learning more about web development, software engineering, and cybersecurity. Reach out with the buttons above!
          </p>
        </header>


        {/* Projects Section */}
        <section className="projects-section">
          <h2>Featured Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-stack">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="experience-section">
          <h2>Experience</h2>
          <div className="experience-list">
            {experience.map((job, index) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <h3>{job.role}</h3>
                  <span className="company">{job.company}</span>
                  <span className="period">{job.period}</span>
                </div>
                <p style={{ marginBottom: '24px' }}>{job.description}</p>
                <div className="tech-stack">
                  {job.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technologies Section */}
        <section className="technologies-section">
          <h2>Technologies</h2>
          <div className="tech-categories">
            <div className="tech-category">
              <h3>Languages</h3>
              <div className="tech-stack">
                {technologies.languages.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
            <div className="tech-category">
              <h3>Frameworks & Libraries</h3>
              <div className="tech-stack">
                {technologies.frameworks.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
            <div className="tech-category">
              <h3>Tools & Databases</h3>
              <div className="tech-stack">
                {technologies.tools.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
            <div className="tech-category">
              <h3>Concepts</h3>
              <div className="tech-stack">
                {technologies.concepts.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}

      </main>
    </div>
  )
}

export default App
