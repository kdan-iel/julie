import { useState, useEffect, useCallback } from 'react';
import Lenis from 'lenis';
import { Preloader } from './components/Preloader';
import { Navigation } from './components/Navigation';
import { Canvas3D } from './components/3d/3dCanvas';
import { AmbientAudio } from './components/AmbientAudio';
import { HeroSection } from './components/sections/HeroSection';
import { NotreHistoire } from './components/sections/NotreHistoire';
import { Programme } from './components/sections/Programme';
import { Galerie } from './components/sections/Galerie';
import { RSVPSection } from './components/sections/RSVPSection';
import { GiftsSection } from './components/sections/GiftsSection';
import { FooterSection } from './components/sections/FooterSection';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [lenisRef, setLenisRef] = useState<Lenis | null>(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (!isLoaded) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    setLenisRef(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Track scroll progress across entire document height
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.max(0, Math.min(1, window.scrollY / totalHeight));
        setScrollProgress(progress);
      }

      // Determine active section for nav highlighting
      const sections = ['hero', 'histoire', 'programme', 'galerie', 'rsvp'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoaded]);

  // Smooth Navigation Handler
  const handleNavigate = useCallback(
    (sectionId: string) => {
      const el = document.getElementById(sectionId);
      if (el) {
        if (lenisRef) {
          lenisRef.scrollTo(el, { offset: -40, duration: 1.5 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [lenisRef]
  );

  const handleScrollToTop = useCallback(() => {
    if (lenisRef) {
      lenisRef.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lenisRef]);

  return (
    <div className="relative min-h-screen bg-[#FBF8F3] text-[#2C2A29] selection:bg-[#A4193D]/30 selection:text-[#333D2C]">
      {/* Preloader Screen */}
      <Preloader onComplete={() => setIsLoaded(true)} />

      {isLoaded && (
        <>
          {/* Single Persistent 3D Canvas Overlay holding the Traveling Bouquet */}
          <Canvas3D scrollProgress={scrollProgress} />

          {/* Fixed Navigation Header */}
          <Navigation onNavigate={handleNavigate} activeSection={activeSection} />

          {/* Main Scroll Content Sections */}
          <main className="relative z-20">
            <HeroSection onNavigate={handleNavigate} />
            <NotreHistoire />
            <Programme />
            <Galerie />
            <GiftsSection />
            <RSVPSection />
          </main>

          {/* Footer Section */}
          <FooterSection onScrollToTop={handleScrollToTop} />

          {/* Ambient Music Toggle */}
          <AmbientAudio />
        </>
      )}
    </div>
  );
}
