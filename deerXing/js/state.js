import { GAME_CONFIG, PLAYER_STATS, RICOCHET_CONFIG } from "./config.js";
import { createDebugState } from "./debug.js";
import { createTutorialState } from "./tutorial.js";

export const FIXED_TIMESTEP_MS = 1000 / GAME_CONFIG.targetFps;

export const LEVEL_PATHS = [
  "./assets/levels/stage1_rural.json",
  "./assets/levels/stage2_highway.json",
  "./assets/levels/stage3_city.json",
  "./assets/levels/stage4_multilevel.json",
  "./assets/levels/stage5_night.json",
];

export const MENU_MODES = [
  { key: "tutorial", label: "Tutorial Drive" },
  { key: "classic", label: "Classic Crossing" },
  { key: "survival", label: "Survival" },
  { key: "rampage", label: "Rampage" },
];

export const PSA_TIPS = [
  "Did you know? 1 million animals are hit daily in the US.",
  "Slow down at dawn and dusk - peak deer hours.",
  "If you see one deer, expect more nearby.",
  "Reflectors on roads save lives.",
  "Use short horn bursts - deer freeze with continuous noise.",
];

/** Reset player stats and level-specific counters for a new run or level. */
export function resetPlayerStats(state, fullRun = true) {
  state.health = PLAYER_STATS.defaultHealth;
  state.maxHealth = PLAYER_STATS.maxHealth;
  state.energy = PLAYER_STATS.defaultEnergy;
  state.maxEnergy = PLAYER_STATS.maxEnergy;
  state.speedMultiplier = PLAYER_STATS.defaultSpeedMultiplier;
  state.ricochetCount = 0;
  state.maxRicochets = RICOCHET_CONFIG.defaultMax;
  state.invincibleUntil = 0;
  state.hitsThisLevel = 0;
  state.deerJustMoved = false;
  if (fullRun) {
    state.lives = 3;
    state.score = 0;
    state.deaths = 0;
  }
}

export function createInitialState() {
  const state = {
    // Scene flow: boot -> intro -> menu -> playing -> victory/gameover
    scene: "boot",
    levels: [],
    levelIndex: 0,
    level: null,
    lanes: [],
    cars: [],
    mode: "classic",
    menuIndex: 0,
    deerType: "buck",
    // Deer object: position, display, movement. lastDeerDirection set by input (up/down/left/right).
    deer: { x: 10, y: 18, radius: 15, color: "#c58a45", emoji: "D", moveCooldownMs: 115, movedAt: 0 },
    abilityCharges: 1,
    lives: 3,
    score: 0,
    deaths: 0,
    steps: 0,
    laneCrosses: 0,
    pileups: 0,
    closeCalls: 0,
    combo: 1,
    chaos: 0,
    weather: { rain: [], fogOffset: 0 },
    debug: createDebugState(),
    tutorial: createTutorialState(),
    particles: [],
    skyOffset: 0,
    tipIndex: 0,
    sceneTimerMs: 0,
    transitionAlpha: 0,
    transitionLabel: "",
    transitionNext: null,
    startTime: performance.now(),
    runTimeMs: 0,
    flashMs: 0,
    shakeMs: 0,
    shakePower: 0,
    slowMoMs: 0,
    prevDeerY: 18,
    // Player stats (health, energy, speed multiplier) and ricochet
    health: PLAYER_STATS.defaultHealth,
    maxHealth: PLAYER_STATS.maxHealth,
    energy: PLAYER_STATS.defaultEnergy,
    maxEnergy: PLAYER_STATS.maxEnergy,
    speedMultiplier: PLAYER_STATS.defaultSpeedMultiplier,
    ricochetCount: 0,
    maxRicochets: RICOCHET_CONFIG.defaultMax,
    invincibleUntil: 0,
    hitsThisLevel: 0,
    deerJustMoved: false,
    // Last movement direction for sprite: "up" | "down" | "left" | "right". Win state uses buck_win.
    lastDeerDirection: "up",
    // Level pickups: array of { id, type, x, y, width, height } (world coords). Removed on collect.
    items: [],
    // High scores: loaded from save, displayed on menu. [{ score, mode, timestamp }]
    highScores: [],
    // Loaded sprite images: { buck_forward: Image, sedan_right: Image, ... }. Null = use fallback draw.
    sprites: {},
    // Timed level: when runTimeMs reaches (levelStartTime + limit), danger music. levelStartTime set on load.
    levelStartTime: 0,
    timedLevelSeconds: 0,
    screechCooldownMs: 0,
    introSoundPlayed: false,
    pileUps: [],
  };
  return state;
}
