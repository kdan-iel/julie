import { useState, useEffect } from 'react'

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [hidden,   setHidden]   = useState(false)

  useEffect(() => {
    const DURATION = 2400
    let start = null
    const EASE = (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t  // ease in-out quad

    const tick = (ts) => {
      if (!start) start = ts
      const t = Math.min((ts - start) / DURATION, 1)
      setProgress(Math.round(EASE(t) * 100))
      if (t < 1) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setHidden(true)
          setTimeout(onComplete, 850)
        }, 200)
      }
    }
    requestAnimationFrame(tick)
  }, [onComplete])

  return (
    <div
      className={`loader-wrap ${hidden ? 'hidden' : ''}`}
      aria-live="polite"
      aria-label={`Chargement : ${progress}%`}
      role="status"
    >
      {/* Animated seal ring */}
      <div className="loader-seal">
        <div className="loader-seal-ring" />
        {/* Monogram */}
        <svg
          style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
          }}
          width="28" height="20" viewBox="0 0 28 20" fill="none"
          aria-hidden="true"
        >
          <text
            x="14" y="14"
            textAnchor="middle"
            fontFamily="Fraunces, Georgia, serif"
            fontSize="13"
            fontWeight="300"
            fill="#C9A66B"
            letterSpacing="-0.5"
          >
            É·T
          </text>
        </svg>
      </div>

      {/* Label */}
      <p className="loader-text">Préparation de votre invitation…</p>

      {/* Progress line */}
      <div className="loader-progress-line" aria-hidden="true">
        <div className="loader-progress-fill" style={{ width:`${progress}%` }} />
      </div>

      {/* Percentage */}
      <p style={{
        marginTop: 8,
        fontFamily: 'var(--font-sans)',
        fontSize: 10,
        letterSpacing: '0.2em',
        color: 'var(--gold)',
        opacity: 0.5,
        fontWeight: 300,
      }} aria-hidden="true">
        {progress}%
      </p>
    </div>
  )
}
