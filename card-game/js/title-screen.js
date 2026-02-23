/**
 * =====================================================
 * FUM: SHATTERLAYERS - TITLE SCREEN
 * =====================================================
 * 
 * 🎬 THE TITLE SCREEN: First Impressions Matter 🎬
 * =====================================================
 * 
 * This shows the title.png image for 3 seconds when the game
 * loads, then gracefully fades to the menu. It's like the
 * opening credits of a movie, but shorter and with less
 * scrolling text (unless you count the menu buttons).
 * 
 * Why 3 seconds? Because:
 * - 1 second = too fast, you'll miss it
 * - 5 seconds = too slow, you'll get bored
 * - 3 seconds = just right (like Goldilocks, but for game loading)
 * 
 * =====================================================
 */

// =====================================================
// TITLE SCREEN SYSTEM
// =====================================================
export const TitleScreen = {
    
    /**
     * Show Title Screen
     * =====================================================
     * NOVICE NOTE: Displays title.png for 3 seconds, then fades to menu
     * 
     * This function creates a full-screen overlay, shows the title image,
     * waits 3 seconds (because we're polite like that), then fades it out
     * and shows the menu. It's like a theatrical entrance, but for a game.
     */
    show: function() {
        // Start title music as soon as title appears
        if (typeof window !== 'undefined' && window.AudioManager && window.AudioManager.playTitleMusic) {
            window.AudioManager.playTitleMusic();
        }
        const titleScreen = document.createElement('div');
        titleScreen.id = 'title-screen';
        titleScreen.className = 'title-screen';
        titleScreen.innerHTML = `
            <img src="visuals/title.png" alt="Akasha: Shatterlayers" class="title-image"
                 onerror="this.style.display='none';var d=document.createElement('div');d.className='title-fallback';d.style.cssText='display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:3rem;font-weight:bold;color:#F1C40F;text-shadow:0 0 20px rgba(241,196,0,0.5);';d.textContent='Akasha: Shatterlayers';this.parentNode.appendChild(d);">
        `;
        document.body.appendChild(titleScreen);

        // Start invisible, then fade in (1s)
        titleScreen.style.opacity = '0';
        titleScreen.style.transition = 'opacity 1s ease-in';
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                titleScreen.style.opacity = '1';
            });
        });

        // After fade-in (1s) + hold (3s), fade out (1s), then show menu
        setTimeout(function() {
            titleScreen.style.transition = 'opacity 1s ease-out';
            titleScreen.style.opacity = '0';
            setTimeout(function() {
                if (titleScreen.parentNode) titleScreen.remove();
                TitleScreen.showMenu();
            }, 1000);
        }, 4000); // 1s fade-in + 3s hold, then start fade-out
    },
    
    /**
     * Show Menu
     * =====================================================
     * NOVICE NOTE: Fades in menu buttons at top of screen.
     * Starts title music on first user interaction (browsers block autoplay until then).
     */
    showMenu: function() {
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.style.opacity = '0';
            mainMenu.style.transition = 'opacity 1s ease-in';
            mainMenu.classList.remove('hidden');
            
            setTimeout(() => {
                mainMenu.style.opacity = '1';
            }, 100);
        }
        this.ensureTitleMusicOnFirstInteraction();
    },
    
    /**
     * Call whenever main menu is shown so title music starts on first user click/key.
     * Browsers block audio until there has been a user gesture.
     */
    ensureTitleMusicOnFirstInteraction: function() {
        if (window.__titleMusicStarted) return;
        function startOnFirstInteraction() {
            if (window.__titleMusicStarted) return;
            window.__titleMusicStarted = true;
            if (typeof window !== 'undefined' && window.AudioManager && window.AudioManager.playTitleMusic) {
                window.AudioManager.playTitleMusic();
            }
            document.removeEventListener('click', startOnFirstInteraction, true);
            document.removeEventListener('keydown', startOnFirstInteraction, true);
        }
        document.addEventListener('click', startOnFirstInteraction, true);
        document.addEventListener('keydown', startOnFirstInteraction, true);
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.TitleScreen = TitleScreen;
}
