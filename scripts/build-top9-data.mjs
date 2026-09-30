#!/usr/bin/env node
/**
 * Builds the Top 9 "Classic survey" question pack from ProtoQA.
 *
 *   node scripts/build-top9-data.mjs [path/to/protoqa-data]
 *
 * Source: ProtoQA (https://github.com/iesl/protoqa-data), CC BY 4.0,
 * by Boratko et al. — Family Feud survey questions and answer counts
 * transcribed by fans. Without a local path the files are downloaded.
 *
 * Output: src/data/top9/survey.json (questions) and
 *         src/data/top9/survey-meta.json (per-category counts).
 *
 * Cleaning: drops zero-count answers and boards with < 4 answers, keeps the
 * top 9, fixes Title Case, removes near-duplicates, sorts every question
 * into categories and flags adult ones so they're opt-in.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "src/data/top9");
const BASE = "https://raw.githubusercontent.com/iesl/protoqa-data/master/data";
const FILES = ["train/train.jsonl", "dev/dev.scraped.jsonl"];
const MIN_ANSWERS = 4;
const MAX_ANSWERS = 9;

// ------------------------------------------------------------------ load

async function load(file) {
  const local = process.argv[2] && join(process.argv[2], file);
  if (local && existsSync(local)) return readFileSync(local, "utf8");
  const alt = process.argv[2] && join(process.argv[2], file.split("/").pop());
  if (alt && existsSync(alt)) return readFileSync(alt, "utf8");
  const res = await fetch(`${BASE}/${file}`);
  if (!res.ok) throw new Error(`Download failed: ${file} (${res.status})`);
  return res.text();
}

const rows = (await Promise.all(FILES.map(load)))
  .flatMap((text) => text.split("\n"))
  .filter(Boolean)
  .map((line) => JSON.parse(line));

// ------------------------------------------------------------------ casing

// Words to keep capitalised when converting Title Case to sentence case.
const PROPER = new Set(
  `I Christmas Easter Halloween Thanksgiving Valentine Valentine's Hanukkah
  Kwanzaa Monday Tuesday Wednesday Thursday Friday Saturday Sunday January
  February April June July August September October November December
  America American Americans USA U.S. Canada Mexico England British France
  French Italy Italian Germany German Spain Spanish Japan Japanese China
  Chinese India Indian Ireland Irish Africa African Europe European Hawaii
  Alaska Texas California Florida Hollywood Paris London Disney Disneyland
  Barbie Santa Claus Superman Batman Elvis Presley Kennedy Lincoln
  Washington Obama Bible God Jesus Christ Olympics Olympic TV DVD CD ATM GPS
  SUV CEO FBI CIA IRS PTA DJ McDonald's Walmart Starbucks Google Facebook
  Internet Coca-Cola Pepsi Oreo Oreos Cinderella Romeo Juliet Tarzan Dracula
  Frankenstein Bigfoot Jell-O Twinkie Twinkies Popsicle Kleenex Band-Aid
  Q-tip Frisbee Lego Mickey Minnie Dr. Mr. Mrs. Ms.`
    .split(/\s+/)
    .filter(Boolean),
);
// Multi-word names, restored after lowercasing ("mother's day" → "Mother's Day").
const PROPER_PHRASES = [
  "Mother's Day", "Father's Day", "Valentine's Day", "New Year's Eve",
  "New Year's Day", "New Year's", "New Year", "New York", "Las Vegas",
  "Super Bowl", "Snow White", "Santa Claus", "St. Patrick's Day",
  "Mickey Mouse", "Grand Canyon", "White House", "Statue of Liberty",
  "Fourth of July", "Wheel of Fortune", "Star Wars", "Star Trek",
  "Harry Potter", "Big Mac", "Academy Awards",
];
const PROPER_LOWER = new Map([...PROPER].map((w) => [w.toLowerCase(), w]));

// Learn more proper nouns: words capitalised mid-sentence in at least two
// sentence-case questions, and never seen in lowercase anywhere.
const isTitleCase = (words) => words.filter((w) => /^[A-Z]/.test(w)).length / words.length > 0.3;
{
  const lower = new Set();
  const capital = new Map();
  for (const row of rows) {
    const words = row.question.original.trim().split(/\s+/);
    const title = isTitleCase(words);
    for (const word of words.slice(1)) {
      const clean = word.replace(/[^A-Za-z'.-]/g, "");
      if (!clean) continue;
      if (/^[a-z]/.test(clean)) lower.add(clean.toLowerCase());
      else if (!title && /^[A-Z][a-z]/.test(clean) && clean.length > 2) {
        capital.set(clean, (capital.get(clean) ?? 0) + 1);
      }
    }
  }
  for (const [word, count] of capital) {
    if (count >= 2 && !lower.has(word.toLowerCase()) && !PROPER_LOWER.has(word.toLowerCase())) {
      PROPER_LOWER.set(word.toLowerCase(), word);
    }
  }
}

// On macOS, the system dictionary knows which words are proper nouns
// ("Christ", "Franklin"). Optional: the build works without it.
const DICT_LOWER = new Set();
const DICT_PROPER = new Map();
if (existsSync("/usr/share/dict/web2")) {
  for (const w of readFileSync("/usr/share/dict/web2", "utf8").split("\n")) {
    if (/^[a-z]/.test(w)) DICT_LOWER.add(w);
    else if (/^[A-Z][a-z]/.test(w)) DICT_PROPER.set(w.toLowerCase(), w);
  }
}

/** Fix scraping debris: mojibake, stray spaces, doubled punctuation. */
function tidy(text) {
  return text
    .replace(/Â\u0080¦|â€¦|\u0080|Â/g, "…")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const escapeRe = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function restorePhrases(text) {
  let out = text;
  for (const phrase of PROPER_PHRASES) {
    out = out.replace(new RegExp(`\\b${escapeRe(phrase)}\\b`, "gi"), phrase);
  }
  return out;
}

function sentenceCase(text) {
  let out = tidy(text);
  const words = out.split(" ");
  out = words
    .map((word, i) => {
      const core = word.replace(/^[^A-Za-z]+|[^A-Za-z'.-]+$/g, "");
      if (!core) return word;
      const proper = PROPER_LOWER.get(core.toLowerCase());
      const keepAcronym = /^[A-Z]{2,4}$/.test(core);
      const replacement = proper ?? (i === 0 || keepAcronym ? core : core.toLowerCase());
      return word.replace(core, replacement);
    })
    .join(" ");
  out = restorePhrases(out);
  // "We surveyed 100 single women...what's" → "We surveyed 100 single women: what's"
  out = out.replace(/^((?:we )?(?:surveyed|asked) 100 [^.?!:]+?)\s*(?:\.{2,}|…)\s*/i, "$1: ");
  out = out.charAt(0).toUpperCase() + out.slice(1);
  out = out
    .replace(/\bi\b/g, "I")
    .replace(/\s+([?.!,:])/g, "$1")
    .replace(/[:;,]\.$/, ".")
    .replace(/\.\.$/, ".")
    .replace(/"\.$/, '".');
  if (!/[?.!"]$/.test(out)) {
    out += /^(who|what|where|when|why|how|which|is|are|do|does|would|if you)\b/i.test(out) ? "?" : ".";
  }
  return out;
}

const FAMOUS = /\b(famous|celebrit\w*|singer|band|actor|actress|president|person from history|people from history|author|writer|athlete|player|character|cartoon|superhero|villain|comedian|talk show host|movie|tv show|television show|song|group)\b/i;
const SMALL = new Set(["of", "the", "and", "a", "an", "in", "on", "de", "to", "or", "with", "w"]);

function answerCase(text, question) {
  const famous = FAMOUS.test(question);
  const words = tidy(text).split(" ").map((w, i) => {
    const lower = w.toLowerCase();
    const known = PROPER_LOWER.get(lower);
    if (known) return known;
    if (famous && (i === 0 || !SMALL.has(lower))) return w.charAt(0).toUpperCase() + w.slice(1);
    // Only-proper words in the system dictionary ("christ" → "Christ").
    if (DICT_PROPER.has(lower) && !DICT_LOWER.has(lower)) return DICT_PROPER.get(lower);
    return w;
  });
  const joined = restorePhrases(words.join(" "));
  return joined.charAt(0).toUpperCase() + joined.slice(1);
}

// ------------------------------------------------------------------ categories

/**
 * Checked in order; a question gets up to two categories. "Everyday life" is
 * the fallback. Patterns run on the lowercased question.
 */
const CATEGORIES = [
  {
    id: "words",
    label: "Words & phrases",
    re: /\b(word|words|phrase|phrases|rhymes?|begins with|starts with|ends with|letter|letters|spell\w*|synonym\w*|nickname\w*|expression|saying|slang|abbreviation)\b/,
  },
  {
    id: "food",
    label: "Food & drink",
    re: /\b(food|foods|eat|eats|eating|ate|drink|drinks|drinking|cook|cooking|kitchen|restaurant|meal|breakfast|lunch|dinner|supper|snack|snacks|pizza|sandwich|burger|hot dog|fruit|vegetable|veggie|dessert|candy|chocolate|cake|pie|cookie|cheese|coffee|tea|soda|juice|milk|recipe|grocer\w*|diner|fast food|bake|baking|grill\w*|barbecue|bbq|chef|menu|taste|flavor|flavour|hungry|diet|calorie\w*|spice|sauce|soup|salad|cereal|ice cream|popcorn|potato\w*|egg|eggs|bread|meat|steak|chicken|thanksgiving dinner)\b/,
  },
  {
    id: "love",
    label: "Love & dating",
    re: /\b(date|dates|dating|boyfriend|girlfriend|husband|husbands|wife|wives|spouse|married|marry|marriage|wedding|bride|groom|romantic|romance|kiss|kissing|in love|fall in love|valentine\S*|honeymoon|divorce\w*|flirt\w*|crush|engaged|engagement|proposal|propose|anniversary|single (men|women|man|woman|guy|girl)|bachelor|ex-)\b/,
  },
  {
    id: "family",
    label: "Family & kids",
    re: /\b(mom|moms|mother|mothers|mommy|dad|dads|father|fathers|daddy|parent|parents|kid|kids|child|children|baby|babies|toddler|son|daughter|grandma|grandmother|grandpa|grandfather|grandparent\w*|family|families|sibling\w*|brother|sister|aunt|uncle|teen|teens|teenager\w*|in-law\w*|nanny|babysit\w*|stepmother|newborn)\b/,
  },
  {
    id: "work",
    label: "Work & school",
    re: /\b(school|teacher\w*|student\w*|class|classroom|college|homework|exam|test|graduat\w*|job|jobs|work|works|working|boss|office|employee\w*|co-?worker\w*|career|interview|salary|paycheck|business|meeting|company|fired|hire|hired|retire\w*|profession\w*|occupation|principal|kindergarten|university|coworker)\b/,
  },
  {
    id: "holidays",
    label: "Holidays & parties",
    re: /\b(christmas|halloween|thanksgiving|easter|new year\S*|birthday\w*|party|parties|holiday\w*|santa|gift|gifts|present|presents|celebrat\w*|fourth of july|july 4th|fireworks|costume\w*|reunion|hanukkah|mother's day|father's day|st\.? patrick\S*|trick or treat|decorat\w*)\b/,
  },
  {
    id: "travel",
    label: "Travel & outdoors",
    re: /\b(vacation\w*|travel\w*|trip|trips|beach|camping|camp|hotel|motel|airport|airplane|plane|flight|flights|cruise|ocean|lake|mountain\w*|hike|hiking|picnic|road trip|luggage|suitcase|tourist\w*|island|park|summer|winter|snow|weather|rain|sun|desert|forest|fishing|boat)\b/,
  },
  {
    id: "sports",
    label: "Sports & games",
    re: /\b(sport|sports|team|teams|ball|football|baseball|basketball|soccer|golf|tennis|hockey|olympic\w*|athlete\w*|gym|exercise|workout|fitness|jog|jogging|swim|swimming|coach|stadium|bowling|boxing|boxer|wrestl\w*|race|racing|marathon|referee|super bowl|nfl|nba|board game|card game|video game\w*|casino|gambl\w*)\b/,
  },
  {
    id: "health",
    label: "Health & body",
    re: /\b(doctor\w*|hospital\w*|nurse\w*|dentist\w*|sick|ill|illness|flu|cold|medicine|pill|pills|health\w*|body|hair|bald|teeth|tooth|skin|eye|eyes|nose|face|hand|hands|foot|feet|leg|legs|weight|fat|overweight|wrinkle\w*|pain|hurt|injur\w*|surgery|makeup|shave|shaving|sleep|tired|old age|elderly|older|aging)\b/,
  },
  {
    id: "animals",
    label: "Animals & nature",
    re: /\b(animal\w*|dog|dogs|puppy|cat|cats|kitten|pet|pets|bird\w*|fish|horse\w*|cow\w*|pig\w*|zoo|farm\w*|insect\w*|bug|bugs|snake\w*|bear|bears|lion\w*|tiger\w*|monkey\w*|elephant\w*|flower\w*|tree|trees|plant|plants|garden\w*|nature|wild|jungle)\b/,
  },
  {
    id: "popculture",
    label: "TV, movies & fame",
    re: /\b(tv|television|movie\w*|film\w*|show|shows|actor\w*|actress\w*|celebrit\w*|famous|star|stars|singer\w*|song\w*|music\w*|band|bands|radio|cartoon\w*|superhero\w*|hollywood|president\w*|book|books|magazine\w*|news|fairy tale\w*|disney|soap opera\w*|talk show|reality show|rock|elvis)\b/,
  },
  {
    id: "money",
    label: "Shopping & money",
    re: /\b(buy|buys|bought|shop|shops|shopping|store|stores|mall|money|spend|spends|cost\w*|expensive|cheap|price\w*|sale|bank|credit card|dollar\w*|rich|millionaire\w*|lottery|pay|paid|bill|bills|tip|tips|budget|afford|wallet|purse)\b/,
  },
  {
    id: "home",
    label: "Home & everyday",
    re: /\b(house|houses|home|homes|room|bathroom|bedroom|living room|garage|yard|furniture|closet|drawer|clean\w*|laundry|chore\w*|neighbor\w*|morning|wake|shower|bath|mirror|phone|car|cars|drive|driving|driver\w*|traffic|bed)\b/,
  },
];

// Adult themes: opt-in only. Sexual content, not drinking or smoking, so
// "Name a country that drinks a lot of wine" stays family friendly.
const SPICY_QUESTION =
  /\b(sex|sexy|sexual\w*|make love|making love|naked|nude\w*|nudist\w*|lingerie|bra|bras|panties|thong\w*|stripper\w*|strip club\w*|striptease|condom\w*|orgasm\w*|erotic|horny|kinky|affair\w*|mistress\w*|hooker\w*|prostitut\w*|one night stand\w*|skinny dip\w*|foreplay|seduc\w*|breast\w*|boob\w*|penis|viagra|playboy|porn\w*|topless|spank\w*|virgin\w*|frisky|(?<!sick |breakfast |laid up |stay |stays |staying |stuck )in bed|between the sheets|turned on)\b/;
const SPICY_ANSWER =
  /\b(sex|sexy|make love|making love|naked|nude|orgasm|condom\w*|porn\w*|stripper\w*|hooker\w*|prostitut\w*|viagra|foreplay|kinky|horny|breasts?|boobs?|penis|lingerie|skinny dip\w*|foreplay|intercourse|quickie|booty call)\b/;

const EVERYDAY = { id: "everyday", label: "Anything goes" };
const ADULT = { id: "adult", label: "After dark (18+)" };

function categorise(question, answers) {
  const q = question.toLowerCase();
  const matched = CATEGORIES.filter((c) => c.re.test(q)).map((c) => c.id);
  const categories = matched.length ? matched.slice(0, 2) : [EVERYDAY.id];
  const adult = SPICY_QUESTION.test(q) || answers.some((a) => SPICY_ANSWER.test(a.text.toLowerCase()));
  return { categories, adult };
}

// ------------------------------------------------------------------ build

const STOP = new Set("a an the of to in on at for your you name something someone some that is are be would might most people".split(" "));
function dedupeKey(q) {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .sort()
    .join(" ");
}

const seen = new Set();
const out = [];
let dropped = { few: 0, dupe: 0, junk: 0 };

for (const row of rows) {
  const raw = Object.entries(row.answers.raw ?? {})
    .map(([text, count]) => ({ text, count }))
    .filter((a) => a.count > 0 && a.text.trim().length > 0)
    .sort((a, b) => b.count - a.count);

  if (raw.length < MIN_ANSWERS) {
    dropped.few++;
    continue;
  }

  const prompt = sentenceCase(row.question.original);
  if (prompt.length < 12 || prompt.length > 160 || /…|�/.test(prompt)) {
    dropped.junk++;
    continue;
  }
  const key = dedupeKey(prompt);
  if (seen.has(key)) {
    dropped.dupe++;
    continue;
  }
  seen.add(key);

  const answers = [];
  const answerKeys = new Set();
  for (const a of raw) {
    // "top/bottoms" → shown as "Top/bottoms", matched by either half.
    const parts = a.text.split("/").map((p) => p.trim()).filter(Boolean);
    if (/…|�/.test(tidy(a.text))) continue; // truncated or garbled
    const text = answerCase(a.text.replace(/\s*\/\s*/g, " / "), prompt);
    const k = text.toLowerCase();
    if (answerKeys.has(k)) continue;
    answerKeys.add(k);
    const aliases = parts.length > 1 ? parts : undefined;
    answers.push({ text, points: a.count, ...(aliases ? { aliases } : {}) });
    if (answers.length === MAX_ANSWERS) break;
  }
  if (answers.length < MIN_ANSWERS) {
    dropped.few++;
    continue;
  }

  const { categories, adult } = categorise(prompt, answers);
  out.push({
    id: `s${out.length.toString(36)}`,
    prompt,
    categories,
    ...(adult ? { adult: true } : {}),
    answers,
  });
}

// ------------------------------------------------------------------ write

mkdirSync(OUT_DIR, { recursive: true });

// Compact tuple format keeps the file small:
// [id, prompt, categories, adult (0|1), [[text, points, ...aliases], ...]]
const compact = out.map((q) => [
  q.id,
  q.prompt,
  q.categories,
  q.adult ? 1 : 0,
  q.answers.map((a) => [a.text, a.points, ...(a.aliases ?? [])]),
]);
writeFileSync(join(OUT_DIR, "survey.json"), JSON.stringify(compact));

const counts = {};
for (const q of out) {
  const bucket = q.adult ? [ADULT.id] : q.categories;
  for (const c of bucket) counts[c] = (counts[c] ?? 0) + 1;
}
const meta = {
  source: "ProtoQA (Boratko et al., 2020), CC BY 4.0",
  url: "https://github.com/iesl/protoqa-data",
  total: out.length,
  categories: [...CATEGORIES, EVERYDAY, ADULT].map((c) => ({
    id: c.id,
    label: c.label,
    count: counts[c.id] ?? 0,
  })),
};
writeFileSync(join(OUT_DIR, "survey-meta.json"), JSON.stringify(meta, null, 2) + "\n");

console.log(`Kept ${out.length} of ${rows.length} questions`, dropped);
console.table(meta.categories.map((c) => ({ category: c.label, questions: c.count })));
