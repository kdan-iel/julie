import { useEffect, useRef, useState } from 'react'
import RSVPForm from './RSVPForm.jsx'
import VenueIllustration from './VenueIllustration.jsx'
import GallerySection from './GallerySection.jsx'

// ─────────────────────────────────────────────────────────
//  INTERSECTION OBSERVER HOOK
// ─────────────────────────────────────────────────────────
function useReveal(threshold = 0.18) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

// ─────────────────────────────────────────────────────────
//  DIVIDER
// ─────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <div className="divider-line" />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="divider-ornament">
        <circle cx="7" cy="7" r="2.5" fill="#8A9A80" opacity="0.45"/>
        <circle cx="7" cy="7" r="6" stroke="#8A9A80" strokeWidth="0.6" opacity="0.25"/>
      </svg>
      <div className="divider-line" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  STORY SECTION
// ─────────────────────────────────────────────────────────
function StoryPhrase({ children, delay, visible }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [visible, delay])
  return (
    <span
      style={{
        display:'block',
        opacity: show ? 0.82 : 0,
        transform: show ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
        lineHeight: 1.75,
      }}
    >
      {children}
    </span>
  )
}

function StorySection() {
  const [ref, visible] = useReveal(0.12)
  const phrases = [
    "Tout a commencé par une rencontre inattendue,",
    "un matin de novembre 2019,",
    "dans une librairie bordelaise où la pluie avait chassé deux inconnus vers le même rayon.",
    " ",
    "Ce qu'ils cherchaient ce jour-là — chacun à leur façon —",
    "c'est exactement ce qu'ils ont trouvé l'un en l'autre.",
    " ",
    "Aujourd'hui, ils vous invitent à célébrer avec eux",
    "le commencement de leur histoire commune.",
  ]
  return (
    <div
      className="section"
      ref={ref}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transition:'all 1s ease' }}
    >
      <p className="section-eyebrow">Notre histoire</p>
      <div className="section-body" style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {phrases.map((p, i) => (
          <StoryPhrase key={i} delay={80 + i * 110} visible={visible}>{p === ' ' ? '\u00A0' : p}</StoryPhrase>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  DATE SECTION — digit construction animation
// ─────────────────────────────────────────────────────────
function AnimatedDigit({ char, visible, delay }) {
  return (
    <span className="date-num">
      <span
        className="date-num-inner"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(110%)',
          transition: visible
            ? `transform 1.1s ${delay}ms cubic-bezier(0.34,1.56,0.64,1)`
            : 'none',
        }}
      >
        {char}
      </span>
    </span>
  )
}

function DateSection() {
  const [ref, visible] = useReveal(0.25)
  // 14 · 06 · 2025
  const groups = [
    { chars:['1','4'], base:0 },
    { sep:true, delay:220 },
    { chars:['0','6'], base:160 },
    { sep:true, delay:440 },
    { chars:['2','0','2','5'], base:320 },
  ]
  return (
    <div className="section-date" ref={ref}>
      <p className="section-eyebrow" style={{ justifyContent:'center', marginBottom:48 }}>Le grand jour</p>
      <div className="date-display" role="time" dateTime="2025-06-14" aria-label="14 juin 2025">
        {groups.map((g, gi) => g.sep
          ? (
            <span key={gi} className="date-sep" style={{
              opacity: visible ? 1 : 0,
              transition: `opacity 0.5s ${g.delay}ms ease`,
            }}>·</span>
          )
          : (
            <span key={gi} style={{ display:'flex', gap:4 }}>
              {g.chars.map((c, ci) => (
                <AnimatedDigit key={ci} char={c} visible={visible} delay={g.base + ci * 80} />
              ))}
            </span>
          )
        )}
      </div>
      <p style={{
        fontFamily:'var(--font-sans)', fontSize:11, letterSpacing:'0.4em',
        textTransform:'uppercase', color:'var(--anthracite)',
        marginTop:36,
        opacity: visible ? 0.45 : 0,
        transition: 'opacity 0.8s 1s ease',
        textAlign:'center',
      }}>
        Cérémonie à 15h00 &nbsp;·&nbsp; Réception jusqu'au lendemain matin
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  TIMELINE / PROGRAMME — self-drawing sage line
// ─────────────────────────────────────────────────────────
const EVENTS = [
  { time:'14h30', name:'Accueil des invités',
    desc:"Vin d'honneur dans les jardins du château, accompagné d'un quatuor à cordes." },
  { time:'15h00', name:'Cérémonie',
    desc:"Union laïque dans la grande salle voûtée, en présence de ceux qui vous sont chers." },
  { time:'17h00', name:'Cocktail & Portraits',
    desc:"Bulles et canapés au jardin. Séance photo avec les mariés sur invitation." },
  { time:'19h30', name:'Dîner de gala',
    desc:"Repas gastronomique en salle de réception, avec musique live tout au long de la soirée." },
  { time:'22h00', name:'Bal & Soirée',
    desc:"Piste de danse, DJ, et buffet douceurs à minuit pour tenir jusqu'à l'aube." },
]

function TimelineSection() {
  const wrapRef = useRef()
  const [lineH, setLineH] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      const winH = window.innerHeight
      const raw = (winH * 0.85 - rect.top) / rect.height
      setLineH(Math.max(0, Math.min(1, raw)) * 100)
    }
    window.addEventListener('scroll', onScroll, { passive:true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="section-programme" id="programme">
      <p className="section-eyebrow">Le programme</p>
      <h2 className="section-title">Le déroulé du jour</h2>

      <div className="timeline" ref={wrapRef}>
        {/* Drawing sage line */}
        <div
          className="timeline-line"
          style={{
            height: `${lineH}%`,
            transition: 'height 0.15s linear',
            background: 'linear-gradient(to bottom, var(--sage) 0%, rgba(138,154,128,0.3) 100%)',
          }}
        />
        {EVENTS.map((ev, i) => {
          const triggerAt = (i / (EVENTS.length + 0.5)) * 90
          const isVis = lineH > triggerAt
          return (
            <div
              key={i}
              className={`timeline-event ${isVis ? 'visible' : ''}`}
              style={{ transitionDelay:`${i * 40}ms` }}
            >
              <div className="timeline-dot" />
              <p className="event-time">{ev.time}</p>
              <h3 className="event-name">{ev.name}</h3>
              <p className="event-desc">{ev.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  VENUE SECTION
// ─────────────────────────────────────────────────────────
function VenueSection() {
  const [ref, visible] = useReveal(0.18)
  return (
    <div
      className="section-venue"
      ref={ref}
      style={{ opacity:visible?1:0, transform:visible?'none':'translateY(24px)', transition:'all 1s ease' }}
    >
      <p className="section-eyebrow" style={{ justifyContent:'center' }}>Le lieu</p>
      <h2 className="venue-name">Château de La Rivière</h2>
      <p className="venue-address">
        1 Château de La Rivière<br/>
        33126 La Rivière — Gironde
      </p>
      <div className="venue-illustration">
        <VenueIllustration />
      </div>
      <a
        href="https://maps.google.com/?q=Chateau+de+La+Riviere+33126+Gironde"
        target="_blank"
        rel="noopener noreferrer"
        className="directions-btn"
        aria-label="Ouvrir Google Maps pour Château de La Rivière"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 1.5L12.5 7L7 12.5M1.5 7H12.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Obtenir l'itinéraire
      </a>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  RSVP WRAPPER
// ─────────────────────────────────────────────────────────
function RSVPSection() {
  const [ref, visible] = useReveal(0.1)
  return (
    <section
      className="section-rsvp"
      id="rsvp"
      ref={ref}
      style={{ opacity:visible?1:0, transform:visible?'none':'translateY(20px)', transition:'all 1s ease' }}
    >
      <p className="section-eyebrow" style={{ justifyContent:'center' }}>Confirmation</p>
      <h2 className="section-title" style={{ textAlign:'center' }}>Serez-vous des nôtres ?</h2>
      <p style={{
        fontFamily:'var(--font-serif)', fontSize:18, fontWeight:300,
        color:'var(--anthracite)', opacity:0.6, textAlign:'center', lineHeight:1.6,
      }}>
        Merci de confirmer votre présence avant le 30 avril 2025.
      </p>
      <RSVPForm />
    </section>
  )
}

// ─────────────────────────────────────────────────────────
//  PRACTICAL INFO
// ─────────────────────────────────────────────────────────
const PRACTICAL_ITEMS = [
  { label:'Code vestimentaire',
    value:'Tenue de soirée élégante.\nChic champêtre bienvenu.' },
  { label:'Hébergement',
    value:'Un bloc de chambres est réservé au Château.\nContactez-nous pour les disponibilités.' },
  { label:'Enfants',
    value:'Les enfants de moins de 12 ans sont accueillis avec joie.\nEspace baby-sitting disponible sur place.' },
  { label:'Parking',
    value:'Parking privé sur place.\nNavette depuis Bordeaux Saint-Jean à prévoir.' },
  { label:'Contact',
    value:'eliseettheo2025@gmail.com\n+33 6 12 34 56 78' },
  { label:'Date limite RSVP',
    value:'30 avril 2025' },
]

function PracticalSection() {
  const [ref, visible] = useReveal(0.12)
  return (
    <div
      className="section-practical"
      ref={ref}
      style={{ opacity:visible?1:0, transition:'opacity 1.2s ease' }}
    >
      <p className="section-eyebrow">Informations pratiques</p>
      <div className="practical-grid">
        {PRACTICAL_ITEMS.map((item, i) => (
          <div
            key={i}
            className="practical-item"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(16px)',
              transition: `opacity 0.8s ${i * 80}ms ease, transform 0.8s ${i * 80}ms ease`,
            }}
          >
            <span className="practical-label">{item.label}</span>
            <p className="practical-value" style={{ whiteSpace:'pre-line' }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-monogram" aria-label="Élise et Théo">
        É <span>&amp;</span> T
      </div>
      <p className="footer-date">14 · 06 · 2025 — Château de La Rivière, Bordeaux</p>
      <div style={{ marginTop:28, display:'flex', alignItems:'center', justifyContent:'center', gap:24, opacity:0.4 }}>
        <div className="divider-line" style={{ width:48 }} />
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="2" fill="#C9A66B"/>
          <circle cx="5" cy="5" r="4.5" stroke="#C9A66B" strokeWidth="0.6"/>
        </svg>
        <div className="divider-line" style={{ width:48 }} />
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────
//  EXPORT
// ─────────────────────────────────────────────────────────
export default function ScrollSections() {
  return (
    <div className="scroll-sections">
      <Divider />
      <StorySection />
      <Divider />
      <DateSection />
      <Divider />
      <TimelineSection />
      <Divider />
      <VenueSection />
      <Divider />
      <GallerySection />
      <Divider />
      <RSVPSection />
      <Divider />
      <PracticalSection />
      <Footer />
    </div>
  )
}
