import { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { weddingContent } from '../config/weddingContent';

interface NavigationProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export function Navigation({ onNavigate, activeSection }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'histoire', label: 'Notre Histoire' },
    { id: 'programme', label: 'Programme' },
    { id: 'galerie', label: 'Galerie' },
    { id: 'rsvp', label: 'RSVP' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#FBF8F3]/90 backdrop-blur-md border-b border-[#A4193D]/20 py-3 shadow-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Monogram Brand Logo */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <span className="font-playfair text-2xl md:text-3xl tracking-widest text-[#A4193D] group-hover:text-[#1F1A18] transition-colors">
            {weddingContent.couple.monogram}
          </span>
          <span className="hidden sm:inline-block w-px h-4 bg-[#A4193D]/40" />
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.3em] font-semibold text-[#6B7355]">
            12.09.2026
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`text-[10px] uppercase tracking-[0.3em] font-semibold transition-colors cursor-pointer relative py-1 ${
                activeSection === item.id ? 'text-[#A4193D]' : 'text-[#6B7355] hover:text-[#A4193D]'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#A4193D]" />
              )}
            </button>
          ))}
        </nav>

        {/* RSVP Primary CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => handleLinkClick('rsvp')}
            className="px-6 py-2.5 border border-[#A4193D] text-[#A4193D] text-[10px] uppercase tracking-widest font-semibold hover:bg-[#A4193D] hover:text-white transition-all duration-300 cursor-pointer"
          >
            Confirmer
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          className="md:hidden p-2 text-[#2C2A29] hover:text-[#A4193D] transition-colors cursor-pointer"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-[#FBF8F3] border-b border-[#A4193D]/30 px-6 py-6 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`text-left text-sm uppercase tracking-widest py-2 border-b border-[#EDE2D3]/50 font-medium ${
                  activeSection === item.id ? 'text-[#A4193D] font-semibold' : 'text-[#2C2A29]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleLinkClick('rsvp')}
              className="mt-2 w-full py-3 rounded-full bg-[#4B5842] text-[#FBF8F3] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-[#A4193D] text-[#A4193D]" />
              <span>Confirmer ma présence</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
