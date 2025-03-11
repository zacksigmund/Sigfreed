import { Calendar } from "../calendar/calendar.js";
import { Element } from "../ui/element.js";

let datebox, timebox;

export const StatusBar = () => {
    datebox = Element("button", { class: "datebox" });
    datebox.addEventListener("click", () => new Calendar());
    timebox = Element("div", { class: "timebox" });
    getDateTime();
    setInterval(getDateTime, 60 * 1000);
    return Element(
        "div",
        { class: "sf-statusbar" },
        Element("div", { class: "datetimebox" }, datebox, timebox)
    );
};

const getDateTime = () => {
    const date = new Date();
    datebox.innerHTML =
        date.toLocaleDateString("en-US", {
            weekday: "short",
        }) +
        " " +
        date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    timebox.innerHTML = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
    });
};
