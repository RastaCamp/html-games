import { CAR_TYPES, GAME_CONFIG } from "./config.js";

const FALLBACK_LEVEL = {
  levelId: 0,
  name: "Deer 101 (Fallback)",
  theme: "rural",
  background: {
    skyColor: "#87CEEB",
    groundColor: "#3CB371",
    weather: "clear",
    timeOfDay: "day",
  },
  lanes: [
    { type: "road", direction: "right", carDensity: 0.25, carTypes: ["sedan"], speedVariation: 0.12 },
    { type: "road", direction: "left", carDensity: 0.35, carTypes: ["sedan", "truck"], speedVariation: 0.2 },
    { type: "road", direction: "right", carDensity: 0.4, carTypes: ["sedan", "sports"], speedVariation: 0.25 },
  ],
  startPosition: { x: 10, y: 18 },
  exitPosition: { x: 10, y: 2 },
  obstacles: [],
};

/** Synchronous fallback when fetch is blocked (e.g. file://) or times out. */
export function getFallbackLevel() {
  return FALLBACK_LEVEL;
}

export async function loadLevel(path = "./assets/levels/tutorial.json") {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load level JSON: ${path}`);
    return response.json();
  } catch (_err) {
    return FALLBACK_LEVEL;
  }
}

const LANE_HEIGHT_MULT = 1.25;

export function buildLanePlan(levelData) {
  const cellH = GAME_CONFIG.height / GAME_CONFIG.rows;
  const laneHeight = cellH * LANE_HEIGHT_MULT;
  const lanes = levelData.lanes.map((lane, idx) => {
    const laneY = (idx + 4) * laneHeight;
    return {
      ...lane,
      y: laneY,
      laneHeight,
      directionSign: lane.direction === "left" ? -1 : 1,
      spawnTimer: 0,
      spawnEveryMs: Math.max(350, 1700 - lane.carDensity * 1200),
    };
  });
  return lanes;
}

export function pickCarType(carTypes = ["sedan"]) {
  const valid = carTypes.filter((k) => CAR_TYPES[k]);
  if (!valid.length) return "sedan";
  return valid[Math.floor(Math.random() * valid.length)];
}
