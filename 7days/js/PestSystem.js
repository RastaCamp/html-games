/**
 * 7 DAYS... - PEST SYSTEM
 * 
 * 🐀 WHAT IS THIS FILE?
 * This manages pests! Rats, spiders, roaches, centipedes - all the creepy crawlies
 * that show up when you're dirty. They cause various problems and are generally annoying.
 * 
 * 🎯 PEST TYPES:
 * - Rats: Steal food from inventory (the worst!)
 * - Spiders: Drain morale (they're creepy)
 * - Roaches: Increase hygiene (they're gross)
 * - Centipedes: Random morale hits (just... why?)
 * 
 * 💡 WANT TO ADD A NEW PEST?
 * 1. Add it to spawnPest() pestTypes array
 * 2. Add effect in applyPestEffects()
 * 3. Add message when it spawns
 * 4. Test it!
 * 
 * 🎨 PEST SPAWNING:
 * - Based on hygiene level (dirty = more pests)
 * - Spawns every 24 hours if conditions are met
 * - Can have multiple pests at once (joy!)
 * 
 * 🐛 COMMON MISTAKES:
 * - Making pests spawn too often (annoying)
 * - Making pests too powerful (unfair)
 * - Forgetting to remove pests when killed
 */

class PestSystem {
    constructor() {
        // 🐀 PEST TRACKING: Keep track of active pests
        this.pests = []; // Array of active pests (each has type, effect, timer, location)
        this.pestSpawnTimer = 0; // Timer for next pest spawn (in hours)
    }

    update(deltaTime, game) {
        const hours = deltaTime / 3600;
        this.pestSpawnTimer += hours;
        
        // Pests spawn based on hygiene and food availability
        if (this.pestSpawnTimer > 24 && game.meters.hygiene.value > 60) {
            this.pestSpawnTimer = 0;
            this.spawnPest(game);
        }
        
        // Update existing pests
        for (let i = this.pests.length - 1; i >= 0; i--) {
            const pest = this.pests[i];
            pest.timer -= hours;
            
            if (pest.timer <= 0) {
                this.pests.splice(i, 1);
            } else {
                // Pests cause effects
                this.applyPestEffects(pest, game);
            }
        }
    }

    spawnPest(game) {
        const pestTypes = [
            { type: 'rat', chance: 0.3, effect: 'steals_food' },
            { type: 'spider', chance: 0.4, effect: 'morale_drain' },
            { type: 'roach', chance: 0.5, effect: 'hygiene_increase' },
            { type: 'centipede', chance: 0.2, effect: 'creepy' }
        ];
        
        const roll = Math.random();
        let cumulative = 0;
        for (const pestType of pestTypes) {
            cumulative += pestType.chance;
            if (roll < cumulative) {
                this.pests.push({
                    type: pestType.type,
                    effect: pestType.effect,
                    timer: 48, // 48 hours
                    location: this.getRandomLocation()
                });
                
                const messages = {
                    'rat': 'A rat scurries into view!',
                    'spider': 'A spider crawls across the wall...',
                    'roach': 'Roaches are gathering...',
                    'centipede': 'A centipede emerges from the shadows...'
                };
                
                if (window.game) {
                    window.game.addMessage(messages[pestType.type]);
                }
                break;
            }
        }
    }

    applyPestEffects(pest, game) {
        switch (pest.effect) {
            case 'steals_food':
                if (Math.random() < 0.1 / 24) { // 10% per day
                    const foodItems = game.inventory.items.filter(item => item.type === 'food');
                    if (foodItems.length > 0) {
                        const stolen = foodItems[Math.floor(Math.random() * foodItems.length)];
                        game.inventory.removeItem(stolen.id, 1);
                        if (window.game) {
                            window.game.addMessage(`A rat stole ${stolen.name}!`);
                        }
                    }
                }
                break;
            case 'morale_drain':
                game.meters.morale.value -= 0.1 * (1/24); // -0.1 per day
                break;
            case 'hygiene_increase':
                game.meters.hygiene.value += 0.2 * (1/24); // +0.2 per day
                break;
            case 'creepy':
                if (Math.random() < 0.05 / 24) {
                    game.meters.morale.value -= 2;
                    if (window.game) {
                        window.game.addMessage('That centipede is really creepy...');
                    }
                }
                break;
        }
    }

    getRandomLocation() {
        const locations = ['corner', 'under_sink', 'behind_furnace', 'window_well', 'floor'];
        return locations[Math.floor(Math.random() * locations.length)];
    }

    killPest(pestType, method) {
        const index = this.pests.findIndex(p => p.type === pestType);
        if (index > -1) {
            this.pests.splice(index, 1);
            if (window.game) {
                window.game.addMessage(`Killed the ${pestType}!`);
            }
            return true;
        }
        return false;
    }

    getState() {
        return {
            pests: JSON.parse(JSON.stringify(this.pests)),
            pestSpawnTimer: this.pestSpawnTimer
        };
    }

    setState(state) {
        this.pests = state.pests || [];
        this.pestSpawnTimer = state.pestSpawnTimer || 0;
    }
}
