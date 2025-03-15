import { Card } from "./card.js";

export class CardStack {
    get top() {
        return this.cards[this.cards.length - 1];
    }

    get bottom() {
        return this.cards[0];
    }

    get length() {
        return this.cards.length;
    }

    constructor(cards) {
        this.cards = cards ?? [];
    }

    assign = (cards) => {
        this.cards = cards;
    };

    push = (...items) => {
        return this.cards.push(...items);
    };

    get = (i) => {
        return this.cards[i];
    };

    peek = (count = 1) => {
        return this.cards.slice(-1 * count);
    };

    draw = (count = 1) => {
        return this.cards.splice(-1 * count);
    };

    flip = () => {
        const arr = this.cards;
        this.cards = [];
        arr.forEach((card) => (card.faceUp = !card.faceUp));
        arr.reverse();
        return arr;
    };

    render = (ctx, ox, oy) => {
        const x = ox;
        let y = oy;
        if (this.cards.length) {
            const tallStack = this.cards.filter((card) => card.faceUp).length >= 7;
            for (let i = 0; i < this.cards.length; i++) {
                const card = this.cards[i];
                card.draw(ctx, x, y);
                y += card.faceUp ? (tallStack ? 10 : 16) : 4;
            }
        } else {
            Card.drawFrame(ctx, x, y);
        }
    };

    renderPile = (ctx, ox, oy) => {
        if (this.cards.length) {
            this.top.draw(ctx, ox, oy);
        } else {
            Card.drawFrame(ctx, ox, oy);
        }
    };

    click = (_cx, cy) => {
        if (!this.cards.length) return [];
        let y = 0;
        const tallStack = this.cards.filter((card) => card.faceUp).length >= 7;
        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            const ly = y;
            y += card.faceUp ? (tallStack ? 10 : 16) : 4;
            if (cy >= ly && cy < y) {
                // clicked the face down part of the deck
                if (!card.faceUp) return [];
                return this.cards.slice(i);
            }
        }
        // clicked top card (showing part past 16px margin) or below
        return [this.top];
    };
}
