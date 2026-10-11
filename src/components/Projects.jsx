import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ProjectCard from "./ProjectCard";
import ProjectDetails from "../pages/ProjectDetails";

gsap.registerPlugin(ScrollTrigger);

export const PROJECTS = [
  {
    id: "ployde",
    title: "Ployde",
    tagline: "An editorial studio site with buttery motion.",
    type: "Website",
    role: "Frontend Developer",

    description:
      "A studio / agency website built with an editorial layout, smooth scrolling and carefully choreographed entrance animations.",

    highlights: [
      "Frosted-glass fixed header with GSAP entrance and mobile menu",
      "Video hero and editorial two-column About",
      "Scroll-triggered staggered CTA and services grid",
      "Lenis smooth scroll synced with ScrollTrigger",
    ],

    stack: [
      "React 19",
      "Vite",
      "Tailwind v4",
      "GSAP",
      "Lenis",
    ],

    a1: "#8E8AF5",
    a2: "#10101C",

    image: "",
    live: "",
    code: "",
  },

  {
    id: "maison",
    title: "Maison",
    tagline: "A cinematic brand reveal for a dining house.",
    type: "Website",
    role: "Frontend Developer",

    description:
      "A website for a dining brand, opening with a film-style preloader: a champagne line monogram on matte black dissolving into the wordmark.",

    highlights: [
      "HomeLoader preloader with gliding rim light and slow push-in",
      "Monogram dissolves into a wide-spaced serif wordmark",
      "Film-grain finish on deep matte black",
    ],

    stack: [
      "React",
      "GSAP",
      "Tailwind CSS",
    ],

    a1: "#E8D8B8",
    a2: "#0A0A0A",

    image: "",
    live: "",
    code: "",
  },
];

const FILTERS = [
  "All",
  "Website",
  "Web App",
];

function Projects() {
  const root = useRef(null);

  const [filter, setFilter] = useState("All");
  const [activeId, setActiveId] = useState(null);

  const list = useMemo(() => {
    if (filter === "All") {
      return PROJECTS;
    }

    return PROJECTS.filter(
      (project) => project.type === filter
    );
  }, [filter]);

  const activeIndex = list.findIndex(
    (project) => project.id === activeId
  );

  const active =
    activeIndex >= 0
      ? list[activeIndex]
      : null;

  /* ========================================================
     INTRO ANIMATION
  ======================================================== */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleChars =
        gsap.utils.toArray(".proj-char");

      gsap.from(titleChars, {
        yPercent: 115,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.04,

        scrollTrigger: {
          trigger: ".proj-title",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(
        ".proj-eyebrow, .proj-intro, .proj-filters",
        {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,

          scrollTrigger: {
            trigger: ".proj-head",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  /* ========================================================
     CARD ANIMATION
  ======================================================== */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards =
        gsap.utils.toArray(".proj-card");

      if (!cards.length) return;

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,

          duration: 0.9,

          ease: "power3.out",

          stagger: 0.1,

          scrollTrigger: {
            trigger: ".proj-grid",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, root);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [filter]);

  /* ========================================================
     PROJECT NAVIGATION
  ======================================================== */

  const step = (direction) => {
    if (!list.length) return;

    const nextIndex =
      (activeIndex + direction + list.length) %
      list.length;

    setActiveId(list[nextIndex].id);
  };

  return (
    <section
      ref={root}
      className="proj"
      id="projects"
    >

      {/* ====================================================
          BACKGROUND GLOW
      ==================================================== */}

      <div className="proj-orb" />

      <div className="proj-orb proj-orb-two" />


      {/* ====================================================
          CONTENT
      ==================================================== */}

      <div className="proj-wrap">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="proj-head">

          <p className="proj-eyebrow">
            <span className="proj-eyebrow-line" />

            04 — SELECTED WORK
          </p>


          {/* TITLE */}

          <h2
            className="proj-title"
            aria-label="Projects I'm proud of"
          >

            {[
              "Projects",
              "I'm proud of",
            ].map((line, index) => (

              <span
                key={index}
                className={`proj-row ${
                  index === 1
                    ? "proj-row--accent"
                    : ""
                }`}
              >

                {line.split("").map(
                  (char, charIndex) => (

                    <span
                      key={charIndex}
                      className="proj-mask"
                    >

                      <span className="proj-char">
                        {char === " "
                          ? "\u00A0"
                          : char}
                      </span>

                    </span>
                  )
                )}

              </span>
            ))}

          </h2>


          {/* INTRO + FILTERS */}

          <div className="proj-head-row">

            <p className="proj-intro">
              {PROJECTS.length} builds across
              luxury websites and enterprise web
              apps — each one crafted to feel as
              good as it works.
            </p>


            {/* FILTERS */}

            <div
              className="proj-filters"
              role="tablist"
              aria-label="Filter projects"
            >

              {FILTERS.map((filterOption) => (

                <button
                  key={filterOption}
                  role="tab"
                  aria-selected={
                    filter === filterOption
                  }
                  className={
                    filter === filterOption
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    setFilter(filterOption)
                  }
                >
                  {filterOption}
                </button>

              ))}

            </div>

          </div>

        </div>


        {/* ==================================================
            PROJECT GRID
        ================================================== */}

        <div
          className="proj-grid"
          key={filter}
        >

          {list.map((project, index) => (

            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={() =>
                setActiveId(project.id)
              }
            />

          ))}

        </div>


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!list.length && (

          <div className="proj-empty">

            <span>NO PROJECTS</span>

          </div>

        )}

      </div>


      {/* ====================================================
          PROJECT DETAILS
      ==================================================== */}

      {active && (

        <ProjectDetails
          project={active}
          index={activeIndex}
          total={list.length}

          onClose={() =>
            setActiveId(null)
          }

          onPrev={() =>
            step(-1)
          }

          onNext={() =>
            step(1)
          }
        />

      )}

    </section>
  );
}

export default Projects;