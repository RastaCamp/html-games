import {
  CAR_TYPES,
  GAME_CONFIG,
  MOTORCYCLE_NODRIVER,
  PILEUP_CONFIG,
  VEHICLE_SPRITE_VARIANTS,
} from "./config.js";
import { pickCarType } from "./level.js";
import { worldFromCell } from "./deer.js";

const MIN_GAP = 1;

function laneHeight(lane, cellH) {
  return lane.laneHeight ?? cellH;
}

/** Cars in the same lane (by y overlap with lane). */
function carsInLane(state, lane, cellH) {
  const lh = laneHeight(lane, cellH);
  const laneCenter = lane.y + lh / 2;
  return state.cars.filter((c) => {
    if (c.isTowTruck || c.recovering) return false;
    const carCenter = c.y + c.height / 2;
    return Math.abs(carCenter - laneCenter) < lh * 0.6;
  });
}

/** Spawn one vehicle; only if lane has at least one car length gap at spawn side. */
function spawnCar(state, lane, cellW, cellH, boosted = false) {
  if (state.cars.length >= GAME_CONFIG.maxCars) return;
  const kind = pickCarType(lane.carTypes);
  const def = CAR_TYPES[kind];
  if (!def) return;
  const variants = VEHICLE_SPRITE_VARIANTS[kind];
  const spriteBase = variants && variants.length ? variants[Math.floor(Math.random() * variants.length)] : kind;
  const width = def.widthCells * cellW;
  const height = def.heightCells * cellH;
  const inLane = carsInLane(state, lane, cellH);
  const gap = width * (MIN_GAP + 1);
  if (lane.directionSign > 0) {
    const blocking = inLane.some((c) => c.x < gap);
    if (blocking) return;
  } else {
    const blocking = inLane.some((c) => c.x + c.width > GAME_CONFIG.width - gap);
    if (blocking) return;
  }
  const x = lane.directionSign > 0 ? -width : GAME_CONFIG.width + width;
  const lh = laneHeight(lane, cellH);
  const nodriverKey = kind === "motorcycle" ? (MOTORCYCLE_NODRIVER[spriteBase] || "nodriver_red_motorcycle") : null;
  state.cars.push({
    id: Math.random().toString(36).slice(2),
    type: kind,
    spriteBase,
    nodriverKey,
    x,
    y: lane.y + (lh - height) * 0.5,
    width,
    height,
    speed: def.speed * (1 + (Math.random() * 2 - 1) * lane.speedVariation) * (boosted ? 1.2 : 1),
    directionSign: lane.directionSign,
    hitCooldownMs: 0,
    driverFlying: false,
    driverFlyX: 0,
    driverFlyY: 0,
    driverFlyVx: 0,
    driverSpriteKey: null,
  });
}

function resolveOverlap(a, b) {
  if (a.isTowTruck || b.isTowTruck) return;
  const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  if (overlapX <= 0 || overlapY <= 0) return;
  const pushX = overlapX < overlapY ? overlapX : 0;
  const pushY = overlapX >= overlapY ? overlapY : 0;
  if (pushX > 0) {
    const sign = a.x < b.x ? -1 : 1;
    a.x += sign * (pushX / 2);
    b.x -= sign * (pushX / 2);
  }
  if (pushY > 0) {
    const sign = a.y < b.y ? -1 : 1;
    a.y += sign * (pushY / 2);
    b.y -= sign * (pushY / 2);
  }
}

export function updateCars(state, dtMs, cellW, cellH, onPileup, canSpawn = true) {
  state.lanes.forEach((lane) => {
    if (lane.direction === "none" || lane.carDensity <= 0) return;
    if (!canSpawn) return;
    lane.spawnTimer += dtMs;
    const spawnRateBonus = state.mode === "survival" ? 0.85 : 1;
    if (lane.spawnTimer >= lane.spawnEveryMs * spawnRateBonus) {
      lane.spawnTimer = 0;
      spawnCar(state, lane, cellW, cellH, state.mode === "rampage");
    }
  });

  const now = state.runTimeMs || 0;
  state.cars.forEach((car) => {
    if (car.recovering) {
      car.hitCooldownMs = Math.max(0, car.hitCooldownMs - dtMs);
      const lh = car.recoverLaneHeight ?? cellH;
      const laneY = car.recoverLaneY ?? car.y;
      const shoulderY = laneY + lh - car.height - 8;
      const centerY = laneY + (lh - car.height) * 0.5;
      if (now >= car.recoverUntil) {
        car.recovering = false;
        car.speed = car.recoverSpeed ?? (CAR_TYPES[car.type]?.speed ?? 100) * 0.8;
        delete car.recoverUntil;
        delete car.recoverLaneY;
        delete car.recoverLaneHeight;
        delete car.recoverSpeed;
      } else if (now < car.recoverUntil - 2000) {
        car.y += (shoulderY - car.y) * Math.min(1, 0.04);
      } else {
        car.y += (centerY - car.y) * Math.min(1, 0.04);
      }
      return;
    }
    const dx = (car.speed * car.directionSign * dtMs) / 1000;
    car.x += dx;
    car.hitCooldownMs = Math.max(0, car.hitCooldownMs - dtMs);
    if (car.driverFlying) {
      car.driverFlyX += (car.driverFlyVx * dtMs) / 1000;
      car.driverFlyY += 20 * (dtMs / 1000);
    }
  });

  state.cars.forEach((car) => {
    if (car.isTowTruck || car.recovering) return;
    const laneCenter = car.y + car.height / 2;
    const lane = state.lanes.find((l) => Math.abs((l.y + laneHeight(l, cellH) / 2) - laneCenter) < laneHeight(l, cellH) * 0.6);
    if (!lane) return;
    const inLane = carsInLane(state, lane, cellH).filter((c) => c.id !== car.id);
    const minGap = car.width * MIN_GAP;
    if (car.directionSign > 0) {
      const ahead = inLane.filter((c) => c.x > car.x).sort((a, b) => a.x - b.x)[0];
      if (ahead) {
        const gap = ahead.x - (car.x + car.width);
        if (gap < minGap) car.x = ahead.x - car.width - minGap;
      }
    } else {
      const ahead = inLane.filter((c) => c.x < car.x).sort((a, b) => b.x - a.x)[0];
      if (ahead) {
        const gap = car.x - (ahead.x + ahead.width);
        if (gap < minGap) car.x = ahead.x + ahead.width + minGap;
      }
    }
  });

  for (let i = 0; i < state.cars.length; i += 1) {
    for (let j = i + 1; j < state.cars.length; j += 1) {
      const a = state.cars[i];
      const b = state.cars[j];
      if (a.isTowTruck || b.isTowTruck) continue;
      const overlap = a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
      if (overlap) {
        resolveOverlap(a, b);
        if (a.hitCooldownMs <= 0 && b.hitCooldownMs <= 0) {
          a.hitCooldownMs = 300;
          b.hitCooldownMs = 300;
          a.speed *= 0.8;
          b.speed *= 0.8;
          onPileup(state, a, b, (a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
        }
      }
    }
  }

  state.cars.forEach((car) => {
    if (car.isTowTruck) return;
    if (!state.lanes.length) return;
    let best = state.lanes[0];
    let bestD = Math.abs((best.y + cellH / 2) - (car.y + car.height / 2));
    state.lanes.forEach((lane) => {
      const laneCenter = lane.y + cellH / 2;
      const carCenter = car.y + car.height / 2;
      const d = Math.abs(laneCenter - carCenter);
      if (d < bestD) {
        bestD = d;
        best = lane;
      }
    });
    const lh = laneHeight(best, cellH);
    const targetY = best.y + (lh - car.height) * 0.5;
    car.y += (targetY - car.y) * Math.min(1, 0.08);
  });

  updatePileUps(state, dtMs, cellW, cellH);
  state.cars = state.cars.filter((car) => car.x > -car.width * 2 && car.x < GAME_CONFIG.width + car.width * 2);
}

function towsInLane(state, lane, cellH) {
  const lh = laneHeight(lane, cellH);
  const laneCenter = lane.y + lh / 2;
  return state.cars.filter((c) => {
    if (!c.isTowTruck) return false;
    const carCenter = c.y + c.height / 2;
    return Math.abs(carCenter - laneCenter) < lh * 0.6;
  });
}

function updatePileUps(state, _dtMs, cellW, cellH) {
  const now = state.runTimeMs || 0;
  const lanes = state.lanes || [];

  state.pileUps = (state.pileUps || []).filter((pile) => {
    if (pile.cleared) return false;
    if (!pile.towId) {
      if (now - pile.atMs >= PILEUP_CONFIG.towSpawnDelayMs) {
        const laneY = pile.y;
        let lane = lanes.find((l) => Math.abs(l.y - laneY) < cellH * 0.6);
        if (!lane) lane = lanes[0];
        const def = CAR_TYPES.truck;
        if (!def) return true;
        const width = def.widthCells * cellW;
        const height = def.heightCells * cellH;
        const lh = laneHeight(lane, cellH);
        const dir = lane.directionSign > 0 ? 1 : -1;
        const towGap = width * (MIN_GAP + 0.5);
        const existingTows = towsInLane(state, lane, cellH);
        let x = dir > 0 ? -width : GAME_CONFIG.width + width;
        if (existingTows.length > 0) {
          if (dir > 0) {
            const rearmost = existingTows.reduce((a, c) => (c.x < a.x ? c : a), existingTows[0]);
            x = Math.min(x, rearmost.x - width - towGap);
          } else {
            const rearmost = existingTows.reduce((a, c) => (c.x > a.x ? c : a), existingTows[0]);
            x = Math.max(x, rearmost.x + rearmost.width + width + towGap);
          }
        }
        const tow = {
          id: "tow_" + Math.random().toString(36).slice(2),
          type: "truck",
          spriteBase: PILEUP_CONFIG.towSpriteBase,
          nodriverKey: null,
          x,
          y: lane.y + (lh - height) * 0.5,
          width,
          height,
          speed: def.speed * 0.7,
          directionSign: dir,
          hitCooldownMs: 0,
          driverFlying: false,
          driverFlyX: 0,
          driverFlyY: 0,
          driverFlyVx: 0,
          driverSpriteKey: null,
          isTowTruck: true,
          pileUpId: pile.id,
        };
        state.cars.push(tow);
        pile.towId = tow.id;
      }
      return true;
    }
    const tow = state.cars.find((c) => c.id === pile.towId);
    if (!tow) {
      pile.cleared = true;
      const ids = new Set(pile.carIds || []);
      let lane = lanes.find((l) => Math.abs(l.y - pile.y) < cellH * 0.6);
      if (!lane) lane = lanes[0];
      const lh = laneHeight(lane, cellH);
      ids.forEach((id) => {
        const c = state.cars.find((car) => car.id === id);
        if (!c || c.isTowTruck) return;
        c.recovering = true;
        c.recoverUntil = now + 3000;
        c.recoverLaneY = lane.y;
        c.recoverLaneHeight = lh;
        c.recoverSpeed = (CAR_TYPES[c.type]?.speed ?? 100) * 0.8;
        c.speed = 0;
      });
      return false;
    }
    const pileCenterX = pile.x;
    const passed = (tow.directionSign > 0 && tow.x > pileCenterX + 60) || (tow.directionSign < 0 && tow.x < pileCenterX - 60);
    if (passed) {
      pile.cleared = true;
      const ids = new Set(pile.carIds || []);
      const lh = laneHeight(lane, cellH);
      ids.forEach((id) => {
        const c = state.cars.find((car) => car.id === id);
        if (!c || c.isTowTruck) return;
        c.recovering = true;
        c.recoverUntil = now + 3000;
        c.recoverLaneY = lane.y;
        c.recoverLaneHeight = lh;
        c.recoverSpeed = (CAR_TYPES[c.type]?.speed ?? 100) * 0.8;
        c.speed = 0;
      });
      state.cars = state.cars.filter((c) => !ids.has(c.id) || c.recovering);
      return false;
    }
    return true;
  });
}

/** True if deer is in any vehicle's path (same lane, x overlap). Drives horn loop per ASSET_AND_SYSTEM_RULES. */
export function isDeerInAnyCarPath(state, cellW, cellH) {
  const deerCenter = worldFromCell(state.deer.x, state.deer.y, cellW, cellH);
  return state.cars.some(
    (car) =>
      deerCenter.y >= car.y - 5 &&
      deerCenter.y <= car.y + car.height + 5 &&
      deerCenter.x >= car.x - 20 &&
      deerCenter.x <= car.x + car.width + 20
  );
}

/** Cars within close range of deer; used to trigger screech.mp3 (close collision warning). */
export function getCarsNearDeer(state, cellW, cellH, maxDist = 55) {
  const deerCenter = worldFromCell(state.deer.x, state.deer.y, cellW, cellH);
  return state.cars.filter((car) => {
    const cx = car.x + car.width / 2;
    const cy = car.y + car.height / 2;
    const d = Math.hypot(deerCenter.x - cx, deerCenter.y - cy);
    return d <= maxDist && d > state.deer.radius + 10;
  });
}

/**
 * Draw vehicles: moving right = _right (or base name if no _left/_right); moving left = _left.
 * Names Match: L→R = right in name, R→L = left in name; no suffix = going right.
 */
export function drawCars(ctx, state) {
  ctx.font = "15px Segoe UI Emoji, Arial";
  state.cars.forEach((car) => {
    const def = CAR_TYPES[car.type];
    if (!def) return;

    const movingRight = car.directionSign > 0;
    const dir = movingRight ? "right" : "left";
    const base = car.spriteBase || car.type;
    let spriteKey =
      car.driverFlying && car.type === "motorcycle" && car.nodriverKey
        ? car.nodriverKey
        : `${base}_${dir}`;
    let img = state.sprites && state.sprites[spriteKey];
    if (!img || !img.complete || !img.naturalWidth) {
      img = state.sprites && state.sprites[base];
      if (img && img.complete && img.naturalWidth > 0) spriteKey = base;
    }

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, car.x, car.y, car.width, car.height);
    } else {
      ctx.fillStyle = def.color;
      ctx.fillRect(car.x, car.y, car.width, car.height);
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(car.x + 3, car.y + 3, Math.max(6, car.width * 0.35), 5);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(def.emoji, car.x + 3, car.y + car.height - 4);
    }

    if (car.driverFlying && car.driverSpriteKey) {
      const flyImg = state.sprites && state.sprites[car.driverSpriteKey];
      if (flyImg && flyImg.complete && flyImg.naturalWidth > 0) {
        const w = car.width * 0.9;
        const h = car.height * 1.1;
        ctx.drawImage(flyImg, car.driverFlyX - w / 2, car.driverFlyY - h / 2, w, h);
      }
    }

    if (state.level.theme === "night") {
      ctx.fillStyle = "rgba(255,255,180,0.16)";
      const beamX = car.directionSign > 0 ? car.x + car.width : car.x;
      const sign = car.directionSign > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(beamX, car.y + car.height * 0.5);
      ctx.lineTo(beamX + sign * 120, car.y - 20);
      ctx.lineTo(beamX + sign * 120, car.y + car.height + 20);
      ctx.closePath();
      ctx.fill();
    }
  });
}
