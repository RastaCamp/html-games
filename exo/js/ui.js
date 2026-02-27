// ═══════════════════════════════════════════════════════════════════════════════
// IRON COLISEUM BRAWLER – UI (armor bars, hazard countdown, round timer, winner)
// ═══════════════════════════════════════════════════════════════════════════════
// All HUD drawing. Armor bars = head, torso, leftArm, rightArm, legs. Tweak
// positions and fonts here if you want a different layout.

const UI = {
  draw(ctx, shakeX, shakeY) {
    ctx.save();
    ctx.translate(shakeX, shakeY);
    this.drawArmorBars(ctx);
    this.drawHazardTimer(ctx);
    this.drawRoundTimer(ctx);
    this.drawRoundWins(ctx);
    this.drawRoundWin(ctx);
    this.drawBattleWinner(ctx);
    ctx.restore();
  },

  // Big countdown in the middle: seconds left in the round.
  drawRoundTimer(ctx) {
    if (Combat.battleWinner || !Combat.roundDurationSec) return;
    const sec = Math.max(0, Math.ceil(Combat.roundDurationSec - Combat.roundTimer));
    ctx.fillStyle = COLORS.UI_BG;
    ctx.fillRect(CANVAS.WIDTH / 2 - 24, 40, 48, 18);
    ctx.fillStyle = COLORS.UI_TEXT;
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(sec + "s", CANVAS.WIDTH / 2, 52);
    ctx.textAlign = "left";
  },

  // "1 - 0" style round wins above the timer.
  drawRoundWins(ctx) {
    if (Combat.battleWinner) return;
    ctx.fillStyle = COLORS.UI_BG;
    ctx.fillRect(CANVAS.WIDTH / 2 - 32, 8, 64, 22);
    ctx.fillStyle = COLORS.UI_TEXT;
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(Combat.p1RoundWins + " - " + Combat.p2RoundWins, CANVAS.WIDTH / 2, 24);
    ctx.textAlign = "left";
  },

  // Full-screen "X wins the battle!" and story complete message. M = main menu.
  drawBattleWinner(ctx) {
    if (!Combat.battleWinner) return;
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 32px system-ui";
    ctx.textAlign = "center";
    if (typeof Screens !== "undefined" && Screens.storyComplete) {
      ctx.fillText("Story complete! You beat Warden and Rae.", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 - 10);
    } else {
      const name = Combat.battleWinner === 1 ? (Players.p1 ? Players.p1.name : "Player 1") : (Players.p2 ? Players.p2.name : "Player 2");
      ctx.fillText(name + " wins the battle!", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 - 10);
    }
    ctx.font = "14px system-ui";
    ctx.fillText("M – Main menu", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 + 24);
    ctx.textAlign = "left";
  },

  // Armor bars; when all armor depleted, show HP bar in same area (one bar, same width).
  drawArmorBars(ctx) {
    const barH = 8;
    const barW = 52;
    const gap = 3;
    const keys = ["head", "torso", "leftArm", "rightArm", "legs"];
    const n = keys.length;
    const totalW = barW * n + gap * (n - 1);
    const blockH = barH * n + gap * (n - 1) + 14;

    [Players.p1, Players.p2].forEach((p, i) => {
      const isP1 = i === 0;
      const x = isP1 ? 20 : CANVAS.WIDTH - 20 - totalW;
      const y = 52;

      ctx.fillStyle = COLORS.UI_BG;
      ctx.fillRect(isP1 ? 10 : CANVAS.WIDTH - 10 - totalW - 40, y - 5, totalW + 40, blockH);

      ctx.font = "10px system-ui";
      ctx.fillStyle = COLORS.UI_TEXT;
      ctx.fillText(isP1 ? "Player 1" : "Player 2", x, y - 6);

      const totalArmorP = (p.armor.head || 0) + (p.armor.leftArm || 0) + (p.armor.rightArm || 0) + (p.armor.legs || 0) + (p.armor.torso || 0);
      if (totalArmorP > 0) {
        keys.forEach((key, j) => {
          const v = p.armor[key];
          const max = p.armorMax;
          const pct = max > 0 ? v / max : 0;
          let color = COLORS.ARMOR_BAR_FULL;
          if (pct <= 0) color = COLORS.ARMOR_BAR_BROKEN;
          else if (pct < 0.4) color = COLORS.ARMOR_BAR_LOW;
          const bx = x + j * (barW + gap);
          ctx.fillStyle = "#333";
          ctx.fillRect(bx, y, barW, barH);
          ctx.fillStyle = color;
          ctx.fillRect(bx, y, barW * Math.max(0, pct), barH);
          ctx.strokeStyle = "#555";
          ctx.strokeRect(bx, y, barW, barH);
        });
      } else {
        const hpMax = typeof HP_MAX !== "undefined" ? HP_MAX : 100;
        const hpPct = hpMax > 0 ? (p.hp || 0) / hpMax : 0;
        let hpColor = COLORS.ARMOR_BAR_FULL;
        if (hpPct <= 0) hpColor = COLORS.ARMOR_BAR_BROKEN;
        else if (hpPct < 0.4) hpColor = COLORS.ARMOR_BAR_LOW;
        ctx.fillStyle = "#333";
        ctx.fillRect(x, y, totalW, barH);
        ctx.fillStyle = hpColor;
        ctx.fillRect(x, y, totalW * Math.max(0, hpPct), barH);
        ctx.strokeStyle = "#555";
        ctx.strokeRect(x, y, totalW, barH);
      }
    });
  },

  // "Next hazard" or "HAZARD!" plus countdown. Flashes when hazard is active.
  drawHazardTimer(ctx) {
    const countdown = Arena.getHazardCountdown();
    const active = Arena.isHazardActive();
    const y = 24;
    const x = CANVAS.WIDTH / 2 - 60;

    ctx.fillStyle = COLORS.UI_BG;
    ctx.fillRect(CANVAS.WIDTH / 2 - 70, 8, 140, 28);
    ctx.fillStyle = COLORS.UI_TEXT;
    ctx.font = "14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(active ? "HAZARD!" : "Next hazard", CANVAS.WIDTH / 2, y - 4);
    ctx.fillStyle = active ? COLORS.HAZARD_FLASH : COLORS.UI_TEXT;
    ctx.fillText(Math.ceil(countdown) + "s", CANVAS.WIDTH / 2, y + 12);
    ctx.textAlign = "left";
  },

  // "X wins the round!" overlay before the next round or battle winner.
  drawRoundWin(ctx) {
    if ((!Combat.roundWinner && !Combat.roundDraw) || Combat.battleWinner) return;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    ctx.fillStyle = "#fff";
    ctx.font = "32px system-ui";
    ctx.textAlign = "center";
    if (Combat.roundDraw) {
      ctx.fillText("Draw!", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 - 10);
    } else {
      const name = Combat.roundWinner === 1 ? (Players.p1 ? Players.p1.name : "Player 1") : (Players.p2 ? Players.p2.name : "Player 2");
      ctx.fillText(name + " wins the round!", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 - 10);
    }
    ctx.font = "14px system-ui";
    ctx.fillText("Next round...", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 + 20);
    ctx.textAlign = "left";
  },
};
