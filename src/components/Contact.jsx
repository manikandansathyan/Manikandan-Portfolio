
import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ───────── CONFIGURATION ───────── */

const EMAIL = "manikandansathyan02@gmail.com";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const LOCATION = "Ernakulam, Kerala, India";

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/manikandan-sathyan/",
  },
  {
    label: "GitHub",
    href: "https://github.com/manikandansathyan",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/__man.i.kandan__?psln=MTJ2djFmMno0Z3ZsdA==",
  },
];

const TOPICS = [
  "Website",
  "Web App",
  "Hiring / Job Opportunity",
  "Something else",
];

const EMPTY = {
  name: "",
  email: "",
  topic: TOPICS[0],
  message: "",
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const hasHover = () =>
  typeof window !== "undefined" &&
  !window.matchMedia?.("(hover: none)").matches;

function Contact() {
  const root = useRef(null);
  const formRef = useRef(null);
  const prevStatus = useRef("idle");

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  /* ───────── PAGE ANIMATIONS (ONCE) ───────── */

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(".ct-char", {
        yPercent: 118,
        rotate: 6,
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.035,
        scrollTrigger: {
          trigger: ".ct-title",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".ct-eyebrow span", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".ct-head",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".ct-eyebrow, .ct-intro", {
        opacity: 0,
        y: 30,
        filter: "blur(8px)",
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        clearProps: "filter",
        scrollTrigger: {
          trigger: ".ct-head",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".ct-reveal", {
        opacity: 0,
        y: 44,
        filter: "blur(6px)",
        duration: 1.05,
        ease: "power3.out",
        stagger: 0.12,
        clearProps: "filter",
        scrollTrigger: {
          trigger: ".ct-grid",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".ct-socials li", {
        opacity: 0,
        x: -16,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.35,
        scrollTrigger: {
          trigger: ".ct-socials",
          start: "top 90%",
          once: true,
        },
      });

      gsap.from(".ct-foot > *", {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".ct-foot",
          start: "top 98%",
          once: true,
        },
      });

      gsap.to(".ct-orb--a", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".ct-orb--b", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.6,
        },
      });

      gsap.to(".ct-avail i", {
        scale: 1.4,
        opacity: 0.55,
        duration: 1.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /* ───────── MAGNETIC BUTTONS + LINK ARROW ───────── */

  useEffect(() => {
    if (prefersReducedMotion() || !hasHover() || !root.current) return;

    const cleanups = [];

    root.current
      .querySelectorAll(".ct-btn, .ct-socials a, .ct-foot a")
      .forEach((el) => {
        const mx = gsap.quickTo(el, "x", {
          duration: 0.5,
          ease: "power3",
        });

        const my = gsap.quickTo(el, "y", {
          duration: 0.5,
          ease: "power3",
        });

        const move = (e) => {
          const r = el.getBoundingClientRect();

          mx((e.clientX - (r.left + r.width / 2)) * 0.25);
          my((e.clientY - (r.top + r.height / 2)) * 0.25);
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

    const mail = root.current.querySelector(".ct-mail");
    const arrow = mail?.querySelector("svg");

    if (mail && arrow) {
      const onEnter = () =>
        gsap
          .timeline()
          .to(arrow, {
            x: 8,
            y: -8,
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
          })
          .fromTo(
            arrow,
            { x: -8, y: 8, opacity: 0 },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 0.4,
              ease: "power3.out",
            }
          );

      mail.addEventListener("mouseenter", onEnter);

      cleanups.push(() =>
        mail.removeEventListener("mouseenter", onEnter)
      );
    }

    return () => cleanups.forEach((fn) => fn());
  }, [status]);

  /* ───────── FIELD FOCUS LIFT ───────── */

  useEffect(() => {
    const el = formRef.current;

    if (!el || prefersReducedMotion()) return;

    const onFocusIn = (e) => {
      const field = e.target.closest?.(".ct-field");

      if (field) {
        gsap.to(field, {
          y: -3,
          duration: 0.45,
          ease: "power3.out",
        });
      }
    };

    const onFocusOut = (e) => {
      const field = e.target.closest?.(".ct-field");

      if (field) {
        gsap.to(field, {
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    };

    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);

    return () => {
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  /* ───────── STATUS TRANSITIONS ───────── */

  useEffect(() => {
    const previous = prevStatus.current;
    prevStatus.current = status;

    if (prefersReducedMotion() || !formRef.current) return;

    if (status === "sent") {
      const ctx = gsap.context(() => {
        const check = formRef.current.querySelector(
          ".ct-sent-icon path"
        );

        const tl = gsap.timeline();

        tl.fromTo(
          ".ct-sent-icon",
          { scale: 0, rotate: -25 },
          {
            scale: 1,
            rotate: 0,
            duration: 0.9,
            ease: "back.out(2.4)",
          }
        );

        if (check) {
          const length = check.getTotalLength();

          tl.fromTo(
            check,
            {
              strokeDasharray: length,
              strokeDashoffset: length,
            },
            {
              strokeDashoffset: 0,
              duration: 0.7,
              ease: "power2.out",
            },
            0.25
          );
        }

        tl.from(
          ".ct-sent h3, .ct-sent p, .ct-sent button",
          {
            opacity: 0,
            y: 22,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
          },
          0.4
        );
      }, formRef);

      return () => ctx.revert();
    }

    if (status === "idle" && previous === "sent") {
      const ctx = gsap.context(() => {
        gsap.from(".ct-field, .ct-topics, .ct-btn", {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
        });
      }, formRef);

      return () => ctx.revert();
    }

    if (status === "error") {
      const el = formRef.current.querySelector(".ct-error");

      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          }
        );
      }
    }
  }, [status]);

  /* ───────── FIELD HANDLING ───────── */

  const handleChange = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: "",
      }));
    }

    if (status === "error") {
      setStatus("idle");
    }
  };

  /* ───────── VALIDATION ───────── */

  const validate = () => {
    const newErrors = {};

    if (form.name.trim().length < 2) {
      newErrors.name = "Please tell me your name";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (form.message.trim().length < 10) {
      newErrors.message =
        "A few more words, please (10+ characters)";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ───────── SHAKE INVALID FIELDS ───────── */

  const shakeInvalidFields = () => {
    if (prefersReducedMotion()) return;

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const invalid = formRef.current?.querySelectorAll(
          ".ct-field.has-error"
        );

        if (!invalid?.length) return;

        gsap.fromTo(
          invalid,
          { x: -10 },
          {
            x: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.25)",
            stagger: 0.06,
          }
        );

        gsap.from(
          formRef.current.querySelectorAll(
            ".ct-field.has-error small"
          ),
          {
            opacity: 0,
            y: -6,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      })
    );
  };

  /* ───────── EMAILJS SUBMISSION ───────── */

  const onSubmit = async (e) => {
    e.preventDefault();

    if (status === "sending") return;

    if (!validate()) {
      shakeInvalidFields();
      return;
    }

    if (
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_TEMPLATE_ID ||
      !EMAILJS_PUBLIC_KEY
    ) {
      console.error(
        "EmailJS environment variables are missing. Check your .env file."
      );

      setStatus("error");
      return;
    }

    setStatus("sending");

    const templateParams = {
      from_name: form.name.trim(),
      from_email: form.email.trim(),
      subject: `Portfolio Inquiry — ${form.topic}`,
      message: form.message.trim(),
    };

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      console.log("EmailJS success:", response);

      if (!prefersReducedMotion() && formRef.current) {
        await new Promise((resolve) => {
          gsap.to(formRef.current.children, {
            opacity: 0,
            y: -14,
            duration: 0.35,
            ease: "power2.in",
            stagger: 0.04,
            onComplete: resolve,
          });
        });

        gsap.set(formRef.current.children, {
          clearProps: "opacity,transform",
        });
      }

      setStatus("sent");
      setForm(EMPTY);
      setErrors({});
    } catch (error) {
      console.error("EmailJS submission failed:", error);
      setStatus("error");
    }
  };

  /* ───────── RESET FORM ───────── */

  const handleReset = () => {
    setForm(EMPTY);
    setErrors({});
    setStatus("idle");
  };

  /* ───────── TOPIC PILL POP ───────── */

  const handleTopic = (topic) => (e) => {
    setForm((prev) => ({
      ...prev,
      topic,
    }));

    if (!prefersReducedMotion()) {
      gsap.fromTo(
        e.currentTarget,
        { scale: 0.9 },
        {
          scale: 1,
          duration: 0.6,
          ease: "back.out(3)",
        }
      );
    }
  };

  return (
    <section ref={root} className="ct" id="contact">
      <div className="ct-orb ct-orb--a" />
      <div className="ct-orb ct-orb--b" />

      <div className="ct-wrap">
        {/* HEADER */}

        <div className="ct-head">
          <p className="ct-eyebrow">
            <span />
            05 — Contact
          </p>

          <h2
            className="ct-title"
            aria-label="Let's create something remarkable"
          >
            {["Let's create", "something remarkable"].map(
              (line, i) => (
                <span
                  key={i}
                  className={`ct-row ${
                    i === 1 ? "ct-row--accent" : ""
                  }`}
                >
                  {line.split("").map((c, j) => (
                    <span key={j} className="ct-mask">
                      <span className="ct-char">
                        {c === " " ? "\u00A0" : c}
                      </span>
                    </span>
                  ))}
                </span>
              )
            )}
          </h2>

          <p className="ct-intro">
            Have a website, web app or a bold interface in mind? I’d love
            to hear about it. Drop a message and I’ll get back to you.
          </p>
        </div>

        {/* CONTACT GRID */}

        <div className="ct-grid">
          {/* CONTACT INFORMATION */}

          <aside className="ct-info">
            <div className="ct-reveal">
              <span className="ct-label">Email</span>

              <a className="ct-mail" href={`mailto:${EMAIL}`}>
                {EMAIL}

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            </div>

            <div className="ct-reveal">
              <span className="ct-label">Based in</span>
              <p>{LOCATION}</p>
            </div>

            <div className="ct-reveal">
              <span className="ct-label">Availability</span>

              <p className="ct-avail">
                <i />
                Open to select freelance projects
              </p>
            </div>

            <div className="ct-reveal">
              <span className="ct-label">Elsewhere</span>

              <ul className="ct-socials">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CONTACT FORM */}

          <form
            ref={formRef}
            className="ct-form ct-reveal"
            onSubmit={onSubmit}
            noValidate
          >
            {status === "sent" ? (
              <div className="ct-sent" role="status">
                <span className="ct-sent-icon">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>

                <h3>Message sent successfully.</h3>

                <p>
                  Thank you for reaching out! I've received your
                  message and will get back to you as soon as possible.
                </p>

                <button
                  type="button"
                  className="ct-btn ct-btn--ghost"
                  onClick={handleReset}
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                {/* NAME */}

                <div
                  className={`ct-field ${
                    errors.name ? "has-error" : ""
                  }`}
                >
                  <input
                    id="ct-name"
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder=" "
                    autoComplete="name"
                    required
                  />

                  <label htmlFor="ct-name">Your name</label>

                  {errors.name && <small>{errors.name}</small>}
                </div>

                {/* EMAIL */}

                <div
                  className={`ct-field ${
                    errors.email ? "has-error" : ""
                  }`}
                >
                  <input
                    id="ct-email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder=" "
                    autoComplete="email"
                    required
                  />

                  <label htmlFor="ct-email">Email address</label>

                  {errors.email && <small>{errors.email}</small>}
                </div>

                {/* TOPICS */}

                <fieldset className="ct-topics">
                  <legend>I’m looking for</legend>

                  <div>
                    {TOPICS.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        className={
                          form.topic === topic ? "is-active" : ""
                        }
                        onClick={handleTopic(topic)}
                        aria-pressed={form.topic === topic}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* MESSAGE */}

                <div
                  className={`ct-field ${
                    errors.message ? "has-error" : ""
                  }`}
                >
                  <textarea
                    id="ct-message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange("message")}
                    placeholder=" "
                    required
                  />

                  <label htmlFor="ct-message">
                    Tell me about your project
                  </label>

                  {errors.message && (
                    <small>{errors.message}</small>
                  )}
                </div>

                {/* ERROR */}

                {status === "error" && (
                  <p className="ct-error" role="alert">
                    Something went wrong. Please try again or email me
                    directly.
                  </p>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="ct-btn ct-btn--accent"
                  disabled={status === "sending"}
                >
                  <span>
                    {status === "sending"
                      ? "Sending..."
                      : "Send Message"}
                  </span>

                  {status === "sending" ? (
                    <span
                      className="ct-spinner"
                      aria-hidden="true"
                    />
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </form>
        </div>

        {/* FOOTER */}

        <footer className="ct-foot">
          <span>© {new Date().getFullYear()} Manikandan S</span>

          <span>Designed &amp; built with care</span>

          <a href="#home">Back to top ↑</a>
        </footer>
      </div>
    </section>
  );
}

export default Contact;
