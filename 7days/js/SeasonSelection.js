class SeasonSelection {
    constructor(weatherSystem) {
        this.weatherSystem = weatherSystem;
        this.selectionScreen = null;
    }

    show() {
        const screen = document.getElementById('season-selection');
        if (screen) {
            screen.classList.remove('hidden');
            this.selectionScreen = screen;
        }
    }

    hide() {
        if (this.selectionScreen) {
            this.selectionScreen.classList.add('hidden');
        }
    }
}
