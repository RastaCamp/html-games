/**
 * 7 DAYS... - INTERACTABLE OBJECTS
 * 
 * 🏠 WHAT IS THIS FILE?
 * This defines all the objects in the basement! Water heater, furnace, boxes, etc.
 * Everything the player can interact with lives here.
 * 
 * 🎯 WHAT IT DOES:
 * - Defines object positions, sizes, colors
 * - Defines what interactions are possible (examine, search, dismantle, etc.)
 * - Populates containers with random items (for replayability)
 * - Handles object interactions
 * 
 * 💡 WANT TO ADD A NEW OBJECT?
 * 1. Add it to initializeObjects() array
 * 2. Set position (x, y), size (width, height), color
 * 3. Add interactions (what can player do with it?)
 * 4. Add emoji for visual clarity
 * 5. Test it!
 * 
 * 🎨 OBJECT PROPERTIES:
 * - id: Unique identifier
 * - name: What players see
 * - x, y: Position on screen
 * - width, height: Size
 * - color: Fill color (hex code)
 * - emoji: Visual icon
 * - description: Flavor text
 * - interactions: Array of possible actions
 * 
 * 🐛 COMMON MISTAKES:
 * - Objects overlapping (can't click the one behind!)
 * - Forgetting to add interactions (object does nothing)
 * - Wrong coordinates (object off-screen)
 */

class InteractableObjects {
    constructor(itemSystem, containerRandomizer = null) {
        this.itemSystem = itemSystem;
        this.containerRandomizer = containerRandomizer;
        this.objects = this.initializeObjects();
        this.randomizeContainerContents();
    }

    randomizeContainerContents() {
        if (!this.containerRandomizer) return;
        
        const randomized = this.containerRandomizer.randomizeAllContainers();
        
        // Update object contents
        for (const obj of this.objects) {
            if (obj.id === 'boxes') {
                obj.contains = randomized.storage_boxes.map(i => i.id);
            } else if (obj.id === 'workbench') {
                obj.contains = randomized.workbench.map(i => i.id);
            } else if (obj.id === 'shelving') {
                obj.contains = randomized.shelving.map(i => i.id);
            } else if (obj.id === 'freezer') {
                obj.contains = randomized.freezer.map(i => i.id);
            }
        }
    }

    initializeObjects() {
        const OFFSET_X = 40;
        const OFFSET_Y = -45;
        return [
            {
                id: 'water_heater',
                name: 'Water Heater',
                x: 818,
                y: 278,
                width: 78,
                height: 158,
                color: '#8B4513',
                emoji: '💧',
                description: 'An old water heater. The drain valve might still have water.',
                interactions: ['examine', 'drain_water', 'dismantle'],
                waterLevel: 50, // Percentage
                dismantled: false
            },
            {
                id: 'furnace',
                name: 'Furnace',
                x: 185,
                y: 300,
                width: 130,
                height: 200,
                color: '#666',
                emoji: '🔥',
                description: 'A gas furnace. Could provide heat, but is it safe?',
                interactions: ['examine', 'use_heat', 'dismantle'],
                hasGas: true,
                dismantled: false
            },
            {
                id: 'sump_pump',
                name: 'Sump Pump',
                x: 28,
                y: 558,
                width: 85,
                height: 85,
                color: '#333',
                emoji: '💧',
                description: 'A sump pump in a pit. Groundwater collects here.',
                interactions: ['examine', 'collect_water', 'dump_waste', 'use_bathroom'],
                waterLevel: 30
            },
            {
                id: 'compost_toilet',
                name: 'Compost Toilet',
                x: 200,
                y: 550,
                width: 50,
                height: 60,
                color: '#8B4513',
                emoji: '🚽',
                description: 'A compost toilet. Better than nothing.',
                interactions: ['examine', 'use_bathroom'],
                isCompostToilet: true
            },
            {
                id: 'bucket',
                name: 'Bucket',
                x: 400,
                y: 550,
                width: 40,
                height: 50,
                color: '#666',
                emoji: '🪣',
                description: 'A 5-gallon bucket. Can be used as a makeshift toilet.',
                interactions: ['examine', 'use_bathroom'],
                isBucket: true
            },
            {
                id: 'floor_drain',
                name: 'Floor Drain',
                x: 588,
                y: 552,
                width: 72,
                height: 72,
                color: '#222',
                emoji: '🕳️',
                description: 'A floor drain. Not ideal, but desperate times... Use for washing with soap and water so it can drain out.',
                interactions: ['examine', 'use_bathroom', 'wash'],
                isFloorDrain: true
            },
            {
                id: 'sink',
                name: 'Shop Sink',
                x: 1138,
                y: 418,
                width: 105,
                height: 95,
                color: '#555',
                emoji: '🚰',
                description: 'A shop sink. Pipes might have trapped water.',
                interactions: ['examine', 'drain_pipes', 'dismantle'],
                hasWater: true
            },
            {
                id: 'workbench',
                name: 'Workbench',
                x: 462,
                y: 398,
                width: 198,
                height: 48,
                color: '#654321',
                emoji: '🛠️',
                description: 'A workbench with tools. Perfect for crafting.',
                interactions: ['examine', 'search', 'craft'],
                contains: ['hammer', 'wrench', 'wire']
            },
            {
                id: 'shelving',
                name: 'Shelving Unit',
                x: 358,
                y: 198,
                width: 125,
                height: 352,
                color: '#444',
                emoji: '📦',
                description: 'Metal shelving. Full of random basement junk.',
                interactions: ['examine', 'search', 'dismantle'],
                searched: false,
                contains: ['cardboard', 'crackers', 'seeds', 'battery']
            },
            {
                id: 'freezer',
                name: 'Old Freezer',
                x: 700,
                y: 350,
                width: 90,
                height: 110,
                color: '#222',
                emoji: '❄️',
                description: 'An old freezer. Might have food, but power is out.',
                interactions: ['examine', 'open', 'search'],
                opened: false,
                contains: ['canned_beans', 'energy_bar']
            },
            {
                id: 'window',
                name: 'Window',
                x: 52,
                y: 82,
                width: 108,
                height: 62,
                color: '#87CEEB',
                emoji: '🪟',
                description: 'A small basement window. Can be opened or boarded up.',
                interactions: ['examine', 'open', 'board_up', 'set_trap'],
                isOpen: false,
                isBoarded: false,
                hasTrap: false
            },
            {
                id: 'door',
                name: 'Door to Closet',
                x: 908,
                y: 238,
                width: 92,
                height: 228,
                color: '#654321',
                emoji: '🚪',
                description: 'Door to the closet room. Old freezer and under-stairs storage are there.',
                interactions: ['examine', 'go_to_closet', 'listen'],
                barricaded: false
            },
            {
                id: 'electrical_panel',
                name: 'Electrical Panel',
                x: 95,
                y: 378,
                width: 78,
                height: 125,
                color: '#FFD700',
                emoji: '⚡',
                description: 'The electrical panel. Dangerous if wet.',
                interactions: ['examine', 'open', 'flip_breaker'],
                isOpen: false,
                hasPower: false
            },
            {
                id: 'boxes',
                name: 'Cardboard Boxes',
                x: 328,
                y: 252,
                width: 118,
                height: 38,
                color: '#8B4513',
                emoji: '📦',
                description: 'Stack of cardboard boxes. Can be broken down.',
                interactions: ['examine', 'search', 'break_down'],
                searched: false,
                contains: ['cardboard', 'cloth', 'candle']
            }
        ].map(o => ({ ...o, x: o.x + OFFSET_X, y: o.y + OFFSET_Y }));
    }

    getObject(id) {
        return this.objects.find(obj => obj.id === id);
    }

    getObjectAt(x, y) {
        for (const obj of this.objects) {
            if (x >= obj.x && x <= obj.x + obj.width &&
                y >= obj.y && y <= obj.y + obj.height) {
                return obj;
            }
        }
        return null;
    }

    interact(objectId, action, game) {
        const obj = this.getObject(objectId);
        if (!obj) return { success: false, message: 'Object not found' };

        switch (action) {
            case 'examine':
                // Play examine sound (subtle, not too loud)
                if (window.audioSystem) {
                    window.audioSystem.playSound('click', 0.3);
                }
                return { success: true, message: obj.description, object: obj };
            
            case 'drain_water':
                if (obj.id === 'water_heater' && obj.waterLevel > 0) {
                    const container = game.inventory.getItem('bucket') || game.inventory.getItem('bottle');
                    if (container) {
                        const water = game.itemSystem.createItem('water');
                        if (game.inventory.addItem(water, container.capacity || 1)) {
                            obj.waterLevel -= 20;
                            // Track action
                            if (game.actionTracker) {
                                game.actionTracker.recordAction('water_running');
                                setTimeout(() => {
                                    game.actionTracker.recordAction('water_stopped');
                                }, 5000);
                            }
                            // Check achievement
                            if (game.achievements) {
                                game.achievements.checkAchievement('plumbers_special', game);
                            }
                            return { success: true, message: 'Collected water from heater!' };
                        }
                    }
                    return { success: false, message: 'Need a container to collect water' };
                }
                return { success: false, message: 'No water available' };
            
            case 'search':
                if (obj.contains && !obj.searched) {
                    obj.searched = true;
                    const foundNames = [];
                    for (const itemId of obj.contains) {
                        const item = game.itemSystem.createItem(itemId);
                        if (item) {
                            const quantity = 1;
                            if (game.inventory.addItem(item, quantity)) {
                                foundNames.push(quantity > 1 ? `${quantity}x ${item.name}` : item.name);
                            }
                        }
                    }
                    if (foundNames.length > 0) {
                        if (window.audioSystem) window.audioSystem.playSound('open_loot');
                        return { success: true, message: `Found in ${obj.name}: ${foundNames.join(', ')}.` };
                    }
                    if (window.audioSystem) window.audioSystem.playSound('negative');
                    return { success: false, message: 'Found nothing useful.' };
                }
                if (window.audioSystem) window.audioSystem.playSound('locked');
                return { success: false, message: 'Nothing found or already searched.' };
            
            case 'break_down':
                if (obj.id === 'boxes') {
                    const cardboard = game.itemSystem.createItem('cardboard');
                    game.inventory.addItem(cardboard, 5);
                    return { success: true, message: 'Broke down boxes into cardboard!' };
                }
                return { success: false, message: 'Cannot break down this object' };
            
            case 'collect_water':
                if (obj.id === 'sump_pump' && obj.waterLevel > 0) {
                    const container = game.inventory.getItem('bucket') || game.inventory.getItem('bottle');
                    if (container) {
                        const water = game.itemSystem.createItem('water');
                        if (game.inventory.addItem(water, container.capacity || 1)) {
                            obj.waterLevel -= 10;
                            return { success: true, message: 'Collected grey water (needs purification)' };
                        }
                    }
                    return { success: false, message: 'Need a container' };
                }
                return { success: false, message: 'No water available' };
            
            case 'dump_waste':
                if (obj.id === 'sump_pump') {
                    if (game.actionTracker) {
                        game.actionTracker.recordAction('waste_dump_sump');
                    }
                    game.meters.adjustHygiene(10);
                    return { success: true, message: 'Dumped waste in sump pump. Smell may attract attention...' };
                }
                return { success: false, message: 'Cannot dump waste here' };
            
            case 'open':
                if (obj.id === 'window') {
                    if (!obj.isBoarded) {
                        obj.isOpen = true;
                        if (game.actionTracker) {
                            game.actionTracker.recordAction('window_open');
                        }
                        return { success: true, message: 'Window opened. Be careful at night!' };
                    }
                    return { success: false, message: 'Window is boarded up' };
                }
                return { success: false, message: 'Cannot open this' };
            
            case 'board_up':
                if (obj.id === 'window') {
                    if (game.inventory.hasItem('wood', 3)) {
                        obj.isBoarded = true;
                        obj.isOpen = false;
                        game.inventory.removeItem('wood', 3);
                        if (game.actionTracker) {
                            game.actionTracker.recordAction('window_board');
                            game.actionTracker.recordAction('hammering');
                        }
                        return { success: true, message: 'Window boarded up. More secure now.' };
                    }
                    return { success: false, message: 'Need 3 wood to board up window' };
                }
                return { success: false, message: 'Cannot board this up' };
            
            case 'use_heat':
                if (obj.id === 'furnace' && obj.hasGas) {
                    if (game.actionTracker) {
                        game.actionTracker.recordAction('fire_lit', { ventilation: true });
                    }
                    return { success: true, message: 'Furnace provides heat. Gas is limited.' };
                }
                return { success: false, message: 'Furnace has no gas' };
            
            case 'use_bathroom':
                // Player uses compost toilet, bucket, or floor drain
                if (obj.id === 'compost_toilet' || obj.id === 'bucket' || obj.id === 'floor_drain' || obj.id === 'sump_pump') {
                    const method = obj.id === 'compost_toilet' ? 'compost_toilet' : 
                                  obj.id === 'bucket' ? 'bucket' : 
                                  obj.id === 'sump_pump' ? 'sump' : 'floor_drain';
                    const result = game.meters.useBathroom(method, game);
                    
                    // Play animation
                    if (game.characterRenderer) {
                        const direction = obj.x < 640 ? 'left' : 'right'; // Face the object
                        game.characterRenderer.setAnimation('reach_low', direction, 2000);
                    }
                    
                    // Play proceed sound (action confirmation)
                    if (window.audioSystem && result.success) {
                        window.audioSystem.playSound('proceed');
                    }
                    
                    return result;
                }
                if (window.audioSystem) window.audioSystem.playSound('no');
                return { success: false, message: 'Cannot use this as a bathroom' };
            
            case 'wash':
                // Soap and water with rag at the drain (so it can drain out)
                if (obj.id !== 'floor_drain') {
                    return { success: false, message: 'You can only wash at the floor drain.' };
                }
                if (!game.inventory.hasItem('old_rag', 1)) {
                    return { success: false, message: 'You need an old rag to wash.' };
                }
                const hasWater = game.inventory.hasItem('water', 1) || game.inventory.hasItem('purified_water', 1) || game.inventory.hasItem('rainwater', 1);
                if (!hasWater) {
                    return { success: false, message: 'You need water. Use the drain so it can drain out.' };
                }
                // Consume 1 water (prefer water, then purified_water, then rainwater)
                if (game.inventory.hasItem('water', 1)) {
                    game.inventory.removeItem('water', 1);
                } else if (game.inventory.hasItem('purified_water', 1)) {
                    game.inventory.removeItem('purified_water', 1);
                } else {
                    game.inventory.removeItem('rainwater', 1);
                }
                if (game.inventory.hasItem('soap', 1)) {
                    game.inventory.removeItem('soap', 1);
                }
                const washResult = game.meters.performHygieneAction('soap_water_rag');
                if (window.audioSystem && washResult.success) window.audioSystem.playSound('proceed');
                return washResult;
            
            case 'go_to_closet':
                if (obj.id !== 'door') return { success: false, message: 'You can\'t go that way.' };
                if (game.sceneRenderer) {
                    game.sceneRenderer.setScene('B', 'closet');
                    game.sceneRenderer.setLightsOn(false); // closet with no lights as requested
                }
                if (window.audioSystem) window.audioSystem.playSound('proceed');
                return { success: true, message: 'You enter the closet room. Old freezer and under-stairs storage are here. Click the left side of the screen to return to the main room.' };
            
            default:
                return { success: false, message: 'Unknown action' };
        }
    }

    getState() {
        return {
            objects: JSON.parse(JSON.stringify(this.objects))
        };
    }

    setState(state) {
        this.objects = state.objects || this.initializeObjects();
    }
}
