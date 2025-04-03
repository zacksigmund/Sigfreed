import { Element } from "./element.js";
import { Menu } from "./menu.js";
import { UnstyledButton } from "./unstyled-button.js";

export const TitleBar = (menuItems, title, maximized) => {
    let moving = false;
    let menuButton;
    const dragger = Element("div", { class: "dragger" }, Element("div"));

    for (let i = 0; i < menuItems.length; i++) {
        const [_text, _hotkey, callback] = menuItems[i];
        menuItems[i][2] = () => {
            callback();
            menuButton.focus();
        };
    }

    const [menu, toggleMenu] = Menu(menuItems);
    menuButton = UnstyledButton(
        {
            class: "menu-button",
            "aria-label": "App menu",
            "aria-haspopup": "menu",
            "aria-expanded": false,
        },
        toggleMenu,
        Element("div")
    );

    const expandButton = UnstyledButton({ class: "expand-button", "aria-label": "Expand window" });

    const titlebar = Element(
        "div",
        { class: "sf-titlebar" },
        menuButton,
        menu,
        title,
        dragger,
        Element(
            "div",
            { class: "buttons" },
            UnstyledButton({ class: "minimize-button", "aria-label": "Minimize window" }, () =>
                window.windowManager.minimize(title)
            ),
            expandButton,
            UnstyledButton({ class: "close-button", "aria-label": "Close window" }, () =>
                window.windowManager.close(title)
            )
        )
    );

    expandButton.addEventListener("click", () => {
        maximized = !maximized;
        const windowEl = titlebar.parentElement;
        if (maximized) {
            windowEl.classList.add("maximized");
            windowEl.style.removeProperty("top");
            windowEl.style.removeProperty("left");
        } else {
            windowEl.classList.remove("maximized");
        }
        saveLocation(title, windowEl.offsetTop, windowEl.offsetLeft, maximized);
    });

    // window movement
    dragger.addEventListener("mousedown", () => {
        if (maximized) return;
        moving = true;
        dragger.classList.add("dragging");
    });
    window.addEventListener("mousemove", (event) => {
        if (!moving) return;
        const windowEl = titlebar.parentElement;

        windowEl.style.top = `${windowEl.offsetTop + event.movementY}px`;
        if (windowEl.offsetTop < 0) {
            windowEl.style.top = 0;
        } else if (windowEl.offsetTop + windowEl.clientHeight > window.innerHeight) {
            windowEl.style.top = `${window.innerHeight - windowEl.clientHeight}px`;
        }

        windowEl.style.left = `${windowEl.offsetLeft + event.movementX}px`;
        if (windowEl.offsetLeft < 0) {
            windowEl.style.left = 0;
        } else if (windowEl.offsetLeft + windowEl.clientWidth > window.innerWidth) {
            windowEl.style.left = `${window.innerWidth - windowEl.clientWidth}px`;
        }
    });
    window.addEventListener("mouseup", (event) => {
        if (!moving) return;
        const windowEl = titlebar.parentElement;
        windowEl.style.top = `${windowEl.offsetTop + event.movementY}px`;
        windowEl.style.left = `${windowEl.offsetLeft + event.movementX}px`;
        moving = false;
        dragger.classList.remove("dragging");
        saveLocation(title, windowEl.offsetTop, windowEl.offsetLeft, maximized);
    });

    return titlebar;
};

export const saveLocation = (title, top, left, maximized) => {
    localStorage.setItem(`window.${title}`, JSON.stringify({ top, left, maximized }));
};
