import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Check, Send } from 'lucide-react';
import { weddingContent } from '../../config/weddingContent';
import type { RSVPFormData } from '../../types';

export function RSVPSection() {
  const [formData, setFormData] = useState<RSVPFormData>({
    lastName: '',
    firstName: '',
    email: '',
    attending: 'yes',
    guestCount: 1,
    guestNames: '',
    dietaryRestrictions: '',
    menuChoice: 'classic',
    shuttleNeeded: false,
    songRequest: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edwin_julie_rsvp');

    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        setIsSubmitted(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A4193D', '#C94F63', '#FBEEE9', '#7A1230'],
      });
    } catch (e) {
      console.warn('Confetti error', e);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      localStorage.setItem(
        'edwin_ilétou_rsvp',
        JSON.stringify(formData)
      );
      triggerConfetti();
    }, 1200);
  };

  const handleModify = () => {
    setIsSubmitted(false);
  };

  return (
    <section
      id="rsvp"
      className="py-24 px-6 relative bg-[#4B5842] text-[#FBF8F3] overflow-hidden"
    >
      {/* Background glow & subtle patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#A4193D]/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-radial from-[#A4193D]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-[0.5em] font-semibold text-[#A4193D] block mb-2">
            {weddingContent.rsvp.eyebrow}
          </span>

          <h2 className="font-playfair text-4xl sm:text-5xl font-normal text-[#FBF8F3] mt-1 mb-4">
            {weddingContent.rsvp.title}
          </h2>

          <div className="w-16 h-[1px] bg-[#A4193D] mx-auto mb-4" />

          <p className="text-sm sm:text-base text-[#FBF8F3]/80 font-light leading-relaxed">
            {weddingContent.rsvp.subtitle}
          </p>
        </div>

        {/* Card Form Wrapper */}
        <div className="p-8 sm:p-12 rounded-3xl glass-panel-dark border border-[#A4193D]/40 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="rsvp-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Attending Radio Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <label
                    className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      formData.attending === 'yes'
                        ? 'bg-[#A4193D]/25 border-[#A4193D] shadow-md'
                        : 'bg-white/5 border-white/10 hover:border-[#A4193D]/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={formData.attending === 'yes'}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          attending: 'yes',
                        })
                      }
                      className="sr-only"
                    />

                    <div className="w-5 h-5 rounded-full border-2 border-[#A4193D] flex items-center justify-center">
                      {formData.attending === 'yes' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#A4193D]" />
                      )}
                    </div>

                    <span className="text-sm font-medium text-[#FBF8F3]">
                      {weddingContent.rsvp.fields.yesOption}
                    </span>
                  </label>

                  <label
                    className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      formData.attending === 'no'
                        ? 'bg-red-950/40 border-red-400/50 shadow-md'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={formData.attending === 'no'}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          attending: 'no',
                        })
                      }
                      className="sr-only"
                    />

                    <div className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center">
                      {formData.attending === 'no' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      )}
                    </div>

                    <span className="text-sm font-medium text-[#FBF8F3]/90">
                      {weddingContent.rsvp.fields.noOption}
                    </span>
                  </label>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#A4193D] mb-2 font-medium">
                      {weddingContent.rsvp.fields.firstName} *
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Jean"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-[#FBF8F3] placeholder-white/40 focus:outline-none focus:border-[#A4193D] focus:ring-1 focus:ring-[#A4193D] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#A4193D] mb-2 font-medium">
                      {weddingContent.rsvp.fields.lastName} *
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Dupont"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-[#FBF8F3] placeholder-white/40 focus:outline-none focus:border-[#A4193D] focus:ring-1 focus:ring-[#A4193D] transition-colors"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#A4193D] mb-2 font-medium">
                    {weddingContent.rsvp.fields.email} *
                  </label>

                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    placeholder="jean.dupont@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-[#FBF8F3] placeholder-white/40 focus:outline-none focus:border-[#A4193D] focus:ring-1 focus:ring-[#A4193D] transition-colors"
                  />
                </div>

                {/* Accompanying Guest Names */}
                {formData.guestCount > 1 && (
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#A4193D] mb-2 font-medium">
                      {weddingContent.rsvp.fields.guestNames}
                    </label>

                    <input
                      type="text"
                      value={formData.guestNames}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guestNames: e.target.value,
                        })
                      }
                      placeholder="Ex: Marie Dupont, Lucas Dupont..."
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-[#FBF8F3] placeholder-white/40 focus:outline-none focus:border-[#A4193D] transition-colors"
                    />
                  </div>
                )}

                {/* Personal Message */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#A4193D] mb-2 font-medium">
                    {weddingContent.rsvp.fields.message}
                  </label>

                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                    placeholder="Un petit mot doux pour les mariés..."
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-[#FBF8F3] placeholder-white/40 focus:outline-none focus:border-[#A4193D] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7A1230] via-[#A4193D] to-[#C94F63] text-[#333D2C] font-bold text-xs uppercase tracking-[0.25em] shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>
                      {weddingContent.rsvp.fields.sendingBtn}
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {weddingContent.rsvp.fields.submitBtn}
                      </span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              /* Confirmation Screen */
              <motion.div
                key="rsvp-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-[#A4193D]/20 border-2 border-[#A4193D] text-[#A4193D] mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <h3 className="font-serif-display text-3xl font-bold text-[#C94F63]">
                  {weddingContent.rsvp.successMessage.title}
                </h3>

                <p className="text-sm text-[#FBF8F3]/90 font-light leading-relaxed max-w-md mx-auto">
                  {weddingContent.rsvp.successMessage.description}
                </p>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <p>
                    <span className="text-[#A4193D]">Nom :</span>{' '}
                    {formData.firstName} {formData.lastName}
                  </p>

                  <p>
                    <span className="text-[#A4193D]">Présence :</span>{' '}
                    {formData.attending === 'yes'
                      ? 'Présent(e)'
                      : 'Absent(e)'}
                  </p>

                  {formData.attending === 'yes' && (
                    <>
                      <p>
                        <span className="text-[#A4193D]">Invités :</span>{' '}
                        {formData.guestCount}
                      </p>

                      <p>
                        <span className="text-[#A4193D]">Menu :</span>{' '}
                        {formData.menuChoice}
                      </p>
                    </>
                  )}
                </div>

                <button
                  onClick={handleModify}
                  className="px-6 py-2.5 rounded-full border border-[#A4193D] text-[#A4193D] text-xs uppercase tracking-widest hover:bg-[#A4193D] hover:text-[#333D2C] transition-colors"
                >
                  {weddingContent.rsvp.successMessage.modifyBtn}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

