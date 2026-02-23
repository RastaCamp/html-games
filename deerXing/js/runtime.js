import { ASSET_PATHS, GAME_CONFIG, INTRO_ASSETS, RICOCHET_CONFIG } from "./config.js";
import { buildLanePlan, getFallbackLevel, loadLevel } from "./level.js";
import { drawCars, getCarsNearDeer, isDeerInAnyCarPath, updateCars } from "./car.js";
import { applyDeerType, drawDeer, resetDeer, tryMove, updateDeerCollision, useAbility, worldFromCell } from "./deer.js";
import {
  drawCinematicBars,
  drawParticles,
  drawWeather,
  emitBurst,
  initWeather,
  updateParticles,
  updateWeather,
} from "./effects.js";
import { drawEndScene, drawIntroScene, drawMenuScene, drawTransitionScene } from "./scene.js";
import { drawDebugOverlay, drawHitboxes, teleportDeerFromPointer, toggleDebugFlag } from "./debug.js";
import { drawTutorialOverlay, startTutorial, stopTutorial, tutorialOnKey, updateTutorial } from "./tutorial.js";
import { GameAudio } from "./audio.js";
import { loadAllSprites } from "./assets.js";
import { drawItems, placeLevelItems, updateItems } from "./items.js";
import { loadHighScores, saveHighScore } from "./save.js";
import { resetPlayerStats } from "./state.js";
import { drawMeter } from "./ui.js";

export function createRuntime({
  ctx,
  hudText,
  audio,
  state,
  cellW,
  cellH,
  menuModes,
  psaTips,
  levelPaths,
  fixedTimestepMs,
}) {
  // Runtime = the stage manager. It yells cues while everyone else acts.
  let last = performance.now();
  let accumulator = 0;
  let fpsSampleMs = 0;
  let fpsFrames = 0;
  /** Intro: deer1.png (1s) then deer2.png, fade out, then menu. Loaded from assets/visuals/. */
  let introImages = { deer1: null, deer2: null };

  /** Load one image; tries each path in order (e.g. .PNG then .png for case-sensitive servers). */
  function loadImageWithFallback(paths) {
    return new Promise((resolve) => {
      let idx = 0;
      const tryNext = () => {
        if (idx >= paths.length) {
          resolve(null);
          return;
        }
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          idx += 1;
          tryNext();
        };
        img.src = paths[idx];
      };
      tryNext();
    });
  }

  /** Intro images: try .PNG, .png, .jpg from assets/visuals/ (see INTRO_ASSETS in config). */
  function getIntroImagePaths(name) {
    const base = ASSET_PATHS.visual;
    return [`${base}${name}.PNG`, `${base}${name}.png`, `${base}${name}.jpg`, `${base}${name}.jpeg`];
  }

  function transitionTo(label, onFinished) {
    // Cinematic transition: the classy way to hide setup work.
    state.scene = "transition";
    state.sceneTimerMs = 0;
    state.transitionAlpha = 0;
    state.transitionLabel = label;
    state.transitionNext = onFinished;
  }

  function loadStage(index, asPlayingScene) {
    audio.stopDanger();
    state.levelIndex = index;
    state.level = state.levels[index];
    state.lanes = buildLanePlan(state.level);
    if (state.mode === "tutorial") {
      state.lanes.forEach((lane) => {
        lane.carDensity = Math.min(lane.carDensity, 0.14);
        lane.spawnEveryMs = Math.max(900, lane.spawnEveryMs);
      });
    }
    state.cars = [];
    state.particles = [];
    state.ricochetCount = 0;
    state.hitsThisLevel = 0;
    state.levelStartTimeMs = state.runTimeMs || 0;
    state.timedLevelSeconds = state.level?.timedSeconds ?? 0;
    initWeather(state, 80);
    applyDeerType(state, state.deerType);
    resetDeer(state);
    placeLevelItems(state, cellW, cellH);
    if (asPlayingScene) {
      state.scene = "playing";
      state.pileUps = [];
      try {
        audio.unlock();
        audio.playNextTrack();
        audio.playAmbient();
      } catch (_) {}
      audio.playStartRiff(() => {});
    }
  }

  function startRun(modeKey = "classic", options = {}) {
    state.mode = modeKey;
    state.levelIndex = 0;
    state.score = 0;
    state.deaths = 0;
    state.steps = 0;
    state.laneCrosses = 0;
    state.pileups = 0;
    state.closeCalls = 0;
    state.combo = 1;
    state.chaos = 0;
    state.runTimeMs = 0;
    state.startTime = performance.now();
    resetPlayerStats(state, true);
    state.items = [];
    audio.stopAll();
    if (modeKey === "tutorial") startTutorial(state, { forceFullReplay: options.forceTutorialReplay === true });
    else stopTutorial(state);
    const startStage = () => transitionTo("Entering Stage 1", () => loadStage(0, true));
    if (state.spritesLoadPromise) {
      state.spritesLoadPromise.then(startStage).catch(startStage);
    } else {
      startStage();
    }
  }

  function onHit(car, deerCenter) {
    try {
      if (state.debug.invincible) {
        emitBurst(state, deerCenter.x, deerCenter.y, "#f2cc60", 6);
        return;
      }
      if (state.invincibleUntil > performance.now()) {
        emitBurst(state, deerCenter.x, deerCenter.y, "#79c0ff", 4);
        return;
      }
      if (state.tutorial.active) {
        emitBurst(state, deerCenter.x, deerCenter.y, "#f2cc60", 12);
        resetDeer(state);
        return;
      }

      state.hitsThisLevel += 1;

      if (car.type === "motorcycle") {
        state.health = Math.max(0, state.health - RICOCHET_CONFIG.healthChunkMotorcycle);
        car.driverFlying = true;
        car.driverFlyX = car.x + car.width / 2;
        car.driverFlyY = car.y + car.height / 2;
        car.driverFlyVx = car.directionSign * 220;
        car.driverSpriteKey = car.directionSign > 0 ? "driver_flying_right" : "driver_flying_left";
        safePlay(() => audio.playCrashDeer());
        state.flashMs = 180;
        state.shakeMs = 150;
        state.shakePower = 4;
        if (GAME_CONFIG.bloodEnabled) emitBurst(state, deerCenter.x, deerCenter.y, "#ff4d4d", 18);
        else emitBurst(state, deerCenter.x, deerCenter.y, "#e3b341", 12);
        if (state.health <= 0) {
          state.deaths += 1;
          state.lives -= 1;
          state.combo = 1;
          state.score -= 1000;
          if (state.lives <= 0) {
            state.scene = "gameover";
            state.sceneTimerMs = 0;
            safePlay(() => audio.stopAll());
            return;
          }
          resetDeer(state);
        }
        return;
      }

      if (state.ricochetCount < state.maxRicochets) {
        state.ricochetCount += 1;
        safePlay(() => audio.playCrash());
        const dx = state.deer.x - (car.x + car.width / 2) / cellW;
        const bump = Math.sign(dx) || 1;
        state.deer.x = Math.max(0, Math.min(GAME_CONFIG.cols - 1, state.deer.x + bump * 2));
        emitBurst(state, deerCenter.x, deerCenter.y, "#f2cc60", 10);
        return;
      }

      state.health = 0;
      state.deaths += 1;
      state.lives -= 1;
      state.combo = 1;
      state.score -= 1000;
      state.flashMs = 250;
      state.shakeMs = 220;
      state.shakePower = 6;
      state.slowMoMs = 220;
      safePlay(() => audio.playCrashDeer());

      if (GAME_CONFIG.bloodEnabled) emitBurst(state, deerCenter.x, deerCenter.y, "#ff4d4d", 28);
      else emitBurst(state, deerCenter.x, deerCenter.y, "#e3b341", 18);

      if (car.type === "truck") {
        state.deer.x = Math.max(0, Math.min(GAME_CONFIG.cols - 1, state.deer.x + (Math.random() > 0.5 ? 2 : -2)));
      }
      if (state.mode === "rampage") state.chaos += 250;
      if (state.debug.logCollisions) {
        console.log(`[collision] deer hit by ${car.type} @ (${deerCenter.x.toFixed(1)}, ${deerCenter.y.toFixed(1)})`);
      }

      if (state.lives <= 0) {
        state.scene = "gameover";
        state.sceneTimerMs = 0;
        safePlay(() => audio.stopAll());
        return;
      }
      resetDeer(state);
    } catch (err) {
      console.error("Deer Xing onHit error:", err);
    }
  }

  function safePlay(fn) {
    try {
      audio.unlock();
      if (typeof fn === "function") fn();
    } catch (_) {}
  }

  function onNearMiss(deerCenter) {
    state.closeCalls += 1;
    state.score += 60;
    state.combo = Math.min(5, state.combo + 0.04);
    emitBurst(state, deerCenter.x, deerCenter.y, "#79c0ff", 2);
  }

  function onDeerMoved(_nextX, _nextY) {
    state.steps += 1;
    audio.beep(420, 0.04, "triangle", 0.03);
  }

  function onPileup(state, carA, carB, x, y) {
    state.pileups += 1;
    state.chaos += 300;
    if (!state.pileUps) state.pileUps = [];
    state.pileUps.push({
      id: "pile_" + Math.random().toString(36).slice(2),
      x,
      y,
      atMs: state.runTimeMs,
      carIds: [carA.id, carB.id],
    });
    emitBurst(state, x, y, "#ffa657", 16);
    audio.beep(220, 0.08, "square", 0.05);
  }

  function updatePlaying(dtMs) {
    state.deerJustMoved = false;
    state.runTimeMs += dtMs;
    state.skyOffset += dtMs * 0.01;
    state.screechCooldownMs = Math.max(0, (state.screechCooldownMs || 0) - dtMs);

    updateCars(state, dtMs, cellW, cellH, onPileup, state.debug.spawnCars);
    updateDeerCollision(state, cellW, cellH, onHit, onNearMiss);

    const itemPoints = updateItems(state, cellW, cellH);
    if (itemPoints > 0) {
      state.score += itemPoints;
      audio.playItemPickup();
    }

    updateParticles(state, dtMs);
    updateWeather(state, state.level, dtMs);
    if (state.tutorial.active) updateTutorial(state);

    // Walking sound: only while deer is moving (arrow keys) per ASSET_AND_SYSTEM_RULES.
    if (state.deerJustMoved) audio.playWalking();
    else audio.stopWalking();

    if (isDeerInAnyCarPath(state, cellW, cellH)) audio.playHorn();
    else audio.stopHorn();

    const near = getCarsNearDeer(state, cellW, cellH);
    if (near.length > 0 && state.screechCooldownMs <= 0) {
      state.screechCooldownMs = 600;
      audio.playScreech();
    }

    audio.syncVehicleSounds(state.cars);

    if (state.timedLevelSeconds >= 15 && state.runTimeMs - state.levelStartTimeMs >= (state.timedLevelSeconds - 15) * 1000) {
      audio.playDanger();
    } else {
      audio.stopDanger();
    }

    const advancedRows = Math.max(0, state.prevDeerY - state.deer.y);
    if (advancedRows > 0) state.laneCrosses += advancedRows;
    state.prevDeerY = state.deer.y;

    if (state.mode === "tutorial" && !state.tutorial.active) {
      state.scene = "victory";
      state.sceneTimerMs = 0;
      audio.stopAll();
      audio.playLevelWin();
      return;
    }
    const exitY = state.level?.exitPosition?.y ?? 2;
    if (state.mode === "classic" && state.level?.exitPosition != null && state.deer.y <= exitY) {
      const hitPenalty = 1 - state.hitsThisLevel * 0.15;
      state.score += Math.floor(1500 * state.combo * Math.max(0.2, hitPenalty));
      audio.stopDanger();
      audio.playLevelWin();
      const next = state.levelIndex + 1;
      if (next >= state.levels.length) {
        state.scene = "victory";
        state.sceneTimerMs = 0;
        saveHighScore(state.score, state.mode);
      } else {
        transitionTo(`Stage ${next + 1}`, () => loadStage(next, true));
      }
    }
    if (state.mode === "survival" && state.runTimeMs >= 90000) {
      state.scene = "victory";
      state.sceneTimerMs = 0;
      audio.stopAll();
      saveHighScore(state.score, state.mode);
    }
    if (state.mode === "rampage" && state.chaos >= 3000) {
      state.scene = "victory";
      state.sceneTimerMs = 0;
      audio.stopAll();
      saveHighScore(state.score, state.mode);
    }
  }

  function drawSkyAndGround() {
    const level = state.level;
    if (!level) return;
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.height);
    gradient.addColorStop(0, level.background?.skyColor || "#87CEEB");
    gradient.addColorStop(0.46, level.background?.groundColor || "#3CB371");
    gradient.addColorStop(1, "#1f3a2e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    const topTile = state.sprites?.top_bushes_tile;
    const bottomTile = state.sprites?.bottom_bushes_tile;
    if (topTile && topTile.complete && topTile.naturalWidth > 0) {
      ctx.drawImage(topTile, 0, 0, GAME_CONFIG.width, cellH);
    }
    if (bottomTile && bottomTile.complete && bottomTile.naturalWidth > 0) {
      ctx.drawImage(bottomTile, 0, GAME_CONFIG.height - cellH, GAME_CONFIG.width, cellH);
    }
  }

  function drawLanes() {
    state.lanes.forEach((lane) => {
      const lh = lane.laneHeight || cellH;
      ctx.fillStyle = lane.type === "median" ? "#6e7681" : "#2d333b";
      ctx.fillRect(0, lane.y, GAME_CONFIG.width, lh);
      if (lane.type === "road") {
        ctx.fillStyle = "rgba(255,255,255,0.36)";
        for (let i = 0; i < GAME_CONFIG.cols; i += 2) {
          ctx.fillRect(i * cellW + 4, lane.y + lh / 2 - 1, cellW - 8, 2);
        }
      }
    });
  }

  function drawGrid() {
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    for (let x = 0; x <= GAME_CONFIG.cols; x += 1) {
      const px = x * cellW;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, GAME_CONFIG.height);
      ctx.stroke();
    }
    for (let y = 0; y <= GAME_CONFIG.rows; y += 1) {
      const py = y * cellH;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(GAME_CONFIG.width, py);
      ctx.stroke();
    }
  }

  function drawPlayingScene() {
    const level = state.level;
    if (!level) return;
    drawSkyAndGround();
    drawLanes();
    drawItems(ctx, state);
    drawCars(ctx, state);
    drawDeer(ctx, state, cellW, cellH);
    drawParticles(ctx, state);
    drawWeather(ctx, state, level);
    drawHitboxes(ctx, state, cellW, cellH);
    if (state.flashMs > 0) {
      ctx.fillStyle = "rgba(255,40,40,0.18)";
      ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    }
    // HUD meters: health, energy, speed (ASSET_AND_SYSTEM_RULES).
    const mY = 8;
    const mW = 80;
    const mH = 10;
    const mGap = 4;
    drawMeter(ctx, 10, mY, mW, mH, state.health, state.maxHealth, "#f85149", "rgba(0,0,0,0.5)");
    drawMeter(ctx, 10 + mW + mGap, mY, mW, mH, state.energy, state.maxEnergy, "#58a6ff", "rgba(0,0,0,0.5)");
    drawMeter(ctx, 10 + (mW + mGap) * 2, mY, mW, mH, state.speedMultiplier, 2, "#7ee787", "rgba(0,0,0,0.5)");
  }

  let hudUpdateAt = 0;
  function updateHud() {
    if (state.scene === "menu") {
      hudText.textContent = `Mode: ${menuModes[state.menuIndex].label} | Deer: ${state.deerType} | Blood: ${GAME_CONFIG.bloodEnabled ? "ON" : "OFF"}`;
      return;
    }
    if (state.scene === "intro") {
      hudText.textContent = "Cinematic Intro";
      return;
    }
    if (state.scene === "gameover" || state.scene === "victory") {
      hudText.textContent = state.scene === "victory" ? "Run Complete" : "Game Over";
      return;
    }
    if (state.mode === "tutorial" && state.tutorial?.active) {
      hudText.textContent = `Tutorial | ${state.tutorial.stepTitle || "—"} | Deer: ${state.deerType}`;
      return;
    }
    if (state.debug.enabled) {
      const fpsLabel = state.debug.showFPS ? (state.debug.fps || 0).toFixed(1) : "hidden";
      hudText.textContent =
        `DEBUG | FPS: ${fpsLabel} | Invincible: ${state.debug.invincible ? "ON" : "OFF"} | ` +
        `SpawnCars: ${state.debug.spawnCars ? "ON" : "OFF"} | Teleport: ${state.debug.teleport ? "ON" : "OFF"}`;
      return;
    }
    const now = performance.now();
    if (now - hudUpdateAt < 150) return;
    hudUpdateAt = now;
    const levels = state.levels || [];
    const runtime = ((state.runTimeMs || 0) / 1000).toFixed(1);
    hudText.textContent =
      `Score: ${Math.floor(state.score)} | Lives: ${state.lives} | Stage: ${(state.levelIndex || 0) + 1}/${levels.length} | Time: ${runtime}s`;
  }

  function handleKey(key, event) {
    audio.unlock();
    if (state.scene === "intro" && !state.introSoundPlayed) {
      state.introSoundPlayed = true;
      audio.playScurcrash();
    }
    if (key === "f1" && event) event.preventDefault();
    if (event && [" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) event.preventDefault();
    toggleDebugFlag(state, key);
    tutorialOnKey(state, key);
    if (key === "b") GAME_CONFIG.bloodEnabled = !GAME_CONFIG.bloodEnabled;
    if (key === "1") applyDeerType(state, "buck");
    if (key === "2") applyDeerType(state, "doe");

    if (state.scene === "intro" && (key === "enter" || key === " ")) {
      state.scene = "menu";
      state.sceneTimerMs = 0;
      return;
    }
    if (state.scene === "menu") {
      if (key === "arrowup" || key === "w") state.menuIndex = (state.menuIndex + menuModes.length - 1) % menuModes.length;
      if (key === "arrowdown" || key === "s") state.menuIndex = (state.menuIndex + 1) % menuModes.length;
      if (key === "enter") {
        audio.beep(520, 0.08, "triangle", 0.06);
        try {
          audio.unlock();
          audio.playNextTrack();
          audio.playAmbient();
        } catch (_) {}
        startRun(menuModes[state.menuIndex].key, { forceTutorialReplay: event?.shiftKey === true });
      }
      return;
    }
    if (state.scene === "gameover" || state.scene === "victory") {
      if (key === "enter") {
        state.scene = "menu";
        state.sceneTimerMs = 0;
        return;
      }
      if (key === "r") {
        startRun(state.mode);
        return;
      }
    }

    if (key === "p" && state.scene === "playing") state.scene = "paused";
    else if (key === "p" && state.scene === "paused") state.scene = "playing";
    if (key === "r" && state.scene === "playing") startRun(state.mode);
    if (key === " ") {
      useAbility(state, cellW, cellH, (x, y, color, count) => emitBurst(state, x, y, color, count), () => {
        audio.beep(280, 0.09, "square", 0.05);
      });
    }
    if (state.scene === "playing") {
      if (key === "arrowup" || key === "w") tryMove(state, 0, -1, performance.now(), onDeerMoved);
      if (key === "arrowdown" || key === "s") tryMove(state, 0, 1, performance.now(), onDeerMoved);
      if (key === "arrowleft" || key === "a") tryMove(state, -1, 0, performance.now(), onDeerMoved);
      if (key === "arrowright" || key === "d") tryMove(state, 1, 0, performance.now(), onDeerMoved);
    }
  }

  function handlePointer(event) {
    audio.unlock();
    if (state.scene === "intro" && !state.introSoundPlayed) {
      state.introSoundPlayed = true;
      audio.playScurcrash();
    }
    if (event) teleportDeerFromPointer(state, ctx.canvas, event);
  }

  function update(dtMs) {
    state.sceneTimerMs += dtMs;
    state.flashMs = Math.max(0, state.flashMs - dtMs);
    state.shakeMs = Math.max(0, state.shakeMs - dtMs);
    state.slowMoMs = Math.max(0, state.slowMoMs - dtMs);
    state.skyOffset += dtMs * 0.02;
    if (state.sceneTimerMs > 2800) {
      state.tipIndex = (state.tipIndex + 1) % psaTips.length;
      state.sceneTimerMs = state.scene === "intro" ? state.sceneTimerMs : 0;
    }

    if (state.scene === "intro") {
      if (state.sceneTimerMs >= 0 && !state.introSoundPlayed) {
        state.introSoundPlayed = true;
        safePlay(() => audio.playScurcrash());
      }
      if (state.sceneTimerMs > 4500) {
        state.scene = "menu";
        state.sceneTimerMs = 0;
      }
      return;
    }
    if (state.scene === "transition") {
      state.transitionAlpha = Math.sin(Math.min(1, state.sceneTimerMs / 1100) * Math.PI);
      if (state.sceneTimerMs > 1100 && state.transitionNext) {
        const next = state.transitionNext;
        state.transitionNext = null;
        next();
        state.sceneTimerMs = 0;
      }
      return;
    }
    if (state.scene === "playing") {
      const speedScale = state.slowMoMs > 0 ? 0.45 : 1;
      updatePlaying(dtMs * speedScale);
    }
  }

  function draw() {
    const shakeX = state.shakeMs > 0 ? (Math.random() * 2 - 1) * state.shakePower : 0;
    const shakeY = state.shakeMs > 0 ? (Math.random() * 2 - 1) * state.shakePower : 0;
    ctx.save();
    ctx.translate(shakeX, shakeY);

    if (state.scene === "intro") drawIntroScene(ctx, state, GAME_CONFIG.width, GAME_CONFIG.height, psaTips, introImages);
    else if (state.scene === "menu") drawMenuScene(ctx, state, GAME_CONFIG.width, GAME_CONFIG.height, menuModes);
    else if (state.scene === "transition") drawTransitionScene(ctx, state, GAME_CONFIG.width, GAME_CONFIG.height, drawPlayingScene);
    else if (state.scene === "playing" || state.scene === "paused") {
      drawPlayingScene();
      if (state.scene === "paused") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 46px Segoe UI, Arial";
        ctx.fillText("PAUSED", GAME_CONFIG.width / 2, GAME_CONFIG.height / 2);
        ctx.textAlign = "start";
      }
    } else if (state.scene === "gameover") {
      drawEndScene(ctx, state, GAME_CONFIG.width, GAME_CONFIG.height, "gameover", drawPlayingScene);
    } else if (state.scene === "victory") {
      drawEndScene(ctx, state, GAME_CONFIG.width, GAME_CONFIG.height, "victory", drawPlayingScene);
    } else {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    }

    drawCinematicBars(ctx, state.scene);
    drawTutorialOverlay(ctx, state, GAME_CONFIG.width, GAME_CONFIG.height);
    drawDebugOverlay(ctx, state);
    ctx.restore();
  }

  function frame(now) {
    const dt = Math.min(100, now - last);
    last = now;
    accumulator += dt;
    while (accumulator >= fixedTimestepMs) {
      try {
        update(fixedTimestepMs);
      } catch (err) {
        console.error("Deer Xing update error:", err);
      }
      accumulator -= fixedTimestepMs;
    }
    try {
      draw();
      updateHud();
    } catch (err) {
      console.error("Deer Xing draw error:", err);
    }
    fpsSampleMs += dt;
    fpsFrames += 1;
    if (fpsSampleMs >= 250) {
      state.debug.fps = (fpsFrames * 1000) / fpsSampleMs;
      fpsSampleMs = 0;
      fpsFrames = 0;
    }
    requestAnimationFrame(frame);
  }

  function loadIntroImagesAndLevelsInBackground() {
    loadImageWithFallback(getIntroImagePaths(INTRO_ASSETS.image1)).then((img) => {
      introImages.deer1 = img;
    });
    loadImageWithFallback(getIntroImagePaths(INTRO_ASSETS.image2)).then((img) => {
      introImages.deer2 = img;
    });
    Promise.all(levelPaths.map((path) => loadLevel(path).catch(() => null))).then((loaded) => {
      const list = loaded.filter(Boolean);
      if (list.length) state.levels = list;
    });
    state.spritesLoadPromise = loadAllSprites(state).catch(() => {});
  }

  function init() {
    state.scene = "boot";
    state.highScores = loadHighScores();
    hudText.textContent = "Loading...";

    state.levels = [getFallbackLevel()];
    applyDeerType(state, "buck");
    loadStage(0, false);
    state.scene = "intro";
    state.sceneTimerMs = 0;

    if (typeof requestAnimationFrame !== "undefined") {
      requestAnimationFrame(() => loadIntroImagesAndLevelsInBackground());
    } else {
      setTimeout(() => loadIntroImagesAndLevelsInBackground(), 0);
    }

    return Promise.resolve();
  }

  function start() {
    last = performance.now();
    accumulator = 0;
    requestAnimationFrame(frame);
  }

  return { init, start, handleKey, handlePointer };
}
