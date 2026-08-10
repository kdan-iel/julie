import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { weddingContent } from '../config/weddingContent';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const duration = 2200; // 2.2 seconds total load
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(100, Math.round((currentStep / steps) * 100));
      setProgress(currentProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(onComplete, 800);
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FBF8F3] px-6"
        >
          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-radial from-[#F7F1E8]/60 via-transparent to-transparent pointer-events-none" />

          {/* SVG Monogram E & J with Stroke Draw */}
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full text-[#A4193D]">
              {/* Outer Decorative Oval Frame */}
              <motion.circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="534"
                initial={{ strokeDashoffset: 534 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeDasharray="490"
                strokeDashoffset={490 - (490 * progress) / 100}
                transition={{ duration: 0.1 }}
                opacity={0.6}
              />

              {/* Monogram Text E & J */}
              <text
                x="100"
                y="112"
                textAnchor="middle"
                className="font-serif-display text-4xl font-light tracking-widest"
                fill="url(#goldGradPreloader)"
              >
                E & J
              </text>

              <defs>
                <linearGradient id="goldGradPreloader" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7A1230" />
                  <stop offset="50%" stopColor="#A4193D" />
                  <stop offset="100%" stopColor="#5C0F22" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Welcome Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs uppercase tracking-[0.3em] text-[#2C2A29]/70 font-medium mb-1"
          >
            {weddingContent.preloader.welcomeText}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-serif-display text-2xl md:text-3xl text-[#2C2A29] font-normal mb-8 gold-gradient-text"
          >
            Edwin & Julie
          </motion.h2>

          {/* Progress Bar */}
          <div className="w-48 h-1 bg-[#EDE2D3] rounded-full overflow-hidden relative mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-[#7A1230] via-[#A4193D] to-[#C94F63] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <p className="text-xs tracking-widest text-[#2C2A29]/50 font-mono">
            {progress}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
