import { Checkbox, Element, RadioGroup, Window } from "../../system/ui/index.js";

export class Settings {
    static about = "More settings coming soon!";
    constructor() {
        const is24h = JSON.parse(localStorage.getItem("settings.24h")) ?? false;
        const theme = localStorage.getItem("system.theme") ?? "system";
        const windowEl = Window(
            "Settings",
            {
                About: () => alert(Settings.about),
            },
            Element("div", {}, Checkbox({ checked: is24h }, this.toggle24h, "24h time")),
            RadioGroup(
                "Theme",
                "theme",
                {
                    light: "Light",
                    system: "System",
                    dark: "Dark",
                },
                theme,
                this.saveTheme
            )
        );
        if (!windowEl) return;
        document.body.appendChild(windowEl);
        windowEl.show();
    }

    toggle24h = (event) => {
        localStorage.setItem("settings.24h", event.target.checked);
        window.bus.push("settingsChanged");
    };

    saveTheme = (value) => {
        document.body.classList.remove("sf-theme-dark", "sf-theme-light", "sf-theme-system");
        document.body.classList.add(`sf-theme-${value}`);
        localStorage.setItem("system.theme", value);
    };
}
