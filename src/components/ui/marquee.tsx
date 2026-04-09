"use client";

export function Marquee({
  children,
  className = "",
  reverse = false,
  pauseOnHover = true,
  speed = 40,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  speed?: number;
}) {
  return (
    <div
      className={`flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] ${className}`}
    >
      <div
        className={`flex shrink-0 gap-8 py-4 animate-marquee ${
          reverse ? "[animation-direction:reverse]" : ""
        } ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
