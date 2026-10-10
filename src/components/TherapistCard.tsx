import type { Ref } from 'react';
import { content, settings } from '../config/content';
import type { Therapist } from '../types';
import { ExternalLink } from './ExternalLink';

interface TherapistCardProps {
  therapist: Therapist;
  headingRef?: Ref<HTMLHeadingElement>;
}

export function TherapistCard({ therapist, headingRef }: TherapistCardProps) {
  const { name, title, creds, focus, status, url } = therapist;
  const role = title.split('|')[0].trim();
  const meta = [creds.join(', '), role].filter(Boolean).join(' · ');
  const focusShown = focus.slice(0, settings.cardFocusCount).join(', ');

  return (
    <article className="hmp-card">
      <h3 className="hmp-card__name" tabIndex={-1} ref={headingRef}>
        {name}
      </h3>
      {meta && <p className="hmp-card__meta">{meta}</p>}
      {focusShown && (
        <p className="hmp-card__meta">
          {content.results.practiceFocusLabel} {focusShown}
        </p>
      )}
      {status && <p className="hmp-card__status hmp-small hmp-muted">{status}</p>}
      <ExternalLink href={url} variant="text" icon="→">
        {content.results.viewProfile}
      </ExternalLink>
    </article>
  );
}
