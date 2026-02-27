// ═══════════════════════════════════════════════════════════════════════════════
// IRON COLISEUM BRAWLER – SCREENS (title, story crawl, menu, character select, VS)
// ═══════════════════════════════════════════════════════════════════════════════
// All non-fight screens. Title fades in → story crawl (skippable) → main menu.
// From menu you go to character select → VS screen → playing. Story mode: P1 only
// picks; P2 is Warden then Rae. Edit STORY_CRAWL_TEXT and MENU_ITEMS to change copy.

const TITLE_FADE_IN = 1.2;
const TITLE_HOLD = 2.0;
const TITLE_FADE_OUT = 1.0;
const STORY_CRAWL_FADE_IN = 0.8;
const STORY_CRAWL_FADE_OUT = 0.8;
const MENU_FADE_IN = 0.6;

// Shown after title, before main menu. Skippable with Enter/Space/M.
const STORY_CRAWL_TEXT = [
  "The game takes place in a post-apocalyptic future where men and women compete in the same fights.",
  "Enhanced, customized exoskeletons bridge the gaps between the genders.",
  "The Iron Coliseum is a new sport that rapidly grew in popularity.",
  "Winners receive tons of money, recognition, and one wish fulfilled.",
  "Every contestant has different reasons for fighting.",
  "They all represent corporations who spend millions on the newest tech",
  "to give their fighters the edge to win the tournament.",
];

// Main menu options. id is used in code; label/desc are shown. Add new items and handle id in updateMenu/startMode.
const MENU_ITEMS = [
  { id: "standard", label: "Standard Duel", desc: "1v1 – first to 2 round wins." },
  { id: "cpu", label: "1 vs CPU", desc: "Fight the CPU. Single player." },
  { id: "story", label: "Story Mode", desc: "Beat Warden then Rae. Win condition, then menu." },
  { id: "timed", label: "Timed Slugfest", desc: "90 seconds – most armor left wins." },
  { id: "hazard", label: "Hazard Rush", desc: "Hazard frequency increases over time." },
  { id: "tutorial", label: "Tutorial", desc: "Learn controls and mechanics." },
];

// Tutorial slides. Edit titles and body text to explain your controls.
const TUTORIAL_STEPS = [
  { title: "Welcome", body: "Iron Coliseum is a 1v1 brawler. Break your opponent's armor, then land the finishing blow." },
  { title: "Movement (Player 1)", body: "A and D to move left and right. Stay out of the red hazard zones at the edges!" },
  { title: "Movement (Player 2)", body: "Left and Right arrow keys to move. Both fighters share the same arena." },
  { title: "Light Attack (High)", body: "Player 1: W  |  Player 2: Up Arrow\nFast strike. Randomly hits head, torso, or arms (torso most likely)." },
  { title: "Heavy Attack (Low)", body: "Player 1: E  |  Player 2: Period (.)\nSlow strike that targets the legs." },
  { title: "Grab & Rip", body: "Player 1: Q  |  Player 2: Comma (,)\nGrab for medium damage—or if the opponent has red (critical) armor, rip that piece off. They're helpless while you hold it; it then drops with a clang." },
  { title: "Dash", body: "Player 1: Shift  |  Player 2: Slash (/)\nQuick burst of movement. Use to close distance or escape." },
  { title: "Special", body: "Player 1: R  |  Player 2: Semicolon (;)\nRae: Bulletpunch (red fireball from hands). Warden: Plasmakick (blue fireball from foot). Requires armor. Knocks down on hit." },
  { title: "Armor", body: "Each fighter has 5 armor pieces: Head, Torso, Left Arm, Right Arm, Legs. Damage them with strikes. When a piece is in the red (critical), the opponent can grab to rip it off. Ripped parts are weaker and can't use abilities with that limb." },
  { title: "Blocking", body: "Hits can be blocked automatically. Block chance depends on the character's level and stats—higher stats mean a better chance to block." },
  { title: "Hazard Zones", body: "Every 20 seconds, the outer edges light up for 5 seconds. Standing in the red zone damages your armor. Move to the center!" },
  { title: "Execution", body: "When all armor is broken, the opponent is in Execution (torso flashes). One more hit = Finisher and you win the round." },
  { title: "Ready", body: "Press Space or Enter to try the arena, or M to return to the menu." },
];

const Screens = {
  state: "title",
  // Title screen
  titlePhase: "fadeIn",
  titleTimer: 0,
  titleAlpha: 0,
  titleMusicStarted: false,
  // Story crawl
  storyCrawlAlpha: 0,
  storyCrawlTimer: 0,
  storyCrawlPhase: "fadeIn", // "fadeIn" | "hold" | "fadeOut"
  storyCrawlSkipped: false,
  // Main menu
  menuAlpha: 0,
  menuFadeTimer: 0,
  menuSelected: 0,
  menuCooldown: 0,
  menuEnterCooldown: 0,
  // Tutorial
  tutorialStep: 0,
  tutorialCooldown: 0,
  // Pause
  paused: false,
  pauseSelected: 0,
  pauseCooldown: 0,
  PAUSE_OPTIONS: ["Resume", "Back to main menu"],
  // Character select
  charSelectPhase: "selectP1", // "selectP1" | "selectP2"
  p1Cursor: 0,
  p2Cursor: 1,
  charSelectCooldown: 0,
  // VS screen
  vsPhase: "fadeIn",
  vsTimer: 0,
  vsAlpha: 0,
  selectedP1Config: null,
  selectedP2Config: null,
  storyMode: false,
  storyPhase: "warden",
  storyComplete: false,

  init() {
    this.state = "title";
    this.titlePhase = "fadeIn";
    this.titleTimer = 0;
    this.titleAlpha = 0;
    this.titleMusicStarted = false;
    this.storyCrawlAlpha = 0;
    this.storyCrawlTimer = 0;
    this.storyCrawlPhase = "fadeIn";
    this.storyCrawlSkipped = false;
    this.menuAlpha = 0;
    this.menuFadeTimer = 0;
    this.menuSelected = 0;
    this.menuCooldown = 0;
    this.menuEnterCooldown = 0;
    this.tutorialStep = 0;
    this.tutorialCooldown = 0;
    this.paused = false;
    this.pauseSelected = 0;
    this.pauseCooldown = 0;
    this.charSelectPhase = "selectP1";
    this.p1Cursor = 0;
    this.p2Cursor = 1;
    this.charSelectCooldown = 0;
    this.vsPhase = "fadeIn";
    this.vsTimer = 0;
    this.vsAlpha = 0;
    this.selectedP1Config = null;
    this.selectedP2Config = null;
    this.storyMode = false;
    this.storyPhase = "warden";
    this.storyComplete = false;
  },

  update(dt) {
    if (this.state === "title") {
      this.updateTitle(dt);
      return;
    }
    if (this.state === "storyCrawl") {
      this.updateStoryCrawl(dt);
      return;
    }
    if (this.state === "mainMenu") {
      this.updateMenuFade(dt);
      this.updateMenu(dt);
      return;
    }
    if (this.state === "characterSelect") {
      this.updateCharacterSelect(dt);
      return;
    }
    if (this.state === "vsScreen") {
      this.updateVsScreen(dt);
      return;
    }
    if (this.state === "tutorial") {
      this.updateTutorial(dt);
      return;
    }
  },

  updateCharacterSelect(dt) {
    this.charSelectCooldown = Math.max(0, this.charSelectCooldown - dt);
    if (this.charSelectCooldown > 0) return;
    const cols = CHARACTER_GRID_COLS || 4;
    const n = typeof CHARACTERS !== "undefined" ? CHARACTERS.length : 2;
    if (this.charSelectPhase === "selectP1") {
      if (Input.isDown("KeyA") || Input.isDown("ArrowLeft")) {
        this.p1Cursor = (this.p1Cursor - 1 + n) % n;
        this.charSelectCooldown = 0.2;
      }
      if (Input.isDown("KeyD") || Input.isDown("ArrowRight")) {
        this.p1Cursor = (this.p1Cursor + 1) % n;
        this.charSelectCooldown = 0.2;
      }
      if (Input.isDown("Enter") || Input.isDown("Space")) {
        const c = CHARACTERS[this.p1Cursor];
        if (c && c.configKey) {
          if (this.currentMode === "story") {
            this.confirmCharacterSelect();
          } else {
            this.charSelectPhase = "selectP2";
            this.charSelectCooldown = 0.3;
            if (this.currentMode === "cpu") {
              this.p2Cursor = 1;
              this.confirmCharacterSelect();
            }
          }
        }
      }
    } else if (this.charSelectPhase === "selectP2" && this.currentMode !== "cpu") {
      if (Input.isDown("ArrowLeft")) {
        this.p2Cursor = (this.p2Cursor - 1 + n) % n;
        this.charSelectCooldown = 0.2;
      }
      if (Input.isDown("ArrowRight")) {
        this.p2Cursor = (this.p2Cursor + 1) % n;
        this.charSelectCooldown = 0.2;
      }
      if (Input.isDown("Enter") || Input.isDown("Space")) {
        const c = CHARACTERS[this.p2Cursor];
        if (c && c.configKey) {
          this.confirmCharacterSelect();
        }
      }
    }
    if (Input.isDown("KeyM")) {
      this.state = "mainMenu";
      this.charSelectCooldown = 0.3;
    }
  },

  confirmCharacterSelect() {
    const p1Char = CHARACTERS[this.p1Cursor];
    const p2Char = this.currentMode === "story" ? CHARACTERS[0] : CHARACTERS[this.p2Cursor];
    this.selectedP1Config = typeof globalThis !== "undefined" && p1Char && p1Char.configKey ? globalThis[p1Char.configKey] : WARDEN;
    this.selectedP2Config = typeof globalThis !== "undefined" && p2Char && p2Char.configKey ? globalThis[p2Char.configKey] : RAE;
    if (this.currentMode === "story") {
      this.storyMode = true;
      this.storyPhase = "warden";
    }
    this.state = "vsScreen";
    this.vsPhase = "fadeIn";
    this.vsTimer = 0;
    this.vsAlpha = 0;
  },

  updateVsScreen(dt) {
    this.vsTimer += dt * 1000;
    const fadeMs = VS_FADE_MS || 600;
    const displayMs = VS_DISPLAY_MS || 2500;
    if (this.vsPhase === "fadeIn") {
      this.vsAlpha = Math.min(1, this.vsTimer / fadeMs);
      if (this.vsTimer >= fadeMs) {
        this.vsPhase = "hold";
        this.vsTimer = 0;
      }
    } else if (this.vsPhase === "hold") {
      if (this.vsTimer >= displayMs) {
        this.vsPhase = "fadeOut";
        this.vsTimer = 0;
      }
    } else {
      this.vsAlpha = Math.max(0, 1 - this.vsTimer / fadeMs);
      if (this.vsTimer >= fadeMs) {
        if (typeof Game !== "undefined" && Game.startMatch) {
          Game.startMatchWithCharacters(this.currentMode, this.selectedP1Config, this.selectedP2Config);
        } else {
          Game.startMatch(this.currentMode);
        }
        this.state = "playing";
        this.paused = false;
        if (typeof Game !== "undefined") {
          Game.fightIntroPhase = "round";
          Game.fightIntroTimer = 0;
        }
      }
    }
  },

  updateTitle(dt) {
    if (!this.titleMusicStarted && typeof Assets !== "undefined" && Assets.playTitleTrack) {
      Assets.playTitleTrack();
      this.titleMusicStarted = true;
    }
    this.titleTimer += dt;
    if (this.titlePhase === "fadeIn") {
      this.titleAlpha = Math.min(1, this.titleTimer / TITLE_FADE_IN);
      if (this.titleTimer >= TITLE_FADE_IN) {
        this.titlePhase = "hold";
        this.titleTimer = 0;
      }
    } else if (this.titlePhase === "hold") {
      this.titleAlpha = 1;
      if (this.titleTimer >= TITLE_HOLD) {
        this.titlePhase = "fadeOut";
        this.titleTimer = 0;
      }
    } else if (this.titlePhase === "fadeOut") {
      this.titleAlpha = Math.max(0, 1 - this.titleTimer / TITLE_FADE_OUT);
      if (this.titleTimer >= TITLE_FADE_OUT) {
        this.state = "storyCrawl";
        this.storyCrawlPhase = "fadeIn";
        this.storyCrawlTimer = 0;
        this.storyCrawlAlpha = 0;
        this.storyCrawlSkipped = false;
      }
    }
  },

  updateStoryCrawl(dt) {
    if ((Input.isDown("Enter") || Input.isDown("Space") || Input.isDown("KeyM")) && this.storyCrawlPhase !== "fadeOut") {
      this.skipStoryCrawl();
    }
    this.storyCrawlTimer += dt;
    if (this.storyCrawlPhase === "fadeIn") {
      this.storyCrawlAlpha = Math.min(1, this.storyCrawlTimer / STORY_CRAWL_FADE_IN);
      if (this.storyCrawlTimer >= STORY_CRAWL_FADE_IN) {
        this.storyCrawlPhase = "hold";
        this.storyCrawlTimer = 0;
      }
    } else if (this.storyCrawlPhase === "hold") {
      if (!this.storyCrawlSkipped && this.storyCrawlTimer >= 12) {
        this.storyCrawlPhase = "fadeOut";
        this.storyCrawlTimer = 0;
      }
    } else if (this.storyCrawlPhase === "fadeOut") {
      this.storyCrawlAlpha = Math.max(0, 1 - this.storyCrawlTimer / STORY_CRAWL_FADE_OUT);
      if (this.storyCrawlTimer >= STORY_CRAWL_FADE_OUT) {
        this.goToMainMenu();
      }
    }
  },

  skipStoryCrawl() {
    if (this.state !== "storyCrawl") return;
    this.storyCrawlSkipped = true;
    this.storyCrawlPhase = "fadeOut";
    this.storyCrawlTimer = 0;
  },

  goToMainMenu() {
    this.state = "mainMenu";
    this.menuAlpha = 0;
    this.menuFadeTimer = 0;
    this.menuEnterCooldown = 0.4;
  },

  updateMenuFade(dt) {
    if (this.menuAlpha < 1) {
      this.menuFadeTimer += dt;
      this.menuAlpha = Math.min(1, this.menuFadeTimer / MENU_FADE_IN);
    }
  },

  updateMenu(dt) {
    this.menuCooldown = Math.max(0, this.menuCooldown - dt);
    this.menuEnterCooldown = Math.max(0, this.menuEnterCooldown - dt);
    const cooldown = 0.15;
    if (this.menuCooldown <= 0) {
      if (Input.isDown("ArrowDown") || Input.isDown("KeyS")) {
        this.menuSelected = (this.menuSelected + 1) % MENU_ITEMS.length;
        this.menuCooldown = cooldown;
      }
      if (Input.isDown("ArrowUp") || Input.isDown("KeyW")) {
        this.menuSelected = (this.menuSelected - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
        this.menuCooldown = cooldown;
      }
    }
    if (this.menuEnterCooldown <= 0 && (Input.isDown("Enter") || Input.isDown("Space"))) {
      const item = MENU_ITEMS[this.menuSelected];
      if (item.id === "tutorial") {
        this.state = "tutorial";
        this.tutorialStep = 0;
        this.tutorialCooldown = 0.3;
      } else if (item.id === "standard" || item.id === "cpu" || item.id === "story") {
        this.state = "characterSelect";
        this.currentMode = item.id;
        this.charSelectPhase = "selectP1";
        this.p1Cursor = 0;
        this.p2Cursor = item.id === "story" ? 0 : 1;
        this.charSelectCooldown = 0.3;
        this.storyMode = item.id === "story";
        this.storyPhase = "warden";
        this.storyComplete = false;
      } else {
        this.startMode(item.id);
      }
    }
  },

  updateTutorial(dt) {
    this.tutorialCooldown = Math.max(0, this.tutorialCooldown - dt);
    if (this.tutorialCooldown <= 0 && (Input.isDown("Enter") || Input.isDown("Space"))) {
      if (this.tutorialStep < TUTORIAL_STEPS.length - 1) {
        this.tutorialStep++;
        this.tutorialCooldown = 0.25;
      } else {
        this.state = "playing";
        this.currentMode = "standard";
        this.showTutorialHint = true;
        this.cameFromTutorial = true;
        if (typeof Game !== "undefined" && Game.startMatch) Game.startMatch();
      }
    }
    if (Input.isDown("KeyM")) {
      this.state = "mainMenu";
      this.tutorialStep = 0;
      this.tutorialCooldown = 0.3;
    }
  },

  startMode(modeId) {
    this.showTutorialHint = false;
    this.cameFromTutorial = false;
    this.state = "playing";
    this.currentMode = modeId;
    this.paused = false;
    this.pauseSelected = 0;
    if (typeof Game !== "undefined" && Game.startMatch) Game.startMatch(modeId);
  },

  draw(ctx) {
    if (this.state === "title") {
      this.drawTitle(ctx);
      return;
    }
    if (this.state === "storyCrawl") {
      this.drawStoryCrawl(ctx);
      return;
    }
    if (this.state === "mainMenu") {
      this.drawMenu(ctx);
      return;
    }
    if (this.state === "characterSelect") {
      this.drawCharacterSelect(ctx);
      return;
    }
    if (this.state === "vsScreen") {
      this.drawVsScreen(ctx);
      return;
    }
    if (this.state === "tutorial") {
      this.drawTutorial(ctx);
      return;
    }
    if (this.state === "playing" && this.showTutorialHint) {
      this.drawTutorialHint(ctx);
    }
  },

  // Character grid: index 0 = Warden (male), 1 = Rae (female), rest = locked (unknown).
  getGridImageKey(index) {
    if (index === 0) return "male_grid";
    if (index === 1) return "female_grid";
    return "unknown_grid";
  },

  drawCharacterSelect(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    ctx.fillStyle = "#e0e0e0";
    ctx.font = "bold 22px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("CHARACTER SELECT", CANVAS.WIDTH / 2, 36);
    const cols = CHARACTER_GRID_COLS || 4;
    const chars = typeof CHARACTERS !== "undefined" ? CHARACTERS : [];
    const cellW = 90;
    const cellH = 70;
    const startX = (CANVAS.WIDTH - cols * cellW) / 2;
    const startY = 100;
    const imgSize = 72;
    chars.forEach((c, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * cellW + (cellW - imgSize) / 2;
      const y = startY + row * (cellH + 8);
      const p1Sel = this.charSelectPhase === "selectP1" && this.p1Cursor === i;
      const p2Sel = this.charSelectPhase === "selectP2" && this.p2Cursor === i;
      const imgKey = this.getGridImageKey(i);
      const img = typeof Assets !== "undefined" && Assets.getImage ? Assets.getImage(imgKey) : null;
      if (img) {
        ctx.drawImage(img, x, y, imgSize, imgSize);
      } else {
        ctx.fillStyle = "rgba(60,60,60,0.6)";
        ctx.fillRect(x, y, imgSize, imgSize);
      }
      if (p1Sel || p2Sel) {
        ctx.strokeStyle = p1Sel ? "#4a9eff" : "#e85a5a";
        ctx.lineWidth = 4;
        ctx.strokeRect(x - 2, y - 2, imgSize + 4, imgSize + 4);
      }
      ctx.fillStyle = c.configKey ? "#ccc" : "#555";
      ctx.font = "11px system-ui";
      ctx.fillText(c.name || "???", startX + col * cellW + cellW / 2, y + imgSize + 14);
    });
    const p1Char = chars[this.p1Cursor];
    const p2Char = chars[this.p2Cursor];
    ctx.textAlign = "left";
    ctx.fillStyle = "#4a9eff";
    ctx.font = "bold 14px system-ui";
    ctx.fillText("Player 1", 60, 280);
    ctx.fillStyle = "#ccc";
    ctx.font = "12px system-ui";
    ctx.fillText(p1Char ? p1Char.name + "  Off: " + (p1Char.offense || 0) + " Def: " + (p1Char.defense || 0) + " Spd: " + (p1Char.speed || 0) : "—", 60, 300);
    ctx.textAlign = "right";
    ctx.fillStyle = "#e85a5a";
    ctx.font = "bold 14px system-ui";
    ctx.fillText("Player 2", CANVAS.WIDTH - 60, 280);
    ctx.fillStyle = "#ccc";
    ctx.font = "12px system-ui";
    ctx.fillText(p2Char ? p2Char.name + "  Off: " + (p2Char.offense || 0) + " Def: " + (p2Char.defense || 0) + " Spd: " + (p2Char.speed || 0) : "—", CANVAS.WIDTH - 60, 300);
    ctx.textAlign = "center";
    ctx.fillStyle = "#888";
    ctx.font = "11px system-ui";
    ctx.fillText(this.charSelectPhase === "selectP1" ? "P1: A/D move, Enter confirm  |  M Back" : "P2: ←/→ move, Enter confirm  |  M Back", CANVAS.WIDTH / 2, CANVAS.HEIGHT - 20);
    ctx.textAlign = "left";
    ctx.restore();
  },

  // VS screen: P1 shows facing right, P2 facing left. male_vs_right, female_vs_left, etc.
  getVsImageKey(config, side) {
    if (!config || !config.characterId) return null;
    const dir = side === "p1" ? "right" : "left";
    if (config.characterId === "warden") return "male_vs_" + dir;
    if (config.characterId === "rae") return "female_vs_" + dir;
    return null;
  },

  drawVsScreen(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.95)";
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    ctx.globalAlpha = this.vsAlpha;
    const getImg = (key) => typeof Assets !== "undefined" && Assets.getImage ? Assets.getImage(key) : null;
    const leftW = CANVAS.WIDTH / 2;
    const rightW = CANVAS.WIDTH / 2;
    const midW = CANVAS.WIDTH * 0.28;
    const midStart = leftW - midW / 2;
    const p1Key = this.getVsImageKey(this.selectedP1Config, "p1");
    const p2Key = this.getVsImageKey(this.selectedP2Config, "p2");
    const p1Img = p1Key ? getImg(p1Key) : null;
    const p2Img = p2Key ? getImg(p2Key) : null;
    if (p1Img) {
      ctx.drawImage(p1Img, 0, 0, leftW, CANVAS.HEIGHT);
    }
    if (p2Img) {
      ctx.drawImage(p2Img, leftW, 0, rightW, CANVAS.HEIGHT);
    }
    const cellSize = Math.min(80, midW / 2 - 16);
    const gridGap = 8;
    const p1GridKey = this.selectedP1Config && this.selectedP1Config.characterId === "rae" ? "female_grid" : "male_grid";
    const p2GridKey = this.selectedP2Config && this.selectedP2Config.characterId === "rae" ? "female_grid" : "male_grid";
    const p1GridImg = getImg(p1GridKey);
    const p2GridImg = getImg(p2GridKey);
    const totalGridW = cellSize * 2 + gridGap;
    const gridX = midStart + (midW - totalGridW) / 2;
    const gridY = CANVAS.HEIGHT / 2 - cellSize - gridGap / 2;
    if (p1GridImg) ctx.drawImage(p1GridImg, gridX, gridY, cellSize, cellSize);
    if (p2GridImg) ctx.drawImage(p2GridImg, gridX + cellSize + gridGap, gridY, cellSize, cellSize);
    ctx.fillStyle = "#e8e8e8";
    ctx.font = "bold 24px system-ui";
    ctx.textAlign = "center";
    const p1Name = this.selectedP1Config ? this.selectedP1Config.name : "Player 1";
    const p2Name = this.selectedP2Config ? this.selectedP2Config.name : "Player 2";
    ctx.fillText(p1Name, leftW / 2, CANVAS.HEIGHT - 24);
    ctx.fillText("VS", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 - 10);
    ctx.fillText(p2Name, CANVAS.WIDTH - rightW / 2, CANVAS.HEIGHT - 24);
    const sameChar = this.selectedP1Config && this.selectedP2Config && this.selectedP1Config.characterId === this.selectedP2Config.characterId;
    if (sameChar) {
      ctx.font = "11px system-ui";
      ctx.fillStyle = "#888";
      ctx.fillText("(Same character — P2 tinted in battle)", CANVAS.WIDTH / 2, CANVAS.HEIGHT - 8);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
    ctx.restore();
  },

  drawTitle(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.95)";
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    const titleImg = typeof Assets !== "undefined" && Assets.getImage ? Assets.getImage("title") : null;
    if (titleImg) {
      ctx.globalAlpha = this.titleAlpha;
      ctx.drawImage(titleImg, 0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    } else {
      ctx.globalAlpha = this.titleAlpha;
      ctx.fillStyle = "#e8e8e8";
      ctx.font = "bold 42px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("IRON COLISEUM", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 - 20);
      ctx.font = "16px system-ui";
      ctx.fillStyle = "#aaa";
      ctx.fillText("BRAWLER", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 + 15);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
    ctx.restore();
  },

  drawStoryCrawl(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.94)";
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    ctx.globalAlpha = this.storyCrawlAlpha;
    ctx.fillStyle = "#e8e8e8";
    ctx.font = "17px system-ui, sans-serif";
    ctx.textAlign = "center";
    const lineH = 30;
    const startY = CANVAS.HEIGHT / 2 - (STORY_CRAWL_TEXT.length * lineH) / 2;
    STORY_CRAWL_TEXT.forEach((line, i) => {
      ctx.fillText(line, CANVAS.WIDTH / 2, startY + i * lineH);
    });
    ctx.fillStyle = "#999";
    ctx.font = "13px system-ui";
    ctx.fillText("Press Space or Enter to skip", CANVAS.WIDTH / 2, CANVAS.HEIGHT - 36);
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
    ctx.restore();
  },

  drawMenu(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    ctx.globalAlpha = this.menuAlpha;
    ctx.fillStyle = "#e0e0e0";
    ctx.font = "bold 28px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("SELECT MODE", CANVAS.WIDTH / 2, 70);
    ctx.font = "14px system-ui";
    ctx.textAlign = "left";

    const left = 120;
    const lineH = 44;
    const startY = 120;
    MENU_ITEMS.forEach((item, i) => {
      const y = startY + i * lineH;
      const selected = i === this.menuSelected;
      ctx.fillStyle = selected ? "#4a9eff" : "#ccc";
      ctx.font = selected ? "bold 18px system-ui" : "16px system-ui";
      ctx.fillText(selected ? "► " + item.label : "   " + item.label, left, y);
      ctx.fillStyle = "#888";
      ctx.font = "12px system-ui";
      ctx.fillText(item.desc, left + 20, y + 18);
    });

    ctx.fillStyle = "#666";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("↑↓ or W/S – Select   Enter/Space – Start", CANVAS.WIDTH / 2, CANVAS.HEIGHT - 24);
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
    ctx.restore();
  },

  drawTutorial(ctx) {
    const step = TUTORIAL_STEPS[this.tutorialStep];
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.82)";
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    ctx.fillStyle = "#4a9eff";
    ctx.font = "bold 20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(step.title, CANVAS.WIDTH / 2, 56);
    ctx.fillStyle = "#ddd";
    ctx.font = "14px system-ui";
    ctx.textAlign = "left";
    const lines = step.body.split("\n");
    const lineH = 22;
    const left = 80;
    const top = 90;
    lines.forEach((line, i) => {
      ctx.fillText(line, left, top + i * lineH);
    });
    ctx.fillStyle = "#888";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    const progress = `${this.tutorialStep + 1} / ${TUTORIAL_STEPS.length}`;
    ctx.fillText(progress, CANVAS.WIDTH / 2, CANVAS.HEIGHT - 50);
    ctx.fillText("Space / Enter – Next   M – Back to menu", CANVAS.WIDTH / 2, CANVAS.HEIGHT - 24);
    ctx.textAlign = "left";
    ctx.restore();
  },

  drawTutorialHint(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, CANVAS.HEIGHT - 28, CANVAS.WIDTH, 28);
    ctx.fillStyle = "#ccc";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Practice: break opponent's armor, then land the finisher.  M – Return to menu", CANVAS.WIDTH / 2, CANVAS.HEIGHT - 10);
    ctx.textAlign = "left";
    ctx.restore();
  },

  updatePause(dt) {
    this.pauseCooldown = Math.max(0, this.pauseCooldown - dt);
    if (this.pauseCooldown <= 0) {
      if (Input.isDown("ArrowDown") || Input.isDown("KeyS")) {
        this.pauseSelected = (this.pauseSelected + 1) % this.PAUSE_OPTIONS.length;
        this.pauseCooldown = 0.15;
      }
      if (Input.isDown("ArrowUp") || Input.isDown("KeyW")) {
        this.pauseSelected = (this.pauseSelected - 1 + this.PAUSE_OPTIONS.length) % this.PAUSE_OPTIONS.length;
        this.pauseCooldown = 0.15;
      }
    }
    if (Input.isDown("Enter") || Input.isDown("Space")) {
      if (this.pauseSelected === 0) {
        this.paused = false;
        this.pauseCooldown = 0.3;
      } else {
        this.state = "mainMenu";
        this.paused = false;
        this.menuEnterCooldown = 0.3;
        if (typeof Assets !== "undefined") {
          if (Assets.stopBattleTracks) Assets.stopBattleTracks();
          if (Assets.playTitleTrack) Assets.playTitleTrack();
        }
      }
    }
  },

  drawPause(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    ctx.fillStyle = "#e0e0e0";
    ctx.font = "bold 28px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", CANVAS.WIDTH / 2, 100);
    ctx.font = "18px system-ui";
    this.PAUSE_OPTIONS.forEach((opt, i) => {
      const selected = i === this.pauseSelected;
      ctx.fillStyle = selected ? "#4a9eff" : "#aaa";
      ctx.fillText(selected ? "► " + opt : "   " + opt, CANVAS.WIDTH / 2, 160 + i * 44);
    });
    ctx.fillStyle = "#666";
    ctx.font = "12px system-ui";
    ctx.fillText("↑↓ – Select   Enter – Confirm   Esc – Resume", CANVAS.WIDTH / 2, CANVAS.HEIGHT - 30);
    ctx.textAlign = "left";
    ctx.restore();
  },

  isPlaying() {
    return this.state === "playing";
  },

  isTutorialArena() {
    return this.state === "playing" && this.currentMode === "standard" && this.cameFromTutorial;
  },
};
