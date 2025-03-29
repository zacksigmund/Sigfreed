import { Desktop } from "./desktop.js";

export class WindowManager {
    constructor() {}

    init = () => {
        document.body.appendChild(Desktop(this));
    };

    launch = (App) => {
        new App();
    };
}
