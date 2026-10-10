import { describe, expect, it } from 'vitest';
import { flowReducer, initialFlowState, withAnswer, type FlowAction, type FlowState } from './flow';

const run = (actions: FlowAction[], from: FlowState = initialFlowState) => actions.reduce(flowReducer, from);

describe('withAnswer (dependent-answer invalidation)', () => {
  it('clears age when service changes away from child/teen', () => {
    const answers = { service: 'child_teen', age: 'age8_14', topic: 'G' } as const;
    expect(withAnswer(answers, { service: 'adult_individual' })).toEqual({
      service: 'adult_individual',
      age: null,
      topic: 'G',
    });
  });

  it('keeps age and topic when an unrelated answer changes', () => {
    const answers = { service: 'child_teen', age: 'age8_14', topic: 'G' } as const;
    expect(withAnswer(answers, { topic: 'A' })).toEqual({ service: 'child_teen', age: 'age8_14', topic: 'A' });
    expect(withAnswer(answers, { service: 'child_teen' })).toEqual(answers);
  });
});

describe('flowReducer', () => {
  it('adult path skips the age step and goes straight from topic to results', () => {
    const s = run([
      { type: 'start' },
      { type: 'answer', field: 'service', value: 'adult_individual' },
      { type: 'next' },
    ]);
    expect(s.step).toBe('topic');
    const done = run([{ type: 'answer', field: 'topic', value: 'A' }, { type: 'next' }], s);
    expect(done.step).toBe('results');
  });

  it('child path includes the conditional age step', () => {
    const s = run([
      { type: 'start' },
      { type: 'answer', field: 'service', value: 'child_teen' },
      { type: 'next' },
    ]);
    expect(s.step).toBe('age');
  });

  it('does not advance without an answer', () => {
    expect(run([{ type: 'start' }, { type: 'next' }]).step).toBe('service');
  });

  it('back preserves answers; back from results returns to topic', () => {
    const results = run([
      { type: 'start' },
      { type: 'answer', field: 'service', value: 'child_teen' },
      { type: 'next' },
      { type: 'answer', field: 'age', value: 'age6_7' },
      { type: 'next' },
      { type: 'answer', field: 'topic', value: 'R' },
      { type: 'next' },
    ]);
    expect(results.step).toBe('results');
    const back = run([{ type: 'back' }], results);
    expect(back.step).toBe('topic');
    const back2 = run([{ type: 'back' }, { type: 'back' }], back);
    expect(back2.step).toBe('service');
    expect(back2.answers).toEqual({ service: 'child_teen', age: 'age6_7', topic: 'R' });
  });

  it('edit returns to service keeping answers; changing service invalidates only age', () => {
    const results = run([
      { type: 'start' },
      { type: 'answer', field: 'service', value: 'child_teen' },
      { type: 'next' },
      { type: 'answer', field: 'age', value: 'age6_7' },
      { type: 'next' },
      { type: 'answer', field: 'topic', value: 'R' },
      { type: 'next' },
    ]);
    const edited = run([{ type: 'edit' }, { type: 'answer', field: 'service', value: 'couples' }], results);
    expect(edited.step).toBe('service');
    expect(edited.answers).toEqual({ service: 'couples', age: null, topic: 'R' });
    expect(run([{ type: 'next' }], edited).step).toBe('topic');
  });

  it('switching to child/teen after topic requires a new age before results', () => {
    const s = run([
      { type: 'start' },
      { type: 'answer', field: 'service', value: 'adult_individual' },
      { type: 'next' },
      { type: 'answer', field: 'topic', value: 'A' },
      { type: 'edit' },
      { type: 'answer', field: 'service', value: 'child_teen' },
      { type: 'next' },
    ]);
    expect(s.step).toBe('age');
    expect(s.answers.age).toBeNull();
  });

  it('restart clears everything', () => {
    const s = run([{ type: 'start' }, { type: 'answer', field: 'service', value: 'family' }, { type: 'restart' }]);
    expect(s).toEqual(initialFlowState);
  });
});
