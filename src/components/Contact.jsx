import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ───────── EDIT THESE ───────── */
const EMAIL = 'manikandansathyan02@email.com'
const FORM_ENDPOINT = ''
const LOCATION = 'Ernakulam, Kerala, India'
const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/manikandan-sathyan/?isSelfProfile=true' },
  { label: 'GitHub', href: 'https://github.com/manikandansathyan' },
  { label: 'Instagram', href: 'https://www.instagram.com/__man.i.kandan__?psln=MTJ2djFmMno0Z3ZsdA==' },
]
const TOPICS = ['Website', 'Web App', 'Hiring / Job Opportunity', 'Something else']
/* ────────────────────────────── */

const EMPTY = { name: '', email: '', topic: TOPICS[0], message: '' }

function Contact() {
  const root = useRef(null)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ct-char', {
        yPercent: 115,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.035,
        scrollTrigger: { trigger: '.ct-title', start: 'top 85%' },
      })
      gsap.from('.ct-eyebrow, .ct-intro', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.ct-head', start: 'top 85%' },
      })
      gsap.from('.ct-reveal', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.ct-grid', start: 'top 82%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: '' }))
  }

  const validate = () => {
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Please tell me your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Enter a valid email address'
    if (form.message.trim().length < 10) er.message = 'A few more words, please (10+ characters)'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || status === 'sending') return
    setStatus('sending')

    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Request failed')
      } else {
        const subject = encodeURIComponent(`Portfolio enquiry — ${form.topic}`)
        const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
        window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
      }
      setStatus('sent')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section ref={root} className="ct" id="contact">
      <div className="ct-orb ct-orb--a" />
      <div className="ct-orb ct-orb--b" />

      <div className="ct-wrap">
        <div className="ct-head">
          <p className="ct-eyebrow">
            <span /> 05 — Contact
          </p>
          <h2 className="ct-title" aria-label="Let's create something remarkable">
            {["Let's create", 'something remarkable'].map((line, i) => (
              <span key={i} className={`ct-row ${i === 1 ? 'ct-row--accent' : ''}`}>
                {line.split('').map((c, j) => (
                  <span key={j} className="ct-mask">
                    <span className="ct-char">{c === ' ' ? ' ' : c}</span>
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="ct-intro">
            Have a website, web app or a bold interface in mind? I’d love to hear about it.
            Drop a message and I’ll get back to you.
          </p>
        </div>

        <div className="ct-grid">
          {/* info */}
          <aside className="ct-info">
            <div className="ct-reveal">
              <span className="ct-label">Email</span>
              <a className="ct-mail" href={`mailto:${EMAIL}`}>
                {EMAIL}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
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
                <i /> Open to select freelance projects
              </p>
            </div>

            <div className="ct-reveal">
              <span className="ct-label">Elsewhere</span>
              <ul className="ct-socials">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* form */}
          <form className="ct-form ct-reveal" onSubmit={onSubmit} noValidate>
            {status === 'sent' ? (
              <div className="ct-sent" role="status">
                <span className="ct-sent-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <h3>Message ready to go.</h3>
                <p>
                  {FORM_ENDPOINT
                    ? 'Thank you — I’ll reply as soon as I can.'
                    : 'Your email app should have opened with the message filled in. Just hit send.'}
                </p>
                <button type="button" className="ct-btn ct-btn--ghost" onClick={() => setStatus('idle')}>
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className={`ct-field ${errors.name ? 'has-error' : ''}`}>
                  <input id="ct-name" value={form.name} onChange={set('name')} placeholder=" " autoComplete="name" />
                  <label htmlFor="ct-name">Your name</label>
                  {errors.name && <small>{errors.name}</small>}
                </div>

                <div className={`ct-field ${errors.email ? 'has-error' : ''}`}>
                  <input
                    id="ct-email"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder=" "
                    autoComplete="email"
                  />
                  <label htmlFor="ct-email">Email address</label>
                  {errors.email && <small>{errors.email}</small>}
                </div>

                <fieldset className="ct-topics">
                  <legend>I’m looking for</legend>
                  <div>
                    {TOPICS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={form.topic === t ? 'is-active' : ''}
                        onClick={() => setForm((f) => ({ ...f, topic: t }))}
                        aria-pressed={form.topic === t}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className={`ct-field ${errors.message ? 'has-error' : ''}`}>
                  <textarea
                    id="ct-message"
                    rows="5"
                    value={form.message}
                    onChange={set('message')}
                    placeholder=" "
                  />
                  <label htmlFor="ct-message">Tell me about your project</label>
                  {errors.message && <small>{errors.message}</small>}
                </div>

                {status === 'error' && (
                  <p className="ct-error" role="alert">
                    Something went wrong. Please try again or email me directly.
                  </p>
                )}

                <button type="submit" className="ct-btn ct-btn--accent" disabled={status === 'sending'}>
                  <span>{status === 'sending' ? 'Sending…' : 'Send Message'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </>
            )}
          </form>
        </div>

        <footer className="ct-foot">
          <span>© {new Date().getFullYear()} Manikandan S</span>
          <span>Designed &amp; built with care</span>
          <a href="#home">Back to top ↑</a>
        </footer>
      </div>
    </section>
  )
}

export default Contact