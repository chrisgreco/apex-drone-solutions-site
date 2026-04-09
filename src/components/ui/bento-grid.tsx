"use client";

export function BentoGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {children}
    </div>
  );
}

export function BentoCard({
  title,
  description,
  icon,
  className = "",
  children,
  href,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  href?: string;
}) {
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={`group relative overflow-hidden rounded-2xl border border-accent-500/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-accent-400/30 hover:bg-white/[0.06] hover:-translate-y-0.5 backdrop-blur-sm ${className}`}
    >
      {/* Subtle gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-500/0 to-accent-500/0 group-hover:from-accent-500/5 group-hover:to-transparent transition-all duration-500" />

      <div className="relative">
        {icon && (
          <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-900/60 text-accent-400">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-white/50 leading-relaxed">{description}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </Wrapper>
  );
}
