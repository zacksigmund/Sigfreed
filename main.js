import { Bus } from "./system/bus.js";
import { WindowManager } from "./system/desktop/window-manager.js";

addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("system.theme") ?? "system";
    document.body.classList.add(`sf-theme-${theme}`);
    window.bus = new Bus();
    const windowManager = new WindowManager();
    windowManager.init();
});
