import { Element } from "./element.js";
import { UnstyledButton } from "./unstyled-button.js";

export const TitleBar = (menuItems, title, onClose) => {
    let moving = false;
    let menuOpen = false;
    const dragger = Element("div", { class: "dragger" }, Element("div"));
    // TODO: focus trap
    const menu = Element(
        "ul",
        { class: "menu", role: "menu" },
        ...Object.entries(menuItems).map(([name, callback]) =>
            Element("li", { role: "menuitem" }, UnstyledButton({}, callback, name))
        )
    );

    const toggleMenu = (e) => {
        if (!menuOpen) {
            menu.style.display = "flex";
            menuOpen = true;
            const offClick = () => {
                if (menuOpen) {
                    menu.style.display = "none";
                    document.body.removeEventListener("click", offClick);
                    menuOpen = false;
                }
            };
            // was propagating to the offClick listener on the same frame otherwise
            requestAnimationFrame(() => {
                document.body.addEventListener("click", offClick);
            });
        }
    };

    const titlebar = Element(
        "div",
        { class: "sf-titlebar" },
        UnstyledButton(
            {
                class: "menu-button",
                ...(Object.keys(menuItems).length ? {} : { disabled: "disabled" }),
            },
            toggleMenu,
            Element("div")
        ),
        title,
        dragger,
        UnstyledButton({ class: "close-button", "aria-label": "Close window" }, onClose),
        menu
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
