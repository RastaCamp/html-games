/**
 * 7 DAYS... - FIRE SYSTEM
 * 
 * 🔥 WHAT IS THIS FILE?
 * This manages fires in the basement. Fires can start from candles, explosions,
 * gasoline defense, etc. They spread, grow, and can burn everything down!
 * 
 * 🎯 FIRE GROWTH:
 * - Small: Just started, easy to put out
 * - Medium: Spreading, harder to extinguish
 * - Large: Out of control, game over if not stopped!
 * 
 * 💡 WANT TO MAKE FIRES MORE/LESS DANGEROUS?
 * - Change fireSpreadRate (lower = slower spread)
 * - Modify growth times (small→medium, medium→large)
 * - Adjust extinguishing success chances
 * 
 * 🎨 FIRE SOURCES:
 * - Candle knocked over
 * - Methane generator explosion
 * - Gasoline defense gone wrong
 * - Propane stove left on
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to update fires every frame (they won't spread!)
 * - Not checking for game over when fire is large
 * - Making fires too easy/hard to extinguish
 */

class FireSystem {
    constructor() {
        // 🔥 FIRE TRACKING: Keep track of all active fires
        this.fires = []; // Array of active fires (can have multiple!)
        this.fireSpreadRate = 0.1; // How fast fires spread (0.0 to 1.0, lower = slower)
    }

    startFire(source, location, game) {
        const fire = {
            id: `fire_${Date.now()}`,
            source: source, // 'candle', 'methane', 'gasoline', 'propane'
            location: location, // { x, y, area: string }
            size: 'small', // 'small', 'medium', 'large'
            intensity: 1.0,
            timer: 0,
            spreadTimer: 0
        };
        
        this.fires.push(fire);
        
        if (game) {
            game.addMessage(`Fire starts from ${source}!`);
            if (source === 'methane') {
                game.addMessage('BOOM! The methane generator explodes!');
                game.meters.health.value -= 20;
                game.meters.addInjury('moderate', 'explosion');
            }
        }
        
        return fire;
    }

    update(deltaTime, game) {
        const hours = deltaTime / 3600;
        
        for (let i = this.fires.length - 1; i >= 0; i--) {
            const fire = this.fires[i];
            fire.timer += hours;
            fire.spreadTimer += hours;
            
            // Fire grows over time
            if (fire.size === 'small' && fire.timer > 0.5) {
                fire.size = 'medium';
                fire.intensity = 1.5;
                if (game) game.addMessage('The fire is spreading!');
            } else if (fire.size === 'medium' && fire.timer > 2) {
                fire.size = 'large';
                fire.intensity = 2.0;
                if (game) game.addMessage('The fire is out of control!');
            }
            
            // Fire spreads
            if (fire.spreadTimer > 1) {
                fire.spreadTimer = 0;
                if (Math.random() < this.fireSpreadRate * fire.intensity) {
                    this.spreadFire(fire, game);
                }
            }
            
            // Large fire = game over
            if (fire.size === 'large' && fire.timer > 5) {
                if (game) {
                    game.addMessage('The basement is consumed by fire!');
                    game.handleGameOver('fire');
                }
                this.fires.splice(i, 1);
                continue;
            }
            
            // Damage items near fire
            if (fire.size === 'medium' || fire.size === 'large') {
                this.damageNearbyItems(fire, game);
            }
        }
    }

    spreadFire(fire, game) {
        // Fire spreads to adjacent areas
        const spreadAreas = [
            { x: fire.location.x + 50, y: fire.location.y, area: 'nearby' },
            { x: fire.location.x - 50, y: fire.location.y, area: 'nearby' }
        ];
        
        for (const area of spreadAreas) {
            if (Math.random() < 0.3) {
                const newFire = this.startFire('spread', area, game);
                newFire.size = fire.size;
                newFire.intensity = fire.intensity * 0.8;
                if (game) game.addMessage('Fire spreads to nearby area!');
            }
        }
    }

    damageNearbyItems(fire, game) {
        // Damage random items in inventory (if fire is large)
        if (fire.size === 'large' && Math.random() < 0.1) {
            if (game.inventory.items.length > 0) {
                const item = game.inventory.items[Math.floor(Math.random() * game.inventory.items.length)];
                if (item && item.condition !== 'Destroyed') {
                    // Some items are fireproof
                    const fireproof = ['hammer', 'wrench', 'screwdriver', 'metal'];
                    if (!fireproof.includes(item.id)) {
                        game.inventory.removeItem(item.id, 1);
                        game.addMessage(`${item.name} is destroyed by fire!`);
                    }
                }
            }
        }
    }

    extinguishFire(fireId, method, game) {
        const fireIndex = this.fires.findIndex(f => f.id === fireId);
        if (fireIndex === -1) return { success: false, message: 'Fire not found' };
        
        const fire = this.fires[fireIndex];
        
        const methods = {
            'fire_extinguisher': { small: 1.0, medium: 0.8, large: 0.5 },
            'water': { small: 0.9, medium: 0.6, large: 0.3 },
            'dirt': { small: 0.7, medium: 0.4, large: 0.2 },
            'blanket': { small: 0.8, medium: 0.5, large: 0.2 }
        };
        
        const methodData = methods[method];
        if (!methodData) return { success: false, message: 'Invalid extinguishing method' };
        
        const successChance = methodData[fire.size];
        if (Math.random() < successChance) {
            this.fires.splice(fireIndex, 1);
            if (game) {
                game.addMessage(`Fire extinguished using ${method}!`);
                if (method === 'fire_extinguisher' && game.inventory.hasItem('fire_extinguisher', 1)) {
                    // Fire extinguisher has limited uses
                    const extinguisher = game.inventory.getItem('fire_extinguisher');
                    if (extinguisher && extinguisher.uses !== undefined) {
                        extinguisher.uses = (extinguisher.uses || 5) - 1;
                        if (extinguisher.uses <= 0) {
                            game.inventory.removeItem('fire_extinguisher', 1);
                            game.addMessage('Fire extinguisher is empty!');
                        }
                    }
                }
            }
            return { success: true, message: 'Fire extinguished!' };
        } else {
            if (game) game.addMessage(`Attempt to extinguish failed. Fire is too ${fire.size}!`);
            return { success: false, message: 'Extinguishing failed' };
        }
    }

    getAllFires() {
        return this.fires;
    }

    hasActiveFires() {
        return this.fires.length > 0;
    }

    getState() {
        return {
            fires: this.fires.map(fire => ({ ...fire }))
        };
    }

    setState(state) {
        this.fires = state.fires || [];
    }
}
