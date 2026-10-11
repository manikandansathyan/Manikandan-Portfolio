import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GROUPS = [
  {
    no: "01",
    title: "Frontend",
    blurb:
      "Building responsive interfaces that are clean, fast and considered down to the smallest detail.",
    items: [
      "React",
      "Angular",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Responsive UI",
    ],
  },
  {
    no: "02",
    title: "Animation & Motion",
    blurb:
      "Animation that adds hierarchy and personality without getting in the way of the experience.",
    items: [
      "GSAP",
      "ScrollTrigger",
      "Framer Motion",
      "Lenis",
      "Micro-interactions",
    ],
  },
  {
    no: "03",
    title: "Design & UI",
    blurb:
      "Strong attention to typography, spacing, composition and the visual details that make interfaces feel polished.",
    items: [
      "Tailwind CSS",
      "UI Design",
      "Design Systems",
      "Dark UI",
      "Responsive Design",
    ],
  },
  {
    no: "04",
    title: "Backend",
    blurb:
      "Enough full-stack knowledge to understand the whole product and ship features beyond the interface.",
    items: [
      "Node.js",
      "Express",
      "MongoDB",
      "REST APIs",
      "Git",
      "GitHub",
    ],
  },
];

const MARQUEE = [
  "React",
  "Angular",
  "JavaScript",
  "TypeScript",
  "GSAP",
  "Framer Motion",
  "Tailwind",
  "Node.js",
  "MongoDB",
];

function Skills() {
  const root = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* --------------------------------
         INITIAL STATES
      -------------------------------- */

      gsap.set(".skills-eyebrow", {
        opacity: 0,
        y: 20,
      });

      gsap.set(".skills-heading-line", {
        yPercent: 110,
      });

      gsap.set(".skills-intro", {
        opacity: 0,
        y: 35,
      });

      gsap.set(".skills-card", {
        opacity: 0,
        y: 70,
        rotateX: 8,
      });

      gsap.set(".skills-tag", {
        opacity: 0,
        y: 12,
      });

      /* --------------------------------
         HEADER REVEAL
      -------------------------------- */

      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".skills-head",
          start: "top 78%",
          once: true,
        },
      });

      headerTl
        .to(".skills-eyebrow", {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .to(
          ".skills-heading-line",
          {
            yPercent: 0,
            duration: 1.05,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .to(
          ".skills-intro",
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.5"
        );

      /* --------------------------------
         CARDS REVEAL
      -------------------------------- */

      const cardsTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 78%",
          once: true,
        },
      });

      cardsTl
        .to(".skills-card", {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.13,
          ease: "power3.out",
        })
        .to(
          ".skills-tag",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.035,
            ease: "power2.out",
          },
          "-=0.45"
        );

      /* --------------------------------
         CARD MOUSE TILT
      -------------------------------- */

      document.querySelectorAll(".skills-card").forEach((card) => {
        const handleMove = (e) => {
          const rect = card.getBoundingClientRect();

          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const rotateY = ((x / rect.width) - 0.5) * 5;
          const rotateX = ((y / rect.height) - 0.5) * -5;

          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);

          gsap.to(card, {
            rotateX,
            rotateY,
            y: -6,
            duration: 0.35,
            ease: "power2.out",
          });
        };

        const handleLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          });
        };

        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseleave", handleLeave);

        card._handleMove = handleMove;
        card._handleLeave = handleLeave;
      });

      /* --------------------------------
         MARQUEE
      -------------------------------- */

      const marquee = marqueeRef.current;

      if (marquee) {
        gsap.to(marquee, {
          xPercent: -50,
          duration: 22,
          ease: "none",
          repeat: -1,
        });

        /* Slightly accelerate while scrolling */

        ScrollTrigger.create({
          trigger: ".skills-marquee",
          start: "top bottom",
          end: "bottom top",

          onUpdate: (self) => {
            gsap.to(marquee, {
              timeScale: 1 + self.getVelocity() / 2500,
              duration: 0.2,
              overwrite: true,
            });
          },
        });
      }

      /* --------------------------------
         PARALLAX GLOW
      -------------------------------- */

      gsap.to(".skills-glow", {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => {
      document.querySelectorAll(".skills-card").forEach((card) => {
        card.removeEventListener("mousemove", card._handleMove);
        card.removeEventListener("mouseleave", card._handleLeave);
      });

      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      id="skills"
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #0b0710 0%, #100816 48%, #0b0710 100%)",
        color: "#f5f1f7",
        padding: "150px 6vw 0",
      }}
    >
      {/* --------------------------------
          BACKGROUND GLOW
      -------------------------------- */}

      <div
        className="skills-glow"
        style={{
          position: "absolute",
          width: "650px",
          height: "650px",
          right: "-280px",
          top: "5%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15), transparent 68%)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          left: "-250px",
          bottom: "15%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.07), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* --------------------------------
          CONTENT
      -------------------------------- */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        {/* --------------------------------
            HEADER
        -------------------------------- */}

        <div
          className="skills-head"
          style={{
            maxWidth: "950px",
            marginBottom: "90px",
          }}
        >
          <p
            className="skills-eyebrow"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "0 0 25px",
              color: "#a78bfa",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "32px",
                height: "1px",
                background: "#8b5cf6",
              }}
            />

            02 — Skills
          </p>

          <div
            style={{
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(3.5rem, 8vw, 8rem)",
                lineHeight: 0.88,
                letterSpacing: "-0.065em",
                fontWeight: 700,
              }}
            >
              <span
                className="skills-heading-line"
                style={{
                  display: "block",
                }}
              >
                The craft
              </span>

              <span
                className="skills-heading-line"
                style={{
                  display: "block",
                  color: "#a855f7",
                }}
              >
                behind the work.
              </span>
            </h2>
          </div>

          <p
            className="skills-intro"
            style={{
              maxWidth: "620px",
              margin: "35px 0 0",
              color: "#918795",
              fontSize: "16px",
              lineHeight: 1.8,
            }}
          >
            A focused toolkit refined across React and Angular projects —
            chosen to build interfaces that feel fast, polished and memorable
            from the first scroll to the last click.
          </p>
        </div>

        {/* --------------------------------
            SKILL GRID
        -------------------------------- */}

        <div
          className="skills-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
            gap: "16px",
            perspective: "1000px",
          }}
        >
          {GROUPS.map((group) => (
            <article
              key={group.no}
              className="skills-card"
              style={{
                "--mouse-x": "50%",
                "--mouse-y": "50%",
                position: "relative",
                minHeight: "390px",
                padding: "30px",
                borderRadius: "22px",
                overflow: "hidden",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018))",
                border: "1px solid rgba(255,255,255,0.075)",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {/* cursor spotlight */}

              <div
                style={{
                  position: "absolute",
                  width: "280px",
                  height: "280px",
                  left: "var(--mouse-x)",
                  top: "var(--mouse-y)",
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(139,92,246,0.12), transparent 68%)",
                  pointerEvents: "none",
                }}
              />

              {/* top */}

              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "65px",
                }}
              >
                <span
                  style={{
                    color: "#8f8298",
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    fontWeight: 600,
                  }}
                >
                  / {group.no}
                </span>

                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    border: "1px solid rgba(139,92,246,0.2)",
                    color: "#a78bfa",
                    fontSize: "17px",
                  }}
                >
                  ↗
                </span>
              </div>

              {/* title */}

              <h3
                style={{
                  position: "relative",
                  margin: "0 0 14px",
                  fontSize: "clamp(1.7rem, 2.7vw, 2.3rem)",
                  letterSpacing: "-0.04em",
                  fontWeight: 600,
                  color: "#f5f1f7",
                }}
              >
                {group.title}
              </h3>

              {/* description */}

              <p
                style={{
                  position: "relative",
                  margin: "0 0 30px",
                  maxWidth: "320px",
                  color: "#817684",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {group.blurb}
              </p>

              {/* tags */}

              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "7px",
                }}
              >
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="skills-tag"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "8px 11px",
                      borderRadius: "7px",
                      background: "rgba(139,92,246,0.055)",
                      border: "1px solid rgba(139,92,246,0.12)",
                      color: "#aaa0b0",
                      fontSize: "11px",
                      lineHeight: 1.2,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* bottom accent */}

              <div
                style={{
                  position: "absolute",
                  left: "30px",
                  right: "30px",
                  bottom: "0",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(139,92,246,0.45), transparent)",
                }}
              />
            </article>
          ))}
        </div>
      </div>

      {/* --------------------------------
          MARQUEE
      -------------------------------- */}

      <div
        className="skills-marquee"
        aria-hidden="true"
        style={{
          position: "relative",
          marginTop: "130px",
          marginLeft: "-6vw",
          marginRight: "-6vw",
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.055)",
          borderBottom: "1px solid rgba(255,255,255,0.055)",
          background: "rgba(255,255,255,0.012)",
        }}
      >
        <div
          ref={marqueeRef}
          className="skills-track"
          style={{
            display: "flex",
            width: "max-content",
            willChange: "transform",
          }}
        >
          {[0, 1, 2].map((set) => (
            <div
              key={set}
              style={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {MARQUEE.map((item) => (
                <span
                  key={`${item}-${set}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "35px",
                    padding: "24px 35px",
                    color: "#665b6e",
                    fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item}

                  <i
                    style={{
                      fontStyle: "normal",
                      color: "#8b5cf6",
                      fontSize: "12px",
                    }}
                  >
                    ✦
                  </i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;