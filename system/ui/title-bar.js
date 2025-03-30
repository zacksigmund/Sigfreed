import { Element } from "./element.js";
import { Menu } from "./menu.js";
import { UnstyledButton } from "./unstyled-button.js";

export const TitleBar = (menuItems, title) => {
    let moving = false;
    let menuButton;
    const dragger = Element("div", { class: "dragger" }, Element("div"));

    for (const [key, value] of Object.entries(menuItems)) {
        menuItems[key] = () => {
            value();
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

    const titlebar = Element(
        "div",
        { class: "sf-titlebar" },
        menuButton,
        menu,
        title,
        dragger,
        UnstyledButton({ class: "minimize-button", "aria-label": "Minimize window" }, () =>
            window.windowManager.minimize(title)
        ),
        UnstyledButton({ class: "expand-button", "aria-label": "Expand window" }, () => {}),
        UnstyledButton({ class: "close-button", "aria-label": "Close window" }, () =>
            window.windowManager.close(title)
        )
    );

    // window movement
    dragger.addEventListener("mousedown", () => {
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
        saveLocation(title, windowEl.offsetTop, windowEl.offsetLeft);
    });

    return titlebar;
};

export const saveLocation = (title, top, left) => {
    localStorage.setItem(`window.${title}`, JSON.stringify({ top, left }));
};
