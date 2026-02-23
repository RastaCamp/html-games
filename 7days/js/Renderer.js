/**
 * 7 DAYS... - RENDERER
 * 
 * 🎨 WHAT IS THIS FILE?
 * This draws everything on the screen! The basement, objects, player, etc.
 * It's the "artist" of the game - takes game state and makes it visual.
 * 
 * 🎯 WHAT IT DOES:
 * - Clears the canvas every frame
 * - Draws the basement (floor, walls, objects)
 * - Draws object labels with emojis
 * - Highlights hovered objects
 * - Applies night filter (darker when it's night)
 * 
 * 💡 WANT TO CHANGE GRAPHICS?
 * - Modify renderBasement() to change how basement looks
 * - Modify renderObject() to change how objects look
 * - Add new visual effects (particles, shadows, etc.)
 * 
 * 🎨 CURRENT GRAPHICS:
 * - Placeholder rectangles (colored boxes)
 * - Emoji labels on objects
 * - Simple night filter (dark overlay)
 * - Hover highlighting (yellow border)
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to clear canvas (everything draws on top of old stuff!)
 * - Drawing outside canvas bounds (won't show)
 * - Not updating hover state (hover won't work)
 * 
 * 💡 FUTURE IMPROVEMENTS:
 * - Replace rectangles with actual sprites
 * - Add animations
 * - Add lighting effects
 * - Add particle effects
 */

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.logicalWidth = canvas.logicalWidth ?? 1280;
        this.logicalHeight = canvas.logicalHeight ?? 720;
        this.camera = { x: 0, y: 0 };
        this.hoveredObject = null;
    }

    clear() {
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);
    }

    renderBasement(game) {
        // Use SceneRenderer if available, otherwise fall back to simple rendering
        if (game.sceneRenderer) {
            game.sceneRenderer.render();
            return;
        }
        
        // Fallback: Simple rendering (original code)
        const w = this.logicalWidth;
        const h = this.logicalHeight;
        this.ctx.fillStyle = '#3a3a3a';
        this.ctx.fillRect(0, h - 100, w, 100);
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.fillRect(0, 0, w, 50);
        this.ctx.fillRect(0, 0, 50, h);
        this.ctx.fillRect(w - 50, 0, 50, h);
        
        // Draw objects
        for (const obj of game.interactables.objects) {
            this.renderObject(obj);
        }
        
        // Draw hover highlight
        if (this.hoveredObject) {
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(
                this.hoveredObject.x,
                this.hoveredObject.y,
                this.hoveredObject.width,
                this.hoveredObject.height
            );
        }
    }

    renderObject(obj) {
        this.ctx.fillStyle = obj.color || '#666';
        this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        
        // Draw border
        this.ctx.strokeStyle = '#555';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        
        // Draw label with emoji if available
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'center';
        const label = obj.emoji ? `[${obj.emoji}] ${obj.name}` : obj.name;
        this.ctx.fillText(
            label,
            obj.x + obj.width / 2,
            obj.y - 5
        );
    }

    updateHover(x, y, game) {
        this.hoveredObject = game.interactables.getObjectAt(x, y);
    }

    render(game) {
        this.clear();
        
        // Apply night filter if it's night
        if (game.dayCycle.isNight) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);
        }
        
        this.renderBasement(game);
    }
}
