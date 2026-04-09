export function LogoMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Drone body — hexagonal tech shape */}
      <path
        d="M24 8L38 16v14L24 38 10 30V16L24 8z"
        fill="#0a1628"
        stroke="#4CAF50"
        strokeWidth="1"
        opacity="0.9"
      />
      {/* Flight path ring */}
      <circle cx="24" cy="23" r="10" stroke="#4CAF50" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Propeller arms */}
      <line x1="14" y1="14" x2="20" y2="19" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="34" y1="14" x2="28" y2="19" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="32" x2="20" y2="27" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="34" y1="32" x2="28" y2="27" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
      {/* Propeller circles */}
      <circle cx="12" cy="12" r="3" fill="none" stroke="#4CAF50" strokeWidth="1" opacity="0.6" />
      <circle cx="36" cy="12" r="3" fill="none" stroke="#4CAF50" strokeWidth="1" opacity="0.6" />
      <circle cx="12" cy="34" r="3" fill="none" stroke="#4CAF50" strokeWidth="1" opacity="0.6" />
      <circle cx="36" cy="34" r="3" fill="none" stroke="#4CAF50" strokeWidth="1" opacity="0.6" />
      {/* Center sensor eye */}
      <circle cx="24" cy="23" r="3.5" fill="#4CAF50" opacity="0.9" />
      <circle cx="24" cy="23" r="1.5" fill="#0a1628" />
      {/* Scan lines */}
      <path d="M18 36l6 6 6-6" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M20 39l4 3 4-3" stroke="#4ade80" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
    </svg>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="w-9 h-9" />
      <div className="flex flex-col leading-none">
        <span className="text-[1.125rem] font-bold tracking-tight text-white">
          AG Drones
        </span>
        <span className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-accent-400 font-mono">
          NJ
        </span>
      </div>
    </div>
  );
}

export function LogoMonochrome({ className = "w-8 h-8", color = "#102A43" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 8L38 16v14L24 38 10 30V16L24 8z"
        fill={color}
        stroke={color}
        strokeWidth="1"
      />
      <circle cx="24" cy="23" r="10" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <line x1="14" y1="14" x2="20" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="34" y1="14" x2="28" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="32" x2="20" y2="27" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="34" y1="32" x2="28" y2="27" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="23" r="3.5" fill={color} />
    </svg>
  );
}
