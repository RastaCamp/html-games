/**
 * Item system: pickups placed in levels, collision with deer, effects (health, energy, speed, points, invincibility).
 * See docs/ASSET_AND_SYSTEM_RULES.md and config ITEM_TYPES.
 */

import { GAME_CONFIG, ITEM_SPRITE_KEYS, ITEM_TYPES } from "./config.js";
import { worldFromCell } from "./deer.js";

const ITEM_SIZE = 24;
const DEFAULT_ITEMS_PER_LEVEL = 5;
const ITEM_TYPE_KEYS = Object.keys(ITEM_TYPES);

function randomItemType() {
  return ITEM_TYPE_KEYS[Math.floor(Math.random() * ITEM_TYPE_KEYS.length)];
}

/** Place random items in level. Avoids start/exit and road lanes; uses world coords. */
export function placeLevelItems(state, cellW, cellH) {
  state.items = [];
  const count = state.level?.itemCount ?? DEFAULT_ITEMS_PER_LEVEL;
  const startY = state.level?.startPosition?.y ?? 18;
  const exitY = state.level?.exitPosition?.y ?? 2;
  const safeRows = [];
  for (let row = 0; row < GAME_CONFIG.rows; row += 1) {
    if (row <= exitY + 1 || row >= startY - 1) continue;
    safeRows.push(row);
  }
  for (let i = 0; i < count; i += 1) {
    const row = safeRows[Math.floor(Math.random() * safeRows.length)];
    const col = 2 + Math.floor(Math.random() * (GAME_CONFIG.cols - 4));
    const center = worldFromCell(col, row, cellW, cellH);
    state.items.push({
      id: `item_${i}_${Math.random().toString(36).slice(2)}`,
      type: randomItemType(),
      x: center.x - ITEM_SIZE / 2,
      y: center.y - ITEM_SIZE / 2,
      width: ITEM_SIZE,
      height: ITEM_SIZE,
    });
  }
}

/** AABB-circle test for deer pickup. */
function intersectsItem(deerCenter, deerR, item) {
  const nearestX = Math.max(item.x, Math.min(deerCenter.x, item.x + item.width));
  const nearestY = Math.max(item.y, Math.min(deerCenter.y, item.y + item.height));
  const dx = deerCenter.x - nearestX;
  const dy = deerCenter.y - nearestY;
  return dx * dx + dy * dy <= deerR * deerR;
}

/** Apply one item's effect to state; return points earned. */
export function applyItemEffect(state, item) {
  const def = ITEM_TYPES[item.type];
  if (!def) return 0;
  let points = def.points || 0;
  if (def.health) {
    state.health = Math.min(state.maxHealth, state.health + def.health);
  }
  if (def.energy) {
    state.energy = Math.min(state.maxEnergy, state.energy + def.energy);
  }
  if (def.speed) {
    state.speedMultiplier = Math.min(2, (state.speedMultiplier || 1) + def.speed);
  }
  if (def.invincibilityMs) {
    state.invincibleUntil = performance.now() + def.invincibilityMs;
  }
  return points;
}

/** Check deer vs items; collect and apply effects. Returns total points from collected items this frame. */
export function updateItems(state, cellW, cellH) {
  const deerCenter = worldFromCell(state.deer.x, state.deer.y, cellW, cellH);
  const deerR = (state.deer.radius || 15) * 1.35;
  let earned = 0;
  const toRemove = [];
  state.items.forEach((item, idx) => {
    if (!intersectsItem(deerCenter, deerR, item)) return;
    earned += applyItemEffect(state, item);
    toRemove.push(idx);
  });
  state.items = state.items.filter((_, idx) => !toRemove.includes(idx));
  return earned;
}

/** Draw all items: use sprite from assets/visuals/ (salt.PNG, leaf.PNG, etc.) when loaded; else rect + emoji. */
export function drawItems(ctx, state) {
  state.items.forEach((item) => {
    const def = ITEM_TYPES[item.type];
    if (!def) return;
    const spriteKey = ITEM_SPRITE_KEYS[item.type];
    const img = spriteKey && state.sprites && state.sprites[spriteKey];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, item.x, item.y, item.width, item.height);
      return;
    }
    ctx.fillStyle = def.color || "#888";
    ctx.fillRect(item.x, item.y, item.width, item.height);
    ctx.font = "16px Segoe UI Emoji, Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(def.emoji || "?", item.x + 4, item.y + item.height - 6);
  });
}
