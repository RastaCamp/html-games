/**
 * MeterSystem - Survival meters and rest/sleep.
 *
 * Meters: health, hydration, hunger, morale, hygiene, fatigue, bathroom, body heat, sickness.
 * Rates are per GAME hour (DayCycle.realTimeToGameTime ~72 = 20 min real per 24 game hours).
 * Hydration decays almost 2× hunger (5 vs 2.5/h). Morale ≤ 0 drains health until morale recovers.
 *
 * REST: startNap(surface) / startFullSleep(surface); surfaces: floor, cardboard, makeshift_bedding, sleeping_bag, etc.
 * Auto-end: nap 2–4 game hrs, full 8 game hrs. Best surface from inventory used by Rest button (main.js).
 */

class MeterSystem {
    constructor() {
        // 🎬 STARTING VALUES: What the player has when they wake up (Day 1, 8:00 AM)
        // These are "realistic" - you're not at 100% when you wake up
        this.health = { value: 100, max: 100 };      // Full health (you're fine... for now)
        this.hydration = { value: 80, max: 100 };    // A bit thirsty (normal morning)
        this.hunger = { value: 70, max: 100 };       // A bit hungry (breakfast time)
        this.morale = { value: 60, max: 100 };       // Not great, not terrible (you're trapped)
        this.hygiene = { value: 30, max: 100 };      // A bit dirty (0 = clean, 100 = DISGUSTING)
        this.fatigue = { value: 20, max: 100 };      // Just woke up (0 = well-rested, 100 = collapse)
        this.bodyHeat = { value: 100, max: 100 };     // Core warmth (0 = hypothermia risk, 100 = comfortable)
        
        // Sleep tracking
        this.hoursAwake = 0;
        this.lastSleepTime = Date.now();
        this.sleepDeprivationLevel = 0;
        this.hangover = false;
        this.hangoverTimer = 0;
        this.caffeineCrash = false;
        this.caffeineCrashTimer = 0;
        
        // Injury system
        this.injury = null; // { severity: 'minor'|'moderate'|'severe', source: string, timer: number }
        this.painLevel = 0; // 0-100
        
        // Body heat/shirering
        this.shivering = false;
        this.shiverIntensity = 0; // 0-100
        
        // Dreams/nightmares
        this.lastDream = null;
        this.dreamTimer = 0;
        
        // Hallucinations
        this.hallucinating = false;
        this.hallucinationTimer = 0;
        
        this.sickness = false;
        this.sicknessTimer = 0;
        this.sicknessLevel = { value: 0, max: 100 }; // 0 = healthy, 100 = very sick (displayed as meter)
        this.isSleeping = false;
        this.sleepStartTime = null;
        this.sleepQuality = 1.0; // 0.5 to 1.5 multiplier
        
        // ⏱️ DRAIN RATES: How fast meters change (per GAME hour)
        // Balanced for ~20 min real = 24 game hours (DayCycle.realTimeToGameTime 72).
        // Hydration decays almost twice as fast as hunger (5 vs 2.5); people need water more than food.
        // In one day (24h game): hydration -96, hunger -60 awake; so 1–2 drinks and 1–2 meals per day keeps you alive.
        this.drainRates = {
            hydration: 5,      // almost 2x hunger; -5/h awake, -2/h sleeping
            hunger: 2.5,       // -2.5/h awake, -1/h sleeping
            hygiene: 1,        // +1/h (getting dirty; use wipes/sanitizer to offset)
            morale: 0.8,      // -0.8/h (boredom; food/rest/achievements help)
            fatigue: 1.8,     // +1.8/h awake (tired; sleep to recover)
            bathroom: 2        // +2/h (use compost toilet to reset)
        };
        
        // ⚡ FATIGUE MODIFIERS: How different activities affect tiredness
        // These are multipliers/additions to the base +2 per hour drain rate
        // 
        // 📝 HOW TO TWEAK FATIGUE:
        // - Want players to get tired faster? Increase these numbers.
        // - Want a more relaxed game? Decrease these numbers.
        // - Remember: Fatigue affects crafting success and action speed!
        this.fatigueModifiers = {
            active: 1.5,      // +3 per hour when crafting/active (base 2 * 1.5 = 3)
            fighting: 2.5,    // +5 per hour when fighting/stressed (base 2 * 2.5 = 5)
            cold: 0.5,        // +1 extra per hour when cold (shivering is exhausting!)
            sick: 1.0,        // +2 extra per hour when sick (body fighting illness)
            lowMorale: 0.5    // +1 extra per hour when morale < 30 (depression fatigue)
        };
        
        // 💤 SLEEP TRACKING: For naps vs full sleep
        this.sleepType = null; // 'nap' or 'full' or null
        this.napDuration = 0; // Hours napped so far
        this.passOutChance = 0; // Cumulative pass out chance (resets on action)
        
        // Threshold effects
        this.thresholdEffects = {
            hydration: {
                normal: { min: 60, effects: [] },
                warning: { min: 30, effects: ['thirsty'] },
                critical: { min: 10, effects: ['severe_thirst'] },
                dying: { min: 0, effects: ['critical_thirst'] }
            },
            hunger: {
                normal: { min: 60, effects: [] },
                warning: { min: 30, effects: ['hungry'] },
                critical: { min: 10, effects: ['starving'] },
                dying: { min: 0, effects: ['critical_starvation'] }
            },
            hygiene: {
                clean: { min: 0, max: 49, effects: [] },
                dirty: { min: 50, max: 69, effects: ['dirty'] },
                filthy: { min: 70, max: 84, effects: ['filthy'] },
                disgusting: { min: 85, max: 99, effects: ['disgusting'] },
                critical: { min: 100, max: 100, effects: ['sickness_trigger'] }
            },
            morale: {
                hopeful: { min: 80, max: 100, effects: ['hopeful'] },
                neutral: { min: 50, max: 79, effects: [] },
                discouraged: { min: 30, max: 49, effects: ['discouraged'] },
                depressed: { min: 10, max: 29, effects: ['depressed'] },
                despair: { min: 0, max: 9, effects: ['despair'] }
            },
            fatigue: {
                rested: { min: 0, max: 30, effects: [] },           // 0-30: Normal. Crafting success normal. Speed normal.
                tired: { min: 31, max: 50, effects: ['tired'] },     // 31-50: -10% crafting success. Actions 10% slower.
                exhausted: { min: 51, max: 70, effects: ['exhausted'] }, // 51-70: -20% crafting success. Actions 25% slower. May ignore sounds.
                drowsy: { min: 71, max: 85, effects: ['drowsy'] }, // 71-85: -30% crafting success. Actions 50% slower. Random microsleeps.
                collapse_risk: { min: 86, max: 95, effects: ['collapse_risk'] }, // 86-95: -50% crafting success. Constant blur. Random pass out.
                forced_sleep: { min: 96, max: 100, effects: ['forced_sleep'] } // 96-100: Player collapses. Sleeps 4-6 hours. No safety.
            }
        };
        
        this.activeEffects = new Set();
        this.lastUpdateTime = Date.now();
        this.temperatureModifier = 0; // Set by TemperatureSystem
        
        // Bathroom meter (nature calls!)
        this.bathroom = { value: 30, max: 100 };
        
        // Whiskey tracking
        this.whiskeyThirstMultiplier = 1.0;
        this.whiskeyThirstTimer = 0;
        this.hangoverPending = false;
        this.hangoverSevere = false;
        
        // Caffeine tracking
        this.caffeineJitters = false;
        this.caffeineJittersTimer = 0;
        this.caffeineCrashFatigue = 0;
        
        // Sleep tracking
        this.sleepType = null;
        this.napDuration = 0;
        this.passOutChance = 0;
        this.forcedSleepDuration = null;
        
        // Sickness tracking
        this.highHygieneStart = null; // Track when hygiene got high (for sickness trigger)
        
        // Bathroom tracking
        this.bathroomAccident = false; // Legacy flag (kept for compatibility)
        this.bathroomAccidentTriggered = false; // Flag to prevent multiple accident messages per update cycle
        this.needsSanitizerAfterBathroom = false; // Use sanitizer to avoid extra penalty
        this.sanitizerPenaltyTimer = 0; // Game hours until extra penalty if no sanitizer
    }
    
    // 🚽 USE BATHROOM: Player uses compost toilet, bucket, or floor drain
    useBathroom(method, game) {
        // method: 'compost_toilet', 'bucket', 'floor_drain', 'sump'
        if (this.bathroom.value < 70) {
            return { success: false, message: 'You don\'t need to go right now.' };
        }
        
        // Reset bathroom meter
        this.bathroom.value = 20;
        
        // Apply hygiene cost based on method
        let hygieneCost = 0;
        let message = '';
        
        switch (method) {
            case 'compost_toilet':
                hygieneCost = 5; // +5 hygiene (still clean-ish)
                message = 'Used compost toilet. Much better!';
                break;
            case 'bucket':
                hygieneCost = 15; // +15 hygiene (less sanitary)
                message = 'Used bucket. Better than nothing.';
                break;
            case 'floor_drain':
            case 'sump':
                hygieneCost = 30; // +30 hygiene (bad idea)
                message = 'Used floor drain. Not ideal, but desperate times...';
                if (game && game.attractionSystem) {
                    game.attractionSystem.addAttraction(10);
                }
                break;
            default:
                hygieneCost = 20;
                message = 'Found somewhere to go.';
        }
        
        this.hygiene.value = Math.min(100, this.hygiene.value + hygieneCost);
        this.needsSanitizerAfterBathroom = true;
        this.sanitizerPenaltyTimer = 0.5; // 0.5 game hours to use sanitizer
        message += ' Use sanitizer soon to avoid extra penalty.';
        
        if (game && game.playAnimation) {
            const direction = Math.random() < 0.5 ? 'left' : 'right';
            game.playAnimation(`reach_low_${direction}`, 2000);
        }
        
        return { success: true, message: message };
    }
    
    // 🧴 USE SANITIZER: After bathroom, avoids extra hygiene/morale penalty
    useSanitizer(game) {
        if (!this.needsSanitizerAfterBathroom) {
            this.hygiene.value = Math.max(0, this.hygiene.value - 5);
            return { success: true, message: 'Sanitized. Hands clean.' };
        }
        this.needsSanitizerAfterBathroom = false;
        this.sanitizerPenaltyTimer = 0;
        this.hygiene.value = Math.max(0, this.hygiene.value - 8);
        return { success: true, message: 'Sanitized after bathroom. Avoided extra penalty.' };
    }

    update(deltaTime, game) {
        // deltaTime = game seconds (Game.js passes deltaTime * realTimeToGameTime)
        const hours = deltaTime / 3600; // Game hours
        const isAwake = !this.isSleeping;
        
        // Track hours awake
        if (isAwake) {
            this.hoursAwake += hours;
        } else {
            this.hoursAwake = 0;
        }
        
        // Calculate drain rates based on sleep state
        const hydrationDrain = isAwake ? this.drainRates.hydration : 2;
        const hungerDrain = isAwake ? this.drainRates.hunger : 1;
        
        // 💤 FATIGUE DRAIN/RECOVERY: The core of the sleep system!
        // When awake: Fatigue increases (you get tired)
        // When sleeping: Fatigue decreases (you recover)
        let fatigueChange = 0;
        if (isAwake) {
            // Base fatigue gain: +2 per hour (just existing is tiring)
            let fatigueGain = this.drainRates.fatigue;
            
            // Check if actively crafting/working (+3 per hour total)
            if (game && game.actionTracker && game.actionTracker.isActive) {
                fatigueGain *= this.fatigueModifiers.active; // 2 * 1.5 = 3 per hour
            }
            
            // Check for stress/fighting (mongrels, marauders) (+5 per hour total)
            if (game && game.attractionSystem && game.attractionSystem.getThreatLevel() === 'CRITICAL') {
                fatigueGain *= this.fatigueModifiers.fighting; // 2 * 2.5 = 5 per hour
            }
            
            // Cold modifier (+1 extra per hour)
            if (this.temperatureModifier < -0.1) {
                fatigueGain += this.fatigueModifiers.cold; // +1 extra
            }
            
            // Sick modifier (+2 extra per hour)
            if (this.sickness) {
                fatigueGain += this.fatigueModifiers.sick; // +2 extra
            }
            
            // Low morale modifier (+1 extra per hour)
            if (this.morale.value < 30) {
                fatigueGain += this.fatigueModifiers.lowMorale; // +1 extra
            }
            
            // Hangover increases fatigue gain (+3 per hour extra)
            if (this.hangover) {
                fatigueGain += 1.5; // +3 per hour extra (hangover is exhausting!)
            }
            
            // Caffeine crash increases fatigue gain
            if (this.caffeineCrash) {
                fatigueGain += (this.caffeineCrashFatigue || 0) / 10; // Crash fatigue per hour
            }
            
            fatigueChange = fatigueGain;
        } else {
            // Sleeping: fatigue recovery. Base -10/hr; surface multiplier (see startSleep surfaceQuality).
            let baseRecovery = -10;
            const surfaceQuality = {
                'floor': 0.5, 'cardboard': 0.7, 'armchair': 0.9, 'sleeping_bag': 1.1,
                'makeshift_bed': 1.0, 'makeshift_bedding': 0.9, 'bed': 1.5, 'passed_out': 1.2
            };
            const surface = this.sleepSurface || 'floor';
            baseRecovery *= (surfaceQuality[surface] || 0.5);
            
            // Apply sleep disruptors (reduce recovery)
            if (this.temperatureModifier < -0.1) {
                baseRecovery += 2; // Cold: -2 per hour penalty (shivering = poor sleep)
            }
            if (game && game.attractionSystem && game.attractionSystem.getThreatLevel() === 'CRITICAL') {
                baseRecovery += 3; // Noise: -3 per hour penalty (mongrels scratching = restless)
            }
            if (this.sickness) {
                baseRecovery += 4; // Sick: -4 per hour penalty (fever = poor sleep)
            }
            if (this.morale.value < 30) {
                baseRecovery += 2; // Low morale: -2 per hour penalty (depression = restless)
            }
            if (this.hunger.value < 30 || this.hydration.value < 30) {
                baseRecovery += 3; // Hungry/thirsty: -3 per hour penalty (body needs fuel)
            }
            
            // Hangover reduces sleep quality significantly
            if (this.hangover) {
                baseRecovery = -5; // Poor sleep when hungover (barely restful)
            }
            
            // Heat source bonus (+2 per hour bonus)
            if (game && game.temperatureSystem) {
                const warmth = game.temperatureSystem.getWarmthLevel();
                if (warmth >= 60) {
                    baseRecovery -= 2; // Warmer = better sleep (negative = more recovery)
                }
            }
            
            fatigueChange = baseRecovery;
            
            // Auto-end nap (2–4 game hrs) or full sleep (8 game hrs).
            if (this.sleepType === 'nap') {
                this.napDuration += hours;
                if (this.napDuration >= 2 + Math.random() * 2) {
                    this.stopSleep();
                    if (game) game.addMessage('You rest your eyes. Just for a bit...');
                }
            }
            if (this.sleepType === 'full') {
                this.napDuration += hours;
                if (this.napDuration >= 8) {
                    this.stopSleep();
                    if (game) game.addMessage('You wake up. Morning already?');
                }
            }
        }
        
        // Apply temperature modifier to hunger
        const hungerModifier = 1 + (this.temperatureModifier / 10); // Cold = faster hunger
        
        // Drain hydration (with whiskey thirst multiplier)
        const thirstMultiplier = this.whiskeyThirstMultiplier || 1.0;
        this.hydration.value -= hydrationDrain * hours * thirstMultiplier;
        
        // Drain hunger (with temperature modifier)
        this.hunger.value -= hungerDrain * hours * hungerModifier;
        
        // Increase hygiene (natural accumulation)
        this.hygiene.value += this.drainRates.hygiene * hours;
        
        // Drain morale (boredom)
        this.morale.value -= this.drainRates.morale * hours;
        
        // Update fatigue
        this.fatigue.value += fatigueChange * hours;
        
        // Increase bathroom meter (nature calls!)
        this.bathroom.value = Math.min(100, this.bathroom.value + (this.drainRates.bathroom * hours));
        
        // Body heat: drain when cold (indoor temp low), recover when warm
        if (game && game.temperatureSystem) {
            const indoorTemp = game.temperatureSystem.getIndoorTemperature();
            if (indoorTemp < 50) {
                const drainPerHour = Math.min(15, (50 - indoorTemp) * 0.5); // e.g. 30°F -> 10/hr
                this.bodyHeat.value -= drainPerHour * hours;
            } else if (indoorTemp >= 60) {
                const recoverPerHour = 8 + (indoorTemp - 60) * 0.2; // up to ~16/hr when warm
                this.bodyHeat.value += recoverPerHour * hours;
            }
            this.bodyHeat.value = Math.max(0, Math.min(this.bodyHeat.max, this.bodyHeat.value));
            this.shivering = this.bodyHeat.value < 40;
            this.shiverIntensity = this.bodyHeat.value < 20 ? 100 : this.bodyHeat.value < 40 ? 50 : 0;
            if (this.bodyHeat.value < 20) {
                this.health.value -= 2 * hours; // hypothermia risk when body heat very low
            }
            if (this.bodyHeat.value >= 95) {
                this.health.value -= 3 * hours; // heat stroke risk when body heat very high (ideal range 35–65)
                if (game && Math.random() < 0.02 * hours) game.addMessage('Too hot. You feel dizzy. Find cooler air.');
            }
        }
        
        // Check bathroom warnings
        if (this.bathroom.value >= 90 && this.bathroom.value < 100) {
            if (game && Math.random() < 0.1 * hours) {
                game.addMessage('URGENT! You need to find somewhere to go NOW!');
            }
        } else if (this.bathroom.value >= 80 && this.bathroom.value < 90) {
            if (game && Math.random() < 0.05 * hours) {
                game.addMessage('You really need to find somewhere to go.');
            }
        }
        
        // Check for bathroom accident (meter at 100)
        if (this.bathroom.value >= 100) {
            // Only trigger once per update cycle
            if (!this.bathroomAccidentTriggered) {
                this.bathroomAccidentTriggered = true;
                this.hygiene.value = Math.min(100, this.hygiene.value + 50);
                this.morale.value = Math.max(0, this.morale.value - 30);
                this.bathroom.value = 20; // Reset to 20 after accident
                if (game) {
                    game.addMessage('You had an accident. Hygiene +50, Morale -30. You need to find a proper bathroom.');
                }
            }
        } else {
            this.bathroomAccidentTriggered = false;
        }
        
        // Sanitizer-after-bathroom: apply extra penalty if player didn't use sanitizer in time
        if (this.needsSanitizerAfterBathroom) {
            this.sanitizerPenaltyTimer -= hours;
            if (this.sanitizerPenaltyTimer <= 0) {
                this.hygiene.value = Math.min(100, this.hygiene.value + 15);
                this.morale.value = Math.max(0, this.morale.value - 10);
                this.needsSanitizerAfterBathroom = false;
                this.sanitizerPenaltyTimer = 0;
                if (game) game.addMessage('You didn\'t sanitize after the bathroom. Extra hygiene and morale penalty.');
            }
        }
        
        // Check for sleep deprivation
        if (this.hoursAwake > 24) {
            this.sleepDeprivationLevel = Math.min(4, Math.floor((this.hoursAwake - 24) / 6));
        } else {
            this.sleepDeprivationLevel = 0;
        }
        
        // Update hangover timer
        if (this.hangover) {
            this.hangoverTimer -= hours;
            if (this.hangoverTimer <= 0) {
                // Hangover hits (if pending) or passes
                if (this.hangoverPending) {
                    this.applyWhiskeyHangover();
                } else {
                    // Hangover finally passes
                    this.hangover = false;
                    this.hangoverSevere = false;
                    if (game) game.addMessage('The hangover finally passes. You feel human again.');
                }
            }
        }
        
        // Update whiskey thirst timer
        if (this.whiskeyThirstMultiplier > 1.0) {
            this.whiskeyThirstTimer -= hours;
            if (this.whiskeyThirstTimer <= 0) {
                this.whiskeyThirstMultiplier = 1.0;
                this.whiskeyThirstTimer = 0;
            }
        }
        
        // Update caffeine crash timer
        if (this.caffeineCrash) {
            this.caffeineCrashTimer -= hours;
            if (this.caffeineCrashTimer <= 0) {
                // Crash hits! Fatigue increases
                this.fatigue.value = Math.min(100, this.fatigue.value + (this.caffeineCrashFatigue || 0));
                this.caffeineCrash = false;
                this.caffeineCrashFatigue = 0;
                if (game) game.addMessage('The caffeine crash hits. You feel exhausted.');
            }
        }
        
        // Update caffeine jitters timer
        if (this.caffeineJitters) {
            this.caffeineJittersTimer -= hours;
            if (this.caffeineJittersTimer <= 0) {
                this.caffeineJitters = false;
                if (game) game.addMessage('The jitters fade.');
            }
        }
        
        // Sickness effects and sickness meter
        if (this.sicknessLevel) {
            this.sicknessLevel.value = Math.max(0, Math.min(this.sicknessLevel.max, this.sicknessLevel.value));
            if (this.sicknessLevel.value > 0) this.sickness = true;
            if (this.sicknessLevel.value <= 0) {
                this.sickness = false;
                this.sicknessTimer = 0;
            }
        }
        if (this.sickness) {
            // Stats drain 50% faster when sick
            this.hydration.value -= hydrationDrain * hours * 0.5;
            this.hunger.value -= hungerDrain * hours * 0.5 * hungerModifier;
            this.health.value -= 3 * hours; // -3 per hour
            this.morale.value -= 2 * hours; // Extra morale drain
            // Sickness meter: slow natural recovery when sick (-1 per game hour)
            if (this.sicknessLevel) {
                this.sicknessLevel.value = Math.max(0, this.sicknessLevel.value - 1 * hours);
            }
        }
        
        // Check thresholds and apply effects
        this.checkThresholds(game);
        
        // Check for sickness trigger
        if (!this.sickness && this.hygiene.value >= 80) {
            // 6+ consecutive hours at high hygiene = sickness
            if (!this.highHygieneStart) {
                this.highHygieneStart = Date.now();
            } else {
                const hoursAtHighHygiene = (Date.now() - this.highHygieneStart) / (1000 * 60 * 60);
                if (hoursAtHighHygiene >= 6) {
                    this.triggerSickness();
                    this.highHygieneStart = null;
                }
            }
        } else if (this.hygiene.value < 80) {
            this.highHygieneStart = null;
        }
        
        // Check for forced sleep (fatigue >= 96)
        if (this.fatigue.value >= 96 && !this.isSleeping) {
            this.forceSleep();
        }
        
        // Check forced sleep duration (if passed out)
        if (this.isSleeping && this.sleepType === 'passed_out' && this.forcedSleepDuration) {
            const sleepDuration = (Date.now() - this.sleepStartTime) / (1000 * 60 * 60);
            if (sleepDuration >= this.forcedSleepDuration) {
                this.stopSleep();
                if (game) game.addMessage('You wake up on the floor. How long were you out?');
            }
        }
        
        // Update injury/pain
        if (this.injury) {
            this.updateInjury(hours, game);
        }
        
        // Update shivering
        this.updateShivering(game);
        
        // Update dreams/nightmares (while sleeping)
        if (this.isSleeping) {
            this.updateDreams(hours, game);
        }
        
        // Update hallucinations
        this.updateHallucinations(hours, game);
        
        // Clamp all values
        this.health.value = Math.max(0, Math.min(this.health.max, this.health.value));
        this.hydration.value = Math.max(0, Math.min(this.hydration.max, this.hydration.value));
        this.hunger.value = Math.max(0, Math.min(this.hunger.max, this.hunger.value));
        this.morale.value = Math.max(0, Math.min(this.morale.max, this.morale.value));
        this.hygiene.value = Math.max(0, Math.min(this.hygiene.max, this.hygiene.value));
        this.fatigue.value = Math.max(0, Math.min(this.fatigue.max, this.fatigue.value));
    }

    checkThresholds(game) {
        this.activeEffects.clear();
        
        // Hydration thresholds
        if (this.hydration.value < 10) {
            this.activeEffects.add('critical_thirst');
            this.health.value -= 10 * (1/3600); // -10 per hour
            if (game) game.addMessage('Vision blurs. You need water NOW.');
        } else if (this.hydration.value < 30) {
            this.activeEffects.add('severe_thirst');
            this.health.value -= 5 * (1/3600); // -5 per hour
        } else if (this.hydration.value < 60) {
            this.activeEffects.add('thirsty');
        }
        
        // Hunger thresholds
        if (this.hunger.value < 10) {
            this.activeEffects.add('critical_starvation');
            this.health.value -= 7 * (1/3600); // -7 per hour
            if (this.isSleeping) {
                this.isSleeping = false; // Can't sleep when starving
                if (game) game.addMessage('Hunger wakes you. You need food.');
            }
        } else if (this.hunger.value < 30) {
            this.activeEffects.add('starving');
            this.health.value -= 3 * (1/3600); // -3 per hour
        } else if (this.hunger.value < 60) {
            this.activeEffects.add('hungry');
        }
        
        // Hygiene thresholds
        if (this.hygiene.value >= 100) {
            this.activeEffects.add('sickness_trigger');
            this.triggerSickness();
        } else if (this.hygiene.value >= 85) {
            this.activeEffects.add('disgusting');
            this.morale.value -= 5 * (1/24); // -5 per day
        } else if (this.hygiene.value >= 70) {
            this.activeEffects.add('filthy');
            // Sickness chance 30% per day
            if (Math.random() < 0.3 / 24) {
                this.triggerSickness();
            }
        } else if (this.hygiene.value >= 50) {
            this.activeEffects.add('dirty');
            // Sickness chance 10% per day
            if (Math.random() < 0.1 / 24) {
                this.triggerSickness();
            }
        }
        
        // Morale thresholds: when morale hits 0, health drains until morale recovers (no instant death)
        if (this.morale.value <= 0) {
            this.activeEffects.add('despair');
            this.health.value -= 5 * hours; // -5 per game hour when will to live is gone
        } else if (this.morale.value < 10) {
            this.activeEffects.add('despair');
        } else if (this.morale.value < 30) {
            this.activeEffects.add('depressed');
            this.health.value -= 2 * (1/3600); // -2 per hour
        } else if (this.morale.value < 50) {
            this.activeEffects.add('discouraged');
        } else if (this.morale.value >= 80) {
            this.activeEffects.add('hopeful');
        }
        
        // 💤 FATIGUE THRESHOLDS: What happens at different tiredness levels
        // These match the user's exact specifications for penalties and effects
        if (this.fatigue.value >= 96) {
            // 96-100: Forced Sleep - Player collapses immediately
            this.activeEffects.add('forced_sleep');
            if (!this.isSleeping) {
                this.forceSleep();
                if (game) game.addMessage('You can\'t keep your eyes open. Everything goes dark...');
            }
        } else if (this.fatigue.value >= 86) {
            // 86-95: Collapse Risk - -50% crafting, constant blur, random pass out
            this.activeEffects.add('collapse_risk');
            
            // Pass out chance per action (cumulative)
            // Fatigue 86-90: 5% per action
            // Fatigue 91-95: 10% per action
            // Fatigue 96-99: 20% per action (handled above)
            if (this.fatigue.value < 91) {
                this.passOutChance = 0.05;
            } else {
                this.passOutChance = 0.10;
            }
            
            // Check for random pass out (based on time, not actions - simplified)
            if (Math.random() < this.passOutChance * hours * 10) { // 10x multiplier to account for continuous time
                if (!this.isSleeping) {
                    this.forceSleep();
                    if (game) game.addMessage('You collapse from exhaustion. You can\'t stay awake.');
                }
            }
        } else if (this.fatigue.value >= 71) {
            // 71-85: Drowsy - -30% crafting, 50% slower, random microsleeps
            this.activeEffects.add('drowsy');
            
            // Random microsleeps (screen blur effect)
            if (Math.random() < 0.1 * hours) {
                if (game) game.addMessage('Your eyes close for a moment. You need sleep.');
            }
        } else if (this.fatigue.value >= 51) {
            // 51-70: Exhausted - -20% crafting, 25% slower, may ignore sounds
            this.activeEffects.add('exhausted');
        } else if (this.fatigue.value >= 31) {
            // 31-50: Tired - -10% crafting, 10% slower
            this.activeEffects.add('tired');
        } else {
            // 0-30: Rested - Normal. Crafting success normal. Speed normal.
            this.activeEffects.add('rested');
        }
        
        // Sleep deprivation effects
        if (this.sleepDeprivationLevel >= 1) {
            this.activeEffects.add('sleep_deprived');
            if (this.sleepDeprivationLevel >= 2) {
                this.activeEffects.add('hallucinating');
                // Random hallucinations
                if (Math.random() < 0.05 * hours) {
                    if (game) game.addMessage('You hear something... or did you?');
                }
            }
        }
    }

    getCraftingModifier() {
        // 🛠️ CRAFTING SUCCESS MODIFIER: How fatigue and other factors affect crafting
        // Returns a multiplier (1.0 = normal, 0.5 = 50% success, etc.)
        // This is used by CraftingSystem to adjust success chances
        let modifier = 1.0;
        
        // Hunger effects
        if (this.activeEffects.has('hungry')) modifier -= 0.1;
        if (this.activeEffects.has('starving')) modifier -= 0.2;
        
        // Fatigue effects (matching user specs exactly)
        if (this.activeEffects.has('tired')) modifier -= 0.1;           // 31-50: -10%
        if (this.activeEffects.has('exhausted')) modifier -= 0.2;     // 51-70: -20%
        if (this.activeEffects.has('drowsy')) modifier -= 0.3;          // 71-85: -30%
        if (this.activeEffects.has('collapse_risk')) modifier -= 0.5;  // 86-95: -50%
        
        // Morale effects
        if (this.activeEffects.has('discouraged')) modifier -= 0.1;
        if (this.activeEffects.has('depressed')) modifier -= 0.2;
        if (this.activeEffects.has('hopeful')) modifier += 0.1;
        
        // Status effects
        if (this.sickness) modifier -= 0.3;
        if (this.hangover) modifier -= 0.15;
        if (this.caffeineCrash) modifier -= 0.1;
        if (this.activeEffects.has('sleep_deprived')) {
            modifier -= 0.1 * this.sleepDeprivationLevel;
        }
        
        // Injury modifiers
        if (this.injury) {
            if (this.injury.severity === 'severe') modifier -= 0.5;
            else if (this.injury.severity === 'moderate') modifier -= 0.25;
            else modifier -= 0.1;
            
            // Pain modifier
            modifier *= this.getPainModifier();
        }
        
        return Math.max(0.1, modifier); // Never go below 10% success chance
    }

    getActionSpeedModifier() {
        // ⚡ ACTION SPEED MODIFIER: How fatigue and other factors affect how fast you act
        // Returns a multiplier (1.0 = normal speed, 0.5 = 50% slower, etc.)
        // This affects how long actions take (crafting, moving, etc.)
        let modifier = 1.0;
        
        // Thirst effects
        if (this.activeEffects.has('thirsty')) modifier -= 0.1;
        if (this.activeEffects.has('severe_thirst')) modifier -= 0.25;
        
        // Fatigue effects (matching user specs exactly)
        if (this.activeEffects.has('tired')) modifier -= 0.1;           // 31-50: 10% slower
        if (this.activeEffects.has('exhausted')) modifier -= 0.25;      // 51-70: 25% slower
        if (this.activeEffects.has('drowsy')) modifier -= 0.5;           // 71-85: 50% slower
        if (this.activeEffects.has('collapse_risk')) modifier -= 0.5;  // 86-95: 50% slower (constant blur)
        
        // Status effects
        if (this.sickness) modifier -= 0.5;
        if (this.hangover) modifier -= 0.1;
        if (this.activeEffects.has('sleep_deprived')) {
            modifier -= 0.05 * this.sleepDeprivationLevel;
        }
        
        // Shivering slows you down
        if (this.shivering) {
            modifier *= this.getShiverModifier();
        }
        
        // Injury modifiers
        if (this.injury) {
            if (this.injury.severity === 'severe') modifier -= 0.3;
            else if (this.injury.severity === 'moderate') modifier -= 0.15;
            else modifier -= 0.05;
            
            // Pain modifier
            modifier *= this.getPainModifier();
        }
        
        return Math.max(0.1, modifier); // Never go below 10% speed
    }

    /**
     * Start sleeping. Fatigue recovery rate depends on sleep surface (see surfaceQuality).
     * @param {number} sleepQuality - Base quality multiplier (1.0 = normal; passed_out uses 1.2).
     * @param {string} sleepSurface - 'floor' | 'cardboard' | 'armchair' | 'sleeping_bag' | 'makeshift_bed' | 'makeshift_bedding' | 'bed' | 'passed_out'.
     * @param {string} sleepType - 'nap' (2–4 game hrs, auto-end) | 'full' (8 game hrs, auto-end) | 'passed_out' (4–6 hrs, vulnerable).
     */
    startSleep(sleepQuality = 1.0, sleepSurface = 'floor', sleepType = 'full') {
        this.isSleeping = true;
        this.sleepStartTime = Date.now();
        this.sleepSurface = sleepSurface;
        this.sleepType = sleepType;
        this.napDuration = 0;

        // Recovery rate multiplier per surface (base -10/hr; × this = fatigue recovered per game hour).
        const surfaceQuality = {
            'floor': 0.5,             // -5/hr (concrete floor)
            'cardboard': 0.7,         // -7/hr
            'armchair': 0.9,          // -9/hr
            'sleeping_bag': 1.1,      // -11/hr (camping gear)
            'makeshift_bed': 1.0,     // -10/hr (crafted bed)
            'makeshift_bedding': 0.9, // -9/hr (old clothes + costumes)
            'bed': 1.5,               // -15/hr (actual bed)
            'passed_out': 1.2         // -12/hr (vulnerable to attacks)
        };
        this.sleepQuality = sleepQuality * (surfaceQuality[sleepSurface] || 0.5);
    }

    /**
     * Stop sleeping. Resets hours awake and pass-out chance.
     * @returns {number} Duration slept in (real) hours; 0 if wasn't sleeping.
     */
    stopSleep() {
        if (this.isSleeping) {
            const sleepDuration = (Date.now() - this.sleepStartTime) / (1000 * 60 * 60);
            this.isSleeping = false;
            this.sleepStartTime = null;
            this.sleepType = null;
            this.napDuration = 0;
            this.hoursAwake = 0; // Reset hours awake
            this.forcedSleepDuration = null;
            
            // Reset pass out chance
            this.passOutChance = 0;
            
            return sleepDuration;
        }
        return 0;
    }

    /** Start a short nap (2–4 game hours). Auto-ends in update(). */
    startNap(sleepSurface = 'floor') {
        this.startSleep(1.0, sleepSurface, 'nap');
    }

    /** Start full sleep (8 game hours). Auto-ends in update(). */
    startFullSleep(sleepSurface = 'floor') {
        this.startSleep(1.0, sleepSurface, 'full');
    }

    forceSleep() {
        // 💀 FORCE SLEEP: Player collapses from exhaustion
        // This happens when fatigue >= 96 or random pass out chance triggers
        // Player sleeps 4-6 hours automatically, vulnerable to attacks
        const sleepHours = 4 + Math.random() * 2; // 4-6 hours
        
        this.startSleep(1.2, 'passed_out', 'passed_out');
        this.forcedSleepDuration = sleepHours;
        
        if (window.game) {
            window.game.addMessage('You can\'t keep your eyes open. Everything goes dark...');
            // Trigger sleep event check (vulnerable to mongrels)
            // Passed out = more dangerous (higher chance of attack)
            window.game.checkSleepEvent(true);
        }
    }
    
    // 🎯 CHECK PASS OUT CHANCE: Called when player performs an action
    // Returns true if player should pass out, false otherwise
    checkPassOutChance() {
        if (this.fatigue.value < 86) return false; // Not tired enough
        
        // Cumulative pass out chance per action
        let chance = 0;
        if (this.fatigue.value >= 96) {
            chance = 1.0; // 100% - immediate collapse
        } else if (this.fatigue.value >= 91) {
            chance = 0.20; // 20% per action
        } else if (this.fatigue.value >= 86) {
            chance = 0.05; // 5% per action
        }
        
        if (Math.random() < chance) {
            this.forceSleep();
            return true;
        }
        
        return false;
    }

    drinkWhiskey() {
        // 🥃 WHISKEY: Old Whiskey Bottle
        // Immediate effects: Morale boost, fatigue reduction, thirst increase
        // Next day effects: Hangover (morale drop, fatigue increase, sickness chance, double thirst, hunger increase, crafting penalty)
        
        // Immediate effects
        this.morale.value = Math.min(100, this.morale.value + 30);
        this.fatigue.value = Math.max(0, this.fatigue.value - 20);
        
        // Increase thirst immediately (for 6 hours)
        this.whiskeyThirstMultiplier = 2.0;
        this.whiskeyThirstTimer = 6;
        
        // Set hangover for next day (24 hours from now)
        this.hangover = true;
        this.hangoverTimer = 24; // 24 hours until hangover hits
        this.hangoverPending = true; // Flag to apply hangover effects next day
        
        return {
            success: true,
            message: 'Warmth spreads through your chest. For now.'
        };
    }

    applyWhiskeyHangover() {
        // 🥴 APPLY WHISKEY HANGOVER: Next day effects after drinking
        // This is called when the hangover timer expires (24 hours after drinking)
        
        // Morale drop
        this.morale.value = Math.max(0, this.morale.value - 20);
        
        // Fatigue increase
        this.fatigue.value = Math.min(100, this.fatigue.value + 30);
        
        // Double thirst rate for 12 hours
        this.whiskeyThirstMultiplier = 2.0;
        this.whiskeyThirstTimer = 12;
        
        // Hunger increase (body needs fuel to process alcohol)
        this.hunger.value = Math.max(0, this.hunger.value - 10);
        
        // 40% chance of severe hangover (sickness risk)
        if (Math.random() < 0.4) {
            this.hangoverSevere = true;
            // 30% chance of getting sick from severe hangover
            if (Math.random() < 0.3) {
                this.triggerSickness();
            }
            if (window.game) {
                window.game.addMessage('The room is spinning. Why did you do that?');
            }
        }
        
        // Crafting penalty (already handled in getCraftingModifier())
        // Hangover reduces crafting success by 15%
        
        this.hangoverPending = false;
    }

    addInjury(severity, source) {
        this.injury = {
            severity: severity, // 'minor', 'moderate', 'severe'
            source: source, // 'combat', 'fall', 'explosion', etc.
            timer: severity === 'minor' ? 12 : (severity === 'moderate' ? 24 : 48) // Hours to heal
        };
        
        // Set pain level
        this.painLevel = severity === 'minor' ? 20 : (severity === 'moderate' ? 50 : 80);
        
        if (window.game) {
            const messages = {
                'minor': 'You have a minor injury. It hurts, but you can manage.',
                'moderate': 'You are moderately injured. This will slow you down.',
                'severe': 'You are severely injured! You need medical attention!'
            };
            window.game.addMessage(messages[severity]);
        }
    }

    updateInjury(hours, game) {
        if (!this.injury) return;
        
        // Pain naturally decreases over time
        this.painLevel = Math.max(0, this.painLevel - (hours * 2));
        
        // Apply injury effects
        if (this.injury.severity === 'severe') {
            this.health.value -= 2 * hours; // Constant health drain
            this.morale.value -= 1 * hours; // Morale drain
        } else if (this.injury.severity === 'moderate') {
            this.morale.value -= 0.5 * hours; // Slight morale drain
        }
        
        // Heal over time
        this.injury.timer -= hours;
        if (this.injury.timer <= 0) {
            this.injury = null;
            this.painLevel = 0;
            if (game) game.addMessage('Your injury has healed.');
        }
    }

    treatInjury(treatment, game) {
        if (!this.injury) return { success: false, message: 'No injury to treat' };
        
        const treatments = {
            'bandage': { minor: 0.8, moderate: 0.5, severe: 0.2 },
            'first_aid': { minor: 1.0, moderate: 0.8, severe: 0.5 },
            'pain_killers': { pain: -30, duration: 4 },
            'whiskey': { pain: -20, duration: 2, sideEffects: true }
        };
        
        const treatmentData = treatments[treatment];
        if (!treatmentData) return { success: false, message: 'Unknown treatment' };
        
        if (treatment === 'pain_killers' || treatment === 'whiskey') {
            // Pain relief
            this.painLevel = Math.max(0, this.painLevel + treatmentData.pain);
            if (game) {
                game.addMessage(treatment === 'pain_killers' ? 
                    'Pain killers provide temporary relief.' : 
                    'The whiskey numbs the pain... for now.');
            }
            
            if (treatment === 'whiskey' && treatmentData.sideEffects) {
                // Whiskey side effects
                this.morale.value = Math.max(0, this.morale.value - 5);
            }
            
            return { success: true, message: 'Pain relieved temporarily' };
        } else {
            // Healing treatment
            const successChance = treatmentData[this.injury.severity];
            if (Math.random() < successChance) {
                // Reduce injury severity or heal
                if (this.injury.severity === 'severe') {
                    this.injury.severity = 'moderate';
                    this.injury.timer = 24;
                    this.painLevel = 50;
                } else if (this.injury.severity === 'moderate') {
                    this.injury.severity = 'minor';
                    this.injury.timer = 12;
                    this.painLevel = 20;
                } else {
                    this.injury = null;
                    this.painLevel = 0;
                }
                
                if (game) game.addMessage('Treatment successful!');
                return { success: true, message: 'Injury treated' };
            } else {
                if (game) game.addMessage('Treatment helps, but injury persists.');
                return { success: false, message: 'Treatment partially effective' };
            }
        }
    }

    updateShivering(game) {
        if (!game.temperatureSystem) return;
        
        const warmth = game.temperatureSystem.getWarmthLevel();
        if (warmth < 50) {
            this.shivering = true;
            this.shiverIntensity = Math.min(100, (50 - warmth) * 2);
            
            // Shivering effects
            this.fatigue.value += 0.5 * (this.shiverIntensity / 100) * (1/3600); // Faster fatigue
            if (game.attractionSystem) {
                // Shivering = louder = attracts mongrels
                game.attractionSystem.addAttraction(0.1 * (this.shiverIntensity / 100) * (1/3600));
            }
        } else {
            this.shivering = false;
            this.shiverIntensity = 0;
        }
    }

    updateDreams(hours, game) {
        this.dreamTimer += hours;
        
        // Dreams every 2 hours of sleep
        if (this.dreamTimer >= 2) {
            this.dreamTimer = 0;
            this.triggerDream(game);
        }
    }

    triggerDream(game) {
        const morale = this.morale.value;
        const sick = this.sickness;
        
        if (sick) {
            // Fever dreams
            this.lastDream = 'fever';
            this.morale.value = Math.max(0, this.morale.value - 5);
            if (window.game) {
                window.game.addMessage('Fever dreams plague your sleep. You wake confused.');
            }
            this.sleepQuality *= 0.8; // Poor sleep
        } else if (morale < 30) {
            // Nightmares
            this.lastDream = 'nightmare';
            this.morale.value = Math.max(0, this.morale.value - 3);
            this.sleepQuality *= 0.9;
            if (window.game) {
                window.game.addMessage('Nightmares disturb your sleep. You wake tired.');
            }
        } else if (morale >= 80) {
            // Pleasant dreams
            this.lastDream = 'pleasant';
            this.morale.value = Math.min(100, this.morale.value + 5);
            this.sleepQuality *= 1.1;
            if (window.game) {
                window.game.addMessage('Pleasant dreams. You wake refreshed.');
            }
        } else {
            this.lastDream = 'normal';
        }
    }

    updateHallucinations(hours, game) {
        // Hallucinations if extreme states
        const shouldHallucinate = this.fatigue.value > 90 && 
                                  this.morale.value < 30 && 
                                  this.sickness;
        
        if (shouldHallucinate && !this.hallucinating) {
            this.hallucinating = true;
            this.hallucinationTimer = 0;
            if (window.game) {
                window.game.addMessage('You start seeing things that aren\'t there...');
            }
        }
        
        if (this.hallucinating) {
            this.hallucinationTimer += hours;
            
            // Random hallucinations
            if (Math.random() < 0.1 * hours) {
                const hallucinations = [
                    'You hear knocking, but no one is there.',
                    'A shadow moves in the corner... or did it?',
                    'You see a mongrel, but it disappears when you look.',
                    'The crafting recipes look wrong... confused...'
                ];
                if (window.game) {
                    window.game.addMessage(hallucinations[Math.floor(Math.random() * hallucinations.length)]);
                }
            }
            
            // Hallucinations stop when conditions improve
            if (this.fatigue.value < 70 || this.morale.value > 50 || !this.sickness) {
                this.hallucinating = false;
                if (window.game) {
                    window.game.addMessage('Your mind clears. The hallucinations stop.');
                }
            }
        }
    }

    getPainModifier() {
        if (!this.injury) return 1.0;
        
        if (this.painLevel >= 70) return 0.5; // Severe pain
        if (this.painLevel >= 40) return 0.75; // Moderate pain
        if (this.painLevel >= 20) return 0.9; // Minor pain
        return 1.0;
    }
    
    getShiverModifier() {
        if (!this.shivering) return 1.0;
        return 1.0 - (this.shiverIntensity / 100) * 0.3; // Up to -30% speed
    }

    drinkCaffeine(type) {
        // ☕ CAFFEINE ITEMS: Coffee, Energy Drink, Caffeine Pills
        // Immediate effects: Reduce fatigue
        // Crash effects: Fatigue increases after crash timer expires
        const effects = {
            'coffee': { 
                fatigue: -20,        // Immediate: -20 fatigue
                crash: 10,           // Crash: +10 fatigue
                crashTime: 4        // Crash after 4 hours
            },
            'energy_drink': { 
                fatigue: -30,        // Immediate: -30 fatigue (stronger!)
                crash: 20,           // Crash: +20 fatigue (bigger crash)
                crashTime: 4        // Crash after 4 hours
            },
            'caffeine_pills': { 
                fatigue: -15,        // Immediate: -15 fatigue
                crash: 0,            // No crash (but jitters)
                crashTime: 0
            }
        };
        
        const effect = effects[type] || effects.coffee;
        this.fatigue.value = Math.max(0, this.fatigue.value + effect.fatigue);
        
        // Set up crash timer
        if (effect.crash > 0) {
            this.caffeineCrash = true;
            this.caffeineCrashFatigue = effect.crash;
            this.caffeineCrashTimer = effect.crashTime; // Hours until crash
        }
        
        // Caffeine pills have jitters (no crash, but side effects)
        if (type === 'caffeine_pills') {
            this.caffeineJitters = true;
            this.caffeineJittersTimer = 2; // 2 hours of jitters
        }
        
        return {
            success: true,
            message: type === 'coffee' ? 'The coffee wakes you up.' : 
                    type === 'energy_drink' ? 'You feel energized... for now.' :
                    'The pills kick in.'
        };
    }

    consumeWater(hydrationValue, hygieneCost = 0, sicknessRisk = 0) {
        this.hydration.value = Math.min(this.hydration.max, this.hydration.value + hydrationValue);
        this.hygiene.value = Math.min(this.hygiene.max, this.hygiene.value + hygieneCost);
        
        // Check sickness risk
        if (sicknessRisk > 0 && Math.random() < sicknessRisk) {
            this.triggerSickness();
            if (window.game) {
                window.game.addMessage('You feel sick after drinking that...');
            }
        }
    }

    consumeFood(nutritionValue, hygieneCost = 0, moraleBoost = 0) {
        this.hunger.value = Math.min(this.hunger.max, this.hunger.value + nutritionValue);
        this.hygiene.value = Math.min(this.hygiene.max, this.hygiene.value + hygieneCost);
        if (moraleBoost !== 0) {
            this.morale.value = Math.max(0, Math.min(this.morale.max, this.morale.value + moraleBoost));
        }
    }

    adjustMorale(amount) {
        this.morale.value = Math.max(0, Math.min(this.morale.max, this.morale.value + amount));
    }

    adjustHygiene(amount) {
        this.hygiene.value = Math.max(0, Math.min(this.hygiene.max, this.hygiene.value + amount));
    }

    adjustHealth(amount) {
        this.health.value = Math.max(0, Math.min(this.health.max, this.health.value + amount));
    }

    triggerSickness() {
        if (!this.sickness) {
            this.sickness = true;
            this.sicknessTimer = Date.now();
            this.sicknessLevel.value = Math.min(this.sicknessLevel.max, (this.sicknessLevel.value || 0) + 70);
            if (window.game) {
                window.game.addMessage('You feel sick. Your body is fighting something...');
            }
            return true;
        }
        this.sicknessLevel.value = Math.min(this.sicknessLevel.max, (this.sicknessLevel.value || 0) + 30);
        return false;
    }

    cureSickness(method = 'rest') {
        if (!this.sickness) return false;
        
        let successChance = 0;
        let cureTime = 0;
        
        switch (method) {
            case 'charcoal':
                successChance = 0.8;
                cureTime = 2; // hours
                break;
            case 'herbal_tea':
                successChance = 0.6;
                cureTime = 1; // hour
                break;
            case 'antibiotics':
                successChance = 0.4; // 40% cure, 60% worse
                cureTime = 0; // instant
                break;
            case 'rest':
                successChance = 1.0;
                cureTime = 24; // hours
                break;
            case 'vitamins':
                successChance = 0.3;
                cureTime = 0; // instant
                break;
        }
        
        if (method === 'antibiotics' && Math.random() > successChance) {
            // Antibiotics made it worse
            this.health.value -= 10;
            if (window.game) {
                window.game.addMessage('The antibiotics made you feel worse!');
            }
            return false;
        }
        
if (Math.random() < successChance) {
            this.sickness = false;
            this.sicknessTimer = 0;
            this.sicknessLevel.value = 0;
            if (window.game) {
                window.game.addMessage('You feel better. The sickness passes.');
            }
            return true;
        }

        return false;
    }

    cureSickness() {
        if (this.sickness) {
            this.sickness = false;
            this.sicknessTimer = 0;
            this.sicknessLevel.value = 0;
            return true;
        }
        return false;
    }

    performHygieneAction(actionType, waterUsed = 0) {
        switch (actionType) {
            case 'sponge_bath_full':
                this.hygiene.value = Math.max(0, this.hygiene.value - 30);
                return { success: true, message: 'Full sponge bath. Much cleaner!' };
            case 'sponge_bath_minimal':
                this.hygiene.value = Math.max(0, this.hygiene.value - 15);
                return { success: true, message: 'Quick wash. Better than nothing.' };
            case 'baby_wipes':
                this.hygiene.value = Math.max(0, this.hygiene.value - 25);
                return { success: true, message: 'Moist wipes. Feels like luxury!' };
            case 'soap_water_rag':
                this.hygiene.value = Math.max(0, this.hygiene.value - 35);
                return { success: true, message: 'Washed with soap and water at the drain. Much cleaner!' };
            case 'change_clothes':
                this.hygiene.value = Math.max(0, this.hygiene.value - 10);
                return { success: true, message: 'Changed clothes. Fresh feeling.' };
            case 'rain_shower':
                this.hygiene.value = Math.max(0, this.hygiene.value - 40);
                return { success: true, message: 'Rain shower. Refreshing!' };
            default:
                return { success: false, message: 'Unknown hygiene action' };
        }
    }

    performMoraleAction(actionType) {
        const moraleActions = {
            'read_book': 15,
            'read_magazine': 10,
            'play_cards': 15,
            'board_game': 20,
            'fix_item': 25,
            'wear_costume': 15,
            'exercise': 10,
            'journal': 15,
            'photo_album': Math.random() < 0.5 ? 20 : -10, // Risky
            'hot_meal': 30,
            'first_clean_water': 50,
            'first_fire': 50,
            'first_kill': 20,
            'radio_good': 15,
            'radio_bad': -15,
            'radio_weird': Math.random() < 0.5 ? 10 : -10
        };
        
        const boost = moraleActions[actionType] || 0;
        this.morale.value = Math.max(0, Math.min(this.morale.max, this.morale.value + boost));
        return boost;
    }

    getState() {
        return {
            health: { ...this.health },
            hydration: { ...this.hydration },
            hunger: { ...this.hunger },
            morale: { ...this.morale },
            hygiene: { ...this.hygiene },
            fatigue: { ...this.fatigue },
            bathroom: { ...this.bathroom },
            bodyHeat: { ...this.bodyHeat },
            sickness: this.sickness,
            sicknessTimer: this.sicknessTimer,
            sicknessLevel: this.sicknessLevel ? { ...this.sicknessLevel } : { value: 0, max: 100 },
            isSleeping: this.isSleeping,
            sleepStartTime: this.sleepStartTime,
            sleepQuality: this.sleepQuality,
            hoursAwake: this.hoursAwake || 0,
            sleepDeprivationLevel: this.sleepDeprivationLevel || 0,
            hangover: this.hangover || false,
            hangoverTimer: this.hangoverTimer || 0,
            hangoverSevere: this.hangoverSevere || false,
            hangoverPending: this.hangoverPending || false,
            caffeineCrash: this.caffeineCrash || false,
            caffeineCrashTimer: this.caffeineCrashTimer || 0,
            caffeineCrashFatigue: this.caffeineCrashFatigue || 0,
            caffeineJitters: this.caffeineJitters || false,
            caffeineJittersTimer: this.caffeineJittersTimer || 0,
            whiskeyThirstMultiplier: this.whiskeyThirstMultiplier || 1.0,
            whiskeyThirstTimer: this.whiskeyThirstTimer || 0,
            injury: this.injury ? { ...this.injury } : null,
            painLevel: this.painLevel || 0,
            sleepType: this.sleepType || null,
            napDuration: this.napDuration || 0,
            passOutChance: this.passOutChance || 0,
            forcedSleepDuration: this.forcedSleepDuration || null,
            needsSanitizerAfterBathroom: this.needsSanitizerAfterBathroom || false,
            sanitizerPenaltyTimer: this.sanitizerPenaltyTimer || 0
        };
    }

    setState(state) {
        this.health = state.health || { value: 100, max: 100 };
        this.hydration = state.hydration || { value: 80, max: 100 };
        this.hunger = state.hunger || { value: 70, max: 100 };
        this.morale = state.morale || { value: 60, max: 100 };
        this.hygiene = state.hygiene || { value: 30, max: 100 };
        this.fatigue = state.fatigue || { value: 20, max: 100 };
        this.bathroom = state.bathroom || { value: 30, max: 100 };
        this.bodyHeat = state.bodyHeat || { value: 100, max: 100 };
        this.sickness = state.sickness || false;
        this.sicknessTimer = state.sicknessTimer || 0;
        this.sicknessLevel = state.sicknessLevel ? { value: state.sicknessLevel.value || 0, max: state.sicknessLevel.max || 100 } : { value: 0, max: 100 };
        this.isSleeping = state.isSleeping || false;
        this.sleepStartTime = state.sleepStartTime || null;
        this.sleepQuality = state.sleepQuality || 1.0;
        this.hoursAwake = state.hoursAwake || 0;
        this.sleepDeprivationLevel = state.sleepDeprivationLevel || 0;
        this.hangover = state.hangover || false;
        this.hangoverTimer = state.hangoverTimer || 0;
        this.hangoverSevere = state.hangoverSevere || false;
        this.hangoverPending = state.hangoverPending || false;
        this.caffeineCrash = state.caffeineCrash || false;
        this.caffeineCrashTimer = state.caffeineCrashTimer || 0;
        this.caffeineCrashFatigue = state.caffeineCrashFatigue || 0;
        this.caffeineJitters = state.caffeineJitters || false;
        this.caffeineJittersTimer = state.caffeineJittersTimer || 0;
        this.whiskeyThirstMultiplier = state.whiskeyThirstMultiplier || 1.0;
        this.whiskeyThirstTimer = state.whiskeyThirstTimer || 0;
        this.injury = state.injury || null;
        this.painLevel = state.painLevel || 0;
        this.shivering = state.shivering || false;
        this.shiverIntensity = state.shiverIntensity || 0;
        this.lastDream = state.lastDream || null;
        this.dreamTimer = state.dreamTimer || 0;
        this.hallucinating = state.hallucinating || false;
        this.hallucinationTimer = state.hallucinationTimer || 0;
        this.sleepType = state.sleepType || null;
        this.napDuration = state.napDuration || 0;
        this.passOutChance = state.passOutChance || 0;
        this.forcedSleepDuration = state.forcedSleepDuration || null;
        this.needsSanitizerAfterBathroom = state.needsSanitizerAfterBathroom || false;
        this.sanitizerPenaltyTimer = state.sanitizerPenaltyTimer || 0;
    }
}
