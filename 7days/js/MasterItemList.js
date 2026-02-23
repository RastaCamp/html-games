// Master Item List - All items organized by category
/**
 * 7 DAYS... - MASTER ITEM LIST
 * 
 * 🎮 WHAT IS THIS FILE?
 * This is the ITEM DATABASE. Every single item in the game lives here.
 * Want to add a new item? Change how much food heals? Make something stackable?
 * You're in the right place!
 * 
 * 📝 HOW TO ADD AN ITEM:
 * 1. Copy an existing item (less typing = less errors)
 * 2. Change the 'id' to something unique (no spaces, use underscores)
 * 3. Change the name, icon (emoji), and stats
 * 4. Save and reload the game
 * 5. Profit! (or at least, the item should appear)
 * 
 * 🎯 KEY PROPERTIES EXPLAINED:
 * - id: Unique identifier (like a barcode for the item)
 * - name: What players see in-game
 * - type: 'food', 'tool', 'consumable', 'weapon', 'container', etc.
 * - icon: Emoji! Players love emojis. 🎉
 * - stackable: Can you have multiple? (true/false)
 * - maxStack: How many fit in one stack?
 * - nutrition: How much hunger it fills (for food)
 * - hydration: How much thirst it quenches (for drinks)
 * - hygieneCost: Hygiene penalty when used/eaten
 * - moraleBoost: Morale gain (can be negative for gross stuff!)
 * - condition: 'Fresh', 'Stale', 'Spoiled' (for food)
 * - expiresIn: Days until food spoils
 * 
 * 💡 PRO TIPS:
 * - Copy-paste is your friend. Don't reinvent the wheel.
 * - Test one item at a time. Less confusion when debugging.
 * - Emojis make everything better. Use them liberally.
 * - If something breaks, check the browser console (F12) for errors.
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting commas between properties (JavaScript is picky)
 * - Typos in IDs (case-sensitive! "Water" ≠ "water")
 * - Using spaces in IDs (use underscores instead)
 * 
 * 🎨 WANT TO MODIFY EXISTING ITEMS?
 * Just find the item and change the numbers! Easy peasy.
 * - Make food heal more? Increase 'nutrition'
 * - Make tools last longer? Add 'durability' property
 * - Make something rarer? Set 'rarity: "rare"'
 * 
 * Have fun tweaking! 🚀
 */

class MasterItemList {
    static getItems() {
        return {
            // ========== CATEGORY 1: WATER SYSTEMS ==========
            'water_heater': {
                id: 'water_heater',
                name: 'Water Heater',
                type: 'appliance',
                description: 'Primary water source. Contains 40 units of water.',
                icon: '🔥',
                stackable: false,
                waterLevel: 40
            },
            'empty_bucket': {
                id: 'empty_bucket',
                name: 'Empty Bucket',
                type: 'container',
                description: '5-gallon bucket. Essential for water and waste.',
                icon: '🪣',
                stackable: false,
                capacity: 5
            },
            'plastic_container': {
                id: 'plastic_container',
                name: 'Plastic Container',
                type: 'container',
                description: 'Plastic storage container. Holds water.',
                icon: '📦',
                stackable: true,
                maxStack: 3,
                capacity: 2
            },
            'glass_jar': {
                id: 'glass_jar',
                name: 'Glass Jar',
                type: 'container',
                description: 'Glass jar. Can store water and see purification progress.',
                icon: '🥃',
                stackable: true,
                maxStack: 3,
                capacity: 1
            },
            'water_bottle': {
                id: 'water_bottle',
                name: 'Water Bottle',
                type: 'container',
                description: 'Portable water bottle.',
                icon: '🍼',
                stackable: true,
                maxStack: 5,
                capacity: 1
            },
            'collapsible_water_container': {
                id: 'collapsible_water_container',
                name: 'Collapsible Water Container',
                type: 'container',
                description: 'Camping water container. Extra storage.',
                icon: '💧',
                stackable: false,
                capacity: 3
            },
            'garden_hose': {
                id: 'garden_hose',
                name: 'Old Garden Hose',
                type: 'tool',
                description: 'Garden hose. Useful for siphoning and extended reach.',
                icon: '🚿',
                stackable: false
            },
            'rain_catchment_tarp': {
                id: 'rain_catchment_tarp',
                name: 'Rain Catchment Tarp',
                type: 'tool',
                description: 'Tarp for collecting rainwater.',
                icon: '🌧️',
                stackable: false
            },

            // ========== CATEGORY 2: WATER PURIFICATION ==========
            'sand': {
                id: 'sand',
                name: 'Sand',
                type: 'material',
                description: 'Sand for water filtration.',
                icon: '🏖️',
                stackable: true,
                maxStack: 10
            },
            'gravel': {
                id: 'gravel',
                name: 'Gravel',
                type: 'material',
                description: 'Small stones for water filtration.',
                icon: '🪨',
                stackable: true,
                maxStack: 10
            },
            'charcoal_briquettes': {
                id: 'charcoal_briquettes',
                name: 'Charcoal Briquettes',
                type: 'material',
                description: 'Charcoal for filtering and medicine.',
                icon: '⚫',
                stackable: true,
                maxStack: 10
            },
            'coffee_filters': {
                id: 'coffee_filters',
                name: 'Coffee Filters',
                type: 'material',
                description: 'Fine filters for water purification.',
                icon: '☕',
                stackable: true,
                maxStack: 20
            },
            'old_rag': {
                id: 'old_rag',
                name: 'Old T-Shirt/Rag',
                type: 'material',
                description: 'Cloth for filtering and bandages.',
                icon: '🧵',
                stackable: true,
                maxStack: 10
            },
            'bleach': {
                id: 'bleach',
                name: 'Bleach (Unscented)',
                type: 'consumable',
                description: 'Chemical water purification. 3 drops per gallon.',
                icon: '🧪',
                stackable: true,
                maxStack: 3
            },
            'iodine_tablets': {
                id: 'iodine_tablets',
                name: 'Iodine Tablets',
                type: 'consumable',
                description: 'Chemical water purification tablets.',
                icon: '💊',
                stackable: true,
                maxStack: 10
            },
            'cooking_pot': {
                id: 'cooking_pot',
                name: 'Pot for Boiling',
                type: 'container',
                description: 'Pot for boiling water and cooking.',
                icon: '🍲',
                stackable: false,
                capacity: 2
            },

            // ========== CATEGORY 3: FOOD - FOUND ITEMS ==========
            'canned_beans': {
                id: 'canned_beans',
                name: 'Canned Beans',
                type: 'food',
                description: 'Canned beans. Nutritious when sealed.',
                icon: '🥫',
                stackable: true,
                maxStack: 5,
                nutrition: 35,
                condition: 'Fresh',
                requiresOpener: true,
                hygieneCost: 0,
                moraleBoost: 5
            },
            'canned_vegetables': {
                id: 'canned_vegetables',
                name: 'Canned Vegetables',
                type: 'food',
                description: 'Canned vegetables. Nutritious when sealed.',
                icon: '🥫',
                stackable: true,
                maxStack: 5,
                nutrition: 25,
                condition: 'Fresh',
                requiresOpener: true,
                hygieneCost: 0,
                moraleBoost: 5
            },
            'crackers': {
                id: 'crackers',
                name: 'Crackers',
                type: 'food',
                description: 'Old crackers. Stale but good for bait.',
                icon: '🍪',
                stackable: true,
                maxStack: 10,
                nutrition: 15,
                condition: 'Stale',
                isBait: true,
                hygieneCost: 5,
                moraleBoost: -5
            },
            'energy_bar': {
                id: 'energy_bar',
                name: 'Energy Bar',
                type: 'food',
                description: 'Emergency energy bar. Nutritious but limited.',
                icon: '🍫',
                stackable: true,
                maxStack: 5,
                nutrition: 30,
                condition: 'Fresh',
                expiresIn: 3
            },
            'protein_powder': {
                id: 'protein_powder',
                name: 'Protein Powder',
                type: 'food',
                description: 'Protein powder. Needs water to consume.',
                icon: '🥤',
                stackable: true,
                maxStack: 3,
                nutrition: 25,
                condition: 'Fresh'
            },
            'pickled_eggs': {
                id: 'pickled_eggs',
                name: 'Pickled Eggs',
                type: 'food',
                description: 'Pickled eggs. Preserved, still good.',
                icon: '🥚',
                stackable: true,
                maxStack: 5,
                nutrition: 30,
                condition: 'Fresh',
                expiresIn: 10
            },
            'pet_food': {
                id: 'pet_food',
                name: 'Dog/Cat Food',
                type: 'food',
                description: 'Pet food. Stale but edible in desperation.',
                icon: '🐕',
                stackable: true,
                maxStack: 5,
                nutrition: 20,
                condition: 'Stale',
                hygieneCost: 10
            },
            'peanut_butter': {
                id: 'peanut_butter',
                name: 'Peanut Butter',
                type: 'food',
                description: 'Peanut butter. High nutrition, good for bait.',
                icon: '🥜',
                stackable: true,
                maxStack: 3,
                nutrition: 50,
                condition: 'Fresh',
                isBait: true
            },
            'canned_soup': {
                id: 'canned_soup',
                name: 'Canned Soup',
                type: 'food',
                description: 'Canned soup. Nutritious when sealed.',
                icon: '🥫',
                stackable: true,
                maxStack: 5,
                nutrition: 45,
                condition: 'Fresh',
                requiresOpener: true
            },
            'ramen_noodles': {
                id: 'ramen_noodles',
                name: 'Ramen Noodles',
                type: 'food',
                description: 'Ramen noodles. Stale but edible.',
                icon: '🍜',
                stackable: true,
                maxStack: 5,
                nutrition: 15,
                condition: 'Stale'
            },
            'spices': {
                id: 'spices',
                name: 'Spices/Old Packets',
                type: 'material',
                description: 'Old spice packets. Flavor and can grow sprouts.',
                icon: '🌶️',
                stackable: true,
                maxStack: 10
            },
            'bird_seed': {
                id: 'bird_seed',
                name: 'Bird Seed',
                type: 'material',
                description: 'Bird seed. Can grow sprouts or use as bait.',
                icon: '🌾',
                stackable: true,
                maxStack: 10,
                isBait: true
            },
            'mystery_freezer_meat': {
                id: 'mystery_freezer_meat',
                name: 'Mystery Freezer Meat',
                type: 'food',
                description: 'Old freezer meat. Spoiled without power. Risky.',
                icon: '🥩',
                stackable: true,
                maxStack: 3,
                nutrition: 20,
                condition: 'Spoiled',
                hygieneCost: 20,
                sicknessRisk: 0.5
            },

            // ========== CATEGORY 4: FOOD - HUNTING/TRAPPING ==========
            'wire': {
                id: 'wire',
                name: 'Wire',
                type: 'material',
                description: 'Copper wire. Essential for snares and traps.',
                icon: '🔌',
                stackable: true,
                maxStack: 10
            },
            'string': {
                id: 'string',
                name: 'String/Twine',
                type: 'material',
                description: 'String or twine. For snares and crafting.',
                icon: '🧶',
                stackable: true,
                maxStack: 10
            },
            'mouse_trap': {
                id: 'mouse_trap',
                name: 'Mouse Trap',
                type: 'tool',
                description: 'Snap-type mouse trap. More reliable than handmade.',
                icon: '🪤',
                stackable: true,
                maxStack: 3
            },
            'mouse_meat': {
                id: 'mouse_meat',
                name: 'Mouse Meat',
                type: 'food',
                description: 'Raw mouse meat. Should be cooked.',
                icon: '🐭',
                stackable: true,
                maxStack: 5,
                nutrition: 20,
                condition: 'Fresh',
                expiresIn: 1
            },
            'rabbit_meat': {
                id: 'rabbit_meat',
                name: 'Rabbit Meat',
                type: 'food',
                description: 'Fresh rabbit meat. A real meal!',
                icon: '🐰',
                stackable: true,
                maxStack: 3,
                nutrition: 60,
                condition: 'Fresh',
                expiresIn: 2
            },
            'cricket': {
                id: 'cricket',
                name: 'Cricket',
                type: 'food',
                description: 'A cricket. Desperation food.',
                icon: '🦗',
                stackable: true,
                maxStack: 10,
                nutrition: 5,
                condition: 'Fresh',
                hygieneCost: 3
            },

            // ========== CATEGORY 5: FIRE & HEAT ==========
            'matches': {
                id: 'matches',
                name: 'Matches',
                type: 'tool',
                description: 'Matches for lighting fires. Limited supply.',
                icon: '🔥',
                stackable: true,
                maxStack: 30
            },
            'lighter': {
                id: 'lighter',
                name: 'Lighter',
                type: 'tool',
                description: 'Lighter. Durable fire starter.',
                icon: '🔥',
                stackable: false
            },
            'candle': {
                id: 'candle',
                name: 'Candle',
                type: 'tool',
                description: 'Candle. Provides light and heat.',
                icon: '🕯️',
                stackable: true,
                maxStack: 10
            },
            'sterno_can': {
                id: 'sterno_can',
                name: 'Sterno Can',
                type: 'consumable',
                description: 'Sterno fuel can. Safe indoor cooking.',
                icon: '🔥',
                stackable: true,
                maxStack: 5
            },
            'propane_stove': {
                id: 'propane_stove',
                name: 'Propane Camping Stove',
                type: 'tool',
                description: 'Propane stove. Risky - needs ventilation.',
                icon: '🔥',
                stackable: false
            },
            'propane_canister': {
                id: 'propane_canister',
                name: 'Propane Canister',
                type: 'consumable',
                description: 'Propane fuel. For stove.',
                icon: '⛽',
                stackable: true,
                maxStack: 3
            },
            'terra_cotta_pot': {
                id: 'terra_cotta_pot',
                name: 'Terra Cotta Flower Pot',
                type: 'tool',
                description: 'Flower pot. Can make candle heater.',
                icon: '🪴',
                stackable: false
            },
            'newspaper': {
                id: 'newspaper',
                name: 'Newspaper/Magazines',
                type: 'material',
                description: 'Newspapers. Tinder and reading material.',
                icon: '📰',
                stackable: true,
                maxStack: 10
            },
            'cardboard': {
                id: 'cardboard',
                name: 'Cardboard',
                type: 'material',
                description: 'Cardboard. Tinder and insulation.',
                icon: '📦',
                stackable: true,
                maxStack: 20
            },
            'wood_scraps': {
                id: 'wood_scraps',
                name: 'Wood Scraps',
                type: 'material',
                description: 'Wood scraps. Fuel and fortifications.',
                icon: '🪵',
                stackable: true,
                maxStack: 20
            },
            'old_clothes': {
                id: 'old_clothes',
                name: 'Old Clothes/Rags',
                type: 'material',
                description: 'Old clothes. Tinder and insulation.',
                icon: '👕',
                stackable: true,
                maxStack: 10
            },

            // ========== CATEGORY 6: POWER & LIGHT ==========
            'battery_box': {
                id: 'battery_box',
                name: 'Battery Box/Power Station',
                type: 'tool',
                description: 'Portable power station. Starts at 40% charge.',
                icon: '🔋',
                stackable: false,
                charge: 40
            },
            'flashlight': {
                id: 'flashlight',
                name: 'Flashlight',
                type: 'tool',
                description: 'Flashlight. Essential for light.',
                icon: '🔦',
                stackable: false
            },
            'battery': {
                id: 'battery',
                name: 'Battery',
                type: 'material',
                description: 'Batteries. Power for devices.',
                icon: '🔋',
                stackable: true,
                maxStack: 10
            },
            'generator': {
                id: 'generator',
                name: 'Generator',
                type: 'tool',
                description: 'Generator. High power but loud and risky.',
                icon: '⚡',
                stackable: false
            },
            'gas_can': {
                id: 'gas_can',
                name: 'Gas Can',
                type: 'consumable',
                description: 'Gasoline. Fuel for generator.',
                icon: '⛽',
                stackable: true,
                maxStack: 3
            },
            'extension_cord': {
                id: 'extension_cord',
                name: 'Extension Cord',
                type: 'tool',
                description: 'Extension cord. Connect devices.',
                icon: '🔌',
                stackable: false
            },
            'cell_phone': {
                id: 'cell_phone',
                name: 'Cell Phone',
                type: 'tool',
                description: 'Your phone. Limited battery, one bar signal.',
                icon: '📱',
                stackable: false,
                battery: 20
            },
            'emergency_radio': {
                id: 'emergency_radio',
                name: 'Emergency Radio',
                type: 'tool',
                description: 'Emergency radio. Information and morale.',
                icon: '📻',
                stackable: false
            },
            'wiring': {
                id: 'wiring',
                name: 'Wiring/Electrical Cord',
                type: 'material',
                description: 'Electrical wiring. For repairs and crafting.',
                icon: '🔌',
                stackable: true,
                maxStack: 10
            },

            // ========== CATEGORY 7: WASTE & HYGIENE ==========
            'toilet_seat': {
                id: 'toilet_seat',
                name: 'Toilet Seat',
                type: 'tool',
                description: 'Toilet seat. Morale boost for compost toilet.',
                icon: '🚽',
                stackable: false
            },
            'sawdust': {
                id: 'sawdust',
                name: 'Sawdust',
                type: 'material',
                description: 'Sawdust. Essential for compost toilet.',
                icon: '🪵',
                stackable: true,
                maxStack: 10
            },
            'potting_soil': {
                id: 'potting_soil',
                name: 'Potting Soil',
                type: 'material',
                description: 'Potting soil. For compost cover and sprouts.',
                icon: '🌱',
                stackable: true,
                maxStack: 10
            },
            'baby_wipes': {
                id: 'baby_wipes',
                name: 'Moist Wipes',
                type: 'consumable',
                description: 'Moist wipes. Use to clean up; major hygiene boost.',
                icon: '🧻',
                stackable: true,
                maxStack: 5
            },
            'hand_sanitizer': {
                id: 'hand_sanitizer',
                name: 'Hand Sanitizer',
                type: 'consumable',
                description: 'Use after bathroom to avoid bigger hygiene and morale penalties.',
                icon: '🧴',
                stackable: true,
                maxStack: 3
            },
            'soap': {
                id: 'soap',
                name: 'Soap',
                type: 'consumable',
                description: 'Use with water and rag at the drain for a proper wash.',
                icon: '🧼',
                stackable: true,
                maxStack: 3
            },
            'trash_bags': {
                id: 'trash_bags',
                name: 'Trash Bags',
                type: 'material',
                description: 'Trash bags. Waste containment and rain catchment.',
                icon: '🗑️',
                stackable: true,
                maxStack: 10
            },
            'shovel': {
                id: 'shovel',
                name: 'Shovel',
                type: 'tool',
                description: 'Small shovel. For moving compost.',
                icon: '🪚',
                stackable: false
            },

            // ========== CATEGORY 8: TOOLS ==========
            'hammer': {
                id: 'hammer',
                name: 'Hammer',
                type: 'tool',
                description: 'Hammer. Essential for fortifications and dismantling.',
                icon: '🔨',
                stackable: false
            },
            'screwdriver': {
                id: 'screwdriver',
                name: 'Screwdriver',
                type: 'tool',
                description: 'Screwdriver. For dismantling and repairs.',
                icon: '🔩',
                stackable: false
            },
            'wrench': {
                id: 'wrench',
                name: 'Wrench',
                type: 'tool',
                description: 'Adjustable wrench. For plumbing and dismantling.',
                icon: '🔧',
                stackable: false
            },
            'pliers': {
                id: 'pliers',
                name: 'Pliers',
                type: 'tool',
                description: 'Pliers. For wire work and gripping.',
                icon: '🔧',
                stackable: false
            },
            'handsaw': {
                id: 'handsaw',
                name: 'Handsaw',
                type: 'tool',
                description: 'Handsaw. For cutting wood.',
                icon: '🪚',
                stackable: false
            },
            'utility_knife': {
                id: 'utility_knife',
                name: 'Utility Knife',
                type: 'tool',
                description: 'Utility knife. For cutting and skinning.',
                icon: '🔪',
                stackable: false
            },
            'duct_tape': {
                id: 'duct_tape',
                name: 'Duct Tape',
                type: 'material',
                description: 'Duct tape. Essential for repairs and crafting.',
                icon: '🔧',
                stackable: true,
                maxStack: 5
            },
            'rope': {
                id: 'rope',
                name: 'Rope',
                type: 'material',
                description: 'Rope. For fortifications and snares.',
                icon: '🪢',
                stackable: true,
                maxStack: 5
            },
            'can_opener': {
                id: 'can_opener',
                name: 'Can Opener',
                type: 'tool',
                description: 'Can opener. Essential for canned food.',
                icon: '🥫',
                stackable: false
            },
            'scissors': {
                id: 'scissors',
                name: 'Scissors',
                type: 'tool',
                description: 'Scissors. For cutting.',
                icon: '✂️',
                stackable: false
            },
            'multitool': {
                id: 'multitool',
                name: 'Multitool',
                type: 'tool',
                description: 'Multitool. All-in-one tool.',
                icon: '🔧',
                stackable: false
            },

            // ========== CATEGORY 9: FORTIFICATIONS ==========
            'wood_planks': {
                id: 'wood_planks',
                name: 'Wood Planks',
                type: 'material',
                description: 'Wood planks. For boarding windows and doors.',
                icon: '🪵',
                stackable: true,
                maxStack: 10
            },
            'nails': {
                id: 'nails',
                name: 'Nails',
                type: 'material',
                description: 'Box of nails. For fortifications.',
                icon: '📌',
                stackable: true,
                maxStack: 50
            },
            'gasoline': {
                id: 'gasoline',
                name: 'Gasoline',
                type: 'consumable',
                description: 'Small amount of gasoline. Weapon or fuel.',
                icon: '⛽',
                stackable: true,
                maxStack: 3
            },
            'fire_extinguisher': {
                id: 'fire_extinguisher',
                name: 'Fire Extinguisher',
                type: 'tool',
                description: 'Fire extinguisher. Safety and putting out fires.',
                icon: '🧯',
                stackable: false
            },

            // ========== CATEGORY 10: MEDICAL & HEALTH ==========
            'first_aid_kit': {
                id: 'first_aid_kit',
                name: 'First Aid Kit',
                type: 'container',
                description: 'First aid kit. Contains bandages and antiseptic.',
                icon: '🏥',
                stackable: false,
                contains: ['bandages', 'antiseptic_wipes']
            },
            'bandages': {
                id: 'bandages',
                name: 'Bandages',
                type: 'consumable',
                description: 'Bandages. For wound care.',
                icon: '🩹',
                stackable: true,
                maxStack: 10
            },
            'antiseptic_wipes': {
                id: 'antiseptic_wipes',
                name: 'Antiseptic Wipes',
                type: 'consumable',
                description: 'Antiseptic wipes. Infection prevention.',
                icon: '🧴',
                stackable: true,
                maxStack: 10
            },
            'old_antibiotics': {
                id: 'old_antibiotics',
                name: 'Old Antibiotics',
                type: 'consumable',
                description: 'Expired antibiotics. Risky but potentially life-saving.',
                icon: '💊',
                stackable: true,
                maxStack: 5,
                cureChance: 0.4,
                worsenChance: 0.6
            },
            'pain_killers': {
                id: 'pain_killers',
                name: 'Pain Killers',
                type: 'consumable',
                description: 'Pain killers. Symptom relief and morale boost.',
                icon: '💊',
                stackable: true,
                maxStack: 5
            },
            'vitamins': {
                id: 'vitamins',
                name: 'Vitamins',
                type: 'consumable',
                description: 'Vitamins. Small health boost.',
                icon: '💊',
                stackable: true,
                maxStack: 10
            },

            // ========== CATEGORY 11: MORALE & ENRICHMENT ==========
            'deck_of_cards': {
                id: 'deck_of_cards',
                name: 'Deck of Cards',
                type: 'tool',
                description: 'Playing cards. Morale boost when used.',
                icon: '🃏',
                stackable: false,
                moraleBoost: 5
            },
            'book': {
                id: 'book',
                name: 'Book',
                type: 'tool',
                description: 'Fiction book. Medium morale boost.',
                icon: '📖',
                stackable: false,
                moraleBoost: 8
            },
            'magazine': {
                id: 'magazine',
                name: 'Magazine',
                type: 'tool',
                description: 'Magazine. Small boost, possible tips.',
                icon: '📰',
                stackable: true,
                maxStack: 5,
                moraleBoost: 3
            },
            'board_game': {
                id: 'board_game',
                name: 'Board Game',
                type: 'tool',
                description: 'Board game. Solo play is lonely but helps.',
                icon: '🎲',
                stackable: false,
                moraleBoost: 5
            },
            'coloring_book': {
                id: 'coloring_book',
                name: 'Coloring Book & Crayons',
                type: 'tool',
                description: 'Coloring book. Morale boost.',
                icon: '🖍️',
                stackable: false,
                moraleBoost: 4
            },
            'broken_toy_robot': {
                id: 'broken_toy_robot',
                name: 'Broken Toy Robot',
                type: 'tool',
                description: 'Broken toy. Can fix for major morale boost.',
                icon: '🤖',
                stackable: false,
                broken: true
            },
            'old_costume': {
                id: 'old_costume',
                name: 'Old Costume',
                type: 'tool',
                description: 'Old costume. Wear for morale boost.',
                icon: '🎭',
                stackable: false,
                moraleBoost: 6
            },
            'makeshift_bedding': {
                id: 'makeshift_bedding',
                name: 'Makeshift Bedding',
                type: 'tool',
                description: 'Piled clothes and costumes. Use Rest to sleep on it; recovers fatigue better than the floor.',
                icon: '🛏️',
                stackable: false
            },
            'photo_album': {
                id: 'photo_album',
                name: 'Photo Album',
                type: 'tool',
                description: 'Photo album. Risky - happy or sad memories.',
                icon: '📷',
                stackable: false,
                moraleBoost: 0, // Random
                moraleDrain: 0 // Random
            },
            'journal': {
                id: 'journal',
                name: 'Journal/Notebook',
                type: 'tool',
                description: 'Journal. Write to process emotions.',
                icon: '📔',
                stackable: false,
                moraleBoost: 5
            },

            // ========== CATEGORY 12: JUNK (BUT USEFUL) ==========
            'wire_hangers': {
                id: 'wire_hangers',
                name: 'Wire Hangers',
                type: 'material',
                description: 'Wire hangers. Can make snares.',
                icon: '🪝',
                stackable: true,
                maxStack: 10
            },
            'tin_cans': {
                id: 'tin_cans',
                name: 'Tin Cans',
                type: 'material',
                description: 'Tin cans. Containers and alarms.',
                icon: '🥫',
                stackable: true,
                maxStack: 5
            },
            'coffee_can_bolts': {
                id: 'coffee_can_bolts',
                name: 'Coffee Can with Bolts',
                type: 'material',
                description: 'Coffee can full of hardware.',
                icon: '☕',
                stackable: false
            },

            // ========== EXISTING ITEMS (keeping for compatibility) ==========
            'bucket': {
                id: 'bucket',
                name: '5-Gallon Bucket',
                type: 'container',
                description: 'A large bucket. Can hold water or be used as a compost toilet.',
                icon: '🪣',
                stackable: false,
                capacity: 5
            },
            'bottle': {
                id: 'bottle',
                name: 'Water Bottle',
                type: 'container',
                description: 'A plastic bottle. Holds water.',
                icon: '🍼',
                stackable: true,
                maxStack: 5,
                capacity: 1
            },
            'pot': {
                id: 'pot',
                name: 'Cooking Pot',
                type: 'container',
                description: 'A pot for cooking and boiling water.',
                icon: '🍲',
                stackable: false,
                capacity: 2
            },
            'knife': {
                id: 'knife',
                name: 'Knife',
                type: 'tool',
                description: 'A sharp knife. Essential for processing food and materials.',
                icon: '🔪',
                stackable: false
            },
            'stick': {
                id: 'stick',
                name: 'Stick',
                type: 'material',
                description: 'A wooden stick. Can be used for crafting or as fuel.',
                icon: '🪵',
                stackable: true,
                maxStack: 10
            },
            'cloth': {
                id: 'cloth',
                name: 'Cloth',
                type: 'material',
                description: 'Fabric scraps. Can be used for bandages or fuel.',
                icon: '🧵',
                stackable: true,
                maxStack: 10
            },
            'metal': {
                id: 'metal',
                name: 'Metal Scrap',
                type: 'material',
                description: 'Scrap metal. Useful for crafting.',
                icon: '⚙️',
                stackable: true,
                maxStack: 15
            },
            'insulation': {
                id: 'insulation',
                name: 'Insulation',
                type: 'material',
                description: 'Fiberglass insulation. Useful for warmth.',
                icon: '🧱',
                stackable: true,
                maxStack: 10
            },
            'copper_pipe': {
                id: 'copper_pipe',
                name: 'Copper Pipe',
                type: 'material',
                description: 'Copper piping. Valuable for crafting.',
                icon: '🔩',
                stackable: true,
                maxStack: 10
            },
            'compost': {
                id: 'compost',
                name: 'Compost',
                type: 'material',
                description: 'Composted waste. Perfect fertilizer for sprouts.',
                icon: '💩',
                stackable: false
            },
            'water': {
                id: 'water',
                name: 'Water',
                type: 'consumable',
                description: 'Clean water. Essential for survival.',
                icon: '💧',
                stackable: true,
                maxStack: 10,
                hydration: 30,
                hygieneCost: 0,
                sicknessRisk: 0
            },
            'purified_water': {
                id: 'purified_water',
                name: 'Purified Water',
                type: 'consumable',
                description: 'Boiled and purified water. Safe to drink.',
                icon: '💧',
                stackable: true,
                maxStack: 10,
                hydration: 30,
                hygieneCost: 0,
                sicknessRisk: 0
            },
            'sump_water_raw': {
                id: 'sump_water_raw',
                name: 'Raw Sump Water',
                type: 'consumable',
                description: 'Grey water from sump pump. Risky to drink.',
                icon: '💧',
                stackable: true,
                maxStack: 10,
                hydration: 30,
                hygieneCost: 10,
                sicknessRisk: 0.4
            },
            'sump_water_boiled': {
                id: 'sump_water_boiled',
                name: 'Boiled Sump Water',
                type: 'consumable',
                description: 'Boiled grey water. Safe to drink.',
                icon: '💧',
                stackable: true,
                maxStack: 10,
                hydration: 30,
                hygieneCost: 0,
                sicknessRisk: 0
            },
            'rainwater': {
                id: 'rainwater',
                name: 'Rainwater',
                type: 'consumable',
                description: 'Collected rainwater. Should be filtered.',
                icon: '💧',
                stackable: true,
                maxStack: 10,
                hydration: 30,
                hygieneCost: 5,
                sicknessRisk: 0.1
            },
            'seeds': {
                id: 'seeds',
                name: 'Seeds',
                type: 'material',
                description: 'Birdseed or old spice packets. Can grow sprouts.',
                icon: '🌾',
                stackable: true,
                maxStack: 10
            },
            'medicine': {
                id: 'medicine',
                name: 'Medicine',
                type: 'consumable',
                description: 'Antibiotics or herbal remedy. Cures sickness.',
                icon: '💊',
                stackable: true,
                maxStack: 5
            },
            'candle': {
                id: 'candle',
                name: 'Candle',
                type: 'tool',
                description: 'A candle. Provides light and can be used for heat.',
                icon: '🕯️',
                stackable: true,
                maxStack: 10
            },
            'cooked_mouse': {
                id: 'cooked_mouse',
                name: 'Cooked Mouse',
                type: 'food',
                description: 'Cooked mouse meat. Better nutrition and safer.',
                icon: '🍖',
                stackable: true,
                maxStack: 5,
                nutrition: 25,
                condition: 'Fresh',
                expiresIn: 2,
                hygieneCost: 0,
                moraleBoost: -5 // Moral ambiguity
            },
            'cooked_rabbit': {
                id: 'cooked_rabbit',
                name: 'Cooked Rabbit',
                type: 'food',
                description: 'Cooked rabbit meat. A real feast!',
                icon: '🍖',
                stackable: true,
                maxStack: 3,
                nutrition: 50,
                condition: 'Fresh',
                expiresIn: 3,
                hygieneCost: 0,
                moraleBoost: 15
            },
            'sprouts': {
                id: 'sprouts',
                name: 'Sprouts',
                type: 'food',
                description: 'Homegrown sprouts. You grew these yourself!',
                icon: '🌱',
                stackable: true,
                maxStack: 10,
                nutrition: 15,
                condition: 'Fresh',
                expiresIn: 3,
                hygieneCost: 0,
                moraleBoost: 10
            },
            'sprouts_compost': {
                id: 'sprouts_compost',
                name: 'Sprouts (Compost-Grown)',
                type: 'food',
                description: 'Sprouts grown in your own compost. Closed loop!',
                icon: '🌱',
                stackable: true,
                maxStack: 10,
                nutrition: 15,
                condition: 'Fresh',
                expiresIn: 3,
                hygieneCost: 0,
                moraleBoost: 20 // Genius!
            },
            'whiskey_bottle': {
                id: 'whiskey_bottle',
                name: 'Old Whiskey Bottle',
                type: 'consumable',
                description: 'Emergency stash. Three drinks left. Future you will have opinions.',
                icon: '🥃',
                stackable: false,
                quantity: 3,
                maxStack: 1,
                rarity: 'uncommon'
            },
            'coffee': {
                id: 'coffee',
                name: 'Coffee',
                type: 'consumable',
                description: 'Brewed coffee. Wakes you up, but crash is coming.',
                icon: '☕',
                stackable: true,
                maxStack: 3,
                fatigueReduction: 20,
                crashFatigue: 10,
                crashTime: 4
            },
            'energy_drink': {
                id: 'energy_drink',
                name: 'Energy Drink',
                type: 'consumable',
                description: 'High-caffeine energy drink. Major crash later.',
                icon: '⚡',
                stackable: true,
                maxStack: 3,
                fatigueReduction: 30,
                crashFatigue: 20,
                crashTime: 4
            },
            'caffeine_pills': {
                id: 'caffeine_pills',
                name: 'Caffeine Pills',
                type: 'consumable',
                description: 'Caffeine pills. Quick boost, shaky hands.',
                icon: '💊',
                stackable: true,
                maxStack: 5,
                fatigueReduction: 15,
                jitters: true,
                jittersTime: 2
            },
            'small_backpack': {
                id: 'small_backpack',
                name: 'Small Backpack',
                type: 'container',
                description: 'Small camping backpack. Adds 5 inventory slots.',
                icon: '🎒',
                stackable: false,
                maxStack: 1,
                backpackType: 'small'
            },
            'hiking_backpack': {
                id: 'hiking_backpack',
                name: 'Hiking Backpack',
                type: 'container',
                description: 'Large hiking backpack. Adds 10 inventory slots.',
                icon: '🎒',
                stackable: false,
                maxStack: 1,
                backpackType: 'hiking',
                rarity: 'rare'
            },
            'shopping_bag': {
                id: 'shopping_bag',
                name: 'Shopping Bag',
                type: 'container',
                description: 'Plastic shopping bag. Adds 3 inventory slots. Temporary.',
                icon: '🛍️',
                stackable: false,
                maxStack: 1,
                backpackType: 'shopping_bag'
            },
            'baseball_bat': {
                id: 'baseball_bat',
                name: 'Baseball Bat',
                type: 'weapon',
                description: 'Wooden baseball bat. Good for defense.',
                icon: '⚾',
                stackable: false,
                maxStack: 1
            },
            'pepper_spray': {
                id: 'pepper_spray',
                name: 'Pepper Spray',
                type: 'weapon',
                description: 'Pepper spray. Scares mongrels 90% of the time.',
                icon: '💨',
                stackable: true,
                maxStack: 2,
                rarity: 'rare'
            },
            'bear_spray': {
                id: 'bear_spray',
                name: 'Bear Spray',
                type: 'weapon',
                description: 'Bear spray. Very effective against threats.',
                icon: '🐻',
                stackable: true,
                maxStack: 2,
                rarity: 'rare'
            },
            'air_horn': {
                id: 'air_horn',
                name: 'Air Horn',
                type: 'weapon',
                description: 'Loud air horn. Scares everything, but attracts more later.',
                icon: '📯',
                stackable: false,
                maxStack: 1,
                rarity: 'rare'
            },
            'pain_killers': {
                id: 'pain_killers',
                name: 'Pain Killers',
                type: 'medical',
                description: 'Pain relief medication. Temporary relief from injuries.',
                icon: '💊',
                stackable: true,
                maxStack: 5
            },
            'snare': {
                id: 'snare',
                name: 'Snare Trap',
                type: 'tool',
                description: 'A simple snare trap for catching small animals.',
                icon: '🪤',
                stackable: true,
                maxStack: 5
            },
            'rabbit_snare': {
                id: 'rabbit_snare',
                name: 'Rabbit Snare',
                type: 'tool',
                description: 'A larger snare for catching rabbits.',
                icon: '🪤',
                stackable: true,
                maxStack: 3
            },
            'compost_toilet': {
                id: 'compost_toilet',
                name: 'Compost Toilet',
                type: 'tool',
                description: 'A bucket-based compost toilet. Manages waste safely.',
                icon: '🚽',
                stackable: false
            },
            'methane_generator': {
                id: 'methane_generator',
                name: 'Methane Generator',
                type: 'tool',
                description: 'A generator that runs on methane from waste. Genius!',
                icon: '⚡',
                stackable: false
            },
            'barricade': {
                id: 'barricade',
                name: 'Barricade',
                type: 'tool',
                description: 'A sturdy barricade for fortification.',
                icon: '🛡️',
                stackable: true,
                maxStack: 10
            },
            'torch': {
                id: 'torch',
                name: 'Torch',
                type: 'tool',
                description: 'A torch for light and heat.',
                icon: '🔥',
                stackable: true,
                maxStack: 5
            },

            // ========== PRACTICAL SURVIVAL / SCENE OBJECTS ==========
            'paint_thinner': {
                id: 'paint_thinner',
                name: 'Paint Thinner',
                type: 'consumable',
                description: 'Highly flammable solvent. Good accelerant. Toxic fumes indoors.',
                icon: '🧪',
                stackable: true,
                maxStack: 2,
                flammable: true,
                toxicity: 0.3
            },
            'tennis_ball': {
                id: 'tennis_ball',
                name: 'Tennis Ball',
                type: 'tool',
                description: 'Old tennis ball. Could distract animals or boost morale.',
                icon: '🎾',
                stackable: false,
                moraleBoost: 2,
                isDistraction: true
            },
            'work_boot': {
                id: 'work_boot',
                name: 'Single Work Boot',
                type: 'material',
                description: 'Worn work boot. Can salvage leather and laces.',
                icon: '🥾',
                stackable: false,
                salvage: ['cloth', 'rope']
            },
            'cleaning_supplies': {
                id: 'cleaning_supplies',
                name: 'Cleaning Supplies',
                type: 'material',
                description: 'Misc household cleaners. Some useful, some toxic.',
                icon: '🧴',
                stackable: false,
                toxicity: 0.2
            },
            'wall_calendar': {
                id: 'wall_calendar',
                name: 'Wall Calendar',
                type: 'tool',
                description: 'Calendar. Track days manually. Small morale boost.',
                icon: '📅',
                stackable: false,
                moraleBoost: 2
            },
            'short_sleeve_shirt': {
                id: 'short_sleeve_shirt',
                name: 'Short Sleeve Shirt',
                type: 'clothing',
                description: 'Basic tee. Keeps torso warm. Can be ripped for cloth.',
                icon: '👕',
                stackable: false,
                slot: 'torso',
                warmth: 2
            },
            'jean_pants': {
                id: 'jean_pants',
                name: 'Jean Pants',
                type: 'clothing',
                description: 'Everyday jeans. Can be ripped for cloth.',
                icon: '👖',
                stackable: false,
                slot: 'legs',
                warmth: 2
            },
            'socks': {
                id: 'socks',
                name: 'Socks',
                type: 'clothing',
                description: 'Basic socks. Feet stay colder than the rest of you.',
                icon: '🧦',
                stackable: true,
                maxStack: 3,
                slot: 'socks',
                warmth: 3
            },
            'shoes': {
                id: 'shoes',
                name: 'Shoes',
                type: 'clothing',
                description: 'Everyday shoes. Some insulation.',
                icon: '👟',
                stackable: false,
                slot: 'shoes',
                warmth: 2
            },
            'scarf': {
                id: 'scarf',
                name: 'Scarf',
                type: 'clothing',
                description: 'Keeps neck warm. Craft from ripped cloth.',
                icon: '🧣',
                stackable: false,
                slot: 'scarf',
                warmth: 4
            },
            'hat': {
                id: 'hat',
                name: 'Warm Hat',
                type: 'clothing',
                description: 'Keeps head warm. Craft from ripped cloth.',
                icon: '🧢',
                stackable: false,
                slot: 'head',
                warmth: 4
            },
            'mittens': {
                id: 'mittens',
                name: 'Mittens',
                type: 'clothing',
                description: 'Keeps hands warm. Craft from ripped cloth.',
                icon: '🧤',
                stackable: false,
                slot: 'hands',
                warmth: 4
            },
            'ripped_cloth': {
                id: 'ripped_cloth',
                name: 'Ripped Cloth',
                type: 'material',
                description: 'Fabric from old clothes. Cut with scissors or knife. Use to craft socks, scarf, hat, mittens.',
                icon: '🧵',
                stackable: true,
                maxStack: 10
            },
            'scissors': {
                id: 'scissors',
                name: 'Scissors',
                type: 'tool',
                description: 'Cuts cloth and paper. Needed to rip clothes into cloth.',
                icon: '✂️',
                stackable: false
            },
            'knife': {
                id: 'knife',
                name: 'Knife',
                type: 'tool',
                description: 'Can cut cloth if no scissors. Also useful for crafting.',
                icon: '🔪',
                stackable: false
            },
            'duct_tape': {
                id: 'duct_tape',
                name: 'Duct Tape',
                type: 'material',
                description: 'Mends tears. Use with ripped cloth or damaged items.',
                icon: '🩹',
                stackable: true,
                maxStack: 5
            },
            'needle_thread': {
                id: 'needle_thread',
                name: 'Needle and Thread',
                type: 'tool',
                description: 'Mends clothing and fabric properly.',
                icon: '🪡',
                stackable: false
            },
            'staples': {
                id: 'staples',
                name: 'Staples',
                type: 'material',
                description: 'Quick fix for fabric. Less durable than sewing.',
                icon: '📎',
                stackable: true,
                maxStack: 10
            },
            'ripped_socks': {
                id: 'ripped_socks',
                name: 'Improvised Socks',
                type: 'clothing',
                description: 'Socks made from ripped cloth. Better than nothing.',
                icon: '🧦',
                stackable: true,
                maxStack: 3,
                slot: 'socks',
                warmth: 2
            },
            'breaker_box': {
                id: 'breaker_box',
                name: 'Circuit Breaker Panel',
                type: 'appliance',
                description: 'Controls power to basement. Requires generator or grid.',
                icon: '⚡',
                stackable: false,
                powered: false
            },
            'cracked_concrete': {
                id: 'cracked_concrete',
                name: 'Cracked Concrete Floor',
                type: 'structure',
                description: 'Floor is cracked. Soil underneath may be accessible.',
                icon: '🧱',
                stackable: false
            },
            'basement_soil': {
                id: 'basement_soil',
                name: 'Basement Soil',
                type: 'material',
                description: 'Soil from beneath the concrete. Damp but usable.',
                icon: '🌱',
                stackable: true,
                maxStack: 10
            },
            'basement_weed': {
                id: 'basement_weed',
                name: 'Basement Weed',
                type: 'material',
                description: 'Hardy plant growing through concrete. Could harvest seeds.',
                icon: '🌿',
                stackable: true,
                maxStack: 5
            },
            'bird_nest': {
                id: 'bird_nest',
                name: 'Bird Nest',
                type: 'material',
                description: 'Nest of twigs and feathers. Tinder and insulation.',
                icon: '🪺',
                stackable: true,
                maxStack: 5
            },
            'bird_egg': {
                id: 'bird_egg',
                name: 'Small Bird Egg',
                type: 'food',
                description: 'Tiny egg. Fragile but edible.',
                icon: '🥚',
                stackable: true,
                maxStack: 5,
                nutrition: 10,
                condition: 'Fresh',
                expiresIn: 1
            },
            'old_hose': {
                id: 'old_hose',
                name: 'Old Cracked Hose',
                type: 'tool',
                description: 'Brittle garden hose. Might leak but usable for siphoning.',
                icon: '🚿',
                stackable: false,
                durability: 40
            },
            'basement_window': {
                id: 'basement_window',
                name: 'Basement Window',
                type: 'structure',
                description: 'Small basement window. Can ventilate or be boarded.',
                icon: '🪟',
                stackable: false
            }
        };
    }
}
