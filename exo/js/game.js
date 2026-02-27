// ═══════════════════════════════════════════════════════════════════════════════
// IRON COLISEUM BRAWLER – MAIN GAME LOOP
// ═══════════════════════════════════════════════════════════════════════════════
// 60 FPS fixed timestep. update() runs Screens.update; when playing, updatePlaying
// runs arena, players, combat. render() draws the current screen or the fight.
// M = main menu from fight. Esc/P = pause.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let lastTime = 0;
let accumulator = 0;
// Edge detection: we only want "just pressed" for attacks, so we store previous frame.
let prevP1 = { left: false, right: false, light: false, heavy: false, special: false, grab: false, dash: false };
let prevP2 = { left: false, right: false, light: false, heavy: false, special: false, grab: false, dash: false };

const Game = {
  cpuMode: false,  // true when 1 vs CPU or story (P2 input comes from CPU)
  fightIntroPhase: null,  // "round" | "fight" | null when done
  fightIntroTimer: 0,

  init() {
    if (typeof Assets !== "undefined") Assets.init();
    Input.init();
    Arena.init();
    Players.init();
    Combat.init();
    Weather.init();
    Screens.init();
  },

  // Start a match with default Warden vs Rae. modeId = "cpu" | "standard" etc.
  startMatch(modeId) {
    if (typeof Assets !== "undefined") {
      Assets.stopTitleTrack();
      if (Assets.startBattleTracks) Assets.startBattleTracks();
    }
    Arena.init();
    Players.init();
    Combat.init();
    Weather.init();
    this.cpuMode = modeId === "cpu";
    if (this.cpuMode && typeof CPU !== "undefined") CPU.init();
  },

  // Start a match with specific character configs (from character select / story).
  startMatchWithCharacters(modeId, p1Config, p2Config) {
    if (typeof Assets !== "undefined") {
      Assets.stopTitleTrack();
      if (Assets.startBattleTracks) Assets.startBattleTracks();
    }
    Arena.init();
    Players.init(p1Config || (typeof WARDEN !== "undefined" ? WARDEN : null), p2Config || (typeof RAE !== "undefined" ? RAE : null));
    Combat.init();
    Weather.init();
    this.cpuMode = modeId === "cpu" || modeId === "story";
    if (this.cpuMode && typeof CPU !== "undefined") CPU.init();
  },
};

function updatePlaying(dt) {
  const now = performance.now();
  const inputP1 = Input.getP1();
  const inputP2 = Game.cpuMode && typeof CPU !== "undefined" ? CPU.getInput() : Input.getP2();

  if (Screens.paused) {
    if (Input.isDown("Escape")) {
      Screens.paused = false;
      return;
    }
    Screens.updatePause(dt);
    return;
  }

  if (Input.isDown("Escape") || Input.isDown("KeyP")) {
    Screens.paused = true;
    Screens.pauseCooldown = 0.25;
    return;
  }
  // M = bail to main menu (stops fight music, restarts title track).
  if (Input.isDown("KeyM")) {
    Screens.state = "mainMenu";
    Screens.menuEnterCooldown = 0.3;
    Screens.storyMode = false;
    Screens.storyPhase = "warden";
    Screens.storyComplete = false;
    if (typeof Assets !== "undefined") {
      if (Assets.stopBattleTracks) Assets.stopBattleTracks();
      if (Assets.playTitleTrack) Assets.playTitleTrack();
    }
    return;
  }

  if (Game.fightIntroPhase) {
    Game.fightIntroTimer += dt * 1000;
    if (Game.fightIntroPhase === "round") {
      if (Game.fightIntroTimer >= 1200) {
        Game.fightIntroPhase = "fight";
        Game.fightIntroTimer = 0;
      }
    } else if (Game.fightIntroPhase === "fight") {
      if (Game.fightIntroTimer >= 800) {
        Game.fightIntroPhase = null;
      }
    }
    if (Game.fightIntroPhase) return;
  }

  // Edge: only true the frame the key was pressed (not held).
  var edgeP1 = {
    left: inputP1.left, right: inputP1.right,
    light: inputP1.light && !prevP1.light,
    heavy: inputP1.heavy && !prevP1.heavy,
    special: inputP1.special && !prevP1.special,
    grab: inputP1.grab && !prevP1.grab,
    dash: inputP1.dash && !prevP1.dash,
  };
  var edgeP2 = {
    left: inputP2.left, right: inputP2.right,
    light: inputP2.light && !prevP2.light,
    heavy: inputP2.heavy && !prevP2.heavy,
    special: inputP2.special && !prevP2.special,
    grab: inputP2.grab && !prevP2.grab,
    dash: inputP2.dash && !prevP2.dash,
  };
  prevP1 = { ...inputP1 };
  prevP2 = { ...inputP2 };

  if (Combat.battleWinner) return;
  // When someone just won the round, only tick combat so roundEndTimer counts down and startNextRound runs.
  if (Combat.roundWinner) {
    Combat.update(dt, edgeP1, edgeP2);
    return;
  }
  if (Combat.hitPauseRemaining > 0 || Combat.executionFreeze > 0) {
    Combat.update(dt, edgeP1, edgeP2);
    return;
  }
  Arena.update(dt);
  Weather.update(dt);
  Arena.applyHazardDamage(Players, now);
  Players.updateMovement(dt, inputP1, inputP2);
  Combat.update(dt, edgeP1, edgeP2);
}

// Draw the fight: arena, weather, litter, players, rip-off, projectiles, sparks, hitboxes, UI.
function renderPlaying() {
  const shake = Combat.getScreenShake ? Combat.getScreenShake() : 0;
  const shakeX = (Math.random() - 0.5) * shake;
  const shakeY = (Math.random() - 0.5) * shake;

  ctx.save();
  ctx.translate(shakeX, shakeY);
  Arena.draw(ctx, Players);
  Weather.draw(ctx);
  if (Combat.drawGroundLitter) Combat.drawGroundLitter(ctx);
  Players.draw(ctx);
  if (Combat.drawRipOff) Combat.drawRipOff(ctx);
  if (Combat.drawProjectiles) Combat.drawProjectiles(ctx);
  if (Combat.drawSparks) Combat.drawSparks(ctx);
  ctx.restore();

  ctx.save();
  ctx.translate(shakeX, shakeY);
  Combat.drawHitboxes(ctx);
  ctx.restore();

  UI.draw(ctx, shakeX, shakeY);

  if (Game.fightIntroPhase === "round") {
    const roundNum = (Combat.p1RoundWins || 0) + (Combat.p2RoundWins || 0) + 1;
    const words = ["One", "Two", "Three"];
    const roundText = "Round " + (words[roundNum - 1] || roundNum);
    const flash = Math.floor(Game.fightIntroTimer / 150) % 2 === 0;
    ctx.save();
    ctx.fillStyle = flash ? "rgba(255,255,255,0.95)" : "rgba(200,50,50,0.95)";
    ctx.font = "bold 48px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(roundText, CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    ctx.restore();
  } else if (Game.fightIntroPhase === "fight") {
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#c00";
    ctx.lineWidth = 4;
    ctx.font = "bold 56px Impact, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.strokeText("FIGHT!", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    ctx.fillText("FIGHT!", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    ctx.restore();
  }
}

function update(dt) {
  Screens.update(dt);
  if (Screens.isPlaying()) {
    updatePlaying(dt);
  }
}

function render() {
  if (Screens.state === "title" || Screens.state === "mainMenu" || Screens.state === "tutorial" || Screens.state === "characterSelect" || Screens.state === "vsScreen") {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    Screens.draw(ctx);
    return;
  }
  if (Screens.state === "storyCrawl") {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    Screens.draw(ctx);
    return;
  }
  if (Screens.state === "playing") {
    renderPlaying();
    if (Screens.paused) {
      Screens.drawPause(ctx);
    } else if (Screens.showTutorialHint) {
      Screens.drawTutorialHint(ctx);
    }
  }
}

// Fixed timestep: we advance by 1/60 sec until we've caught up. Prevents fast machines
// from running the game too fast and slow machines from exploding.
function gameLoop(time) {
  let dt = (time - lastTime) / 1000;
  lastTime = time;
  if (dt > 0.1) dt = 0.016;  // Clamp huge deltas (e.g. tab back)
  accumulator += dt;
  while (accumulator >= 1 / FPS) {
    update(1 / FPS);
    accumulator -= 1 / FPS;
  }
  render();
  requestAnimationFrame(gameLoop);
}

Game.init();
requestAnimationFrame(gameLoop);
