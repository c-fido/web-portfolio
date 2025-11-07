import { useState, useEffect } from 'react';
import './index.css';

const content = {
  en: {
    name: "Giancarlo Fedolfi",
    tagline: "Software Engineer • Student-Athlete",
    intro: "I love learning more about web development, software engineering, and cybersecurity. Reach out with the buttons above!",

    projects: {
      title: "Featured Projects",
      items: [
        {
          title: "Sports Warehouse",
          description: "A mobile app made for a Software Engineering class project. Allows users to browse and purchase sports equipment.",
          tech: ["React", "JavaScript", "MongoDB", "PHP", "SQL"]
        },
        {
          title: "Simple Web Scanner",
          description: "Simple web vulnerability scanner built in Python for educational purposes. Detects common vulnerabilities such as XSS, SQL Injection, and Open Redirects.",
          tech: ["Python", "Requests", "BeautifulSoup"]
        },
        {
          title: "Portfolio Website",
          description: "The site you are visiting now! Made for showcasing my projects and experience.",
          tech: ["JavaScript", "React", "CSS", "HTML"]
        }
      ]
    },

    experience: {
      title: "Experience",
      items: [
        {
          title: "Cybersecurity Intern",
          company: "turingpoint.",
          period: "Sep. 2025 - Present",
          description: "Working with Python to create scripts that automate the creation of a database of known vulnerabilities and exploits. Designed and created the database, worked with LiteLLM, Brave Search API, and Figma."
        },
        {
          title: "Student-Athlete",
          company: "Wesleyan University",
          period: "Sept. 2023 - May. 2027",
          description: "Pursuing Bachelor's degree while competing as a student-athlete. Balancing rigorous academic coursework with athletic commitments, developing strong time management and leadership skills."
        }
      ]
    },

    technologies: {
      title: "Technologies",
      categories: [
        {
          name: "Frontend",
          tech: ["React", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3"]
        },
        {
          name: "Backend",
          tech: ["Node.js", "Python", "Java", "C++", "REST APIs"]
        },
        {
          name: "Database",
          tech: ["MongoDB", "MySQL"]
        }
      ]
    }
  },

  de: {
    name: "Giancarlo Fedolfi",
    tagline: "Softwareentwickler • Student und Sportler",
    intro: "Ich liebe es, mehr über Webentwicklung, Softwareentwicklung und Cybersicherheit zu lernen. Kontaktieren Sie mich über die Schaltflächen oben!",

    projects: {
      title: "Ausgewählte Projekte",
      items: [
        {
          title: "Sports Warehouse",
          description: "Eine mobile App, die für ein Projekt im Software-Engineering-Kurs entwickelt wurde. Ermöglicht es Benutzern, Sportgeräte zu suchen und zu kaufen",
          tech: ["React", "JavaScript", "MongoDB", "PHP", "SQL"]
        },
        {
          title: "Einfacher Web-Scanner",
          description: "Einfacher Web-Scanner für Sicherheitslücken, der zu Bildungszwecken in Python erstellt wurde. Erkennt gängige Schwachstellen wie XSS, SQL-Injection und offene Weiterleitungen.",
          tech: ["Python", "Requests", "BeautifulSoup"]
        },
        {
          title: "Portfolio-Website",
          description: "Die Website, die Sie gerade besuchen! Erstellt, um meine Projekte und Erfahrungen zu präsentieren.",
          tech: ["JavaScript", "React", "CSS", "HTML"]
        }
      ]
    },

    experience: {
      title: "Erfahrung",
      items: [
        {
          title: "Praktikant im Bereich Cybersicherheit“",
          company: "turingpoint.",
          period: "Sep. 2025 - Heute",
          description: "Erstellung von Skripten mit Python zur Automatisierung der Erstellung einer Datenbank mit bekannten Schwachstellen und Exploits. Entwurf und Erstellung der Datenbank, Arbeit mit LiteLLM, Brave Search API und Figma"
        },
        {
          title: "Studentischer Sportler",
          company: "Wesleyan University",
          period: "2023 - 2027",
          description: "Erwerb eines Bachelor-Abschlusses bei gleichzeitiger Teilnahme an Wettkämpfen als Student-Athlet. Vereinbarkeit von anspruchsvollen akademischen Studienleistungen und sportlichen Verpflichtungen, Entwicklung ausgeprägter Zeitmanagement- und Führungskompetenzen."
        }
      ]
    },

    technologies: {
      title: "Technologien",
      categories: [
        {
          name: "Frontend",
          tech: ["React", "Vue.js", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"]
        },
        {
          name: "Backend",
          tech: ["Node.js", "Express", "Python", "Java", "C++", "REST APIs", "GraphQL"]
        },
        {
          name: "Datenbank",
          tech: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "Redis"]
        }
      ]
    }
  }
};

function App() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  // Cursor follow effect
  useEffect(() => {
    // Create cursor glow element
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    const updateCursor = (e) => {
      // Always update cursor position, never hide it
      document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
    };

    // Add mousemove listener
    document.addEventListener('mousemove', updateCursor);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', updateCursor);
      if (cursorGlow && cursorGlow.parentNode) {
        cursorGlow.parentNode.removeChild(cursorGlow);
      }
    };
  }, []);

  const currentContent = content[language];

  return (
    <div className="portfolio-container">
      <button
        className="language-toggle"
        onClick={toggleLanguage}
      >
        {language === 'en' ? 'DE' : 'EN'}
      </button>

      <div className="portfolio-content">
        <header className="header-section">
          <div className="header-content">
            <h1>{currentContent.name}</h1>
            <div className="social-links">
              <a href="https://github.com/c-fido" className="social-link" target="_blank" rel="noopener noreferrer">
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/giancarlo-fedolfi-652026306/" className="social-link" target="_blank" rel="noopener noreferrer">
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="mailto:fedolficarlo@gmail.com" className="social-link">
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.953l9.411 7.058 9.411-7.058h.953c.904 0 1.636.732 1.636 1.636z" />
                </svg>
              </a>
            </div>
          </div>
          <p className="tagline">{currentContent.tagline}</p>
          <p className="intro">{currentContent.intro}</p>
        </header>

        <section className="projects-section">
          <h2>{currentContent.projects.title}</h2>
          <div className="projects-grid">
            {currentContent.projects.items.map((project, index) => (
              <div key={index} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-stack">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="experience-section">
          <h2>{currentContent.experience.title}</h2>
          <div className="experience-list">
            {currentContent.experience.items.map((item, index) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <h3>{item.title}</h3>
                  <div className="company">{item.company}</div>
                  <div className="period">{item.period}</div>
                </div>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="technologies-section">
          <h2>{currentContent.technologies.title}</h2>
          <div className="tech-categories">
            {currentContent.technologies.categories.map((category, index) => (
              <div key={index} className="tech-category">
                <h3>{category.name}</h3>
                <div className="tech-stack">
                  {category.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
