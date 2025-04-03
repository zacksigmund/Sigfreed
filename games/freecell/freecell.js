import { Element, Window } from "../../system/ui/index.js";
import { Card } from "../solitaire/card.js";
import { CardStack } from "../solitaire/cardStack.js";

const noop = () => {};

export class FreeCell {
    static name = "Free Cell";
    static icon = "games/freecell/freecell.app.png";
    static about =
        "Only click the cards for now, no drag-and-drop. You can click specific cards within the stack, though.";

    constructor() {
        this.windowEl = Window(
            FreeCell.name,
            [
                ["New Game", null, this.newGame],
                ["About", "/", () => alert(FreeCell.about)],
            ],
            Element("canvas", { id: "freecell", width: 408, height: 320 })
        );
    }

    init = () => {
        this.newGame();
        this.canvas = document.getElementById("freecell");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.click);
        Card.init(() => {
            requestAnimationFrame(this.draw);
        });
    };

    render = () => {
        return;
    };

    newGame = () => {
        this.freeCells = [null, null, null, null];
        this.goals = Array.from(Array(4)).map(() => new CardStack());
        this.columns = Array.from(Array(8)).map(() => new CardStack());
        this.undoStack = [];
        this.deal();
    };

    deal = () => {
        const deck = new CardStack(Card.shuffle(Card.allCards()));
        deck.cards.forEach((card) => (card.faceUp = true));
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].assign(deck.draw(i < 4 ? 7 : 6));
            this.columns[i].tallStackLength = 12;
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
            this.goals[i].renderPile(this.ctx, 8 + 44 * (i + 5), 8);
        }

        // columns
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].render(this.ctx, 8 + 22 + 44 * i, 84);
        }
        requestAnimationFrame(this.draw);
    };

    click = (e) => {
        const x = Math.floor((e.offsetX * e.target.width) / e.target.clientWidth),
            y = Math.floor((e.offsetY * e.target.height) / e.target.clientHeight);
        if (7 < x && x < 180 && 7 < y && y < 71) {
            const cell = Math.floor((x - 8) / 44);
            this.clickFreeCell(cell);
        } else if (196 < x && x < 211 && 31 < y && y < 46) {
            this.clickUndo();
        } else if (y >= 84) {
            const colNum = Math.floor((x - 8 - 22) / 44);
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
            if (cards[i].color !== cards[i + 1].color && cards[i].rank === cards[i + 1].rank + 1) {
                continue;
            } else {
                return false;
            }
        }
        return true;
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

    clickColumns = (column, cards) => {
        if (!column.length) return;
        if (cards.length === 1) {
            let moved = this.tryGoal(column.top);
            if (moved) {
                const [card] = column.draw();
                this.undoStack.push(() => {
                    column.push(card);
                });
                return;
            }
        }

        let moved = this.tryMove(cards);
        if (moved) {
            column.draw(cards.length);
            this.undoStack.push(() => {
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
        const legalMoveCount =
            this.freeCells.filter((cell) => cell === null).length +
            this.columns.filter((col) => col.length === 0).length +
            1;

        if (cards.length > legalMoveCount) return false;

        const card = cards[0];

        for (const column of this.columns) {
            if (!column.length) continue;
            const topCard = column.top;
            if (card.color !== topCard.color && card.rank + 1 === topCard.rank) {
                column.push(...cards);
                this.undoStack.push(() => column.draw(cards.length));
                return true;
            }
        }

        // can't count the moved-into-column for legal move count
        if (cards.length <= legalMoveCount - 1) {
            for (const column of this.columns) {
                if (column.length) continue;
                column.push(...cards);
                this.undoStack.push(() => column.draw(cards.length));
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
