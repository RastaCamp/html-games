// ═══════════════════════════════════════════════════════════════════════════════
// IRON COLISEUM BRAWLER – CPU OPPONENT (1 vs CPU)
// ═══════════════════════════════════════════════════════════════════════════════
// Returns fake input for P2 when playing vs CPU. Moves toward P1, attacks when
// close, dashes when far, and runs away from hazard zones. Tweak cooldowns and
// random chances to make the CPU easier or harder.

const CPU = {
  attackCooldown: 0,
  moveCooldown: 0,
  lastDirection: 0,

  init() {
    this.attackCooldown = 0;
    this.moveCooldown = 0;
    this.lastDirection = 0;
  },

  // Returns an input object (left, right, light, heavy, special, grab, dash) for P2.
  getInput() {
    const p1 = Players.p1;
    const p2 = Players.p2;
    const out = { left: false, right: false, light: false, heavy: false, special: false, grab: false, dash: false };

    if (!p1 || !p2 || p2.isExecution) return out;

    const cx1 = p1.x + p1.width / 2;
    const cx2 = p2.x + p2.width / 2;
    const dist = Math.abs(cx1 - cx2);
    const inHazard = Arena.isInHazardZone && Arena.isInHazardZone(cx2);

    this.attackCooldown = Math.max(0, this.attackCooldown - 1/60);
    this.moveCooldown = Math.max(0, this.moveCooldown - 1/60);

    const canAct = p2.state === "idle" || p2.state === "moving";
    const facingCorrect = (cx1 > cx2 && p2.facing === -1) || (cx1 < cx2 && p2.facing === 1);

    // When close and facing P1, sometimes attack. Light > heavy > grab > special (if has armor).
    if (canAct && this.attackCooldown <= 0 && facingCorrect) {
      if (dist < 90 && Math.random() < 0.04) {
        const r = Math.random();
        if (r < 0.4) out.light = true;
        else if (r < 0.65) out.heavy = true;
        else if (r < 0.85) out.grab = true;
        else if (r < 0.95 && dist < 80) {
          const hasArmor = p2.armor && (p2.armor.head > 0 || p2.armor.torso > 0 || p2.armor.leftArm > 0 || p2.armor.rightArm > 0 || p2.armor.legs > 0);
          if (hasArmor) out.special = true;
          else out.heavy = true;
        }
        this.attackCooldown = 0.4 + Math.random() * 0.3;
      }
    }

    if (canAct && this.attackCooldown <= 0 && dist > 120 && Math.random() < 0.03) {
      out.dash = true;
      this.attackCooldown = 0.25;
    }

    if (this.attackCooldown <= 0 && this.moveCooldown <= 0) {
      if (inHazard) {
        const toCenter = CANVAS.WIDTH / 2 - cx2;
        out.left = toCenter < 0;
        out.right = toCenter > 0;
      } else {
        const wantRight = cx1 > cx2;
        const wantLeft = cx1 < cx2;
        if (dist > 70) {
          out.right = wantRight;
          out.left = wantLeft;
        } else if (dist < 50 && Math.random() < 0.6) {
          out.left = wantRight;
          out.right = wantLeft;
        }
      }
      this.moveCooldown = 0.08;
    }

    return out;
  },
};
