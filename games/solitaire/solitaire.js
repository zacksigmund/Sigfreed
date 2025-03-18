import { Element, Window } from "../../system/ui/index.js";
import { Card } from "./card.js";
import { CardStack } from "./cardStack.js";

const noop = () => {};

export class Solitaire {
    static about =
        "Only click the cards for now, no drag-and-drop. You can click specific cards within the stack, though.";

    constructor() {
        const ui = this.render();
        if (!ui) return;
        document.body.appendChild(ui);
        this.newGame();
        this.canvas = document.getElementById("solitaire");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.click);
        Card.init(() => {
            requestAnimationFrame(this.draw);
        });
    }

    render = () => {
        return Window(
            "Solitaire",
            { "New Game": this.newGame, About: () => alert(Solitaire.about) },
            Element("canvas", { id: "solitaire", width: 320, height: 240 })
        );
    };

    newGame = () => {
        this.discard = new CardStack();
        this.goals = Array.from(Array(4)).map(() => new CardStack());
        this.columns = Array.from(Array(7)).map(() => new CardStack());
        this.undoStack = [];
        this.deal();
    };

    deal = () => {
        this.deck = new CardStack(Card.shuffle(Card.allCards()));
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].assign(this.deck.draw(i + 1));
            this.columns[i].top.faceUp = true;
        }
    };

    draw = () => {
        this.ctx.clearRect(0, 0, 320, 240);

        // deck
        this.deck.renderPile(this.ctx, 8, 8);

        // discard
        this.discard.renderPile(this.ctx, 8 + 44, 8);

        // undo
        this.ctx.font = "16px serif";
        this.ctx.fillText("🔁", 8 + 2 * 44 + 10, 44);

        // goal
        for (let i = 0; i < this.goals.length; i++) {
            this.goals[i].renderPile(this.ctx, 8 + 44 * (i + 3), 8);
        }

        // columns
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].render(this.ctx, 8 + 44 * i, 84);
        }

        requestAnimationFrame(this.draw);
    };

    click = (e) => {
        const x = Math.floor(e.offsetX / 2),
            y = Math.floor(e.offsetY / 2);
        if (7 < x && x < 47 && 7 < y && y < 71) {
            this.clickDeck();
        } else if (51 < x && x < 91 && 7 < y && y < 71) {
            this.clickDiscard();
        } else if (109 < x && x < 124 && 31 < y && y < 46) {
            this.clickUndo();
        } else if (y >= 84) {
            const colNum = Math.floor((x - 8) / 44);
            if (colNum < 0 || colNum >= this.columns.length) return;
            const column = this.columns[colNum];
            const cards = column.click(y - 84);
            this.clickColumns(column, cards);
        }
    };

    clickDeck = () => {
        if (this.deck.length) {
            const [drawn] = this.deck.draw();
            drawn.faceUp = true;
            this.discard.push(drawn);
            this.undoStack.push(() => {
                this.discard.draw();
                drawn.faceUp = false;
                this.deck.push(drawn);
            }, noop);
        } else {
            this.deck.assign(this.discard.flip());
            this.undoStack.push(() => {
                this.discard.assign(this.deck.flip());
            }, noop);
        }
    };

    clickDiscard = () => {
        if (!this.discard.length) return;
        const moved = this.tryGoal(this.discard.top) || this.tryMove([this.discard.top]);
        if (moved) {
            const card = this.discard.draw();
            this.undoStack.push(() => this.discard.push(card));
        }
    };

    clickUndo = () => {
        if (this.undoStack.length) {
            this.undoStack.pop()();
            this.undoStack.pop()();
        }
    };

    clickColumns = (column, cards) => {
        if (!cards.length) return;
        if (cards.length === 1) {
            const card = column.top;
            let moved = this.tryGoal(card);
            if (moved) {
                column.draw();
                let flipped = false;
                if (column.length && !column.top.faceUp) {
                    flipped = true;
                    column.top.faceUp = true;
                }
                this.undoStack.push(() => {
                    if (flipped) {
                        column.top.faceUp = false;
                    }
                    column.push(card);
                });
                return;
            }
        }

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

    tryGoal = (card) => {
        for (const goal of this.goals) {
            if (
                (goal.length === 0 && card.rank === 1) ||
                (goal.length && goal.top.suit === card.suit && goal.top.rank + 1 === card.rank)
            ) {
                goal.push(card);
                this.undoStack.push(() => goal.draw());
                return true;
            }
        }

        return false;
    };

    tryMove = (cards) => {
        const card = cards[0];

        for (const column of this.columns) {
            if (!column.length) continue;
            const topCard = column.top;
            if (card.color !== topCard.color && card.rank === topCard.rank - 1) {
                column.push(...cards);
                this.undoStack.push(() => column.draw(cards.length));
                return true;
            }
        }

        for (const column of this.columns) {
            if (column.length) continue;
            if (card.rank === 13) {
                column.push(...cards);
                this.undoStack.push(() => column.draw(cards.length));
                return true;
            }
        }

        return false;
    };
}
