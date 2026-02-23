/**
 * =====================================================
 * FUM: SHATTERLAYERS - BOARD/GRID MANAGEMENT
 * =====================================================
 * 
 * 🎯 THE BOARD: Where Cards Go To Battle 🎯
 * =====================================================
 * 
 * This class manages the game board - the 3x3 grids where
 * players place their cards. Each player has their own grid,
 * and cards placed there can attack, defend, and do all
 * sorts of reality-bending things.
 * 
 * Features:
 * - 3x3 grid per player (9 slots total per player)
 * - Slot types: Self, Action, Outcome (the three columns)
 * - Card placement and removal
 * - Adjacent slot detection (for effects that target neighbors)
 * 
 * NOVICE NOTE: The board is just a 2D array (array of arrays).
 * board[playerId][row][col] gives you the card at that position.
 * It's like coordinates, but for cards!
 * 
 * =====================================================
 */

// Board/Grid Management

export class Board {
    constructor() {
        this.grids = {
            1: this.createGrid(), // Player 1
            2: this.createGrid()  // Player 2
        };
    }

    createGrid() {
        // 3x3 grid with slot types: Self, Action, Outcome
        const grid = [];
        const slotTypes = ['self', 'action', 'outcome'];
        
        for (let row = 0; row < 3; row++) {
            grid[row] = [];
            for (let col = 0; col < 3; col++) {
                grid[row][col] = {
                    type: slotTypes[col],
                    card: null,
                    row,
                    col,
                    effects: [],
                    barriers: 0
                };
            }
        }
        
        return grid;
    }

    placeCard(playerId, row, col, cardId) {
        const grid = this.grids[playerId];
        if (!grid || !grid[row] || !grid[row][col]) {
            return { success: false, message: 'Invalid grid position' };
        }

        const slot = grid[row][col];
        if (slot.card !== null) {
            return { success: false, message: 'Slot already occupied' };
        }

        slot.card = cardId;
        return { success: true, slot };
    }

    removeCard(playerId, row, col) {
        const grid = this.grids[playerId];
        if (!grid || !grid[row] || !grid[row][col]) {
            return null;
        }

        const cardId = grid[row][col].card;
        grid[row][col].card = null;
        grid[row][col].effects = [];
        return cardId;
    }

    getCard(playerId, row, col) {
        const grid = this.grids[playerId];
        if (!grid || !grid[row] || !grid[row][col]) {
            return null;
        }
        return grid[row][col].card;
    }

    getSlot(playerId, row, col) {
        const grid = this.grids[playerId];
        if (!grid || !grid[row] || !grid[row][col]) {
            return null;
        }
        return grid[row][col];
    }

    getAdjacentSlots(playerId, row, col) {
        const adjacent = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                const slot = this.getSlot(playerId, newRow, newCol);
                if (slot) {
                    adjacent.push(slot);
                }
            }
        }

        return adjacent;
    }

    getRow(playerId, row) {
        const grid = this.grids[playerId];
        if (!grid || !grid[row]) {
            return [];
        }
        return grid[row];
    }

    getColumn(playerId, col) {
        const grid = this.grids[playerId];
        if (!grid) {
            return [];
        }
        return grid.map(row => row[col]);
    }

    getAllCards(playerId) {
        const grid = this.grids[playerId];
        if (!grid) {
            return [];
        }
        
        const cards = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (grid[row][col].card) {
                    cards.push({
                        cardId: grid[row][col].card,
                        row,
                        col,
                        slot: grid[row][col]
                    });
                }
            }
        }
        return cards;
    }

    getEmptySlots(playerId) {
        const grid = this.grids[playerId];
        if (!grid) {
            return [];
        }
        
        const empty = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (grid[row][col].card === null) {
                    empty.push({
                        row,
                        col,
                        slot: grid[row][col]
                    });
                }
            }
        }
        return empty;
    }

    addBarrier(playerId, row, col) {
        const slot = this.getSlot(playerId, row, col);
        if (slot) {
            slot.barriers += 1;
            return true;
        }
        return false;
    }

    removeBarrier(playerId, row, col) {
        const slot = this.getSlot(playerId, row, col);
        if (slot && slot.barriers > 0) {
            slot.barriers -= 1;
            return true;
        }
        return false;
    }

    clear() {
        this.grids = {
            1: this.createGrid(),
            2: this.createGrid()
        };
    }
}