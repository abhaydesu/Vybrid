import { timingSafeEqual } from "node:crypto";

export const COOKIE = "vybrid-admin";

/** True when `key` equals ANALYTICS_KEY. Always false if that isn't set. */
export function keyMatches(key: string | undefined) {
  const secret = process.env.ANALYTICS_KEY;
  if (!secret || !key) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
