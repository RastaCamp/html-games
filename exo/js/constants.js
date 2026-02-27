// ═══════════════════════════════════════════════════════════════════════════════
// IRON COLISEUM BRAWLER – CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════
// Tweak these to change how the game feels. No need to hunt through code—it all
// starts here. Want longer rounds? Bigger hitboxes? More chaos? You're in the right place.

const CANVAS = { WIDTH: 800, HEIGHT: 400 };  // Change resolution here if you dare.
const FPS = 60;
const FRAME_MS = 1000 / FPS;

// ─── Arena (the floor, the pain zones) ───────────────────────────────────────
const ARENA = {
  BOUNDARY: 8,
  HAZARD_ZONE_PCT: 0.2,
  HAZARD_ZONE_WIDTH: Math.floor(CANVAS.WIDTH * 0.2), // 160px
  HAZARD_CYCLE_SEC: 20,
  HAZARD_ACTIVE_SEC: 5,
  HAZARD_DAMAGE_PER_TICK: 2,
  HAZARD_TICK_MS: 200,  // How often hazard damage is applied (ms). Lower = more pain per second.
};

// Default player body part sizes (rectangles). Characters can override via config.dim.
const PLAYER_DIM = {
  TORSO_W: 40,
  TORSO_H: 80,
  HEAD_W: 30,
  HEAD_H: 20,
  ARM_W: 15,
  ARM_H: 60,
  LEGS_W: 30,
  LEGS_H: 20,
};

// Proportion template for modular limbs (build all assets against this so they assemble correctly):
// Leg length (hip to ankle) = torso height + head height. Arm length (shoulder to wrist) = torso height.
// In-engine we scale limbs to these ratios; for new art use a locked base mannequin with these proportions.
// Arm pivot: draw arm art with shoulder joint at a consistent point (e.g. top-left or top-right of image).
// The game places that pivot on the shoulder socket; if the arm floats, adjust ARM_PIVOT_LEFT/RIGHT in players.js.

// Body part names for sprites/sounds. facing 1 = right, -1 = left.
const BODY_PART_LABELS = {
  head: { left: "armored_male_head_left", right: "armored_male_head_right" },
  torso: { left: "armored_male_torso_left", right: "armored_male_torso_right" },
  leftArm: { left: "armored_male_left_punch_left", right: "armored_male_left_punch_right" },
  rightArm: { left: "armored_male_right_punch_left", right: "armored_male_right_punch_right" },
  legs: { left: "armored_male_legs_left", right: "armored_male_legs_right" },
};
function getBodyPartLabel(part, facing) {
  const labels = BODY_PART_LABELS[part];
  return labels ? (facing === 1 ? labels.right : labels.left) : part;
}

// Character select grid. Add more entries and set configKey to a global config (e.g. WARDEN, RAE).
// Use configKey: null and name: "???" for locked slots.
const CHARACTERS = [
  { id: "warden", name: "Iron Warden", configKey: "WARDEN", offense: 8, defense: 7, speed: 4, special: "Plasmakick" },
  { id: "rae", name: "Velocity Rae", configKey: "RAE", offense: 6, defense: 5, speed: 9, special: "Bulletpunch" },
  { id: "locked", name: "???", configKey: null, offense: 0, defense: 0, speed: 0, special: "—" },
  { id: "locked", name: "???", configKey: null, offense: 0, defense: 0, speed: 0, special: "—" },
  { id: "locked", name: "???", configKey: null, offense: 0, defense: 0, speed: 0, special: "—" },
  { id: "locked", name: "???", configKey: null, offense: 0, defense: 0, speed: 0, special: "—" },
  { id: "locked", name: "???", configKey: null, offense: 0, defense: 0, speed: 0, special: "—" },
  { id: "locked", name: "???", configKey: null, offense: 0, defense: 0, speed: 0, special: "—" },
];
const CHARACTER_GRID_COLS = 4;   // How many columns in the character grid.
const VS_DISPLAY_MS = 2500;     // How long the "VS" screen shows before the fight.
const VS_FADE_MS = 600;

// ─── Iron Warden (tank) – hits hard, moves slow, takes a beating ──────────────
const WARDEN = {
  name: "Iron Warden",
  startX: 100,
  startY: 300,
  facing: 1,
  characterId: "warden",
  walkSpeed: 180,
  dashSpeed: 320,
  dashDurationMs: 120,
  dashDistance: 1.0,
  armorBonus: 1.15,
  knockbackResist: 0.7,
  // Damage dealt (head, leftArm, rightArm, legs, torso)
  light: [10, 15, 15, 5, 12],
  heavy: [25, 30, 0, 5, 20],
  grab: [20, 25, 25, 0, 18],
  dash: 5,
  lightAttackDurationMs: 120,
  heavyAttackDurationMs: 220,
  grabDurationMs: 180,
  lightHitbox: { w: 20, h: 20 },
  heavyHitbox: { w: 30, h: 30 },
  grabHitbox: { w: 25, h: 25 },
  // Different shape: wider torso, thicker arms/legs
  dim: { TORSO_W: 46, TORSO_H: 84, HEAD_W: 32, HEAD_H: 22, ARM_W: 18, ARM_H: 62, LEGS_W: 32, LEGS_H: 22 },
  // Block chance (0–1): higher stat = better chance to auto-block
  blockChance: 0.12,  // 0–1. Higher = more random blocks. Don't go crazy or nobody ever gets hit.
};

// ─── Velocity Rae (speed) – fast attacks, slimmer, special = Bulletpunch ──────
const RAE = {
  name: "Velocity Rae",
  startX: 700,
  startY: 300,
  facing: -1,
  characterId: "rae",
  walkSpeed: 220,
  dashSpeed: 380,
  dashDurationMs: 100,
  dashDistance: 1.2,
  armorBonus: 0.9,
  knockbackResist: 1.2,
  light: [10, 12, 12, 5, 10],
  heavy: [20, 25, 0, 5, 16],
  grab: [15, 20, 20, 0, 14],
  dash: 5,
  lightAttackDurationMs: 80,
  heavyAttackDurationMs: 160,
  grabDurationMs: 120,
  lightHitbox: { w: 18, h: 18 },
  heavyHitbox: { w: 26, h: 26 },
  grabHitbox: { w: 22, h: 22 },
  dim: { TORSO_W: 36, TORSO_H: 76, HEAD_W: 26, HEAD_H: 18, ARM_W: 12, ARM_H: 56, LEGS_W: 26, LEGS_H: 18 },
  blockChance: 0.18,
};

// ─── Armor & damage ──────────────────────────────────────────────────────────
const ARMOR_MAX = 100;
const ARMOR_LOW = 40;
const ARMOR_CRITICAL = 0;
// When a piece is below this value but > 0, it's "in the red"—grab = rip it off!
const ARMOR_RED_THRESHOLD = 40;

// Light attack picks a random part. These weights decide how often each gets hit.
// Tweak to make head shots rarer or torso the main target.
const HIGH_STRIKE_WEIGHTS = { torso: 0.45, leftArm: 0.18, rightArm: 0.18, head: 0.19 };
const HIGH_STRIKE_PARTS = ["head", "torso", "leftArm", "rightArm"];
function pickHighStrikePart() {
  const r = Math.random();
  let acc = 0;
  for (const part of HIGH_STRIKE_PARTS) {
    acc += HIGH_STRIKE_WEIGHTS[part];
    if (r < acc) return part;
  }
  return "torso";
}

// ─── Combat (hit freeze, knockback, rounds, fatality) ──────────────────────────
const HIT_PAUSE_MS = 120;  // Brief freeze when you land a hit. Feels good.
const SCREEN_SHAKE_AMOUNT = 4;
const KNOCKBACK_LIGHT = 30;
const KNOCKBACK_HEAVY = 80;
const KNOCKBACK_GRAB = 100;
const EXECUTION_FREEZE_MS = 200;
const RIP_HOLD_MS = 600;   // armor shown in attacker hand
const RIP_DROP_MS = 400;   // armor falls to floor
const ROUND_DURATION_SEC_MIN = 60;  // Round length is random between min and max.
const ROUND_DURATION_SEC_MAX = 90;
const ROUNDS_TO_WIN = 2;            // First to win this many rounds wins the match.
const HP_MAX = 100;                 // When armor is gone, this is the health pool. Zero = KO.
const GETUP_MS = 1200;            // How long they lie on the floor after heavy/special.
const FATALITY_GRAB_KNOCKBACK = 150;

// ─── Colors (UI, hitboxes, armor bars—go wild) ────────────────────────────────
const COLORS = {
  FLOOR: "#4a4a4a",
  BOUNDARY: "#2a2a2a",
  HAZARD: "#c03030",
  HAZARD_FLASH: "#ff4040",
  CENTER_LINE: "#666",
  WARDEN: "#3d4a52",
  WARDEN_HEAD: "#4d5a62",
  RAE: "#4a6a8a",
  RAE_HEAD: "#5a7a9a",
  HITBOX_LIGHT: "rgba(100,200,255,0.55)",
  HITBOX_HEAVY: "rgba(255,120,60,0.6)",
  HITBOX_GRAB: "rgba(180,100,255,0.55)",
  ARMOR_BAR_FULL: "#2ecc71",
  ARMOR_BAR_LOW: "#f1c40f",
  ARMOR_BAR_BROKEN: "#e74c3c",
  UI_BG: "rgba(0,0,0,0.6)",
  UI_TEXT: "#eee",
};
