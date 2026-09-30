interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">
        {eyebrow}
      </p>
      <h2 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-xl leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </div>
  );
}
