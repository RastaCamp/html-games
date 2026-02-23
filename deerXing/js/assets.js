/**
 * Sprite loader: assets/visuals/ (flat). Loads deer, vehicle variants (_left/_right), nodriver, driver_flying, items.
 */

import {
  ASSET_PATHS,
  DEER_SPRITE_KEYS,
  ITEM_SPRITE_KEYS,
  MOTORCYCLE_NODRIVER,
  VEHICLE_SPRITE_VARIANTS,
} from "./config.js";

const EXTENSIONS = [".png", ".PNG"];

function loadImage(basePath, name) {
  return new Promise((resolve) => {
    let idx = 0;
    const tryNext = () => {
      if (idx >= EXTENSIONS.length) {
        resolve(null);
        return;
      }
      const img = new Image();
      const path = `${basePath}${name}${EXTENSIONS[idx]}`;
      img.onload = () => resolve(img);
      img.onerror = () => { idx += 1; tryNext(); };
      img.src = path;
    };
    tryNext();
  });
}

/** All sprite keys we load: deer (buck_*), vehicle basename_left/right, nodriver motorcycles, driver_flying, items. */
function getAllSpriteKeysToLoad() {
  const keys = new Set();
  Object.values(DEER_SPRITE_KEYS).forEach((k) => keys.add(k));
  Object.values(VEHICLE_SPRITE_VARIANTS).forEach((arr) => {
    arr.forEach((base) => {
      keys.add(base);
      keys.add(`${base}_left`);
      keys.add(`${base}_right`);
    });
  });
  Object.values(MOTORCYCLE_NODRIVER).forEach((k) => keys.add(k));
  keys.add("driver_flying_left");
  keys.add("driver_flying_right");
  Object.values(ITEM_SPRITE_KEYS).forEach((k) => keys.add(k));
  keys.add("top_bushes_tile");
  keys.add("bottom_bushes_tile");
  return Array.from(keys);
}

/**
 * Load all sprites into state.sprites from assets/visuals/. Keys: buck_forward, gray_car_left, salt, etc.
 */
export async function loadAllSprites(state) {
  const base = ASSET_PATHS.visual;
  const map = {};
  const keys = getAllSpriteKeysToLoad();
  for (const key of keys) {
    map[key] = await loadImage(base, key);
  }
  state.sprites = map;
  return state.sprites;
}
