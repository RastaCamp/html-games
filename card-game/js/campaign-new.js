/**
 * =====================================================
 * FUM: SHATTERLAYERS - CAMPAIGN MODE
 * =====================================================
 * 
 * "THE LAYER WALKER'S JOURNEY"
 * 
 * A story-driven campaign across 9 realms
 * =====================================================
 */

// Clear game container background when returning to main menu (so battlefield image doesn't show behind menu)
function clearGameContainerBackground() {
    const el = document.getElementById('game-container');
    if (el) {
        el.style.backgroundImage = '';
        el.style.backgroundSize = '';
        el.style.backgroundPosition = '';
    }
}

// =====================================================
// BOARD MAPPING - Filenames to Story Names
// =====================================================
const BOARD_MAPPING = {
    'grasslands.jpg': { displayName: 'Eldermoor Battlefield', storyName: 'Eldermoor Battlefield' },
    'snowland.jpg': { displayName: 'Frostnir', storyName: 'Frostnir' },
    'waterworld.jpg': { displayName: 'Abyssal Depths', storyName: 'Abyssal Depths' },
    'mall.jpg': { displayName: 'The Shattered Mall', storyName: 'The Shattered Mall' },
    'glass city.jpg': { displayName: 'Crystalis Prime', storyName: 'Crystalis Prime' },
    'akasha.png': { displayName: 'Aethelgard', storyName: 'Aethelgard' },
    'astral.png': { displayName: 'The Dreaming Void', storyName: 'The Dreaming Void' },
    'space.png': { displayName: 'The Void Expanse', storyName: 'The Void Expanse' },
    'apocalypse.png': { displayName: 'The Fallen Zone', storyName: 'The Fallen Zone' }
};

// =====================================================
// CAMPAIGN BOARDS - All 9 Realms
// =====================================================
export const CAMPAIGN_BOARDS = [
    {
        id: 'eldermoor',
        order: 1,
        displayName: 'Eldermoor Battlefield',
        filename: 'grasslands.jpg',
        opponent: 'The Warmaster',
        opponentDeck: 'aggressive',
        difficulty: 1,
        reward: { essence: 200, cards: [] },
        nextBoard: 'frostnir',
        flavor: 'Ancient warriors clashed here. The grass remembers their final stand.',
        challenge: 'Defeat the Warmaster to prove your worth.',
        midBattleText: [
            'The grass whispers ancient battle cries...',
            'A ghost warrior nods at your courage.',
            'The soil drinks blood like old wine.',
            'Echoes of war surround you.'
        ],
        winQuote: '"You fight with honor, Walker. The battlefield respects you."',
        loseQuote: '"The Warmaster\'s blade is sharp. Train harder, Walker."'
    },
    {
        id: 'frostnir',
        order: 2,
        displayName: 'Frostnir',
        filename: 'snowland.jpg',
        opponent: 'The Frost Queen',
        opponentDeck: 'control',
        difficulty: 2,
        reward: { essence: 250, cards: ['Ice Shard'] },
        nextBoard: 'abyssal',
        flavor: 'A world locked in eternal winter. The cold seeps into your soul.',
        challenge: 'Defeat the Frost Queen to warm these lands.',
        midBattleText: [
            'Your breath freezes mid-air.',
            'The aurora pulses with your heartbeat.',
            'Beneath the ice, something moves.',
            'Frost crystals form on your cards.'
        ],
        winQuote: '"You fight with the warmth of a dying star... Perhaps spring will return to Frostnir."',
        loseQuote: '"You fought well, little flame... but all fires die in Frostnir."'
    },
    {
        id: 'abyssal',
        order: 3,
        displayName: 'Abyssal Depths',
        filename: 'waterworld.jpg',
        opponent: 'Leviathan',
        opponentDeck: 'combo',
        difficulty: 2,
        reward: { essence: 250, cards: [] },
        nextBoard: 'mall',
        flavor: 'Beneath endless oceans, lost cities dream of sunlight.',
        challenge: 'Face Leviathan in the depths.',
        midBattleText: [
            'Pressure crushes reality here.',
            'A leviathan circles in the dark.',
            'Bubbles carry whispered secrets.',
            'The abyss watches with ancient eyes.'
        ],
        winQuote: '"Even the depths recognize your power, Walker."',
        loseQuote: '"The pressure was too great. The depths claim another."'
    },
    {
        id: 'mall',
        order: 4,
        displayName: 'The Shattered Mall',
        filename: 'mall.jpg',
        opponent: 'The Mannequin King',
        opponentDeck: 'chaos',
        difficulty: 3,
        reward: { essence: 300, cards: ['Mannequin Mimic'] },
        nextBoard: 'crystalis',
        flavor: 'A memory of consumerism, twisted by layer corruption.',
        challenge: 'Survive the Mannequin King\'s twisted realm.',
        midBattleText: [
            'Eerie Muzak plays from nowhere.',
            'Mannequins turn to watch you.',
            'An escalator runs forever into void.',
            'Price tags show impossible numbers.'
        ],
        winQuote: '"You broke the cycle, Walker. The mall remembers its purpose."',
        loseQuote: '"Welcome to the mall... forever."'
    },
    {
        id: 'crystalis',
        order: 5,
        displayName: 'Crystalis Prime',
        filename: 'glass city.jpg',
        opponent: 'The Prism Archon',
        opponentDeck: 'control',
        difficulty: 3,
        reward: { essence: 300, cards: [] },
        nextBoard: 'aethelgard',
        flavor: 'A city of pure crystal, where thoughts become visible.',
        challenge: 'Defeat the Prism Archon in the crystal city.',
        midBattleText: [
            'Your thoughts echo off crystal walls.',
            'Every reflection shows a different you.',
            'The city hums at perfect frequency.',
            'Light bends around your cards.'
        ],
        winQuote: '"Your clarity shattered my illusions, Walker."',
        loseQuote: '"The crystal shows only your confusion."'
    },
    {
        id: 'aethelgard',
        order: 6,
        displayName: 'Aethelgard',
        filename: 'akasha.png',
        opponent: 'The Dragon Sovereign',
        opponentDeck: 'aggressive',
        difficulty: 4,
        reward: { essence: 400, cards: ['Dragon Scale'] },
        nextBoard: 'dreaming',
        flavor: 'The fantasy realm where all myths were born.',
        challenge: 'Face the Dragon Sovereign in the realm of legends.',
        midBattleText: [
            'Magic thickens the air.',
            'Ancient trees remember your name.',
            'Faerie lights dance at battle\'s edge.',
            'Dragons circle overhead.'
        ],
        winQuote: '"Even dragons bow to true courage, Walker."',
        loseQuote: '"The dragon\'s fire consumes all."'
    },
    {
        id: 'dreaming',
        order: 7,
        displayName: 'The Dreaming Void',
        filename: 'astral.png',
        opponent: 'The Nightmare',
        opponentDeck: 'mind-game',
        difficulty: 4,
        reward: { essence: 400, cards: [] },
        nextBoard: 'void',
        flavor: 'Reality is suggestion here. Your thoughts have weight.',
        challenge: 'Conquer your fears in the Dreaming Void.',
        midBattleText: [
            'You forget which memories are yours.',
            'Time flows backward here.',
            'Your opponent shifts forms constantly.',
            'Dreams and reality blur together.'
        ],
        winQuote: '"You faced your nightmares and won, Walker."',
        loseQuote: '"The nightmare is endless... or is it?"'
    },
    {
        id: 'void',
        order: 8,
        displayName: 'The Void Expanse',
        filename: 'space.png',
        opponent: 'The Void Walker',
        opponentDeck: 'control',
        difficulty: 5,
        reward: { essence: 500, cards: ['Void Shard'] },
        nextBoard: 'fallen',
        flavor: 'Between stars, ancient entities slumber.',
        challenge: 'Defeat the Void Walker in the endless expanse.',
        midBattleText: [
            'Stars die in the distance.',
            'Gravity is just a suggestion.',
            'Ancient beings watch your struggle.',
            'The void whispers secrets of creation.'
        ],
        winQuote: '"You walk the void as I once did, Walker. You are ready."',
        loseQuote: '"The void is infinite. You are not."'
    },
    {
        id: 'fallen',
        order: 9,
        displayName: 'The Fallen Zone',
        filename: 'apocalypse.png',
        opponent: 'THE CORRUPTOR',
        opponentDeck: 'final-boss',
        difficulty: 5,
        reward: { essence: 1000, cards: [], title: 'Legendary Layer Walker' },
        nextBoard: null, // End of campaign
        flavor: 'The first world that fell. The source of the fracture.',
        challenge: 'Face THE CORRUPTOR and restore balance.',
        midBattleText: [
            'Reality bleeds at the edges.',
            'The Corruptor wears faces you once loved.',
            'Hope feels heavy here.',
            'The fracture widens with each moment.'
        ],
        winQuote: '"You have done what none could, Walker. The balance is restored."',
        loseQuote: '"The corruption spreads... all is lost."'
    }
];

// =====================================================
// CAMPAIGN PROGRESSION SYSTEM
// =====================================================
export class CampaignMode {
    constructor(game) {
        this.game = game;
        this.boards = CAMPAIGN_BOARDS;
        this.currentBoard = null;
        this.progress = this.loadProgress();
    }

    /**
     * Load Campaign Progress
     * =====================================================
     * NOVICE NOTE: Loads saved progress from browser storage
     */
    loadProgress() {
        const saved = localStorage.getItem('fumCampaignProgress');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Default progress (new player)
        return {
            currentBoardId: 'eldermoor',
            completedBoards: [],
            essence: 0,
            unlockedCards: [],
            tutorialCompleted: false
        };
    }

    /**
     * Save Campaign Progress
     * =====================================================
     * NOVICE NOTE: Saves progress to browser storage
     */
    saveProgress() {
        localStorage.setItem('fumCampaignProgress', JSON.stringify(this.progress));
    }

    /**
     * Check for Continue Option
     * =====================================================
     * NOVICE NOTE: Checks if player has saved progress
     */
    hasSaveData() {
        return localStorage.getItem('fumCampaignProgress') !== null;
    }

    /**
     * Show Campaign Intro
     * =====================================================
     * NOVICE NOTE: Shows the intro story when starting campaign
     */
    showCampaignIntro() {
        const introHTML = `
            <div class="campaign-intro-modal">
                <div class="intro-content">
                    <h1>THE LAYER WALKER</h1>
                    <div class="intro-text">
                        <p>"The layers of reality are fracturing.</p>
                        <p>You are a Layer Walker - one who can shift between dimensions. The Source has chosen you to restore balance across the realms.</p>
                        <p>Nine worlds hang in the balance.</p>
                        <p>Nine guardians stand in your way.</p>
                        <p>One truth awaits at the end of your journey.</p>
                        <p>The first rift opens before you...</p>
                        <p>Step forward, Walker."</p>
                    </div>
                    <button class="btn-primary" id="begin-journey-btn">BEGIN JOURNEY</button>
                    <button class="btn-secondary" id="campaign-intro-back" style="margin-top: 1rem;">← Back to Menu</button>
                </div>
            </div>
        `;
        
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'modal-overlay campaign-intro';
        modal.style.zIndex = '10002';
        modal.innerHTML = introHTML;
        document.body.appendChild(modal);
        
        // Handle begin journey button (use querySelector on modal so we get the right button)
        const btn = modal.querySelector('#begin-journey-btn');
        if (btn) btn.addEventListener('click', () => { modal.remove(); this.showBoardSelection(); });
        const backBtn = modal.querySelector('#campaign-intro-back');
        if (backBtn) backBtn.addEventListener('click', () => {
            modal.remove();
            clearGameContainerBackground();
            document.getElementById('game-container').classList.remove('game-active');
            document.getElementById('main-menu').classList.remove('hidden');
            if (typeof TitleScreen !== 'undefined' && TitleScreen.ensureTitleMusicOnFirstInteraction) {
                TitleScreen.ensureTitleMusicOnFirstInteraction();
            }
        });
    }

    /**
     * Show Board Selection Screen
     * =====================================================
     * NOVICE NOTE: Shows map of all 9 boards with status
     */
    showBoardSelection() {
        // Check for continue option
        const hasProgress = this.hasSaveData();
        const continueHTML = hasProgress ? 
            '<button class="btn-primary" id="continue-campaign-btn" style="margin-bottom: 20px;">CONTINUE JOURNEY</button>' : '';
        
        const boardHTML = this.boards.map(board => {
            const isCompleted = this.progress.completedBoards.includes(board.id);
            const isCurrent = this.progress.currentBoardId === board.id;
            const isLocked = !isCompleted && !isCurrent && 
                           (board.order > 1 && !this.progress.completedBoards.includes(
                               this.boards.find(b => b.nextBoard === board.id)?.id || ''
                           ));
            
            let statusIcon = '🔒';
            let statusClass = 'locked';
            if (isCompleted) {
                statusIcon = '✅';
                statusClass = 'completed';
            } else if (isCurrent) {
                statusIcon = '⚔️';
                statusClass = 'current glowing';
            }
            
            return `
                <div class="board-card ${statusClass}" data-board-id="${board.id}">
                    <img src="visuals/boards/${board.filename}" alt="${board.displayName}" 
                         onerror="this.src='visuals/boards/${board.filename.replace('.jpg', '.png')}'">
                    <div class="board-info">
                        <h3>${board.displayName}</h3>
                        <span class="status-icon">${statusIcon}</span>
                        ${isLocked ? 
                            `<p class="opponent">🔒 Locked</p>
                             <p class="unlock-req">Complete previous realm</p>` :
                            `<p class="opponent">${isCompleted ? 'DEFEATED' : 'Current'}: ${board.opponent}</p>
                             <p class="flavor">${board.flavor}</p>
                             ${isCurrent ? `<button class="enter-btn" data-board-id="${board.id}">ENTER REALM</button>` : ''}`
                        }
                    </div>
                </div>
            `;
        }).join('');
        
        const selectionHTML = `
            <div class="campaign-map-screen">
                <h1>THE REALMS OF AKASHA</h1>
                <p class="map-flavor">Nine worlds await. Choose your path.</p>
                <div class="essence-display">Essence: <span id="campaign-essence">${this.progress.essence}</span></div>
                <div class="board-grid">
                    ${boardHTML}
                </div>
                <button class="btn-secondary" id="return-menu-btn">RETURN TO MENU</button>
            </div>
        `;
        
        // Hide main menu and show board selection
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.classList.add('hidden');
        
        const gameContainer = document.getElementById('game-container');
        let mapScreen = document.getElementById('campaign-map-screen');
        if (!mapScreen) {
            mapScreen = document.createElement('div');
            mapScreen.id = 'campaign-map-screen';
            gameContainer.appendChild(mapScreen);
        }
        mapScreen.innerHTML = selectionHTML;
        mapScreen.classList.remove('hidden');
        
        // Add event listeners (use currentTarget so click on button text still works)
        document.querySelectorAll('.enter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const boardId = (e.currentTarget && e.currentTarget.dataset.boardId) || (e.target && e.target.closest('[data-board-id]') && e.target.closest('[data-board-id]').dataset.boardId);
                if (boardId) this.startBoard(boardId);
            });
        });
        
        document.getElementById('return-menu-btn').addEventListener('click', () => {
            mapScreen.classList.add('hidden');
            if (mainMenu) mainMenu.classList.remove('hidden');
        });
        
        // Continue button (if exists)
        const continueBtn = document.getElementById('continue-campaign-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                // Load current board
                const currentBoard = this.boards.find(b => b.id === this.progress.currentBoardId);
                if (currentBoard) {
                    this.startBoard(currentBoard.id);
                }
            });
        }
    }

    /**
     * Start Board
     * =====================================================
     * NOVICE NOTE: Starts a specific board battle
     */
    startBoard(boardId) {
        const board = this.boards.find(b => b.id === boardId);
        if (!board) return;
        
        this.currentBoard = board;
        
        // Show board intro
        this.showBoardIntro(board);
    }

    /**
     * Show Board Intro
     * =====================================================
     * NOVICE NOTE: Shows description before battle starts
     */
    showBoardIntro(board) {
        const introHTML = `
            <div class="board-intro-modal">
                <div class="board-intro-content">
                    <h2>${board.displayName}</h2>
                    <p class="flavor-text">${board.flavor}</p>
                    <p class="challenge-text">${board.challenge}</p>
                    <div class="opponent-info">
                        <h3>Opponent: ${board.opponent}</h3>
                        <p>Difficulty: ${'★'.repeat(board.difficulty)}${'☆'.repeat(5 - board.difficulty)}</p>
                    </div>
                    <div class="board-intro-buttons">
                        <button class="btn-primary" id="start-battle-btn">BEGIN BATTLE</button>
                        <button class="btn-secondary" id="cancel-battle-btn">CANCEL</button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay board-intro';
        modal.innerHTML = introHTML;
        document.body.appendChild(modal);
        
        const startBtn = modal.querySelector('#start-battle-btn');
        const cancelBtn = modal.querySelector('#cancel-battle-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                modal.remove();
                // Hide board selection
                const mapScreen = document.getElementById('campaign-map-screen');
                if (mapScreen) mapScreen.classList.add('hidden');
                
                // Initialize game for this board (4th param = startBoardId so we don't re-show intro/selection)
                this.game.initialize('campaign', board.difficulty, null, board.id);
                this.game.currentBoard = board;
                
                // Set board background
                this.setBoardBackground(board.filename);
                
                // Start game music
                if (window.AudioManager) {
                    window.AudioManager.playGameMusic();
                }
            });
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.remove();
            });
        }
    }

    /**
     * Set Board Background
     * =====================================================
     * NOVICE NOTE: Changes the game background to match board
     */
    setBoardBackground(filename) {
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            // Try both .jpg and .png extensions
            const jpgPath = `visuals/boards/${filename}`;
            const pngPath = `visuals/boards/${filename.replace('.jpg', '.png')}`;
            
            gameContainer.style.backgroundImage = `url(${jpgPath}), url(${pngPath})`;
            gameContainer.style.backgroundSize = 'cover';
            gameContainer.style.backgroundPosition = 'center';
        }
    }

    /**
     * Show Mid-Battle Text
     * =====================================================
     * NOVICE NOTE: Randomly shows flavor text during battle
     */
    showMidBattleText() {
        if (!this.currentBoard || !this.currentBoard.midBattleText) return;
        
        const texts = this.currentBoard.midBattleText;
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        
        // Show floating text
        const textEl = document.createElement('div');
        textEl.className = 'mid-battle-text';
        textEl.textContent = randomText;
        document.body.appendChild(textEl);
        
        // Remove after 3 seconds
        setTimeout(() => {
            textEl.remove();
        }, 3000);
    }

    /**
     * Complete Board
     * =====================================================
     * NOVICE NOTE: Called when player wins a board
     */
    completeBoard() {
        if (!this.currentBoard) return;
        
        // Mark as completed
        if (!this.progress.completedBoards.includes(this.currentBoard.id)) {
            this.progress.completedBoards.push(this.currentBoard.id);
        }
        
        // Add rewards
        this.progress.essence += this.currentBoard.reward.essence;
        if (this.currentBoard.reward.cards) {
            var _cards = this.currentBoard.reward.cards;
            for (var _i = 0; _i < _cards.length; _i++) this.progress.unlockedCards.push(_cards[_i]);
        }
        
        // Move to next board
        if (this.currentBoard.nextBoard) {
            this.progress.currentBoardId = this.currentBoard.nextBoard;
        } else {
            // Campaign complete!
            this.progress.campaignCompleted = true;
        }
        
        this.saveProgress();
        
        // Show win dialog
        this.showWinDialog();
    }

    /**
     * Show Win Dialog
     * =====================================================
     * NOVICE NOTE: Shows victory screen after winning
     */
    showWinDialog() {
        const board = this.currentBoard;
        const isFinalBoss = board.id === 'fallen';
        
        let dialogHTML;
        
        if (isFinalBoss) {
            // Final boss victory
            dialogHTML = `
                <div class="win-dialog final-victory">
                    <div class="victory-content">
                        <h1>VICTORY</h1>
                        <h2>THE CORRUPTOR SCREAMS ACROSS REALITY</h2>
                        <div class="victory-text">
                            <p>The Corruptor dissolves into golden light.</p>
                            <p>The nine realms shudder... then still.</p>
                            <p class="quote">"Layer Walker... you have done what none could.</p>
                            <p class="quote">The balance is restored.</p>
                            <p class="quote">The layers sing your name.</p>
                            <p class="quote">You are no longer just a Walker.</p>
                            <p class="quote">You are THE SHATTERER."</p>
                            <p>Around you, the realms begin to heal.</p>
                            <p>In Frostnir, flowers bloom.</p>
                            <p>In Abyssal Depths, light reaches the bottom.</p>
                            <p>In The Fallen Zone... hope returns.</p>
                            <p>Your journey is complete.</p>
                            <p>But the layers will always remember you.</p>
                        </div>
                        <div class="achievements">
                            <p>⭐ ACHIEVEMENT UNLOCKED: LAYER LEGEND ⭐</p>
                            <p>⭐ REALM SAVED: 9/9 ⭐</p>
                            <p>⭐ NEW GAME+ UNLOCKED ⭐</p>
                        </div>
                        <div class="rewards">
                            <p>+${board.reward.essence} Essence</p>
                            <p>+${board.reward.title || ''}</p>
                        </div>
                        <div class="victory-buttons">
                            <button class="btn-primary" id="play-again-btn">PLAY AGAIN</button>
                            <button class="btn-secondary" id="new-game-plus-btn">NEW GAME+</button>
                            <button class="btn-secondary" id="view-hall-btn">VIEW HALL OF FAME</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Standard victory
            dialogHTML = `
                <div class="win-dialog">
                    <div class="victory-content">
                        <h1>VICTORY</h1>
                        <h2>${board.opponent.toUpperCase()} HAS FALLEN</h2>
                        <div class="victory-text">
                            <p class="quote">${board.winQuote}</p>
                            ${board.id === 'frostnir' ? 
                                `<p>The ice begins to melt.</p>
                                 <p>A single flower blooms at your feet.</p>` : ''
                            }
                        </div>
                        <div class="rewards">
                            <p>+${board.reward.essence} Essence</p>
                            ${board.reward.cards && board.reward.cards.length > 0 ? 
                                `<p>Unlocked: ${board.reward.cards.join(', ')}</p>` : ''
                            }
                            ${board.nextBoard ? 
                                `<p>Unlocked: ${this.boards.find(b => b.id === board.nextBoard)?.displayName || ''}</p>` : ''
                            }
                        </div>
                        <div class="victory-buttons">
                            <button class="btn-primary" id="continue-journey-btn">CONTINUE JOURNEY</button>
                            <button class="btn-secondary" id="return-map-btn">RETURN TO MAP</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay win-dialog-overlay';
        modal.innerHTML = dialogHTML;
        document.body.appendChild(modal);
        
        // Add event listeners
        if (isFinalBoss) {
            document.getElementById('play-again-btn')?.addEventListener('click', () => {
                modal.remove();
                this.progress = this.loadProgress(); // Reset or reload
                this.showBoardSelection();
            });
            document.getElementById('new-game-plus-btn')?.addEventListener('click', () => {
                // TODO: Implement New Game+
                alert('New Game+ coming soon!');
            });
            document.getElementById('view-hall-btn')?.addEventListener('click', () => {
                // TODO: Implement Hall of Fame
                alert('Hall of Fame coming soon!');
            });
        } else {
            document.getElementById('continue-journey-btn')?.addEventListener('click', () => {
                modal.remove();
                if (board.nextBoard) {
                    this.progress.currentBoardId = board.nextBoard;
                    this.saveProgress();
                    this.showBoardSelection();
                }
            });
            document.getElementById('return-map-btn')?.addEventListener('click', () => {
                modal.remove();
                this.showBoardSelection();
            });
        }
    }

    /**
     * Show Lose Dialog
     * =====================================================
     * NOVICE NOTE: Shows defeat screen after losing
     */
    showLoseDialog() {
        const board = this.currentBoard;
        
        const dialogHTML = `
            <div class="lose-dialog">
                <div class="defeat-content">
                    <h1>DEFEAT</h1>
                    <div class="defeat-text">
                        <p class="quote">${board.loseQuote}</p>
                        <p>Your vision blurs.</p>
                        <p>The layer rejects you.</p>
                        <p>You awaken at the last waypoint...</p>
                        <p>The journey must begin again.</p>
                    </div>
                    <div class="defeat-buttons">
                        <button class="btn-primary" id="retry-battle-btn">RETRY BATTLE</button>
                        <button class="btn-secondary" id="return-map-lose-btn">RETURN TO MAP</button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay lose-dialog-overlay';
        modal.innerHTML = dialogHTML;
        document.body.appendChild(modal);
        
        document.getElementById('retry-battle-btn')?.addEventListener('click', () => {
            modal.remove();
            // Restart same board
            this.startBoard(board.id);
        });
        
        document.getElementById('return-map-lose-btn')?.addEventListener('click', () => {
            modal.remove();
            this.showBoardSelection();
        });
    }
}

// Make globally available
if (typeof window !== 'undefined') {
    window.CampaignMode = CampaignMode;
    window.CAMPAIGN_BOARDS = CAMPAIGN_BOARDS;
}
