import { Element, Window } from "../../system/ui/index.js";

export class Snake {
    static name = "Snake";
    static icon = "games/snake/snake.app.png";
    static about = "Snake! Arrow keys or WASD to move. Alt+N for new game.";
    static GRID_WIDTH = 38;
    static GRID_HEIGHT = 28;
    static EMPTY_SCORES = Array.from(Array(10)).map((_) => ({ initials: "NO1", points: 0 }));

    constructor() {
        this.windowEl = Window(
            Snake.name,
            [
                ["New Game", "n", this.newGame],
                ["High Scores", "h", this.showHighScores],
                ["About", "/", () => alert(Snake.about)],
            ],
            Element("canvas", { id: "snake", width: 320, height: 240 })
        );
        window.bus.on("appStateChanged", this.onClose);
    }

    onClose = () => {
        if (!window.windowManager.isOpen(Snake.name)) {
            this.stop();
            window.removeEventListener("keydown", this.keydown);
            clearInterval(this.interval);
        }
    };

    stop = () => {
        if (this.running) {
            const scores = this.loadScores();
            if (scores.some((score) => this.snake.length - 2 > score.points)) {
                const text = prompt("Enter initials") ?? "YOU";
                const initials = text.substring(0, 3).toUpperCase();
                scores.push({ initials, points: this.snake.length - 2 });
                scores.sort((a, b) => b.points - a.points);
                if (scores.length > 10) {
                    scores.pop();
                }
                this.saveScores(scores);
            }
        }
        this.running = false;
    };

    showHighScores = () => {
        alert(
            this.loadScores()
                .map(({ initials, points }) => `${initials}:        ${points}pts`)
                .join("\n")
        );
    };

    loadScores = () => {
        return JSON.parse(localStorage.getItem("Snake.highScores")) ?? Snake.EMPTY_SCORES;
    };

    saveScores = (scores) => {
        localStorage.setItem("Snake.highScores", JSON.stringify(scores));
    };

    init = () => {
        this.canvas = document.getElementById("snake");
        this.ctx = this.canvas.getContext("2d");
        window.addEventListener("keydown", this.keydown);
        this.interval = setInterval(this.update, 1000 / 15);
        this.newGame();
    };

    newGame = () => {
        this.stop();
        this.ctx.strokeStyle = getComputedStyle(this.canvas).getPropertyValue("--c-primary-fg");
        this.ctx.fillStyle = "none";
        this.ctx.lineWidth = 4;
        this.snake = [
            [4, 3],
            [5, 3],
        ];
        this.running = true;
        this.apple = [16, 3];
        this.dir = "right";
        requestAnimationFrame(this.draw);
    };

    keydown = (event) => {
        event.preventDefault();
        if ((event.key === "ArrowUp" || event.key === "w") && this.dir !== "down") {
            this.dir = "up";
        } else if ((event.key === "ArrowDown" || event.key === "s") && this.dir !== "up") {
            this.dir = "down";
        } else if ((event.key === "ArrowLeft" || event.key === "a") && this.dir !== "right") {
            this.dir = "left";
        } else if ((event.key === "ArrowRight" || event.key === "d") && this.dir !== "left") {
            this.dir = "right";
        }
    };

    update = () => {
        // calc next
        const [cx, cy] = this.snake.at(-1);
        let next;
        if (this.dir === "right") {
            next = [cx + 1, cy];
        } else if (this.dir === "left") {
            next = [cx - 1, cy];
        } else if (this.dir === "up") {
            next = [cx, cy - 1];
        } else {
            next = [cx, cy + 1];
        }

        // die
        if (this.snake.some(([sx, sy], i) => i > 0 && next[0] === sx && next[1] === sy))
            this.stop();
        if (
            next[0] < 1 ||
            next[0] > Snake.GRID_WIDTH + 1 ||
            next[1] < 1 ||
            next[1] > Snake.GRID_HEIGHT + 1
        )
            this.stop();

        // update
        this.snake.push(next);
        if (next[0] === this.apple[0] && next[1] === this.apple[1]) {
            do {
                this.apple = [
                    Math.ceil(Math.random() * Snake.GRID_WIDTH),
                    Math.ceil(Math.random() * Snake.GRID_HEIGHT),
                ];
            } while (this.snake.some(([sx, sy]) => this.apple[0] === sx && this.apple[1] === sy));
        } else {
            this.snake.shift();
        }
    };

    draw = () => {
        this.ctx.clearRect(0, 0, 320, 240);
        this.ctx.beginPath();
        this.ctx.moveTo(this.snake[0][0] * 8, this.snake[0][1] * 8);
        for (let i = 1; i < this.snake.length; i++) {
            this.ctx.lineTo(this.snake[i][0] * 8, this.snake[i][1] * 8);
        }
        this.ctx.stroke();
        this.ctx.strokeRect(this.apple[0] * 8, this.apple[1] * 8, 1, 1);
        if (this.running) {
            requestAnimationFrame(this.draw);
        } else {
            this.ctx.fillStyle = getComputedStyle(this.canvas).getPropertyValue("--c-danger");
            this.ctx.font = "bold 48px sans-serif";
            this.ctx.fillText("GAME", 86, 100);
            this.ctx.fillText("OVER", 92, 156);
        }
    };
}
