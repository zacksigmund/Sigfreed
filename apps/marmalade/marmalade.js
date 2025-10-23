import { Element, Textbox, UnstyledButton, Window } from "../../system/ui/index.js";
import { range } from "../../system/utils.js";

export class Marmalade {
    static name = "Marmalade";
    static icon = "apps/calculator/calculator.app.png";
    static about = "What a delicious spread!";

    static numCols = 3;
    static numRows = 5;

    constructor() {
        const formulaBar = Element(
            "div",
            { class: "formula-bar" },
            Element("span", {}, "f(x)"),
            Textbox()
        );
        const table = Element(
            "table",
            { class: "table" },
            ...range(Marmalade.numRows).map((i) =>
                Element(
                    "tr",
                    {},
                    ...range(Marmalade.numCols).map(() =>
                        Element(
                            i === 0 ? "th" : "td",
                            {},
                            UnstyledButton({}, () => {}, "")
                        )
                    )
                )
            )
        );
        this.windowEl = Window(
            Marmalade.name,
            [["About", "/", () => alert(Marmalade.about)]],
            Element("div", { class: "sf-marmalade" }, formulaBar, table)
        );
    }
}
