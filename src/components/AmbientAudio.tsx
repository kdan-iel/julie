import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export function AmbientAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isSetupRef = useRef(false);

  // A quiet, warm romantic pad using Web Audio API. It starts only after a user click.
  const startAmbientSynth = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (isSetupRef.current) return;

      const ctx = audioCtxRef.current;
      // A soft E-major palette with lower, warmer tones than the previous ambient bed.
      const notes = [130.81, 164.81, 207.65, 246.94, 329.63, 415.3]; // C3, E3, G#3, B3, E4, G#4
      
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.055, ctx.currentTime);
      masterGain.connect(ctx.destination);

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // LFO for slow breathing volume swell
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.07 + idx * 0.02, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.012, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);

        gain.gain.setValueAtTime(0.011, ctx.currentTime);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        lfo.start();
      });

      isSetupRef.current = true;
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
    }
  };

  const toggleAudio = () => {
    if (!isPlaying) {
      startAmbientSynth();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      aria-label={isPlaying ? 'Désactiver la musique d’ambiance' : 'Activer la musique d’ambiance'}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#FBF8F3]/90 backdrop-blur-md border border-[#A4193D]/40 shadow-lg text-[#2C2A29] hover:border-[#A4193D] hover:bg-white transition-all duration-300 group"
    >
      <div className={`p-1.5 rounded-full ${isPlaying ? 'bg-[#A4193D] text-white' : 'bg-[#EDE2D3] text-[#2C2A29]'}`}>
        {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
      </div>
      <span className="text-xs tracking-wider uppercase font-medium text-[#2C2A29]">
        {isPlaying ? 'Musique active' : 'Ambiance romantique'}
      </span>
      {isPlaying && (
        <span className="flex items-center gap-0.5 h-3 ml-1">
          <span className="w-0.5 h-full bg-[#A4193D] animate-[bounce_1s_infinite_100ms]" />
          <span className="w-0.5 h-2/3 bg-[#A4193D] animate-[bounce_1s_infinite_300ms]" />
          <span className="w-0.5 h-full bg-[#A4193D] animate-[bounce_1s_infinite_200ms]" />
        </span>
      )}
    </button>
  );
}
