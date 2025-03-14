import { Button } from "../../system/ui/button.js";
import { Element } from "../../system/ui/element.js";
import { Window } from "../../system/ui/window.js";

export class Calculator {
    constructor() {
        const input = Element("div");
        const display = Element("div", {}, 0);
        const clear = Button({}, "C");
        const divide = Button({}, "÷");
        const times = Button({}, "×");
        const minus = Button({}, "-");
        const plus = Button({}, "+");
        const equals = Button({}, "=");
        const nine = Button({}, 9);
        const eight = Button({}, 8);
        const seven = Button({}, 7);
        const six = Button({}, 6);
        const five = Button({}, 5);
        const four = Button({}, 4);
        const three = Button({}, 3);
        const two = Button({}, 2);
        const one = Button({}, 1);
        const zero = Button({}, 0);
        const point = Button({}, ".");
        const windowEl = Window(
            "Calculator",
            {},
            Element(
                "div",
                { class: "sf-calculator" },
                Element("div", { class: "screen" }, input, display),
                Element(
                    "div",
                    { class: "button-grid" },
                    clear,
                    divide,
                    times,
                    minus,
                    seven,
                    eight,
                    nine,
                    plus,
                    four,
                    five,
                    six,
                    one,
                    two,
                    three,
                    equals,
                    zero,
                    point
                )
            )
        );
        if (!windowEl) return;
        document.body.appendChild(windowEl);
    }
}
