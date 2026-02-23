/**
 * 7 DAYS... - DEATH SCREEN
 * 
 * 💀 WHAT IS THIS FILE?
 * This shows the death screen when you die. Cause of death, days survived,
 * and prompts for your name (for the death marker).
 * 
 * 🎯 WHAT IT DOES:
 * - Shows cause of death with flavor text
 * - Shows days survived
 * - Prompts for player name
 * - Records death marker
 * - Returns to title screen
 * 
 * 💡 WANT TO ADD NEW DEATH CAUSES?
 * 1. Add cause to formatCause() method
 * 2. Add funny flavor text
 * 3. Make sure Game.js calls handleGameOver() with the right cause
 * 
 * 🎨 DEATH CAUSES:
 * - Dehydration, Starvation, Despair, Mongrels, Marauders, Fire, etc.
 * - Each has unique flavor text (dark humor is this game's thing)
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to record death marker (won't show on title screen)
 * - Not handling "skip name" option
 * - Making death screen too depressing (it's a game, have fun!)
 */

class DeathScreen {
    constructor(deathMarkerSystem) {
        this.deathMarkerSystem = deathMarkerSystem;
        this.deathMessages = {
            'health': [
                "You are what you eat. You didn't eat enough.",
                "Your body gave out. The basement became your tomb.",
                "Injury and exhaustion claimed you. Rest now."
            ],
            'morale': [
                "Lost the will to live?",
                "You didn't die. You just stopped wanting to live.",
                "The will to survive faded. You gave up.",
                "Hope died before you did. The darkness won."
            ],
            'starvation': [
                "You are what you eat. You didn't eat enough.",
                "Hunger consumed you. The last thing you saw was the empty can.",
                "Starvation claimed you. Your body couldn't go on."
            ],
            'dehydration': [
                "Water is life. You ran out of both.",
                "Thirst drove you mad. Then it killed you.",
                "Dehydration claimed you. The water heater was empty."
            ],
            'sickness': [
                "The basement became your tomb. And your bathroom.",
                "Sickness consumed you. No medicine could save you now.",
                "Fever dreams were your last thoughts. Then nothing."
            ],
            'mongrels': [
                "They smelled your fear. And your unfinished compost.",
                "The mongrels broke through. You were their meal.",
                "Scratching became breaking. Breaking became death."
            ],
            'marauders': [
                "Turns out they really needed that can of beans.",
                "They broke in. You were outnumbered. Outmatched.",
                "Trust was your downfall. They weren't here to help."
            ]
        };
    }

    show(cause, daysSurvived, location = null) {
        const deathScreen = document.getElementById('death-screen');
        const causeEl = document.getElementById('death-cause');
        const daysEl = document.getElementById('days-survived');
        const flavorEl = document.getElementById('death-flavor');
        const nameInput = document.getElementById('death-name-input');
        const nameContainer = document.getElementById('death-name-container');
        const continueBtn = document.getElementById('death-continue-btn');
        
        // Play death sound (negative/defeat sound)
        if (window.audioSystem) {
            window.audioSystem.stopMusic(); // Stop background music
            window.audioSystem.playSound('negative');
        }
        const skipBtn = document.getElementById('death-skip-btn');

        if (!deathScreen) return;

        // Determine death cause (for flavor text and tombstone)
        let deathCause = 'health';
        if (cause.includes('will to live') || cause.includes('morale') || cause.includes('gave up')) {
            deathCause = 'morale';
        } else if (cause.includes('starve') || cause.includes('hunger')) {
            deathCause = 'starvation';
        } else if (cause.includes('thirst') || cause.includes('dehydrat')) {
            deathCause = 'dehydration';
        } else if (cause.includes('sick') || cause.includes('fever')) {
            deathCause = 'sickness';
        } else if (cause.includes('mongrel')) {
            deathCause = 'mongrels';
        } else if (cause.includes('marauder')) {
            deathCause = 'marauders';
        }

        // Set cause text
        if (causeEl) {
            causeEl.textContent = `Cause: ${this.formatCause(cause)}`;
        }

        // Set days survived
        if (daysEl) {
            daysEl.textContent = `Days Survived: ${daysSurvived}`;
        }

        // Set flavor text
        if (flavorEl) {
            const messages = this.deathMessages[deathCause] || this.deathMessages['health'];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            flavorEl.textContent = `"${randomMessage}"`;
        }

        // Show defeated character image (replace Adam display)
        const deathImg = document.getElementById('death-character-img');
        if (deathImg) {
            const base = typeof window !== 'undefined' && window.location && window.location.href ? window.location.href.replace(/[^/]*$/, '') : '';
            const isFile = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
            deathImg.src = (isFile ? '' : base) + 'visuals/adam/defeated.PNG';
            deathImg.onerror = function () {
                this.onerror = null;
                this.src = (base || '') + 'VISUALS/adam/defeated.PNG';
            };
        }

        // Fade in death screen
        deathScreen.classList.remove('hidden');
        deathScreen.style.opacity = '0';
        if (window.TransitionSystem) {
            window.TransitionSystem.fadeIn(deathScreen, 1000);
        } else {
            deathScreen.style.opacity = '1';
        }

        // Show name input
        if (nameContainer) {
            nameContainer.classList.remove('hidden');
        }
        if (nameInput) {
            nameInput.value = '';
            nameInput.focus();
        }

        // Store death data for saving
        this.pendingDeath = {
            cause: this.formatCause(cause),
            daysSurvived: daysSurvived,
            location: location || { x: 640, y: 360 }
        };

        // Setup buttons
        this.setupButtons();
    }

    saveDeathMarker(playerName) {
        if (this.deathMarkerSystem && this.pendingDeath) {
            this.deathMarkerSystem.addDeathMarker(
                playerName,
                this.pendingDeath.daysSurvived,
                this.pendingDeath.cause,
                this.pendingDeath.location
            );
        }
    }

    formatCause(cause) {
        if (!cause || typeof cause !== 'string') return 'Injury or exhaustion';
        const c = cause.toLowerCase();
        if (c.includes('will to live') || c.includes('gave up') || c.includes('morale')) return 'Lost the will to live?';
        if (c.includes('injur')) return 'Physical Injury';
        if (c.includes('starv')) return 'Starvation';
        if (c.includes('thirst') || c.includes('dehydrat')) return 'Dehydration';
        if (c.includes('sick')) return 'Sickness';
        if (c.includes('mongrel')) return 'Mongrel Attack';
        if (c.includes('marauder')) return 'Marauder Attack';
        if (c.includes('fire')) return 'Fire';
        return cause;
    }

    setupButtons() {
        const restartBtn = document.getElementById('death-restart-btn');
        const menuBtn = document.getElementById('death-menu-btn');
        const continueBtn = document.getElementById('death-continue-btn');
        const skipBtn = document.getElementById('death-skip-btn');
        const nameInput = document.getElementById('death-name-input');

        // Helper function to save and proceed
        const saveAndProceed = (callback) => {
            const playerName = nameInput ? nameInput.value.trim() : '';
            this.saveDeathMarker(playerName || null);
            const nameContainer = document.getElementById('death-name-container');
            if (nameContainer) nameContainer.classList.add('hidden');
            this.hide();
            if (callback) callback();
        };

        if (continueBtn) {
            continueBtn.onclick = () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                saveAndProceed(() => {
                    if (window.returnToMenu) window.returnToMenu();
                });
            };
        }

        if (skipBtn) {
            skipBtn.onclick = () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                saveAndProceed(() => {
                    if (window.returnToMenu) window.returnToMenu();
                });
            };
        }

        if (restartBtn) {
            restartBtn.onclick = () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                saveAndProceed(() => {
                    if (window.restartGame) window.restartGame();
                });
            };
        }

        if (menuBtn) {
            menuBtn.onclick = () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                saveAndProceed(() => {
                    if (window.returnToMenu) window.returnToMenu();
                });
            };
        }

        // Enter key to continue
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && continueBtn) {
                    continueBtn.click();
                }
            });
        }
    }

    hide() {
        const deathScreen = document.getElementById('death-screen');
        if (deathScreen) {
            // Fade out death screen
            if (window.TransitionSystem) {
                window.TransitionSystem.fadeOut(deathScreen, 500, () => {
                    deathScreen.classList.add('hidden');
                });
            } else {
                deathScreen.classList.add('hidden');
            }
        }
    }
}
