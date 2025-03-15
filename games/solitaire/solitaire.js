import { Element } from "../../system/ui/element.js";
import { Window } from "../../system/ui/window.js";
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
        this.discard = [];
        this.goals = [[], [], [], []];
        this.columns = Array.from(Array(7)).map(() => new CardStack());
        this.undoStack = [];
        this.deal();
    };

    deal = () => {
        this.deck = Card.shuffle(Card.allCards());
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].assign(this.deck.splice(0, i + 1));
            this.columns[i].top.faceUp = true;
        }
    };

    draw = () => {
        this.ctx.clearRect(0, 0, 320, 240);

        // deck
        if (this.deck.length) {
            Card.drawBack(this.ctx, 8, 8);
        } else {
            Card.drawFrame(this.ctx, 8, 8);
        }

        // discard
        if (this.discard.length) {
            this.discard[0].draw(this.ctx, 8 + 44, 8);
        } else {
            Card.drawFrame(this.ctx, 8 + 44, 8);
        }

        // undo
        this.ctx.font = "16px serif";
        this.ctx.fillText("🔁", 8 + 2 * 44 + 10, 44);

        // goal
        for (let i = 0; i < this.goals.length; i++) {
            if (this.goals[i].length) {
                this.goals[i][0].draw(this.ctx, 8 + 44 * (i + 3), 8);
            } else {
                Card.drawFrame(this.ctx, 8 + 44 * (i + 3), 8);
            }
        }

        // columns
        for (let i = 0; i < this.columns.length; i++) {
            const x = 8 + 44 * i;
            let y = 84;
            this.columns[i].render(this.ctx, x, y);
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
            const cards = column.click(x - 8 - 44 * colNum, y - 84);
            this.clickColumns(column, cards);
        }
    };

    clickDeck = () => {
        if (this.deck.length) {
            const drawn = this.deck.shift();
            drawn.faceUp = true;
            this.discard.unshift(drawn);
            this.undoStack.push(() => {
                this.discard.shift();
                drawn.faceUp = false;
                this.deck.unshift(drawn);
            }, noop);
        } else {
            this.discard.forEach((card) => (card.faceUp = false));
            this.deck = this.discard.reverse();
            this.discard = [];
            this.undoStack.push(() => {
                this.deck.forEach((card) => (card.faceUp = true));
                this.discard = this.deck.reverse();
                this.deck = [];
            }, noop);
        }
    };

    clickDiscard = () => {
        if (!this.discard.length) return;
        const moved = this.tryGoal(this.discard[0]) || this.tryMove([this.discard[0]]);
        if (moved) {
            const card = this.discard.shift();
            this.undoStack.push(() => this.discard.unshift(card));
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
                (goal.length && goal[0].suit === card.suit && goal[0].rank + 1 === card.rank)
            ) {
                goal.unshift(card);
                this.undoStack.push(() => goal.shift());
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
