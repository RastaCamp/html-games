/**
 * Intro sequence: deer1.png (1s) → deer2.png → fade out → menu.
 * Assets from assets/visuals/ (deer1.png, deer2.png). scurcrash.mp3 plays when intro starts (runtime).
 */
const INTRO_DEER1_SEC = 1;
const INTRO_FADE_START_SEC = 3.5;
const INTRO_FADE_DURATION_SEC = 1;

export function drawIntroScene(ctx, state, width, height, psaTips, introImages = {}) {
  const t = state.sceneTimerMs / 1000;

  const showDeer1 = t < INTRO_DEER1_SEC;
  const activeImage = showDeer1 ? introImages.deer1 : introImages.deer2;
  const fadeOut =
    t >= INTRO_FADE_START_SEC ? Math.min(1, (t - INTRO_FADE_START_SEC) / INTRO_FADE_DURATION_SEC) : 0;

  ctx.fillStyle = "#0a0e14";
  ctx.fillRect(0, 0, width, height);

  const skyAlpha = 0.12 + Math.sin(t * 1.5) * 0.04;
  ctx.fillStyle = `rgba(88,166,255,${skyAlpha})`;
  ctx.fillRect(0, 0, width, height);

  if (activeImage && activeImage.complete && activeImage.naturalWidth > 0) {
    const maxW = width * 0.55;
    const maxH = height * 0.6;
    const scale = Math.min(maxW / activeImage.naturalWidth, maxH / activeImage.naturalHeight);
    const drawW = activeImage.naturalWidth * scale;
    const drawH = activeImage.naturalHeight * scale;
    const x = (width - drawW) / 2;
    const y = (height - drawH) / 2 - 10;
    ctx.drawImage(activeImage, x, y, drawW, drawH);
  } else {
    const label = showDeer1 ? "deer1.png not found" : "deer2.png not found";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.textAlign = "center";
    ctx.font = "bold 28px Segoe UI, Arial";
    ctx.fillText(label, width / 2, height / 2);
    ctx.textAlign = "start";
  }

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.textAlign = "center";
  ctx.font = "18px Segoe UI, Arial";
  ctx.fillText("Press Enter to skip", width / 2, 550);
  if (t > INTRO_DEER1_SEC + 0.3 && psaTips && psaTips[state.tipIndex]) {
    ctx.font = "14px Segoe UI, Arial";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(psaTips[state.tipIndex], width / 2, 30);
  }
  ctx.textAlign = "start";

  if (fadeOut > 0) {
    ctx.fillStyle = `rgba(0,0,0,${fadeOut})`;
    ctx.fillRect(0, 0, width, height);
  }
}

export function drawMenuScene(ctx, state, width, height, menuModes) {
  ctx.fillStyle = "#101926";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(121,192,255,0.15)";
  for (let i = 0; i < 24; i += 1) {
    const x = (i * 83 + state.skyOffset * 2) % (width + 140) - 70;
    const y = 40 + (i * 29) % 320;
    ctx.fillRect(x, y, 70, 2);
  }

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 52px Segoe UI, Arial";
  ctx.fillText("DEER XING", width / 2, 150);
  ctx.font = "24px Segoe UI, Arial";
  ctx.fillStyle = "#9fd7ff";
  ctx.fillText("Select Mode", width / 2, 200);

  menuModes.forEach((mode, idx) => {
    const y = 270 + idx * 56;
    const active = idx === state.menuIndex;
    ctx.fillStyle = active ? "#7ee787" : "#c9d1d9";
    ctx.font = active ? "bold 30px Segoe UI, Arial" : "26px Segoe UI, Arial";
    let label = mode.label;
    if (mode.key === "tutorial" && state.tutorial?.completed) {
      label = `${label} - Complete`;
    }
    ctx.fillText(`${active ? ">" : " "} ${label}`, width / 2, y);
  });

  const topScore = state.highScores && state.highScores.length ? state.highScores[0].score : 0;
  ctx.font = "18px Segoe UI, Arial";
  ctx.fillStyle = "#f2cc60";
  ctx.fillText(`High Score: ${topScore}`, width / 2, 490);
  ctx.fillStyle = "#8b949e";
  ctx.fillText("Arrow keys to choose. Enter to start.", width / 2, 520);
  ctx.fillText("Tutorial replay: Shift+Enter. Deer swap: 1/2.", width / 2, 548);
  ctx.textAlign = "start";
}

export function drawTransitionScene(ctx, state, width, height, drawPlayingScene) {
  drawPlayingScene();
  ctx.fillStyle = `rgba(0,0,0,${Math.min(0.8, state.transitionAlpha)})`;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = `rgba(255,255,255,${Math.min(1, state.transitionAlpha * 1.4)})`;
  ctx.textAlign = "center";
  ctx.font = "bold 42px Segoe UI, Arial";
  ctx.fillText(state.transitionLabel, width / 2, height / 2);
  ctx.font = "20px Segoe UI, Arial";
  ctx.fillText(state.level ? state.level.name : "Loading...", width / 2, height / 2 + 40);
  ctx.textAlign = "start";
}

export function drawEndScene(ctx, state, width, height, kind, drawPlayingScene) {
  if (state.level) drawPlayingScene();
  ctx.fillStyle = "rgba(0,0,0,0.62)";
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 54px Segoe UI, Arial";
  ctx.fillText(kind === "victory" ? "Run Complete" : "Game Over", width / 2, 220);
  ctx.font = "24px Segoe UI, Arial";
  ctx.fillStyle = "#7ee787";
  ctx.fillText(`Final Score: ${Math.floor(state.score)}`, width / 2, 288);
  ctx.fillStyle = "#c9d1d9";
  ctx.fillText("Press Enter for menu | Press R to restart", width / 2, 350);
  ctx.textAlign = "start";
}
