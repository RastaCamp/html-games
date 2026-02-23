/**
 * =====================================================
 * FUM: SHATTERLAYERS - TUTORIAL CHAPTER SYSTEM
 * =====================================================
 * 
 * Chapter-based tutorial with progress saving
 * =====================================================
 */

// =====================================================
// TUTORIAL CHAPTER DATA
// =====================================================
export const TUTORIAL_CHAPTERS = [
    {
        id: 1,
        name: 'Basic Play',
        shortName: 'Basic',
        description: 'Place cards in grid',
        instruction: 'Place your first card in an empty SELF slot.',
        hint: 'Look for the glowing card in your hand.',
        goal: 'Place 3 cards in your grid',
        unlockCondition: null, // Always available
        demo: 'showBasicPlacement'
    },
    {
        id: 2,
        name: 'Combat',
        shortName: 'Combat',
        description: 'Win your first battle',
        instruction: 'Click FIGHT to battle your opponent.',
        hint: 'Higher number wins!',
        goal: 'Win a combat round',
        unlockCondition: 1, // Complete chapter 1
        demo: 'showCombatExample'
    },
    {
        id: 3,
        name: 'Layer Shift',
        shortName: 'Layers',
        description: 'Change layers and see effects',
        instruction: 'Click Layer 2 and watch the board change.',
        hint: 'Notice how Hearts cards glow in this layer.',
        goal: 'Shift to Layer 2 and back',
        unlockCondition: 2, // Complete chapter 2
        demo: 'showLayerShift'
    },
    {
        id: 4,
        name: 'Intuition',
        shortName: 'Intuition',
        description: 'Pass an intuition check',
        instruction: 'Trust your gut - pick the facedown card with highest value.',
        hint: 'Don\'t overthink it!',
        goal: 'Pass an intuition check',
        unlockCondition: 3, // Complete chapter 3
        demo: 'showIntuitionDemo'
    },
    {
        id: 5,
        name: 'Final Battle',
        shortName: 'Final',
        description: 'Defeat the tutorial opponent',
        instruction: 'Use everything you learned to defeat the tutorial opponent.',
        hint: 'You\'ve got this!',
        goal: 'Reduce opponent HP to 0',
        unlockCondition: 4, // Complete chapter 4
        demo: null
    }
];

// =====================================================
// TUTORIAL SAVE SYSTEM
// =====================================================
export class TutorialSave {
    
    /**
     * Default Progress
     * =====================================================
     * NOVICE NOTE: Starting state for new players
     */
    static defaultProgress = {
        currentChapter: 1,
        chapters: TUTORIAL_CHAPTERS.map(ch => ({
            id: ch.id,
            name: ch.name,
            completed: false
        })),
        lastPlayed: new Date().toISOString(),
        tutorialCompleted: false
    };
    
    /**
     * Load Progress
     * =====================================================
     * NOVICE NOTE: Loads saved progress from browser storage
     */
    static loadProgress() {
        const saved = localStorage.getItem('fumTutorialProgress');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error loading tutorial progress:', e);
                return this.defaultProgress;
            }
        } else {
            // First time player - save default
            this.saveProgress(this.defaultProgress);
            return this.defaultProgress;
        }
    }
    
    /**
     * Save Progress
     * =====================================================
     * NOVICE NOTE: Saves progress to browser storage
     */
    static saveProgress(progress) {
        progress.lastPlayed = new Date().toISOString();
        localStorage.setItem('fumTutorialProgress', JSON.stringify(progress));
        if (window.GAME_CONFIG && window.GAME_CONFIG.DEBUG_MODE) {
            console.log('Tutorial progress saved!', progress);
        }
    }
    
    /**
     * Complete Chapter
     * =====================================================
     * NOVICE NOTE: Marks a chapter as complete and moves to next
     */
    static completeChapter(chapterId) {
        const progress = this.loadProgress();
        
        // Find and update chapter
        const chapter = progress.chapters.find(c => c.id === chapterId);
        if (chapter) {
            chapter.completed = true;
        }
        
        // Move to next chapter if available
        if (chapterId < 5) {
            progress.currentChapter = chapterId + 1;
        } else if (chapterId === 5) {
            progress.tutorialCompleted = true;
        }
        
        this.saveProgress(progress);
        return progress;
    }
    
    /**
     * Go To Chapter
     * =====================================================
     * NOVICE NOTE: Jumps to a specific chapter (if unlocked)
     */
    static goToChapter(chapterId) {
        const progress = this.loadProgress();
        const targetChapter = progress.chapters.find(c => c.id === chapterId);
        const tutorialChapter = TUTORIAL_CHAPTERS.find(c => c.id === chapterId);
        
        if (!targetChapter || !tutorialChapter) {
            return { success: false, message: 'Chapter not found' };
        }
        
        // Check if chapter is unlocked
        if (tutorialChapter.unlockCondition) {
            const requiredChapter = progress.chapters.find(c => c.id === tutorialChapter.unlockCondition);
            if (!requiredChapter || !requiredChapter.completed) {
                return { success: false, message: 'Complete previous chapters first!' };
            }
        }
        
        // Can go to completed or current chapters
        if (targetChapter.completed || chapterId === progress.currentChapter) {
            progress.currentChapter = chapterId;
            this.saveProgress(progress);
            return { success: true, progress };
        }
        
        return { success: false, message: 'Chapter not unlocked yet' };
    }
    
    /**
     * Reset Tutorial
     * =====================================================
     * NOVICE NOTE: Resets all tutorial progress
     */
    static resetTutorial() {
        if (confirm('Reset tutorial progress? This cannot be undone.')) {
            this.saveProgress(this.defaultProgress);
            return this.defaultProgress;
        }
        return null;
    }
    
    /**
     * Get Progress Percentage
     * =====================================================
     * NOVICE NOTE: Calculates completion percentage
     */
    static getProgressPercentage() {
        const progress = this.loadProgress();
        const completedCount = progress.chapters.filter(c => c.completed).length;
        return Math.round((completedCount / 5) * 100);
    }
}

// =====================================================
// TUTORIAL UI MANAGER
// =====================================================
export class TutorialUI {
    constructor(game) {
        this.game = game;
        this.currentChapter = null;
        this.skipTimer = null;
    }
    
    /**
     * Show Tutorial Chapter Selector
     * =====================================================
     * NOVICE NOTE: Shows the chapter selection screen
     */
    showChapterSelector() {
        const progress = TutorialSave.loadProgress();
        
        // Check if tutorial was completed before
        const tutorialCompleted = progress.tutorialCompleted || 
                                  progress.chapters.filter(c => c.completed).length === 5;
        
        // Create skip/continue button
        const skipButtonHTML = tutorialCompleted ? 
            '<button class="btn-primary" id="skip-tutorial-btn">CONTINUE TO CAMPAIGN</button>' :
            '<button class="btn-secondary" id="skip-tutorial-btn">SKIP TUTORIAL</button>';
        
        // Create chapter selector HTML
        const chapterHTML = TUTORIAL_CHAPTERS.map(ch => {
            const chapterProgress = progress.chapters.find(c => c.id === ch.id);
            const isCompleted = chapterProgress?.completed || false;
            const isCurrent = progress.currentChapter === ch.id;
            const isLocked = ch.unlockCondition && 
                           !progress.chapters.find(c => c.id === ch.unlockCondition)?.completed;
            
            let statusIcon = '🔒';
            let statusClass = 'locked';
            if (isCompleted) {
                statusIcon = '✅';
                statusClass = 'completed';
            } else if (isCurrent) {
                statusIcon = '⚔️';
                statusClass = 'current';
            }
            
            return `
                <div class="chapter-item ${statusClass}" data-chapter="${ch.id}">
                    <span class="chapter-number">${ch.id}</span>
                    <span class="chapter-name">${ch.shortName}</span>
                    <span class="status-icon">${statusIcon}</span>
                </div>
            `;
        }).join('');
        
        const selectorHTML = `
            <div class="tutorial-chapter-screen">
                <h1>TUTORIAL MODE - CHAPTERS</h1>
                <div class="chapter-selector">
                    ${chapterHTML}
                </div>
                <div class="chapter-content-area" id="chapter-content">
                    <!-- Chapter content will be loaded here -->
                </div>
                <div class="chapter-nav">
                    <button class="nav-btn" id="prev-chapter-btn" disabled>← PREVIOUS CHAPTER</button>
                    <button class="skip-btn" id="skip-chapter-btn" style="display: none;">⚡ SKIP THIS CHAPTER ⚡</button>
                    <button class="nav-btn" id="next-chapter-btn" disabled>NEXT CHAPTER →</button>
                </div>
                <div class="progress-indicator">
                    Chapter <span id="current-chapter-num">${progress.currentChapter}</span> of 5 • 
                    <span id="progress-percent">${TutorialSave.getProgressPercentage()}%</span> complete
                    <button class="reset-link" id="reset-tutorial-btn">[reset]</button>
                </div>
            </div>
        `;
        
        // Hide main menu
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.classList.add('hidden');
        
        // Show tutorial screen
        const gameContainer = document.getElementById('game-container');
        let tutorialScreen = document.getElementById('tutorial-chapter-screen');
        if (!tutorialScreen) {
            tutorialScreen = document.createElement('div');
            tutorialScreen.id = 'tutorial-chapter-screen';
            gameContainer.appendChild(tutorialScreen);
        }
        tutorialScreen.innerHTML = selectorHTML;
        tutorialScreen.classList.remove('hidden');
        
        // Add event listeners
        this.setupTutorialListeners();
        
        // Start tutorial button
        const startBtn = document.getElementById('start-tutorial-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                // Show chapter selector
                document.querySelector('.chapter-selector').style.display = 'flex';
                document.querySelector('.tutorial-start-buttons').style.display = 'none';
                // Load current chapter
                this.loadChapterContent(progress.currentChapter);
            });
        }
        
        // Skip tutorial button
        const skipBtn = document.getElementById('skip-tutorial-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                // Go directly to campaign
                if (window.gameInstance) {
                    const campaign = new CampaignMode(window.gameInstance);
                    campaign.showBoardSelection();
                }
            });
        }
    }
    
    /**
     * Setup Tutorial Listeners
     * =====================================================
     * NOVICE NOTE: Sets up all button click handlers
     */
    setupTutorialListeners() {
        // Chapter selector buttons
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const chapterId = parseInt(e.currentTarget.dataset.chapter);
                const result = TutorialSave.goToChapter(chapterId);
                if (result.success) {
                    this.loadChapterContent(chapterId);
                } else {
                    alert(result.message);
                }
            });
        });
        
        // Previous chapter button
        document.getElementById('prev-chapter-btn').addEventListener('click', () => {
            const progress = TutorialSave.loadProgress();
            if (progress.currentChapter > 1) {
                const result = TutorialSave.goToChapter(progress.currentChapter - 1);
                if (result.success) {
                    this.loadChapterContent(progress.currentChapter - 1);
                }
            }
        });
        
        // Next chapter button
        document.getElementById('next-chapter-btn').addEventListener('click', () => {
            const progress = TutorialSave.loadProgress();
            const currentChapter = progress.chapters.find(c => c.id === progress.currentChapter);
            if (currentChapter && currentChapter.completed && progress.currentChapter < 5) {
                const result = TutorialSave.goToChapter(progress.currentChapter + 1);
                if (result.success) {
                    this.loadChapterContent(progress.currentChapter + 1);
                }
            }
        });
        
        // Skip chapter button
        document.getElementById('skip-chapter-btn').addEventListener('click', () => {
            if (confirm('Skip this chapter? You can always come back to review it.')) {
                const progress = TutorialSave.loadProgress();
                TutorialSave.completeChapter(progress.currentChapter);
                this.loadChapterContent(progress.currentChapter + 1);
            }
        });
        
        // Reset tutorial button
        document.getElementById('reset-tutorial-btn').addEventListener('click', () => {
            const newProgress = TutorialSave.resetTutorial();
            if (newProgress) {
                this.loadChapterContent(1);
            }
        });
    }
    
    /**
     * Load Chapter Content
     * =====================================================
     * NOVICE NOTE: Loads and displays chapter content
     */
    loadChapterContent(chapterId) {
        const chapter = TUTORIAL_CHAPTERS.find(c => c.id === chapterId);
        if (!chapter) return;
        
        const progress = TutorialSave.loadProgress();
        this.currentChapter = chapter;
        
        // Update chapter content area
        const contentArea = document.getElementById('chapter-content');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="chapter-content">
                    <h2>${chapter.name}</h2>
                    <p class="chapter-instruction">${chapter.instruction}</p>
                    <p class="chapter-hint">💡 ${chapter.hint}</p>
                    <p class="chapter-goal">Goal: ${chapter.goal}</p>
                    <button class="btn-primary" id="start-chapter-btn">START CHAPTER</button>
                </div>
            `;
            
            // Start chapter button
            document.getElementById('start-chapter-btn').addEventListener('click', () => {
                this.startChapter(chapterId);
            });
        }
        
        // Update UI
        this.updateTutorialUI(progress);
        
        // Show skip button after 30 seconds
        this.scheduleSkipButton();
    }
    
    /**
     * Start Chapter
     * =====================================================
     * NOVICE NOTE: Starts the actual tutorial chapter gameplay
     */
    startChapter(chapterId) {
        // Hide tutorial screen
        const tutorialScreen = document.getElementById('tutorial-chapter-screen');
        if (tutorialScreen) tutorialScreen.classList.add('hidden');
        
        // Initialize game in tutorial mode
        this.game.initialize('tutorial', 1);
        this.game.tutorialChapter = chapterId;
        
        // Show tutorial hints during gameplay
        this.showTutorialHints(chapterId);
    }
    
    /**
     * Show Tutorial Hints
     * =====================================================
     * NOVICE NOTE: Shows hints during gameplay
     */
    showTutorialHints(chapterId) {
        const chapter = TUTORIAL_CHAPTERS.find(c => c.id === chapterId);
        if (!chapter) return;
        
        // Create hint overlay
        const hint = document.createElement('div');
        hint.className = 'tutorial-hint-overlay';
        hint.id = 'tutorial-hint';
        hint.innerHTML = `
            <div class="hint-content">
                <div class="hint-arrow">👇</div>
                <div class="hint-message">${chapter.instruction}</div>
            </div>
        `;
        document.body.appendChild(hint);
        
        // Position hint (will be positioned by CSS or JavaScript)
    }
    
    /**
     * Complete Chapter
     * =====================================================
     * NOVICE NOTE: Called when player completes a chapter
     */
    completeChapter() {
        const progress = TutorialSave.loadProgress();
        TutorialSave.completeChapter(progress.currentChapter);
        
        // Show completion message
        alert(`Chapter ${progress.currentChapter} complete!`);
        
        // Return to chapter selector
        this.showChapterSelector();
    }
    
    /**
     * Update Tutorial UI
     * =====================================================
     * NOVICE NOTE: Updates UI elements based on progress
     */
    updateTutorialUI(progress) {
        // Update chapter selector buttons
        TUTORIAL_CHAPTERS.forEach(ch => {
            const btn = document.querySelector(`.chapter-item[data-chapter="${ch.id}"]`);
            if (btn) {
                const chapterProgress = progress.chapters.find(c => c.id === ch.id);
                const isCompleted = chapterProgress?.completed || false;
                const isCurrent = progress.currentChapter === ch.id;
                const isLocked = ch.unlockCondition && 
                               !progress.chapters.find(c => c.id === ch.unlockCondition)?.completed;
                
                btn.classList.remove('completed', 'current', 'locked');
                
                if (isCompleted) {
                    btn.classList.add('completed');
                    btn.querySelector('.status-icon').textContent = '✅';
                } else if (isCurrent) {
                    btn.classList.add('current');
                    btn.querySelector('.status-icon').textContent = '⚔️';
                } else {
                    btn.classList.add('locked');
                    btn.querySelector('.status-icon').textContent = '🔒';
                }
            }
        });
        
        // Update progress percentage
        const percent = TutorialSave.getProgressPercentage();
        const percentEl = document.getElementById('progress-percent');
        if (percentEl) percentEl.textContent = percent + '%';
        
        // Update current chapter number
        const chapterNumEl = document.getElementById('current-chapter-num');
        if (chapterNumEl) chapterNumEl.textContent = progress.currentChapter;
        
        // Enable/disable navigation buttons
        const prevBtn = document.getElementById('prev-chapter-btn');
        const nextBtn = document.getElementById('next-chapter-btn');
        
        if (prevBtn) {
            prevBtn.disabled = (progress.currentChapter === 1);
        }
        
        if (nextBtn) {
            const currentChapter = progress.chapters.find(c => c.id === progress.currentChapter);
            nextBtn.disabled = !currentChapter?.completed || progress.currentChapter >= 5;
        }
    }
    
    /**
     * Schedule Skip Button
     * =====================================================
     * NOVICE NOTE: Shows skip button after 30 seconds
     */
    scheduleSkipButton() {
        // Clear existing timer
        if (this.skipTimer) {
            clearTimeout(this.skipTimer);
        }
        
        // Show skip button after 30 seconds
        this.skipTimer = setTimeout(() => {
            const skipBtn = document.getElementById('skip-chapter-btn');
            if (skipBtn) {
                skipBtn.style.display = 'inline-block';
            }
        }, 30000); // 30 seconds
    }
}

// Make globally available
if (typeof window !== 'undefined') {
    window.TutorialSave = TutorialSave;
    window.TutorialUI = TutorialUI;
    window.TUTORIAL_CHAPTERS = TUTORIAL_CHAPTERS;
}
