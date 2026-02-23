/**
 * 7 DAYS... - ACHIEVEMENT SYSTEM
 * 
 * 🏆 WHAT IS THIS FILE?
 * This manages achievements! Do something cool? Get an achievement!
 * Achievements also give tips (in-game currency for hints).
 * 
 * 🎯 HOW ACHIEVEMENTS WORK:
 * - Defined in this.achievements object
 * - Checked by calling checkAchievement(id, game)
 * - When unlocked, shows notification and awards tips
 * - Persists across playthroughs (once earned, always earned)
 * 
 * 💡 WANT TO ADD AN ACHIEVEMENT?
 * 1. Add it to this.achievements object
 * 2. Call checkAchievement('your_achievement_id', game) when it happens
 * 3. Set tip reward (1-3 tips, depending on difficulty)
 * 4. Test it!
 * 
 * 🎨 ACHIEVEMENT TIPS:
 * - Make them funny! Players love humor.
 * - Make them challenging but achievable
 * - Give good tip rewards for hard achievements
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to check if already unlocked (don't give tips twice!)
 * - Not calling checkAchievement() when achievement happens
 * - Making achievements too easy/hard
 */

class AchievementSystem {
    constructor(tipJar = null) {
        this.tipJar = tipJar;
        this.achievements = {
            'plumbers_special': {
                name: "Plumber's Special",
                description: 'Drained water heater',
                unlocked: false
            },
            'macgyver': {
                name: 'MacGyver',
                description: 'Built first tool',
                unlocked: false
            },
            'circle_of_life': {
                name: 'Circle of Life',
                description: 'Used compost for sprouts',
                unlocked: false
            },
            'silent_but_deadly': {
                name: 'Silent But Deadly',
                description: 'Built methane generator',
                unlocked: false
            },
            'bunny_boiler': {
                name: 'Bunny Boiler',
                description: 'Caught rabbit',
                unlocked: false
            },
            'news_junkie': {
                name: 'News Junkie',
                description: 'Listened to radio 5 times',
                unlocked: false,
                progress: 0,
                target: 5
            },
            'survivor': {
                name: 'Survivor',
                description: 'Made it to Day 7',
                unlocked: false
            }
        };
    }

    checkAchievement(id, game) {
        if (!this.achievements[id] || this.achievements[id].unlocked) {
            return false;
        }

        const achievement = this.achievements[id];
        
        // Check progress-based achievements
        if (achievement.target) {
            achievement.progress = (achievement.progress || 0) + 1;
            if (achievement.progress < achievement.target) {
                return false;
            }
        }

        // Unlock achievement
        achievement.unlocked = true;
        this.showNotification(achievement.name);
        
        // Play achievement sound
        if (window.audioSystem) {
            window.audioSystem.playSound('correct');
        }
        
        // Award tip for first-time achievements
        if (this.tipJar) {
            const tipValue = this.tipJar.earnTip(id);
            if (tipValue > 0) {
                // Show tip earned notification
                setTimeout(() => {
                    const notification = document.getElementById('achievement-notification');
                    const nameEl = document.querySelector('.achievement-name');
                    if (notification && nameEl) {
                        nameEl.textContent = `+${tipValue} Tip Earned!`;
                        notification.classList.remove('hidden');
                        setTimeout(() => {
                            notification.classList.add('hidden');
                        }, 2000);
                    }
                }, 1000);
            }
        }
        
        return true;
    }

    showNotification(achievementName) {
        const notification = document.getElementById('achievement-notification');
        const nameEl = document.querySelector('.achievement-name');
        
        if (notification && nameEl) {
            nameEl.textContent = achievementName;
            notification.classList.remove('hidden');
            
            // Auto-hide after 4 seconds so it goes away reliably
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 4000);
        }
    }

    getState() {
        const state = {};
        for (const [id, achievement] of Object.entries(this.achievements)) {
            state[id] = {
                unlocked: achievement.unlocked,
                progress: achievement.progress || 0
            };
        }
        return state;
    }

    setState(state) {
        for (const [id, data] of Object.entries(state)) {
            if (this.achievements[id]) {
                this.achievements[id].unlocked = data.unlocked;
                this.achievements[id].progress = data.progress || 0;
            }
        }
    }
}
