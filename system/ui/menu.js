import { Element } from "./element.js";
import { UnstyledButton } from "./unstyled-button.js";

export const Menu = (menuItems) => {
    let menuOpen = false;

    const items = Object.entries(menuItems).map(([name, callback]) =>
        Element("li", { role: "menuitem" }, UnstyledButton({}, callback, name))
    );

    const menu = Element("ul", { class: "sf-menu", role: "menu" }, ...items);

    const trapFocus = (event) => {
        if (event.key === "Tab") {
            if (!event.shiftKey && event.target === items[items.length - 1].children[0]) {
                items[0].children[0].focus();
                event.preventDefault();
            } else if (event.shiftKey && event.target === items[0].children[0]) {
                items[items.length - 1].children[0].focus();
                event.preventDefault();
            }
        } else if (event.key === "ArrowDown") {
            event.target.parentElement.nextElementSibling?.children?.[0]?.focus();
        } else if (event.key === "ArrowUp") {
            event.target.parentElement.previousElementSibling?.children?.[0]?.focus();
        } else if (event.key === "Escape") {
            offClick();
        }
    };

    menu.addEventListener("keydown", trapFocus);

    const offClick = () => {
        if (menuOpen) {
            menu.style.display = "none";
            document.body.removeEventListener("click", offClick);
            menuOpen = false;
        }
    };

    const toggleMenu = () => {
        if (!menuOpen) {
            menu.style.display = "flex";
            menuOpen = true;
            menu.firstElementChild.firstElementChild.focus();
            // was propagating to the offClick listener on the same frame otherwise
            requestAnimationFrame(() => {
                document.body.addEventListener("click", offClick);
            });
        }
    };

    return [menu, toggleMenu];
};
