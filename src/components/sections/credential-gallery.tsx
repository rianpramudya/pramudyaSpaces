'use client';
import { useEffect, useId, useState } from 'react';
import { ArrowRight, Award, Plus, Expand } from 'lucide-react';
import { type Entry, textValue, listValue } from '@/lib/model';
import { mediaURL } from '@/lib/client-api';
import { hasConceptMedia } from '@/lib/presentation';
import { RelatedWorkLinks } from '@/components/related-work-links';
import {certificateFromHash} from '@/lib/certificate-relations';
export function CredentialGallery({
  certificates,
  en,
  onPreview,
  projects = [],
}: {
  projects?: Entry[];
  certificates: Entry[];
  en: boolean;
  onPreview: (entry: Entry) => void;
}) {
  const [selection, setSelection] = useState(''),
    uid = useId();
  useEffect(()=>{
    const selectFromHash=()=>{const target=certificateFromHash(window.location.hash,certificates);if(target)setSelection(target.id);};
    selectFromHash();window.addEventListener('hashchange',selectFromHash);
    return()=>window.removeEventListener('hashchange',selectFromHash);
  },[certificates]);
  useEffect(()=>{
    if(selection&&window.location.hash===`#certificate-${selection}`){
      const target=document.getElementById(`certificate-${selection}`);
      target?.scrollIntoView({block:'center',behavior:'instant'});
      target?.focus({preventScroll:true});
    }
  },[selection]);
  const index = Math.max(
      0,
      certificates.findIndex((e) => e.id === selection),
    ),
    entry = certificates[index];
  if (!entry) return null;
  const image = listValue(entry.data, 'media')[0],
    concept = hasConceptMedia(entry);
  return (
    <div className="studio-credential-gallery">
      <label className="credential-mobile-selector" htmlFor={`${uid}-select`}>
        {en ? 'Choose a certificate' : 'Pilih sertifikat'}
        <select
          id={`${uid}-select`}
          value={entry.id}
          onChange={(event) => setSelection(event.target.value)}
        >
          {certificates.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <div className="credential-stage">
        <div className="credential-sheet" key={entry.id}>
          {image ? (
            <button
              type="button"
              onClick={() => onPreview(entry)}
              aria-label={`${en ? 'Preview' : 'Pratinjau'} ${entry.title}`}
            >
              {concept ? (
                <div className="credential-record-poster">
                  <small>{en ? 'Learning record' : 'Catatan pembelajaran'}</small>
                  <span>{textValue(entry.data, 'issuer')}</span>
                  <strong>{entry.title}</strong>
                  <p>{textValue(entry.data, 'date')}</p>
                  <small>
                    {en
                      ? 'Supporting illustration, not the original document.'
                      : 'Ilustrasi pendukung, bukan dokumen asli.'}
                  </small>
                </div>
              ) : (
                <img
                  src={mediaURL(image)}
                  alt={textValue(entry.data, 'alt') || entry.title}
                  width={960}
                  height={680}
                  loading="lazy"
                />
              )}
              <span>
                <Expand size={17} />
                {concept
                  ? en
                    ? 'View illustration'
                    : 'Lihat ilustrasi'
                  : en
                    ? 'View document'
                    : 'Lihat dokumen'}
              </span>
            </button>
          ) : (
            <div className="credential-no-image">
              <Award size={56} strokeWidth={1} />
              <p>{entry.title}</p>
            </div>
          )}
        </div>
        <span className="credential-counter" aria-live="polite">
          {index + 1} / {certificates.length}
        </span>
      </div>
      <div className="credential-index">
        <p className="studio-eyebrow">{en ? 'Learning archive' : 'Arsip pembelajaran'}</p>
        <div aria-label={en ? 'Choose a certificate' : 'Pilih sertifikat'}>
          {certificates.map((item, i) => (
            <article id={`certificate-${item.id}`} tabIndex={-1} className="credential-index-item" key={item.id} data-active={i === index}>
              <button
                type="button"
                aria-pressed={i === index}
                aria-controls={`${uid}-detail-${i}`}
                onClick={() => setSelection(item.id)}
              >
                <span>
                  {[textValue(item.data, 'issuer'), textValue(item.data, 'date')]
                    .filter(Boolean)
                    .join(' / ')}
                </span>
                <strong>{item.title}</strong>
                <ArrowRight size={18} />
              </button>
              <div id={`${uid}-detail-${i}`} hidden={i !== index}>
                {(textValue(item.data, 'description') || textValue(item.data, 'credential')) && (
                  <details>
                    <summary>
                      {en ? 'Details' : 'Rincian'}
                      <Plus size={15} />
                    </summary>
                    <p>{textValue(item.data, 'description')}</p>
                    <p>{textValue(item.data, 'credential')}</p>
                  </details>
                )}
                <RelatedWorkLinks entry={item} projects={projects} en={en} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
