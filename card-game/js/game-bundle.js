// FUM: Shatterlayers - Standalone Bundle (No Server Required)
// Auto-generated bundle - combines all game files

(function() {
'use strict';

// ===== js\config.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - GAME CONFIGURATION
 * =====================================================
 * 
 * 🎮 THE CONTROL PANEL FOR YOUR REALITY-BENDING CARD GAME 🎮
 * =====================================================
 * 
 * Hey there, future game designer! 👋
 * 
 * This is where ALL the magic numbers live. Think of it as the
 * "Settings" menu, but for code. Want faster games? Lower the HP.
 * Want more chaos? Crank up the energy. Want to break everything?
 * Set MAX_ENERGY to 9999 and watch the universe implode! 💥
 * 
 * HOW TO USE (The Fun Way):
 * 1. Find a number that looks interesting
 * 2. Change it to something else (preferably not "banana")
 * 3. Save the file
 * 4. Refresh your browser
 * 5. Watch your game either become amazing or completely break
 * 
 * PRO TIP: If you break something, just change it back! 
 * We've all been there. 😅
 * 
 * WARNING: Some values have limits - they're like guardrails
 * on a highway. You CAN drive off, but you probably shouldn't.
 * =====================================================
 */

// =====================================================
// SECTION 1: PLAYER SETTINGS
// =====================================================
// These control starting stats and limits
// =====================================================

const GAME_CONFIG = {
    
    // =================================================
    // HEALTH & ENERGY (The Life Force Section)
    // =================================================
    // NOVICE NOTE: HP = Health Points (how much ouch you can take before game over)
    // Energy = The magical juice that powers your reality-bending abilities
    // Think of it like mana, but cooler because it's called "Energy" 🎯
    
    STARTING_HP: 20,              // Starting health (10-30 recommended)
                                  // Lower = faster games (like speed chess but with cards)
                                  // Higher = longer games (like a chess match that lasts 3 days)
    
    STARTING_ENERGY: 3,           // Energy at game start (1-5 recommended)
                                  // More energy = more powerful opening moves
                                  // Less energy = you're basically a wizard with a cold
    
    MAX_ENERGY: 10,               // Maximum energy cap (5-15 recommended)
                                  // WARNING: Don't go above 15 or game balance breaks!
                                  // Seriously, we tested it. The AI cried. 😢
    
    ENERGY_PER_TURN: 1,           // Energy gained each turn (1-2 recommended)
                                  // Higher = more abilities per turn
    
    // =================================================
    // HAND & DECK SETTINGS (The Card Collection)
    // =================================================
    // NOVICE NOTE: These control how many cards you can hold and draw
    // It's like the rules for a card game, but in code form! 🃏
    
    MAX_HAND_SIZE: 7,             // Maximum cards in hand (5-10 recommended)
                                  // Standard card games use 7 (it's a magic number, trust us)
                                  // Too many = analysis paralysis
                                  // Too few = you're basically playing with one hand tied behind your back
    
    OPENING_HAND_SIZE: 5,         // Cards dealt at game start (3-7 recommended)
                                  // This is your starting hand - make it count! 🎲
    
    DRAW_PER_TURN: 2,             // Cards drawn each turn (1-3 recommended)
                                  // More cards = more options but faster games
                                  // Less cards = strategic suffering (it's a feature, not a bug)
    
    DECK_SIZE: 52,                // Total cards in deck (52 = standard deck)
                                  // Don't change unless adding custom cards
                                  // (Or unless you want to confuse everyone who knows how many cards are in a deck)
    
    // =================================================
    // LAYER SETTINGS (The Reality-Bending Section)
    // =================================================
    // NOVICE NOTE: Layers are different "realities" with unique rules
    // Think of them like difficulty levels, but sideways and with more existential dread
    // Currently supports 6 layers, but you can limit active ones
    // (Because sometimes you just want to keep things simple, you know?)
    
    ACTIVE_LAYERS: 6,             // How many layers are active (1-6)
                                  // Set to 3 for simpler games (like training wheels)
                                  // Set to 6 for full experience (like removing all safety rails)
    
    STARTING_LAYER: 1,             // Layer players start on (1-6)
                                  // Layer 1 is simplest (reality is normal, cards work normally)
                                  // Layer 6 is most complex (reality is a suggestion, cards do whatever they want)
    
    LAYER_SHIFT_COST: 1,           // Energy cost to shift layers (0-2 recommended)
                                  // 0 = free shifts (reality is cheap!)
                                  // 2 = expensive shifts (reality charges premium rates)
    
    // =================================================
    // GAME SPEED & TIMING
    // =================================================
    
    ANIMATION_SPEED: 300,         // Milliseconds for animations (100-1000)
                                  // Lower = faster, Higher = slower
                                  // 300 = smooth but quick
    
    TURN_TIMER: 0,                 // Seconds per turn (0 = no timer)
                                  // 0 = unlimited time
                                  // 30-120 = competitive play
                                  // Set to 0 for casual/learning
    
    AUTO_ADVANCE_PHASE: false,     // Auto-advance phases (true/false)
                                  // true = phases advance automatically
                                  // false = player clicks to advance
    
    // =================================================
    // WIN CONDITIONS
    // =================================================
    
    WIN_HP: 0,                     // HP needed to win (usually 0)
                                  // Opponent must reach this HP to lose
    
    WIN_ATTUNEMENTS: 4,            // Attunements needed to win (1-6)
                                  // Lower = faster games, Higher = longer games
    
    // =================================================
    // INTUITION SYSTEM (The "Trust Your Gut" Feature)
    // =================================================
    // NOVICE NOTE: Intuition checks let players guess cards for bonuses
    // It's like poker face reading, but with more cosmic energy and less actual poker
    // This is the "viral hook" - makes for great streaming moments! 📺
    
    INTUITION_ENABLED: true,       // Enable intuition system (true/false)
                                  // Set to false if you hate fun and good vibes
    
    INTUITION_COST: 2,             // Energy cost to force intuition check (1-5)
                                  // Higher = more strategic, Lower = more chaos
                                  // (Chaos is good for content, just saying)
    
    INTUITION_RANDOM_CHANCE: 0.15, // Chance for random intuition check (0.0-1.0)
                                  // 0.0 = never random (boring)
                                  // 1.0 = every turn (CHAOS MODE ACTIVATED)
                                  // 0.15 = 15% chance per turn (the sweet spot)
    
    // =================================================
    // AI OPPONENT SETTINGS
    // =================================================
    
    AI_DIFFICULTY: 2,              // AI difficulty (1-5)
                                  // 1 = Novice (random plays)
                                  // 2 = Adept (basic strategy)
                                  // 3 = Veteran (optimized)
                                  // 4 = Master (predictive)
                                  // 5 = Source (cheats - knows your hand!)
    
    AI_THINK_TIME: 1000,           // Milliseconds AI takes to "think" (500-3000)
                                  // Lower = faster, Higher = more realistic
    
    // =================================================
    // VISUAL SETTINGS
    // =================================================
    
    SHOW_CARD_TOOLTIPS: true,      // Show card info on hover (true/false)
    
    SHOW_ANIMATIONS: true,         // Enable visual animations (true/false)
                                  // Disable for better performance on slow computers
    
    SHOW_BATTLE_LOG: true,         // Show battle log panel (true/false)
    
    CARD_IMAGE_PATH: "visuals/cards/",  // Path to card images
                                       // Change if you move image folder
    
    // =================================================
    // DEBUG & DEVELOPMENT
    // =================================================
    
    DEBUG_MODE: false,             // Enable debug logging (true/false)
                                  // true = see console logs
                                  // false = clean console
    
    SHOW_FPS: false,               // Show frames per second (true/false)
                                  // Useful for performance testing
    
    SKIP_ANIMATIONS: false,        // Skip all animations (true/false)
                                  // Useful for fast testing
    
    // =================================================
    // EXPANSION SETTINGS
    // =================================================
    // NOVICE NOTE: These toggle features on/off
    // Set to true to enable, false to disable
    // =================================================
    
    EXPANSIONS: {
        // Future deck expansions
        faunaDeck: false,          // Creature/entity cards (not yet implemented)
        eventDeck: false,          // Random event cards (not yet implemented)
        
        // Layer expansions
        layer4plus: true,          // Enable Layers 4-6 (currently all 6 are active)
        
        // Feature toggles
        intuitionSystem: true,     // Intuition check system
        campaignMode: true,         // Story campaign mode
        multiplayer: false,         // Online multiplayer (not yet implemented)
        depthDie: false,           // Optional Depth Die (d6) mechanic - adds randomness
        
        // Advanced features
        customDecks: false,         // Build custom decks (not yet implemented)
        cardTrading: false,         // Trade cards (not yet implemented)
        achievements: false,        // Achievement system (not yet implemented)
    },
    
    // =================================================
    // TUTORIAL SETTINGS
    // =================================================
    
    TUTORIAL_ENABLED: true,        // Enable tutorial mode (true/false)
    
    TUTORIAL_AUTO_START: false,    // Auto-start tutorial on first play (true/false)
    
    TUTORIAL_HINT_TIMEOUT: 30000,  // Milliseconds before showing hint (10000-60000)
                                  // 30000 = 30 seconds
    
    // =================================================
    // BALANCE TWEAKS (ADVANCED)
    // =================================================
    // NOVICE NOTE: These fine-tune game balance
    // Only change if you understand game mechanics!
    // =================================================
    
    BALANCE: {
        // Damage multipliers
        layer2HealingBonus: 1.5,    // Hearts cards heal 50% more in Layer 2
        layer3SplitChance: 0.3,     // 30% chance attacks split in Layer 3
        layer4TrueFormBonus: 2,    // +2 Presence for True Forms in Layer 4
        layer6DamageMultiplier: 2,  // Double damage in Layer 6
        
        // Energy costs
        rerollCardCost: 1,          // Energy to reroll a card
        forceIntuitionCost: 2,      // Energy to force intuition check
        activateAceCost: 3,         // Energy to activate Ace ability
        extraLayerShiftCost: 1,     // Energy for extra layer shift
        drawExtraCardCost: 2,       // Energy to draw extra card
        
        // Attunement bonuses
        attunement1Bonus: "draw",    // 1 attunement = draw 1 card
        attunement2Bonus: "energy",  // 2 attunements = +1 energy per turn
        attunement3Bonus: "handSize", // 3 attunements = reduce opponent hand size
        attunement4Bonus: "win",     // 4 attunements = WIN!
    }
};

// =====================================================
// CONFIG (for module systems)
// =====================================================
// NOVICE NOTE: This makes the config available to other files
// =====================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_CONFIG;
}

// Make config globally available
if (typeof window !== 'undefined') {
    window.GAME_CONFIG = GAME_CONFIG;
}


// ===== js\cards.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - CARD DATABASE
 * =====================================================
 * 
 * 🃏 THE COMPLETE 52-CARD STARTER PACK 🃏
 * =====================================================
 * 
 * This is where ALL the cards live. Every single card in the game
 * is defined here, with its stats, effects, and flavor text.
 * It's like a digital card catalog, but for reality-bending cards.
 * 
 * Each card has:
 * - id: Unique identifier (like '2s' for 2 of Spades)
 * - suit: The suit (spades, hearts, diamonds, clubs)
 * - rank: The rank (2-10, or 11=J, 12=Q, 13=K, 14=A)
 * - name: The card's name (the cool part)
 * - type: Card type (entity, influence, artifact, layer)
 * - layerAffinity: Which layers this card works best in
 * - effects: What the card does when played
 * - flavor: Flavor text (the fun part)
 * 
 * NOVICE NOTE: To add a new card, just copy an existing one and
 * change the values. It's that simple! (Well, mostly)
 * 
 * =====================================================
 */

// Card Database - Complete 52-Card Starter Pack

const CARD_DATABASE = {
    // =================================================
    // SPADES (Void/Attack) - The "Hurt Things" Suit
    // =================================================
    // Spades are all about dealing damage, disrupting
    // opponents, and generally being mean. They're the
    // "attack" cards of the game.
    
    '2s': {
        id: '2s',
        suit: 'spades',
        rank: 2,
        name: 'Shadow Nip',
        type: 'influence',
        layerAffinity: [1, 2], // Works in layers 1 and 2
        effects: [{
            trigger: 'onPlay',        // Triggers when card is played
            target: 'enemyAdjacent',  // Targets adjacent enemy cards
            action: 'damage',         // Deals damage
            value: 1                  // 1 damage (it's a small bite)
        }],
        flavor: 'A quick strike from the void.' // The fun flavor text
    },
    '3s': {
        id: '3s',
        suit: 'spades',
        rank: 3,
        name: 'Flicker Scratch',
        type: 'influence',
        layerAffinity: [1, 3],
        effects: [{
            trigger: 'onPlay',
            target: 'self',
            action: 'buff',
            stat: 'presence',
            value: 1,
            duration: 1
        }],
        flavor: 'Reality flickers, then bleeds.'
    },
    '4s': {
        id: '4s',
        suit: 'spades',
        rank: 4,
        name: 'Void Pulse',
        type: 'influence',
        layerAffinity: [2, 4],
        effects: [{
            trigger: 'onPlay',
            target: 'enemy',
            action: 'removeBarrier',
            value: 1
        }],
        flavor: 'The void hungers for structure.'
    },
    '5s': {
        id: '5s',
        suit: 'spades',
        rank: 5,
        name: 'Hemorrhage Mark',
        type: 'influence',
        layerAffinity: [2, 5],
        effects: [{
            trigger: 'onPlay',
            target: 'enemyCard',
            action: 'debuff',
            stat: 'presence',
            value: -1,
            stackable: true,
            permanent: true
        }],
        flavor: 'Some wounds never heal.'
    },
    '6s': {
        id: '6s',
        suit: 'spades',
        rank: 6,
        name: 'Lunge Step',
        type: 'influence',
        layerAffinity: [3, 4],
        effects: [{
            trigger: 'onPlay',
            target: 'self',
            action: 'ignoreLayerAdvantage',
            duration: 1
        }],
        flavor: 'Strike where they least expect.'
    },
    '7s': {
        id: '7s',
        suit: 'spades',
        rank: 7,
        name: 'Bleed Trap',
        type: 'entity',
        layerAffinity: [3, 6],
        stats: { presence: 2, stability: 1, flux: 3 },
        effects: [{
            trigger: 'onCombatLoss',
            target: 'attacker',
            action: 'damage',
            value: 2
        }],
        flavor: 'Even in death, it takes you with it.'
    },
    '8s': {
        id: '8s',
        suit: 'spades',
        rank: 8,
        name: 'Rend Line',
        type: 'influence',
        layerAffinity: [4, 5],
        effects: [{
            trigger: 'onPlay',
            target: 'enemy',
            action: 'splitDamage',
            value: 2,
            targets: 2
        }],
        flavor: 'Tear reality asunder.'
    },
    '9s': {
        id: '9s',
        suit: 'spades',
        rank: 9,
        name: 'Fear Spike',
        type: 'influence',
        layerAffinity: [4, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'enemyCard',
            action: 'stun',
            duration: 1
        }],
        flavor: 'Fear paralyzes the mind.'
    },
    '10s': {
        id: '10s',
        suit: 'spades',
        rank: 10,
        name: 'Apex Bite',
        type: 'influence',
        layerAffinity: [5, 6],
        effects: [{
            trigger: 'onCombatWin',
            target: 'enemyCard',
            action: 'bonusDamage',
            condition: 'strengthDiff >= 3',
            value: 2
        }],
        flavor: 'The apex predator strikes.'
    },
    'Js': {
        id: 'Js',
        suit: 'spades',
        rank: 11,
        name: 'Shadow Trickster',
        type: 'entity',
        layerAffinity: [3, 6],
        stats: { presence: 3, stability: 2, flux: 4 },
        effects: [{
            trigger: 'onPlay',
            target: 'enemy',
            action: 'swapCards',
            count: 2
        }],
        flavor: 'Confusion is its greatest weapon.'
    },
    'Qs': {
        id: 'Qs',
        suit: 'spades',
        rank: 12,
        name: 'Night Matron',
        type: 'entity',
        layerAffinity: [4, 6],
        stats: { presence: 4, stability: 3, flux: 5 },
        effects: [{
            trigger: 'onPlay',
            target: 'opponent',
            action: 'cancelEffect',
            count: 1,
            duration: 1
        }],
        flavor: 'She silences the heart.'
    },
    'Ks': {
        id: 'Ks',
        suit: 'spades',
        rank: 13,
        name: 'Void Sovereign',
        type: 'entity',
        layerAffinity: [5, 6],
        stats: { presence: 5, stability: 4, flux: 6 },
        effects: [{
            trigger: 'onPlay',
            target: 'opponent',
            action: 'increaseLayerShiftCost',
            value: 1,
            duration: 1
        }],
        flavor: 'The void commands, reality obeys.'
    },
    'As': {
        id: 'As',
        suit: 'spades',
        rank: 14,
        name: 'Abyssal Anchor',
        type: 'artifact',
        layerAffinity: [1, 2, 3, 4, 5, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'any',
            action: 'destroy',
            count: 1,
            bonus: {
                condition: 'isRoyal',
                action: 'draw',
                value: 1
            }
        }],
        flavor: 'The anchor that drags all to the abyss.'
    },

    // HEARTS (Life/Healing)
    '2h': {
        id: '2h',
        suit: 'hearts',
        rank: 2,
        name: 'Coup De Glare',
        type: 'influence',
        layerAffinity: [1, 3],
        effects: [{
            trigger: 'onPlay',
            target: 'enemyEntity',
            action: 'damage',
            value: 1,
            bonus: {
                condition: 'targetFaceup',
                action: 'gainEnergy',
                value: 1
            }
        }],
        flavor: 'A flash of light, a moment of clarity.'
    },
    '3h': {
        id: '3h',
        suit: 'hearts',
        rank: 3,
        name: 'Calm Aura',
        type: 'influence',
        layerAffinity: [1, 4],
        effects: [{
            trigger: 'onPlay',
            target: 'friendlyCard',
            action: 'preventDamage',
            value: 1
        }],
        flavor: 'Peace flows from within.'
    },
    '4h': {
        id: '4h',
        suit: 'hearts',
        rank: 4,
        name: 'Burning Rage',
        type: 'influence',
        layerAffinity: [2, 4],
        effects: [{
            trigger: 'onDestroy',
            target: 'destroyedCard',
            action: 'gainEnergy',
            value: 'cardEnergyCost',
            max: 5
        }],
        flavor: 'From destruction comes power.'
    },
    '5h': {
        id: '5h',
        suit: 'hearts',
        rank: 5,
        name: 'Flame Shield',
        type: 'influence',
        layerAffinity: [2, 5],
        effects: [{
            trigger: 'onPlay',
            target: 'player',
            action: 'shield',
            value: 2,
            duration: 1
        }],
        flavor: 'A shield of pure flame.'
    },
    '6h': {
        id: '6h',
        suit: 'hearts',
        rank: 6,
        name: 'Warm Bond',
        type: 'influence',
        layerAffinity: [3, 5],
        effects: [{
            trigger: 'onPlay',
            target: 'friendlyEntity',
            action: 'buff',
            stat: 'presence',
            value: 1,
            duration: 1
        }, {
            trigger: 'onPlay',
            target: 'friendlyEntity',
            action: 'buff',
            stat: 'stability',
            value: 1,
            duration: 1
        }],
        flavor: 'Together we are stronger.'
    },
    '7h': {
        id: '7h',
        suit: 'hearts',
        rank: 7,
        name: 'Scorch Mark',
        type: 'influence',
        layerAffinity: [3, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'enemyCard',
            action: 'damage',
            value: 2
        }, {
            trigger: 'onPlay',
            target: 'enemyCard',
            action: 'mark',
            effect: 'nextHitPlus2'
        }],
        flavor: 'Marked for destruction.'
    },
    '8h': {
        id: '8h',
        suit: 'hearts',
        rank: 8,
        name: 'Harmonize Field',
        type: 'influence',
        layerAffinity: [4, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'player',
            action: 'reduceDamage',
            value: 1,
            duration: 1
        }],
        flavor: 'Harmony deflects discord.'
    },
    '9h': {
        id: '9h',
        suit: 'hearts',
        rank: 9,
        name: 'Heart Glow',
        type: 'influence',
        layerAffinity: [4, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'discard',
            action: 'recover',
            count: 1
        }],
        flavor: 'The heart remembers all.'
    },
    '10h': {
        id: '10h',
        suit: 'hearts',
        rank: 10,
        name: 'Inspiration',
        type: 'influence',
        layerAffinity: [5, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'self',
            action: 'echo',
            effect: 'nextCardInRowRankPlus1',
            duration: 1
        }],
        flavor: 'Inspiration flows through all.'
    },
    'Jh': {
        id: 'Jh',
        suit: 'hearts',
        rank: 11,
        name: 'Joy Sprite',
        type: 'entity',
        layerAffinity: [2, 5],
        stats: { presence: 2, stability: 2, flux: 3 },
        effects: [{
            trigger: 'onPlay',
            target: 'sameSlot',
            action: 'swapCards',
            count: 1
        }],
        flavor: 'Joy rearranges reality.'
    },
    'Qh': {
        id: 'Qh',
        suit: 'hearts',
        rank: 12,
        name: 'Matriarch',
        type: 'entity',
        layerAffinity: [3, 6],
        stats: { presence: 3, stability: 4, flux: 4 },
        effects: [{
            trigger: 'endOfRound',
            target: 'player',
            action: 'heal',
            value: 'heartsRevealed',
            max: 3
        }],
        flavor: 'She protects her own.'
    },
    'Kh': {
        id: 'Kh',
        suit: 'hearts',
        rank: 13,
        name: 'Scarlet Matron',
        type: 'entity',
        layerAffinity: [4, 6],
        stats: { presence: 4, stability: 5, flux: 5 },
        effects: [{
            trigger: 'endOfTurn',
            target: 'opponent',
            action: 'damage',
            value: 1
        }],
        flavor: 'Life finds a way.'
    },
    'Ah': {
        id: 'Ah',
        suit: 'hearts',
        rank: 14,
        name: 'Vitality Anchor',
        type: 'artifact',
        layerAffinity: [1, 2, 3, 4, 5, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'choice',
            action: 'fullHealOrCleanse',
            options: ['fullHeal', 'cleanseDebuffs']
        }],
        flavor: 'Return to the source of life.'
    },

    // DIAMONDS (Vision/Insight)
    '2d': {
        id: '2d',
        suit: 'diamonds',
        rank: 2,
        name: 'Glimmer Peek',
        type: 'influence',
        layerAffinity: [1, 3],
        effects: [{
            trigger: 'onPlay',
            target: 'deck',
            action: 'peekTopCard',
            choice: 'leaveOrBottom'
        }],
        flavor: 'A glimpse of what\'s to come.'
    },
    '3d': {
        id: '3d',
        suit: 'diamonds',
        rank: 3,
        name: 'Lens Shift',
        type: 'influence',
        layerAffinity: [1, 4],
        effects: [{
            trigger: 'onPlay',
            target: 'deck',
            action: 'reorder',
            count: 2
        }],
        flavor: 'Adjust the lens, change the view.'
    },
    '4d': {
        id: '4d',
        suit: 'diamonds',
        rank: 4,
        name: 'Minor Scry',
        type: 'influence',
        layerAffinity: [2, 4],
        effects: [{
            trigger: 'onPlay',
            target: 'enemyGrid',
            action: 'revealFacedown',
            count: 1,
            staysRevealed: true
        }],
        flavor: 'See what they hide.'
    },
    '5d': {
        id: '5d',
        suit: 'diamonds',
        rank: 5,
        name: 'Echo Sense',
        type: 'influence',
        layerAffinity: [2, 5],
        effects: [{
            trigger: 'onPlay',
            target: 'self',
            action: 'drawThenDiscard',
            count: 1
        }],
        flavor: 'Sense the echoes of possibility.'
    },
    '6d': {
        id: '6d',
        suit: 'diamonds',
        rank: 6,
        name: 'Intuition Pull',
        type: 'influence',
        layerAffinity: [3, 5],
        effects: [{
            trigger: 'onPlay',
            target: 'friendlyFaceupCard',
            action: 'move',
            restriction: 'sameRowOrPhase'
        }],
        flavor: 'Intuition guides the hand.'
    },
    '7d': {
        id: '7d',
        suit: 'diamonds',
        rank: 7,
        name: 'Vortex Ping',
        type: 'entity',
        layerAffinity: [3, 6],
        stats: { presence: 2, stability: 2, flux: 3 },
        effects: [{
            trigger: 'onPlay',
            target: 'enemyCard',
            action: 'mark',
            effect: 'nextHitPlus2'
        }],
        flavor: 'Marked for destruction.'
    },
    '8d': {
        id: '8d',
        suit: 'diamonds',
        rank: 8,
        name: 'Sight Bloom',
        type: 'influence',
        layerAffinity: [4, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'choice',
            action: 'revealSharedRevealOrHand',
            sharedRevealCount: 2,
            handCount: 'all'
        }],
        flavor: 'Vision blooms like a flower.'
    },
    '9d': {
        id: '9d',
        suit: 'diamonds',
        rank: 9,
        name: 'Premonition',
        type: 'influence',
        layerAffinity: [4, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'deck',
            action: 'nameSuitAndReveal',
            bonus: {
                condition: 'correct',
                action: 'gainEnergy',
                value: 1
            }
        }],
        flavor: 'See their hand before they play it.'
    },
    '10d': {
        id: '10d',
        suit: 'diamonds',
        rank: 10,
        name: 'Revelation',
        type: 'influence',
        layerAffinity: [5, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'self',
            action: 'echo',
            effect: 'nextAbilityTriggersTwice',
            duration: 1
        }],
        flavor: 'The truth reveals itself twice.'
    },
    'Jd': {
        id: 'Jd',
        suit: 'diamonds',
        rank: 11,
        name: 'Gleam Trickster',
        type: 'entity',
        layerAffinity: [3, 6],
        stats: { presence: 3, stability: 2, flux: 4 },
        effects: [{
            trigger: 'onPlay',
            target: 'choice',
            action: 'reorderSharedRevealOrDiscard',
            sharedRevealCount: 3,
            discardCount: 'top'
        }],
        flavor: 'Rearrange the future.'
    },
    'Qd': {
        id: 'Qd',
        suit: 'diamonds',
        rank: 12,
        name: 'Oracle',
        type: 'entity',
        layerAffinity: [4, 6],
        stats: { presence: 3, stability: 3, flux: 5 },
        effects: [{
            trigger: 'onPlay',
            target: 'self',
            action: 'intuitionNearMiss',
            effect: 'offByOneCountsAsCorrect',
            duration: 1
        }],
        flavor: 'The oracle sees all paths.'
    },
    'Kd': {
        id: 'Kd',
        suit: 'diamonds',
        rank: 13,
        name: 'Vision Sovereign',
        type: 'entity',
        layerAffinity: [5, 6],
        stats: { presence: 4, stability: 4, flux: 6 },
        effects: [{
            trigger: 'onPlay',
            target: 'self',
            action: 'extraPlay',
            count: 1
        }],
        flavor: 'Vision commands the flow of time.'
    },
    'Ad': {
        id: 'Ad',
        suit: 'diamonds',
        rank: 14,
        name: 'Insight Anchor',
        type: 'artifact',
        layerAffinity: [1, 2, 3, 4, 5, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'discard',
            action: 'searchAndPlay',
            cost: 3,
            bonus: {
                action: 'triggerIntuitionCheck'
            }
        }],
        flavor: 'Find exactly what you need.'
    },

    // CLUBS (Matter/Defense)
    '2c': {
        id: '2c',
        suit: 'clubs',
        rank: 2,
        name: 'Pebble Shield',
        type: 'influence',
        layerAffinity: [1, 3],
        effects: [{
            trigger: 'onPlay',
            target: 'friendlyCard',
            action: 'shield',
            value: 1
        }],
        flavor: 'Even pebbles can block the way.'
    },
    '3c': {
        id: '3c',
        suit: 'clubs',
        rank: 3,
        name: 'Brace Frame',
        type: 'influence',
        layerAffinity: [1, 4],
        effects: [{
            trigger: 'onPlay',
            target: 'friendlyCard',
            action: 'preventSwapMove',
            duration: 1
        }],
        flavor: 'Stand firm against all angles.'
    },
    '4c': {
        id: '4c',
        suit: 'clubs',
        rank: 4,
        name: 'Minor Forge',
        type: 'influence',
        layerAffinity: [2, 4],
        effects: [{
            trigger: 'onPlay',
            target: 'friendlyCard',
            action: 'createBarrier',
            value: 1
        }],
        flavor: 'Forge protection from nothing.'
    },
    '5c': {
        id: '5c',
        suit: 'clubs',
        rank: 5,
        name: 'Reinforce',
        type: 'influence',
        layerAffinity: [2, 5],
        effects: [{
            trigger: 'onPlay',
            target: 'friendlyCard',
            action: 'shield',
            value: 2,
            duration: 1
        }],
        flavor: 'Strength in unity.'
    },
    '6c': {
        id: '6c',
        suit: 'clubs',
        rank: 6,
        name: 'Toolcraft',
        type: 'influence',
        layerAffinity: [3, 5],
        effects: [{
            trigger: 'onPlay',
            target: 'conditional',
            action: 'drawOrShield',
            condition: 'hasBarrier',
            ifTrue: { action: 'draw', value: 1 },
            ifFalse: { action: 'shield', value: 1 }
        }],
        flavor: 'Craft the perfect tool.'
    },
    '7c': {
        id: '7c',
        suit: 'clubs',
        rank: 7,
        name: 'Gnome Work',
        type: 'entity',
        layerAffinity: [3, 6],
        stats: { presence: 1, stability: 3, flux: 2 },
        effects: [{
            trigger: 'passive',
            target: 'barriers',
            action: 'barrierGrantsPresence',
            value: 1
        }],
        flavor: 'Small hands, great works.'
    },
    '8c': {
        id: '8c',
        suit: 'clubs',
        rank: 8,
        name: 'Bastion Web',
        type: 'influence',
        layerAffinity: [4, 6],
        effects: [{
            trigger: 'onBarrierHit',
            target: 'player',
            action: 'gainEnergy',
            value: 1,
            max: 2,
            perRound: true
        }],
        flavor: 'An impenetrable barrier.'
    },
    '9c': {
        id: '9c',
        suit: 'clubs',
        rank: 9,
        name: 'Fortify Line',
        type: 'influence',
        layerAffinity: [4, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'allFaceupCards',
            action: 'shield',
            value: 1,
            duration: 1
        }],
        flavor: 'Fortify all positions.'
    },
    '10c': {
        id: '10c',
        suit: 'clubs',
        rank: 10,
        name: 'Bastion Lock',
        type: 'influence',
        layerAffinity: [5, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'friendlyCard',
            action: 'immovable',
            duration: 2
        }],
        flavor: 'Unmovable, unbreakable.'
    },
    'Jc': {
        id: 'Jc',
        suit: 'clubs',
        rank: 11,
        name: 'Earth Trickster',
        type: 'entity',
        layerAffinity: [3, 6],
        stats: { presence: 3, stability: 3, flux: 4 },
        effects: [{
            trigger: 'onPlay',
            target: 'any',
            action: 'swapCards',
            count: 2
        }],
        flavor: 'The earth rearranges itself.'
    },
    'Qc': {
        id: 'Qc',
        suit: 'clubs',
        rank: 12,
        name: 'Stone Guide',
        type: 'entity',
        layerAffinity: [4, 6],
        stats: { presence: 3, stability: 5, flux: 4 },
        effects: [{
            trigger: 'onPlay',
            target: 'friendlyAdjacent',
            action: 'immuneToEffects',
            duration: 1
        }],
        flavor: 'Under stone\'s protection.'
    },
    'Kc': {
        id: 'Kc',
        suit: 'clubs',
        rank: 13,
        name: 'Matter Sovereign',
        type: 'entity',
        layerAffinity: [5, 6],
        stats: { presence: 4, stability: 6, flux: 5 },
        effects: [{
            trigger: 'onPlay',
            target: 'all',
            action: 'destroyAllBarriers',
            bonus: {
                action: 'gainEnergy',
                value: 'barriersDestroyed',
                max: 3
            }
        }],
        flavor: 'Matter commands, barriers fall.'
    },
    'Ac': {
        id: 'Ac',
        suit: 'clubs',
        rank: 14,
        name: 'Terra Anchor',
        type: 'artifact',
        layerAffinity: [1, 2, 3, 4, 5, 6],
        effects: [{
            trigger: 'onPlay',
            target: 'choice',
            action: 'createBarriersOrConvert',
            options: [
                { action: 'createBarriers', count: 2 },
                { action: 'convertBarrierToStability', value: 2, permanent: true }
            ]
        }],
        flavor: 'Anchor yourself to the earth.'
    }
};

// Helper functions
function getCard(id) {
    return CARD_DATABASE[id] ? Object.assign({}, CARD_DATABASE[id]) : null;
}

function getAllCards() {
    return Object.values(CARD_DATABASE);
}

function getCardsBySuit(suit) {
    return getAllCards().filter(card => card.suit === suit);
}

function getCardsByRank(rank) {
    return getAllCards().filter(card => card.rank === rank);
}

function getCardsByLayer(layer) {
    return getAllCards().filter(card => 
        card.layerAffinity.includes(layer) || card.layerAffinity.length === 6
    );
}

// Make globally available for standalone bundle
// NOVICE NOTE: This makes the card database and helper functions
// available globally so other parts of the code can access them
// even when ES6 modules aren't available (like in the standalone bundle)
if (typeof window !== 'undefined') {
    window.CARD_DATABASE = CARD_DATABASE;
    window.getCard = getCard;
    window.getAllCards = getAllCards;
    window.getCardsBySuit = getCardsBySuit;
    window.getCardsByRank = getCardsByRank;
    window.getCardsByLayer = getCardsByLayer;
}

// ===== js\deck.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - DECK MANAGEMENT
 * =====================================================
 * 
 * 🃏 THE DECK: Where All The Cards Live 🃏
 * =====================================================
 * 
 * This class handles the deck - shuffling, drawing, and
 * managing all 52 cards. It's like a card dealer, but
 * automated and without the need for tips.
 * 
 * Features:
 * - Shuffling (randomizes card order - very important!)
 * - Drawing (gives cards to players)
 * - Reshuffling (when deck runs out, shuffle discard back in)
 * 
 * NOVICE NOTE: The deck is just an array of card IDs.
 * When you shuffle, you randomize the order. When you draw,
 * you take cards from the top. Simple, right?
 * 
 * =====================================================
 */

// Deck Management

class Deck {
    constructor(cards = null) {
        this.cards = cards || this.createStarterDeck();
        this.shuffle();
    }

    createStarterDeck() {
        // Create a 52-card starter deck (one of each card)
        const allCards = getAllCards();
        return allCards.map(card => card.id);
    }

    shuffle() {
        // Fisher-Yates shuffle
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(count = 1) {
        const drawn = [];
        for (let i = 0; i < count && this.cards.length > 0; i++) {
            drawn.push(this.cards.pop());
        }
        return drawn;
    }

    drawRandom(count = 1) {
        const drawn = [];
        for (let i = 0; i < count && this.cards.length > 0; i++) {
            const index = Math.floor(Math.random() * this.cards.length);
            drawn.push(this.cards.splice(index, 1)[0]);
        }
        return drawn;
    }

    add(cardId) {
        this.cards.push(cardId);
    }

    addToTop(cardId) {
        this.cards.unshift(cardId);
    }

    addToBottom(cardId) {
        this.cards.push(cardId);
    }

    remove(cardId) {
        const index = this.cards.indexOf(cardId);
        if (index > -1) {
            return this.cards.splice(index, 1)[0];
        }
        return null;
    }

    peek(count = 1) {
        return this.cards.slice(-count).reverse();
    }

    reorderTop(count = 2) {
        if (this.cards.length < count) return;
        const top = this.cards.splice(-count);
        // Allow player to reorder (for now, just reverse)
        return top.reverse();
    }

    search(cardId) {
        return this.cards.indexOf(cardId);
    }

    get size() {
        return this.cards.length;
    }

    isEmpty() {
        return this.cards.length === 0;
    }
}

// ===== js\board.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - BOARD/GRID MANAGEMENT
 * =====================================================
 * 
 * 🎯 THE BOARD: Where Cards Go To Battle 🎯
 * =====================================================
 * 
 * This class manages the game board - the 3x3 grids where
 * players place their cards. Each player has their own grid,
 * and cards placed there can attack, defend, and do all
 * sorts of reality-bending things.
 * 
 * Features:
 * - 3x3 grid per player (9 slots total per player)
 * - Slot types: Self, Action, Outcome (the three columns)
 * - Card placement and removal
 * - Adjacent slot detection (for effects that target neighbors)
 * 
 * NOVICE NOTE: The board is just a 2D array (array of arrays).
 * board[playerId][row][col] gives you the card at that position.
 * It's like coordinates, but for cards!
 * 
 * =====================================================
 */

// Board/Grid Management

class Board {
    constructor() {
        this.grids = {
            1: this.createGrid(), // Player 1
            2: this.createGrid()  // Player 2
        };
    }

    createGrid() {
        // 3x3 grid with slot types: Self, Action, Outcome
        const grid = [];
        const slotTypes = ['self', 'action', 'outcome'];
        
        for (let row = 0; row < 3; row++) {
            grid[row] = [];
            for (let col = 0; col < 3; col++) {
                grid[row][col] = {
                    type: slotTypes[col],
                    card: null,
                    row,
                    col,
                    effects: [],
                    barriers: 0
                };
            }
        }
        
        return grid;
    }

    placeCard(playerId, row, col, cardId) {
        const grid = this.grids[playerId];
        if (!grid || !grid[row] || !grid[row][col]) {
            return { success: false, message: 'Invalid grid position' };
        }

        const slot = grid[row][col];
        if (slot.card !== null) {
            return { success: false, message: 'Slot already occupied' };
        }

        slot.card = cardId;
        return { success: true, slot };
    }

    removeCard(playerId, row, col) {
        const grid = this.grids[playerId];
        if (!grid || !grid[row] || !grid[row][col]) {
            return null;
        }

        const cardId = grid[row][col].card;
        grid[row][col].card = null;
        grid[row][col].effects = [];
        return cardId;
    }

    getCard(playerId, row, col) {
        const grid = this.grids[playerId];
        if (!grid || !grid[row] || !grid[row][col]) {
            return null;
        }
        return grid[row][col].card;
    }

    getSlot(playerId, row, col) {
        const grid = this.grids[playerId];
        if (!grid || !grid[row] || !grid[row][col]) {
            return null;
        }
        return grid[row][col];
    }

    getAdjacentSlots(playerId, row, col) {
        const adjacent = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                const slot = this.getSlot(playerId, newRow, newCol);
                if (slot) {
                    adjacent.push(slot);
                }
            }
        }

        return adjacent;
    }

    getRow(playerId, row) {
        const grid = this.grids[playerId];
        if (!grid || !grid[row]) {
            return [];
        }
        return grid[row];
    }

    getColumn(playerId, col) {
        const grid = this.grids[playerId];
        if (!grid) {
            return [];
        }
        return grid.map(row => row[col]);
    }

    getAllCards(playerId) {
        const grid = this.grids[playerId];
        if (!grid) {
            return [];
        }
        
        const cards = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (grid[row][col].card) {
                    cards.push({
                        cardId: grid[row][col].card,
                        row,
                        col,
                        slot: grid[row][col]
                    });
                }
            }
        }
        return cards;
    }

    getEmptySlots(playerId) {
        const grid = this.grids[playerId];
        if (!grid) {
            return [];
        }
        
        const empty = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (grid[row][col].card === null) {
                    empty.push({
                        row,
                        col,
                        slot: grid[row][col]
                    });
                }
            }
        }
        return empty;
    }

    addBarrier(playerId, row, col) {
        const slot = this.getSlot(playerId, row, col);
        if (slot) {
            slot.barriers += 1;
            return true;
        }
        return false;
    }

    removeBarrier(playerId, row, col) {
        const slot = this.getSlot(playerId, row, col);
        if (slot && slot.barriers > 0) {
            slot.barriers -= 1;
            return true;
        }
        return false;
    }

    clear() {
        this.grids = {
            1: this.createGrid(),
            2: this.createGrid()
        };
    }
}

// ===== js\layers.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - LAYER SYSTEM
 * =====================================================
 * 
 * 🌌 THE LAYERS: Six Realities, One Game 🌌
 * =====================================================
 * 
 * This system manages the 6 reality layers - different
 * dimensions with unique rules. Players can shift between
 * layers, and each layer changes how cards behave.
 * 
 * The 6 Layers:
 * - Layer 1: Physical (normal reality, straightforward combat)
 * - Layer 2: Emotional (warm glows, hearts cards are stronger)
 * - Layer 3: Fractal (particles, attacks can split/chain)
 * - Layer 4: Archetypal (sacred geometry, entities reveal true forms)
 * - Layer 5: Conceptual (minimal icons, rules can be bent)
 * - Layer 6: Source (white/gold, reality-breaking effects)
 * 
 * NOVICE NOTE: Layers are like difficulty modes, but sideways.
 * Each layer has unique rules that affect gameplay. Shifting
 * layers costs energy, but can give you strategic advantages.
 * 
 * =====================================================
 */

// Layer System

const LAYERS = {
    1: {
        name: 'Physical',
        color: '#5D4A3B',
        description: 'The material plane. Standard combat, no special effects.',
        effects: {
            onEnter: (player) => {
                // +1 Defense to all Entities
                return { type: 'buffAllEntities', stat: 'stability', value: 1 };
            },
            combat: {
                type: 'standard'
            },
            flux: false
        }
    },
    2: {
        name: 'Emotional',
        color: '#FF9A8B',
        description: 'Feelings shape reality. Influence cards +50% effect, Hearts abilities doubled.',
        effects: {
            onEnter: (player) => {
                return { type: 'amplifyInfluence', multiplier: 1.5 };
            },
            combat: {
                type: 'healing',
                healOnWin: 1
            },
            flux: false
        }
    },
    3: {
        name: 'Fractal',
        color: '#4ECDC4',
        description: 'Reality repeats. Attacks may split to adjacent, Flux triggers twice.',
        effects: {
            onEnter: (player) => {
                return { type: 'enableEcho' };
            },
            combat: {
                type: 'split',
                canSplit: true
            },
            flux: true,
            fluxMultiplier: 2
        }
    },
    4: {
        name: 'Archetypal',
        color: '#F1C40F',
        description: 'True forms revealed. Entities +2 Presence, Queen abilities affect whole row.',
        effects: {
            onEnter: (player) => {
                return { type: 'revealTrueForm', buff: { stat: 'presence', value: 2 } };
            },
            combat: {
                type: 'trueForm'
            },
            flux: true
        }
    },
    5: {
        name: 'Conceptual',
        color: '#3498DB',
        description: 'Rules bend. Can treat 1 card as another type, King abilities affect entire grid.',
        effects: {
            onEnter: (player) => {
                return { type: 'enableConceptOverride', count: 1 };
            },
            combat: {
                type: 'redirect',
                canRedirect: true
            },
            flux: true
        }
    },
    6: {
        name: 'Source',
        color: '#FFFFFF',
        description: 'Pure potential. Double all damage/effects, can play from discard. Source Fade after leaving.',
        effects: {
            onEnter: (player) => {
                return { type: 'doubleEffects', multiplier: 2 };
            },
            combat: {
                type: 'doubleDamage',
                backlash: 1
            },
            flux: true,
            canPlayFromDiscard: true
        }
    }
};

function getLayer(layerNumber) {
    return LAYERS[layerNumber] || null;
}

function shiftLayer(player, direction, gameState) {
    const currentLayer = player.layer;
    const newLayer = currentLayer + direction;
    
    if (newLayer < 1 || newLayer > 6) {
        return { success: false, message: 'Cannot shift beyond layer bounds' };
    }

    // Check if player has energy for extra shift
    if (direction !== 0 && player.energy < 1) {
        return { success: false, message: 'Not enough energy to shift layers' };
    }

    // Trigger exit effects
    const exitEffects = triggerLayerExit(currentLayer, player, gameState);
    
    // Update layer
    player.layer = newLayer;
    if (direction !== 0) {
        player.energy -= 1;
    }
    
    // Trigger entry effects
    const entryEffects = triggerLayerEntry(newLayer, player, gameState);
    
    return {
        success: true,
        newLayer,
        exitEffects,
        entryEffects
    };
}

function triggerLayerExit(layer, player, gameState) {
    const layerData = getLayer(layer);
    if (!layerData) return [];
    
    const effects = [];
    
    // Trigger Flux if applicable
    if (layerData.effects.flux) {
        effects.push({
            type: 'flux',
            layer,
            player: player.id
        });
    }
    
    // Special exit effects
    if (layer === 6) {
        // Source Fade debuff
        effects.push({
            type: 'sourceFade',
            player: player.id,
            duration: 2
        });
    }
    
    return effects;
}

function triggerLayerEntry(layer, player, gameState) {
    const layerData = getLayer(layer);
    if (!layerData) return [];
    
    const effects = [];
    const entryEffect = layerData.effects.onEnter(player);
    
    if (entryEffect) {
        effects.push(entryEffect);
    }
    
    return effects;
}

function applyLayerEffects(layer, effectType, context) {
    const layerData = getLayer(layer);
    if (!layerData) return null;
    
    switch (effectType) {
        case 'combat':
            return layerData.effects.combat;
        case 'ability':
            // Layer-specific ability modifications
            return layerData.effects;
        default:
            return null;
    }
}

function canPlayCardInLayer(card, layer) {
    // Cards with all layers in affinity can be played anywhere
    if (card.layerAffinity.length === 6) {
        return true;
    }
    
    // Check if card's layer affinity includes current layer
    return card.layerAffinity.includes(layer);
}

// ===== js\intuition.js =====
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

class IntuitionSystem {
    constructor() {
        this.active = false;
        this.currentCheck = null;
    }

    triggerCheck(playerId, opponent, gameState) {
        // Opponent selects 3 cards from hand/deck
        const availableCards = [Object.assign({}, opponent).hand];
        
        if (availableCards.length < 3) {
            // Draw from deck if needed
            const needed = 3 - availableCards.length;
            const drawn = gameState.shared.drawPile.draw(needed);
            availableCards.push(Object.assign({}, drawn));
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

// ===== js\battlelog.js =====
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

// for use in game


// ===== js\ai.js =====
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

class AIOpponent {
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

// ===== js\audio-manager.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - AUDIO MANAGER
 * =====================================================
 * 
 * Handles all game audio with correct file paths
 * =====================================================
 */

// =====================================================
// AUDIO MANAGER SYSTEM
// =====================================================
const AudioManager = {
    
    // Sound file arrays - all from main sounds folder
    whooshSounds: [
        'bwoosh.mp3',
        'floom.mp3',
        'fwoop.mp3',
        'fwoosh.mp3',
        'sawoosh.mp3',
        'swash.mp3',
        'swing.mp3',
        'swip.mp3',
        'swish.mp3',
        'swoop.mp3',
        'swoosh.mp3',
        'woosh.mp3'
    ],
    
    deathSounds: [
        'fall.mp3',
        'punch.mp3',
        'male_grunt.mp3'
    ],
    
    gameTracks: [
        'cinematic_intro.mp3',
        'cinematic_opening.mp3'
    ],
    
    // Audio elements
    currentMusic: null,
    soundEffects: [],
    
    // Settings
    musicEnabled: true,
    sfxEnabled: true,
    volume: 0.7,
    
    // Initialize
    init: function() {
        this.loadSettings();
        // Don't auto-play title music - intro sequence will handle it
    },
    
    /**
     * Play random whoosh sound for card movement
     * =====================================================
     * NOVICE NOTE: Called when cards are dealt, played, or moved
     */
    playCardMovement: function() {
        if (!this.sfxEnabled) return;
        
        const randomIndex = Math.floor(Math.random() * this.whooshSounds.length);
        const soundFile = this.whooshSounds[randomIndex];
        this.playSound(soundFile);
    },
    
    /**
     * Play magic attack sound
     * =====================================================
     * NOVICE NOTE: Called during combat or ability triggers
     */
    playMagicAttack: function() {
        if (!this.sfxEnabled) return;
        this.playSound('magic_attack.mp3');
    },
    
    /**
     * Play random death sound
     * =====================================================
     * NOVICE NOTE: Called when cards are destroyed
     */
    playDeathSound: function() {
        if (!this.sfxEnabled) return;
        
        const randomIndex = Math.floor(Math.random() * this.deathSounds.length);
        const soundFile = this.deathSounds[randomIndex];
        this.playSound(soundFile);
    },
    
    /**
     * Generic play sound - ALL from main sounds folder
     * =====================================================
     * NOVICE NOTE: All sound effects are in /sounds/ folder
     */
    playSound: function(fileName) {
        try {
            const audio = new Audio('sounds/' + fileName);
            audio.volume = this.volume;
            audio.play().catch(e => {
                // Silently fail if audio can't play (user interaction required, etc.)
                if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                    console.log('Audio play failed:', e);
                }
            });
            
            this.soundEffects.push(audio);
            
            audio.onended = () => {
                const index = this.soundEffects.indexOf(audio);
                if (index > -1) this.soundEffects.splice(index, 1);
            };
        } catch (e) {
            if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                console.error('Error playing sound:', fileName, e);
            }
        }
    },
    
    /**
     * Play title music
     * =====================================================
     * NOVICE NOTE: Loops continuously on title screen
     */
    playTitleMusic: function() {
        if (!this.musicEnabled) return;
        
        this.stopMusic();
        
        try {
            this.currentMusic = new Audio('sounds/universfield-dark-mystery-intro-352303.mp3');
            this.currentMusic.volume = this.volume;
            this.currentMusic.loop = true;
            this.currentMusic.play().catch(e => {
                if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                    console.log('Title music play failed:', e);
                }
            });
        } catch (e) {
            if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                console.error('Error playing title music:', e);
            }
        }
    },
    
    /**
     * Start game music - from sounds folder
     * =====================================================
     * NOVICE NOTE: Randomly selects from available game tracks, plays next when current ends
     */
    playGameMusic: function() {
        if (!this.musicEnabled) return;
        
        // If no game tracks available, don't play anything
        if (this.gameTracks.length === 0) {
            return;
        }
        
        this.stopMusic();
        
        const randomIndex = Math.floor(Math.random() * this.gameTracks.length);
        const trackFile = this.gameTracks[randomIndex];
        
        try {
            this.currentMusic = new Audio('tracks/' + trackFile);
            this.currentMusic.volume = this.volume;
            this.currentMusic.loop = false;
            
            // Play next track when this one ends
            this.currentMusic.onended = () => {
                this.playGameMusic(); // Recursively play next random track
            };
            
            this.currentMusic.play().catch(e => {
                if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                    console.log('Game music play failed:', e);
                }
            });
        } catch (e) {
            if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                console.error('Error playing game music:', e);
            }
        }
    },
    
    /**
     * Stop all music
     * =====================================================
     */
    stopMusic: function() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    },
    
    /**
     * Stop all sound effects
     * =====================================================
     */
    stopAllSounds: function() {
        this.soundEffects.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.soundEffects = [];
    },
    
    /**
     * Toggle music
     * =====================================================
     */
    toggleMusic: function(enabled) {
        this.musicEnabled = enabled;
        if (!enabled) {
            this.stopMusic();
        } else {
            // Restart appropriate music
            const gameContainer = document.getElementById('game-container');
            if (gameContainer && gameContainer.style.display !== 'none') {
                this.playGameMusic();
            } else {
                this.playTitleMusic();
            }
        }
        this.saveSettings();
    },
    
    /**
     * Toggle sound effects
     * =====================================================
     */
    toggleSFX: function(enabled) {
        this.sfxEnabled = enabled;
        if (!enabled) {
            this.stopAllSounds();
        }
        this.saveSettings();
    },
    
    /**
     * Set volume
     * =====================================================
     */
    setVolume: function(vol) {
        this.volume = Math.max(0, Math.min(1, vol)); // Clamp between 0 and 1
        if (this.currentMusic) {
            this.currentMusic.volume = this.volume;
        }
        this.saveSettings();
    },
    
    /**
     * Save settings to localStorage
     * =====================================================
     */
    saveSettings: function() {
        const settings = {
            musicEnabled: this.musicEnabled,
            sfxEnabled: this.sfxEnabled,
            volume: this.volume
        };
        localStorage.setItem('fumAudioSettings', JSON.stringify(settings));
    },
    
    /**
     * Load settings from localStorage
     * =====================================================
     */
    loadSettings: function() {
        const saved = localStorage.getItem('fumAudioSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.musicEnabled = settings.musicEnabled !== false; // Default true
                this.sfxEnabled = settings.sfxEnabled !== false; // Default true
                this.volume = settings.volume !== undefined ? settings.volume : 0.7;
            } catch (e) {
                console.error('Error loading audio settings:', e);
            }
        }
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.AudioManager = AudioManager;
}


// ===== js\intro-sequence.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - INTRO SEQUENCE
 * =====================================================
 * 
 * Star Wars-style opening crawl
 * =====================================================
 */

// =====================================================
// INTRO SEQUENCE SYSTEM
// =====================================================
const IntroSequence = {
    
    // Intro text - split into paragraphs for crawl
    crawlText: [
        "CHAPTER I",
        "THE AWAKENING",
        "",
        "It is a time of dimensional collapse.",
        "The six layers of reality are fracturing,",
        "and chaos spreads across all worlds.",
        "",
        "You are a LAYER WALKER — one of the rare",
        "few who can perceive and shift between",
        "the planes of existence.",
        "",
        "The SOURCE, the origin point of all layers,",
        "has sent out a call across dimensions.",
        "A corruption threatens to unravel everything.",
        "",
        "Nine realms hang in the balance.",
        "Nine guardians have fallen to the blight.",
        "One truth awaits at the center of it all.",
        "",
        "Your journey begins in the PHYSICAL LAYER,",
        "the world you know. But soon, you will",
        "walk through EMOTIONAL realms, FRACTAL",
        "dimensions, and the sacred ARCHETYPAL plane.",
        "",
        "Some say the CONCEPTUAL layer bends reality",
        "itself. Few have reached the SOURCE and",
        "returned to tell of it.",
        "",
        "The layers are calling, Walker.",
        "Will you answer?"
    ],
    
    /**
     * Show story as a modal overlay on top of the game board (no black screen).
     * Close button inside the modal dismisses it.
     */
    showStoryModal: function() {
        var self = this;
        var storyHtml = '';
        this.crawlText.forEach(function(line) {
            if (line === 'CHAPTER I' || line === 'THE AWAKENING') {
                storyHtml += '<h2 class="story-modal-h2">' + line + '</h2>';
            } else if (line === '') {
                storyHtml += '<br>';
            } else {
                storyHtml += '<p class="story-modal-p">' + line + '</p>';
            }
        });
        var modal = document.createElement('div');
        modal.id = 'story-modal-overlay';
        modal.className = 'story-modal-overlay';
        modal.innerHTML = '<div class="story-modal-box">' +
            '<div class="story-modal-content">' + storyHtml + '</div>' +
            '<button type="button" class="btn-primary story-modal-close" id="story-modal-close-btn">Close</button>' +
            '</div>';
        document.body.appendChild(modal);
        function closeModal() {
            if (modal.parentNode) modal.remove();
            setTimeout(function() {
                if (self.startTutorial) self.startTutorial();
            }, 100);
        }
        modal.querySelector('#story-modal-close-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    },
    
    // Current step in sequence
    currentStep: 0,
    started: false,
    _timeouts: [],
    
    // Initialize
    init: function() {
        this._timeouts = [];
        // Create intro HTML structure
        var self = this;
        window.skipTutorialStory = function() {
            self._clearTimeouts();
            if (self.currentStep === 1) self.runStep(2);
            else if (self.currentStep === 2) self.runStep(3);
        };
        this.createIntroHTML();
        
        // Show logo screen
        this.showLogoScreen();
        
        // Listen for key press or click
        document.addEventListener('keydown', this.startSequence.bind(this), { once: true });
        document.addEventListener('click', this.startSequence.bind(this), { once: true });
    },
    
    _clearTimeouts: function() {
        this._timeouts.forEach(function(id) { clearTimeout(id); });
        this._timeouts = [];
    },
    
    _setTimeout: function(fn, ms) {
        var self = this;
        var id = setTimeout(function() {
            self._timeouts = self._timeouts.filter(function(i) { return i !== id; });
            fn();
        }, ms);
        this._timeouts.push(id);
        return id;
    },
    
    // Create intro HTML; append to end of body so it is on top of everything
    createIntroHTML: function() {
        const introHTML = `
            <div id="intro-sequence" class="intro-sequence">
                <div id="intro-crawl" class="intro-screen intro-crawl-animated">
                    <div class="crawl-container">
                        <div class="crawl-content"></div>
                    </div>
                    <a href="#" id="intro-skip-crawl-btn" class="intro-skip-bar" role="button">Skip story &rarr;</a>
                </div>
                <div id="intro-quote" class="intro-screen hidden">
                    <p class="quote-text">"The layers choose who they will."</p>
                    <p class="quote-author">— Ancient Proverb</p>
                </div>
            </div>
        `;
        
        // Append inside game-container so header stays on top and game board is hidden
        const wrap = document.createElement('div');
        wrap.innerHTML = introHTML.trim();
        const introEl = wrap.firstElementChild;
        var gc = document.getElementById('game-container');
        if (introEl && gc) {
            gc.appendChild(introEl);
        } else if (introEl) {
            document.body.appendChild(introEl);
        }
    },
    
    // Show logo and wait for input
    showLogoScreen: function() {
        const logo = document.getElementById('intro-logo');
        const farAway = document.getElementById('intro-far-away');
        const crawl = document.getElementById('intro-crawl');
        const quote = document.getElementById('intro-quote');
        
        if (logo) logo.classList.remove('hidden');
        if (farAway) farAway.classList.add('hidden');
        if (crawl) crawl.classList.add('hidden');
        if (quote) quote.classList.add('hidden');
    },
    
    // Start the full sequence
    startSequence: function() {
        if (this.started) return;
        this.started = true;
        
        // Remove listeners
        document.removeEventListener('keydown', this.startSequence);
        document.removeEventListener('click', this.startSequence);
        
        // Title music already playing from title screen; keep it until transitionToGame
        
        // Begin step-by-step
        this.runStep(1);
    },
    
    // Run each step in sequence
    runStep: function(step) {
        this.currentStep = step;
        var self = this;
        
        switch(step) {
            case 1:
                // Show "A long time ago..." (used if sequence started from step 1)
                const farAway = document.getElementById('intro-far-away');
                if (farAway) farAway.classList.remove('hidden');
                requestAnimationFrame(function() { if (farAway) farAway.offsetHeight; });
                
                var skipFar = farAway && farAway.querySelector('.intro-skip-btn');
                if (skipFar) {
                    skipFar.onclick = function() { if (window.skipTutorialStory) window.skipTutorialStory(); };
                }
                // Wait 3 seconds, then next step (or skip)
                this._setTimeout(() => this.runStep(2), 3000);
                break;
                
            case 2:
                // Hide far away, show crawl
                const farAwayEl = document.getElementById('intro-far-away');
                const crawlEl = document.getElementById('intro-crawl');
                
                if (farAwayEl) farAwayEl.classList.add('hidden');
                if (crawlEl) crawlEl.classList.remove('hidden');
                requestAnimationFrame(function() { if (crawlEl) crawlEl.offsetHeight; });
                
                // Build crawl content
                this.buildCrawl();
                
                var skipCrawl = crawlEl && crawlEl.querySelector('.intro-skip-btn');
                if (skipCrawl) {
                    skipCrawl.onclick = function() { if (window.skipTutorialStory) window.skipTutorialStory(); };
                    skipCrawl.style.position = 'fixed';
                    skipCrawl.style.bottom = '2rem';
                    skipCrawl.style.left = '50%';
                    skipCrawl.style.transform = 'translateX(-50%)';
                    skipCrawl.style.zIndex = '10010';
                }
                // Crawl lasts 20 seconds; user can click "Skip story"
                this._setTimeout(() => this.runStep(3), 20000);
                break;
                
            case 3:
                // Hide crawl, show quote, then game
                const crawlEl2 = document.getElementById('intro-crawl');
                const quoteEl = document.getElementById('intro-quote');
                if (crawlEl2) crawlEl2.classList.add('hidden');
                if (quoteEl) quoteEl.classList.remove('hidden');
                requestAnimationFrame(function() { if (quoteEl) quoteEl.offsetHeight; });
                var t2 = setTimeout(function() {
                    if (window.IntroSequence) window.IntroSequence.runStep(4);
                }, 4000);
                this._timeouts.push(t2);
                break;
                
            case 4:
                // Fade out intro, fade in game board
                this.transitionToGame();
                break;
        }
    },
    
    // Build the crawl content HTML
    buildCrawl: function() {
        const crawlDiv = document.querySelector('.crawl-content');
        if (!crawlDiv) return;
        
        crawlDiv.innerHTML = '';
        
        this.crawlText.forEach(line => {
            if (line === "CHAPTER I" || line === "THE AWAKENING") {
                const h2 = document.createElement('h2');
                h2.textContent = line;
                crawlDiv.appendChild(h2);
            } else if (line === "") {
                const br = document.createElement('br');
                crawlDiv.appendChild(br);
            } else {
                const p = document.createElement('p');
                p.textContent = line;
                crawlDiv.appendChild(p);
            }
        });
    },
    
    // Transition from intro to game — remove black screen, show game, start game only now
    transitionToGame: function() {
        var intro = document.getElementById('intro-sequence');
        if (intro && intro.parentNode) intro.remove();
        var gc = document.getElementById('game-container');
        if (gc) gc.classList.remove('tutorial-intro-active');
        if (window.AudioManager) window.AudioManager.playGameMusic();
        if (window.gameInstance) window.gameInstance.initialize('practice', 1);
        if (typeof IntroSequence !== 'undefined' && IntroSequence.animateCardDealing) {
            IntroSequence.animateCardDealing();
        }
        // Fade out the Layer 1 overlay after 3 seconds so it's not in the way
        setTimeout(function() {
            var ld = document.querySelector('.layer-display');
            if (ld) ld.classList.add('layer-display-faded');
        }, 3000);
    },
    
    // Animate cards dealing themselves into position
    animateCardDealing: function() {
        // Create dealing animation container
        const animContainer = document.createElement('div');
        animContainer.className = 'dealing-animation';
        document.body.appendChild(animContainer);
        
        // Get all grid slots positions
        const slots = document.querySelectorAll('.grid-slot');
        const slotPositions = [];
        
        slots.forEach(slot => {
            const rect = slot.getBoundingClientRect();
            slotPositions.push({
                x: rect.left + rect.width/2,
                y: rect.top + rect.height/2
            });
        });
        
        // Deal cards to each slot with animation
        slotPositions.forEach((pos, index) => {
            setTimeout(() => {
                const card = document.createElement('div');
                card.className = 'dealing-card';
                
                // Start from top of screen
                card.style.left = '50%';
                card.style.top = '-100px';
                card.style.transform = 'translateX(-50%)';
                
                animContainer.appendChild(card);
                
                // Play card movement sound
                if (window.AudioManager) {
                    window.AudioManager.playCardMovement();
                }
                
                // Animate to target position
                setTimeout(() => {
                    card.style.left = (pos.x - 40) + 'px';
                    card.style.top = (pos.y - 56) + 'px';
                    card.style.transform = 'rotate(720deg)';
                }, 50);
                
                // Remove card after animation
                setTimeout(() => {
                    if (card.parentNode) {
                        card.remove();
                    }
                }, 550);
                
            }, index * 100); // Stagger the deals
        });
        
        // Remove animation container when done
        setTimeout(() => {
            if (animContainer.parentNode) {
                animContainer.remove();
            }
            
            // Start tutorial
            this.startTutorial();
            
        }, slotPositions.length * 100 + 600);
    },
    
    // Start the actual tutorial
    startTutorial: function() {
        var self = this;
        setTimeout(function() {
            self.showTutorialTopicDialog(0);
        }, 1000);
    },
    
    // Show tutorial topic dialog: next, previous, and topic list (above layer overlay)
    showTutorialTopicDialog: function(currentIndex) {
        var self = this;
        var chapters = (typeof TUTORIAL_CHAPTERS !== 'undefined' && TUTORIAL_CHAPTERS) ? TUTORIAL_CHAPTERS : [
            { id: 1, name: 'Basic Play', instruction: "Place your first card in an empty SELF slot.", description: 'Place cards in grid' },
            { id: 2, name: 'Combat', instruction: 'Click FIGHT to battle your opponent.', description: 'Win your first battle' },
            { id: 3, name: 'Layer Shift', instruction: 'Click Layer 2 and watch the board change.', description: 'Change layers' },
            { id: 4, name: 'Intuition', instruction: 'Trust your gut - pick the facedown card with highest value.', description: 'Pass an intuition check' },
            { id: 5, name: 'Final Battle', instruction: 'Use everything you learned to defeat the tutorial opponent.', description: 'Defeat the opponent' }
        ];
        var idx = Math.max(0, Math.min(currentIndex, chapters.length - 1));
        var ch = chapters[idx];
        var listHtml = chapters.map(function(c, i) {
            return '<button type="button" class="tutorial-topic-btn' + (i === idx ? ' active' : '') + '" data-idx="' + i + '">' + (i + 1) + '. ' + c.name + '</button>';
        }).join('');
        var html = '<div class="tutorial-topic-dialog" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);color:#ffd700;padding:2rem;border-radius:12px;border:3px solid #ffd700;z-index:30000;max-width:500px;width:90%;box-shadow:0 0 40px rgba(255,215,0,0.4);">' +
            '<h2 style="margin:0 0 1rem;font-size:1.5rem;">' + ch.name + '</h2>' +
            '<p style="margin:0 0 1rem;font-size:1.1rem;line-height:1.5;">' + ch.instruction + '</p>' +
            '<div class="tutorial-topic-list" style="margin:1rem 0;display:flex;flex-direction:column;gap:0.25rem;">' + listHtml + '</div>' +
            '<div style="display:flex;justify-content:space-between;gap:1rem;margin-top:1rem;">' +
            '<button type="button" class="btn-secondary tutorial-prev-btn"' + (idx <= 0 ? ' disabled' : '') + '>&larr; Previous</button>' +
            '<button type="button" class="btn-primary tutorial-start-btn">Start</button>' +
            '<button type="button" class="btn-secondary tutorial-next-btn"' + (idx >= chapters.length - 1 ? ' disabled' : '') + '>Next &rarr;</button>' +
            '</div></div>';
        var wrap = document.createElement('div');
        wrap.className = 'tutorial-topic-overlay';
        wrap.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:29999;';
        wrap.innerHTML = html;
        document.body.appendChild(wrap);
        function goTo(i) {
            if (wrap.parentNode) wrap.remove();
            self.showTutorialTopicDialog(i);
        }
        wrap.querySelector('.tutorial-prev-btn').addEventListener('click', function() { if (idx > 0) goTo(idx - 1); });
        wrap.querySelector('.tutorial-next-btn').addEventListener('click', function() { if (idx < chapters.length - 1) goTo(idx + 1); });
        wrap.querySelector('.tutorial-start-btn').addEventListener('click', function() {
            if (wrap.parentNode) wrap.remove();
        });
        wrap.querySelectorAll('.tutorial-topic-btn').forEach(function(btn) {
            btn.addEventListener('click', function() { goTo(parseInt(btn.getAttribute('data-idx'), 10)); });
        });
        wrap.addEventListener('click', function(e) { if (e.target === wrap) wrap.remove(); });
    },
    
    showTutorialMessage: function(text) {
        this.showTutorialTopicDialog(0);
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.IntroSequence = IntroSequence;
}


// ===== js\title-screen.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - TITLE SCREEN
 * =====================================================
 * 
 * 🎬 THE TITLE SCREEN: First Impressions Matter 🎬
 * =====================================================
 * 
 * This shows the title.png image for 3 seconds when the game
 * loads, then gracefully fades to the menu. It's like the
 * opening credits of a movie, but shorter and with less
 * scrolling text (unless you count the menu buttons).
 * 
 * Why 3 seconds? Because:
 * - 1 second = too fast, you'll miss it
 * - 5 seconds = too slow, you'll get bored
 * - 3 seconds = just right (like Goldilocks, but for game loading)
 * 
 * =====================================================
 */

// =====================================================
// TITLE SCREEN SYSTEM
// =====================================================
const TitleScreen = {
    
    /**
     * Show Title Screen
     * =====================================================
     * NOVICE NOTE: Displays title.png for 3 seconds, then fades to menu
     * 
     * This function creates a full-screen overlay, shows the title image,
     * waits 3 seconds (because we're polite like that), then fades it out
     * and shows the menu. It's like a theatrical entrance, but for a game.
     */
    show: function() {
        // Start title music as soon as title appears
        if (typeof window !== 'undefined' && window.AudioManager && window.AudioManager.playTitleMusic) {
            window.AudioManager.playTitleMusic();
        }
        const titleScreen = document.createElement('div');
        titleScreen.id = 'title-screen';
        titleScreen.className = 'title-screen';
        titleScreen.innerHTML = `
            <img src="visuals/title.png" alt="Akasha: Shatterlayers" class="title-image"
                 onerror="this.style.display='none';var d=document.createElement('div');d.className='title-fallback';d.style.cssText='display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:3rem;font-weight:bold;color:#F1C40F;text-shadow:0 0 20px rgba(241,196,0,0.5);';d.textContent='Akasha: Shatterlayers';this.parentNode.appendChild(d);">
        `;
        document.body.appendChild(titleScreen);

        // Start invisible, then fade in (1s)
        titleScreen.style.opacity = '0';
        titleScreen.style.transition = 'opacity 1s ease-in';
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                titleScreen.style.opacity = '1';
            });
        });

        // After fade-in (1s) + hold (3s), fade out (1s), then show menu
        setTimeout(function() {
            titleScreen.style.transition = 'opacity 1s ease-out';
            titleScreen.style.opacity = '0';
            setTimeout(function() {
                if (titleScreen.parentNode) titleScreen.remove();
                TitleScreen.showMenu();
            }, 1000);
        }, 4000); // 1s fade-in + 3s hold, then start fade-out
    },
    
    /**
     * Show Menu
     * =====================================================
     * NOVICE NOTE: Fades in menu buttons at top of screen.
     * Starts title music on first user interaction (browsers block autoplay until then).
     */
    showMenu: function() {
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.style.opacity = '0';
            mainMenu.style.transition = 'opacity 1s ease-in';
            mainMenu.classList.remove('hidden');
            
            setTimeout(() => {
                mainMenu.style.opacity = '1';
            }, 100);
        }
        this.ensureTitleMusicOnFirstInteraction();
    },
    
    /**
     * Call whenever main menu is shown so title music starts on first user click/key.
     * Browsers block audio until there has been a user gesture.
     */
    ensureTitleMusicOnFirstInteraction: function() {
        if (window.__titleMusicStarted) return;
        function startOnFirstInteraction() {
            if (window.__titleMusicStarted) return;
            window.__titleMusicStarted = true;
            if (typeof window !== 'undefined' && window.AudioManager && window.AudioManager.playTitleMusic) {
                window.AudioManager.playTitleMusic();
            }
            document.removeEventListener('click', startOnFirstInteraction, true);
            document.removeEventListener('keydown', startOnFirstInteraction, true);
        }
        document.addEventListener('click', startOnFirstInteraction, true);
        document.addEventListener('keydown', startOnFirstInteraction, true);
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.TitleScreen = TitleScreen;
}


// ===== js\dice-mechanic.js =====
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
const DepthDie = {
    
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


// ===== js\card-flip.js =====
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
const CardFlip = {
    
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


// ===== js\damage-numbers.js =====
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
const DamageNumbers = {
    
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


// ===== js\pause-menu.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - PAUSE MENU
 * =====================================================
 * 
 * ⏸️ THE PAUSE MENU: Because Sometimes You Need a Break ⏸️
 * =====================================================
 * 
 * This is the pause menu system. You know, that thing that
 * pops up when you press ESC because you need to answer
 * the door, or your cat is on fire, or you just realized
 * you've been playing for 6 hours straight and should
 * probably eat something.
 * 
 * Features:
 * - Resume (get back to the action!)
 * - Restart (start over because you're losing)
 * - Settings (tweak audio and stuff)
 * - Quit (admit defeat and return to menu)
 * 
 * =====================================================
 */

// =====================================================
// PAUSE MENU SYSTEM
// =====================================================
const PauseMenu = {
    
    isPaused: false,
    gameInstance: null,
    
    /**
     * Initialize
     * =====================================================
     * NOVICE NOTE: Sets up pause menu and ESC key listener
     * 
     * This function sets up the pause menu so it actually works.
     * Without this, pressing ESC would do nothing, and that would
     * be sad. We don't want sad players. 😢
     */
    init: function(gameInstance) {
        this.gameInstance = gameInstance;
        
        // Listen for ESC key (the universal "I need a break" button)
        document.addEventListener('keydown', (e) => {
            // Only pause if we're actually in a game (not in menu)
            if (e.key === 'Escape' && this.gameInstance && this.gameInstance.gameMode) {
                if (this.isPaused) {
                    this.resume(); // Already paused? Unpause!
                } else {
                    this.show(); // Not paused? Pause it!
                }
            }
        });
    },
    
    /**
     * Show Pause Menu
     * =====================================================
     * NOVICE NOTE: Displays pause menu overlay
     * 
     * This creates a fancy overlay that covers the screen
     * and gives you options. It's like a popup, but cooler
     * because it pauses time (well, the game at least).
     */
    show: function() {
        // Don't pause if already paused (that would be weird)
        if (this.isPaused) return;
        
        // Set the paused flag (so we know we're paused)
        this.isPaused = true;
        
        // Create pause menu overlay
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pause-menu';
        pauseMenu.className = 'pause-menu-overlay';
        pauseMenu.innerHTML = `
            <div class="pause-menu-content">
                <h2>PAUSED</h2>
                <button class="pause-menu-btn" id="pause-resume">▶ RESUME</button>
                <button class="pause-menu-btn" id="pause-restart">🔄 RESTART MATCH</button>
                <button class="pause-menu-btn" id="pause-settings">⚙ SETTINGS</button>
                <button class="pause-menu-btn" id="pause-quit">🏠 QUIT TO MENU</button>
            </div>
        `;
        
        document.body.appendChild(pauseMenu);
        
        // Add event listeners
        document.getElementById('pause-resume').addEventListener('click', () => {
            this.resume();
        });
        
        document.getElementById('pause-restart').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('pause-settings').addEventListener('click', () => {
            this.showSettings();
        });
        
        document.getElementById('pause-quit').addEventListener('click', () => {
            this.quit();
        });
    },
    
    /**
     * Resume Game
     * =====================================================
     * NOVICE NOTE: Closes pause menu and continues game
     */
    resume: function() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) {
            pauseMenu.remove();
        }
    },
    
    /**
     * Restart Match
     * =====================================================
     * NOVICE NOTE: Restarts current match
     */
    restart: function() {
        if (!this.gameInstance) return;
        
        if (confirm('Restart this match? Progress will be lost.')) {
            const mode = this.gameInstance.gameMode;
            const difficulty = this.gameInstance.ai ? this.gameInstance.ai.difficulty : 2;
            
            this.resume();
            this.gameInstance.initialize(mode, difficulty);
        }
    },
    
    /**
     * Show Settings
     * =====================================================
     * NOVICE NOTE: Opens settings modal
     */
    showSettings: function() {
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.classList.remove('hidden');
        }
    },
    
    /**
     * Quit to Menu
     * =====================================================
     * NOVICE NOTE: Returns to main menu with confirm dialog
     */
    quit: function() {
        // Helper: actually return to main menu (stop current display, show menu)
        var goToMainMenu = () => {
            this.resume();
            var gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.classList.remove('game-active');
                gameContainer.style.display = '';
            }
            var intro = document.getElementById('intro-sequence');
            if (intro && intro.parentNode) intro.remove();
            var storyModal = document.getElementById('story-modal-overlay');
            if (storyModal && storyModal.parentNode) storyModal.remove();
            var mainMenu = document.getElementById('main-menu');
            if (mainMenu) {
                mainMenu.classList.remove('hidden');
                mainMenu.style.opacity = '1';
            }
            if (window.AudioManager) {
                window.AudioManager.stopMusic();
                window.AudioManager.playTitleMusic();
            }
        };
        // Tutorial intro: go straight back to main menu (no confirm)
        if (document.getElementById('intro-sequence')) {
            if (typeof window.__tutorialBackToMenu === 'function') {
                this.resume();
                window.__tutorialBackToMenu();
            } else {
                goToMainMenu();
            }
            return;
        }
        // In-game: show confirm dialog
        const confirmDialog = document.createElement('div');
        confirmDialog.className = 'confirm-dialog-overlay';
        confirmDialog.innerHTML = `
            <div class="confirm-dialog">
                <h3>⚠ EXIT GAME?</h3>
                <p>Progress will be saved.</p>
                <p>Are you sure?</p>
                <div class="confirm-buttons">
                    <button class="btn-danger" id="confirm-yes">YES, QUIT</button>
                    <button class="btn-secondary" id="confirm-cancel">CANCEL</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmDialog);
        
        document.getElementById('confirm-yes').addEventListener('click', () => {
            if (this.gameInstance && this.gameInstance.gameMode === 'campaign' && 
                this.gameInstance.campaign) {
                this.gameInstance.campaign.saveProgress();
            }
            confirmDialog.remove();
            goToMainMenu();
        });
        
        document.getElementById('confirm-cancel').addEventListener('click', () => {
            confirmDialog.remove();
        });
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.PauseMenu = PauseMenu;
}


// ===== js\in-game-settings.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - IN-GAME SETTINGS BUTTON
 * =====================================================
 * 
 * ⚙️ THE SETTINGS BUTTON: Because Options Are Good ⚙️
 * =====================================================
 * 
 * This creates a settings gear icon (⚙) in the top-right corner
 * during matches. It's always there, ready to help you adjust
 * audio settings, toggle features, or just look at options
 * when you're bored.
 * 
 * Features:
 * - Appears only during matches (not in menu)
 * - Top-right corner placement (classic settings button location)
 * - Opens the settings modal (the same one from the main menu)
 * - Hover effects (because interactive buttons are more fun)
 * 
 * NOVICE NOTE: This is a convenience feature. Instead of having
 * to quit to menu to change settings, you can do it mid-game.
 * It's like having a remote control, but for game settings!
 * 
 * =====================================================
 */

// =====================================================
// IN-GAME SETTINGS BUTTON
// =====================================================
function addInGameSettingsButton() {
    // Check if button already exists
    if (document.getElementById('in-game-settings-btn')) {
        return;
    }
    
    // Create settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'in-game-settings-btn';
    settingsBtn.className = 'in-game-settings-btn';
    settingsBtn.innerHTML = '⚙';
    settingsBtn.title = 'Settings';
    
    // Position in top-right corner
    settingsBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.7);
        border: 2px solid gold;
        color: gold;
        font-size: 24px;
        cursor: pointer;
        z-index: 9999;
        display: none;
        transition: all 0.3s ease;
    `;
    
    settingsBtn.addEventListener('mouseenter', () => {
        settingsBtn.style.background = 'rgba(255, 215, 0, 0.3)';
        settingsBtn.style.transform = 'scale(1.1)';
    });
    
    settingsBtn.addEventListener('mouseleave', () => {
        settingsBtn.style.background = 'rgba(0, 0, 0, 0.7)';
        settingsBtn.style.transform = 'scale(1)';
    });
    
    settingsBtn.addEventListener('click', () => {
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.classList.remove('hidden');
        }
    });
    
    document.body.appendChild(settingsBtn);
    
    // Show/hide based on game state
    const observer = new MutationObserver(() => {
        const gameContainer = document.getElementById('game-container');
        const mainMenu = document.getElementById('main-menu');
        
        if (gameContainer && gameContainer.style.display !== 'none' && 
            mainMenu && mainMenu.classList.contains('hidden')) {
            settingsBtn.style.display = 'block';
        } else {
            settingsBtn.style.display = 'none';
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
}

// Make globally available
if (typeof window !== 'undefined') {
    window.addInGameSettingsButton = addInGameSettingsButton;
}


// ===== js\card-tooltips.js =====
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
const CardTooltips = {
    
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
    // Also getCard helper if available
    if (typeof getCard !== 'undefined') {
        window.getCard = getCard;
    }
}


// ===== js\layer-shift-effects.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - LAYER SHIFT VISUAL EFFECTS
 * =====================================================
 * 
 * 🌌 REALITY BENDING VISUALS: Because Layer Shifts Should Look Cool 🌌
 * =====================================================
 * 
 * This system creates screen distortion effects when players
 * shift between layers. Each layer transition has its own
 * unique visual effect, because shifting reality should look
 * impressive, not boring.
 * 
 * The effects:
 * - 1→2: Warm pink pulse with soft blur (emotional transition)
 * - 2→3: Geometric pattern overlay (fractal transition)
 * - 3→4: Gold shimmer with sacred geometry (archetypal transition)
 * - 4→5: Stark contrast flash (conceptual transition)
 * - 5→6: White light explosion (source transition)
 * 
 * NOVICE NOTE: These are pure visual effects. They don't affect
 * gameplay, but they make the game feel more immersive and cool.
 * Sometimes style matters as much as substance!
 * 
 * =====================================================
 */

// =====================================================
// LAYER SHIFT EFFECTS SYSTEM
// =====================================================
const LayerShiftEffects = {
    
    /**
     * Play Layer Shift Effect
     * =====================================================
     * NOVICE NOTE: Shows visual effect based on layer transition
     * 
     * @param {number} fromLayer - Previous layer (1-6)
     * @param {number} toLayer - New layer (1-6)
     */
    play: function(fromLayer, toLayer) {
        if (!fromLayer || !toLayer) return;
        
        // Create effect overlay
        const effectOverlay = document.createElement('div');
        effectOverlay.className = 'layer-shift-effect';
        effectOverlay.id = 'layer-shift-effect';
        
        // Determine effect type based on transition
        let effectClass = '';
        let effectDuration = 1000;
        
        if (fromLayer === 1 && toLayer === 2) {
            effectClass = 'shift-1-to-2'; // Warm pink pulse, soft blur
        } else if (fromLayer === 2 && toLayer === 3) {
            effectClass = 'shift-2-to-3'; // Geometric pattern overlay
        } else if (fromLayer === 3 && toLayer === 4) {
            effectClass = 'shift-3-to-4'; // Gold shimmer, sacred geometry
        } else if (fromLayer === 4 && toLayer === 5) {
            effectClass = 'shift-4-to-5'; // Stark contrast flash
        } else if (fromLayer === 5 && toLayer === 6) {
            effectClass = 'shift-5-to-6'; // White light explosion
        } else {
            // Generic effect for other transitions
            effectClass = 'shift-generic';
        }
        
        effectOverlay.classList.add(effectClass);
        document.body.appendChild(effectOverlay);
        
        // Remove after animation
        setTimeout(() => {
            if (effectOverlay.parentNode) {
                effectOverlay.remove();
            }
        }, effectDuration);
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.LayerShiftEffects = LayerShiftEffects;
}


// ===== js\victory-loss-screens.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - VICTORY/LOSS SCREENS
 * =====================================================
 * 
 * 🎉 VICTORY! / 😢 DEFEAT! 🎉
 * =====================================================
 * 
 * This system handles the victory and loss screens that appear
 * when a game ends. It's like the credits of a movie, but
 * interactive and with buttons to play again or quit.
 * 
 * Features:
 * - Victory screen (when you win - the good one!)
 * - Loss screen (when you lose - the sad one)
 * - Functional buttons (REMATCH, RETURN TO MENU)
 * - Campaign mode uses its own screens (because campaign is special)
 * 
 * NOVICE NOTE: These screens are triggered automatically when
 * someone's HP reaches 0 or they get 4 attunements. It's like
 * the game saying "Hey, you won/lost! What do you want to do now?"
 * 
 * =====================================================
 */

// =====================================================
// VICTORY/LOSS SCREENS SYSTEM
// =====================================================
const VictoryLossScreens = {
    
    /**
     * Show Victory Screen
     * =====================================================
     * NOVICE NOTE: Shows victory screen when player wins
     * 
     * @param {Object} gameInstance - Game instance
     * @param {number} winnerId - Winner player ID
     */
    showVictory: function(gameInstance, winnerId) {
        // Check if in campaign mode
        if (gameInstance.gameMode === 'campaign' && gameInstance.campaign) {
            // Campaign handles its own victory screen
            return;
        }
        
        // Standard victory screen
        const victoryHTML = `
            <div class="victory-screen-overlay">
                <div class="victory-screen-content">
                    <h1>VICTORY</h1>
                    <h2>Player ${winnerId} Wins!</h2>
                    <div class="victory-buttons">
                        <button class="btn-primary" id="victory-rematch">REMATCH</button>
                        <button class="btn-secondary" id="victory-menu">RETURN TO MENU</button>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.className = 'victory-screen-overlay';
        overlay.innerHTML = victoryHTML;
        document.body.appendChild(overlay);
        
        // Add event listeners
        document.getElementById('victory-rematch').addEventListener('click', () => {
            overlay.remove();
            // Restart same mode
            const mode = gameInstance.gameMode;
            const difficulty = gameInstance.ai ? gameInstance.ai.difficulty : 2;
            gameInstance.initialize(mode, difficulty);
        });
        
        document.getElementById('victory-menu').addEventListener('click', () => {
            overlay.remove();
            // Return to menu
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) gameContainer.style.display = 'none';
            
            const mainMenu = document.getElementById('main-menu');
            if (mainMenu) mainMenu.classList.remove('hidden');
            
            // Stop game music, start title music
            if (window.AudioManager) {
                window.AudioManager.stopMusic();
                window.AudioManager.playTitleMusic();
            }
        });
    },
    
    /**
     * Show Loss Screen
     * =====================================================
     * NOVICE NOTE: Shows loss screen when player loses
     * 
     * @param {Object} gameInstance - Game instance
     */
    showLoss: function(gameInstance) {
        // Check if in campaign mode
        if (gameInstance.gameMode === 'campaign' && gameInstance.campaign) {
            // Campaign handles its own loss screen
            return;
        }
        
        // Standard loss screen
        const lossHTML = `
            <div class="loss-screen-overlay">
                <div class="loss-screen-content">
                    <h1>DEFEAT</h1>
                    <p>You have been defeated.</p>
                    <div class="loss-buttons">
                        <button class="btn-primary" id="loss-rematch">REMATCH</button>
                        <button class="btn-secondary" id="loss-menu">RETURN TO MENU</button>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.className = 'loss-screen-overlay';
        overlay.innerHTML = lossHTML;
        document.body.appendChild(overlay);
        
        // Add event listeners
        document.getElementById('loss-rematch').addEventListener('click', () => {
            overlay.remove();
            // Restart same mode
            const mode = gameInstance.gameMode;
            const difficulty = gameInstance.ai ? gameInstance.ai.difficulty : 2;
            gameInstance.initialize(mode, difficulty);
        });
        
        document.getElementById('loss-menu').addEventListener('click', () => {
            overlay.remove();
            // Return to menu
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) gameContainer.classList.remove('game-active');
            
            const mainMenu = document.getElementById('main-menu');
            if (mainMenu) mainMenu.classList.remove('hidden');
            
            // Stop game music, start title music
            if (window.AudioManager) {
                window.AudioManager.stopMusic();
                window.AudioManager.playTitleMusic();
            }
        });
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.VictoryLossScreens = VictoryLossScreens;
}


// ===== js\campaign-new.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - CAMPAIGN MODE
 * =====================================================
 * 
 * "THE LAYER WALKER'S JOURNEY"
 * 
 * A story-driven campaign across 9 realms
 * =====================================================
 */

// Clear game container background when returning to main menu (so battlefield image doesn't show behind menu)
function clearGameContainerBackground() {
    const el = document.getElementById('game-container');
    if (el) {
        el.style.backgroundImage = '';
        el.style.backgroundSize = '';
        el.style.backgroundPosition = '';
    }
}

// =====================================================
// BOARD MAPPING - Filenames to Story Names
// =====================================================
const BOARD_MAPPING = {
    'grasslands.jpg': { displayName: 'Eldermoor Battlefield', storyName: 'Eldermoor Battlefield' },
    'snowland.jpg': { displayName: 'Frostnir', storyName: 'Frostnir' },
    'waterworld.jpg': { displayName: 'Abyssal Depths', storyName: 'Abyssal Depths' },
    'mall.jpg': { displayName: 'The Shattered Mall', storyName: 'The Shattered Mall' },
    'glass city.jpg': { displayName: 'Crystalis Prime', storyName: 'Crystalis Prime' },
    'akasha.png': { displayName: 'Aethelgard', storyName: 'Aethelgard' },
    'astral.png': { displayName: 'The Dreaming Void', storyName: 'The Dreaming Void' },
    'space.png': { displayName: 'The Void Expanse', storyName: 'The Void Expanse' },
    'apocalypse.png': { displayName: 'The Fallen Zone', storyName: 'The Fallen Zone' }
};

// =====================================================
// CAMPAIGN BOARDS - All 9 Realms
// =====================================================
const CAMPAIGN_BOARDS = [
    {
        id: 'eldermoor',
        order: 1,
        displayName: 'Eldermoor Battlefield',
        filename: 'grasslands.jpg',
        opponent: 'The Warmaster',
        opponentDeck: 'aggressive',
        difficulty: 1,
        reward: { essence: 200, cards: [] },
        nextBoard: 'frostnir',
        flavor: 'Ancient warriors clashed here. The grass remembers their final stand.',
        challenge: 'Defeat the Warmaster to prove your worth.',
        midBattleText: [
            'The grass whispers ancient battle cries...',
            'A ghost warrior nods at your courage.',
            'The soil drinks blood like old wine.',
            'Echoes of war surround you.'
        ],
        winQuote: '"You fight with honor, Walker. The battlefield respects you."',
        loseQuote: '"The Warmaster\'s blade is sharp. Train harder, Walker."'
    },
    {
        id: 'frostnir',
        order: 2,
        displayName: 'Frostnir',
        filename: 'snowland.jpg',
        opponent: 'The Frost Queen',
        opponentDeck: 'control',
        difficulty: 2,
        reward: { essence: 250, cards: ['Ice Shard'] },
        nextBoard: 'abyssal',
        flavor: 'A world locked in eternal winter. The cold seeps into your soul.',
        challenge: 'Defeat the Frost Queen to warm these lands.',
        midBattleText: [
            'Your breath freezes mid-air.',
            'The aurora pulses with your heartbeat.',
            'Beneath the ice, something moves.',
            'Frost crystals form on your cards.'
        ],
        winQuote: '"You fight with the warmth of a dying star... Perhaps spring will return to Frostnir."',
        loseQuote: '"You fought well, little flame... but all fires die in Frostnir."'
    },
    {
        id: 'abyssal',
        order: 3,
        displayName: 'Abyssal Depths',
        filename: 'waterworld.jpg',
        opponent: 'Leviathan',
        opponentDeck: 'combo',
        difficulty: 2,
        reward: { essence: 250, cards: [] },
        nextBoard: 'mall',
        flavor: 'Beneath endless oceans, lost cities dream of sunlight.',
        challenge: 'Face Leviathan in the depths.',
        midBattleText: [
            'Pressure crushes reality here.',
            'A leviathan circles in the dark.',
            'Bubbles carry whispered secrets.',
            'The abyss watches with ancient eyes.'
        ],
        winQuote: '"Even the depths recognize your power, Walker."',
        loseQuote: '"The pressure was too great. The depths claim another."'
    },
    {
        id: 'mall',
        order: 4,
        displayName: 'The Shattered Mall',
        filename: 'mall.jpg',
        opponent: 'The Mannequin King',
        opponentDeck: 'chaos',
        difficulty: 3,
        reward: { essence: 300, cards: ['Mannequin Mimic'] },
        nextBoard: 'crystalis',
        flavor: 'A memory of consumerism, twisted by layer corruption.',
        challenge: 'Survive the Mannequin King\'s twisted realm.',
        midBattleText: [
            'Eerie Muzak plays from nowhere.',
            'Mannequins turn to watch you.',
            'An escalator runs forever into void.',
            'Price tags show impossible numbers.'
        ],
        winQuote: '"You broke the cycle, Walker. The mall remembers its purpose."',
        loseQuote: '"Welcome to the mall... forever."'
    },
    {
        id: 'crystalis',
        order: 5,
        displayName: 'Crystalis Prime',
        filename: 'glass city.jpg',
        opponent: 'The Prism Archon',
        opponentDeck: 'control',
        difficulty: 3,
        reward: { essence: 300, cards: [] },
        nextBoard: 'aethelgard',
        flavor: 'A city of pure crystal, where thoughts become visible.',
        challenge: 'Defeat the Prism Archon in the crystal city.',
        midBattleText: [
            'Your thoughts echo off crystal walls.',
            'Every reflection shows a different you.',
            'The city hums at perfect frequency.',
            'Light bends around your cards.'
        ],
        winQuote: '"Your clarity shattered my illusions, Walker."',
        loseQuote: '"The crystal shows only your confusion."'
    },
    {
        id: 'aethelgard',
        order: 6,
        displayName: 'Aethelgard',
        filename: 'akasha.png',
        opponent: 'The Dragon Sovereign',
        opponentDeck: 'aggressive',
        difficulty: 4,
        reward: { essence: 400, cards: ['Dragon Scale'] },
        nextBoard: 'dreaming',
        flavor: 'The fantasy realm where all myths were born.',
        challenge: 'Face the Dragon Sovereign in the realm of legends.',
        midBattleText: [
            'Magic thickens the air.',
            'Ancient trees remember your name.',
            'Faerie lights dance at battle\'s edge.',
            'Dragons circle overhead.'
        ],
        winQuote: '"Even dragons bow to true courage, Walker."',
        loseQuote: '"The dragon\'s fire consumes all."'
    },
    {
        id: 'dreaming',
        order: 7,
        displayName: 'The Dreaming Void',
        filename: 'astral.png',
        opponent: 'The Nightmare',
        opponentDeck: 'mind-game',
        difficulty: 4,
        reward: { essence: 400, cards: [] },
        nextBoard: 'void',
        flavor: 'Reality is suggestion here. Your thoughts have weight.',
        challenge: 'Conquer your fears in the Dreaming Void.',
        midBattleText: [
            'You forget which memories are yours.',
            'Time flows backward here.',
            'Your opponent shifts forms constantly.',
            'Dreams and reality blur together.'
        ],
        winQuote: '"You faced your nightmares and won, Walker."',
        loseQuote: '"The nightmare is endless... or is it?"'
    },
    {
        id: 'void',
        order: 8,
        displayName: 'The Void Expanse',
        filename: 'space.png',
        opponent: 'The Void Walker',
        opponentDeck: 'control',
        difficulty: 5,
        reward: { essence: 500, cards: ['Void Shard'] },
        nextBoard: 'fallen',
        flavor: 'Between stars, ancient entities slumber.',
        challenge: 'Defeat the Void Walker in the endless expanse.',
        midBattleText: [
            'Stars die in the distance.',
            'Gravity is just a suggestion.',
            'Ancient beings watch your struggle.',
            'The void whispers secrets of creation.'
        ],
        winQuote: '"You walk the void as I once did, Walker. You are ready."',
        loseQuote: '"The void is infinite. You are not."'
    },
    {
        id: 'fallen',
        order: 9,
        displayName: 'The Fallen Zone',
        filename: 'apocalypse.png',
        opponent: 'THE CORRUPTOR',
        opponentDeck: 'final-boss',
        difficulty: 5,
        reward: { essence: 1000, cards: [], title: 'Legendary Layer Walker' },
        nextBoard: null, // End of campaign
        flavor: 'The first world that fell. The source of the fracture.',
        challenge: 'Face THE CORRUPTOR and restore balance.',
        midBattleText: [
            'Reality bleeds at the edges.',
            'The Corruptor wears faces you once loved.',
            'Hope feels heavy here.',
            'The fracture widens with each moment.'
        ],
        winQuote: '"You have done what none could, Walker. The balance is restored."',
        loseQuote: '"The corruption spreads... all is lost."'
    }
];

// =====================================================
// CAMPAIGN PROGRESSION SYSTEM
// =====================================================
class CampaignMode {
    constructor(game) {
        this.game = game;
        this.boards = CAMPAIGN_BOARDS;
        this.currentBoard = null;
        this.progress = this.loadProgress();
    }

    /**
     * Load Campaign Progress
     * =====================================================
     * NOVICE NOTE: Loads saved progress from browser storage
     */
    loadProgress() {
        const saved = localStorage.getItem('fumCampaignProgress');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Default progress (new player)
        return {
            currentBoardId: 'eldermoor',
            completedBoards: [],
            essence: 0,
            unlockedCards: [],
            tutorialCompleted: false
        };
    }

    /**
     * Save Campaign Progress
     * =====================================================
     * NOVICE NOTE: Saves progress to browser storage
     */
    saveProgress() {
        localStorage.setItem('fumCampaignProgress', JSON.stringify(this.progress));
    }

    /**
     * Check for Continue Option
     * =====================================================
     * NOVICE NOTE: Checks if player has saved progress
     */
    hasSaveData() {
        return localStorage.getItem('fumCampaignProgress') !== null;
    }

    /**
     * Show Campaign Intro
     * =====================================================
     * NOVICE NOTE: Shows the intro story when starting campaign
     */
    showCampaignIntro() {
        const introHTML = `
            <div class="campaign-intro-modal">
                <div class="intro-content">
                    <h1>THE LAYER WALKER</h1>
                    <div class="intro-text">
                        <p>"The layers of reality are fracturing.</p>
                        <p>You are a Layer Walker - one who can shift between dimensions. The Source has chosen you to restore balance across the realms.</p>
                        <p>Nine worlds hang in the balance.</p>
                        <p>Nine guardians stand in your way.</p>
                        <p>One truth awaits at the end of your journey.</p>
                        <p>The first rift opens before you...</p>
                        <p>Step forward, Walker."</p>
                    </div>
                    <button class="btn-primary" id="begin-journey-btn">BEGIN JOURNEY</button>
                    <button class="btn-secondary" id="campaign-intro-back" style="margin-top: 1rem;">← Back to Menu</button>
                </div>
            </div>
        `;
        
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'modal-overlay campaign-intro';
        modal.style.zIndex = '10002';
        modal.innerHTML = introHTML;
        document.body.appendChild(modal);
        
        // Handle begin journey button (use querySelector on modal so we get the right button)
        const btn = modal.querySelector('#begin-journey-btn');
        if (btn) btn.addEventListener('click', () => { modal.remove(); this.showBoardSelection(); });
        const backBtn = modal.querySelector('#campaign-intro-back');
        if (backBtn) backBtn.addEventListener('click', () => {
            modal.remove();
            clearGameContainerBackground();
            document.getElementById('game-container').classList.remove('game-active');
            document.getElementById('main-menu').classList.remove('hidden');
            if (typeof TitleScreen !== 'undefined' && TitleScreen.ensureTitleMusicOnFirstInteraction) {
                TitleScreen.ensureTitleMusicOnFirstInteraction();
            }
        });
    }

    /**
     * Show Board Selection Screen
     * =====================================================
     * NOVICE NOTE: Shows map of all 9 boards with status
     */
    showBoardSelection() {
        // Check for continue option
        const hasProgress = this.hasSaveData();
        const continueHTML = hasProgress ? 
            '<button class="btn-primary" id="continue-campaign-btn" style="margin-bottom: 20px;">CONTINUE JOURNEY</button>' : '';
        
        const boardHTML = this.boards.map(board => {
            const isCompleted = this.progress.completedBoards.includes(board.id);
            const isCurrent = this.progress.currentBoardId === board.id;
            const isLocked = !isCompleted && !isCurrent && 
                           (board.order > 1 && !this.progress.completedBoards.includes(
                               this.boards.find(b => b.nextBoard === board.id)?.id || ''
                           ));
            
            let statusIcon = '🔒';
            let statusClass = 'locked';
            if (isCompleted) {
                statusIcon = '✅';
                statusClass = 'completed';
            } else if (isCurrent) {
                statusIcon = '⚔️';
                statusClass = 'current glowing';
            }
            
            return `
                <div class="board-card ${statusClass}" data-board-id="${board.id}">
                    <img src="visuals/boards/${board.filename}" alt="${board.displayName}" 
                         onerror="this.src='visuals/boards/${board.filename.replace('.jpg', '.png')}'">
                    <div class="board-info">
                        <h3>${board.displayName}</h3>
                        <span class="status-icon">${statusIcon}</span>
                        ${isLocked ? 
                            `<p class="opponent">🔒 Locked</p>
                             <p class="unlock-req">Complete previous realm</p>` :
                            `<p class="opponent">${isCompleted ? 'DEFEATED' : 'Current'}: ${board.opponent}</p>
                             <p class="flavor">${board.flavor}</p>
                             ${isCurrent ? `<button class="enter-btn" data-board-id="${board.id}">ENTER REALM</button>` : ''}`
                        }
                    </div>
                </div>
            `;
        }).join('');
        
        const selectionHTML = `
            <div class="campaign-map-screen">
                <h1>THE REALMS OF AKASHA</h1>
                <p class="map-flavor">Nine worlds await. Choose your path.</p>
                <div class="essence-display">Essence: <span id="campaign-essence">${this.progress.essence}</span></div>
                <div class="board-grid">
                    ${boardHTML}
                </div>
                <button class="btn-secondary" id="return-menu-btn">RETURN TO MENU</button>
            </div>
        `;
        
        // Hide main menu and show board selection
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.classList.add('hidden');
        
        const gameContainer = document.getElementById('game-container');
        let mapScreen = document.getElementById('campaign-map-screen');
        if (!mapScreen) {
            mapScreen = document.createElement('div');
            mapScreen.id = 'campaign-map-screen';
            gameContainer.appendChild(mapScreen);
        }
        mapScreen.innerHTML = selectionHTML;
        mapScreen.classList.remove('hidden');
        
        // Add event listeners (use currentTarget so click on button text still works)
        document.querySelectorAll('.enter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const boardId = (e.currentTarget && e.currentTarget.dataset.boardId) || (e.target && e.target.closest('[data-board-id]') && e.target.closest('[data-board-id]').dataset.boardId);
                if (boardId) this.startBoard(boardId);
            });
        });
        
        document.getElementById('return-menu-btn').addEventListener('click', () => {
            mapScreen.classList.add('hidden');
            if (mainMenu) mainMenu.classList.remove('hidden');
        });
        
        // Continue button (if exists)
        const continueBtn = document.getElementById('continue-campaign-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                // Load current board
                const currentBoard = this.boards.find(b => b.id === this.progress.currentBoardId);
                if (currentBoard) {
                    this.startBoard(currentBoard.id);
                }
            });
        }
    }

    /**
     * Start Board
     * =====================================================
     * NOVICE NOTE: Starts a specific board battle
     */
    startBoard(boardId) {
        const board = this.boards.find(b => b.id === boardId);
        if (!board) return;
        
        this.currentBoard = board;
        
        // Show board intro
        this.showBoardIntro(board);
    }

    /**
     * Show Board Intro
     * =====================================================
     * NOVICE NOTE: Shows description before battle starts
     */
    showBoardIntro(board) {
        const introHTML = `
            <div class="board-intro-modal">
                <div class="board-intro-content">
                    <h2>${board.displayName}</h2>
                    <p class="flavor-text">${board.flavor}</p>
                    <p class="challenge-text">${board.challenge}</p>
                    <div class="opponent-info">
                        <h3>Opponent: ${board.opponent}</h3>
                        <p>Difficulty: ${'★'.repeat(board.difficulty)}${'☆'.repeat(5 - board.difficulty)}</p>
                    </div>
                    <div class="board-intro-buttons">
                        <button class="btn-primary" id="start-battle-btn">BEGIN BATTLE</button>
                        <button class="btn-secondary" id="cancel-battle-btn">CANCEL</button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay board-intro';
        modal.innerHTML = introHTML;
        document.body.appendChild(modal);
        
        const startBtn = modal.querySelector('#start-battle-btn');
        const cancelBtn = modal.querySelector('#cancel-battle-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                modal.remove();
                // Hide board selection
                const mapScreen = document.getElementById('campaign-map-screen');
                if (mapScreen) mapScreen.classList.add('hidden');
                
                // Initialize game for this board (4th param = startBoardId so we don't re-show intro/selection)
                this.game.initialize('campaign', board.difficulty, null, board.id);
                this.game.currentBoard = board;
                
                // Set board background
                this.setBoardBackground(board.filename);
                
                // Start game music
                if (window.AudioManager) {
                    window.AudioManager.playGameMusic();
                }
            });
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.remove();
            });
        }
    }

    /**
     * Set Board Background
     * =====================================================
     * NOVICE NOTE: Changes the game background to match board
     */
    setBoardBackground(filename) {
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            // Try both .jpg and .png extensions
            const jpgPath = `visuals/boards/${filename}`;
            const pngPath = `visuals/boards/${filename.replace('.jpg', '.png')}`;
            
            gameContainer.style.backgroundImage = `url(${jpgPath}), url(${pngPath})`;
            gameContainer.style.backgroundSize = 'cover';
            gameContainer.style.backgroundPosition = 'center';
        }
    }

    /**
     * Show Mid-Battle Text
     * =====================================================
     * NOVICE NOTE: Randomly shows flavor text during battle
     */
    showMidBattleText() {
        if (!this.currentBoard || !this.currentBoard.midBattleText) return;
        
        const texts = this.currentBoard.midBattleText;
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        
        // Show floating text
        const textEl = document.createElement('div');
        textEl.className = 'mid-battle-text';
        textEl.textContent = randomText;
        document.body.appendChild(textEl);
        
        // Remove after 3 seconds
        setTimeout(() => {
            textEl.remove();
        }, 3000);
    }

    /**
     * Complete Board
     * =====================================================
     * NOVICE NOTE: Called when player wins a board
     */
    completeBoard() {
        if (!this.currentBoard) return;
        
        // Mark as completed
        if (!this.progress.completedBoards.includes(this.currentBoard.id)) {
            this.progress.completedBoards.push(this.currentBoard.id);
        }
        
        // Add rewards
        this.progress.essence += this.currentBoard.reward.essence;
        if (this.currentBoard.reward.cards) {
            var _cards = this.currentBoard.reward.cards;
            for (var _i = 0; _i < _cards.length; _i++) this.progress.unlockedCards.push(_cards[_i]);
        }
        
        // Move to next board
        if (this.currentBoard.nextBoard) {
            this.progress.currentBoardId = this.currentBoard.nextBoard;
        } else {
            // Campaign complete!
            this.progress.campaignCompleted = true;
        }
        
        this.saveProgress();
        
        // Show win dialog
        this.showWinDialog();
    }

    /**
     * Show Win Dialog
     * =====================================================
     * NOVICE NOTE: Shows victory screen after winning
     */
    showWinDialog() {
        const board = this.currentBoard;
        const isFinalBoss = board.id === 'fallen';
        
        let dialogHTML;
        
        if (isFinalBoss) {
            // Final boss victory
            dialogHTML = `
                <div class="win-dialog final-victory">
                    <div class="victory-content">
                        <h1>VICTORY</h1>
                        <h2>THE CORRUPTOR SCREAMS ACROSS REALITY</h2>
                        <div class="victory-text">
                            <p>The Corruptor dissolves into golden light.</p>
                            <p>The nine realms shudder... then still.</p>
                            <p class="quote">"Layer Walker... you have done what none could.</p>
                            <p class="quote">The balance is restored.</p>
                            <p class="quote">The layers sing your name.</p>
                            <p class="quote">You are no longer just a Walker.</p>
                            <p class="quote">You are THE SHATTERER."</p>
                            <p>Around you, the realms begin to heal.</p>
                            <p>In Frostnir, flowers bloom.</p>
                            <p>In Abyssal Depths, light reaches the bottom.</p>
                            <p>In The Fallen Zone... hope returns.</p>
                            <p>Your journey is complete.</p>
                            <p>But the layers will always remember you.</p>
                        </div>
                        <div class="achievements">
                            <p>⭐ ACHIEVEMENT UNLOCKED: LAYER LEGEND ⭐</p>
                            <p>⭐ REALM SAVED: 9/9 ⭐</p>
                            <p>⭐ NEW GAME+ UNLOCKED ⭐</p>
                        </div>
                        <div class="rewards">
                            <p>+${board.reward.essence} Essence</p>
                            <p>+${board.reward.title || ''}</p>
                        </div>
                        <div class="victory-buttons">
                            <button class="btn-primary" id="play-again-btn">PLAY AGAIN</button>
                            <button class="btn-secondary" id="new-game-plus-btn">NEW GAME+</button>
                            <button class="btn-secondary" id="view-hall-btn">VIEW HALL OF FAME</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Standard victory
            dialogHTML = `
                <div class="win-dialog">
                    <div class="victory-content">
                        <h1>VICTORY</h1>
                        <h2>${board.opponent.toUpperCase()} HAS FALLEN</h2>
                        <div class="victory-text">
                            <p class="quote">${board.winQuote}</p>
                            ${board.id === 'frostnir' ? 
                                `<p>The ice begins to melt.</p>
                                 <p>A single flower blooms at your feet.</p>` : ''
                            }
                        </div>
                        <div class="rewards">
                            <p>+${board.reward.essence} Essence</p>
                            ${board.reward.cards && board.reward.cards.length > 0 ? 
                                `<p>Unlocked: ${board.reward.cards.join(', ')}</p>` : ''
                            }
                            ${board.nextBoard ? 
                                `<p>Unlocked: ${this.boards.find(b => b.id === board.nextBoard)?.displayName || ''}</p>` : ''
                            }
                        </div>
                        <div class="victory-buttons">
                            <button class="btn-primary" id="continue-journey-btn">CONTINUE JOURNEY</button>
                            <button class="btn-secondary" id="return-map-btn">RETURN TO MAP</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay win-dialog-overlay';
        modal.innerHTML = dialogHTML;
        document.body.appendChild(modal);
        
        // Add event listeners
        if (isFinalBoss) {
            document.getElementById('play-again-btn')?.addEventListener('click', () => {
                modal.remove();
                this.progress = this.loadProgress(); // Reset or reload
                this.showBoardSelection();
            });
            document.getElementById('new-game-plus-btn')?.addEventListener('click', () => {
                // TODO: Implement New Game+
                alert('New Game+ coming soon!');
            });
            document.getElementById('view-hall-btn')?.addEventListener('click', () => {
                // TODO: Implement Hall of Fame
                alert('Hall of Fame coming soon!');
            });
        } else {
            document.getElementById('continue-journey-btn')?.addEventListener('click', () => {
                modal.remove();
                if (board.nextBoard) {
                    this.progress.currentBoardId = board.nextBoard;
                    this.saveProgress();
                    this.showBoardSelection();
                }
            });
            document.getElementById('return-map-btn')?.addEventListener('click', () => {
                modal.remove();
                this.showBoardSelection();
            });
        }
    }

    /**
     * Show Lose Dialog
     * =====================================================
     * NOVICE NOTE: Shows defeat screen after losing
     */
    showLoseDialog() {
        const board = this.currentBoard;
        
        const dialogHTML = `
            <div class="lose-dialog">
                <div class="defeat-content">
                    <h1>DEFEAT</h1>
                    <div class="defeat-text">
                        <p class="quote">${board.loseQuote}</p>
                        <p>Your vision blurs.</p>
                        <p>The layer rejects you.</p>
                        <p>You awaken at the last waypoint...</p>
                        <p>The journey must begin again.</p>
                    </div>
                    <div class="defeat-buttons">
                        <button class="btn-primary" id="retry-battle-btn">RETRY BATTLE</button>
                        <button class="btn-secondary" id="return-map-lose-btn">RETURN TO MAP</button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay lose-dialog-overlay';
        modal.innerHTML = dialogHTML;
        document.body.appendChild(modal);
        
        document.getElementById('retry-battle-btn')?.addEventListener('click', () => {
            modal.remove();
            // Restart same board
            this.startBoard(board.id);
        });
        
        document.getElementById('return-map-lose-btn')?.addEventListener('click', () => {
            modal.remove();
            this.showBoardSelection();
        });
    }
}

// Make globally available
if (typeof window !== 'undefined') {
    window.CampaignMode = CampaignMode;
    window.CAMPAIGN_BOARDS = CAMPAIGN_BOARDS;
}


// ===== js\card-animations.js =====
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
const CardAnimations = {
    
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


// ===== js\tutorial-chapters.js =====
/**
 * =====================================================
 * FUM: SHATTERLAYERS - TUTORIAL CHAPTER SYSTEM
 * =====================================================
 * 
 * Chapter-based tutorial with progress saving
 * =====================================================
 */

// =====================================================
// TUTORIAL CHAPTER DATA
// =====================================================
const TUTORIAL_CHAPTERS = [
    {
        id: 1,
        name: 'Basic Play',
        shortName: 'Basic',
        description: 'Place cards in grid',
        instruction: 'Place your first card in an empty SELF slot.',
        hint: 'Look for the glowing card in your hand.',
        goal: 'Place 3 cards in your grid',
        unlockCondition: null, // Always available
        demo: 'showBasicPlacement'
    },
    {
        id: 2,
        name: 'Combat',
        shortName: 'Combat',
        description: 'Win your first battle',
        instruction: 'Click FIGHT to battle your opponent.',
        hint: 'Higher number wins!',
        goal: 'Win a combat round',
        unlockCondition: 1, // Complete chapter 1
        demo: 'showCombatExample'
    },
    {
        id: 3,
        name: 'Layer Shift',
        shortName: 'Layers',
        description: 'Change layers and see effects',
        instruction: 'Click Layer 2 and watch the board change.',
        hint: 'Notice how Hearts cards glow in this layer.',
        goal: 'Shift to Layer 2 and back',
        unlockCondition: 2, // Complete chapter 2
        demo: 'showLayerShift'
    },
    {
        id: 4,
        name: 'Intuition',
        shortName: 'Intuition',
        description: 'Pass an intuition check',
        instruction: 'Trust your gut - pick the facedown card with highest value.',
        hint: 'Don\'t overthink it!',
        goal: 'Pass an intuition check',
        unlockCondition: 3, // Complete chapter 3
        demo: 'showIntuitionDemo'
    },
    {
        id: 5,
        name: 'Final Battle',
        shortName: 'Final',
        description: 'Defeat the tutorial opponent',
        instruction: 'Use everything you learned to defeat the tutorial opponent.',
        hint: 'You\'ve got this!',
        goal: 'Reduce opponent HP to 0',
        unlockCondition: 4, // Complete chapter 4
        demo: null
    }
];

// =====================================================
// TUTORIAL SAVE SYSTEM
// =====================================================
class TutorialSave {
    
    /**
     * Default Progress
     * =====================================================
     * NOVICE NOTE: Starting state for new players
     */
    static defaultProgress = {
        currentChapter: 1,
        chapters: TUTORIAL_CHAPTERS.map(ch => ({
            id: ch.id,
            name: ch.name,
            completed: false
        })),
        lastPlayed: new Date().toISOString(),
        tutorialCompleted: false
    };
    
    /**
     * Load Progress
     * =====================================================
     * NOVICE NOTE: Loads saved progress from browser storage
     */
    static loadProgress() {
        const saved = localStorage.getItem('fumTutorialProgress');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error loading tutorial progress:', e);
                return this.defaultProgress;
            }
        } else {
            // First time player - save default
            this.saveProgress(this.defaultProgress);
            return this.defaultProgress;
        }
    }
    
    /**
     * Save Progress
     * =====================================================
     * NOVICE NOTE: Saves progress to browser storage
     */
    static saveProgress(progress) {
        progress.lastPlayed = new Date().toISOString();
        localStorage.setItem('fumTutorialProgress', JSON.stringify(progress));
        if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
            console.log('Tutorial progress saved!', progress);
        }
    }
    
    /**
     * Complete Chapter
     * =====================================================
     * NOVICE NOTE: Marks a chapter as complete and moves to next
     */
    static completeChapter(chapterId) {
        const progress = this.loadProgress();
        
        // Find and update chapter
        const chapter = progress.chapters.find(c => c.id === chapterId);
        if (chapter) {
            chapter.completed = true;
        }
        
        // Move to next chapter if available
        if (chapterId < 5) {
            progress.currentChapter = chapterId + 1;
        } else if (chapterId === 5) {
            progress.tutorialCompleted = true;
        }
        
        this.saveProgress(progress);
        return progress;
    }
    
    /**
     * Go To Chapter
     * =====================================================
     * NOVICE NOTE: Jumps to a specific chapter (if unlocked)
     */
    static goToChapter(chapterId) {
        const progress = this.loadProgress();
        const targetChapter = progress.chapters.find(c => c.id === chapterId);
        const tutorialChapter = TUTORIAL_CHAPTERS.find(c => c.id === chapterId);
        
        if (!targetChapter || !tutorialChapter) {
            return { success: false, message: 'Chapter not found' };
        }
        
        // Check if chapter is unlocked
        if (tutorialChapter.unlockCondition) {
            const requiredChapter = progress.chapters.find(c => c.id === tutorialChapter.unlockCondition);
            if (!requiredChapter || !requiredChapter.completed) {
                return { success: false, message: 'Complete previous chapters first!' };
            }
        }
        
        // Can go to completed or current chapters
        if (targetChapter.completed || chapterId === progress.currentChapter) {
            progress.currentChapter = chapterId;
            this.saveProgress(progress);
            return { success: true, progress };
        }
        
        return { success: false, message: 'Chapter not unlocked yet' };
    }
    
    /**
     * Reset Tutorial
     * =====================================================
     * NOVICE NOTE: Resets all tutorial progress
     */
    static resetTutorial() {
        if (confirm('Reset tutorial progress? This cannot be undone.')) {
            this.saveProgress(this.defaultProgress);
            return this.defaultProgress;
        }
        return null;
    }
    
    /**
     * Get Progress Percentage
     * =====================================================
     * NOVICE NOTE: Calculates completion percentage
     */
    static getProgressPercentage() {
        const progress = this.loadProgress();
        const completedCount = progress.chapters.filter(c => c.completed).length;
        return Math.round((completedCount / 5) * 100);
    }
}

// =====================================================
// TUTORIAL UI MANAGER
// =====================================================
class TutorialUI {
    constructor(game) {
        this.game = game;
        this.currentChapter = null;
        this.skipTimer = null;
    }
    
    /**
     * Show Tutorial Chapter Selector
     * =====================================================
     * NOVICE NOTE: Shows the chapter selection screen
     */
    showChapterSelector() {
        const progress = TutorialSave.loadProgress();
        
        // Check if tutorial was completed before
        const tutorialCompleted = progress.tutorialCompleted || 
                                  progress.chapters.filter(c => c.completed).length === 5;
        
        // Create skip/continue button
        const skipButtonHTML = tutorialCompleted ? 
            '<button class="btn-primary" id="skip-tutorial-btn">CONTINUE TO CAMPAIGN</button>' :
            '<button class="btn-secondary" id="skip-tutorial-btn">SKIP TUTORIAL</button>';
        
        // Create chapter selector HTML
        const chapterHTML = TUTORIAL_CHAPTERS.map(ch => {
            const chapterProgress = progress.chapters.find(c => c.id === ch.id);
            const isCompleted = chapterProgress?.completed || false;
            const isCurrent = progress.currentChapter === ch.id;
            const isLocked = ch.unlockCondition && 
                           !progress.chapters.find(c => c.id === ch.unlockCondition)?.completed;
            
            let statusIcon = '🔒';
            let statusClass = 'locked';
            if (isCompleted) {
                statusIcon = '✅';
                statusClass = 'completed';
            } else if (isCurrent) {
                statusIcon = '⚔️';
                statusClass = 'current';
            }
            
            return `
                <div class="chapter-item ${statusClass}" data-chapter="${ch.id}">
                    <span class="chapter-number">${ch.id}</span>
                    <span class="chapter-name">${ch.shortName}</span>
                    <span class="status-icon">${statusIcon}</span>
                </div>
            `;
        }).join('');
        
        const selectorHTML = `
            <div class="tutorial-chapter-screen">
                <h1>TUTORIAL MODE - CHAPTERS</h1>
                <div class="chapter-selector">
                    ${chapterHTML}
                </div>
                <div class="chapter-content-area" id="chapter-content">
                    <!-- Chapter content will be loaded here -->
                </div>
                <div class="chapter-nav">
                    <button class="nav-btn" id="prev-chapter-btn" disabled>← PREVIOUS CHAPTER</button>
                    <button class="skip-btn" id="skip-chapter-btn" style="display: none;">⚡ SKIP THIS CHAPTER ⚡</button>
                    <button class="nav-btn" id="next-chapter-btn" disabled>NEXT CHAPTER →</button>
                </div>
                <div class="progress-indicator">
                    Chapter <span id="current-chapter-num">${progress.currentChapter}</span> of 5 • 
                    <span id="progress-percent">${TutorialSave.getProgressPercentage()}%</span> complete
                    <button class="reset-link" id="reset-tutorial-btn">[reset]</button>
                </div>
            </div>
        `;
        
        // Hide main menu
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.classList.add('hidden');
        
        // Show tutorial screen
        const gameContainer = document.getElementById('game-container');
        let tutorialScreen = document.getElementById('tutorial-chapter-screen');
        if (!tutorialScreen) {
            tutorialScreen = document.createElement('div');
            tutorialScreen.id = 'tutorial-chapter-screen';
            gameContainer.appendChild(tutorialScreen);
        }
        tutorialScreen.innerHTML = selectorHTML;
        tutorialScreen.classList.remove('hidden');
        
        // Add event listeners
        this.setupTutorialListeners();
        
        // Start tutorial button
        const startBtn = document.getElementById('start-tutorial-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                // Show chapter selector
                document.querySelector('.chapter-selector').style.display = 'flex';
                document.querySelector('.tutorial-start-buttons').style.display = 'none';
                // Load current chapter
                this.loadChapterContent(progress.currentChapter);
            });
        }
        
        // Skip tutorial button
        const skipBtn = document.getElementById('skip-tutorial-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                // Go directly to campaign
                if (window.gameInstance) {
                    const campaign = new CampaignMode(window.gameInstance);
                    campaign.showBoardSelection();
                }
            });
        }
    }
    
    /**
     * Setup Tutorial Listeners
     * =====================================================
     * NOVICE NOTE: Sets up all button click handlers
     */
    setupTutorialListeners() {
        // Chapter selector buttons
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const chapterId = parseInt(e.currentTarget.dataset.chapter);
                const result = TutorialSave.goToChapter(chapterId);
                if (result.success) {
                    this.loadChapterContent(chapterId);
                } else {
                    alert(result.message);
                }
            });
        });
        
        // Previous chapter button
        document.getElementById('prev-chapter-btn').addEventListener('click', () => {
            const progress = TutorialSave.loadProgress();
            if (progress.currentChapter > 1) {
                const result = TutorialSave.goToChapter(progress.currentChapter - 1);
                if (result.success) {
                    this.loadChapterContent(progress.currentChapter - 1);
                }
            }
        });
        
        // Next chapter button
        document.getElementById('next-chapter-btn').addEventListener('click', () => {
            const progress = TutorialSave.loadProgress();
            const currentChapter = progress.chapters.find(c => c.id === progress.currentChapter);
            if (currentChapter && currentChapter.completed && progress.currentChapter < 5) {
                const result = TutorialSave.goToChapter(progress.currentChapter + 1);
                if (result.success) {
                    this.loadChapterContent(progress.currentChapter + 1);
                }
            }
        });
        
        // Skip chapter button
        document.getElementById('skip-chapter-btn').addEventListener('click', () => {
            if (confirm('Skip this chapter? You can always come back to review it.')) {
                const progress = TutorialSave.loadProgress();
                TutorialSave.completeChapter(progress.currentChapter);
                this.loadChapterContent(progress.currentChapter + 1);
            }
        });
        
        // Reset tutorial button
        document.getElementById('reset-tutorial-btn').addEventListener('click', () => {
            const newProgress = TutorialSave.resetTutorial();
            if (newProgress) {
                this.loadChapterContent(1);
            }
        });
    }
    
    /**
     * Load Chapter Content
     * =====================================================
     * NOVICE NOTE: Loads and displays chapter content
     */
    loadChapterContent(chapterId) {
        const chapter = TUTORIAL_CHAPTERS.find(c => c.id === chapterId);
        if (!chapter) return;
        
        const progress = TutorialSave.loadProgress();
        this.currentChapter = chapter;
        
        // Update chapter content area
        const contentArea = document.getElementById('chapter-content');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="chapter-content">
                    <h2>${chapter.name}</h2>
                    <p class="chapter-instruction">${chapter.instruction}</p>
                    <p class="chapter-hint">💡 ${chapter.hint}</p>
                    <p class="chapter-goal">Goal: ${chapter.goal}</p>
                    <button class="btn-primary" id="start-chapter-btn">START CHAPTER</button>
                </div>
            `;
            
            // Start chapter button
            document.getElementById('start-chapter-btn').addEventListener('click', () => {
                this.startChapter(chapterId);
            });
        }
        
        // Update UI
        this.updateTutorialUI(progress);
        
        // Show skip button after 30 seconds
        this.scheduleSkipButton();
    }
    
    /**
     * Start Chapter
     * =====================================================
     * NOVICE NOTE: Starts the actual tutorial chapter gameplay
     */
    startChapter(chapterId) {
        // Hide tutorial screen
        const tutorialScreen = document.getElementById('tutorial-chapter-screen');
        if (tutorialScreen) tutorialScreen.classList.add('hidden');
        
        // Initialize game in tutorial mode
        this.game.initialize('tutorial', 1);
        this.game.tutorialChapter = chapterId;
        
        // Show tutorial hints during gameplay
        this.showTutorialHints(chapterId);
    }
    
    /**
     * Show Tutorial Hints
     * =====================================================
     * NOVICE NOTE: Shows hints during gameplay
     */
    showTutorialHints(chapterId) {
        const chapter = TUTORIAL_CHAPTERS.find(c => c.id === chapterId);
        if (!chapter) return;
        
        // Create hint overlay
        const hint = document.createElement('div');
        hint.className = 'tutorial-hint-overlay';
        hint.id = 'tutorial-hint';
        hint.innerHTML = `
            <div class="hint-content">
                <div class="hint-arrow">👇</div>
                <div class="hint-message">${chapter.instruction}</div>
            </div>
        `;
        document.body.appendChild(hint);
        
        // Position hint (will be positioned by CSS or JavaScript)
    }
    
    /**
     * Complete Chapter
     * =====================================================
     * NOVICE NOTE: Called when player completes a chapter
     */
    completeChapter() {
        const progress = TutorialSave.loadProgress();
        TutorialSave.completeChapter(progress.currentChapter);
        
        // Show completion message
        alert(`Chapter ${progress.currentChapter} complete!`);
        
        // Return to chapter selector
        this.showChapterSelector();
    }
    
    /**
     * Update Tutorial UI
     * =====================================================
     * NOVICE NOTE: Updates UI elements based on progress
     */
    updateTutorialUI(progress) {
        // Update chapter selector buttons
        TUTORIAL_CHAPTERS.forEach(ch => {
            const btn = document.querySelector(`.chapter-item[data-chapter="${ch.id}"]`);
            if (btn) {
                const chapterProgress = progress.chapters.find(c => c.id === ch.id);
                const isCompleted = chapterProgress?.completed || false;
                const isCurrent = progress.currentChapter === ch.id;
                const isLocked = ch.unlockCondition && 
                               !progress.chapters.find(c => c.id === ch.unlockCondition)?.completed;
                
                btn.classList.remove('completed', 'current', 'locked');
                
                if (isCompleted) {
                    btn.classList.add('completed');
                    btn.querySelector('.status-icon').textContent = '✅';
                } else if (isCurrent) {
                    btn.classList.add('current');
                    btn.querySelector('.status-icon').textContent = '⚔️';
                } else {
                    btn.classList.add('locked');
                    btn.querySelector('.status-icon').textContent = '🔒';
                }
            }
        });
        
        // Update progress percentage
        const percent = TutorialSave.getProgressPercentage();
        const percentEl = document.getElementById('progress-percent');
        if (percentEl) percentEl.textContent = percent + '%';
        
        // Update current chapter number
        const chapterNumEl = document.getElementById('current-chapter-num');
        if (chapterNumEl) chapterNumEl.textContent = progress.currentChapter;
        
        // Enable/disable navigation buttons
        const prevBtn = document.getElementById('prev-chapter-btn');
        const nextBtn = document.getElementById('next-chapter-btn');
        
        if (prevBtn) {
            prevBtn.disabled = (progress.currentChapter === 1);
        }
        
        if (nextBtn) {
            const currentChapter = progress.chapters.find(c => c.id === progress.currentChapter);
            nextBtn.disabled = !currentChapter?.completed || progress.currentChapter >= 5;
        }
    }
    
    /**
     * Schedule Skip Button
     * =====================================================
     * NOVICE NOTE: Shows skip button after 30 seconds
     */
    scheduleSkipButton() {
        // Clear existing timer
        if (this.skipTimer) {
            clearTimeout(this.skipTimer);
        }
        
        // Show skip button after 30 seconds
        this.skipTimer = setTimeout(() => {
            const skipBtn = document.getElementById('skip-chapter-btn');
            if (skipBtn) {
                skipBtn.style.display = 'inline-block';
            }
        }, 30000); // 30 seconds
    }
}

// Make globally available
if (typeof window !== 'undefined') {
    window.TutorialSave = TutorialSave;
    window.TutorialUI = TutorialUI;
    window.TUTORIAL_CHAPTERS = TUTORIAL_CHAPTERS;
}


// ===== js\ui.js =====
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

class UIManager {
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

// ===== js\game.js =====
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

class Game {
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



})();

