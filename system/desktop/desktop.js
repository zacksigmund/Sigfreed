import { Calculator } from "../../apps/calculator/calculator.js";
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
                DockIcon("Todo", "apps/todo/todo.app.png", () => new Todo()),
                DockIcon("Calendar", "apps/calendar/calendar.app.png", () => new Calendar()),
                DockIcon("Weather", "apps/weather/weather.app.png", () => new Weather()),
                DockIcon(
                    "Calculator",
                    "apps/calculator/calculator.app.png",
                    () => new Calculator()
                ),
                DockIcon("Solitaire", "games/solitaire/solitaire.app.png", () => new Solitaire()),
                DockIcon("FreeCell", "games/freecell/freecell.app.png", () => new FreeCell()),
                DockIcon("Spider", "games/spider/spider.app.png", () => new Spider())
            )
        )
    );
};
