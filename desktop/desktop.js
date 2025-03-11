import { Calendar } from "../calendar/calendar.js";
import { FreeCell } from "../freecell/freecell.js";
import { Solitaire } from "../solitaire/solitaire.js";
import { Todo } from "../todo/todo.js";
import { Element } from "../ui/element.js";
import { DockIcon } from "./dock-icon.js";

export const Desktop = () => {
    return Element(
        "div",
        { class: "sf-desktop" },
        Element(
            "div",
            { class: "sf-dock" },
            Element(
                "div",
                {},
                DockIcon("/todo/images/todo.app.png", () => new Todo()),
                DockIcon("/calendar/images/calendar.app.png", () => new Calendar()),
                DockIcon("/solitaire/images/solitaire.app.png", () => new Solitaire()),
                DockIcon("/freecell/images/freecell.app.png", () => new FreeCell())
            )
        )
    );
};
