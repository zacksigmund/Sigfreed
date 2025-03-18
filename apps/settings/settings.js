import { Checkbox } from "../../system/ui/checkbox.js";
import { Element } from "../../system/ui/element.js";
import { Window } from "../../system/ui/window.js";

export class Settings {
    static about = "More settings coming soon!";
    constructor() {
        const is24h = JSON.parse(localStorage.getItem("settings.24h")) ?? false;
        const windowEl = Window(
            "Settings",
            {
                About: () => alert(Settings.about),
            },
            Element("div", {}, Checkbox({ checked: is24h }, this.toggle24h, "24h time"))
        );
        if (!windowEl) return;
        document.body.appendChild(windowEl);
    }

    toggle24h = (event) => {
        localStorage.setItem("settings.24h", event.target.checked);
    };
}
