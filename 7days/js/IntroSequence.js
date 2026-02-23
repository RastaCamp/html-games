// IntroSequence: Setting the mood (of impending doom)! 🚨
// This class handles the game's opening cinematic: the emergency broadcast,
// the power outage, and the transition into the grim reality of the basement.
//
// 📝 HOW TO TWEAK THE INTRO:
// 1. `this.tickerText`: Change the scrolling news ticker message.
//    Make it more ominous, more absurd, or more hopeful!
// 2. `showEmergencyBroadcast()` / `showLivingRoom()`: Adjust timings (`setTimeout`)
//    or visual effects for each part of the intro.
// 3. `transitionToGameplay()`: Customize the final fade to black before the game starts.
//
// 🔥 PRO TIP: The intro sets the tone. Make it memorable!
// 🐛 COMMON MISTAKE: Timings being off, causing elements to appear/disappear too quickly or slowly.
//
class IntroSequence {
    constructor() {
        this.tickerText = `[EMERGENCY BROADCAST SYSTEM] ... THIS IS NOT A DRILL ... MULTIPLE CONFIRMED IMPACTS ... EVACUATION ORDERS IN EFFECT FOR ALL MAJOR METROPOLITAN AREAS ... GOVERNMENT ADVISES IMMEDIATE SHELTER ... DO NOT ATTEMPT TO OUTRUN ... REPEAT: THIS IS NOT A DRILL ... CASUALTY REPORTS UNCONFIRMED ... POWER GRID EXPECTED TO FAIL WITHIN HOURS ... IF YOU ARE IN A BASEMENT, STAY THERE ... DO NOT OPEN DOORS FOR ANYONE ... SUPPLIES WILL BE DEPLOYED WHEN CONDITIONS PERMIT ... GOD BLESS AMERICA ... GOD HELP US ALL ... [STATIC] ... [BROADCAST INTERRUPTED] ... `;
        this.newsCasterOpen = null;
        this.newsCasterClosed = null;
        this.newsCasterFlashing = false;
        this.flashInterval = null;
        this.captionInterval = null;
        this.disasterCaptions = [
            'Disaster strikes. Authorities say stay inside until further notice.',
            'Emergency declared. Shelter in place. Stay in the lowest level of your home.',
            'Chemical spill nearby. Close windows. Stay in basement until all-clear.',
            'Power grid failure. Remain indoors. Do not travel.',
            'Outbreak declared. Quarantine in place. Stay home until further notice.',
            'Rioting in the streets. Lock doors. Stay in basement.',
            'Nuclear alert. Seek shelter below ground. Stay there.',
            'Regional emergency. Move to basement or lowest level. Stay put.',
            'Civil unrest. Lock doors. Stay in basement until further notice.'
        ];
    }

    start() {
        const introScreen = document.getElementById('intro-screen');
        if (!introScreen) return;

        introScreen.classList.remove('hidden');
        this.loadNewsCasterImages();
        this.showEmergencyBroadcast();
        this.startCaptionRotation();
        const self = this;
        const skipBtn = document.getElementById('skip-intro-btn');
        if (skipBtn) {
            skipBtn.textContent = 'Skip';
            skipBtn.addEventListener('mousedown', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self._skipRequested = true;
                if (typeof self.transitionToGameplay === 'function') {
                    self.transitionToGameplay();
                }
            }, true);
            skipBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self._skipRequested = true;
                if (typeof self.transitionToGameplay === 'function') {
                    self.transitionToGameplay();
                }
            }, true);
        }
    }

    startCaptionRotation() {
        const capEl = document.getElementById('intro-caption');
        if (!capEl) return;
        let idx = 0;
        capEl.textContent = this.disasterCaptions[0];
        this.captionInterval = setInterval(() => {
            idx = (idx + 1) % this.disasterCaptions.length;
            capEl.textContent = this.disasterCaptions[idx];
        }, 6000);
    }

    stopCaptionRotation() {
        if (this.captionInterval) {
            clearInterval(this.captionInterval);
            this.captionInterval = null;
        }
    }

    loadNewsCasterImages() {
        // 🎬 LOAD NEWS CASTER IMAGES: Preload the two talking frames
        // These images flash back and forth to create a talking animation
        this.newsCasterOpen = new Image();
        this.newsCasterOpen.src = 'VISUALS/news_open.png';
        this.newsCasterClosed = new Image();
        this.newsCasterClosed.src = 'VISUALS/news_closed.png';
        
        // Set up image elements in DOM if they don't exist
        let casterEl = document.getElementById('news-caster');
        if (!casterEl) {
            casterEl = document.createElement('img');
            casterEl.id = 'news-caster';
            casterEl.style.position = 'absolute';
            casterEl.style.top = '10%';
            casterEl.style.left = '50%';
            casterEl.style.transform = 'translateX(-50%)';
            casterEl.style.width = '60%';
            casterEl.style.maxHeight = '70%';
            casterEl.style.objectFit = 'contain';
            const broadcast = document.getElementById('emergency-broadcast');
            if (broadcast) {
                broadcast.appendChild(casterEl);
            }
        }
    }

    startNewsCasterFlashing() {
        // 🎬 FLASH NEWS CASTER: Alternate between open and closed mouth
        // Creates a simple talking animation (every 200-300ms)
        if (this.flashInterval) return; // Already flashing
        
        this.newsCasterFlashing = true;
        let isOpen = true;
        const casterEl = document.getElementById('news-caster');
        
        if (!casterEl) return;
        
        this.flashInterval = setInterval(() => {
            if (casterEl && this.newsCasterOpen && this.newsCasterClosed) {
                casterEl.src = isOpen ? this.newsCasterOpen.src : this.newsCasterClosed.src;
                isOpen = !isOpen;
            }
        }, 250); // Switch every 250ms (natural speaking pace)
    }

    stopNewsCasterFlashing() {
        // 🛑 STOP FLASHING: Freeze on closed mouth
        if (this.flashInterval) {
            clearInterval(this.flashInterval);
            this.flashInterval = null;
        }
        this.newsCasterFlashing = false;
        
        const casterEl = document.getElementById('news-caster');
        if (casterEl && this.newsCasterClosed) {
            casterEl.src = this.newsCasterClosed.src; // Freeze on closed mouth
        }
    }

    showEmergencyBroadcast() {
        const broadcast = document.getElementById('emergency-broadcast');
        const ticker = document.getElementById('ticker-text');
        const livingRoom = document.getElementById('living-room');

        // Fade in broadcast screen
        if (broadcast) {
            broadcast.classList.remove('hidden');
            broadcast.style.opacity = '0';
            if (window.TransitionSystem) {
                window.TransitionSystem.fadeIn(broadcast, 1000);
            } else {
                broadcast.style.opacity = '1';
            }
        }
        if (livingRoom) livingRoom.classList.add('hidden');

        // Set ticker text
        if (ticker) {
            ticker.textContent = this.tickerText.repeat(3); // Repeat for continuous scroll
        }

        // Start news caster flashing animation
        this.startNewsCasterFlashing();

        // Show broadcast for 15 seconds
        setTimeout(() => {
            // Stop flashing, freeze on closed mouth
            this.stopNewsCasterFlashing();
            
            // Fade out broadcast, then show living room
            if (broadcast && window.TransitionSystem) {
                window.TransitionSystem.fadeOut(broadcast, 1000, () => {
                    this.showLivingRoom();
                });
            } else {
                setTimeout(() => {
                    this.showLivingRoom();
                }, 1000);
            }
        }, 15000);
    }

    showLivingRoom() {
        const broadcast = document.getElementById('emergency-broadcast');
        const livingRoom = document.getElementById('living-room');
        const tvStatic = document.getElementById('tv-static');

        if (broadcast) broadcast.classList.add('hidden');
        
        // Fade in living room
        if (livingRoom) {
            livingRoom.classList.remove('hidden');
            livingRoom.style.opacity = '0';
            if (window.TransitionSystem) {
                window.TransitionSystem.fadeIn(livingRoom, 1000);
            } else {
                livingRoom.style.opacity = '1';
            }
        }

        // Show TV static for 3 seconds
        setTimeout(() => {
            this.showPowerOutage();
        }, 3000);
    }

    showPowerOutage() {
        const tvStatic = document.getElementById('tv-static');
        const livingRoom = document.getElementById('living-room');

        // Flicker TV (static effect)
        if (tvStatic) {
            tvStatic.textContent = '';
            tvStatic.style.background = '#000';
        }

        // Fade to black (power outage effect)
        if (window.TransitionSystem) {
            window.TransitionSystem.fadeToBlack(null, 2000, () => {
                this.transitionToGameplay();
            });
        } else if (livingRoom) {
            // Fallback: simple fade
            livingRoom.style.transition = 'opacity 2s';
            livingRoom.style.opacity = '0';
            setTimeout(() => {
                this.transitionToGameplay();
            }, 2000);
        } else {
            setTimeout(() => {
                this.transitionToGameplay();
            }, 2000);
        }
    }

    transitionToGameplay() {
        this.stopNewsCasterFlashing();
        this.stopCaptionRotation();
        const introScreen = document.getElementById('intro-screen');
        const loadingScreen = document.getElementById('loading-screen');

        const showLoadingAndStart = () => {
            if (introScreen) introScreen.classList.add('hidden');
            if (loadingScreen) loadingScreen.classList.remove('hidden');
            if (window.startGameplay) {
                window.startGameplay();
            }
        };

        // When called from Skip: instant transition (no fade) so click always works
        if (this._skipRequested) {
            this._skipRequested = false;
            showLoadingAndStart();
            return;
        }

        // Normal intro path: fade from black then show loading and start
        if (window.TransitionSystem) {
            window.TransitionSystem.fadeFromBlack(null, 1500, () => {
                if (introScreen) introScreen.classList.add('hidden');
                if (loadingScreen) loadingScreen.classList.remove('hidden');
                if (window.startGameplay) {
                    window.startGameplay();
                }
            });
        } else {
            if (introScreen) introScreen.classList.add('hidden');
            if (loadingScreen) loadingScreen.classList.remove('hidden');
            if (window.startGameplay) {
                window.startGameplay();
            }
        }
    }
}
