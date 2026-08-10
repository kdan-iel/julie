import { motion } from 'motion/react';
import { ArrowUp, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { weddingContent } from '../../config/weddingContent';

interface FooterSectionProps {
  onScrollToTop: () => void;
}

export function FooterSection({ onScrollToTop }: FooterSectionProps) {
  return (
    <footer className="relative py-20 px-6 bg-[#333D2C] text-[#FBF8F3] overflow-hidden border-t border-[#A4193D]/30">
      {/* Background radial red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-[#A4193D]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-20">
        {/* Monogram Monolith */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-[#A4193D] text-[#A4193D] font-serif-display text-3xl font-light tracking-widest mb-8 bg-[#4B5842]/60 shadow-xl"
        >
          {weddingContent.couple.monogram}
        </motion.div>

        {/* Thank You Title */}
        <h2 className="font-playfair text-4xl sm:text-5xl font-normal text-[#C94F63] mb-4">
          {weddingContent.footer.thankYou}
        </h2>

        {/* Inspirational Quote */}
        <p className="font-serif-display italic text-lg sm:text-xl text-[#FBF8F3]/90 max-w-xl mx-auto mb-2 font-light">
          {weddingContent.footer.quote}
        </p>
        <span className="text-xs uppercase tracking-[0.25em] text-[#A4193D] block mb-12">
          — {weddingContent.footer.author}
        </span>

        {/* Contact Info Box */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 max-w-lg mx-auto mb-12 backdrop-blur-sm">
          <h3 className="font-serif-display text-xl font-bold text-[#C94F63] mb-2">
            {weddingContent.footer.contactTitle}
          </h3>
          <p className="text-xs text-[#FBF8F3]/80 leading-relaxed font-light mb-4">
            {weddingContent.footer.contactDetails}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-[#A4193D]">
            <Mail className="w-3.5 h-3.5" />
            <a href="mailto:contact@edwin-julie-2026.com" className="hover:underline">
              contact@edwin-julie-2026.com
            </a>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={onScrollToTop}
          className="p-3.5 rounded-full bg-[#A4193D] text-[#333D2C] hover:bg-[#C94F63] transition-colors shadow-lg cursor-pointer mb-8 inline-flex items-center justify-center group"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 text-xs text-[#FBF8F3]/60 font-light flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>{weddingContent.footer.copyright}</span>
          <span className="flex items-center gap-1 text-[#A4193D]">
            <span>Créé avec amour pour</span>
            <Heart className="w-3 h-3 fill-[#A4193D]" />
            <span>Edwin & Julie</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
