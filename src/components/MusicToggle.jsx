import { useState } from 'react'

export default function MusicToggle({ visible }) {
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    setPlaying(p => !p)
    // With Howler.js in production:
    // if (playing) { sound.pause() } else { sound.play() }
  }

  return (
    <button
      className={`music-toggle ${visible ? 'visible' : ''} ${playing ? 'playing' : ''}`}
      onClick={toggle}
      aria-label={playing ? 'Mettre la musique en pause' : 'Lire la musique d\'ambiance'}
      title={playing ? 'Pause' : 'Musique'}
    >
      {playing ? (
        /* Animated bars */
        <span className="music-bars" aria-hidden="true">
          {[12, 8, 14, 6, 10].map((h, i) => (
            <span
              key={i}
              className="music-bar"
              style={{
                height: h,
                animationDelay: `${i * 0.12}s`,
                background: 'var(--red)',
              }}
            />
          ))}
        </span>
      ) : (
        /* Static music note */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M6 12.5V5L13.5 3V10.5M6 12.5C6 13.6 5.1 14.5 4 14.5S2 13.6 2 12.5 2.9 10.5 4 10.5 6 11.4 6 12.5ZM13.5 10.5C13.5 11.6 12.6 12.5 11.5 12.5S9.5 11.6 9.5 10.5 10.4 9.5 11.5 9.5 13.5 10.4 13.5 10.5Z"
            stroke="var(--anthracite)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}
