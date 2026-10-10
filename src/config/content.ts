import type { AgeId, ServiceId, TopicId } from '../types';

// All editable widget copy and shared URLs. Therapist-specific data lives in data/therapists.json.
// Editing this file requires a new build and deployment before changes appear on the live site.

export const urls = {
  /** General Owl Practice intake (booking) page. */
  intake: 'https://aws-portal.owlpractice.ca/healthymindspsychotherapy/booking',
  team: 'https://www.healthymindspsychotherapy.com/our-team',
  affordableTherapy: 'https://www.healthymindspsychotherapy.com/affordable-therapy-toronto',
};

export const settings = {
  /** Therapist cards shown first, and added per "Show more" click. */
  resultsPageSize: 3,
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
    affordableTherapy: 'Affordable therapy',
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
    submit: 'Show therapists',
    options: {
      A: 'Stress & anxiety',
      G: 'Grief & loss',
      R: 'Relationships',
      L: 'Life changes',
      M: 'Low mood',
      X: 'I’m not sure / Skip',
    } satisfies Record<TopicId, string>,
  },

  results: {
    eyebrow: 'YOUR OPTIONS',
    title: 'Therapists to explore.',
    showing: (shown: number, total: number) =>
      `Showing ${shown} of ${total} ${total === 1 ? 'profile' : 'profiles'} that match these directory tags.`,
    languageNote: 'Language does not limit your results.',
    practiceFocusLabel: 'Practice focus:',
    viewProfile: 'View profile',
    showMore: 'Show more therapists',
    availabilityNote: 'Availability and suitability are confirmed at intake.',
    bookIntake: 'Book a complimentary intake',
    viewAllTherapists: 'View all therapists',
    editAnswers: 'Edit my answers',
    restart: 'Start again',
  },

  // Shown instead of results when nothing matches. Criteria are never broadened.
  noMatches: {
    eyebrow: 'LET’S FIND ANOTHER WAY',
    title: 'Our team can help.',
    body: 'We couldn’t find a profile matching all your selections.',
    bookIntake: 'Book a complimentary intake',
    changeOptions: 'Change my options',
    browsePrefix: 'You can also ',
    browseLink: 'browse the full team',
    browseSuffix: '.',
  },
};
