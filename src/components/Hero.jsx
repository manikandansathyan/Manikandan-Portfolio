import {
  ArrowDown,
  ArrowUpRight,
  Download,
  Mail,
} from "lucide-react";

function Hero() {
  return (
    <section className="hero" id="home">
      {/* Background effects */}
      <div className="hero-grid"></div>
      <div className="hero-noise"></div>

      <div className="hero-orb hero-orb-one"></div>
      <div className="hero-orb hero-orb-two"></div>
      <div className="hero-orb hero-orb-three"></div>

      {/* Navigation */}
      <header className="hero-nav">
        <a href="#home" className="hero-logo">
          <span className="logo-mark">M</span>
          <span className="logo-name">Manikandan S</span>
        </a>

        <nav className="hero-menu">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Works</a>
          <a href="#contact">Contact</a>
        </nav>

       

        <button className="hero-mobile-menu" aria-label="Open menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Hero content */}
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-intro">
            <span className="hero-status-dot"></span>
            <span>Available for opportunities</span>
          </div>

          <p className="hero-greeting">
            Hi, I'm <span>Manikandan S</span>
          </p>

          <h1 className="hero-title">
            <span>Angular Developer</span>
            <strong>&amp; Frontend Engineer</strong>
          </h1>

          <p className="hero-description">
            I build modern, responsive and user-focused web applications
            with clean interfaces, smooth interactions and scalable
            frontend architecture.
          </p>

          <div className="hero-actions">
            <a href="/Manikandan S.pdf" className="hero-primary-btn" download>
              <span>Download Resume</span>
              <Download size={17} />
            </a>

            <a href="#projects" className="hero-secondary-btn">
              <span>View my work</span>
              <ArrowDown size={17} />
            </a>
          </div>

          <div className="hero-socials">
            <a
              href="https://github.com/YOUR_USERNAME"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              GH
            </a>

            <a
              href="https://www.linkedin.com/in/manikandan-sathyan/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              in
            </a>

            <a
              href="mailto:manikandansathyan02@gmail.com"
              aria-label="Email"
            >
              <Mail size={17} />
            </a>
          </div>
        </div>

        {/* Portrait */}
        <div className="hero-visual">
          <div className="hero-image-glow"></div>

          <div className="hero-image-wrapper">
            <div className="hero-image-border"></div>

            <img
              src="/hero.png"
              alt="Manikandan"
              className="hero-image"
            />

            <div className="hero-image-overlay"></div>
          </div>

          {/* Floating tech card */}
          <div className="hero-floating-card hero-card-top">
            <span className="floating-card-dot"></span>
            <div>
              <small>Currently</small>
              <strong>Building with Angular</strong>
            </div>
          </div>

          <div className="hero-floating-card hero-card-bottom">
            <span className="floating-number">01</span>
            <div>
              <small>Specialized in</small>
              <strong>Frontend Development</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom information */}
      <div className="hero-bottom">
        <div className="hero-scroll">
          <span className="scroll-line"></span>
          <span>Scroll to explore</span>
        </div>

        <div className="hero-stack">
          <span>Angular</span>
          <i></i>
          <span>React</span>
          <i></i>
          <span>JavaScript</span>
          <i></i>
          <span>TypeScript</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;