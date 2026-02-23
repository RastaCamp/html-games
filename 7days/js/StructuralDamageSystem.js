/**
 * 7 DAYS... - STRUCTURAL DAMAGE SYSTEM
 * 
 * 🏚️ WHAT IS THIS FILE?
 * This manages damage to the basement structure. Heavy rain causes leaks,
 * freezing bursts pipes, fire damages the foundation. The building is falling apart!
 * 
 * 🎯 DAMAGE TYPES:
 * - Ceiling: Leaks from heavy rain (damages floor items)
 * - Pipes: Burst from freezing (no more pipe water!)
 * - Foundation: Cracks from fire (long-term damage)
 * - Windows: Can break (not implemented yet, but could be!)
 * 
 * 💡 WANT TO ADD NEW DAMAGE?
 * 1. Add to damage object in constructor()
 * 2. Add damage logic in update()
 * 3. Add repair method
 * 4. Test it!
 * 
 * 🎨 DAMAGE SOURCES:
 * - Heavy rain → Ceiling leaks
 * - Freezing temps → Pipe bursts
 * - Fire → Foundation cracks
 * 
 * 🐛 COMMON MISTAKES:
 * - Making damage too fast (unfair)
 * - Not providing repair options (frustrating)
 * - Forgetting to check damage level before applying effects
 */

class StructuralDamageSystem {
    constructor() {
        // 🏚️ DAMAGE TRACKING: Track damage to different parts of the building
        this.damage = {
            ceiling: 0,    // 0-100 (0 = fine, 100 = collapsed)
            pipes: 0,      // 0-100 (0 = working, 100 = all broken)
            foundation: 0, // 0-100 (0 = solid, 100 = unstable)
            windows: 0     // 0-100 (0 = intact, 100 = shattered)
        };
    }

    update(deltaTime, game) {
        const hours = deltaTime / 3600;
        
        // Heavy rain causes ceiling leaks
        if (game.weatherSystem && game.weatherSystem.currentWeather === 'rain' && 
            game.weatherSystem.rainfall > 5) {
            this.damage.ceiling = Math.min(100, this.damage.ceiling + 0.5 * hours);
            
            if (this.damage.ceiling > 30 && Math.random() < 0.1 * hours / 24) {
                if (window.game) {
                    window.game.addMessage('Water is leaking through the ceiling!');
                }
                // Leaks damage items on floor
                if (game.inventory && Math.random() < 0.05) {
                    const floorItems = game.inventory.items.filter(item => 
                        item.storedProperly === false);
                    if (floorItems.length > 0) {
                        const damaged = floorItems[Math.floor(Math.random() * floorItems.length)];
                        if (damaged.condition) {
                            damaged.condition = 'Damaged';
                            if (window.game) {
                                window.game.addMessage(`${damaged.name} got wet and damaged!`);
                            }
                        }
                    }
                }
            }
        }
        
        // Freezing causes pipe bursts
        if (game.weatherSystem && game.weatherSystem.temperature < 32) {
            this.damage.pipes = Math.min(100, this.damage.pipes + 0.3 * hours);
            
            if (this.damage.pipes > 50 && Math.random() < 0.05 * hours / 24) {
                if (window.game) {
                    window.game.addMessage('A pipe has burst! Water everywhere!');
                }
                // Pipe burst = no more pipe water
                game.meters.hygiene.value += 5; // Water damage
            }
        }
        
        // Flood causes foundation cracks
        if (game.fireSystem && game.fireSystem.hasActiveFires()) {
            // Fire damage to structure
            this.damage.foundation = Math.min(100, this.damage.foundation + 0.2 * hours);
        }
    }

    repairDamage(area, materials) {
        const repairAmount = materials.includes('duct_tape') ? 20 : 10;
        if (this.damage[area] !== undefined) {
            this.damage[area] = Math.max(0, this.damage[area] - repairAmount);
            if (window.game) {
                window.game.addMessage(`Repaired ${area} damage!`);
            }
            return true;
        }
        return false;
    }

    getDamageLevel(area) {
        return this.damage[area] || 0;
    }

    getState() {
        return { damage: { ...this.damage } };
    }

    setState(state) {
        this.damage = state.damage || {
            ceiling: 0,
            pipes: 0,
            foundation: 0,
            windows: 0
        };
    }
}
