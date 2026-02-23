/**
 * =====================================================
 * FUM: SHATTERLAYERS - DECK MANAGEMENT
 * =====================================================
 * 
 * 🃏 THE DECK: Where All The Cards Live 🃏
 * =====================================================
 * 
 * This class handles the deck - shuffling, drawing, and
 * managing all 52 cards. It's like a card dealer, but
 * automated and without the need for tips.
 * 
 * Features:
 * - Shuffling (randomizes card order - very important!)
 * - Drawing (gives cards to players)
 * - Reshuffling (when deck runs out, shuffle discard back in)
 * 
 * NOVICE NOTE: The deck is just an array of card IDs.
 * When you shuffle, you randomize the order. When you draw,
 * you take cards from the top. Simple, right?
 * 
 * =====================================================
 */

// Deck Management

import { getAllCards } from './cards.js';

export class Deck {
    constructor(cards = null) {
        this.cards = cards || this.createStarterDeck();
        this.shuffle();
    }

    createStarterDeck() {
        // Create a 52-card starter deck (one of each card)
        const allCards = getAllCards();
        return allCards.map(card => card.id);
    }

    shuffle() {
        // Fisher-Yates shuffle
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(count = 1) {
        const drawn = [];
        for (let i = 0; i < count && this.cards.length > 0; i++) {
            drawn.push(this.cards.pop());
        }
        return drawn;
    }

    drawRandom(count = 1) {
        const drawn = [];
        for (let i = 0; i < count && this.cards.length > 0; i++) {
            const index = Math.floor(Math.random() * this.cards.length);
            drawn.push(this.cards.splice(index, 1)[0]);
        }
        return drawn;
    }

    add(cardId) {
        this.cards.push(cardId);
    }

    addToTop(cardId) {
        this.cards.unshift(cardId);
    }

    addToBottom(cardId) {
        this.cards.push(cardId);
    }

    remove(cardId) {
        const index = this.cards.indexOf(cardId);
        if (index > -1) {
            return this.cards.splice(index, 1)[0];
        }
        return null;
    }

    peek(count = 1) {
        return this.cards.slice(-count).reverse();
    }

    reorderTop(count = 2) {
        if (this.cards.length < count) return;
        const top = this.cards.splice(-count);
        // Allow player to reorder (for now, just reverse)
        return top.reverse();
    }

    search(cardId) {
        return this.cards.indexOf(cardId);
    }

    get size() {
        return this.cards.length;
    }

    isEmpty() {
        return this.cards.length === 0;
    }
}