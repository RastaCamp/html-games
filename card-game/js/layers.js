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

export const LAYERS = {
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

export function getLayer(layerNumber) {
    return LAYERS[layerNumber] || null;
}

export function shiftLayer(player, direction, gameState) {
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

export function applyLayerEffects(layer, effectType, context) {
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

export function canPlayCardInLayer(card, layer) {
    // Cards with all layers in affinity can be played anywhere
    if (card.layerAffinity.length === 6) {
        return true;
    }
    
    // Check if card's layer affinity includes current layer
    return card.layerAffinity.includes(layer);
}