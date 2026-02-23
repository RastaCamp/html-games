import { GAME_CONFIG } from "./config.js";
import { GameAudio } from "./audio.js";
import { bindInput } from "./input.js";
import { createRuntime } from "./runtime.js";
import { createInitialState, FIXED_TIMESTEP_MS, LEVEL_PATHS, MENU_MODES, PSA_TIPS } from "./state.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const hudText = document.getElementById("hudText");

const cellW = GAME_CONFIG.width / GAME_CONFIG.cols;
const cellH = GAME_CONFIG.height / GAME_CONFIG.rows;

const state = createInitialState();
/** Full sound system per docs/ASSET_AND_SYSTEM_RULES.md; falls back to beep if assets missing. */
const audio = new GameAudio();

const runtime = createRuntime({
  ctx,
  hudText,
  audio,
  state,
  cellW,
  cellH,
  menuModes: MENU_MODES,
  psaTips: PSA_TIPS,
  levelPaths: LEVEL_PATHS,
  fixedTimestepMs: FIXED_TIMESTEP_MS,
});

bindInput({
  onKey: (key, event) => runtime.handleKey(key, event),
  onPointer: (event) => runtime.handlePointer(event),
});

canvas.setAttribute("tabindex", "0");
canvas.addEventListener("click", () => canvas.focus());

runtime
  .init()
  .then(() => runtime.start())
  .catch((err) => {
    hudText.textContent = `Init failed: ${err.message}`;
    console.error("Deer Xing init failed", err);
  });
