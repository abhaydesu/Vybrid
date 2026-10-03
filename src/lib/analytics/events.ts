/** Event types the tracker accepts. Anything else is dropped by /api/track. */
export const EVENT_TYPES = ["pageview", "game_start", "game_over"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export interface TrackPayload {
  type: EventType;
  path: string;
  /** Game slug for game_start / game_over. */
  game?: string;
  referrer?: string;
  /** utm_source from the landing URL, if any. */
  source?: string;
  vid: string;
  sid: string;
}
