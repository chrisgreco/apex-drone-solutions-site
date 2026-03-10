import { type ReactNode } from "react";

export function Card({
  icon,
  title,
  children,
}: {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white border border-neutral-100 rounded-lg p-7 hover:shadow-md transition-shadow">
      {icon && (
        <div className="w-11 h-11 flex items-center justify-center rounded-md bg-primary-50 text-primary-700 mb-5">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-primary-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{children}</p>
    </div>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center px-6 py-5">
      <div className="text-3xl md:text-4xl font-bold text-accent-500">{value}</div>
      <div className="mt-1 text-sm text-neutral-500">{label}</div>
    </div>
  );
}

export function StepCard({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative pl-16">
      <div className="absolute left-0 top-0 w-11 h-11 flex items-center justify-center rounded-full bg-accent-500 text-white font-bold text-sm">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-primary-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{children}</p>
    </div>
  );
}
