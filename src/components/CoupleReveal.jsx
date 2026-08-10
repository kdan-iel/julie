import { useEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────
//  BOTANICAL ORNAMENT SVG — bespoke sage branch
// ─────────────────────────────────────────────────────────
function BotanicalOrnament() {
  return (
    <svg
      width="160" height="48"
      viewBox="0 0 160 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Central stem */}
      <line x1="12" y1="24" x2="148" y2="24" stroke="#8A9A80" strokeWidth="0.7" opacity="0.8"/>
      {/* Left sprigs */}
      <line x1="35" y1="24" x2="24" y2="10" stroke="#8A9A80" strokeWidth="0.65" opacity="0.7"/>
      <ellipse cx="20" cy="7" rx="7" ry="4" fill="none" stroke="#8A9A80" strokeWidth="0.6" transform="rotate(-25 20 7)" opacity="0.65"/>
      <line x1="50" y1="24" x2="43" y2="36" stroke="#8A9A80" strokeWidth="0.65" opacity="0.7"/>
      <ellipse cx="40" cy="40" rx="6" ry="3.5" fill="none" stroke="#8A9A80" strokeWidth="0.55" transform="rotate(18 40 40)" opacity="0.6"/>
      <line x1="62" y1="24" x2="56" y2="12" stroke="#8A9A80" strokeWidth="0.6" opacity="0.65"/>
      <ellipse cx="53" cy="9" rx="6" ry="3" fill="none" stroke="#8A9A80" strokeWidth="0.5" transform="rotate(-12 53 9)" opacity="0.55"/>
      {/* Center detail */}
      <circle cx="80" cy="24" r="3" fill="#8A9A80" opacity="0.35"/>
      <circle cx="80" cy="24" r="1.5" fill="#8A9A80" opacity="0.6"/>
      {/* Right sprigs (mirror) */}
      <line x1="98" y1="24" x2="104" y2="12" stroke="#8A9A80" strokeWidth="0.6" opacity="0.65"/>
      <ellipse cx="107" cy="9" rx="6" ry="3" fill="none" stroke="#8A9A80" strokeWidth="0.5" transform="rotate(12 107 9)" opacity="0.55"/>
      <line x1="110" y1="24" x2="117" y2="36" stroke="#8A9A80" strokeWidth="0.65" opacity="0.7"/>
      <ellipse cx="120" cy="40" rx="6" ry="3.5" fill="none" stroke="#8A9A80" strokeWidth="0.55" transform="rotate(-18 120 40)" opacity="0.6"/>
      <line x1="125" y1="24" x2="136" y2="10" stroke="#8A9A80" strokeWidth="0.65" opacity="0.7"/>
      <ellipse cx="140" cy="7" rx="7" ry="4" fill="none" stroke="#8A9A80" strokeWidth="0.6" transform="rotate(25 140 7)" opacity="0.65"/>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
//  LETTER-BY-LETTER ANIMATION
// ─────────────────────────────────────────────────────────
function AnimatedName({ name, startDelay = 0, visible }) {
  const letters = name.split('')
  return (
    <span aria-label={name} style={{ display:'inline-block' }}>
      {letters.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(60px)',
            transition: visible
              ? `opacity 0.7s ${startDelay + i * 55}ms cubic-bezier(0.25,0.46,0.45,0.94),
                 transform 0.9s ${startDelay + i * 55}ms cubic-bezier(0.34,1.56,0.64,1)`
              : 'none',
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}

// ─────────────────────────────────────────────────────────
//  BACKGROUND FOLIAGE (pure CSS/SVG, no Three.js needed)
// ─────────────────────────────────────────────────────────
function BackgroundFoliage() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
        opacity: 0.055,
      }}
    >
      <svg
        width="100%" height="100%"
        viewBox="0 0 900 700"
        preserveAspectRatio="xMidYMid slice"
        style={{ animation: 'foliageDrift 12s ease-in-out infinite alternate' }}
      >
        <style>{`
          @keyframes foliageDrift {
            from { transform: translateY(0) rotate(0deg); }
            to   { transform: translateY(-12px) rotate(0.8deg); }
          }
        `}</style>
        <g fill="none" stroke="#8A9A80" strokeWidth="1">
          {/* Top-left branch */}
          <path d="M40 60 Q80 40 120 70 Q160 100 200 80" strokeWidth="1.2"/>
          <ellipse cx="90" cy="45" rx="20" ry="10" transform="rotate(-30 90 45)"/>
          <ellipse cx="150" cy="88" rx="18" ry="8" transform="rotate(20 150 88)"/>
          <ellipse cx="195" cy="72" rx="16" ry="7" transform="rotate(-10 195 72)"/>
          {/* Top-right branch */}
          <path d="M860 40 Q820 60 780 45 Q740 30 700 55" strokeWidth="1.1"/>
          <ellipse cx="815" cy="55" rx="18" ry="9" transform="rotate(25 815 55)"/>
          <ellipse cx="745" cy="34" rx="16" ry="8" transform="rotate(-20 745 34)"/>
          {/* Bottom-left */}
          <path d="M30 600 Q70 570 110 590 Q150 610 190 585" strokeWidth="1"/>
          <ellipse cx="80" cy="575" rx="18" ry="8" transform="rotate(-15 80 575)"/>
          <ellipse cx="155" cy="605" rx="16" ry="7" transform="rotate(22 155 605)"/>
          {/* Bottom-right */}
          <path d="M870 620 Q830 595 790 610 Q750 625 710 605" strokeWidth="1"/>
          <ellipse cx="820" cy="600" rx="17" ry="8" transform="rotate(18 820 600)"/>
          <ellipse cx="755" cy="622" rx="15" ry="7" transform="rotate(-12 755 622)"/>
          {/* Side accents */}
          <path d="M15 320 Q45 300 60 340" strokeWidth="0.8"/>
          <ellipse cx="40" cy="305" rx="14" ry="6" transform="rotate(-35 40 305)" opacity="0.7"/>
          <path d="M885 280 Q855 300 840 260" strokeWidth="0.8"/>
          <ellipse cx="860" cy="295" rx="14" ry="6" transform="rotate(35 860 295)" opacity="0.7"/>
        </g>
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  EXPORT
// ─────────────────────────────────────────────────────────
export default function CoupleReveal({ visible }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!visible) return
    const timers = [
      setTimeout(() => setPhase(1), 80),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 1200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [visible])

  if (!visible) return null

  return (
    <section
      className="section-couple"
      aria-label="Les mariés"
      style={{ minHeight:'100vh', position:'relative' }}
    >
      <BackgroundFoliage />

      <div className="couple-names-wrap" style={{ position:'relative', zIndex:1 }}>

        {/* ÉLISE */}
        <div
          className="couple-name"
          style={{
            overflow:'hidden',
            opacity: phase >= 1 ? 1 : 0,
            transition:'opacity 0.4s ease',
          }}
        >
          <AnimatedName name="Élise" startDelay={0} visible={phase >= 1} />
        </div>

        {/* Botanical ornament */}
        <div
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'scale(1)' : 'scale(0.7)',
            transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34,1.56,0.64,1)',
            display:'flex', alignItems:'center', gap:20,
            padding:'16px 0',
          }}
          role="separator"
          aria-label="et"
        >
          <BotanicalOrnament />
        </div>

        {/* THÉO */}
        <div
          className="couple-name"
          style={{
            overflow:'hidden',
            opacity: phase >= 3 ? 1 : 0,
            transition:'opacity 0.4s ease',
          }}
        >
          <AnimatedName name="Théo" startDelay={0} visible={phase >= 3} />
        </div>

        {/* Date line */}
        <p
          className="couple-date"
          style={{
            marginTop: 48,
            opacity: phase >= 4 ? 0.55 : 0,
            transform: phase >= 4 ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 1s ease, transform 1s ease',
          }}
        >
          14 juin 2025 &nbsp;·&nbsp; Bordeaux, France
        </p>

        {/* Scroll cue */}
        <div
          style={{
            marginTop: 56,
            opacity: phase >= 4 ? 0.4 : 0,
            transition: 'opacity 1s 0.5s ease',
            display:'flex', flexDirection:'column', alignItems:'center', gap:8,
          }}
          aria-hidden="true"
        >
          <span style={{
            fontFamily:'var(--font-sans)', fontSize:9, letterSpacing:'0.35em',
            textTransform:'uppercase', color:'var(--anthracite)',
          }}>
            Défiler
          </span>
          <svg width="1" height="40" viewBox="0 0 1 40">
            <line x1="0.5" y1="0" x2="0.5" y2="40" stroke="var(--anthracite)" strokeWidth="0.8"
              strokeDasharray="4 4"
              style={{ animation:'dashScroll 1.6s linear infinite' }}
            />
            <style>{`
              @keyframes dashScroll {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -16; }
              }
            `}</style>
          </svg>
        </div>
      </div>
    </section>
  )
}
