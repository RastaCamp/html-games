import { DEER_TYPES, DEER_SPRITE_KEYS, GAME_CONFIG } from "./config.js";

export function applyDeerType(state, typeKey) {
  // Character swap: same deer soul, different stats.
  const cfg = DEER_TYPES[typeKey] || DEER_TYPES.buck;
  state.deerType = typeKey;
  state.deer.radius = cfg.radius;
  state.deer.color = cfg.color;
  state.deer.emoji = cfg.emoji || "D";
  state.deer.moveCooldownMs = cfg.moveCooldownMs;
  state.abilityCharges = typeKey === "buck" ? 1 : 0;
}

export function resetDeer(state) {
  // Respawn spot is "home base", also known as "try again friend".
  state.deer.x = state.level.startPosition.x;
  state.deer.y = state.level.startPosition.y;
  state.prevDeerY = state.deer.y;
}

export function worldFromCell(cx, cy, cellW, cellH) {
  return { x: cx * cellW + cellW / 2, y: cy * cellH + cellH / 2 };
}

function intersectsCircleRect(circle, rect) {
  const nearestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const nearestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  const dx = circle.x - nearestX;
  const dy = circle.y - nearestY;
  return dx * dx + dy * dy <= circle.r * circle.r;
}

function rectDistance(circle, rect) {
  const nearestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const nearestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  const dx = circle.x - nearestX;
  const dy = circle.y - nearestY;
  return Math.sqrt(dx * dx + dy * dy);
}

export function tryMove(state, dx, dy, now, onMoved) {
  if (state.scene !== "playing") return;
  const cooldown = state.deer.moveCooldownMs / (state.speedMultiplier || 1);
  if (now - state.deer.movedAt < cooldown) return;
  state.deer.movedAt = now;
  const nx = Math.max(0, Math.min(GAME_CONFIG.cols - 1, state.deer.x + dx));
  const ny = Math.max(0, Math.min(GAME_CONFIG.rows - 1, state.deer.y + dy));
  // Callback lets runtime decide scoring/sfx without coupling logic here.
  if (nx !== state.deer.x || ny !== state.deer.y) {
    onMoved(nx, ny);
    // Set direction for sprite: Names Match Everything (buck_forward, buck_down, etc.)
    if (dy < 0) state.lastDeerDirection = "up";
    else if (dy > 0) state.lastDeerDirection = "down";
    else if (dx < 0) state.lastDeerDirection = "left";
    else if (dx > 0) state.lastDeerDirection = "right";
    if (state.deerJustMoved !== undefined) state.deerJustMoved = true;
  }
  state.deer.x = nx;
  state.deer.y = ny;
}

export function useAbility(state, cellW, cellH, emitBurst, onAbilityUsed) {
  if (state.scene !== "playing") return;
  if (state.deerType !== "buck" || state.abilityCharges <= 0) return;
  const deerCenter = worldFromCell(state.deer.x, state.deer.y, cellW, cellH);
  let pushed = false;
  state.cars.forEach((car) => {
    const nearX = Math.abs(car.x + car.width * 0.5 - deerCenter.x) < 80;
    const nearY = Math.abs(car.y + car.height * 0.5 - deerCenter.y) < 40;
    if (nearX && nearY) {
      car.x += car.directionSign * 95;
      emitBurst(car.x, car.y, "#f2cc60", 8);
      pushed = true;
    }
  });
  if (pushed) {
    // Buck used antler shove successfully. Somewhere, traffic is upset.
    state.abilityCharges -= 1;
    state.score += 140;
    state.chaos += 180;
    onAbilityUsed();
  }
}

export function updateDeerCollision(state, cellW, cellH, onHit, onNearMiss) {
  const deerCenter = worldFromCell(state.deer.x, state.deer.y, cellW, cellH);
  const r = Math.max(8, state.deer.radius || 15);
  const deerCircle = { x: deerCenter.x, y: deerCenter.y, r };
  for (const car of state.cars) {
    if (car.isTowTruck) continue;
    if (intersectsCircleRect(deerCircle, car)) {
      onHit(car, deerCenter);
      return;
    }
    const near = rectDistance(deerCircle, car);
    if (near < state.deer.radius + 8 && near > state.deer.radius + 2) onNearMiss(deerCenter);
  }
}

/**
 * Draw deer: use buck_* sprite by lastDeerDirection, or buck_win when at exit; else circle + emoji fallback.
 */
export function drawDeer(ctx, state, cellW, cellH) {
  const deerCenter = worldFromCell(state.deer.x, state.deer.y, cellW, cellH);
  const r = state.deer.radius;
  const showWin = state.level && state.deer.y <= state.level.exitPosition.y && state.scene === "playing";
  const dir = showWin ? "win" : (state.lastDeerDirection || "up");
  const spriteKey = DEER_SPRITE_KEYS[dir] || DEER_SPRITE_KEYS.up;
  const img = state.sprites && state.sprites[spriteKey];

  if (img && img.complete && img.naturalWidth > 0) {
    const size = r * 2.2;
    ctx.drawImage(img, deerCenter.x - size / 2, deerCenter.y - size / 2, size, size);
    return;
  }
  // Fallback: circle + emoji when no sprite
  ctx.fillStyle = state.deer.color;
  ctx.beginPath();
  ctx.arc(deerCenter.x, deerCenter.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "20px Segoe UI Emoji, Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(state.deer.emoji, deerCenter.x - 10, deerCenter.y + 7);
}
