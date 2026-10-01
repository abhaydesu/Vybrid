import type { CharacterKind, Tone } from "./games";

export interface OfflineGame {
  slug: string;
  title: string;
  description: string;
  details: string;
  tone: Tone;
  character: CharacterKind;
  players: string;
  duration: string;
  props: string[];
  steps: string[];
  extraComponents: string[];
}

export const offlineGames: OfflineGame[] = [
  {
    slug: "mafia-werewolf",
    title: "Mafia / Werewolf",
    description:
      "Social deduction with secret roles, day debates, and night actions.",
    details: "Great for larger groups. One moderator keeps the game moving.",
    tone: "purple",
    character: "detective",
    players: "6–15",
    duration: "20–40 min",
    props: ["Roles on paper", "Timer"],
    steps: [
      "Setup: choose one moderator (doesn't play). Prepare role slips: 1-2 Mafia, 1 Doctor, 1 Seer (optional), rest Villagers.",
      "Deal: distribute one role slip face down to each player; players privately read their role.",
      "Night phase: the moderator asks everyone to close their eyes. The moderator then calls the Mafia to open their eyes and silently choose a target.",
      "Doctor/Healer (if used): after the Mafia chooses, the moderator asks the Doctor to open their eyes and point at a player to protect (may self-protect depending on house rules).",
      "Seer (if used): the moderator asks the Seer to open their eyes and point at one player; the moderator silently indicates whether that player is Mafia.",
      "Day phase: all players open their eyes. The moderator announces whether a player was eliminated that night (unless saved by Doctor). Eliminated players are out and remain silent.",
      "Discussion: surviving players discuss who they suspect is Mafia. Accusations, defense, and persuasion are encouraged but no role-revealing.",
      "Vote: the group votes to lynch one player. The player with majority votes is eliminated and reveals their role.",
      "Win conditions: villagers win when all Mafia are eliminated; Mafia win when they equal or outnumber villagers.",
      "Tips: keep rounds short (2–5 minutes); the moderator controls pacing and enforces silence during night.",
    ],
    extraComponents: ["Role randomizer", "Night phase timer"],
  },
  {
    slug: "charades",
    title: "Charades",
    description: "Act out prompts without speaking while your team guesses.",
    details: "Best played in teams with quick rounds and score tracking.",
    tone: "orange",
    character: "actor",
    players: "4+",
    duration: "15–30 min",
    props: ["Slips of paper", "Bowl", "Timer"],
    steps: [
      "Setup: prepare a stack of prompts (movies, actions, objects) on slips and place them in a bowl or hat.",
      "Teams: split into two or more teams. Decide an order of actors.",
      "Round: the actor draws a slip, has a fixed time (e.g., 60–90s) to act the prompt without speaking, mouthing words, or pointing to objects.",
      "Allowed: gestures, pantomime, charades conventions (e.g., indicating syllables by tapping arm) — establish allowed signals beforehand.",
      "Guessing: the actor's team shouts guesses; if correct within time, they score a point. Then next team/player takes a turn.",
      "Scoring: play to a target score or fixed number of rounds; use a timer and rotate actors evenly.",
    ],
    extraComponents: ["Prompt generator", "Round timer"],
  },
  {
    slug: "pictionary",
    title: "Pictionary",
    description: "Draw the prompt while your team races to guess it.",
    details: "Use a whiteboard or shared pad; rotate artists each round.",
    tone: "blue",
    character: "artist",
    players: "4+",
    duration: "20–40 min",
    props: ["Paper or whiteboard", "Markers", "Timer"],
    steps: [
      "Setup: split into 2–4 teams and grab paper or a whiteboard. Tap Play now to set up teams; the phone handles words, timing and score.",
      "Pick a word: the other team secretly picks a word for the drawer, from three suggestions or by writing their own. Skipped suggestions aren't used up.",
      "Pass the phone: the pickers hand the phone to the drawer, who sees the word and starts the clock.",
      "Draw: start the clock. No letters, numbers, gestures or talking. Just drawing. Hold the peek button if you forget the word.",
      "Guess: teammates shout guesses. Tap “They got it!” for a point, or let time run out.",
      "Steals: with 3+ teams, if the drawing team misses, a team that didn't pick the word can shout it and take the point.",
      "Win: after every team has drawn the chosen number of turns, the team with the most points wins.",
    ],
    extraComponents: ["Word picker", "Round timer", "Scoreboard"],
  },
  {
    slug: "imposter",
    title: "Imposter",
    description:
      "Everyone gets the secret word except one. Give clues, then find the faker.",
    details:
      "One phone, passed around the circle. Loaded with desi words: biryani, Sharma ji ka beta, DDLJ and plenty more.",
    tone: "green",
    character: "fibber",
    players: "3–15",
    duration: "10–30 min",
    props: ["None"],
    steps: [
      "Setup: add everyone in seating order, pick categories and how many imposters. Tap Play now to start.",
      "Deal: pass the phone round. Each player taps to see their card, then hides it and passes on. Everyone sees the same secret word, except the imposter, whose card just says Imposter (with a hint, if you turned hints on).",
      "Clues: starting with the player the phone picks, go round the circle. Each person says one word about the secret word. Too obvious and the imposter learns it; too vague and you look suspicious.",
      "Vote: count down from three and everyone points at who they think the imposter is. Tap the player with the most votes.",
      "Caught: if it was the imposter, they get one last chance to guess the word and steal the round. With more than one imposter, keep voting until they're all found.",
      "Got away: vote out an innocent player (or give up) and the imposters win the round.",
      "Scoring: the crew get 1 point each for catching the imposter. An imposter who gets away scores 2, or 1 for stealing with the right guess.",
      "Variants: in Undercover mode the imposter gets a similar word and doesn't know they're the imposter. Troll rounds sometimes make everyone the imposter.",
    ],
    extraComponents: ["Card dealer", "Clue timer", "Scoreboard"],
  },
  {
    slug: "two-truths-one-lie",
    title: "Two Truths & a Lie",
    description: "Share three statements and let the group spot the lie.",
    details: "Perfect icebreaker; keep statements short for faster rounds.",
    tone: "pink",
    character: "fibber",
    players: "3+",
    duration: "10–20 min",
    props: ["None"],
    steps: [
      "Turn order: pick a player to start; proceed clockwise.",
      "Statement set: on their turn, the player says three short statements about themselves — two true and one false.",
      "Discussion & Vote: the group may ask brief clarifying questions (optional) and then votes on which statement they think is the lie.",
      "Scoring: players who correctly identify the lie score a point; alternatively award points to the speaker for successfully fooling the group.",
      "Variants: make themed rounds (work, travel, childhood) to spark ideas.",
    ],
    extraComponents: [],
  },
  {
    slug: "hot-seat",
    title: "Hot Seat",
    description: "Teammates describe a prompt while one player guesses.",
    details: "Keep a rolling score and rotate the guesser each round.",
    tone: "red",
    character: "hotseat",
    players: "4+",
    duration: "15–30 min",
    props: ["List of prompts", "Timer"],
    steps: [
      "Setup: create a stack of prompts. One player sits in the 'hot seat' facing away from the screen or with eyes closed.",
      "Round: teammates have a fixed time (e.g., 60s) to describe or hint the prompt without saying the target word or directly spelling it out.",
      "Guessing: the hot-seat player shouts guesses while teammates continue giving hints. If guessed correctly within time, the team scores a point.",
      "Rotate: move the hot-seat to the next player and repeat until everyone has had a turn.",
    ],
    extraComponents: ["Prompt shuffler", "Score tracker"],
  },
  {
    slug: "categories-quickfire",
    title: "Categories (Quickfire)",
    description:
      "Write as many category items as possible before time runs out.",
    details: "Fast-paced and competitive; great for 3+ players.",
    tone: "green",
    character: "writer",
    players: "3+",
    duration: "10–20 min",
    props: ["Notebook", "Pens", "Timer"],
    steps: [
      "Setup: choose a category and give each player a sheet or notebook.",
      "Round: start a 60-second timer. Players simultaneously write as many valid items in the category as possible (no repeats).",
      "Scoring: after time, players read their lists. Duplicate answers between players are canceled out; unique answers score 1 point each.",
      "Variations: set different timers, award bonus points for particularly creative answers, or play in teams.",
    ],
    extraComponents: ["Category spinner", "Round timer"],
  },
];
