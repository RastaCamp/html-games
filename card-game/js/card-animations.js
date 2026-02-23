/**
 * =====================================================
 * FUM: SHATTERLAYERS - CARD ANIMATIONS
 * =====================================================
 * 
 * Handles all visual animations when cards are played
 * =====================================================
 */

// =====================================================
// CARD ANIMATIONS SYSTEM
// =====================================================
export const CardAnimations = {
    
    /**
     * Play Random Animation
     * =====================================================
     * NOVICE NOTE: Chooses and plays an animation based on card
     * 
     * @param {HTMLElement} cardElement - The card DOM element
     * @param {Object} cardData - Card data object
     */
    playRandomAnimation: function(cardElement, cardData) {
        if (!cardElement || !cardData) return;
        
        // Choose animation based on card rank
        let animationType;
        const rank = cardData.rank || 0;
        const suit = cardData.suit || '';
        
        if (rank <= 5) {
            // Common cards (2-5): Simple flash
            animationType = 'flash';
        } else if (rank <= 9) {
            // Uncommon cards (6-9): Pulse
            animationType = 'pulse';
        } else if (rank === 11 || rank === 12 || rank === 13) {
            // Face cards (J/Q/K): 360 spin
            animationType = 'spin';
        } else if (rank === 14) {
            // Aces: Golden glow
            animationType = 'glow';
        } else {
            // Random for everything else
            const animations = ['flash', 'pulse', 'tilt', 'bounce'];
            animationType = animations[Math.floor(Math.random() * animations.length)];
        }
        
        // Suit-based variations
        if (suit === 'hearts') {
            // Hearts: Bounce (lighthearted)
            if (Math.random() < 0.5) animationType = 'bounce';
        } else if (suit === 'spades') {
            // Spades: Shake (aggressive)
            if (Math.random() < 0.5) animationType = 'shake';
        } else if (suit === 'diamonds') {
            // Diamonds: Float (mystical)
            if (Math.random() < 0.5) animationType = 'float';
        } else if (suit === 'clubs') {
            // Clubs: Phase (defensive)
            if (Math.random() < 0.5) animationType = 'phase';
        }
        
        // Apply the animation
        this.applyAnimation(cardElement, animationType);
    },
    
    /**
     * Apply Animation
     * =====================================================
     * NOVICE NOTE: Applies a specific animation to a card element
     * 
     * @param {HTMLElement} element - Card DOM element
     * @param {string} type - Animation type
     */
    applyAnimation: function(element, type) {
        if (!element) return;
        
        // Add animation class
        element.classList.add(`card-animate-${type}`);
        
        // Remove animation class after it completes
        setTimeout(() => {
            element.classList.remove(`card-animate-${type}`);
        }, 600);
    },
    
    /**
     * Play Destroy Animation
     * =====================================================
     * NOVICE NOTE: Plays shatter/fade animation when card is destroyed
     * 
     * @param {HTMLElement} cardElement - Card to destroy
     */
    playDestroyAnimation: function(cardElement) {
        if (!cardElement) return;
        
        // Add destroy animation
        cardElement.classList.add('card-destroy');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (cardElement.parentNode) {
                cardElement.style.opacity = '0';
                cardElement.style.transform = 'scale(0) rotate(720deg)';
                setTimeout(() => {
                    if (cardElement.parentNode) {
                        cardElement.parentNode.removeChild(cardElement);
                    }
                }, 300);
            }
        }, 500);
    },
    
    /**
     * Play Slide Animation
     * =====================================================
     * NOVICE NOTE: Slides card from hand to grid position
     * 
     * @param {HTMLElement} cardElement - Card element
     * @param {number} startX - Starting X position
     * @param {number} startY - Starting Y position
     * @param {number} endX - Ending X position
     * @param {number} endY - Ending Y position
     */
    playSlideAnimation: function(cardElement, startX, startY, endX, endY) {
        if (!cardElement) return;
        
        // Get card position
        const rect = cardElement.getBoundingClientRect();
        const actualStartX = startX || rect.left;
        const actualStartY = startY || rect.top;
        
        // Clone card for animation
        const clone = cardElement.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = actualStartX + 'px';
        clone.style.top = actualStartY + 'px';
        clone.style.width = rect.width + 'px';
        clone.style.height = rect.height + 'px';
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        clone.classList.add('card-slide-clone');
        
        document.body.appendChild(clone);
        
        // Hide original temporarily
        cardElement.style.opacity = '0';
        
        // Animate clone to target
        requestAnimationFrame(() => {
            clone.style.left = endX + 'px';
            clone.style.top = endY + 'px';
            clone.style.transform = 'scale(0.8)';
        });
        
        // Remove clone and show original
        setTimeout(() => {
            if (clone.parentNode) {
                document.body.removeChild(clone);
            }
            cardElement.style.opacity = '1';
        }, 350);
    },
    
    /**
     * Play Card Play Animation
     * =====================================================
     * NOVICE NOTE: Main function called when card is played
     * Combines slide + random animation
     * 
     * @param {HTMLElement} cardElement - Card being played
     * @param {Object} cardData - Card data
     * @param {HTMLElement} targetSlot - Target grid slot
     */
    playCardPlayAnimation: function(cardElement, cardData, targetSlot) {
        if (!cardElement || !targetSlot) return;
        
        // Get positions
        const cardRect = cardElement.getBoundingClientRect();
        const slotRect = targetSlot.getBoundingClientRect();
        
        // Play slide animation
        this.playSlideAnimation(
            cardElement,
            cardRect.left,
            cardRect.top,
            slotRect.left + slotRect.width / 2,
            slotRect.top + slotRect.height / 2
        );
        
        // After slide, play random animation on the card in its new position
        setTimeout(() => {
            const newCardElement = targetSlot.querySelector('.card');
            if (newCardElement && cardData) {
                this.playRandomAnimation(newCardElement, cardData);
            }
        }, 350);
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.CardAnimations = CardAnimations;
}
