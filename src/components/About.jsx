import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FACTS = [
  {
    label: "Based in",
    value: "Ernakulam, India",
  },
  {
    label: "Specialized in",
    value: "React · Angular",
  },
  {
    label: "Currently",
    value: "QMARK Technolabs",
  },
];

const TIMELINE = [
  {
    year: "2026 — Present",
    title: "Co-Founder",
    company: "Ployde",
    description:
      "Co-founded Ployde, a creative web studio focused on building premium websites and digital experiences for modern brands.",
  },
  {
    year: "Apr 2026 — Present",
    title: "Angular Developer",
    company: "QMARK Technolabs",
    description:
      "Building enterprise Angular applications and frontend systems, working on asset management, dashboards and business workflows.",
  },
  {
    year: "Jul 2025 — Jan 2026",
    title: "MEA(R)N Stack Developer Intern",
    company: "Luminar Technolab",
    description:
      "Worked across MongoDB, Express, Angular, React and Node.js while building full-stack applications and strengthening frontend development skills.",
  },
  {
    year: "2022 — 2025",
    title: "Bachelor of Computer Application",
    company: "Baselios Poulose II Catholicos College",
    description:
      "Built a strong foundation in programming, databases, software development and modern web technologies.",
  },
];

const SKILLS = [
  "React",
  "Angular",
  "JavaScript",
  "TypeScript",
  "GSAP",
  "Framer Motion",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "MongoDB",
  "REST APIs",
  "Responsive UI",
];

function About() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* --------------------------------
         INITIAL STATES
      -------------------------------- */

      gsap.set(".about-eyebrow", {
        opacity: 0,
        y: 20,
      });

      gsap.set(".about-heading-line", {
        yPercent: 110,
      });

      gsap.set(".about-image", {
        opacity: 0,
        y: 80,
        rotate: 4,
      });

      gsap.set(".about-copy", {
        opacity: 0,
        y: 45,
      });

      gsap.set(".about-fact", {
        opacity: 0,
        y: 30,
      });

      gsap.set(".about-timeline-item", {
        opacity: 0,
        x: -40,
      });

      gsap.set(".about-skill", {
        opacity: 0,
        y: 20,
      });

      /* --------------------------------
         MAIN INTRO
      -------------------------------- */

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      intro
        .to(".about-eyebrow", {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .to(
          ".about-heading-line",
          {
            yPercent: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .to(
          ".about-image",
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 1.2,
            ease: "power4.out",
          },
          "-=0.7"
        )
        .to(
          ".about-copy",
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .to(
          ".about-fact",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5"
        );

      /* --------------------------------
         IMAGE PARALLAX
      -------------------------------- */

      gsap.to(imageRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      /* --------------------------------
         TIMELINE
      -------------------------------- */

      gsap.to(".about-timeline-line", {
        scaleY: 1,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: ".about-timeline",
          start: "top 75%",
          end: "bottom 75%",
          scrub: true,
        },
      });

      gsap.to(".about-timeline-item", {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-timeline",
          start: "top 70%",
          once: true,
        },
      });

      /* --------------------------------
         SKILLS
      -------------------------------- */

      gsap.to(".about-skill", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-skills",
          start: "top 80%",
          once: true,
        },
      });

      /* --------------------------------
         SKILL HOVER
      -------------------------------- */

      document.querySelectorAll(".about-skill").forEach((skill) => {
        const enter = () => {
          gsap.to(skill, {
            y: -5,
            scale: 1.04,
            duration: 0.25,
            ease: "power2.out",
          });
        };

        const leave = () => {
          gsap.to(skill, {
            y: 0,
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
          });
        };

        skill.addEventListener("mouseenter", enter);
        skill.addEventListener("mouseleave", leave);

        skill._enter = enter;
        skill._leave = leave;
      });
    }, sectionRef);

    return () => {
      document.querySelectorAll(".about-skill").forEach((skill) => {
        skill.removeEventListener("mouseenter", skill._enter);
        skill.removeEventListener("mouseleave", skill._leave);
      });

      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #0b0710 0%, #100816 55%, #0b0710 100%)",
        color: "#f5f1f7",
        padding: "140px 6vw",
      }}
    >
      {/* --------------------------------
          BACKGROUND GLOW
      -------------------------------- */}

      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.13), transparent 68%)",
          top: "0",
          right: "-220px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)",
          bottom: "10%",
          left: "-250px",
          pointerEvents: "none",
        }}
      />

      {/* --------------------------------
          CONTAINER
      -------------------------------- */}

      <div
        style={{
          position: "relative",
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        {/* --------------------------------
            HEADER
        -------------------------------- */}

        <div
          style={{
            marginBottom: "100px",
          }}
        >
          <div
            className="about-eyebrow"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "25px",
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

            01 — About me
          </div>

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
                letterSpacing: "-0.06em",
                fontWeight: 700,
              }}
            >
              <div
                className="about-heading-line"
                style={{
                  display: "block",
                }}
              >
                Built with
              </div>

              <div
                className="about-heading-line"
                style={{
                  display: "block",
                  color: "#a855f7",
                }}
              >
                intention.
              </div>
            </h2>
          </div>
        </div>

        {/* --------------------------------
            INTRO GRID
        -------------------------------- */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(300px, 0.85fr) minmax(300px, 1.15fr)",
            gap: "clamp(50px, 8vw, 120px)",
            alignItems: "center",
          }}
        >
          {/* IMAGE */}

          <div
            style={{
              position: "relative",
              maxWidth: "460px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-18px",
                border: "1px solid rgba(139,92,246,0.18)",
                borderRadius: "28px",
                transform: "rotate(-4deg)",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: "-35px",
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.2), transparent 65%)",
                filter: "blur(30px)",
                zIndex: 0,
              }}
            />

            <div
              ref={imageRef}
              className="about-image"
              style={{
                position: "relative",
                zIndex: 1,
                aspectRatio: "0.82",
                overflow: "hidden",
                borderRadius: "24px",
                background: "#151019",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <img
                src="/manikandan-about.jpg"
                alt="Manikandan Sathyan"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                  filter: "contrast(1.02) saturate(0.9)",
                }}
              />

              {/* image overlay */}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 55%, rgba(8,5,12,0.65) 100%)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  right: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "end",
                }}
              >
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#c4b5fd",
                      marginBottom: "6px",
                    }}
                  >
                    Frontend Developer
                  </span>

                  <strong
                    style={{
                      fontSize: "18px",
                      color: "#fff",
                    }}
                  >
                    Manikandan S.
                  </strong>
                </div>

                <span
                  style={{
                    width: "42px",
                    height: "42px",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#c4b5fd",
                    fontSize: "18px",
                  }}
                >
                  ↗
                </span>
              </div>
            </div>
          </div>

          {/* COPY */}

          <div>
            <p
              className="about-copy"
              style={{
                fontSize: "clamp(1.5rem, 2.6vw, 2.4rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.03em",
                margin: "0 0 30px",
                color: "#f5f1f7",
                maxWidth: "700px",
              }}
            >
              I’m Manikandan — a frontend developer who cares about the space
              between{" "}
              <span style={{ color: "#a855f7" }}>“it works”</span> and{" "}
              <span style={{ color: "#c4b5fd" }}>“it feels right.”</span>
            </p>

            <p
              className="about-copy"
              style={{
                fontSize: "16px",
                lineHeight: 1.8,
                color: "#a99fac",
                maxWidth: "650px",
                margin: "0 0 20px",
              }}
            >
              I build modern web experiences across React and Angular, with a
              strong focus on visual detail, responsive interfaces and
              purposeful motion.
            </p>

            <p
              className="about-copy"
              style={{
                fontSize: "16px",
                lineHeight: 1.8,
                color: "#a99fac",
                maxWidth: "650px",
                margin: "0 0 45px",
              }}
            >
              From polished studio websites to enterprise dashboards, I enjoy
              turning ideas into interfaces that feel clear, fast and
              memorable.
            </p>

            {/* FACTS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              {FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="about-fact"
                  style={{
                    padding: "20px 18px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.025)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "#756b7d",
                    }}
                  >
                    {fact.label}
                  </span>

                  <strong
                    style={{
                      fontSize: "13px",
                      color: "#ddd5e5",
                      lineHeight: 1.4,
                    }}
                  >
                    {fact.value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --------------------------------
            JOURNEY
        -------------------------------- */}

        <div
          style={{
            marginTop: "170px",
          }}
        >
          <div
            className="about-eyebrow"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "55px",
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

            02 — Journey
          </div>

          <div
            className="about-timeline"
            style={{
              position: "relative",
              paddingLeft: "42px",
            }}
          >
            {/* line */}

            <div
              className="about-timeline-line"
              style={{
                position: "absolute",
                left: "7px",
                top: "8px",
                bottom: "8px",
                width: "1px",
                background:
                  "linear-gradient(180deg, #8b5cf6, rgba(139,92,246,0.08))",
                transform: "scaleY(0)",
              }}
            />

            {TIMELINE.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="about-timeline-item"
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap: "40px",
                  paddingBottom: index === TIMELINE.length - 1 ? "0" : "65px",
                }}
              >
                {/* dot */}

                <span
                  style={{
                    position: "absolute",
                    left: "-39px",
                    top: "5px",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#0b0710",
                    border: "2px solid #8b5cf6",
                    boxShadow: "0 0 20px rgba(139,92,246,0.35)",
                  }}
                />

                <span
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    color: "#82758c",
                    paddingTop: "3px",
                  }}
                >
                  {item.year}
                </span>

                <div>
                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: "clamp(1.4rem, 2.3vw, 2rem)",
                      letterSpacing: "-0.03em",
                      fontWeight: 600,
                      color: "#f5f1f7",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      margin: "0 0 14px",
                      fontSize: "13px",
                      color: "#a78bfa",
                      fontWeight: 600,
                    }}
                  >
                    {item.company}
                  </p>

                  <p
                    style={{
                      maxWidth: "650px",
                      margin: 0,
                      color: "#918795",
                      lineHeight: 1.75,
                      fontSize: "15px",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* --------------------------------
            TOOLKIT
        -------------------------------- */}

        <div
          style={{
            marginTop: "160px",
          }}
        >
          <div
            className="about-eyebrow"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "45px",
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

            03 — Toolkit
          </div>

          <div
            className="about-skills"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              maxWidth: "900px",
            }}
          >
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="about-skill"
                style={{
                  padding: "13px 18px",
                  borderRadius: "100px",
                  border: "1px solid rgba(139,92,246,0.18)",
                  background: "rgba(139,92,246,0.045)",
                  color: "#bcb1c5",
                  fontSize: "13px",
                  cursor: "default",
                  transition:
                    "border-color .25s ease, background .25s ease, color .25s ease",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;