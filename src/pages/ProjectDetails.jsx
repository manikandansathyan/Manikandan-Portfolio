import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function ProjectDetails({
  project,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}) {
  const root = useRef(null);

  const {
    title,
    tagline,
    type,
    role,
    description,
    highlights,
    stack,
    image,
    live,
    code,
    a1,
    a2,
  } = project;

  /* =========================================================
     LOCK PAGE SCROLL + KEYBOARD CONTROLS
  ========================================================= */

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }

      if (event.key === "ArrowLeft") {
        onPrev();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose, onNext, onPrev]);


  /* =========================================================
     ENTRANCE ANIMATION
  ========================================================= */

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Backdrop */

      gsap.fromTo(
        ".pd-backdrop",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        }
      );


      /* Main panel */

      gsap.fromTo(
        ".pd-panel",
        {
          yPercent: 8,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power4.out",
        }
      );


      /* Content */

      gsap.from(
        ".pd-anim",
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          delay: 0.2,
        }
      );

    }, root);

    return () => ctx.revert();
  }, [project.id]);


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      ref={root}
      className="pd"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} details`}
    >

      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <div
        className="pd-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />


      {/* =====================================================
          PANEL
      ===================================================== */}

      <div
        className="pd-panel"
        style={{
          "--a1": a1,
          "--a2": a2,
        }}
      >

        {/* ===================================================
            TOP BAR
        =================================================== */}

        <div className="pd-bar">

          {/* PROJECT COUNT */}

          <span className="pd-count">
            {String(index + 1).padStart(2, "0")}

            <i>/</i>

            {String(total).padStart(2, "0")}
          </span>


          {/* NAVIGATION */}

          <div className="pd-nav">

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous project"
            >
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
                <path d="M19 12H5" />
                <path d="M11 6l-6 6 6 6" />
              </svg>
            </button>


            {/* NEXT */}

            <button
              type="button"
              onClick={onNext}
              aria-label="Next project"
            >
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
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </button>


            {/* CLOSE */}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="pd-close"
            >
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
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>

          </div>

        </div>


        {/* ===================================================
            SCROLLABLE CONTENT
        =================================================== */}

        <div
          className="pd-scroll"
          data-lenis-prevent
        >

          {/* =================================================
              PROJECT COVER
          ================================================= */}

          <div className="pd-cover pd-anim">

            {image ? (

              <img
                src={image}
                alt={`${title} project preview`}
                draggable="false"
              />

            ) : (

              <div className="pd-cover-art">

                <span>
                  {title?.charAt(0)}
                </span>

              </div>

            )}

          </div>


          {/* =================================================
              PROJECT CONTENT
          ================================================= */}

          <div className="pd-content">


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="pd-main">

              {/* TYPE */}

              <p className="pd-type pd-anim">
                {type}
              </p>


              {/* TITLE */}

              <h3 className="pd-title pd-anim">
                {title}
              </h3>


              {/* TAGLINE */}

              <p className="pd-tagline pd-anim">
                {tagline}
              </p>


              {/* DESCRIPTION */}

              <p className="pd-desc pd-anim">
                {description}
              </p>


              {/* HIGHLIGHTS */}

              <h4 className="pd-sub pd-anim">
                Highlights
              </h4>


              <ul className="pd-list">

                {highlights?.map(
                  (highlight, highlightIndex) => (

                    <li
                      key={`${highlight}-${highlightIndex}`}
                      className="pd-anim"
                    >

                      <span className="pd-list-dot" />

                      <span>
                        {highlight}
                      </span>

                    </li>

                  )
                )}

              </ul>

            </main>


            {/* =================================================
                SIDE INFORMATION
            ================================================= */}

            <aside className="pd-side">


              {/* ROLE */}

              <div className="pd-side-block pd-anim">

                <span className="pd-label">
                  Role
                </span>

                <p>
                  {role}
                </p>

              </div>


              {/* STACK */}

              <div className="pd-side-block pd-anim">

                <span className="pd-label">
                  Stack
                </span>

                <ul className="pd-stack">

                  {stack?.map(
                    (technology) => (

                      <li key={technology}>
                        {technology}
                      </li>

                    )
                  )}

                </ul>

              </div>


              {/* LINKS */}

              {(live || code) && (

                <div className="pd-links pd-anim">

                  {live && (

                    <a
                      href={live}
                      target="_blank"
                      rel="noreferrer"
                      className="pd-btn pd-btn--accent"
                    >
                      <span>
                        Live Site
                      </span>

                      <span>
                        ↗
                      </span>
                    </a>

                  )}


                  {code && (

                    <a
                      href={code}
                      target="_blank"
                      rel="noreferrer"
                      className="pd-btn pd-btn--ghost"
                    >
                      <span>
                        Source Code
                      </span>

                      <span>
                        ↗
                      </span>
                    </a>

                  )}

                </div>

              )}

            </aside>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProjectDetails;