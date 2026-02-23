/**
 * 7 DAYS... - TRANSITION SYSTEM
 * 
 * 🎬 WHAT IS THIS FILE?
 * Handles smooth fade in/out transitions between screens and game states.
 * Makes the game feel polished and professional!
 * 
 * 🎯 TRANSITION TYPES:
 * - fadeIn: Element fades in (opacity 0 → 1)
 * - fadeOut: Element fades out (opacity 1 → 0)
 * - crossFade: One element fades out while another fades in
 * 
 * 💡 HOW TO USE:
 * - TransitionSystem.fadeIn(element, duration, callback)
 * - TransitionSystem.fadeOut(element, duration, callback)
 * - TransitionSystem.crossFade(outElement, inElement, duration, callback)
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to set initial opacity before fade
 * - Not waiting for transition to complete before showing/hiding
 * - Using display:none before fade completes (breaks transition)
 */

class TransitionSystem {
    /**
     * 🎬 FADE IN: Smoothly fade an element in
     * @param {HTMLElement} element - Element to fade in
     * @param {number} duration - Duration in milliseconds (default: 500ms)
     * @param {Function} callback - Called when fade completes
     */
    static fadeIn(element, duration = 500, callback = null) {
        if (!element) return;
        
        // Ensure element is visible but transparent
        element.style.display = '';
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        // Force reflow
        element.offsetHeight;
        
        // Fade in
        element.style.opacity = '1';
        
        if (callback) {
            setTimeout(callback, duration);
        }
    }

    /**
     * 🎬 FADE OUT: Smoothly fade an element out
     * @param {HTMLElement} element - Element to fade out
     * @param {number} duration - Duration in milliseconds (default: 500ms)
     * @param {Function} callback - Called when fade completes
     */
    static fadeOut(element, duration = 500, callback = null) {
        if (!element) return;
        
        // Set transition
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';
        
        if (callback) {
            setTimeout(() => {
                element.style.display = 'none';
                callback();
            }, duration);
        } else {
            setTimeout(() => {
                element.style.display = 'none';
            }, duration);
        }
    }

    /**
     * 🎬 CROSS FADE: Fade out one element while fading in another
     * @param {HTMLElement} outElement - Element to fade out
     * @param {HTMLElement} inElement - Element to fade in
     * @param {number} duration - Duration in milliseconds (default: 500ms)
     * @param {Function} callback - Called when transition completes
     */
    static crossFade(outElement, inElement, duration = 500, callback = null) {
        if (!outElement || !inElement) return;
        
        // Start fade out
        this.fadeOut(outElement, duration);
        
        // Start fade in (slightly delayed for smoother transition)
        setTimeout(() => {
            this.fadeIn(inElement, duration, callback);
        }, duration * 0.3); // 30% overlap
    }

    /**
     * 🎬 FADE TO BLACK: Fade screen to black (for scene transitions)
     * @param {HTMLElement} overlay - Overlay element (creates if not provided)
     * @param {number} duration - Duration in milliseconds (default: 500ms)
     * @param {Function} callback - Called when fade completes
     */
    static fadeToBlack(overlay = null, duration = 500, callback = null) {
        let fadeOverlay = overlay;
        
        if (!fadeOverlay) {
            fadeOverlay = document.getElementById('fade-overlay');
            if (!fadeOverlay) {
                fadeOverlay = document.createElement('div');
                fadeOverlay.id = 'fade-overlay';
                fadeOverlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #000;
                    z-index: 9999;
                    opacity: 0;
                    pointer-events: none;
                `;
                document.body.appendChild(fadeOverlay);
            }
        }
        
        fadeOverlay.style.pointerEvents = 'auto';
        fadeOverlay.style.transition = `opacity ${duration}ms ease-in-out`;
        fadeOverlay.style.opacity = '1';
        
        if (callback) {
            setTimeout(callback, duration);
        }
    }

    /**
     * 🎬 FADE FROM BLACK: Fade screen from black back to visible
     * @param {HTMLElement} overlay - Overlay element
     * @param {number} duration - Duration in milliseconds (default: 500ms)
     * @param {Function} callback - Called when fade completes
     */
    static fadeFromBlack(overlay = null, duration = 500, callback = null) {
        const fadeOverlay = overlay || document.getElementById('fade-overlay');
        if (!fadeOverlay) return;
        
        fadeOverlay.style.transition = `opacity ${duration}ms ease-in-out`;
        fadeOverlay.style.opacity = '0';
        
        setTimeout(() => {
            fadeOverlay.style.pointerEvents = 'none';
            if (callback) callback();
        }, duration);
    }
}
