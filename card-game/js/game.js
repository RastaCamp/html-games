/**
 * =====================================================
 * FUM: SHATTERLAYERS - CORE GAME ENGINE
 * =====================================================
 * 
 * 🎮 THE BRAIN OF THE OPERATION 🎮
 * =====================================================
 * 
 * This is the main Game class - the heart and soul of the entire
 * game. It manages players, turns, phases, combat, and basically
 * everything that makes the game actually work. Without this class,
 * you'd just have a bunch of pretty pictures and no way to play.
 * 
 * Think of it like the conductor of an orchestra, but instead of
 * musicians, it's coordinating cards, players, and reality-bending
 * mechanics. Much cooler, right?
 * 
 * =====================================================
 */

// Core Game Engine

import { Deck } from './deck.js';
import { Board } from './board.js';
import { IntuitionSystem } from './intuition.js';
import { getCard, CARD_DATABASE } from './cards.js';
import { shiftLayer, getLayer, canPlayCardInLayer, applyLayerEffects } from './layers.js';
import { UIManager } from './ui.js';
import { AIOpponent } from './ai.js';
import { CampaignMode } from './campaign-new.js';
import { BattleLog } from './battlelog.js';

export class Game {
    /**
     * Constructor - Creates a new game instance
     * =====================================================
     * NOVICE NOTE: This runs when you create a new Game()
     * 
     * This is like setting up a new game board - we create
     * all the empty containers and prepare everything, but
     * we don't actually start playing until initialize() is called.
     * It's the difference between having a deck of cards and
     * actually shuffling and dealing them.
     */
    constructor() {
        this.players = [];           // Array of player objects (usually 2)
        this.currentPlayer = 1;      // Which player's turn it is (1 or 2)
        this.turn = 1;               // Current turn number (starts at 1, goes up)
        this.phase = 'menu';         // Current phase (menu, draw, play, combat, etc.)
        this.board = new Board();    // The game board (the 3x3 grids)
        this.intuition = new IntuitionSystem(); // The intuition check system
        this.battleLog = new BattleLog();      // The battle log (records what happened)
        this.shared = {
            drawPile: null,          // The deck (all cards face-down)
            discardPile: [],         // Discarded cards (face-up)
            waypoint: null,          // The waypoint card (for attunement)
            reveal: []               // Shared reveal zone (face-up cards)
        };
        // Don't initialize UI until game starts (because we're polite like that)
        this.ui = null;              // UI manager (handles visual updates)
        this.ai = null;              // AI opponent (if playing vs CPU)
        this.gameMode = null;        // Current game mode (practice, campaign, etc.)
        this.winner = null;          // Winner of the game (null until someone wins)
        this.campaign = null;        // Campaign mode instance (if in campaign)
        this.tutorialStepsSeen = {}; // Which tutorial guidance modals have been shown this game
    }

    /** True when playing Tutorial (practice, difficulty 1). */
    isTutorial() {
        return this.gameMode === 'practice' && this.ai && this.ai.difficulty === 1;
    }

    /** Called when the player completes a tutorial step (e.g. placed card, ended turn). Auto-advances the step modal. */
    onTutorialStepCompleted(action) {
        if (!this.isTutorial() || !this.ui) return;
        if (action === 'card_placed' && this.tutorialStepIndex === 1) {
            this.ui.removeTutorialStepModal();
            this.tutorialStepIndex = 2;
            this.ui.showTutorialStepModal(2, {
                onBack: () => {
                    this.ui.showTutorialStepModal(1, {
                        onBack: () => {},
                        onNext: () => { this.ui.removeTutorialStepModal(); }
                    });
                },
                onNext: () => { this.ui.removeTutorialStepModal(); }
            });
        } else if (action === 'end_turn' && this.tutorialStepIndex === 2) {
            this.ui.removeTutorialStepModal();
            this.tutorialStepIndex = 3;
        }
    }

    /**
     * Initialize - Sets up a new game
     * =====================================================
     * NOVICE NOTE: This actually starts the game
     * 
     * This is where the magic happens - we set up players,
     * shuffle the deck, deal cards, and get everything ready
     * for the first turn. It's like the "New Game" button,
     * but in code form.
     * 
     * @param {string} mode - Game mode ('practice', 'campaign', 'versus')
     * @param {number} difficulty - AI difficulty (1-5, only for practice mode)
     * @param {number} chapter - Tutorial chapter (only for tutorial mode)
     * @param {string} startBoardId - When in campaign, start this board immediately (skip intro/selection)
     */
    initialize(mode = 'practice', difficulty = 2, chapter = null, startBoardId = null) {
        this.gameMode = mode;
        
        // Load Depth Die setting from localStorage (because we remember your preferences)
        const savedDepthDie = localStorage.getItem('fumDepthDieEnabled');
        if (savedDepthDie !== null && window.GAME_CONFIG) {
            window.GAME_CONFIG.EXPANSIONS.depthDie = savedDepthDie === 'true';
        }
        
        // Initialize battle log (so we can track what's happening)
        if (this.battleLog) {
            this.battleLog.setTurn(this.turn);
            this.battleLog.setPhase(this.phase);
        }
        
        // Initialize UI if not already done
        if (!this.ui) {
            this.ui = new UIManager(this);
        }
        
        // Initialize campaign if needed
        if (mode === 'campaign') {
            this.campaign = new CampaignMode(this);
            window.campaignMode = this.campaign;
            
            // Starting a specific board from BEGIN BATTLE: set current board and do not show intro/selection
            if (startBoardId) {
                const board = this.campaign.boards.find(b => b.id === startBoardId);
                if (board) this.campaign.currentBoard = board;
            } else if (!this.campaign.progress.completedBoards.length && !chapter) {
                // First time - show intro
                setTimeout(() => this.campaign.showCampaignIntro(), 500);
            } else if (chapter) {
                // Specific board requested (e.g. from campaign flow)
                this.campaign.startBoard(chapter);
            } else {
                // Show board selection
                setTimeout(() => this.campaign.showBoardSelection(), 500);
            }
        }
        
        // Create decks
        this.shared.drawPile = new Deck();
        
        // Create players
        this.players = [
            {
                id: 1,
                hp: 20,
                maxHp: 20,
                layer: 1,
                energy: 3,
                maxEnergy: 10,
                attunements: 0,
                hand: [],
                discard: [],
                intuitionCounters: 0,
                sourceFade: 0
            },
            {
                id: 2,
                hp: 20,
                maxHp: 20,
                layer: 1,
                energy: 3,
                maxEnergy: 10,
                attunements: 0,
                hand: [],
                discard: [],
                intuitionCounters: 0,
                sourceFade: 0
            }
        ];

        // Initialize AI if needed
        if (mode === 'practice' || mode === 'campaign') {
            this.ai = new AIOpponent(difficulty, this);
            if (mode === 'practice' && difficulty === 1) this.tutorialStepIndex = 0;
        } else if (mode === 'simulation') {
            const simDifficulty = typeof difficulty === 'number' ? difficulty : 2;
            this.ai1 = new AIOpponent(simDifficulty, this);
            this.ai2 = new AIOpponent(simDifficulty, this);
        }

        // Deal opening hands
        this.dealOpeningHands();
        
        // Set waypoint
        const waypointCard = this.shared.drawPile.draw(1)[0];
        this.shared.waypoint = waypointCard;
        
        // Initialize shared reveal
        this.shared.reveal = this.shared.drawPile.draw(4);
        
        // Random first player
        this.currentPlayer = Math.random() < 0.5 ? 1 : 2;
        
        this.phase = 'sync';
        this.turn = 1;
        
        this.ui.initialize();
        this.startTurn();
    }

    dealOpeningHands() {
        for (const player of this.players) {
            player.hand = this.shared.drawPile.draw(5);
        }
    }

    startTurn() {
        const player = this.getCurrentPlayer();
        
        // Reset energy (gain +1 per turn)
        player.energy = Math.min(player.energy + 1, player.maxEnergy);
        
        // Apply source fade if active
        if (player.sourceFade > 0) {
            player.sourceFade -= 1;
        }
        
        this.phase = 'sync';
        this.ui.updateDisplay();
        
        if (this.isCPUTurn()) {
            setTimeout(() => this.processCPUTurn(), 1000);
        } else {
            // Human turn: advance from sync to draw so the draw-phase UI runs
            setTimeout(() => this.syncPhase(), 300);
        }
    }

    endTurn() {
        const player = this.getCurrentPlayer();
        
        // Resolve end of turn effects (before switching players)
        if (this.battleLog) {
            this.battleLog.setPhase('END PHASE');
        }
        this.resolvePhaseEffects('endOfTurn');
        
        // Discard to 7 cards
        while (player.hand.length > 7) {
            const discarded = player.hand.pop();
            player.discard.push(discarded);
        }
        
        // Check waypoint attunement
        this.checkWaypointAttunement(player);
        
        // Random intuition check chance
        const intuitionCheck = this.intuition.canTrigger(player, this);
        if (intuitionCheck.random) {
            // Trigger random intuition check
            setTimeout(() => this.triggerIntuitionCheck(), 500);
        }
        
        // Switch players
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.turn += 1;
        
        // Update battle log turn
        if (this.battleLog) {
            this.battleLog.setTurn(this.turn);
        }
        
        this.startTurn();
    }

    // Turn Phases
    syncPhase() {
        // Player can choose to shift layers
        // For now, auto-advance to draw phase
        this.phase = 'draw';
        this.drawPhase();
    }

    drawPhase() {
        const player = this.getCurrentPlayer();
        
        // Roll Depth Die if enabled (at start of draw phase)
        // Check both config and localStorage for setting
        const savedDepthDie = localStorage.getItem('fumDepthDieEnabled');
        const depthDieEnabled = savedDepthDie !== null ? savedDepthDie === 'true' : 
                                (window.GAME_CONFIG && window.GAME_CONFIG.EXPANSIONS.depthDie);
        
        if (depthDieEnabled && typeof DepthDie !== 'undefined') {
            // Roll for both players, but only show UI message for human player
            const diceResult = DepthDie.rollAndApply(player, this);
            if (this.ui && !this.isCPUTurn()) {
                this.ui.showMessage(`🎲 Depth Die: ${diceResult.roll} (${diceResult.effect}) - ${diceResult.message}`, 'info');
            }
        }
        
        // Draw 2 cards
        const drawn = this.shared.drawPile.draw(2);
        
        if (drawn.length === 0) {
            // Deck empty - shuffle discard
            this.reshuffleDeck();
            var _d = this.shared.drawPile.draw(2);
            for (var _i = 0; _i < _d.length; _i++) drawn.push(_d[_i]);
        }
        
        // Player chooses 1 to keep, 1 goes to shared reveal
        if (this.isCPUTurn()) {
            // CPU chooses
            const keep = this.getAIForCurrentPlayer().chooseCardToKeep(drawn, player);
            player.hand.push(keep);
            const other = drawn.find(c => c !== keep);
            if (other) {
                this.shared.reveal.push(other);
                if (this.shared.reveal.length > 4) {
                    this.shared.reveal.shift();
                }
            }
        } else {
            const chosenCallback = (chosen) => {
                player.hand.push(chosen);
                const other = drawn.find(c => c !== chosen);
                if (other) {
                    this.shared.reveal.push(other);
                    if (this.shared.reveal.length > 4) {
                        this.shared.reveal.shift();
                    }
                }
                this.phase = 'play';
                this.ui.updateDisplay();
                if (this.isTutorial()) {
                    this.ui.removeTutorialStepModal();
                    this.tutorialStepIndex = 1;
                    this.ui.showTutorialStepModal(1, {
                        onBack: () => {
                            this.ui.showTutorialStepModal(0, { onBack: () => {}, onNext: () => { this.ui.removeTutorialStepModal(); } });
                        },
                        onNext: () => { this.ui.removeTutorialStepModal(); }
                    });
                }
            };
            if (this.isTutorial() && (this.tutorialStepIndex === undefined || this.tutorialStepIndex === 0) && !this.tutorialIntroStepShown) {
                this.tutorialStepIndex = 0;
                this.ui.showTutorialStepModal(0, {
                    onBack: () => {},
                    onNext: () => {
                        this.ui.removeTutorialStepModal();
                        this.ui.promptCardChoice(drawn, chosenCallback);
                    }
                });
            } else {
                this.ui.promptCardChoice(drawn, chosenCallback);
            }
            return;
        }
        
        this.phase = 'play';
        this.ui.updateDisplay();
    }

    /**
     * Play Phase
     * =====================================================
     * NOVICE NOTE: The phase where players place cards
     * 
     * This is where the action happens - players place cards
     * from their hand onto the grid. CPU plays automatically,
     * human players click to place cards. It's like the
     * "main action" phase of each turn.
     */
    playPhase() {
        const player = this.getCurrentPlayer();
        
        if (this.isCPUTurn()) {
            // CPU plays
            setTimeout(() => {
                const move = this.getAIForCurrentPlayer().makeMove(this);
                if (move && move.type === 'play') {
                    this.playCard(move.playerId, move.cardId, move.row, move.col);
                } else {
                    // Skip play
                    this.phase = 'ability';
                    this.abilityPhase();
                }
            }, 1000);
        }
        // Human player - UI handles card selection
    }

    abilityPhase() {
        const player = this.getCurrentPlayer();
        const boardCards = this.board.getAllCards(player.id);
        
        // Resolve abilities in order: Diamonds, Clubs, Hearts, Spades, Royals, Aces
        const order = ['diamonds', 'clubs', 'hearts', 'spades'];
        
        for (const boardCard of boardCards) {
            const card = getCard(boardCard.cardId);
            if (!card) continue;
            
            // Check if card has onPlay effects that haven't been resolved
            // For now, skip - abilities are resolved on play
        }
        
        this.phase = 'combat';
        this.combatPhase();
    }

    combatPhase() {
        const player1 = this.players[0];
        const player2 = this.players[1];
        
        // Get all cards on board
        const p1Cards = this.board.getAllCards(1);
        const p2Cards = this.board.getAllCards(2);
        
        // Resolve combat between opposing cards
        this.resolveCombat(p1Cards, p2Cards, player1, player2);
        
        this.phase = 'end';
        this.endPhase();
    }

    resolveCombat(p1Cards, p2Cards, player1, player2) {
        if (this.battleLog) {
            this.battleLog.setPhase('COMBAT PHASE');
        }
        
        // Show mid-battle text in campaign mode (20% chance)
        if (this.gameMode === 'campaign' && this.campaign && this.campaign.currentBoard) {
            if (Math.random() < 0.2) {
                setTimeout(() => {
                    this.campaign.showMidBattleText();
                }, 2000);
            }
        }
        
        // Simple combat: each card attacks directly opposite or nearest enemy
        for (const p1Card of p1Cards) {
            const card1 = getCard(p1Card.cardId);
            if (!card1 || card1.type !== 'entity') continue;
            
            // Find target (opposite position or nearest)
            const target = this.findCombatTarget(p1Card.row, p1Card.col, p2Cards, 2);
            if (!target) {
                // No target, attack player directly
                const damage = this.calculateDamage(card1, null, player1.layer);
                player2.hp = Math.max(0, player2.hp - damage);
                if (this.battleLog && damage > 0) {
                    this.battleLog.logDamage(`Player 2`, damage, card1.name);
                }
                continue;
            }
            
            const card2 = getCard(target.cardId);
            if (!card2) continue;
            
            // Calculate damage
            const damage1 = this.calculateDamage(card1, card2, player1.layer);
            const damage2 = this.calculateDamage(card2, card1, player2.layer);
            
            // Log combat
            if (this.battleLog) {
                this.battleLog.logCombat(card1, card2, {
                    damage: Math.max(damage1, damage2),
                    destroyed: []
                });
            }
            
            // Check for combat win/loss and trigger effects
            const strength1 = (card1.rank || 0) + (card1.stats?.presence || 0);
            const strength2 = (card2.rank || 0) + (card2.stats?.presence || 0);
            
            if (strength1 > strength2) {
                // Card1 wins - trigger onCombatWin for card1, onCombatLoss for card2
                this.resolveCardEffects(card1, player1.id, p1Card.row, p1Card.col, 'onCombatWin');
                this.resolveCardEffects(card2, player2.id, target.row, target.col, 'onCombatLoss');
            } else if (strength2 > strength1) {
                // Card2 wins
                this.resolveCardEffects(card2, player2.id, target.row, target.col, 'onCombatWin');
                this.resolveCardEffects(card1, player1.id, p1Card.row, p1Card.col, 'onCombatLoss');
            }
            
            // Play combat sound
            if (window.AudioManager) {
                window.AudioManager.playMagicAttack();
            }
            
            // Apply damage
            if (damage1 > damage2) {
                // Card 1 wins
                this.destroyCard(2, target.row, target.col);
                player2.hp = Math.max(0, player2.hp - (damage1 - damage2));
            } else if (damage2 > damage1) {
                // Card 2 wins
                this.destroyCard(1, p1Card.row, p1Card.col);
                const playerDamage = damage2 - damage1;
                player1.hp = Math.max(0, player1.hp - playerDamage);
                
                // Show damage number
                if (typeof DamageNumbers !== 'undefined' && playerDamage > 0) {
                    const targetSlot = document.querySelector(`[data-player="1"][data-row="${p1Card.row}"][data-col="${p1Card.col}"]`);
                    if (targetSlot) {
                        DamageNumbers.showDamage(targetSlot, playerDamage);
                    }
                }
            } else {
                // Tie - both destroyed
                this.destroyCard(1, p1Card.row, p1Card.col);
                this.destroyCard(2, target.row, target.col);
            }
        }
        
        // Check win conditions
        this.checkWinConditions();
    }

    findCombatTarget(row, col, enemyCards, enemyPlayerId) {
        // Find card in same position, or nearest
        const samePos = enemyCards.find(c => c.row === row && c.col === col);
        if (samePos) return samePos;
        
        // Find nearest
        let nearest = null;
        let minDist = Infinity;
        
        for (const enemyCard of enemyCards) {
            const dist = Math.abs(enemyCard.row - row) + Math.abs(enemyCard.col - col);
            if (dist < minDist) {
                minDist = dist;
                nearest = enemyCard;
            }
        }
        
        return nearest;
    }

    calculateDamage(attacker, defender, layer) {
        if (!attacker || !attacker.stats) return 0;
        
        let damage = attacker.stats.presence || attacker.rank;
        
        // Layer bonuses
        const layerData = getLayer(layer);
        if (layerData) {
            if (layer === 4 && attacker.type === 'entity') {
                // True Form bonus
                damage += 2;
            }
            if (layer === 6) {
                // Double damage in Source layer
                damage *= 2;
            }
        }
        
        // Defender reduces damage
        if (defender && defender.stats) {
            const defense = defender.stats.stability || 0;
            damage = Math.max(1, damage - defense);
        }
        
        return damage;
    }

    destroyCard(playerId, row, col) {
        const cardId = this.board.removeCard(playerId, row, col);
        if (cardId) {
            // Play death sound
            if (window.AudioManager) {
                window.AudioManager.playDeathSound();
            }
            
            const player = this.players.find(p => p.id === playerId);
            if (player) {
                player.discard.push(cardId);
            }
            this.ui.updateDisplay();
        }
    }

    endPhase() {
        // Resolve end of round effects
        this.resolvePhaseEffects('endOfRound');
        
        // Discard to hand limit
        const player = this.getCurrentPlayer();
        const handLimit = 7;
        if (player.hand.length > handLimit) {
            // UI should prompt for discard
            const excess = player.hand.length - handLimit;
            if (this.battleLog) {
                this.battleLog.log(this.phase, `Discard ${excess} card(s) to hand limit`);
            }
        }
        
        // Check waypoint attunement
        // This would be checked when cards are played
        
        this.endTurn();
    }

    // Card Actions
    /**
     * Play Card
     * =====================================================
     * NOVICE NOTE: Places a card from hand onto the grid
     * 
     * This function handles playing a card - moving it from
     * the player's hand to a grid slot. It checks if the
     * move is valid, places the card, removes it from hand,
     * and triggers any "onPlay" effects. It's like the
     * "play a card" action in any card game, but with
     * reality-bending mechanics!
     * 
     * @param {number} playerId - Which player is playing (1 or 2)
     * @param {string} cardId - The card to play (like '2s' or 'kh')
     * @param {number} row - Which row to place it in (0, 1, or 2)
     * @param {number} col - Which column to place it in (0, 1, or 2)
     * @returns {Object} - Success/failure result
     */
    playCard(playerId, cardId, row, col) {
        const player = this.getCurrentPlayer();
        if (player.id !== playerId) {
            return { success: false, message: 'Not your turn' };
        }

        const card = getCard(cardId);
        if (!card) {
            return { success: false, message: 'Invalid card' };
        }

        // Check if card is in hand
        if (!player.hand.includes(cardId)) {
            return { success: false, message: 'Card not in hand' };
        }

        // Check layer compatibility
        if (!canPlayCardInLayer(card, player.layer)) {
            return { success: false, message: 'Card not compatible with current layer' };
        }

        // Check if slot is empty
        const slot = this.board.getSlot(playerId, row, col);
        if (!slot || slot.card !== null) {
            return { success: false, message: 'Slot not available' };
        }

        // Place card
        const result = this.board.placeCard(playerId, row, col, cardId);
        if (!result.success) {
            return result;
        }

        // Remove from hand
        const index = player.hand.indexOf(cardId);
        player.hand.splice(index, 1);

        // Check waypoint attunement
        this.checkAttunement(player, cardId);

        // Resolve card effects
        this.resolveCardEffects(card, playerId, row, col);

        this.ui.updateDisplay();
        return { success: true };
    }

    resolveCardEffects(card, playerId, row, col, triggerType = 'onPlay') {
        const player = this.getCurrentPlayer();
        const opponent = this.getOpponent(playerId);
        
        // Log card play (only for onPlay trigger)
        if (triggerType === 'onPlay' && this.battleLog) {
            this.battleLog.logCardPlay(player.name || `Player ${playerId}`, card.id, card.name, row, col, (id) => getCard(id));
        }
        
        for (const effect of card.effects || []) {
            if (effect.trigger === triggerType) {
                this.applyEffect(effect, card, playerId, row, col, player, opponent);
            }
        }
    }

    // Resolve effects for all cards in play with specific trigger
    resolvePhaseEffects(triggerType) {
        for (const player of this.players) {
            const grid = this.board.getPlayerGrid(player.id);
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const cardId = grid[row][col];
                    if (cardId) {
                        const card = getCard(cardId);
                        if (card && card.effects) {
                            this.resolveCardEffects(card, player.id, row, col, triggerType);
                        }
                    }
                }
            }
        }
    }

    /**
     * Apply Effect
     * =====================================================
     * NOVICE NOTE: Actually applies a card effect to the game
     * 
     * This is where the magic happens - this function takes an
     * effect definition and actually makes it happen in the game.
     * Damage is dealt, cards are drawn, barriers are created,
     * and all sorts of reality-bending shenanigans occur.
     * 
     * It also handles Depth Die effects (Echo and Distort),
     * because sometimes dice rolls affect card effects. That's
     * just how reality works in this game!
     * 
     * @param {Object} effect - The effect to apply
     * @param {Object} card - The card that triggered the effect
     * @param {number} playerId - Which player triggered it
     * @param {number} row - Grid row
     * @param {number} col - Grid column
     * @param {Object} player - Player object
     * @param {Object} opponent - Opponent object
     */
    applyEffect(effect, card, playerId, row, col, player, opponent) {
        // Check if opponent's effect should be negated (Depth Die: Distort)
        // This is the "no u" of card effects - sometimes dice rolls let you cancel things!
        if (opponent && opponent.depthDieDistort && playerId === opponent.id) {
            if (this.battleLog) {
                this.battleLog.add(`🎲 Depth Die Distort negates ${card.name}'s effect!`, 'System');
            }
            opponent.depthDieDistort = false; // Consume the effect (one-time use)
            return; // Effect is negated - nothing happens!
        }
        
        let effectMessage = '';  // What to display in the battle log
        let shouldEcho = false;   // Should this effect trigger twice? (Depth Die: Echo)
        
        // Check if effect should echo (Depth Die: Echo)
        // Sometimes dice rolls make your effects trigger twice - double the fun!
        if (player && player.depthDieEcho && playerId === player.id) {
            shouldEcho = true;
            player.depthDieEcho = false; // Consume the effect (one-time use)
        }
        
        switch (effect.action) {
            case 'damage':
                if (effect.target === 'enemyAdjacent') {
                    const adjacent = this.board.getAdjacentSlots(opponent.id, row, col);
                    adjacent.forEach(slot => {
                        if (slot.card) {
                            // Apply damage to card
                            this.damageCard(slot.card, effect.value);
                            effectMessage = `Deal ${effect.value} damage to adjacent enemy`;
                        } else {
                            // Apply damage to player
                            opponent.hp = Math.max(0, opponent.hp - effect.value);
                            effectMessage = `Deal ${effect.value} damage to opponent`;
                        }
                    });
                } else if (effect.target === 'player') {
                    opponent.hp = Math.max(0, opponent.hp - effect.value);
                    effectMessage = `Deal ${effect.value} damage to opponent`;
                } else if (effect.target === 'enemyEntity') {
                    effectMessage = `Deal ${effect.value} damage to any enemy Entity`;
                }
                break;
            case 'heal':
                if (effect.target === 'player') {
                    player.hp = Math.min(player.maxHp, player.hp + effect.value);
                    effectMessage = `Heal ${effect.value} HP`;
                } else if (effect.target === 'friendly') {
                    effectMessage = `Heal ${effect.value} HP to target`;
                }
                break;
            case 'draw': {
                const drawn = this.shared.drawPile.draw(effect.value || 1);
                for (var _i = 0; _i < drawn.length; _i++) player.hand.push(drawn[_i]);
                effectMessage = `Draw ${effect.value || 1} card(s)`;
                break;
            }
            case 'createBarrier':
                effectMessage = `Create ${effect.value || 1} Barrier token`;
                break;
            case 'removeBarrier':
                effectMessage = `Remove ${effect.value || 1} Barrier/Shield`;
                break;
            case 'buff':
                effectMessage = `Give +${effect.value} ${effect.stat || 'stat'}`;
                break;
            case 'debuff':
                effectMessage = `Give -${Math.abs(effect.value)} ${effect.stat || 'stat'}`;
                break;
            case 'stun':
                effectMessage = `Stun enemy (can't trigger effects next round)`;
                break;
            case 'shield':
                effectMessage = `Give +${effect.value || 1} Shield (blocks ${effect.value || 1} damage)`;
                break;
            case 'preventDamage':
                effectMessage = `Prevent ${effect.value || 1} damage to target`;
                break;
            case 'preventSwapMove':
                effectMessage = `Prevent swaps/moves on target this round`;
                break;
            case 'splitDamage':
                effectMessage = `Deal ${effect.value || 2} damage split among up to ${effect.targets || 2} targets`;
                break;
            case 'ignoreLayerAdvantage':
                effectMessage = `Next attack ignores layer advantage`;
                break;
            case 'cancelEffect':
                effectMessage = `Cancel ${effect.count || 1} opponent effect(s) this round`;
                break;
            case 'increaseLayerShiftCost':
                effectMessage = `Opponent's next Layer Shift costs +${effect.value || 1} Energy`;
                break;
            case 'bonusDamage':
                effectMessage = `If win clash by ${effect.condition || '3+'}, deal +${effect.value || 2} bonus damage`;
                break;
            case 'gainEnergy':
                const energyGain = typeof effect.value === 'string' ? this.calculateEnergyGain(effect.value, effect) : (effect.value || 1);
                const maxEnergy = effect.max || player.maxEnergy;
                const currentEnergy = player.energy || 0;
                const actualGain = Math.min(energyGain, maxEnergy - currentEnergy);
                if (actualGain > 0) {
                    player.energy = Math.min(maxEnergy, currentEnergy + actualGain);
                    effectMessage = `Gain +${actualGain} Energy`;
                }
                break;
            case 'reduceDamage':
                effectMessage = `Reduce all damage you take next round by ${effect.value || 1}`;
                break;
            case 'echo':
                effectMessage = `Next effect triggers twice (Echo 1)`;
                break;
            case 'mark':
                effectMessage = `Mark target; next hit deals +${effect.effect === 'nextHitPlus2' ? 2 : effect.value || 2} damage`;
                break;
            case 'peekTopCard':
                effectMessage = `Look at top card of deck; you may leave it or put it on bottom`;
                break;
            case 'revealFacedown':
                effectMessage = `Reveal ${effect.count || 1} facedown card(s) (stays faceup)`;
                break;
            case 'move':
                effectMessage = `Move friendly card to different slot`;
                break;
            case 'reorder':
                effectMessage = `Reorder ${effect.count || 2} card(s)`;
                break;
            case 'reveal':
                effectMessage = `Reveal ${effect.count || 1} card(s)`;
                break;
            case 'drawThenDiscard': {
                const drawn = this.shared.drawPile.draw(effect.count || 1);
                for (var _i = 0; _i < drawn.length; _i++) player.hand.push(drawn[_i]);
                // Discard logic would go here
                effectMessage = `Draw ${effect.count || 1}, then discard ${effect.count || 1}`;
                break;
            }
            case 'swapCards':
                effectMessage = `Swap ${effect.count || 2} card(s)`;
                break;
            case 'destroy':
                effectMessage = `Destroy ${effect.count || 1} card(s)`;
                if (effect.bonus && effect.bonus.condition === 'isRoyal') {
                    effectMessage += `; if Royal, draw 1`;
                }
                break;
            case 'recover':
                effectMessage = `Return ${effect.count || 1} card(s) from discard to hand`;
                break;
            case 'revive':
                effectMessage = `Revive ${effect.count || 1} destroyed card(s) into empty slot`;
                break;
            case 'fullHeal':
                player.hp = player.maxHp || 20;
                effectMessage = `Fully restore to starting Stability`;
                break;
            case 'fullHealOrCleanse':
                effectMessage = `Full restore to starting Stability OR cleanse all debuffs`;
                break;
            case 'createBarriers':
                effectMessage = `Place ${effect.count || 2} Barriers across your cards`;
                if (effect.bonus === 'fortifyOne') {
                    effectMessage += ` OR convert one Barrier into permanent +2 Stability`;
                }
                break;
            case 'destroyAllBarriers':
                effectMessage = `Destroy all Shields/Barriers in play`;
                if (effect.bonus) {
                    effectMessage += `; gain +1 Energy per Barrier destroyed (max ${effect.bonus.max || 3})`;
                }
                break;
            case 'immuneToEffects':
                effectMessage = `Adjacent cards immune to opponent effects this round`;
                break;
            case 'extraPlay':
                effectMessage = `Play 1 extra card this round (ignores normal limit)`;
                break;
            case 'searchAndPlay':
                effectMessage = `Search discard for any card → put in hand, then play it`;
                if (effect.bonus && effect.bonus.action === 'triggerIntuitionCheck') {
                    effectMessage += `; perform an Intuition Check`;
                }
                break;
            case 'doubleNextAbility':
                effectMessage = `Your next effect triggers twice (Echo 1)`;
                break;
            case 'autoAttune':
                effectMessage = `Auto-attune if you play another ${effect.condition === 'playDiamond' ? 'Diamond' : 'card'}`;
                break;
            case 'intuitionNearMiss':
                effectMessage = `Your next Intuition Check counts as "correct" if off by 1`;
                break;
            case 'nameSuitAndReveal':
                effectMessage = `Name a suit; reveal top card — if correct, gain +1 Energy`;
                break;
            case 'reorderSharedRevealOrDiscard':
                effectMessage = `Reorder up to ${effect.sharedRevealCount || 3} faceup cards in SHARED REVEAL (or top of discard)`;
                break;
            case 'revealSharedRevealOrHand':
                effectMessage = `Look at ${effect.sharedRevealCount || 2} cards in SHARED REVEAL (or opponent hand in 2P)`;
                break;
            case 'drawOrShield':
                effectMessage = `Draw 1 if you control a Barrier; otherwise create 1 Shield`;
                break;
            case 'barrierGrantsPresence':
                effectMessage = `Your Barriers also grant +${effect.value || 1} Presence while active`;
                break;
            case 'immovable':
                effectMessage = `Card becomes "immovable" until end of ${effect.duration || 1} round(s)`;
                break;
            // Add more effect types as needed
        }
        
        // Log effect
        if (this.battleLog && effectMessage) {
            this.battleLog.logEffect(card.name, effectMessage);
        }
        
        // Apply echo if Depth Die Echo is active
        if (shouldEcho && effectMessage) {
            // Re-apply the same effect once more
            setTimeout(() => {
                this.applyEffect(effect, card, playerId, row, col, player, opponent);
                if (this.battleLog) {
                    this.battleLog.add(`🎲 Depth Die Echo: ${card.name}'s effect triggers again!`, 'System');
                }
            }, 100);
        }
    }

    calculateEnergyGain(valueType, effect) {
        // Handle dynamic energy gain calculations
        switch (valueType) {
            case 'cardEnergyCost':
                // Would calculate based on destroyed card's energy cost
                return Math.min(effect.max || 5, 3); // Placeholder
            case 'barriersDestroyed':
                // Would count barriers destroyed
                return Math.min(effect.max || 3, 2); // Placeholder
            default:
                return effect.value || 1;
        }
    }

    damageCard(cardId, damage) {
        // Card damage would reduce stability
        // For now, destroy if damaged
        // Full implementation would track card health
    }

    // Layer Actions
    shiftPlayerLayer(playerId, direction) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) {
            return { success: false, message: 'Player not found' };
        }

        const oldLayer = player.layer;
        const result = shiftLayer(player, direction, this);
        if (result.success) {
            // Play layer shift visual effect
            if (typeof LayerShiftEffects !== 'undefined') {
                LayerShiftEffects.play(oldLayer, player.layer);
            }
            this.ui.animateLayerShift(result.newLayer);
            this.ui.updateDisplay();
        }
        
        return result;
    }

    // Intuition Actions
    triggerIntuitionCheck() {
        const player = this.getCurrentPlayer();
        const opponent = this.getOpponent(player.id);
        
        const check = this.intuition.triggerCheck(player.id, opponent, this);
        if (check) {
            this.ui.showIntuitionCheck(check);
        }
    }

    resolveIntuitionGuess(guessType, guessValue) {
        const result = this.intuition.makeGuess(guessType, guessValue, (id) => this.getCard(id));
        if (result.success) {
            const resolved = this.intuition.resolveCheck(this);
            this.ui.showIntuitionResult(resolved);
            
            if (resolved && resolved.correct && resolved.bonus) {
                this.applyIntuitionBonus(resolved.bonus);
            }
        }
        return result;
    }

    applyIntuitionBonus(bonus) {
        const player = this.getCurrentPlayer();
        
        switch (bonus.type) {
            case 'draw':
                const drawn = this.shared.drawPile.draw(bonus.value);
                for (var _i = 0; _i < drawn.length; _i++) player.hand.push(drawn[_i]);
                break;
            case 'energy':
                player.energy = Math.min(player.maxEnergy, player.energy + bonus.value);
                break;
            case 'attune':
                player.attunements += bonus.value;
                break;
        }
        
        this.ui.updateDisplay();
    }

    // Waypoint Attunement
    checkWaypointAttunement(player) {
        // Check if player played a card matching waypoint suit this turn
        // This would be tracked during playCard
        // For now, simplified - would need to track cards played this turn
    }

    /**
     * Check Attunement
     * =====================================================
     * NOVICE NOTE: Checks if a played card matches the waypoint
     * 
     * Attunement is one of the win conditions - if you play
     * 4 cards that match the waypoint suit, you win! It's like
     * collecting matching cards, but with cosmic significance.
     * 
     * @param {Object} player - The player who played the card
     * @param {string} cardId - The card that was played
     * @returns {boolean} - True if attunement was achieved
     */
    checkAttunement(player, cardId) {
        // Check if played card matches waypoint (the face-down card in the waypoint zone)
        if (!this.shared.waypoint) return false; // No waypoint? No attunement!
        
        const waypointCard = getCard(this.shared.waypoint); // The waypoint card
        const playedCard = getCard(cardId);                 // The card just played
        
        // If suits match, you get an attunement! (It's like matching colors in a puzzle)
        if (waypointCard && playedCard && waypointCard.suit === playedCard.suit) {
            player.attunements += 1; // One step closer to victory!
            this.ui.updateDisplay(); // Update the display to show the new attunement
            
            // Check for attunement win (4 attunements = instant win!)
            if (player.attunements >= 4) {
                this.winner = player.id; // You win! (The peaceful way)
                this.ui.showVictory(player.id);
            }
            
            return true; // Attunement achieved!
        }
        return false; // No match, no attunement
    }

    // Utility Functions
    getCurrentPlayer() {
        return this.players.find(p => p.id === this.currentPlayer);
    }

    getOpponent(playerId) {
        return this.players.find(p => p.id !== playerId);
    }

    isCPUTurn() {
        if (this.gameMode === 'simulation') return true;
        return this.ai && this.currentPlayer === 2;
    }

    getAIForCurrentPlayer() {
        if (this.gameMode === 'simulation') return this.currentPlayer === 1 ? this.ai1 : this.ai2;
        return this.ai;
    }

    reshuffleDeck() {
        if (this.shared.discardPile.length > 0) {
            this.shared.drawPile = new Deck(this.shared.discardPile);
            this.shared.discardPile = [];
        }
    }

    checkWinConditions() {
        for (const player of this.players) {
            // HP win
            if (player.hp <= 0) {
                this.winner = this.getOpponent(player.id).id;
                
                // Campaign mode - use new system
                if (this.gameMode === 'campaign' && this.campaign) {
                    if (this.winner === 1) {
                        // Player won
                        this.campaign.completeBoard();
                    } else {
                        // Player lost
                        this.campaign.showLoseDialog();
                    }
                } else {
                    // Use victory/loss screens
                    if (typeof VictoryLossScreens !== 'undefined') {
                        if (this.winner === 1) {
                            VictoryLossScreens.showVictory(this, this.winner);
                        } else {
                            VictoryLossScreens.showLoss(this);
                        }
                    } else if (this.ui) {
                        this.ui.showVictory(this.winner);
                    }
                }
                return true;
            }
            
            // Attunement win
            if (player.attunements >= 4) {
                this.winner = player.id;
                
                // Campaign mode - use new system
                if (this.gameMode === 'campaign' && this.campaign) {
                    if (this.winner === 1) {
                        this.campaign.completeBoard();
                    } else {
                        this.campaign.showLoseDialog();
                    }
                } else {
                    // Use victory/loss screens
                    if (typeof VictoryLossScreens !== 'undefined') {
                        if (this.winner === 1) {
                            VictoryLossScreens.showVictory(this, this.winner);
                        } else {
                            VictoryLossScreens.showLoss(this);
                        }
                    } else if (this.ui) {
                        this.ui.showVictory(this.winner);
                    }
                }
                return true;
            }
        }
        return false;
    }

    processCPUTurn() {
        if (!this.isCPUTurn()) return;
        
        // Process CPU turn phases
        if (this.phase === 'sync') {
            this.syncPhase();
        } else if (this.phase === 'draw') {
            this.drawPhase();
        } else if (this.phase === 'play') {
            this.playPhase();
        }
    }

    // Public API
    getCard(id) {
        return getCard(id);
    }

    showSettings() {
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');
        
        title.textContent = 'Settings';
        content.innerHTML = `
            <div class="settings-content">
                <h3>Game Settings</h3>
                <div style="margin: 1rem 0;">
                    <label>
                        <input type="checkbox" id="sound-enabled" checked> Enable Sound Effects
                    </label>
                </div>
                <div style="margin: 1rem 0;">
                    <label>
                        <input type="checkbox" id="animations-enabled" checked> Enable Animations
                    </label>
                </div>
                <div style="margin: 1rem 0;">
                    <label>
                        <input type="checkbox" id="tooltips-enabled" checked> Show Card Tooltips
                    </label>
                </div>
                <div style="margin: 2rem 0; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button class="btn-primary" onclick="document.getElementById('modal-overlay').classList.add('hidden')">
                        Close
                    </button>
                    <button class="btn-secondary" onclick="if(confirm('Reset all settings?')) { localStorage.clear(); location.reload(); }" style="margin-left: 1rem;">
                        Reset Settings
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    getGameState() {
        return {
            players: this.players,
            currentPlayer: this.currentPlayer,
            turn: this.turn,
            phase: this.phase,
            board: this.board,
            shared: {
                drawCount: this.shared.drawPile.size,
                discardCount: this.shared.discardPile.length,
                waypoint: this.shared.waypoint,
                reveal: this.shared.reveal
            }
        };
    }
}

// Initialize game when DOM is ready
let gameInstance = null;
window.gameInstance = null; // Make accessible globally for debugging

function initializeGame() {
    try {
        gameInstance = new Game();
        window.gameInstance = gameInstance; // Make accessible globally
        runOnceAfterGameCreated();

        // Menu event listeners
        const btnPractice = document.getElementById('btn-practice');
        const btnTutorial = document.getElementById('btn-tutorial');
        const btnCampaign = document.getElementById('btn-campaign');
        const btnVersus = document.getElementById('btn-versus');
        const btnCoop = document.getElementById('btn-coop');
        const btnSimulation = document.getElementById('btn-simulation');
        const btnSettings = document.getElementById('btn-settings');
        
        if (!btnPractice || !btnTutorial || !btnCampaign || !btnVersus) {
            console.error('Menu buttons not found!');
            return;
        }
        
        btnPractice.addEventListener('click', () => {
            if (gameInstance) {
                document.getElementById('main-menu').classList.add('hidden');
                gameInstance.initialize('practice', 2);
                
                // Start game music
                if (window.AudioManager) {
                    window.AudioManager.playGameMusic();
                }
            }
        });
        
        btnTutorial.addEventListener('click', () => {
            // Hide main menu
            document.getElementById('main-menu').classList.add('hidden');
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.classList.add('game-active');
                gameContainer.style.display = '';
            }
            
            // Show intro sequence first
            if (typeof IntroSequence !== 'undefined') {
                IntroSequence.init();
            } else {
                // Fallback: Use new tutorial chapter system
                if (typeof TutorialUI !== 'undefined') {
                    const tutorialUI = new TutorialUI(gameInstance);
                    tutorialUI.showChapterSelector();
                } else {
                    // Fallback to old system
                    if (gameInstance) {
                        gameInstance.initialize('practice', 1);
                        if (gameContainer) gameContainer.classList.add('game-active');
                    }
                }
            }
        });
        
        btnCampaign.addEventListener('click', () => {
            if (gameInstance) {
                document.getElementById('main-menu').classList.add('hidden');
                document.getElementById('game-container').classList.add('game-active');
                gameInstance.initialize('campaign', 2);
                // Campaign will show intro automatically
            }
        });
        
        // Make campaign accessible globally for modal callbacks
        window.campaignMode = null;
        
        btnVersus.addEventListener('click', () => {
            if (gameInstance) {
                document.getElementById('main-menu').classList.add('hidden');
                document.getElementById('game-container').classList.add('game-active');
                gameInstance.initialize('versus');
                if (window.AudioManager) window.AudioManager.playGameMusic();
            }
        });
        
        if (btnCoop) {
            btnCoop.addEventListener('click', () => {
                if (gameInstance) {
                    document.getElementById('main-menu').classList.add('hidden');
                    document.getElementById('game-container').classList.add('game-active');
                    gameInstance.initialize('coop');
                    if (window.AudioManager) window.AudioManager.playGameMusic();
                }
            });
        }
        
        if (btnSimulation) {
            btnSimulation.addEventListener('click', () => {
                if (gameInstance) {
                    document.getElementById('main-menu').classList.add('hidden');
                    document.getElementById('game-container').classList.add('game-active');
                    gameInstance.initialize('simulation', 2);
                    if (window.AudioManager) window.AudioManager.playGameMusic();
                }
            });
        }
        
        if (btnSettings) {
            btnSettings.addEventListener('click', () => {
                // Show audio settings modal
                const settingsModal = document.getElementById('settings-modal');
                if (settingsModal) {
                    settingsModal.classList.remove('hidden');
                } else if (gameInstance) {
                    gameInstance.showSettings();
                } else {
                    // Fallback settings
                    const modal = document.getElementById('modal-overlay');
                    const title = document.getElementById('modal-title');
                    const content = document.getElementById('modal-content');
                    title.textContent = 'Settings';
                    content.innerHTML = `
                        <div class="settings-content">
                            <h3>Game Settings</h3>
                            <p>Settings will be available once the game is loaded.</p>
                            <button class="btn-primary" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Close</button>
                        </div>
                    `;
                    modal.classList.remove('hidden');
                }
            });
        }
        
        // (Game controls and one-time setup done by runOnceAfterGameCreated)
        
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Error loading game: ' + error.message);
    }
}

// =====================================================
// AUDIO SETTINGS UI SETUP
// =====================================================
function setupAudioSettings() {
    if (typeof AudioManager === 'undefined') return;
    
    const settingsModal = document.getElementById('settings-modal');
    if (!settingsModal) return;
    
    // Music toggle buttons
    const musicOn = document.getElementById('music-on');
    const musicOff = document.getElementById('music-off');
    
    if (musicOn && musicOff) {
        // Update button states based on current setting
        if (AudioManager.musicEnabled) {
            musicOn.classList.add('active');
            musicOff.classList.remove('active');
        } else {
            musicOn.classList.remove('active');
            musicOff.classList.add('active');
        }
        
        musicOn.addEventListener('click', () => {
            AudioManager.toggleMusic(true);
            musicOn.classList.add('active');
            musicOff.classList.remove('active');
        });
        
        musicOff.addEventListener('click', () => {
            AudioManager.toggleMusic(false);
            musicOn.classList.remove('active');
            musicOff.classList.add('active');
        });
    }
    
    // SFX toggle buttons
    const sfxOn = document.getElementById('sfx-on');
    const sfxOff = document.getElementById('sfx-off');
    
    if (sfxOn && sfxOff) {
        // Update button states
        if (AudioManager.sfxEnabled) {
            sfxOn.classList.add('active');
            sfxOff.classList.remove('active');
        } else {
            sfxOn.classList.remove('active');
            sfxOff.classList.add('active');
        }
        
        sfxOn.addEventListener('click', () => {
            AudioManager.toggleSFX(true);
            sfxOn.classList.add('active');
            sfxOff.classList.remove('active');
        });
        
        sfxOff.addEventListener('click', () => {
            AudioManager.toggleSFX(false);
            sfxOn.classList.remove('active');
            sfxOff.classList.add('active');
        });
    }
    
    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.value = AudioManager.volume;
        volumeSlider.addEventListener('input', (e) => {
            AudioManager.setVolume(parseFloat(e.target.value));
        });
    }
    
    // Close button
    const closeBtn = document.getElementById('settings-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }
    
    // Depth Die toggle buttons
    const depthDieOn = document.getElementById('depth-die-on');
    const depthDieOff = document.getElementById('depth-die-off');
    
    if (depthDieOn && depthDieOff) {
        // Load saved setting or use config default
        const savedDepthDie = localStorage.getItem('fumDepthDieEnabled');
        const depthDieEnabled = savedDepthDie !== null ? savedDepthDie === 'true' : 
                                (window.GAME_CONFIG && window.GAME_CONFIG.EXPANSIONS.depthDie);
        
        // Update button states
        if (depthDieEnabled) {
            depthDieOn.classList.add('active');
            depthDieOff.classList.remove('active');
        } else {
            depthDieOn.classList.remove('active');
            depthDieOff.classList.add('active');
        }
        
        depthDieOn.addEventListener('click', () => {
            localStorage.setItem('fumDepthDieEnabled', 'true');
            if (window.GAME_CONFIG) {
                window.GAME_CONFIG.EXPANSIONS.depthDie = true;
            }
            depthDieOn.classList.add('active');
            depthDieOff.classList.remove('active');
        });
        
        depthDieOff.addEventListener('click', () => {
            localStorage.setItem('fumDepthDieEnabled', 'false');
            if (window.GAME_CONFIG) {
                window.GAME_CONFIG.EXPANSIONS.depthDie = false;
            }
            depthDieOn.classList.remove('active');
            depthDieOff.classList.add('active');
        });
    }
    
    // Update settings button to show audio settings
    const settingsBtn = document.getElementById('btn-settings');
    if (settingsBtn) {
        // Remove old listener if exists
        settingsBtn.removeEventListener('click', showSettingsMenu);
        
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });
    }
}

// =====================================================
// MENU ENTRY POINTS (exposed on window so HTML can wire buttons)
// =====================================================
// Ensures Game exists (creates on first use); returns true if ready.
function ensureGame() {
    if (gameInstance) return true;
    try {
        gameInstance = new Game();
        window.gameInstance = gameInstance;
        runOnceAfterGameCreated();
        return true;
    } catch (e) {
        console.error('Error initializing game:', e);
        alert('Error loading game: ' + (e && e.message ? e.message : String(e)));
        return false;
    }
}
window.ensureGame = ensureGame;

let gameCreatedOnce = false;
function runOnceAfterGameCreated() {
    if (gameCreatedOnce) return;
    gameCreatedOnce = true;
    if (typeof AudioManager !== 'undefined') AudioManager.init();
    if (typeof PauseMenu !== 'undefined') PauseMenu.init(gameInstance);
    setupAudioSettings();
    addInGameSettingsButton();
    attachGameControlListeners();
}

function attachGameControlListeners() {
    const endTurnBtn = document.getElementById('end-turn-btn');
    const intuitionBtn = document.getElementById('intuition-btn');
    const layerUpBtn = document.getElementById('layer-up');
    const layerDownBtn = document.getElementById('layer-down');
    if (endTurnBtn) {
        endTurnBtn.addEventListener('click', () => {
            var g = window.gameInstance || gameInstance;
            if (!g) return;
            if (g.isCPUTurn()) return;
            if (g.isTutorial()) g.onTutorialStepCompleted('end_turn');
            g.endTurn();
        });
    }
    if (intuitionBtn) {
        intuitionBtn.addEventListener('click', () => {
            if (gameInstance && !gameInstance.isCPUTurn()) {
                const player = gameInstance.getCurrentPlayer();
                if (player && player.energy >= 2) {
                    player.energy -= 2;
                    gameInstance.triggerIntuitionCheck();
                }
            }
        });
    }
    if (layerUpBtn) {
        layerUpBtn.addEventListener('click', () => {
            if (gameInstance && !gameInstance.isCPUTurn()) {
                const player = gameInstance.getCurrentPlayer();
                if (player) {
                    const result = gameInstance.shiftPlayerLayer(player.id, 1);
                    if (!result.success && gameInstance.ui) gameInstance.ui.showMessage(result.message, 'error');
                }
            }
        });
    }
    if (layerDownBtn) {
        layerDownBtn.addEventListener('click', () => {
            if (gameInstance && !gameInstance.isCPUTurn()) {
                const player = gameInstance.getCurrentPlayer();
                if (player) {
                    const result = gameInstance.shiftPlayerLayer(player.id, -1);
                    if (!result.success && gameInstance.ui) gameInstance.ui.showMessage(result.message, 'error');
                }
            }
        });
    }
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal) settingsModal.classList.remove('hidden');
        });
    }
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            // Same menu for all modes: show Pause Menu (Quit to Menu works for tutorial via PauseMenu.quit)
            if (document.getElementById('intro-sequence')) {
                if (typeof PauseMenu !== 'undefined') PauseMenu.show();
                return;
            }
            if (typeof PauseMenu !== 'undefined' && gameInstance && gameInstance.gameMode) {
                PauseMenu.show();
            } else if (gameInstance && gameInstance.ui) {
                gameInstance.ui.showMessage('Open during a match to pause.', 'info');
            }
        });
    }
    const drawPile = document.getElementById('draw-pile');
    if (drawPile) {
        drawPile.addEventListener('click', () => {
            if (!gameInstance || !gameInstance.ui) return;
            if (gameInstance.phase === 'draw') {
                gameInstance.ui.showMessage('Choose one card to keep in the modal above.', 'info');
            } else {
                gameInstance.ui.showMessage('Cards are drawn at the start of your turn. Click End Turn when ready.', 'info');
            }
        });
    }
}

window.fumStartPractice = function() {
    if (!ensureGame()) return;
    if (window.AudioManager) window.AudioManager.stopMusic();
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-container').classList.add('game-active');
    gameInstance.initialize('practice', 2);
    if (window.AudioManager) window.AudioManager.playGameMusic();
};
window.fumStartTutorial = function() {
    if (!ensureGame()) return;
    if (window.AudioManager) window.AudioManager.stopMusic();
    document.getElementById('main-menu').classList.add('hidden');
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) gameContainer.classList.add('game-active');
    gameInstance.initialize('practice', 1);
    if (window.AudioManager) window.AudioManager.playGameMusic();
    if (typeof IntroSequence !== 'undefined' && IntroSequence.showStoryModal) {
        IntroSequence.showStoryModal();
    }
};
window.fumStartCampaign = function() {
    if (!ensureGame()) return;
    if (window.AudioManager) window.AudioManager.stopMusic();
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-container').classList.add('game-active');
    gameInstance.initialize('campaign', 2);
};
window.fumStartVersus = function() {
    if (!ensureGame()) return;
    if (window.AudioManager) window.AudioManager.stopMusic();
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-container').classList.add('game-active');
    gameInstance.initialize('versus');
    if (window.AudioManager) window.AudioManager.playGameMusic();
};
window.fumStartCoop = function() {
    if (!ensureGame()) return;
    if (window.AudioManager) window.AudioManager.stopMusic();
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-container').classList.add('game-active');
    gameInstance.initialize('coop');
    if (window.AudioManager) window.AudioManager.playGameMusic();
};
window.fumStartSimulation = function() {
    if (!ensureGame()) return;
    if (window.AudioManager) window.AudioManager.stopMusic();
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-container').classList.add('game-active');
    gameInstance.initialize('simulation', 2);
    if (window.AudioManager) window.AudioManager.playGameMusic();
};

function onGameReady() {
    initializeGame();
    // Start title music on the very first user interaction (browsers block audio until then).
    // Register immediately so first click/key when title or menu is shown starts the music.
    if (!window.__titleMusicStarted && typeof window.AudioManager !== 'undefined' && window.AudioManager.playTitleMusic) {
        function startTitleMusicOnce() {
            if (window.__titleMusicStarted) return;
            window.__titleMusicStarted = true;
            window.AudioManager.playTitleMusic();
            document.removeEventListener('click', startTitleMusicOnce, true);
            document.removeEventListener('keydown', startTitleMusicOnce, true);
        }
        document.addEventListener('click', startTitleMusicOnce, true);
        document.addEventListener('keydown', startTitleMusicOnce, true);
    }
    if (typeof TitleScreen !== 'undefined' && TitleScreen.show) {
        TitleScreen.show();
    } else {
        var menu = document.getElementById('main-menu');
        if (menu) { menu.classList.remove('hidden'); menu.style.opacity = '1'; }
    }
}
function boot() {
    try {
        onGameReady();
    } catch (err) {
        console.error('Game boot error:', err);
        var menu = document.getElementById('main-menu');
        if (menu) {
            menu.classList.remove('hidden');
            menu.style.opacity = '1';
            var content = menu.querySelector('.menu-content');
            if (content) {
                var p = document.createElement('p');
                p.className = 'tagline';
                p.style.marginTop = '1rem';
                p.style.color = '#e74c3c';
                p.textContent = 'Error: ' + (err && err.message ? err.message : String(err));
                content.appendChild(p);
            }
        }
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

export { gameInstance };