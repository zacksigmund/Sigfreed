import { Element, Window } from "../../system/ui/index.js";
import { Card } from "../solitaire/card.js";
import { CardStack } from "../solitaire/cardStack.js";

const noop = () => {};

const decksBySuit = [];
decksBySuit[1] = ["spades", "spades", "spades", "spades", "spades", "spades", "spades", "spades"];
decksBySuit[2] = ["spades", "spades", "spades", "spades", "hearts", "hearts", "hearts", "hearts"];
decksBySuit[4] = ["spades", "spades", "hearts", "hearts", "clubs", "clubs", "diamonds", "diamonds"];

export class Spider {
    static name = "Spider";
    static icon = "games/spider/spider.app.png";
    static about =
        "Only click the cards for now, no drag-and-drop. You can click specific cards within the stack, though. When you've got K-A, click the K to send it to the goal, it won't go automatically.";

    constructor() {
        this.windowEl = Window(
            Spider.name,
            [
                ["New 1-suit game", null, () => this.newGame(1)],
                ["New 2-suit game", null, () => this.newGame(2)],
                ["New 4-suit game", null, () => this.newGame(4)],
                ["About", "/", () => alert(Spider.about)],
            ],
            Element("canvas", { id: "spider", width: 452, height: 320 })
        );
    }

    init = () => {
        this.newGame(1);
        this.canvas = document.getElementById("spider");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.click);
        Card.init(() => {
            requestAnimationFrame(this.draw);
        });
    };

    newGame = (suits) => {
        this.decks = [];
        this.clears = [];
        this.columns = Array.from(Array(10)).map(() => {
            const stack = new CardStack();
            stack.tallStackLength = 12;
            return stack;
        });
        this.undoStack = [];
        this.deal(suits);
    };

    deal = (suits) => {
        const cards = decksBySuit[suits].flatMap((suit) => Card.oneSuit(suit));
        const deck = new CardStack(Card.shuffle(cards));
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].assign(deck.draw(i < 4 ? 6 : 5));
            this.columns[i].top.faceUp = true;
        }
        for (let i = 0; i < 5; i++) {
            this.decks.push(new CardStack(deck.draw(10)));
        }
    };

    draw = () => {
        this.ctx.clearRect(0, 0, 452, 320);

        // decks
        for (let i = 0; i < this.decks.length; i++) {
            this.decks[i].renderPile(this.ctx, 8 + 8 * i, 8);
        }

        // undo
        this.ctx.font = "16px serif";
        this.ctx.fillText("🔁", 8 + 22 + 4 * 44 + 10, 44);

        // clears
        for (let i = 0; i < this.clears.length; i++) {
            this.clears[i].renderPile(this.ctx, 452 - 8 - 44 - 8 * i, 8);
        }

        // columns
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].render(this.ctx, 8 + 44 * i, 84);
        }

        requestAnimationFrame(this.draw);
    };

    click = (e) => {
        const x = Math.floor((e.offsetX * e.target.width) / e.target.clientWidth),
            y = Math.floor((e.offsetY * e.target.height) / e.target.clientHeight);
        if (7 < x && x < 80 && 7 < y && y < 71) {
            this.clickDecks();
        } else if (218 < x && x < 233 && 31 < y && y < 46) {
            this.clickUndo();
        } else if (y > 83) {
            const colNum = Math.floor((x - 8) / 44);
            if (colNum < 0 || colNum >= this.columns.length) return;
            const column = this.columns[colNum];
            const cards = column.click(y - 84);
            if (this.stackIsLegal(cards)) {
                this.clickColumns(column, cards);
            }
        }
    };

    stackIsLegal = (cards) => {
        for (let i = 0; i < cards.length - 1; i++) {
            if (cards[i].suit === cards[i + 1].suit && cards[i].rank === cards[i + 1].rank + 1) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    };

    clickDecks = () => {
        if (!this.decks.length) return;
        if (this.columns.some((col) => col.length === 0)) return;
        const cards = this.decks.pop();
        for (const col of this.columns) {
            const [card] = cards.draw();
            card.faceUp = true;
            col.push(card);
        }
        this.undoStack.push(() => {
            const cards = [];
            for (const col of this.columns) {
                const [card] = col.draw();
                card.faceUp = false;
                cards.unshift(card);
            }
            this.decks.push(new CardStack(cards));
        }, noop);
    };

    clickUndo = () => {
        if (this.undoStack.length) {
            this.undoStack.pop()();
            this.undoStack.pop()();
        }
    };

    clickColumns = (column, cards) => {
        if (!column.length) return;

        let moved = this.tryMove(cards);
        if (moved) {
            column.draw(cards.length);
            let flipped = false;
            if (column.length && !column.top.faceUp) {
                flipped = true;
                column.top.faceUp = true;
            }
            this.undoStack.push(() => {
                if (flipped) {
                    column.top.faceUp = false;
                }
                column.push(...cards);
            });
            return;
        }
    };

    tryMove = (cards) => {
        const card = cards[0];

        if (cards.length === 13 && cards[0].rank === 13 && cards[12].rank === 1) {
            this.clears.push(new CardStack(cards.toReversed()));
            this.undoStack.push(() => {
                this.clears.pop();
            });
            return true;
        }

        for (const column of this.columns) {
            if (!column.length) continue;
            const topCard = column.top;
            if (card.suit === topCard.suit && card.rank === topCard.rank - 1) {
                column.push(...cards);
                this.undoStack.push(() => column.draw(cards.length));
                return true;
            }
        }

        for (const column of this.columns) {
            if (!column.length) continue;
            const topCard = column.top;
            if (card.rank === topCard.rank - 1) {
                column.push(...cards);
                this.undoStack.push(() => column.draw(cards.length));
                return true;
            }
        }

        for (const column of this.columns) {
            if (column.length) continue;
            column.push(...cards);
            this.undoStack.push(() => column.draw(cards.length));
            return true;
        }

        return false;
    };
}
