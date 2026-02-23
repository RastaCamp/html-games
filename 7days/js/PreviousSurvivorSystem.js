/**
 * 7 DAYS... - PREVIOUS SURVIVOR SYSTEM
 * 
 * 💀 WHAT IS THIS FILE?
 * This manages the "lore" - diary pages, half-finished projects, and remains
 * of previous survivors. Adds story depth and teaches players recipes!
 * 
 * 🎯 WHAT IT DOES:
 * - Diary pages: Found randomly, provide story and mixed morale effects
 * - Half-finished projects: Teach recipes when found (smart!)
 * - Remains: Find previous survivor's skeleton + supplies (sad but useful)
 * 
 * 💡 WANT TO ADD MORE LORE?
 * 1. Add diary pages to initialize()
 * 2. Add projects that teach recipes
 * 3. Add more items to remains drop
 * 4. Make it tell a story!
 * 
 * 🎨 STORYTELLING OPPORTUNITIES:
 * - Diary pages can hint at solutions
 * - Projects show what worked/didn't work
 * - Remains show how they died (warning to player)
 * 
 * 🐛 COMMON MISTAKES:
 * - Making diary pages too spoilery (ruins discovery)
 * - Not teaching useful recipes (missed opportunity)
 * - Making remains too rewarding (breaks immersion)
 */

class PreviousSurvivorSystem {
    constructor() {
        // 📚 LORE TRACKING: Keep track of what's been discovered
        this.diaryPages = []; // Array of diary pages (found randomly)
        this.projects = []; // Array of half-finished projects (teach recipes)
        this.foundItems = []; // Items found with remains (tracked for story)
        this.discovered = false; // Have we found the remains yet?
    }

    initialize() {
        // Generate random diary pages
        this.diaryPages = [
            { day: 1, text: "Day 1: Trapped. Power's out. Found some water in the heater." },
            { day: 2, text: "Day 2: Made a filter. Water tastes like dirt but it's clean." },
            { day: 3, text: "Day 3: Caught a mouse. Didn't think I'd ever do that." },
            { day: 4, text: "Day 4: They came. I didn't answer. Smart move." },
            { day: 5, text: "Day 5: Sick. Should have been more careful with the water." },
            { day: 6, text: "Day 6: Running low on food. Sprouts aren't growing fast enough." },
            { day: 7, text: "Day 7: They're coming. I think. Or I'm hallucinating. Either way..." }
        ];
        
        // Half-finished projects that teach recipes
        this.projects = [
            { id: 'water_filter_half', recipe: 'basic_water_filter', message: 'Found a half-built water filter. You learn the technique.' },
            { id: 'snare_half', recipe: 'rabbit_snare', message: 'Found a failed snare. You see what went wrong.' },
            { id: 'compost_half', recipe: 'compost_toilet', message: 'Found a bucket with sawdust. You understand the method.' }
        ];
    }

    findDiaryPage(game) {
        if (this.diaryPages.length === 0) return null;
        
        const page = this.diaryPages.shift();
        if (window.game) {
            window.game.addMessage(`Found diary page: "${page.text}"`);
            window.game.meters.adjustMorale(Math.random() < 0.5 ? 5 : -5); // Mixed feelings
        }
        return page;
    }

    findProject(game) {
        if (this.projects.length === 0) return null;
        
        const project = this.projects[Math.floor(Math.random() * this.projects.length)];
        this.projects = this.projects.filter(p => p.id !== project.id);
        
        // Unlock recipe
        if (game.craftingSystem && game.craftingSystem.recipes) {
            const recipe = game.craftingSystem.recipes.find(r => r.id === project.recipe);
            if (recipe && !recipe.unlocked) {
                recipe.unlocked = true;
                if (window.game) {
                    window.game.addMessage(project.message);
                }
            }
        }
        
        return project;
    }

    findRemains(game) {
        if (this.discovered) return null;
        
        this.discovered = true;
        
        // Drop some items
        const items = [
            { id: 'bandages', quantity: 2 },
            { id: 'canned_food', quantity: 1 },
            { id: 'water_bottle', quantity: 1 }
        ];
        
        for (const itemData of items) {
            const item = game.itemSystem.createItem(itemData.id);
            if (item) {
                game.inventory.addItem(item, itemData.quantity);
            }
        }
        
        if (window.game) {
            window.game.addMessage('You find the remains of a previous survivor...');
            window.game.addMessage('They didn\'t make it. But they left some supplies.');
            window.game.meters.adjustMorale(-10); // Morale hit
        }
        
        return true;
    }

    getState() {
        return {
            diaryPages: [...this.diaryPages],
            projects: [...this.projects],
            discovered: this.discovered
        };
    }

    setState(state) {
        this.diaryPages = state.diaryPages || [];
        this.projects = state.projects || [];
        this.discovered = state.discovered || false;
    }
}
