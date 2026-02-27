# Iron Coliseum Brawler

2D brawler: break armor, rip off pieces, trigger execution, avoid hazards. Two fighters (Warden & Rae), specials, rounds, story mode.

## Run

Open `index.html` in a browser, or serve the folder over HTTP:

```bash
npx serve .
# or: python -m http.server 8080
```

## Controls

**Player 1 – Iron Warden**
- Move: A / D  
- Light: W | Heavy: E | Special: R | Grab: Q | Dash: Shift  

**Player 2 – Velocity Rae**
- Move: Left / Right  
- Light: Up | Heavy: . | Special: ; | Grab: , | Dash: /  

**Global:** Esc or P = Pause | M = Main menu (during fight)

## Rules

- Reduce opponent’s armor (Head, Torso, L.Arm, R.Arm, Legs) to 0 on all pieces → they enter **execution**.
- Grab on execution = **finisher** → round win.
- Armor in the **red** (below threshold) can be **ripped off** with grab; piece drops to the floor.
- Outer 20% of the arena is a **hazard** every 20s for 5s; standing in it damages armor (and hides the player).
- First to **2 round wins** wins the match. Round length is random 60–90 seconds.

## Tweaker's guide (where to change things)

The code is commented so you can tweak and expand without hunting. Start here:

| What you want to change | File | What to edit |
|-------------------------|------|--------------|
| Round length, knockback, armor threshold, colors | `js/constants.js` | `ARENA`, `ROUND_DURATION_*`, `ROUNDS_TO_WIN`, `ARMOR_RED_THRESHOLD`, `COLORS`, etc. |
| Keyboard keys | `js/input.js` | `P1` and `P2` objects (use `KeyboardEvent.code` strings) |
| Images & sounds | `js/assets.js` | `IMAGE_PATHS`, `SOUND_PATHS`, `BATTLE_TRACK_PATHS` |
| New characters | `js/constants.js` | Add to `CHARACTERS` and create a config (like `WARDEN`/`RAE`) |
| Story / menu text | `js/screens.js` | `STORY_CRAWL_TEXT`, `MENU_ITEMS`, `TUTORIAL_STEPS` |
| CPU difficulty | `js/cpu.js` | Cooldowns and the `Math.random()` chances for attack/dash |
| Hazard timing | `js/constants.js` | `ARENA.HAZARD_CYCLE_SEC`, `ARENA.HAZARD_ACTIVE_SEC` |

Script load order (in `index.html`): constants → assets → input → arena → players → combat → ui → cpu → weather → screens → game.

## Tech

- Vanilla JS, HTML5 Canvas 800×400, 60 FPS fixed timestep.
- Layers: background → ground litter → players → rip-off → projectiles → sparks → hitboxes → UI.
