import { Element } from "./element.js";
import { TitleBar, saveLocation } from "./title-bar.js";

const windows = [];

export const Window = (title, menuItems, ...children) => {
    if (windows.includes(title)) return null;

    // TODO: focus trap
    const close = () => {
        windows.splice(windows.indexOf("title"), 1);
        windowEl.parentElement.removeChild(windowEl);
    };
    windows.push(title);
    const windowEl = Element(
        "div",
        { class: "sf-window" },
        TitleBar(menuItems, title, close),
        Element("div", { class: "body" }, ...children)
    );
    let { top, left } = loadLocation(title);
    requestAnimationFrame(() => {
        top = Math.min(top, window.innerHeight - windowEl.clientHeight);
        left = Math.min(left, window.innerWidth - windowEl.clientWidth);
        windowEl.style.top = `${top}px`;
        windowEl.style.left = `${left}px`;
        saveLocation(title, top, left);
    });
    return windowEl;
};

const loadLocation = (title) => {
    const locationValue = localStorage.getItem(`window.${title}`);
    if (locationValue === null) {
        return {
            top: 100,
            left: 200,
        };
    }
    return JSON.parse(locationValue);
};
