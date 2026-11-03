// StudioSpace logo: a camera lens (outer ring, 6 iris blades, glass centre with a light reflection).
// Colour comes from the text colour (currentColor), so wrap it in `text-primary`.
// <LogoIcon spin /> rotates the iris, used in the loading screen.

export function LogoIcon({ className = "h-10 w-10", spin = false }) {
  const blades = [0, 1, 2, 3, 4, 5];

  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* outer metal ring + dark lens body */}
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="19.5" fill="#111827" />

      {/* iris blades (this group rotates when spin is true) */}
      <g
        style={{ transformOrigin: "24px 24px", animation: spin ? "spin 2.4s linear infinite" : "none" }}
      >
        {blades.map((i) => (
          <path
            key={i}
            d="M24 24 L24 8.5 A15.5 15.5 0 0 1 37.42 16.25 Z"
            transform={`rotate(${i * 60} 24 24)`}
            fill="currentColor"
            fillOpacity={i % 2 === 0 ? 1 : 0.72}
            stroke="#111827"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* glass centre */}
      <circle cx="24" cy="24" r="6.5" fill="#111827" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="3.4" fill="#0b1220" />

      {/* light reflections */}
      <circle cx="21.9" cy="21.9" r="1.4" fill="white" fillOpacity="0.85" />
      <path d="M9 14 A18 18 0 0 1 20 7" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ className = "" }) {
  return (
    <span className={`flex items-center gap-2 text-primary ${className}`}>
      <LogoIcon className="h-8 w-8 sm:h-10 sm:w-10" />
      <span className="text-lg sm:text-2xl font-extrabold tracking-tight whitespace-nowrap">
        Studio<span className="font-semibold text-base-content">Space</span>
      </span>
    </span>
  );
}