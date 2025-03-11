import { Element } from "../ui/element.js";
import { Window } from "../ui/window.js";

export class Weather {
    constructor() {
        const windowEl = Window("Weather", {}, Element("div", { class: "sf-weather" }));
        if (!windowEl) return;
        document.body.appendChild(windowEl);
    }
}
