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
// EXPORT CONFIG (for module systems)
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
