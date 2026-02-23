import { GAME_CONFIG } from "./config.js";

export function emitBurst(state, x, y, color = "#ff4d4d", count = 22) {
  for (let i = 0; i < count; i += 1) {
    state.particles.push({
      x,
      y,
      vx: (Math.random() * 2 - 1) * 3.5,
      vy: (Math.random() * 2 - 1) * 3.5,
      life: 24 + Math.random() * 30,
      color,
    });
  }
}

export function updateParticles(state, dtMs) {
  state.particles.forEach((p) => {
    p.x += p.vx * (dtMs / 16.67);
    p.y += p.vy * (dtMs / 16.67);
    p.vy += 0.08 * (dtMs / 16.67);
    p.life -= dtMs / 16.67;
  });
  state.particles = state.particles.filter((p) => p.life > 0);
}

export function drawParticles(ctx, state) {
  state.particles.forEach((p) => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 3, 3);
  });
}

export function initWeather(state, dropCount = 80) {
  state.weather.rain = [];
  state.weather.fogOffset = 0;
  for (let i = 0; i < dropCount; i += 1) {
    state.weather.rain.push({
      x: Math.random() * GAME_CONFIG.width,
      y: Math.random() * GAME_CONFIG.height,
      v: 340 + Math.random() * 260,
    });
  }
}

export function updateWeather(state, level, dtMs) {
  if (level.levelId !== 3) state.weather.fogOffset += dtMs * 0.01;
  if (level.background.weather === "rain") {
    state.weather.rain.forEach((drop) => {
      drop.y += (drop.v * dtMs) / 1000;
      drop.x -= (drop.v * 0.13 * dtMs) / 1000;
      if (drop.y > GAME_CONFIG.height) {
        drop.y = -10;
        drop.x = Math.random() * GAME_CONFIG.width;
      }
      if (drop.x < -10) drop.x = GAME_CONFIG.width + 10;
    });
  }
}

export function drawWeather(ctx, state, level) {
  if (level.background.weather === "rain") {
    ctx.strokeStyle = "rgba(180, 220, 255, 0.4)";
    state.weather.rain.forEach((drop) => {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 6, drop.y + 14);
      ctx.stroke();
    });
  }
  if (level.background.weather === "fog") {
    for (let i = 0; i < 4; i += 1) {
      const y = (i * 160 + state.weather.fogOffset) % (GAME_CONFIG.height + 200) - 100;
      const alpha = 0.1 + i * 0.03;
      ctx.fillStyle = `rgba(210,220,230,${alpha.toFixed(3)})`;
      ctx.fillRect(-20, y, GAME_CONFIG.width + 40, 90);
    }
  }
}

export function drawCinematicBars(ctx, scene) {
  const barHeight = scene === "playing" || scene === "transition" || scene === "intro" ? 28 : 0;
  if (barHeight <= 0) return;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, GAME_CONFIG.width, barHeight);
  ctx.fillRect(0, GAME_CONFIG.height - barHeight, GAME_CONFIG.width, barHeight);
}
