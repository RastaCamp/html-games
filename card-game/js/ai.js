/**
 * =====================================================
 * FUM: SHATTERLAYERS - AI OPPONENT
 * =====================================================
 * 
 * 🤖 THE AI: Your Robotic Rival 🤖
 * =====================================================
 * 
 * This class handles the AI opponent - the computer player
 * that you battle against in practice and campaign modes.
 * It's like playing against a friend, but the friend is
 * a computer algorithm that never gets tired or needs snacks.
 * 
 * Difficulty Levels:
 * - 1: Novice (random plays, like a confused beginner)
 * - 2: Adept (basic strategy, knows what cards do)
 * - 3: Veteran (optimized plays, actually tries to win)
 * - 4: Master (predictive, reads your moves)
 * - 5: Source (cheats, knows your hand - the ultimate challenge!)
 * 
 * NOVICE NOTE: The AI uses a decision tree to choose moves.
 * It evaluates possible actions, scores them, and picks the
 * best one (or a random one, depending on difficulty).
 * 
 * =====================================================
 */

// AI Opponent

import { getCard } from './cards.js';
import { canPlayCardInLayer } from './layers.js';

export class AIOpponent {
    constructor(difficulty, game) {
        this.difficulty = difficulty; // 1-5
        this.game = game;
        this.patterns = [];
        this.memory = {
            playerHand: [],
            playerLayer: 1,
            playerStrategy: 'unknown'
        };
    }

    makeMove(gameState) {
        const player = gameState.getCurrentPlayer();
        if (player.id !== 2) return null;

        // Evaluate all possible moves
        const moves = this.generateMoves(gameState);
        if (moves.length === 0) return null;

        // Score each move
        const scoredMoves = moves.map(move => ({
            move,
            score: this.evaluateMove(move, gameState)
        }));

        // Sort by score
        scoredMoves.sort((a, b) => b.score - a.score);

        // Add randomness based on difficulty
        const randomness = (6 - this.difficulty) * 0.1; // Higher difficulty = less random
        if (Math.random() < randomness && scoredMoves.length > 1) {
            // Pick from top 3 moves randomly
            const topMoves = scoredMoves.slice(0, Math.min(3, scoredMoves.length));
            return topMoves[Math.floor(Math.random() * topMoves.length)].move;
        }

        return scoredMoves[0].move;
    }

    generateMoves(gameState) {
        const player = gameState.getCurrentPlayer();
        const moves = [];

        // Generate play moves
        const emptySlots = gameState.board.getEmptySlots(player.id);
        for (const cardId of player.hand) {
            const card = getCard(cardId);
            if (!card) continue;

            // Check layer compatibility
            if (!canPlayCardInLayer(card, player.layer)) continue;

            // Try each empty slot
            for (const slot of emptySlots) {
                moves.push({
                    type: 'play',
                    playerId: player.id,
                    cardId,
                    row: slot.row,
                    col: slot.col
                });
            }
        }

        // Generate layer shift moves
        if (player.layer < 6) {
            moves.push({
                type: 'shift',
                playerId: player.id,
                direction: 1
            });
        }
        if (player.layer > 1) {
            moves.push({
                type: 'shift',
                playerId: player.id,
                direction: -1
            });
        }

        // Skip move (don't play anything)
        moves.push({
            type: 'skip',
            playerId: player.id
        });

        return moves;
    }

    evaluateMove(move, gameState) {
        let score = 0;
        const player = gameState.getCurrentPlayer();
        const opponent = gameState.getOpponent(player.id);

        // Win condition check
        if (this.wouldWin(move, gameState)) {
            return 1000;
        }

        // Prevent loss
        if (this.wouldPreventLoss(move, gameState)) {
            score += 500;
        }

        // Attunement progress
        if (this.advancesAttunement(move, gameState)) {
            score += 50 * this.difficulty;
        }

        // Layer advantage
        if (move.type === 'shift') {
            score += this.evaluateLayerShift(move, gameState);
        }

        // Card value
        if (move.type === 'play') {
            const card = getCard(move.cardId);
            if (card) {
                score += this.evaluateCard(card, move, gameState);
            }
        }

        // Board position
        if (move.type === 'play') {
            score += this.evaluatePosition(move, gameState);
        }

        // Defense
        if (player.hp < opponent.hp) {
            score += this.evaluateDefense(move, gameState) * 2;
        }

        // Add difficulty-based adjustments
        score *= (0.8 + this.difficulty * 0.1);

        return score;
    }

    wouldWin(move, gameState) {
        // Check if move would win the game
        const player = gameState.getCurrentPlayer();
        const opponent = gameState.getOpponent(player.id);

        if (move.type === 'play') {
            const card = getCard(move.cardId);
            if (card && card.rank === 14) { // Ace
                // Check if ace effect would win
                // Simplified check
            }
        }

        // Check if move would reduce opponent HP to 0
        // Check if move would give 4th attunement
        return false;
    }

    wouldPreventLoss(move, gameState) {
        const player = gameState.getCurrentPlayer();
        const opponent = gameState.getOpponent(player.id);

        // Check if opponent can win next turn
        // Simplified - would need full game state analysis
        return false;
    }

    advancesAttunement(move, gameState) {
        // Check if move helps with waypoint attunement
        if (move.type === 'play') {
            const card = getCard(move.cardId);
            const waypoint = gameState.shared.waypoint;
            if (card && waypoint) {
                const waypointCard = getCard(waypoint);
                if (waypointCard && card.suit === waypointCard.suit) {
                    return true;
                }
            }
        }
        return false;
    }

    evaluateLayerShift(move, gameState) {
        const player = gameState.getCurrentPlayer();
        const newLayer = player.layer + move.direction;
        let score = 0;

        // Check hand compatibility with new layer
        const compatibleCards = player.hand.filter(cardId => {
            const card = getCard(cardId);
            return card && canPlayCardInLayer(card, newLayer);
        }).length;

        score += compatibleCards * 10;

        // Layer-specific bonuses
        if (newLayer === 4) {
            // Archetypal - good for entities
            const entityCount = player.hand.filter(cardId => {
                const card = getCard(cardId);
                return card && card.type === 'entity';
            }).length;
            score += entityCount * 15;
        }

        return score;
    }

    evaluateCard(card, move, gameState) {
        let score = 0;

        // Base value
        score += card.rank;

        // Type value
        if (card.type === 'entity') {
            score += 20;
        } else if (card.type === 'artifact') {
            score += 30;
        }

        // Suit value (based on current strategy)
        const strategy = this.determineStrategy(gameState);
        if (strategy === 'aggro' && card.suit === 'spades') {
            score += 15;
        } else if (strategy === 'control' && card.suit === 'clubs') {
            score += 15;
        } else if (strategy === 'combo' && card.suit === 'diamonds') {
            score += 15;
        } else if (strategy === 'balance' && card.suit === 'hearts') {
            score += 15;
        }

        // Layer affinity bonus
        const player = gameState.getCurrentPlayer();
        if (card.layerAffinity.includes(player.layer)) {
            score += 10;
        }

        return score;
    }

    evaluatePosition(move, gameState) {
        let score = 0;
        const { row, col } = move;

        // Prefer action slots for offensive cards
        const card = getCard(move.cardId);
        if (card && (card.suit === 'spades' || card.type === 'entity')) {
            if (col === 1) { // Action column
                score += 10;
            }
        }

        // Prefer self slots for defensive cards
        if (card && (card.suit === 'clubs' || card.suit === 'hearts')) {
            if (col === 0) { // Self column
                score += 10;
            }
        }

        // Prefer outcome slots for combo cards
        if (card && card.suit === 'diamonds') {
            if (col === 2) { // Outcome column
                score += 10;
            }
        }

        return score;
    }

    evaluateDefense(move, gameState) {
        let score = 0;
        const card = getCard(move.cardId);

        if (card) {
            // Defensive cards
            if (card.suit === 'clubs' || card.suit === 'hearts') {
                score += 20;
            }

            // Healing effects
            if (card.effects) {
                const hasHeal = card.effects.some(e => e.action === 'heal');
                if (hasHeal) {
                    score += 15;
                }
            }
        }

        return score;
    }

    determineStrategy(gameState) {
        const player = gameState.getCurrentPlayer();
        const hand = player.hand.map(id => getCard(id)).filter(Boolean);

        const suits = {
            spades: hand.filter(c => c.suit === 'spades').length,
            hearts: hand.filter(c => c.suit === 'hearts').length,
            diamonds: hand.filter(c => c.suit === 'diamonds').length,
            clubs: hand.filter(c => c.suit === 'clubs').length
        };

        const maxSuit = Object.entries(suits).reduce((a, b) => suits[a[0]] > suits[b[0]] ? a : b)[0];

        if (maxSuit === 'spades') return 'aggro';
        if (maxSuit === 'clubs') return 'control';
        if (maxSuit === 'diamonds') return 'combo';
        return 'balance';
    }

    chooseCardToKeep(drawn, player) {
        // Choose which card to keep from drawn cards
        const cards = drawn.map(id => getCard(id)).filter(Boolean);
        
        // Simple strategy: keep highest rank
        let best = cards[0];
        for (const card of cards) {
            if (card.rank > best.rank) {
                best = card;
            }
        }
        
        return best.id;
    }

    makeIntuitionGuess(cards) {
        // AI makes intuition guess based on difficulty
        const accuracy = 0.25 + (this.difficulty - 1) * 0.15; // 25% to 85%
        
        if (Math.random() < accuracy) {
            // Correct guess
            const highest = cards.reduce((max, cardId) => {
                const card = getCard(cardId);
                return (!max || (card && card.rank > max.rank)) ? card : max;
            }, null);
            return { type: 'highest', value: highest ? highest.id : cards[0] };
        } else {
            // Random guess
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            return { type: 'highest', value: randomCard };
        }
    }
}