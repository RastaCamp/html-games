/**
 * 7 DAYS... - MAIN GAME CLASS
 *
 * Entry point for game logic. Creates systems (meters, inventory, scene, character),
 * runs the game loop (update + render), and handles game over and death position.
 *
 * KEY SECTIONS:
 * - constructor(): Create Renderer, SceneRenderer, LocationSystem, Inventory, MeterSystem, etc.
 * - update(deltaTime): Update day cycle, meters, movement (updateMoveToTarget), check game over.
 * - render(): Draw scene (SceneRenderer with character/flashlight) and update UI.
 * - handleGameOver(): Store death position, stop loop, show DeathScreen.
 *
 * REST/SLEEP: Rest button (main.js) opens Nap/Full sleep; best surface from inventory
 * (sleeping_bag > makeshift_bedding > cardboard > floor). SceneRenderer draws sleep.PNG when sleeping.
 *
 * DOCS: Unused project files (Godot projects, guides) live in extras/ at project root.
 */

class Game {
    constructor(canvas) {
        // 🎬 SETUP PHASE: This runs ONCE when the game starts
        // Think of it as "setting up the stage" before the play begins
        
        this.canvas = canvas;
        this.logicalWidth = canvas.logicalWidth ?? 1280;
        this.logicalHeight = canvas.logicalHeight ?? 720;
        this.renderer = new Renderer(canvas); // Draws stuff on screen
        this.sceneRenderer = new SceneRenderer(canvas); // Draws detailed scene maps
        this.sceneRenderer.setScene('A'); // Start with Scene A (Main Basement)
        this.itemSystem = new ItemSystem(); // Knows about all items
        this.locationSystem = new LocationSystem(this.itemSystem); // Manages item placement in locations
        this.inventory = new Inventory(20);
        this.meters = new MeterSystem();
        this.dayCycle = new DayCycle();
        this.gameState = new GameState();
        this.craftingSystem = new CraftingSystem(this.itemSystem);
        this.events = new EventSystem();
        this.containerRandomizer = new ContainerRandomizer(this.itemSystem);
        this.interactables = new InteractableObjects(this.itemSystem, this.containerRandomizer);
        this.saveSystem = new SaveSystem();
        this.achievements = new AchievementSystem(this.tipJar);
        this.deathMarkerSystem = new DeathMarkerSystem();
        this.tipJar = new TipJarSystem();
        this.deathScreen = new DeathScreen(this.deathMarkerSystem);
        this.endingSequence = new EndingSequence();
        this.actionTracker = new ActionTracker();
        this.attractionSystem = new AttractionSystem();
        // Use global weather system if available, otherwise create new
        this.weatherSystem = window.weatherSystem || new WeatherSystem();
        this.temperatureSystem = new TemperatureSystem(this.weatherSystem);
        this.equipSystem = typeof EquipSystem !== 'undefined' ? new EquipSystem() : null;
        this.combatSystem = new CombatSystem();
        this.fireSystem = new FireSystem();
        
        // Initialize weather for first day
        if (!this.weatherSystem.currentWeather) {
            this.weatherSystem.rollDailyWeather();
        }
        
        // Extraction timer
        this.extractionTime = null; // Set on Day 7
        this.extractionMissed = false;
        
        // Load game speed from settings
        const settings = this.loadSettings();
        if (settings.gameSpeed) {
            this.dayCycle.setGameSpeed(settings.gameSpeed);
        }
        
        // New systems
        this.luckSystem = new LuckSystem();
        this.decaySystem = new DecaySystem();
        this.moldSystem = new MoldSystem();
        this.pestSystem = new PestSystem();
        this.structuralDamageSystem = new StructuralDamageSystem();
        this.previousSurvivorSystem = new PreviousSurvivorSystem();
        this.previousSurvivorSystem.initialize();
        this.rabbitMinigame = new RabbitMinigame();
        this.desensitizationSystem = new DesensitizationSystem();
        
        // Character renderer for animations
        this.characterRenderer = null; // Will be initialized if CharacterRenderer exists
        if (typeof CharacterRenderer !== 'undefined') {
            this.characterRenderer = new CharacterRenderer();
            this.characterRenderer.loadSprites();
        }
        
        // 📝 TRACKING VARIABLES: Keep track of game state
        this.messages = []; // Message log (what the player sees)
        this.lastFrameTime = Date.now(); // For calculating time between frames
        this.isRunning = false; // Is the game loop running?
        this.craftingSlots = []; // Items currently in crafting panel
        
        // 🏆 ACHIEVEMENT TRACKING: Prevent giving same tip/achievement twice
        this.firstCraft = true;
        this.radioListenCount = 0;
        this.day3TipAwarded = false;
        this.day5TipAwarded = false;
        this.day7TipAwarded = false;
        this.firstHotMeal = false;
        this.firstFire = false;
        this.firstMouse = false;
        this.firstRabbit = false;
        this.firstMongrel = false;
        this.firstMarauder = false;
        this.firstRadio = false;
        this.firstBoardGame = false;
        this.firstFix = false;
        this.firstDismantle = false;
        this.firstCleanWater = false;
        this.endingTriggered = false;
        this.moveTargetX = null;
        this.moveTargetY = null;
        this.moveTargetObject = null;
        this.moveSpeed = 280; // pixels per second
        this.showHitboxCalibration = false; // H toggles hitbox overlay (yellow zones) when needed
        this.calibrationMouseX = 0;
        this.calibrationMouseY = 0;
        this.adamMinY = 360; // Adam cannot move above halfway (bottom-half playable area only)
        this.adamMaxY = 720;
        
        // Initialize events
        this.events.events = this.events.initializeEvents();
        this.events.conditionalEvents = this.events.initializeConditionalEvents();
        
        // Build sceneLoot via weighted SpawnTable, then sync to location.items
        this.gameState.sceneLoot = { A: {}, B: {} };
        this.generateInitialSpawns('A');
        this.generateInitialSpawns('B');
        this.addGuaranteedToSceneLoot();
        this.locationSystem.syncFromSceneLoot(this);
        
        // Give starting items (from emergency kit, etc.)
        this.initializeStartingItems();
        
        // Start background music (only *track* files rotate as in-game music)
        if (window.audioSystem) {
            if (window.audioSystem.playRandomTrack) {
                window.audioSystem.playRandomTrack();
            } else {
                window.audioSystem.playMusic('crunk_track', true);
            }
        }
        
        // Initialize scene based on day/night
        this.updateSceneLighting();
    }
    
    /**
     * 🗺 GENERATE INITIAL SPAWNS: Weighted spawns per location from SpawnTable.
     * Writes to gameState.sceneLoot[sceneId][locId] = [itemId, ...].
     * "unique" option prevents multiple of same item in one location (e.g. no 3 hammers).
     */
    generateInitialSpawns(sceneId) {
        const SpawnTable = typeof window !== 'undefined' && window.SpawnTable;
        if (!SpawnTable || !SpawnTable[sceneId]) return;
        const sceneLoot = this.gameState.sceneLoot;
        if (!sceneLoot[sceneId]) sceneLoot[sceneId] = {};
        for (const locId of Object.keys(SpawnTable[sceneId])) {
            const cfg = SpawnTable[sceneId][locId];
            if (!cfg || !cfg.pool || !cfg.pool.length) continue;
            const rolls = typeof cfg.rolls === 'number' ? cfg.rolls : 0;
            let totalWeight = 0;
            for (let i = 0; i < cfg.pool.length; i++) totalWeight += (cfg.pool[i].w || 0);
            if (totalWeight <= 0) continue;
            const list = [];
            const seen = cfg.unique ? {} : null;
            for (let r = 0; r < rolls; r++) {
                let pick = Math.random() * totalWeight;
                for (let i = 0; i < cfg.pool.length; i++) {
                    pick -= (cfg.pool[i].w || 0);
                    if (pick <= 0) {
                        const id = cfg.pool[i].id;
                        if (id != null && (!seen || !seen[id])) {
                            if (seen) seen[id] = true;
                            list.push(id);
                        }
                        break;
                    }
                }
            }
            if (list.length) sceneLoot[sceneId][locId] = list;
        }
    }

    /**
     * Add guaranteed items (hammer, flashlight, etc.) into sceneLoot at random valid locations.
     */
    addGuaranteedToSceneLoot() {
        const sceneLoot = this.gameState.sceneLoot;
        const guaranteed = this.locationSystem.guaranteedItems || [];
        for (const g of guaranteed) {
            const validLocations = (g.locations || []).filter(locId => {
                const loc = this.locationSystem.locations[locId];
                return loc && loc.scene;
            });
            if (!validLocations.length) continue;
            const locId = validLocations[Math.floor(Math.random() * validLocations.length)];
            const sceneId = this.locationSystem.locations[locId].scene;
            if (!sceneLoot[sceneId]) sceneLoot[sceneId] = {};
            if (!sceneLoot[sceneId][locId]) sceneLoot[sceneId][locId] = [];
            const qty = Array.isArray(g.quantity)
                ? (g.quantity[0] + Math.floor(Math.random() * ((g.quantity[1] || g.quantity[0]) - g.quantity[0] + 1)))
                : 1;
            for (let i = 0; i < qty; i++) sceneLoot[sceneId][locId].push(g.itemId);
        }
    }

    /**
     * 🎨 UPDATE SCENE LIGHTING: Update scene image based on day/night and lights
     */
    updateSceneLighting() {
        const isDay = this.dayCycle.getTimeOfDay() === 'Morning' || 
                     this.dayCycle.getTimeOfDay() === 'Afternoon';
        const lightsOn = this.hasLightsOn(); // Check if generator/lights are on
        
        this.sceneRenderer.setDayNight(isDay);
        this.sceneRenderer.setLightsOn(lightsOn);
    }
    
    /**
     * 🔌 HAS LIGHTS ON: Check if generator or lights are powered
     */
    hasLightsOn() {
        // TODO: Check if generator is running or lights are on
        // For now, return false (lights off by default)
        return false;
    }

    initializeStartingItems() {
        // Give essential starting items from emergency kit location (L10 or L11)
        // These are items the player "finds immediately" - like they had an emergency kit
        const emergencyKitLocations = ['L10', 'L11'];
        for (const locId of emergencyKitLocations) {
            const location = this.locationSystem.getLocation(locId);
            if (location && location.items && location.items.length > 0) {
                // Auto-search emergency kit locations (player starts with these)
                const result = this.locationSystem.searchLocation(locId, this);
                if (result.success && result.items.length > 0) {
                    this.addMessage('You found your emergency kit!');
                }
            }
        }
        
        // Also give player their phone (they always have it)
        const phone = this.itemSystem.createItem('cell_phone');
        if (phone) {
            this.inventory.addItem(phone, 1);
        }
        // Starting clothes: short sleeve shirt, jean pants, socks, shoes (equip so warmth works)
        if (this.equipSystem) {
            const startingClothes = [
                { id: 'short_sleeve_shirt', slot: 'torso' },
                { id: 'jean_pants', slot: 'legs' },
                { id: 'socks', slot: 'socks' },
                { id: 'shoes', slot: 'shoes' }
            ];
            for (const c of startingClothes) {
                const item = this.itemSystem.createItem(c.id);
                if (item && this.inventory.addItem(item, 1)) {
                    this.equipSystem.equip(c.id, c.slot);
                }
            }
        }
    }

    async start() {
        if (this.characterRenderer && typeof this.characterRenderer.loadSprites === 'function') {
            await this.characterRenderer.loadSprites();
        }
        this.isRunning = true;
        this.gameStartTime = Date.now();
        this.lastFrameTime = Date.now() - 17; // so first frame has ~17ms delta and meters/time advance
        if (this.gameState) this.gameState.isPaused = false;
        if (this.characterRenderer) {
            this.characterRenderer.currentDirection = Math.random() < 0.5 ? 'left' : 'right';
            this.characterRenderer.setAnimation('idle', this.characterRenderer.currentDirection, 0);
        }
        this.updateUI();
        this.render();
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
    }

    /**
     * 🎬 THE GAME LOOP: The heartbeat of the game
     * 
     * This runs 60 times per second (or as fast as the browser can handle).
     * It's like a flipbook - each frame is a new picture, and when you flip
     * through them fast, you get animation!
     * 
     * ⚠️ WARNING: Don't put heavy calculations here. It runs CONSTANTLY.
     * If you need to do something expensive, do it once and cache the result.
     */
    gameLoop() {
        if (!this.isRunning) return; // Game stopped? Don't do anything.

        // ⏱️ Calculate how much time passed since last frame
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = currentTime;

        // 🎮 Update game state (only if not paused and not dead)
        if (!this.gameState.isPaused && !this.gameState.isGameOver) {
            this.update(deltaTime); // Update everything
        }

        // 🎨 Draw everything on screen (try-catch so a render error doesn't stop the loop; movement keeps working)
        try {
            this.render();
        } catch (e) {
            console.warn('Render error:', e);
        }
        requestAnimationFrame(() => this.gameLoop());
    }

    update(deltaTime) {
        // Update systems
        this.gameState.update(deltaTime);
        this.dayCycle.update(deltaTime);
        
        // Roll weather at start of each day
        if (this.dayCycle.dayTime < deltaTime) {
            this.weatherSystem.rollDailyWeather();
        }
        
        // Update temperature system
        this.temperatureSystem.update(this);
        
        // Update meters: use GAME time so drain rates (per game hour) work correctly
        const gameSec = deltaTime * (this.dayCycle.realTimeToGameTime || 72);
        this.meters.update(gameSec, this);
        // Sync Rest button label and panel (Rest vs Sleeping... / Wake up) each frame.
        if (typeof window.updateRestButton === 'function') window.updateRestButton(this.meters.isSleeping);

        // Update fire system
        this.fireSystem.update(deltaTime, this);
        
        // Update new systems
        this.decaySystem.update(deltaTime, this);
        this.moldSystem.update(deltaTime, this);
        this.pestSystem.update(deltaTime, this);
        this.structuralDamageSystem.update(deltaTime, this);
        
        // Check extraction timer
        this.checkExtractionTimer();
        
        // Update extraction countdown display
        this.updateExtractionCountdown();
        
        // Check for sleep events if sleeping
        if (this.meters.isSleeping && Math.random() < 0.01 * deltaTime) {
            this.checkSleepEvent(false);
        }
        
        // Apply caffeine crash if timer expired
        if (this.meters.caffeineCrash && this.meters.caffeineCrashTimer <= 0) {
            this.meters.fatigue.value = Math.min(100, this.meters.fatigue.value + (this.meters.caffeineCrashFatigue || 10));
            this.meters.caffeineCrash = false;
            this.addMessage('The caffeine crash hits. You feel exhausted.');
        }
        
        // Apply whiskey thirst multiplier
        if (this.meters.whiskeyThirstTimer > 0) {
            this.meters.whiskeyThirstTimer -= deltaTime / 3600;
            if (this.meters.whiskeyThirstTimer <= 0) {
                this.meters.whiskeyThirstMultiplier = 1.0;
            }
        }
        
        this.actionTracker.update(this);
        this.attractionSystem.update(this.actionTracker.getActions(), this);
        this.events.update(this);
        if (this.characterRenderer) this.characterRenderer.update(deltaTime);
        this.updateMoveToTarget(deltaTime);
        if (this.examineReturnToIdleAt && Date.now() >= this.examineReturnToIdleAt) {
            this.examineReturnToIdleAt = null;
            if (this.characterRenderer) this.characterRenderer.setAnimation('idle', this.characterRenderer.currentDirection, 0);
        }
        
        // Sync GameState day with DayCycle so checkGameOver uses correct day
        this.gameState.currentDay = this.dayCycle.currentDay;

        // Only check game over / ending after game has been running at least 2 seconds (avoid false triggers on load)
        const runTime = (this.gameStartTime ? (Date.now() - this.gameStartTime) : 0) / 1000;
        if (runTime >= 2) {
            // Check game over
            if (this.gameState.checkGameOver(this.meters)) {
                this.addMessage(this.gameState.gameOverReason);
                this.handleGameOver();
                return;
            }
            // Check for Day 7 ending (only when actually on day 7 evening)
            if (this.dayCycle.currentDay === 7 && this.dayCycle.getTimeOfDay() === 'Evening') {
                if (!this.endingTriggered) {
                    this.endingTriggered = true;
                    if (window.audioSystem) window.audioSystem.playSound('survived_end');
                    this.triggerEnding();
                }
            }
        }
        
        // Award tips for day milestones and play day completion sound
        if (this.tipJar) {
            const currentDay = this.dayCycle.currentDay;
            if (currentDay === 3 && !this.day3TipAwarded) {
                this.tipJar.earnTip('day3_survived');
                this.day3TipAwarded = true;
                if (window.audioSystem) window.audioSystem.playSound('survived_day');
            }
            if (currentDay === 5 && !this.day5TipAwarded) {
                this.tipJar.earnTip('day5_survived');
                this.day5TipAwarded = true;
                if (window.audioSystem) window.audioSystem.playSound('survived_day');
            }
            if (currentDay === 7 && !this.day7TipAwarded) {
                this.tipJar.earnTip('day7_survived');
                this.day7TipAwarded = true;
                if (window.audioSystem) window.audioSystem.playSound('survived_end');
            }
        }
        
        this.updateSceneLighting();
        this.updateUI();
    }

    render() {
        // Use SceneRenderer if available (new two-layer scene system)
        if (this.sceneRenderer) {
            // Update item overlays from location system
            if (this.locationSystem) {
                this.sceneRenderer.setItemOverlays(this.locationSystem);
            }
            
            // Character position is set by click-to-move or stays at current spot (do not follow mouse)
            if (this.characterRenderer && this.flashlightSystem) {
                this.flashlightSystem.setCharacterPosition(
                    this.characterRenderer.characterX,
                    this.characterRenderer.characterY,
                    this.characterRenderer.currentDirection
                );
            }
            
            // Render the scene (background image + character + flashlight + item overlays)
            this.sceneRenderer.render(this.flashlightSystem, this.characterRenderer, this);
            
            // Keep UI in sync every frame (meters, time) so they update when game runs
            this.updateUI();
            // Note: Night filter is handled inside SceneRenderer for flashlight mode
        } else {
            // Fallback to old renderer
            this.renderer.render(this);
        }
    }

    updateUI() {
        // Update meters
        this.updateMeter('health', this.meters.health);
        this.updateMeter('hydration', this.meters.hydration);
        this.updateMeter('hunger', this.meters.hunger);
        this.updateMeter('morale', this.meters.morale);
        this.updateMeter('hygiene', this.meters.hygiene);
        this.updateMeter('fatigue', this.meters.fatigue);
        this.updateMeter('bathroom', this.meters.bathroom);
        this.updateMeter('bodyHeat', this.meters.bodyHeat);
        this.updateMeter('sicknessLevel', this.meters.sicknessLevel);
        this.updateFatigueStatus();
        
        // Update sickness indicator
        const sicknessEl = document.getElementById('sickness-indicator');
        if (sicknessEl) {
            if (this.meters.sickness) {
                sicknessEl.classList.remove('hidden');
            } else {
                sicknessEl.classList.add('hidden');
            }
        }
        
        // Update day counter
        const dayEl = document.getElementById('day-number');
        if (dayEl) {
            dayEl.textContent = this.dayCycle.currentDay;
        }
        
        // Update time display
        const timeEl = document.getElementById('time-text');
        if (timeEl) {
            timeEl.textContent = this.dayCycle.getTimeOfDay();
        }
        const gameTimeEl = document.getElementById('game-time-text');
        if (gameTimeEl) {
            gameTimeEl.textContent = this.dayCycle.getGameTime();
        }
        
        // Update weather display
        this.updateWeatherDisplay();
        
        // Update attraction indicator
        this.updateAttractionIndicator();
        
        // Update equip panel (what's worn; take off if too hot)
        this.updateEquipDisplay();
        
        // Update inventory display
        this.updateInventoryDisplay();
        
        // Update message log
        this.updateMessageLog();
    }

    updateEquipDisplay() {
        const container = document.getElementById('equip-slots');
        if (!container || !this.equipSystem) return;
        const slotLabels = { head: 'Head', scarf: 'Scarf', torso: 'Torso', hands: 'Hands', legs: 'Legs', socks: 'Socks', shoes: 'Shoes' };
        let html = '';
        for (const [slot, itemId] of Object.entries(this.equipSystem.slots)) {
            const label = slotLabels[slot] || slot;
            const item = itemId && this.itemSystem ? this.itemSystem.createItem(itemId) : null;
            const name = item ? (item.name || itemId) : '—';
            const hasItem = !!itemId;
            html += `<div class="equip-slot-row" data-slot="${slot}"><span class="equip-slot-label">${label}:</span> <span class="equip-slot-name">${name}</span>${hasItem ? ` <button type="button" class="equip-take-off" data-slot="${slot}">Take off</button>` : ''}</div>`;
        }
        container.innerHTML = html;
        container.querySelectorAll('.equip-take-off').forEach(btn => {
            btn.onclick = () => {
                const slot = btn.dataset.slot;
                const itemId = this.equipSystem.unequip(slot);
                if (itemId) this.addMessage('Took off ' + (this.itemSystem.createItem(itemId)?.name || itemId) + '.');
            };
        });
    }

    updateMeter(name, meter) {
        if (!meter || typeof meter.value !== 'number') return;
        const fillEl = document.getElementById(name + '-bar');
        const valueEl = document.getElementById(name + '-value');
        const max = meter.max || 100;
        const val = Math.max(0, Math.min(max, meter.value));
        const pct = max > 0 ? val / max : 0;
        // Bar: set CSS variable on container so fill width matches the numbers
        if (fillEl && fillEl.parentElement) {
            fillEl.parentElement.style.setProperty('--meter-pct', pct);
        }
        if (valueEl) {
            valueEl.textContent = Math.floor(val) + '/' + max;
        }
    }

    updateInventoryDisplay() {
        const gridEl = document.getElementById('inventory-grid');
        if (!gridEl) return;
        
        gridEl.innerHTML = '';
        const maxSlots = this.inventory.getMaxSlots ? this.inventory.getMaxSlots() : this.inventory.maxSlots;
        
        for (let i = 0; i < maxSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            if (this.inventory.selectedSlot === i) slot.classList.add('selected');
            
            if (i < this.inventory.items.length) {
                const item = this.inventory.items[i];
                slot.classList.remove('empty');
                const emoji = item.icon || item.emoji || '❓';
                slot.innerHTML = `
                    <div class="item-emoji">${emoji}</div>
                    ${item.quantity > 1 ? `<div class="item-count">${item.quantity}</div>` : ''}
                `;
                slot.title = `${item.name || item.id}${item.condition ? ` (${item.condition})` : ''} — click to examine, double-click to use`;
                const slotIndex = i;
                let lastClick = 0;
                let lastSlot = -1;
                slot.addEventListener('click', () => {
                    const now = Date.now();
                    const isDouble = (now - lastClick < 400) && (lastSlot === slotIndex);
                    lastClick = now;
                    lastSlot = slotIndex;
                    if (isDouble) {
                        if (this.tryUseItem(item)) {
                            this.closeExaminePanel();
                        } else {
                            this.inventory.selectedSlot = slotIndex;
                            this.examineItem(item);
                        }
                    } else {
                        this.inventory.selectedSlot = slotIndex;
                        this.examineItem(item);
                    }
                    this.updateInventoryDisplay();
                });
            } else {
                slot.classList.add('empty');
            }
            
            gridEl.appendChild(slot);
        }
    }

    updateMessageLog() {
        const logEl = document.getElementById('message-content');
        if (!logEl) return;
        logEl.innerHTML = '';
        const recentMessages = this.messages.slice(-5).reverse(); // Latest on top
        for (const msg of recentMessages) {
            const msgEl = document.createElement('div');
            msgEl.className = 'message';
            msgEl.textContent = msg;
            logEl.appendChild(msgEl);
        }
    }

    addMessage(text) {
        this.messages.push(text);
        if (this.messages.length > 50) {
            this.messages.shift(); // Keep only last 50 messages
        }
        this.updateMessageLog();
        
        // Play audio based on message content
        this.playMessageAudio(text);
    }
    
    playMessageAudio(text) {
        // 🔊 PLAY MESSAGE AUDIO: Play appropriate sound based on message content
        if (!window.audioSystem) return;
        
        const lowerText = text.toLowerCase();
        
        // Danger/warning messages
        if (lowerText.includes('danger') || lowerText.includes('urgent') || 
            lowerText.includes('mongrel') || lowerText.includes('marauder') ||
            lowerText.includes('threat') || lowerText.includes('warning')) {
            window.audioSystem.playSound('danger');
        }
        // Success/positive messages
        else if (lowerText.includes('success') || lowerText.includes('achievement') ||
                 lowerText.includes('unlocked') || lowerText.includes('perfect') ||
                 lowerText.includes('excellent') || lowerText.includes('great job')) {
            window.audioSystem.playSound('positive');
        }
        // Failure/negative messages
        else if (lowerText.includes('failed') || lowerText.includes('can\'t') || 
                 lowerText.includes('cannot') || lowerText.includes('error') || 
                 lowerText.includes('wrong')) {
            window.audioSystem.playSound('negative');
        }
    }

    /**
     * Try to use an item directly (eat, drink, use medicine, wipes, sanitizer, etc.).
     * @returns {boolean} true if the item was used, false if not useable or failed.
     */
    tryUseItem(item) {
        if (!item || this.gameState.isPaused || this.gameState.isGameOver) return false;
        if (item.type === 'food') {
            if (!this.inventory.hasItem(item.id, 1, item.condition)) return false;
            this.consumeFood(item);
            this.updateInventoryDisplay();
            return true;
        }
        if (item.type === 'consumable' && (item.hydration != null || item.id === 'water' || item.id === 'purified_water' || item.id === 'rainwater')) {
            if (!this.inventory.hasItem(item.id, 1)) return false;
            this.consumeWater(item);
            this.updateInventoryDisplay();
            return true;
        }
        if (item.id === 'medicine' && this.meters.sickness) {
            if (!this.inventory.hasItem('medicine', 1)) return false;
            this.useMedicine();
            this.updateInventoryDisplay();
            return true;
        }
        if (item.id === 'baby_wipes' && item.quantity > 0) {
            const result = this.meters.performHygieneAction('baby_wipes');
            if (result.success) {
                this.inventory.removeItem('baby_wipes', 1);
                this.addMessage(result.message);
                this.updateInventoryDisplay();
                return true;
            }
        }
        if (item.id === 'hand_sanitizer' && item.quantity > 0) {
            const result = this.meters.useSanitizer(this);
            if (result.success) {
                this.inventory.removeItem('hand_sanitizer', 1);
                this.addMessage(result.message);
                this.updateInventoryDisplay();
                return true;
            }
        }
        if (item.id === 'whiskey_bottle' && item.quantity > 0) {
            if (!this.inventory.hasItem(item.id, 1)) return false;
            this.drinkWhiskey(item);
            this.updateInventoryDisplay();
            return true;
        }
        if (item.id === 'coffee' || item.id === 'energy_drink' || item.id === 'caffeine_pills') {
            if (!this.inventory.hasItem(item.id, 1)) return false;
            this.consumeCaffeine(item);
            this.updateInventoryDisplay();
            return true;
        }
        return false;
    }

    /** Close the item-examine panel and clear selected inventory slot. */
    closeExaminePanel() {
        const examineEl = document.getElementById('item-examine');
        if (examineEl) examineEl.classList.add('hidden');
        this.inventory.selectedSlot = null;
        this.updateInventoryDisplay();
    }

    /**
     * Open the examine panel for an inventory item: show name, description, and actions (Eat, Drink, Use, Equip, Combine, Drop).
     * Clicking an inventory slot calls this; actions consume/use the item or add to crafting.
     */
    examineItem(item) {
        const examineEl = document.getElementById('item-examine');
        const titleEl = document.getElementById('examine-title');
        const descEl = document.getElementById('examine-description');
        const actionsEl = document.getElementById('examine-actions');
        
        if (!examineEl || !titleEl || !descEl || !actionsEl) return;
        
        const emoji = item.icon || item.emoji || '❓';
        titleEl.innerHTML = `[${emoji}] ${item.name || item.id}${item.condition ? ` (${item.condition})` : ''}`;
        descEl.textContent = item.description || 'No description.';
        
        actionsEl.innerHTML = '';
        
        // Add action buttons based on item type
        if (item.type === 'food') {
            const eatBtn = document.createElement('button');
            eatBtn.className = 'action-btn';
            eatBtn.textContent = 'Eat';
            eatBtn.addEventListener('click', () => {
                this.consumeFood(item);
                this.closeExaminePanel();
            });
            actionsEl.appendChild(eatBtn);
        }
        
        if (item.type === 'consumable' && item.hydration) {
            const drinkBtn = document.createElement('button');
            drinkBtn.className = 'action-btn';
            drinkBtn.textContent = 'Drink';
            drinkBtn.addEventListener('click', () => {
                this.consumeWater(item);
                this.closeExaminePanel();
            });
            actionsEl.appendChild(drinkBtn);
        }
        
        if (item.id === 'medicine' && this.meters.sickness) {
            const useBtn = document.createElement('button');
            useBtn.className = 'action-btn';
            useBtn.textContent = 'Use Medicine';
            useBtn.addEventListener('click', () => {
                this.useMedicine();
                this.closeExaminePanel();
            });
            actionsEl.appendChild(useBtn);
        }
        
        // Whiskey
        if (item.id === 'whiskey_bottle' && item.quantity > 0) {
            const drinkBtn = document.createElement('button');
            drinkBtn.className = 'action-btn';
            drinkBtn.textContent = `Drink (${item.quantity} left)`;
            drinkBtn.addEventListener('click', () => {
                this.drinkWhiskey(item);
                this.closeExaminePanel();
            });
            actionsEl.appendChild(drinkBtn);
        }
        
        // Caffeine items
        if (item.id === 'coffee' || item.id === 'energy_drink' || item.id === 'caffeine_pills') {
            const drinkBtn = document.createElement('button');
            drinkBtn.className = 'action-btn';
            drinkBtn.textContent = 'Consume';
            drinkBtn.addEventListener('click', () => {
                this.consumeCaffeine(item);
                this.closeExaminePanel();
            });
            actionsEl.appendChild(drinkBtn);
        }
        
        // Moist wipes (baby_wipes) - Use for hygiene
        if (item.id === 'baby_wipes' && item.quantity > 0) {
            const useBtn = document.createElement('button');
            useBtn.className = 'action-btn';
            useBtn.textContent = 'Use';
            useBtn.addEventListener('click', () => {
                const result = this.meters.performHygieneAction('baby_wipes');
                if (result.success) {
                    this.inventory.removeItem('baby_wipes', 1);
                    this.addMessage(result.message);
                }
                this.closeExaminePanel();
            });
            actionsEl.appendChild(useBtn);
        }
        
        // Clothing - Equip (warmer when worn; take off from Equipped panel if too hot)
        if (this.equipSystem && this.equipSystem.canEquip(item.id)) {
            const slot = this.equipSystem.getSlotForItem(item.id);
            const equipBtn = document.createElement('button');
            equipBtn.className = 'action-btn';
            equipBtn.textContent = 'Equip';
            equipBtn.addEventListener('click', () => {
                this.equipSystem.equip(item.id, slot);
                this.addMessage('Equipped ' + (item.name || item.id) + '.');
                this.updateEquipDisplay();
                this.closeExaminePanel();
            });
            actionsEl.appendChild(equipBtn);
        }
        
        // Hand sanitizer - Use (especially after bathroom to avoid extra penalty)
        if (item.id === 'hand_sanitizer' && item.quantity > 0) {
            const useBtn = document.createElement('button');
            useBtn.className = 'action-btn';
            useBtn.textContent = 'Use';
            useBtn.addEventListener('click', () => {
                const result = this.meters.useSanitizer(this);
                if (result.success) {
                    this.inventory.removeItem('hand_sanitizer', 1);
                    this.addMessage(result.message);
                }
                this.closeExaminePanel();
            });
            actionsEl.appendChild(useBtn);
        }
        
        // Combine: add this item to crafting panel (press C to open crafting)
        const combineBtn = document.createElement('button');
        combineBtn.className = 'action-btn';
        combineBtn.textContent = 'Combine (add to crafting)';
        combineBtn.addEventListener('click', () => {
            this.closeExaminePanel();
            this.openCraftingPanel();
            this.addToCraftingSlot(item, 0);
            this.addMessage('Added ' + (item.name || item.id) + ' to crafting. Add more items and click Combine.');
        });
        actionsEl.appendChild(combineBtn);
        
        // Drop: remove from inventory (always available)
        const dropBtn = document.createElement('button');
        dropBtn.className = 'action-btn';
        dropBtn.textContent = 'Drop';
        dropBtn.addEventListener('click', () => {
            this.dropItem(item);
            this.closeExaminePanel();
        });
        actionsEl.appendChild(dropBtn);
        
        examineEl.classList.remove('hidden');
        
        // Close button dismisses the modal and clears selection
        const closeBtn = document.getElementById('examine-close-btn');
        if (closeBtn) closeBtn.onclick = () => this.closeExaminePanel();
    }

    consumeFood(item) {
        if (!this.inventory.hasItem(item.id, 1, item.condition)) {
            this.addMessage('Item not found in inventory');
            return;
        }
        
        const nutrition = this.itemSystem.getFoodNutrition(item);
        const hygieneCost = this.itemSystem.getFoodHygienePenalty(item);
        const moraleBoost = this.itemSystem.getFoodMoraleBoost(item);
        
        // Check for sickness risk from spoiled food
        let sicknessRisk = 0;
        if (item.condition === 'Spoiled') {
            sicknessRisk = 0.3;
        }
        
        this.meters.consumeFood(nutrition, hygieneCost, moraleBoost);
        
        if (sicknessRisk > 0 && Math.random() < sicknessRisk) {
            this.meters.triggerSickness();
            this.addMessage('You feel sick after eating that...');
        }
        
        if (item.condition === 'Spoiled') {
            if (Math.random() < 0.3) {
                this.meters.triggerSickness();
                this.addMessage('You feel sick after eating that...');
            }
        }
        
        this.inventory.removeItem(item.id, 1, item.condition);
        
        // Check for hot meal (cooked food)
        const isHotMeal = item.id.includes('cooked') || item.id === 'hot_meal';
        if (isHotMeal && !this.firstHotMeal) {
            if (this.tipJar) this.tipJar.earnTip('first_hot_meal');
            this.firstHotMeal = true;
        }
        
        // Play eat sound
        if (window.audioSystem) {
            window.audioSystem.playSound('proceed', 0.5); // Subtle eating sound
        }
        
        if (nutrition > 30) {
            this.meters.adjustMorale(5);
            this.addMessage(`Ate ${item.name}. Feeling better!`);
            if (window.audioSystem) window.audioSystem.playSound('positive', 0.4);
        } else {
            this.addMessage(`Ate ${item.name}.`);
        }
    }

    consumeWater(item) {
        if (!this.inventory.hasItem(item.id, 1)) {
            this.addMessage('Item not found in inventory');
            if (window.audioSystem) window.audioSystem.playSound('no');
            return;
        }
        
        // Check if water is purified
        const isPurified = item.id === 'purified_water' || 
                          (item.id === 'water' && item.purified);
        
        // First clean water tip
        if (isPurified && !this.firstCleanWater) {
            if (this.tipJar) this.tipJar.earnTip('first_clean_water');
            this.firstCleanWater = true;
            if (window.audioSystem) window.audioSystem.playSound('positive');
        }
        
        if (item.id === 'water' && !isPurified) {
            // Unpurified water has sickness risk
            if (Math.random() < 0.2) {
                this.meters.triggerSickness();
                this.addMessage('You feel sick after drinking that water...');
                if (window.audioSystem) window.audioSystem.playSound('negative');
            }
        }
        
        // Play drink sound
        if (window.audioSystem) {
            window.audioSystem.playSound('proceed', 0.5); // Subtle drinking sound
        }
        
        // Get water properties
        const hydration = item.hydration || 20;
        const hygieneCost = item.hygieneCost || 0;
        const sicknessRisk = item.sicknessRisk || 0;
        
        this.meters.consumeWater(hydration, hygieneCost, sicknessRisk);
        this.inventory.removeItem(item.id, 1);
        
        // Check for first clean water
        if (item.id === 'purified_water' && !this.firstCleanWater) {
            this.meters.performMoraleAction('first_clean_water');
            if (this.tipJar) this.tipJar.earnTip('first_clean_water');
            this.firstCleanWater = true;
        }
        
        this.addMessage(`Drank ${item.name}.`);
    }

    drinkWhiskey(item) {
        if (!this.inventory.hasItem(item.id, 1)) {
            this.addMessage('No whiskey found.');
            return;
        }
        
        if (item.quantity <= 0) {
            this.addMessage('The bottle is empty.');
            return;
        }
        
        // Check if low morale (bigger boost)
        const lowMorale = this.meters.morale.value < 30;
        const result = this.meters.drinkWhiskey();
        
        if (lowMorale) {
            this.meters.morale.value = Math.min(100, this.meters.morale.value + 10); // Extra boost
            this.addMessage('You don\'t even taste it. Just need to feel something.');
        } else {
            this.addMessage(result.message);
        }
        
        // Reduce quantity
        item.quantity--;
        if (item.quantity <= 0) {
            this.inventory.removeItem(item.id, 1);
            this.addMessage('Empty. You did that. Future you will have opinions.');
        }
        
        // Check if drinking before sleep
        if (this.meters.isSleeping || this.meters.fatigue.value > 70) {
            this.meters.sleepQuality = 0.5; // Poor sleep quality
            this.addMessage('You pass out quickly. It is not restful.');
        }
        
        // Check if drinking with food
        if (this.meters.hunger.value > 50) {
            this.meters.hangoverTimer *= 0.9; // Slightly reduced hangover
            this.addMessage('The food soaks up some of the poison.');
        }
    }

    consumeCaffeine(item) {
        if (!this.inventory.hasItem(item.id, 1)) {
            this.addMessage('Item not found.');
            return;
        }
        
        const result = this.meters.drinkCaffeine(item.id);
        this.addMessage(result.message);
        this.inventory.removeItem(item.id, 1);
        
        // Schedule crash
        if (item.crashFatigue) {
            setTimeout(() => {
                if (this.meters.caffeineCrashTimer <= 0) {
                    this.meters.fatigue.value = Math.min(100, this.meters.fatigue.value + item.crashFatigue);
                    this.addMessage('The caffeine crash hits. You feel exhausted.');
                }
            }, item.crashTime * 3600 * 1000); // Convert hours to ms
        }
    }

    useMedicine() {
        if (!this.inventory.hasItem('medicine', 1)) {
            this.addMessage('No medicine in inventory');
            return;
        }
        
        if (this.meters.cureSickness()) {
            this.inventory.removeItem('medicine', 1);
            this.addMessage('Medicine used. You feel better!');
            this.meters.adjustMorale(10);
        } else {
            this.addMessage('You are not sick');
        }
    }

    /**
     * Drop an item from inventory (removes one; item is discarded).
     */
    dropItem(item) {
        if (!item || !this.inventory.hasItem(item.id, 1, item.condition)) {
            this.addMessage('Item not in inventory.');
            return;
        }
        this.inventory.removeItem(item.id, 1, item.condition);
        this.updateInventoryDisplay();
        const name = item.name || item.id;
        this.addMessage('Dropped ' + name + '.');
    }

    handleCanvasClick(x, y) {
        if (this.sceneRenderer && this.sceneRenderer.currentScene === 'B' && this.sceneRenderer.currentSceneType === 'closet') {
            if (x < 220) {
                this.sceneRenderer.setScene('A', 'main');
                this.sceneRenderer.loadSceneImages();
                this.addMessage('You return to the main room.');
                return;
            }
        }
        this.moveTargetLocationId = null;
        const obj = this.interactables.getObjectAt(x, y);
        const destX = obj ? (obj.x + obj.width / 2) : x;
        let destY = obj ? (obj.y + obj.height / 2) : y;
        destY = Math.max(this.adamMinY, Math.min(this.adamMaxY, destY));
        this.moveTargetX = destX;
        this.moveTargetY = destY;
        this.moveTargetObject = obj || null;
    }

    goToClosetScene() {
        if (!this.sceneRenderer) return;
        this.sceneRenderer.setScene('B', 'closet');
        this.sceneRenderer.setLightsOn(false);
        this.sceneRenderer.loadSceneImages();
        this.addMessage('You enter the closet room. Click the left side of the screen to return to the basement.');
    }

    setMoveTargetToLocation(location) {
        if (!location || !this.characterRenderer) return;
        const cx = location.x + (location.width || 0) / 2;
        let cy = location.y + (location.height || 0) / 2;
        cy = Math.max(this.adamMinY, Math.min(this.adamMaxY, cy));
        if (typeof cx !== 'number' || typeof cy !== 'number' || isNaN(cx) || isNaN(cy)) return;
        this.moveTargetX = cx;
        this.moveTargetY = cy;
        this.moveTargetObject = null;
        this.moveTargetLocationId = location.id != null ? location.id : (location.name || true);
    }

    updateMoveToTarget(deltaTime) {
        const cr = this.characterRenderer;
        if (!cr) return;
        if (this.sceneRenderer && this.sceneRenderer.currentScene === 'A') {
            cr.characterY = Math.max(this.adamMinY, Math.min(this.adamMaxY, cr.characterY));
        }
        if (this.moveTargetX == null || this.moveTargetY == null) return;
        const dx = this.moveTargetX - cr.characterX;
        const dy = this.moveTargetY - cr.characterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist !== dist || dist < 0) return; // NaN or invalid
        const arrive = 25;
        if (dist <= arrive) {
            this.moveTargetX = null;
            this.moveTargetY = null;
            const obj = this.moveTargetObject;
            const locId = this.moveTargetLocationId;
            this.moveTargetObject = null;
            this.moveTargetLocationId = null;
            if (locId) {
                cr.setAnimation('examine', cr.currentDirection, 0);
                this.examineReturnToIdleAt = Date.now() + 2500;
            } else {
                cr.setAnimation('idle', cr.currentDirection, 0);
            }
            if (obj) this.showObjectActions(obj);
            return;
        }
        const dir = Math.atan2(dy, dx);
        const vx = Math.cos(dir) * this.moveSpeed * deltaTime;
        const vy = Math.sin(dir) * this.moveSpeed * deltaTime;
        cr.characterX += vx;
        cr.characterY += vy;
        cr.characterY = Math.max(this.adamMinY, Math.min(this.adamMaxY, cr.characterY));
        cr.currentDirection = dx > 0 ? 'right' : 'left';
        cr.setAnimation('walk', cr.currentDirection, 999999);
    }

    showObjectActions(obj) {
        const examineEl = document.getElementById('item-examine');
        const titleEl = document.getElementById('examine-title');
        const descEl = document.getElementById('examine-description');
        const actionsEl = document.getElementById('examine-actions');
        
        if (!examineEl || !titleEl || !descEl || !actionsEl) return;
        
        const emoji = obj.emoji || '📦';
        titleEl.innerHTML = `[${emoji}] ${obj.name}`;
        descEl.textContent = obj.description;
        
        actionsEl.innerHTML = '';
        
        for (const action of obj.interactions) {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            if (action === 'wash' && obj.id === 'floor_drain') {
                btn.textContent = 'Wash (soap and water with rag)';
            } else if (action === 'go_to_closet') {
                btn.textContent = 'Go to closet room';
            } else {
                btn.textContent = action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            }
            btn.addEventListener('click', () => {
                // Play click sound
                if (window.audioSystem) {
                    window.audioSystem.playSound('click');
                }
                
                // Play animation based on action
                this.playActionAnimation(action, obj);
                
                const result = this.interactables.interact(obj.id, action, this);
                this.addMessage(result.message);
                
                // Play action-specific sounds
                if (result.success) {
                    if (action === 'search' || action === 'open') {
                        if (window.audioSystem) window.audioSystem.playSound('open_loot');
                    } else if (action === 'craft') {
                        if (window.audioSystem) window.audioSystem.playSound('positive');
                    }
                } else {
                    if (window.audioSystem) window.audioSystem.playSound('no');
                }
                
                if (result.success && action === 'search') {
                    examineEl.classList.add('hidden');
                    this.updateInventoryDisplay();
                    this.checkAchievements();
                }
                if (result.success && action === 'wash') {
                    this.updateInventoryDisplay();
                }
                if (result.success && action === 'craft') {
                    examineEl.classList.add('hidden');
                    this.openCraftingPanel();
                }
                if (result.success) {
                    this.checkAchievements();
                }
            });
            actionsEl.appendChild(btn);
        }
        
        examineEl.classList.remove('hidden');
        const closeBtn = document.getElementById('examine-close-btn');
        if (closeBtn) closeBtn.onclick = () => examineEl.classList.add('hidden');
    }

    // 🎬 PLAY ACTION ANIMATION: Play appropriate animation for action
    playActionAnimation(action, obj) {
        if (!this.characterRenderer) return;
        
        // Determine direction (face the object)
        const direction = obj && obj.x < 640 ? 'left' : 'right';
        
        switch (action) {
            case 'examine':
                // Use examine.PNG (leaning forward, inspecting)
                this.characterRenderer.setAnimation('examine', direction, 1500);
                break;
            case 'use_bathroom':
                // Use reach_low_left/right.PNG (crouching)
                this.characterRenderer.setAnimation('reach_low', direction, 2000);
                break;
            case 'search':
            case 'pick_up':
                // Use reach_low for picking up items
                this.characterRenderer.setAnimation('reach_low', direction, 1500);
                break;
            case 'craft':
                // Use crafting.PNG
                this.characterRenderer.setAnimation('crafting', direction, 2000);
                break;
            case 'eat':
                // Use eat.PNG
                this.characterRenderer.setAnimation('eat', direction, 2000);
                break;
            case 'drink':
                // Use drink.PNG
                this.characterRenderer.setAnimation('drink', direction, 2000);
                break;
            case 'wash':
                this.characterRenderer.setAnimation('reach_low', direction, 2500);
                break;
            default:
                // Default: brief examine animation
                this.characterRenderer.setAnimation('examine', direction, 1000);
        }
    }
    
    // 🎬 PLAY ANIMATION: Wrapper for character renderer
    playAnimation(animation, duration = 2000) {
        if (this.characterRenderer) {
            const direction = Math.random() < 0.5 ? 'left' : 'right';
            this.characterRenderer.setAnimation(animation, direction, duration);
        }
    }

    openCraftingPanel() {
        const panel = document.getElementById('crafting-panel');
        if (!panel) return;
        
        panel.classList.remove('hidden');
        this.craftingSlots = [];
        this.updateCraftingDisplay();
    }

    closeCraftingPanel() {
        const panel = document.getElementById('crafting-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
        this.craftingSlots = [];
    }

    addToCraftingSlot(item, slotIndex) {
        if (!this.craftingSlots) this.craftingSlots = [];
        if (this.craftingSlots.length <= slotIndex) {
            this.craftingSlots[slotIndex] = { item: item, quantity: 1 };
        } else {
            if (this.craftingSlots[slotIndex].item.id === item.id) {
                this.craftingSlots[slotIndex].quantity++;
            } else {
                this.craftingSlots[slotIndex] = { item: item, quantity: 1 };
            }
        }
        this.updateCraftingDisplay();
    }

    updateCraftingDisplay() {
        const slots = document.querySelectorAll('.craft-slot');
        slots.forEach((slotEl, index) => {
            slotEl.innerHTML = '';
            if (this.craftingSlots && this.craftingSlots[index]) {
                const slot = this.craftingSlots[index];
                slotEl.innerHTML = `
                    <div style="font-size: 30px;">${slot.item.icon}</div>
                    ${slot.quantity > 1 ? `<div style="font-size: 10px;">x${slot.quantity}</div>` : ''}
                `;
                slotEl.title = slot.item.name;
            }
        });
    }

    attemptCraft() {
        // Mark as active for fatigue calculation
        if (this.actionTracker) {
            this.actionTracker.isActive = true;
            setTimeout(() => {
                if (this.actionTracker) this.actionTracker.isActive = false;
            }, 1000); // Reset after 1 second
        }
        if (!this.craftingSlots || this.craftingSlots.length === 0) {
            this.addMessage('Add items to craft slots first');
            return;
        }

        const inputs = this.craftingSlots.map(slot => ({
            id: slot.item.id,
            quantity: slot.quantity
        }));

        const recipe = this.craftingSystem.findRecipe(inputs);
        if (!recipe) {
            this.addMessage('No recipe found for these items');
            return;
        }

        // Check if we have heat source
        const hasHeat = this.inventory.hasItem('candle') || 
                       this.inventory.hasItem('lighter') ||
                       this.inventory.hasItem('torch') ||
                       this.inventory.hasItem('sterno_can') ||
                       this.inventory.hasItem('propane_stove');

        // Track cooking actions
        const isCooking = recipe.output.id.includes('cooked') || 
                         recipe.output.id.includes('purified') ||
                         recipe.output.id === 'boiled_water' ||
                         recipe.output.id === 'hot_meal';
        if (isCooking && this.actionTracker) {
            const windowOpen = this.interactables.getObject('window')?.isOpen || false;
            this.actionTracker.recordAction('cooking_start', {
                isMeat: recipe.output.id.includes('meat') || recipe.output.id.includes('rabbit'),
                ventilation: windowOpen
            });
        }

        const result = this.craftingSystem.attemptCraft(recipe, this.inventory, hasHeat, this);
        this.addMessage(result.message);
        
        if (result.success) {
            this.meters.adjustMorale(5); // Crafting success boosts morale
            this.closeCraftingPanel();
            this.updateInventoryDisplay();
            
            // Stop cooking action
            if (isCooking && this.actionTracker) {
                this.actionTracker.recordAction('cooking_stop');
            }
            
            // Check achievements and award tips
            if (this.firstCraft) {
                this.achievements.checkAchievement('macgyver', this);
                if (this.tipJar) this.tipJar.earnTip('first_craft');
                this.firstCraft = false;
            }
            if (result.item && result.item.id === 'methane_generator') {
                this.achievements.checkAchievement('silent_but_deadly', this);
                if (this.tipJar) this.tipJar.earnTip('methane_generator');
            }
            if (result.item && result.item.id === 'water_filter') {
                if (this.tipJar) this.tipJar.earnTip('first_filter');
            }
            if (result.item && result.item.id === 'compost_toilet') {
                if (this.tipJar) this.tipJar.earnTip('first_compost_toilet');
            }
            if (result.item && result.item.id === 'sprout_garden_active') {
                if (this.tipJar) this.tipJar.earnTip('first_sprouts');
            }
        } else {
            // Failed crafting - clear slots
            this.craftingSlots = [];
            this.updateCraftingDisplay();
        }
    }

    handleGameOver() {
        this.stop();
        const daysSurvived = this.dayCycle.currentDay;
        const reason = this.gameState.gameOverReason;
        const cr = this.characterRenderer;
        const location = cr ? { x: cr.characterX, y: cr.characterY } : { x: 640, y: 360 };
        if (cr) this.gameState.deathPosition = { x: cr.characterX, y: cr.characterY };
        this.deathScreen.show(reason, daysSurvived, location);
    }

    triggerEnding() {
        this.stop();
        this.achievements.checkAchievement('survivor', this);
        this.endingSequence.show();
    }

    checkAchievements() {
        // Check for water heater achievement
        // This would be triggered when player drains water heater
        // Check for rabbit achievement
        if (this.inventory.hasItem('rabbit_meat') || this.inventory.hasItem('cooked_rabbit')) {
            if (!this.firstRabbit) {
                this.achievements.checkAchievement('bunny_boiler', this);
                if (this.tipJar) this.tipJar.earnTip('first_rabbit');
                this.firstRabbit = true;
            }
        }
        // Check for mouse
        if (this.inventory.hasItem('mouse_meat') || this.inventory.hasItem('cooked_mouse')) {
            if (!this.firstMouse) {
                if (this.tipJar) this.tipJar.earnTip('first_mouse');
                this.firstMouse = true;
            }
        }
        // Check for compost + sprouts achievement
        if (this.inventory.hasItem('sprouts') && this.inventory.hasItem('compost')) {
            this.achievements.checkAchievement('circle_of_life', this);
        }
    }

    updateAttractionIndicator() {
        const indicator = document.getElementById('attraction-indicator');
        const bar = document.getElementById('attraction-bar');
        const text = document.getElementById('attraction-level-text');
        
        if (!this.attractionSystem) return;
        
        const level = this.attractionSystem.getAttractionLevel();
        const points = this.attractionSystem.attractionPoints;
        const maxPoints = this.attractionSystem.maxPoints;
        
        if (indicator && points > 0) {
            indicator.classList.remove('hidden');
            if (bar) {
                const percentage = (points / maxPoints) * 100;
                bar.style.width = `${percentage}%`;
            }
            if (text) {
                const levelNames = {
                    'low': 'Low',
                    'medium': 'Medium',
                    'high': 'High',
                    'very_high': 'Very High',
                    'critical': 'CRITICAL!'
                };
                text.textContent = levelNames[level] || 'Low';
            }
        } else if (indicator && points === 0) {
            indicator.classList.add('hidden');
        }
    }

    checkSleepEvent(passedOut = false) {
        const roll = Math.random() * 100;
        
        if (roll <= 50) {
            // Peaceful sleep
            return;
        } else if (roll <= 70) {
            // Noise - wake up briefly
            this.meters.stopSleep();
            this.addMessage('You wake with a start. Was that a noise?');
            this.meters.morale.value = Math.max(0, this.meters.morale.value - 5);
        } else if (roll <= 85) {
            // Mongrel investigation
            if (passedOut) {
                // More dangerous when passed out
                this.meters.stopSleep();
                this.addMessage('Mongrels scratch at the window! You wake up in a panic!');
                this.attractionSystem.addAttraction(20);
                this.meters.morale.value = Math.max(0, this.meters.morale.value - 10);
            } else {
                this.addMessage('You hear scratching. Mongrels are investigating...');
                this.meters.sleepQuality *= 0.5; // Restless sleep
            }
        } else if (roll <= 95) {
            // Mongrel attack
            this.meters.stopSleep();
            this.addMessage('Mongrels try to breach! You wake up fighting!');
            this.attractionSystem.addAttraction(30);
            this.meters.morale.value = Math.max(0, this.meters.morale.value - 15);
            // Trigger mongrel event
            this.events.triggerEvent('mongrel_attack', this);
        } else {
            // Marauder attempt
            this.meters.stopSleep();
            this.addMessage('Someone tries the door! You wake up alert.');
            this.meters.morale.value = Math.max(0, this.meters.morale.value - 10);
            // Trigger marauder event
            this.events.triggerEvent('marauder_visit', this);
        }
    }

    updateFatigueStatus() {
        const statusEl = document.getElementById('fatigue-status');
        const barEl = document.getElementById('fatigue-bar');
        if (!statusEl || !barEl) return;
        
        const fatigue = this.meters.fatigue.value;
        let status = '';
        let color = '';
        
        if (fatigue >= 96) {
            status = 'FORCED SLEEP';
            color = '#ff0000';
            barEl.style.animation = 'pulse 1s infinite';
        } else if (fatigue >= 86) {
            status = 'COLLAPSE RISK';
            color = '#ff4444';
            barEl.style.animation = 'pulse 1.5s infinite';
        } else if (fatigue >= 71) {
            status = 'DROWSY';
            color = '#ff8844';
        } else if (fatigue >= 51) {
            status = 'EXHAUSTED';
            color = '#ffaa44';
        } else if (fatigue >= 31) {
            status = 'TIRED';
            color = '#ffff44';
        } else {
            status = 'RESTED';
            color = '#44ff88';
            barEl.style.animation = 'none';
        }
        
        statusEl.textContent = status;
        statusEl.style.color = color;
        
        // Update bar color
        if (fatigue >= 86) {
            barEl.style.background = 'linear-gradient(to right, #ff0000, #ff4444)';
        } else if (fatigue >= 71) {
            barEl.style.background = 'linear-gradient(to right, #ff8844, #ffaa44)';
        } else if (fatigue >= 51) {
            barEl.style.background = 'linear-gradient(to right, #ffaa44, #ffff44)';
        } else if (fatigue >= 31) {
            barEl.style.background = 'linear-gradient(to right, #ffff44, #44ff88)';
        } else {
            barEl.style.background = 'linear-gradient(to right, #2196F3, #64B5F6, #90CAF9, #BBDEFB)';
        }
    }

    checkExtractionTimer() {
        // Day 7 extraction at 10 AM
        if (this.dayCycle.currentDay === 7 && !this.extractionTime) {
            // Set extraction time (10 AM = 2 hours into day if day starts at 8 AM)
            this.extractionTime = this.dayCycle.dayTime + (2 * 3600); // 2 hours from now
        }
        
        if (this.extractionTime && this.dayCycle.dayTime >= this.extractionTime) {
            if (!this.extractionMissed) {
                this.triggerExtraction();
            }
        }
        
        // Check if extraction window passed (noon = 4 hours into day)
        if (this.dayCycle.currentDay === 7 && this.dayCycle.dayTime >= (4 * 3600) && !this.extractionMissed && !this.extractionTime) {
            this.missExtraction();
        }
    }

    triggerExtraction() {
        if (this.meters.isSleeping) {
            // Player is asleep - extraction missed
            this.missExtraction();
            return;
        }
        
        this.addMessage('You hear footsteps above!');
        this.addMessage('A voice calls: "Anyone down there? We\'re here to extract survivors!"');
        
        // Show extraction choice
        this.showExtractionChoice();
    }

    showExtractionChoice() {
        const choice = confirm('Extraction has arrived! Open the door? (OK = Open, Cancel = Stay Silent)');
        
        if (choice) {
            this.endingSequence.show('open_door');
        } else {
            this.endingSequence.show('stay_silent');
        }
        
        this.extractionTime = null; // Prevent retriggering
    }

    missExtraction() {
        this.extractionMissed = true;
        this.addMessage('You missed the extraction window. They left without you.');
        this.addMessage('You are alone. Survival continues...');
        this.meters.adjustMorale(-20);
        
        // Enter survival mode
        this.enterSurvivalMode();
    }

    enterSurvivalMode() {
        // Day 8+ survival mode
        this.addMessage('SURVIVAL MODE: How long can you last?');
        
        // Update day cycle to allow infinite days
        this.dayCycle.maxDays = Infinity;
        
        // Achievement for surviving past Day 7
        if (this.achievements) {
            this.achievements.checkAchievement('survivor_day7', this);
        }
    }

    handleMongrelBreach() {
        // Mongrel breaches defenses
        this.combatSystem.startCombat('mongrel', this);
        this.addMessage('A mongrel breaks through your defenses!');
        
        // Show combat UI
        this.showCombatUI();
    }

    showCombatUI() {
        // Create combat panel
        const combatPanel = document.getElementById('combat-panel');
        if (combatPanel) {
            combatPanel.classList.remove('hidden');
            this.updateCombatUI();
        }
    }

    hideCombatUI() {
        const combatPanel = document.getElementById('combat-panel');
        if (combatPanel) {
            combatPanel.classList.add('hidden');
        }
    }

    updateCombatUI() {
        const weaponList = document.getElementById('combat-weapons');
        if (!weaponList) return;
        
        weaponList.innerHTML = '';
        
        const weapons = [
            { id: 'spear', name: 'Spear', chance: '80%' },
            { id: 'baseball_bat', name: 'Baseball Bat', chance: '70%' },
            { id: 'hammer', name: 'Hammer', chance: '65%' },
            { id: 'utility_knife', name: 'Utility Knife', chance: '60%' },
            { id: 'fire_extinguisher', name: 'Fire Extinguisher', chance: '55%' },
            { id: 'fists', name: 'Fists', chance: '20%' }
        ];
        
        weapons.forEach(weapon => {
            const hasWeapon = this.inventory.hasItem(weapon.id, 1);
            const btn = document.createElement('button');
            btn.className = 'combat-weapon-btn';
            btn.textContent = `${weapon.name} (${weapon.chance})`;
            btn.disabled = !hasWeapon && weapon.id !== 'fists';
            btn.addEventListener('click', () => {
                this.attemptCombat(weapon.id);
            });
            weaponList.appendChild(btn);
        });
        
        // Scare items
        const scareItems = [
            { id: 'pepper_spray', name: 'Pepper Spray' },
            { id: 'bear_spray', name: 'Bear Spray' },
            { id: 'air_horn', name: 'Air Horn' }
        ];
        
        const scareList = document.getElementById('combat-scare-items');
        if (scareList) {
            scareList.innerHTML = '';
            scareItems.forEach(item => {
                const hasItem = this.inventory.hasItem(item.id, 1);
                const btn = document.createElement('button');
                btn.className = 'combat-scare-btn';
                btn.textContent = item.name;
                btn.disabled = !hasItem;
                btn.addEventListener('click', () => {
                    this.useScareItem(item.id);
                });
                scareList.appendChild(btn);
            });
        }
    }

    attemptCombat(weapon) {
        const result = this.combatSystem.attemptCombat(weapon, this);
        this.addMessage(result.message);
        
        if (!this.combatSystem.inCombat) {
            this.hideCombatUI();
        } else {
            this.updateCombatUI();
        }
    }

    useScareItem(item) {
        const result = this.combatSystem.useScareItem(item, this);
        this.addMessage(result.message);
        
        if (!this.combatSystem.inCombat) {
            this.hideCombatUI();
        }
    }

    updateExtractionCountdown() {
        const countdownEl = document.getElementById('extraction-countdown');
        if (!countdownEl) return;
        
        if (this.dayCycle.currentDay >= 7) {
            // Calculate time until extraction (Day 7, 10 AM)
            const extractionGameTime = 7 * 24 * 3600 + 10 * 3600; // Day 7, 10 AM in game seconds
            const currentGameTime = (this.dayCycle.currentDay - 1) * 24 * 3600 + this.dayCycle.dayTime;
            const timeUntil = extractionGameTime - currentGameTime;
            
            if (timeUntil > 0 && !this.extractionMissed) {
                const days = Math.floor(timeUntil / (24 * 3600));
                const hours = Math.floor((timeUntil % (24 * 3600)) / 3600);
                const minutes = Math.floor((timeUntil % 3600) / 60);
                
                countdownEl.textContent = `Rescue in: ${days}d ${hours}h ${minutes}m`;
                countdownEl.classList.remove('hidden');
            } else if (this.extractionMissed) {
                countdownEl.textContent = 'Rescue missed. Survival continues...';
                countdownEl.classList.remove('hidden');
            } else {
                countdownEl.classList.add('hidden');
            }
        } else {
            const daysLeft = 7 - this.dayCycle.currentDay;
            countdownEl.textContent = `${daysLeft} days until rescue`;
            countdownEl.classList.remove('hidden');
        }
    }

    loadSettings() {
        try {
            const settings = localStorage.getItem('7days_settings');
            return settings ? JSON.parse(settings) : { gameSpeed: 'normal' };
        } catch (e) {
            return { gameSpeed: 'normal' };
        }
    }

    updateWeatherDisplay() {
        const weatherIcon = document.getElementById('weather-icon');
        const tempText = document.getElementById('temperature-text');
        const seasonText = document.getElementById('season-text');
        
        if (weatherIcon && this.weatherSystem) {
            if (this.dayCycle && this.dayCycle.isNight) {
                weatherIcon.textContent = '🌙';
            } else {
                weatherIcon.textContent = this.weatherSystem.getWeatherIcon();
            }
        }
        
        if (tempText && this.weatherSystem) {
            const temp = Math.round(this.weatherSystem.temperature);
            const color = this.weatherSystem.getTemperatureColor();
            tempText.textContent = `${temp}°F`;
            tempText.style.color = color;
        }
        const insideTempEl = document.getElementById('temperature-inside-text');
        if (insideTempEl && this.temperatureSystem) {
            const insideTemp = Math.round(this.temperatureSystem.getIndoorTemperature());
            insideTempEl.textContent = `In: ${insideTemp}°F`;
            insideTempEl.style.color = this.weatherSystem ? this.weatherSystem.getTemperatureColor(insideTemp) : '#88ccff';
        }
        
        if (seasonText && this.weatherSystem) {
            const season = this.weatherSystem.season.toUpperCase();
            seasonText.textContent = season;
        }
    }
}
