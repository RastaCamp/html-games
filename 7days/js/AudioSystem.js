/**
 * 7 DAYS... - AUDIO SYSTEM
 * 
 * 🔊 WHAT IS THIS FILE?
 * Manages all game sounds and music. Plays appropriate audio for actions,
 * events, UI interactions, and background music.
 * 
 * 🎯 SOUND FILES:
 * - click.mp3: UI button clicks
 * - correct.mp3: Success/achievement unlocked
 * - negative.mp3: Failure/bad outcome
 * - no.mp3: Invalid action/denied
 * - danger.mp3: Warning (low health, mongrels nearby, etc.)
 * - enemy_battle.mp3: Combat music
 * - open_loot_box.mp3: Opening containers
 * - positive_advance.mp3: Morale boost/progress
 * - proceed.mp3: Confirmation/continue
 * - survived_day.mp3: End of day celebration
 * - survived_end.mp3: Game completion victory
 * - time_thinking.mp3: Timer/suspense (minigames)
 * - locked_immovable.mp3: Blocked action
 * - crunk_track.mp3 / crunks_track.mp3: Background music
 * 
 * 💡 HOW TO USE:
 * - Call AudioSystem.playSound('click') for UI clicks
 * - Call AudioSystem.playMusic('crunk_track') for background music
 * - Volume controlled via settings
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to preload sounds (causes delay)
 * - Playing too many sounds at once (overwhelming)
 * - Not checking if audio is enabled
 */

class AudioSystem {
    constructor() {
        this.sounds = {}; // Cache of loaded Audio objects
        this.music = null; // Current background music
        this.musicVolume = 0.3; // Background music volume (30%)
        this.sfxVolume = 0.7; // Sound effects volume (70%)
        this.enabled = true; // Master audio toggle
        this.musicEnabled = true; // Music toggle
        this.sfxEnabled = true; // SFX toggle
        
        // Sound file mappings
        this.soundFiles = {
            // UI Sounds
            'click': 'sounds/click.mp3',
            'proceed': 'sounds/proceed.mp3',
            'locked': 'sounds/locked_immovable.mp3',
            
            // Success/Failure
            'correct': 'sounds/correct.mp3',
            'positive': 'sounds/positive_advance.mp3',
            'negative': 'sounds/negative.mp3',
            'no': 'sounds/no.mp3',
            
            // Game Events
            'danger': 'sounds/danger.mp3',
            'open_loot': 'sounds/open_loot_box.mp3',
            'survived_day': 'sounds/survived_day.mp3',
            'survived_end': 'sounds/survived_end.mp3',
            'time_thinking': 'sounds/timer_thinking.mp3', // Fixed: actual file is timer_thinking.mp3
            
            // Combat
            'enemy_battle': 'sounds/enemy_battle.mp3',
            
            // Background Music
            'crunk_track': 'sounds/crunk_track.mp3',
            'crunks_track': 'sounds/crunks_track.mp3'
        };
        
        // Preload sounds
        this.preloadSounds();
    }

    preloadSounds() {
        // 🔊 PRELOAD SOUNDS: Load all sound files into cache
        for (const [key, path] of Object.entries(this.soundFiles)) {
            const audio = new Audio(path);
            audio.preload = 'auto';
            audio.volume = this.sfxVolume;
            this.sounds[key] = audio;
        }
    }

    playSound(soundName, volume = null) {
        // 🔊 PLAY SOUND: Play a sound effect
        if (!this.enabled || !this.sfxEnabled) return;
        
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`Sound not found: ${soundName}`);
            return;
        }
        
        // Clone audio to allow overlapping sounds
        const audioClone = sound.cloneNode();
        if (volume !== null) {
            audioClone.volume = volume;
        } else {
            audioClone.volume = this.sfxVolume;
        }
        
        audioClone.play().catch(e => {
            // Audio play failed (user interaction required, autoplay blocked, etc.)
            // Silently fail - not critical
        });
    }

    /** Keys that contain "track" are the only in-game rotating music tracks */
    getMusicTrackKeys() {
        return Object.keys(this.soundFiles).filter(k => k.toLowerCase().includes('track'));
    }

    /** Play a random music track (only keys with "track" in the name) */
    playRandomTrack(loop = true) {
        const trackKeys = this.getMusicTrackKeys();
        if (trackKeys.length === 0) {
            this.playMusic('crunk_track', loop);
            return;
        }
        const key = trackKeys[Math.floor(Math.random() * trackKeys.length)];
        this.playMusic(key, loop);
    }

    playMusic(musicName, loop = true) {
        // 🎵 PLAY MUSIC: Play background music
        if (!this.enabled || !this.musicEnabled) return;
        
        // Stop current music
        this.stopMusic();
        
        const music = this.sounds[musicName];
        if (!music) {
            console.warn(`Music not found: ${musicName}`);
            return;
        }
        
        this.music = music.cloneNode();
        this.music.loop = loop;
        this.music.volume = this.musicVolume;
        this.music.play().catch(e => {
            // Audio play failed
        });
    }

    stopMusic() {
        // 🛑 STOP MUSIC: Stop current background music
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
            this.music = null;
        }
    }

    setVolume(sfxVolume, musicVolume) {
        // 🔊 SET VOLUME: Adjust volume levels
        this.sfxVolume = Math.max(0, Math.min(1, sfxVolume));
        this.musicVolume = Math.max(0, Math.min(1, musicVolume));
        
        // Update current music volume
        if (this.music) {
            this.music.volume = this.musicVolume;
        }
        
        // Update all cached sounds
        for (const sound of Object.values(this.sounds)) {
            sound.volume = this.sfxVolume;
        }
    }

    setEnabled(enabled) {
        // 🔊 SET ENABLED: Master audio toggle
        this.enabled = enabled;
        if (!enabled) {
            this.stopMusic();
        }
    }

    setMusicEnabled(enabled) {
        // 🎵 SET MUSIC ENABLED: Music toggle
        this.musicEnabled = enabled;
        if (!enabled) {
            this.stopMusic();
        }
    }

    setSfxEnabled(enabled) {
        // 🔊 SET SFX ENABLED: Sound effects toggle
        this.sfxEnabled = enabled;
    }
}

// Create global audio system instance
window.audioSystem = new AudioSystem();
