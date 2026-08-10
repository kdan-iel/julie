import { useState, useEffect, useRef, useCallback } from 'react'
import Loader from './components/Loader.jsx'
import LandingSection from './components/LandingSection.jsx'
import CoupleReveal from './components/CoupleReveal.jsx'
import ScrollSections from './components/ScrollSections.jsx'
import MusicToggle from './components/MusicToggle.jsx'
import EnvelopeScene from './components/EnvelopeScene.jsx'

// ─────────────────────────────────────────────────────────
//  REDUCED MOTION
// ─────────────────────────────────────────────────────────
function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const h = (e) => setReduced(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  return reduced
}

// ─────────────────────────────────────────────────────────
//  SKIP BUTTON
// ─────────────────────────────────────────────────────────
function SkipButton({ onSkip }) {
  return (
    <button
      className="skip-btn"
      onClick={onSkip}
      aria-label="Passer l'animation d'introduction"
    >
      Passer &rarr;
    </button>
  )
}

// ─────────────────────────────────────────────────────────
//  FLAT / REDUCED-MOTION ENVELOPE
// ─────────────────────────────────────────────────────────
function FallbackEnvelope({ onOpen }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10,
      background: 'var(--ivory)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24,
    }}>
      {/* SVG envelope */}
      <svg
        viewBox="0 0 260 176"
        width="260" height="176"
        style={{ cursor: 'pointer', filter: 'drop-shadow(0 8px 32px rgba(42,39,36,0.10))' }}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOpen()}
        aria-label="Ouvrir l'invitation"
      >
        {/* body */}
        <rect x="1" y="1" width="258" height="174" rx="2" fill="#EDE6D8" stroke="rgba(138,154,128,0.25)" strokeWidth="0.8"/>
        {/* inner V folds */}
        <polygon points="1,1 259,1 130,88" fill="#E4DCD0" opacity="0.9"/>
        <polygon points="1,1 1,175 88,88" fill="#E8E2D8"/>
        <polygon points="259,1 259,175 172,88" fill="#E8E2D8"/>
        <polygon points="1,175 259,175 130,88" fill="#EAE4DC"/>
        {/* wax seal */}
        <circle cx="130" cy="88" r="28" fill="#B3122B" filter="url(#gs)"/>
        <circle cx="130" cy="88" r="22" fill="none" stroke="#8B0A1E" strokeWidth="1.2"/>
        <text x="130" y="93" textAnchor="middle" fontFamily="Fraunces,serif" fontSize="14" fontWeight="300" fill="#F5E8C0" letterSpacing="-0.5">É·T</text>
        <defs>
          <filter id="gs" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0.4  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0" in="blur" result="glow"/>
            <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      </svg>

      <p style={{ fontFamily:'var(--font-serif)', fontSize:18, fontWeight:300, fontStyle:'italic', color:'var(--anthracite)', opacity:0.75 }}>
        Une invitation vous attend.
      </p>
      <button onClick={onOpen} style={{
        fontFamily:'var(--font-sans)', fontSize:11, letterSpacing:'0.3em',
        textTransform:'uppercase', background:'none', border:'none',
        color:'var(--anthracite)', cursor:'pointer', padding:'8px 0', fontWeight:300,
      }}>
        Ouvrir l'invitation
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  CROSSFADE TRANSITION VEIL
// ─────────────────────────────────────────────────────────
function TransitionVeil({ visible }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: 'var(--ivory)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transition: 'opacity 1.4s cubic-bezier(0.65,0,0.35,1)',
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────
//  WARM GLOW DURING OPENING
// ─────────────────────────────────────────────────────────
function OpeningGlow({ active }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(210,100,50,0.10) 0%, transparent 70%)',
        opacity: active ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────
//  EASING HELPERS
// ─────────────────────────────────────────────────────────
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }
function easeElastic(t) {
  if (t === 0 || t === 1) return t
  const c4 = (2 * Math.PI) / 3
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
}
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4) }

// ─────────────────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────────────────
export default function App() {
  const reducedMotion = useReducedMotion()

  // Phase: 'loading' → 'landing' → 'opening' → 'crossfade' → 'revealing' → 'reading'
  const [phase, setPhase] = useState('loading')

  // Fine-grained animation values
  const [crackProgress, setCrackProgress]   = useState(0)  // seal crack  0→1
  const [openProgress, setOpenProgress]     = useState(0)  // flap open   0→1
  const [slideProgress, setSlideProgress]   = useState(0)  // card slide  0→1
  const [crossfading, setCrossfading]       = useState(false)

  const rafId = useRef(null)
  const startTs = useRef(null)

  // Cleanup
  useEffect(() => () => { if (rafId.current) cancelAnimationFrame(rafId.current) }, [])

  // ── Opening choreography ──────────────────────────────
  const handleOpen = useCallback(() => {
    if (phase !== 'landing') return
    setPhase('opening')
    startTs.current = null

    // Timeline (ms)
    const T = {
      CRACK_START: 0,    CRACK_END: 380,
      FLAP_START:  300,  FLAP_END:  1700,
      CARD_START:  900,  CARD_END:  2300,
      XFADE_START: 2100,
      REVEAL_AT:   2900,
    }

    function tick(now) {
      if (!startTs.current) startTs.current = now
      const e = now - startTs.current

      // Seal crack
      if (e <= T.CRACK_END) {
        setCrackProgress(easeOutCubic(Math.min((e - T.CRACK_START) / (T.CRACK_END - T.CRACK_START), 1)))
      }
      // Flap
      if (e >= T.FLAP_START) {
        setOpenProgress(easeElastic(Math.min((e - T.FLAP_START) / (T.FLAP_END - T.FLAP_START), 1)))
      }
      // Card
      if (e >= T.CARD_START) {
        setSlideProgress(easeOutQuart(Math.min((e - T.CARD_START) / (T.CARD_END - T.CARD_START), 1)))
      }
      // Cross-fade veil
      if (e >= T.XFADE_START && !crossfading) {
        setCrossfading(true)
      }
      // Transition to reveal
      if (e >= T.REVEAL_AT) {
        setPhase('revealing')
        setCrossfading(false)
        setTimeout(() => setPhase('reading'), 100)
        return
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
  }, [phase, crossfading])

  // ── Skip ─────────────────────────────────────────────
  const handleSkip = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
    setCrackProgress(1)
    setOpenProgress(1)
    setSlideProgress(1)
    setCrossfading(true)
    setPhase('crossfade')
    setTimeout(() => {
      setCrossfading(false)
      setPhase('revealing')
      setTimeout(() => setPhase('reading'), 80)
    }, 500)
  }, [])

  // ── Loader done ───────────────────────────────────────
  const handleLoadDone = useCallback(() => setPhase('landing'), [])

  const isOpen   = phase === 'reading' || phase === 'revealing' || phase === 'crossfade'
  const is3D     = phase === 'landing' || phase === 'opening'
  const openState = phase === 'landing' ? 'closed' : phase === 'opening' ? 'opening' : 'open'

  // ─────────────────────────────────────────────────────
  //  REDUCED MOTION PATH
  // ─────────────────────────────────────────────────────
  if (reducedMotion) {
    return (
      <>
        {phase === 'loading' && <Loader onComplete={handleLoadDone} />}
        {phase === 'landing' && <FallbackEnvelope onOpen={handleOpen} />}
        {(phase === 'opening' || phase === 'crossfade') && (
          <div style={{ position:'fixed', inset:0, zIndex:10, background:'var(--ivory)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <p style={{ fontFamily:'var(--font-serif)', fontSize:18, fontWeight:300, fontStyle:'italic', opacity:0.6 }}>
              Ouverture…
            </p>
          </div>
        )}
        {isOpen && (
          <div>
            <CoupleReveal visible />
            <ScrollSections />
            <MusicToggle visible />
          </div>
        )}
      </>
    )
  }

  // ─────────────────────────────────────────────────────
  //  FULL 3D EXPERIENCE
  // ─────────────────────────────────────────────────────
  return (
    <>
      {/* ── LOADER ── */}
      {phase === 'loading' && <Loader onComplete={handleLoadDone} />}

      {/* ── 3D CANVAS (fixed, covers screen during intro) ── */}
      {is3D && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 2,
            pointerEvents: phase === 'landing' ? 'all' : 'none',
          }}
        >
          <EnvelopeScene
            openState={openState}
            crackProgress={crackProgress}
            openProgress={openProgress}
            slideProgress={slideProgress}
            showFoliage={false}
          />
        </div>
      )}

      {/* ── LANDING DOM OVERLAY ── */}
      {phase === 'landing' && (
        <div style={{ position:'relative', zIndex:3 }}>
          <LandingSection onOpen={handleOpen} />
        </div>
      )}

      {/* ── WARM GLOW (during opening) ── */}
      <OpeningGlow active={phase === 'opening' && openProgress > 0.3} />

      {/* ── SKIP BUTTON ── */}
      {phase === 'opening' && <SkipButton onSkip={handleSkip} />}

      {/* ── CROSSFADE VEIL ── */}
      <TransitionVeil visible={crossfading} />

      {/* ── MAIN CONTENT (after opening) ── */}
      {isOpen && (
        <div
          style={{
            position: 'relative', zIndex: 2,
            opacity: crossfading ? 0 : 1,
            transition: 'opacity 1.2s cubic-bezier(0.65,0,0.35,1)',
          }}
        >
          <CoupleReveal visible={!crossfading} />
          <ScrollSections />
        </div>
      )}

      {/* ── MUSIC TOGGLE (persistent after opening) ── */}
      <MusicToggle visible={phase === 'reading' || phase === 'revealing'} />
    </>
  )
}
