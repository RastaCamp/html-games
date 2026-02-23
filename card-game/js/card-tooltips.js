/**
 * =====================================================
 * FUM: SHATTERLAYERS - CARD TOOLTIPS
 * =====================================================
 * 
 * 💡 THE TOOLTIP SYSTEM: Because Hovering Is Informative 💡
 * =====================================================
 * 
 * This system shows helpful tooltips when you hover over cards.
 * It's like having a helpful friend whisper card info in your ear,
 * but without the awkward proximity issues.
 * 
 * Features:
 * - Shows after 0.5 second hover (so it doesn't pop up immediately)
 * - Displays card name, effect, and layer affinity
 * - Disappears when mouse leaves (because we're polite)
 * - Only works on face-up cards (facedown cards are mysterious)
 * 
 * NOVICE NOTE: This is a quality-of-life feature. It helps players
 * understand what cards do without having to memorize everything.
 * It's like training wheels, but for card games!
 * 
 * =====================================================
 */

// =====================================================
// CARD TOOLTIP SYSTEM
// =====================================================
export const CardTooltips = {
    
    tooltipElement: null,
    hoverTimer: null,
    
    /**
     * Initialize Tooltips
     * =====================================================
     * NOVICE NOTE: Sets up tooltip system for all cards
     */
    init: function() {
        // Create tooltip element
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.id = 'card-tooltip';
        this.tooltipElement.className = 'card-tooltip';
        document.body.appendChild(this.tooltipElement);
        
        // Add event listeners to all cards
        document.addEventListener('mouseover', this.handleMouseOver.bind(this), true);
        document.addEventListener('mouseout', this.handleMouseOut.bind(this), true);
    },
    
    /**
     * Handle Mouse Over
     * =====================================================
     * NOVICE NOTE: Shows tooltip after 0.5 second hover
     */
    handleMouseOver: function(e) {
        const card = e.target.closest('.card');
        if (!card || card.classList.contains('facedown')) return;
        
        const cardId = card.dataset.cardId;
        if (!cardId) return;
        
        // Clear existing timer
        if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
        }
        
        // Show tooltip after 0.5 seconds
        this.hoverTimer = setTimeout(() => {
            this.showTooltip(card, cardId);
        }, 500);
    },
    
    /**
     * Handle Mouse Out
     * =====================================================
     * NOVICE NOTE: Hides tooltip when mouse leaves
     */
    handleMouseOut: function(e) {
        const card = e.target.closest('.card');
        if (!card) return;
        
        // Clear timer
        if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
        }
        
        // Hide tooltip
        this.hideTooltip();
    },
    
    /**
     * Show Tooltip
     * =====================================================
     * NOVICE NOTE: Displays card information in tooltip
     */
    showTooltip: function(cardElement, cardId) {
        if (!this.tooltipElement) return;
        
        // Get card data (import getCard from cards.js or use window.getCard if available)
        let card = null;
        if (typeof getCard !== 'undefined') {
            card = getCard(cardId);
        } else if (window.gameInstance && window.gameInstance.getCard) {
            card = window.gameInstance.getCard(cardId);
        } else if (window.getCard) {
            card = window.getCard(cardId);
        }
        if (!card) return;
        
        // Get card position
        const rect = cardElement.getBoundingClientRect();
        
        // Build tooltip content
        const suitSymbols = {
            spades: '♠',
            hearts: '♥',
            diamonds: '♦',
            clubs: '♣'
        };
        
        const rankNames = {
            2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
            11: 'J', 12: 'Q', 13: 'K', 14: 'A'
        };
        
        let effectDesc = 'No effect';
        if (card.effects && card.effects.length > 0) {
            effectDesc = card.effects.map(e => {
                if (e.action === 'damage') return `Deal ${e.value} damage`;
                if (e.action === 'heal') return `Heal ${e.value} HP`;
                if (e.action === 'draw') return `Draw ${e.value} card(s)`;
                if (e.action === 'shield') return `Give +${e.value || 1} Shield`;
                return e.action;
            }).join(', ');
        }
        
        const layerAffinity = card.layerAffinity ? card.layerAffinity.join(', ') : 'All';
        
        this.tooltipElement.innerHTML = `
            <div class="tooltip-header">
                <span class="tooltip-rank-suit">${rankNames[card.rank]}${suitSymbols[card.suit]}</span>
                <span class="tooltip-name">${card.name}</span>
            </div>
            <div class="tooltip-effect">${effectDesc}</div>
            <div class="tooltip-layers">Layer: ${layerAffinity}</div>
        `;
        
        // Position tooltip
        this.tooltipElement.style.left = (rect.left + rect.width / 2) + 'px';
        this.tooltipElement.style.top = (rect.top - 10) + 'px';
        this.tooltipElement.style.transform = 'translate(-50%, -100%)';
        this.tooltipElement.style.display = 'block';
    },
    
    /**
     * Hide Tooltip
     * =====================================================
     * NOVICE NOTE: Hides the tooltip
     */
    hideTooltip: function() {
        if (this.tooltipElement) {
            this.tooltipElement.style.display = 'none';
        }
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.CardTooltips = CardTooltips;
    // Also export getCard helper if available
    if (typeof getCard !== 'undefined') {
        window.getCard = getCard;
    }
}
