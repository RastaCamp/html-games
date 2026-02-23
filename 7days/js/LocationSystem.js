/**
 * 7 DAYS... - LOCATION SYSTEM
 * 
 * 📍 WHAT IS THIS FILE?
 * This manages where items can be found! Each location (L01-L35) has a capacity
 * and can hold items. Items are randomly placed in realistic locations when
 * the game starts.
 * 
 * 🎯 HOW IT WORKS:
 * - Each location has a capacity (how many items it can hold)
 * - Each item has an "allowed_locations" array (where it makes sense to find it)
 * - When game starts, items are randomly placed in valid locations
 * - Guaranteed items always spawn (essential for gameplay)
 * - Random items fill remaining space
 * 
 * 💡 WANT TO CHANGE WHERE ITEMS SPAWN?
 * - Modify item "allowed_locations" in the item definitions
 * - Adjust location capacities
 * - Change guaranteed items list
 * 
 * 🎨 EXAMPLE:
 * - Hammer can spawn in: L01 (Workbench), L13 (Toolbox), L15 (Under Sink)
 * - Canned food can spawn in: L04-L08 (Shelves/Boxes), L50 (closet Old Freezer)
 * - Makes sense, right? No hammers in the freezer!
 */

class LocationSystem {
    constructor(itemSystem) {
        this.itemSystem = itemSystem;
        this.locations = this.initializeLocations();
        this.itemLocationPools = this.initializeItemLocationPools();
        this.guaranteedItems = this.initializeGuaranteedItems();
    }

    initializeLocations() {
        // All locations with their capacities (from the spec JSON)
        return {
            // SCENE A - Main Basement
            'L01': { name: 'Workbench Surface', capacity: 4, scene: 'A', searched: false },
            'L03': { name: 'Pegboard', capacity: 6, scene: 'A', searched: false },
            'L04': { name: 'Shelf Unit - Top', capacity: 3, scene: 'A', searched: false },
            'L05': { name: 'Shelf Unit - Middle', capacity: 4, scene: 'A', searched: false },
            'L06': { name: 'Shelf Unit - Bottom', capacity: 4, scene: 'A', searched: false },
            'L07': { name: 'Cardboard Box A', capacity: 5, scene: 'A', searched: false },
            'L08': { name: 'Cardboard Box B', capacity: 5, scene: 'A', searched: false },
            'L10': { name: 'Plastic Bin A', capacity: 6, scene: 'A', searched: false },
            'L11': { name: 'Crate B', capacity: 6, scene: 'A', searched: false },
            'L13': { name: 'Toolbox', capacity: 8, scene: 'A', searched: false },
            'L14': { name: 'Tackle Box', capacity: 12, scene: 'A', searched: false },
            'L15': { name: 'Shop Sink', capacity: 5, scene: 'A', searched: false },
            'L16': { name: 'Behind Furnace', capacity: 2, scene: 'A', searched: false },
            'L17': { name: 'Inside Furnace Panel', capacity: 1, scene: 'A', searched: false },
            'L18': { name: 'Water Heater Area', capacity: 2, scene: 'A', searched: false },
            'L22': { name: 'Junky Table', capacity: 8, scene: 'A', searched: false },
            'L24': { name: 'Window Well', capacity: 2, scene: 'A', searched: false },
            'L25': { name: 'Floor Drain', capacity: 1, scene: 'A', searched: false },
            'L26': { name: 'Old Tote', capacity: 2, scene: 'A', searched: false },
            'L29': { name: 'Broken Crate', capacity: 1, scene: 'A', searched: false },
            'L44': { name: 'Old Crate', capacity: 2, scene: 'A', searched: false },
            'L31': { name: 'Junk Drawer', capacity: 10, scene: 'A', searched: false },
            'L32': { name: 'Workbench Drawer', capacity: 4, scene: 'A', searched: false },
            'L33': { name: 'Behind Old Furniture', capacity: 3, scene: 'A', searched: false },
            'L34': { name: 'Inside Old Boot', capacity: 1, scene: 'A', searched: false },
            'L35': { name: 'Ceiling Joists', capacity: 2, scene: 'A', searched: false },
            'L36': { name: 'Door', capacity: 3, scene: 'A', searched: false },
            'L37': { name: 'Sump Pit', capacity: 4, scene: 'A', searched: false },
            'L38': { name: 'Right Window', capacity: 2, scene: 'A', searched: false },
            'L39': { name: 'Breaker Panel', capacity: 1, scene: 'A', searched: false },
            'L40': { name: 'Light Switch', capacity: 0, scene: 'A', searched: false },
            'L42': { name: 'Old Junky Boxes', capacity: 4, scene: 'A', searched: false },
            'L45': { name: 'Magazines and Books', capacity: 6, scene: 'A', searched: false },
            'L46': { name: 'Can', capacity: 1, scene: 'A', searched: false },
            'L47': { name: 'Under the Shop Sink', capacity: 3, scene: 'A', searched: false },
            'L48': { name: 'Tennis Ball', capacity: 1, scene: 'A', searched: false },
            'L49': { name: 'Old Newspaper', capacity: 1, scene: 'A', searched: false },
            'L43': { name: 'Door Calendar', capacity: 2, scene: 'A', searched: false },
            
            // SCENE B - Under-Stairs Storage (closet)
            'L12': { name: 'Old Suitcase', capacity: 3, scene: 'B', searched: false },
            'L19': { name: 'Old Junk Boxes', capacity: 4, scene: 'B', searched: false },
            'L20': { name: 'Dirty clothes hamper', capacity: 3, scene: 'B', searched: false },
            'L21': { name: 'Under Stairs (Crawl Storage)', capacity: 4, scene: 'B', searched: false },
            'L23': { name: 'Costume Trunk', capacity: 6, scene: 'B', searched: false },
            'L50': { name: 'Old Freezer', capacity: 4, scene: 'B', searched: false }
        };
    }

    initializeItemLocationPools() {
        // Maps item IDs to arrays of valid location IDs where they can spawn
        // Based on the JSON spec provided, but converted to item IDs from MasterItemList
        
        return {
            // Water containers (matching MasterItemList IDs)
            'empty_bucket': ['L06', 'L15', 'L23', 'L26', 'L44', 'L46', 'L47'],
            'plastic_container': ['L05', 'L07', 'L08', 'L10', 'L15', 'L23', 'L46', 'L47'],
            'glass_jar': ['L05', 'L06', 'L08', 'L15', 'L22', 'L31', 'L47'],
            'water_bottle': ['L04', 'L05', 'L07', 'L10', 'L20', 'L44', 'L46'],
            'collapsible_water_container': ['L07', 'L08', 'L10', 'L11', 'L12', 'L23'],
            'rain_catchment_tarp': ['L04', 'L06', 'L07', 'L08', 'L11', 'L23'],
            'garden_hose': ['L06', 'L15', 'L23', 'L26', 'L33', 'L47'],
            
            // Note: Some items from spec use different IDs - we'll map common ones
            // If an item doesn't exist in MasterItemList, it will be skipped gracefully
            
            // Water purification
            'sand': ['L06', 'L08', 'L11', 'L15', 'L23'],
            'gravel': ['L06', 'L15', 'L23', 'L25', 'L33'],
            'charcoal_briquettes': ['L06', 'L07', 'L08', 'L11', 'L23'],
            'coffee_filters': ['L05', 'L08', 'L15', 'L31'],
            'bleach': ['L15', 'L23', 'L31'],
            'iodine_tablets': ['L10', 'L11', 'L13', 'L14', 'L31'],
            'cooking_pot': ['L04', 'L05', 'L06', 'L07', 'L08', 'L15'],
            
            // Tools
            'hammer': ['L01', 'L32', 'L03', 'L13', 'L15', 'L32'],
            'screwdriver': ['L01', 'L32', 'L03', 'L13', 'L15', 'L31'],
            'wrench': ['L01', 'L32', 'L03', 'L13', 'L15'],
            'pliers': ['L01', 'L32', 'L03', 'L13', 'L15'],
            'handsaw': ['L01', 'L03', 'L13', 'L32'],
            'utility_knife': ['L01', 'L32', 'L13', 'L31'],
            'duct_tape': ['L01', 'L32', 'L13', 'L15', 'L31'],
            'rope': ['L03', 'L06', 'L13', 'L23', 'L26'],
            'can_opener': ['L01', 'L32', 'L13', 'L15', 'L31'],
            'scissors': ['L01', 'L32', 'L13', 'L31'],
            'multitool': ['L01', 'L13', 'L14', 'L31'],
            'file': ['L01', 'L32', 'L13'],
            'crowbar': ['L13', 'L16', 'L23', 'L26', 'L33'],
            
            // Emergency items
            'emergency_radio': ['L04', 'L05', 'L07', 'L08', 'L10', 'L11', 'L13', 'L23'],
            'battery': ['L01', 'L32', 'L10', 'L11', 'L13', 'L14', 'L31'],
            'flashlight': ['L01', 'L32', 'L10', 'L11', 'L13', 'L31'],
            
            // Medical
            'first_aid_kit': ['L07', 'L08', 'L10', 'L11', 'L13', 'L15', 'L23'],
            'bandages': ['L07', 'L08', 'L10', 'L11', 'L13', 'L15'],
            'antiseptic_wipes': ['L07', 'L08', 'L10', 'L11', 'L13', 'L15'],
            'old_antibiotics': ['L15', 'L23', 'L31'],
            'pain_killers': ['L15', 'L23', 'L31'],
            'vitamins': ['L10', 'L11', 'L31'],
            
            // Fire/Heat
            'matches': ['L01', 'L32', 'L10', 'L11', 'L13', 'L31'],
            'lighter': ['L01', 'L32', 'L10', 'L11', 'L13', 'L31'],
            'candle': ['L04', 'L05', 'L07', 'L08', 'L10', 'L11', 'L15'],
            'sterno_can': ['L07', 'L08', 'L10', 'L11', 'L23'],
            'propane_stove': ['L07', 'L08', 'L11', 'L23'],
            'propane_canister': ['L07', 'L08', 'L11', 'L23'],
            'terra_cotta_pot': ['L06', 'L11', 'L23'],
            
            // Hygiene
            'trash_bags': ['L06', 'L07', 'L08', 'L11', 'L15', 'L23', 'L47'],
            'baby_wipes': ['L01', 'L32', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15', 'L16', 'L18', 'L19', 'L20', 'L21', 'L22', 'L23', 'L24', 'L26', 'L31', 'L32', 'L33', 'L34', 'L35', 'L44'],
            'hand_sanitizer': ['L04', 'L05', 'L07', 'L08', 'L10', 'L11', 'L15', 'L20', 'L22', 'L23', 'L31'],
            'soap': ['L15', 'L20', 'L23', 'L31', 'L44', 'L47'],
            'sawdust': ['L06', 'L15', 'L23'],
            'potting_soil': ['L06', 'L11', 'L23'],
            'toilet_seat': ['L23'],
            
            // Food - Canned
            'canned_beans': ['L04', 'L05', 'L06', 'L07', 'L08', 'L19', 'L23', 'L50'],
            'canned_vegetables': ['L04', 'L05', 'L06', 'L07', 'L08', 'L19', 'L23', 'L50'],
            'canned_soup': ['L04', 'L05', 'L06', 'L07', 'L08', 'L19', 'L23', 'L50'],
            
            // Food - Dry
            'crackers': ['L07', 'L08', 'L22', 'L31'],
            'energy_bar': ['L07', 'L08', 'L10', 'L11', 'L20'],
            'peanut_butter': ['L05', 'L07', 'L08', 'L22'],
            'ramen_noodles': ['L07', 'L08'],
            'spices': ['L05', 'L08', 'L15', 'L22'],
            'bird_seed': ['L06', 'L08', 'L11', 'L23'],
            'protein_powder': ['L10', 'L11'],
            'pickled_eggs': ['L23', 'L50'],
            'mystery_freezer_meat': ['L50'],
            
            // Materials
            'wire': ['L01', 'L32', 'L03', 'L06', 'L13', 'L23', 'L31'],
            'wire_hangers': ['L20', 'L21', 'L23'],
            'string': ['L01', 'L32', 'L03', 'L06', 'L13', 'L23', 'L31'],
            'wood_scraps': ['L06', 'L23', 'L26', 'L33'],
            'wood_planks': ['L06', 'L23', 'L26'],
            'nails': ['L01', 'L32', 'L13', 'L31'],
            'metal': ['L06', 'L13', 'L16', 'L23', 'L26'],
            'copper_pipe': ['L06', 'L13', 'L16', 'L23'],
            'wiring': ['L01', 'L32', 'L03', 'L06', 'L13', 'L16', 'L23'],
            'cardboard': ['L07', 'L08', 'L23'],
            'old_rag': ['L15', 'L20', 'L23', 'L31', 'L47'],
            'old_clothes': ['L20', 'L21', 'L23'],
            'insulation': ['L06', 'L16', 'L23'],
            'tin_cans': ['L06', 'L15', 'L23', 'L31', 'L46'],
            
            // Power/Light
            'battery_box': ['L10', 'L11', 'L13'],
            'generator': ['L23', 'L26'],
            'gas_can': ['L23', 'L26'],
            'extension_cord': ['L06', 'L13', 'L15', 'L23'],
            'cell_phone': ['L01', 'L32', 'L20', 'L31'],
            
            // Morale/Entertainment
            'deck_of_cards': ['L01', 'L32', 'L07', 'L08', 'L22', 'L31', 'L45'],
            'book': ['L22', 'L45'],
            'magazine': ['L22', 'L45'],
            'board_game': ['L07', 'L08', 'L23'],
            'coloring_book': ['L07', 'L08', 'L21', 'L45'],
            'broken_toy_robot': ['L07', 'L08', 'L21'],
            'old_costume': ['L21'],
            'photo_album': ['L07', 'L08', 'L22'],
            'journal': ['L01', 'L32', 'L22', 'L31', 'L45'],
            
            // Special
            'previous_survivor_note': ['L16', 'L23', 'L33', 'L34', 'L35'],
            'whiskey_bottle': ['L16', 'L23', 'L33', 'L35'],
            'coffee': ['L05', 'L08', 'L15', 'L22'],
            'energy_drink': ['L10', 'L11'],
            'caffeine_pills': ['L10', 'L11', 'L31'],
            
            // Backpacks
            'small_backpack': ['L07', 'L08', 'L10', 'L11', 'L23'],
            'hiking_backpack': ['L07', 'L08', 'L10', 'L11', 'L12', 'L23'],
            'shopping_bag': ['L06', 'L15', 'L20', 'L23'],
            
            // Weapons
            'baseball_bat': ['L23', 'L26', 'L33'],
            'pepper_spray': ['L10', 'L11', 'L13', 'L20'],
            'bear_spray': ['L10', 'L11', 'L13', 'L23'],
            'air_horn': ['L13', 'L23']
        };
    }

    initializeGuaranteedItems() {
        // Items that MUST spawn (essential for gameplay)
        // Format: { itemId, locations: [array of valid locations], quantity: min-max }
        return [
            // Essential tools (always spawn)
            { itemId: 'hammer', locations: ['L01', 'L13'], quantity: [1, 1] },
            { itemId: 'screwdriver', locations: ['L01', 'L13'], quantity: [1, 1] },
            { itemId: 'wrench', locations: ['L01', 'L13'], quantity: [1, 1] },
            { itemId: 'pliers', locations: ['L01', 'L13'], quantity: [1, 1] },
            { itemId: 'utility_knife', locations: ['L01', 'L13'], quantity: [1, 1] },
            { itemId: 'duct_tape', locations: ['L01', 'L13'], quantity: [1, 1] },
            
            // Essential emergency items
            { itemId: 'flashlight', locations: ['L10', 'L11'], quantity: [1, 1] },
            { itemId: 'batteries', locations: ['L31', 'L10', 'L11'], quantity: [4, 6] },
            { itemId: 'emergency_radio', locations: ['L10', 'L11'], quantity: [1, 1] },
            { itemId: 'first_aid_kit', locations: ['L10', 'L11'], quantity: [1, 1] },
            
            // Essential fire/light
            { itemId: 'candle', locations: ['L04', 'L05'], quantity: [4, 6] },
            { itemId: 'matches', locations: ['L01', 'L31'], quantity: [1, 2] },
            
            // Essential containers
            { itemId: 'empty_bucket', locations: ['L06', 'L15'], quantity: [2, 2] },
            { itemId: 'trash_bags', locations: ['L06', 'L15'], quantity: [1, 2] },
            
            // Essential food (starter survival)
            { itemId: 'canned_beans', locations: ['L04', 'L05', 'L06', 'L07', 'L08', 'L19', 'L23', 'L50'], quantity: [4, 6] },
            { itemId: 'energy_bar', locations: ['L10', 'L11'], quantity: [3, 4] },
            
            // Player starts with phone
            { itemId: 'cell_phone', locations: ['L01'], quantity: [1, 1] }
        ];
    }

    /**
     * 🎲 PLACE ITEMS: Randomly places all items in valid locations
     * 
     * This runs once at game start. It:
     * 1. Places guaranteed items first (essential items)
     * 2. Fills remaining locations with random items
     * 3. Respects location capacities
     * 4. Only places items in their allowed locations
     */
    placeAllItems() {
        // Initialize location contents
        for (const locId in this.locations) {
            this.locations[locId].items = [];
            this.locations[locId].usedCapacity = 0;
        }

        // Step 1: Place guaranteed items (essential items that MUST spawn)
        for (const guaranteed of this.guaranteedItems) {
            const validLocations = guaranteed.locations.filter(locId => 
                this.locations[locId] && 
                this.locations[locId].usedCapacity < this.locations[locId].capacity
            );
            
            if (validLocations.length === 0) {
                console.warn(`No valid location for guaranteed item: ${guaranteed.itemId}`);
                continue;
            }
            
            // Pick random valid location
            const locationId = validLocations[Math.floor(Math.random() * validLocations.length)];
            const quantity = guaranteed.quantity[0] + 
                Math.floor(Math.random() * (guaranteed.quantity[1] - guaranteed.quantity[0] + 1));
            
            this.placeItem(guaranteed.itemId, locationId, quantity);
        }

        // Step 2a: SpawnTable-weighted spawns per location (Scene A)
        const SpawnTable = typeof window !== 'undefined' && window.SpawnTable;
        if (SpawnTable && SpawnTable.A) {
            for (const locId of Object.keys(SpawnTable.A)) {
                const loc = this.locations[locId];
                if (!loc) continue;
                const cfg = SpawnTable.A[locId];
                if (!cfg || !cfg.pool || !cfg.pool.length) continue;
                const rolls = typeof cfg.rolls === 'number' ? cfg.rolls : 0;
                let totalWeight = 0;
                for (let i = 0; i < cfg.pool.length; i++) totalWeight += (cfg.pool[i].w || 0);
                if (totalWeight <= 0) continue;
                const seen = cfg.unique ? {} : null;
                for (let r = 0; r < rolls; r++) {
                    let pick = Math.random() * totalWeight;
                    for (let i = 0; i < cfg.pool.length; i++) {
                        pick -= (cfg.pool[i].w || 0);
                        if (pick <= 0) {
                            const id = cfg.pool[i].id;
                            if (id != null && (!seen || !seen[id])) {
                                if (seen) seen[id] = true;
                                if (loc.usedCapacity < loc.capacity) this.placeItem(id, locId, 1);
                            }
                            break;
                        }
                    }
                }
            }
        }

        // Step 2: Place random items from the item pool
        const allItemIds = Object.keys(this.itemLocationPools);
        const shuffledItems = this.shuffleArray([...allItemIds]);
        
        for (const itemId of shuffledItems) {
            // Skip if already placed as guaranteed
            if (this.guaranteedItems.some(g => g.itemId === itemId)) {
                continue;
            }
            
            const allowedLocations = this.itemLocationPools[itemId];
            if (!allowedLocations || allowedLocations.length === 0) {
                continue; // Item has no valid locations
            }
            
            // Random chance to spawn (not all items spawn every game)
            const spawnChance = this.getItemSpawnChance(itemId);
            if (Math.random() > spawnChance) {
                continue; // Skip this item
            }
            
            // Find locations with space
            const availableLocations = allowedLocations.filter(locId => {
                const loc = this.locations[locId];
                return loc && loc.usedCapacity < loc.capacity;
            });
            
            if (availableLocations.length === 0) {
                continue; // No space for this item
            }
            
            // Pick random location
            const locationId = availableLocations[Math.floor(Math.random() * availableLocations.length)];
            const quantity = this.getItemQuantity(itemId);
            
            this.placeItem(itemId, locationId, quantity);
        }
    }

    placeItem(itemId, locationId, quantity = 1) {
        const location = this.locations[locationId];
        if (!location) {
            console.warn(`Invalid location: ${locationId}`);
            return false;
        }
        
        // Check capacity
        if (location.usedCapacity + quantity > location.capacity) {
            // Try to place what we can
            quantity = location.capacity - location.usedCapacity;
            if (quantity <= 0) return false;
        }
        
        // Create item
        const item = this.itemSystem.createItem(itemId);
        if (!item) {
            console.warn(`Invalid item: ${itemId}`);
            return false;
        }
        
        // Add to location
        if (!location.items) {
            location.items = [];
        }
        
        // If item is stackable, try to stack with existing
        if (item.stackable) {
            const existing = location.items.find(i => i.id === itemId);
            if (existing) {
                const maxStack = item.maxStack || 10;
                const spaceAvailable = maxStack - existing.quantity;
                if (spaceAvailable >= quantity) {
                    existing.quantity += quantity;
                    location.usedCapacity += quantity;
                    return true;
                } else {
                    // Fill existing stack, create new for remainder
                    existing.quantity = maxStack;
                    location.usedCapacity += spaceAvailable;
                    quantity -= spaceAvailable;
                }
            }
        }
        
        // Add new item entry
        item.quantity = quantity;
        location.items.push(item);
        location.usedCapacity += quantity;
        
        return true;
    }

    getItemSpawnChance(itemId) {
        // Some items are rarer than others
        const rarity = {
            // Common items (high spawn chance)
            'candle': 0.9,
            'matches': 0.9,
            'crackers': 0.8,
            'old_rag': 0.8,
            'cardboard': 0.8,
            
            // Uncommon items (medium spawn chance)
            'coffee_filters': 0.5,
            'bleach': 0.4,
            'multitool': 0.3,
            'crowbar': 0.3,
            
            // Rare items (low spawn chance)
            'iodine_tablets': 0.2,
            'whiskey_bottle': 0.15,
            'previous_survivor_note': 0.1,
            'hiking_backpack': 0.2,
            'bear_spray': 0.2,
            'air_horn': 0.15
        };
        
        return rarity[itemId] || 0.6; // Default 60% spawn chance
    }

    getItemQuantity(itemId) {
        // Some items spawn in quantities, others are single
        const quantityRules = {
            'candle': [3, 8],
            'battery': [3, 6],
            'matches': [1, 3],
            'canned_beans': [2, 4],
            'energy_bar': [2, 4],
            'crackers': [1, 2],
            'trash_bags': [1, 2],
            'duct_tape': [1, 2],
            'rope': [1, 2],
            'wire': [1, 3],
            'nails': [5, 15],
            'magazine': [2, 5],
            'book': [1, 3]
        };
        
        const rule = quantityRules[itemId];
        if (rule) {
            return rule[0] + Math.floor(Math.random() * (rule[1] - rule[0] + 1));
        }
        
        return 1; // Default: single item
    }

    shuffleArray(array) {
        // Fisher-Yates shuffle
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Sync location.items from gameState.sceneLoot so overlays and display match.
     */
    syncFromSceneLoot(game) {
        if (!game || !game.gameState || !game.gameState.sceneLoot) return;
        const sceneLoot = game.gameState.sceneLoot;
        const currentScene = game.sceneRenderer ? game.sceneRenderer.currentScene : 'A';
        for (const sceneId of ['A', 'B']) {
            const loot = sceneLoot[sceneId];
            if (!loot) continue;
            for (const locId of Object.keys(loot)) {
                const loc = this.locations[locId];
                if (!loc) continue;
                const ids = loot[locId];
                loc.items = (ids || []).map(id => this.itemSystem.createItem(id)).filter(Boolean);
                loc.usedCapacity = loc.items.length;
            }
        }
    }

    /**
     * Search a location: take items from sceneLoot into the player's inventory and mark location searched.
     * Items are added via game.inventory.addItem; if inventory is full, player gets a message and items stay in scene.
     */
    searchLocation(locationId, game) {
        const location = this.locations[locationId];
        if (!location) {
            return { success: false, message: 'Invalid location' };
        }
        
        if (location.searched) {
            return { success: false, message: 'Already searched this location' };
        }
        
        const sceneLoot = game.gameState && game.gameState.sceneLoot;
        const sceneId = game.sceneRenderer ? game.sceneRenderer.currentScene : 'A';
        const lootIds = sceneLoot && sceneLoot[sceneId] && sceneLoot[sceneId][locationId];
        
        if (lootIds && lootIds.length > 0) {
            location.searched = true;
            const foundItems = [];
            for (const itemId of lootIds) {
                const item = this.itemSystem.createItem(itemId);
                if (item) {
                    const qty = item.quantity || 1;
                    if (game.inventory.addItem(item, qty)) {
                        foundItems.push({ item: item, quantity: qty });
                    } else {
                        if (game.addMessage) game.addMessage('Inventory full! Couldn\'t take ' + (item.name || itemId) + '.');
                    }
                }
            }
            sceneLoot[sceneId][locationId] = [];
            location.items = [];
            location.usedCapacity = 0;
            const itemNames = foundItems.map(f => (f.quantity > 1 ? f.quantity + 'x ' : '') + (f.item.name || f.item.id)).join(', ');
            return {
                success: true,
                items: foundItems,
                message: foundItems.length > 0 ? 'Found: ' + itemNames : 'Found nothing.'
            };
        }
        
        if (!location.items || location.items.length === 0) {
            location.searched = true;
            return { success: true, items: [], message: 'Found nothing.' };
        }
        
        location.searched = true;
        const foundItems = [];
        for (const item of location.items) {
            if (game.inventory.addItem(item, item.quantity || 1)) {
                foundItems.push({ item: item, quantity: item.quantity || 1 });
            } else {
                if (game.addMessage) game.addMessage('Inventory full! Couldn\'t take ' + item.name + '.');
            }
        }
        location.items = [];
        location.usedCapacity = 0;
        const itemNames = foundItems.map(f => (f.quantity > 1 ? f.quantity + 'x ' : '') + f.item.name).join(', ');
        return {
            success: true,
            items: foundItems,
            message: foundItems.length > 0 ? 'Found: ' + itemNames : 'Found nothing.'
        };
    }

    getLocation(locationId) {
        return this.locations[locationId] || null;
    }

    getAllLocations() {
        return this.locations;
    }

    getLocationsByScene(scene) {
        const result = {};
        for (const [id, loc] of Object.entries(this.locations)) {
            if (loc.scene === scene) {
                result[id] = loc;
            }
        }
        return result;
    }

    getState() {
        // Save location states (which have been searched, what items remain)
        const state = {};
        for (const [id, loc] of Object.entries(this.locations)) {
            state[id] = {
                searched: loc.searched,
                items: loc.items ? loc.items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    condition: item.condition
                })) : [],
                usedCapacity: loc.usedCapacity
            };
        }
        return state;
    }

    setState(state) {
        // Load location states
        for (const [id, locData] of Object.entries(state)) {
            if (this.locations[id]) {
                this.locations[id].searched = locData.searched || false;
                this.locations[id].usedCapacity = locData.usedCapacity || 0;
                this.locations[id].items = (locData.items || []).map(itemData => {
                    const item = this.itemSystem.createItem(itemData.id, itemData.condition);
                    if (item) {
                        item.quantity = itemData.quantity || 1;
                    }
                    return item;
                }).filter(item => item !== null);
            }
        }
    }
}
