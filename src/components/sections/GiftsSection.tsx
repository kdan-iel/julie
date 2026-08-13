import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy, Gift } from 'lucide-react';
import { weddingContent } from '../../config/weddingContent';

export function GiftsSection() {
  const [copiedTransfer, setCopiedTransfer] = useState<string | null>(null);

  const copyTransferDetail = async (provider: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTransfer(provider);
      window.setTimeout(() => setCopiedTransfer(null), 2000);
    } catch (error) {
      console.error('Unable to copy transfer detail', error);
    }
  };

  return (
    <section id="cagnotte" className="bg-[#F7F1E8]/40 px-6 pb-24 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-4xl rounded-3xl border border-[#A4193D]/30 bg-white/80 p-8 shadow-xl backdrop-blur-sm md:p-10"
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="shrink-0 rounded-full bg-[#A4193D]/10 p-4 text-[#A4193D]">
            <Gift className="h-7 w-7" />
          </div>
          <div className="w-full">
            <h2 className="font-serif-display mb-3 text-3xl font-bold text-[#2C2A29]">
              {weddingContent.gifts.title}
            </h2>
            <p className="mx-auto max-w-3xl text-sm font-light leading-relaxed text-[#2C2A29]/80">
              {weddingContent.gifts.description}
            </p>

            <div className="mt-7 grid gap-3 text-left sm:grid-cols-2">
              {weddingContent.gifts.transferDetails.map((detail) => {
                const isCopied = copiedTransfer === detail.provider;

                return (
                  <div
                    key={detail.provider}
                    className="rounded-2xl border border-[#A4193D]/20 bg-[#FBF8F3]/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A4193D]">
                          {detail.provider}
                        </p>
                        <p className="mt-1 text-xs text-[#2C2A29]/65">{detail.label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyTransferDetail(detail.provider, detail.value)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#4B5842]/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#4B5842] transition-colors hover:bg-[#4B5842] hover:text-[#FBF8F3]"
                        aria-label={`Copier ${detail.label} ${detail.provider}`}
                      >
                        {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {isCopied ? 'Copié' : 'Copier'}
                      </button>
                    </div>
                    <p className="mt-3 break-all font-mono text-sm font-semibold text-[#2C2A29]">
                      {detail.value}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[#2C2A29]/65">{detail.helpText}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
