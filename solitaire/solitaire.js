import { Window } from "../ui/window.js";
import { Element } from "../ui/element.js";
import { Card } from "./card.js";
import styles from "./solitaire.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

const noop = () => { };

export class Solitaire {
    constructor() {
        const ui = this.render();
        if (!ui) return;
        document.body.appendChild(ui);
        this.newGame();
        this.canvas = document.getElementById("solitaire");
        this.ctx = this.canvas.getContext('2d');
        this.canvas.addEventListener("click", this.click)
        requestAnimationFrame(this.draw);
    }

    render = () => {
        return Window("Solitaire", { "New Game": this.newGame, "New Game 2": this.newGame },
            Element("canvas", { id: "solitaire", width: 320, height: 240 }),
        );
    }

    newGame = () => {
        this.discard = [];
        this.goals = [[], [], [], []];
        this.columns = [[], [], [], [], [], [], []];
        this.undoStack = [];
        this.shuffle();
        this.deal();
    }

    shuffle = () => {
        const cards = Card.allCards();
        let m = cards.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = cards[m];
            cards[m] = cards[i];
            cards[i] = t;
        }
        this.deck = cards;
    }

    deal = () => {
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i] = this.deck.splice(0, i + 1);
            this.columns[i][this.columns[i].length - 1].faceUp = true;
        }
    }

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
            const column = this.columns[i];
            if (column.length) {
                for (let j = 0; j < column.length; j++) {
                    const card = column[j];
                    card.draw(this.ctx, x, y);
                    y += card.faceUp ? (column.filter(card => card.faceUp).length < 7 ? 16 : 10) : 4;
                }
            } else {
                Card.drawFrame(this.ctx, x, y);
            }
        }
        requestAnimationFrame(this.draw);
    }

    click = (e) => {
        const x = Math.floor(e.offsetX / 2), y = Math.floor(e.offsetY / 2);
        console.log(x, y);
        if (7 < x && x < 47 && 7 < y && y < 71) {
            // deck
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
                this.discard.forEach(card => card.faceUp = false);
                this.deck = this.discard.reverse();
                this.discard = [];
                this.undoStack.push(() => {
                    this.deck.forEach(card => card.faceUp = true);
                    this.discard = this.deck.reverse();
                    this.deck = [];
                }, noop);
            }

        } else if (51 < x && x < 91 && 7 < y && y < 71) {
            // discard
            if (!this.discard.length) return;
            const moved = this.tryGoal(this.discard[0]) || this.tryMove([this.discard[0]]);
            if (moved) {
                const card = this.discard.shift();
                this.undoStack.push(() => this.discard.unshift(card));
                return;
            }
        } else if (109 < x && x < 124 && 31 < y && y < 46) {
            if (this.undoStack.length) {
                this.undoStack.pop()();
                this.undoStack.pop()();
            }
        } else if (y > 83) {
            // columns
            const colNum = Math.floor((x - 8) / 42);
            const column = this.columns[colNum];
            if (!column.length) return;
            let moved = this.tryGoal(column[column.length - 1])
            if (moved) {
                const card = column.pop();
                let flipped = false;
                if (column.length && !column[column.length - 1].faceUp) {
                    flipped = true;
                    column[column.length - 1].faceUp = true;
                }
                this.undoStack.push(() => {
                    if (flipped) {
                        column[column.length - 1].faceUp = false;
                    }
                    column.push(card);
                });
                return;
            }

            for (let i = 0; i < column.length; i++) {
                if (!column[i].faceUp) continue;
                moved = this.tryMove(column.slice(i));
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
        }
    }

    tryGoal = (card) => {
        for (const goal of this.goals) {
            if ((goal.length === 0 && card.rank === 1) || (goal.length && goal[0].suit === card.suit && goal[0].rank + 1 === card.rank)) {
                goal.unshift(card);
                this.undoStack.push(() => goal.shift());
                return true;
            }
        }
    }

    tryMove = (cards) => {
        const card = cards[0]

        for (const column of this.columns) {
            if (!column.length) continue;
            const topCard = column[column.length - 1];
            if (card.color !== topCard.color && card.rank === topCard.rank - 1) {
                column.push(...cards);
                this.undoStack.push(() => column.splice(-1 * cards.length));
                return true;
            }
        }

        for (const column of this.columns) {
            if (column.length) continue;
            if (card.rank === 13) {
                column.push(...cards);
                this.undoStack.push(() => column.splice(-1 * cards.length));
                return true;
            }
        }

        return false;

    }
}