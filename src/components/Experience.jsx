import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const JOBS = [
  {
    no: "01",
    period: "APR 2026 — PRESENT",
    role: "Angular Developer",
    company: "QMARK Technolabs",
    type: "FULL-TIME",
    image: "/angular.png",
    description:
      "Building and maintaining enterprise Angular applications, working across asset management systems and polished admin interfaces.",
    stack: ["Angular", "TypeScript", "React", "RxJS"],
  },
  {
    no: "02",
    period: "JUL 2025 — JAN 2026",
    role: "MEA(R)N Stack Developer Intern",
    company: "Luminar Technolab",
    type: "INTERNSHIP",
    image: "/mean.png",
    description:
      "Worked across the full stack, building features from REST APIs and databases to responsive, component-driven frontend experiences.",
    stack: ["MongoDB", "Express", "Angular", "React", "Node.js"],
  },
];

/* =========================================================
   HOVER REVEAL
========================================================= */

function HoverReveal({ job }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const mouse = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
  });

  const animationRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let dpr = 1;

    /* -----------------------------------------
       RESIZE
    ----------------------------------------- */

    const resize = () => {
      const rect = container.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* -----------------------------------------
       MOUSE
    ----------------------------------------- */

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();

      mouse.current.targetX = e.clientX - rect.left;
      mouse.current.targetY = e.clientY - rect.top;

      mouse.current.active = true;
    };

    const handleEnter = (e) => {
      const rect = container.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouse.current.x = x;
      mouse.current.y = y;

      mouse.current.targetX = x;
      mouse.current.targetY = y;

      mouse.current.active = true;

      gsap.to(container.querySelector(".exp-image"), {
        scale: 1,
        duration: 1,
        ease: "power3.out",
      });
    };

    const handleLeave = () => {
      mouse.current.active = false;

      gsap.to(container.querySelector(".exp-image"), {
        scale: 1.04,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    /* -----------------------------------------
       DRAW REVEAL
    ----------------------------------------- */

    const draw = () => {
      /*
       * Smooth cursor movement
       */
      mouse.current.x +=
        (mouse.current.targetX - mouse.current.x) * 0.16;

      mouse.current.y +=
        (mouse.current.targetY - mouse.current.y) * 0.16;

      /*
       * Dark purple overlay.
       *
       * This completely hides the image.
       */
      ctx.globalCompositeOperation = "source-over";

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#0b0710";

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /*
       * Reveal the image underneath.
       */
      if (mouse.current.active) {
        const x = mouse.current.x;
        const y = mouse.current.y;

        ctx.globalCompositeOperation =
          "destination-out";

        const radius = 210;

        const gradient =
          ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            radius
          );

        gradient.addColorStop(
          0,
          "rgba(0,0,0,1)"
        );

        gradient.addColorStop(
          0.35,
          "rgba(0,0,0,1)"
        );

        gradient.addColorStop(
          0.60,
          "rgba(0,0,0,0.85)"
        );

        gradient.addColorStop(
          0.78,
          "rgba(0,0,0,0.45)"
        );

        gradient.addColorStop(
          0.92,
          "rgba(0,0,0,0.12)"
        );

        gradient.addColorStop(
          1,
          "rgba(0,0,0,0)"
        );

        /*
         * Organic reveal shape
         */
        ctx.beginPath();

        const points = 80;

        for (let i = 0; i <= points; i++) {
          const angle =
            (Math.PI * 2 * i) / points;

          const variation =
            Math.sin(angle * 3) * 18 +
            Math.sin(angle * 5 + 1) * 14 +
            Math.sin(angle * 7 + 2) * 9;

          const r =
            radius + variation;

          const px =
            x + Math.cos(angle) * r;

          const py =
            y + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        ctx.closePath();

        ctx.fillStyle = gradient;

        ctx.fill();
      }

      ctx.globalCompositeOperation =
        "source-over";

      animationRef.current =
        requestAnimationFrame(draw);
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    container.addEventListener(
      "pointermove",
      handleMove
    );

    container.addEventListener(
      "pointerenter",
      handleEnter
    );

    container.addEventListener(
      "pointerleave",
      handleLeave
    );

    animationRef.current =
      requestAnimationFrame(draw);

    return () => {
      window.removeEventListener(
        "resize",
        resize
      );

      container.removeEventListener(
        "pointermove",
        handleMove
      );

      container.removeEventListener(
        "pointerenter",
        handleEnter
      );

      container.removeEventListener(
        "pointerleave",
        handleLeave
      );

      cancelAnimationFrame(
        animationRef.current
      );
    };
  }, []);

  return (
    <article className="exp-item">

      <div className="exp-item-line" />

      <div className="exp-number">
        {job.no}
      </div>

      <div className="exp-item-content">

        {/* META */}

        <div className="exp-meta">
          <span>{job.period}</span>

          <span className="exp-meta-divider">
            /
          </span>

          <span>{job.type}</span>

          {job.no === "01" && (
            <span className="exp-current">
              <span className="exp-current-dot" />
              CURRENT
            </span>
          )}
        </div>

        {/* REVEAL AREA */}

        <div
          ref={containerRef}
          className="exp-reveal"
        >

          {/* IMAGE */}

          <img
            src={job.image}
            alt=""
            className="exp-image"
            draggable="false"
          />

          {/* DARK OVERLAY */}

          <canvas
            ref={canvasRef}
            className="exp-overlay"
          />

          {/* TEXT */}

          <div className="exp-reveal-content">

            <div className="exp-role-row">

              <h3 className="exp-role">
                {job.role}
              </h3>

              <span className="exp-arrow">
                ↗
              </span>

            </div>

            <p className="exp-company">
              {job.company}
            </p>

          </div>

          {/* HINT */}

          <div className="exp-interaction">
            <span className="exp-interaction-dot" />
            MOVE TO REVEAL
          </div>

        </div>

        {/* INFORMATION */}

        <div className="exp-information">

          <p className="exp-description">
            {job.description}
          </p>

          <div className="exp-stack">
            {job.stack.map((skill) => (
              <span key={skill}>
                {skill}
              </span>
            ))}
          </div>

        </div>

      </div>
    </article>
  );
}


/* =========================================================
   EXPERIENCE
========================================================= */

function Experience() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* --------------------------------
         HEADER
      -------------------------------- */

      gsap.from(".exp-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".exp-header",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".exp-title-line", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".exp-title",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".exp-intro", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".exp-header",
          start: "top 70%",
          once: true,
        },
      });

      /* --------------------------------
         EXPERIENCE ITEMS
      -------------------------------- */

      gsap.utils
        .toArray(".exp-item")
        .forEach((item) => {

          const line =
            item.querySelector(".exp-item-line");

          const number =
            item.querySelector(".exp-number");

          const meta =
            item.querySelector(".exp-meta");

          const reveal =
            item.querySelector(".exp-reveal");

          const information =
            item.querySelector(".exp-information");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              once: true,
            },
          });

          tl.from(line, {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1,
            ease: "power3.out",
          })
            .from(
              number,
              {
                opacity: 0,
                x: -15,
                duration: 0.5,
              },
              "-=0.7"
            )
            .from(
              meta,
              {
                opacity: 0,
                y: 15,
                duration: 0.5,
              },
              "-=0.4"
            )
            .from(
              reveal,
              {
                opacity: 0,
                y: 30,
                duration: 0.9,
                ease: "power3.out",
              },
              "-=0.3"
            )
            .from(
              information,
              {
                opacity: 0,
                y: 20,
                duration: 0.6,
              },
              "-=0.5"
            );
        });

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="experience"
      className="experience-section"
    >

      {/* BACKGROUND GLOWS */}

      <div className="exp-bg-orb exp-bg-orb-one" />

      <div className="exp-bg-orb exp-bg-orb-two" />

      <div className="exp-container">

        {/* --------------------------------
            HEADER
        -------------------------------- */}

        <header className="exp-header">

          <p className="exp-eyebrow">
            <span className="exp-eyebrow-line" />
            03 — EXPERIENCE
          </p>

          <h2 className="exp-title">

            <span className="exp-title-mask">
              <span className="exp-title-line">
                Where I've
              </span>
            </span>

            <span className="exp-title-mask">
              <span className="exp-title-line exp-title-accent">
                done the work.
              </span>
            </span>

          </h2>

          <p className="exp-intro">
            A short record of the places where
            I've learned, built and shipped real
            software.
          </p>

        </header>

        {/* --------------------------------
            JOBS
        -------------------------------- */}

        <div className="exp-list">

          {JOBS.map((job) => (
            <HoverReveal
              key={job.no}
              job={job}
            />
          ))}

        </div>

        {/* --------------------------------
            FOOTER
        -------------------------------- */}

        <div className="exp-footer">

          <span>
            EXPERIENCE / 2025 — NOW
          </span>

          <span>
            BUILDING · LEARNING · SHIPPING
          </span>

        </div>

      </div>
    </section>
  );
}

export default Experience;