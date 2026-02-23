class TipJarSystem {
    constructor() {
        this.storageKey = '7days_tip_jar';
        this.data = this.loadData();
        this.tips = this.initializeTips();
    }

    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {
                currentTips: 0,
                earnedTips: [],
                tipsSpent: 0
            };
        } catch (e) {
            return {
                currentTips: 0,
                earnedTips: [],
                tipsSpent: 0
            };
        }
    }

    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (e) {
            console.error('Failed to save tip jar:', e);
            return false;
        }
    }

    initializeTips() {
        return {
            // Water tips
            water: [
                "The water heater holds 40 units. Drain valve at bottom.",
                "Pipes trap water even after pressure stops. Disconnect them.",
                "Rain falls. Tarps catch. Windows open.",
                "Sump pit is groundwater. Filter it. Boil it.",
                "AC drips condensation. Needs power though."
            ],
            // Food tips
            food: [
                "Mice follow filth. Set traps where you've been messy.",
                "Rabbits explore window wells. Wire + string + bait.",
                "Birdseed isn't just for birds. It sprouts.",
                "Expired food still has calories. Risk vs reward.",
                "Cans last forever. Open them first."
            ],
            // Warmth tips
            warmth: [
                "Four candles under a clay pot = radiator.",
                "Layers. Old clothes. Costumes. Blankets.",
                "Sterno burns clean indoors. Propane needs ventilation.",
                "Furnace works if gas flows. Pilot light?"
            ],
            // Security tips
            security: [
                "Boards need nails. Nails need hammer.",
                "Furniture blocks doors. Heavy helps.",
                "Light at night = visitors. Darkness = safety.",
                "Smell travels. Bury your waste. Seriously."
            ],
            // Health tips
            health: [
                "Charcoal ground fine, mixed with water = poison sponge.",
                "Old antibiotics might work. Might kill you.",
                "Rest is medicine. Food is medicine. Water is medicine.",
                "Hygiene matters. Sawdust in bucket. Every time."
            ],
            // Morale tips
            morale: [
                "Cards. Books. Magazines. Remember hobbies?",
                "Fix something broken. The toy. The clock. Yourself.",
                "Exercise. Push-ups. Sit-ups. Feel alive.",
                "Hot meal. First one in days. That's hope."
            ],
            // Power tips
            power: [
                "Generator works. Generator loud. Generator kills (ventilate!).",
                "Batteries are precious. Candles are infinite.",
                "Sump pump motor + parts = tiny generator? Maybe.",
                "Methane from waste burns. Seal bucket. Add hose. Pray."
            ],
            // Crafting tips
            crafting: [
                "Wire + stick = snare. Simple.",
                "Sand + charcoal + gravel + cloth = filter.",
                "Bucket + sawdust = toilet. Civilization.",
                "Sealed bucket + waste + hose + time = fuel."
            ]
        };
    }

    earnTip(tipId) {
        // Check if already earned
        if (this.data.earnedTips.includes(tipId)) {
            return false;
        }

        // Determine tip value
        let tipValue = 1;
        if (tipId === 'methane_generator') tipValue = 2;
        else if (tipId === 'day5_survived') tipValue = 2;
        else if (tipId === 'day7_survived') tipValue = 3;

        this.data.currentTips += tipValue;
        this.data.earnedTips.push(tipId);
        this.saveData();
        return tipValue;
    }

    spendTip() {
        if (this.data.currentTips <= 0) {
            return false;
        }
        this.data.currentTips--;
        this.data.tipsSpent++;
        this.saveData();
        return true;
    }

    getTip(category) {
        if (this.data.currentTips <= 0) {
            return null;
        }

        let tipText = null;

        if (category === 'random') {
            // Get random tip from any category
            const allCategories = Object.keys(this.tips);
            const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
            const categoryTips = this.tips[randomCategory];
            tipText = categoryTips[Math.floor(Math.random() * categoryTips.length)];
        } else if (this.tips[category]) {
            const categoryTips = this.tips[category];
            tipText = categoryTips[Math.floor(Math.random() * categoryTips.length)];
        }

        if (tipText && this.spendTip()) {
            return tipText;
        }

        return null;
    }

    getCurrentTips() {
        return this.data.currentTips;
    }

    reset() {
        this.data = {
            currentTips: 0,
            earnedTips: [],
            tipsSpent: 0
        };
        this.saveData();
    }

    getState() {
        return { ...this.data };
    }

    setState(state) {
        this.data = state;
        this.saveData();
    }
}
