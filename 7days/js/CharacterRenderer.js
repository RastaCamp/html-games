/**
 * CharacterRenderer - Adam sprite and position.
 *
 * Loads sprites from visuals/adam/ (fallback VISUALS/adam/). Draws at half sprite size.
 * Position (characterX, characterY) is updated by Game.updateMoveToTarget(); click-to-move sets target.
 *
 * ANIMATIONS: idle, walk, examine, reach_low, reach_high, drink, eat, crafting, sleep, attack, attacked, defeated, sick_idle_walk.
 * When sleeping, SceneRenderer draws sleep.PNG instead; when game over, SceneRenderer draws defeated.PNG at death position.
 */

class CharacterRenderer {
    constructor() {
        this.sprites = {}; // Cache of loaded images
        this.currentAnimation = 'idle';
        this.currentDirection = 'right'; // 'left' or 'right'
        this.animationTimer = 0;
        this.animationDuration = 0; // How long current animation plays
        this.characterX = 640; // Center of canvas (1280/2)
        this.characterY = 500; // Character base position
        this.isSick = false;
        this.imagesPath = 'visuals/adam/'; // Assets in visuals/; fallback VISUALS/
        // Random facing on start (idle_left or idle_right)
        this.currentDirection = Math.random() < 0.5 ? 'left' : 'right';
        this.currentAnimation = 'idle';
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

    /**
     * 🎭 LOAD SPRITES: Preload all character animations
     */
    async loadSprites() {
        const animations = [
            'idle_left', 'idle_right',
            'walk_left', 'walk_right',
            'examine',
            'reach_low_left', 'reach_low_right',
            'reach_high_left', 'reach_high_right',
            'drink', 'eat',
            'crafting',
            'sleep',
            'attack_left', 'attack_right',
            'attacked_left', 'attacked_right',
            'defeated',
            'sick_idle_walk_left', 'sick_idle_walk_right'
        ];

        const loadPromises = animations.map(name => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    this.sprites[name] = img;
                    resolve();
                };
                img.onerror = () => {
                    const altPath = this.imagesPath.startsWith('visuals/') ? 'VISUALS/adam/' : 'visuals/adam/';
                    const img2 = new Image();
                    img2.onload = () => { this.sprites[name] = img2; resolve(); };
                    img2.onerror = () => { resolve(); };
                    const base = this.getBaseUrl();
                    img2.src = (base || '') + altPath + name + '.PNG';
                };
                const base = this.getBaseUrl();
                const isFile = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
                const path = (isFile ? '' : (base || '')) + this.imagesPath + name + '.PNG';
                img.src = path;
            });
        });

        await Promise.all(loadPromises);
        console.log('Character sprites loaded:', Object.keys(this.sprites).length);
    }

    /**
     * 🎭 SET ANIMATION: Play a specific animation
     */
    setAnimation(animation, direction = null, duration = 2000) {
        // Determine direction if not specified
        if (!direction) {
            direction = this.currentDirection;
        }

        // Handle directional animations
        let animationKey = animation;
        if (animation.includes('_left') || animation.includes('_right')) {
            animationKey = animation;
        } else if (this.needsDirection(animation)) {
            animationKey = `${animation}_${direction}`;
        }

        // Handle sick animations
        if (this.isSick && (animation === 'idle' || animation === 'walk')) {
            animationKey = `sick_idle_walk_${direction}`;
        }

        // Check if sprite exists
        if (!this.sprites[animationKey]) {
            console.warn(`Animation not found: ${animationKey}, using idle`);
            animationKey = `idle_${direction}`;
        }

        this.currentAnimation = animation;
        this.currentDirection = direction;
        this.animationTimer = duration;
        this.animationDuration = duration;
    }

    needsDirection(animation) {
        return ['idle', 'walk', 'reach_low', 'reach_high', 'attack', 'attacked'].includes(animation);
    }

    /**
     * 🎭 UPDATE: Handle animation timing
     */
    update(deltaTime) {
        if (this.animationTimer > 0) {
            this.animationTimer -= deltaTime * 1000; // Convert to milliseconds
            
            // Return to idle when animation completes
            if (this.animationTimer <= 0 && this.currentAnimation !== 'idle' && this.currentAnimation !== 'sleep') {
                this.setAnimation('idle', this.currentDirection, 0);
            }
        }
    }

    /**
     * 🎭 RENDER: Draw character sprite
     */
    render(ctx, mouseX = null, mouseY = null) {
        // Determine facing direction based on mouse or current direction
        if (mouseX !== null) {
            if (mouseX < this.characterX) {
                this.currentDirection = 'left';
            } else {
                this.currentDirection = 'right';
            }
        }

        // Get current sprite
        let spriteKey = this.currentAnimation;
        if (this.needsDirection(this.currentAnimation)) {
            spriteKey = `${this.currentAnimation}_${this.currentDirection}`;
        }

        // Handle sick state
        if (this.isSick && (this.currentAnimation === 'idle' || this.currentAnimation === 'walk')) {
            spriteKey = `sick_idle_walk_${this.currentDirection}`;
        }

        const sprite = this.sprites[spriteKey];
        if (!sprite) {
            // Fallback: try any idle sprite
            const fallback = this.sprites[`idle_${this.currentDirection}`] || 
                           this.sprites['idle_right'] || 
                           this.sprites['idle_left'];
            if (fallback) {
                const w = 25, h = 25;
                ctx.drawImage(fallback, this.characterX - w / 2, this.characterY - h, w, h);
            } else {
                ctx.fillStyle = '#8B7355';
                ctx.beginPath();
                ctx.arc(this.characterX, this.characterY - 10, 9, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#5c4a3a';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(this.characterX - 6, this.characterY - 20, 13, 11);
            }
            return;
        }

        // Draw character at quarter sprite size (half the previous display size); ensure non-zero so drawImage doesn't throw
        const srcW = Math.max(1, sprite.naturalWidth || sprite.width || 100);
        const srcH = Math.max(1, sprite.naturalHeight || sprite.height || 100);
        const spriteWidth = Math.max(1, srcW / 4);
        const spriteHeight = Math.max(1, srcH / 4);
        const drawX = this.characterX - spriteWidth / 2;
        const drawY = this.characterY - spriteHeight;

        ctx.drawImage(sprite, 0, 0, srcW, srcH, drawX, drawY, spriteWidth, spriteHeight);
    }

    /**
     * 🎭 SET POSITION: Move character to interaction point
     */
    setPosition(x, y) {
        this.characterX = x;
        this.characterY = y;
    }

    /**
     * 🎭 SET SICK STATE: Use sick animations when player is sick
     */
    setSick(sick) {
        this.isSick = sick;
    }

    /**
     * 🎭 GET CURRENT ANIMATION: For debugging
     */
    getCurrentAnimation() {
        return this.currentAnimation;
    }
}
