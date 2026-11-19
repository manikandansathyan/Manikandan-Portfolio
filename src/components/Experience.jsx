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
    word: "ANGULAR",
    glowX: "74%",
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
    word: "MEAN",
    glowX: "28%",
    image: "/mean.png",
    description:
      "Worked across the full stack, building features from REST APIs and databases to responsive, component-driven frontend experiences.",
    stack: ["MongoDB", "Express", "Angular", "React", "Node.js"],
  },
];

/* =========================================================
   CURSOR REVEAL SETTINGS
========================================================= */

const OVERLAY = "#0b0710";
const REVEAL_LIFE = 1500;
const RING_LIFE = 1800;
const POINT_SPACING = 8;
const RING_SPACING = 55;
const REVEAL_RADIUS = 190;
const CLICK_RING_RADIUS = 280;

/* =========================================================
   ORGANIC REVEAL SPRITES
   Pre-rendered soft blobs: each trail point is one
   drawImage instead of a path + gradient per frame.
========================================================= */

function makeSprite(seed) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const s = c.getContext("2d");

  const g = s.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(0.38, "rgba(0,0,0,0.98)");
  g.addColorStop(0.62, "rgba(0,0,0,0.78)");
  g.addColorStop(0.8, "rgba(0,0,0,0.38)");
  g.addColorStop(1, "rgba(0,0,0,0)");

  s.beginPath();
  const segments = 56;
  for (let i = 0; i <= segments; i++) {
    const a = (Math.PI * 2 * i) / segments;
    const v =
      Math.sin(a * 3 + seed) * 8 +
      Math.sin(a * 5 + 1.5 + seed * 1.7) * 6 +
      Math.sin(a * 7 + 2 + seed * 0.6) * 4;
    const r = 112 + v;
    const x = 128 + Math.cos(a) * r;
    const y = 128 + Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  s.fillStyle = g;
  s.fill();
  return c;
}

/* =========================================================
   HOVER REVEAL
========================================================= */

function HoverReveal({ job }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = null;
    let destroyed = false;

    const sprites = [0, 1.3, 2.6].map(makeSprite);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
    const points = [];
    const rings = [];
    let lastPoint = null;
    let lastRing = null;

    /* render loop only runs while something is moving */
    const kick = () => {
      if (!raf && !destroyed) raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      kick();
    };

    const pushPoint = (x, y, now) => {
      points.push({ x, y, born: now, v: Math.floor(Math.random() * 3) });
      lastPoint = { x, y };

      if (
        !lastRing ||
        Math.hypot(x - lastRing.x, y - lastRing.y) >= RING_SPACING
      ) {
        rings.push({ x, y, born: now, max: REVEAL_RADIUS });
        lastRing = { x, y };
      }
    };

    const addPoint = (x, y, now) => {
      if (!lastPoint) return pushPoint(x, y, now);

      const dist = Math.hypot(x - lastPoint.x, y - lastPoint.y);
      if (dist < POINT_SPACING) return;
      if (dist > 240) return pushPoint(x, y, now);

      const steps = Math.floor(dist / POINT_SPACING);
      const sx = lastPoint.x;
      const sy = lastPoint.y;
      for (let i = 1; i <= steps; i++) {
        pushPoint(sx + ((x - sx) * i) / steps, sy + ((y - sy) * i) / steps, now);
      }
    };

    const local = (e) => {
      const r = container.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
    };

    const handleMove = (e) => {
      const p = local(e);
      mouse.targetX = p.x;
      mouse.targetY = p.y;
      mouse.active = true;

      // parallax for the scene beneath + hide the hint after first move
      container.style.setProperty("--px", ((p.x / p.w) * 2 - 1).toFixed(3));
      container.style.setProperty("--py", ((p.y / p.h) * 2 - 1).toFixed(3));
      container.setAttribute("data-touched", "");
      kick();
    };

    const handleEnter = (e) => {
      const p = local(e);
      mouse.x = mouse.targetX = p.x;
      mouse.y = mouse.targetY = p.y;
      mouse.active = true;
      lastPoint = null;
      lastRing = null;
      kick();
    };

    const handleLeave = () => {
      mouse.active = false;
      lastPoint = null;
      lastRing = null;
      container.style.setProperty("--px", "0");
      container.style.setProperty("--py", "0");
      kick();
    };

    const handleDown = (e) => {
      if (reduceMotion) return;
      const p = local(e);
      const now = performance.now();
      for (let i = 0; i < 3; i++) {
        rings.push({ x: p.x, y: p.y, born: now + i * 120, max: CLICK_RING_RADIUS });
      }
      kick();
    };

    function draw() {
      raf = null;
      if (destroyed) return;

      const now = performance.now();

      mouse.x += (mouse.targetX - mouse.x) * 0.2;
      mouse.y += (mouse.targetY - mouse.y) * 0.2;

      if (mouse.active) addPoint(mouse.x, mouse.y, now);

      while (points.length && now - points[0].born > REVEAL_LIFE) points.shift();
      for (let i = rings.length - 1; i >= 0; i--) {
        if (now - rings[i].born > RING_LIFE) rings.splice(i, 1);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // dark overlay (lighter tint if the user prefers reduced motion)
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = reduceMotion ? 0.35 : 1;
      ctx.fillStyle = OVERLAY;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      if (!reduceMotion) {
        ctx.globalCompositeOperation = "destination-out";

        points.forEach((p) => {
          const age = (now - p.born) / REVEAL_LIFE;
          if (age < 0 || age >= 1) return;
          const d = (65 + age * 55) * 2.2;
          ctx.globalAlpha = Math.pow(1 - age, 1.5);
          ctx.drawImage(sprites[p.v], p.x - d / 2, p.y - d / 2, d, d);
        });
        ctx.globalAlpha = 1;

        rings.forEach((ring) => {
          const t = (now - ring.born) / RING_LIFE;
          if (t < 0 || t >= 1) return;
          const radius = 8 + (1 - Math.pow(1 - t, 3)) * ring.max;
          const fade = Math.pow(1 - t, 1.5);

          ctx.beginPath();
          ctx.lineWidth = 28;
          ctx.strokeStyle = `rgba(0,0,0,${fade * 0.28})`;
          ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.lineWidth = 12;
          ctx.strokeStyle = `rgba(0,0,0,${fade * 0.9})`;
          ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        });

        ctx.globalCompositeOperation = "source-over";
      }

      const settling =
        Math.abs(mouse.targetX - mouse.x) + Math.abs(mouse.targetY - mouse.y) > 0.5;
      if (mouse.active || points.length || rings.length || settling) {
        raf = requestAnimationFrame(draw);
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerenter", handleEnter);
    container.addEventListener("pointerleave", handleLeave);
    container.addEventListener("pointerdown", handleDown);

    return () => {
      destroyed = true;
      ro.disconnect();
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerenter", handleEnter);
      container.removeEventListener("pointerleave", handleLeave);
      container.removeEventListener("pointerdown", handleDown);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <article className="exp-item">
      <div className="exp-item-line" />

      <div className="exp-number">{job.no}</div>

      <div className="exp-item-content">
        <div className="exp-meta">
          <span>{job.period}</span>
          <span className="exp-meta-divider">/</span>
          <span>{job.type}</span>

          {job.no === "01" && (
            <span className="exp-current">
              <span className="exp-current-dot" />
              CURRENT
            </span>
          )}
        </div>

        <div
          ref={containerRef}
          className="exp-reveal"
          style={{ "--ax": job.glowX }}
        >
          {/* generated scene */}
          <div className="exp-art" aria-hidden="true">
            <div className="exp-art-glow" />
            <div className="exp-art-grid" />
            <span className="exp-art-word">{job.word}</span>
            {job.image && (
              <img
                src={job.image}
                alt=""
                className="exp-image"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          {/* dark overlay the cursor wipes away */}
          <canvas ref={canvasRef} className="exp-overlay" aria-hidden="true" />
          <div className="exp-vignette" aria-hidden="true" />

          <div className="exp-reveal-content">
            <div className="exp-role-row">
              <h3 className="exp-role">{job.role}</h3>
              <span className="exp-arrow" aria-hidden="true">↗</span>
            </div>
            <p className="exp-company">{job.company}</p>
          </div>

          <div className="exp-interaction" aria-hidden="true">
            <span className="exp-interaction-dot" />
            MOVE TO REVEAL
          </div>
        </div>

        <div className="exp-information">
          <p className="exp-description">{job.description}</p>

          <div className="exp-stack">
            {job.stack.map((skill) => (
              <span key={skill}>{skill}</span>
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
      /* ---------- header ---------- */

      gsap
        .timeline({
          scrollTrigger: { trigger: ".exp-header", start: "top 82%", once: true },
        })
        .from(".exp-eyebrow", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" })
        .from(
          ".exp-title-line",
          { yPercent: 110, duration: 1.2, stagger: 0.12, ease: "power4.out" },
          "-=0.5"
        )
        .from(
          ".exp-intro",
          { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" },
          "-=0.7"
        );

      /* ---------- items ---------- */

      gsap.utils.toArray(".exp-item").forEach((item) => {
        const q = (s) => item.querySelector(s);

        gsap
          .timeline({
            scrollTrigger: { trigger: item, start: "top 82%", once: true },
          })
          .from(q(".exp-item-line"), {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1.1,
            ease: "power3.out",
          })
          .from(q(".exp-number"), { opacity: 0, x: -15, duration: 0.6 }, "-=0.8")
          .from(q(".exp-meta"), { opacity: 0, y: 15, duration: 0.6 }, "-=0.5")
          .from(
            q(".exp-reveal"),
            {
              clipPath: "inset(0 0 100% 0 round 6px)",
              y: 40,
              duration: 1.3,
              ease: "power4.out",
              clearProps: "clipPath,transform",
            },
            "-=0.4"
          )
          .from(q(".exp-description"), { opacity: 0, y: 20, duration: 0.7 }, "-=0.6")
          .from(
            item.querySelectorAll(".exp-stack span"),
            { opacity: 0, y: 14, duration: 0.5, stagger: 0.06 },
            "-=0.5"
          );
      });

      /* ---------- slow background drift ---------- */

      ["one", "two"].forEach((n, i) => {
        gsap.to(`.exp-bg-orb-${n}`, {
          yPercent: i === 0 ? -25 : 30,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, rootRef);

    // fonts change heights, so recalc trigger positions once they load
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="experience" className="experience-section">
      <div className="exp-bg-orb exp-bg-orb-one" />
      <div className="exp-bg-orb exp-bg-orb-two" />

      <div className="exp-container">
        <header className="exp-header">
          <p className="exp-eyebrow">
            <span className="exp-eyebrow-line" />
            03 — EXPERIENCE
          </p>

          <h2 className="exp-title">
            <span className="exp-title-mask">
              <span className="exp-title-line">Where I&apos;ve</span>
            </span>
            <span className="exp-title-mask">
              <span className="exp-title-line exp-title-accent">done the work.</span>
            </span>
          </h2>

          <p className="exp-intro">
            A short record of the places where I&apos;ve learned, built and
            shipped real software.
          </p>
        </header>

        <div className="exp-list">
          {JOBS.map((job) => (
            <HoverReveal key={job.no} job={job} />
          ))}
        </div>

        <div className="exp-footer">
          <span>EXPERIENCE / 2025 — NOW</span>
          <span>BUILDING · LEARNING · SHIPPING</span>
        </div>
      </div>
    </section>
  );
}

export default Experience;