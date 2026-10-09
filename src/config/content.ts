import type { AgeId, ServiceId, TopicId } from '../types';

// All editable widget copy and shared URLs. Therapist-specific data lives in data/therapists.json.
// Editing this file requires a new build and deployment before changes appear on the live site.

export const urls = {
  /** General Owl Practice intake (booking) page. */
  intake: 'https://aws-portal.owlpractice.ca/healthymindspsychotherapy/booking',
  team: 'https://www.healthymindspsychotherapy.com/our-team',
};

export const settings = {
  /** Maximum number of therapist cards shown on the results step. */
  maxResults: 3,
};

export const content = {
  launcher: {
    label: 'Find a therapist',
  },

  panel: {
    brand: 'HEALTHY MINDS · FINDER',
    closeLabel: 'Close finder',
    demoBanner: 'TEST DEMO · Draft directory mappings, not approved recommendations.',
  },

  common: {
    continue: 'Continue',
    back: 'Back',
    opensInNewTab: 'opens in new tab',
    linkUnavailable: 'Link not available yet',
  },

  welcome: {
    eyebrow: 'A LITTLE GUIDANCE',
    title: 'Find your next step.',
    intro: 'Choose a few options to explore our team.',
    start: 'Help me find a therapist',
    browseTeam: 'Browse all therapists',
    bookIntake: 'Book a complimentary intake',
    disclaimer: 'An automated guide to our team. Not therapy or emergency support.',
  },

  service: {
    eyebrow: '1 OF 2 · SERVICE',
    title: 'Who is therapy for?',
    hint: 'Choose one option.',
    options: {
      adult_individual: 'Adult individual therapy',
      child_teen: 'Child or teen therapy',
      couples: 'Couples therapy',
      family: 'Family therapy',
    } satisfies Record<ServiceId, string>,
  },

  // Conditional step: shown only when service is "child_teen".
  age: {
    eyebrow: 'CHILD OR TEEN THERAPY',
    title: 'What age group?',
    hint: 'This helps us show age-appropriate profiles.',
    summaryPrefix: 'Age',
    options: {
      under6: 'Under 6',
      age6_7: '6–7',
      age8_14: '8–14',
      age15_17: '15–17',
    } satisfies Record<AgeId, string>,
  },

  topic: {
    eyebrow: '2 OF 2 · SUPPORT',
    title: 'What would you like support with?',
    hint: 'Choose one topic to get started.',
    options: {
      A: 'Stress & anxiety',
      G: 'Grief & loss',
      R: 'Relationships',
      L: 'Life changes',
      M: 'Low mood',
      X: 'I’m not sure / Skip',
    } satisfies Record<TopicId, string>,
  },

  review: {
    eyebrow: 'REVIEW YOUR CHOICES',
    title: 'Ready to explore?',
    languageNote: 'Language does not limit your results.',
    showResults: 'Show therapists',
  },

  results: {
    eyebrow: 'YOUR OPTIONS',
    titleWithMatches: 'Therapists to explore.',
    titleNoMatches: 'Our team can help.',
    // TODO(phase 3): remove once results are implemented.
    notImplemented: 'Results are not implemented in this visual prototype yet.',
    editAnswers: 'Edit my answers',
    restart: 'Start again',
    viewAllTherapists: 'View all therapists',
    bookIntake: 'Book a complimentary intake',
    availabilityNote: 'Availability and suitability are confirmed at intake.',
  },
};
