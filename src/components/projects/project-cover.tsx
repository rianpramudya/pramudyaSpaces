import { type Entry, textValue, listValue } from '@/lib/model';
import { mediaURL } from '@/lib/client-api';
import { hasConceptMedia } from '@/lib/presentation';
export function ProjectCover({
  entry,
  en,
  lazy = true,
}: {
  entry: Entry;
  en: boolean;
  lazy?: boolean;
}) {
  const image = listValue(entry.data, 'media')[0],
    concept = hasConceptMedia(entry),
    role = textValue(entry.data, 'role') || textValue(entry.data, 'category');
  if (image && !concept)
    return (
      <img
        src={mediaURL(image)}
        width={960}
        height={600}
        loading={lazy ? 'lazy' : undefined}
        alt={textValue(entry.data, 'alt') || entry.title}
      />
    );
  return (
    <div
      className="project-editorial-cover"
      data-domain={/learning|vision|science/i.test(role) ? 'intelligence' : 'systems'}
    >
      <div className="cover-reading">
        <span>{role}</span>
        <strong>{entry.title}</strong>
      </div>
      <div className="cover-stack">
        <span>{listValue(entry.data, 'technologies').slice(0, 3).join(' / ')}</span>
        <small>
          {concept
            ? en
              ? 'Concept cover'
              : 'Sampul konsep'
            : en
              ? 'Project overview'
              : 'Ringkasan proyek'}
        </small>
      </div>
    </div>
  );
}
