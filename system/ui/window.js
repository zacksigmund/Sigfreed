import { Element } from "./element.js";
import { TitleBar, saveLocation } from "./title-bar.js";

export const Window = (title, menuItems, ...children) => {
    const windowEl = Element(
        "dialog",
        { class: "sf-window" },
        TitleBar(menuItems, title),
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
    windowEl.addEventListener("keydown", (event) => focusTrap(windowEl, event));
    return windowEl;
};

const focusTrap = (windowEl, event) => {
    let focusable = windowEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    let firstFocusableElement = focusable[0];
    let lastFocusableElement = focusable[focusable.length - 1];

    //When doing event handling this would be how to reset focus
    if (event.key == "Tab") {
        if (!event.shiftKey) {
            if (document.activeElement == lastFocusableElement) {
                firstFocusableElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement == firstFocusableElement) {
                lastFocusableElement.focus();
                event.preventDefault();
            }
        }
    }
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
