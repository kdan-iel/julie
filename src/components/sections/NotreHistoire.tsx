import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Heart } from 'lucide-react';
import { weddingContent } from '../../config/weddingContent';
import { TimelineMilestone } from '../../types';

/** Interactive 3D Tilt Card for Milestone Photos */
function TiltFrameCard({ milestone, isEven }: { milestone: TimelineMilestone; isEven: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX((-y / rect.height) * 12); // Max 12deg tilt
    setRotateY((x / rect.width) * 12);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -60 : 60, y: 30 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full md:w-1/2 px-4 md:px-8 mb-12 md:mb-0 ${
        isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto md:text-left'
      }`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="p-6 md:p-8 rounded-2xl glass-panel border border-[#A4193D]/30 shadow-lg hover:shadow-2xl transition-shadow duration-300 relative group overflow-hidden bg-white/80"
      >
        {/* Year Tag */}
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#A4193D]/15 text-[#A4193D] font-bold text-xs tracking-widest uppercase mb-3">
          {milestone.year}
        </span>

        {/* Milestone Photo in 3D Frame */}
        <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-5 border border-[#A4193D]/20 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
          <img
            src={milestone.imageUrl}
            alt={milestone.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A29]/50 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#A4193D]" />
              {milestone.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#A4193D]" />
              {milestone.location}
            </span>
          </div>
        </div>

        {/* Milestone Title & Description */}
        <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#2C2A29] mb-3">
          {milestone.title}
        </h3>
        <p className="text-sm text-[#2C2A29]/80 leading-relaxed font-light">
          {milestone.description}
        </p>

        {/* Decorative corner accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#A4193D]" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#A4193D]" />
      </div>
    </motion.div>
  );
}

export function NotreHistoire() {
  return (
    <section id="histoire" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[11px] uppercase tracking-[0.5em] font-semibold text-[#6B7355] block mb-2">
            {weddingContent.timeline.eyebrow}
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl font-normal text-[#1F1A18] mt-1 mb-4">
            {weddingContent.timeline.title}
          </h2>
          <div className="w-16 h-[1px] bg-[#A4193D] mx-auto mb-4" />
          <p className="text-base text-[#1F1A18]/80 font-light leading-relaxed">
            {weddingContent.timeline.subtitle}
          </p>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative">
          {/* Central Red Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#A4193D]/20 via-[#A4193D] to-[#A4193D]/20 hidden md:block" />

          {/* Timeline Milestones */}
          <div className="flex flex-col gap-12 md:gap-20">
            {weddingContent.timeline.milestones.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={milestone.id} className="relative flex flex-col md:flex-row items-center">
                  {/* Central Node Pin */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-[#FBF8F3] border-2 border-[#A4193D] shadow-md text-[#A4193D]">
                    <Heart className="w-4 h-4 fill-[#A4193D]" />
                  </div>

                  {/* Card Component */}
                  <TiltFrameCard milestone={milestone} isEven={isEven} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
