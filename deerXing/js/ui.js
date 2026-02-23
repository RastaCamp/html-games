// ui.js
// Purpose: lightweight reusable UI drawing helpers for canvas menus/HUD.
// If runtime feels cluttered with drawing code, move it here.

export function drawPanel(ctx, x, y, width, height, alpha = 0.65) {
  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

export function drawLabel(ctx, text, x, y, color = "#ffffff", font = "20px Segoe UI, Arial", align = "left") {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function drawButton(ctx, { x, y, width, height, label, active = false }) {
  ctx.save();
  ctx.fillStyle = active ? "#7ee787" : "#30363d";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = active ? "#0d1117" : "#e6edf3";
  ctx.font = "18px Segoe UI, Arial";
  ctx.textAlign = "center";
  ctx.fillText(label, x + width / 2, y + height / 2 + 6);
  ctx.restore();
}

/** Draw a horizontal meter (health, energy, speed). value/max, 0..1. */
export function drawMeter(ctx, x, y, width, height, value, max, fillColor = "#7ee787", bgColor = "rgba(0,0,0,0.4)") {
  const t = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, width * t, height);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
}
