/**
 * 7 DAYS... - DEATH MARKER SYSTEM
 * 
 * 💀 WHAT IS THIS FILE?
 * This manages the "Ghosts of the Basement" - persistent death markers that show
 * on the title screen where previous players died. Spooky!
 * 
 * 🎯 WHAT IT DOES:
 * - Saves death locations to localStorage
 * - Displays skull markers on title screen
 * - Shows death info on hover (name, days survived, cause)
 * - Tracks survivor counter (for "Survivor #X" names)
 * 
 * 💡 WANT TO CHANGE DEATH MARKERS?
 * - Modify marker appearance in TitleScreen.js renderDeathMarkers()
 * - Change what info is shown on hover
 * - Add more death causes in DeathScreen.js
 * 
 * 🎨 DEATH MARKER DATA:
 * - Player name (or "Survivor #X" if skipped)
 * - Real date (when they died in real life)
 * - Days survived (how long they lasted)
 * - Cause of death (what killed them)
 * - Location (x, y coordinates in basement)
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to save markers (they won't persist!)
 * - Not clearing markers when factory reset
 * - Making markers too intrusive (should be atmospheric, not annoying)
 */

class DeathMarkerSystem {
    constructor() {
        // 💀 DEATH TRACKING: Keep track of all player deaths
        this.storageKey = '7days_death_markers'; // localStorage key
        this.markers = this.loadMarkers(); // Load existing markers
        this.survivorCounter = this.getSurvivorCounter(); // Counter for "Survivor #X" names
    }

    loadMarkers() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    saveMarkers() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.markers));
            return true;
        } catch (e) {
            console.error('Failed to save death markers:', e);
            return false;
        }
    }

    getSurvivorCounter() {
        try {
            const counter = localStorage.getItem('sublevelblue_survivor_counter');
            return counter ? parseInt(counter) : 0;
        } catch (e) {
            return 0;
        }
    }

    incrementSurvivorCounter() {
        this.survivorCounter++;
        try {
            localStorage.setItem('7days_survivor_counter', this.survivorCounter.toString());
        } catch (e) {
            console.error('Failed to save survivor counter:', e);
        }
    }

    addDeathMarker(playerName, daysSurvived, cause, location) {
        const marker = {
            id: `death_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            playerName: playerName || `Survivor #${this.survivorCounter + 1}`,
            realDate: new Date().toISOString().split('T')[0],
            daysSurvived: daysSurvived,
            cause: cause,
            location: location || { x: 640, y: 360 } // Default center if no location
        };

        this.markers.push(marker);
        if (!playerName) {
            this.incrementSurvivorCounter();
        }
        this.saveMarkers();
        return marker;
    }

    getMarkers() {
        return [...this.markers];
    }

    clearMarkers() {
        this.markers = [];
        this.saveMarkers();
    }

    getMarkerCount() {
        return this.markers.length;
    }
}
