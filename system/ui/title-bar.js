import { Element } from "./element.js";
import { Menu } from "./menu.js";
import { UnstyledButton } from "./unstyled-button.js";

export const TitleBar = (menuItems, title, onClose) => {
    let moving = false;
    const dragger = Element("div", { class: "dragger" }, Element("div"));

    const [menu, toggleMenu] = Menu(menuItems);

    const titlebar = Element(
        "div",
        { class: "sf-titlebar" },
        UnstyledButton(
            {
                class: "menu-button",
                "aria-label": "App menu",
                "aria-haspopup": "menu",
                "aria-expanded": false,
            },
            toggleMenu,
            Element("div")
        ),
        menu,
        title,
        dragger,
        UnstyledButton({ class: "close-button", "aria-label": "Close window" }, onClose)
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
