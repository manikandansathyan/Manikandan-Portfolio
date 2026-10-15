import React, { useEffect, useState } from 'react'
import './preloader.css'

function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    let current = 0

    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 4) + 1

      if (current >= 100) {
        current = 100
        clearInterval(interval)

        setTimeout(() => {
          setExiting(true)

          setTimeout(() => {
            if (onComplete) {
              onComplete()
            }
          }, 900)
        }, 700)
      }

      setProgress(current)
    }, 45)

    return () => clearInterval(interval)
  }, [onComplete])

  const getStatus = () => {
    if (progress < 25) return 'INITIALIZING SYSTEM'
    if (progress < 50) return 'LOADING INTERFACE'
    if (progress < 75) return 'BOOTING GUIDE'
    if (progress < 100) return 'CALIBRATING EXPERIENCE'
    return 'SYSTEM READY'
  }

  return (
    <div className={`preloader ${exiting ? 'preloader-exit' : ''}`}>

      <div className="preloader-noise"></div>

      <div className="preloader-content">

        {/* Top label */}
        <div className="preloader-top">
          <span>MANIKANDAN</span>
          <span>PORTFOLIO / 2026</span>
        </div>

        {/* Robot */}
        <div className={`preloader-robot ${progress > 15 ? 'robot-active' : ''}`}>

          <div className="robot-head">

            <div className="robot-ear robot-ear-left"></div>
            <div className="robot-ear robot-ear-right"></div>

            <div className="robot-face">

              <div className="robot-eyes">
                <span></span>
                <span></span>
              </div>

              <div className="robot-mouth">
                <i></i>
                <i></i>
                <i></i>
              </div>

            </div>

          </div>

          <div className="robot-neck"></div>

          <div className="robot-body">
            <div className="robot-body-light"></div>
          </div>

        </div>

        {/* Main text */}
        <div className="preloader-intro">
          <p className="preloader-eyebrow">
            DIGITAL PORTFOLIO
          </p>

          <h1>
            MANIKANDAN
            <span> SATHYAN</span>
          </h1>

          <p className="preloader-status">
            {getStatus()}
          </p>
        </div>

        {/* Progress */}
        <div className="preloader-progress">

          <div className="progress-info">
            <span>LOADING EXPERIENCE</span>
            <span>{String(progress).padStart(3, '0')}%</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

        </div>

      </div>

      {/* Bottom information */}
      <div className="preloader-bottom">

        <span>FRONTEND DEVELOPER</span>

        <div className="preloader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <span>
          {progress === 100 ? 'WELCOME' : 'PLEASE WAIT'}
        </span>

      </div>

      {/* Exit panels */}
      <div className="preloader-panel preloader-panel-top"></div>
      <div className="preloader-panel preloader-panel-bottom"></div>

    </div>
  )
}

export default Preloader