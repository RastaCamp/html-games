/**
 * 7 DAYS... - MASTER CRAFTING RECIPES
 * 
 * 🔨 WHAT IS THIS FILE?
 * This is the RECIPE BOOK. Every crafting combination lives here.
 * Want players to be able to craft something new? Add a recipe!
 * Want to make crafting easier/harder? Tweak the success chances!
 * 
 * 📝 HOW TO ADD A RECIPE:
 * 1. Copy an existing recipe (seriously, just copy it)
 * 2. Change the 'id' to something unique
 * 3. List what items are needed in 'inputs'
 * 4. List what tools are needed in 'tools' (optional)
 * 5. Set what you get in 'output'
 * 6. Set successChance (0.0 to 1.0, where 1.0 = 100% success)
 * 7. Add a message for when it works
 * 8. Save and test!
 * 
 * 🎯 KEY PROPERTIES EXPLAINED:
 * - id: Unique recipe identifier
 * - inputs: Array of items needed [{ id: "item_id", quantity: 2 }]
 * - tools: Array of tool IDs needed (optional, can be empty [])
 * - output: What you get { id: "result_item", quantity: 1 }
 * - successChance: 0.0 to 1.0 (0.5 = 50% chance, 1.0 = always works)
 * - message: What players see when it succeeds
 * - failureMessage: What players see when it fails (optional)
 * - requiresDays: Some recipes take time (like growing sprouts)
 * 
 * 💡 PRO TIPS:
 * - Start with high successChance (0.9) when testing. Less frustration.
 * - Tools are optional. Some recipes don't need them.
 * - Failure messages can be funny. Players appreciate humor.
 * - Make sure item IDs match EXACTLY with MasterItemList.js
 * 
 * 🐛 COMMON MISTAKES:
 * - Item IDs don't match (check MasterItemList.js for exact spelling)
 * - Forgetting commas (JavaScript needs commas!)
 * - Wrong quantity (need 2 but only put 1? Won't work)
 * - Tools required but player doesn't have them? Recipe won't show
 * 
 * 🎨 WANT TO MAKE CRAFTING EASIER?
 * Increase successChance values! 0.8 → 0.9 = 10% more success
 * 
 * 🎨 WANT TO MAKE CRAFTING HARDER?
 * Decrease successChance values! 0.8 → 0.6 = 20% less success
 * 
 * 🎨 WANT TO ADD TIME-BASED RECIPES?
 * Add 'requiresDays: 3' - player must wait 3 days for result
 * 
 * Have fun creating! 🚀
 */

// Master Crafting Recipes - All combinations from the guide
class MasterCraftingRecipes {
    static getRecipes() {
        return [
            // ========== CATEGORY 1: WATER PURIFICATION ==========
            {
                id: 'basic_water_filter',
                inputs: [
                    { id: 'plastic_container', quantity: 1 },
                    { id: 'sand', quantity: 1 },
                    { id: 'gravel', quantity: 1 },
                    { id: 'charcoal_briquettes', quantity: 1 },
                    { id: 'old_rag', quantity: 1 }
                ],
                tools: [],
                output: { id: 'water_filter', quantity: 1 },
                successChance: 1.0,
                description: 'Create a layered water filter. Pour water through for clean drinking water.',
                consumeIngredients: true
            },
            {
                id: 'charcoal_powder',
                inputs: [{ id: 'charcoal_briquettes', quantity: 1 }],
                tools: ['hammer'],
                output: { id: 'charcoal_powder', quantity: 1 },
                successChance: 1.0,
                description: 'Crush charcoal into powder for medicine or filter.',
                consumeIngredients: true
            },
            {
                id: 'boiled_water',
                inputs: [{ id: 'water', quantity: 1 }, { id: 'cooking_pot', quantity: 1 }],
                tools: [],
                output: { id: 'purified_water', quantity: 1 },
                successChance: 1.0,
                requiresHeat: true,
                description: 'Boil water to purify it.',
                consumeIngredients: false // Pot is reusable
            },
            {
                id: 'chemical_treated_water',
                inputs: [{ id: 'water', quantity: 1 }, { id: 'bleach', quantity: 1 }],
                tools: [],
                output: { id: 'purified_water', quantity: 1 },
                successChance: 1.0,
                description: 'Treat water with bleach. Wait 30 minutes.',
                consumeIngredients: false,
                requiresTime: 30 // minutes
            },
            {
                id: 'rain_catchment_system',
                inputs: [
                    { id: 'rain_catchment_tarp', quantity: 1 },
                    { id: 'string', quantity: 1 },
                    { id: 'empty_bucket', quantity: 1 }
                ],
                tools: [],
                output: { id: 'rain_catchment_active', quantity: 1 },
                successChance: 0.8,
                description: 'Set up rain catchment. Requires rain.',
                consumeIngredients: false
            },
            {
                id: 'pipe_water_extraction',
                inputs: [{ id: 'empty_bucket', quantity: 1 }],
                tools: ['wrench'],
                output: { id: 'water', quantity: 3 },
                successChance: 1.0,
                description: 'Extract water from utility sink pipes.',
                consumeIngredients: false
            },

            // ========== CATEGORY 2: FOOD ACQUISITION ==========
            {
                id: 'simple_mouse_trap',
                inputs: [
                    { id: 'wood_scraps', quantity: 1 },
                    { id: 'wire', quantity: 1 },
                    { id: 'crackers', quantity: 1 } // bait
                ],
                tools: [],
                output: { id: 'set_mouse_trap', quantity: 1 },
                successChance: 0.7,
                description: 'Create and set a mouse trap.',
                consumeIngredients: true,
                failureConsume: ['crackers'] // Only bait lost on failure
            },
            {
                id: 'improved_mouse_trap',
                inputs: [{ id: 'mouse_trap', quantity: 1 }, { id: 'crackers', quantity: 1 }],
                tools: [],
                output: { id: 'set_mouse_trap', quantity: 1 },
                successChance: 0.9,
                description: 'Bait the snap trap.',
                consumeIngredients: false,
                failureConsume: ['crackers']
            },
            {
                id: 'rabbit_snare',
                inputs: [
                    { id: 'wire', quantity: 1 },
                    { id: 'string', quantity: 1 },
                    { id: 'peanut_butter', quantity: 1 } // bait
                ],
                tools: ['pliers'],
                output: { id: 'set_rabbit_snare', quantity: 1 },
                successChance: 0.6,
                description: 'Create and set a rabbit snare in window well.',
                consumeIngredients: true,
                failureConsume: ['peanut_butter']
            },
            {
                id: 'process_animal',
                inputs: [{ id: 'mouse_meat', quantity: 1 }], // or rabbit_meat
                tools: ['utility_knife'],
                output: { id: 'processed_meat', quantity: 1 },
                successChance: 1.0,
                description: 'Skin and gut the animal. Get meat, fur, bones.',
                consumeIngredients: true
            },
            {
                id: 'cook_meat',
                inputs: [{ id: 'mouse_meat', quantity: 1 }], // or rabbit_meat, processed_meat
                tools: [],
                output: { id: 'cooked_mouse', quantity: 1 },
                successChance: 1.0,
                requiresHeat: true,
                description: 'Cook meat until safe to eat.',
                consumeIngredients: true
            },
            {
                id: 'sprout_garden',
                inputs: [
                    { id: 'seeds', quantity: 1 },
                    { id: 'potting_soil', quantity: 1 },
                    { id: 'plastic_container', quantity: 1 },
                    { id: 'water', quantity: 1 }
                ],
                tools: [],
                output: { id: 'sprout_garden_active', quantity: 1 },
                successChance: 0.9,
                requiresDays: 3,
                description: 'Plant sprouts. Wait 3-5 days.',
                consumeIngredients: true
            },
            {
                id: 'fertilized_sprout_garden',
                inputs: [
                    { id: 'seeds', quantity: 1 },
                    { id: 'compost', quantity: 1 },
                    { id: 'plastic_container', quantity: 1 },
                    { id: 'water', quantity: 1 }
                ],
                tools: [],
                output: { id: 'sprout_garden_active', quantity: 1 },
                successChance: 1.0,
                requiresDays: 2,
                description: 'Plant sprouts with compost fertilizer. Faster growth.',
                consumeIngredients: true
            },

            // ========== CATEGORY 3: WASTE MANAGEMENT ==========
            {
                id: 'compost_toilet',
                inputs: [
                    { id: 'empty_bucket', quantity: 1 },
                    { id: 'sawdust', quantity: 1 }
                ],
                tools: [],
                output: { id: 'compost_toilet', quantity: 1 },
                successChance: 1.0,
                description: 'Create a basic compost toilet.',
                consumeIngredients: false
            },
            {
                id: 'compost_toilet_with_seat',
                inputs: [
                    { id: 'empty_bucket', quantity: 1 },
                    { id: 'sawdust', quantity: 1 },
                    { id: 'toilet_seat', quantity: 1 }
                ],
                tools: [],
                output: { id: 'compost_toilet', quantity: 1 },
                successChance: 1.0,
                description: 'Create compost toilet with seat. Morale boost.',
                consumeIngredients: false
            },
            {
                id: 'methane_generator',
                inputs: [
                    { id: 'empty_bucket', quantity: 1 },
                    { id: 'garden_hose', quantity: 1 },
                    { id: 'compost', quantity: 1 },
                    { id: 'generator', quantity: 1 }
                ],
                tools: ['screwdriver', 'wrench'],
                output: { id: 'methane_generator', quantity: 1 },
                successChance: 0.7,
                requiresDays: 3,
                description: 'Create methane generator. Wait 3 days for gas.',
                consumeIngredients: false,
                failureResult: 'explosion',
                failureDamage: true
            },

            // ========== CATEGORY 4: FIRE, HEAT & LIGHT ==========
            {
                id: 'candle_heater',
                inputs: [{ id: 'candle', quantity: 4 }, { id: 'terra_cotta_pot', quantity: 1 }],
                tools: [],
                output: { id: 'candle_heater', quantity: 1 },
                successChance: 1.0,
                description: 'Create candle heater. Heats small area for hours.',
                consumeIngredients: false
            },
            {
                id: 'torch',
                inputs: [
                    { id: 'stick', quantity: 1 },
                    { id: 'old_rag', quantity: 1 },
                    { id: 'string', quantity: 1 }
                ],
                tools: [],
                output: { id: 'torch', quantity: 1 },
                successChance: 1.0,
                requiresHeat: true, // Need to light it
                description: 'Create a torch. Portable light, lasts 30 min.',
                consumeIngredients: true
            },
            {
                id: 'emergency_tinder',
                inputs: [{ id: 'old_clothes', quantity: 1 }], // Lint from dryer
                tools: [],
                output: { id: 'tinder', quantity: 1 },
                successChance: 1.0,
                description: 'Collect lint for fire starting.',
                consumeIngredients: false
            },

            // ========== CATEGORY 5: FORTIFICATIONS & SECURITY ==========
            {
                id: 'board_up_window',
                inputs: [
                    { id: 'wood_planks', quantity: 3 },
                    { id: 'nails', quantity: 5 }
                ],
                tools: ['hammer'],
                output: { id: 'boarded_window', quantity: 1 },
                successChance: 1.0,
                description: 'Board up window. Basic security.',
                consumeIngredients: true
            },
            {
                id: 'reinforced_boards',
                inputs: [
                    { id: 'wood_planks', quantity: 2 },
                    { id: 'nails', quantity: 10 }
                ],
                tools: ['hammer'],
                output: { id: 'reinforced_barricade', quantity: 1 },
                successChance: 1.0,
                description: 'Create reinforced barricade. Stronger.',
                consumeIngredients: true
            },
            {
                id: 'window_alarm',
                inputs: [
                    { id: 'tin_cans', quantity: 2 },
                    { id: 'string', quantity: 1 }
                ],
                tools: [],
                output: { id: 'window_alarm', quantity: 1 },
                successChance: 1.0,
                description: 'Create window alarm. Early warning system.',
                consumeIngredients: true
            },
            {
                id: 'tripwire_alarm',
                inputs: [
                    { id: 'string', quantity: 1 },
                    { id: 'tin_cans', quantity: 2 },
                    { id: 'nails', quantity: 2 }
                ],
                tools: [],
                output: { id: 'tripwire_alarm', quantity: 1 },
                successChance: 1.0,
                description: 'Create tripwire alarm. Early warning.',
                consumeIngredients: true
            },
            {
                id: 'gasoline_defense',
                inputs: [
                    { id: 'gasoline', quantity: 1 },
                    { id: 'old_rag', quantity: 1 }
                ],
                tools: ['lighter'],
                output: { id: 'gasoline_defense_ready', quantity: 1 },
                successChance: 0.8,
                description: 'Prepare gasoline defense. Risky - door may catch fire.',
                consumeIngredients: true,
                failureResult: 'door_fire'
            },
            {
                id: 'spear',
                inputs: [
                    { id: 'stick', quantity: 1 },
                    { id: 'utility_knife', quantity: 1 },
                    { id: 'string', quantity: 1 }
                ],
                tools: [],
                output: { id: 'spear', quantity: 1 },
                successChance: 1.0,
                description: 'Create spear. Better defense than bare hands.',
                consumeIngredients: false
            },

            // ========== CATEGORY 6: MEDICAL & HEALTH ==========
            {
                id: 'charcoal_medicine',
                inputs: [
                    { id: 'charcoal_powder', quantity: 1 },
                    { id: 'water', quantity: 1 }
                ],
                tools: [],
                output: { id: 'charcoal_medicine', quantity: 1 },
                successChance: 0.8,
                description: 'Mix charcoal with water. Cures some sickness.',
                consumeIngredients: true
            },
            {
                id: 'wound_cleaning',
                inputs: [
                    { id: 'purified_water', quantity: 1 },
                    { id: 'old_rag', quantity: 1 },
                    { id: 'antiseptic_wipes', quantity: 1 }
                ],
                tools: [],
                output: { id: 'cleaned_wound', quantity: 1 },
                successChance: 1.0,
                description: 'Clean and bandage wound. Prevents infection.',
                consumeIngredients: true
            },
            {
                id: 'clothes_to_bandages',
                inputs: [{ id: 'old_clothes', quantity: 1 }],
                tools: ['scissors', 'utility_knife'],
                output: { id: 'bandages', quantity: 5 },
                successChance: 1.0,
                description: 'Cut clothes into bandages.',
                consumeIngredients: true
            },
            {
                id: 'makeshift_bedding',
                inputs: [
                    { id: 'old_clothes', quantity: 1 },
                    { id: 'old_costume', quantity: 1 }
                ],
                tools: [],
                output: { id: 'makeshift_bedding', quantity: 1 },
                successChance: 1.0,
                description: 'Pile old clothes and costumes into bedding. Better than floor when using Rest.',
                consumeIngredients: true
            },

            // ========== CATEGORY 7: TOOLS & REPAIRS ==========
            {
                id: 'repair_radio',
                inputs: [
                    { id: 'emergency_radio', quantity: 1 },
                    { id: 'wiring', quantity: 1 }
                ],
                tools: ['screwdriver'],
                output: { id: 'emergency_radio', quantity: 1 },
                successChance: 0.7,
                description: 'Repair broken radio. Restores function.',
                consumeIngredients: false,
                failureConsume: ['wiring']
            },
            {
                id: 'repair_toy',
                inputs: [{ id: 'broken_toy_robot', quantity: 1 }],
                tools: ['screwdriver'],
                output: { id: 'toy_robot', quantity: 1 },
                successChance: 0.8,
                description: 'Fix broken toy. Major morale boost.',
                consumeIngredients: false
            },
            {
                id: 'wire_hangers_to_snares',
                inputs: [{ id: 'wire_hangers', quantity: 1 }],
                tools: ['pliers'],
                output: { id: 'snare', quantity: 2 },
                successChance: 1.0,
                description: 'Convert wire hangers into snares.',
                consumeIngredients: true
            },
            {
                id: 'tin_can_cup',
                inputs: [{ id: 'tin_cans', quantity: 1 }],
                tools: [],
                output: { id: 'tin_can_cup', quantity: 1 },
                successChance: 0.8,
                description: 'Convert tin can into drinking cup.',
                consumeIngredients: true
            },

            // ========== CATEGORY 8: MORALE & ENRICHMENT ==========
            // These are mostly use actions, not crafting, but included for completeness
            {
                id: 'hot_meal',
                inputs: [{ id: 'cooked_rabbit', quantity: 1 }], // or any cooked food
                tools: [],
                output: { id: 'hot_meal', quantity: 1 },
                successChance: 1.0,
                description: 'Eat a hot meal. Major morale boost.',
                consumeIngredients: true,
                moraleBoost: 15
            },

            // ========== CLOTHING: RIP & CRAFT (scissors/knife to cut; needle/duct tape to mend) ==========
            {
                id: 'rip_shirt',
                inputs: [{ id: 'short_sleeve_shirt', quantity: 1 }],
                tools: ['scissors'],
                output: { id: 'ripped_cloth', quantity: 2 },
                successChance: 1.0,
                description: 'Rip shirt into cloth with scissors.',
                consumeIngredients: true
            },
            {
                id: 'rip_shirt_knife',
                inputs: [{ id: 'short_sleeve_shirt', quantity: 1 }],
                tools: ['knife'],
                output: { id: 'ripped_cloth', quantity: 2 },
                successChance: 0.8,
                description: 'Cut shirt into cloth with knife.',
                consumeIngredients: true
            },
            {
                id: 'rip_pants',
                inputs: [{ id: 'jean_pants', quantity: 1 }],
                tools: ['scissors'],
                output: { id: 'ripped_cloth', quantity: 3 },
                successChance: 1.0,
                description: 'Rip pants into cloth with scissors.',
                consumeIngredients: true
            },
            {
                id: 'rip_pants_knife',
                inputs: [{ id: 'jean_pants', quantity: 1 }],
                tools: ['knife'],
                output: { id: 'ripped_cloth', quantity: 3 },
                successChance: 0.8,
                description: 'Cut pants into cloth with knife.',
                consumeIngredients: true
            },
            {
                id: 'craft_socks',
                inputs: [{ id: 'ripped_cloth', quantity: 2 }],
                tools: ['scissors'],
                output: { id: 'ripped_socks', quantity: 1 },
                successChance: 0.85,
                description: 'Make improvised socks from ripped cloth.',
                consumeIngredients: true
            },
            {
                id: 'craft_scarf',
                inputs: [{ id: 'ripped_cloth', quantity: 3 }],
                tools: ['scissors'],
                output: { id: 'scarf', quantity: 1 },
                successChance: 0.8,
                description: 'Make scarf from ripped cloth.',
                consumeIngredients: true
            },
            {
                id: 'craft_hat',
                inputs: [{ id: 'ripped_cloth', quantity: 3 }],
                tools: ['scissors'],
                output: { id: 'hat', quantity: 1 },
                successChance: 0.75,
                description: 'Make warm hat from ripped cloth.',
                consumeIngredients: true
            },
            {
                id: 'craft_mittens',
                inputs: [{ id: 'ripped_cloth', quantity: 2 }],
                tools: ['scissors'],
                output: { id: 'mittens', quantity: 1 },
                successChance: 0.8,
                description: 'Make mittens from ripped cloth.',
                consumeIngredients: true
            },

            // ========== LEGACY RECIPES (keeping for compatibility) ==========
            {
                id: 'snare_legacy',
                inputs: [{ id: 'wire', quantity: 1 }, { id: 'stick', quantity: 1 }],
                tools: [],
                output: { id: 'snare', quantity: 1 },
                successChance: 0.8,
                description: 'Create a snare trap',
                consumeIngredients: true
            },
            {
                id: 'rabbit_snare_legacy',
                inputs: [{ id: 'wire', quantity: 1 }, { id: 'stick', quantity: 2 }],
                tools: [],
                output: { id: 'rabbit_snare', quantity: 1 },
                successChance: 0.6,
                description: 'Create a rabbit snare',
                consumeIngredients: true
            }
        ];
    }
}
