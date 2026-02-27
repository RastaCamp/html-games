// ═══════════════════════════════════════════════════════════════════════════════
// IRON COLISEUM BRAWLER – INPUT (keyboard)
// ═══════════════════════════════════════════════════════════════════════════════
// Change keys here and the game uses them everywhere. Use KeyboardEvent.code
// (e.g. "KeyW", "ArrowUp", "ShiftLeft"). Full list: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code

const Input = {
  keys: {},

  // Player 1 – Warden. light = punch, heavy = kick, special = Plasmakick.
  P1: {
    left: "KeyA",
    right: "KeyD",
    light: "KeyW",
    heavy: "KeyE",
    special: "KeyR",
    grab: "KeyQ",
    dash: "ShiftLeft",
  },

  // Player 2 – Rae. Same actions, different keys so two players can share one keyboard.
  P2: {
    left: "ArrowLeft",
    right: "ArrowRight",
    light: "ArrowUp",
    heavy: "Period",
    special: "Semicolon",
    grab: "Comma",
    dash: "Slash",
  },

  // Listens for keydown/keyup. Call once at startup.
  init() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      e.preventDefault();
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
      e.preventDefault();
    });
  },

  isDown(code) {
    return !!this.keys[code];
  },

  getP1() {
    return {
      left: this.isDown(this.P1.left),
      right: this.isDown(this.P1.right),
      light: this.isDown(this.P1.light),
      heavy: this.isDown(this.P1.heavy),
      special: this.isDown(this.P1.special),
      grab: this.isDown(this.P1.grab),
      dash: this.isDown(this.P1.dash),
    };
  },

  getP2() {
    return {
      left: this.isDown(this.P2.left),
      right: this.isDown(this.P2.right),
      light: this.isDown(this.P2.light),
      heavy: this.isDown(this.P2.heavy),
      special: this.isDown(this.P2.special),
      grab: this.isDown(this.P2.grab),
      dash: this.isDown(this.P2.dash),
    };
  },
};
