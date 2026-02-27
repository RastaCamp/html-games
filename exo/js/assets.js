// ═══════════════════════════════════════════════════════════════════════════════
// IRON COLISEUM BRAWLER – ASSETS (images & sounds)
// ═══════════════════════════════════════════════════════════════════════════════
// All image and sound paths live here. Add new files to IMAGE_PATHS or SOUND_PATHS,
// then use Assets.getImage("key") or Assets.playSound("key"). Paths are relative
// to the project root (where index.html lives).

const Assets = {
  images: {},
  audio: {},
  titleTrack: null,
  battleTrack: null,
  battleTrackIndex: 0,
  battleTrackOrder: [],

  // Map of key → path. Put new images in visuals/ and add an entry here.
  // Do not add crouch_* entries here — crouch poses are treated as regular legs
  // and resolved via the part-sprite helpers below.
  IMAGE_PATHS: {
    arena: "visuals/arena.png",
    arena_lightning: "visuals/arena_lightning.png",
    title: "visuals/titleic.png",
    electrocute_left: "visuals/electrocute_left .PNG",
    electrocute_right: "visuals/electrocute_right .PNG",
    unknown_grid: "visuals/unkown_grid.PNG",
    male_grid: "visuals/male1/male_grid.PNG",
    female_grid: "visuals/female1/female_grid.PNG",
    male_vs_left: "visuals/male1/male_vs_left.PNG",
    male_vs_right: "visuals/male1/male_vs_right.PNG",
    female_vs_left: "visuals/female1/female_vs_left.PNG",
    female_vs_right: "visuals/female1/female_vs_right.PNG",
    red_fireball_left: "visuals/red_fire_ball_left.PNG",
    red_fireball_right: "visuals/red_fire_ball_right.PNG",
    blue_fireball_left: "visuals/blue_fireball_left.PNG",
    blue_fireball_right: "visuals/blue_fireball_right.PNG",
    male_block_left: "visuals/male1/armor_male_right_arm_block_left.png",
    male_block_right: "visuals/male1/armor_male_left_arm_block_right.png",
    female_block_left: "visuals/female1/armor_female_right_arm_block_left.PNG",
    female_block_right: "visuals/female1/armor_female_left_arm_block_right.PNG",
    male_plasmakick_left: "visuals/male1/plasmakick_left.PNG",
    male_plasmakick_right: "visuals/male1/plasmakick_right.PNG",
    female_bulletpunch_left: "visuals/female1/armor_female_bulletpunch_left.PNG",
    female_bulletpunch_right: "visuals/female1/armor_female_bulletpunch_right.PNG",
  },

  // Fight music: shuffled and played one after another. Add more tracks if you want.
  BATTLE_TRACK_PATHS: [
    "sounds/tracks/dancehall_track.mp3",
    "sounds/tracks/house_track.mp3",
    "sounds/tracks/reggae_track.mp3",
    "sounds/tracks/thrash_track.mp3",
  ],
  // Map of action name → path. Add new sounds in sounds/ and reference here.
  SOUND_PATHS: {
    title_track: "sounds/tracks/title_track.mp3",
    punch_light: "sounds/punch_1.mp3",
    punch_heavy: "sounds/punch_5.mp3",
    grab: "sounds/metal_rip.mp3",
    dash: "sounds/footstep.mp3",
    hit: "sounds/punch_1.mp3",
    punch: "sounds/punch_1.mp3",
    metalhit: "sounds/metalhit_1.mp3",
    metal_floor: "sounds/metal_drop.mp3",
    block: "sounds/block.mp3",
    hazard: "sounds/alarm.mp3",
    electrocute: "sounds/alarm.mp3",
    execution: "sounds/fight.mp3",
    bulletpunch: "sounds/bulletpunch.mp3",
    plasmakick: "sounds/special_attack_1.mp3",
  },

  // Loads all IMAGE_PATHS and preloads the title track. Call once at startup.
  init() {
    const loadImage = (key, path) => {
      const img = new Image();
      img.onerror = () => {};
      img.src = path;
      this.images[key] = img;
      return img;
    };
    Object.keys(this.IMAGE_PATHS).forEach((key) => loadImage(key, this.IMAGE_PATHS[key]));

    // Preload title track for menu
    const titlePath = this.SOUND_PATHS.title_track;
    if (titlePath) {
      const audio = new Audio();
      audio.preload = "auto";
      audio.onerror = () => {};
      audio.src = titlePath;
      this.titleTrack = audio;
    }

    // Lazy-load other sounds on first play
    return this;
  },

  getImage(key) {
    const img = this.images[key];
    return img && img.complete && img.naturalWidth ? img : null;
  },

  partImageCache: {},
  // Lazy-load a body-part sprite. Tries .png then .PNG (files have mixed extensions).
  // male1 has a known typo: noarmor_male_left_arm_leftt.png — we handle that here.
  // Crouch sprites are never addressed directly: any "crouch" part is normalized
  // to "legs", so crouch-specific files are effectively treated as extra leg art.
  getPartImage(characterId, part, armored, facing) {
    if (part && (part + "").toLowerCase() === "crouch") part = "legs";
    const folder = characterId === "rae" ? "female1" : "male1";
    const gender = characterId === "rae" ? "female" : "male";
    let dir = facing === 1 ? "right" : "left";
    if (folder === "male1" && !armored && part === "left_arm" && dir === "left") dir = "leftt";  // typo in filename
    if (folder === "male1" && part === "kick" && dir === "left") dir = "leftt";  // armor_male_kick_leftt.png
    let pathBase, key;
    if (part === "plasmakick" && folder === "male1") {
      key = "male1_plasmakick_" + dir;
      pathBase = "visuals/male1/plasmakick_" + dir;
    } else if (part === "bulletpunch" && folder === "female1") {
      key = "female1_armor_bulletpunch_" + dir;
      pathBase = "visuals/female1/armor_female_bulletpunch_" + dir;
    } else {
      const prefix = armored ? "armor" : "noarmor";
      key = folder + "_" + prefix + "_" + part + "_" + dir;
      pathBase = "visuals/" + folder + "/" + prefix + "_" + gender + "_" + part + "_" + dir;
    }
    if (this.partImageCache[key]) return this.partImageCache[key].complete ? this.partImageCache[key] : null;
    const img = new Image();
    img.onerror = function() {
      if (img._triedPng) return;
      img._triedPng = true;
      img.src = pathBase + ".PNG";
    };
    img._triedPng = false;
    img.src = pathBase + ".png";
    this.partImageCache[key] = img;
    return null;
  },
  getPartImageSync(characterId, part, armored, facing) {
    if (part && (part + "").toLowerCase() === "crouch") part = "legs";
    const folder = characterId === "rae" ? "female1" : "male1";
    let dir = facing === 1 ? "right" : "left";
    if (folder === "male1" && !armored && part === "left_arm" && dir === "left") dir = "leftt";
    if (folder === "male1" && part === "kick" && dir === "left") dir = "leftt";
    let key;
    if (part === "plasmakick" && folder === "male1") key = "male1_plasmakick_" + dir;
    else if (part === "bulletpunch" && folder === "female1") key = "female1_armor_bulletpunch_" + dir;
    else key = folder + "_" + (armored ? "armor" : "noarmor") + "_" + part + "_" + dir;
    const img = this.partImageCache[key];
    return img && img.complete && img.naturalWidth ? img : null;
  },

  hitSoundAlternate: 0,

  playSound(action) {
    const path = this.SOUND_PATHS[action];
    if (!path || typeof Audio === "undefined") return;
    try {
      const a = new Audio(path);
      a.volume = 0.6;
      a.play().catch(() => {});
    } catch (e) {}
  },

  // Alternates punch and metalhit so hits don't sound like a machine gun.
  playHitSound() {
    const key = this.hitSoundAlternate ? "metalhit" : "punch";
    this.hitSoundAlternate = 1 - this.hitSoundAlternate;
    this.playSound(key);
  },

  playTitleTrack() {
    if (!this.titleTrack) return;
    try {
      this.titleTrack.currentTime = 0;
      this.titleTrack.loop = true;
      this.titleTrack.volume = 0.7;
      this.titleTrack.play().catch(() => {});
    } catch (e) {}
  },

  stopTitleTrack() {
    if (!this.titleTrack) return;
    try {
      this.titleTrack.pause();
      this.titleTrack.currentTime = 0;
    } catch (e) {}
  },

  isTitleTrackPlaying() {
    return this.titleTrack && !this.titleTrack.paused;
  },

  // Shuffle battle tracks and start playing. Called when a fight begins.
  startBattleTracks() {
    this.stopTitleTrack();
    this.stopBattleTracks();
    const paths = this.BATTLE_TRACK_PATHS || [];
    if (paths.length === 0) return;
    this.battleTrackOrder = paths.slice();
    for (let i = this.battleTrackOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.battleTrackOrder[i], this.battleTrackOrder[j]] = [this.battleTrackOrder[j], this.battleTrackOrder[i]];
    }
    this.battleTrackIndex = 0;
    this.playNextBattleTrack();
  },

  playNextBattleTrack() {
    if (!this.battleTrackOrder || this.battleTrackOrder.length === 0) return;
    const path = this.battleTrackOrder[this.battleTrackIndex];
    this.battleTrackIndex = (this.battleTrackIndex + 1) % this.battleTrackOrder.length;
    try {
      const a = new Audio(path);
      a.volume = 0.7;
      a.loop = false;
      a.onended = () => {
        if (typeof this !== "undefined" && this.battleTrackOrder && this.battleTrackOrder.length > 0) {
          this.playNextBattleTrack();
        }
      };
      a.onerror = () => {
        if (typeof this !== "undefined" && this.battleTrackOrder && this.battleTrackOrder.length > 0) {
          this.playNextBattleTrack();
        }
      };
      this.battleTrack = a;
      a.play().catch(() => {});
    } catch (e) {}
  },

  stopBattleTracks() {
    if (this.battleTrack) {
      try {
        this.battleTrack.pause();
        this.battleTrack.currentTime = 0;
      } catch (e) {}
      this.battleTrack = null;
    }
    this.battleTrackOrder = [];
  },
};
