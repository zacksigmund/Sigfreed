import { Card } from "../solitaire/card.js";
import { Element } from "../ui/element.js";
import { Window } from "../ui/window.js";

const noop = () => {};

const decksBySuit = [];
decksBySuit[1] = ["spades", "spades", "spades", "spades", "spades", "spades", "spades", "spades"];
decksBySuit[2] = ["spades", "spades", "spades", "spades", "hearts", "hearts", "hearts", "hearts"];
decksBySuit[4] = ["spades", "spades", "hearts", "hearts", "clubs", "clubs", "diamonds", "diamonds"];

export class Spider {
    constructor() {
        const ui = this.render();
        if (!ui) return;
        document.body.appendChild(ui);
        this.newGame(1);
        this.canvas = document.getElementById("spider");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.click);
        addEventListener("contextmenu", (e) => {
            this.click(e, true);
            e.preventDefault();
        });
        Card.init(() => {
            requestAnimationFrame(this.draw);
        });
    }

    render = () => {
        return Window(
            "Spider",
            {
                "New 1-suit game": () => this.newGame(1),
                "New 2-suit game": () => this.newGame(2),
                "New 4-suit game": () => this.newGame(4),
            },
            Element("canvas", { id: "spider", width: 452, height: 320 })
        );
    };

    newGame = (suits) => {
        this.decks = [];
        this.clears = [];
        this.columns = [[], [], [], [], [], [], [], [], [], []];
        this.undoStack = [];
        this.deal(suits);
    };

    deal = (suits) => {
        const cards = decksBySuit[suits].flatMap((suit) => Card.oneSuit(suit));
        const deck = Card.shuffle(cards);
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i] = deck.splice(0, i < 4 ? 6 : 5);
            this.columns[i][this.columns[i].length - 1].faceUp = true;
        }
        for (let i = 0; i < 5; i++) {
            this.decks.push(deck.splice(0, 10));
        }
    };

    draw = () => {
        this.ctx.clearRect(0, 0, 452, 320);

        // decks
        for (let i = 0; i < this.decks.length; i++) {
            Card.drawBack(this.ctx, 8 + 8 * i, 8);
        }

        // undo
        this.ctx.font = "16px serif";
        this.ctx.fillText("🔁", 8 + 22 + 4 * 44 + 10, 44);

        // clears
        for (let i = 0; i < this.clears.length; i++) {
            this.clears[i][0].draw(this.ctx, 452 - 8 - 44 - 8 * i, 8);
        }

        // columns
        for (let i = 0; i < this.columns.length; i++) {
            const x = 8 + 44 * i;
            let y = 84;
            const column = this.columns[i];
            if (column.length) {
                for (let j = 0; j < column.length; j++) {
                    const card = column[j];
                    card.draw(this.ctx, x, y);
                    y += card.faceUp
                        ? column.filter((card) => card.faceUp).length < 12
                            ? 16
                            : 10
                        : 4;
                }
            } else {
                Card.drawFrame(this.ctx, x, y);
            }
        }
        requestAnimationFrame(this.draw);
    };

    click = (e, altClick) => {
        const x = Math.floor(e.offsetX / 2),
            y = Math.floor(e.offsetY / 2);
        if (7 < x && x < 80 && 7 < y && y < 71) {
            this.clickDecks();
        } else if (218 < x && x < 233 && 31 < y && y < 46) {
            this.clickUndo();
        } else if (y > 83) {
            const colNum = Math.floor((x - 8) / 44);
            const column = this.columns[colNum];
            this.clickColumns(column, altClick);
        }
    };

    clickDecks = () => {
        if (!this.decks.length) return;
        if (this.columns.some((col) => col.length === 0)) return;
        const cards = this.decks.pop();
        for (const col of this.columns) {
            const card = cards.pop();
            card.faceUp = true;
            col.push(card);
        }
        this.undoStack.push(() => {
            const cards = [];
            for (const col of this.columns) {
                const card = col.pop();
                card.faceUp = false;
                cards.unshift(card);
            }
            this.decks.push(cards);
        });
        this.undoStack.push(noop);
    };

    clickUndo = () => {
        if (this.undoStack.length) {
            this.undoStack.pop()();
            this.undoStack.pop()();
        }
    };

    clickColumns = (column, altClick) => {
        if (!column.length) return;

        let i = column.length - 1;
        let cond = () =>
            i >= 0 &&
            column[i].faceUp &&
            (i === column.length - 1 ||
                (column[i + 1].suit === column[i].suit &&
                    column[i + 1].rank + 1 === column[i].rank));
        let inc = () => i--;
        if (!altClick) {
            cond = () => i < column.length;
            inc = () => i++;
            // find the highest element that's not part of the move stack
            while (
                i > 0 &&
                column[i - 1].faceUp &&
                column[i].suit === column[i - 1].suit &&
                column[i].rank + 1 === column[i - 1].rank
            ) {
                i--;
            }
        }

        for (; cond(); inc()) {
            let moved = this.tryMove(column.slice(i));
            if (moved) {
                const cards = column.splice(i);
                let flipped = false;
                if (column.length && !column[column.length - 1].faceUp) {
                    flipped = true;
                    column[column.length - 1].faceUp = true;
                }
                this.undoStack.push(() => {
                    if (flipped) {
                        column[column.length - 1].faceUp = false;
                    }
                    column.push(...cards);
                });
                return;
            }
        }
    };

    tryMove = (cards) => {
        const card = cards[0];

        if (cards.length === 13 && cards[0].rank === 13 && cards[12].rank === 1) {
            this.clears.push(cards);
            this.undoStack.push(() => {
                this.clears.pop();
            });
            return true;
        }

        for (const column of this.columns) {
            if (!column.length) continue;
            const topCard = column[column.length - 1];
            if (card.suit === topCard.suit && card.rank === topCard.rank - 1) {
                column.push(...cards);
                this.undoStack.push(() => column.splice(-1 * cards.length));
                return true;
            }
        }

        for (const column of this.columns) {
            if (!column.length) continue;
            const topCard = column[column.length - 1];
            if (card.rank === topCard.rank - 1) {
                column.push(...cards);
                this.undoStack.push(() => column.splice(-1 * cards.length));
                return true;
            }
        }

        for (const column of this.columns) {
            if (column.length) continue;
            column.push(...cards);
            this.undoStack.push(() => column.splice(-1 * cards.length));
            return true;
        }

        return false;
    };
}
