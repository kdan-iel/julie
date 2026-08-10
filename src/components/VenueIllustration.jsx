export default function VenueIllustration() {
  return (
    <svg
      viewBox="0 0 500 375"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
      aria-label="Illustration du Château de La Rivière"
      role="img"
    >
      {/* Sky background */}
      <rect width="500" height="375" fill="#F0EBE2" />

      {/* Distant hills */}
      <ellipse cx="120" cy="320" rx="200" ry="80" fill="#D5CCBC" opacity="0.4" />
      <ellipse cx="400" cy="335" rx="180" ry="70" fill="#C8BFB0" opacity="0.35" />

      {/* Ground */}
      <rect x="0" y="300" width="500" height="75" fill="#C8BDB0" opacity="0.5" />

      {/* Trees left cluster */}
      <g opacity="0.7">
        <rect x="30" y="220" width="8" height="80" fill="#8A9A80" />
        <ellipse cx="34" cy="210" rx="22" ry="30" fill="#8A9A80" />
        <rect x="65" y="240" width="6" height="60" fill="#7A8A70" />
        <ellipse cx="68" cy="230" rx="18" ry="24" fill="#7A8A70" />
        <rect x="12" y="250" width="5" height="50" fill="#9AAA90" />
        <ellipse cx="14.5" cy="242" rx="14" ry="20" fill="#9AAA90" />
      </g>

      {/* Trees right cluster */}
      <g opacity="0.7">
        <rect x="440" y="228" width="8" height="72" fill="#8A9A80" />
        <ellipse cx="444" cy="218" rx="20" ry="28" fill="#8A9A80" />
        <rect x="460" y="245" width="6" height="55" fill="#7A8A70" />
        <ellipse cx="463" cy="236" rx="16" ry="22" fill="#7A8A70" />
        <rect x="420" y="252" width="5" height="48" fill="#9AAA90" />
        <ellipse cx="422.5" cy="244" rx="14" ry="20" fill="#9AAA90" />
      </g>

      {/* Château main body */}
      <rect x="130" y="160" width="240" height="145" fill="#EDE6D8" stroke="#C8BBA8" strokeWidth="0.8" />

      {/* Main entrance arch */}
      <path d="M215 305 L215 245 Q215 225 230 225 Q245 225 245 245 L245 305Z"
        fill="#C8BBA8" />
      <path d="M215 245 Q215 225 230 225 Q245 225 245 245"
        fill="none" stroke="#B0A090" strokeWidth="1" />

      {/* Windows row 1 */}
      {[155, 190, 275, 320, 355].map((x, i) => (
        <g key={i}>
          <rect x={x} y="185" width="28" height="38" rx="14" fill="none" stroke="#C8BBA8" strokeWidth="0.8" />
          <rect x={x + 4} y="189" width="20" height="30" rx="10" fill="#D0C8BC" opacity="0.5" />
          {/* Window pane cross */}
          <line x1={x + 14} y1="189" x2={x + 14} y2="219" stroke="#C0B8AC" strokeWidth="0.5" />
          <line x1={x} y1="204" x2={x + 28} y2="204" stroke="#C0B8AC" strokeWidth="0.5" />
        </g>
      ))}

      {/* Windows row 2 */}
      {[165, 205, 285, 315].map((x, i) => (
        <g key={i}>
          <rect x={x} y="240" width="24" height="34" rx="12" fill="none" stroke="#C8BBA8" strokeWidth="0.7" />
          <rect x={x + 3} y="243" width="18" height="28" rx="9" fill="#D0C8BC" opacity="0.4" />
        </g>
      ))}

      {/* Central tower */}
      <rect x="198" y="100" width="104" height="165" fill="#E8E0D0" stroke="#C0B5A4" strokeWidth="0.8" />

      {/* Tower clock / rose window */}
      <circle cx="250" cy="138" r="22" fill="none" stroke="#C0B5A4" strokeWidth="0.8" />
      <circle cx="250" cy="138" r="16" fill="none" stroke="#C8BBA8" strokeWidth="0.5" />
      <line x1="228" y1="138" x2="272" y2="138" stroke="#C8BBA8" strokeWidth="0.5" />
      <line x1="250" y1="116" x2="250" y2="160" stroke="#C8BBA8" strokeWidth="0.5" />
      {/* Clock hands */}
      <line x1="250" y1="138" x2="255" y2="128" stroke="#8A9A80" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="250" y1="138" x2="258" y2="135" stroke="#8A9A80" strokeWidth="0.6" strokeLinecap="round" />

      {/* Tower tall windows */}
      <rect x="225" y="170" width="22" height="52" rx="11" fill="none" stroke="#C0B5A4" strokeWidth="0.7" />
      <rect x="228" y="173" width="16" height="46" rx="8" fill="#C8C0B4" opacity="0.4" />
      <rect x="253" y="170" width="22" height="52" rx="11" fill="none" stroke="#C0B5A4" strokeWidth="0.7" />
      <rect x="256" y="173" width="16" height="46" rx="8" fill="#C8C0B4" opacity="0.4" />

      {/* Tower roof */}
      <path d="M195 100 L250 50 L305 100Z" fill="#B0A890" stroke="#A09880" strokeWidth="0.8" />
      {/* Roof tiles hint */}
      <path d="M215 85 Q230 80 250 78 Q270 80 285 85" fill="none" stroke="#A09880" strokeWidth="0.5" />
      <path d="M200 95 Q225 90 250 88 Q275 90 300 95" fill="none" stroke="#A09880" strokeWidth="0.5" />

      {/* Weather vane */}
      <line x1="250" y1="50" x2="250" y2="35" stroke="#8A9A80" strokeWidth="0.8" />
      <path d="M250 40 L256 43 L250 46 L244 43Z" fill="#8A9A80" />

      {/* Left wing roof */}
      <path d="M130 160 L130 148 L250 148 L250 160Z" fill="#B5AD98" stroke="#A09880" strokeWidth="0.6" />
      {/* Right wing roof */}
      <path d="M250 148 L370 148 L370 160 L250 160Z" fill="#B5AD98" stroke="#A09880" strokeWidth="0.6" />

      {/* Side towers */}
      <rect x="110" y="130" width="40" height="175" fill="#E2DAC8" stroke="#C0B5A4" strokeWidth="0.7" />
      <path d="M105 130 L130 90 L155 130Z" fill="#A8A090" stroke="#988E82" strokeWidth="0.7" />
      <rect x="350" y="130" width="40" height="175" fill="#E2DAC8" stroke="#C0B5A4" strokeWidth="0.7" />
      <path d="M345 130 L370 90 L395 130Z" fill="#A8A090" stroke="#988E82" strokeWidth="0.7" />

      {/* Side tower windows */}
      <rect x="122" y="155" width="16" height="22" rx="8" fill="none" stroke="#C0B5A4" strokeWidth="0.6" />
      <rect x="362" y="155" width="16" height="22" rx="8" fill="none" stroke="#C0B5A4" strokeWidth="0.6" />
      <rect x="122" y="188" width="16" height="22" rx="8" fill="none" stroke="#C0B5A4" strokeWidth="0.6" />
      <rect x="362" y="188" width="16" height="22" rx="8" fill="none" stroke="#C0B5A4" strokeWidth="0.6" />

      {/* Forecourt / gravel path */}
      <ellipse cx="250" cy="340" rx="120" ry="20" fill="#D8CFBF" opacity="0.6" />
      <line x1="250" y1="305" x2="250" y2="360" stroke="#C8BFAF" strokeWidth="3" opacity="0.5" />

      {/* Decorative bushes along front */}
      {[155, 185, 315, 345].map((x, i) => (
        <ellipse key={i} cx={x} cy="305" rx="14" ry="10" fill="#8A9A80" opacity="0.5" />
      ))}

      {/* Subtle vine/ivy on left wall */}
      <path d="M130 200 Q122 210 125 225 Q118 235 122 248"
        fill="none" stroke="#8A9A80" strokeWidth="0.8" opacity="0.4" />
      <ellipse cx="123" cy="214" rx="6" ry="4" fill="#8A9A80" opacity="0.25" transform="rotate(-20 123 214)" />
      <ellipse cx="120" cy="237" rx="5" ry="3.5" fill="#8A9A80" opacity="0.25" transform="rotate(15 120 237)" />

      {/* Light suggestion in tower windows */}
      <rect x="226" y="174" width="14" height="44" rx="7" fill="#F5E8D0" opacity="0.3" />
      <rect x="254" y="174" width="14" height="44" rx="7" fill="#F5E8D0" opacity="0.3" />

      {/* Label */}
      <text
        x="250"
        y="368"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontSize="11"
        fill="#8A9A80"
        letterSpacing="2"
        opacity="0.7"
      >
        CHÂTEAU DE LA RIVIÈRE
      </text>
    </svg>
  )
}
