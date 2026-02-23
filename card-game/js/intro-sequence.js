/**
 * =====================================================
 * FUM: SHATTERLAYERS - INTRO SEQUENCE
 * =====================================================
 * 
 * Star Wars-style opening crawl
 * =====================================================
 */

// =====================================================
// INTRO SEQUENCE SYSTEM
// =====================================================
export const IntroSequence = {
    
    // Intro text - split into paragraphs for crawl
    crawlText: [
        "CHAPTER I",
        "THE AWAKENING",
        "",
        "It is a time of dimensional collapse.",
        "The six layers of reality are fracturing,",
        "and chaos spreads across all worlds.",
        "",
        "You are a LAYER WALKER — one of the rare",
        "few who can perceive and shift between",
        "the planes of existence.",
        "",
        "The SOURCE, the origin point of all layers,",
        "has sent out a call across dimensions.",
        "A corruption threatens to unravel everything.",
        "",
        "Nine realms hang in the balance.",
        "Nine guardians have fallen to the blight.",
        "One truth awaits at the center of it all.",
        "",
        "Your journey begins in the PHYSICAL LAYER,",
        "the world you know. But soon, you will",
        "walk through EMOTIONAL realms, FRACTAL",
        "dimensions, and the sacred ARCHETYPAL plane.",
        "",
        "Some say the CONCEPTUAL layer bends reality",
        "itself. Few have reached the SOURCE and",
        "returned to tell of it.",
        "",
        "The layers are calling, Walker.",
        "Will you answer?"
    ],
    
    /**
     * Show story as a modal overlay on top of the game board (no black screen).
     * Close button inside the modal dismisses it.
     */
    showStoryModal: function() {
        var self = this;
        var storyHtml = '';
        this.crawlText.forEach(function(line) {
            if (line === 'CHAPTER I' || line === 'THE AWAKENING') {
                storyHtml += '<h2 class="story-modal-h2">' + line + '</h2>';
            } else if (line === '') {
                storyHtml += '<br>';
            } else {
                storyHtml += '<p class="story-modal-p">' + line + '</p>';
            }
        });
        var modal = document.createElement('div');
        modal.id = 'story-modal-overlay';
        modal.className = 'story-modal-overlay';
        modal.innerHTML = '<div class="story-modal-box">' +
            '<div class="story-modal-content">' + storyHtml + '</div>' +
            '<button type="button" class="btn-primary story-modal-close" id="story-modal-close-btn">Close</button>' +
            '</div>';
        document.body.appendChild(modal);
        function closeModal() {
            if (modal.parentNode) modal.remove();
            setTimeout(function() {
                if (self.startTutorial) self.startTutorial();
            }, 100);
        }
        modal.querySelector('#story-modal-close-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    },
    
    // Current step in sequence
    currentStep: 0,
    started: false,
    _timeouts: [],
    
    // Initialize
    init: function() {
        this._timeouts = [];
        // Create intro HTML structure
        var self = this;
        window.skipTutorialStory = function() {
            self._clearTimeouts();
            if (self.currentStep === 1) self.runStep(2);
            else if (self.currentStep === 2) self.runStep(3);
        };
        this.createIntroHTML();
        
        // Show logo screen
        this.showLogoScreen();
        
        // Listen for key press or click
        document.addEventListener('keydown', this.startSequence.bind(this), { once: true });
        document.addEventListener('click', this.startSequence.bind(this), { once: true });
    },
    
    _clearTimeouts: function() {
        this._timeouts.forEach(function(id) { clearTimeout(id); });
        this._timeouts = [];
    },
    
    _setTimeout: function(fn, ms) {
        var self = this;
        var id = setTimeout(function() {
            self._timeouts = self._timeouts.filter(function(i) { return i !== id; });
            fn();
        }, ms);
        this._timeouts.push(id);
        return id;
    },
    
    // Create intro HTML; append to end of body so it is on top of everything
    createIntroHTML: function() {
        const introHTML = `
            <div id="intro-sequence" class="intro-sequence">
                <div id="intro-crawl" class="intro-screen intro-crawl-animated">
                    <div class="crawl-container">
                        <div class="crawl-content"></div>
                    </div>
                    <a href="#" id="intro-skip-crawl-btn" class="intro-skip-bar" role="button">Skip story &rarr;</a>
                </div>
                <div id="intro-quote" class="intro-screen hidden">
                    <p class="quote-text">"The layers choose who they will."</p>
                    <p class="quote-author">— Ancient Proverb</p>
                </div>
            </div>
        `;
        
        // Append inside game-container so header stays on top and game board is hidden
        const wrap = document.createElement('div');
        wrap.innerHTML = introHTML.trim();
        const introEl = wrap.firstElementChild;
        var gc = document.getElementById('game-container');
        if (introEl && gc) {
            gc.appendChild(introEl);
        } else if (introEl) {
            document.body.appendChild(introEl);
        }
    },
    
    // Show logo and wait for input
    showLogoScreen: function() {
        const logo = document.getElementById('intro-logo');
        const farAway = document.getElementById('intro-far-away');
        const crawl = document.getElementById('intro-crawl');
        const quote = document.getElementById('intro-quote');
        
        if (logo) logo.classList.remove('hidden');
        if (farAway) farAway.classList.add('hidden');
        if (crawl) crawl.classList.add('hidden');
        if (quote) quote.classList.add('hidden');
    },
    
    // Start the full sequence
    startSequence: function() {
        if (this.started) return;
        this.started = true;
        
        // Remove listeners
        document.removeEventListener('keydown', this.startSequence);
        document.removeEventListener('click', this.startSequence);
        
        // Title music already playing from title screen; keep it until transitionToGame
        
        // Begin step-by-step
        this.runStep(1);
    },
    
    // Run each step in sequence
    runStep: function(step) {
        this.currentStep = step;
        var self = this;
        
        switch(step) {
            case 1:
                // Show "A long time ago..." (used if sequence started from step 1)
                const farAway = document.getElementById('intro-far-away');
                if (farAway) farAway.classList.remove('hidden');
                requestAnimationFrame(function() { if (farAway) farAway.offsetHeight; });
                
                var skipFar = farAway && farAway.querySelector('.intro-skip-btn');
                if (skipFar) {
                    skipFar.onclick = function() { if (window.skipTutorialStory) window.skipTutorialStory(); };
                }
                // Wait 3 seconds, then next step (or skip)
                this._setTimeout(() => this.runStep(2), 3000);
                break;
                
            case 2:
                // Hide far away, show crawl
                const farAwayEl = document.getElementById('intro-far-away');
                const crawlEl = document.getElementById('intro-crawl');
                
                if (farAwayEl) farAwayEl.classList.add('hidden');
                if (crawlEl) crawlEl.classList.remove('hidden');
                requestAnimationFrame(function() { if (crawlEl) crawlEl.offsetHeight; });
                
                // Build crawl content
                this.buildCrawl();
                
                var skipCrawl = crawlEl && crawlEl.querySelector('.intro-skip-btn');
                if (skipCrawl) {
                    skipCrawl.onclick = function() { if (window.skipTutorialStory) window.skipTutorialStory(); };
                    skipCrawl.style.position = 'fixed';
                    skipCrawl.style.bottom = '2rem';
                    skipCrawl.style.left = '50%';
                    skipCrawl.style.transform = 'translateX(-50%)';
                    skipCrawl.style.zIndex = '10010';
                }
                // Crawl lasts 20 seconds; user can click "Skip story"
                this._setTimeout(() => this.runStep(3), 20000);
                break;
                
            case 3:
                // Hide crawl, show quote, then game
                const crawlEl2 = document.getElementById('intro-crawl');
                const quoteEl = document.getElementById('intro-quote');
                if (crawlEl2) crawlEl2.classList.add('hidden');
                if (quoteEl) quoteEl.classList.remove('hidden');
                requestAnimationFrame(function() { if (quoteEl) quoteEl.offsetHeight; });
                var t2 = setTimeout(function() {
                    if (window.IntroSequence) window.IntroSequence.runStep(4);
                }, 4000);
                this._timeouts.push(t2);
                break;
                
            case 4:
                // Fade out intro, fade in game board
                this.transitionToGame();
                break;
        }
    },
    
    // Build the crawl content HTML
    buildCrawl: function() {
        const crawlDiv = document.querySelector('.crawl-content');
        if (!crawlDiv) return;
        
        crawlDiv.innerHTML = '';
        
        this.crawlText.forEach(line => {
            if (line === "CHAPTER I" || line === "THE AWAKENING") {
                const h2 = document.createElement('h2');
                h2.textContent = line;
                crawlDiv.appendChild(h2);
            } else if (line === "") {
                const br = document.createElement('br');
                crawlDiv.appendChild(br);
            } else {
                const p = document.createElement('p');
                p.textContent = line;
                crawlDiv.appendChild(p);
            }
        });
    },
    
    // Transition from intro to game — remove black screen, show game, start game only now
    transitionToGame: function() {
        var intro = document.getElementById('intro-sequence');
        if (intro && intro.parentNode) intro.remove();
        var gc = document.getElementById('game-container');
        if (gc) gc.classList.remove('tutorial-intro-active');
        if (window.AudioManager) window.AudioManager.playGameMusic();
        if (window.gameInstance) window.gameInstance.initialize('practice', 1);
        if (typeof IntroSequence !== 'undefined' && IntroSequence.animateCardDealing) {
            IntroSequence.animateCardDealing();
        }
        // Fade out the Layer 1 overlay after 3 seconds so it's not in the way
        setTimeout(function() {
            var ld = document.querySelector('.layer-display');
            if (ld) ld.classList.add('layer-display-faded');
        }, 3000);
    },
    
    // Animate cards dealing themselves into position
    animateCardDealing: function() {
        // Create dealing animation container
        const animContainer = document.createElement('div');
        animContainer.className = 'dealing-animation';
        document.body.appendChild(animContainer);
        
        // Get all grid slots positions
        const slots = document.querySelectorAll('.grid-slot');
        const slotPositions = [];
        
        slots.forEach(slot => {
            const rect = slot.getBoundingClientRect();
            slotPositions.push({
                x: rect.left + rect.width/2,
                y: rect.top + rect.height/2
            });
        });
        
        // Deal cards to each slot with animation
        slotPositions.forEach((pos, index) => {
            setTimeout(() => {
                const card = document.createElement('div');
                card.className = 'dealing-card';
                
                // Start from top of screen
                card.style.left = '50%';
                card.style.top = '-100px';
                card.style.transform = 'translateX(-50%)';
                
                animContainer.appendChild(card);
                
                // Play card movement sound
                if (window.AudioManager) {
                    window.AudioManager.playCardMovement();
                }
                
                // Animate to target position
                setTimeout(() => {
                    card.style.left = (pos.x - 40) + 'px';
                    card.style.top = (pos.y - 56) + 'px';
                    card.style.transform = 'rotate(720deg)';
                }, 50);
                
                // Remove card after animation
                setTimeout(() => {
                    if (card.parentNode) {
                        card.remove();
                    }
                }, 550);
                
            }, index * 100); // Stagger the deals
        });
        
        // Remove animation container when done
        setTimeout(() => {
            if (animContainer.parentNode) {
                animContainer.remove();
            }
            
            // Start tutorial
            this.startTutorial();
            
        }, slotPositions.length * 100 + 600);
    },
    
    // Start the actual tutorial
    startTutorial: function() {
        var self = this;
        setTimeout(function() {
            self.showTutorialTopicDialog(0);
        }, 1000);
    },
    
    // Show tutorial topic dialog: next, previous, and topic list (above layer overlay)
    showTutorialTopicDialog: function(currentIndex) {
        var self = this;
        var chapters = (typeof TUTORIAL_CHAPTERS !== 'undefined' && TUTORIAL_CHAPTERS) ? TUTORIAL_CHAPTERS : [
            { id: 1, name: 'Basic Play', instruction: "Place your first card in an empty SELF slot.", description: 'Place cards in grid' },
            { id: 2, name: 'Combat', instruction: 'Click FIGHT to battle your opponent.', description: 'Win your first battle' },
            { id: 3, name: 'Layer Shift', instruction: 'Click Layer 2 and watch the board change.', description: 'Change layers' },
            { id: 4, name: 'Intuition', instruction: 'Trust your gut - pick the facedown card with highest value.', description: 'Pass an intuition check' },
            { id: 5, name: 'Final Battle', instruction: 'Use everything you learned to defeat the tutorial opponent.', description: 'Defeat the opponent' }
        ];
        var idx = Math.max(0, Math.min(currentIndex, chapters.length - 1));
        var ch = chapters[idx];
        var listHtml = chapters.map(function(c, i) {
            return '<button type="button" class="tutorial-topic-btn' + (i === idx ? ' active' : '') + '" data-idx="' + i + '">' + (i + 1) + '. ' + c.name + '</button>';
        }).join('');
        var html = '<div class="tutorial-topic-dialog" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);color:#ffd700;padding:2rem;border-radius:12px;border:3px solid #ffd700;z-index:30000;max-width:500px;width:90%;box-shadow:0 0 40px rgba(255,215,0,0.4);">' +
            '<h2 style="margin:0 0 1rem;font-size:1.5rem;">' + ch.name + '</h2>' +
            '<p style="margin:0 0 1rem;font-size:1.1rem;line-height:1.5;">' + ch.instruction + '</p>' +
            '<div class="tutorial-topic-list" style="margin:1rem 0;display:flex;flex-direction:column;gap:0.25rem;">' + listHtml + '</div>' +
            '<div style="display:flex;justify-content:space-between;gap:1rem;margin-top:1rem;">' +
            '<button type="button" class="btn-secondary tutorial-prev-btn"' + (idx <= 0 ? ' disabled' : '') + '>&larr; Previous</button>' +
            '<button type="button" class="btn-primary tutorial-start-btn">Start</button>' +
            '<button type="button" class="btn-secondary tutorial-next-btn"' + (idx >= chapters.length - 1 ? ' disabled' : '') + '>Next &rarr;</button>' +
            '</div></div>';
        var wrap = document.createElement('div');
        wrap.className = 'tutorial-topic-overlay';
        wrap.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:29999;';
        wrap.innerHTML = html;
        document.body.appendChild(wrap);
        function goTo(i) {
            if (wrap.parentNode) wrap.remove();
            self.showTutorialTopicDialog(i);
        }
        wrap.querySelector('.tutorial-prev-btn').addEventListener('click', function() { if (idx > 0) goTo(idx - 1); });
        wrap.querySelector('.tutorial-next-btn').addEventListener('click', function() { if (idx < chapters.length - 1) goTo(idx + 1); });
        wrap.querySelector('.tutorial-start-btn').addEventListener('click', function() {
            if (wrap.parentNode) wrap.remove();
        });
        wrap.querySelectorAll('.tutorial-topic-btn').forEach(function(btn) {
            btn.addEventListener('click', function() { goTo(parseInt(btn.getAttribute('data-idx'), 10)); });
        });
        wrap.addEventListener('click', function(e) { if (e.target === wrap) wrap.remove(); });
    },
    
    showTutorialMessage: function(text) {
        this.showTutorialTopicDialog(0);
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.IntroSequence = IntroSequence;
}
