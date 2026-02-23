/**
 * =====================================================
 * FUM: SHATTERLAYERS - PAUSE MENU
 * =====================================================
 * 
 * ⏸️ THE PAUSE MENU: Because Sometimes You Need a Break ⏸️
 * =====================================================
 * 
 * This is the pause menu system. You know, that thing that
 * pops up when you press ESC because you need to answer
 * the door, or your cat is on fire, or you just realized
 * you've been playing for 6 hours straight and should
 * probably eat something.
 * 
 * Features:
 * - Resume (get back to the action!)
 * - Restart (start over because you're losing)
 * - Settings (tweak audio and stuff)
 * - Quit (admit defeat and return to menu)
 * 
 * =====================================================
 */

// =====================================================
// PAUSE MENU SYSTEM
// =====================================================
export const PauseMenu = {
    
    isPaused: false,
    gameInstance: null,
    
    /**
     * Initialize
     * =====================================================
     * NOVICE NOTE: Sets up pause menu and ESC key listener
     * 
     * This function sets up the pause menu so it actually works.
     * Without this, pressing ESC would do nothing, and that would
     * be sad. We don't want sad players. 😢
     */
    init: function(gameInstance) {
        this.gameInstance = gameInstance;
        
        // Listen for ESC key (the universal "I need a break" button)
        document.addEventListener('keydown', (e) => {
            // Only pause if we're actually in a game (not in menu)
            if (e.key === 'Escape' && this.gameInstance && this.gameInstance.gameMode) {
                if (this.isPaused) {
                    this.resume(); // Already paused? Unpause!
                } else {
                    this.show(); // Not paused? Pause it!
                }
            }
        });
    },
    
    /**
     * Show Pause Menu
     * =====================================================
     * NOVICE NOTE: Displays pause menu overlay
     * 
     * This creates a fancy overlay that covers the screen
     * and gives you options. It's like a popup, but cooler
     * because it pauses time (well, the game at least).
     */
    show: function() {
        // Don't pause if already paused (that would be weird)
        if (this.isPaused) return;
        
        // Set the paused flag (so we know we're paused)
        this.isPaused = true;
        
        // Create pause menu overlay
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pause-menu';
        pauseMenu.className = 'pause-menu-overlay';
        pauseMenu.innerHTML = `
            <div class="pause-menu-content">
                <h2>PAUSED</h2>
                <button class="pause-menu-btn" id="pause-resume">▶ RESUME</button>
                <button class="pause-menu-btn" id="pause-restart">🔄 RESTART MATCH</button>
                <button class="pause-menu-btn" id="pause-settings">⚙ SETTINGS</button>
                <button class="pause-menu-btn" id="pause-quit">🏠 QUIT TO MENU</button>
            </div>
        `;
        
        document.body.appendChild(pauseMenu);
        
        // Add event listeners
        document.getElementById('pause-resume').addEventListener('click', () => {
            this.resume();
        });
        
        document.getElementById('pause-restart').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('pause-settings').addEventListener('click', () => {
            this.showSettings();
        });
        
        document.getElementById('pause-quit').addEventListener('click', () => {
            this.quit();
        });
    },
    
    /**
     * Resume Game
     * =====================================================
     * NOVICE NOTE: Closes pause menu and continues game
     */
    resume: function() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) {
            pauseMenu.remove();
        }
    },
    
    /**
     * Restart Match
     * =====================================================
     * NOVICE NOTE: Restarts current match
     */
    restart: function() {
        if (!this.gameInstance) return;
        
        if (confirm('Restart this match? Progress will be lost.')) {
            const mode = this.gameInstance.gameMode;
            const difficulty = this.gameInstance.ai ? this.gameInstance.ai.difficulty : 2;
            
            this.resume();
            this.gameInstance.initialize(mode, difficulty);
        }
    },
    
    /**
     * Show Settings
     * =====================================================
     * NOVICE NOTE: Opens settings modal
     */
    showSettings: function() {
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.classList.remove('hidden');
        }
    },
    
    /**
     * Quit to Menu
     * =====================================================
     * NOVICE NOTE: Returns to main menu with confirm dialog
     */
    quit: function() {
        // Helper: actually return to main menu (stop current display, show menu)
        var goToMainMenu = () => {
            this.resume();
            var gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.classList.remove('game-active');
                gameContainer.style.display = '';
            }
            var intro = document.getElementById('intro-sequence');
            if (intro && intro.parentNode) intro.remove();
            var storyModal = document.getElementById('story-modal-overlay');
            if (storyModal && storyModal.parentNode) storyModal.remove();
            var mainMenu = document.getElementById('main-menu');
            if (mainMenu) {
                mainMenu.classList.remove('hidden');
                mainMenu.style.opacity = '1';
            }
            if (window.AudioManager) {
                window.AudioManager.stopMusic();
                window.AudioManager.playTitleMusic();
            }
        };
        // Tutorial intro: go straight back to main menu (no confirm)
        if (document.getElementById('intro-sequence')) {
            if (typeof window.__tutorialBackToMenu === 'function') {
                this.resume();
                window.__tutorialBackToMenu();
            } else {
                goToMainMenu();
            }
            return;
        }
        // In-game: show confirm dialog
        const confirmDialog = document.createElement('div');
        confirmDialog.className = 'confirm-dialog-overlay';
        confirmDialog.innerHTML = `
            <div class="confirm-dialog">
                <h3>⚠ EXIT GAME?</h3>
                <p>Progress will be saved.</p>
                <p>Are you sure?</p>
                <div class="confirm-buttons">
                    <button class="btn-danger" id="confirm-yes">YES, QUIT</button>
                    <button class="btn-secondary" id="confirm-cancel">CANCEL</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmDialog);
        
        document.getElementById('confirm-yes').addEventListener('click', () => {
            if (this.gameInstance && this.gameInstance.gameMode === 'campaign' && 
                this.gameInstance.campaign) {
                this.gameInstance.campaign.saveProgress();
            }
            confirmDialog.remove();
            goToMainMenu();
        });
        
        document.getElementById('confirm-cancel').addEventListener('click', () => {
            confirmDialog.remove();
        });
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.PauseMenu = PauseMenu;
}
