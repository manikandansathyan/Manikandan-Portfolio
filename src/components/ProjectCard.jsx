import React, { useEffect, useRef, useState } from "react";

function ProjectCard({ project, index, onOpen }) {
  const { title, tagline, type, stack, image, a1, a2 } = project;

  const cardRef = useRef(null);
  const frame = useRef(0);
  const [visible, setVisible] = useState(false);

  /* Reveal once when the card scrolls into view */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const handleMouseMove = (e) => {
    if (e.pointerType === "touch") return;
    const card = e.currentTarget;
    const { clientX, clientY } = e;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      card.style.setProperty("--rx", `${(y / rect.height - 0.5) * -4}deg`);
      card.style.setProperty("--ry", `${(x / rect.width - 0.5) * 4}deg`);
    });
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    cancelAnimationFrame(frame.current);

    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "50%");
  };

  return (
    <article
      ref={cardRef}
      className={`proj-card ${visible ? "is-visible" : ""}`}
      style={{
        "--a1": a1,
        "--a2": a2,
        "--mx": "50%",
        "--my": "50%",
        "--rx": "0deg",
        "--ry": "0deg",
        "--delay": `${(index % 3) * 110}ms`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="proj-card-btn"
        onClick={onOpen}
        aria-label={`View details of ${title}`}
      >
        {/* COVER */}
        <div className="proj-cover">
          {image ? (
            <img
              src={image}
              alt={`${title} project preview`}
              loading="lazy"
              draggable="false"
            />
          ) : (
            <div className="proj-cover-art">
              <span className="proj-cover-mono">{title?.charAt(0)}</span>
              <span className="proj-cover-ring" />
            </div>
          )}

          <span className="proj-cover-shade" />
          <span className="proj-cover-spotlight" />
          <span className="proj-cover-sheen" />

          <span className="proj-badge">{type}</span>

          <span className="proj-open" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M9 7h8v8" />
            </svg>
          </span>
        </div>

        {/* META */}
        <div className="proj-meta">
          <div className="proj-meta-top">
            <span className="proj-no">{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
          </div>

          <p className="proj-tagline">{tagline}</p>

          <ul className="proj-stack">
            {stack?.slice(0, 3).map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
            {stack?.length > 3 && <li>+{stack.length - 3}</li>}
          </ul>
        </div>
      </button>
    </article>
  );
}

export default ProjectCard;