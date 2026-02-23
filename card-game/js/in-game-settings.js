/**
 * =====================================================
 * FUM: SHATTERLAYERS - IN-GAME SETTINGS BUTTON
 * =====================================================
 * 
 * ⚙️ THE SETTINGS BUTTON: Because Options Are Good ⚙️
 * =====================================================
 * 
 * This creates a settings gear icon (⚙) in the top-right corner
 * during matches. It's always there, ready to help you adjust
 * audio settings, toggle features, or just look at options
 * when you're bored.
 * 
 * Features:
 * - Appears only during matches (not in menu)
 * - Top-right corner placement (classic settings button location)
 * - Opens the settings modal (the same one from the main menu)
 * - Hover effects (because interactive buttons are more fun)
 * 
 * NOVICE NOTE: This is a convenience feature. Instead of having
 * to quit to menu to change settings, you can do it mid-game.
 * It's like having a remote control, but for game settings!
 * 
 * =====================================================
 */

// =====================================================
// IN-GAME SETTINGS BUTTON
// =====================================================
function addInGameSettingsButton() {
    // Check if button already exists
    if (document.getElementById('in-game-settings-btn')) {
        return;
    }
    
    // Create settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'in-game-settings-btn';
    settingsBtn.className = 'in-game-settings-btn';
    settingsBtn.innerHTML = '⚙';
    settingsBtn.title = 'Settings';
    
    // Position in top-right corner
    settingsBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.7);
        border: 2px solid gold;
        color: gold;
        font-size: 24px;
        cursor: pointer;
        z-index: 9999;
        display: none;
        transition: all 0.3s ease;
    `;
    
    settingsBtn.addEventListener('mouseenter', () => {
        settingsBtn.style.background = 'rgba(255, 215, 0, 0.3)';
        settingsBtn.style.transform = 'scale(1.1)';
    });
    
    settingsBtn.addEventListener('mouseleave', () => {
        settingsBtn.style.background = 'rgba(0, 0, 0, 0.7)';
        settingsBtn.style.transform = 'scale(1)';
    });
    
    settingsBtn.addEventListener('click', () => {
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.classList.remove('hidden');
        }
    });
    
    document.body.appendChild(settingsBtn);
    
    // Show/hide based on game state
    const observer = new MutationObserver(() => {
        const gameContainer = document.getElementById('game-container');
        const mainMenu = document.getElementById('main-menu');
        
        if (gameContainer && gameContainer.style.display !== 'none' && 
            mainMenu && mainMenu.classList.contains('hidden')) {
            settingsBtn.style.display = 'block';
        } else {
            settingsBtn.style.display = 'none';
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
}

// Make globally available
if (typeof window !== 'undefined') {
    window.addInGameSettingsButton = addInGameSettingsButton;
}
