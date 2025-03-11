import { Button } from "../ui/button.js";
import { Element } from "../ui/element.js";
import { Window } from "../ui/window.js";

export class Calendar {
    get currentMonthString() {
        const options = { month: "long" };
        if (this.currentMonth.getFullYear() !== this.thisYear) {
            options.year = "numeric";
        }
        return this.currentMonth.toLocaleDateString("en-US", options);
    }

    constructor() {
        this.currentMonth = new Date();
        this.thisYear = this.currentMonth.getFullYear();
        this.currentMonth.setDate(1);
        this.prevButton = Button({ "aria-label": "Previous month" }, "<");
        this.prevButton.addEventListener("click", () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            this.monthName.innerText = this.currentMonthString;
            this.fillMonth();
        });
        this.monthName = Element("h1", {}, this.currentMonthString);
        this.nextButton = Button({ "aria-label": "Next month" }, ">");
        this.nextButton.addEventListener("click", () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
            this.monthName.innerText = this.currentMonthString;
            this.fillMonth();
        });
        this.tbody = Element("tbody", {});
        const windowEl = Window(
            "Calendar",
            {},
            Element(
                "div",
                { class: "sf-calendar" },
                Element(
                    "div",
                    { class: "navbar" },
                    this.prevButton,
                    this.monthName,
                    this.nextButton
                ),
                Element(
                    "table",
                    {},
                    Element(
                        "thead",
                        {},
                        Element("th", {}, "Sun"),
                        Element("th", {}, "Mon"),
                        Element("th", {}, "Tue"),
                        Element("th", {}, "Wed"),
                        Element("th", {}, "Thu"),
                        Element("th", {}, "Fri"),
                        Element("th", {}, "Sat")
                    ),
                    this.tbody
                )
            )
        );
        if (!windowEl) return;
        this.fillMonth();
        document.body.appendChild(windowEl);
    }

    fillMonth = () => {
        this.tbody.innerHTML = "";
        const dateCounter = new Date(this.currentMonth);
        dateCounter.setDate(-dateCounter.getDay() + 1);
        let row;
        for (let i = 0; i < 42; i++) {
            if (dateCounter.getDay() === 0) {
                row = Element("tr");
                this.tbody.appendChild(row);
            }
            row.appendChild(
                Element(
                    "td",
                    {},
                    dateCounter.getMonth() === this.currentMonth.getMonth()
                        ? dateCounter.getDate().toString()
                        : " "
                )
            );
            dateCounter.setDate(dateCounter.getDate() + 1);
        }
    };

    getMonthName = () => {};
}
