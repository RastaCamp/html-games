/**
 * 7 DAYS... - ATTRACTION SYSTEM
 * 
 * 🐺 WHAT IS THIS FILE?
 * This tracks how much "attention" you're drawing. Make noise? Light fires?
 * Dump waste? Mongrels and marauders will notice. Bad news!
 * 
 * 🎯 HOW ATTRACTION WORKS:
 * - Actions add "attraction points" (noise, light, smell, etc.)
 * - Points decay over time (they forget about you... eventually)
 * - High points = higher threat level = more attacks
 * - Threat levels: Low → Medium → High → Very High → CRITICAL!
 * 
 * 💡 WANT TO CHANGE ATTRACTION?
 * - Modify point values in addAttraction() calls
 * - Change decay rates (how fast they forget)
 * - Adjust thresholds (when threat level changes)
 * 
 * 🎨 ATTRACTION SOURCES:
 * - Generator running (loud!)
 * - Lights at night (visible!)
 * - Cooking meat (smells good... to mongrels)
 * - Dumping waste (smells bad... attracts everything)
 * - Fire (light + smoke = attention magnet)
 * 
 * 🐛 COMMON MISTAKES:
 * - Making everything attract attention (too punishing)
 * - Making nothing attract attention (too easy)
 * - Forgetting to decay points (they never forget = unfair)
 */

class AttractionSystem {
    constructor() {
        this.attractionPoints = 0;
        this.maxPoints = 200;
        this.decayRate = 5; // Points decay per hour
        this.lastDecayTime = Date.now();
        
        // Thresholds
        this.thresholds = {
            mongrelInvestigation: 50,
            mongrelAttack: 100,
            marauders: 150,
            megaEvent: 200
        };
        
        // Event cooldowns (in milliseconds)
        this.cooldowns = {
            mongrelInvestigation: 0,
            mongrelAttack: 0,
            marauders: 0,
            megaEvent: 0
        };
        
        this.cooldownDurations = {
            mongrelInvestigation: 2 * 60 * 60 * 1000, // 2 hours
            mongrelAttack: 4 * 60 * 60 * 1000, // 4 hours
            marauders: 6 * 60 * 60 * 1000, // 6 hours
            megaEvent: 12 * 60 * 60 * 1000 // 12 hours
        };
    }

    calculateAttraction(actions, game) {
        let points = 0;
        const currentTime = Date.now();
        const isNight = game.dayCycle.isNight;
        const currentDay = game.dayCycle.currentDay;
        
        // Generator effects
        if (actions.generatorOn) {
            if (isNight) {
                points += 10; // High risk at night
            } else {
                points += 5; // Lower risk during day
            }
            
            // Long-running generator penalty
            if (actions.generatorStartTime) {
                const hoursRunning = (currentTime - actions.generatorStartTime) / (1000 * 60 * 60);
                if (hoursRunning > 2) {
                    points += 5; // Additional points for long use
                }
            }
        }
        
        // Light effects
        if (actions.lightsOnAtNight) {
            points += 5; // Light at night attracts
        }
        if (actions.flashlightUsed && isNight) {
            points += 10; // Immediate high risk
        }
        
        // Waste effects
        if (actions.wasteDumped > 0) {
            points += 50 * actions.wasteDumped; // Massive attraction
        }
        if (actions.wasteInSumpPump) {
            points += 20; // Smell travels
        }
        if (actions.compostOverflow) {
            points += 15; // Gradual increase
        }
        
        // Cooking effects
        if (actions.cooking) {
            if (actions.cookingMeat) {
                points += 20; // Meat smell is strong
            } else {
                points += 5; // Other cooking
            }
            if (!actions.cookingVentilation) {
                points += 5; // No ventilation = smell lingers
            }
        }
        
        // Noise effects
        if (actions.powerToolsUsed) {
            points += 30; // Very loud
        }
        if (actions.hammering) {
            points += 10; // Moderate noise
        }
        if (actions.radioOn && actions.radioVolume > 70) {
            points += 15; // Loud radio
        }
        if (actions.radioTransmitting) {
            points += 50; // Broadcasting location!
        }
        
        // Fire and smoke
        if (actions.smokeVisible) {
            points += 25; // Visible smoke
        }
        if (actions.fireLit && !actions.fireVentilation) {
            points += 10; // Fire without ventilation
        }
        
        // Window effects
        if (actions.windowOpen && !actions.windowBoarded) {
            points += 15; // Open window = easy access
        }
        
        // Time-based escalation
        if (currentDay >= 3) {
            points += 5; // Mongrels more bold
        }
        if (currentDay >= 5) {
            points += 10; // Marauders more desperate
        }
        
        // Combination bonuses (multiple attractors)
        let attractorCount = 0;
        if (actions.generatorOn) attractorCount++;
        if (actions.cooking) attractorCount++;
        if (actions.windowOpen) attractorCount++;
        if (actions.lightsOnAtNight) attractorCount++;
        if (actions.smokeVisible) attractorCount++;
        
        if (attractorCount >= 3) {
            points += 20; // Multiple attractors = compound risk
        }
        
        return Math.min(points, this.maxPoints);
    }

    /** Add (or subtract) attraction points immediately, or after delayMs (optional). */
    addAttraction(amount, delayMs) {
        if (delayMs != null && delayMs > 0) {
            setTimeout(() => this.addAttraction(amount), delayMs * 1000);
            return;
        }
        this.attractionPoints = Math.max(0, Math.min(this.maxPoints, this.attractionPoints + amount));
    }

    update(actions, game) {
        // Calculate current attraction
        this.attractionPoints = this.calculateAttraction(actions, game);
        
        // Decay over time
        const currentTime = Date.now();
        const hoursSinceDecay = (currentTime - this.lastDecayTime) / (1000 * 60 * 60);
        if (hoursSinceDecay >= 1) {
            // Decay points if no active attractors
            const hasActiveAttractors = actions.generatorOn || 
                                       actions.lightsOnAtNight || 
                                       actions.cooking || 
                                       actions.fireLit;
            
            if (!hasActiveAttractors) {
                this.attractionPoints = Math.max(0, this.attractionPoints - (this.decayRate * hoursSinceDecay));
            }
            
            this.lastDecayTime = currentTime;
        }
        
        // Update cooldowns
        for (const [event, lastTrigger] of Object.entries(this.cooldowns)) {
            if (lastTrigger > 0) {
                const timeSinceTrigger = currentTime - lastTrigger;
                if (timeSinceTrigger >= this.cooldownDurations[event]) {
                    this.cooldowns[event] = 0; // Cooldown expired
                }
            }
        }
    }

    checkTriggers(game) {
        const currentTime = Date.now();
        const triggeredEvents = [];
        
        // Check thresholds
        if (this.attractionPoints >= this.thresholds.megaEvent && 
            this.cooldowns.megaEvent === 0) {
            triggeredEvents.push({
                type: 'mega_event',
                priority: 'critical',
                delay: 0 // Immediate
            });
            this.cooldowns.megaEvent = currentTime;
        } else if (this.attractionPoints >= this.thresholds.marauders && 
                   this.cooldowns.marauders === 0) {
            triggeredEvents.push({
                type: 'marauders',
                priority: 'high',
                delay: Math.random() * 30 * 60 * 1000 + 30 * 60 * 1000 // 30-60 minutes
            });
            this.cooldowns.marauders = currentTime;
        } else if (this.attractionPoints >= this.thresholds.mongrelAttack && 
                   this.cooldowns.mongrelAttack === 0) {
            triggeredEvents.push({
                type: 'mongrel_attack',
                priority: 'high',
                delay: Math.random() * 30 * 60 * 1000 + 30 * 60 * 1000 // 30-60 minutes
            });
            this.cooldowns.mongrelAttack = currentTime;
        } else if (this.attractionPoints >= this.thresholds.mongrelInvestigation && 
                   this.cooldowns.mongrelInvestigation === 0) {
            triggeredEvents.push({
                type: 'mongrel_investigation',
                priority: 'medium',
                delay: Math.random() * 60 * 60 * 1000 + 30 * 60 * 1000 // 30-90 minutes
            });
            this.cooldowns.mongrelInvestigation = currentTime;
        }
        
        return triggeredEvents;
    }

    getAttractionLevel() {
        if (this.attractionPoints >= this.thresholds.megaEvent) return 'critical';
        if (this.attractionPoints >= this.thresholds.marauders) return 'very_high';
        if (this.attractionPoints >= this.thresholds.mongrelAttack) return 'high';
        if (this.attractionPoints >= this.thresholds.mongrelInvestigation) return 'medium';
        return 'low';
    }

    /** Returns threat level string for MeterSystem/DecaySystem: LOW, MEDIUM, HIGH, VERY_HIGH, CRITICAL */
    getThreatLevel() {
        if (this.attractionPoints >= this.thresholds.megaEvent) return 'CRITICAL';
        if (this.attractionPoints >= this.thresholds.marauders) return 'VERY_HIGH';
        if (this.attractionPoints >= this.thresholds.mongrelAttack) return 'CRITICAL';
        if (this.attractionPoints >= this.thresholds.mongrelInvestigation) return 'MEDIUM';
        return 'LOW';
    }

    getState() {
        return {
            attractionPoints: this.attractionPoints,
            cooldowns: { ...this.cooldowns },
            lastDecayTime: this.lastDecayTime
        };
    }

    setState(state) {
        this.attractionPoints = state.attractionPoints || 0;
        this.cooldowns = state.cooldowns || {};
        this.lastDecayTime = state.lastDecayTime || Date.now();
    }
}
