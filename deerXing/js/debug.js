import { GAME_CONFIG } from "./config.js";
import { worldFromCell } from "./deer.js";

export function createDebugState() {
  // Debug state is the game's "developer superpower backpack".
  return {
    enabled: false,
    showHitboxes: true,
    showFPS: true,
    showGrid: true,
    invincible: false,
    spawnCars: true,
    logCollisions: true,
    teleport: false,
    fps: 0,
  };
}

export function toggleDebugFlag(state, key) {
  if (!state.debug) return;
  // F1 wakes debug mode up from its cave.
  if (key === "f1") state.debug.enabled = !state.debug.enabled;
  if (key === "h") state.debug.showHitboxes = !state.debug.showHitboxes;
  if (key === "g") state.debug.showGrid = !state.debug.showGrid;
  if (key === "j") state.debug.showFPS = !state.debug.showFPS;
  if (key === "i") state.debug.invincible = !state.debug.invincible;
  if (key === "o") state.debug.spawnCars = !state.debug.spawnCars;
  if (key === "l") state.debug.logCollisions = !state.debug.logCollisions;
  if (key === "t") state.debug.teleport = !state.debug.teleport;
}

export function drawHitboxes(ctx, state, cellW, cellH) {
  if (!state.debug?.showHitboxes) return;
  ctx.save();
  ctx.strokeStyle = "rgba(255, 80, 80, 0.9)";
  state.cars.forEach((car) => {
    ctx.strokeRect(car.x, car.y, car.width, car.height);
  });

  const deerCenter = worldFromCell(state.deer.x, state.deer.y, cellW, cellH);
  ctx.strokeStyle = "rgba(80, 180, 255, 0.95)";
  ctx.beginPath();
  ctx.arc(deerCenter.x, deerCenter.y, state.deer.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawDebugOverlay(ctx, state) {
  if (!state.debug?.enabled) return;
  const rows = ["DEBUG MODE"];
  if (state.debug.showFPS) rows.push(`FPS: ${state.debug.fps.toFixed(1)}`);
  rows.push(
    `Invincible: ${state.debug.invincible ? "ON" : "OFF"} (I)`,
    `Spawn Cars: ${state.debug.spawnCars ? "ON" : "OFF"} (O)`,
    `Hitboxes: ${state.debug.showHitboxes ? "ON" : "OFF"} (H)`,
    `Grid: ${state.debug.showGrid ? "ON" : "OFF"} (G)`,
    `Log Collisions: ${state.debug.logCollisions ? "ON" : "OFF"} (L)`,
    `FPS Row: ${state.debug.showFPS ? "ON" : "OFF"} (J)`,
    `Teleport Click: ${state.debug.teleport ? "ON" : "OFF"} (T)`,
    "Toggle panel: F1",
  );

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
  ctx.fillRect(10, 10, 300, 30 + rows.length * 18);
  ctx.fillStyle = "#7ee787";
  ctx.font = "14px Consolas, monospace";
  rows.forEach((text, idx) => ctx.fillText(text, 18, 30 + idx * 18));
  ctx.restore();
}

export function teleportDeerFromPointer(state, canvas, event) {
  if (!state.debug?.teleport) return;
  if (state.scene !== "playing" && state.scene !== "paused") return;
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * GAME_CONFIG.width;
  const y = ((event.clientY - rect.top) / rect.height) * GAME_CONFIG.height;
  const cellX = Math.max(0, Math.min(GAME_CONFIG.cols - 1, Math.floor(x / (GAME_CONFIG.width / GAME_CONFIG.cols))));
  const cellY = Math.max(0, Math.min(GAME_CONFIG.rows - 1, Math.floor(y / (GAME_CONFIG.height / GAME_CONFIG.rows))));
  state.deer.x = cellX;
  state.deer.y = cellY;
  state.prevDeerY = cellY;
}
