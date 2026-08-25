/**
 * 7 DAYS... - EASY MODE TUTORIAL
 *
 * Skippable step-by-step walkthrough of the survival bars and basic actions.
 * Only shown on Easy difficulty, only once (localStorage flag), only on Day 1.
 * Hard mode never sees this at all — see Game.maybeShowEasyModeTutorial().
 */
const EASY_TUTORIAL_STEPS = [
    {
        title: 'Welcome to the Basement',
        body: "You'll survive here for 7 days. Nine bars on the left track how you're doing — let's go through them.",
    },
    {
        title: 'Health',
        body: 'Your overall condition. Drops from injury, starvation, dehydration, cold, or sickness. If it hits 0, it\'s over — keep the other bars in check and Health mostly takes care of itself.',
    },
    {
        title: 'Hydration',
        body: 'Drink water to keep this up. Search the basement for bottles, or find a working tap. Let it run dry and Health starts draining.',
    },
    {
        title: 'Hunger',
        body: 'Eat food to keep this up. Search containers and shelves for anything edible. Running on empty hurts Health and Morale both.',
    },
    {
        title: 'Morale',
        body: "Your mental state, stuck down here alone. Comfort items, good sleep, and making progress help. Let it crash and things get harder to manage.",
    },
    {
        title: 'Hygiene',
        body: 'This one runs backwards — 0 is clean, 100 is filthy. Wash up when you can, or it climbs and raises your Sickness risk.',
    },
    {
        title: 'Fatigue',
        body: 'Also backwards — 0 is well-rested, 100 is collapse. Rest or sleep to bring it back down. Push too far and everything gets harder to do.',
    },
    {
        title: 'Bathroom',
        body: "Rises over time. Use the bathroom before it gets urgent, or it starts costing you Morale and Hygiene.",
    },
    {
        title: 'Body Heat',
        body: "This one has a sweet spot, shown on the bar itself (ideal 35–65) — too cold OR too hot both hurt you. Manage clothing, blankets, and any heat source to stay in that middle band.",
    },
    {
        title: 'Sickness',
        body: "Rises if you're dirty, cold, malnourished, or injured for too long. Once it takes hold it drains Health directly — keep the other bars healthy to avoid it in the first place.",
    },
    {
        title: 'Finding Supplies',
        body: 'Click around the room to search boxes, shelves, and containers. Found items go straight to your Inventory — you\'ll see a confirmation pop up each time.',
    },
    {
        title: "You've Got This",
        body: "That's everything. Explore, manage your bars, and survive the week. You can turn this tutorial back on anytime from Options if you switch difficulty.",
    },
];

let _easyTutorialIndex = 0;

function _renderEasyTutorialStep() {
    const overlay = document.getElementById('easy-tutorial-overlay');
    if (!overlay) return;
    const step = EASY_TUTORIAL_STEPS[_easyTutorialIndex];
    const titleEl = document.getElementById('easy-tutorial-title');
    const bodyEl = document.getElementById('easy-tutorial-body');
    const dotsEl = document.getElementById('easy-tutorial-dots');
    const nextBtn = document.getElementById('easy-tutorial-next-btn');
    if (titleEl) titleEl.textContent = step.title;
    if (bodyEl) bodyEl.textContent = step.body;
    if (dotsEl) {
        dotsEl.innerHTML = '';
        EASY_TUTORIAL_STEPS.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'easy-tutorial-dot' + (i === _easyTutorialIndex ? ' active' : '');
            dotsEl.appendChild(dot);
        });
    }
    if (nextBtn) {
        nextBtn.textContent = _easyTutorialIndex >= EASY_TUTORIAL_STEPS.length - 1 ? 'GOT IT' : 'NEXT';
    }
}

function _closeEasyTutorial() {
    const overlay = document.getElementById('easy-tutorial-overlay');
    if (overlay) overlay.classList.add('hidden');
    try {
        localStorage.setItem('7days_easyTutorialSeen', '1');
    } catch (e) { /* ignore storage errors */ }
    if (window.game && window.game.gameState) {
        window.game.gameState.isPaused = false;
    }
}

window.showEasyModeTutorial = function () {
    const overlay = document.getElementById('easy-tutorial-overlay');
    if (!overlay) return;
    _easyTutorialIndex = 0;
    if (window.game && window.game.gameState) {
        window.game.gameState.isPaused = true;
    }
    _renderEasyTutorialStep();
    overlay.classList.remove('hidden');
};

document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('easy-tutorial-next-btn');
    const skipBtn = document.getElementById('easy-tutorial-skip-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (_easyTutorialIndex >= EASY_TUTORIAL_STEPS.length - 1) {
                _closeEasyTutorial();
            } else {
                _easyTutorialIndex++;
                _renderEasyTutorialStep();
            }
        });
    }
    if (skipBtn) {
        skipBtn.addEventListener('click', _closeEasyTutorial);
    }
});
