import { Desktop } from "./system/desktop/desktop.js";

addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(Desktop());
    const theme = localStorage.getItem("system.theme") ?? "system";
    document.body.classList.add(`sf-theme-${theme}`);
});
