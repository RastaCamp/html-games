/**
 * 7 DAYS... - EVENT SYSTEM
 * 
 * 📅 WHAT IS THIS FILE?
 * This manages all the scripted and random events in the game.
 * Want to add a new event? Make something happen on a specific day?
 * This is your file!
 * 
 * 🎯 TYPES OF EVENTS:
 * - Scripted: Happens on a specific day/time (like Day 4 marauders)
 * - Random: Can happen anytime (like mongrel attacks)
 * - Conditional: Happens when conditions are met (like high attraction)
 * 
 * 📝 HOW TO ADD AN EVENT:
 * 1. Add it to initializeEvents() array
 * 2. Give it an id (unique identifier)
 * 3. Set when it happens (day, time)
 * 4. Write what it does in execute()
 * 5. Save and test!
 * 
 * 💡 PRO TIPS:
 * - Test events by setting day to 1 (faster testing)
 * - Events can check conditions: trigger: () => game.meters.morale.value < 30
 * - Don't make events too punishing (players will hate you)
 * - Add flavor text! Events are storytelling opportunities
 * 
 * 🎨 EXAMPLE EVENT:
 * {
 *     id: 'my_cool_event',
 *     day: 3,
 *     time: 'afternoon',
 *     type: 'scripted',
 *     trigger: () => true,  // Always triggers
 *     execute: (game) => {
 *         game.addMessage('Something cool happens!');
 *         game.meters.adjustMorale(10); // Give morale boost
 *     }
 * }
 */

class EventSystem {
    constructor() {
        // 📋 EVENT TRACKING: Keep track of what's happened
        this.events = []; // All possible events
        this.triggeredEvents = new Set(); // Events that already happened (don't repeat)
        this.randomEventChance = 0.1; // 10% chance per hour for random events
        this.scheduledEvents = []; // Events scheduled for future (delayed events)
        this.conditionalEvents = []; // Events that check conditions continuously
    }

    initializeEvents() {
        return [
            {
                id: 'day1_orientation',
                day: 1,
                time: 'morning',
                type: 'scripted',
                trigger: () => true,
                execute: (game) => {
                    game.addMessage('You wake up in the basement. The door is locked. Sounds of chaos echo from above.');
                    game.addMessage('You need to survive 7 days. Find water, food, and stay sane.');
                }
            },
            {
                id: 'day2_power_out',
                day: 2,
                time: 'morning',
                type: 'scripted',
                trigger: () => true,
                execute: (game) => {
                    game.addMessage('The power goes out. Darkness falls. You need to find light.');
                    // Could trigger finding candles or batteries
                }
            },
            {
                id: 'day3_rabbit',
                day: 3,
                time: 'afternoon',
                type: 'scripted',
                trigger: () => true,
                execute: (game) => {
                    game.addMessage('A rabbit falls into the window well! A gift from above.');
                    game.inventory.addItem(game.itemSystem.createItem('rabbit_meat'), 1);
                    game.meters.adjustMorale(10);
                }
            },
            {
                id: 'day4_marauders',
                day: 4,
                time: 'evening',
                type: 'scripted',
                trigger: () => true,
                execute: (game) => {
                    game.addMessage('KNOCK KNOCK KNOCK');
                    game.addMessage('"We have medicine! Let us in!"');
                    game.addMessage('You hear multiple voices. This could be a trap...');
                    // Player must decide - could be implemented as choice later
                }
            },
            {
                id: 'day5_sickness',
                day: 5,
                time: 'morning',
                type: 'scripted',
                trigger: () => true,
                execute: (game) => {
                    game.addMessage('You wake up feeling terrible. Fever, chills, weakness.');
                    game.meters.triggerSickness();
                    game.meters.adjustHealth(-20);
                }
            },
            {
                id: 'day6_storm',
                day: 6,
                time: 'afternoon',
                type: 'scripted',
                trigger: () => true,
                execute: (game) => {
                    game.addMessage('A massive storm hits. Rain pours into the window well.');
                    game.addMessage('You must bail water or lose your supplies!');
                    // Could trigger minigame or resource loss
                }
            },
            {
                id: 'day7_rescue',
                day: 7,
                time: 'evening',
                type: 'scripted',
                trigger: () => true,
                execute: (game) => {
                    game.addMessage('You hear voices outside. "Is anyone in there?"');
                    game.addMessage('Help has arrived... or has it?');
                }
            },
            // Random events
            {
                id: 'mongrel_attack',
                day: null,
                type: 'random',
                trigger: (game) => {
                    // Higher chance if hygiene is high or cooking smells
                    const chance = game.meters.hygiene.value / 100 * 0.3;
                    return Math.random() < chance;
                },
                execute: (game) => {
                    game.addMessage('Mongrels scratch at the windows! They smell something...');
                    game.meters.adjustMorale(-15);
                    // Could damage fortifications
                }
            },
            {
                id: 'radio_hope_1',
                day: null,
                type: 'random',
                trigger: (game) => game.inventory && game.inventory.hasItem('emergency_radio', 1) && Math.random() < 0.05,
                execute: (game) => {
                    game.addMessage('Radio: "Military has secured Zone A. Rescue operations ongoing."');
                    game.meters.adjustMorale(20);
                    if (game.achievements) game.achievements.checkAchievement('news_junkie', game);
                    if (game.tipJar && !game.firstRadio) {
                        game.tipJar.earnTip('first_radio');
                        game.firstRadio = true;
                    }
                }
            },
            {
                id: 'radio_hope_2',
                day: null,
                type: 'random',
                trigger: (game) => game.inventory && game.inventory.hasItem('emergency_radio', 1) && Math.random() < 0.05,
                execute: (game) => {
                    game.addMessage('Radio: "FEMA reports supply drops in affected areas."');
                    game.meters.adjustMorale(15);
                    if (game.achievements) game.achievements.checkAchievement('news_junkie', game);
                }
            },
            {
                id: 'radio_neutral_1',
                day: null,
                type: 'random',
                trigger: (game) => game.inventory && game.inventory.hasItem('emergency_radio', 1) && Math.random() < 0.05,
                execute: (game) => {
                    game.addMessage('Radio: "Looting reported in several cities. Stay indoors."');
                    game.meters.adjustMorale(-5);
                    if (game.achievements) game.achievements.checkAchievement('news_junkie', game);
                }
            },
            {
                id: 'radio_neutral_2',
                day: null,
                type: 'random',
                trigger: (game) => game.inventory && game.inventory.hasItem('emergency_radio', 1) && Math.random() < 0.05,
                execute: (game) => {
                    game.addMessage('Radio: "No official statement from government in 48 hours."');
                    game.meters.adjustMorale(-3);
                    if (game.achievements) game.achievements.checkAchievement('news_junkie', game);
                }
            },
            {
                id: 'radio_creepy_1',
                day: null,
                type: 'random',
                trigger: (game) => game.inventory && game.inventory.hasItem('emergency_radio', 1) && Math.random() < 0.03,
                execute: (game) => {
                    game.addMessage('Radio: "We\'re hearing reports of... we don\'t know how to describe this..."');
                    game.meters.adjustMorale(-15);
                    if (game.achievements) game.achievements.checkAchievement('news_junkie', game);
                }
            },
            {
                id: 'radio_creepy_2',
                day: null,
                type: 'random',
                trigger: (game) => game.inventory && game.inventory.hasItem('emergency_radio', 1) && Math.random() < 0.03,
                execute: (game) => {
                    game.addMessage('Radio: "If you\'re listening, don\'t trust anyone in uniform." [Static]');
                    game.meters.adjustMorale(-10);
                    if (game.achievements) game.achievements.checkAchievement('news_junkie', game);
                }
            },
            {
                id: 'radio_creepy_3',
                day: null,
                type: 'random',
                trigger: (game) => game.inventory && game.inventory.hasItem('emergency_radio', 1) && Math.random() < 0.02,
                execute: (game) => {
                    game.addMessage('Radio: [Whispering] "...they\'re not human..." [Static]');
                    game.meters.adjustMorale(-20);
                    if (game.achievements) game.achievements.checkAchievement('news_junkie', game);
                }
            },
            {
                id: 'radio_despair_1',
                day: null,
                type: 'random',
                trigger: (game) => game.inventory && game.inventory.hasItem('emergency_radio', 1) && Math.random() < 0.05,
                execute: (game) => {
                    game.addMessage('Radio: "All evacuation centers are at capacity. They\'re turning people away."');
                    game.meters.adjustMorale(-15);
                    if (game.achievements) game.achievements.checkAchievement('news_junkie', game);
                }
            },
            {
                id: 'radio_despair_2',
                day: null,
                type: 'random',
                trigger: (game) => game.inventory && game.inventory.hasItem('emergency_radio', 1) && Math.random() < 0.05,
                execute: (game) => {
                    game.addMessage('Radio: "They\'ve sealed the city. No one in or out."');
                    game.meters.adjustMorale(-20);
                    if (game.achievements) game.achievements.checkAchievement('news_junkie', game);
                }
            },
            {
                id: 'find_treasure',
                day: null,
                type: 'random',
                trigger: (game) => Math.random() < 0.05,
                execute: (game) => {
                    const treasures = ['candle', 'battery', 'medicine', 'canned_food'];
                    const treasure = treasures[Math.floor(Math.random() * treasures.length)];
                    game.addMessage(`You find something useful: ${game.itemSystem.getItem(treasure).name}`);
                    game.inventory.addItem(game.itemSystem.createItem(treasure), 1);
                    game.meters.adjustMorale(5);
                }
            }
        ];
    }

    update(game) {
        const currentDay = game.dayCycle.currentDay;
        const timeOfDay = game.dayCycle.getTimeOfDay().toLowerCase();
        const currentTime = Date.now();
        
        // Check scheduled events
        this.scheduledEvents = this.scheduledEvents.filter(scheduled => {
            if (currentTime >= scheduled.triggerTime) {
                scheduled.event.execute(game);
                return false; // Remove from scheduled
            }
            return true; // Keep in scheduled
        });
        
        // Check conditional events (cause-and-effect)
        for (const event of this.conditionalEvents) {
            if (!this.triggeredEvents.has(event.id) && event.condition(game)) {
                if (!event.cooldown || (currentTime - (event.lastTriggered || 0)) >= event.cooldown) {
                    event.execute(game);
                    event.lastTriggered = currentTime;
                    this.triggeredEvents.add(event.id);
                    
                    // If event has a delay, schedule it
                    if (event.delay) {
                        this.scheduleEvent(event, event.delay);
                    }
                }
            }
        }
        
        // Check scripted events
        for (const event of this.events) {
            if (event.type === 'scripted' && 
                event.day === currentDay && 
                event.time === timeOfDay &&
                !this.triggeredEvents.has(event.id)) {
                if (event.trigger(game)) {
                    event.execute(game);
                    this.triggeredEvents.add(event.id);
                }
            }
        }
        
        // Check random events (lower frequency)
        if (Math.random() < this.randomEventChance / 60) { // Per second
            for (const event of this.events) {
                if (event.type === 'random' && 
                    !this.triggeredEvents.has(event.id) &&
                    event.trigger(game)) {
                    event.execute(game);
                    this.triggeredEvents.add(event.id);
                    break; // Only one random event at a time
                }
            }
        }
        
        // Check attraction system triggers
        if (game.attractionSystem) {
            const triggers = game.attractionSystem.checkTriggers(game);
            for (const trigger of triggers) {
                this.handleAttractionTrigger(trigger, game);
            }
        }
    }

    scheduleEvent(event, delayMs) {
        this.scheduledEvents.push({
            event: event,
            triggerTime: Date.now() + delayMs
        });
    }

    handleAttractionTrigger(trigger, game) {
        const actions = game.actionTracker.getActions();
        
        switch (trigger.type) {
            case 'mega_event':
                game.addMessage('⚠️ MEGA EVENT: Multiple threats detected!');
                game.addMessage('The generator, cooking, and open window have attracted EVERYONE.');
                // Trigger both mongrels and marauders
                this.triggerMongrelPack(game, 5);
                setTimeout(() => {
                    this.triggerMarauders(game, 'aggressive');
                }, 5 * 60 * 1000); // Marauders arrive 5 minutes later
                game.meters.adjustMorale(-30);
                break;
                
            case 'marauders':
                const delay = trigger.delay || (30 * 60 * 1000);
                game.addMessage('You hear voices outside. They heard something...');
                this.scheduleEvent({
                    id: 'marauders_arrival',
                    execute: (g) => this.triggerMarauders(g, 'investigate')
                }, delay);
                break;
                
            case 'mongrel_attack':
                // Trigger combat system
                if (game.combatSystem) {
                    game.handleMongrelBreach();
                }
                break;
                const delay2 = trigger.delay || (30 * 60 * 1000);
                const count = actions.wasteDumped > 1 ? 5 : 2; // More waste = more mongrels
                this.scheduleEvent({
                    id: 'mongrel_attack_arrival',
                    execute: (g) => this.triggerMongrelPack(g, count)
                }, delay2);
                break;
                
            case 'mongrel_investigation':
                const delay3 = trigger.delay || (60 * 60 * 1000);
                game.addMessage('You hear scratching at the window. Something is investigating...');
                this.scheduleEvent({
                    id: 'mongrel_investigation',
                    execute: (g) => this.triggerMongrelInvestigation(g)
                }, delay3);
                break;
        }
    }

    triggerMongrelPack(game, count) {
        game.addMessage(`⚠️ ${count} mongrels scratch at the windows!`);
        if (!game.interactables.getObject('window').windowBoarded) {
            game.addMessage("The window isn't secured! They might get in!");
            game.meters.adjustHealth(-10);
            game.meters.adjustMorale(-20);
        } else {
            game.addMessage("Your barricades hold, but they're persistent...");
            game.meters.adjustMorale(-15);
        }
        
        // Award tip for surviving first mongrel attack
        if (game.tipJar && !game.firstMongrel) {
            game.tipJar.earnTip('first_mongrel');
            game.firstMongrel = true;
        }
    }

    triggerMongrelInvestigation(game) {
        game.addMessage('Mongrels sniff around the window. They smell something...');
        game.meters.adjustMorale(-5);
    }

    triggerMarauders(game, type) {
        if (type === 'aggressive') {
            game.addMessage('⚠️ MARAUDERS: "We know you\'re in there! Open up!"');
            game.addMessage('They sound desperate. And armed.');
            game.meters.adjustMorale(-25);
        } else {
            game.addMessage('⚠️ MARAUDERS: "Anyone in there? We heard something..."');
            game.addMessage("They're investigating the noise.");
            game.meters.adjustMorale(-15);
        }
        
        // Award tip for surviving first marauder encounter
        if (game.tipJar && !game.firstMarauder) {
            game.tipJar.earnTip('first_marauder');
            game.firstMarauder = true;
        }
    }

    initializeConditionalEvents() {
        return [
            // Generator at night
            {
                id: 'generator_night_warning',
                condition: (game) => {
                    const actions = game.actionTracker.getActions();
                    return actions.generatorOn && game.dayCycle.isNight;
                },
                execute: (game) => {
                    game.addMessage('⚠️ The generator echoes in the night. Something heard it.');
                },
                cooldown: 5 * 60 * 1000, // 5 minutes
                priority: 'warning'
            },
            
            // Lights at night
            {
                id: 'lights_night_mongrels',
                condition: (game) => {
                    const actions = game.actionTracker.getActions();
                    return actions.lightsOnAtNight;
                },
                execute: (game) => {
                    game.addMessage('⚠️ Light leaks through the window. Eyes watch from outside...');
                },
                cooldown: 10 * 60 * 1000, // 10 minutes
                priority: 'warning'
            },
            
            // Flashlight at window
            {
                id: 'flashlight_mongrels',
                condition: (game) => {
                    const actions = game.actionTracker.getActions();
                    return actions.flashlightUsed && game.dayCycle.isNight;
                },
                execute: (game) => {
                    game.addMessage('⚠️ The flashlight beam was seen. Mongrels investigate immediately!');
                    game.attractionSystem.attractionPoints += 20; // Immediate spike
                },
                cooldown: 0,
                delay: 5 * 60 * 1000, // 5 minutes
                priority: 'high'
            },
            
            // Waste dumped out window
            {
                id: 'waste_dump_consequence',
                condition: (game) => {
                    const actions = game.actionTracker.getActions();
                    return actions.wasteDumped > 0;
                },
                execute: (game) => {
                    const actions = game.actionTracker.getActions();
                    if (actions.wasteDumped === 1) {
                        game.addMessage('⚠️ You threw waste out the window. The smell is strong...');
                    } else {
                        game.addMessage('⚠️ You keep dumping waste. The smell is overwhelming. They WILL come.');
                    }
                },
                cooldown: 30 * 60 * 1000, // 30 minutes
                delay: 30 * 60 * 1000, // Mongrels arrive in 30-60 minutes
                priority: 'high'
            },
            
            // Cooking without ventilation
            {
                id: 'cooking_smell',
                condition: (game) => {
                    const actions = game.actionTracker.getActions();
                    return actions.cooking && !actions.cookingVentilation;
                },
                execute: (game) => {
                    game.addMessage('⚠️ The smell of cooking meat lingers. It carries far...');
                },
                cooldown: 15 * 60 * 1000,
                priority: 'medium'
            },
            
            // Power tools
            {
                id: 'power_tools_marauders',
                condition: (game) => {
                    const actions = game.actionTracker.getActions();
                    return actions.powerToolsUsed;
                },
                execute: (game) => {
                    game.addMessage('⚠️ Power tools are LOUD. Marauders will investigate immediately.');
                    game.attractionSystem.attractionPoints += 30;
                },
                cooldown: 0,
                delay: 10 * 60 * 1000, // 10 minutes
                priority: 'high'
            },
            
            // Radio transmitting
            {
                id: 'radio_transmit_danger',
                condition: (game) => {
                    const actions = game.actionTracker.getActions();
                    return actions.radioTransmitting;
                },
                execute: (game) => {
                    game.addMessage('⚠️ You broadcasted your location! Marauders are coming!');
                    game.attractionSystem.attractionPoints += 50;
                },
                cooldown: 0,
                delay: 5 * 60 * 1000, // 5 minutes
                priority: 'critical'
            },
            
            // Smoke visible
            {
                id: 'smoke_visible',
                condition: (game) => {
                    const actions = game.actionTracker.getActions();
                    return actions.smokeVisible;
                },
                execute: (game) => {
                    game.addMessage('⚠️ Smoke is visible from outside. Fire = civilization = resources.');
                },
                cooldown: 20 * 60 * 1000,
                delay: 15 * 60 * 1000,
                priority: 'high'
            },
            
            // Window open at night
            {
                id: 'window_open_night',
                condition: (game) => {
                    const actions = game.actionTracker.getActions();
                    return actions.windowOpen && !actions.windowBoarded && game.dayCycle.isNight;
                },
                execute: (game) => {
                    game.addMessage('⚠️ The window is open at night. Something could enter while you sleep...');
                },
                cooldown: 30 * 60 * 1000,
                priority: 'medium'
            },
            
            // Generator running too long
            {
                id: 'generator_long_use',
                condition: (game) => {
                    const actions = game.actionTracker.getActions();
                    if (!actions.generatorOn || !actions.generatorStartTime) return false;
                    const hours = (Date.now() - actions.generatorStartTime) / (1000 * 60 * 60);
                    return hours > 2;
                },
                execute: (game) => {
                    game.addMessage('⚠️ Generator has been running for hours. Fuel depleting. Noise attracting attention.');
                },
                cooldown: 60 * 60 * 1000, // 1 hour
                priority: 'warning'
            }
        ];
    }

    reset() {
        this.triggeredEvents.clear();
        this.scheduledEvents = [];
    }

    getState() {
        return {
            triggeredEvents: Array.from(this.triggeredEvents),
            scheduledEvents: this.scheduledEvents.map(s => ({
                eventId: s.event.id,
                triggerTime: s.triggerTime
            }))
        };
    }

    setState(state) {
        this.triggeredEvents = new Set(state.triggeredEvents || []);
        // Scheduled events will need to be recreated based on game state
        this.scheduledEvents = [];
    }
}
