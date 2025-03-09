export class Card {
    rank;
    suit;
    static suits = ["spades", "clubs", "diamonds", "hearts"];

    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.faceUp = false;
    }

    get printedRank() {
        switch (this.rank) {
            case 13:
                return "K";
            case 12:
                return "Q";
            case 11:
                return "J";
            case 1:
                return "A";
            default:
                return this.rank.toString();
        }
    }

    get printedSuit() {
        switch (this.suit) {
            case "spades":
                return "♠️";
            case "clubs":
                return "♣️";
            case "diamonds":
                return "♦️";
            case "hearts":
                return "♥️";
        }
    }

    get color() {
        switch (this.suit) {
            case "spades":
            case "clubs":
                return "black";
            case "diamonds":
            case "hearts":
                return "red";
        }
    }

    draw = (ctx, x, y) => {
        if (this.faceUp) {
            this.drawFront(ctx, x, y);
        } else {
            Card.drawBack(ctx, x, y);
        }
    };

    drawFront = (ctx, x, y) => {
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, 40, 64);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 40, 64);
        ctx.fillStyle = this.color;
        ctx.font = "10px serif";
        ctx.fillText(`${this.printedRank}${this.printedSuit}`, x + 4, y + 12);
        ctx.font = "16px serif";
        ctx.fillText(this.printedSuit, x + 9, y + 38);
    };

    static drawBack = (ctx, x, y) => {
        ctx.fillStyle = "skyblue";
        ctx.fillRect(x, y, 40, 64);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 40, 64);
        ctx.font = "10px serif";
        ctx.fillText("♠️♦️", x + 6, y + 28);
        ctx.fillText("♥️♣️", x + 6, y + 40);
    };

    static drawFrame = (ctx, x, y) => {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 40, 64);
    };

    static allCards = () => {
        const cards = [];
        for (let rank = 1; rank <= 13; rank++) {
            for (let suit = 0; suit < 4; suit++) {
                cards.push(new Card(rank, Card.suits[suit]));
            }
        }
        return cards;
    };
}
