import type { Tone } from "../games";

export type WordDifficulty = "easy" | "medium" | "hard";

export interface WordCategory {
  id: string;
  label: string;
  tone: Tone;
  words: Record<WordDifficulty, string[]>;
}

/**
 * Hand-picked, drawable prompts. Easy = one clear object, medium = needs a
 * little detail, hard = scenes, compound ideas or famous things.
 */
export const pictionaryCategories: WordCategory[] = [
  {
    id: "animals",
    label: "Animals",
    tone: "green",
    words: {
      easy: [
        "cat", "dog", "fish", "bird", "cow", "pig", "duck", "lion", "snake",
        "frog", "horse", "rabbit", "mouse", "elephant", "giraffe", "monkey",
        "bee", "spider", "turtle", "owl", "bear", "tiger", "shark", "crab",
        "snail", "butterfly", "chicken", "sheep", "whale", "zebra",
      ],
      medium: [
        "kangaroo", "penguin", "octopus", "peacock", "camel", "crocodile",
        "flamingo", "hedgehog", "jellyfish", "dolphin", "squirrel", "bat",
        "parrot", "koala", "panda", "deer", "goat", "ant", "lobster",
        "seahorse", "ostrich", "rhino", "hippo", "starfish", "scorpion",
      ],
      hard: [
        "chameleon", "platypus", "sloth", "armadillo", "porcupine", "stingray",
        "woodpecker", "caterpillar", "tadpole", "walrus", "anteater",
        "pufferfish", "hummingbird", "mosquito", "beaver", "llama", "mole",
        "vulture", "narwhal", "cobra",
      ],
    },
  },
  {
    id: "food",
    label: "Food",
    tone: "orange",
    words: {
      easy: [
        "apple", "banana", "pizza", "cake", "ice cream", "egg", "bread",
        "cheese", "carrot", "grapes", "burger", "cookie", "milk", "orange",
        "watermelon", "candy", "donut", "corn", "cherry", "lemon",
        "strawberry", "popcorn", "sandwich", "tomato", "pineapple", "coconut",
        "mango", "chocolate", "lollipop", "noodles",
      ],
      medium: [
        "spaghetti", "hot dog", "taco", "pancake", "sushi", "french fries",
        "cupcake", "broccoli", "mushroom", "pretzel", "avocado", "cucumber",
        "peanut", "pumpkin", "onion", "chilli", "cereal", "honey", "muffin",
        "pie", "popsicle", "coffee", "soup", "salad", "kebab",
      ],
      hard: [
        "birthday cake", "fried egg", "fruit salad", "milkshake",
        "fortune cookie", "corn on the cob", "bubble tea", "lasagna",
        "croissant", "dumpling", "burrito", "gingerbread man", "cotton candy",
        "candy cane", "ice cube", "picnic", "barbecue", "smoothie",
        "layer cake", "boiled egg",
      ],
    },
  },
  {
    id: "home",
    label: "Around the house",
    tone: "blue",
    words: {
      easy: [
        "chair", "table", "bed", "door", "window", "lamp", "clock", "phone",
        "book", "key", "cup", "spoon", "fork", "TV", "ball", "shoe", "hat",
        "umbrella", "glasses", "toothbrush", "pillow", "sock", "bag",
        "pencil", "scissors", "bucket", "candle", "mirror", "balloon", "box",
      ],
      medium: [
        "laptop", "camera", "headphones", "backpack", "ladder", "hammer",
        "broom", "remote", "fan", "kettle", "toaster", "bathtub", "sofa",
        "fridge", "wallet", "keyboard", "bicycle", "guitar", "calculator",
        "suitcase", "doorbell", "hanger", "stapler", "charger", "teapot",
      ],
      hard: [
        "vacuum cleaner", "washing machine", "alarm clock", "light bulb",
        "hair dryer", "microwave", "extension cord", "paper clip",
        "rocking chair", "wristwatch", "tape measure", "safety pin",
        "magnifying glass", "piggy bank", "bookshelf", "chandelier", "zipper",
        "screwdriver", "mousetrap", "hourglass",
      ],
    },
  },
  {
    id: "places",
    label: "Places",
    tone: "purple",
    words: {
      easy: [
        "house", "school", "park", "beach", "farm", "zoo", "castle", "bridge",
        "hospital", "shop", "island", "road", "garden", "swimming pool",
        "church", "tent", "forest", "mountain", "city", "kitchen",
      ],
      medium: [
        "airport", "library", "stadium", "lighthouse", "museum", "restaurant",
        "prison", "playground", "cinema", "bakery", "igloo", "pyramid",
        "volcano", "desert", "circus", "temple", "train station",
        "supermarket", "office", "jungle",
      ],
      hard: [
        "Eiffel Tower", "Taj Mahal", "space station", "amusement park",
        "haunted house", "parking lot", "waterfall", "construction site",
        "petrol pump", "treehouse", "submarine", "Great Wall of China",
        "Statue of Liberty", "bus stop", "zebra crossing", "graveyard",
        "skyscraper", "windmill", "aquarium", "dentist's clinic",
      ],
    },
  },
  {
    id: "actions",
    label: "Actions",
    tone: "red",
    words: {
      easy: [
        "run", "jump", "swim", "sleep", "eat", "dance", "cry", "laugh",
        "read", "sing", "fly", "cook", "climb", "kick", "throw", "wave",
        "drink", "walk", "clap", "smile",
      ],
      medium: [
        "skipping", "juggling", "painting", "sneezing", "yawning", "fishing",
        "knitting", "surfing", "skateboarding", "bowling", "diving",
        "brushing teeth", "hugging", "shopping", "sweeping", "snoring",
        "typing", "whistling", "boxing", "skiing",
      ],
      hard: [
        "sleepwalking", "daydreaming", "moonwalking", "bungee jumping",
        "taking a selfie", "blowing bubbles", "changing a tyre",
        "building a snowman", "walking the dog", "hide and seek",
        "doing homework", "stargazing", "window shopping", "sunbathing",
        "ironing clothes", "tightrope walking", "meditating",
        "slipping on a banana", "parallel parking", "flying a kite",
      ],
    },
  },
  {
    id: "nature",
    label: "Nature & weather",
    tone: "green",
    words: {
      easy: [
        "sun", "moon", "star", "cloud", "rain", "tree", "flower", "leaf",
        "snow", "rainbow", "fire", "river", "grass", "rock", "wave", "sea",
        "lightning", "wind", "ice", "sky",
      ],
      medium: [
        "tornado", "cactus", "sunflower", "snowflake", "puddle", "cave",
        "iceberg", "palm tree", "rose", "seed", "storm", "thunder", "fog",
        "lake", "hill", "planet", "comet", "coral", "bamboo", "apple tree",
      ],
      hard: [
        "eclipse", "avalanche", "earthquake", "northern lights", "sunset",
        "tsunami", "quicksand", "rainforest", "shooting star", "solar system",
        "hurricane", "glacier", "sand dune", "galaxy", "moss", "crater",
        "constellation", "oasis", "whirlpool", "sunrise",
      ],
    },
  },
  {
    id: "people",
    label: "People & jobs",
    tone: "pink",
    words: {
      easy: [
        "baby", "king", "queen", "doctor", "teacher", "clown", "police",
        "chef", "farmer", "pirate", "ghost", "cowboy", "nurse", "soldier",
        "pilot", "singer", "robot", "witch", "astronaut", "firefighter",
      ],
      medium: [
        "magician", "mermaid", "ninja", "vampire", "zombie", "superhero",
        "scientist", "dentist", "lifeguard", "detective", "painter",
        "photographer", "waiter", "mechanic", "plumber", "knight", "princess",
        "referee", "DJ", "gardener",
      ],
      hard: [
        "tightrope walker", "ventriloquist", "snake charmer", "lumberjack",
        "beekeeper", "archaeologist", "sumo wrestler", "mime",
        "fortune teller", "orchestra conductor", "ballerina", "scuba diver",
        "weightlifter", "cheerleader", "lion tamer", "stuntman", "zookeeper",
        "marathon runner", "puppeteer", "news reporter",
      ],
    },
  },
  {
    id: "desi",
    label: "Desi life",
    tone: "yellow",
    words: {
      easy: [
        "chai", "samosa", "diya", "kite", "rangoli", "auto rickshaw", "lassi",
        "jalebi", "bindi", "turban", "sari", "dosa", "roti", "bangles",
        "mehndi", "tabla", "pani puri", "ladoo", "cricket", "coconut tree",
      ],
      medium: [
        "pressure cooker", "tiffin box", "dandiya", "sitar", "idli",
        "biryani", "hand pump", "charpai", "bullock cart", "matka", "tandoor",
        "gulab jamun", "kulfi", "coconut water", "lungi", "kurta", "dhol",
        "chappal", "mosquito net", "steel glass",
      ],
      hard: [
        "Diwali fireworks", "Holi", "kabaddi", "snakes and ladders",
        "carrom board", "gully cricket", "pandal", "dhaba", "local train",
        "chai tapri", "baraat", "flower garland", "power cut", "traffic jam",
        "Bollywood dance", "monsoon", "street food", "Horn OK Please",
        "Ganesh idol", "wedding mandap",
      ],
    },
  },
  {
    id: "fantasy",
    label: "Fantasy & fun",
    tone: "purple",
    words: {
      easy: [
        "dragon", "unicorn", "alien", "fairy", "crown", "magic wand",
        "treasure chest", "rocket", "monster", "snowman", "UFO", "sword",
        "shield", "cape", "mask", "dinosaur", "giant", "wizard hat",
      ],
      medium: [
        "time machine", "flying carpet", "genie", "magic lamp", "spaceship",
        "treasure map", "werewolf", "troll", "cyclops", "potion",
        "crystal ball", "broomstick", "invisible man", "yeti", "phoenix",
        "robot dog", "jack-in-the-box", "superhero cape",
      ],
      hard: [
        "black hole", "teleportation", "Trojan horse", "sea monster",
        "zombie apocalypse", "fountain of youth", "pot of gold", "Medusa",
        "centaur", "Pegasus", "Frankenstein", "Loch Ness monster",
        "wishing well", "message in a bottle", "headless horseman", "Sphinx",
      ],
    },
  },
];

export const THEME_CATEGORY_ID = "theme";
/** Words typed in by the players themselves. */
export const CUSTOM_CATEGORY_ID = "custom";
