import { connectToDatabase } from "@/lib/mongoose";
import { AnalyticsEvent } from "./model";

export interface Row {
  label: string;
  count: number;
}

export interface Totals {
  pageviews: number;
  visitors: number;
  sessions: number;
  gamesStarted: number;
  gamesFinished: number;
}

export interface Summary {
  days: number;
  timeZone: string;
  totals: Totals;
  /** Same-length window immediately before this one. */
  previous: Totals;
  /** Distinct sessions with an event in the last 5 minutes. */
  activeNow: number;
  newVisitors: number;
  returningVisitors: number;
  /** One entry per day, oldest first (YYYY-MM-DD in `timeZone`). */
  daily: { day: string; pageviews: number; visitors: number }[];
  /** 24 entries, pageviews by hour of day in `timeZone`. */
  hours: number[];
  /** 7 entries, Sunday first. */
  weekdays: number[];
  topPages: Row[];
  sources: Row[];
  devices: Row[];
  countries: Row[];
  games: { game: string; started: number; finished: number }[];
}

const DAY = 86_400_000;
export const TIME_ZONE = process.env.ANALYTICS_TZ || "Asia/Kolkata";

const rows = (r: { _id: string | null; count: number }[]): Row[] =>
  r.map((x) => ({ label: x._id ?? "(none)", count: x.count }));

async function totalsBetween(from: Date, to: Date): Promise<Totals> {
  const range = { ts: { $gte: from, $lt: to } };
  const [pv, games] = await Promise.all([
    AnalyticsEvent.aggregate<{ pageviews: number; vids: string[]; sids: string[] }>([
      { $match: { ...range, type: "pageview" } },
      {
        $group: {
          _id: null,
          pageviews: { $sum: 1 },
          vids: { $addToSet: "$vid" },
          sids: { $addToSet: "$sid" },
        },
      },
    ]),
    AnalyticsEvent.aggregate<{ _id: string; count: number }>([
      { $match: { ...range, type: { $in: ["game_start", "game_over"] } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),
  ]);
  const count = (type: string) => games.find((g) => g._id === type)?.count ?? 0;
  return {
    pageviews: pv[0]?.pageviews ?? 0,
    visitors: pv[0]?.vids.length ?? 0,
    sessions: pv[0]?.sids.length ?? 0,
    gamesStarted: count("game_start"),
    gamesFinished: count("game_over"),
  };
}

/** Returns null when the database isn't configured. */
export async function getSummary(days: number): Promise<Summary | null> {
  if (!(await connectToDatabase())) return null;

  const now = new Date();
  const since = new Date(now.getTime() - days * DAY);
  const before = new Date(since.getTime() - days * DAY);
  const pv = { ts: { $gte: since }, type: "pageview" };
  const tz = TIME_ZONE;

  const top = (expr: unknown, limit = 8) =>
    AnalyticsEvent.aggregate<{ _id: string | null; count: number }>([
      { $match: pv },
      { $group: { _id: expr, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
  const bucket = (unit: "hour" | "dayOfWeek") =>
    AnalyticsEvent.aggregate<{ _id: number; count: number }>([
      { $match: pv },
      { $group: { _id: { [`$${unit}`]: { date: "$ts", timezone: tz } }, count: { $sum: 1 } } },
    ]);

  const [
    totals,
    previous,
    active,
    visitorAges,
    daily,
    hours,
    weekdays,
    topPages,
    sources,
    devices,
    countries,
    games,
  ] = await Promise.all([
    totalsBetween(since, now),
    totalsBetween(before, since),
    AnalyticsEvent.distinct("sid", { ts: { $gte: new Date(now.getTime() - 5 * 60_000) } }),
    // A visitor is "new" if their first-ever event falls inside the window.
    AnalyticsEvent.aggregate<{ _id: boolean; count: number }>([
      { $group: { _id: "$vid", first: { $min: "$ts" }, last: { $max: "$ts" } } },
      { $match: { last: { $gte: since } } },
      { $group: { _id: { $gte: ["$first", since] }, count: { $sum: 1 } } },
    ]),
    AnalyticsEvent.aggregate<{ _id: string; pageviews: number; vids: string[] }>([
      { $match: pv },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$ts", timezone: tz } },
          pageviews: { $sum: 1 },
          vids: { $addToSet: "$vid" },
        },
      },
    ]),
    bucket("hour"),
    bucket("dayOfWeek"),
    top("$path"),
    top({ $ifNull: ["$source", "$referrer"] }),
    top("$device"),
    top("$country"),
    AnalyticsEvent.aggregate<{ _id: { game: string; type: string }; count: number }>([
      {
        $match: { ts: { $gte: since }, type: { $in: ["game_start", "game_over"] } },
      },
      { $group: { _id: { game: "$game", type: "$type" }, count: { $sum: 1 } } },
    ]),
  ]);

  const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: tz });
  const byDay = new Map(daily.map((d) => [d._id, d]));
  const series: Summary["daily"] = [];
  for (let i = days; i >= 0; i--) {
    const day = dayKey.format(new Date(now.getTime() - i * DAY));
    const d = byDay.get(day);
    series.push({ day, pageviews: d?.pageviews ?? 0, visitors: d?.vids.length ?? 0 });
  }

  const fill = (n: number, from: number, data: { _id: number; count: number }[]) => {
    const out = Array<number>(n).fill(0);
    for (const d of data) out[d._id - from] = d.count;
    return out;
  };

  const perGame = new Map<string, { started: number; finished: number }>();
  for (const g of games) {
    const key = g._id.game ?? "(unknown)";
    const entry = perGame.get(key) ?? { started: 0, finished: 0 };
    if (g._id.type === "game_start") entry.started = g.count;
    else entry.finished = g.count;
    perGame.set(key, entry);
  }
  const gameRows = [...perGame].map(([game, v]) => ({ game, ...v }));
  gameRows.sort((a, b) => b.started - a.started);

  return {
    days,
    timeZone: tz,
    totals,
    previous,
    activeNow: active.length,
    newVisitors: visitorAges.find((v) => v._id === true)?.count ?? 0,
    returningVisitors: visitorAges.find((v) => v._id === false)?.count ?? 0,
    daily: series,
    hours: fill(24, 0, hours),
    weekdays: fill(7, 1, weekdays), // Mongo: 1 = Sunday
    topPages: rows(topPages),
    sources: rows(sources).filter((r) => r.label !== "(none)"),
    devices: rows(devices),
    countries: rows(countries).filter((r) => r.label !== "(none)"),
    games: gameRows,
  };
}
