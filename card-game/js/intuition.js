/**
 * =====================================================
 * FUM: SHATTERLAYERS - INTUITION SYSTEM
 * =====================================================
 * 
 * 🔮 THE INTUITION SYSTEM: Trust Your Gut! 🔮
 * =====================================================
 * 
 * This is the "viral hook" of the game - the intuition check
 * system. Players guess facedown cards for bonuses. It's like
 * poker face reading, but with more cosmic energy and less
 * actual poker. This creates tense, psychological moments
 * perfect for streaming and viral clips!
 * 
 * How It Works:
 * 1. Opponent selects 3 facedown cards
 * 2. Player guesses which has highest value (or suit)
 * 3. Cards are revealed
 * 4. If correct: Bonus effects! If wrong: Normal resolution
 * 
 * NOVICE NOTE: This system adds a psychological element to
 * the game. It's not just about strategy - it's about
 * reading your opponent and trusting your instincts!
 * 
 * =====================================================
 */

// Intuition System

export class IntuitionSystem {
    constructor() {
        this.active = false;
        this.currentCheck = null;
    }

    triggerCheck(playerId, opponent, gameState) {
        // Opponent selects 3 cards from hand/deck
        const availableCards = [...opponent.hand];
        
        if (availableCards.length < 3) {
            // Draw from deck if needed
            const needed = 3 - availableCards.length;
            const drawn = gameState.shared.drawPile.draw(needed);
            availableCards.push(...drawn);
        }
        
        // Select 3 random cards
        const selectedCards = this.selectRandomCards(availableCards, 3);
        
        this.active = true;
        this.currentCheck = {
            playerId,
            cards: selectedCards,
            opponentId: opponent.id,
            resolved: false
        };
        
        return this.currentCheck;
    }

    selectRandomCards(cards, count) {
        const shuffled = cards.slice().sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, cards.length));
    }

    makeGuess(guessType, guessValue, getCardFn) {
        if (!this.active || !this.currentCheck) {
            return { success: false, message: 'No active intuition check' };
        }

        const { cards } = this.currentCheck;
        let correct = false;
        let result = {};

        if (guessType === 'highest') {
            // Find highest value card
            const highest = cards.reduce((max, card) => {
                const cardData = getCardFn(card);
                return (!max || (cardData && cardData.rank > max.rank)) ? cardData : max;
            }, null);
            
            correct = highest && highest.id === guessValue;
            result.highestCard = highest;
        } else if (guessType === 'suit') {
            // Check if suit appears in selected cards
            correct = cards.some(card => {
                const cardData = getCardFn(card);
                return cardData && cardData.suit === guessValue;
            });
            result.guessedSuit = guessValue;
        }

        this.currentCheck.resolved = true;
        this.currentCheck.correct = correct;
        this.currentCheck.guess = { type: guessType, value: guessValue };

        return {
            success: true,
            correct,
            cards,
            result
        };
    }

    resolveCheck(gameState) {
        if (!this.active || !this.currentCheck || !this.currentCheck.resolved) {
            return null;
        }

        const { playerId, correct, cards } = this.currentCheck;
        const player = gameState.players.find(p => p.id === playerId);

        if (correct) {
            // Apply bonus
            player.intuitionCounters += 1;
            
            // Bonus effects based on intuition counters
            const bonus = this.getIntuitionBonus(player.intuitionCounters);
            
            this.active = false;
            const checkResult = Object.assign({}, this.currentCheck);
            this.currentCheck = null;
            
            return {
                success: true,
                correct: true,
                bonus,
                cards
            };
        } else {
            // Minor penalty or no effect
            this.active = false;
            const checkResult = Object.assign({}, this.currentCheck);
            this.currentCheck = null;
            
            return {
                success: true,
                correct: false,
                bonus: null,
                cards
            };
        }
    }

    getIntuitionBonus(counters) {
        // Bonus effects scale with intuition counters
        if (counters === 1) {
            return { type: 'draw', value: 1 };
        } else if (counters === 2) {
            return { type: 'energy', value: 1 };
        } else if (counters >= 3) {
            return { type: 'attune', value: 1 };
        }
        return null;
    }

    canTrigger(player, gameState) {
        // Check conditions for triggering intuition
        // - Specific card played
        // - Layer shift to 3+
        // - End of turn (random chance)
        // - Player spends Energy
        
        if (player.energy >= 2) {
            return { canForce: true, cost: 2 };
        }
        
        // Random chance at end of turn
        if (Math.random() < 0.2) {
            return { canForce: false, random: true };
        }
        
        return { canForce: false, random: false };
    }

    reset() {
        this.active = false;
        this.currentCheck = null;
    }
}