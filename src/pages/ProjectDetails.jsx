import React, { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function ProjectDetails({
  project,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}) {
  const root = useRef(null);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const coverImgRef = useRef(null);
  const progressRef = useRef(null);
  const spotlightRef = useRef(null);
  const closing = useRef(false);
  const isFirstRender = useRef(true);

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
     CLOSE WITH EXIT ANIMATION
  ========================================================= */

  const handleClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;

    if (prefersReducedMotion()) {
      onClose();
      return;
    }

    gsap
      .timeline({ onComplete: onClose })
      .to(panelRef.current, {
        y: 40,
        opacity: 0,
        clipPath: "inset(0% 0% 12% 0% round 28px)",
        duration: 0.5,
        ease: "power3.in",
      })
      .to(
        backdropRef.current,
        { opacity: 0, duration: 0.35, ease: "power2.in" },
        "-=0.3"
      );
  }, [onClose]);

  /* =========================================================
     LOCK PAGE SCROLL + KEYBOARD CONTROLS
  ========================================================= */

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, onNext, onPrev]);

  /* =========================================================
     PANEL ENTRANCE (once, on mount)
  ========================================================= */

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(
        panelRef.current,
        {
          y: 70,
          opacity: 0,
          clipPath: "inset(14% 6% 0% 6% round 28px)",
        },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          duration: 1.1,
          ease: "expo.out",
          clearProps: "clipPath",
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  /* =========================================================
     CONTENT ANIMATION (on mount + every project change)
  ========================================================= */

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (prefersReducedMotion()) return;

    const delay = isFirstRender.current ? 0.35 : 0;
    isFirstRender.current = false;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay });

      /* Cover image: slow cinematic settle */
      tl.fromTo(
        ".pd-cover",
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "expo.inOut",
        },
        0
      ).fromTo(
        coverImgRef.current || ".pd-cover-art",
        { scale: 1.35 },
        { scale: 1, duration: 1.6, ease: "expo.out" },
        0
      );

      /* Title: masked word-by-word rise */
      tl.fromTo(
        ".pd-word",
        { yPercent: 115, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.07,
        },
        0.35
      );

      /* Everything else: soft stagger with blur-in */
      tl.fromTo(
        ".pd-anim:not(.pd-cover)",
        { opacity: 0, y: 28, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          clearProps: "filter",
        },
        0.45
      );

      /* Highlight dots pop in */
      tl.fromTo(
        ".pd-list-dot",
        { scale: 0 },
        {
          scale: 1,
          duration: 0.6,
          ease: "back.out(3)",
          stagger: 0.08,
        },
        0.9
      );

      /* Stack chips cascade */
      tl.fromTo(
        ".pd-stack li",
        { opacity: 0, y: 12, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.8)",
          stagger: 0.05,
        },
        0.9
      );
    }, root);

    return () => ctx.revert();
  }, [project.id]);

  /* =========================================================
     SCROLL: PROGRESS BAR + COVER PARALLAX
  ========================================================= */

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller || prefersReducedMotion()) return;

    const setProgress = gsap.quickSetter(progressRef.current, "scaleX");

    const onScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      const progress = max > 0 ? scroller.scrollTop / max : 0;
      setProgress(progress);

      const target = coverImgRef.current;
      if (target) {
        gsap.set(target, { y: scroller.scrollTop * 0.25 });
      }
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => scroller.removeEventListener("scroll", onScroll);
  }, [project.id]);

  /* =========================================================
     CURSOR SPOTLIGHT + MAGNETIC BUTTONS
  ========================================================= */

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia?.("(hover: none)").matches) return;

    const panel = panelRef.current;
    const spot = spotlightRef.current;
    if (!panel || !spot) return;

    /* Spotlight follows the cursor with inertia */
    const moveX = gsap.quickTo(spot, "x", { duration: 0.8, ease: "power3" });
    const moveY = gsap.quickTo(spot, "y", { duration: 0.8, ease: "power3" });

    const onMove = (e) => {
      const rect = panel.getBoundingClientRect();
      moveX(e.clientX - rect.left);
      moveY(e.clientY - rect.top);
    };

    const onEnter = () =>
      gsap.to(spot, { opacity: 1, duration: 0.6, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(spot, { opacity: 0, duration: 0.6, ease: "power2.out" });

    panel.addEventListener("mousemove", onMove);
    panel.addEventListener("mouseenter", onEnter);
    panel.addEventListener("mouseleave", onLeave);

    /* Magnetic pull on nav + link buttons */
    const magnets = panel.querySelectorAll(".pd-nav button, .pd-btn");
    const cleanups = [];

    magnets.forEach((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const my = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

      const move = (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.3);
        my((e.clientY - (r.top + r.height / 2)) * 0.3);
      };
      const leave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.45)",
        });
      };

      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    });

    return () => {
      panel.removeEventListener("mousemove", onMove);
      panel.removeEventListener("mouseenter", onEnter);
      panel.removeEventListener("mouseleave", onLeave);
      cleanups.forEach((fn) => fn());
    };
  }, [project.id]);

  /* =========================================================
     HELPERS
  ========================================================= */

  /* Split title into masked words for the reveal */
  const titleWords = (title || "").split(" ");

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
      {/* BACKDROP */}

      <div
        ref={backdropRef}
        className="pd-backdrop"
        onClick={handleClose}
        aria-hidden="true"
        style={{
          backdropFilter: "blur(14px) saturate(120%)",
          WebkitBackdropFilter: "blur(14px) saturate(120%)",
        }}
      />

      {/* PANEL */}

      <div
        ref={panelRef}
        className="pd-panel"
        style={{
          "--a1": a1,
          "--a2": a2,
          willChange: "transform, opacity, clip-path",
        }}
      >
        {/* SCROLL PROGRESS (accent gradient) */}

        <div
          ref={progressRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            zIndex: 20,
            transformOrigin: "left center",
            transform: "scaleX(0)",
            background: `linear-gradient(90deg, ${a1}, ${a2})`,
            pointerEvents: "none",
          }}
        />

        {/* CURSOR SPOTLIGHT */}

        <div
          ref={spotlightRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -300,
            left: -300,
            width: 600,
            height: 600,
            borderRadius: "50%",
            opacity: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: `radial-gradient(circle, ${a2}26 0%, ${a1}10 40%, transparent 70%)`,
            willChange: "transform",
          }}
        />

        {/* TOP BAR */}

        <div className="pd-bar">
          <span className="pd-count">
            {String(index + 1).padStart(2, "0")}
            <i>/</i>
            {String(total).padStart(2, "0")}
          </span>

          <div className="pd-nav">
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

            <button
              type="button"
              onClick={handleClose}
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

        {/* SCROLLABLE CONTENT */}

        <div ref={scrollRef} className="pd-scroll" data-lenis-prevent>
          {/* COVER */}

          <div className="pd-cover pd-anim" style={{ overflow: "hidden" }}>
            {image ? (
              <img
                ref={coverImgRef}
                src={image}
                alt={`${title} project preview`}
                draggable="false"
                style={{ willChange: "transform" }}
              />
            ) : (
              <div className="pd-cover-art">
                <span>{title?.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* CONTENT */}

          <div className="pd-content">
            {/* MAIN */}

            <main className="pd-main">
              <p className="pd-type pd-anim">{type}</p>

              {/* Title with masked word reveal */}

              <h3 className="pd-title" aria-label={title}>
                {titleWords.map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    aria-hidden="true"
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      verticalAlign: "top",
                      paddingBottom: "0.12em",
                      marginBottom: "-0.12em",
                    }}
                  >
                    <span
                      className="pd-word"
                      style={{ display: "inline-block", willChange: "transform" }}
                    >
                      {word}
                      {i < titleWords.length - 1 ? "\u00A0" : ""}
                    </span>
                  </span>
                ))}
              </h3>

              <p className="pd-tagline pd-anim">{tagline}</p>

              <p className="pd-desc pd-anim">{description}</p>

              <h4 className="pd-sub pd-anim">Highlights</h4>

              <ul className="pd-list">
                {highlights?.map((highlight, highlightIndex) => (
                  <li
                    key={`${highlight}-${highlightIndex}`}
                    className="pd-anim"
                  >
                    <span className="pd-list-dot" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </main>

            {/* SIDE */}

            <aside className="pd-side">
              <div className="pd-side-block pd-anim">
                <span className="pd-label">Role</span>
                <p>{role}</p>
              </div>

              <div className="pd-side-block pd-anim">
                <span className="pd-label">Stack</span>

                <ul className="pd-stack">
                  {stack?.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </div>

              {(live || code) && (
                <div className="pd-links pd-anim">
                  {live && (
                    <a
                      href={live}
                      target="_blank"
                      rel="noreferrer"
                      className="pd-btn pd-btn--accent"
                    >
                      <span>Live Site</span>
                      <span>↗</span>
                    </a>
                  )}

                  {code && (
                    <a
                      href={code}
                      target="_blank"
                      rel="noreferrer"
                      className="pd-btn pd-btn--ghost"
                    >
                      <span>Source Code</span>
                      <span>↗</span>
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