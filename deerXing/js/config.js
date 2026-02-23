/** Core canvas and gameplay constants. */
export const GAME_CONFIG = {
  width: 800,
  height: 600,
  cols: 20,
  rows: 20,
  targetFps: 60,
  maxCars: 20,
  bloodEnabled: true,
};

/** Base paths for assets. Actual files live in assets/sounds/ and assets/visuals/ (flat or subfolders). */
export const ASSET_PATHS = {
  visual: "./assets/visuals/",
  sound: "./assets/sounds/",
  soundTracks: "./assets/sounds/tracks/",
  soundCars: "./assets/sounds/cars/",
  soundTrucks: "./assets/sounds/trucks/",
  soundHorns: "./assets/sounds/horns/",
  soundCrash: "./assets/sounds/crash/",
  soundScreams: "./assets/sounds/screams/",
};

/** Intro sequence: image names (no extension) in assets/visuals/, sound in assets/sounds/. */
export const INTRO_ASSETS = {
  image1: "deer1",
  image2: "deer2",
  sound: "scurcrash.mp3",
};

export const DEER_TYPES = {
  buck: {
    emoji: "🦌",
    color: "#c58a45",
    radius: 15,
    moveCooldownMs: 115,
    ability: "Antler Rush (stub)",
  },
  doe: {
    emoji: "🦌",
    color: "#d8b08c",
    radius: 12,
    moveCooldownMs: 95,
    ability: "Nimble (smaller hitbox)",
  },
};

export const CAR_TYPES = {
  sedan: { color: "#58a6ff", speed: 130, widthCells: 2, heightCells: 1, emoji: "🚗", soundKey: "car" },
  truck: { color: "#f0883e", speed: 90, widthCells: 3, heightCells: 1.2, emoji: "🚚", soundKey: "truck" },
  motorcycle: { color: "#d2a8ff", speed: 170, widthCells: 1.2, heightCells: 0.8, emoji: "🏍️", soundKey: "car" },
  sports: { color: "#ff7b72", speed: 200, widthCells: 2, heightCells: 1, emoji: "🏎️", soundKey: "car" },
  bus: { color: "#3fb950", speed: 70, widthCells: 4, heightCells: 1.2, emoji: "🚌", soundKey: "truck" },
};

/** Pickup types and effects. Names match docs/ASSET_AND_SYSTEM_RULES.md. */
export const ITEM_TYPES = {
  salt_cube: { health: 15, energy: 10, points: 0, speed: 0, invincibilityMs: 0, emoji: "🧂", color: "#e8e8e8" },
  sugar_cane: { health: 0, energy: 0, points: 0, speed: 0.15, invincibilityMs: 0, emoji: "🎋", color: "#c8f0a0" },
  leaf: { health: 10, energy: 0, points: 0, speed: 0, invincibilityMs: 0, emoji: "🍃", color: "#7cfc00" },
  radioactive_grub: { health: 0, energy: 0, points: 0, speed: 0, invincibilityMs: 5000, emoji: "🟢", color: "#7fff00" },
  cracker: { health: 0, energy: 0, points: 250, speed: 0, invincibilityMs: 0, emoji: "🍘", color: "#f4d03f" },
  persimmon: { health: 0, energy: 12, points: 0, speed: 0.08, invincibilityMs: 0, emoji: "🍅", color: "#ff6b35" },
};

/** Default player stats. Health/energy are capped by max; speed is a multiplier. */
export const PLAYER_STATS = {
  defaultHealth: 100,
  defaultEnergy: 50,
  defaultSpeedMultiplier: 1,
  maxHealth: 100,
  maxEnergy: 50,
};

/** Ricochet: deer can bounce off cars up to this many times per level (then hit = damage). */
export const RICOCHET_CONFIG = {
  defaultMax: 2,
  healthChunkMotorcycle: 35,
};

/** Buck (player) sprite by direction. Arrow keys control the buck; forward = up. assets/visuals/: buck_forward.PNG, etc. */
export const DEER_SPRITE_KEYS = {
  up: "buck_forward",
  down: "buck_down",
  left: "buck_left",
  right: "buck_right",
  win: "buck_win",
};

/**
 * Vehicle sprite basenames (no _left/_right). One is chosen per spawn; sprite key = basename + _left or _right.
 * Names Match: filenames like fast_red_car_left.PNG, big_truck_right.PNG live in assets/visuals/.
 */
/** Vehicle sprite basenames match assets/visuals/ filenames (no extension). _left = moving R→L, _right = moving L→R. */
export const VEHICLE_SPRITE_VARIANTS = {
  sedan: ["gray_car", "red_car", "white_car", "yellow_taxi_car", "police_car"],
  sports: ["fast_black_car", "fast_red_car", "fast_white_car", "fast_yellow_car", "turquois_fast_car", "yellow_fast_car"],
  truck: ["bigrig_truck", "white_work_truck", "yellow_work_truck", "blue_pickup_truck", "green_pickup_truck", "red_pickup_truck", "white_pickup_truck"],
  bus: ["bluebus_truck", "longbus_truck", "schoolbus_truck", "hippievan_truck"],
  motorcycle: ["black_motorcylce", "blue_motorcylce", "red_motorcylce"],
};
/** Nodriver sprites: when a motorcycle hits the deer, the driver flies off and the bike shows this (empty) sprite. */
export const MOTORCYCLE_NODRIVER = {
  black_motorcylce: "nodriver_blue_motorcycle",
  blue_motorcylce: "nodriver_blue_motorcycle",
  red_motorcylce: "nodriver_red_motorcycle",
};

/** Item sprite filenames (no extension). assets/visuals/: salt.PNG, sugar.PNG, leaf.PNG, grub.PNG, cracker.PNG, persimmon.PNG. */
export const ITEM_SPRITE_KEYS = {
  salt_cube: "salt",
  sugar_cane: "sugar",
  leaf: "leaf",
  radioactive_grub: "grub",
  cracker: "cracker",
  persimmon: "persimmon",
};

/** Filenames per sound folder. In-game music: files in sounds/tracks/. Cars with "fast" in name use fastCars. */
export const SOUND_MANIFEST = {
  tracks: ["80s_track.mp3", "lofi_track.mp3", "sunny_track.mp3"],
  cars: ["car.mp3", "car2.mp3", "car3.mp3", "car4.mp3"],
  fastCars: ["fast_car.mp3", "fast_car2.mp3", "fast_car3.mp3"],
  trucks: ["truck.mp3", "truck2.mp3", "truck3.mp3", "truck4.mp3"],
  horns: ["horn1.mp3", "horn2.mp3"],
  crash: ["crash1.mp3", "crash2.mp3"],
  screams: ["deer_scream.mp3", "scream.mp3", "scream2.mp3", "scream3.mp3", "scream4.mp3", "scream5.mp3", "scream6.mp3"],
};

/** Pile-up cleanup: yellow work truck spawns after this many ms and clears the pile-up when it passes. */
export const PILEUP_CONFIG = {
  towSpawnDelayMs: 4000,
  towSpriteBase: "yellow_work_truck",
};
