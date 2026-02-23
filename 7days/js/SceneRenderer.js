/**
 * SceneRenderer - Two-layer scene and character drawing.
 *
 * BOTTOM: Invisible hitboxes (initializeLocations) for click-to-move and location search.
 * TOP: Background image from visuals/scenes (or VISUALS/scenes). Optional flashlight overlay.
 *
 * CHARACTER: When game over and deathPosition set, draws defeated.PNG at death spot.
 * When sleeping (game.meters.isSleeping), draws sleep.PNG at character position; else CharacterRenderer.
 *
 * ASSETS: visuals/adam/ (defeated.PNG, sleep.PNG), visuals/scenes/, data/location_placements.json.
 */

class SceneRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.logicalWidth = canvas.logicalWidth ?? 1280;
        this.logicalHeight = canvas.logicalHeight ?? 720;
        this.currentScene = 'A'; // 'A' or 'B'
        this.hoveredLocation = null;
        this.clickableLocations = this.initializeLocations();
        // Locations stay unflipped so item overlays match the scene (furnace left, drain center, door right)
        
        // 🎨 TWO-LAYER SYSTEM
        this.backgroundImages = {}; // Multiple scene images (day/night, lights on/off)
        this.currentSceneImage = null; // Currently displayed image
        this.debugMode = false; // Set to true to see hitboxes (for development)
        
        // Item overlays (small icons showing items in locations)
        this.itemOverlays = {}; // { locationId: [{ item, x, y }] }
        
        // Scene state
        this.isDay = true;
        this.lightsOn = false;
        this.currentSceneType = 'main'; // 'main' or 'closet'

        // Load manual placement overrides (edit data/location_placements.json to align with your picture)
        this.placementOverridesReady = this.loadPlacementOverrides();
        // Defeated Adam image (shown at death position when game over)
        this.defeatedImage = new Image();
        this.defeatedImage.src = (this.getBaseUrl()) + 'visuals/adam/defeated.PNG';
        // Sleeping Adam image (shown when napping or full sleep)
        this.sleepImage = new Image();
        this.sleepImage.onerror = () => {
            this.sleepImage.onerror = null;
            this.sleepImage.src = (this.getBaseUrl()) + 'VISUALS/adam/sleep.PNG';
        };
        this.sleepImage.src = (this.getBaseUrl()) + 'visuals/adam/sleep.PNG';
    }

    loadPlacementOverrides() {
        const base = this.getBaseUrl();
        // Skip fetch on file: protocol (CORS blocks reading local JSON)
        if (typeof base === 'string' && base.startsWith('file:')) {
            return Promise.resolve();
        }
        const url = base + 'data/location_placements.json';
        return fetch(url).then(r => r.json()).then(data => {
            this.applyPlacementOverrides(data);
        }).catch(() => {});
    }

    applyPlacementOverrides(data) {
        const sceneA = this.clickableLocations['A'];
        if (!sceneA) return;
        for (const key of Object.keys(data)) {
            if (key.startsWith('_')) continue;
            const loc = sceneA[key];
            const ov = data[key];
            if (loc && ov && (ov.x != null || ov.y != null || ov.width != null || ov.height != null)) {
                if (ov.x != null) loc.x = ov.x;
                if (ov.y != null) loc.y = ov.y;
                if (ov.width != null) loc.width = ov.width;
                if (ov.height != null) loc.height = ov.height;
            }
        }
    }

    initializeLocations() {
        // Global offset so item map lines up with basement picture (up + right)
        const OFFSET_X = 40;
        const OFFSET_Y = -45; // up = decrease y

        // Scene A: match to basement image (1280x720) with offset applied
        const sceneARaw = {
            'L07': { x: 28, y: 535, width: 65, height: 75, name: 'Cardboard Box A' },
            'L08': { x: 98, y: 535, width: 65, height: 75, name: 'Cardboard Box B' },
            'L16': { x: 188, y: 318, width: 50, height: 100, name: 'Behind Furnace' },
            'L17': { x: 198, y: 368, width: 95, height: 95, name: 'Inside Furnace Panel' },
            'L24': { x: 52, y: 82, width: 108, height: 62, name: 'Window Well' },
            'L04': { x: 328, y: 198, width: 118, height: 38, name: 'Shelf Unit - Top' },
            'L05': { x: 328, y: 252, width: 118, height: 38, name: 'Shelf Unit - Middle' },
            'L06': { x: 328, y: 518, width: 118, height: 38, name: 'Shelf Unit - Bottom' },
            'L10': { x: 338, y: 348, width: 52, height: 52, name: 'Plastic Bin A' },
            'L11': { x: 398, y: 348, width: 52, height: 52, name: 'Crate B' },
            'L01': { x: 462, y: 398, width: 198, height: 38, name: 'Workbench Surface' },
            'L03': { x: 462, y: 295, width: 198, height: 102, name: 'Pegboard' },
            'L25': { x: 660, y: 382, width: 136, height: 44, name: 'Floor Drain' },
            'L34': { x: 520, y: 437, width: 65, height: 23, name: 'Inside Old Boot' },
            'L33': { x: 698, y: 438, width: 108, height: 92, name: 'Behind Old Furniture' },
            'L22': { x: 758, y: 438, width: 85, height: 55, name: 'Junky Table' },
            'L18': { x: 818, y: 278, width: 78, height: 158, name: 'Water Heater Area' },
            'L15': { x: 1012, y: 398, width: 112, height: 105, name: 'Shop Sink' },
            'L26': { x: 1038, y: 488, width: 45, height: 108, name: 'Old Tote' },
            'L29': { x: 1108, y: 455, width: 65, height: 75, name: 'Broken Crate' },
            'L44': { x: 1108, y: 418, width: 65, height: 37, name: 'Old Crate' },
            'L35': { x: 395, y: 45, width: 418, height: 35, name: 'Ceiling Joists' },
            'L13': { x: 482, y: 402, width: 45, height: 35, name: 'Toolbox' },
            'L14': { x: 535, y: 402, width: 35, height: 24, name: 'Tackle Box' },
            'L31': { x: 462, y: 442, width: 55, height: 24, name: 'Junk Drawer' },
            'L32': { x: 735, y: 288, width: 110, height: 43, name: 'Workbench Drawer' },
            'L36': { x: 1110, y: 140, width: 140, height: 260, name: 'Door' },
            'L37': { x: 40, y: 240, width: 220, height: 170, name: 'Sump Pit' },
            'L38': { x: 0, y: 0, width: 80, height: 55, name: 'Right Window' },
            'L39': { x: 0, y: 0, width: 80, height: 85, name: 'Breaker Panel' },
            'L40': { x: 0, y: 0, width: 28, height: 38, name: 'Light Switch' },
            'L42': { x: 0, y: 0, width: 115, height: 95, name: 'Old Junky Boxes' },
            'L45': { x: 795, y: 363, width: 90, height: 60, name: 'Magazines and Books' },
            'L46': { x: 1185, y: 460, width: 48, height: 55, name: 'Can' },
            'L47': { x: 1180, y: 287, width: 100, height: 66, name: 'Under the Shop Sink' },
            'L48': { x: 585, y: 470, width: 65, height: 12, name: 'Tennis Ball' },
            'L49': { x: 585, y: 482, width: 65, height: 11, name: 'Old Newspaper' },
            'L43': { x: 0, y: 0, width: 85, height: 90, name: 'Door Calendar' }
        };
        const sceneA = {};
        for (const [id, loc] of Object.entries(sceneARaw)) {
            sceneA[id] = { ...loc, x: loc.x + OFFSET_X, y: loc.y + OFFSET_Y };
        }

        // Per-location alignment: move items to line up with the basement picture (percent = % of that location's width/height)
        const align = (id, rightPct, upPct) => {
            const loc = sceneA[id];
            if (!loc) return;
            loc.x += (rightPct / 100) * loc.width;
            loc.y -= (upPct / 100) * loc.height;
        };
        // Workbench items: up 200%, right 100%
        align('L01', 100, 200); align('L13', 100, 200); align('L14', 100, 200); align('L31', 100, 200);
        // Pegboard (searching pegboard is on the shelf in picture): right 700%, up 100% — move to shelf area (align with L04/L05)
        const peg = sceneA['L03'];
        if (peg) {
            peg.x += (700 / 100) * peg.width; // 700% of width
            peg.y -= (100 / 100) * peg.height;
            if (peg.x + peg.width > 1280) peg.x = Math.max(0, 1280 - peg.width);
        }
        // Furnace: right 300%
        align('L16', 300, 0); align('L17', 300, 0);
        // Shelf top/middle: right 500% to line up with shelf in picture
        align('L04', 500, 0); align('L05', 500, 0);
        // Behind old furniture: up 300%, right 100%
        align('L33', 100, 300);
        // Under utility sink: right 200%, up 100%
        align('L15', 200, 100);
        // Bottom shelf: up 700%, right 100%
        align('L06', 100, 700);
        // Scene B (closet) locations with clickable areas
        const sceneB = {
            'L23': { x: 100, y: 300, width: 200, height: 200, name: 'Costume Trunk' },
            'L21': { x: 200, y: 450, width: 120, height: 80, name: 'Under Stairs (Crawl Storage)' },
            'L20': { x: 350, y: 500, width: 80, height: 60, name: 'Dirty clothes hamper' },
            'L19': { x: 400, y: 400, width: 150, height: 100, name: 'Old Junk Boxes' },
            'L50': { x: 180, y: 380, width: 200, height: 140, name: 'Old Freezer' },
            'L12': { x: 300, y: 550, width: 60, height: 40, name: 'Old Suitcase' },
            'L22': { x: 500, y: 450, width: 100, height: 50, name: 'Bookshelf / Stored Books' },
            'L35': { x: 150, y: 100, width: 150, height: 30, name: 'Ceiling Joists (Under Stairs Beams)' }
        };
        // Flip closet map horizontally to match closet art; keep Old Junk Boxes (L19) in place
        const canvasW = 1280;
        for (const [id, loc] of Object.entries(sceneB)) {
            if (id === 'L19') continue;
            loc.x = canvasW - loc.x - loc.width;
        }

        return { 'A': sceneA, 'B': sceneB };
    }

    setScene(scene, sceneType = 'main') {
        this.currentScene = scene; // 'A' or 'B'
        this.currentSceneType = sceneType; // 'main' or 'closet'
        this.loadSceneImages();
    }
    
    /**
     * 🎨 LOAD SCENE IMAGES: Load all variants (day/night, lights on/off)
     */
    loadSceneImages() {
        const imageKeys = [];
        
        if (this.currentSceneType === 'main') {
            imageKeys.push(
                'day_lights_on',
                'day_lights_off',
                'night_lights_on',
                'night_no_light'
            );
        } else {
            imageKeys.push(
                'closet_lights_on',
                'closet_lights_off'
            );
        }
        
        // Base URL = directory of current page (works for file:// and http://)
        const baseUrl = this.getBaseUrl();
        const basePaths = [
            baseUrl + 'visuals/scenes/',
            baseUrl + 'VISUALS/scenes/',
            'visuals/scenes/',
            'VISUALS/scenes/',
            './visuals/scenes/',
            './VISUALS/scenes/'
        ];
        for (const key of imageKeys) {
            if (!this.backgroundImages[key]) {
                this.loadImageWithFallback(key, basePaths);
            }
        }
        
        // Update current image
        this.updateSceneImage();
    }
    
    getBaseUrl() {
        try {
            const href = typeof window !== 'undefined' && window.location && window.location.href;
            if (!href) return '';
            const lastSlash = href.lastIndexOf('/');
            return lastSlash >= 0 ? href.substring(0, lastSlash + 1) : '';
        } catch (e) {
            return '';
        }
    }
    
    loadImageWithFallback(key, basePaths) {
        let idx = 0;
        const tryNext = () => {
            if (idx >= basePaths.length) return;
            const base = basePaths[idx];
            idx++;
            const url = base + key + '.png';
            const img = new Image();
            img.onload = () => {
                this.backgroundImages[key] = img;
                this.updateSceneImage();
            };
            img.onerror = tryNext;
            img.src = url;
        };
        tryNext();
    }

    loadImage(key, url) {
        const img = new Image();
        img.onload = () => {
            this.backgroundImages[key] = img;
            this.updateSceneImage();
        };
        img.onerror = () => {};
        img.src = url;
    }
    
    /**
     * 🎨 UPDATE SCENE IMAGE: Choose which image to display based on state
     * Also set the HTML <img id="scene-background"> so basement art shows (no canvas placeholder)
     */
    updateSceneImage() {
        let imageKey = null;
        
        if (this.currentSceneType === 'main') {
            if (this.isDay) {
                imageKey = this.lightsOn ? 'day_lights_on' : 'day_lights_off';
            } else {
                imageKey = this.lightsOn ? 'night_lights_on' : 'night_no_light';
            }
        } else {
            imageKey = this.lightsOn ? 'closet_lights_on' : 'closet_lights_off';
        }
        
        this.currentSceneImage = this.backgroundImages[imageKey] || null;
        
        const bgEl = typeof document !== 'undefined' && document.getElementById('scene-background');
        if (bgEl && imageKey) {
            const base = this.getBaseUrl();
            bgEl.src = base + 'visuals/scenes/' + imageKey + '.png';
            bgEl.onerror = function () { this.onerror = null; this.src = base + 'VISUALS/scenes/' + imageKey + '.png'; };
        } else if (bgEl) {
            bgEl.src = '';
        }
    }
    
    /**
     * 🎨 SET DAY/NIGHT: Update scene based on time of day
     */
    setDayNight(isDay) {
        this.isDay = isDay;
        this.updateSceneImage();
    }
    
    /**
     * 🎨 SET LIGHTS: Update scene based on lights on/off
     */
    setLightsOn(lightsOn) {
        this.lightsOn = lightsOn;
        this.updateSceneImage();
    }
    
    /**
     * 🎨 GET BRIGHT SCENE: Get the bright version for flashlight effect
     */
    getBrightScene() {
        if (this.currentSceneType === 'main') {
            if (this.isDay) {
                return this.backgroundImages['day_lights_on'] || this.backgroundImages['day_lights_off'];
            } else {
                return this.backgroundImages['night_lights_on'] || this.backgroundImages['day_lights_on'];
            }
        } else {
            return this.backgroundImages['closet_lights_on'] || this.backgroundImages['closet_lights_off'];
        }
    }
    
    /**
     * 🎨 GET DARK SCENE: Get the dark version for flashlight effect
     */
    getDarkScene() {
        if (this.currentSceneType === 'main') {
            if (this.isDay) {
                return this.backgroundImages['day_lights_off'] || this.backgroundImages['day_lights_on'];
            } else {
                return this.backgroundImages['night_no_light'] || this.backgroundImages['night_lights_on'];
            }
        } else {
            return this.backgroundImages['closet_lights_off'] || this.backgroundImages['closet_lights_on'];
        }
    }
    
    /**
     * 🎨 SET ITEM OVERLAYS: Show items visually on the scene
     * Call this when items are found/placed in locations
     */
    setItemOverlays(locationSystem) {
        this.itemOverlays = {};
        if (!locationSystem) return;
        // Only show overlays for current scene so basement items disappear in closet and closet items show
        const locations = locationSystem.getAllLocations();
        const sceneId = this.currentScene === 'B' ? 'B' : 'A';
        for (const [locId, location] of Object.entries(locations)) {
            if (location.scene !== sceneId) continue;
            if (location.items && location.items.length > 0) {
                const hitbox = this.clickableLocations[this.currentScene]?.[locId];
                if (hitbox) {
                    // Position items within the hitbox area
                    this.itemOverlays[locId] = location.items.map((item, index) => {
                        // Arrange items in a small grid within the hitbox
                        const itemsPerRow = 3;
                        const itemSize = 20;
                        const spacing = 5;
                        const row = Math.floor(index / itemsPerRow);
                        const col = index % itemsPerRow;
                        
                        return {
                            item: item,
                            x: hitbox.x + col * (itemSize + spacing) + 5,
                            y: hitbox.y + row * (itemSize + spacing) + 5,
                            size: itemSize
                        };
                    });
                }
            }
        }
    }
    
    /**
     * 🐛 DEBUG MODE: Toggle to see hitboxes (for development)
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
    }

    getLocationAt(x, y) {
        const locations = this.clickableLocations[this.currentScene];
        for (const [id, loc] of Object.entries(locations)) {
            if ((loc.width <= 0 || loc.height <= 0)) continue;
            if (x >= loc.x && x <= loc.x + loc.width &&
                y >= loc.y && y <= loc.y + loc.height) {
                return { id, ...loc };
            }
        }
        return null;
    }

    updateHover(x, y) {
        this.hoveredLocation = this.getLocationAt(x, y);
    }

    renderSceneA() {
        const ctx = this.ctx;
        const w = this.logicalWidth;
        const h = this.logicalHeight;

        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, w, h);

        // Draw ceiling with joists, pipes, and ductwork
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, w, 80);
        
        // Ceiling joists (beams)
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 160, 0);
            ctx.lineTo(i * 160, 80);
            ctx.stroke();
        }

        // Pipes and ductwork
        ctx.strokeStyle = '#5a5a5a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(100, 20);
        ctx.lineTo(400, 20);
        ctx.moveTo(500, 30);
        ctx.lineTo(800, 30);
        ctx.stroke();

        // Hanging light bulbs
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(200, 40, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(600, 40, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(1000, 40, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw walls (cinderblock/concrete)
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(0, 80, 30, h - 80); // Left wall
        ctx.fillRect(w - 30, 80, 30, h - 80); // Right wall
        
        // Wall texture (cinderblock pattern)
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 1;
        for (let y = 100; y < h; y += 40) {
            for (let x = 5; x < 25; x += 20) {
                ctx.strokeRect(x, y, 15, 30);
            }
        }
        for (let y = 100; y < h; y += 40) {
            for (let x = w - 25; x < w - 5; x += 20) {
                ctx.strokeRect(x, y, 15, 30);
            }
        }

        // Draw floor (concrete with cracks)
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(30, h - 100, w - 60, 100);
        
        // Floor cracks
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(200, h - 50);
        ctx.lineTo(250, h - 30);
        ctx.moveTo(600, h - 60);
        ctx.lineTo(650, h - 40);
        ctx.moveTo(900, h - 55);
        ctx.lineTo(950, h - 35);
        ctx.stroke();

        // LEFT SIDE: Sump pump pit and furnace area
        // Sump pump pit (round hole in floor)
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(100, h - 50, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Vertical pipes rising from pit
        ctx.fillStyle = '#5a5a5a';
        ctx.fillRect(85, h - 150, 10, 100);
        ctx.fillRect(105, h - 150, 10, 100);

        // Window (upper left)
        ctx.fillStyle = '#4a6a8a';
        ctx.fillRect(50, 30, 80, 50);
        ctx.strokeStyle = '#6a8aaa';
        ctx.lineWidth = 3;
        ctx.strokeRect(50, 30, 80, 50);
        // Window frame
        ctx.strokeStyle = '#8a8a8a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(90, 30);
        ctx.lineTo(90, 80);
        ctx.moveTo(50, 55);
        ctx.lineTo(130, 55);
        ctx.stroke();
        // Daylight/greenery visible
        ctx.fillStyle = '#4a8a4a';
        ctx.fillRect(55, 35, 70, 15);

        // Furnace (large metal box under window)
        ctx.fillStyle = '#5a5a5a';
        ctx.fillRect(100, 400, 100, 150);
        ctx.strokeStyle = '#7a7a7a';
        ctx.lineWidth = 3;
        ctx.strokeRect(100, 400, 100, 150);
        // Furnace access panel
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(140, 450, 60, 80);
        ctx.strokeStyle = '#6a6a6a';
        ctx.lineWidth = 2;
        ctx.strokeRect(140, 450, 60, 80);
        // Duct going up
        ctx.fillStyle = '#6a6a6a';
        ctx.fillRect(130, 300, 40, 100);

        // Stacked clutter near furnace
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(220, 500, 30, 50);
        ctx.fillRect(240, 520, 30, 30);

        // LEFT-CENTER: Metal shelving unit
        ctx.fillStyle = '#6a6a6a';
        // Shelf frame
        ctx.fillRect(250, 150, 10, 430); // Left post
        ctx.fillRect(370, 150, 10, 430); // Right post
        ctx.fillRect(250, 150, 130, 10); // Top
        ctx.fillRect(250, 200, 130, 10); // Middle
        ctx.fillRect(250, 550, 130, 10); // Bottom
        
        // Cardboard boxes on shelves
        ctx.fillStyle = '#8b6f47';
        ctx.fillRect(280, 250, 50, 40);
        ctx.fillRect(340, 250, 50, 40);
        ctx.fillRect(300, 300, 50, 40);
        // Box labels
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.fillText('MISC', 290, 275);
        ctx.fillText('BOOKS', 350, 275);
        ctx.fillText('XMAS', 310, 325);
        
        // Plastic bins
        ctx.fillStyle = '#aaccff';
        ctx.fillRect(260, 350, 60, 50);
        ctx.fillRect(330, 350, 60, 50);
        // Bin lids
        ctx.strokeStyle = '#88aaff';
        ctx.lineWidth = 2;
        ctx.strokeRect(260, 350, 60, 10);
        ctx.strokeRect(330, 350, 60, 10);
        
        // Coiled hose visible
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(320, 420, 20, 0, Math.PI * 2);
        ctx.stroke();

        // CENTER: Workbench
        ctx.fillStyle = '#6b4e3d';
        ctx.fillRect(500, 400, 200, 50);
        ctx.strokeStyle = '#8b6e5d';
        ctx.lineWidth = 3;
        ctx.strokeRect(500, 400, 200, 50);
        
        // Workbench legs
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(510, 450, 15, 100);
        ctx.fillRect(675, 450, 15, 100);
        
        // Pegboard above workbench
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(500, 300, 200, 100);
        ctx.strokeStyle = '#6a6a6a';
        ctx.lineWidth = 2;
        ctx.strokeRect(500, 300, 200, 100);
        // Pegboard holes
        ctx.fillStyle = '#2a2a2a';
        for (let y = 310; y < 390; y += 20) {
            for (let x = 510; x < 690; x += 20) {
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        // Tool silhouettes on pegboard
        ctx.strokeStyle = '#6a6a6a';
        ctx.lineWidth = 3;
        // Hammer
        ctx.beginPath();
        ctx.moveTo(550, 320);
        ctx.lineTo(550, 360);
        ctx.moveTo(540, 320);
        ctx.lineTo(560, 320);
        ctx.stroke();
        // Screwdriver
        ctx.beginPath();
        ctx.moveTo(600, 320);
        ctx.lineTo(600, 360);
        ctx.moveTo(595, 360);
        ctx.lineTo(605, 360);
        ctx.stroke();
        
        // Workbench drawer
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(550, 430, 100, 20);
        ctx.strokeStyle = '#7a6a5a';
        ctx.lineWidth = 2;
        ctx.strokeRect(550, 430, 100, 20);
        // Drawer pull
        ctx.fillStyle = '#8a8a8a';
        ctx.fillRect(595, 435, 10, 10);
        
        // Toolbox and tackle box on bench
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(520, 410, 40, 30);
        ctx.fillRect(570, 410, 30, 20);
        
        // Stool in front of bench
        ctx.fillStyle = '#6a6a6a';
        ctx.fillRect(650, 500, 30, 50);
        ctx.fillRect(640, 500, 50, 10);

        // Floor drain (center foreground)
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.arc(600, h - 40, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#5a5a5a';
        ctx.lineWidth = 3;
        ctx.stroke();
        // Drain grate pattern
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(570 + i * 15, h - 70);
            ctx.lineTo(570 + i * 15, h - 10);
            ctx.moveTo(570, h - 70 + i * 15);
            ctx.lineTo(630, h - 70 + i * 15);
            ctx.stroke();
        }

        // Scattered clutter on floor
        // Boot
        ctx.fillStyle = '#4a3a2a';
        ctx.fillRect(580, h - 60, 30, 40);
        // Ball
        ctx.fillStyle = '#8a4a4a';
        ctx.beginPath();
        ctx.arc(650, h - 30, 15, 0, Math.PI * 2);
        ctx.fill();
        // Rag
        ctx.fillStyle = '#6a6a6a';
        ctx.fillRect(700, h - 50, 40, 20);

        // RIGHT-CENTER: Furniture cluster
        // Armchair
        ctx.fillStyle = '#6b5a4a';
        ctx.fillRect(750, 450, 80, 100);
        ctx.strokeStyle = '#8b7a6a';
        ctx.lineWidth = 2;
        ctx.strokeRect(750, 450, 80, 100);
        // Chair back
        ctx.fillRect(750, 450, 80, 20);
        // Chair arms
        ctx.fillRect(750, 470, 10, 60);
        ctx.fillRect(820, 470, 10, 60);
        
        // Side table
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(840, 480, 40, 40);
        ctx.fillRect(845, 520, 30, 30); // Table leg
        
        // Lamp on table
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(855, 475, 10, 15);
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(860, 470, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Magazine/newspaper stacks
        ctx.fillStyle = '#8a8a8a';
        ctx.fillRect(780, 450, 60, 50);
        ctx.fillRect(790, 440, 40, 10);
        // Text on magazines
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.fillText('NEWS', 790, 470);

        // RIGHT SIDE: Water heater and sink area
        // Water heater (tall tank)
        ctx.fillStyle = '#6a6a6a';
        ctx.fillRect(850, 350, 60, 150);
        ctx.strokeStyle = '#8a8a8a';
        ctx.lineWidth = 3;
        ctx.strokeRect(850, 350, 60, 150);
        // Pipes rising from heater
        ctx.fillStyle = '#5a5a5a';
        ctx.fillRect(860, 250, 8, 100);
        ctx.fillRect(892, 250, 8, 100);
        // Water heater label
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.fillText('HOT', 860, 420);
        
        // Door on right wall
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(920, 200, 60, 200);
        ctx.strokeStyle = '#7a6a5a';
        ctx.lineWidth = 3;
        ctx.strokeRect(920, 200, 60, 200);
        // Door handle
        ctx.fillStyle = '#8a8a8a';
        ctx.beginPath();
        ctx.arc(970, 300, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Utility sink (far right)
        ctx.fillStyle = '#6a6a6a';
        ctx.fillRect(950, 450, 100, 50);
        ctx.strokeStyle = '#8a8a8a';
        ctx.lineWidth = 2;
        ctx.strokeRect(950, 450, 100, 50);
        // Sink basin
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(960, 460, 80, 30);
        // Faucet
        ctx.fillStyle = '#7a7a7a';
        ctx.fillRect(995, 440, 10, 20);
        // Under-sink cabinet
        ctx.fillStyle = '#5a5a5a';
        ctx.fillRect(950, 500, 100, 100);
        ctx.strokeStyle = '#7a7a7a';
        ctx.lineWidth = 2;
        ctx.strokeRect(950, 500, 100, 100);
        // Cabinet door
        ctx.strokeRect(1000, 510, 40, 80);

    }

    renderSceneB() {
        const ctx = this.ctx;
        const w = this.logicalWidth;
        const h = this.logicalHeight;

        // Clear canvas
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, w, h);

        // Draw ceiling with single bulb
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, w, 60);
        
        // Ceiling bulb
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(w / 2, 30, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Light cone from bulb
        ctx.fillStyle = 'rgba(255, 170, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(w / 2, 40);
        ctx.lineTo(0, h);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Draw walls (cinderblock)
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 60, 30, h - 60);
        ctx.fillRect(w - 30, 60, 30, h - 60);
        
        // Wall texture
        ctx.strokeStyle = '#3a3a3a';
        ctx.lineWidth = 1;
        for (let y = 80; y < h; y += 40) {
            for (let x = 5; x < 25; x += 20) {
                ctx.strokeRect(x, y, 15, 30);
            }
        }

        // Door / arrow on left to return to basement (clickable area x < 220)
        ctx.fillStyle = 'rgba(80, 60, 40, 0.9)';
        ctx.fillRect(40, h / 2 - 60, 120, 120);
        ctx.strokeStyle = '#a08050';
        ctx.lineWidth = 3;
        ctx.strokeRect(40, h / 2 - 60, 120, 120);
        ctx.fillStyle = '#e0c080';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('← BASEMENT', 100, h / 2 - 20);
        ctx.font = '12px Arial';
        ctx.fillText('(click to return)', 100, h / 2 + 10);

        // Draw floor (cracked concrete)
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(30, h - 80, w - 60, 80);
        
        // Floor cracks
        ctx.strokeStyle = '#0a0a0a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(200, h - 40);
        ctx.lineTo(250, h - 20);
        ctx.moveTo(400, h - 50);
        ctx.lineTo(450, h - 30);
        ctx.stroke();

        // Staircase structure (diagonal)
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.moveTo(50, 100);
        ctx.lineTo(300, 100);
        ctx.lineTo(300, h);
        ctx.lineTo(50, h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#5a5a5a';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Stair steps
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const y = 100 + i * 30;
            const x = 50 + i * 30;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 30, y);
            ctx.lineTo(x + 30, y + 30);
            ctx.stroke();
        }
        
        // Under-stairs void (dark crawl space)
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.moveTo(100, 300);
        ctx.lineTo(300, 300);
        ctx.lineTo(300, h);
        ctx.lineTo(100, h);
        ctx.closePath();
        ctx.fill();
        // Boxes/debris in crawl space
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(150, 350, 40, 30);
        ctx.fillRect(200, 400, 50, 40);
        ctx.fillRect(120, 450, 60, 50);

        // Old chest freezer (large white/gray box)
        ctx.fillStyle = '#aaaaaa';
        ctx.fillRect(400, 400, 150, 100);
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 3;
        ctx.strokeRect(400, 400, 150, 100);
        // Freezer lid
        ctx.fillStyle = '#999999';
        ctx.fillRect(400, 400, 150, 15);
        // Freezer handle
        ctx.fillStyle = '#666666';
        ctx.fillRect(520, 405, 20, 5);
        
        // Costume trunk (large trunk, often open)
        ctx.fillStyle = '#6b5a4a';
        ctx.fillRect(200, 450, 120, 80);
        ctx.strokeStyle = '#8b7a6a';
        ctx.lineWidth = 3;
        ctx.strokeRect(200, 450, 120, 80);
        // Trunk lid (open, leaning back)
        ctx.fillStyle = '#7b6a5a';
        ctx.beginPath();
        ctx.moveTo(200, 450);
        ctx.lineTo(200, 430);
        ctx.lineTo(320, 430);
        ctx.lineTo(320, 450);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Costume items visible
        ctx.fillStyle = '#ff4a4a';
        ctx.fillRect(210, 460, 20, 30);
        ctx.fillStyle = '#4aff4a';
        ctx.fillRect(240, 460, 20, 30);
        ctx.fillStyle = '#4a4aff';
        ctx.fillRect(270, 460, 20, 30);
        
        // Clothes hamper/basket
        ctx.fillStyle = '#8a8a8a';
        ctx.beginPath();
        ctx.arc(390, 530, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Clothes pile in hamper
        ctx.fillStyle = '#6a6a6a';
        ctx.fillRect(360, 500, 60, 60);
        // Clothes items
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(365, 505, 15, 20);
        ctx.fillRect(385, 510, 15, 25);
        ctx.fillRect(405, 508, 15, 22);
        
        // Old suitcase (vintage, latched)
        ctx.fillStyle = '#7a6a5a';
        ctx.fillRect(300, 550, 60, 40);
        ctx.strokeStyle = '#9a8a7a';
        ctx.lineWidth = 2;
        ctx.strokeRect(300, 550, 60, 40);
        // Suitcase latch
        ctx.fillStyle = '#aaa';
        ctx.fillRect(325, 555, 10, 8);
        
        // Book stacks near freezer
        ctx.fillStyle = '#6b5a4a';
        ctx.fillRect(500, 450, 100, 50);
        ctx.fillRect(510, 440, 80, 10);
        // Book spines
        ctx.fillStyle = '#8a6a4a';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(505 + i * 18, 455, 15, 40);
        }
        
        // Random boxes/jars/cans around freezer
        ctx.fillStyle = '#8b6f47';
        ctx.fillRect(420, 510, 30, 25);
        ctx.fillStyle = '#aaaaaa';
        ctx.beginPath();
        ctx.arc(480, 520, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cccccc';
        ctx.beginPath();
        ctx.arc(520, 515, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Ceiling joists/beams under stairs
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(150, 100);
        ctx.lineTo(150, 300);
        ctx.moveTo(200, 100);
        ctx.lineTo(200, 300);
        ctx.moveTo(250, 100);
        ctx.lineTo(250, 300);
        ctx.stroke();
    }

    render(flashlightSystem = null, characterRenderer = null, game = null) {
        // 🎨 TWO-LAYER RENDERING SYSTEM WITH FLASHLIGHT
        
        // LAYER 1: Clear canvas (logical size so DPR transform is correct)
        this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
        
        // Determine if we need flashlight effect
        const needsFlashlight = flashlightSystem && 
                               flashlightSystem.enabled && 
                               !this.lightsOn && 
                               !this.isDay;
        
        if (needsFlashlight) {
            // FLASHLIGHT MODE: Draw dark scene, then bright scene in circle
            const darkScene = this.getDarkScene();
            const brightScene = this.getBrightScene();
            
            if (darkScene && darkScene.complete) {
                // Draw dark scene in logical space (1280×720)
                this.ctx.drawImage(darkScene, 0, 0, this.logicalWidth, this.logicalHeight);
            } else {
                this.renderPlaceholder();
            }
            
            // Draw character on dark scene
            if (characterRenderer) {
                characterRenderer.render(this.ctx);
            }
            
            // Apply flashlight effect (bright scene in circle)
            if (brightScene && brightScene.complete) {
                flashlightSystem.render(
                    this.ctx, 
                    darkScene, 
                    brightScene, 
                    this.logicalWidth, 
                    this.logicalHeight
                );
                
                // Render other light sources (candles, etc.)
                flashlightSystem.renderLightSources(
                    this.ctx,
                    brightScene,
                    this.logicalWidth,
                    this.logicalHeight
                );
            }
        } else {
            // NORMAL MODE: Background is the <img id="scene-background"> (basement art only).
            this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
            if (game && game.gameState && game.gameState.isGameOver && game.gameState.deathPosition) {
                const pos = game.gameState.deathPosition;
                if (this.defeatedImage && this.defeatedImage.complete && this.defeatedImage.naturalWidth) {
                    const w = 50, h = 80;
                    this.ctx.drawImage(this.defeatedImage, pos.x - w / 2, pos.y - h, w, h);
                }
            } else if (game && game.meters && game.meters.isSleeping && characterRenderer) {
                const pos = { x: characterRenderer.characterX, y: characterRenderer.characterY };
                if (this.sleepImage && this.sleepImage.complete && this.sleepImage.naturalWidth) {
                    const w = 50, h = 80;
                    this.ctx.drawImage(this.sleepImage, pos.x - w / 2, pos.y - h, w, h);
                } else {
                    characterRenderer.render(this.ctx);
                }
            } else if (characterRenderer) {
                characterRenderer.render(this.ctx);
            }
        }
        
        // LAYER 3: Item overlays not drawn on scene (items only visible in inventory panel)
        
        // LAYER 4: Closet scene — draw return-to-basement box on top so it is always visible
        if (this.currentScene === 'B' && this.currentSceneType === 'closet') {
            const ctx = this.ctx;
            const h = this.logicalHeight;
            const boxX = 40, boxY = h / 2 - 60, boxW = 120, boxH = 120;
            ctx.fillStyle = 'rgba(60, 45, 30, 0.92)';
            ctx.fillRect(boxX, boxY, boxW, boxH);
            ctx.strokeStyle = '#c9a227';
            ctx.lineWidth = 4;
            ctx.strokeRect(boxX, boxY, boxW, boxH);
            ctx.fillStyle = '#f0d060';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('← BASEMENT', boxX + boxW / 2, boxY + boxH / 2 - 12);
            ctx.font = '12px Arial';
            ctx.fillStyle = '#d4b830';
            ctx.fillText('(click to return)', boxX + boxW / 2, boxY + boxH / 2 + 14);
        }
        
        // Hover: only show tooltip (zones are invisible — no highlight drawn)
        if (this.hoveredLocation) {
            this.renderHoverTooltipOnly(this.hoveredLocation);
        }
        
        // Calibration overlay only when player presses H (game.showHitboxCalibration)
        if (game && game.showHitboxCalibration === true) {
            this.renderCalibrationOverlay(game);
        }
    }
    
    /**
     * 🎨 PLACEHOLDER: Draws simple colored rectangles when no art exists
     * This will be replaced by the actual background image
     */
    renderPlaceholder() {
        if (this.currentScene === 'A') {
            this.renderSceneAPlaceholder();
        } else {
            this.renderSceneBPlaceholder();
        }
    }
    
    /**
     * 🎨 ITEM OVERLAYS: Draw small item icons on locations
     * Items are only shown in the inventory panel; no item icons on the scene.
     */
    renderItemOverlays() {
        // Intentionally empty: item overlays only in inventory panel
    }
    
    /**
     * 🎯 HOVER: Show only the tooltip (zone rectangles are invisible — no fill or stroke)
     */
    renderHoverTooltipOnly(location) {
        const tooltipText = location.name;
        const tooltipWidth = Math.min(tooltipText.length * 8 + 10, 200);
        const tooltipHeight = 18;
        const tooltipX = location.x;
        const tooltipY = location.y - tooltipHeight - 4;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = '11px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(tooltipText, tooltipX + 5, tooltipY + tooltipHeight / 2);
    }
    
    /**
     * 🐛 CALIBRATION OVERLAY (press H): crosshair at mouse, x/y coords, all hitboxes, highlight under mouse
     */
    renderCalibrationOverlay(game) {
        const ctx = this.ctx;
        const locations = this.clickableLocations[this.currentScene] || {};
        const mx = typeof game.calibrationMouseX === 'number' ? game.calibrationMouseX : 0;
        const my = typeof game.calibrationMouseY === 'number' ? game.calibrationMouseY : 0;
        const lh = this.logicalHeight;
        const lw = this.logicalWidth;

        // Draw all hitboxes (yellow zones so players can see where to click)
        ctx.strokeStyle = 'rgba(255, 220, 0, 0.9)';
        ctx.lineWidth = 2;
        let hoveredLoc = null;
        for (const [locId, loc] of Object.entries(locations)) {
            ctx.strokeRect(loc.x, loc.y, loc.width, loc.height);
            ctx.fillStyle = 'rgba(255, 220, 0, 0.15)';
            ctx.fillRect(loc.x, loc.y, loc.width, loc.height);
            ctx.fillStyle = '#ddbb00';
            ctx.font = '11px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(locId, loc.x + 2, loc.y + 2);
            if (mx >= loc.x && mx <= loc.x + loc.width && my >= loc.y && my <= loc.y + loc.height) {
                hoveredLoc = { id: locId, ...loc };
            }
        }

        // Highlight hitbox under mouse
        if (hoveredLoc) {
            ctx.strokeStyle = 'rgba(0,255,0,0.9)';
            ctx.lineWidth = 2;
            ctx.strokeRect(hoveredLoc.x, hoveredLoc.y, hoveredLoc.width, hoveredLoc.height);
            ctx.fillStyle = 'rgba(0,255,0,0.12)';
            ctx.fillRect(hoveredLoc.x, hoveredLoc.y, hoveredLoc.width, hoveredLoc.height);
            ctx.fillStyle = '#0f0';
            ctx.font = '11px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(hoveredLoc.id, hoveredLoc.x + 2, hoveredLoc.y + 2);
        }

        // Crosshair at mouse
        ctx.beginPath();
        ctx.moveTo(mx - 10, my);
        ctx.lineTo(mx + 10, my);
        ctx.moveTo(mx, my - 10);
        ctx.lineTo(mx, my + 10);
        ctx.strokeStyle = 'rgba(0,255,0,0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Coord text (top-left)
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(10, 10, 160, 28);
        ctx.fillStyle = '#00ff66';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`x:${mx.toFixed(0)} y:${my.toFixed(0)}`, 16, 30);
    }

    /**
     * 🐛 DEBUG HITBOXES: Draw all interactive zones (for development) — kept for any non-game callers
     */
    renderDebugHitboxes() {
        const locations = this.clickableLocations[this.currentScene] || {};
        for (const [locId, loc] of Object.entries(locations)) {
            this.ctx.strokeStyle = 'rgba(255,0,0,0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(loc.x, loc.y, loc.width, loc.height);
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
            this.ctx.fillRect(loc.x, loc.y, loc.width, loc.height);
            this.ctx.fillStyle = '#f00';
            this.ctx.font = '10px monospace';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(locId, loc.x + 2, loc.y + 2);
        }
    }
    
    /**
     * 🎨 PLACEHOLDER: Simple rendering when no art exists (Scene A)
     */
    renderSceneAPlaceholder() {
        // This is the old detailed rendering - keep as fallback/placeholder
        this.renderSceneA();
    }
    
    /**
     * 🎨 PLACEHOLDER: Simple rendering when no art exists (Scene B)
     */
    renderSceneBPlaceholder() {
        // This is the old detailed rendering - keep as fallback/placeholder
        this.renderSceneB();
    }

    getClickableLocations() {
        return this.clickableLocations[this.currentScene];
    }
}
