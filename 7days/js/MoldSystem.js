/**
 * 7 DAYS... - MOLD SYSTEM
 * 
 * 🍄 WHAT IS THIS FILE?
 * This manages mold growth! If you stay dirty too long, mold grows.
 * Mold makes food spoil faster, causes sickness, and is generally gross.
 * 
 * 🎯 HOW MOLD WORKS:
 * - Grows if hygiene >70 for extended period
 * - Dies off if hygiene <50 (you cleaned up!)
 * - Spawns in locations (corner, under sink, etc.)
 * - Can be cleaned with bleach/vinegar/water
 * 
 * 💡 WANT TO CHANGE MOLD?
 * - Growth rate: Modify the +0.5 in update()
 * - Death rate: Modify the -0.2 in update()
 * - Spawn chance: Change the 0.01 in update()
 * 
 * 🎨 MOLD EFFECTS:
 * - Food spoils 50% faster
 * - 10% per day chance of sickness
 * - Morale drain (it's gross!)
 * 
 * 🐛 COMMON MISTAKES:
 * - Making mold grow too fast (unfair)
 * - Making mold impossible to clean (frustrating)
 * - Forgetting to check mold level before applying effects
 */

class MoldSystem {
    constructor() {
        // 🍄 MOLD STATE: Track how moldy the basement is
        this.moldLevel = 0; // 0-100 (0 = clean, 100 = DISGUSTING)
        this.moldLocations = []; // Array of locations with mold (for cleaning)
    }

    update(deltaTime, game) {
        const hours = deltaTime / 3600;
        
        // Mold grows if hygiene is high for extended period
        if (game.meters.hygiene.value > 70) {
            this.moldLevel += 0.5 * hours; // Grows slowly
        } else if (game.meters.hygiene.value < 50) {
            this.moldLevel = Math.max(0, this.moldLevel - 0.2 * hours); // Dies off slowly
        }
        
        this.moldLevel = Math.min(100, this.moldLevel);
        
        // Effects of mold
        if (this.moldLevel > 50) {
            // Food spoils faster
            if (game.inventory) {
                for (const item of game.inventory.items) {
                    if (item.type === 'food' && item.expiresIn !== undefined) {
                        item.expiresIn -= hours * 0.5; // 50% faster spoilage
                    }
                }
            }
            
            // Sickness risk
            if (Math.random() < 0.1 * hours / 24) { // 10% per day
                game.meters.triggerSickness();
                if (window.game) {
                    window.game.addMessage('The mold is making you sick!');
                }
            }
        }
        
        // Spawn mold in locations
        if (this.moldLevel > 30 && Math.random() < 0.01 * hours) {
            const locations = ['corner', 'under_sink', 'behind_furnace', 'window_well'];
            const newLocation = locations[Math.floor(Math.random() * locations.length)];
            if (!this.moldLocations.includes(newLocation)) {
                this.moldLocations.push(newLocation);
                if (window.game) {
                    window.game.addMessage(`Mold is growing in the ${newLocation.replace('_', ' ')}!`);
                }
            }
        }
    }

    cleanMold(location, method) {
        const methods = {
            'bleach': 0.9,
            'vinegar': 0.7,
            'water': 0.3
        };
        
        const successChance = methods[method] || 0.3;
        if (Math.random() < successChance) {
            const index = this.moldLocations.indexOf(location);
            if (index > -1) {
                this.moldLocations.splice(index, 1);
                this.moldLevel = Math.max(0, this.moldLevel - 20);
                if (window.game) {
                    window.game.addMessage(`Cleaned mold from ${location.replace('_', ' ')}!`);
                }
                return true;
            }
        }
        return false;
    }

    getState() {
        return {
            moldLevel: this.moldLevel,
            moldLocations: [...this.moldLocations]
        };
    }

    setState(state) {
        this.moldLevel = state.moldLevel || 0;
        this.moldLocations = state.moldLocations || [];
    }
}
