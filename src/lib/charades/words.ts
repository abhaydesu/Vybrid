import type { Tone } from "@/lib/games";

/**
 * Charades prompts: things you can act out. Movies, songs and people lead,
 * because that's what a charades night is made of; desi scenes and cricket
 * keep it close to home. Kept mainstream, so most of a room has heard of
 * each one. Easy = one clear idea, medium = needs a little acting,
 * hard = long titles and tricky scenes.
 */

export type Level = "easy" | "medium" | "hard";
export type LevelSetting = Level | "mix";

export interface CharadesCategory {
  id: string;
  label: string;
  tone: Tone;
  words: Record<Level, string[]>;
}

export interface CharadesCard {
  word: string;
  categoryId: string;
  level: Level | "custom";
}

export const CUSTOM_ID = "custom";

export const charadesCategories: CharadesCategory[] = [
  {
    id: "bollywood",
    label: "Bollywood movies",
    tone: "red",
    words: {
      easy: [
        "Sholay", "Dangal", "Dhoom", "Ghajini", "Krrish", "Singham", "Jawan",
        "Pathaan", "Stree", "Don", "Tiger Zinda Hai", "Housefull",
      ],
      medium: [
        "3 Idiots", "Lagaan", "Chennai Express", "Zindagi Na Milegi Dobara",
        "Kuch Kuch Hota Hai", "Bajrangi Bhaijaan", "Munna Bhai MBBS",
        "Dilwale Dulhania Le Jayenge", "Hera Pheri", "Jab We Met",
        "Chak De India", "Queen", "Bhool Bhulaiyaa", "Welcome",
      ],
      hard: [
        "Kabhi Khushi Kabhie Gham", "Andaz Apna Apna", "Rang De Basanti",
        "Yeh Jawaani Hai Deewani", "Gangs of Wasseypur", "Taare Zameen Par",
        "Om Shanti Om", "Hum Aapke Hain Koun", "Dil Chahta Hai",
        "Phir Hera Pheri",
      ],
    },
  },
  {
    id: "hollywood",
    label: "Hollywood movies",
    tone: "blue",
    words: {
      easy: [
        "Titanic", "Frozen", "Shrek", "Avatar", "Jaws", "Batman", "Spider-Man",
        "Finding Nemo", "Toy Story", "The Lion King", "Jurassic Park",
        "Harry Potter",
      ],
      medium: [
        "Home Alone", "Kung Fu Panda", "Iron Man", "Pirates of the Caribbean",
        "Forrest Gump", "The Matrix", "Mission Impossible", "Fast and Furious",
        "Aladdin", "Ratatouille", "Up", "Cars",
      ],
      hard: [
        "Inception", "Interstellar", "Ghostbusters", "Back to the Future",
        "Gladiator", "The Godfather", "Oppenheimer", "Barbie",
        "Mrs. Doubtfire", "Rocky",
      ],
    },
  },
  {
    id: "south",
    label: "South Indian hits",
    tone: "orange",
    words: {
      easy: ["Baahubali", "RRR", "Pushpa", "KGF", "Jailer", "Kantara"],
      medium: [
        "Enthiran", "Magadheera", "Eega", "Vikram", "Leo", "Salaar", "Kabali",
      ],
      hard: [
        "Arjun Reddy", "Ponniyin Selvan", "Anniyan",
        "Ala Vaikunthapurramuloo", "Drishyam", "Lucifer",
      ],
    },
  },
  {
    id: "filmy",
    label: "Filmy characters & dialogues",
    tone: "pink",
    words: {
      easy: [
        "Gabbar Singh", "Mogambo", "Chulbul Pandey", "Circuit", "Poo",
        "Chatur", "Manjulika", "Baburao", "Basanti", "Munna Bhai", "Rancho",
      ],
      medium: [
        "Kitne aadmi the", "Mogambo khush hua", "Picture abhi baaki hai",
        "Tension lene ka nahi", "All is well", "Pushpa, I hate tears",
        "Bade bade deshon mein", "How's the josh", "Utha le re baba",
        "Thappad se darr nahi lagta",
      ],
      hard: [
        "Crime Master Gogo", "Babu Bhaiya", "Raju, Shyam and Baburao",
        "Mere paas maa hai", "Jaa Simran jaa", "Rahul, naam toh suna hoga",
        "Aao kabhi haveli pe",
      ],
    },
  },
  {
    id: "songs",
    label: "Songs",
    tone: "purple",
    words: {
      easy: [
        "Kala Chashma", "Naatu Naatu", "Jai Ho", "Desi Girl", "Lungi Dance",
        "Baby Shark", "Happy Birthday", "Jingle Bells", "Chaiyya Chaiyya",
      ],
      medium: [
        "Tum Hi Ho", "Kajra Re", "Badtameez Dil", "Senorita", "Shape of You",
        "Despacito", "Gangnam Style", "Munni Badnaam Hui", "Sheila Ki Jawani",
      ],
      hard: [
        "Tujhe Dekha To", "Pehla Nasha", "Lambi Judaai", "Channa Mereya",
        "Bohemian Rhapsody", "Waka Waka", "Dil Se Re",
      ],
    },
  },
  {
    id: "tv",
    label: "TV & web series",
    tone: "yellow",
    words: {
      easy: [
        "Taarak Mehta Ka Ooltah Chashmah", "Bigg Boss", "Shaktimaan", "Naagin",
        "Doraemon", "Chhota Bheem", "Tom and Jerry", "Mr. Bean", "Motu Patlu",
        "Friends",
      ],
      medium: [
        "Kaun Banega Crorepati", "Money Heist", "Squid Game", "Panchayat",
        "Mirzapur", "Shark Tank", "Stranger Things", "The Kapil Sharma Show",
        "Game of Thrones", "Breaking Bad", "CID",
      ],
      hard: [
        "Scam 1992", "Sacred Games", "The Family Man", "Kota Factory",
        "The Office", "Sarabhai vs Sarabhai", "Malgudi Days", "Paatal Lok",
      ],
    },
  },
  {
    id: "people",
    label: "Famous faces",
    tone: "orange",
    words: {
      easy: [
        "Shah Rukh Khan", "Salman Khan", "Amitabh Bachchan", "Virat Kohli",
        "MS Dhoni", "Sachin Tendulkar", "Rajinikanth", "Akshay Kumar",
        "Deepika Padukone", "Priyanka Chopra", "Alia Bhatt", "Kapil Sharma",
      ],
      medium: [
        "Aamir Khan", "Ranveer Singh", "Hardik Pandya", "Jasprit Bumrah",
        "Rohit Sharma", "Arijit Singh", "Neeraj Chopra", "PV Sindhu",
        "Katrina Kaif", "Michael Jackson", "Cristiano Ronaldo", "Taylor Swift",
      ],
      hard: [
        "Kapil Dev", "Sourav Ganguly", "Madhuri Dixit", "Rekha", "Govinda",
        "Shakti Kapoor", "Johnny Lever", "Nawazuddin Siddiqui",
        "Pankaj Tripathi", "Mary Kom",
      ],
    },
  },
  {
    id: "actions",
    label: "Everyday actions",
    tone: "green",
    words: {
      easy: [
        "Brushing teeth", "Eating golgappe", "Riding a bike", "Playing cricket",
        "Making roti", "Swimming", "Dancing", "Driving a car", "Sleeping",
        "Crying", "Laughing", "Taking a selfie",
      ],
      medium: [
        "Flying a kite", "Washing clothes", "Milking a cow", "Climbing a mountain",
        "Boarding a crowded train", "Bargaining in a market",
        "Texting while walking", "Ironing a shirt", "Doing yoga", "Making chai",
      ],
      hard: [
        "Stuck in traffic", "Pretending to be asleep", "Hiding from guests",
        "Searching for the TV remote", "Peeling a mango", "Dodging a rishta aunty",
      ],
    },
  },
  {
    id: "desi",
    label: "Desi moments",
    tone: "red",
    words: {
      easy: [
        "Rickshaw ride", "Cricket on the street", "Playing carrom",
        "Pressure cooker whistle", "Aunty gossiping", "Chai on the balcony",
        "Dancing at a baraat", "Monsoon pakoras", "Diwali crackers",
      ],
      medium: [
        "Mom with a chappal", "Dadi telling stories", "Load shedding",
        "Family photo at a wedding", "Rishta aunty", "Bargaining with an autowala",
        "Packing for a train journey", "Washing the car on Sunday",
        "Mehendi night",
      ],
      hard: [
        "Relatives asking about marks", "Hiding from the doodhwala",
        "Fighting for the last samosa", "Group photo with 30 relatives",
        "Phone dying during a call",
      ],
    },
  },
  {
    id: "animals",
    label: "Animals",
    tone: "green",
    words: {
      easy: [
        "Lion", "Elephant", "Monkey", "Snake", "Peacock", "Cow", "Crocodile",
        "Penguin", "Kangaroo", "Frog", "Dog", "Cat",
      ],
      medium: [
        "Giraffe", "Camel", "Bat", "Tiger", "Gorilla", "Octopus", "Flamingo",
        "Rooster", "Snail",
      ],
      hard: [
        "Sloth", "Chameleon", "Hermit crab", "Cobra rising", "Dolphin show",
        "A cat chasing a laser",
      ],
    },
  },
  {
    id: "cricket",
    label: "Cricket",
    tone: "blue",
    words: {
      easy: [
        "Six", "Out", "Bowling", "Batting", "Wicketkeeper", "Umpire", "Catch",
        "Boundary",
      ],
      medium: [
        "Helicopter shot", "Yorker", "Hat-trick", "Run out", "LBW",
        "Third umpire", "Duck", "Googly", "Appeal",
      ],
      hard: [
        "Super over", "Sledging", "Free hit", "Doosra", "Dropped catch",
        "Rain delay",
      ],
    },
  },
];

export const normalize = (word: string) => word.trim().toLowerCase();

export function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface PoolOptions {
  categories: string[];
  difficulty: LevelSetting;
  customWords: string[];
}

/** Every card matching the settings, de-duplicated across categories. */
export function buildPool({ categories, difficulty, customWords }: PoolOptions) {
  const seen = new Set<string>();
  const pool: CharadesCard[] = [];
  const add = (card: CharadesCard) => {
    const key = normalize(card.word);
    if (seen.has(key)) return;
    seen.add(key);
    pool.push(card);
  };

  const levels: Level[] = difficulty === "mix" ? ["easy", "medium", "hard"] : [difficulty];
  for (const category of charadesCategories) {
    if (!categories.includes(category.id)) continue;
    for (const level of levels) {
      for (const word of category.words[level]) {
        add({ word, categoryId: category.id, level });
      }
    }
  }
  if (categories.includes(CUSTOM_ID)) {
    for (const word of customWords) {
      add({ word, categoryId: CUSTOM_ID, level: "custom" });
    }
  }
  return pool;
}

export function categoryMeta(id: string) {
  if (id === CUSTOM_ID) return { label: "Your words", tone: "white" as Tone };
  if (id === "written") return { label: "Written in", tone: "white" as Tone };
  const category = charadesCategories.find((c) => c.id === id);
  return { label: category?.label ?? id, tone: (category?.tone ?? "white") as Tone };
}
