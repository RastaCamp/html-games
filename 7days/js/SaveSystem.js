/**
 * 7 DAYS... - SAVE SYSTEM
 * 
 * 💾 WHAT IS THIS FILE?
 * This handles saving and loading game state. Everything gets saved to localStorage
 * (which is like a tiny database in the browser).
 * 
 * 🎯 WHAT IT DOES:
 * - Saves entire game state to browser storage
 * - Loads game state when player clicks "Continue"
 * - Deletes saves when player wants to start fresh
 * 
 * 💡 WANT TO ADD NEW DATA TO SAVE?
 * 1. Add it to save() method: saveData.myNewThing = game.myNewThing.getState()
 * 2. Add it to load() method: game.myNewThing.setState(saveData.myNewThing)
 * 3. Make sure your system has getState() and setState() methods
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to save new systems (they won't persist!)
 * - Not handling missing data in load() (old saves might not have new fields)
 * - localStorage has size limits (~5-10MB) - don't save huge arrays
 * 
 * ⚠️ WARNING: localStorage can be cleared by the browser/user.
 * Don't rely on it for critical data. It's for convenience, not security.
 */

class SaveSystem {
    constructor() {
        this.saveKey = '7days_save'; // Key for localStorage (change this if you want separate saves)
    }

    save(game) {
        const saveData = {
            version: '1.0',
            timestamp: Date.now(),
            gameState: game.gameState.getState(),
            meters: game.meters.getState(),
            inventory: game.inventory.getState(),
            dayCycle: game.dayCycle.getState(),
            events: game.events.getState(),
            interactables: game.interactables.getState(),
            achievements: game.achievements ? game.achievements.getState() : {},
            actionTracker: game.actionTracker ? game.actionTracker.getState() : {},
            attractionSystem: game.attractionSystem ? game.attractionSystem.getState() : {},
            deathMarkers: game.deathMarkers ? game.deathMarkers.getAllMarkers() : [],
            tipJar: game.tipJar ? game.tipJar.tipsData : { currentTips: 0, earnedTips: [] },
            weatherSystem: game.weatherSystem ? game.weatherSystem.getState() : null,
            temperatureSystem: game.temperatureSystem ? { warmthSources: game.temperatureSystem.warmthSources } : null,
            combatSystem: game.combatSystem ? game.combatSystem.getState() : null,
            fireSystem: game.fireSystem ? game.fireSystem.getState() : null,
            extractionTime: game.extractionTime,
            extractionMissed: game.extractionMissed,
            luckSystem: game.luckSystem ? game.luckSystem.getState() : null,
            decaySystem: game.decaySystem ? game.decaySystem.getState() : null,
            moldSystem: game.moldSystem ? game.moldSystem.getState() : null,
            pestSystem: game.pestSystem ? game.pestSystem.getState() : null,
            structuralDamageSystem: game.structuralDamageSystem ? game.structuralDamageSystem.getState() : null,
            previousSurvivorSystem: game.previousSurvivorSystem ? game.previousSurvivorSystem.getState() : null,
            locationSystem: game.locationSystem ? game.locationSystem.getState() : null,
            desensitizationSystem: game.desensitizationSystem ? game.desensitizationSystem.getState() : null,
            equipSystem: game.equipSystem ? game.equipSystem.getState() : null
        };

        try {
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            return { success: true, message: 'Game saved successfully!' };
        } catch (e) {
            return { success: false, message: 'Failed to save: ' + e.message };
        }
    }

    load(game) {
        try {
            const saveDataStr = localStorage.getItem(this.saveKey);
            if (!saveDataStr) {
                return { success: false, message: 'No save file found' };
            }

            const saveData = JSON.parse(saveDataStr);
            
            game.gameState.setState(saveData.gameState);
            game.meters.setState(saveData.meters);
            game.inventory.setState(saveData.inventory);
            game.dayCycle.setState(saveData.dayCycle);
            game.events.setState(saveData.events);
            game.interactables.setState(saveData.interactables);
            if (game.achievements && saveData.achievements) {
                game.achievements.setState(saveData.achievements);
            }
            if (game.actionTracker && saveData.actionTracker) {
                game.actionTracker.setState(saveData.actionTracker);
            }
            if (game.attractionSystem && saveData.attractionSystem) {
                game.attractionSystem.setState(saveData.attractionSystem);
            }
            if (game.deathMarkers && saveData.deathMarkers) {
                game.deathMarkers.markers = saveData.deathMarkers;
            }
            if (game.tipJar && saveData.tipJar) {
                game.tipJar.tipsData = saveData.tipJar;
            }
            if (game.weatherSystem && saveData.weatherSystem) {
                game.weatherSystem.setState(saveData.weatherSystem);
            }
            if (game.temperatureSystem && saveData.temperatureSystem) {
                game.temperatureSystem.warmthSources = saveData.temperatureSystem.warmthSources || [];
            }
            if (game.combatSystem && saveData.combatSystem) {
                game.combatSystem.setState(saveData.combatSystem);
            }
            if (game.fireSystem && saveData.fireSystem) {
                game.fireSystem.setState(saveData.fireSystem);
            }
            if (saveData.extractionTime !== undefined) {
                game.extractionTime = saveData.extractionTime;
            }
            if (saveData.extractionMissed !== undefined) {
                game.extractionMissed = saveData.extractionMissed;
            }
            if (game.luckSystem && saveData.luckSystem) {
                game.luckSystem.setState(saveData.luckSystem);
            }
            if (game.decaySystem && saveData.decaySystem) {
                game.decaySystem.setState(saveData.decaySystem);
            }
            if (game.moldSystem && saveData.moldSystem) {
                game.moldSystem.setState(saveData.moldSystem);
            }
            if (game.pestSystem && saveData.pestSystem) {
                game.pestSystem.setState(saveData.pestSystem);
            }
            if (game.structuralDamageSystem && saveData.structuralDamageSystem) {
                game.structuralDamageSystem.setState(saveData.structuralDamageSystem);
            }
            if (game.previousSurvivorSystem && saveData.previousSurvivorSystem) {
                game.previousSurvivorSystem.setState(saveData.previousSurvivorSystem);
            }
            if (game.locationSystem && saveData.locationSystem) {
                game.locationSystem.setState(saveData.locationSystem);
            }
            if (game.locationSystem && game.gameState && game.gameState.sceneLoot) {
                game.locationSystem.syncFromSceneLoot(game);
            }
            if (game.desensitizationSystem && saveData.desensitizationSystem) {
                game.desensitizationSystem.setState(saveData.desensitizationSystem);
            }
            if (game.equipSystem && saveData.equipSystem) {
                game.equipSystem.setState(saveData.equipSystem);
            }

            return { success: true, message: 'Game loaded successfully!' };
        } catch (e) {
            return { success: false, message: 'Failed to load: ' + e.message };
        }
    }

    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    deleteSave() {
        localStorage.removeItem(this.saveKey);
    }
}
