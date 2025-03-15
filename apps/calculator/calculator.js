import { Button } from "../../system/ui/button.js";
import { Element } from "../../system/ui/element.js";
import { Window } from "../../system/ui/window.js";

export class Calculator {
    static about =
        "Does not support order of operations! DOES support keyboard input. You need to get focus in the window though, which can be tricky currently. Will look to fix that in the future.";
    static operators = {
        plus: (a, b) => a + b,
        minus: (a, b) => a - b,
        times: (a, b) => a * b,
        divide: (a, b) => a / b,
    };

    prevValue = 0;
    operator = null;
    decimal = 0;

    _value = 0;
    get value() {
        return this._value;
    }
    set value(newValue) {
        this._value = newValue;
        this.displayValue(this._value === 0 ? this.prevValue : this._value);
    }

    constructor() {
        const input = Element("div");
        this.display = Element("div", {}, 0);
        const clear = Button(
            {},
            () => {
                this.operator = null;
                this.prevValue = 0;
                this.value = 0;
            },
            "C"
        );
        const plus = Button(
            {},
            () => {
                if (this.value !== 0) {
                    this.evaluate();
                }
                this.operator = "plus";
            },
            "+"
        );
        const minus = Button(
            {},
            () => {
                if (this.value !== 0) {
                    this.evaluate();
                }
                this.operator = "minus";
            },
            "-"
        );
        const times = Button(
            {},
            () => {
                if (this.value !== 0) {
                    this.evaluate();
                }
                this.operator = "times";
            },
            "×"
        );
        const divide = Button(
            {},
            () => {
                if (this.value !== 0) {
                    this.evaluate();
                }
                this.operator = "divide";
            },
            "÷"
        );
        const equals = Button(
            {},
            () => {
                if (!this.operator) return;
                this.evaluate();
            },
            "="
        );
        const numbers = Array.from(Array(10)).map((_, i) =>
            Button(
                {},
                () => {
                    if (this.decimal === 0) {
                        this.value *= 10;
                        this.value += i;
                    } else {
                        this.value += i * Math.pow(10, this.decimal);
                        this.decimal--;
                    }
                },
                i
            )
        );
        const point = Button(
            {},
            () => {
                if (this.decimal === 0) {
                    this.decimal = -1;
                    this.displayValue(this.value);
                }
            },
            "."
        );
        const windowEl = Window(
            "Calculator",
            { About: () => alert(Calculator.about) },
            Element(
                "div",
                { class: "sf-calculator" },
                Element("div", { class: "screen" }, input, this.display),
                Element(
                    "div",
                    { class: "button-grid" },
                    clear,
                    divide,
                    times,
                    minus,
                    numbers[7],
                    numbers[8],
                    numbers[9],
                    plus,
                    numbers[4],
                    numbers[5],
                    numbers[6],
                    numbers[1],
                    numbers[2],
                    numbers[3],
                    equals,
                    numbers[0],
                    point
                )
            )
        );
        if (!windowEl) return;
        // TODO: Listening to only windowEl makes it hard to pick up events sometimes
        windowEl.addEventListener("keydown", (event) => {
            const digit = parseInt(event.key, 10);
            if (!isNaN(digit)) {
                numbers[digit].classList.add("pushed");
                numbers[digit].click();
            } else if (event.key === "Enter" || event.key === "=") {
                event.preventDefault();
                equals.classList.add("pushed");
                equals.click();
            } else if (event.key === "+") {
                plus.classList.add("pushed");
                plus.click();
            } else if (event.key === "-") {
                minus.classList.add("pushed");
                minus.click();
            } else if (event.key === "*") {
                times.classList.add("pushed");
                times.click();
            } else if (event.key === "/") {
                divide.classList.add("pushed");
                divide.click();
            } else if (event.key === ".") {
                point.classList.add("pushed");
                point.click();
            } else if (event.key === "c") {
                clear.classList.add("pushed");
                clear.click();
            }
        });
        windowEl.addEventListener("keyup", (event) => {
            const digit = parseInt(event.key, 10);
            if (!isNaN(digit)) {
                numbers[digit].classList.remove("pushed");
            } else if (event.key === "Enter" || event.key === "=") {
                equals.classList.remove("pushed");
            } else if (event.key === "+") {
                plus.classList.remove("pushed");
            } else if (event.key === "-") {
                minus.classList.remove("pushed");
            } else if (event.key === "*") {
                times.classList.remove("pushed");
            } else if (event.key === "/") {
                divide.classList.remove("pushed");
            } else if (event.key === ".") {
                point.classList.remove("pushed");
            } else if (event.key === "c") {
                clear.classList.remove("pushed");
            }
        });
        document.body.appendChild(windowEl);
    }

    evaluate = () => {
        this.prevValue = this.operator
            ? Calculator.operators[this.operator](this.prevValue, this.value)
            : this.value;
        this.value = 0;
        this.decimal = 0;
        this.operator = null;
    };

    displayValue = (value) => {
        this.display.innerText = this.decimal < 0 && value % 1 === 0 ? value + "." : value;
    };
}
