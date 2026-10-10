import { useEffect, useRef, useState } from 'react';
import { content, settings, urls } from '../config/content';
import type { Therapist } from '../types';
import { ExternalLink } from './ExternalLink';
import { TherapistCard } from './TherapistCard';

interface ResultsStepProps {
  matches: Therapist[];
  onBack: () => void;
  onEdit: () => void;
  onRestart: () => void;
}

export function ResultsStep({ matches, onBack, onEdit, onRestart }: ResultsStepProps) {
  const [visible, setVisible] = useState(settings.resultsPageSize);
  /** Index of the first card revealed by the latest "Show more" click. */
  const [revealedFrom, setRevealedFrom] = useState<number | null>(null);
  const firstNewRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (revealedFrom !== null) firstNewRef.current?.focus();
  }, [revealedFrom]);

  const showMore = () => {
    setRevealedFrom(visible);
    setVisible(visible + settings.resultsPageSize);
  };

  if (matches.length === 0) {
    const copy = content.noMatches;
    return (
      <>
        <p>{copy.body}</p>
        <div className="hmp-stack">
          <ExternalLink href={urls.intake} variant="primary" icon="→">
            {copy.bookIntake}
          </ExternalLink>
          <button type="button" className="hmp-btn hmp-btn--secondary" onClick={onEdit}>
            {copy.changeOptions}
          </button>
        </div>
        <p>
          {copy.browsePrefix}
          <ExternalLink href={urls.team} variant="inline">
            {copy.browseLink}
          </ExternalLink>
          {copy.browseSuffix}
        </p>
      </>
    );
  }

  const shown = matches.slice(0, visible);

  return (
    <>
      <p className="hmp-small hmp-muted">
        {content.results.showing(shown.length, matches.length)} {content.results.languageNote}
      </p>
      <div className="hmp-cards">
        {shown.map((therapist, i) => (
          <TherapistCard
            key={therapist.id}
            therapist={therapist}
            headingRef={i === revealedFrom ? firstNewRef : undefined}
          />
        ))}
      </div>
      {visible < matches.length && (
        <button type="button" className="hmp-btn hmp-btn--secondary" onClick={showMore}>
          {content.results.showMore}
        </button>
      )}
      <p className="hmp-small hmp-muted">{content.results.availabilityNote}</p>
      <div className="hmp-stack">
        <ExternalLink href={urls.intake} variant="primary">
          {content.results.bookIntake}
        </ExternalLink>
        <ExternalLink href={urls.team} variant="secondary">
          {content.results.viewAllTherapists}
        </ExternalLink>
      </div>
      <div className="hmp-actions">
        <button type="button" className="hmp-btn hmp-btn--text" onClick={onBack}>
          <span aria-hidden="true">←</span>
          {content.common.back}
        </button>
        <button type="button" className="hmp-btn hmp-btn--text" onClick={onEdit}>
          {content.results.editAnswers}
        </button>
        <button type="button" className="hmp-btn hmp-btn--text" onClick={onRestart}>
          {content.results.restart}
        </button>
      </div>
    </>
  );
}
