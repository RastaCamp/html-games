/**
 * 7 DAYS... - DECAY SYSTEM
 * 
 * 🛠️ WHAT IS THIS FILE?
 * This manages things that wear out over time. Fortifications weaken, tools break,
 * food spoils faster if not stored properly. Nothing lasts forever!
 * 
 * 🎯 WHAT DECAYS:
 * - Fortifications: Weaken over time (mongrels test them)
 * - Tools: Break with use (durability decreases)
 * - Food: Spoils faster if not stored properly
 * 
 * 💡 WANT TO CHANGE DECAY RATES?
 * - Fortification decay: Modify decay rate in update()
 * - Tool durability: Change wearAmount in useTool()
 * - Food spoilage: Adjust storageBonus multiplier
 * 
 * 🎨 REPAIR SYSTEM:
 * - Fortifications can be repaired with materials
 * - Tools can't be repaired (they break, that's it)
 * - Food can't be un-spoiled (once spoiled, always spoiled)
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to register fortifications/tools before using them
 * - Not checking durability before using tools
 * - Making things decay too fast (frustrating) or too slow (boring)
 */

class DecaySystem {
    constructor() {
        // 📦 DECAY TRACKING: Keep track of what's wearing out
        this.fortifications = {}; // { id: { durability: 100, lastCheck: timestamp } }
        this.tools = {}; // { id: { durability: 100, uses: 0 } }
    }

    update(deltaTime, game) {
        const hours = deltaTime / 3600;
        
        // Fortifications decay over time (mongrels test them)
        for (const [id, fort] of Object.entries(this.fortifications)) {
            if (fort.durability > 0) {
                // Decay rate: 1% per day if mongrels are active
                const mongrelActivity = game.attractionSystem ? 
                    game.attractionSystem.getThreatLevel() === 'CRITICAL' ? 2 : 1 : 1;
                fort.durability = Math.max(0, fort.durability - (0.01 * hours * mongrelActivity / 24));
                
                if (fort.durability < 50 && !fort.warningShown) {
                    if (window.game) {
                        window.game.addMessage(`Fortification ${id} is weakening!`);
                    }
                    fort.warningShown = true;
                }
                
                if (fort.durability <= 0) {
                    if (window.game) {
                        window.game.addMessage(`Fortification ${id} has failed!`);
                    }
                }
            }
        }
        
        // Food spoilage (if not stored properly)
        if (game.inventory) {
            for (const item of game.inventory.items) {
                if (item.type === 'food' && item.condition !== 'Spoiled') {
                    // Food spoils faster if not in proper container
                    const storageBonus = item.storedProperly ? 0.5 : 1.0;
                    if (item.expiresIn !== undefined && item.expiresIn > 0) {
                        item.expiresIn -= hours * storageBonus;
                        if (item.expiresIn <= 0) {
                            item.condition = 'Spoiled';
                            if (window.game) {
                                window.game.addMessage(`${item.name} has spoiled!`);
                            }
                        }
                    }
                }
            }
        }
    }

    registerFortification(id, durability = 100) {
        this.fortifications[id] = {
            durability: durability,
            lastCheck: Date.now(),
            warningShown: false
        };
    }

    registerTool(id, durability = 100) {
        this.tools[id] = {
            durability: durability,
            uses: 0
        };
    }

    useTool(id, wearAmount = 1) {
        if (this.tools[id]) {
            this.tools[id].uses += wearAmount;
            this.tools[id].durability = Math.max(0, this.tools[id].durability - wearAmount);
            
            if (this.tools[id].durability <= 0) {
                if (window.game) {
                    window.game.addMessage(`Tool ${id} has broken!`);
                }
                return false; // Tool broken
            }
            return true; // Tool still works
        }
        return true; // Tool not tracked (unlimited durability)
    }

    repairFortification(id, repairAmount = 20) {
        if (this.fortifications[id]) {
            this.fortifications[id].durability = Math.min(100, 
                this.fortifications[id].durability + repairAmount);
            this.fortifications[id].warningShown = false;
            return true;
        }
        return false;
    }

    getFortificationDurability(id) {
        return this.fortifications[id] ? this.fortifications[id].durability : 100;
    }

    getToolDurability(id) {
        return this.tools[id] ? this.tools[id].durability : 100;
    }

    getState() {
        return {
            fortifications: JSON.parse(JSON.stringify(this.fortifications)),
            tools: JSON.parse(JSON.stringify(this.tools))
        };
    }

    setState(state) {
        this.fortifications = state.fortifications || {};
        this.tools = state.tools || {};
    }
}
