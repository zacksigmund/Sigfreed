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
                DockIcon(Todo),
                DockIcon(Calendar),
                DockIcon(Weather),
                DockIcon(Calculator),
                DockIcon(Solitaire),
                DockIcon(FreeCell),
                DockIcon(Spider)
            )
        )
    );
};
