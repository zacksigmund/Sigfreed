import { Window } from "../../system/ui/window.js";

export class Settings {
    static about = "More settings coming soon!";
    constructor() {
        const windowEl = Window("Settings", {
            About: () => alert(Settings.about),
        });
        if (!windowEl) return;
        document.body.appendChild(windowEl);
    }
}
