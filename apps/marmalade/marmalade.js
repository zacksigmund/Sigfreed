import { Element, Textbox, UnstyledButton, Window } from "../../system/ui/index.js";
import { range } from "../../system/utils.js";

export class Marmalade {
    static name = "Marmalade";
    static icon = "apps/marmalade/marmalade.app.png";
    static about = "What a delicious spread!";

    static numCols = 5;
    static numRows = 10;

    constructor() {
        this.formulaBox = Textbox({ class: "formula-input" });
        this.formulaInput = this.formulaBox.querySelector("input");
        this.formulaBox.addEventListener("keydown", (event) => {
            if (event.key === "Tab") {
                this.executeFormula(event);
            }
        });
        const table = Element(
            "table",
            { class: "table" },
            Element(
                "thead",
                {},
                Element("tr", {}, ..." ABCDE".split("").map((char) => Element("th", {}, char)))
            ),
            Element(
                "tbody",
                {},
                ...range(Marmalade.numRows).map((i) =>
                    Element(
                        "tr",
                        {},
                        Element("th", {}, i + 1),
                        ...range(Marmalade.numCols).map(() =>
                            Element("td", {}, UnstyledButton({}, this.selectCell, ""))
                        )
                    )
                )
            )
        );
        const form = Element(
            "form",
            { class: "formula-bar", onSubmit: this.executeFormula },
            Element("span", { class: "fx" }, "f(x)"),
            this.formulaBox
        );
        form.addEventListener("submit", this.executeFormula);
        this.windowEl = Window(
            Marmalade.name,
            [["About", "/", () => alert(Marmalade.about)]],
            Element("div", { class: "sf-marmalade" }, form, table)
        );
    }

    selectCell = (event) => {
        this.selectedCell?.classList.remove("selected");
        this.selectedCell = event.target;
        this.selectedCell.classList.add("selected");
        this.formulaInput.value = this.selectedCell.textContent;
        this.formulaInput.focus();
    };

    executeFormula = (event) => {
        event.preventDefault();
        if (this.selectedCell) {
            this.selectedCell.textContent = this.formulaInput.value;
            this.formulaInput.value = "";
            if (event.type === "keydown") {
                // tab
                let cell = this.selectedCell.parentElement.nextElementSibling;
                if (!cell) {
                    cell = this.selectedCell.closest("tr").nextElementSibling?.cells[1];
                }
                cell?.querySelector("button").click();
            } else {
                // enter
                const row = this.selectedCell.closest("tr");
                const cellIndex = Array.from(row.cells).indexOf(this.selectedCell.parentElement);
                row.nextElementSibling?.cells[cellIndex]?.querySelector("button").click();
            }
        }
    };
}
