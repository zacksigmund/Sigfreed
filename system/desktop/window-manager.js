import { Desktop } from "./desktop.js";

export class WindowManager {
    constructor() {
        this.openApps = {};
        document.body.appendChild(Desktop());
    }

    open = (App) => {
        if (this.openApps[App.name]) {
            this.openApps[App.name].windowEl.show();
            return;
        }
        const app = new App(this);
        this.openApps[App.name] = app;
        document.body.appendChild(app.windowEl);
        app.windowEl.show();
        app.init?.();
        window.bus.push("appStateChanged");
    };

    isOpen = (appName) => !!this.openApps[appName];

    close = (appName) => {
        if (this.openApps[appName]) {
            document.body.removeChild(this.openApps[appName].windowEl);
            delete this.openApps[appName];
            window.bus.push("appStateChanged");
        }
    };

    minimize = (appName) => {
        this.openApps[appName].windowEl.close();
    };
}
