import mongoose, { type InferSchemaType } from "mongoose";

import { EVENT_TYPES } from "./events";

const schema = new mongoose.Schema(
  {
    type: { type: String, enum: EVENT_TYPES, required: true },
    path: { type: String, required: true },
    game: String,
    referrer: String,
    source: String,
    /** Anonymous visitor id (per browser) and session id (per tab session). */
    vid: { type: String, required: true },
    sid: { type: String, required: true },
    device: { type: String, enum: ["mobile", "tablet", "desktop"] },
    country: String,
    ts: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

// Events older than this are deleted by MongoDB (keeps the free tier small).
schema.index({ ts: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });
schema.index({ type: 1, ts: -1 });

export type AnalyticsEventDoc = InferSchemaType<typeof schema>;

export const AnalyticsEvent: mongoose.Model<AnalyticsEventDoc> =
  mongoose.models.AnalyticsEvent ??
  mongoose.model<AnalyticsEventDoc>("AnalyticsEvent", schema);
