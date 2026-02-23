/**
 * =====================================================
 * FUM: SHATTERLAYERS - BATTLE LOG
 * =====================================================
 * 
 * 📜 THE BATTLE LOG: The Story of Your Game 📜
 * =====================================================
 * 
 * This class records everything that happens during a game
 * and displays it in a scrollable log. It's like a history
 * book, but for your card game match. Every card played,
 * every damage dealt, every layer shift - it's all here!
 * 
 * Features:
 * - Real-time event logging (as things happen)
 * - Categorized messages (damage, healing, effects, etc.)
 * - Scrollable display (so you can see what happened)
 * - Auto-cleanup (keeps only last 50 events, prevents memory issues)
 * 
 * NOVICE NOTE: This is just a fancy array that stores messages.
 * When something happens, we add a message. When the log gets
 * too long, we remove old messages. Simple, but effective!
 * 
 * =====================================================
 */

// Battle Log / Event Feed System
// Real-time log of all game events and effects

class BattleLog {
    constructor() {
        this.events = [];
        this.maxEvents = 100; // Keep last 100 events
        this.currentTurn = 1;
        this.currentPhase = '';
    }

    // Log a new event
    log(phase, message, details = {}) {
        const event = {
            turn: this.currentTurn,
            phase: phase || this.currentPhase,
            message: message,
            timestamp: Date.now(),
            details: details
        };
        
        this.events.push(event);
        
        // Trim old events
        if (this.events.length > this.maxEvents) {
            this.events.shift();
        }
        
        // Trigger UI update
        if (this.onEventAdded) {
            this.onEventAdded(event);
        }
        
        return event;
    }

    // Set current turn
    setTurn(turn) {
        this.currentTurn = turn;
    }

    // Set current phase
    setPhase(phase) {
        this.currentPhase = phase;
    }

    // Log card play
    logCardPlay(playerName, cardId, cardName, row, col, getCardFn = null) {
        const suitSymbols = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' };
        let suitSymbol = '';
        let rankName = '';
        
        if (getCardFn && typeof getCardFn === 'function') {
            const card = getCardFn(cardId);
            if (card) {
                suitSymbol = suitSymbols[card.suit] || '';
                rankName = card.rank === 11 ? 'J' : card.rank === 12 ? 'Q' : card.rank === 13 ? 'K' : card.rank === 14 ? 'A' : card.rank;
            }
        }
        
        return this.log('PLAY PHASE', 
            `${playerName} plays ${rankName}${suitSymbol} - ${cardName}`,
            { player: playerName, card: cardId, row, col }
        );
    }

    // Log effect trigger
    logEffect(cardName, effect, target = null) {
        let message = `→ ${effect}`;
        if (target) {
            message += ` on ${target}`;
        }
        return this.log(this.currentPhase, message, { card: cardName, effect, target });
    }

    // Log combat
    logCombat(attackerCard, defenderCard, result) {
        const attackerName = attackerCard.name || attackerCard.id;
        const defenderName = defenderCard.name || defenderCard.id;
        
        let message = `${attackerName} attacks ${defenderName}`;
        if (result.damage) {
            message += `\n→ ${result.damage} damage dealt`;
        }
        if (result.destroyed) {
            message += `\n→ ${result.destroyed} destroyed`;
        }
        if (result.barrier) {
            message += `\n→ Barrier absorbs ${result.barrier} damage`;
        }
        
        return this.log('COMBAT PHASE', message, { attacker: attackerCard.id, defender: defenderCard.id, result });
    }

    // Log damage
    logDamage(target, amount, source = null) {
        let message = `${target} takes ${amount} damage`;
        if (source) {
            message += ` from ${source}`;
        }
        return this.log(this.currentPhase, message, { target, amount, source });
    }

    // Log healing
    logHeal(target, amount) {
        return this.log(this.currentPhase, `${target} heals ${amount} HP`, { target, amount });
    }

    // Log barrier creation
    logBarrier(cardName, amount = 1) {
        return this.log(this.currentPhase, `→ Barrier token created on ${cardName}`, { card: cardName, amount });
    }

    // Log card draw
    logDraw(playerName, count) {
        return this.log('DRAW PHASE', `${playerName} draws ${count} card(s)`, { player: playerName, count });
    }

    // Log ability phase
    logAbilityPhase(suit) {
        const suitNames = { spades: 'Spades', hearts: 'Hearts', diamonds: 'Diamonds', clubs: 'Clubs' };
        return this.log('ABILITY PHASE', `Resolving ${suitNames[suit]} abilities...`, { suit });
    }

    // Log intuition check
    logIntuitionCheck(playerName, result) {
        if (result.correct) {
            return this.log('INTUITION PHASE', `${playerName} guessed correctly! Bonus effect triggered.`, { player: playerName, result });
        } else {
            return this.log('INTUITION PHASE', `${playerName} guessed incorrectly.`, { player: playerName, result });
        }
    }

    // Log attunement
    logAttunement(playerName, count) {
        return this.log(this.currentPhase, `${playerName} attunes! (${count}/4)`, { player: playerName, count });
    }

    // Get recent events
    getRecent(count = 10) {
        return this.events.slice(-count);
    }

    // Clear log
    clear() {
        this.events = [];
        this.currentTurn = 1;
        this.currentPhase = '';
    }

    // Get formatted log text
    getFormattedLog() {
        return this.events.map(event => {
            const phaseLabel = event.phase ? `[TURN ${event.turn} - ${event.phase}]` : `[TURN ${event.turn}]`;
            return `${phaseLabel}\n${event.message}`;
        }).join('\n\n');
    }
}

// Export for use in game
export { BattleLog };
