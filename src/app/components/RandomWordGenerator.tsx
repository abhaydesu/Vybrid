"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Difficulty = "easy" | "medium" | "hard";
type WordBuckets = Record<Difficulty, string[]>;

const WORDS_BY_DIFFICULTY: Record<string, WordBuckets> = {
  sports: {
    easy: [
      "football",
      "cricket",
      "bat",
      "ball",
      "goal",
      "run",
      "umpire",
      "coach",
      "stadium",
      "medal",
      "tennis",
      "helmet",
      "swim",
      "race",
      "referee",
      "kick",
      "pitch",
      "score",
      "team",
      "whistle",
      "jersey",
      "net",
      "hoop",
      "golf",
      "hockey",
      "kabaddi",
      "boxing",
      "cycling",
      "skiing",
      "trophy",
    ],
    medium: [
      "offside",
      "penalty",
      "wicket",
      "marathon",
      "gymnastics",
      "badminton",
      "relay race",
      "boxing ring",
      "scoreboard",
      "tournament",
      "archery",
      "surfing",
      "skateboarding",
      "powerplay",
      "free kick",
      "goalkeeper",
      "half time",
      "knockout",
      "inning",
      "spin bowling",
      "slam dunk",
      "triple jump",
      "foul",
      "substitution",
      "warm up",
      "time out",
      "home run",
      "long jump",
      "sprinter",
      "defense",
    ],
    hard: [
      "decathlon",
      "triathlon",
      "freestyle wrestling",
      "quarterback sneak",
      "hat-trick",
      "grand slam",
      "VAR review",
      "Ashes series",
      "photo finish",
      "fencing bout",
      "shot put technique",
      "Heisman Trophy",
      "Olympic qualifier",
      "butterfly stroke",
      "fielding position",
      "red card appeal",
      "draft combine",
      "playoff bracket",
      "world record attempt",
      "penalty shootout",
      "sudden death",
      "sportsmanship",
      "handball violation",
      "technical foul",
      "corner flag",
      "officiating crew",
      "round robin",
      "athletic scholarship",
      "press conference",
      "salary cap",
    ],
  },

  bollywood: {
    easy: [
      "Shah Rukh Khan",
      "Salman Khan",
      "Aamir Khan",
      "Ranbir Kapoor",
      "Deepika Padukone",
      "Alia Bhatt",
      "Hrithik Roshan",
      "Amitabh Bachchan",
      "Katrina Kaif",
      "Priyanka Chopra",
      "Varun Dhawan",
      "Anushka Sharma",
      "Ranveer Singh",
      "Kareena Kapoor",
      "Ajay Devgn",
      "3 Idiots",
      "Dangal",
      "Chennai Express",
      "PK",
      "War",
      "Pathaan",
      "Tiger",
      "Baahubali",
      "Sultan",
      "Ra.One",
      "Krrish",
      "Dilwale",
      "Barfi",
      "Student of the Year",
      "Kick",
    ],
    medium: [
      "Dilwale Dulhania Le Jayenge",
      "Kabhi Khushi Kabhie Gham",
      "Zindagi Na Milegi Dobara",
      "Bajirao Mastani",
      "Padmaavat",
      "Rockstar",
      "Tamasha",
      "Swades",
      "Lagaan",
      "Rang De Basanti",
      "Andhadhun",
      "Bhool Bhulaiyaa",
      "Don",
      "Chak De India",
      "My Name Is Khan",
      "Kal Ho Naa Ho",
      "Gully Boy",
      "Yeh Jawaani Hai Deewani",
      "Jab We Met",
      "Queen",
      "Drishyam",
      "Uri",
      "Barfi",
      "Special 26",
      "Haider",
      "Raazi",
      "Article 15",
      "Kahaani",
      "Lootera",
      "Pink",
    ],
    hard: [
      "Mughal-e-Azam",
      "Gangs of Wasseypur",
      "Sholay",
      "Guide",
      "Pyaasa",
      "Andaz Apna Apna",
      "Tumbbad",
      "Black Friday",
      "Udaan",
      "Masaan",
      "Devdas",
      "Mother India",
      "Satya",
      "Company",
      "Omkara",
      "Kaagaz Ke Phool",
      "Dil Se",
      "Talvar",
      "October",
      "Rocket Singh",
      "Sardar Udham",
      "Lagaan tax scene",
      "Basanti dance",
      "Gabbar Singh",
      "Raj Mandir cinema",
      "Item number",
      "Interval block",
      "Masala film",
      "Parallel cinema",
      "Box office clash",
    ],
  },

  hollywood: {
    easy: [
      "Titanic",
      "Avengers",
      "Batman",
      "Spider-Man",
      "Frozen",
      "Iron Man",
      "Harry Potter",
      "Superman",
      "Joker",
      "Lion King",
      "Hulk",
      "Captain America",
      "Thor",
      "Minions",
      "Cars",
      "Finding Nemo",
      "Deadpool",
      "Black Panther",
      "Wonder Woman",
      "Shrek",
      "Toy Story",
      "The Flash",
      "Aquaman",
      "Barbie",
      "Mission Impossible",
      "Gladiator",
      "The Matrix",
      "Avatar",
      "Rocky",
      "Jaws",
    ],
    medium: [
      "Inception",
      "Interstellar",
      "Jurassic Park",
      "Pirates of the Caribbean",
      "The Dark Knight",
      "Forrest Gump",
      "The Godfather",
      "Mad Max",
      "The Revenant",
      "The Wolf of Wall Street",
      "Fight Club",
      "The Social Network",
      "Gravity",
      "The Hunger Games",
      "The Notebook",
      "A Quiet Place",
      "The Prestige",
      "Django Unchained",
      "The Truman Show",
      "The Martian",
      "Up",
      "Inside Out",
      "Coco",
      "Oppenheimer",
      "Top Gun Maverick",
      "Black Swan",
      "La La Land",
      "Whiplash",
      "The Conjuring",
      "Doctor Strange",
    ],
    hard: [
      "Schindler's List",
      "No Country for Old Men",
      "A Clockwork Orange",
      "The Shawshank Redemption",
      "There Will Be Blood",
      "Blade Runner 2049",
      "The Grand Budapest Hotel",
      "Birdman",
      "Eternal Sunshine of the Spotless Mind",
      "The Departed",
      "Parasite",
      "Requiem for a Dream",
      "The Green Mile",
      "American Psycho",
      "The Pianist",
      "Se7en",
      "The Usual Suspects",
      "Her",
      "The Lighthouse",
      "Donnie Darko",
      "The Irishman",
      "Taxi Driver",
      "2001 A Space Odyssey",
      "Citizen Kane",
      "The Hateful Eight",
      "Pan's Labyrinth",
      "Moonlight",
      "Memento",
      "The Sixth Sense",
      "Glory",
    ],
  },

  music: {
    easy: [
      "guitar",
      "piano",
      "drum",
      "microphone",
      "singer",
      "concert",
      "DJ",
      "song",
      "album",
      "band",
      "rap",
      "pop",
      "rock",
      "dance",
      "stage",
      "lyrics",
      "beat",
      "chorus",
      "speaker",
      "radio",
      "headphones",
      "playlist",
      "violin",
      "flute",
      "tabla",
      "dhol",
      "harmonium",
      "keyboard",
      "amp",
      "whistle",
    ],
    medium: [
      "orchestra",
      "saxophone",
      "composer",
      "rapper",
      "music video",
      "producer",
      "studio",
      "remix",
      "acoustic",
      "bass guitar",
      "hip hop",
      "metal band",
      "EDM",
      "record label",
      "live show",
      "soundcheck",
      "backstage",
      "cover song",
      "duet",
      "karaoke",
      "violin solo",
      "symphony",
      "metronome",
      "playlist shuffle",
      "vinyl record",
      "platinum record",
      "Grammy Awards",
      "Billboard charts",
      "auto-tune",
      "improvisation",
    ],
    hard: [
      "crescendo",
      "falsetto",
      "counterpoint",
      "octave shift",
      "bridge section",
      "tempo change",
      "orchestration",
      "beat drop",
      "sampling",
      "sound engineering",
      "music production",
      "lyrical metaphor",
      "concept album",
      "world tour",
      "encore performance",
      "chart topper",
      "soundtrack score",
      "classical recital",
      "jazz improvisation",
      "baritone",
      "soprano",
      "treble clef",
      "bass clef",
      "syncopation",
      "modulation",
      "recording contract",
      "royalty payment",
      "studio session",
      "headline act",
      "music festival",
    ],
  },
};

interface Props {
  words?: string[]; // optional base words (not used by default)
}

export default function RandomWordGenerator({ words }: Props) {
  const [current, setCurrent] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [category, setCategory] = useState<string>("random");
  const [custom, setCustom] = useState<string>("");
  const [customWords, setCustomWords] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("vybrid_custom_words");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("vybrid_custom_words", JSON.stringify(customWords));
    } catch {}
  }, [customWords]);

  const categories = Object.keys(WORDS_BY_DIFFICULTY);

  function getCategoryPool(
    selectedCategory: string,
    selectedDifficulty: Difficulty,
  ) {
    if (selectedCategory === "random") {
      return categories.flatMap(
        (cat) => WORDS_BY_DIFFICULTY[cat]?.[selectedDifficulty] ?? [],
      );
    }

    return WORDS_BY_DIFFICULTY[selectedCategory]?.[selectedDifficulty] ?? [];
  }

  function roll() {
    const pool = [
      ...(words ?? []),
      ...getCategoryPool(category, difficulty),
      ...customWords,
    ];
    if (!pool.length) {
      setCurrent(null);
      return;
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(pick);
    setHistory((h) => [pick, ...h].filter(Boolean).slice(0, 10));
  }

  function addCustom() {
    const trimmed = custom.trim();
    if (!trimmed) return;
    setCustomWords((w) =>
      [trimmed, ...w.filter((x) => x !== trimmed)].slice(0, 50),
    );
    setCustom("");
  }

  function clearCustom() {
    setCustomWords([]);
  }

  const availableCount =
    (words ?? []).length +
    getCategoryPool(category, difficulty).length +
    customWords.length;

  return (
    <div className="w-full rounded-2xl border border-blue-100 bg-white p-4 shadow-neon">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-ink">
            Random Word Generator
          </h3>
          <p className="mt-1 text-sm text-ink/60">
            Generate prompts for drawing or acting.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={roll}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            New Word
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <motion.div
          key={current ?? "empty"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[56px] flex items-center justify-center rounded-xl border border-blue-50 bg-blue-50/60 p-4 text-center"
        >
          <span className="text-lg font-bold text-blue-700">
            {current ?? "—"}
          </span>
        </motion.div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-ink/60">
              Category
            </label>
            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => setCategory("random")}
                className={`rounded-md px-3 py-1 text-xs font-semibold ${
                  category === "random"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                random
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    category === c
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-ink/60">
              Difficulty
            </label>
            <div className="ml-auto flex items-center gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    difficulty === d
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Add custom word"
              className="w-full rounded-md border border-blue-100 px-3 py-2 text-sm"
            />
            <button
              onClick={addCustom}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-ink/60">
              Available: {availableCount}
            </div>
            <button
              onClick={clearCustom}
              className="ml-auto text-xs text-ink/60 underline"
            >
              Clear custom
            </button>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="text-xs font-semibold text-ink/60">Recent</div>
          <div className="flex flex-wrap gap-2">
            {history.map((w, i) => (
              <span
                key={w + i}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
