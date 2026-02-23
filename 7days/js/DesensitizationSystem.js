/**
 * 7 DAYS... - DESENSITIZATION SYSTEM
 * 
 * 📉 WHAT IS THIS FILE?
 * Tracks how many times player has done the same activity or eaten the same food.
 * Effectiveness and morale boosts decay with repetition.
 * Forces player to vary activities and diet.
 * 
 * 🎯 WHAT IT TRACKS:
 * - Food consumption (same food eaten multiple times)
 * - Entertainment activities (cards, books, board games, etc.)
 * - Morale actions (fixing items, exercise, etc.)
 * 
 * 💡 HOW IT WORKS:
 * - First time: 100% effectiveness, full morale boost
 * - Second time: 80% effectiveness, reduced morale boost
 * - Third time: 60% effectiveness, no morale boost
 * - Fourth+ time: 40% effectiveness, negative morale boost
 * 
 * 📝 WANT TO TWEAK IT?
 * - Adjust decay rates in `getFoodEffectiveness()` and `getEntertainmentEffectiveness()`
 * - Change morale boost values in `getMoraleBoost()`
 * - Add new tracked activities
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to track activities
 * - Not applying effectiveness modifiers
 * - Making decay too harsh (unplayable) or too lenient (no strategy)
 */

class DesensitizationSystem {
    constructor() {
        // 📊 TRACKING: Count how many times each thing has been done
        this.foodCounts = {}; // { 'rabbit_meat': 3, 'canned_beans': 1, ... }
        this.entertainmentCounts = {}; // { 'play_cards': 2, 'read_book': 1, ... }
        this.moraleActionCounts = {}; // { 'fix_item': 1, 'exercise': 0, ... }
    }

    // 🍖 FOOD DESENSITIZATION: Track food consumption
    trackFood(foodId) {
        if (!this.foodCounts[foodId]) {
            this.foodCounts[foodId] = 0;
        }
        this.foodCounts[foodId]++;
    }

    getFoodEffectiveness(foodId) {
        // 📊 GET FOOD EFFECTIVENESS: Returns multiplier (1.0 = 100%, 0.4 = 40%)
        const count = this.foodCounts[foodId] || 0;
        
        if (count === 0) return 1.0; // First time: 100%
        if (count === 1) return 0.8; // Second time: 80%
        if (count === 2) return 0.6; // Third time: 60%
        return 0.4; // Fourth+ time: 40%
    }

    getFoodMoraleBoost(foodId, baseBoost) {
        // 📊 GET FOOD MORALE BOOST: Returns adjusted morale boost
        const count = this.foodCounts[foodId] || 0;
        
        if (count === 0) return baseBoost; // First time: Full boost
        if (count === 1) return Math.floor(baseBoost * 0.5); // Second time: Half boost
        if (count === 2) return 0; // Third time: No boost
        return -5; // Fourth+ time: Negative boost ("Not this again...")
    }

    getFoodMessage(foodId) {
        // 💬 GET FOOD MESSAGE: Flavor text based on repetition
        const count = this.foodCounts[foodId] || 0;
        
        if (count === 0) {
            return null; // First time: Use default message
        } else if (count === 1) {
            return 'Again? Well, it\'s still food.';
        } else if (count === 2) {
            return 'I\'m getting sick of this.';
        } else {
            return 'I never want to see this again.';
        }
    }

    // 🎮 ENTERTAINMENT DESENSITIZATION: Track entertainment activities
    trackEntertainment(activityId) {
        if (!this.entertainmentCounts[activityId]) {
            this.entertainmentCounts[activityId] = 0;
        }
        this.entertainmentCounts[activityId]++;
    }

    getEntertainmentEffectiveness(activityId) {
        // 📊 GET ENTERTAINMENT EFFECTIVENESS: Returns multiplier
        const count = this.entertainmentCounts[activityId] || 0;
        
        if (count === 0) return 1.0; // First time: 100%
        if (count === 1) return 0.8; // Second time: 80%
        if (count === 2) return 0.6; // Third time: 60%
        return 0.4; // Fourth+ time: 40%
    }

    getEntertainmentMoraleBoost(activityId) {
        // 📊 GET ENTERTAINMENT MORALE BOOST: Returns adjusted boost
        const baseBoosts = {
            'play_cards': 15,
            'read_book': 15,
            'read_magazine': 10,
            'board_game': 20,
            'fix_item': 25,
            'exercise': 10
        };
        
        const baseBoost = baseBoosts[activityId] || 10;
        const count = this.entertainmentCounts[activityId] || 0;
        
        if (count === 0) return baseBoost; // First time: Full boost
        if (count === 1) return Math.floor(baseBoost * 0.67); // Second time: ~67%
        if (count === 2) return Math.floor(baseBoost * 0.33); // Third time: ~33%
        return Math.floor(baseBoost * 0.2); // Fourth+ time: ~20%
    }

    // 🎯 MORALE ACTION DESENSITIZATION: Track morale-boosting actions
    trackMoraleAction(actionId) {
        if (!this.moraleActionCounts[actionId]) {
            this.moraleActionCounts[actionId] = 0;
        }
        this.moraleActionCounts[actionId]++;
    }

    getMoraleActionBoost(actionId) {
        // 📊 GET MORALE ACTION BOOST: Returns adjusted boost
        const baseBoosts = {
            'fix_item': 25,
            'exercise': 10,
            'wear_costume': 15,
            'journal': 15,
            'hot_meal': 30,
            'first_clean_water': 50,
            'first_fire': 50,
            'first_kill': 20
        };
        
        const baseBoost = baseBoosts[actionId] || 10;
        const count = this.moraleActionCounts[actionId] || 0;
        
        // Some actions are one-time only (first_clean_water, first_fire, etc.)
        if (actionId.startsWith('first_')) {
            return count === 0 ? baseBoost : 0; // Only first time counts
        }
        
        if (count === 0) return baseBoost; // First time: Full boost
        if (count === 1) return Math.floor(baseBoost * 0.8); // Second time: 80%
        if (count === 2) return Math.floor(baseBoost * 0.6); // Third time: 60%
        return Math.floor(baseBoost * 0.4); // Fourth+ time: 40%
    }

    // 💾 SAVE/LOAD STATE
    getState() {
        return {
            foodCounts: { ...this.foodCounts },
            entertainmentCounts: { ...this.entertainmentCounts },
            moraleActionCounts: { ...this.moraleActionCounts }
        };
    }

    setState(state) {
        this.foodCounts = state.foodCounts || {};
        this.entertainmentCounts = state.entertainmentCounts || {};
        this.moraleActionCounts = state.moraleActionCounts || {};
    }
}
