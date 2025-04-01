import { Calculator } from "../../apps/calculator/calculator.js";
import { Calendar } from "../../apps/calendar/calendar.js";
import { Sticky } from "../../apps/sticky/sticky.js";
import { Todo } from "../../apps/todo/todo.js";
import { Weather } from "../../apps/weather/weather.js";
import { FreeCell } from "../../games/freecell/freecell.js";
import { Snake } from "../../games/snake/snake.js";
import { Solitaire } from "../../games/solitaire/solitaire.js";
import { Spider } from "../../games/spider/spider.js";
import { Element } from "../ui/element.js";
import { DockIcon } from "./dock-icon.js";
import { StatusBar } from "./statusbar.js";

export const Desktop = () => {
    const dockScroll = Element(
        "div",
        {},
        DockIcon(Todo),
        DockIcon(Calendar),
        DockIcon(Weather),
        DockIcon(Calculator),
        DockIcon(Sticky),
        DockIcon(Solitaire),
        DockIcon(FreeCell),
        DockIcon(Spider),
        DockIcon(Snake)
    );
    const updateGradient = () => {
        if (dockScroll.scrollLeft <= 8) {
            dockScroll.classList.remove("gradientStart");
        } else {
            dockScroll.classList.add("gradientStart");
        }

        if (dockScroll.scrollLeft + dockScroll.clientWidth >= dockScroll.scrollWidth - 8) {
            dockScroll.classList.remove("gradientEnd");
        } else {
            dockScroll.classList.add("gradientEnd");
        }
    };
    dockScroll.addEventListener("scroll", updateGradient);
    setTimeout(updateGradient, 15);

    return Element(
        "div",
        { class: "sf-desktop" },
        StatusBar(),
        Element("div", { class: "sf-dock" }, dockScroll)
    );
};
