/**
 * main.js - Entry point for 7 Days...
 * Sets up canvas (HiDPI), cover art, title screen, intro, and game handlers.
 * Rest button and panel (Nap/Full sleep/Wake up) and inventory double-click-to-use live here.
 */
let game = null;
let titleScreen = null;
let introSequence = null;

const LOGICAL_CANVAS_WIDTH = 1280;
const LOGICAL_CANVAS_HEIGHT = 720;

/** Match gameplay CSS breakpoint: narrow = mobile/tablet (cover scale + touch pan). */
function isNarrowGameViewport() {
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
}

let gameViewVpW = 0;
let gameViewVpH = 0;
let gameViewContentW = 0;
let gameViewContentH = 0;
/** When false (wide/desktop), pan is forced to center — full map visible (contain). */
let gameViewPanEnabled = false;
let gameViewPanX = 0;
let gameViewPanY = 0;

function clampGameViewportPan() {
    const cw = gameViewVpW;
    const ch = gameViewVpH;
    const dw = gameViewContentW;
    const dh = gameViewContentH;
    if (!gameViewPanEnabled) {
        gameViewPanX = (cw - dw) / 2;
        gameViewPanY = (ch - dh) / 2;
        return;
    }
    const minX = Math.min(0, cw - dw);
    const maxX = Math.max(0, cw - dw);
    const minY = Math.min(0, ch - dh);
    const maxY = Math.max(0, ch - dh);
    gameViewPanX = Math.max(minX, Math.min(maxX, gameViewPanX));
    gameViewPanY = Math.max(minY, Math.min(maxY, gameViewPanY));
}

function applyGameViewportTransform() {
    const inner = document.getElementById('game-play-inner');
    if (!inner) return;
    inner.style.transform = `translate(${gameViewPanX}px, ${gameViewPanY}px)`;
}

/** Center the “camera” after layout (call when entering gameplay). */
function centerGameViewportPan() {
    const cw = gameViewVpW;
    const ch = gameViewVpH;
    const dw = gameViewContentW;
    const dh = gameViewContentH;
    gameViewPanX = (cw - dw) / 2;
    gameViewPanY = (ch - dh) / 2;
    clampGameViewportPan();
    applyGameViewportTransform();
}

window.centerGameViewportPan = centerGameViewportPan;

/** HiDPI canvas: backing store = logical × devicePixelRatio; CSS fills #game-play-inner (size set by updateGameViewportLayout). */
function setupCanvas(canvas, logicalW = LOGICAL_CANVAS_WIDTH, logicalH = LOGICAL_CANVAS_HEIGHT) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(logicalW * dpr);
    canvas.height = Math.round(logicalH * dpr);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.logicalWidth = logicalW;
    canvas.logicalHeight = logicalH;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, dpr, logicalW, logicalH };
}

/**
 * Size the 1280×720 world in the center column: on mobile/tablet use cover scale (large, cropped — pan to see rest);
 * on desktop use contain (full map). Pan offsets are in CSS px on #game-play-inner; hit-test uses canvas getBoundingClientRect (includes transform).
 */
function updateGameViewportLayout() {
    const root = document.getElementById('game-play-root');
    const vp = document.getElementById('game-play-viewport');
    const inner = document.getElementById('game-play-inner');
    const canvas = document.getElementById('game-canvas');
    if (!vp || !inner || !canvas) return;
    if (root && root.classList.contains('hidden')) return;

    const lw = canvas.logicalWidth || LOGICAL_CANVAS_WIDTH;
    const lh = canvas.logicalHeight || LOGICAL_CANVAS_HEIGHT;
    const cw = vp.clientWidth;
    const ch = vp.clientHeight;
    if (cw < 2 || ch < 2) return;

    const useCover = isNarrowGameViewport();
    const scale = useCover
        ? Math.max(cw / lw, ch / lh)
        : Math.min(cw / lw, ch / lh);
    /* Ceil avoids subpixel gaps where inner is 1px shorter than viewport — touches then hit #game-play-viewport (no pan handlers). */
    const dw = Math.max(2, Math.ceil(lw * scale - 1e-9));
    const dh = Math.max(2, Math.ceil(lh * scale - 1e-9));
    inner.style.width = `${dw}px`;
    inner.style.height = `${dh}px`;

    const pointerLayer = document.getElementById('game-play-pointer-layer');
    if (pointerLayer) {
        pointerLayer.style.width = '';
        pointerLayer.style.height = '';
        pointerLayer.style.left = '';
        pointerLayer.style.top = '';
        pointerLayer.style.right = '';
        pointerLayer.style.bottom = '';
    }

    gameViewVpW = cw;
    gameViewVpH = ch;
    gameViewContentW = dw;
    gameViewContentH = dh;
    gameViewPanEnabled = useCover;

    clampGameViewportPan();
    applyGameViewportTransform();
}

const GAME_VIEWPORT_PAN_THRESHOLD_PX = 12;

function initGameViewportPanning() {
    const playViewport = document.getElementById('game-play-viewport');
    if (!playViewport || playViewport.dataset.panInit === '1') return;
    playViewport.dataset.panInit = '1';

    /** Full inner-sized surface (moves with transform); falls back to viewport if missing. */
    const surface = document.getElementById('game-play-pointer-layer') || playViewport;

    let activePointerId = null;
    let startX = 0;
    let startY = 0;
    let basePanX = 0;
    let basePanY = 0;
    let dragging = false;

    function releaseCaptureSafe(id) {
        try {
            surface.releasePointerCapture(id);
        } catch (_) {}
    }

    function cleanupPointer(e) {
        if (e.pointerId !== activePointerId) return;
        releaseCaptureSafe(e.pointerId);
        if (
            !dragging &&
            (e.pointerType === 'touch' || e.pointerType === 'pen') &&
            typeof window.__gamePerformWorldClick === 'function'
        ) {
            window.__gamePerformWorldClick(e.clientX, e.clientY);
        }
        activePointerId = null;
        dragging = false;
    }

    function beginPanInteraction(e) {
        if (e.button != null && e.button !== 0) return;
        if (e.target && e.target.closest && e.target.closest('#closet-back-btn')) return;
        const touchLike = e.pointerType === 'touch' || e.pointerType === 'pen';
        if (touchLike) {
            e.preventDefault();
            if (gameViewPanEnabled) {
                try {
                    surface.setPointerCapture(e.pointerId);
                } catch (_) {}
            }
        }
        activePointerId = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        basePanX = gameViewPanX;
        basePanY = gameViewPanY;
        dragging = false;
    }

    surface.addEventListener('pointerdown', beginPanInteraction, { capture: true, passive: false });

    const playInner = document.getElementById('game-play-inner');
    /* Letterbox gutters + any gap where inner receives the event instead of #game-play-pointer-layer */
    playViewport.addEventListener(
        'pointerdown',
        (e) => {
            if (e.target !== playViewport && e.target !== playInner) return;
            beginPanInteraction(e);
        },
        { capture: true, passive: false }
    );

    if (typeof window !== 'undefined' && window.__7D_DEBUG_POINTER) {
        const logPtr = (tag, e) => {
            const t = e.target && e.target.id ? `#${e.target.id}` : (e.target && e.target.className) || e.target;
            console.log('[7d pointer]', tag, Math.round(e.clientX), Math.round(e.clientY), String(t));
        };
        surface.addEventListener('pointerdown', (e) => logPtr('layer', e), { capture: false, passive: true });
        playViewport.addEventListener('pointerdown', (e) => logPtr('viewport-cap', e), { capture: true, passive: true });
    }

    surface.addEventListener(
        'pointermove',
        (e) => {
            if (e.pointerId !== activePointerId || !gameViewPanEnabled) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const dist2 = dx * dx + dy * dy;
            const touchLike = e.pointerType === 'touch' || e.pointerType === 'pen';

            if (!dragging) {
                if (dist2 < GAME_VIEWPORT_PAN_THRESHOLD_PX * GAME_VIEWPORT_PAN_THRESHOLD_PX) return;
                dragging = true;
                if (!touchLike) {
                    try {
                        surface.setPointerCapture(e.pointerId);
                    } catch (_) {}
                }
            }
            gameViewPanX = basePanX + dx;
            gameViewPanY = basePanY + dy;
            clampGameViewportPan();
            applyGameViewportTransform();
        },
        true
    );

    surface.addEventListener('pointerup', cleanupPointer, true);
    surface.addEventListener('pointercancel', cleanupPointer, true);
}

let gameViewportResizeObserver = null;
function attachGameViewportResizeObserver() {
    const vp = document.getElementById('game-play-viewport');
    if (!vp || typeof ResizeObserver === 'undefined') return;
    if (gameViewportResizeObserver) gameViewportResizeObserver.disconnect();
    gameViewportResizeObserver = new ResizeObserver(() => {
        updateGameViewportLayout();
    });
    gameViewportResizeObserver.observe(vp);
}

window.updateGameViewportLayout = updateGameViewportLayout;

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    setupCanvas(canvas, LOGICAL_CANVAS_WIDTH, LOGICAL_CANVAS_HEIGHT);
    attachGameViewportResizeObserver();
    initGameViewportPanning();
    if (window.matchMedia) {
        const mq = window.matchMedia('(max-width: 1024px)');
        const onBp = () => {
            requestAnimationFrame(() => {
                updateGameViewportLayout();
                centerGameViewportPan();
            });
        };
        if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onBp);
        else if (typeof mq.addListener === 'function') mq.addListener(onBp);
    }
    window.addEventListener('resize', () => {
        requestAnimationFrame(updateGameViewportLayout);
    });
    window.addEventListener('orientationchange', () => {
        requestAnimationFrame(() => {
            updateGameViewportLayout();
            centerGameViewportPan();
        });
    });
    requestAnimationFrame(updateGameViewportLayout);

    // Pause menu: always show/hide panel; toggle game only if game exists
    window.doPauseToggle = function () {
        const panel = document.getElementById('menu-panel');
        const btn = document.getElementById('pause-btn');
        const g = window.game;
        const isPaused = g && g.gameState && g.gameState.isPaused;
        if (panel) {
            if (isPaused) {
                panel.classList.add('hidden');
                if (btn) btn.textContent = '⏸ Pause';
                if (g && g.gameState) g.gameState.resume();
            } else {
                panel.classList.remove('hidden');
                panel.style.setProperty('display', 'flex', 'important');
                if (btn) btn.textContent = '▶ Resume';
                if (g && g.gameState) g.gameState.pause();
                const restPanel = document.getElementById('rest-panel');
                if (restPanel) restPanel.classList.add('hidden');
            }
        }
    };
    window.doPauseResume = function () {
        const g = window.game;
        if (!g) return;
        g.gameState.resume();
        const panel = document.getElementById('menu-panel');
        if (panel) {
            panel.classList.add('hidden');
            panel.style.removeProperty('display');
        }
        const btn = document.getElementById('pause-btn');
        if (btn) btn.textContent = '⏸ Pause';
    };
    window.doPauseSave = function () {
        const g = window.game;
        if (g) {
            const result = g.saveSystem.save(g);
            alert(result.message);
        }
    };
    window.doQuitToMenu = function () {
        if (!confirm('Return to main menu? Progress will be saved.')) return;
        const g = window.game;
        if (g) {
            g.saveSystem.save(g);
            g.stop();
        }
        window.game = null;
        game = null;
        const panel = document.getElementById('menu-panel');
        const btn = document.getElementById('pause-btn');
        if (panel) {
            panel.classList.add('hidden');
            panel.style.setProperty('display', 'none', 'important');
        }
        if (btn) btn.textContent = '⏸ Pause';
        const gameCanvas = document.getElementById('game-canvas');
        const sceneBg = document.getElementById('scene-background');
        const gamePlayRoot = document.getElementById('game-play-root');
        const optionsMenu = document.getElementById('options-menu');
        const tipJarMenu = document.getElementById('tip-jar-menu');
        const inventoryPanel = document.getElementById('inventory-panel');
        const messageLog = document.getElementById('message-log');
        const craftingPanel = document.getElementById('crafting-panel');
        const itemExamine = document.getElementById('item-examine');
        const interactionHint = document.getElementById('interaction-hint');
        const deathScreenEl = document.getElementById('death-screen');
        if (sceneBg) sceneBg.classList.add('hidden');
        if (gameCanvas) gameCanvas.classList.add('hidden');
        if (gamePlayRoot) gamePlayRoot.classList.add('hidden');
        if (optionsMenu) optionsMenu.classList.add('hidden');
        if (tipJarMenu) tipJarMenu.classList.add('hidden');
        if (inventoryPanel) inventoryPanel.classList.add('hidden');
        if (messageLog) messageLog.classList.add('hidden');
        if (craftingPanel) craftingPanel.classList.add('hidden');
        if (itemExamine) itemExamine.classList.add('hidden');
        if (interactionHint) interactionHint.classList.add('hidden');
        if (deathScreenEl) {
            deathScreenEl.classList.add('hidden');
            deathScreenEl.style.opacity = '1';
        }
        const titleScreenEl = document.getElementById('title-screen');
        if (titleScreenEl) {
            titleScreenEl.classList.remove('hidden');
            titleScreenEl.style.removeProperty('display');
        }
        if (titleScreen) titleScreen.show();
    };

    // Initialize systems
    const saveSystem = new SaveSystem();
    const deathMarkerSystem = new DeathMarkerSystem();
    const tipJar = new TipJarSystem();
    const weatherSystem = new WeatherSystem();

    function loadStartingTimeFromStorage() {
        try {
            const raw = localStorage.getItem('7days_settings');
            const settings = raw ? JSON.parse(raw) : {};
            window.startingTimeOfDay = settings.startingTimeOfDay || 'morning';
        } catch (e) {
            window.startingTimeOfDay = 'morning';
        }
    }
    loadStartingTimeFromStorage();

    window.syncStartingTimeButtons = function () {
        loadStartingTimeFromStorage();
        const t = window.startingTimeOfDay || 'morning';
        document.querySelectorAll('.start-time-btn').forEach(function (b) {
            b.classList.toggle('selected', (b.getAttribute('data-time') || '') === t);
        });
    };

    const seasonSelection = new SeasonSelection(weatherSystem);
    const _seasonShow = seasonSelection.show.bind(seasonSelection);
    seasonSelection.show = function () {
        _seasonShow();
        if (typeof window.syncStartingTimeButtons === 'function') {
            window.syncStartingTimeButtons();
        }
    };

    document.querySelectorAll('.start-time-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            window.startingTimeOfDay = btn.getAttribute('data-time') || 'morning';
            document.querySelectorAll('.start-time-btn').forEach(function (b) {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');
            try {
                const raw = localStorage.getItem('7days_settings');
                const settings = raw ? JSON.parse(raw) : {};
                settings.startingTimeOfDay = window.startingTimeOfDay;
                localStorage.setItem('7days_settings', JSON.stringify(settings));
            } catch (e) {}
        });
    });
    window.syncStartingTimeButtons();

    titleScreen = new TitleScreen(saveSystem, deathMarkerSystem, tipJar);
    introSequence = new IntroSequence();

    // Cover art: show first, then fade to title screen (use TransitionSystem class directly; window.TransitionSystem set later)
    const coverArtScreen = document.getElementById('cover-art-screen');
    const coverArtImg = document.getElementById('cover-art-img');
    const titleScreenEl = document.getElementById('title-screen');
    if (coverArtScreen && coverArtImg) {
        const base = (function () {
            const h = typeof window !== 'undefined' && window.location && window.location.href;
            if (!h) return '';
            const i = h.lastIndexOf('/');
            return i >= 0 ? h.substring(0, i + 1) : '';
        })();
        coverArtImg.style.opacity = '0';
        coverArtImg.src = base + 'VISUALS/cover_art.png';
        coverArtImg.onerror = function () { this.onerror = null; this.src = base + 'visuals/cover_art.png'; };
        function startCoverSequence() {
            if (typeof TransitionSystem === 'undefined') {
                if (titleScreenEl) titleScreenEl.classList.remove('hidden');
                if (titleScreen) titleScreen.show();
                if (coverArtScreen) coverArtScreen.classList.add('hidden');
                return;
            }
            TransitionSystem.fadeIn(coverArtImg, 1200, function () {
                setTimeout(function () {
                    TransitionSystem.fadeOut(coverArtScreen, 800, function () {
                        if (coverArtScreen) coverArtScreen.classList.add('hidden');
                        if (titleScreenEl) titleScreenEl.classList.remove('hidden');
                        if (titleScreen) titleScreen.show();
                    });
                }, 2500);
            });
        }
        if (coverArtImg.complete && coverArtImg.naturalWidth) {
            startCoverSequence();
        } else {
            coverArtImg.onload = startCoverSequence;
        }
    } else {
        if (titleScreenEl) titleScreenEl.classList.remove('hidden');
        if (titleScreen) titleScreen.show();
    }

    window.weatherSystem = weatherSystem;
    window.seasonSelection = seasonSelection;
    window.introSequence = introSequence;
    window.skipToGameplay = function () {
        if (window.introSequence) {
            window.introSequence.stopNewsCasterFlashing();
            window.introSequence._skipRequested = true;
            if (typeof window.introSequence.transitionToGameplay === 'function') {
                window.introSequence.transitionToGameplay();
            }
        }
    };

    // Make systems globally accessible
    window.deathMarkerSystem = deathMarkerSystem;
    window.tipJar = tipJar;
    window.TransitionSystem = TransitionSystem; // Make transitions globally available

    // Global handlers for inline onclick (so New Game and season buttons always work)
    window.doNewGame = function () {
        const titleEl = document.getElementById('title-screen');
        if (titleEl && window.TransitionSystem) {
            window.TransitionSystem.fadeOut(titleEl, 500, function () {
                titleEl.classList.add('hidden');
                if (window.seasonSelection) window.seasonSelection.show();
                else if (window.introSequence) window.introSequence.start();
            });
        } else {
            if (titleEl) titleEl.classList.add('hidden');
            if (window.seasonSelection) window.seasonSelection.show();
            else if (window.introSequence) window.introSequence.start();
        }
    };

    window.doSeasonChoice = function (season) {
        if (!window.weatherSystem || !window.seasonSelection || !window.introSequence) return;
        const s = season === 'random'
            ? ['spring', 'summer', 'fall', 'winter'][Math.floor(Math.random() * 4)]
            : season;
        window.weatherSystem.setSeason(s);
        if (typeof window.weatherSystem.rollDailyWeather === 'function') {
            window.weatherSystem.rollDailyWeather();
        }
        try {
            const raw = localStorage.getItem('7days_settings');
            const settings = raw ? JSON.parse(raw) : {};
            settings.startingTimeOfDay = window.startingTimeOfDay || settings.startingTimeOfDay || 'morning';
            localStorage.setItem('7days_settings', JSON.stringify(settings));
        } catch (e) {}
        window.seasonSelection.hide();
        window.introSequence.start();
    };

    // Also keep startIntroSequence for TitleScreen's addEventListener path
    window.startIntroSequence = () => {
        if (window.seasonSelection) {
            window.seasonSelection.show();
        } else if (introSequence) {
            introSequence.start();
        }
    };

    window.startGameplay = async () => {
        game = new Game(canvas);
        window.game = game;
        if (game.tipJar) window.tipJar = game.tipJar;
        const loadingScreen = document.getElementById('loading-screen');
        await game.sceneRenderer.placementOverridesReady;
        if (loadingScreen) loadingScreen.classList.add('hidden');
        const sceneBg = document.getElementById('scene-background');
        const gameCanvas = document.getElementById('game-canvas');
        const gamePlayRoot = document.getElementById('game-play-root');
        if (gamePlayRoot) gamePlayRoot.classList.remove('hidden');
        if (sceneBg) sceneBg.classList.remove('hidden');
        if (gameCanvas) gameCanvas.classList.remove('hidden');
        requestAnimationFrame(() => {
            updateGameViewportLayout();
            centerGameViewportPan();
        });
        setupGameHandlers();
        await game.start();
        game.addMessage('Welcome to 7 Days... Survive 7 days in the basement.');
    };

    // Pause: button click and Escape key — use onclick so it always runs
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (window.doPauseToggle) window.doPauseToggle();
        };
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const panel = document.getElementById('menu-panel');
            if (panel && !panel.classList.contains('hidden')) {
                if (window.doPauseToggle) window.doPauseToggle();
            } else if (window.game && !window.game.gameState.isGameOver) {
                if (window.doPauseToggle) window.doPauseToggle();
            }
            e.preventDefault();
        }
    });

    window.loadGameAndStart = async () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.remove('hidden');
        game = new Game(canvas);
        window.game = game;
        await game.sceneRenderer.placementOverridesReady;
        if (loadingScreen) loadingScreen.classList.add('hidden');
        const sceneBg = document.getElementById('scene-background');
        const gameCanvas = document.getElementById('game-canvas');
        const gamePlayRoot = document.getElementById('game-play-root');
        if (gamePlayRoot) gamePlayRoot.classList.remove('hidden');
        if (sceneBg) sceneBg.classList.remove('hidden');
        if (gameCanvas) gameCanvas.classList.remove('hidden');
        requestAnimationFrame(() => {
            updateGameViewportLayout();
            centerGameViewportPan();
        });

        const result = game.saveSystem.load(game);
        if (result.success) {
            setupGameHandlers();
            await game.start();
            game.updateUI();
            game.addMessage('Game loaded successfully!');
        } else {
            alert(result.message);
            titleScreen.show();
        }
    };

    window.restartGame = async () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.remove('hidden');
        if (game) game.stop();
        game = new Game(canvas);
        window.game = game;
        await game.sceneRenderer.placementOverridesReady;
        if (loadingScreen) loadingScreen.classList.add('hidden');
        const sceneBg = document.getElementById('scene-background');
        const gameCanvas = document.getElementById('game-canvas');
        const gamePlayRoot = document.getElementById('game-play-root');
        if (gamePlayRoot) gamePlayRoot.classList.remove('hidden');
        if (sceneBg) sceneBg.classList.remove('hidden');
        if (gameCanvas) gameCanvas.classList.remove('hidden');
        requestAnimationFrame(() => {
            updateGameViewportLayout();
            centerGameViewportPan();
        });
        setupGameHandlers();
        await game.start();
        game.addMessage('New game started. Survive 7 days in the basement.');
    };

    window.returnToMenu = () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.add('hidden');
        const gameCanvas = document.getElementById('game-canvas');
        const sceneBg = document.getElementById('scene-background');
        const gamePlayRoot = document.getElementById('game-play-root');
        const menuPanel = document.getElementById('menu-panel');
        const optionsMenu = document.getElementById('options-menu');
        const tipJarMenu = document.getElementById('tip-jar-menu');
        const inventoryPanel = document.getElementById('inventory-panel');
        const messageLog = document.getElementById('message-log');
        const craftingPanel = document.getElementById('crafting-panel');
        const itemExamine = document.getElementById('item-examine');
        const interactionHint = document.getElementById('interaction-hint');
        if (game) {
            game.stop();
            game = null;
        }
        window.game = null;
        if (sceneBg) sceneBg.classList.add('hidden');
        if (gameCanvas) gameCanvas.classList.add('hidden');
        if (gamePlayRoot) gamePlayRoot.classList.add('hidden');
        if (menuPanel) {
            menuPanel.classList.add('hidden');
            menuPanel.style.setProperty('display', 'none', 'important');
        }
        if (optionsMenu) optionsMenu.classList.add('hidden');
        if (tipJarMenu) tipJarMenu.classList.add('hidden');
        if (inventoryPanel) inventoryPanel.classList.add('hidden');
        if (messageLog) messageLog.classList.add('hidden');
        if (craftingPanel) craftingPanel.classList.add('hidden');
        if (itemExamine) itemExamine.classList.add('hidden');
        if (interactionHint) interactionHint.classList.add('hidden');
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) pauseBtn.textContent = '⏸ Pause';
        const deathScreenEl = document.getElementById('death-screen');
        if (deathScreenEl) {
            deathScreenEl.classList.add('hidden');
            deathScreenEl.style.opacity = '1';
        }
        const titleScreenEl = document.getElementById('title-screen');
        if (titleScreenEl) {
            titleScreenEl.classList.remove('hidden');
            titleScreenEl.style.removeProperty('display');
        }
        if (titleScreen) titleScreen.show();
    };

    function setupGameHandlers() {
        // Pause globals already set on DOMContentLoaded; no need to redefine

        // Map screen coords to logical canvas coords (always 1280×720)
        function toCanvasCoords(e, el) {
            const rect = el.getBoundingClientRect();
            const logicalW = el.logicalWidth ?? LOGICAL_CANVAS_WIDTH;
            const logicalH = el.logicalHeight ?? LOGICAL_CANVAS_HEIGHT;
            return {
                x: (e.clientX - rect.left) * (logicalW / rect.width),
                y: (e.clientY - rect.top) * (logicalH / rect.height)
            };
        }

        // Click handler: move Adam to click or to location (use window.game so current game is always used)
        function onGameAreaClick(e) {
            const g = window.game || game;
            if (!g || g.gameState.isPaused || g.gameState.isGameOver) return;
            const p = toCanvasCoords(e, canvas);
            if (g.sceneRenderer && g.sceneRenderer.currentScene === 'B' && g.sceneRenderer.currentSceneType === 'closet') {
                const boxX = 40, boxY = 300, boxW = 120, boxH = 120;
                if (p.x >= boxX && p.x <= boxX + boxW && p.y >= boxY && p.y <= boxY + boxH) {
                    if (g.returnFromCloset) g.returnFromCloset();
                    return;
                }
            }
            if (g.sceneRenderer) {
                const location = g.sceneRenderer.getLocationAt(p.x, p.y);
                if (location) {
                    if (location.id === 'L36') {
                        if (g.goToClosetScene) g.goToClosetScene();
                        return;
                    }
                    if (g.isNearLocationForInteraction && g.isNearLocationForInteraction(location)) {
                        handleLocationClick(location, g);
                    } else {
                        g.setMoveTargetToLocation(location);
                    }
                } else {
                    g.handleCanvasClick(p.x, p.y);
                }
            } else {
                g.handleCanvasClick(p.x, p.y);
            }
        }

        const pointerSurface = document.getElementById('game-play-pointer-layer') || canvas;
        pointerSurface.addEventListener('click', onGameAreaClick);

        /** Touch/pen taps (after pan-vs-tap on #game-play-pointer-layer); mouse uses same surface as canvas. */
        window.__gamePerformWorldClick = function (clientX, clientY) {
            onGameAreaClick({ clientX, clientY });
        };

        const closetBackBtn = document.getElementById('closet-back-btn');
        if (closetBackBtn) {
            closetBackBtn.addEventListener('click', () => {
                const g = window.game || game;
                if (g && typeof g.returnFromCloset === 'function') g.returnFromCloset();
            });
        }

        const gSync = window.game || game;
        if (gSync && typeof gSync.syncClosetBackButton === 'function') gSync.syncClosetBackButton();
        
        // Handle location clicks (new scene system): check sceneLoot, show found items, take into inventory
        function handleLocationClick(location, game) {
            if (!location || !game) return;
            if (typeof game.interactWithLocation === 'function') {
                game.interactWithLocation(location.id);
                return;
            }
            if (!game.locationSystem) return;
            const result = game.locationSystem.searchLocation(location.id, game);
            if (result.message) game.addMessage(result.message);
            if (result.success && result.items && result.items.length > 0 && game.locationSystem.syncFromSceneLoot) {
                game.locationSystem.syncFromSceneLoot(game);
            }
        }

        // H toggles yellow zone overlay (off by default)
        document.addEventListener('keydown', (e) => {
            const g = window.game || game;
            if (!g) return;
            if ((e.key !== 'h' && e.key !== 'H')) return;
            if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
            g.showHitboxCalibration = !g.showHitboxCalibration;
            if (g.sceneRenderer) g.sceneRenderer.setDebugMode(g.showHitboxCalibration);
        });
        
        // Hover: use pointer layer when present so coords match the same hit target as pan/tap
        pointerSurface.addEventListener('mousemove', (e) => {
            if (!game) return;
            const p = toCanvasCoords(e, canvas);
            game.calibrationMouseX = p.x;
            game.calibrationMouseY = p.y;
            const x = p.x;
            const y = p.y;
            
            // Update scene renderer hover (new system)
            if (game.sceneRenderer) {
                game.sceneRenderer.updateHover(x, y);
                const location = game.sceneRenderer.getLocationAt(x, y);
                if (location) {
                    pointerSurface.style.cursor = 'pointer';
                    const hintEl = document.getElementById('interaction-hint');
                    if (hintEl) {
                        hintEl.textContent = location.name;
                        hintEl.classList.remove('hidden');
                    }
                    
                    // Update flashlight mouse position
                    if (game.flashlightSystem) {
                        game.flashlightSystem.setMousePosition(x, y);
                    }
                    
                    // Store mouse position for character facing
                    game.lastMouseX = x;
                    game.lastMouseY = y;
                    
                    return;
                }
            }
            
            // Update flashlight mouse position even if not over a location
            if (game.flashlightSystem) {
                game.flashlightSystem.setMousePosition(x, y);
            }
            game.lastMouseX = x;
            game.lastMouseY = y;
            
            // Fallback: Update old renderer hover
            if (game.renderer) {
                game.renderer.updateHover(x, y, game);
            }
            
            // Update cursor
            const obj = game.interactables ? game.interactables.getObjectAt(x, y) : null;
            if (obj) {
                pointerSurface.style.cursor = 'pointer';
                const hintEl = document.getElementById('interaction-hint');
                if (hintEl) {
                    hintEl.textContent = obj.name;
                    hintEl.classList.remove('hidden');
                }
            } else {
                pointerSurface.style.cursor = 'crosshair';
                const hintEl = document.getElementById('interaction-hint');
                if (hintEl) {
                    hintEl.classList.add('hidden');
                }
            }
        });

        // ─── Rest button and panel: Nap / Full sleep using best available surface ───
        // Picks best surface from inventory (sleeping_bag > makeshift_bedding > cardboard > floor).
        function getBestSleepSurface(g) {
            if (!g || !g.inventory) return 'floor';
            if (g.inventory.hasItem('sleeping_bag', 1)) return 'sleeping_bag';
            if (g.inventory.hasItem('makeshift_bedding', 1)) return 'makeshift_bedding';
            if (g.inventory.hasItem('cardboard', 1)) return 'cardboard';
            return 'floor';
        }
        function getSurfaceLabel(surfaceId) {
            const labels = { floor: 'the floor', cardboard: 'cardboard', sleeping_bag: 'sleeping bag', makeshift_bedding: 'makeshift bedding', armchair: 'armchair', makeshift_bed: 'makeshift bed', bed: 'bed' };
            return labels[surfaceId] || surfaceId.replace(/_/g, ' ');
        }
        const restBtn = document.getElementById('rest-btn');
        const restPanel = document.getElementById('rest-panel');
        const restNapBtn = document.getElementById('rest-nap-btn');
        const restFullBtn = document.getElementById('rest-full-btn');
        const restWakeBtn = document.getElementById('rest-wake-btn');
        // Called each frame from Game.update() so Rest button state stays in sync (e.g. after load while sleeping).
        window.updateRestButton = function(isSleeping) {
            if (!restBtn) return;
            restBtn.textContent = isSleeping ? 'Sleeping...' : 'Rest';
            restBtn.disabled = !!isSleeping;
            if (restPanel) {
                if (restNapBtn) restNapBtn.classList.toggle('hidden', !!isSleeping);
                if (restFullBtn) restFullBtn.classList.toggle('hidden', !!isSleeping);
                if (restWakeBtn) restWakeBtn.classList.toggle('hidden', !isSleeping);
            }
        };
        if (restBtn) {
            restBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const g = window.game || game;
                if (!g || g.gameState.isGameOver) return;
                if (g.gameState.isPaused) return;
                if (!restPanel) return;
                const sleeping = g.meters && g.meters.isSleeping;
                if (sleeping) {
                    restPanel.classList.remove('hidden');
                    if (restNapBtn) restNapBtn.classList.add('hidden');
                    if (restFullBtn) restFullBtn.classList.add('hidden');
                    if (restWakeBtn) restWakeBtn.classList.remove('hidden');
                } else {
                    restPanel.classList.remove('hidden');
                    if (restNapBtn) restNapBtn.classList.remove('hidden');
                    if (restFullBtn) restFullBtn.classList.remove('hidden');
                    if (restWakeBtn) restWakeBtn.classList.add('hidden');
                }
            });
        }
        if (restNapBtn) {
            restNapBtn.addEventListener('click', () => {
                const g = window.game || game;
                if (!g || !g.meters || g.meters.isSleeping) return;
                const surface = getBestSleepSurface(g);
                g.meters.startNap(surface);
                g.addMessage('You lie down for a nap on ' + getSurfaceLabel(surface) + '.');
                if (restPanel) restPanel.classList.add('hidden');
            });
        }
        if (restFullBtn) {
            restFullBtn.addEventListener('click', () => {
                const g = window.game || game;
                if (!g || !g.meters || g.meters.isSleeping) return;
                const surface = getBestSleepSurface(g);
                g.meters.startFullSleep(surface);
                g.addMessage('You settle down for the night on ' + getSurfaceLabel(surface) + '.');
                if (restPanel) restPanel.classList.add('hidden');
            });
        }
        if (restWakeBtn) {
            restWakeBtn.addEventListener('click', () => {
                const g = window.game || game;
                if (!g || !g.meters) return;
                g.meters.stopSleep();
                if (g.addMessage) g.addMessage('You get up.');
                if (restPanel) restPanel.classList.add('hidden');
            });
        }
        document.addEventListener('click', (e) => {
            if (restPanel && !restPanel.classList.contains('hidden') && restBtn && !restBtn.contains(e.target) && !restPanel.contains(e.target)) {
                restPanel.classList.add('hidden');
            }
        });

        // Pause button: show/hide menu panel and toggle game state
        const pauseBtn = document.getElementById('pause-btn');
        const menuPanel = document.getElementById('menu-panel');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (window.doPauseToggle) window.doPauseToggle();
            });
        }

        // Pause menu handlers
        const pauseResumeBtn = document.getElementById('pause-resume-btn');
        const pauseSaveBtn = document.getElementById('pause-save-btn');
        const pauseOptionsBtn = document.getElementById('pause-options-btn');
        const pauseQuitBtn = document.getElementById('pause-quit-btn');

        if (pauseResumeBtn) {
            pauseResumeBtn.addEventListener('click', () => {
                if (game) {
                    game.gameState.resume();
                    if (menuPanel) menuPanel.classList.add('hidden');
                    const pauseBtn = document.getElementById('pause-btn');
                    if (pauseBtn) pauseBtn.textContent = '⏸ Pause';
                }
            });
        }

        if (pauseSaveBtn) {
            pauseSaveBtn.addEventListener('click', () => {
                if (game) {
                    const result = game.saveSystem.save(game);
                    alert(result.message);
                }
            });
        }

        if (pauseOptionsBtn) {
            pauseOptionsBtn.addEventListener('click', () => {
                if (menuPanel) {
                    menuPanel.classList.add('hidden');
                    menuPanel.style.setProperty('display', 'none', 'important');
                }
                const pauseBtn = document.getElementById('pause-btn');
                if (pauseBtn) pauseBtn.textContent = '⏸ Pause';
                if (game && game.gameState) game.gameState.resume();
                const optionsMenu = document.getElementById('options-menu');
                if (optionsMenu) {
                    optionsMenu.classList.remove('hidden');
                    titleScreen.setupOptions();
                }
            });
        }

        // Quit to Menu: explicit handler so click is not lost (stops game and shows start menu)
        if (pauseQuitBtn) {
            pauseQuitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.doQuitToMenu) window.doQuitToMenu();
            });
        }

        // Tip Jar button
        const pauseTipJarBtn = document.getElementById('pause-tip-jar-btn');
        const tipJarMenu = document.getElementById('tip-jar-menu');
        const tipJarCloseBtn = document.getElementById('tip-jar-close-btn');
        const tipCategoryBtns = document.querySelectorAll('.tip-category-btn');
        const tipDisplay = document.getElementById('tip-display');
        const tipText = document.getElementById('tip-text');
        const pauseTipCount = document.getElementById('pause-tip-count');
        const tipJarCount = document.getElementById('tip-jar-count');

        function updateTipJarUI() {
            const currentTipJar = window.tipJar || (game && game.tipJar);
            if (!currentTipJar) return;
            const tips = currentTipJar.getCurrentTips();
            if (pauseTipCount) pauseTipCount.textContent = tips;
            if (tipJarCount) tipJarCount.textContent = tips;
            
            // Enable/disable buttons
            tipCategoryBtns.forEach(btn => {
                btn.disabled = tips <= 0;
            });
        }

        if (pauseTipJarBtn) {
            pauseTipJarBtn.addEventListener('click', () => {
                if (menuPanel) {
                    menuPanel.classList.add('hidden');
                    menuPanel.style.setProperty('display', 'none', 'important');
                }
                const pauseBtn = document.getElementById('pause-btn');
                if (pauseBtn) pauseBtn.textContent = '⏸ Pause';
                if (game && game.gameState) game.gameState.resume();
                if (tipJarMenu) {
                    tipJarMenu.classList.remove('hidden');
                    updateTipJarUI();
                }
            });
        }

        if (tipJarCloseBtn) {
            tipJarCloseBtn.addEventListener('click', () => {
                if (tipJarMenu) {
                    tipJarMenu.classList.add('hidden');
                    if (tipDisplay) tipDisplay.classList.add('hidden');
                }
            });
        }

        tipCategoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentTipJar = window.tipJar || (game && game.tipJar);
                if (!currentTipJar) return;
                const category = btn.dataset.category;
                const tip = currentTipJar.getTip(category);
                
                if (tip) {
                    if (tipText) tipText.textContent = tip;
                    if (tipDisplay) tipDisplay.classList.remove('hidden');
                    updateTipJarUI();
                } else {
                    alert('Not enough tips!');
                }
            });
        });

        // Update tip count periodically
        setInterval(() => {
            updateTipJarUI();
        }, 1000);

        // Crafting panel handlers
        const craftBtn = document.getElementById('craft-btn');
        const clearCraftBtn = document.getElementById('clear-craft-btn');
        const craftingPanel = document.getElementById('crafting-panel');
        
        if (craftBtn) {
            craftBtn.addEventListener('click', () => {
                if (game) game.attemptCraft();
            });
        }
        
        if (clearCraftBtn) {
            clearCraftBtn.addEventListener('click', () => {
                if (game) {
                    game.craftingSlots = [];
                    game.updateCraftingDisplay();
                }
            });
        }
        
        // Make crafting slots clickable to add items
        const craftSlots = document.querySelectorAll('.craft-slot');
        craftSlots.forEach((slot, index) => {
            slot.addEventListener('click', () => {
                if (!game) return;
                // Open inventory selection (simplified - could be improved with drag-drop)
                const itemId = prompt('Enter item ID to add to this slot (or leave empty to clear):');
                if (itemId) {
                    const item = game.inventory.getItem(itemId);
                    if (item) {
                        game.addToCraftingSlot(item, index);
                    } else {
                        alert('Item not found in inventory');
                    }
                } else {
                    if (game.craftingSlots && game.craftingSlots[index]) {
                        game.craftingSlots[index] = null;
                        game.updateCraftingDisplay();
                    }
                }
            });
        });
        
        // Make inventory items clickable for crafting (when crafting panel is open)
        document.addEventListener('click', (e) => {
            if (!game) return;
            const inventorySlot = e.target.closest('.inventory-slot:not(.empty)');
            if (inventorySlot && craftingPanel && !craftingPanel.classList.contains('hidden')) {
                const slotIndex = Array.from(inventorySlot.parentElement.children).indexOf(inventorySlot);
                if (slotIndex < game.inventory.items.length) {
                    const item = game.inventory.items[slotIndex];
                    // Find first empty crafting slot
                    for (let i = 0; i < 3; i++) {
                        if (!game.craftingSlots || !game.craftingSlots[i]) {
                            game.addToCraftingSlot(item, i);
                            break;
                        }
                    }
                }
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!game) return;
            
            if (e.key === 'Escape') {
                if (menuPanel && !menuPanel.classList.contains('hidden')) {
                    menuPanel.classList.add('hidden');
                    if (game) game.gameState.resume();
                } else if (craftingPanel && !craftingPanel.classList.contains('hidden')) {
                    game.closeCraftingPanel();
                } else if (document.getElementById('item-examine') && !document.getElementById('item-examine').classList.contains('hidden')) {
                    document.getElementById('item-examine').classList.add('hidden');
                } else if (game && !game.gameState.isGameOver) {
                    // Open pause menu
                    if (menuPanel) {
                        menuPanel.classList.remove('hidden');
                        if (game) game.gameState.pause();
                        const pauseBtn = document.getElementById('pause-btn');
                        if (pauseBtn) pauseBtn.textContent = '▶ Resume';
                    }
                }
            }
            if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (game) {
                    const result = game.saveSystem.save(game);
                    alert(result.message);
                }
            }
            if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
                // Open crafting panel
                if (craftingPanel && game) {
                    game.openCraftingPanel();
                }
            }
        });
    }

    // Credits back: global so inline onclick works
    window.doCreditsBack = function () {
        const creditsScreen = document.getElementById('credits-screen');
        if (creditsScreen) creditsScreen.classList.add('hidden');
    };
    const creditsBackBtn = document.getElementById('credits-back-btn');
    if (creditsBackBtn) {
        creditsBackBtn.addEventListener('click', () => {
            if (window.doCreditsBack) window.doCreditsBack();
        });
    }

});
