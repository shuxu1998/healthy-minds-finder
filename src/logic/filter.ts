import type { AgeId, Answers, Therapist } from '../types';

// Pure matching logic: no React, DOM, styling or network access.

/** Inclusive age range covered by each age-band ID. */
export const AGE_BANDS: Record<AgeId, readonly [number, number]> = {
  under6: [0, 5],
  age6_7: [6, 7],
  age8_14: [8, 14],
  age15_17: [15, 17],
};

export interface MatchOptions {
  /** Demo only: include records whose reviewStatus is still "draft". */
  includeDrafts: boolean;
}

/**
 * Returns therapists matching every answer, ordered by sortOrder then id.
 * Incomplete answers return no matches; criteria are never broadened when nothing matches.
 */
export function matchTherapists(
  therapists: readonly Therapist[],
  answers: Answers,
  { includeDrafts }: MatchOptions,
): Therapist[] {
  const { service, age, topic } = answers;
  if (!service || !topic) return [];
  if (service === 'child_teen' && !age) return [];

  return therapists
    .filter((t) => {
      if (!t.active) return false;
      if (t.reviewStatus !== 'approved' && !includeDrafts) return false;
      if (!t.services.includes(service)) return false;
      if (service === 'child_teen' && age) {
        const [min, max] = AGE_BANDS[age];
        if (t.childMin === null || t.childMax === null) return false;
        if (min < t.childMin || max > t.childMax) return false;
      }
      return topic === 'X' || t.topics.includes(topic);
    })
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
}
