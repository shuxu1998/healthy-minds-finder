import { describe, expect, it } from 'vitest';
import therapistsJson from '../data/therapists.json';
import type { Answers, Therapist } from '../types';
import { matchTherapists } from './filter';

const real = therapistsJson as Therapist[];

function therapist(overrides: Partial<Therapist>): Therapist {
  return {
    id: 'X',
    name: 'Test',
    title: 'Registered Psychotherapist',
    creds: ['RP'],
    approaches: [],
    focus: [],
    serves: [],
    langs: ['English'],
    url: 'https://www.healthymindspsychotherapy.com/our-team-test',
    active: true,
    reviewStatus: 'approved',
    sortOrder: 1,
    services: ['adult_individual'],
    childMin: null,
    childMax: null,
    topics: ['A'],
    ...overrides,
  };
}

const adultAnxiety: Answers = { service: 'adult_individual', age: null, topic: 'A' };
const demo = { includeDrafts: true };
const live = { includeDrafts: false };
const ids = (list: Therapist[]) => list.map((t) => t.id);

describe('matchTherapists', () => {
  it('matches by service and topic IDs, ordered by sortOrder', () => {
    expect(ids(matchTherapists(real, adultAnxiety, demo))).toEqual([
      'katharine-de-santos', 'kelsey-dubiel', 'sarah-brown', 'gabrielle-mccarthy', 'kimberly-cartwright', 'atessa-hooshvar', 'maria-moncaleano', 'erin-hardy', 'kasey-silva', 'ekta-maloo',
    ]);
  });

  it('breaks sortOrder ties by id', () => {
    const list = [therapist({ id: 'B', sortOrder: 1 }), therapist({ id: 'A', sortOrder: 1 }), therapist({ id: 'C', sortOrder: 0 })];
    expect(ids(matchTherapists(list, adultAnxiety, live))).toEqual(['C', 'A', 'B']);
  });

  it('always excludes inactive therapists', () => {
    const list = [therapist({ id: 'on' }), therapist({ id: 'off', active: false })];
    expect(ids(matchTherapists(list, adultAnxiety, demo))).toEqual(['on']);
    expect(ids(matchTherapists(list, adultAnxiety, live))).toEqual(['on']);
  });

  it('shows draft records only when drafts are included (demo)', () => {
    const list = [therapist({ id: 'ok' }), therapist({ id: 'draft', reviewStatus: 'draft', sortOrder: 2 })];
    expect(ids(matchTherapists(list, adultAnxiety, demo))).toEqual(['ok', 'draft']);
    expect(ids(matchTherapists(list, adultAnxiety, live))).toEqual(['ok']);
  });

  it('returns nothing on the live site while every real record is still draft', () => {
    expect(matchTherapists(real, adultAnxiety, live)).toEqual([]);
  });

  it('"not sure" topic matches any topic but keeps the service requirement', () => {
    expect(ids(matchTherapists(real, { service: 'couples', age: null, topic: 'X' }, demo))).toEqual(['katharine-de-santos', 'gabrielle-mccarthy']);
  });

  it('requires the full age band to be inside the therapist range', () => {
    const child = (age: Answers['age']) =>
      ids(matchTherapists(real, { service: 'child_teen', age, topic: 'X' }, demo));
    expect(child('under6')).toEqual([]);
    expect(child('age6_7')).toEqual(['kasey-silva']);
    expect(child('age8_14')).toEqual(['sarah-brown', 'kasey-silva']);
    expect(child('age15_17')).toEqual(['sarah-brown', 'erin-hardy', 'kasey-silva']);
  });

  it('never broadens criteria when there are no matches', () => {
    // Only Kasey (kasey-silva) covers ages 6–7, and she does not list grief: no match, not "Kasey anyway".
    expect(matchTherapists(real, { service: 'child_teen', age: 'age6_7', topic: 'G' }, demo)).toEqual([]);
    expect(matchTherapists(real, { service: 'child_teen', age: 'under6', topic: 'A' }, demo)).toEqual([]);
    expect(ids(matchTherapists(real, { service: 'family', age: null, topic: 'G' }, demo))).toEqual(['sarah-brown']);
    expect(ids(matchTherapists(real, { service: 'family', age: null, topic: 'R' }, demo))).toEqual(['kasey-silva']);
  });

  it('returns nothing for incomplete answers', () => {
    expect(matchTherapists(real, { service: null, age: null, topic: 'A' }, demo)).toEqual([]);
    expect(matchTherapists(real, { service: 'adult_individual', age: null, topic: null }, demo)).toEqual([]);
    expect(matchTherapists(real, { service: 'child_teen', age: null, topic: 'A' }, demo)).toEqual([]);
  });
});
