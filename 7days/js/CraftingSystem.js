/**
 * 7 DAYS... - CRAFTING SYSTEM
 * 
 * 🔨 WHAT IS THIS FILE?
 * This handles all the crafting logic. It finds recipes, checks if you can craft,
 * and attempts to craft things (with success/failure chances).
 * 
 * 🎯 WHAT IT DOES:
 * - Finds recipes that match your items
 * - Checks if you have the right tools
 * - Rolls for success/failure
 * - Handles critical success/failure (from luck system)
 * - Gives you the result (or wastes your materials)
 * 
 * 💡 WANT TO MODIFY CRAFTING?
 * - Recipes are in MasterCraftingRecipes.js (not here!)
 * - Success chances are in the recipe files
 * - Critical success/failure is handled here (based on luck/morale)
 * 
 * 🐛 COMMON MISTAKES:
 * - Item IDs must match EXACTLY (spaces matter! "water_bottle" ≠ "waterbottle")
 * - Quantities must match (need 2 but only have 1? Won't work)
 * - Tools required? Player must have them in inventory
 */

class CraftingSystem {
    constructor(itemSystem) {
        this.itemSystem = itemSystem; // Need this to create result items
        this.recipes = this.initializeRecipes(); // Load all recipes
    }

    initializeRecipes() {
        // Get master recipes and merge with any custom ones
        const masterRecipes = MasterCraftingRecipes.getRecipes();
        const customRecipes = this.getCustomRecipes();
        return [...masterRecipes, ...customRecipes];
    }

    getCustomRecipes() {
        // Any custom recipes not in master list
        return [
            // Traps
            {
                inputs: [{ id: 'wire', quantity: 1 }, { id: 'stick', quantity: 1 }],
                output: { id: 'snare', quantity: 1 },
                successChance: 0.8,
                description: 'Create a snare trap'
            },
            {
                inputs: [{ id: 'wire', quantity: 1 }, { id: 'stick', quantity: 2 }],
                output: { id: 'rabbit_snare', quantity: 1 },
                successChance: 0.6,
                description: 'Create a rabbit snare'
            },
            
            // Water purification
            {
                inputs: [{ id: 'water', quantity: 1 }, { id: 'pot', quantity: 1 }],
                output: { id: 'purified_water', quantity: 1 },
                successChance: 1.0,
                requiresHeat: true,
                description: 'Boil water to purify it'
            },
            
            // Cooking
            {
                inputs: [{ id: 'mouse_meat', quantity: 1 }],
                output: { id: 'cooked_mouse', quantity: 1 },
                successChance: 1.0,
                requiresHeat: true,
                description: 'Cook mouse meat'
            },
            {
                inputs: [{ id: 'rabbit_meat', quantity: 1 }],
                output: { id: 'cooked_rabbit', quantity: 1 },
                successChance: 1.0,
                requiresHeat: true,
                description: 'Cook rabbit meat'
            },
            
            // Compost toilet
            {
                inputs: [{ id: 'bucket', quantity: 1 }, { id: 'cardboard', quantity: 5 }],
                output: { id: 'compost_toilet', quantity: 1 },
                successChance: 1.0,
                description: 'Create a compost toilet'
            },
            
            // Sprouts
            {
                inputs: [{ id: 'seeds', quantity: 1 }, { id: 'compost', quantity: 1 }],
                output: { id: 'sprouts', quantity: 3 },
                successChance: 0.7,
                requiresDays: 2,
                description: 'Grow sprouts using compost'
            },
            {
                inputs: [{ id: 'seeds', quantity: 1 }],
                output: { id: 'sprouts', quantity: 2 },
                successChance: 0.5,
                requiresDays: 3,
                description: 'Grow sprouts without compost'
            },
            
            // Methane generator (complex)
            {
                inputs: [
                    { id: 'bucket', quantity: 1 },
                    { id: 'copper_pipe', quantity: 2 },
                    { id: 'wire', quantity: 3 }
                ],
                output: { id: 'methane_generator', quantity: 1 },
                successChance: 0.4,
                requiresDays: 3,
                description: 'Create a methane generator from waste'
            },
            
            // Fortification
            {
                inputs: [{ id: 'wood', quantity: 3 }, { id: 'metal', quantity: 1 }],
                output: { id: 'barricade', quantity: 1 },
                successChance: 0.9,
                description: 'Create a barricade'
            },
            
            // Fire starter
            {
                inputs: [{ id: 'cloth', quantity: 1 }, { id: 'stick', quantity: 1 }],
                output: { id: 'torch', quantity: 1 },
                successChance: 0.8,
                description: 'Create a torch'
            }
        ];
    }

    findRecipe(inputs) {
        const inputIds = inputs.map(i => i.id).sort();
        
        for (const recipe of this.recipes) {
            const recipeInputIds = recipe.inputs.map(i => i.id).sort();
            if (this.arraysEqual(inputIds, recipeInputIds)) {
                // Check quantities
                let matches = true;
                for (const input of inputs) {
                    const recipeInput = recipe.inputs.find(r => r.id === input.id);
                    if (!recipeInput || input.quantity < recipeInput.quantity) {
                        matches = false;
                        break;
                    }
                }
                if (matches) return recipe;
            }
        }
        return null;
    }

    arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    canCraft(recipe, inventory, hasHeat = false, hasTools = []) {
        if (!recipe) return false;
        
        if (recipe.requiresHeat && !hasHeat) return false;
        
        // Check for required tools
        if (recipe.tools && recipe.tools.length > 0) {
            for (const tool of recipe.tools) {
                if (!inventory.hasItem(tool, 1)) {
                    return false;
                }
            }
        }
        
        // Check for required ingredients
        for (const required of recipe.inputs) {
            if (!inventory.hasItem(required.id, required.quantity)) {
                return false;
            }
        }
        
        return true;
    }

    attemptCraft(recipe, inventory, hasHeat = false, game = null) {
        // Check for required tools
        const hasTools = recipe.tools ? recipe.tools.every(tool => inventory.hasItem(tool, 1)) : true;
        
        if (!this.canCraft(recipe, inventory, hasHeat, hasTools)) {
            const missing = [];
            if (recipe.requiresHeat && !hasHeat) missing.push('heat source');
            if (recipe.tools) {
                for (const tool of recipe.tools) {
                    if (!inventory.hasItem(tool, 1)) missing.push(tool);
                }
            }
            for (const required of recipe.inputs) {
                if (!inventory.hasItem(required.id, required.quantity)) {
                    missing.push(`${required.quantity}x ${required.id}`);
                }
            }
            return { success: false, message: `Cannot craft: missing ${missing.join(', ')}` };
        }
        
        // Check for critical success/failure (if game provided)
        if (game && game.luckSystem) {
            const luckMod = game.luckSystem.getLuckModifier(game.meters.morale.value);
            const criticalSuccess = game.luckSystem.rollCriticalSuccess(0.05, game.meters.morale.value);
            const criticalFailure = game.luckSystem.rollCriticalFailure(0.05, game.meters.morale.value);
            
            if (criticalFailure) {
                // Break a tool or injure self
                if (recipe.tools && recipe.tools.length > 0 && Math.random() < 0.5) {
                    const brokenTool = recipe.tools[Math.floor(Math.random() * recipe.tools.length)];
                    if (game.decaySystem) {
                        game.decaySystem.useTool(brokenTool, 100); // Break it
                    }
                    if (window.game) {
                        window.game.addMessage(`Critical failure! ${brokenTool} broke!`);
                    }
                } else {
                    // Minor injury
                    game.meters.addInjury('minor', 'crafting');
                    if (window.game) {
                        window.game.addMessage('Critical failure! You injure yourself!');
                    }
                }
                // Consume materials on failure
                for (const required of recipe.inputs) {
                    inventory.removeItem(required.id, required.quantity);
                }
                // Play critical failure sound
            if (window.audioSystem) {
                window.audioSystem.playSound('negative');
            }
            return { success: false, message: 'Critical failure! Materials wasted.' };
            }
            
            if (criticalSuccess) {
                // Double yield
                const outputItem = this.itemSystem.createItem(recipe.output.id);
                if (outputItem) {
                    inventory.addItem(outputItem, recipe.output.quantity * 2);
                    if (window.game) {
                        window.game.addMessage('Critical success! Double yield!');
                    }
                    // Play critical success sound
                    if (window.audioSystem) {
                        window.audioSystem.playSound('positive');
                    }
                    // Consume materials
                    for (const required of recipe.inputs) {
                        inventory.removeItem(required.id, required.quantity);
                    }
                    return { 
                        success: true, 
                        message: recipe.description || `Successfully crafted ${recipe.output.quantity * 2}x ${outputItem.name}! (Critical success!)`,
                        item: outputItem,
                        moraleBoost: (recipe.moraleBoost || 0) + 5
                    };
                }
            }
        }
        
        // Check success chance (with luck modifier)
        let successChance = recipe.successChance || 1.0;
        if (game && game.luckSystem) {
            const luckMod = game.luckSystem.getLuckModifier(game.meters.morale.value);
            successChance += luckMod;
            successChance = Math.max(0.1, Math.min(1.0, successChance));
        }
        
        const roll = Math.random();
        if (roll > successChance) {
            // Failed - consume materials based on failure rules
            if (recipe.failureConsume) {
                for (const itemId of recipe.failureConsume) {
                    inventory.removeItem(itemId, 1);
                }
            } else if (recipe.consumeIngredients !== false) {
                // Default: consume all if not specified
                for (const required of recipe.inputs) {
                    inventory.removeItem(required.id, required.quantity);
                }
            }
            
            let message = recipe.failureMessage || 'Crafting failed! Materials wasted.';
            
            // Play failure sound
            if (window.audioSystem) {
                window.audioSystem.playSound('negative');
            }
            
            // Handle special failure results
            if (recipe.failureResult === 'explosion') {
                message = 'BOOM! The basement shakes. Fire catches.';
                // Would trigger fire damage here
                if (window.audioSystem) {
                    window.audioSystem.playSound('danger'); // Explosion is dangerous!
                }
            } else if (recipe.failureResult === 'door_fire') {
                message = 'The door catches fire! You need to put it out!';
                if (window.audioSystem) {
                    window.audioSystem.playSound('danger');
                }
            }
            
            return { success: false, message: message };
        }
        
        // Success - consume materials (if specified)
        if (recipe.consumeIngredients !== false) {
            for (const required of recipe.inputs) {
                inventory.removeItem(required.id, required.quantity);
            }
        }
        
        const outputItem = this.itemSystem.createItem(recipe.output.id);
        if (outputItem) {
            inventory.addItem(outputItem, recipe.output.quantity);
            
            // Play success sound
            if (window.audioSystem) {
                window.audioSystem.playSound('positive');
            }
            
            let message = recipe.description || `Successfully crafted ${recipe.output.quantity}x ${outputItem.name}!`;
            
            return { 
                success: true, 
                message: message,
                item: outputItem,
                moraleBoost: recipe.moraleBoost || 0
            };
        }
        
        // Play error sound
        if (window.audioSystem) {
            window.audioSystem.playSound('no');
        }
        return { success: false, message: 'Crafting failed: unknown error' };
    }
}
