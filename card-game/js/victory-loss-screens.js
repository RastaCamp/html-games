/**
 * =====================================================
 * FUM: SHATTERLAYERS - VICTORY/LOSS SCREENS
 * =====================================================
 * 
 * 🎉 VICTORY! / 😢 DEFEAT! 🎉
 * =====================================================
 * 
 * This system handles the victory and loss screens that appear
 * when a game ends. It's like the credits of a movie, but
 * interactive and with buttons to play again or quit.
 * 
 * Features:
 * - Victory screen (when you win - the good one!)
 * - Loss screen (when you lose - the sad one)
 * - Functional buttons (REMATCH, RETURN TO MENU)
 * - Campaign mode uses its own screens (because campaign is special)
 * 
 * NOVICE NOTE: These screens are triggered automatically when
 * someone's HP reaches 0 or they get 4 attunements. It's like
 * the game saying "Hey, you won/lost! What do you want to do now?"
 * 
 * =====================================================
 */

// =====================================================
// VICTORY/LOSS SCREENS SYSTEM
// =====================================================
export const VictoryLossScreens = {
    
    /**
     * Show Victory Screen
     * =====================================================
     * NOVICE NOTE: Shows victory screen when player wins
     * 
     * @param {Object} gameInstance - Game instance
     * @param {number} winnerId - Winner player ID
     */
    showVictory: function(gameInstance, winnerId) {
        // Check if in campaign mode
        if (gameInstance.gameMode === 'campaign' && gameInstance.campaign) {
            // Campaign handles its own victory screen
            return;
        }
        
        // Standard victory screen
        const victoryHTML = `
            <div class="victory-screen-overlay">
                <div class="victory-screen-content">
                    <h1>VICTORY</h1>
                    <h2>Player ${winnerId} Wins!</h2>
                    <div class="victory-buttons">
                        <button class="btn-primary" id="victory-rematch">REMATCH</button>
                        <button class="btn-secondary" id="victory-menu">RETURN TO MENU</button>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.className = 'victory-screen-overlay';
        overlay.innerHTML = victoryHTML;
        document.body.appendChild(overlay);
        
        // Add event listeners
        document.getElementById('victory-rematch').addEventListener('click', () => {
            overlay.remove();
            // Restart same mode
            const mode = gameInstance.gameMode;
            const difficulty = gameInstance.ai ? gameInstance.ai.difficulty : 2;
            gameInstance.initialize(mode, difficulty);
        });
        
        document.getElementById('victory-menu').addEventListener('click', () => {
            overlay.remove();
            // Return to menu
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) gameContainer.style.display = 'none';
            
            const mainMenu = document.getElementById('main-menu');
            if (mainMenu) mainMenu.classList.remove('hidden');
            
            // Stop game music, start title music
            if (window.AudioManager) {
                window.AudioManager.stopMusic();
                window.AudioManager.playTitleMusic();
            }
        });
    },
    
    /**
     * Show Loss Screen
     * =====================================================
     * NOVICE NOTE: Shows loss screen when player loses
     * 
     * @param {Object} gameInstance - Game instance
     */
    showLoss: function(gameInstance) {
        // Check if in campaign mode
        if (gameInstance.gameMode === 'campaign' && gameInstance.campaign) {
            // Campaign handles its own loss screen
            return;
        }
        
        // Standard loss screen
        const lossHTML = `
            <div class="loss-screen-overlay">
                <div class="loss-screen-content">
                    <h1>DEFEAT</h1>
                    <p>You have been defeated.</p>
                    <div class="loss-buttons">
                        <button class="btn-primary" id="loss-rematch">REMATCH</button>
                        <button class="btn-secondary" id="loss-menu">RETURN TO MENU</button>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.className = 'loss-screen-overlay';
        overlay.innerHTML = lossHTML;
        document.body.appendChild(overlay);
        
        // Add event listeners
        document.getElementById('loss-rematch').addEventListener('click', () => {
            overlay.remove();
            // Restart same mode
            const mode = gameInstance.gameMode;
            const difficulty = gameInstance.ai ? gameInstance.ai.difficulty : 2;
            gameInstance.initialize(mode, difficulty);
        });
        
        document.getElementById('loss-menu').addEventListener('click', () => {
            overlay.remove();
            // Return to menu
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) gameContainer.classList.remove('game-active');
            
            const mainMenu = document.getElementById('main-menu');
            if (mainMenu) mainMenu.classList.remove('hidden');
            
            // Stop game music, start title music
            if (window.AudioManager) {
                window.AudioManager.stopMusic();
                window.AudioManager.playTitleMusic();
            }
        });
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.VictoryLossScreens = VictoryLossScreens;
}
