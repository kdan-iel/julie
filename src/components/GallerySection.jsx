import { useEffect, useRef, useState } from 'react'

// Photo placeholder card
function PhotoCard({ w, h, label, tint, index }) {
  return (
    <div
      style={{
        width: w, height: h, flexShrink: 0,
        background: tint,
        border: '1px solid rgba(138,154,128,0.12)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      aria-label={label}
      role="img"
    >
      {/* Subtle inner gradient */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(135deg, transparent 45%, rgba(201,166,107,0.06))',
        pointerEvents:'none',
      }}/>
      {/* Frame corner accents */}
      {['top-left','top-right','bottom-left','bottom-right'].map(corner => (
        <div key={corner} style={{
          position:'absolute',
          top:    corner.includes('top')    ? 10 : 'auto',
          bottom: corner.includes('bottom') ? 10 : 'auto',
          left:   corner.includes('left')   ? 10 : 'auto',
          right:  corner.includes('right')  ? 10 : 'auto',
          width:12, height:12,
          borderTop:    corner.includes('top')    ? '1px solid rgba(201,166,107,0.35)' : 'none',
          borderBottom: corner.includes('bottom') ? '1px solid rgba(201,166,107,0.35)' : 'none',
          borderLeft:   corner.includes('left')   ? '1px solid rgba(201,166,107,0.35)' : 'none',
          borderRight:  corner.includes('right')  ? '1px solid rgba(201,166,107,0.35)' : 'none',
        }}/>
      ))}
      {/* Photo icon */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity:0.14 }}>
        <rect x="2" y="4" width="24" height="20" rx="2" stroke="#8A9A80" strokeWidth="1"/>
        <circle cx="10" cy="12" r="3" stroke="#8A9A80" strokeWidth="1"/>
        <path d="M2 20L8 14L13 18L18 12L26 20" stroke="#8A9A80" strokeWidth="1"/>
      </svg>
      {/* Caption */}
      {label && (
        <span style={{
          position:'absolute', bottom:10, left:0, right:0, textAlign:'center',
          fontFamily:'Cormorant Garamond, serif', fontSize:10,
          color:'var(--anthracite)', letterSpacing:'0.12em',
          opacity:0.4, fontStyle:'italic',
        }}>{label}</span>
      )}
    </div>
  )
}

const LAYERS = {
  back: [
    { w:300, h:400, label:'Bordeaux · 2019', tint:'#E8E2D8' },
    { w:220, h:290, label:'Premier voyage', tint:'#EDE8E0' },
    { w:340, h:450, label:'Paris · 2021',   tint:'#E4DDD4' },
    { w:260, h:350, label:'Les fiançailles', tint:'#EAE4DC' },
    { w:200, h:260, label:'Ischia · 2022',   tint:'#E6E0D6' },
  ],
  mid: [
    { w:250, h:330, label:'St-Jean-de-Luz',  tint:'#F0EAE0' },
    { w:290, h:390, label:'Notre maison',     tint:'#EBE5DB' },
    { w:210, h:270, label:'Noël 2023',        tint:'#E6E0D6' },
    { w:320, h:420, label:'La demande',       tint:'#EFE8DE' },
    { w:240, h:310, label:'Essayage',         tint:'#F0EAE0' },
  ],
  front: [
    { w:190, h:250, label:'La veille',         tint:'#F2ECE2' },
    { w:260, h:340, label:'Répétition',        tint:'#E8E2D8' },
    { w:220, h:295, label:'Derniers instants', tint:'#EDE7DD' },
    { w:180, h:240, label:'Le bouquet',        tint:'#EEE8DE' },
  ],
}

export default function GallerySection() {
  const sectionRef = useRef()
  const [scrollRatio, setScrollRatio] = useState(0.5)

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const winH  = window.innerHeight
      const ratio = (winH * 0.5 - rect.top) / rect.height
      setScrollRatio(Math.max(0, Math.min(1, ratio)))
    }
    window.addEventListener('scroll', onScroll, { passive:true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Parallax offsets — layers move at different speeds
  const offset = (scrollRatio - 0.5)
  const backX  = offset * -140
  const midX   = offset * -60
  const frontX = offset *  50

  return (
    <section
      ref={sectionRef}
      style={{ padding:'120px 0 80px', overflow:'hidden', position:'relative' }}
      aria-label="Galerie — instants partagés"
      id="galerie"
    >
      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 24px', marginBottom:64 }}>
        <p className="section-eyebrow">Notre galerie</p>
        <h2 className="section-title">Instants partagés</h2>
      </div>

      {/* Three parallax layers stacked */}
      <div style={{ position:'relative', height:520, pointerEvents:'none' }}>

        {/* BACK — blurred, muted */}
        <div style={{
          position:'absolute', top:10, left:0,
          display:'flex', gap:20, paddingLeft:'8vw',
          transform:`translateX(${backX}px)`,
          willChange:'transform',
          opacity:0.38, filter:'blur(2px)',
          transition:'transform 0.08s linear',
        }} aria-hidden="true">
          {LAYERS.back.map((p,i) => <PhotoCard key={i} {...p} index={i}/>)}
        </div>

        {/* MID — main visible layer */}
        <div style={{
          position:'absolute', top:70, left:0,
          display:'flex', gap:22, paddingLeft:'3vw',
          transform:`translateX(${midX}px)`,
          willChange:'transform',
          opacity:0.78,
          transition:'transform 0.08s linear',
        }}>
          {LAYERS.mid.map((p,i) => <PhotoCard key={i} {...p} index={i}/>)}
        </div>

        {/* FRONT — sharpest, most present */}
        <div style={{
          position:'absolute', top:155, left:0,
          display:'flex', gap:18, paddingLeft:'18vw',
          transform:`translateX(${frontX}px)`,
          willChange:'transform',
          transition:'transform 0.08s linear',
        }}>
          {LAYERS.front.map((p,i) => <PhotoCard key={i} {...p} index={i}/>)}
        </div>
      </div>

      {/* Instruction */}
      <p style={{
        textAlign:'center', marginTop:44,
        fontFamily:'Cormorant Garamond, serif', fontSize:13,
        fontWeight:300, fontStyle:'italic',
        color:'var(--anthracite)', opacity:0.35, letterSpacing:'0.04em',
      }}>
        Remplacez ces cadres par vos propres photographies.
      </p>
    </section>
  )
}
