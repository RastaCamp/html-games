// Container Randomization System
// Randomly populates containers with items for replayability

class ContainerRandomizer {
    constructor(itemSystem) {
        this.itemSystem = itemSystem;
        this.itemPools = this.initializeItemPools();
    }

    initializeItemPools() {
        return {
            // Storage boxes - random items from various categories
            storage_boxes: [
                'crackers', 'spices', 'bird_seed', 'cardboard', 'old_clothes',
                'newspaper', 'wire_hangers', 'tin_cans', 'duct_tape', 'rope',
                'bandages', 'antiseptic_wipes', 'vitamins', 'magazine', 'book',
                'deck_of_cards', 'scissors', 'battery', 'candle', 'matches',
                'flashlight', 'extension_cord', 'wiring', 'glass_jar',
                'plastic_container', 'trash_bags', 'baby_wipes', 'shovel'
            ],
            
            // Workbench area - tools and materials
            workbench: [
                'hammer', 'screwdriver', 'wrench', 'pliers', 'handsaw',
                'utility_knife', 'duct_tape', 'wire', 'string', 'nails',
                'sawdust', 'wood_scraps', 'metal', 'copper_pipe', 'wiring'
            ],
            
            // Emergency kit - essential supplies
            emergency_kit: [
                'energy_bar', 'energy_bar', 'energy_bar', 'water_bottle',
                'matches', 'lighter', 'candle', 'candle', 'flashlight',
                'battery', 'battery', 'battery', 'first_aid_kit',
                'emergency_radio', 'can_opener', 'duct_tape'
            ],
            
            // Pantry/storage - food items
            pantry: [
                'canned_beans', 'canned_vegetables', 'canned_soup',
                'crackers', 'peanut_butter', 'ramen_noodles', 'spices',
                'pickled_eggs', 'protein_powder'
            ],
            
            // Freezer - food (may be spoiled); use IDs from MasterItemList
            freezer: [
                'canned_beans', 'canned_beans', 'energy_bar', 'canned_vegetables'
            ],
            
            // Shelving - random mix
            shelving: [
                'cardboard', 'crackers', 'seeds', 'battery', 'candle',
                'old_clothes', 'newspaper', 'magazine', 'book', 'wire_hangers',
                'tin_cans', 'trash_bags', 'duct_tape', 'rope', 'scissors'
            ],
            
            // Utility area - water and cleaning
            utility_area: [
                'empty_bucket', 'empty_bucket', 'plastic_container',
                'glass_jar', 'trash_bags', 'baby_wipes', 'bleach',
                'fire_extinguisher'
            ],
            
            // Camping gear - if found
            camping_gear: [
                'sterno_can', 'sterno_can', 'sterno_can', 'propane_stove',
                'propane_canister', 'collapsible_water_container',
                'rain_catchment_tarp', 'iodine_tablets'
            ],
            
            // Plant area - gardening supplies
            plant_area: [
                'potting_soil', 'potting_soil', 'terra_cotta_pot', 'seeds',
                'bird_seed', 'garden_hose', 'shovel'
            ],
            
            // First aid kit contents
            first_aid_kit_contents: [
                'bandages', 'bandages', 'bandages', 'antiseptic_wipes',
                'antiseptic_wipes', 'pain_killers'
            ]
        };
    }

    randomizeContainer(poolName, minItems = 1, maxItems = 5) {
        const pool = this.itemPools[poolName] || this.itemPools.storage_boxes;
        const itemCount = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;
        const selectedItems = [];
        
        // Shuffle pool and pick random items
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < Math.min(itemCount, shuffled.length); i++) {
            const itemId = shuffled[i];
            const item = this.itemSystem.getItem(itemId);
            if (item) {
                // Random quantity for stackable items
                const quantity = item.stackable ? 
                    Math.floor(Math.random() * Math.min(item.maxStack || 3, 3)) + 1 : 1;
                selectedItems.push({ id: itemId, quantity: quantity });
            }
        }
        
        return selectedItems;
    }

    randomizeAllContainers() {
        return {
            storage_boxes: this.randomizeContainer('storage_boxes', 2, 4),
            workbench: this.randomizeContainer('workbench', 3, 6),
            emergency_kit: this.randomizeContainer('emergency_kit', 8, 12),
            pantry: this.randomizeContainer('pantry', 2, 5),
            freezer: this.randomizeContainer('freezer', 1, 3),
            shelving: this.randomizeContainer('shelving', 3, 7),
            utility_area: this.randomizeContainer('utility_area', 2, 4),
            camping_gear: this.randomizeContainer('camping_gear', 0, 5), // Optional
            plant_area: this.randomizeContainer('plant_area', 2, 4),
            first_aid_kit: this.randomizeContainer('first_aid_kit_contents', 3, 6)
        };
    }

    // Get guaranteed essential items (always present)
    getEssentialItems() {
        return [
            { id: 'empty_bucket', quantity: 2 },
            { id: 'water_bottle', quantity: 2 },
            { id: 'energy_bar', quantity: 3 },
            { id: 'matches', quantity: 20 },
            { id: 'candle', quantity: 5 },
            { id: 'flashlight', quantity: 1 },
            { id: 'battery', quantity: 4 },
            { id: 'can_opener', quantity: 1 },
            { id: 'hammer', quantity: 1 },
            { id: 'screwdriver', quantity: 1 },
            { id: 'wrench', quantity: 1 },
            { id: 'utility_knife', quantity: 1 },
            { id: 'duct_tape', quantity: 1 },
            { id: 'wood_planks', quantity: 5 },
            { id: 'nails', quantity: 20 },
            { id: 'sawdust', quantity: 1 },
            { id: 'potting_soil', quantity: 1 },
            { id: 'sand', quantity: 1 },
            { id: 'gravel', quantity: 1 },
            { id: 'charcoal_briquettes', quantity: 1 },
            { id: 'old_rag', quantity: 2 },
            { id: 'cooking_pot', quantity: 1 },
            { id: 'first_aid_kit', quantity: 1 },
            { id: 'fire_extinguisher', quantity: 1 }
        ];
    }
}
