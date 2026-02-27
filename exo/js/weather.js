// ═══════════════════════════════════════════════════════════════════════════════
// IRON COLISEUM BRAWLER – WEATHER (rain & snow)
// ═══════════════════════════════════════════════════════════════════════════════
// Purely cosmetic. Rain or snow starts at random intervals and lasts a random
// duration. Tweak MIN/MAX_INTERVAL and MIN/MAX_DURATION for more or less weather.

const WEATHER = {
  MIN_INTERVAL: 22,   // Min seconds between weather events
  MAX_INTERVAL: 38,
  MIN_DURATION: 6,   // Min seconds rain/snow lasts
  MAX_DURATION: 14,
};

const Weather = {
  state: "none",
  timer: 0,
  duration: 0,
  nextEventIn: 0,
  rainDrops: [],
  snowFlakes: [],
  maxRain: 80,
  maxSnow: 60,

  init() {
    this.state = "none";  // "none" | "rain" | "snow"
    this.timer = 0;
    this.duration = 0;
    this.nextEventIn = WEATHER.MIN_INTERVAL + Math.random() * (WEATHER.MAX_INTERVAL - WEATHER.MIN_INTERVAL);
    this.rainDrops = [];
    this.snowFlakes = [];
  },

  update(dt) {
    if (this.state === "none") {
      this.nextEventIn -= dt;
      if (this.nextEventIn <= 0) {
        this.state = Math.random() < 0.5 ? "rain" : "snow";
        this.duration = WEATHER.MIN_DURATION + Math.random() * (WEATHER.MAX_DURATION - WEATHER.MIN_DURATION);
        this.timer = 0;
        this.nextEventIn = WEATHER.MIN_INTERVAL + Math.random() * (WEATHER.MAX_INTERVAL - WEATHER.MIN_INTERVAL);
      }
      return;
    }

    this.timer += dt;
    if (this.timer >= this.duration) {
      this.state = "none";
      this.rainDrops = [];
      this.snowFlakes = [];
      return;
    }

    if (this.state === "rain") {
      while (this.rainDrops.length < this.maxRain) {
        this.rainDrops.push({
          x: Math.random() * (CANVAS.WIDTH + 100) - 50,
          y: Math.random() * CANVAS.HEIGHT,
          len: 8 + Math.random() * 10,
          speed: 180 + Math.random() * 120,
        });
      }
      this.rainDrops.forEach((d) => {
        d.y += d.speed * dt;
        if (d.y > CANVAS.HEIGHT + 20) d.y = -10;
        d.x += 30 * dt;
        if (d.x > CANVAS.WIDTH + 20) d.x = -20;
      });
    }

    if (this.state === "snow") {
      while (this.snowFlakes.length < this.maxSnow) {
        this.snowFlakes.push({
          x: Math.random() * (CANVAS.WIDTH + 40) - 20,
          y: Math.random() * CANVAS.HEIGHT,
          r: 1.2 + Math.random() * 1.2,
          speed: 35 + Math.random() * 45,
          drift: (Math.random() - 0.5) * 40,
        });
      }
      this.snowFlakes.forEach((d) => {
        d.y += d.speed * dt;
        if (d.y > CANVAS.HEIGHT + 10) d.y = -5;
        d.x += d.drift * dt;
        if (d.x < -10) d.x = CANVAS.WIDTH + 10;
        if (d.x > CANVAS.WIDTH + 10) d.x = -10;
      });
    }
  },

  draw(ctx) {
    if (this.state === "rain") {
      ctx.save();
      ctx.strokeStyle = "rgba(180,200,255,0.5)";
      ctx.lineWidth = 1.5;
      this.rainDrops.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 4, d.y + d.len);
        ctx.stroke();
      });
      ctx.restore();
    }
    if (this.state === "snow") {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      this.snowFlakes.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
  },

  isActive() {
    return this.state !== "none";
  },
};
