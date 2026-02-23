/**
 * SpawnTable.js
 * Weighted spawn pools per scene + location.
 * Use id: null to represent "nothing found".
 * New Game generator: for each location in Scene A, roll spawns using weights;
 * results are saved to game state and never change unless New Game.
 */
(function () {
    'use strict';

    var SpawnTable = {
        A: {
            L17: {
                rolls: 2,
                pool: [
                    { id: null, w: 35 },
                    { id: 'paint_thinner', w: 6 },
                    { id: 'gas_can', w: 6 },
                    { id: 'charcoal_briquettes', w: 6 },
                    { id: 'extension_cord', w: 5 },
                    { id: 'wiring', w: 6 },
                    { id: 'insulation', w: 6 },
                    { id: 'metal', w: 8 },
                    { id: 'copper_pipe', w: 6 },
                    { id: 'lighter', w: 4 },
                    { id: 'matches', w: 6 },
                    { id: 'battery', w: 6 },
                    { id: 'duct_tape', w: 4 },
                    { id: 'fire_extinguisher', w: 2 }
                ]
            },
            L04: {
                rolls: 2,
                pool: [
                    { id: null, w: 30 },
                    { id: 'bleach', w: 6 },
                    { id: 'cleaning_supplies', w: 7 },
                    { id: 'glass_jar', w: 7 },
                    { id: 'plastic_container', w: 8 },
                    { id: 'coffee_filters', w: 6 },
                    { id: 'battery', w: 6 },
                    { id: 'emergency_radio', w: 2 }
                ]
            },
            L05: {
                rolls: 3,
                pool: [
                    { id: null, w: 25 },
                    { id: 'canned_beans', w: 8 },
                    { id: 'canned_soup', w: 8 },
                    { id: 'canned_vegetables', w: 7 },
                    { id: 'crackers', w: 8 },
                    { id: 'peanut_butter', w: 6 },
                    { id: 'ramen_noodles', w: 7 },
                    { id: 'spices', w: 7 },
                    { id: 'bird_seed', w: 7 },
                    { id: 'energy_bar', w: 5 }
                ]
            },
            L06: {
                rolls: 3,
                pool: [
                    { id: null, w: 25 },
                    { id: 'cardboard', w: 10 },
                    { id: 'wood_scraps', w: 10 },
                    { id: 'rope', w: 7 },
                    { id: 'wire', w: 7 },
                    { id: 'string', w: 7 },
                    { id: 'duct_tape', w: 6 },
                    { id: 'tin_cans', w: 6 },
                    { id: 'coffee_can_bolts', w: 4 },
                    { id: 'mouse_trap', w: 5 }
                ]
            },
            L03: {
                rolls: 2,
                unique: true,
                pool: [
                    { id: null, w: 25 },
                    { id: 'hammer', w: 6 },
                    { id: 'screwdriver', w: 6 },
                    { id: 'wrench', w: 6 },
                    { id: 'pliers', w: 6 },
                    { id: 'handsaw', w: 5 },
                    { id: 'utility_knife', w: 5 },
                    { id: 'scissors', w: 4 },
                    { id: 'multitool', w: 2 },
                    { id: 'nails', w: 7 },
                    { id: 'wood_planks', w: 5 }
                ]
            },
            L32: {
                rolls: 2,
                pool: [
                    { id: null, w: 30 },
                    { id: 'hammer', w: 8 },
                    { id: 'screwdriver', w: 8 },
                    { id: 'duct_tape', w: 10 },
                    { id: 'nails', w: 10 },
                    { id: 'utility_knife', w: 6 },
                    { id: 'scissors', w: 6 },
                    { id: 'can_opener', w: 6 }
                ]
            },
            L18: {
                rolls: 2,
                pool: [
                    { id: null, w: 35 },
                    { id: 'empty_bucket', w: 10 },
                    { id: 'garden_hose', w: 6 },
                    { id: 'copper_pipe', w: 8 },
                    { id: 'insulation', w: 8 },
                    { id: 'wrench', w: 6 },
                    { id: 'battery', w: 6 },
                    { id: 'water_bottle', w: 5 }
                ]
            },
            L15: {
                rolls: 2,
                pool: [
                    { id: null, w: 30 },
                    { id: 'soap', w: 10 },
                    { id: 'hand_sanitizer', w: 8 },
                    { id: 'baby_wipes', w: 8 },
                    { id: 'trash_bags', w: 8 },
                    { id: 'old_rag', w: 10 },
                    { id: 'bleach', w: 7 },
                    { id: 'cleaning_supplies', w: 9 },
                    { id: 'first_aid_kit', w: 2 },
                    { id: 'pain_killers', w: 3 }
                ]
            },
            L36: {
                rolls: 1,
                pool: [
                    { id: null, w: 40 },
                    { id: 'magazine', w: 15 },
                    { id: 'newspaper', w: 15 },
                    { id: 'wall_calendar', w: 25 },
                    { id: 'air_horn', w: 5 }
                ]
            },
            L33: {
                rolls: 2,
                pool: [
                    { id: null, w: 25 },
                    { id: 'book', w: 12 },
                    { id: 'deck_of_cards', w: 10 },
                    { id: 'journal', w: 10 },
                    { id: 'candle', w: 10 },
                    { id: 'flashlight', w: 8 },
                    { id: 'whiskey_bottle', w: 3 },
                    { id: 'broken_toy_robot', w: 5 },
                    { id: 'tennis_ball', w: 7 },
                    { id: 'work_boot', w: 6 },
                    { id: 'small_backpack', w: 4 }
                ]
            },
            L25: {
                rolls: 1,
                pool: [
                    { id: null, w: 45 },
                    { id: 'old_rag', w: 12 },
                    { id: 'soap', w: 8 },
                    { id: 'wire', w: 10 },
                    { id: 'string', w: 10 },
                    { id: 'trash_bags', w: 10 },
                    { id: 'sump_water_raw', w: 5 }
                ]
            },
            L07: {
                rolls: 2,
                pool: [
                    { id: null, w: 30 },
                    { id: 'cardboard', w: 15 },
                    { id: 'wood_scraps', w: 15 },
                    { id: 'tin_cans', w: 10 },
                    { id: 'wire_hangers', w: 10 },
                    { id: 'nails', w: 10 },
                    { id: 'duct_tape', w: 10 }
                ]
            },
            L08: {
                rolls: 2,
                pool: [
                    { id: null, w: 30 },
                    { id: 'metal', w: 14 },
                    { id: 'insulation', w: 14 },
                    { id: 'rope', w: 12 },
                    { id: 'wire', w: 12 },
                    { id: 'coffee_can_bolts', w: 6 },
                    { id: 'first_aid_kit', w: 2 },
                    { id: 'baseball_bat', w: 2 },
                    { id: 'pepper_spray', w: 1 }
                ]
            },
            L44: {
                rolls: 2,
                pool: [
                    { id: null, w: 30 },
                    { id: 'canned_beans', w: 10 },
                    { id: 'canned_soup', w: 10 },
                    { id: 'energy_bar', w: 8 },
                    { id: 'ramen_noodles', w: 10 },
                    { id: 'trash_bags', w: 10 },
                    { id: 'old_clothes', w: 12 },
                    { id: 'shopping_bag', w: 10 }
                ]
            },
            L45: {
                rolls: 2,
                pool: [
                    { id: null, w: 25 },
                    { id: 'magazine', w: 15 },
                    { id: 'book', w: 15 },
                    { id: 'newspaper', w: 12 },
                    { id: 'coloring_book', w: 10 },
                    { id: 'journal', w: 10 },
                    { id: 'deck_of_cards', w: 8 },
                    { id: 'board_game', w: 5 }
                ]
            },
            L46: {
                rolls: 1,
                pool: [
                    { id: null, w: 50 },
                    { id: 'tin_cans', w: 15 },
                    { id: 'empty_bucket', w: 10 },
                    { id: 'plastic_container', w: 15 },
                    { id: 'water_bottle', w: 10 }
                ]
            },
            L47: {
                rolls: 2,
                pool: [
                    { id: null, w: 25 },
                    { id: 'empty_bucket', w: 10 },
                    { id: 'bleach', w: 8 },
                    { id: 'soap', w: 10 },
                    { id: 'old_rag', w: 12 },
                    { id: 'trash_bags', w: 10 },
                    { id: 'cleaning_supplies', w: 8 },
                    { id: 'duct_tape', w: 7 }
                ]
            },
            L48: {
                rolls: 1,
                pool: [
                    { id: null, w: 60 },
                    { id: 'tennis_ball', w: 40 }
                ]
            },
            L49: {
                rolls: 1,
                pool: [
                    { id: null, w: 50 },
                    { id: 'newspaper', w: 50 }
                ]
            },
            L37: {
                rolls: 1,
                pool: [
                    { id: null, w: 50 },
                    { id: 'sump_water_raw', w: 35 },
                    { id: 'empty_bucket', w: 10 },
                    { id: 'rope', w: 5 }
                ]
            }
        },
        B: {
            L36: { rolls: 0, pool: [] }
        }
    };

    if (typeof window !== 'undefined') {
        window.SpawnTable = SpawnTable;
    }
})();
