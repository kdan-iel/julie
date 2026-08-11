import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, Church, Wine, Utensils, Music, Sun, Navigation, ExternalLink, Sparkles, Gift } from 'lucide-react';
import { weddingContent } from '../../config/weddingContent';
import { EventDetail } from '../../types';

function getIconComponent(iconName: EventDetail['iconName']) {
  switch (iconName) {
    case 'church':
      return Church;
    case 'cheers':
      return Wine;
    case 'utensils':
      return Utensils;
    case 'music':
      return Music;
    case 'sun':
      return Sun;
    default:
      return Sparkles;
  }
}

export function Programme() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  return (
    <section id="programme" className="py-24 px-6 relative bg-[#F7F1E8]/40 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.5em] font-semibold text-[#6B7355] block mb-2">
            {weddingContent.events.eyebrow}
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl font-normal text-[#1F1A18] mt-1 mb-4">
            {weddingContent.events.title}
          </h2>
          <div className="w-16 h-[1px] bg-[#A4193D] mx-auto mb-4" />
          <p className="text-base text-[#1F1A18]/80 font-light leading-relaxed">
            {weddingContent.events.subtitle}
          </p>
        </div>

        {/* Color Theme Highlight Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16 p-6 rounded-2xl glass-panel-dark text-[#FBF8F3] border border-[#A4193D]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-full bg-[#A4193D]/20 text-[#A4193D] border border-[#A4193D]/40">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-display text-2xl font-semibold text-[#C94F63]">
                {weddingContent.events.colorTheme.title}
              </h3>
              <p className="text-sm text-[#FBF8F3]/80 font-light mt-1">
                {weddingContent.events.colorTheme.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Floating Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {weddingContent.events.items.map((event, idx) => {
            const Icon = getIconComponent(event.iconName);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedCard(selectedCard === event.id ? null : event.id)}
                className="p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#A4193D]/30 shadow-md hover:shadow-2xl transition-all duration-300 relative group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A4193D]/15 text-[#A4193D] font-semibold text-xs tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      {event.time}
                    </span>
                    <div className="p-3 rounded-xl bg-[#4B5842]/10 text-[#4B5842] group-hover:bg-[#4B5842] group-hover:text-[#FBF8F3] transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Location */}
                  <h3 className="font-serif-display text-2xl font-bold text-[#2C2A29] mb-2 group-hover:text-[#A4193D] transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#2C2A29]/70 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#A4193D]" />
                    <span>{event.locationName}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#2C2A29]/80 font-light leading-relaxed mb-6">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EDE2D3]/50 flex items-center justify-between text-xs text-[#A4193D] font-semibold tracking-wider uppercase">
                  <span>{event.address}</span>
                  <span className="text-lg">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Gifts & Online Fund */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16 rounded-3xl glass-panel border border-[#A4193D]/30 p-8 md:p-10 shadow-xl bg-white/80"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="shrink-0 p-4 rounded-full bg-[#A4193D]/10 text-[#A4193D]">
              <Gift className="w-7 h-7" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-serif-display text-3xl font-bold text-[#2C2A29] mb-3">
                {weddingContent.gifts.title}
              </h3>
              <p className="text-sm text-[#2C2A29]/80 font-light leading-relaxed">
                {weddingContent.gifts.description}
              </p>
            </div>
            {weddingContent.gifts.onlineFundUrl && (
              <a
                href={weddingContent.gifts.onlineFundUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#4B5842] text-[#FBF8F3] text-xs uppercase tracking-widest font-semibold hover:bg-[#333D2C] transition-all"
              >
                {weddingContent.gifts.onlineFundLabel}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Venue Location & Map Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl glass-panel border border-[#A4193D]/40 p-8 md:p-12 shadow-2xl relative overflow-hidden bg-white/80"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#A4193D]">
                Lieu du rassemblement
              </span>
              <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#2C2A29] mt-2 mb-4">
                {weddingContent.venue.name}
              </h3>
              <p className="text-sm text-[#2C2A29]/80 font-light leading-relaxed mb-6">
                {weddingContent.venue.description}
              </p>
              <div className="flex flex-col gap-2 mb-8 text-sm text-[#2C2A29]/90 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#A4193D]" />
                  <span>{weddingContent.venue.address}</span>
                </div>
              </div>

              {weddingContent.venue.googleMapsUrl && (
                <a
                  href={weddingContent.venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#4B5842] text-[#FBF8F3] text-xs uppercase tracking-widest font-semibold hover:bg-[#333D2C] transition-all shadow-md hover:shadow-xl"
                >
                  <Navigation className="w-4 h-4 text-[#A4193D]" />
                  <span>Ouvrir dans Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              )}
            </div>

            {/* Interactive Venue Graphic Frame */}
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden shadow-xl border border-[#A4193D]/30 group">
              <img
                src={weddingContent.venue.imageUrl}
                alt={weddingContent.venue.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Pulsing Location Pin Overlay */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#A4193D]/30 animate-ping absolute inset-0" />
                  <div className="w-12 h-12 rounded-full bg-[#4B5842] border-2 border-[#A4193D] shadow-xl flex items-center justify-center relative text-[#A4193D]">
                    <MapPin className="w-6 h-6 fill-[#A4193D] text-[#4B5842]" />
                  </div>
                </div>
                <span className="mt-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white font-serif-display text-sm tracking-wide border border-[#A4193D]/40 shadow-lg">
                  {weddingContent.venue.name}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
