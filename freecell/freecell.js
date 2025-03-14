import { Card } from "../solitaire/card.js";
import { Element } from "../ui/element.js";
import { Window } from "../ui/window.js";

const noop = () => {};

export class FreeCell {
    constructor() {
        const ui = this.render();
        if (!ui) return;
        document.body.appendChild(ui);
        this.newGame();
        this.canvas = document.getElementById("freecell");
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
            "Free Cell",
            { "New Game": this.newGame },
            Element("canvas", { id: "freecell", width: 408, height: 320 })
        );
    };

    newGame = () => {
        this.freeCells = [null, null, null, null];
        this.goals = [[], [], [], []];
        this.columns = [[], [], [], [], [], [], [], []];
        this.undoStack = [];
        this.deal();
    };

    deal = () => {
        const deck = Card.shuffle(Card.allCards());
        deck.forEach((card) => (card.faceUp = true));
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i] = deck.splice(0, i < 4 ? 7 : 6);
        }
    };

    draw = () => {
        this.ctx.clearRect(0, 0, 408, 320);

        // free cells
        for (let i = 0; i < 4; i++) {
            if (this.freeCells[i]) {
                this.freeCells[i].draw(this.ctx, 8 + 44 * i, 8);
            } else {
                Card.drawFrame(this.ctx, 8 + 44 * i, 8);
            }
        }

        // undo
        this.ctx.font = "16px serif";
        this.ctx.fillText("🔁", 8 + 4 * 44 + 10, 44);

        // goal
        for (let i = 0; i < this.goals.length; i++) {
            if (this.goals[i].length) {
                this.goals[i][0].draw(this.ctx, 8 + 44 * (i + 5), 8);
            } else {
                Card.drawFrame(this.ctx, 8 + 44 * (i + 5), 8);
            }
        }

        // columns
        for (let i = 0; i < this.columns.length; i++) {
            const x = 8 + 22 + 44 * i;
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
        if (7 < x && x < 180 && 7 < y && y < 71) {
            const cell = Math.floor((x - 8) / 44);
            this.clickFreeCell(cell);
        } else if (196 < x && x < 211 && 31 < y && y < 46) {
            this.clickUndo();
        } else if (y > 83) {
            const colNum = Math.floor((x - 8 - 22) / 44);
            const column = this.columns[colNum];
            this.clickColumns(column, altClick);
        }
    };

    clickFreeCell = (cell) => {
        const card = this.freeCells[cell];
        if (!card) return;
        let moved = this.tryGoal(card) || this.tryMove([card]);
        if (moved) {
            this.freeCells[cell] = null;
            this.undoStack.push(() => {
                this.freeCells[cell] = card;
            });
            return;
        }
    };

    clickUndo = () => {
        if (this.undoStack.length) {
            this.undoStack.pop()();
            this.undoStack.pop()();
        }
    };

    clickColumns = (column, altClick) => {
        if (!column.length) return;
        let moved = this.tryGoal(column[column.length - 1]);
        if (moved) {
            const card = column.pop();
            this.undoStack.push(() => {
                column.push(card);
            });
            return;
        }

        let i = column.length - 1;
        let cond = () => i >= 0;
        let inc = () => i--;
        if (!altClick) {
            cond = () => i < column.length;
            inc = () => i++;
            // find the highest element that's not part of the move stack
            while (
                i > 0 &&
                column[i].color !== column[i - 1].color &&
                column[i].rank + 1 === column[i - 1].rank
            ) {
                i--;
            }
        }

        for (; cond(); inc()) {
            moved = this.tryMove(column.slice(i));
            if (moved) {
                const cards = column.splice(i);
                this.undoStack.push(() => {
                    column.push(...cards);
                });
                return;
            }
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
        const legalMoveCount =
            this.freeCells.filter((cell) => cell === null).length +
            this.columns.filter((col) => col.length === 0).length +
            1;

        if (cards.length > legalMoveCount) return false;

        const card = cards[0];

        for (const column of this.columns) {
            if (!column.length) continue;
            const topCard = column[column.length - 1];
            if (card.color !== topCard.color && card.rank === topCard.rank - 1) {
                column.push(...cards);
                this.undoStack.push(() => column.splice(-1 * cards.length));
                return true;
            }
        }

        // can't count the moved-into-column for legal move count
        if (cards.length <= legalMoveCount - 1) {
            for (const column of this.columns) {
                if (column.length) continue;
                column.push(...cards);
                this.undoStack.push(() => column.splice(-1 * cards.length));
                return true;
            }
        }

        if (cards.length === 1) {
            for (let i = 0; i < 4; i++) {
                if (this.freeCells[i]) continue;
                this.freeCells[i] = card;
                this.undoStack.push(() => (this.freeCells[i] = null));
                return true;
            }
        }

        return false;
    };
}
