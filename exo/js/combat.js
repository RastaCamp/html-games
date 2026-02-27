// ═══════════════════════════════════════════════════════════════════════════════
// IRON COLISEUM BRAWLER – COMBAT (attacks, hitboxes, armor, execution, rip-off)
// ═══════════════════════════════════════════════════════════════════════════════
// Hitboxes spawn on light/heavy/grab/special. Collision checks target; block chance
// can negate. Grab on red armor = rip-off; grab on execution = fatality. Yellow sparks
// on armor hit, red on no-armor hit.

const ARMOR_PART_INDEX = { head: 0, leftArm: 1, rightArm: 2, legs: 3, torso: 4 };

function isArmorInRed(player, piece) {
  const v = player.armor[piece];
  return v > 0 && v < ARMOR_RED_THRESHOLD;
}

function getRedArmorPieces(player) {
  return HIGH_STRIKE_PARTS.concat("legs").filter((p) => isArmorInRed(player, p));
}

function damageVecForPart(part, baseVec) {
  const vec = [0, 0, 0, 0, 0];
  const i = ARMOR_PART_INDEX[part];
  if (i != null) vec[i] = baseVec[i] || 0;
  return vec;
}

function damageVecLegsOnly(baseVec) {
  return [0, 0, 0, baseVec[3] || 0, 0];
}

function totalArmor(p) {
  return (p.armor.head || 0) + (p.armor.leftArm || 0) + (p.armor.rightArm || 0) + (p.armor.legs || 0) + (p.armor.torso || 0);
}

const Combat = {
  hitboxes: [],
  hitPauseRemaining: 0,
  screenShake: 0,
  roundWinner: null,
  roundDraw: false,
  executionFreeze: 0,
  ripOff: null,
  roundTimer: 0,
  roundDurationSec: 75,
  p1RoundWins: 0,
  p2RoundWins: 0,
  battleWinner: null,
  roundEndTimer: 0,
  groundLitter: [],
  projectiles: [],
  sparks: [],

  // Reset round state. Call when starting a new match or next round.
  init() {
    this.hitboxes = [];
    this.hitPauseRemaining = 0;
    this.screenShake = 0;
    this.roundWinner = null;
    this.roundDraw = false;
    this.executionFreeze = 0;
    this.ripOff = null;
    this.roundTimer = 0;
    this.roundDurationSec = ROUND_DURATION_SEC_MIN + Math.random() * (ROUND_DURATION_SEC_MAX - ROUND_DURATION_SEC_MIN);
    this.p1RoundWins = 0;
    this.p2RoundWins = 0;
    this.battleWinner = null;
    this.roundEndTimer = 0;
    this.groundLitter = [];
    this.projectiles = [];
    this.sparks = [];
  },

  // Reset players and round timer; keep round wins. Called after "X wins the round!".
  startNextRound() {
    this.roundWinner = null;
    this.roundDraw = false;
    this.roundEndTimer = 0;
    this.roundTimer = 0;
    this.roundDurationSec = ROUND_DURATION_SEC_MIN + Math.random() * (ROUND_DURATION_SEC_MAX - ROUND_DURATION_SEC_MIN);
    this.executionFreeze = 0;
    this.ripOff = null;
    this.hitboxes = [];
    this.projectiles = [];
    if (typeof Game !== "undefined") {
      Game.fightIntroPhase = "round";
      Game.fightIntroTimer = 0;
    }
    const p1 = Players.p1;
    const p2 = Players.p2;
    if (p1) {
      p1.state = "idle";
      p1.stateTimer = 0;
      p1.attackType = null;
      p1.isExecution = false;
      p1.armor = { head: p1.armorMax, leftArm: p1.armorMax, rightArm: p1.armorMax, legs: p1.armorMax, torso: p1.armorMax };
      p1.hp = HP_MAX;
      p1.x = 100;
      p1.y = 300;
      p1.facing = 1;
    }
    if (p2) {
      p2.state = "idle";
      p2.stateTimer = 0;
      p2.attackType = null;
      p2.isExecution = false;
      p2.armor = { head: p2.armorMax, leftArm: p2.armorMax, rightArm: p2.armorMax, legs: p2.armorMax, torso: p2.armorMax };
      p2.hp = HP_MAX;
      p2.x = CANVAS.WIDTH - 100 - (p2.width || 40);
      p2.y = 300;
      p2.facing = -1;
    }
  },

  // Create a hitbox. type = "light" | "heavy" | "grab". Collision is checked in update().
  spawnHitbox(ownerId, type, x, y, facing, w, h, durationMs, damageVec, knockback) {
    const hitbox = {
      ownerId,
      type,
      x: facing === 1 ? x + Players.get(ownerId).width : x - w,
      y: y + (Players.get(ownerId).height - h) / 2,
      w,
      h,
      facing,
      durationMs,
      damageVec,
      knockback,
      createdAt: performance.now(),
    };
    this.hitboxes.push(hitbox);
  },

  // Start the rip-off animation: attacker holds the piece, then drops it. Piece goes to ground litter.
  startRipOff(attackerId, targetId, piece) {
    const attacker = Players.get(attackerId);
    const target = Players.get(targetId);
    if (!attacker || !target) return;
    target.armor[piece] = 0;
    attacker.state = "ripping";
    target.state = "helpless";
    const att = attacker;
    const handY = att.y + (att.height * 0.4);
    const handX = att.x + (att.facing === 1 ? att.width : 0);
    this.ripOff = {
      attackerId,
      targetId,
      piece,
      phase: "holding",
      timer: 0,
      handX,
      handY,
      dropY: CANVAS.HEIGHT - ARENA.BOUNDARY - 16,
    };
    if (isAllArmorBroken(target)) target.isExecution = true;
  },

  updateSparks(dt) {
    this.sparks = this.sparks.filter((s) => {
      s.life -= dt;
      return s.life > 0;
    });
  },

  updateRipOff(dt) {
    if (!this.ripOff) return;
    this.ripOff.timer += dt * 1000;
    const att = Players.get(this.ripOff.attackerId);
    const tgt = Players.get(this.ripOff.targetId);
    if (this.ripOff.phase === "holding") {
      if (this.ripOff.timer >= RIP_HOLD_MS) {
        this.ripOff.phase = "dropping";
        this.ripOff.timer = 0;
        this.ripOff.startDropY = this.ripOff.handY;
        this.ripOff.startDropX = this.ripOff.handX;
      }
    } else {
      const progress = Math.min(1, this.ripOff.timer / RIP_DROP_MS);
      this.ripOff.currentDropY = this.ripOff.startDropY + (this.ripOff.dropY - this.ripOff.startDropY) * progress;
      this.ripOff.currentDropX = this.ripOff.startDropX;
      if (this.ripOff.timer >= RIP_DROP_MS) {
        if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("metal_floor");
        this.groundLitter.push({
          piece: this.ripOff.piece,
          x: (this.ripOff.currentDropX || this.ripOff.handX) - 7,
          y: this.ripOff.dropY,
          w: 14,
          h: 12,
        });
        this.ripOff = null;
        if (att) att.state = "idle";
        if (tgt) tgt.state = "idle";
      }
    }
  },

  drawRipOff(ctx) {
    if (!this.ripOff) return;
    const att = Players.get(this.ripOff.attackerId);
    const color = att && att.id === 1 ? COLORS.WARDEN : COLORS.RAE;
    const w = 14;
    const h = 12;
    if (this.ripOff.phase === "holding" && att) {
      const x = att.x + (att.facing === 1 ? att.width - 4 : -w + 4);
      const y = att.y + att.height * 0.35;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    } else if (this.ripOff.phase === "dropping" && this.ripOff.currentDropY != null) {
      const x = (this.ripOff.currentDropX || this.ripOff.handX) - w / 2;
      const y = this.ripOff.currentDropY;
      ctx.globalAlpha = 1 - (this.ripOff.timer / RIP_DROP_MS) * 0.5;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#222";
      ctx.strokeRect(x, y, w, h);
      ctx.globalAlpha = 1;
    }
  },

  awardRoundWin(winnerId) {
    if (this.roundWinner || this.roundDraw) return;
    this.roundWinner = winnerId;
    if (winnerId === 1) this.p1RoundWins++;
    else this.p2RoundWins++;
    this.roundEndTimer = 2500;
  },

  awardRoundDraw() {
    if (this.roundWinner || this.roundDraw) return;
    this.roundDraw = true;
    this.roundEndTimer = 2500;
  },

  update(dt, inputP1, inputP2) {
    const now = performance.now();
    const p1 = Players.p1;
    const p2 = Players.p2;

    if (this.roundEndTimer > 0) {
      this.roundEndTimer -= dt * 1000;
      if (this.roundEndTimer <= 0) {
        if (this.roundDraw) {
          this.startNextRound();
          return;
        }
        const p1Wins = this.p1RoundWins >= ROUNDS_TO_WIN;
        const p2Wins = this.p2RoundWins >= ROUNDS_TO_WIN;
        if (typeof Screens !== "undefined" && Screens.storyMode && p1Wins && Screens.storyPhase === "warden") {
          Screens.storyPhase = "rae";
          if (typeof Game !== "undefined" && Game.startMatchWithCharacters && typeof RAE !== "undefined") {
            Game.startMatchWithCharacters("cpu", Screens.selectedP1Config, RAE);
          }
          return;
        }
        if (p1Wins || p2Wins) {
          this.battleWinner = p1Wins ? 1 : 2;
          if (typeof Screens !== "undefined" && Screens.storyMode && p1Wins && Screens.storyPhase === "rae") {
            Screens.storyComplete = true;
          }
        } else {
          this.startNextRound();
        }
      }
      return;
    }

    if (this.roundWinner || this.roundDraw) return;

    this.roundTimer += dt;
    if (this.roundTimer >= this.roundDurationSec) {
      const t1 = totalArmor(p1);
      const t2 = totalArmor(p2);
      const effective1 = t1 > 0 ? t1 : (p1.hp || 0);
      const effective2 = t2 > 0 ? t2 : (p2.hp || 0);
      if (effective1 > effective2) this.awardRoundWin(1);
      else if (effective2 > effective1) this.awardRoundWin(2);
      else this.awardRoundDraw();
      return;
    }

    if (this.ripOff) {
      this.updateRipOff(dt);
      return;
    }

    if (this.executionFreeze > 0) {
      this.executionFreeze -= dt * 1000;
      return;
    }

    if (this.hitPauseRemaining > 0) {
      this.hitPauseRemaining -= dt * 1000;
      this.screenShake = Math.max(0, this.screenShake - dt * 25);
      return;
    }

    // Start attacks from input. Can't start if someone is helpless, ripping, or down.
    if ((p1.state === "helpless" || p1.state === "ripping" || p2.state === "helpless" || p2.state === "ripping" || p1.state === "down" || p2.state === "down")) {
      // ripOff handled above; no new inputs this frame
    } else if (p1.state !== "attacking" && p1.state !== "grabbing" && p1.state !== "dashing" && p1.state !== "special" && !p1.isExecution) {
      if (inputP1.light) {
        p1.state = "attacking";
        p1.attackType = "light";
        p1.stateTimer = p1.config.lightAttackDurationMs;
        if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("punch_light");
        Combat.spawnHitbox(1, "light", p1.x, p1.y, p1.facing,
          p1.config.lightHitbox.w, p1.config.lightHitbox.h,
          p1.config.lightAttackDurationMs * 0.4,
          p1.config.light, KNOCKBACK_LIGHT);
      } else if (inputP1.heavy) {
        p1.state = "attacking";
        p1.attackType = "heavy";
        p1.stateTimer = p1.config.heavyAttackDurationMs;
        if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("punch_heavy");
        Combat.spawnHitbox(1, "heavy", p1.x, p1.y, p1.facing,
          p1.config.heavyHitbox.w, p1.config.heavyHitbox.h,
          p1.config.heavyAttackDurationMs * 0.35,
          p1.config.heavy, KNOCKBACK_HEAVY);
      } else if (inputP1.grab) {
        p1.state = "grabbing";
        p1.stateTimer = p1.config.grabDurationMs;
        if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("grab");
        Combat.spawnHitbox(1, "grab", p1.x, p1.y, p1.facing,
          p1.config.grabHitbox.w, p1.config.grabHitbox.h,
          p1.config.grabDurationMs * 0.5,
          p1.config.grab, KNOCKBACK_GRAB);
      } else if (inputP1.special) {
        if (p1.config.characterId === "rae" && (p1.armor.head > 0 || p1.armor.torso > 0 || p1.armor.leftArm > 0 || p1.armor.rightArm > 0 || p1.armor.legs > 0)) {
          p1.state = "special";
          p1.stateTimer = 400;
          if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("bulletpunch");
          Combat.spawnProjectile(1, "bulletpunch");
        } else if (p1.config.characterId === "warden" && !isAllArmorBroken(p1)) {
          p1.state = "special";
          p1.stateTimer = 500;
          if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("plasmakick");
          Combat.spawnProjectile(1, "plasmakick");
        }
      }
    }
    if (p2.state !== "attacking" && p2.state !== "grabbing" && p2.state !== "dashing" && p2.state !== "special" && !p2.isExecution) {
      if (inputP2.light) {
        p2.state = "attacking";
        p2.attackType = "light";
        p2.stateTimer = p2.config.lightAttackDurationMs;
        if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("punch_light");
        Combat.spawnHitbox(2, "light", p2.x, p2.y, p2.facing,
          p2.config.lightHitbox.w, p2.config.lightHitbox.h,
          p2.config.lightAttackDurationMs * 0.4,
          p2.config.light, KNOCKBACK_LIGHT);
      } else if (inputP2.heavy) {
        p2.state = "attacking";
        p2.attackType = "heavy";
        p2.stateTimer = p2.config.heavyAttackDurationMs;
        if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("punch_heavy");
        Combat.spawnHitbox(2, "heavy", p2.x, p2.y, p2.facing,
          p2.config.heavyHitbox.w, p2.config.heavyHitbox.h,
          p2.config.heavyAttackDurationMs * 0.35,
          p2.config.heavy, KNOCKBACK_HEAVY);
      } else if (inputP2.grab) {
        p2.state = "grabbing";
        p2.stateTimer = p2.config.grabDurationMs;
        if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("grab");
        Combat.spawnHitbox(2, "grab", p2.x, p2.y, p2.facing,
          p2.config.grabHitbox.w, p2.config.grabHitbox.h,
          p2.config.grabDurationMs * 0.5,
          p2.config.grab, KNOCKBACK_GRAB);
      } else if (inputP2.special) {
        if (p2.config.characterId === "rae" && (p2.armor.head > 0 || p2.armor.torso > 0 || p2.armor.leftArm > 0 || p2.armor.rightArm > 0 || p2.armor.legs > 0)) {
          p2.state = "special";
          p2.stateTimer = 400;
          if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("bulletpunch");
          Combat.spawnProjectile(2, "bulletpunch");
        } else if (p2.config.characterId === "warden" && !isAllArmorBroken(p2)) {
          p2.state = "special";
          p2.stateTimer = 500;
          if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("plasmakick");
          Combat.spawnProjectile(2, "plasmakick");
        }
      }
    }

    if (p1.state === "special") { p1.stateTimer -= dt * 1000; if (p1.stateTimer <= 0) p1.state = "idle"; }
    if (p2.state === "special") { p2.stateTimer -= dt * 1000; if (p2.stateTimer <= 0) p2.state = "idle"; }

    this.updateProjectiles(dt);
    this.updateSparks(dt);

    // Update hitboxes and check collision
    this.hitboxes = this.hitboxes.filter((hb) => {
      if (now - hb.createdAt > hb.durationMs) return false;
      const target = hb.ownerId === 1 ? p2 : p1;
      const attacker = hb.ownerId === 1 ? p1 : p2;
      if (target.state === "hit" || target.state === "down") return true;

      const tx = target.x + target.width / 2;
      const ty = target.y + target.height / 2;
      const hbx = hb.x + hb.w / 2;
      const hby = hb.y + hb.h / 2;
      const overlapX = Math.abs(tx - hbx) < (target.width / 2 + hb.w / 2);
      const overlapY = Math.abs(ty - hby) < (target.height / 2 + hb.h / 2);
      if (overlapX && overlapY) {
        if (target.isExecution && hb.type === "grab") {
          this.checkExecutionHit(hb.ownerId);
          this.hitPauseRemaining = HIT_PAUSE_MS;
          return false;
        }
        if (!target.isExecution) {
          const blockChance = (target.config && target.config.blockChance) || 0;
          if (blockChance > 0 && Math.random() < blockChance) {
            if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("block");
            target.blockFlash = 400;
            target.blockFlashDir = attacker.x + attacker.width / 2 < tx ? "left" : "right";
            this.hitPauseRemaining = HIT_PAUSE_MS * 0.5;
            return false;
          }
        }
        if (hb.type === "grab") {
          if (target.isExecution) {
            this.awardRoundWin(hb.ownerId);
            this.hitPauseRemaining = HIT_PAUSE_MS;
            return false;
          }
          const redPieces = getRedArmorPieces(target);
          if (redPieces.length > 0) {
            const piece = redPieces[Math.floor(Math.random() * redPieces.length)];
            this.startRipOff(hb.ownerId, target.id, piece);
          } else {
            if (typeof Assets !== "undefined" && Assets.playHitSound) Assets.playHitSound();
            this.applyDamage(target, hb.damageVec, KNOCKBACK_GRAB, hb.ownerId);
            target.state = "down";
            target.stateTimer = GETUP_MS;
            if (isAllArmorBroken(target)) target.isExecution = true;
          }
        } else if (hb.type === "light") {
          const part = pickHighStrikePart();
          const dmg = damageVecForPart(part, hb.damageVec);
          if (target.isExecution) {
            target.hp = Math.max(0, (target.hp || HP_MAX) - 5);
            if (target.hp <= 0) this.awardRoundWin(hb.ownerId);
          } else {
            if (typeof Assets !== "undefined" && Assets.playHitSound) Assets.playHitSound();
            this.applyDamage(target, dmg, hb.knockback, hb.ownerId);
            if (isAllArmorBroken(target)) target.isExecution = true;
          }
          this.spawnSpark(tx, ty, target.isExecution ? "red" : "yellow");
        } else if (hb.type === "heavy") {
          const dmg = damageVecLegsOnly(hb.damageVec);
          const mod = getArmorModifier(attacker, "rightArm");
          const scaled = dmg.map((v) => v * mod);
          if (target.isExecution) {
            target.hp = Math.max(0, (target.hp || HP_MAX) - 15);
            if (target.hp <= 0) this.awardRoundWin(hb.ownerId);
          } else {
            if (typeof Assets !== "undefined" && Assets.playHitSound) Assets.playHitSound();
            this.applyDamage(target, scaled, hb.knockback, hb.ownerId);
            if (isAllArmorBroken(target)) target.isExecution = true;
          }
          target.state = "down";
          target.stateTimer = GETUP_MS;
          this.spawnSpark(tx, ty, target.isExecution ? "red" : "yellow");
        } else {
          if (target.isExecution) {
            target.hp = Math.max(0, (target.hp || HP_MAX) - 10);
            if (target.hp <= 0) this.awardRoundWin(hb.ownerId);
          } else {
            if (typeof Assets !== "undefined" && Assets.playHitSound) Assets.playHitSound();
            this.applyDamage(target, hb.damageVec, hb.knockback, hb.ownerId);
            if (isAllArmorBroken(target)) target.isExecution = true;
          }
          this.spawnSpark(tx, ty, target.isExecution ? "red" : "yellow");
        }
        this.hitPauseRemaining = HIT_PAUSE_MS;
        this.screenShake = hb.type === "heavy" ? SCREEN_SHAKE_AMOUNT : SCREEN_SHAKE_AMOUNT * 0.5;
        return false;
      }
      return true;
    });
  },

  spawnSpark(x, y, color) {
    this.sparks.push({ x, y, color, life: 0.3 });
  },

  applyDamage(target, damageVec, knockback, attackerId) {
    const attacker = Players.get(attackerId);
    const mod = getArmorModifier(attacker, "rightArm");
    const k = target.knockbackResist || 1;
    target.armor.head = Math.max(0, target.armor.head - (damageVec[0] || 0));
    target.armor.leftArm = Math.max(0, target.armor.leftArm - (damageVec[1] || 0));
    target.armor.rightArm = Math.max(0, target.armor.rightArm - (damageVec[2] || 0));
    target.armor.legs = Math.max(0, target.armor.legs - (damageVec[3] || 0));
    target.armor.torso = Math.max(0, target.armor.torso - (damageVec[4] || 0));

    const push = (knockback * mod / k) * (attacker.facing || 1);
    target.x += push;
    Players.clampToArena(target);

    if (isAllArmorBroken(target)) {
      target.isExecution = true;
    }
  },

  // Fire a projectile. type = "bulletpunch" (Rae, red) or "plasmakick" (Warden, blue).
  spawnProjectile(ownerId, type) {
    const p = Players.get(ownerId);
    const facing = p.facing;
    const x = p.x + (facing === 1 ? p.width : 0);
    const y = type === "bulletpunch" ? p.y + p.height * 0.4 : p.y + p.height * 0.85;
    this.projectiles.push({
      ownerId,
      type,
      x,
      y,
      facing,
      w: 24,
      h: 24,
      speed: 420,
      damage: type === "bulletpunch" ? 15 : 25,
      createdAt: performance.now(),
    });
  },

  updateProjectiles(dt) {
    const p1 = Players.p1;
    const p2 = Players.p2;
    this.projectiles = this.projectiles.filter((proj) => {
      proj.x += proj.facing * proj.speed * dt;
      const target = proj.ownerId === 1 ? p2 : p1;
      const tx = target.x + target.width / 2;
      const ty = target.y + target.height / 2;
      if (Math.abs(proj.x - tx) < target.width / 2 + proj.w && Math.abs(proj.y - ty) < target.height / 2 + proj.h) {
        if (target.state === "down") return false;
        if (isAllArmorBroken(target)) {
          target.hp = Math.max(0, (target.hp || HP_MAX) - proj.damage);
          if (target.hp <= 0) this.awardRoundWin(proj.ownerId);
        } else {
          target.armor.torso = Math.max(0, (target.armor.torso || 0) - proj.damage);
          if (isAllArmorBroken(target)) target.isExecution = true;
        }
        target.state = "down";
        target.stateTimer = GETUP_MS;
        this.screenShake = SCREEN_SHAKE_AMOUNT;
        return false;
      }
      if (proj.x < -50 || proj.x > CANVAS.WIDTH + 50) return false;
      return true;
    });
  },

  // Grab on an execution-state target = fatality. Award round, freeze screen, play sound.
  checkExecutionHit(attackerId) {
    const target = Players.getOpponent(attackerId);
    if (!target.isExecution) return false;
    if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("execution");
    this.awardRoundWin(attackerId);
    this.executionFreeze = EXECUTION_FREEZE_MS;
    this.screenShake = SCREEN_SHAKE_AMOUNT * 2;
    return true;
  },

  drawHitboxes(ctx) {
    this.hitboxes.forEach((hb) => {
      if (hb.type === "light") ctx.fillStyle = COLORS.HITBOX_LIGHT;
      else if (hb.type === "heavy") ctx.fillStyle = COLORS.HITBOX_HEAVY;
      else if (hb.type === "grab") ctx.fillStyle = COLORS.HITBOX_GRAB;
      else ctx.fillStyle = COLORS.HITBOX_LIGHT;
      ctx.fillRect(hb.x, hb.y, hb.w, hb.h);
    });
  },

  drawProjectiles(ctx) {
    const getImg = (key) => typeof Assets !== "undefined" && Assets.getImage ? Assets.getImage(key) : null;
    this.projectiles.forEach((proj) => {
      const key = proj.type === "bulletpunch" ? (proj.facing === 1 ? "red_fireball_right" : "red_fireball_left") : (proj.facing === 1 ? "blue_fireball_right" : "blue_fireball_left");
      const img = getImg(key);
      if (img) ctx.drawImage(img, proj.x - proj.w / 2, proj.y - proj.h / 2, proj.w, proj.h);
      else {
        ctx.fillStyle = proj.type === "bulletpunch" ? "#c44" : "#48f";
        ctx.fillRect(proj.x - proj.w / 2, proj.y - proj.h / 2, proj.w, proj.h);
      }
    });
  },

  drawSparks(ctx) {
    this.sparks.forEach((s) => {
      ctx.fillStyle = s.color === "yellow" ? "rgba(255,220,80,0.9)" : "rgba(255,80,80,0.9)";
      ctx.beginPath();
      ctx.arc(s.x, s.y, 4 + (1 - s.life / 0.3) * 4, 0, Math.PI * 2);
      ctx.fill();
    });
  },

  // Ripped armor pieces on the floor. Draw semi-transparent when a player overlaps so they're not hidden.
  drawGroundLitter(ctx) {
    const p1 = Players.p1;
    const p2 = Players.p2;
    this.groundLitter.forEach((lit) => {
      const lx = lit.x + lit.w / 2;
      const ly = lit.y + lit.h / 2;
      let alpha = 1;
      [p1, p2].forEach((p) => {
        if (!p) return;
        const px = p.x + p.width / 2;
        const py = p.y + p.height / 2;
        if (Math.abs(lx - px) < p.width / 2 + lit.w / 2 && Math.abs(ly - py) < p.height / 2 + lit.h / 2) alpha = Math.min(alpha, 0.35);
      });
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#555";
      ctx.fillRect(lit.x, lit.y, lit.w, lit.h);
      ctx.restore();
    });
  },

  getScreenShake() {
    return this.screenShake;
  },
};
