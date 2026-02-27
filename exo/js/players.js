// ═══════════════════════════════════════════════════════════════════════════════
// IRON COLISEUM BRAWLER – PLAYERS (movement, collision, drawing)
// ═══════════════════════════════════════════════════════════════════════════════
// Each player has armor per body part, state (idle, attacking, down, etc.), and
// position. Draw order: legs, torso, head, arms. When in hazard zone they're not drawn.

/**
 * Safely read a dimension override from a character config, falling back
 * to the default `PLAYER_DIM` when the config does not specify it.
 */
function getPlayerDim(config, key) {
  return (config.dim && config.dim[key]) != null ? config.dim[key] : PLAYER_DIM[key];
}

/**
 * Build a runtime player object from a character config (WARDEN, RAE, or custom).
 * This normalizes armor, movement modifiers, and hit points into a single struct
 * used by movement, combat, and rendering.
 */
function createPlayer(id, config) {
  const armorMax = Math.floor(ARMOR_MAX * (config.armorBonus || 1));
  const tw = getPlayerDim(config, "TORSO_W");
  const th = getPlayerDim(config, "TORSO_H");
  return {
    id,
    name: config.name,
    x: config.startX,
    y: config.startY,
    width: tw,
    height: th,
    facing: config.facing,
    velocityX: 0,
    velocityY: 0,
    state: "idle",
    stateTimer: 0,
    config,
    armor: {
      head: armorMax,
      leftArm: armorMax,
      rightArm: armorMax,
      legs: armorMax,
      torso: armorMax,
    },
    armorMax,
    moveModifiers: {
      dashDistance: config.dashDistance ?? 1.0,
      lightAttackSpeed: 1.0,
      heavyAttackDamage: 1.0,
      grabSpeed: 1.0,
    },
    isExecution: false,
    knockbackResist: config.knockbackResist ?? 1.0,
    hp: typeof HP_MAX !== "undefined" ? HP_MAX : 100,
    blockFlash: 0,
    blockFlashDir: null,
  };
}

/**
 * Return a movement / damage modifier based on the current armor value
 * for a given body piece. Less armor means the piece contributes less.
 */
function getArmorModifier(player, piece) {
  const v = player.armor[piece];
  if (v <= 0) return 0.5;
  if (v < ARMOR_LOW) return 0.5 + (v / ARMOR_LOW) * 0.5;
  return 1.0;
}

/** Convenience check used for executions and special finishers. */
function isAllArmorBroken(player) {
  return (
    player.armor.head <= 0 &&
    player.armor.leftArm <= 0 &&
    player.armor.rightArm <= 0 &&
    player.armor.legs <= 0 &&
    player.armor.torso <= 0
  );
}

const Players = {
  p1: null,
  p2: null,

  init(p1Config, p2Config) {
    const c1 = p1Config || (typeof WARDEN !== "undefined" ? WARDEN : null);
    const c2 = p2Config || (typeof RAE !== "undefined" ? RAE : null);
    if (!c1 || !c2) return;
    const cfg1 = { ...c1, startX: 100, startY: 300, facing: 1 };
    const cfg2 = { ...c2, startX: CANVAS.WIDTH - 100 - (getPlayerDim(c2, "TORSO_W") || 40), startY: 300, facing: -1 };
    this.p1 = createPlayer(1, cfg1);
    this.p2 = createPlayer(2, cfg2);
    // Preload part sprites so they're ready when we draw (male1 + female1, both facings).
    if (typeof Assets !== "undefined" && Assets.getPartImage) {
      ["warden", "rae"].forEach((cid) => {
        [1, -1].forEach((facing) => {
          [true, false].forEach((armored) => {
            Assets.getPartImage(cid, "head", armored, facing);
            Assets.getPartImage(cid, "torso", armored, facing);
            Assets.getPartImage(cid, "legs", armored, facing);
            Assets.getPartImage(cid, "left_arm", armored, facing);
            Assets.getPartImage(cid, "right_arm", armored, facing);
            Assets.getPartImage(cid, "kick", armored, facing);
            Assets.getPartImage(cid, "grab", armored, facing);
            Assets.getPartImage(cid, "left_arm_punch", armored, 1);   // left arm punch when facing right
            Assets.getPartImage(cid, "right_arm_punch", armored, -1); // right arm punch when facing left
          });
        });
        if (cid === "warden") { Assets.getPartImage(cid, "plasmakick", false, 1); Assets.getPartImage(cid, "plasmakick", false, -1); }
        if (cid === "rae") { Assets.getPartImage(cid, "bulletpunch", true, 1); Assets.getPartImage(cid, "bulletpunch", true, -1); }
      });
    }
  },

  /** Return player 1 or 2 by id. */
  get(id) {
    return id === 1 ? this.p1 : this.p2;
  },

  /** Helper to fetch the opposing fighter for facing / collision. */
  getOpponent(id) {
    return id === 1 ? this.p2 : this.p1;
  },

  /** Keep a player fully inside the arena rectangle. */
  clampToArena(player) {
    const B = ARENA.BOUNDARY;
    const halfW = player.width / 2;
    player.x = Math.max(B, Math.min(CANVAS.WIDTH - B - player.width, player.x));
    player.y = Math.max(B, Math.min(CANVAS.HEIGHT - B - player.height, player.y));
  },

  /**
   * Advance both players' positions and state machines based on input.
   * Handles dashes, knockdowns, basic walking, and simple block flash decay.
   */
  updateMovement(dt, inputP1, inputP2) {
    [this.p1, this.p2].forEach((p, i) => {
      if (!p) return;
      const input = i === 0 ? inputP1 : inputP2;
      if (p.state === "hit" || p.state === "grabbed" || p.state === "helpless" || p.state === "ripping" || p.isExecution) return;

      const opponent = this.getOpponent(p.id);
      if (opponent) {
        p.facing = opponent.x >= p.x ? 1 : -1;
      }

      if (p.state === "down") {
        p.stateTimer -= dt * 1000;
        if (p.stateTimer <= 0) {
          p.state = "idle";
        }
        return;
      }

      if (p.state === "dashing") {
        p.stateTimer -= dt * 1000;
        if (p.stateTimer <= 0) {
          p.state = "idle";
          p.velocityX = 0;
        } else {
          const dashMod = (getArmorModifier(p, "legs") || 0.5) * (p.moveModifiers.dashDistance || 1);
          const speed = (p.config.dashSpeed || 300) * dashMod * p.facing;
          p.x += (speed * dt);
          this.clampToArena(p);
        }
        return;
      }

      if (p.state === "attacking" || p.state === "grabbing") {
        p.stateTimer -= dt * 1000;
        if (p.stateTimer <= 0) p.state = "idle";
        return;
      }

      let move = 0;
      if (input.left) move -= 1;
      if (input.right) move += 1;
      const speed = (p.config.walkSpeed || 200) * (getArmorModifier(p, "legs") || 0.5);
      if (move !== 0) {
        p.velocityX = move * speed;
        p.state = "moving";
      } else {
        p.velocityX = 0;
        if (p.state === "moving") p.state = "idle";
      }

      if (input.dash && p.state !== "dashing" && p.state !== "attacking" && p.state !== "grabbing") {
        p.state = "dashing";
        p.stateTimer = p.config.dashDurationMs || 120;
        if (typeof Assets !== "undefined" && Assets.playSound) Assets.playSound("dash");
      }

      p.x += p.velocityX * dt;
      this.clampToArena(p);
      if (p.blockFlash > 0) p.blockFlash = Math.max(0, p.blockFlash - dt * 1000);
    });
  },

  draw(ctx) {
    [this.p1, this.p2].forEach((p, i) => {
      const sameAsOther = i === 1 && this.p1 && this.p2 && this.p1.config && this.p2.config && this.p1.config.characterId === this.p2.config.characterId;
      this.drawPlayer(ctx, p, sameAsOther);
    });
  },

  // Draw one fighter: always composite (legs, torso, head, arms). Only the limb doing the action changes.
  // Torso/head scaled down, limbs scaled up so proportions look right.
  drawPlayer(ctx, p, tintForSameChar) {
    if (Arena.isHazardActive() && Arena.isInHazardZone(p.x + p.width / 2)) return;
    if (tintForSameChar) {
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.filter = "hue-rotate(45deg) saturate(1.1)";
    }
    const cid = ((p.config.characterId || "warden") + "").toLowerCase();
    const opponent = this.getOpponent(p.id);
    if (opponent) {
      p.facing = opponent.x >= p.x ? 1 : -1;
    }
    const facing = p.facing === 1 ? 1 : -1;
    // FACING FIX: Direction comes ONLY from asset choice (getPartImageSync(..., facing) loads right/left assets).
    // Do NOT use scale to flip (e.g. scaleVal = facing). Art is already left/right; scaling would double-flip
    // and make both characters face the same way. Keep scaleVal = 1 always.
    const scaleVal = 1;
    const AssetsExist = typeof Assets !== "undefined" && Assets.getPartImageSync && Assets.getImage;

    const armored = (piece) => (p.armor[piece] || 0) > 0;
    const drawPart = (img, x, y, w, h) => {
      if (img && img.complete && img.naturalWidth) ctx.drawImage(img, x, y, w, h);
    };

    // Target: character a bit less than half screen height.
    // Proportion template (for asset creation): leg length = torso + head height; arm length = torso height.
    const TARGET_HEIGHT_PCT = 0.45;
    const targetHeight = CANVAS.HEIGHT * TARGET_HEIGHT_PCT;

    const torsoImg = AssetsExist ? Assets.getPartImageSync(cid, "torso", armored("torso"), facing) : null;
    const legsRef = AssetsExist ? Assets.getPartImageSync(cid, "legs", armored("legs"), facing) : null;
    const headRef = AssetsExist ? Assets.getPartImageSync(cid, "head", armored("head"), facing) : null;
    const torsoH = torsoImg && torsoImg.naturalHeight ? torsoImg.naturalHeight : 100;
    const legsH = legsRef && legsRef.naturalHeight ? legsRef.naturalHeight : 100;
    const headH = headRef && headRef.naturalHeight ? headRef.naturalHeight : 50;
    const totalNatural = torsoH + legsH + headH;
    const scale = totalNatural > 0 ? targetHeight / totalNatural : 0.01;
    // Proportions: torso/head slightly smaller than base, limbs slightly larger — balanced so limbs don’t dominate.
    const TORSO_HEAD_SCALE = 0.9;
    const LIMB_SCALE = 1.08;
    // Torso +20% length/width; arms -20% size; no-armor arms extra -20%.
    const TORSO_SIZE_SCALE = 1.2;
    const ARM_SIZE_SCALE = 0.8;
    const NO_ARMOR_ARM_SCALE = 0.8;
    const tw = torsoImg ? torsoImg.naturalWidth * scale * TORSO_HEAD_SCALE * TORSO_SIZE_SCALE : p.width;
    const th = torsoImg ? torsoImg.naturalHeight * scale * TORSO_HEAD_SCALE * TORSO_SIZE_SCALE : p.height;
    const headScaledH = headH * scale * TORSO_HEAD_SCALE;
    // Proportion guide: leg length ≈ torso + head; arm length ≈ torso height (clavicle to pelvis)
    const targetLegHeight = th + headScaledH;
    const legScale = legsH > 0 ? targetLegHeight / legsH : scale;
    const footY = p.y + p.height;
    const rootX = p.x + p.width / 2;
    const rootY = footY;
    // P1 only: torso nudge left (negative = left), arms nudge right — P2 unchanged.
    const P1_TORSO_OFFSET_LEFT = -16;

    if (!torsoImg || !torsoImg.complete) {
      ctx.fillStyle = p.config.characterId === "rae" ? COLORS.RAE : COLORS.WARDEN;
      ctx.fillRect(p.x, p.y, p.width, p.height);
      if (p.isExecution) {
        const flash = Math.sin(Date.now() / 80) > 0 ? 1 : 0.5;
        ctx.fillStyle = `rgba(200,50,50,${flash * 0.35})`;
        ctx.fillRect(p.x, p.y, p.width, p.height);
      }
      if (tintForSameChar) { ctx.filter = "none"; ctx.restore(); }
      return;
    }

    // Legs: normal legs, or kick when heavy. When down (fallen), use regular legs only — no getup/crouch images.
    let legsImg = AssetsExist ? Assets.getPartImageSync(cid, "legs", armored("legs"), facing) : null;
    if (p.state === "attacking" && p.attackType === "heavy" && AssetsExist)
      legsImg = Assets.getPartImageSync(cid, "kick", armored("legs"), facing) || legsImg;
    const legsHeight = legsImg && legsImg.complete ? legsImg.naturalHeight * legScale * LIMB_SCALE : th * 0.5;

    const SHOULDER_OFFSET_LEFT_FRAC = 0.48;
    const SHOULDER_OFFSET_RIGHT_FRAC = 0.48;
    const ARM_OFFSET_RIGHT = 10;
    // Arms drawn from shoulder sockets; keep original shoulder x offset so arms stay where they were (torso is centered separately).
    const ARM_SHOULDER_OFFSET_X = -24;
    // P2 (right side) is locked; P1 arms nudge right and up (apply only for p.id === 1).
    const P1_ARM_OFFSET_RIGHT = 26;
    const P1_ARM_OFFSET_UP = -5; // negative = up
    const shoulderY_local = th * 0.2;

    // Arms: only the acting limb changes — punch arm on light, leading arm bulletpunch on Rae special; else idle (grab has no limb-only sprite)
    const isRaeSpecial = p.state === "special" && cid === "rae";
    const isLightPunchLeft = p.state === "attacking" && p.attackType === "light" && facing === 1;
    const isLightPunchRight = p.state === "attacking" && p.attackType === "light" && facing === -1;
    const isRaeSpecialLeft = isRaeSpecial && facing === -1;
    const isRaeSpecialRight = isRaeSpecial && facing === 1;
    let leftPart = "left_arm", rightPart = "right_arm";
    let leftFacing = facing, rightFacing = facing;
    if (isLightPunchLeft) { leftPart = "left_arm_punch"; leftFacing = 1; }
    if (isLightPunchRight) { rightPart = "right_arm_punch"; rightFacing = -1; }
    if (isRaeSpecialLeft) { leftPart = "bulletpunch"; leftFacing = -1; }
    if (isRaeSpecialRight) { rightPart = "bulletpunch"; rightFacing = 1; }
    const leftArmImg = AssetsExist ? Assets.getPartImageSync(cid, leftPart, armored("leftArm"), leftFacing) : null;
    const rightArmImg = AssetsExist ? Assets.getPartImageSync(cid, rightPart, armored("rightArm"), rightFacing) : null;

    ctx.save();
    ctx.translate(rootX, rootY);
    ctx.scale(scaleVal, 1); // must stay 1 — see FACING FIX above

    if (p.state === "down") {
      ctx.save();
      const bodyCenterLocalY = -legsHeight / 2 - th / 2;
      ctx.translate(0, bodyCenterLocalY);
      ctx.rotate(-Math.PI / 2);
      ctx.translate(0, -bodyCenterLocalY);
    }

    const localTorsoLeft = -tw / 2 + (p.id === 1 ? P1_TORSO_OFFSET_LEFT : 0); // center torso; P1 nudge left
    const localTorsoTop = -legsHeight - th;
    // Shoulder x: base offset for both; P1 only gets extra nudge right (P2 left alone).
    const armNudgeRight = p.id === 1 ? P1_ARM_OFFSET_RIGHT : 0;
    const armNudgeUp = p.id === 1 ? P1_ARM_OFFSET_UP : 0;
    const localShoulderLx = localTorsoLeft + tw * SHOULDER_OFFSET_LEFT_FRAC + ARM_OFFSET_RIGHT + ARM_SHOULDER_OFFSET_X + armNudgeRight;
    const localShoulderRx = localTorsoLeft + tw - tw * SHOULDER_OFFSET_RIGHT_FRAC + ARM_OFFSET_RIGHT + ARM_SHOULDER_OFFSET_X + armNudgeRight;
    const localShoulderY = localTorsoTop + shoulderY_local + armNudgeUp;

    if (legsImg && legsImg.complete) {
      const lw = legsImg.naturalWidth * legScale * LIMB_SCALE;
      const lh = legsImg.naturalHeight * legScale * LIMB_SCALE;
      drawPart(legsImg, -lw / 2, -lh, lw, lh);
    }
    drawPart(torsoImg, localTorsoLeft, localTorsoTop, tw, th);

    if (rightArmImg && rightArmImg.complete) {
      const armH = rightArmImg.naturalHeight;
      const armScaleH = armH > 0 ? th / armH : scale;
      const aw = rightArmImg.naturalWidth * armScaleH * LIMB_SCALE * ARM_SIZE_SCALE;
      const ah = th * LIMB_SCALE * ARM_SIZE_SCALE;
      drawPart(rightArmImg, localShoulderLx - aw, localShoulderY, aw, ah);
    }

    const headImg = AssetsExist ? Assets.getPartImageSync(cid, "head", armored("head"), facing) : null;
    if (headImg && headImg.complete) {
      const hw = headImg.naturalWidth * scale * TORSO_HEAD_SCALE;
      const hh = headImg.naturalHeight * scale * TORSO_HEAD_SCALE;
      drawPart(headImg, localTorsoLeft + tw / 2 - hw / 2, localTorsoTop - hh, hw, hh); // head centered on torso
    }

    if (leftArmImg && leftArmImg.complete) {
      const armH = leftArmImg.naturalHeight;
      const armScaleH = armH > 0 ? th / armH : scale;
      const noArmorScale = armored("leftArm") ? 1 : NO_ARMOR_ARM_SCALE;
      const aw = leftArmImg.naturalWidth * armScaleH * LIMB_SCALE * ARM_SIZE_SCALE * noArmorScale;
      const ah = th * LIMB_SCALE * ARM_SIZE_SCALE * noArmorScale;
      drawPart(leftArmImg, localShoulderRx, localShoulderY, aw, ah);
    }

    if (p.state === "down") ctx.restore();
    ctx.restore();

    // Execution flash overlay
    if (p.isExecution) {
      const flash = Math.sin(Date.now() / 80) > 0 ? 1 : 0.5;
      ctx.fillStyle = `rgba(200,50,50,${flash * 0.35})`;
      ctx.fillRect(p.x, p.y, p.width, p.height);
    }
    // Block flash overlay
    if (p.blockFlash > 0 && p.blockFlashDir && AssetsExist && Assets.getImage) {
      const key = (p.config.characterId === "rae" ? "female" : "male") + "_block_" + p.blockFlashDir;
      const img = Assets.getImage(key);
      if (img) {
        ctx.globalAlpha = Math.min(1, p.blockFlash / 400);
        ctx.drawImage(img, p.x - 20, p.y - 10, p.width + 40, p.height + 20);
        ctx.globalAlpha = 1;
      }
    }
    if (tintForSameChar) {
      ctx.filter = "none";
      ctx.restore();
    }
  },
};
