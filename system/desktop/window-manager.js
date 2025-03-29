import { Desktop } from "./desktop.js";

export class WindowManager {
    constructor() {
        this.openApps = {};
        document.body.appendChild(Desktop());
    }

    launch = (App) => {
        if (this.openApps[App.name]) return;
        const app = new App(this);
        this.openApps[App.name] = app;
        document.body.appendChild(app.windowEl);
        app.windowEl.show();
        app.init?.();
    };

    close = (appName) => {
        if (this.openApps[appName]) {
            document.body.removeChild(this.openApps[appName].windowEl);
            delete this.openApps[appName];
        }
    };
}
