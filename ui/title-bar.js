import { Element } from "./element.js";

export const TitleBar = (menuItems, title, onClose) => {
    let moving = false;
    let menuOpen = false;
    const menuBtn = Element(
        "button",
        { class: "menu-button", ...(menuItems.length ? {} : { disabled: "disabled" }) },
        Element("div")
    );
    const dragger = Element("div", { class: "dragger" }, Element("div"));
    const closeBtn = Element("button", { class: "close-button", "aria-label": "Close window" });
    const menu = Element(
        "ul",
        { class: "menu", role: "menu" },
        ...Object.entries(menuItems).map(([name, callback]) => {
            const menuItem = Element("button", {}, name);
            menuItem.addEventListener("click", (e) => {
                callback();
            });
            return Element("li", { role: "menuitem" }, menuItem);
        })
    );
    const titlebar = Element(
        "div",
        { class: "sf-titlebar" },
        menuBtn,
        title,
        dragger,
        closeBtn,
        menu
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
    menuBtn.addEventListener("click", toggleMenu);
    dragger.addEventListener("mousedown", () => {
        moving = true;
        dragger.classList.add("dragging");
    });
    closeBtn.addEventListener("click", onClose);
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
