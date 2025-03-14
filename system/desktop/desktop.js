import { Calendar } from "../../apps/calendar/calendar.js";
import { Todo } from "../../apps/todo/todo.js";
import { Weather } from "../../apps/weather/weather.js";
import { FreeCell } from "../../games/freecell/freecell.js";
import { Solitaire } from "../../games/solitaire/solitaire.js";
import { Spider } from "../../games/spider/spider.js";
import { Element } from "../ui/element.js";
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
                DockIcon("apps/todo/todo.app.png", () => new Todo()),
                DockIcon("apps/calendar/calendar.app.png", () => new Calendar()),
                DockIcon("apps/weather/weather.app.png", () => new Weather()),
                DockIcon("games/solitaire/solitaire.app.png", () => new Solitaire()),
                DockIcon("games/freecell/freecell.app.png", () => new FreeCell()),
                DockIcon("games/spider/spider.app.png", () => new Spider())
            )
        )
    );
};
