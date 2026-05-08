# 7 Days...

Survive 7 days in the basement. A browser-based survival game.

## How to run

- Quick test: open `index.html` in a browser.
- Deployment-like test (recommended): run a static server from this folder and open the served URL.
  - Example: `python -m http.server 8080`
  - Then open `http://localhost:8080`

## Project structure (used by the game)

- `index.html` - Entry point and UI
- `styles.css` - Layout and styling
- `js/` - Game logic (Game, systems, rendering, UI flow)
- `data/` - Scene placement data (`location_placements.json`)
- `VISUALS/` - Art assets (case-sensitive path for deployment)
- `sounds/` - Audio (music and effects)

## Ad banner (bottom strip)

- **Reserved size (CSS pixels):** **728 wide × 90 tall** — standard IAB leaderboard. The black bar is full viewport width; the creative area is capped at 728×90 and centered.
- **Where:** `#ad-banner-slot` in `index.html`. Attributes `data-ad-width` / `data-ad-height` mirror the same numbers for reference.
- **Tuning size:** Edit `:root` in `styles.css` (`--ad-banner-width`, `--ad-banner-height`). Common alternatives: **320×50** (mobile banner), **970×90** (large leaderboard).
- **Placeholder:** Rotating “ADS GO HERE” text cycles **red → gold → green** every 4 seconds. For production, delete the placeholder `div` inside `#ad-banner-slot` and inject your ad network script or an `<iframe>` sized to the variables above. Remove `data-placeholder-rotator` from your replacement markup so `initAdPlaceholderRotator` in `js/main.js` no-ops if the nodes are gone.

## Legacy folder

- `7days/` (nested) is a separate older Python/Kivy prototype and is not used by the browser game.
- Keep it only as archive/reference. The deployable game is the top-level web project in this folder.
