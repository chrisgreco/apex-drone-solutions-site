export function LogoMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Roofline / apex triangle */}
      <path
        d="M24 6L4 28h8l12-14 12 14h8L24 6z"
        fill="#102A43"
        stroke="#102A43"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Subtle flight path arc */}
      <path
        d="M14 32c4-6 10-9 20-8"
        stroke="#E8792A"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small diamond / drone hint at end of flight path */}
      <path
        d="M34 24l2.5-2.5L39 24l-2.5 2.5z"
        fill="#E8792A"
      />
    </svg>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="w-9 h-9" />
      <div className="flex flex-col leading-none">
        <span className="text-[1.125rem] font-bold tracking-tight text-primary-900">
          Apex Drone
        </span>
        <span className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-primary-500">
          Solutions
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
        d="M24 6L4 28h8l12-14 12 14h8L24 6z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 32c4-6 10-9 20-8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M34 24l2.5-2.5L39 24l-2.5 2.5z"
        fill={color}
      />
    </svg>
  );
}
