/**
 * 7 DAYS... - COMBAT SYSTEM
 * 
 * ⚔️ WHAT IS THIS FILE?
 * This handles combat when mongrels or marauders breach your defenses.
 * Choose your weapon, roll for success, and hope you don't die!
 * 
 * 🎯 HOW COMBAT WORKS:
 * 1. Threat breaches (mongrel/marauder)
 * 2. Player chooses weapon or scare item
 * 3. System calculates success chance (based on weapon, fatigue, morale, etc.)
 * 4. Roll dice - win or lose!
 * 5. Win: Drive them off (maybe get injured)
 * 6. Lose: Get injured, lose items, health damage
 * 
 * 💡 WANT TO ADD A NEW WEAPON?
 * 1. Add weapon to MasterItemList.js
 * 2. Add it to getWeaponSuccessChance() with a success rate
 * 3. Add it to combat UI in Game.js
 * 4. Test it!
 * 
 * 🎨 WEAPON SUCCESS RATES:
 * - Spear: 80% (best weapon!)
 * - Baseball Bat: 70% (classic)
 * - Hammer: 65% (versatile)
 * - Utility Knife: 60% (better than nothing)
 * - Fists: 20% (desperation move)
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to check if player has weapon in inventory
 * - Not applying modifiers (fatigue, sickness, etc.)
 * - Making weapons too powerful (breaks game balance)
 */

class CombatSystem {
    constructor() {
        // ⚔️ COMBAT STATE: Track if we're currently fighting
        this.inCombat = false; // Are we in combat right now?
        this.currentThreat = null; // 'mongrel' or 'marauder' (who are we fighting?)
        this.combatRound = 0; // How many rounds of combat? (for tracking)
    }

    startCombat(threatType, game) {
        this.inCombat = true;
        this.currentThreat = threatType; // 'mongrel' or 'marauder'
        this.combatRound = 0;
        
        // Play combat music
        if (window.audioSystem) {
            window.audioSystem.playMusic('enemy_battle', true);
        }
        
        if (window.game) {
            window.game.addMessage(`${threatType === 'mongrel' ? 'A mongrel' : 'Marauders'} breach your defenses!`);
            window.game.addMessage('COMBAT MODE - Choose your weapon!');
        }
        
        return true;
    }

    endCombat() {
        this.inCombat = false;
        this.currentThreat = null;
        this.combatRound = 0;
        
        // Stop combat music
        if (window.audioSystem) {
            window.audioSystem.stopMusic();
        }
    }

    attemptCombat(weapon, game) {
        if (!this.inCombat) return { success: false, message: 'Not in combat' };
        
        this.combatRound++;
        
        // Calculate success chance
        let successChance = this.getWeaponSuccessChance(weapon, game);
        
        // Apply modifiers
        const fatigue = game.meters.fatigue.value;
        if (fatigue >= 70) successChance -= 0.2; // Exhausted
        if (fatigue >= 50) successChance -= 0.1; // Tired
        
        if (game.meters.sickness) successChance -= 0.15; // Sick
        
        const morale = game.meters.morale.value;
        if (morale >= 80) successChance += 0.1; // Hopeful
        if (morale < 30) successChance -= 0.1; // Depressed
        
        // Check for injuries
        if (game.meters.injury && game.meters.injury.severity === 'severe') {
            successChance -= 0.2;
        } else if (game.meters.injury && game.meters.injury.severity === 'moderate') {
            successChance -= 0.1;
        }
        
        successChance = Math.max(0.1, Math.min(0.95, successChance));
        
        const roll = Math.random();
        const success = roll < successChance;
        
        if (success) {
            return this.handleCombatWin(weapon, game);
        } else {
            return this.handleCombatLoss(weapon, game);
        }
    }

    getWeaponSuccessChance(weapon, game) {
        const weaponChances = {
            'spear': 0.8,
            'baseball_bat': 0.7,
            'hammer': 0.65,
            'utility_knife': 0.6,
            'fire_extinguisher': 0.55,
            'makeshift_weapon': 0.5,
            'fists': 0.2
        };
        
        // Check if weapon is in inventory
        if (!game.inventory.hasItem(weapon, 1)) {
            return weaponChances['fists'] || 0.2;
        }
        
        return weaponChances[weapon] || 0.5;
    }

    handleCombatWin(weapon, game) {
        const threat = this.currentThreat;
        this.endCombat();
        
        // Possible injury from combat
        if (Math.random() < 0.3) {
            const injurySeverity = Math.random() < 0.7 ? 'minor' : 'moderate';
            game.meters.addInjury(injurySeverity, 'combat');
        }
        
        // Play victory sound
        if (window.audioSystem) {
            window.audioSystem.playSound('positive');
        }
        
        // Reward
        if (threat === 'mongrel') {
            game.addMessage('You drive off the mongrel! It flees, injured.');
            game.attractionSystem.addAttraction(-10); // Scared them off
            game.meters.adjustMorale(10); // Victory boost
            
            // Small chance of mongrel dropping something
            if (Math.random() < 0.1) {
                const item = game.itemSystem.createItem('cloth', 'Fresh');
                if (item) {
                    game.inventory.addItem(item, 1);
                    game.addMessage('The mongrel left behind some fur/cloth.');
                }
            }
        } else {
            game.addMessage('You fight off the marauders! They retreat.');
            game.attractionSystem.addAttraction(-20);
            game.meters.adjustMorale(15);
        }
        
        return { success: true, message: 'Combat won!' };
    }

    handleCombatLoss(weapon, game) {
        const threat = this.currentThreat;
        
        // Player gets injured
        const injurySeverity = Math.random() < 0.5 ? 'moderate' : 'severe';
        game.meters.addInjury(injurySeverity, 'combat');
        
        // Play defeat sound
        if (window.audioSystem) {
            window.audioSystem.playSound('negative');
        }
        
        if (threat === 'mongrel') {
            game.addMessage('The mongrel attacks! You are injured!');
            game.meters.health.value -= 15;
            game.meters.adjustMorale(-10);
            
            // Mongrel steals food
            const foodItems = game.inventory.items.filter(item => item.type === 'food');
            if (foodItems.length > 0) {
                const stolen = foodItems[Math.floor(Math.random() * foodItems.length)];
                game.inventory.removeItem(stolen.id, 1);
                game.addMessage(`The mongrel grabs ${stolen.name} and flees!`);
            }
        } else {
            game.addMessage('The marauders overpower you!');
            game.meters.health.value -= 25;
            game.meters.adjustMorale(-15);
            
            // Marauders steal valuable items
            const valuableItems = game.inventory.items.filter(item => 
                item.id === 'whiskey_bottle' || 
                item.id === 'energy_drink' || 
                item.id === 'canned_food'
            );
            if (valuableItems.length > 0) {
                const stolen = valuableItems[Math.floor(Math.random() * valuableItems.length)];
                game.inventory.removeItem(stolen.id, 1);
                game.addMessage(`The marauders take ${stolen.name} and leave!`);
            }
        }
        
        this.endCombat();
        return { success: false, message: 'Combat lost. You are injured.' };
    }

    useScareItem(item, game) {
        if (!this.inCombat) return { success: false, message: 'Not in combat' };
        
        const scareItems = {
            'pepper_spray': { chance: 0.9, message: 'Pepper spray drives them away!' },
            'bear_spray': { chance: 0.95, message: 'Bear spray is effective!' },
            'air_horn': { chance: 0.8, message: 'The air horn scares everything!' }
        };
        
        const itemData = scareItems[item];
        if (!itemData) {
            return { success: false, message: 'Not a scare item' };
        }
        
        if (!game.inventory.hasItem(item, 1)) {
            return { success: false, message: 'Item not in inventory' };
        }
        
        const success = Math.random() < itemData.chance;
        
        if (success) {
            this.endCombat();
            game.addMessage(itemData.message);
            game.attractionSystem.addAttraction(-15);
            
            // Air horn attracts more attention later
            if (item === 'air_horn') {
                game.attractionSystem.addAttraction(10, 2); // Delayed attraction
                game.addMessage('The noise echoes. More threats may come...');
            }
            
            // Consume item (if single use)
            if (item === 'pepper_spray' || item === 'bear_spray') {
                game.inventory.removeItem(item, 1);
            }
            
            return { success: true, message: itemData.message };
        } else {
            game.addMessage('The scare item fails!');
            return { success: false, message: 'Scare item failed' };
        }
    }
}
