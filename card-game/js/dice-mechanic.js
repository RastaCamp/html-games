/**
 * =====================================================
 * FUM: SHATTERLAYERS - DEPTH DIE MECHANIC
 * =====================================================
 * 
 * 🎲 THE DEPTH DIE: Because Sometimes You Need a Little Chaos 🎲
 * =====================================================
 * 
 * This is an optional d6 (six-sided die) that adds randomness
 * without completely breaking game balance. Think of it as
 * the "spice of life" for your card game - sometimes you
 * roll a 6 and ascend to godhood, sometimes you roll a 1
 * and your next card effect triggers twice (which is also
 * pretty cool, actually).
 * 
 * Effects:
 * 1 = Echo (next effect triggers twice - DOUBLE TROUBLE!)
 * 2 = Distort (opponent's next effect is negated - SUCK IT!)
 * 3 = Energy (gain +1 energy - FREE JUICE!)
 * 4 = Draw (draw 1 card - MORE CARDS!)
 * 5 = Bleed (opponent takes 1 damage - OW!)
 * 6 = Ascend (free layer shift - REALITY BEND!)
 * 
 * =====================================================
 */

// =====================================================
// DEPTH DIE SYSTEM
// =====================================================
export const DepthDie = {
    
    /**
     * Roll the Depth Die (d6)
     * =====================================================
     * NOVICE NOTE: Returns a number 1-6 (it's a die, what did you expect?)
     * 
     * This is the simplest function in the entire codebase.
     * It rolls a die. That's it. No tricks, no gimmicks.
     * Just pure, unadulterated randomness.
     * 
     * @returns {number} - Die result (1-6, because that's how dice work)
     */
    roll: function() {
        // Math.floor(Math.random() * 6) gives us 0-5
        // Add 1 to get 1-6
        // It's like magic, but with math! ✨
        return Math.floor(Math.random() * 6) + 1;
    },
    
    /**
     * Get Effect Name
     * =====================================================
     * NOVICE NOTE: Returns the name of the effect for a die roll
     * @param {number} roll - Die result (1-6)
     * @returns {string} - Effect name
     */
    getEffectName: function(roll) {
        const effects = {
            1: 'Echo',
            2: 'Distort',
            3: 'Energy',
            4: 'Draw',
            5: 'Bleed',
            6: 'Ascend'
        };
        return effects[roll] || 'Unknown';
    },
    
    /**
     * Apply Depth Die Effect
     * =====================================================
     * NOVICE NOTE: Applies the effect based on die roll
     * @param {number} roll - Die result (1-6)
     * @param {Object} player - Player object
     * @param {Object} game - Game instance
     * @returns {Object} - Result object with success and message
     */
    applyEffect: function(roll, player, game) {
        if (!player || !game) {
            return { success: false, message: 'Invalid parameters' };
        }
        
        let result = {
            success: true,
            message: '',
            effect: this.getEffectName(roll)
        };
        
        // The switch statement: where magic happens (or chaos, depending on the roll)
        switch(roll) {
            case 1: // Echo - DOUBLE TROUBLE!
                // Next card effect triggers twice
                // It's like getting two for the price of one, but better!
                player.depthDieEcho = true;
                result.message = 'Echo: Your next card effect will trigger twice!';
                if (game.battleLog) {
                    game.battleLog.add(`🎲 Depth Die: ${result.message}`, 'System');
                }
                break;
                
            case 2: // Distort - SUCK IT, OPPONENT!
                // Opponent's next card effect is negated
                // This is the "no u" of card games
                const opponent = game.getOpponent ? game.getOpponent(player.id) : game.players.find(p => p.id !== player.id);
                if (opponent) {
                    opponent.depthDieDistort = true;
                    result.message = 'Distort: Opponent\'s next card effect is negated!';
                    if (game.battleLog) {
                        game.battleLog.add(`🎲 Depth Die: ${result.message}`, 'System');
                    }
                }
                break;
                
            case 3: // Energy - FREE JUICE!
                // Gain +1 Energy (but don't go over the max, that would be cheating)
                player.energy = Math.min(player.energy + 1, player.maxEnergy || 10);
                result.message = `Energy: Gain +1 Energy (now ${player.energy})!`;
                if (game.battleLog) {
                    game.battleLog.add(`🎲 Depth Die: ${result.message}`, 'System');
                }
                break;
                
            case 4: // Draw - MORE CARDS!
                // Draw 1 card (if the deck isn't empty, because that would be sad)
                if (game.shared && game.shared.drawPile) {
                    const drawn = game.shared.drawPile.draw(1);
                    if (drawn.length > 0) {
                        player.hand.push(drawn[0]);
                        result.message = 'Draw: Draw 1 card!';
                        if (game.battleLog) {
                            game.battleLog.add(`🎲 Depth Die: ${result.message}`, 'System');
                        }
                    } else {
                        result.message = 'Draw: Deck is empty!'; // Sad trombone sound
                    }
                }
                break;
                
            case 5: // Bleed - OW!
                // Opponent takes 1 damage (it's just a flesh wound)
                const opponent2 = game.getOpponent ? game.getOpponent(player.id) : game.players.find(p => p.id !== player.id);
                if (opponent2) {
                    opponent2.hp = Math.max(0, opponent2.hp - 1); // Can't go below 0, that would be weird
                    result.message = 'Bleed: Opponent takes 1 damage!';
                    if (game.battleLog) {
                        game.battleLog.add(`🎲 Depth Die: ${result.message}`, 'System');
                    }
                }
                break;
                
            case 6: // Ascend - REALITY BEND!
                // Free layer shift (+1 layer, no energy cost)
                // This is the big one - free reality manipulation!
                if (player.layer < 6) {
                    const oldLayer = player.layer;
                    player.layer = Math.min(6, player.layer + 1);
                    result.message = `Ascend: Free layer shift to Layer ${player.layer}!`;
                    if (game.battleLog) {
                        game.battleLog.add(`🎲 Depth Die: ${result.message}`, 'System');
                    }
                    // Trigger layer shift effects if they exist (because why not make it flashy?)
                    if (game.shiftPlayerLayer) {
                        game.shiftPlayerLayer(player.id, 1);
                    }
                } else {
                    // Already at Layer 6? Well, here's some energy instead (we're not monsters)
                    result.message = 'Ascend: Already at Layer 6! Gain +1 Energy instead.';
                    player.energy = Math.min(player.energy + 1, player.maxEnergy || 10);
                    if (game.battleLog) {
                        game.battleLog.add(`🎲 Depth Die: ${result.message}`, 'System');
                    }
                }
                break;
        }
        
        return result;
    },
    
    /**
     * Roll and Apply Effect
     * =====================================================
     * NOVICE NOTE: Convenience method that rolls and applies in one call
     * @param {Object} player - Player object
     * @param {Object} game - Game instance
     * @returns {Object} - Result object with roll, effect name, and message
     */
    rollAndApply: function(player, game) {
        const roll = this.roll();
        const result = this.applyEffect(roll, player, game);
        result.roll = roll;
        return result;
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.DepthDie = DepthDie;
}
