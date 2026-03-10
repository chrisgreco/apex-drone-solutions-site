export function SectionHeading({
  tag,
  title,
  description,
  align = "center",
}: {
  tag?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} mb-12`}>
      {tag && (
        <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-500 mb-3">
          {tag}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-primary-900 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-neutral-500 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
