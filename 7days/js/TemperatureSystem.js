class TemperatureSystem {
    constructor(weatherSystem) {
        this.weatherSystem = weatherSystem;
        this.warmthSources = [];
        this.baseTemperature = 75;
    }

    update(game) {
        // Get base temperature from weather
        const weather = this.weatherSystem;
        this.baseTemperature = weather.temperature;
        
        // Calculate warmth from sources
        let totalWarmth = 0;
        this.warmthSources = [];
        
        // Check for heat sources
        const actions = game.actionTracker ? game.actionTracker.getActions() : {};
        
        if (actions.fireLit || actions.candleHeater) {
            this.warmthSources.push({ type: 'candle_heater', warmth: 15 });
            totalWarmth += 15;
        }
        
        if (actions.sternoOn) {
            this.warmthSources.push({ type: 'sterno', warmth: 20 });
            totalWarmth += 20;
        }
        
        if (actions.furnaceOn) {
            this.warmthSources.push({ type: 'furnace', warmth: 40 });
            totalWarmth += 40;
        }
        
        // Equipped clothing (feet count less - handled inside getTotalWarmth)
        if (game.equipSystem) {
            const equipWarmth = game.equipSystem.getTotalWarmth();
            if (equipWarmth > 0) {
                this.warmthSources.push({ type: 'equipped', warmth: equipWarmth });
                totalWarmth += equipWarmth;
            }
        } else {
            const clothingCount = game.inventory ? 
                (game.inventory.getItemsByType && game.inventory.getItemsByType('clothing').length) : 0;
            if (clothingCount > 0) {
                this.warmthSources.push({ type: 'clothing', warmth: clothingCount * 5 });
                totalWarmth += clothingCount * 5;
            }
        }
        
        // Effective temperature
        const effectiveTemp = this.baseTemperature + totalWarmth;
        
        // Update meter system temperature modifier
        if (game.meters) {
            const tempEffect = weather.getTemperatureEffect();
            game.meters.temperatureModifier = tempEffect.hungerModifier - 1.0;
            
            // Apply health drain from cold
            if (effectiveTemp < 40 && !this.warmthSources.length) {
                game.meters.health.value -= tempEffect.healthDrain * (1/3600); // Per hour
            }
        }
        
        return effectiveTemp;
    }

    getWarmthLevel() {
        return this.baseTemperature + this.getTotalWarmth();
    }

    /** Indoor temperature: slightly warmer than outside (no wind). ~32°F outside → ~42°F inside (+10). Plus heat sources. */
    getIndoorTemperature() {
        const outside = this.weatherSystem ? this.weatherSystem.temperature : this.baseTemperature;
        const noWindBonus = 10; // basement is ~10°F warmer than outside by default
        return outside + noWindBonus + this.getTotalWarmth();
    }

    getTotalWarmth() {
        let warmth = 0;
        for (const source of this.warmthSources) {
            warmth += source.warmth;
        }
        return warmth;
    }

    isComfortable() {
        return this.getWarmthLevel() >= 60;
    }

    isCold() {
        return this.getWarmthLevel() < 50;
    }

    isFreezing() {
        return this.getWarmthLevel() < 30;
    }
}
