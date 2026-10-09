import { useEffect, useRef, type Dispatch } from 'react';
import { content, urls } from '../config/content';
import { isStepComplete, type FlowAction, type FlowState } from '../logic/flow';
import { AGE_IDS, SERVICE_IDS, TOPIC_IDS, type Answers, type StepId } from '../types';
import { ExternalLink } from './ExternalLink';
import { QuestionStep } from './QuestionStep';

export const PANEL_ID = 'hmp-panel';
const TITLE_ID = 'hmp-panel-title';

interface FinderPanelProps {
  open: boolean;
  demoMode: boolean;
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
  onClose: () => void;
}

function stepHeading(step: StepId, hasMatches: boolean) {
  if (step === 'results') {
    const { eyebrow, titleWithMatches, titleNoMatches } = content.results;
    return { eyebrow, title: hasMatches ? titleWithMatches : titleNoMatches };
  }
  return content[step];
}

function AnswerSummary({ answers }: { answers: Answers }) {
  return (
    <div className="hmp-summary">
      {answers.service && <strong>{content.service.options[answers.service]}</strong>}
      {answers.age && (
        <span>
          {content.age.summaryPrefix} {content.age.options[answers.age]}
        </span>
      )}
      {answers.topic && <span>{content.topic.options[answers.topic]}</span>}
    </div>
  );
}

export function FinderPanel({ open, demoMode, state, dispatch, onClose }: FinderPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { step, answers } = state;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Move focus to the step heading whenever the panel opens or the step changes.
  useEffect(() => {
    if (!open) return;
    bodyRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [open, step]);

  const { eyebrow, title } = stepHeading(step, false);
  const next = () => dispatch({ type: 'next' });
  const back = () => dispatch({ type: 'back' });

  const navButtons = (primaryLabel: string) => (
    <div className="hmp-nav">
      <button
        type="button"
        className="hmp-btn hmp-btn--primary"
        disabled={!isStepComplete(step, answers)}
        onClick={next}
      >
        {primaryLabel}
        <span aria-hidden="true">→</span>
      </button>
      <button type="button" className="hmp-btn hmp-btn--text" onClick={back}>
        <span aria-hidden="true">←</span>
        {content.common.back}
      </button>
    </div>
  );

  return (
    <dialog
      ref={dialogRef}
      id={PANEL_ID}
      className="hmp-panel"
      aria-labelledby={TITLE_ID}
      onClose={onClose}
    >
      <div className="hmp-panel__header">
        <span className="hmp-panel__brand">{content.panel.brand}</span>
        <button
          type="button"
          className="hmp-icon-btn"
          aria-label={content.panel.closeLabel}
          onClick={() => dialogRef.current?.close()}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="hmp-panel__body" ref={bodyRef}>
        {demoMode && <p className="hmp-demo-banner">{content.panel.demoBanner}</p>}
        <p className="hmp-eyebrow">{eyebrow}</p>
        <h2 id={TITLE_ID} className="hmp-title" tabIndex={-1} ref={headingRef}>
          {title}
        </h2>

        {step === 'welcome' && (
          <>
            <p>{content.welcome.intro}</p>
            <div className="hmp-stack">
              <button
                type="button"
                className="hmp-btn hmp-btn--primary"
                onClick={() => dispatch({ type: 'start' })}
              >
                {content.welcome.start}
                <span aria-hidden="true">→</span>
              </button>
              <ExternalLink href={urls.team} variant="secondary">
                {content.welcome.browseTeam}
              </ExternalLink>
              <ExternalLink href={urls.intake} variant="secondary">
                {content.welcome.bookIntake}
              </ExternalLink>
            </div>
            <p className="hmp-small hmp-muted">{content.welcome.disclaimer}</p>
          </>
        )}

        {step === 'service' && (
          <>
            <p>{content.service.hint}</p>
            <QuestionStep
              labelledBy={TITLE_ID}
              options={SERVICE_IDS}
              labels={content.service.options}
              selected={answers.service}
              onSelect={(value) => dispatch({ type: 'answer', field: 'service', value })}
            />
            {navButtons(content.common.continue)}
            <ExternalLink href={urls.intake} variant="secondary">
              {content.welcome.bookIntake}
            </ExternalLink>
          </>
        )}

        {step === 'age' && (
          <>
            <p>{content.age.hint}</p>
            <QuestionStep
              labelledBy={TITLE_ID}
              options={AGE_IDS}
              labels={content.age.options}
              selected={answers.age}
              onSelect={(value) => dispatch({ type: 'answer', field: 'age', value })}
            />
            {navButtons(content.common.continue)}
          </>
        )}

        {step === 'topic' && (
          <>
            <p>{content.topic.hint}</p>
            <QuestionStep
              labelledBy={TITLE_ID}
              options={TOPIC_IDS}
              labels={content.topic.options}
              selected={answers.topic}
              onSelect={(value) => dispatch({ type: 'answer', field: 'topic', value })}
            />
            {navButtons(content.common.continue)}
          </>
        )}

        {step === 'review' && (
          <>
            <AnswerSummary answers={answers} />
            <p className="hmp-small hmp-muted">{content.review.languageNote}</p>
            {navButtons(content.review.showResults)}
          </>
        )}

        {step === 'results' && (
          <>
            <AnswerSummary answers={answers} />
            <p className="hmp-todo">{content.results.notImplemented}</p>
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
              <button type="button" className="hmp-btn hmp-btn--text" onClick={() => dispatch({ type: 'edit' })}>
                {content.results.editAnswers}
              </button>
              <button type="button" className="hmp-btn hmp-btn--text" onClick={() => dispatch({ type: 'restart' })}>
                {content.results.restart}
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
