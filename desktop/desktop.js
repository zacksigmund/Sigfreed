import { Calendar } from "../calendar/calendar.js";
import { FreeCell } from "../freecell/freecell.js";
import { Solitaire } from "../solitaire/solitaire.js";
import { Spider } from "../spider/spider.js";
import { Todo } from "../todo/todo.js";
import { Element } from "../ui/element.js";
import { Weather } from "../weather/weather.js";
import { DockIcon } from "./dock-icon.js";
import { StatusBar } from "./statusbar.js";

export const Desktop = () => {
    return Element(
        "div",
        { class: "sf-desktop" },
        StatusBar(),
        Element(
            "div",
            { class: "sf-dock" },
            Element(
                "div",
                {},
                DockIcon("/todo/images/todo.app.png", () => new Todo()),
                DockIcon("/calendar/images/calendar.app.png", () => new Calendar()),
                DockIcon("/weather/images/weather.app.png", () => new Weather()),
                DockIcon("/solitaire/images/solitaire.app.png", () => new Solitaire()),
                DockIcon("/freecell/images/freecell.app.png", () => new FreeCell()),
                DockIcon("/spider/images/spider.app.png", () => new Spider())
            )
        )
    );
};
