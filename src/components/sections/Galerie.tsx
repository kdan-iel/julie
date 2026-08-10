import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { weddingContent } from '../../config/weddingContent';
import { GalleryItem } from '../../types';

export function Galerie() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = weddingContent.gallery.items.filter((item) =>
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="galerie" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.5em] font-semibold text-[#6B7355] block mb-2">
            {weddingContent.gallery.eyebrow}
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl font-normal text-[#1F1A18] mt-1 mb-4">
            {weddingContent.gallery.title}
          </h2>
          <div className="w-16 h-[1px] bg-[#A4193D] mx-auto mb-4" />
          <p className="text-base text-[#1F1A18]/80 font-light leading-relaxed">
            {weddingContent.gallery.subtitle}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {weddingContent.gallery.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#A4193D] text-white border border-[#A4193D]'
                  : 'bg-white/80 text-[#6B7355] border border-[#A4193D]/30 hover:border-[#A4193D]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid with Mask Lift Reveal */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => openLightbox(idx)}
                className="group relative aspect-4/3 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer border border-[#A4193D]/20 bg-white"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A29]/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <h4 className="font-serif-display text-xl font-bold mb-1 text-[#C94F63]">
                    {item.title}
                  </h4>
                  <p className="text-xs font-light text-white/90 line-clamp-2">
                    {item.caption}
                  </p>
                  <div className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-[#A4193D]">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={closeLightbox}
          >
            <div
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Lightbox Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#A4193D]/40 max-h-[75vh]">
                <img
                  src={filteredItems[lightboxIndex].imageUrl}
                  alt={filteredItems[lightboxIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto object-contain mx-auto"
                />
              </div>

              {/* Caption */}
              <div className="mt-4 text-center text-white max-w-xl">
                <h3 className="font-serif-display text-2xl font-bold text-[#A4193D] mb-1">
                  {filteredItems[lightboxIndex].title}
                </h3>
                <p className="text-sm font-light text-white/80">
                  {filteredItems[lightboxIndex].caption}
                </p>
              </div>

              {/* Previous Button */}
              <button
                onClick={prevPhoto}
                aria-label="Photo précédente"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-[#A4193D] text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextPhoto}
                aria-label="Photo suivante"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-[#A4193D] text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
