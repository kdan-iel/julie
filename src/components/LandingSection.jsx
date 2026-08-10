import { useEffect, useState } from 'react'

export default function LandingSection({ onOpen }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
    )
  }, [])

  return (
    <section
      style={{
        position:'relative', height:'100vh',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'flex-end',
        paddingBottom:'10vh',
        zIndex:2,
        pointerEvents:'none', // canvas handles click for 3D; DOM layer for the button
      }}
      aria-label="Invitation de mariage — Élise & Théo"
    >
      <div
        style={{
          textAlign:'center',
          display:'flex', flexDirection:'column',
          alignItems:'center', gap:20,
          pointerEvents:'all',
        }}
      >
        <p className="landing-tagline">Une invitation vous attend.</p>

        <button
          className="open-btn"
          onClick={onOpen}
          aria-label="Ouvrir l'invitation de mariage"
        >
          <span className="open-btn-glow" aria-hidden="true" />
          {isMobile ? 'Appuyez pour ouvrir' : 'Cliquez pour ouvrir'}
        </button>

        {/* Subtle scroll/interaction hint arrow */}
        <div style={{ marginTop:8, opacity:0, animation:'fadeInUp 1s 2.2s ease forwards' }} aria-hidden="true">
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none" style={{ opacity:0.3 }}>
            <path d="M10 2L10 22M4 16L10 22L16 16" stroke="var(--anthracite)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
