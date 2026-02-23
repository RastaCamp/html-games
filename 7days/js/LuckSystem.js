/**
 * 7 DAYS... - LUCK SYSTEM
 * 
 * 🍀 WHAT IS THIS FILE?
 * This manages luck! High morale = better luck. Low morale = worse luck.
 * Luck affects critical success/failure chances in crafting and combat.
 * 
 * 🎯 HOW LUCK WORKS:
 * - Base luck: 0.5 (50/50)
 * - High morale (80+): +20% luck (things go your way!)
 * - Low morale (<30): -20% luck (everything breaks!)
 * 
 * 💡 WANT TO CHANGE LUCK?
 * - Modify getLuckModifier() to change how morale affects luck
 * - Change base critical success/failure chances
 * - Make luck more/less impactful
 * 
 * 🎨 LUCK EFFECTS:
 * - Critical Success: Double yield, faster crafting
 * - Critical Failure: Break tool, injure self, waste materials
 * - Affects crafting success chances (high morale = better crafting)
 */

class LuckSystem {
    constructor() {
        // 🍀 BASE LUCK: Starting luck value (0.0 to 1.0)
        this.baseLuck = 0.5; // 50/50 chance (neutral)
    }

    getLuckModifier(morale) {
        // High morale = better luck
        if (morale >= 80) return 0.2; // +20% luck
        if (morale >= 50) return 0.0; // Normal
        if (morale >= 30) return -0.1; // -10% luck
        return -0.2; // -20% luck (low morale)
    }

    rollCriticalSuccess(baseChance = 0.05, morale) {
        const luckMod = this.getLuckModifier(morale);
        const adjustedChance = baseChance + luckMod;
        return Math.random() < adjustedChance;
    }

    rollCriticalFailure(baseChance = 0.05, morale) {
        const luckMod = this.getLuckModifier(morale);
        const adjustedChance = baseChance - luckMod; // Low morale = more failures
        return Math.random() < adjustedChance;
    }

    getState() {
        return { baseLuck: this.baseLuck };
    }

    setState(state) {
        this.baseLuck = state.baseLuck || 0.5;
    }
}
