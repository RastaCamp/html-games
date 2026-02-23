/**
 * =====================================================
 * FUM: SHATTERLAYERS - DAMAGE NUMBERS POPUP
 * =====================================================
 * 
 * 💥 FLOATING NUMBERS: Because Big Numbers Are Satisfying 💥
 * =====================================================
 * 
 * This system shows floating damage/healing numbers above cards
 * when they take damage or get healed. It's like those satisfying
 * damage numbers in RPGs, but for a card game. You know, the ones
 * that make you feel powerful even when you're just dealing 2 damage.
 * 
 * Features:
 * - Red numbers for damage (because red = ouch)
 * - Green numbers for healing (because green = good)
 * - Floating animation (they drift upward like balloons, but less fun)
 * - Auto-cleanup (they disappear after 1 second, like magic!)
 * 
 * =====================================================
 */

// =====================================================
// DAMAGE NUMBERS SYSTEM
// =====================================================
export const DamageNumbers = {
    
    /**
     * Show Damage Number
     * =====================================================
     * NOVICE NOTE: Shows floating number above a card
     * 
     * This function creates a floating number that drifts upward
     * and fades out. It's like a visual "ouch" or "yay" depending
     * on whether it's damage or healing.
     * 
     * @param {HTMLElement} targetElement - Element to show number above (the card that got hit/healed)
     * @param {number} amount - Damage/healing amount (how much ouch or yay)
     * @param {string} type - 'damage' or 'heal' (red or green, your choice)
     */
    show: function(targetElement, amount, type = 'damage') {
        // Safety check: if there's no target, don't do anything (because that would be weird)
        if (!targetElement) return;
        
        // Get target position (where the card is on screen)
        const rect = targetElement.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;  // Center horizontally
        const startY = rect.top + rect.height / 2; // Center vertically
        
        // Create number element (the floating text that will drift away)
        const numberEl = document.createElement('div');
        numberEl.className = `damage-number damage-${type}`;
        numberEl.textContent = (type === 'damage' ? '-' : '+') + amount; // Minus for damage, plus for healing
        numberEl.style.position = 'fixed'; // Fixed so it doesn't move with scroll
        numberEl.style.left = startX + 'px';
        numberEl.style.top = startY + 'px';
        numberEl.style.transform = 'translate(-50%, -50%)'; // Center it perfectly
        numberEl.style.zIndex = '10000'; // Make sure it's on top of everything
        numberEl.style.pointerEvents = 'none'; // Can't click it (it's just visual)
        
        // Add it to the page (so people can see it)
        document.body.appendChild(numberEl);
        
        // Play sound (because numbers are more satisfying with sound effects)
        if (window.AudioManager) {
            if (type === 'damage') {
                // Random between punch and magic_attack (variety is the spice of life)
                if (Math.random() < 0.5) {
                    window.AudioManager.playSound('punch.mp3'); // Physical ouch
                } else {
                    window.AudioManager.playMagicAttack(); // Magical ouch
                }
            }
        }
        
        // Animate floating up (the satisfying drift animation)
        setTimeout(() => {
            numberEl.style.transition = 'all 1s ease-out';
            numberEl.style.top = (startY - 50) + 'px'; // Move up 50 pixels
            numberEl.style.opacity = '0'; // Fade out
            numberEl.style.transform = 'translate(-50%, -50%) scale(1.5)'; // Grow bigger as it fades
        }, 50); // Small delay so the element is fully rendered first
        
        // Remove after animation completes (clean up after ourselves)
        setTimeout(() => {
            if (numberEl.parentNode) {
                numberEl.remove(); // Bye bye, floating number!
            }
        }, 1100); // 1.1 seconds total (50ms delay + 1000ms animation)
    },
    
    /**
     * Show Damage
     * =====================================================
     * NOVICE NOTE: Convenience method for damage
     */
    showDamage: function(targetElement, amount) {
        this.show(targetElement, amount, 'damage');
    },
    
    /**
     * Show Healing
     * =====================================================
     * NOVICE NOTE: Convenience method for healing
     */
    showHealing: function(targetElement, amount) {
        this.show(targetElement, amount, 'heal');
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.DamageNumbers = DamageNumbers;
}
