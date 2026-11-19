import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ProjectCard from "./ProjectCard";
import ProjectDetails from "../pages/ProjectDetails";
import { PROJECTS } from "../data/Projects";

gsap.registerPlugin(ScrollTrigger);

const FILTERS = ["All", "Website", "Web App"];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const hasHover = () =>
  typeof window !== "undefined" &&
  !window.matchMedia?.("(hover: none)").matches;

function Projects() {
  const root = useRef(null);
  const countRef = useRef(null);

  const [filter, setFilter] = useState("All");
  const [activeId, setActiveId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);

  const list = useMemo(() => {
    if (filter === "All") return PROJECTS;
    return PROJECTS.filter((project) => project.type === filter);
  }, [filter]);

  const visibleProjects = list.slice(0, visibleCount);
  const hasMore = visibleCount < list.length;

  const activeIndex = list.findIndex((project) => project.id === activeId);
  const active = activeIndex >= 0 ? list[activeIndex] : null;

  /* ========================================================
     INTRO ANIMATION (once)
  ======================================================== */

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      /* Title: masked characters rise with a slight tilt */
      gsap.from(gsap.utils.toArray(".proj-char"), {
        yPercent: 118,
        rotate: 6,
        duration: 1.3,
        ease: "power4.out",
        stagger: { each: 0.035, from: "start" },
        scrollTrigger: {
          trigger: ".proj-title",
          start: "top 85%",
          once: true,
        },
      });

      /* Eyebrow line draws itself */
      gsap.from(".proj-eyebrow-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".proj-head",
          start: "top 85%",
          once: true,
        },
      });

      /* Eyebrow, intro and filters: soft blur-in */
      gsap.from(".proj-eyebrow, .proj-intro, .proj-filters", {
        opacity: 0,
        y: 30,
        filter: "blur(8px)",
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        clearProps: "filter",
        scrollTrigger: {
          trigger: ".proj-head",
          start: "top 85%",
          once: true,
        },
      });

      /* Count-up for the project total */
      if (countRef.current) {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: PROJECTS.length,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = Math.round(counter.value);
            }
          },
          scrollTrigger: {
            trigger: ".proj-head",
            start: "top 85%",
            once: true,
          },
        });
      }

      /* Background orbs drift at different speeds while scrolling */
      gsap.to(".proj-orb:not(.proj-orb-two)", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".proj-orb-two", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.6,
        },
      });

      /* Gentle bob on the Show More arrow */
      gsap.to(".proj-load-more-icon svg", {
        y: 4,
        duration: 0.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /* ========================================================
     CARDS
     Each ProjectCard reveals itself (IntersectionObserver),
     including newly loaded cards and cards after a filter
     change, so only ScrollTrigger needs a refresh here.
  ======================================================== */

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [filter, visibleCount]);

  /* ========================================================
     MAGNETIC FILTERS + SHOW MORE
  ======================================================== */

  useEffect(() => {
    if (prefersReducedMotion() || !hasHover() || !root.current) return;

    const targets = root.current.querySelectorAll(
      ".proj-filters button, .proj-load-more"
    );
    const cleanups = [];

    targets.forEach((el) => {
      const strength = el.classList.contains("proj-load-more") ? 0.25 : 0.3;
      const mx = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const my = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

      const move = (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * strength);
        my((e.clientY - (r.top + r.height / 2)) * strength);
      };

      const leave = () =>
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "elastic.out(1, 0.4)",
        });

      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);

      cleanups.push(() => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
        gsap.set(el, { clearProps: "x,y" });
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [hasMore]);

  /* ========================================================
     EMPTY STATE
  ======================================================== */

  useEffect(() => {
    if (list.length || prefersReducedMotion()) return;

    const el = root.current?.querySelector(".proj-empty");
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );
  }, [list.length]);

  /* ========================================================
     FILTER CHANGE (grid fades out, then swaps)
  ======================================================== */

  const handleFilter = (filterOption) => {
    if (filterOption === filter) return;

    const swap = () => {
      setFilter(filterOption);
      setVisibleCount(3);
      setActiveId(null);
    };

    const grid = root.current?.querySelector(".proj-grid");

    if (!grid || prefersReducedMotion()) {
      swap();
      return;
    }

    gsap.to(grid, {
      opacity: 0,
      y: 16,
      duration: 0.28,
      ease: "power2.in",
      overwrite: true,
      onComplete: swap,
    });
  };

  /* ========================================================
     PROJECT NAVIGATION
  ======================================================== */

  const step = (direction) => {
    if (!list.length) return;

    const nextIndex =
      (activeIndex + direction + list.length) % list.length;

    setActiveId(list[nextIndex].id);
  };

  return (
    <section ref={root} className="proj" id="projects">
      {/* BACKGROUND GLOW */}

      <div className="proj-orb" />
      <div className="proj-orb proj-orb-two" />

      {/* CONTENT */}

      <div className="proj-wrap">
        {/* HEADER */}

        <div className="proj-head">
          <p className="proj-eyebrow">
            <span className="proj-eyebrow-line" />
            04 — SELECTED WORK
          </p>

          {/* TITLE */}

          <h2 className="proj-title" aria-label="Projects I'm proud of">
            {["Projects", "I'm proud of"].map((line, index) => (
              <span
                key={index}
                className={`proj-row ${index === 1 ? "proj-row--accent" : ""}`}
              >
                {line.split("").map((char, charIndex) => (
                  <span key={charIndex} className="proj-mask">
                    <span className="proj-char">
                      {char === " " ? "\u00A0" : char}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h2>

          {/* INTRO + FILTERS */}

          <div className="proj-head-row">
            <p className="proj-intro">
              <span ref={countRef}>{PROJECTS.length}</span> builds across
              luxury websites and enterprise web apps — each one crafted to
              feel as good as it works.
            </p>

            <div
              className="proj-filters"
              role="tablist"
              aria-label="Filter projects"
            >
              {FILTERS.map((filterOption) => (
                <button
                  key={filterOption}
                  role="tab"
                  aria-selected={filter === filterOption}
                  className={filter === filterOption ? "is-active" : ""}
                  onClick={() => handleFilter(filterOption)}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PROJECT GRID */}

        <div className="proj-grid" key={filter}>
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={() => setActiveId(project.id)}
            />
          ))}
        </div>

        {hasMore && (
          <button
            className="proj-load-more"
            onClick={() =>
              setVisibleCount((prev) => Math.min(prev + 3, list.length))
            }
            aria-label="Show more projects"
          >
            <span className="proj-load-more-text">SHOW MORE</span>

            <span className="proj-load-more-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </span>
          </button>
        )}

        {/* EMPTY STATE */}

        {!list.length && (
          <div className="proj-empty">
            <span>NO PROJECTS</span>
          </div>
        )}
      </div>

      {/* PROJECT DETAILS */}

      {active && (
        <ProjectDetails
          project={active}
          index={activeIndex}
          total={list.length}
          onClose={() => setActiveId(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      )}
    </section>
  );
}

export default Projects;