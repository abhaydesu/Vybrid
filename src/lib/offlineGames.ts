export interface OfflineGame {
  slug: string;
  title: string;
  description: string;
  details: string;
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
    props: ["Paper or whiteboard", "Markers", "Timer"],
    steps: [
      "Setup: prepare prompts or use a random word list. Provide a drawing surface: whiteboard, paper pad, or tablet.",
      "Teams: split into teams and decide drawing order.",
      "Round: the drawer receives a prompt and has a fixed time (e.g., 60s) to draw it. No letters, numbers, or verbal hints allowed.",
      "Guessing: teammates shout guesses; if they guess the prompt before time runs out, the team scores a point.",
      "Scoring & Variants: allow passes (with penalty), or play in a chained mode where correct guesses allow continued drawing. Rotate drawers each round.",
    ],
    extraComponents: ["Random word generator", "Sketch timer"],
  },
  {
    slug: "two-truths-one-lie",
    title: "Two Truths & a Lie",
    description: "Share three statements and let the group spot the lie.",
    details: "Perfect icebreaker; keep statements short for faster rounds.",
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
