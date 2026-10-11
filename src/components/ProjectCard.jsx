import React from "react";

/**
 * Single project card
 *
 * Props:
 * - project
 * - index
 * - onOpen
 */

function ProjectCard({ project, index, onOpen }) {
  const {
    title,
    tagline,
    type,
    stack,
    image,
    a1,
    a2,
  } = project;

  /* =========================================================
     CURSOR TILT
  ========================================================= */

  const handleMouseMove = (e) => {
    const card = e.currentTarget;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX =
      ((y / rect.height) - 0.5) * -4;

    const rotateY =
      ((x / rect.width) - 0.5) * 4;

    card.style.setProperty(
      "--mx",
      `${x}px`
    );

    card.style.setProperty(
      "--my",
      `${y}px`
    );

    card.style.setProperty(
      "--rx",
      `${rotateX}deg`
    );

    card.style.setProperty(
      "--ry",
      `${rotateY}deg`
    );
  };


  /* =========================================================
     RESET TILT
  ========================================================= */

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;

    card.style.setProperty(
      "--rx",
      "0deg"
    );

    card.style.setProperty(
      "--ry",
      "0deg"
    );

    card.style.setProperty(
      "--mx",
      "50%"
    );

    card.style.setProperty(
      "--my",
      "50%"
    );
  };


  /* =========================================================
     KEYBOARD
  ========================================================= */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };


  return (
    <article
      className={`proj-card ${
        index % 3 === 1
          ? "proj-card--offset"
          : ""
      }`}

      style={{
        "--a1": a1,
        "--a2": a2,
        "--mx": "50%",
        "--my": "50%",
        "--rx": "0deg",
        "--ry": "0deg",
      }}

      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      <button
        type="button"
        className="proj-card-btn"
        onClick={onOpen}
        onKeyDown={handleKeyDown}
        aria-label={`View details of ${title}`}
      >

        {/* =================================================
            PROJECT COVER
        ================================================= */}

        <div className="proj-cover">

          {/* IMAGE */}

          {image ? (
            <img
              src={image}
              alt={`${title} project preview`}
              loading="lazy"
              draggable="false"
            />
          ) : (

            /* =============================================
               FALLBACK PROJECT ART
            ============================================= */

            <div className="proj-cover-art">

              <span className="proj-cover-mono">
                {title?.charAt(0)}
              </span>

              <span className="proj-cover-ring" />

            </div>
          )}


          {/* DARK GRADIENT */}

          <span className="proj-cover-shade" />


          {/* CURSOR SPOTLIGHT */}

          <span className="proj-cover-spotlight" />


          {/* PROJECT TYPE */}

          <span className="proj-badge">
            {type}
          </span>


          {/* OPEN ICON */}

          <span
            className="proj-open"
            aria-hidden="true"
          >

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >

              <path d="M7 17L17 7" />

              <path d="M9 7h8v8" />

            </svg>

          </span>

        </div>


        {/* =================================================
            PROJECT META
        ================================================= */}

        <div className="proj-meta">

          {/* TOP ROW */}

          <div className="proj-meta-top">

            <span className="proj-no">
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3>
              {title}
            </h3>

          </div>


          {/* TAGLINE */}

          <p className="proj-tagline">
            {tagline}
          </p>


          {/* STACK */}

          <ul className="proj-stack">

            {stack
              ?.slice(0, 3)
              .map((technology) => (

                <li key={technology}>
                  {technology}
                </li>

              ))}

            {stack?.length > 3 && (

              <li>
                +{stack.length - 3}
              </li>

            )}

          </ul>

        </div>

      </button>

    </article>
  );
}

export default ProjectCard;