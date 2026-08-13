import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { weddingContent } from '../../config/weddingContent';
import { HeartDecoration } from '../HeartDecoration';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function computeTimeLeft(isoDate: string): TimeLeft {
  const targetDate = new Date(isoDate).getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  // Countdown for the wedding day
  const [religieuxTimeLeft, setReligieuxTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      setReligieuxTimeLeft(computeTimeLeft(weddingContent.date.religieux.isoDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-6 overflow-hidden border-b border-[#F7F1E8]">
      <HeartDecoration />
      {/* Editorial geometric ring accents */}
      <div className="absolute inset-0 opacity-25 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full border border-[#A4193D]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[350px] h-[350px] rounded-full border border-[#A4193D]" />
      </div>

      {/* Decorative vertical lines on left and right sides */}
      <div className="hidden lg:block absolute top-1/2 left-10 -translate-y-1/2 h-44 w-[1px] bg-[#A4193D]/35" />
      <div className="hidden lg:block absolute top-1/2 right-10 -translate-y-1/2 h-44 w-[1px] bg-[#A4193D]/35" />

      {/* Side rotated text tag */}
      <div className="hidden xl:flex absolute bottom-16 left-8 flex-col gap-2 items-center text-[10px] text-[#A4193D] z-10 pointer-events-none">
        <div className="rotate-90 origin-left translate-x-2 w-36 whitespace-nowrap tracking-[0.4em] uppercase font-medium">
          Invitation de Mariage
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto w-full my-auto text-center z-20">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif-display text-5xl sm:text-6xl md:text-7xl leading-[1.05] text-[#1F1A18] mb-7"
        >
          <span className="block">Sir Edwin</span>
          <span className="block text-[#A4193D] italic text-[0.58em] leading-none my-1">&amp;</span>
          <span className="block">Lady Ilétou</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mx-auto mb-7 aspect-[4/3] w-full max-w-sm overflow-hidden rounded-[2rem] border-8 border-[#F7F1E8] bg-[#EDE2D3] shadow-xl"
        >
          <img
            src={weddingContent.hero.coupleImageUrl}
            alt="Sir Edwin et Lady Ilétou"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              event.currentTarget.parentElement?.classList.add('hero-photo-placeholder');
            }}
          />
          <span className="hidden h-full items-center justify-center px-8 text-center text-xs uppercase tracking-[0.24em] text-[#6B7355]">
            Ajoutez votre photo dans public/photos/hero-couple.jpg
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mb-8 max-w-xl text-center"
        >
          <p className="font-serif-display text-lg sm:text-xl italic leading-relaxed text-[#2C2A29]">
            {weddingContent.hero.invitation}
          </p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A4193D]">
            {weddingContent.hero.ceremonyDate}
          </p>
        </motion.div>

        {/* Live Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex items-center justify-center mb-10"
        >
          <div className="p-5 sm:p-6 rounded-none bg-[#FBF8F3] border border-[#A4193D]/40 shadow-xs">
            <div className="text-center mb-3">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#A4193D] font-semibold block">
                {weddingContent.date.religieux.label}
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#6B7355] font-medium">
                {weddingContent.date.religieux.shortDate}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3 sm:gap-5">
              {[
                ['Jours', religieuxTimeLeft.days],
                ['Heures', religieuxTimeLeft.hours],
                ['Minutes', religieuxTimeLeft.minutes],
                ['Secondes', religieuxTimeLeft.seconds],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col items-center min-w-[52px]">
                  <span className="font-playfair text-xl sm:text-3xl font-normal text-[#1F1A18]">
                    {value}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#6B7355] font-semibold mt-1">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-md mx-auto"
        >
          <button
            onClick={() => onNavigate('histoire')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#A4193D] text-white border border-[#A4193D] text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-[#7A1230] transition-all duration-300 cursor-pointer"
          >
            {weddingContent.hero.ctaStory}
          </button>
          <button
            onClick={() => onNavigate('rsvp')}
            className="w-full sm:w-auto px-8 py-3.5 border border-[#A4193D] text-[#A4193D] text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-[#A4193D] hover:text-white transition-all duration-300 cursor-pointer"
          >
            {weddingContent.hero.ctaRsvp}
          </button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="flex flex-col items-center justify-center gap-2 text-center mt-8 z-20"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-[#A4193D]">
          {weddingContent.hero.scrollNotice}
        </span>
        <button
          onClick={() => onNavigate('histoire')}
          aria-label="Scroll down"
          className="p-1.5 text-[#A4193D] hover:text-[#1F1A18] transition-colors cursor-pointer animate-bounce"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </motion.div>
    </section>
  );
}
