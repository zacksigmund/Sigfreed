export class Card {
    rank;
    suit;
    static suits = ["spades", "clubs", "diamonds", "hearts"];
    static img;

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
        const sy = Card.suits.indexOf(this.suit) * 58;
        const sx = this.rank * 44;
        ctx.drawImage(Card.img, sx, sy, 44, 58, x, y, 44, 58);
    };

    static init = (callback) => {
        Card.img = new Image();
        Card.img.onload = () => callback?.();
        Card.img.src = "/solitaire/images/cards.png";
    };

    static drawBack = (ctx, x, y) => {
        ctx.drawImage(Card.img, 0, 0, 44, 58, x, y, 44, 58);
    };

    static drawFrame = (ctx, x, y) => {
        ctx.drawImage(Card.img, 0, 58, 44, 58, x, y, 44, 58);
    };

    static allCards = () => {
        const cards = [];
        for (let suit = 0; suit < 4; suit++) {
            cards.push(...Card.oneSuit(Card.suits[suit]));
        }
        return cards;
    };

    static oneSuit = (suit) => {
        const cards = [];
        for (let rank = 1; rank <= 13; rank++) {
            cards.push(new Card(rank, suit));
        }
        return cards;
    };

    static shuffle = (cards) => {
        let m = cards.length,
            t,
            i;

        // While there remain elements to shuffle…
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = cards[m];
            cards[m] = cards[i];
            cards[i] = t;
        }
        return cards;
    };
}
