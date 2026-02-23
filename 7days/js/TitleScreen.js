/**
 * 7 DAYS... - TITLE SCREEN
 * 
 * 🎬 WHAT IS THIS FILE?
 * This manages the main menu! New Game, Continue, Options, Credits, etc.
 * Also renders death markers on the title screen (spooky!).
 * 
 * 🎯 WHAT IT DOES:
 * - Shows/hides title screen
 * - Handles button clicks
 * - Renders death markers (skull icons)
 * - Updates tip jar and death count displays
 * - Manages options menu
 * 
 * 💡 WANT TO CHANGE TITLE SCREEN?
 * - Modify HTML in index.html
 * - Modify CSS in styles.css
 * - Add new buttons/features here
 * 
 * 🎨 TITLE SCREEN FEATURES:
 * - New Game button (starts fresh)
 * - Continue button (loads save, only shows if save exists)
 * - Options menu (volume, difficulty, game speed)
 * - Credits screen
 * - Death markers (skull icons showing where others died)
 * - Tip jar count
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to check if save exists (Continue button shows when it shouldn't)
 * - Not updating displays when data changes
 * - Death markers not rendering (check canvas setup)
 */

class TitleScreen {
    constructor(saveSystem, deathMarkerSystem, tipJar) {
        this.saveSystem = saveSystem;
        this.deathMarkerSystem = deathMarkerSystem;
        this.tipJar = tipJar;
        this.init();
    }

    init() {
        this.titleBasementImage = new Image();
        this.titleBasementImage.onload = () => this.renderDeathMarkers();
        this.titleBasementImage.onerror = function () { this.onerror = null; this.src = 'VISUALS/scenes/day_lights_off.png'; };
        this.titleBasementImage.src = 'visuals/scenes/day_lights_off.png';
        this.setupButtons();
        this.checkContinueButton();
    }

    show() {
        const titleScreen = document.getElementById('title-screen');
        const gameCanvas = document.getElementById('game-canvas');
        const uiOverlay = document.getElementById('ui-overlay');
        
        if (titleScreen) titleScreen.classList.remove('hidden');
        if (gameCanvas) gameCanvas.classList.add('hidden');
        if (uiOverlay) uiOverlay.classList.add('hidden');
        
        // Update stats
        this.updateStats();
        
        // Render death markers
        this.renderDeathMarkers();
    }

    updateStats() {
        const tipCount = document.getElementById('tip-count');
        const deathCount = document.getElementById('death-count');
        
        if (tipCount && this.tipJar) {
            tipCount.textContent = this.tipJar.getCurrentTips();
        }
        
        if (deathCount && this.deathMarkerSystem) {
            deathCount.textContent = this.deathMarkerSystem.getMarkerCount();
        }
    }

    renderDeathMarkers() {
        const canvas = document.getElementById('title-canvas');
        if (!canvas || !this.deathMarkerSystem) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const markers = this.deathMarkerSystem.getMarkers();
        const tooltip = document.getElementById('death-marker-tooltip');
        
        // Draw basement: use scene image if loaded, else simple outline
        if (this.titleBasementImage && this.titleBasementImage.complete && this.titleBasementImage.naturalWidth) {
            ctx.drawImage(this.titleBasementImage, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#3a3a3a';
            ctx.fillRect(200, 400, 80, 120);
            ctx.fillRect(400, 400, 100, 100);
            ctx.fillRect(600, 400, 80, 100);
        }
        
        // Draw death markers
        markers.forEach(marker => {
            const x = marker.location.x;
            const y = marker.location.y;
            
            // Draw skull emoji (using text)
            ctx.font = '48px Arial';
            ctx.fillText('💀', x - 24, y + 24);
        });
        
        // Handle mouse hover: convert to logical canvas coords so tooltip shows when over skull
        if (canvas && tooltip) {
            canvas.onmousemove = (e) => {
                const rect = canvas.getBoundingClientRect();
                const scaleX = (canvas.width || 1280) / rect.width;
                const scaleY = (canvas.height || 720) / rect.height;
                const mouseX = (e.clientX - rect.left) * scaleX;
                const mouseY = (e.clientY - rect.top) * scaleY;
                const hitRadius = 35;
                let hoveredMarker = null;
                for (const marker of markers) {
                    const x = marker.location.x;
                    const y = marker.location.y;
                    if (Math.abs(mouseX - x) < hitRadius && Math.abs(mouseY - y) < hitRadius) {
                        hoveredMarker = marker;
                        break;
                    }
                }
                
                if (hoveredMarker) {
                    tooltip.classList.remove('hidden');
                    tooltip.style.left = (e.clientX + 10) + 'px';
                    tooltip.style.top = (e.clientY + 10) + 'px';
                    const nameEl = document.getElementById('marker-name');
                    const dateEl = document.getElementById('marker-date');
                    const daysEl = document.getElementById('marker-days');
                    const causeEl = document.getElementById('marker-cause');
                    if (nameEl) nameEl.textContent = hoveredMarker.playerName;
                    if (dateEl) dateEl.textContent = hoveredMarker.realDate;
                    if (daysEl) daysEl.textContent = `Survived: ${hoveredMarker.daysSurvived} days`;
                    if (causeEl) causeEl.textContent = `Cause: ${hoveredMarker.cause}`;
                } else {
                    tooltip.classList.add('hidden');
                }
            };
            canvas.onmouseleave = () => {
                if (tooltip) tooltip.classList.add('hidden');
            };
        }
    }

    hide() {
        const titleScreen = document.getElementById('title-screen');
        if (titleScreen) titleScreen.classList.add('hidden');
    }

    setupButtons() {
        const newGameBtn = document.getElementById('new-game-btn');
        const continueBtn = document.getElementById('continue-btn');
        const optionsBtn = document.getElementById('options-btn');
        const creditsBtn = document.getElementById('credits-btn');
        const exitBtn = document.getElementById('exit-btn');

        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                this.onNewGame();
            });
        }

        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                this.onContinue();
            });
        }

        if (optionsBtn) {
            optionsBtn.addEventListener('click', () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                this.onOptions();
            });
        }

        if (creditsBtn) {
            creditsBtn.addEventListener('click', () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                this.onCredits();
            });
        }

        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                this.onExit();
            });
        }
    }

    checkContinueButton() {
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn && this.saveSystem.hasSave()) {
            continueBtn.classList.remove('hidden');
        } else if (continueBtn) {
            continueBtn.classList.add('hidden');
        }
    }

    onNewGame() {
        // Use global handler so inline onclick and addEventListener share one path
        if (window.doNewGame) {
            window.doNewGame();
            return;
        }
        const titleScreen = document.getElementById('title-screen');
        if (titleScreen && window.TransitionSystem) {
            window.TransitionSystem.fadeOut(titleScreen, 500, () => {
                this.hide();
                if (window.startIntroSequence) window.startIntroSequence();
            });
        } else {
            this.hide();
            if (window.startIntroSequence) window.startIntroSequence();
        }
    }

    onContinue() {
        // Fade out title screen, then load game
        const titleScreen = document.getElementById('title-screen');
        if (titleScreen && window.TransitionSystem) {
            window.TransitionSystem.fadeOut(titleScreen, 500, () => {
                this.hide();
                if (window.loadGameAndStart) {
                    window.loadGameAndStart();
                }
            });
        } else {
            this.hide();
            if (window.loadGameAndStart) {
                window.loadGameAndStart();
            }
        }
    }

    onOptions() {
        const optionsMenu = document.getElementById('options-menu');
        if (optionsMenu) {
            optionsMenu.classList.remove('hidden');
            this.setupOptions();
        }
    }

    onCredits() {
        const creditsScreen = document.getElementById('credits-screen');
        if (creditsScreen) {
            creditsScreen.classList.remove('hidden');
        }
    }

    onExit() {
        if (confirm('Are you sure you want to exit?')) {
            window.close();
        }
    }

    setupOptions() {
        const musicVolume = document.getElementById('music-volume');
        const sfxVolume = document.getElementById('sfx-volume');
        const textSpeed = document.getElementById('text-speed');
        const difficultySelect = document.getElementById('difficulty-select');
        const resetSaveBtn = document.getElementById('reset-save-btn');
        const optionsBackBtn = document.getElementById('options-back-btn');

        // Load saved settings
        const settings = this.loadSettings();
        if (musicVolume) {
            musicVolume.value = settings.musicVolume || 50;
            musicVolume.addEventListener('input', (e) => {
                document.getElementById('music-volume-value').textContent = e.target.value + '%';
                this.saveSettings({ musicVolume: parseInt(e.target.value) });
            });
            document.getElementById('music-volume-value').textContent = musicVolume.value + '%';
        }

        if (sfxVolume) {
            sfxVolume.value = settings.sfxVolume || 50;
            sfxVolume.addEventListener('input', (e) => {
                document.getElementById('sfx-volume-value').textContent = e.target.value + '%';
                this.saveSettings({ sfxVolume: parseInt(e.target.value) });
            });
            document.getElementById('sfx-volume-value').textContent = sfxVolume.value + '%';
        }

        if (textSpeed) {
            textSpeed.value = settings.textSpeed || 5;
            textSpeed.addEventListener('input', (e) => {
                document.getElementById('text-speed-value').textContent = e.target.value;
                this.saveSettings({ textSpeed: parseInt(e.target.value) });
            });
            document.getElementById('text-speed-value').textContent = textSpeed.value;
        }

        if (difficultySelect) {
            difficultySelect.value = settings.difficulty || 'normal';
            difficultySelect.addEventListener('change', (e) => {
                this.saveSettings({ difficulty: e.target.value });
            });
        }
        
        const gameSpeedSelect = document.getElementById('game-speed-select');
        if (gameSpeedSelect) {
            gameSpeedSelect.value = settings.gameSpeed || 'normal';
            gameSpeedSelect.addEventListener('change', (e) => {
                this.saveSettings({ gameSpeed: e.target.value });
                // Apply to day cycle if game is running
                if (window.game && window.game.dayCycle) {
                    window.game.dayCycle.setGameSpeed(e.target.value);
                }
            });
        }

        const clearDeathMarkersBtn = document.getElementById('clear-death-markers-btn');
        const resetTipJarBtn = document.getElementById('reset-tip-jar-btn');
        const factoryResetBtn = document.getElementById('factory-reset-btn');

        if (clearDeathMarkersBtn && this.deathMarkerSystem) {
            clearDeathMarkersBtn.addEventListener('click', () => {
                if (confirm('Clear all death markers? This cannot be undone.')) {
                    this.deathMarkerSystem.clearMarkers();
                    alert('Death markers cleared!');
                    this.renderDeathMarkers();
                    this.updateStats();
                }
            });
        }

        if (resetTipJarBtn && this.tipJar) {
            resetTipJarBtn.addEventListener('click', () => {
                if (confirm('Reset tip jar to 0? This cannot be undone.')) {
                    this.tipJar.reset();
                    alert('Tip jar reset!');
                    this.updateStats();
                }
            });
        }

        if (factoryResetBtn) {
            factoryResetBtn.addEventListener('click', () => {
                if (confirm('FACTORY RESET: Clear everything (death markers, tips, saves)? This cannot be undone!')) {
                    // Clear everything
                    if (this.deathMarkerSystem) this.deathMarkerSystem.clearMarkers();
                    if (this.tipJar) this.tipJar.reset();
                    this.saveSystem.deleteSave();
                    localStorage.removeItem('7days_settings');
                    localStorage.removeItem('7days_survivor_counter');
                    alert('Factory reset complete!');
                    this.checkContinueButton();
                    this.updateStats();
                    this.renderDeathMarkers();
                }
            });
        }

        if (resetSaveBtn) {
            resetSaveBtn.addEventListener('click', () => {
                if (confirm('This will delete all save data. Are you sure?')) {
                    this.saveSystem.deleteSave();
                    localStorage.removeItem('7days_settings');
                    alert('Save data reset!');
                    this.checkContinueButton();
                }
            });
        }

        if (optionsBackBtn) {
            optionsBackBtn.addEventListener('click', () => {
                const optionsMenu = document.getElementById('options-menu');
                if (optionsMenu) optionsMenu.classList.add('hidden');
            });
        }
        const quitToMenuBtn = document.getElementById('options-quit-to-menu-btn');
        if (quitToMenuBtn) {
            quitToMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const optionsMenu = document.getElementById('options-menu');
                if (optionsMenu) optionsMenu.classList.add('hidden');
                if (window.doQuitToMenu) window.doQuitToMenu();
            });
        }
    }

    loadSettings() {
        try {
            const settings = localStorage.getItem('7days_settings');
            return settings ? JSON.parse(settings) : {};
        } catch (e) {
            return {};
        }
    }

    saveSettings(updates) {
        try {
            const current = this.loadSettings();
            const updated = { ...current, ...updates };
            localStorage.setItem('7days_settings', JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }
}
