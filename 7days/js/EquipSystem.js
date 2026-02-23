/**
 * EquipSystem - Body slots and warmth. Feet are colder than rest of body.
 * Slots: head, scarf, torso, hands, legs, socks, shoes.
 * Starting: short_sleeve_shirt (torso), jean_pants (legs), socks, shoes.
 */
class EquipSystem {
    constructor() {
        this.slots = {
            head: null,   // hat, etc.
            scarf: null,
            torso: null,  // short_sleeve_shirt, etc.
            hands: null,  // mittens, gloves
            legs: null,   // jean_pants, etc.
            socks: null,
            shoes: null
        };
        this.warmthBySlot = { head: 1, scarf: 1, torso: 1, hands: 1, legs: 1, socks: 1, shoes: 1 };
        this.feetSlots = ['socks', 'shoes'];
        this.feetWarmthMultiplier = 0.7;
    }

    /** Item definitions for slot and warmth (id -> { slot, warmth }) */
    static getItemSlots() {
        return {
            short_sleeve_shirt: { slot: 'torso', warmth: 2 },
            jean_pants: { slot: 'legs', warmth: 2 },
            socks: { slot: 'socks', warmth: 3 },
            shoes: { slot: 'shoes', warmth: 2 },
            scarf: { slot: 'scarf', warmth: 4 },
            hat: { slot: 'head', warmth: 4 },
            mittens: { slot: 'hands', warmth: 4 },
            ripped_socks: { slot: 'socks', warmth: 2 },
            underwear: { slot: null, warmth: 0 }
        };
    }

    getSlotForItem(itemId) {
        const def = EquipSystem.getItemSlots()[itemId];
        return def ? def.slot : null;
    }

    getWarmthForItem(itemId) {
        const def = EquipSystem.getItemSlots()[itemId];
        return def ? def.warmth : 0;
    }

    canEquip(itemId) {
        return this.getSlotForItem(itemId) != null;
    }

    equip(itemId, slot) {
        const s = slot || this.getSlotForItem(itemId);
        if (!s || !this.slots.hasOwnProperty(s)) return false;
        this.slots[s] = itemId;
        return true;
    }

    unequip(slot) {
        if (!this.slots.hasOwnProperty(slot)) return null;
        const itemId = this.slots[slot];
        this.slots[slot] = null;
        return itemId;
    }

    getEquipped(slot) {
        return slot ? this.slots[slot] : { ...this.slots };
    }

    /** Total warmth from equipped items. Feet (socks, shoes) count at 0.7x. */
    getTotalWarmth() {
        let total = 0;
        for (const [slot, itemId] of Object.entries(this.slots)) {
            if (!itemId) continue;
            const w = this.getWarmthForItem(itemId);
            const mult = this.feetSlots.indexOf(slot) >= 0 ? this.feetWarmthMultiplier : 1;
            total += w * mult;
        }
        return total;
    }

    getState() {
        return { slots: { ...this.slots } };
    }

    setState(state) {
        if (state && state.slots) {
            for (const k of Object.keys(this.slots)) {
                if (state.slots[k] != null) this.slots[k] = state.slots[k];
            }
        }
    }
}
