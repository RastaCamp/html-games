/**
 * =====================================================
 * FUM: SHATTERLAYERS - CARD FLIP ANIMATION
 * =====================================================
 * 
 * 🔄 THE CARD FLIP: Because Flipping Cards Is Satisfying 🔄
 * =====================================================
 * 
 * This system handles the card flip animation - that satisfying
 * 180° rotation when a card goes from face-down to face-up.
 * It's like flipping a coin, but with cards, and way cooler.
 * 
 * The animation:
 * - Rotates 180° on the Y-axis (like a real card flip!)
 * - Takes 0.3 seconds (fast enough to feel snappy, slow enough to see)
 * - Plays a whoosh sound (because sound effects make everything better)
 * - Changes the card content halfway through (the magic moment)
 * 
 * NOVICE NOTE: This is pure visual flair. The game would work
 * without it, but it wouldn't be as satisfying. Sometimes the
 * little things matter!
 * 
 * =====================================================
 */

// =====================================================
// CARD FLIP SYSTEM
// =====================================================
export const CardFlip = {
    
    /**
     * Flip Card Animation
     * =====================================================
     * NOVICE NOTE: Animates card flipping from face-down to face-up
     * 
     * This function makes a card flip over. It's like the reveal
     * moment in a magic trick, but for card games. The card rotates
     * 180° on the Y-axis, and halfway through we swap the content
     * from back to front (or vice versa).
     * 
     * @param {HTMLElement} cardElement - Card DOM element (the card to flip)
     * @param {boolean} toFaceUp - true = flip to face-up, false = flip to face-down
     */
    flip: function(cardElement, toFaceUp = true) {
        // Safety check: if there's no card element, don't do anything
        if (!cardElement) return;
        
        // Play random whoosh sound (because flipping cards should make noise)
        if (window.AudioManager) {
            window.AudioManager.playCardMovement(); // *whoosh* sound
        }
        
        // Add flip animation class (this triggers the CSS animation)
        cardElement.classList.add('card-flipping');
        
        // Halfway through animation, change card content
        // This is the "magic moment" - when the card is edge-on, we swap it
        setTimeout(() => {
            if (toFaceUp) {
                cardElement.classList.remove('facedown'); // Show the face
            } else {
                cardElement.classList.add('facedown');   // Show the back
            }
        }, 150); // Halfway through 300ms animation (150ms = halfway point)
        
        // Remove animation class after completion (clean up)
        setTimeout(() => {
            cardElement.classList.remove('card-flipping');
        }, 300); // After 300ms, the animation is done
    },
    
    /**
     * Reveal Card
     * =====================================================
     * NOVICE NOTE: Flips card from face-down to face-up
     * 
     * @param {HTMLElement} cardElement - Card to reveal
     */
    reveal: function(cardElement) {
        this.flip(cardElement, true);
    },
    
    /**
     * Hide Card
     * =====================================================
     * NOVICE NOTE: Flips card from face-up to face-down
     * 
     * @param {HTMLElement} cardElement - Card to hide
     */
    hide: function(cardElement) {
        this.flip(cardElement, false);
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.CardFlip = CardFlip;
}
