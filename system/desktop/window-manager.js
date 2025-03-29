import { Desktop } from "./desktop.js";

export class WindowManager {
    constructor() {
        this.openApps = [];
        document.body.appendChild(Desktop());
    }

    launch = (App) => {
        if (this.openApps.includes(App.name)) return;
        new App(this);
        this.openApps.push(App.name);
    };

    close = (appName) => {
        if (this.openApps.includes(appName)) {
            this.openApps.splice(this.openApps.indexOf(appName), 1);
        }
    };
}
