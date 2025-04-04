import { Button, Element, UnstyledButton, Window } from "../../system/ui/index.js";
import { Note } from "../sticky/note.js";

export class Calendar {
    static name = "Calendar";
    static icon = "apps/calendar/calendar.app.png";
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
        const smallScreen = window.matchMedia("(max-width: 480px)").matches;
        this.windowEl = Window(
            Calendar.name,
            [["About", "/", () => alert(Calendar.about)]],
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
                        Element("th", {}, smallScreen ? "S" : "Sun"),
                        Element("th", {}, smallScreen ? "M" : "Mon"),
                        Element("th", {}, smallScreen ? "T" : "Tue"),
                        Element("th", {}, smallScreen ? "W" : "Wed"),
                        Element("th", {}, smallScreen ? "T" : "Thu"),
                        Element("th", {}, smallScreen ? "F" : "Fri"),
                        Element("th", {}, smallScreen ? "S" : "Sat")
                    ),
                    this.tbody
                )
            )
        );
        window.bus.on("updateSticky", this.fillMonth);
        this.fillMonth();
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
                        ? this.getDateButton(dateCounter)
                        : " "
                )
            );
            dateCounter.setDate(dateCounter.getDate() + 1);
        }
    };

    getDateButton = (date) => {
        // en-CA happens to use yyyy-mm-dd
        const currentDate = new Date(date).toLocaleDateString("en-CA");
        const hasEvent = localStorage.getItem(`Sticky.${currentDate}`);
        return UnstyledButton(
            { class: "day-button" },
            () => this.addNote(currentDate),
            Element(
                "div",
                hasEvent
                    ? { class: "has-event", "aria-label": "Update event for " }
                    : { "aria-label": "Add event for " }
            ),
            date.getDate().toString()
        );
    };

    addNote = (date) => {
        const note = new Note(date).windowEl;
        this.windowEl.appendChild(note);
        note.show();
    };
}
