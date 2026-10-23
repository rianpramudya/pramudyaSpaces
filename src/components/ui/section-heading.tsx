export function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="studio-section-heading" data-reveal>
      <p className="studio-eyebrow">{label}</p>
      <h2>{title}</h2>
      {description && <p className="studio-description">{description}</p>}
    </header>
  );
}
