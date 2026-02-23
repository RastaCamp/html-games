class ItemSystem {
    constructor() {
        // Merge master item list with any custom items
        const masterItems = MasterItemList.getItems();
        const customItems = this.getCustomItems();
        this.items = { ...masterItems, ...customItems };
        this.itemConditions = ['Fresh', 'Stale', 'Spoiled'];
    }

    getCustomItems() {
        // Any items not in master list that need special handling
        return {};
    }

    initializeItems() {
        // Legacy method - now uses MasterItemList
        return MasterItemList.getItems();
    }

    getItem(id) {
        return this.items[id] ? { ...this.items[id] } : null;
    }

    createItem(id, condition = null) {
        const item = this.getItem(id);
        if (!item) return null;
        
        if (condition && item.type === 'food') {
            item.condition = condition;
        }
        
        return item;
    }

    updateFoodCondition(item, currentDay, obtainedDay) {
        if (item.type !== 'food' || !item.expiresIn) return item;
        
        const daysSinceObtained = currentDay - obtainedDay;
        
        if (item.condition === 'Fresh' && daysSinceObtained >= item.expiresIn) {
            item.condition = 'Stale';
        }
        if (item.condition === 'Stale' && daysSinceObtained >= item.expiresIn * 2) {
            item.condition = 'Spoiled';
        }
        
        return item;
    }

    getFoodNutrition(item) {
        if (item.type !== 'food') return 0;
        
        let nutrition = item.nutrition || 0;
        
        if (item.condition === 'Stale') {
            nutrition = Math.floor(nutrition * 0.7);
        } else if (item.condition === 'Spoiled') {
            nutrition = Math.floor(nutrition * 0.3);
        }
        
        return nutrition;
    }

    getFoodHygienePenalty(item) {
        if (item.type !== 'food') return 0;
        
        if (item.condition === 'Stale') {
            return 5;
        } else if (item.condition === 'Spoiled') {
            return 15;
        }
        
        return item.hygieneCost || 0;
    }

    getFoodMoraleBoost(item) {
        if (item.type !== 'food') return 0;
        
        // Base morale from item
        let boost = item.moraleBoost || 0;
        
        // Condition modifiers
        if (item.condition === 'Stale') {
            boost -= 5;
        } else if (item.condition === 'Spoiled') {
            boost -= 15;
        }
        
        return boost;
    }

    getWaterProperties(item) {
        if (item.type !== 'consumable' && item.type !== 'container') return null;
        
        return {
            hydration: item.hydration || 20,
            hygieneCost: item.hygieneCost || 0,
            sicknessRisk: item.sicknessRisk || 0
        };
    }
}
