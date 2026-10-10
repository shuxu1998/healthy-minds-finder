import type { Ref } from 'react';
import { content } from '../config/content';
import type { Therapist } from '../types';
import { ExternalLink } from './ExternalLink';

interface TherapistCardProps {
  therapist: Therapist;
  headingRef?: Ref<HTMLHeadingElement>;
}

export function TherapistCard({ therapist, headingRef }: TherapistCardProps) {
  const { name, credentials, role, practiceFocus, profileUrl } = therapist;
  const meta = [credentials, role].filter(Boolean).join(' · ');

  return (
    <article className="hmp-card">
      <h3 className="hmp-card__name" tabIndex={-1} ref={headingRef}>
        {name}
      </h3>
      {meta && <p className="hmp-card__meta">{meta}</p>}
      {practiceFocus && (
        <p className="hmp-card__meta">
          {content.results.practiceFocusLabel} {practiceFocus}
        </p>
      )}
      <ExternalLink href={profileUrl} variant="text" icon="→">
        {content.results.viewProfile}
      </ExternalLink>
    </article>
  );
}
