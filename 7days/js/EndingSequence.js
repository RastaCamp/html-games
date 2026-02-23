class EndingSequence {
    constructor() {
        this.endingA = {
            text: "Day 8. You're alive. But are you safe?",
            description: "You opened the door. Blinding light filled the basement. A figure reached down, smiling. But something was wrong—tattered uniform, strange symbol. You took their hand. The door closed behind you. Day 8 begins."
        };
        this.endingB = {
            text: "Day 8. No one came. But you're alive. For now.",
            description: "You stayed silent. The footsteps faded. The knocking stopped. You're alone in the basement. Day 8 begins. But you hear something outside. They'll be back."
        };
    }

    show() {
        const endingScreen = document.getElementById('ending-screen');
        const endingText = document.getElementById('ending-text');
        const endingChoice = document.getElementById('ending-choice');
        const endingResult = document.getElementById('ending-result');

        if (!endingScreen) return;

        // Play ending music/sound
        if (window.audioSystem) {
            window.audioSystem.stopMusic(); // Stop background music
            window.audioSystem.playSound('survived_end');
        }

        // Fade in ending screen
        endingScreen.classList.remove('hidden');
        endingScreen.style.opacity = '0';
        if (window.TransitionSystem) {
            window.TransitionSystem.fadeIn(endingScreen, 1000);
        } else {
            endingScreen.style.opacity = '1';
        }

        // Show initial text
        if (endingText) {
            endingText.textContent = "You hear footsteps above. Heavy. Purposeful. Knocking on the basement door. A voice calls out: 'Anyone down there? We're with... we're here to help.'";
        }

        // Show choice buttons
        if (endingChoice) {
            endingChoice.classList.remove('hidden');
        }
        if (endingResult) {
            endingResult.classList.add('hidden');
        }

        // Set globals for inline onclick (so buttons work even if addEventListener fails)
        const self = this;
        window.doEndingChoice = function (choice) {
            if (window.audioSystem) window.audioSystem.playSound('click');
            if (choice === 'open_door') self.showEnding('A');
            else self.showEnding('B');
        };
        window.doEndingMenu = function () {
            if (window.audioSystem) window.audioSystem.playSound('click');
            self.hide();
            if (window.returnToMenu) window.returnToMenu();
        };
        this.setupButtons();
    }

    setupButtons() {
        const openDoorBtn = document.getElementById('open-door-btn');
        const staySilentBtn = document.getElementById('stay-silent-btn');
        const menuBtn = document.getElementById('ending-menu-btn');

        if (openDoorBtn) {
            openDoorBtn.onclick = () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                this.showEnding('A');
            };
        }

        if (staySilentBtn) {
            staySilentBtn.onclick = () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                this.showEnding('B');
            };
        }

        if (menuBtn) {
            menuBtn.onclick = () => {
                if (window.audioSystem) window.audioSystem.playSound('click');
                this.hide();
                if (window.returnToMenu) window.returnToMenu();
            };
        }
    }

    showEnding(ending) {
        const endingText = document.getElementById('ending-text');
        const endingChoice = document.getElementById('ending-choice');
        const endingResult = document.getElementById('ending-result');
        const endingResultText = document.getElementById('ending-result-text');

        const endingData = ending === 'A' ? this.endingA : this.endingB;

        // Hide choice, show result
        if (endingChoice) endingChoice.classList.add('hidden');
        if (endingResult) endingResult.classList.remove('hidden');

        // Show ending text
        if (endingText) {
            endingText.textContent = endingData.text;
        }
        if (endingResultText) {
            endingResultText.textContent = endingData.description;
        }
    }

    hide() {
        const endingScreen = document.getElementById('ending-screen');
        if (endingScreen) {
            endingScreen.classList.add('hidden');
        }
    }
}
