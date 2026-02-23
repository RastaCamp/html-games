// save.js
// Purpose: save and load persistent player data (progress, high scores).
// If data shape changes in future, bump SAVE_VERSION and migrate.

const SAVE_KEY = "deerXingSave";
const HIGH_SCORES_KEY = "deerXingHighScores";
const MAX_HIGH_SCORES = 10;
const SAVE_VERSION = 1;

export function saveGame(payload) {
  const wrapped = {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    payload,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(wrapped));
}

export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== SAVE_VERSION) return migrateSave(parsed);
    return parsed.payload ?? null;
  } catch (_err) {
    return null;
  }
}

function migrateSave(oldSave) {
  if (!oldSave || typeof oldSave !== "object") return null;
  return oldSave.payload ?? null;
}

/** Load top scores (score desc). Shape: [{ score, mode, timestamp }]. */
export function loadHighScores() {
  const raw = localStorage.getItem(HIGH_SCORES_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.slice(0, MAX_HIGH_SCORES);
  } catch (_err) {
    return [];
  }
}

/** Append a score if it qualifies; keep top MAX_HIGH_SCORES; persist. */
export function saveHighScore(score, mode = "classic") {
  const list = loadHighScores();
  list.push({ score: Math.floor(score), mode, timestamp: Date.now() });
  list.sort((a, b) => b.score - a.score);
  const top = list.slice(0, MAX_HIGH_SCORES);
  localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(top));
  return top;
}
