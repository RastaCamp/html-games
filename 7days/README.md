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

## Legacy folder

- `7days/` (nested) is a separate older Python/Kivy prototype and is not used by the browser game.
- Keep it only as archive/reference. The deployable game is the top-level web project in this folder.
