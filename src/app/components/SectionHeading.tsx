interface SectionHeadingProps {
  title: string;
  description?: string;
  id?: string;
}

export default function SectionHeading({ title, description, id }: SectionHeadingProps) {
  return (
    <div>
      <h2
        id={id}
        className="font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-4xl lg:text-[3.25rem]"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-ink-soft lg:mt-4 lg:text-xl">
          {description}
        </p>
      )}
    </div>
  );
}
