import { Desktop } from "./desktop.js";

export class WindowManager {
    constructor() {
        this.openApps = {};
        this.topZ = 2;
        this.focusedApp = null;
        document.body.appendChild(Desktop());

        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft" && event.altKey) {
                this.switch(-1);
                event.preventDefault();
            } else if (event.key === "ArrowRight" && event.altKey) {
                this.switch(1);
                event.preventDefault();
            }
        });
    }

    open = (App) => {
        if (this.openApps[App.name]) {
            this.openApps[App.name].windowEl.show();
            this.focus(App.name);
            return;
        }
        const app = new App(this);
        this.openApps[App.name] = app;
        document.body.appendChild(app.windowEl);
        app.windowEl.show();
        app.init?.();
        window.bus.push("appStateChanged");
        this.focus(App.name);
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

    focus = (appName) => {
        if (this.focusedApp !== appName && this.isOpen(appName)) {
            const app = this.openApps[appName].windowEl;
            app.style["z-index"] = this.topZ++;
            app.querySelector("button").focus();
            this.focusedApp = appName;
        }
    };

    switch = (by) => {
        const appArr = Object.keys(this.openApps);
        const currIdx = appArr.indexOf(this.focusedApp);
        this.focus(appArr[currIdx + by]);
    };
}
