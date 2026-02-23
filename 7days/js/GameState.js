class GameState {
    constructor() {
        this.isPaused = false;
        this.isGameOver = false;
        this.gameOverReason = '';
        this.currentDay = 1;
        this.maxDays = 7;
        this.gameTime = 0; // Total game time in seconds
        this.lastUpdateTime = Date.now();
        // Persistent loot per scene/location: { A: { L17: ['paint_thinner'], ... }, B: { ... } }
        this.sceneLoot = { A: {}, B: {} };
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
        this.lastUpdateTime = Date.now();
    }

    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    update(deltaTime) {
        if (!this.isPaused && !this.isGameOver) {
            this.gameTime += deltaTime;
        }
    }

    checkGameOver(meters) {
        if (meters.health.value <= 0) {
            this.isGameOver = true;
            if (meters.morale && meters.morale.value <= 0) {
                this.gameOverReason = 'You lost the will to live.';
            } else if (meters.hydration && meters.hydration.value <= 0) {
                this.gameOverReason = 'Dehydration killed you.';
            } else if (meters.hunger && meters.hunger.value <= 0) {
                this.gameOverReason = 'Starvation claimed you.';
            } else if (meters.sicknessLevel && meters.sicknessLevel.value >= 80) {
                this.gameOverReason = 'Sickness overcame you.';
            } else {
                this.gameOverReason = 'You died from your injuries.';
            }
            return true;
        }
        if (this.currentDay > this.maxDays) {
            this.isGameOver = true;
            this.gameOverReason = 'You survived 7 days! Help has arrived...';
            return true;
        }
        return false;
    }

    getState() {
        return {
            isPaused: this.isPaused,
            isGameOver: this.isGameOver,
            gameOverReason: this.gameOverReason,
            currentDay: this.currentDay,
            gameTime: this.gameTime,
            sceneLoot: this.sceneLoot ? JSON.parse(JSON.stringify(this.sceneLoot)) : { A: {}, B: {} }
        };
    }

    setState(state) {
        this.isPaused = state.isPaused || false;
        this.isGameOver = state.isGameOver || false;
        this.gameOverReason = state.gameOverReason || '';
        this.currentDay = state.currentDay || 1;
        this.gameTime = state.gameTime || 0;
        this.sceneLoot = state.sceneLoot && typeof state.sceneLoot === 'object'
            ? state.sceneLoot
            : { A: {}, B: {} };
    }
}
