/**
 * =====================================================
 * FUM: SHATTERLAYERS - AUDIO MANAGER
 * =====================================================
 * 
 * Handles all game audio with correct file paths
 * =====================================================
 */

// =====================================================
// AUDIO MANAGER SYSTEM
// =====================================================
export const AudioManager = {
    
    // Sound file arrays - all from main sounds folder
    whooshSounds: [
        'bwoosh.mp3',
        'floom.mp3',
        'fwoop.mp3',
        'fwoosh.mp3',
        'sawoosh.mp3',
        'swash.mp3',
        'swing.mp3',
        'swip.mp3',
        'swish.mp3',
        'swoop.mp3',
        'swoosh.mp3',
        'woosh.mp3'
    ],
    
    deathSounds: [
        'fall.mp3',
        'punch.mp3',
        'male_grunt.mp3'
    ],
    
    gameTracks: [
        'cinematic_intro.mp3',
        'cinematic_opening.mp3'
    ],
    
    // Audio elements
    currentMusic: null,
    soundEffects: [],
    
    // Settings
    musicEnabled: true,
    sfxEnabled: true,
    volume: 0.7,
    
    // Initialize
    init: function() {
        this.loadSettings();
        // Don't auto-play title music - intro sequence will handle it
    },
    
    /**
     * Play random whoosh sound for card movement
     * =====================================================
     * NOVICE NOTE: Called when cards are dealt, played, or moved
     */
    playCardMovement: function() {
        if (!this.sfxEnabled) return;
        
        const randomIndex = Math.floor(Math.random() * this.whooshSounds.length);
        const soundFile = this.whooshSounds[randomIndex];
        this.playSound(soundFile);
    },
    
    /**
     * Play magic attack sound
     * =====================================================
     * NOVICE NOTE: Called during combat or ability triggers
     */
    playMagicAttack: function() {
        if (!this.sfxEnabled) return;
        this.playSound('magic_attack.mp3');
    },
    
    /**
     * Play random death sound
     * =====================================================
     * NOVICE NOTE: Called when cards are destroyed
     */
    playDeathSound: function() {
        if (!this.sfxEnabled) return;
        
        const randomIndex = Math.floor(Math.random() * this.deathSounds.length);
        const soundFile = this.deathSounds[randomIndex];
        this.playSound(soundFile);
    },
    
    /**
     * Generic play sound - ALL from main sounds folder
     * =====================================================
     * NOVICE NOTE: All sound effects are in /sounds/ folder
     */
    playSound: function(fileName) {
        try {
            const audio = new Audio('sounds/' + fileName);
            audio.volume = this.volume;
            audio.play().catch(e => {
                // Silently fail if audio can't play (user interaction required, etc.)
                if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                    console.log('Audio play failed:', e);
                }
            });
            
            this.soundEffects.push(audio);
            
            audio.onended = () => {
                const index = this.soundEffects.indexOf(audio);
                if (index > -1) this.soundEffects.splice(index, 1);
            };
        } catch (e) {
            if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                console.error('Error playing sound:', fileName, e);
            }
        }
    },
    
    /**
     * Play title music
     * =====================================================
     * NOVICE NOTE: Loops continuously on title screen
     */
    playTitleMusic: function() {
        if (!this.musicEnabled) return;
        
        this.stopMusic();
        
        try {
            this.currentMusic = new Audio('sounds/universfield-dark-mystery-intro-352303.mp3');
            this.currentMusic.volume = this.volume;
            this.currentMusic.loop = true;
            this.currentMusic.play().catch(e => {
                if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                    console.log('Title music play failed:', e);
                }
            });
        } catch (e) {
            if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                console.error('Error playing title music:', e);
            }
        }
    },
    
    /**
     * Start game music - from sounds folder
     * =====================================================
     * NOVICE NOTE: Randomly selects from available game tracks, plays next when current ends
     */
    playGameMusic: function() {
        if (!this.musicEnabled) return;
        
        // If no game tracks available, don't play anything
        if (this.gameTracks.length === 0) {
            return;
        }
        
        this.stopMusic();
        
        const randomIndex = Math.floor(Math.random() * this.gameTracks.length);
        const trackFile = this.gameTracks[randomIndex];
        
        try {
            this.currentMusic = new Audio('tracks/' + trackFile);
            this.currentMusic.volume = this.volume;
            this.currentMusic.loop = false;
            
            // Play next track when this one ends
            this.currentMusic.onended = () => {
                this.playGameMusic(); // Recursively play next random track
            };
            
            this.currentMusic.play().catch(e => {
                if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                    console.log('Game music play failed:', e);
                }
            });
        } catch (e) {
            if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
                console.error('Error playing game music:', e);
            }
        }
    },
    
    /**
     * Stop all music
     * =====================================================
     */
    stopMusic: function() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    },
    
    /**
     * Stop all sound effects
     * =====================================================
     */
    stopAllSounds: function() {
        this.soundEffects.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.soundEffects = [];
    },
    
    /**
     * Toggle music
     * =====================================================
     */
    toggleMusic: function(enabled) {
        this.musicEnabled = enabled;
        if (!enabled) {
            this.stopMusic();
        } else {
            // Restart appropriate music
            const gameContainer = document.getElementById('game-container');
            if (gameContainer && gameContainer.style.display !== 'none') {
                this.playGameMusic();
            } else {
                this.playTitleMusic();
            }
        }
        this.saveSettings();
    },
    
    /**
     * Toggle sound effects
     * =====================================================
     */
    toggleSFX: function(enabled) {
        this.sfxEnabled = enabled;
        if (!enabled) {
            this.stopAllSounds();
        }
        this.saveSettings();
    },
    
    /**
     * Set volume
     * =====================================================
     */
    setVolume: function(vol) {
        this.volume = Math.max(0, Math.min(1, vol)); // Clamp between 0 and 1
        if (this.currentMusic) {
            this.currentMusic.volume = this.volume;
        }
        this.saveSettings();
    },
    
    /**
     * Save settings to localStorage
     * =====================================================
     */
    saveSettings: function() {
        const settings = {
            musicEnabled: this.musicEnabled,
            sfxEnabled: this.sfxEnabled,
            volume: this.volume
        };
        localStorage.setItem('fumAudioSettings', JSON.stringify(settings));
    },
    
    /**
     * Load settings from localStorage
     * =====================================================
     */
    loadSettings: function() {
        const saved = localStorage.getItem('fumAudioSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.musicEnabled = settings.musicEnabled !== false; // Default true
                this.sfxEnabled = settings.sfxEnabled !== false; // Default true
                this.volume = settings.volume !== undefined ? settings.volume : 0.7;
            } catch (e) {
                console.error('Error loading audio settings:', e);
            }
        }
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.AudioManager = AudioManager;
}
