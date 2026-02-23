/**
 * 7 DAYS... - FLASHLIGHT SYSTEM
 * 
 * 🔦 WHAT IS THIS FILE?
 * This creates the flashlight spotlight effect - a circular light that reveals
 * a bright version of the scene within its radius.
 * 
 * 🎯 HOW IT WORKS:
 * - Draws dark scene normally
 * - Creates a circular mask at mouse/character position
 * - Draws bright scene ONLY inside the mask
 * - Everything outside stays dark
 * 
 * 💡 LIGHT SOURCES:
 * - Flashlight: Follows mouse/character, bright white circle
 * - Candle: Static warm circle around placement
 * - Lantern: Medium warm circle, can be carried
 * - Generator: Full scene brightness
 * - Window (day): Natural light beam (static)
 */

class FlashlightSystem {
    constructor() {
        this.enabled = false; // Is flashlight on?
        this.batteryLevel = 100; // 0-100
        this.batteryDrainRate = 0.5; // Per hour of use
        this.radius = 250; // Full brightness radius
        this.minRadius = 100; // Minimum radius when battery low
        this.followMode = 'hybrid'; // 'mouse', 'character', or 'hybrid'
        this.mouseX = 640;
        this.mouseY = 360;
        this.characterX = 640;
        this.characterY = 500;
        this.characterFacing = 'right';
        this.flickerTimer = 0;
        this.flickerInterval = 0;
        this.lightSources = []; // Other light sources (candles, lanterns, etc.)
    }

    /**
     * 🔦 UPDATE: Drain battery, handle flicker
     */
    update(deltaTime, game) {
        if (!this.enabled) return;

        // Drain battery
        this.batteryLevel = Math.max(0, this.batteryLevel - (this.batteryDrainRate * deltaTime / 3600));
        
        // Turn off if battery dead
        if (this.batteryLevel <= 0) {
            this.enabled = false;
            if (game) {
                game.addMessage('Flashlight battery died.');
            }
        }

        // Handle flicker when battery low
        if (this.batteryLevel < 20) {
            this.flickerTimer += deltaTime;
            if (this.flickerTimer >= this.flickerInterval) {
                this.flickerTimer = 0;
                this.flickerInterval = 0.1 + Math.random() * 0.3; // Random flicker timing
            }
        } else {
            this.flickerTimer = 0;
            this.flickerInterval = 0;
        }
    }

    /**
     * 🔦 SET MOUSE POSITION: For mouse-follow mode
     */
    setMousePosition(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }

    /**
     * 🔦 SET CHARACTER POSITION: For character-follow mode
     */
    setCharacterPosition(x, y, facing = 'right') {
        this.characterX = x;
        this.characterY = y;
        this.characterFacing = facing;
    }

    /**
     * 🔦 GET LIGHT POSITION: Calculate where light should be based on mode
     */
    getLightPosition() {
        if (this.followMode === 'mouse') {
            return { x: this.mouseX, y: this.mouseY };
        } else if (this.followMode === 'character') {
            // Light in front of character
            const offset = this.characterFacing === 'right' ? 100 : -100;
            return { x: this.characterX + offset, y: this.characterY - 50 };
        } else {
            // Hybrid: Character position, but shift toward mouse if mouse is far
            const charPos = { 
                x: this.characterX + (this.characterFacing === 'right' ? 100 : -100), 
                y: this.characterY - 50 
            };
            const mousePos = { x: this.mouseX, y: this.mouseY };
            const distance = Math.sqrt(
                Math.pow(mousePos.x - charPos.x, 2) + 
                Math.pow(mousePos.y - charPos.y, 2)
            );
            
            // If mouse is far, shift light toward it (but not all the way)
            if (distance > 200) {
                const shift = 0.3; // 30% toward mouse
                return {
                    x: charPos.x + (mousePos.x - charPos.x) * shift,
                    y: charPos.y + (mousePos.y - charPos.y) * shift
                };
            }
            return charPos;
        }
    }

    /**
     * 🔦 GET CURRENT RADIUS: Based on battery level
     */
    getCurrentRadius() {
        if (this.batteryLevel <= 0) return 0;
        if (this.batteryLevel >= 50) return this.radius;
        
        // Interpolate between min and max based on battery
        const batteryRatio = this.batteryLevel / 50;
        const currentRadius = this.minRadius + (this.radius - this.minRadius) * batteryRatio;
        
        // Apply flicker when battery low
        if (this.batteryLevel < 20 && this.flickerTimer < this.flickerInterval / 2) {
            return currentRadius * 0.3; // Flicker off
        }
        
        return currentRadius;
    }

    /**
     * 🔦 RENDER FLASHLIGHT: Apply circular mask and draw bright scene
     */
    render(ctx, darkScene, brightScene, canvasWidth, canvasHeight) {
        if (!this.enabled || this.batteryLevel <= 0) return;

        const lightPos = this.getLightPosition();
        const currentRadius = this.getCurrentRadius();

        if (currentRadius <= 0) return;

        // Save context
        ctx.save();

        // Create circular mask
        ctx.beginPath();
        ctx.arc(lightPos.x, lightPos.y, currentRadius, 0, Math.PI * 2);
        ctx.clip();

        // Draw bright scene ONLY inside the circle
        ctx.drawImage(brightScene, 0, 0, canvasWidth, canvasHeight);

        // Add soft edge (gradient falloff)
        const gradient = ctx.createRadialGradient(
            lightPos.x, lightPos.y, currentRadius * 0.7,
            lightPos.x, lightPos.y, currentRadius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Restore context
        ctx.restore();
    }

    /**
     * 🔦 RENDER OTHER LIGHT SOURCES: Candles, lanterns, etc.
     */
    renderLightSources(ctx, brightScene, canvasWidth, canvasHeight) {
        for (const source of this.lightSources) {
            if (!source.enabled) continue;

            ctx.save();
            ctx.beginPath();
            ctx.arc(source.x, source.y, source.radius, 0, Math.PI * 2);
            ctx.clip();

            // Draw bright scene
            ctx.drawImage(brightScene, 0, 0, canvasWidth, canvasHeight);

            // Warm glow (orange/yellow tint)
            const gradient = ctx.createRadialGradient(
                source.x, source.y, source.radius * 0.6,
                source.x, source.y, source.radius
            );
            gradient.addColorStop(0, 'rgba(255, 200, 100, 0)');
            gradient.addColorStop(1, 'rgba(255, 150, 50, 0.4)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.restore();
        }
    }

    /**
     * 🔦 ADD LIGHT SOURCE: Candle, lantern, etc.
     */
    addLightSource(id, x, y, radius, type = 'candle') {
        this.lightSources.push({
            id: id,
            x: x,
            y: y,
            radius: radius,
            type: type,
            enabled: true
        });
    }

    /**
     * 🔦 REMOVE LIGHT SOURCE
     */
    removeLightSource(id) {
        this.lightSources = this.lightSources.filter(s => s.id !== id);
    }

    /**
     * 🔦 TOGGLE FLASHLIGHT
     */
    toggle(game) {
        if (this.batteryLevel <= 0) {
            if (game) game.addMessage('Flashlight battery is dead.');
            return false;
        }
        this.enabled = !this.enabled;
        return true;
    }

    /**
     * 🔦 SET BATTERY LEVEL
     */
    setBattery(level) {
        this.batteryLevel = Math.max(0, Math.min(100, level));
    }

    /**
     * 🔦 GET BATTERY LEVEL
     */
    getBattery() {
        return this.batteryLevel;
    }
}
