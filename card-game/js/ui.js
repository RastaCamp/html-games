/**
 * =====================================================
 * FUM: SHATTERLAYERS - UI MANAGER
 * =====================================================
 * 
 * 🎨 THE ARTIST OF THE OPERATION 🎨
 * =====================================================
 * 
 * This class handles all the visual stuff - updating the display,
 * creating card elements, managing the UI, and making everything
 * look pretty. It's like the stage manager of a theater production,
 * but instead of actors, it's managing cards and game elements.
 * 
 * Without this class, the game would work perfectly but look like
 * a blank page. And that's not very fun, is it?
 * 
 * =====================================================
 */

// UI Manager

import { getCard } from './cards.js';
import { getLayer, canPlayCardInLayer } from './layers.js';
import { CardAnimations } from './card-animations.js';

export class UIManager {
    /**
     * Constructor - Creates a new UI Manager
     * =====================================================
     * NOVICE NOTE: This sets up the UI manager for a game instance
     * 
     * @param {Game} game - The game instance to manage UI for
     */
    constructor(game) {
        this.game = game;           // Reference to the game (so we can read its state)
        this.selectedCard = null;  // Currently selected card (for playing)
        this.selectedSlot = null;  // Currently selected slot (for placing cards)
        this.TUTORIAL_STEPS = [
            { title: 'Step 1: Draw', instruction: 'You drew 2 cards. Choose one to keep in your hand; the other goes to Shared Reveal. Pick the card that fits your strategy best.', why: 'You get one card per draw—choose the one that helps your board or blocks the opponent.' },
            { title: 'Step 2: Place a card', instruction: 'Place a card from your hand onto YOUR grid (the bottom board—your side). Do not place on the top board (that\'s the opponent). Drag a card to an empty slot or click a card then click a slot. You can switch layers (◄ ►) to play different cards; each layer has different effects.', why: 'Cards on your board attack during combat. Building your rows wins the round.' },
            { title: 'Step 3: End Turn', instruction: 'When you\'re done placing cards, click End Turn. Combat will resolve (your ACTION row vs the opponent\'s), then it becomes their turn.', why: 'End your turn when you\'ve made your plays. You don\'t have to fill every slot.' }
        ];
    }

    /**
     * Initialize - Sets up the UI
     * =====================================================
     * NOVICE NOTE: This creates all the UI elements and sets up event listeners
     * 
     * This function is called when the game starts. It creates the grids,
     * updates the display, and sets up all the click handlers. It's like
     * setting up a stage before the play begins.
     */
    initialize() {
        this.createGrids();         // Create the 3x3 grids for both players
        this.updateDisplay();       // Update everything to show current game state
        this.setupEventListeners(); // Set up click handlers and such
        
        // Set up battle log event listener (so we can show events as they happen)
        if (this.game.battleLog) {
            this.game.battleLog.onEventAdded = (event) => {
                this.updateBattleLog(); // Update the log whenever something happens
            };
        }
        
        // Initialize card tooltips (so hovering shows card info)
        if (typeof CardTooltips !== 'undefined') {
            CardTooltips.init();
        }
    }

    /**
     * Create Grids
     * =====================================================
     * NOVICE NOTE: Creates the 3x3 grids for both players
     * 
     * This function creates all the grid slots (the places where
     * cards can be played). Each player gets a 3x3 grid, which
     * means 9 slots total per player. That's 18 slots total!
     * (Math is fun when you're making games)
     */
    createGrids() {
        // Create player 1 grid (the bottom grid, because player 1 is usually the human)
        const grid1 = document.getElementById('grid-1');
        grid1.innerHTML = ''; // Clear it first (in case we're resetting)
        
        // Loop through rows (0, 1, 2) and columns (0, 1, 2) to create 9 slots
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const slot = document.createElement('div');
                slot.className = 'grid-slot';
                slot.dataset.player = '1';  // This is player 1's grid
                slot.dataset.row = row;      // Which row (0, 1, or 2)
                slot.dataset.col = col;      // Which column (0, 1, or 2)
                
                // Column types: Self, Action, Outcome (the three types of slots)
                const slotTypes = ['self', 'action', 'outcome'];
                slot.dataset.slotType = slotTypes[col].toUpperCase();
                slot.classList.add(slotTypes[col]);
                
                slot.addEventListener('click', () => this.onSlotClick(1, row, col));
                slot.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (this.game.phase !== 'play' || this.game.currentPlayer !== 1) return;
                    if (this.game.board.getCard(1, row, col)) return;
                    slot.classList.add('slot-drop-target');
                });
                slot.addEventListener('dragleave', () => slot.classList.remove('slot-drop-target'));
                slot.addEventListener('drop', (e) => {
                    e.preventDefault();
                    slot.classList.remove('slot-drop-target');
                    const cardId = e.dataTransfer.getData('text/plain');
                    if (!cardId || this.game.phase !== 'play' || this.game.currentPlayer !== 1) return;
                    if (this.game.board.getCard(1, row, col)) return;
                    const player = this.game.getCurrentPlayer();
                    if (!player || !player.hand.includes(cardId)) return;
                    const card = getCard(cardId);
                    if (!card || !canPlayCardInLayer(card, player.layer)) return;
                    const result = this.game.playCard(1, cardId, row, col);
                    if (result.success) {
                        if (this.game.onTutorialStepCompleted) this.game.onTutorialStepCompleted('card_placed');
                        this.selectedCard = null;
                        setTimeout(() => this.updateDisplay(), 350);
                    }
                });
                grid1.appendChild(slot);
            }
        }

        // Create player 2 grid
        const grid2 = document.getElementById('grid-2');
        grid2.innerHTML = '';
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const slot = document.createElement('div');
                slot.className = 'grid-slot';
                slot.dataset.player = '2';
                slot.dataset.row = row;
                slot.dataset.col = col;
                
                const slotTypes = ['self', 'action', 'outcome'];
                slot.dataset.slotType = slotTypes[col].toUpperCase();
                slot.classList.add(slotTypes[col]);
                
                slot.addEventListener('click', () => this.onSlotClick(2, row, col));
                slot.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (this.game.phase !== 'play' || this.game.currentPlayer !== 2) return;
                    if (this.game.board.getCard(2, row, col)) return;
                    slot.classList.add('slot-drop-target');
                });
                slot.addEventListener('dragleave', () => slot.classList.remove('slot-drop-target'));
                slot.addEventListener('drop', (e) => {
                    e.preventDefault();
                    slot.classList.remove('slot-drop-target');
                    const cardId = e.dataTransfer.getData('text/plain');
                    if (!cardId || this.game.phase !== 'play' || this.game.currentPlayer !== 2) return;
                    if (this.game.board.getCard(2, row, col)) return;
                    const player = this.game.getCurrentPlayer();
                    if (!player || !player.hand.includes(cardId)) return;
                    const card = getCard(cardId);
                    if (!card || !canPlayCardInLayer(card, player.layer)) return;
                    const result = this.game.playCard(2, cardId, row, col);
                    if (result.success) {
                        if (this.game.onTutorialStepCompleted) this.game.onTutorialStepCompleted('card_placed');
                        this.selectedCard = null;
                        setTimeout(() => this.updateDisplay(), 350);
                    }
                });
                grid2.appendChild(slot);
            }
        }
    }

    setupEventListeners() {
        // Card selection in hand
        document.addEventListener('click', (e) => {
            if (e.target.closest('.card')) {
                const cardElement = e.target.closest('.card');
                const cardId = cardElement.dataset.cardId;
                this.selectCard(cardId);
            }
        });
    }

    selectCard(cardId) {
        this.selectedCard = cardId;
        
        // Update UI
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        if (cardElement) {
            cardElement.classList.add('selected');
            
            // Show visual feedback
            this.showMessage(`Selected: ${getCard(cardId).name}`, 'info');
            
            // Highlight playable slots
            this.highlightPlayableSlots(cardId);
        }
    }

    highlightPlayableSlots(cardId) {
        const card = getCard(cardId);
        if (!card) return;
        
        const currentPlayer = this.game.getCurrentPlayer();
        if (!currentPlayer) return;
        
        // Remove previous highlights
        document.querySelectorAll('.grid-slot').forEach(slot => {
            slot.classList.remove('playable-slot');
        });
        
        // Check if card can be played in current layer
        if (canPlayCardInLayer(card, currentPlayer.layer)) {
            // Highlight empty slots
            const emptySlots = this.game.board.getEmptySlots(currentPlayer.id);
            emptySlots.forEach(slot => {
                const slotElement = document.querySelector(
                    `[data-player="${currentPlayer.id}"][data-row="${slot.row}"][data-col="${slot.col}"]`
                );
                if (slotElement) {
                    slotElement.classList.add('playable-slot');
                }
            });
        } else {
            this.showMessage(`Card not compatible with Layer ${currentPlayer.layer}`, 'error');
        }
    }

    onSlotClick(playerId, row, col) {
        if (this.game.currentPlayer !== playerId) {
            this.showMessage('Not your turn.', 'error');
            return;
        }
        if (!this.selectedCard) {
            this.showMessage('Select a card from your hand first, then click an empty slot.', 'info');
            return;
        }
        if (this.game.phase !== 'play') {
            this.showMessage('You can only place cards during the Play phase. End your turn or finish drawing.', 'info');
            return;
        }

        // Get card element and target slot before playing
        const cardElement = document.querySelector(`[data-card-id="${this.selectedCard}"]`);
        const targetSlot = document.querySelector(`[data-player="${playerId}"][data-row="${row}"][data-col="${col}"]`);
        const cardData = getCard(this.selectedCard);

        const result = this.game.playCard(playerId, this.selectedCard, row, col);
        if (result.success) {
            if (this.game.onTutorialStepCompleted) this.game.onTutorialStepCompleted('card_placed');
            // Play card animation
            if (cardElement && targetSlot && cardData && typeof CardAnimations !== 'undefined') {
                CardAnimations.playCardPlayAnimation(cardElement, cardData, targetSlot);
            } else if (cardElement) {
                // Fallback animation
                cardElement.classList.add('animate-card-play');
            }
            
            this.selectedCard = null;
            
            // Small delay for animation
            setTimeout(() => {
                this.updateDisplay();
            }, 350);
        } else {
            // Show error feedback
            const slotElement = document.querySelector(`[data-player="${playerId}"][data-row="${row}"][data-col="${col}"]`);
            if (slotElement) {
                slotElement.classList.add('shake');
                setTimeout(() => {
                    slotElement.classList.remove('shake');
                }, 400);
            }
            
            // Show error message
            this.showMessage(result.message, 'error');
        }
    }

    updateBattleLog() {
        if (!this.game.battleLog) return;
        
        const logElement = document.getElementById('battle-log');
        if (!logElement) return;
        
        const recentEvents = this.game.battleLog.getRecent(20);
        logElement.innerHTML = '';
        
        recentEvents.forEach(event => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            
            const phaseLabel = event.phase ? `[TURN ${event.turn} - ${event.phase}]` : `[TURN ${event.turn}]`;
            entry.innerHTML = `
                <div class="log-phase">${phaseLabel}</div>
                <div class="log-message">${event.message}</div>
            `;
            
            logElement.appendChild(entry);
        });
        
        // Auto-scroll to bottom
        logElement.scrollTop = logElement.scrollHeight;
    }

    updateDisplay() {
        const gameState = this.game.getGameState();
        
        // Update player stats
        for (const player of gameState.players) {
            const hpElement = document.getElementById(`player-${player.id}-hp`);
            const layerElement = document.getElementById(`player-${player.id}-layer`);
            const attunementElement = document.getElementById(`player-${player.id}-attunements`);
            
            if (hpElement) {
                hpElement.textContent = player.hp;
                // Add visual feedback for low HP
                if (player.hp <= 5) {
                    hpElement.parentElement.style.color = '#E74C3C';
                    hpElement.parentElement.classList.add('pulse');
                } else {
                    hpElement.parentElement.style.color = '';
                    hpElement.parentElement.classList.remove('pulse');
                }
            }
            if (layerElement) layerElement.textContent = player.layer;
            if (attunementElement) {
                attunementElement.textContent = player.attunements;
                // Animate attunement gain
                if (player.attunements > 0) {
                    attunementElement.parentElement.classList.add('animate-attunement');
                    setTimeout(() => {
                        attunementElement.parentElement.classList.remove('animate-attunement');
                    }, 500);
                }
            }
        }

        // Update energy
        const currentPlayer = this.game.getCurrentPlayer();
        const energyEl = document.getElementById('player-energy');
        if (energyEl && currentPlayer) energyEl.textContent = String(currentPlayer.energy);

        // Update layer display
        const layer = getLayer(currentPlayer.layer);
        const layerDisplay = document.getElementById('current-layer-display');
        const layerValue = document.getElementById('layer-display');
        
        if (layer && layerDisplay) {
            const layerName = layerDisplay.querySelector('.layer-name');
            if (layerName) {
                layerName.textContent = `Layer ${currentPlayer.layer}: ${layer.name}`;
                layerName.style.color = layer.color;
            }
        }
        
        if (layerValue) {
            layerValue.textContent = `Layer ${currentPlayer.layer}`;
        }

        // Update draw/discard counts
        const drawCountEl = document.getElementById('draw-count');
        const discardCountEl = document.getElementById('discard-count');
        if (drawCountEl) drawCountEl.textContent = gameState.shared.drawCount || 
            (this.game.shared.drawPile ? this.game.shared.drawPile.cards.length : 0);
        if (discardCountEl) discardCountEl.textContent = gameState.shared.discardCount || 
            (this.game.shared.discardPile ? this.game.shared.discardPile.length : 0);
        
        // Update draw pile visual (show card back)
        const drawPileEl = document.getElementById('draw-pile');
        if (drawPileEl) {
            drawPileEl.style.backgroundImage = 'url(visuals/cards/back.png)';
            drawPileEl.style.backgroundSize = 'cover';
            drawPileEl.style.backgroundPosition = 'center';
        }

        // Update waypoint
        const waypointSlot = document.getElementById('waypoint-card');
        waypointSlot.innerHTML = '';
        if (gameState.shared.waypoint) {
            const cardElement = this.createCardElement(gameState.shared.waypoint, true);
            waypointSlot.appendChild(cardElement);
        }

        // Update shared reveal
        const revealSlots = document.querySelectorAll('#shared-reveal-slots .card-slot');
        for (let i = 0; i < 4; i++) {
            const slot = revealSlots[i];
            slot.innerHTML = '';
            if (gameState.shared.reveal[i]) {
                const cardElement = this.createCardElement(gameState.shared.reveal[i], false);
                slot.appendChild(cardElement);
            }
        }

        // Update player hand
        this.updateHand(currentPlayer.hand);
        
        // Update energy button state
        const intuitionBtn = document.getElementById('intuition-btn');
        if (intuitionBtn) {
            if (currentPlayer.energy >= 2) {
                intuitionBtn.disabled = false;
            } else {
                intuitionBtn.disabled = true;
            }
        }
        
        // Update layer buttons and display
        const layerUpBtn = document.getElementById('layer-up');
        const layerDownBtn = document.getElementById('layer-down');
        if (layerUpBtn && layerDownBtn) {
            layerUpBtn.disabled = currentPlayer.layer >= 6 || currentPlayer.energy < 1;
            layerDownBtn.disabled = currentPlayer.layer <= 1 || currentPlayer.energy < 1;
        }

        // Update grids
        this.updateGrids();
    }

    updateHand(hand) {
        const handContainer = document.getElementById('player-hand');
        handContainer.innerHTML = '';
        
        for (const cardId of hand) {
            const cardElement = this.createCardElement(cardId, false);
            cardElement.setAttribute('draggable', 'true');
            cardElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', cardId);
                e.dataTransfer.effectAllowed = 'move';
                cardElement.classList.add('dragging');
            });
            cardElement.addEventListener('dragend', () => {
                cardElement.classList.remove('dragging');
                document.querySelectorAll('.grid-slot').forEach(s => s.classList.remove('slot-drop-target'));
            });
            handContainer.appendChild(cardElement);
            
            if (window.AudioManager) {
                window.AudioManager.playCardMovement();
            }
        }
    }

    updateGrids() {
        // Update player 1 grid
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const slotElement = document.querySelector(`[data-player="1"][data-row="${row}"][data-col="${col}"]`);
                if (slotElement) {
                    slotElement.innerHTML = '';
                    const cardId = this.game.board.getCard(1, row, col);
                    if (cardId) {
                        const cardElement = this.createCardElement(cardId, false);
                        slotElement.appendChild(cardElement);
                    }
                }
            }
        }

        // Update player 2 grid
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const slotElement = document.querySelector(`[data-player="2"][data-row="${row}"][data-col="${col}"]`);
                if (slotElement) {
                    slotElement.innerHTML = '';
                    const cardId = this.game.board.getCard(2, row, col);
                    if (cardId) {
                        const cardElement = this.createCardElement(cardId, false);
                        slotElement.appendChild(cardElement);
                    }
                }
            }
        }
    }

    createCardElement(cardId, facedown = false) {
        const card = getCard(cardId);
        if (!card) return document.createElement('div');

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.cardId = cardId;
        cardDiv.dataset.suit = card.suit;
        cardDiv.dataset.rank = card.rank;
        
        // Add layer compatibility class
        const currentPlayer = this.game.getCurrentPlayer();
        if (currentPlayer && card.layerAffinity.includes(currentPlayer.layer)) {
            cardDiv.classList.add('layer-compatible-card');
        }
        
        if (facedown) cardDiv.classList.add('facedown');

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

        if (!facedown) {
            // Build effect description
            const effectDesc = card.effects && card.effects.length > 0 
                ? card.effects.map(e => {
                    if (e.action === 'damage') return `Deal ${e.value} damage`;
                    if (e.action === 'heal') return `Heal ${e.value} HP`;
                    if (e.action === 'draw') return `Draw ${e.value} card(s)`;
                    return e.action;
                }).join(', ')
                : 'No effect';
            
            // Card art path: visuals/cards/{suitLetter}/{cardId}.png (s=spades, h=hearts, d=diamonds, c=clubs)
            const suitFolder = { spades: 's', hearts: 'h', diamonds: 'd', clubs: 'c' }[card.suit] || 's';
            const cardArtSrc = `visuals/cards/${suitFolder}/${card.id}.png`;
            
            cardDiv.innerHTML = `
                <div class="card-face">
                    <div class="card-header">
                        <div class="card-layer-icon">${card.layerAffinity.length === 6 ? '⚡' : card.layerAffinity[0]}</div>
                        <div class="card-rank-suit">${rankNames[card.rank]}${suitSymbols[card.suit]}</div>
                    </div>
                    <div class="card-artwork" data-card-name="${card.name}">
                        <img src="${cardArtSrc}" alt="${card.name}" 
                             onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'card-artwork-placeholder\\'>${card.name}</div>';" />
                    </div>
                    <div class="card-footer">
                        <div class="card-ability">${card.type}</div>
                        ${card.stats ? `
                            <div class="card-stats">
                                <span class="stat-badge">P:${card.stats.presence}</span>
                                <span class="stat-badge">S:${card.stats.stability}</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="card-tooltip">
                        <strong>${card.name}</strong>
                        ${card.flavor ? `<div style="font-style: italic; margin-top: 0.25rem; font-size: 0.8rem;">${card.flavor}</div>` : ''}
                        <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #95A5A6;">${effectDesc}</div>
                        <div style="margin-top: 0.25rem; font-size: 0.7rem; color: #7F8C8D;">Layers: ${card.layerAffinity.join(', ')}</div>
                    </div>
                </div>
                <div class="card-back"></div>
            `;
        } else {
            cardDiv.innerHTML = '<div class="card-back"></div>';
        }

        if (facedown) {
            const cardBack = cardDiv.querySelector('.card-back');
            if (cardBack) cardBack.style.backgroundImage = 'url(visuals/cards/back.png)';
        }

        return cardDiv;
    }

    promptCardChoice(drawn, callback) {
        const modal = document.getElementById('modal-overlay');
        const titleEl = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');
        if (titleEl) titleEl.textContent = 'Draw phase';
        content.innerHTML = '<p>Choose one card to keep (the other goes to Shared Reveal):</p><div class="choice-cards"></div>';
        const choiceContainer = content.querySelector('.choice-cards');
        
        for (const cardId of drawn) {
            const cardElement = this.createCardElement(cardId, false);
            cardElement.style.cursor = 'pointer';
            cardElement.addEventListener('click', () => {
                callback(cardId);
                modal.classList.add('hidden');
            });
            choiceContainer.appendChild(cardElement);
        }
        
        modal.classList.remove('hidden');
    }

    showIntuitionCheck(check) {
        const modal = document.getElementById('intuition-modal');
        const cardsContainer = document.getElementById('intuition-cards');
        
        cardsContainer.innerHTML = '';
        
        // Show 3 facedown cards
        for (const cardId of check.cards) {
            const cardElement = this.createCardElement(cardId, true);
            cardsContainer.appendChild(cardElement);
            
            // When card is revealed, flip it
            cardElement.addEventListener('click', () => {
                if (cardElement.classList.contains('facedown')) {
                    if (typeof CardFlip !== 'undefined') {
                        CardFlip.reveal(cardElement);
                    }
                }
            });
        }
        
        // Setup guess buttons
        const guessButtons = document.querySelectorAll('.intuition-guess');
        guessButtons.forEach(btn => {
            btn.onclick = () => {
                const guessType = btn.dataset.guess;
                // For now, simplified - would need proper guess value selection
                this.game.resolveIntuitionGuess(guessType, check.cards[0]);
            };
        });
        
        modal.classList.remove('hidden');
    }

    showIntuitionResult(result) {
        const modal = document.getElementById('intuition-modal');
        
        if (result && result.correct) {
            // Show success
            const cardsContainer = document.getElementById('intuition-cards');
            cardsContainer.innerHTML = '<h3 style="color: #F1C40F;">Correct! Intuition Bonus Applied!</h3>';
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 2000);
        } else {
            // Show failure
            const cardsContainer = document.getElementById('intuition-cards');
            cardsContainer.innerHTML = '<h3 style="color: #95A5A6;">Incorrect guess.</h3>';
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 2000);
        }
    }

    animateLayerShift(newLayer) {
        const layer = getLayer(newLayer);
        if (!layer) return;
        
        const layerDisplay = document.getElementById('current-layer-display');
        const layerValue = document.getElementById('layer-display');
        
        // Update layer value display immediately
        if (layerValue) {
            layerValue.textContent = `Layer ${newLayer}`;
        }
        
        // Create full-screen transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'layer-transition-overlay';
        overlay.style.backgroundColor = layer.color;
        document.body.appendChild(overlay);
        
        // Animate overlay
        setTimeout(() => {
            overlay.style.opacity = '0.8';
            overlay.style.transition = 'opacity 0.3s';
        }, 10);
        
        // Update layer display with new info
        if (layerDisplay) {
            const layerName = layerDisplay.querySelector('.layer-name');
            const layerEffects = document.getElementById('layer-effects');
            
            if (layerName) {
                layerName.textContent = `Layer ${newLayer}: ${layer.name}`;
                layerName.style.color = layer.color;
            }
            
            if (layerEffects) {
                layerEffects.textContent = layer.description;
            }
        }
        
        // Apply layer color to player grid
        const currentPlayer = this.game.getCurrentPlayer();
        if (currentPlayer) {
            const playerGrid = document.getElementById(`player-${currentPlayer.id}-grid`);
            if (playerGrid) {
                playerGrid.style.borderColor = layer.color;
                playerGrid.style.boxShadow = `0 0 20px ${layer.color}40`;
            }
        }
        
        // Animate cards on board with layer effect
        this.animateCardsForLayer(newLayer);
        
        // Remove overlay after a few seconds and fade the center layer display
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
                var ld = document.querySelector('.layer-display');
                if (ld) ld.classList.add('layer-display-faded');
            }, 500);
        }, 3000);
        
        // Update layer display animation
        if (layerDisplay) {
            layerDisplay.classList.add('animate-layer-shift');
            setTimeout(() => {
                layerDisplay.classList.remove('animate-layer-shift');
            }, 500);
        }
    }

    animateCardsForLayer(layer) {
        const currentPlayer = this.game.getCurrentPlayer();
        const cards = this.game.board.getAllCards(currentPlayer.id);
        
        cards.forEach(cardData => {
            const cardElement = document.querySelector(`[data-card-id="${cardData.cardId}"]`);
            if (cardElement) {
                const card = getCard(cardData.cardId);
                if (card && card.layerAffinity.includes(layer)) {
                    // Card is compatible with new layer - glow effect
                    cardElement.classList.add('layer-compatible');
                    setTimeout(() => {
                        cardElement.classList.remove('layer-compatible');
                    }, 1000);
                }
            }
        });
    }

    showVictory(playerId) {
        const modal = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        const title = document.getElementById('modal-title');
        
        title.textContent = `Player ${playerId} Wins!`;
        content.innerHTML = `
            <div class="victory-message animate-victory">
                <h2 style="color: #F1C40F; text-align: center; margin: 2rem 0; text-shadow: 0 0 20px #F1C40F;">
                    🎉 Victory! 🎉
                </h2>
                <p style="text-align: center; font-size: 1.2rem; margin-bottom: 1rem;">
                    Player ${playerId} has achieved victory!
                </p>
                <div style="text-align: center; margin-top: 2rem;">
                    <button class="btn-primary" onclick="location.reload()" style="font-size: 1.1rem; padding: 1rem 2rem;">
                        Play Again
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        // Close button
        document.querySelector('.modal-close').onclick = () => {
            location.reload();
        };
    }

    /**
     * Show tutorial step modal with Back / Next. Auto-advance is triggered by the game when the player completes the step.
     * @param {number} stepIndex - 0-based step index
     * @param {Object} opts - { onBack: function(), onNext: function() }
     */
    showTutorialStepModal(stepIndex, opts) {
        const steps = this.TUTORIAL_STEPS;
        const idx = Math.max(0, Math.min(stepIndex, steps.length - 1));
        const step = steps[idx];
        const isFirst = idx <= 0;
        const isLast = idx >= steps.length - 1;

        const overlay = document.createElement('div');
        overlay.className = 'tutorial-guidance-overlay tutorial-step-overlay';
        overlay.id = 'tutorial-step-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', step.title);
        let html = '<div class="tutorial-guidance-box tutorial-step-box">';
        html += '<h2 class="tutorial-guidance-title">' + step.title + '</h2>';
        html += '<p class="tutorial-guidance-message">' + step.instruction + '</p>';
        html += '<p class="tutorial-guidance-why"><strong>Why?</strong> ' + step.why + '</p>';
        html += '<div class="tutorial-step-nav">';
        if (!isFirst) {
            html += '<button type="button" class="btn-secondary tutorial-step-back">← Back</button>';
        }
        html += '<span class="tutorial-step-indicator">' + (idx + 1) + ' / ' + steps.length + '</span>';
        html += '<button type="button" class="btn-primary tutorial-step-next">' + (isLast ? 'Got it' : 'Next →') + '</button>';
        html += '</div></div>';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        const close = () => {
            if (overlay.parentNode) overlay.remove();
        };
        overlay.querySelector('.tutorial-step-next').addEventListener('click', () => {
            close();
            if (typeof opts.onNext === 'function') opts.onNext();
        });
        const backBtn = overlay.querySelector('.tutorial-step-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                close();
                if (typeof opts.onBack === 'function') opts.onBack();
            });
        }
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) { close(); if (typeof opts.onNext === 'function') opts.onNext(); }
        });
    }

    /** Remove the tutorial step overlay if present (e.g. when auto-advancing). */
    removeTutorialStepModal() {
        const el = document.getElementById('tutorial-step-overlay');
        if (el && el.parentNode) el.remove();
    }

    /**
     * Show a tutorial guidance modal (title + what to do + why). Calls onDismiss when user clicks Got it.
     * @param {string} title - e.g. "Draw phase"
     * @param {string} message - What to do
     * @param {string} [whyText] - Why do this instead of other options
     * @param {function} onDismiss - Called when user clicks Got it (optional)
     */
    showTutorialGuidance(title, message, whyText, onDismiss) {
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-guidance-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', title);
        let html = '<div class="tutorial-guidance-box">';
        html += '<h2 class="tutorial-guidance-title">' + (title || 'Tutorial') + '</h2>';
        html += '<p class="tutorial-guidance-message">' + (message || '') + '</p>';
        if (whyText) {
            html += '<p class="tutorial-guidance-why"><strong>Why?</strong> ' + whyText + '</p>';
        }
        html += '<button type="button" class="btn-primary tutorial-guidance-dismiss" id="tutorial-guidance-got-it">Got it</button>';
        html += '</div>';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        const dismiss = () => {
            if (overlay.parentNode) overlay.remove();
            if (typeof onDismiss === 'function') onDismiss();
        };
        overlay.querySelector('#tutorial-guidance-got-it').addEventListener('click', dismiss);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) dismiss();
        });
    }

    showMessage(message, type = 'info') {
        // Create temporary message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? 'rgba(231, 76, 60, 0.9)' : 'rgba(52, 152, 219, 0.9)'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 3000;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 2000);
    }
}