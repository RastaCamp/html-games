/**
 * 7 DAYS... - ACTION TRACKER
 * 
 * 📝 WHAT IS THIS FILE?
 * This tracks what the player has done. Generator on? Fire lit? Window open?
 * Other systems use this to trigger events and calculate attraction.
 * 
 * 🎯 WHAT IT TRACKS:
 * - Generator state (on/off, how long, etc.)
 * - Lights (flashlight, candles, etc.)
 * - Windows (open/closed, boarded, etc.)
 * - Waste management (dumped, composted, etc.)
 * - Cooking (what, ventilation, etc.)
 * - Noise level (hammering, radio, etc.)
 * 
 * 💡 WANT TO TRACK NEW ACTIONS?
 * 1. Add property to this.actions object
 * 2. Set it when action happens (in Game.js or wherever)
 * 3. Other systems can check it (AttractionSystem, EventSystem, etc.)
 * 
 * 🎨 ACTION USES:
 * - AttractionSystem: Uses actions to calculate threat
 * - EventSystem: Triggers events based on actions
 * - FatigueSystem: Tracks if actively crafting/working
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to update actions when things change
 * - Not resetting actions when appropriate
 * - Making actions too granular (overcomplicated)
 */

class ActionTracker {
    constructor() {
        // 📝 ACTION STATE: Track what the player is doing/has done
        this.actions = {
            generatorOn: false,
            generatorStartTime: null,
            generatorTotalHours: 0,
            lightsOn: false,
            lightsOnAtNight: false,
            flashlightUsed: false,
            windowOpen: false,
            windowBoarded: false,
            wasteDumped: 0, // Count of times waste dumped out window
            wasteInSumpPump: false,
            compostOverflow: false,
            cooking: false,
            cookingMeat: false,
            cookingVentilation: false,
            powerToolsUsed: false,
            hammering: false,
            radioOn: false,
            radioVolume: 0, // 0-100
            radioTransmitting: false,
            waterRunning: false,
            fireLit: false,
            fireVentilation: false,
            smokeVisible: false,
            lastNoiseTime: null,
            noiseLevel: 0, // 0-100
            lastActionTime: Date.now()
        };
        this.isActive = false; // Track if player is actively crafting/working
        
        this.history = []; // Log of recent actions
    }

    recordAction(actionType, details = {}) {
        const timestamp = Date.now();
        this.actions.lastActionTime = timestamp;
        
        switch (actionType) {
            case 'generator_on':
                this.actions.generatorOn = true;
                this.actions.generatorStartTime = timestamp;
                break;
            case 'generator_off':
                if (this.actions.generatorStartTime) {
                    const hours = (timestamp - this.actions.generatorStartTime) / (1000 * 60 * 60);
                    this.actions.generatorTotalHours += hours;
                }
                this.actions.generatorOn = false;
                this.actions.generatorStartTime = null;
                break;
            case 'lights_on':
                this.actions.lightsOn = true;
                break;
            case 'lights_off':
                this.actions.lightsOn = false;
                break;
            case 'flashlight_used':
                this.actions.flashlightUsed = true;
                setTimeout(() => {
                    this.actions.flashlightUsed = false;
                }, 5000); // Reset after 5 seconds
                break;
            case 'window_open':
                this.actions.windowOpen = true;
                break;
            case 'window_close':
                this.actions.windowOpen = false;
                break;
            case 'window_board':
                this.actions.windowBoarded = true;
                break;
            case 'waste_dump_window':
                this.actions.wasteDumped++;
                break;
            case 'waste_dump_sump':
                this.actions.wasteInSumpPump = true;
                break;
            case 'compost_overflow':
                this.actions.compostOverflow = true;
                break;
            case 'cooking_start':
                this.actions.cooking = true;
                this.actions.cookingMeat = details.isMeat || false;
                this.actions.cookingVentilation = details.ventilation || false;
                break;
            case 'cooking_stop':
                this.actions.cooking = false;
                this.actions.cookingMeat = false;
                break;
            case 'power_tools':
                this.actions.powerToolsUsed = true;
                this.actions.noiseLevel = Math.max(this.actions.noiseLevel, 80);
                this.actions.lastNoiseTime = timestamp;
                break;
            case 'hammering':
                this.actions.hammering = true;
                this.actions.noiseLevel = Math.max(this.actions.noiseLevel, 50);
                this.actions.lastNoiseTime = timestamp;
                setTimeout(() => {
                    this.actions.hammering = false;
                }, 10000); // Reset after 10 seconds
                break;
            case 'radio_on':
                this.actions.radioOn = true;
                this.actions.radioVolume = details.volume || 50;
                break;
            case 'radio_off':
                this.actions.radioOn = false;
                break;
            case 'radio_transmit':
                this.actions.radioTransmitting = true;
                break;
            case 'fire_lit':
                this.actions.fireLit = true;
                this.actions.fireVentilation = details.ventilation || false;
                break;
            case 'fire_extinguished':
                this.actions.fireLit = false;
                break;
            case 'water_running':
                this.actions.waterRunning = true;
                break;
            case 'water_stopped':
                this.actions.waterRunning = false;
                break;
        }
        
        // Add to history
        this.history.push({
            type: actionType,
            timestamp: timestamp,
            details: details
        });
        
        // Keep only last 50 actions
        if (this.history.length > 50) {
            this.history.shift();
        }
    }

    update(game) {
        const currentTime = Date.now();
        const isNight = game.dayCycle.isNight;
        
        // Update lights at night status
        this.actions.lightsOnAtNight = this.actions.lightsOn && isNight;
        
        // Decay noise level
        if (this.actions.lastNoiseTime) {
            const minutesSinceNoise = (currentTime - this.actions.lastNoiseTime) / (1000 * 60);
            if (minutesSinceNoise > 30) {
                this.actions.noiseLevel = Math.max(0, this.actions.noiseLevel - 1);
            }
        }
        
        // Check for smoke visibility (if fire without ventilation)
        if (this.actions.fireLit && !this.actions.fireVentilation) {
            this.actions.smokeVisible = true;
        } else {
            this.actions.smokeVisible = false;
        }
        
        // Update generator hours if running
        if (this.actions.generatorOn && this.actions.generatorStartTime) {
            const hours = (currentTime - this.actions.generatorStartTime) / (1000 * 60 * 60);
            if (hours > 2) {
                // Generator has been running for more than 2 hours
                // This will be checked by AttractionSystem
            }
        }
    }

    getActions() {
        return { ...this.actions };
    }

    getState() {
        return {
            actions: this.actions,
            history: this.history.slice(-20) // Save last 20 actions
        };
    }

    setState(state) {
        this.actions = state.actions || this.actions;
        this.history = state.history || [];
    }
}
