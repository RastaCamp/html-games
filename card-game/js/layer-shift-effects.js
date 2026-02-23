/**
 * =====================================================
 * FUM: SHATTERLAYERS - LAYER SHIFT VISUAL EFFECTS
 * =====================================================
 * 
 * 🌌 REALITY BENDING VISUALS: Because Layer Shifts Should Look Cool 🌌
 * =====================================================
 * 
 * This system creates screen distortion effects when players
 * shift between layers. Each layer transition has its own
 * unique visual effect, because shifting reality should look
 * impressive, not boring.
 * 
 * The effects:
 * - 1→2: Warm pink pulse with soft blur (emotional transition)
 * - 2→3: Geometric pattern overlay (fractal transition)
 * - 3→4: Gold shimmer with sacred geometry (archetypal transition)
 * - 4→5: Stark contrast flash (conceptual transition)
 * - 5→6: White light explosion (source transition)
 * 
 * NOVICE NOTE: These are pure visual effects. They don't affect
 * gameplay, but they make the game feel more immersive and cool.
 * Sometimes style matters as much as substance!
 * 
 * =====================================================
 */

// =====================================================
// LAYER SHIFT EFFECTS SYSTEM
// =====================================================
export const LayerShiftEffects = {
    
    /**
     * Play Layer Shift Effect
     * =====================================================
     * NOVICE NOTE: Shows visual effect based on layer transition
     * 
     * @param {number} fromLayer - Previous layer (1-6)
     * @param {number} toLayer - New layer (1-6)
     */
    play: function(fromLayer, toLayer) {
        if (!fromLayer || !toLayer) return;
        
        // Create effect overlay
        const effectOverlay = document.createElement('div');
        effectOverlay.className = 'layer-shift-effect';
        effectOverlay.id = 'layer-shift-effect';
        
        // Determine effect type based on transition
        let effectClass = '';
        let effectDuration = 1000;
        
        if (fromLayer === 1 && toLayer === 2) {
            effectClass = 'shift-1-to-2'; // Warm pink pulse, soft blur
        } else if (fromLayer === 2 && toLayer === 3) {
            effectClass = 'shift-2-to-3'; // Geometric pattern overlay
        } else if (fromLayer === 3 && toLayer === 4) {
            effectClass = 'shift-3-to-4'; // Gold shimmer, sacred geometry
        } else if (fromLayer === 4 && toLayer === 5) {
            effectClass = 'shift-4-to-5'; // Stark contrast flash
        } else if (fromLayer === 5 && toLayer === 6) {
            effectClass = 'shift-5-to-6'; // White light explosion
        } else {
            // Generic effect for other transitions
            effectClass = 'shift-generic';
        }
        
        effectOverlay.classList.add(effectClass);
        document.body.appendChild(effectOverlay);
        
        // Remove after animation
        setTimeout(() => {
            if (effectOverlay.parentNode) {
                effectOverlay.remove();
            }
        }, effectDuration);
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.LayerShiftEffects = LayerShiftEffects;
}
