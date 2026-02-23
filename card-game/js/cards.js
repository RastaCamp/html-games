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

export const CARD_DATABASE = {
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
export function getCard(id) {
    return CARD_DATABASE[id] ? Object.assign({}, CARD_DATABASE[id]) : null;
}

export function getAllCards() {
    return Object.values(CARD_DATABASE);
}

export function getCardsBySuit(suit) {
    return getAllCards().filter(card => card.suit === suit);
}

export function getCardsByRank(rank) {
    return getAllCards().filter(card => card.rank === rank);
}

export function getCardsByLayer(layer) {
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