import type { AgeId, Answers, ServiceId, StepId, TopicId } from '../types';

// Pure flow state for useReducer. No React or DOM here so it can be unit tested.

export interface FlowState {
  step: StepId;
  answers: Answers;
}

export type FlowAction =
  | { type: 'start' }
  | { type: 'answer'; field: 'service'; value: ServiceId }
  | { type: 'answer'; field: 'age'; value: AgeId }
  | { type: 'answer'; field: 'topic'; value: TopicId }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'edit' }
  | { type: 'restart' };

export const emptyAnswers: Answers = { service: null, age: null, topic: null };

export const initialFlowState: FlowState = { step: 'welcome', answers: emptyAnswers };

/** Question steps for the current answers; the age step only exists for child/teen therapy. */
export function questionSteps(answers: Answers): StepId[] {
  return answers.service === 'child_teen' ? ['service', 'age', 'topic'] : ['service', 'topic'];
}

function stepSequence(answers: Answers): StepId[] {
  return ['welcome', ...questionSteps(answers), 'results'];
}

/** Drops answers that are no longer valid after an upstream change. */
export function withAnswer(answers: Answers, change: Partial<Answers>): Answers {
  const next = { ...answers, ...change };
  if (next.service !== 'child_teen') next.age = null;
  return next;
}

export function isStepComplete(step: StepId, answers: Answers): boolean {
  switch (step) {
    case 'service':
      return answers.service !== null;
    case 'age':
      return answers.age !== null;
    case 'topic':
      return answers.topic !== null;
    default:
      return true;
  }
}

/** True when every question required for the current answers has been answered. */
export function answersComplete(answers: Answers): boolean {
  return questionSteps(answers).every((step) => isStepComplete(step, answers));
}

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  const sequence = stepSequence(state.answers);
  const index = sequence.indexOf(state.step);

  switch (action.type) {
    case 'start':
      return { ...state, step: 'service' };
    case 'answer':
      return { ...state, answers: withAnswer(state.answers, { [action.field]: action.value }) };
    case 'next': {
      if (!isStepComplete(state.step, state.answers) || index >= sequence.length - 1) return state;
      const nextStep = sequence[index + 1];
      if (nextStep === 'results' && !answersComplete(state.answers)) return state;
      return { ...state, step: nextStep };
    }
    case 'back':
      return index > 0 ? { ...state, step: sequence[index - 1] } : state;
    case 'edit':
      return { ...state, step: 'service' };
    case 'restart':
      return initialFlowState;
  }
}
