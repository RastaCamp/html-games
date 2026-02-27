// ═══════════════════════════════════════════════════════════════════════════════
// IRON COLISEUM BRAWLER – ARENA (floor, walls, hazard zones, background)
// ═══════════════════════════════════════════════════════════════════════════════
// The stage. Hazard zones cycle: safe for a while, then the edges light up and
// hurt anyone standing there. Background switches to arena_lightning when hazard is on.

const Arena = {
  hazardPhase: "safe",   // "safe" | "active"
  hazardTimer: 0,       // seconds in current phase
  hazardFlash: 0,       // 0–1 for flashing (used if no lightning image)
  lastHazardTick: 0,

  init() {
    this.hazardPhase = "safe";
    this.hazardTimer = 0;
    this.hazardFlash = 0;
    this.lastHazardTick = 0;
  },

  // Which side of the screen to show the electrocute graphic (left or right).
  getElectrocuteSide(player) {
    const cx = player.x + player.width / 2;
    return cx < CANVAS.WIDTH / 2 ? "left" : "right";
  },

  update(dt) {
    this.hazardTimer += dt;
    if (this.hazardPhase === "safe") {
      if (this.hazardTimer >= ARENA.HAZARD_CYCLE_SEC) {
        this.hazardPhase = "active";
        this.hazardTimer = 0;
        if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("hazard");
      }
    } else {
      this.hazardFlash = (this.hazardFlash + dt * 4) % 1;
      if (this.hazardTimer >= ARENA.HAZARD_ACTIVE_SEC) {
        this.hazardPhase = "safe";
        this.hazardTimer = 0;
      }
    }
  },

  isHazardActive() {
    return this.hazardPhase === "active";
  },

  getHazardCountdown() {
    if (this.hazardPhase === "safe") {
      return Math.max(0, ARENA.HAZARD_CYCLE_SEC - this.hazardTimer);
    }
    return Math.max(0, ARENA.HAZARD_ACTIVE_SEC - this.hazardTimer);
  },

  isInHazardZone(x) {
    if (!this.isHazardActive()) return false;
    const left = ARENA.HAZARD_ZONE_WIDTH;
    const right = CANVAS.WIDTH - ARENA.HAZARD_ZONE_WIDTH;
    return x < left || x > right;
  },

  applyHazardDamage(players, now) {
    if (!this.isHazardActive()) return;
    if (now - this.lastHazardTick < ARENA.HAZARD_TICK_MS) return;
    const d = ARENA.HAZARD_DAMAGE_PER_TICK;
    const getupMs = typeof GETUP_MS !== "undefined" ? GETUP_MS : 1200;
    let anyInZone = false;
    [players.p1, players.p2].forEach((player) => {
      if (!this.isInHazardZone(player.x + player.width / 2)) return;
      anyInZone = true;
      player.armor.head = Math.max(0, player.armor.head - d);
      player.armor.leftArm = Math.max(0, player.armor.leftArm - d);
      player.armor.rightArm = Math.max(0, player.armor.rightArm - d);
      player.armor.legs = Math.max(0, player.armor.legs - d);
      player.armor.torso = Math.max(0, player.armor.torso - d);
      // Hazard knocks the player down (fall, then getup)
      if (player.state !== "helpless" && player.state !== "ripping" && !player.isExecution) {
        player.state = "down";
        player.stateTimer = getupMs;
      }
    });
    if (anyInZone && typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("electrocute");
    this.lastHazardTick = now;
  },

  draw(ctx, players) {
    const { WIDTH, HEIGHT } = CANVAS;
    const B = ARENA.BOUNDARY;

    // Normal bg = arena.png. When hazard is on we use arena_lightning.png for drama.
    const bgKey = this.isHazardActive() ? "arena_lightning" : "arena";
    const bg = typeof Assets !== "undefined" && Assets.getImage ? Assets.getImage(bgKey) : null;
    if (bg) {
      ctx.drawImage(bg, 0, 0, WIDTH, HEIGHT);
    } else {
      ctx.fillStyle = COLORS.FLOOR;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    // Boundaries (dark gray edge)
    ctx.fillStyle = COLORS.BOUNDARY;
    ctx.fillRect(0, 0, WIDTH, B);
    ctx.fillRect(0, HEIGHT - B, WIDTH, B);
    ctx.fillRect(0, 0, B, HEIGHT);
    ctx.fillRect(WIDTH - B, 0, B, HEIGHT);

    // Center line (dashed)
    ctx.strokeStyle = COLORS.CENTER_LINE;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, B);
    ctx.lineTo(WIDTH / 2, HEIGHT - B);
    ctx.stroke();
    ctx.setLineDash([]);

    // Hazard zones (flashing red when active) – only if no lightning image
    if (this.isHazardActive() && !Assets.getImage("arena_lightning")) {
      const flash = 0.5 + 0.5 * Math.sin(this.hazardFlash * Math.PI * 2);
      ctx.fillStyle = flash > 0.7 ? COLORS.HAZARD_FLASH : COLORS.HAZARD;
      ctx.fillRect(0, B, ARENA.HAZARD_ZONE_WIDTH, HEIGHT - 2 * B);
      ctx.fillRect(WIDTH - ARENA.HAZARD_ZONE_WIDTH, B, ARENA.HAZARD_ZONE_WIDTH, HEIGHT - 2 * B);
    }

    // If someone's standing in the danger zone, show the electrocute graphic on their side.
    if (this.isHazardActive() && players && typeof Assets !== "undefined" && Assets.getImage) {
      const sidesToShow = new Set();
      [players.p1, players.p2].forEach((p) => {
        if (!p || !this.isInHazardZone(p.x + p.width / 2)) return;
        sidesToShow.add(this.getElectrocuteSide(p));
      });
      sidesToShow.forEach((side) => {
        const img = Assets.getImage(side === "left" ? "electrocute_left" : "electrocute_right");
        if (img) {
          const scale = Math.min(WIDTH / img.naturalWidth, HEIGHT / img.naturalHeight) * 0.5;
          const w = img.naturalWidth * scale;
          const h = img.naturalHeight * scale;
          const x = side === "left" ? 0 : WIDTH - w;
          ctx.drawImage(img, x, (HEIGHT - h) / 2, w, h);
        }
      });
    }
  },
};
