/**
 * GameAudio: wires all sound rules from docs/ASSET_AND_SYSTEM_RULES.md.
 * Names Match Everything: vehicle type (car/truck) selects folder and filename prefix.
 * Uses HTMLAudioElement for loop/volume/onended; falls back to silent or beep if assets missing.
 */

import { ASSET_PATHS, CAR_TYPES, INTRO_ASSETS, GAME_CONFIG, SOUND_MANIFEST } from "./config.js";

/** Pick a random filename from manifest for a category, or use first/default. */
function pickSoundFile(category) {
  const list = SOUND_MANIFEST[category];
  if (!list || !list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

/** Create an Audio element; returns null if path fails (caller can fallback). */
function createAudio(src, opts = {}) {
  try {
    const a = new Audio();
    a.volume = opts.volume ?? 0.5;
    a.loop = !!opts.loop;
    a.playbackRate = opts.playbackRate ?? 1;
    a.src = src;
    return a;
  } catch (_) {
    return null;
  }
}

/** Load and play one-shot; on ended or error run callback. */
function playOnce(basePath, filename, volume, onEnded) {
  const path = filename ? `${basePath}${filename}` : `${basePath}`;
  const a = createAudio(path, { volume });
  a.play().catch(() => {});
  a.onended = () => { if (onEnded) onEnded(); };
  a.onerror = () => { if (onEnded) onEnded(); };
  return a;
}

/** Legacy beep for when no assets or as fallback. */
function beep(ctx, freq, durationSec, type = "sine", gainValue = 0.05) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(gainValue, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + durationSec);
}

export class SimpleAudio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  unlock() {
    if (this.enabled) return;
    const AudioContextRef = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextRef) return;
    this.ctx = new AudioContextRef();
    this.enabled = true;
  }

  beep(freq, durationSec, type = "sine", gainValue = 0.05) {
    this.unlock();
    if (!this.ctx) return;
    beep(this.ctx, freq, durationSec, type, gainValue);
  }
}

/**
 * Full game audio: ambient, danger, level transitions, music, player, vehicles, horns, crash.
 * Call unlock() on first user interaction; then play* methods use ASSET_PATHS + SOUND_MANIFEST.
 */
export class GameAudio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.base = ASSET_PATHS.sound;
    this.tracksBase = ASSET_PATHS.soundTracks;
    this.carsBase = ASSET_PATHS.soundCars;
    this.trucksBase = ASSET_PATHS.soundTrucks;
    this.hornsBase = ASSET_PATHS.soundHorns;
    this.crashBase = ASSET_PATHS.soundCrash;
    this.screamsBase = ASSET_PATHS.soundScreams;

    // Channels we keep so we can stop/restart
    this.ambientEl = null;
    this.dangerEl = null;
    this.trackEl = null;
    this.walkingEl = null;
    this.hornEl = null;
    this.engineCarEl = null;
    this.engineTruckEl = null;

    this.currentTrackIndex = -1;
    this.vehicleSounds = new Map();
  }

  unlock() {
    if (this.enabled) return;
    const AudioContextRef = window.AudioContext || window.webkitAudioContext;
    if (AudioContextRef) this.ctx = new AudioContextRef();
    this.enabled = true;
  }

  _stop(el) {
    if (el && !el.paused) {
      el.pause();
      el.currentTime = 0;
    }
  }

  _playLoop(basePath, filename, volume = 0.4) {
    try {
      this.unlock();
      const path = filename ? `${basePath}${filename}` : basePath;
      const a = createAudio(path, { volume, loop: true });
      if (!a) return null;
      a.play().catch(() => {});
      return a;
    } catch (_) {
      return null;
    }
  }

  _playOnce(basePath, filename, volume = 0.5, onEnded) {
    try {
      this.unlock();
      const src = filename ? `${basePath}${filename}` : basePath;
      const a = createAudio(src, { volume });
      if (!a) return null;
      a.play().catch(() => {});
      a.onended = () => { if (onEnded) onEnded(); };
      a.onerror = () => { if (onEnded) onEnded(); };
      return a;
    } catch (_) {
      return null;
    }
  }

  // --- Background ---
  playAmbient() {
    try {
      this._stop(this.ambientEl);
      this.ambientEl = this._playLoop(this.base, "ambient.mp3", 0.35);
    } catch (_) {}
  }

  stopAmbient() {
    this._stop(this.ambientEl);
    this.ambientEl = null;
  }

  /** Call when timed level has 15s left; loops until time expires. */
  playDanger() {
    if (this.dangerEl && !this.dangerEl.paused) return;
    this._stop(this.dangerEl);
    this.dangerEl = this._playLoop(this.base, "danger.mp3", 0.45);
  }

  stopDanger() {
    this._stop(this.dangerEl);
    this.dangerEl = null;
  }

  // --- Level transitions ---
  /** Plays start_riff.mp3; when it ends, callback (e.g. start track + ambient). */
  playStartRiff(onEnded) {
    this._stop(this.trackEl);
    this._playOnce(this.base, "start_riff.mp3", 0.5, onEnded);
  }

  playLevelWin() {
    this._playOnce(this.base, "level_win.mp3", 0.55);
  }

  /** In-game music: random track from sounds/tracks/ (filenames with "track" in name). */
  playNextTrack() {
    try {
      this._stop(this.trackEl);
      const list = SOUND_MANIFEST.tracks;
      if (!list || !list.length) return;
      this.unlock();
      this.currentTrackIndex = Math.floor(Math.random() * list.length);
      const file = list[this.currentTrackIndex];
      const path = `${this.tracksBase}${file}`;
      const a = createAudio(path, { volume: 0.4, loop: true });
      if (!a) return;
      a.play().catch(() => {});
      this.trackEl = a;
    } catch (_) {}
  }

  stopTrack() {
    this._stop(this.trackEl);
    this.trackEl = null;
  }

  // --- Player ---
  playWalking() {
    if (this.walkingEl && !this.walkingEl.paused) return;
    this._stop(this.walkingEl);
    this.walkingEl = this._playLoop(this.base, "walking.mp3", 0.3);
  }

  stopWalking() {
    this._stop(this.walkingEl);
    this.walkingEl = null;
  }

  /** Deer scream: assets/sounds/screams/deer_scream.mp3 */
  playDeerScream() {
    this._playOnce(this.screamsBase, "deer_scream.mp3", 0.55);
  }

  /** Pickup collected (assets/sounds/item.mp3). */
  playItemPickup() {
    this._playOnce(this.base, "item.mp3", 0.4);
  }

  /** Intro sequence: play once from assets/sounds/ (INTRO_ASSETS.sound). Called on first key/click during intro. */
  playScurcrash() {
    try {
      this._playOnce(this.base, INTRO_ASSETS.sound, 0.5);
    } catch (_) {}
  }

  /** Per-vehicle engine sound: play when vehicle is on screen, stop when off. Random car or truck per vehicle. */
  syncVehicleSounds(cars) {
    const ids = new Set(cars.map((c) => c.id));
    this.vehicleSounds.forEach((obj, id) => {
      if (!ids.has(id)) {
        this._stop(obj.el);
        this.vehicleSounds.delete(id);
      }
    });
    cars.forEach((car) => {
      if (this.vehicleSounds.has(car.id)) return;
      const def = CAR_TYPES[car.type];
      if (!def) return;
      const isCar = def.soundKey === "car";
      const base = isCar ? this.carsBase : this.trucksBase;
      const spriteBase = (car.spriteBase || "").toLowerCase();
      const useFastCar = isCar && spriteBase.includes("fast");
      const category = useFastCar ? "fastCars" : (isCar ? "cars" : "trucks");
      const file = pickSoundFile(category) || (isCar ? "car.mp3" : "truck.mp3");
      const a = this._playLoop(base, file, isCar ? 0.22 : 0.25);
      if (!a) return;
      if (car.type === "motorcycle") a.playbackRate = 1.25;
      this.vehicleSounds.set(car.id, { el: a });
    });
  }

  // --- Horn: loop while deer in path; stop when leave/crash/exit. Caller starts/stops. ---
  playHorn() {
    if (this.hornEl && !this.hornEl.paused) return;
    this._stop(this.hornEl);
    const file = pickSoundFile("horns") || "horn1.mp3";
    this.hornEl = this._playLoop(this.hornsBase, file, 0.4);
  }

  stopHorn() {
    this._stop(this.hornEl);
    this.hornEl = null;
  }

  playScreech() {
    this._playOnce(this.base, "screech.mp3", 0.5);
  }

  /** Vehicle impact: random from crash/ folder. */
  playCrash() {
    const file = pickSoundFile("crash");
    if (file) this._playOnce(this.crashBase, file, 0.5);
  }

  /** Deer hit: deer_scream from screams/ + one other random from screams/ if available (avoid double deer_scream). */
  playCrashDeer() {
    try {
      this._playOnce(this.screamsBase, "deer_scream.mp3", 0.55);
      const file = pickSoundFile("screams");
      if (file && file !== "deer_scream.mp3") this._playOnce(this.screamsBase, file, 0.45);
    } catch (_) {}
  }

  /** Stop all loops and per-vehicle engine sounds. */
  stopAll() {
    this.stopAmbient();
    this.stopDanger();
    this.stopTrack();
    this.stopWalking();
    this.stopHorn();
    this.vehicleSounds.forEach((obj) => this._stop(obj.el));
    this.vehicleSounds.clear();
  }

  /** Fallback beep when no assets (e.g. hit). */
  beep(freq, durationSec, type = "sine", gainValue = 0.05) {
    this.unlock();
    if (!this.ctx) return;
    beep(this.ctx, freq, durationSec, type, gainValue);
  }
}
