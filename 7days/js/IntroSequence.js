// IntroSequence: emergency broadcast, news caster, rotating disaster stories by season/weather.

class IntroSequence {
    constructor() {
        this.tickerText = `[EMERGENCY BROADCAST SYSTEM] ... THIS IS NOT A DRILL ... MULTIPLE CONFIRMED IMPACTS ... EVACUATION ORDERS IN EFFECT FOR ALL MAJOR METROPOLITAN AREAS ... GOVERNMENT ADVISES IMMEDIATE SHELTER ... DO NOT ATTEMPT TO OUTRUN ... REPEAT: THIS IS NOT A DRILL ... CASUALTY REPORTS UNCONFIRMED ... POWER GRID EXPECTED TO FAIL WITHIN HOURS ... IF YOU ARE IN A BASEMENT, STAY THERE ... DO NOT OPEN DOORS FOR ANYONE ... SUPPLIES WILL BE DEPLOYED WHEN CONDITIONS PERMIT ... GOD BLESS AMERICA ... GOD HELP US ALL ... [STATIC] ... [BROADCAST INTERRUPTED] ... `;
        this.newsCasterOpen = null;
        this.newsCasterClosed = null;
        this.newsCasterFlashing = false;
        this.flashInterval = null;
        this.captionInterval = null;
        /** Seven rotating lower-third stories; keyed by season (from WeatherSystem). */
        this.disasterStoriesBySeason = {
            spring: [
                'Spring runoff overwhelms drainage—rivers crest through midnight; low areas are being evacuated.',
                'Saturated hillsides are sliding; road crews report mud blocking every major route out of the county.',
                'Agricultural chemicals from flooded fields may have entered the water table—boil orders are spreading.',
                'Dam operators are releasing spillway water; downstream neighborhoods are told to move to highest floor or basement.',
                'Tornado watches blanket the region; emergency managers say interior rooms and basements are the only safe bet.',
                'Power substations are flooding; utilities warn of long outages once pumps and switchyards go under.',
                'Shelter guidance: seal windows, stay below grade, and do not wade through moving water to reach a vehicle.'
            ],
            summer: [
                'A prolonged heat dome has buckled highways and strained hospitals; heat index advisories are in effect 24/7.',
                'Wildfire smoke is pooling in valleys—air quality is hazardous; keep windows sealed and limit exertion.',
                'The grid is shedding load; rolling blackouts may hit without warning as AC demand outpaces supply.',
                'Reservoirs are at record lows; municipal water may be rationed within days.',
                'Outdoor workers and the elderly are the first casualties—cooling centers are at capacity.',
                'Dry lightning has sparked new fronts; embers can travel miles ahead of the main fire line.',
                'Officials say basements stay cooler but bring water; dehydration kills faster than smoke in a sealed room.'
            ],
            fall: [
                'A powerful low is wrapping up the coast—gusts are snapping trees and tearing at roofs county-wide.',
                'Remnant moisture from the tropical system is parked overhead; flash flood warnings repeat every hour.',
                'Early hard frost after a wet harvest has left roads slick with black ice tonight.',
                'High wind has downed lines; assume every wire is live and every intersection is a blind corner.',
                'Schools and offices are closed indefinitely; travel is for emergency services only.',
                'Emergency stockpiles are being moved inland; coastal corridors are considered compromised.',
                'If you are sheltering in a basement, check vents for debris—carbon monoxide risk rises when generators fail.'
            ],
            winter: [
                'A polar outbreak has flash-frozen roads; ambulances are hours behind and warming centers are full.',
                'Ice accretion is collapsing power lines; crews cannot bucket up until winds drop below 35 mph.',
                'Water mains are bursting block by block; boil notices may not matter if pressure fails entirely.',
                'Snow load is stressing flat roofs; listen for creaking and stay clear of exterior doors under drifts.',
                'Wind chill is life-threatening within minutes; frostbite triage is overwhelming ERs.',
                'Fuel trucks cannot reach outlying towns; propane and kerosene are being prioritized for hospitals.',
                'Basement shelter is correct—stuff towels under doors, conserve heat in one room, and vent if using flames.'
            ]
        };
    }

    /** Human-readable weather line for the last rotating caption (uses first-day roll from WeatherSystem). */
    weatherForecastLine() {
        const ws = typeof window !== 'undefined' ? window.weatherSystem : null;
        if (!ws) return 'Stay tuned for hazardous conditions in your area.';
        const season = (ws.season || 'summer').toLowerCase();
        const w = (ws.currentWeather || 'sunny').toLowerCase();
        const labels = {
            rain: 'Heavy rain and localized flooding',
            overcast: 'Low gray skies and poor visibility',
            partly_cloudy: 'Broken clouds with shifting winds',
            sunny: 'Deceptively clear air—hazards remain',
            hot_dry: 'Dangerous heat and tinder-dry fuels',
            heat_wave: 'Extreme heat; grid and bodies under stress',
            snow: 'Steady snow reducing visibility and mobility',
            blizzard: 'Blizzard conditions; zero visibility possible',
            bitter_cold: 'Bitter cold; exposed skin freezes fast',
            clear_cold: 'Clear but deadly cold',
            freezing_rain: 'Freezing rain coating every surface',
            windy: 'Damaging winds; debris and power lines down',
            crisp_clear: 'Crisp air with biting wind chills',
            cold_snap: 'Sudden cold snap; pipes and people at risk',
            thunderstorm: 'Severe storms with damaging wind and lightning'
        };
        const bit = labels[w] || 'Hazardous conditions';
        const seasonLabel = season.charAt(0).toUpperCase() + season.slice(1);
        return `${seasonLabel} outlook — ${bit}. Shelter in place until the all-clear.`;
    }

    buildRotatingCaptions() {
        const ws = typeof window !== 'undefined' ? window.weatherSystem : null;
        const season = (ws && ws.season ? ws.season : 'summer').toLowerCase();
        const base = this.disasterStoriesBySeason[season] || this.disasterStoriesBySeason.summer;
        const stories = base.slice(0, 7);
        if (stories.length === 7) {
            stories[6] = this.weatherForecastLine();
        }
        return stories;
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
            skipBtn.textContent = 'Skip intro';
            skipBtn.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                self._skipRequested = true;
                if (typeof self.transitionToGameplay === 'function') {
                    self.transitionToGameplay();
                }
            };
        }
    }

    startCaptionRotation() {
        const capEl = document.getElementById('intro-story-caption');
        if (!capEl) return;
        this.stopCaptionRotation();
        const captions = this.buildRotatingCaptions();
        let idx = 0;
        capEl.textContent = captions[0] || '';
        this.captionInterval = setInterval(() => {
            idx = (idx + 1) % captions.length;
            capEl.textContent = captions[idx] || '';
        }, 5500);
    }

    stopCaptionRotation() {
        if (this.captionInterval) {
            clearInterval(this.captionInterval);
            this.captionInterval = null;
        }
    }

    loadNewsCasterImages() {
        this.newsCasterOpen = new Image();
        this.newsCasterOpen.src = 'VISUALS/news_open.png';
        this.newsCasterClosed = new Image();
        this.newsCasterClosed.src = 'VISUALS/news_closed.png';

        let casterEl = document.getElementById('news-caster');
        if (!casterEl) {
            casterEl = document.createElement('img');
            casterEl.id = 'news-caster';
            casterEl.style.position = 'absolute';
            casterEl.style.top = '8%';
            casterEl.style.left = '50%';
            casterEl.style.transform = 'translateX(-50%)';
            casterEl.style.width = 'min(85vw, 720px)';
            casterEl.style.maxHeight = '52vh';
            casterEl.style.objectFit = 'contain';
            const broadcast = document.getElementById('emergency-broadcast');
            if (broadcast) {
                broadcast.appendChild(casterEl);
            }
        }
    }

    startNewsCasterFlashing() {
        if (this.flashInterval) return;

        this.newsCasterFlashing = true;
        let isOpen = true;
        const casterEl = document.getElementById('news-caster');

        if (!casterEl) return;

        this.flashInterval = setInterval(() => {
            if (casterEl && this.newsCasterOpen && this.newsCasterClosed) {
                casterEl.src = isOpen ? this.newsCasterOpen.src : this.newsCasterClosed.src;
                isOpen = !isOpen;
            }
        }, 250);
    }

    stopNewsCasterFlashing() {
        if (this.flashInterval) {
            clearInterval(this.flashInterval);
            this.flashInterval = null;
        }
        this.newsCasterFlashing = false;

        const casterEl = document.getElementById('news-caster');
        if (casterEl && this.newsCasterClosed) {
            casterEl.src = this.newsCasterClosed.src;
        }
    }

    showEmergencyBroadcast() {
        const broadcast = document.getElementById('emergency-broadcast');
        const ticker = document.getElementById('ticker-text');
        const livingRoom = document.getElementById('living-room');

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

        if (ticker) {
            ticker.textContent = this.tickerText.repeat(3);
        }

        this.startNewsCasterFlashing();

        setTimeout(() => {
            this.stopNewsCasterFlashing();

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

        if (broadcast) broadcast.classList.add('hidden');

        if (livingRoom) {
            livingRoom.classList.remove('hidden');
            livingRoom.style.opacity = '0';
            if (window.TransitionSystem) {
                window.TransitionSystem.fadeIn(livingRoom, 1000);
            } else {
                livingRoom.style.opacity = '1';
            }
        }

        setTimeout(() => {
            this.showPowerOutage();
        }, 3000);
    }

    showPowerOutage() {
        const tvStatic = document.getElementById('tv-static');
        const livingRoom = document.getElementById('living-room');

        if (tvStatic) {
            tvStatic.textContent = '';
            tvStatic.style.background = '#000';
        }

        if (window.TransitionSystem) {
            window.TransitionSystem.fadeToBlack(null, 2000, () => {
                this.transitionToGameplay();
            });
        } else if (livingRoom) {
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

        if (this._skipRequested) {
            this._skipRequested = false;
            showLoadingAndStart();
            return;
        }

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
