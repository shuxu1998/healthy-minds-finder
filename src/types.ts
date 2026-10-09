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

export type StepId = 'welcome' | 'service' | 'age' | 'topic' | 'review' | 'results';

export type ReviewStatus = 'draft' | 'approved';

export interface Therapist {
  id: string;
  name: string;
  /** null = not yet provided by the clinic (TODO). */
  credentials: string | null;
  active: boolean;
  reviewStatus: ReviewStatus;
  sortOrder: number;
  services: ServiceId[];
  childMin: number | null;
  childMax: number | null;
  topics: TherapistTopicId[];
  languages: string[];
  profileUrl: string | null;
  /** Only set when the clinic provides a therapist-specific booking link. */
  bookingUrl?: string | null;
}
