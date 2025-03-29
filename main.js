import { Bus } from "./system/bus.js";
import { Desktop } from "./system/desktop/desktop.js";

addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("system.theme") ?? "system";
    document.body.classList.add(`sf-theme-${theme}`);
    window.bus = new Bus();
    document.body.appendChild(Desktop());
});
