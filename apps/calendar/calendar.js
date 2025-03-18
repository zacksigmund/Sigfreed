import { Button, Element, Window } from "../../system/ui/index.js";

export class Calendar {
    static about =
        "Events coming... event-ually! For now, enjoy knowing which date is on which day!";
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
        this.monthName = Element("h1", {}, this.currentMonthString);
        this.tbody = Element("tbody", {});
        const windowEl = Window(
            "Calendar",
            { About: () => alert(Calendar.about) },
            Element(
                "div",
                { class: "sf-calendar" },
                Element(
                    "div",
                    { class: "navbar" },
                    Button(
                        { "aria-label": "Previous month" },
                        () => {
                            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
                            this.monthName.innerText = this.currentMonthString;
                            this.fillMonth();
                        },
                        "<"
                    ),
                    this.monthName,
                    Button(
                        { "aria-label": "Next month" },
                        () => {
                            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
                            this.monthName.innerText = this.currentMonthString;
                            this.fillMonth();
                        },
                        ">"
                    )
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
}
