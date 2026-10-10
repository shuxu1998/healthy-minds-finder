// Stable IDs used for state and matching. Display labels live in config/content.ts.
export const SERVICE_IDS = ['adult_individual', 'child_teen', 'couples', 'family'] as const;
export const AGE_IDS = ['under6', 'age6_7', 'age8_14', 'age15_17'] as const;
export const TOPIC_IDS = ['A', 'G', 'R', 'L', 'M', 'X'] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];
export type AgeId = (typeof AGE_IDS)[number];
export type TopicId = (typeof TOPIC_IDS)[number];
/** "X" means "not sure / skip" and is never stored on a therapist. */
export type TherapistTopicId = Exclude<TopicId, 'X'>;

export interface Answers {
  service: ServiceId | null;
  age: AgeId | null;
  topic: TopicId | null;
}

export type StepId = 'welcome' | 'service' | 'age' | 'topic' | 'results';

export type ReviewStatus = 'draft' | 'approved';

export interface Therapist {
  // Profile fields, copied from the clinic's profile pages.
  id: string;
  name: string;
  /** Segments separated by " | "; the card shows the first segment. */
  title: string;
  creds: string[];
  approaches: string[];
  /** Areas of focus, in profile order; the card shows the first few. */
  focus: string[];
  serves: string[];
  langs: string[];
  url: string | null;
  active: boolean;
  /** Accepting-clients status as written on the profile, shown on the card. */
  status?: string;
  format?: string;
  avail?: string;
  fees?: string;
  /** Only set when the clinic provides a therapist-specific booking link. */
  bookingUrl?: string | null;

  // Matching fields (draft mapping until the clinic approves each record).
  reviewStatus: ReviewStatus;
  sortOrder: number;
  services: ServiceId[];
  childMin: number | null;
  childMax: number | null;
  topics: TherapistTopicId[];
}
