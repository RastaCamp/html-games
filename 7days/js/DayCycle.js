/**
 * 7 DAYS... - DAY CYCLE SYSTEM
 *
 * Manages in-game time: day length, game speed, and day/night.
 *
 * TIME:
 * - 1 real second = 72 game seconds by default (20 min real = 24h game).
 * - Day length = 24 game hours (86400 game seconds).
 * - Night = 6 PM–6 AM game time.
 *
 * GAME SPEED (speedMultipliers in setGameSpeed):
 * - Fast: 144x → ~10 min real per day
 * - Normal: 72x → ~20 min real per day (recommended; balanced with MeterSystem drain rates)
 * - Slow: 48x → ~30 min real per day
 * - Realist: 24x → ~60 min real per day
 *
 * Balance: MeterSystem drain rates are per game hour; with 72x, one real day (~20 min) = 24 game hours.
 * Tweak MeterSystem.drainRates if days feel too harsh or too easy.
 */

class DayCycle {
    constructor() {
        // 📅 DAY TRACKING: Basic day information
        this.currentDay = 1; // What day is it? (1-7, or infinite in survival mode)
        this.maxDays = 7; // Maximum days (7 for main game, Infinity for survival mode)
        this.dayTime = 0; // Time in current day (in GAME seconds, not real seconds!)
        this.dayLength = 24 * 60 * 60; // 24 hours in game time (86400 game seconds)
        this.isNight = false; // Is it currently night? (6 PM - 6 AM)
        this.nightStart = 0.6; // Night starts at 60% through the day (not used anymore, but kept for compatibility)
        
        // ⚡ GAME SPEED: How fast does time pass?
        // 20 minutes real time = 24 hours game time
        // 1 real second = 72 game seconds (24*60*60 / 20*60)
        this.realTimeToGameTime = 72; // Default: 20-minute days
        this.gameSpeed = 'normal'; // 'fast', 'normal', 'slow', 'realist'
    }

    update(deltaTime) {
        // Convert real time to game time based on game speed
        const speedMultipliers = {
            'fast': 144,      // 10-minute days (1 real sec = 144 game sec)
            'normal': 72,     // 20-minute days (1 real sec = 72 game sec)
            'slow': 48,       // 30-minute days (1 real sec = 48 game sec)
            'realist': 24     // 60-minute days (1 real sec = 24 game sec)
        };
        this.realTimeToGameTime = speedMultipliers[this.gameSpeed] || 72;
        
        const gameTimeDelta = deltaTime * this.realTimeToGameTime;
        this.dayTime += gameTimeDelta;
        
        // Check if day has passed (24 hours game time)
        if (this.dayTime >= this.dayLength) {
            this.dayTime = 0;
            this.currentDay++;
        }
        
        // Determine if it's night (6 PM to 6 AM = 18:00 to 6:00)
        const gameHours = (this.dayTime / 3600) % 24;
        this.isNight = gameHours >= 18 || gameHours < 6;
    }
    
    setGameSpeed(speed) {
        this.gameSpeed = speed;
        // Update multiplier immediately
        const speedMultipliers = {
            'fast': 144,
            'normal': 72,
            'slow': 48,
            'realist': 24
        };
        this.realTimeToGameTime = speedMultipliers[speed] || 72;
    }

    getTimeOfDay() {
        const gameHours = (this.dayTime / 3600) % 24;
        
        if (gameHours >= 6 && gameHours < 12) return 'Morning';
        if (gameHours >= 12 && gameHours < 18) return 'Afternoon';
        if (gameHours >= 18 && gameHours < 22) return 'Evening';
        return 'Night';
    }
    
    getGameTime() {
        const gameHours = Math.floor((this.dayTime / 3600) % 24);
        const gameMinutes = Math.floor((this.dayTime % 3600) / 60);
        return `${gameHours.toString().padStart(2, '0')}:${gameMinutes.toString().padStart(2, '0')}`;
    }

    getDayProgress() {
        return this.dayTime / this.dayLength;
    }

    getRemainingTime() {
        return this.dayLength - this.dayTime;
    }

    getState() {
        return {
            currentDay: this.currentDay,
            dayTime: this.dayTime,
            maxDays: this.maxDays,
            isNight: this.isNight,
            gameSpeed: this.gameSpeed
        };
    }

    setState(state) {
        this.currentDay = state.currentDay || 1;
        this.dayTime = state.dayTime || 0;
        this.maxDays = state.maxDays || 7;
        this.isNight = state.isNight || false;
        this.gameSpeed = state.gameSpeed || 'normal';
        this.setGameSpeed(this.gameSpeed); // Apply speed setting
    }
}
