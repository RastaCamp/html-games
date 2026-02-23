/**
 * 7 DAYS... - INVENTORY SYSTEM
 *
 * Player inventory: add/remove items, stacking, capacity, backpacks.
 *
 * FEATURES:
 * - Picked-up items are added here (LocationSystem.searchLocation → addItem).
 * - Slots: base maxSlots (Game uses 20); getMaxSlots() adds backpack bonus.
 * - Stackable items merge in one slot (food, water); others use one slot each.
 * - selectedSlot: used by UI to highlight the slot being examined (use/drop/combine).
 *
 * BACKPACKS: small +5, hiking +10, shopping_bag +3. Equip via EquipSystem or item use.
 */

class Inventory {
    constructor(maxSlots = 10) {
        this.maxSlots = maxSlots; // Base inventory size (10 slots)
        this.items = []; // Array of items (each item is an object)
        this.selectedSlot = null; // Which slot is selected? (for UI)
        this.backpack = 'none'; // Current backpack: 'none', 'small', 'hiking', 'shopping_bag'
        this.itemSystem = null; // Will be set by Game (needed for backpack unequipping)
    }

    addItem(item, quantity = 1) {
        if (!item) return false;

        // Check if item is stackable and already exists
        if (item.stackable) {
            const existingIndex = this.items.findIndex(i => 
                i.id === item.id && 
                (!i.condition || i.condition === item.condition)
            );
            
            if (existingIndex !== -1) {
                const existing = this.items[existingIndex];
                const maxStack = item.maxStack || 10;
                const spaceAvailable = maxStack - existing.quantity;
                
                if (spaceAvailable >= quantity) {
                    existing.quantity += quantity;
                    return true;
                } else {
                    // Fill existing stack and create new
                    existing.quantity = maxStack;
                    quantity -= spaceAvailable;
                }
            }
        }

        // Add new item(s)
        while (quantity > 0 && this.items.length < this.getMaxSlots()) {
            const newItem = { ...item };
            const maxStack = item.maxStack || 10;
            const addQuantity = item.stackable ? Math.min(quantity, maxStack) : 1;
            
            newItem.quantity = addQuantity;
            newItem.obtainedDay = window.game ? window.game.dayCycle.currentDay : 1;
            
            this.items.push(newItem);
            quantity -= addQuantity;
        }

        return quantity === 0;
    }

    removeItem(itemId, quantity = 1, condition = null) {
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (item.id === itemId && (!condition || item.condition === condition)) {
                if (item.quantity > quantity) {
                    item.quantity -= quantity;
                    return true;
                } else {
                    quantity -= item.quantity;
                    this.items.splice(i, 1);
                    if (quantity <= 0) return true;
                }
            }
        }
        return false;
    }

    hasItem(itemId, quantity = 1, condition = null) {
        let total = 0;
        for (const item of this.items) {
            if (item.id === itemId && (!condition || item.condition === condition)) {
                total += item.quantity;
                if (total >= quantity) return true;
            }
        }
        return false;
    }

    getItem(itemId, condition = null) {
        for (const item of this.items) {
            if (item.id === itemId && (!condition || item.condition === condition)) {
                return item;
            }
        }
        return null;
    }

    getItemCount(itemId, condition = null) {
        let total = 0;
        for (const item of this.items) {
            if (item.id === itemId && (!condition || item.condition === condition)) {
                total += item.quantity;
            }
        }
        return total;
    }

    getItemsByType(type) {
        return this.items.filter(item => item.type === type);
    }

    getMaxSlots() {
        const backpackSlots = {
            'none': 0,
            'small': 5,
            'hiking': 10,
            'shopping_bag': 3
        };
        return this.maxSlots + (backpackSlots[this.backpack] || 0);
    }

    equipBackpack(backpackType) {
        if (this.backpack && this.backpack !== 'none') {
            // Unequip current backpack (add to inventory if space)
            if (this.itemSystem) {
                const backpackIds = {
                    'small': 'small_backpack',
                    'hiking': 'hiking_backpack',
                    'shopping_bag': 'shopping_bag'
                };
                const oldBackpack = this.itemSystem.createItem(backpackIds[this.backpack]);
                if (oldBackpack && this.hasSpace(1)) {
                    this.addItem(oldBackpack, 1);
                }
            }
        }
        
        this.backpack = backpackType;
        
        // Check if items need to be dropped
        const newMax = this.getMaxSlots();
        if (this.items.length > newMax) {
            const excess = this.items.length - newMax;
            for (let i = 0; i < excess; i++) {
                const item = this.items.pop();
                if (window.game) {
                    window.game.addMessage(`${item.name} dropped - no space!`);
                }
            }
        }
    }

    getState() {
        return {
            items: JSON.parse(JSON.stringify(this.items)),
            maxSlots: this.maxSlots,
            backpack: this.backpack
        };
    }

    setState(state) {
        this.items = state.items || [];
        this.maxSlots = state.maxSlots || 10;
        this.backpack = state.backpack || 'none';
    }

    clear() {
        this.items = [];
    }
}
